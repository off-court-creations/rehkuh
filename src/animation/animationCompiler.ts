import * as THREE from "three";
import type {
  SceneAnimationClip,
  SceneAnimationTrack,
  AnimationPath,
  AnimationInterpolation,
} from "@/types";

/**
 * Maps TSP/Scene interpolation modes to Three.js interpolation constants.
 */
function getInterpolation(
  interpolation: AnimationInterpolation,
): THREE.InterpolationModes {
  switch (interpolation) {
    case "linear":
      return THREE.InterpolateLinear;
    case "smooth":
      return THREE.InterpolateSmooth;
    case "discrete":
      return THREE.InterpolateDiscrete;
    default:
      return THREE.InterpolateLinear;
  }
}

/**
 * Creates a track name for Three.js PropertyBinding.
 * Format: "objectName.property"
 *
 * For rehkuh, objects are named "tsp_{objectName}" to ensure uniqueness.
 * Note: We use underscore, not colon, because Three.js PropertyBinding
 * regex only allows word characters (\w) and hyphens in node names.
 */
function createTrackName(objectName: string, path: AnimationPath): string {
  return `tsp_${objectName}.${path}`;
}

/**
 * Creates a Three.js KeyframeTrack from a scene animation track.
 */
function createKeyframeTrack(
  track: SceneAnimationTrack,
): THREE.KeyframeTrack | null {
  const trackName = createTrackName(track.target, track.path);
  const times = new Float32Array(track.times);
  const interpolation = getInterpolation(track.interpolation);

  switch (track.path) {
    case "position":
    case "scale": {
      // VectorKeyframeTrack for vec3 properties
      const values = new Float32Array(track.values as number[]);
      return new THREE.VectorKeyframeTrack(
        trackName,
        times,
        values,
        interpolation,
      );
    }

    case "quaternion": {
      // QuaternionKeyframeTrack for rotation
      // Ensure quaternions are normalized
      const rawValues = track.values as number[];
      const normalizedValues = new Float32Array(rawValues.length);

      for (let i = 0; i < rawValues.length; i += 4) {
        const x = rawValues[i] ?? 0;
        const y = rawValues[i + 1] ?? 0;
        const z = rawValues[i + 2] ?? 0;
        const w = rawValues[i + 3] ?? 1;

        // Normalize
        const len = Math.sqrt(x * x + y * y + z * z + w * w);
        if (len > 0) {
          normalizedValues[i] = x / len;
          normalizedValues[i + 1] = y / len;
          normalizedValues[i + 2] = z / len;
          normalizedValues[i + 3] = w / len;
        } else {
          // Default to identity quaternion
          normalizedValues[i] = 0;
          normalizedValues[i + 1] = 0;
          normalizedValues[i + 2] = 0;
          normalizedValues[i + 3] = 1;
        }
      }

      return new THREE.QuaternionKeyframeTrack(
        trackName,
        times,
        normalizedValues,
        interpolation,
      );
    }

    case "visible": {
      // BooleanKeyframeTrack for visibility
      const boolValues = track.values as boolean[];
      return new THREE.BooleanKeyframeTrack(trackName, times, boolValues);
    }

    default:
      console.warn(`Unknown animation path: ${track.path}`);
      return null;
  }
}

/**
 * Compiles a scene animation clip to a Three.js AnimationClip.
 */
export function compileAnimationClip(
  clip: SceneAnimationClip,
): THREE.AnimationClip {
  const tracks: THREE.KeyframeTrack[] = [];

  for (const track of clip.tracks) {
    const keyframeTrack = createKeyframeTrack(track);
    if (keyframeTrack) {
      tracks.push(keyframeTrack);
    }
  }

  // Calculate duration from tracks if not specified
  let duration = clip.duration;
  if (duration === undefined || duration <= 0) {
    duration = 0;
    for (const track of tracks) {
      const trackDuration = track.times[track.times.length - 1] ?? 0;
      if (trackDuration > duration) {
        duration = trackDuration;
      }
    }
  }

  return new THREE.AnimationClip(clip.name, duration, tracks);
}

/**
 * Compiles all animation clips from scene format to Three.js AnimationClips.
 */
export function compileAnimations(
  clips: SceneAnimationClip[],
): THREE.AnimationClip[] {
  return clips.map(compileAnimationClip);
}

/**
 * Helper to get object names referenced by animation tracks.
 * Useful for validation and debugging.
 */
export function getAnimationTargets(clips: SceneAnimationClip[]): Set<string> {
  const targets = new Set<string>();
  for (const clip of clips) {
    for (const track of clip.tracks) {
      targets.add(track.target);
    }
  }
  return targets;
}
