import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";
import type { SceneAnimationClip } from "@/types";

export interface AnimationState {
  // Source data (from scene JSON)
  clips: SceneAnimationClip[];

  // Compiled Three.js data (set by viewport after compilation)
  compiledClips: THREE.AnimationClip[];
  mixer: THREE.AnimationMixer | null;
  activeAction: THREE.AnimationAction | null;

  // Playback state
  activeClipIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loop: boolean;

  // Actions
  setClips: (clips: SceneAnimationClip[]) => void;
  clearClips: () => void;
  setMixer: (
    mixer: THREE.AnimationMixer,
    compiledClips: THREE.AnimationClip[],
  ) => void;
  clearMixer: () => void;
  selectClip: (index: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setLoop: (loop: boolean) => void;
  tick: (delta: number) => void;
}

export const useAnimationStore = create<AnimationState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    clips: [],
    compiledClips: [],
    mixer: null,
    activeAction: null,
    activeClipIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    loop: true,

    setClips: (clips) => {
      set({
        clips,
        activeClipIndex: 0,
        currentTime: 0,
        isPlaying: false,
      });
    },

    clearClips: () => {
      const { mixer, activeAction } = get();
      if (activeAction) {
        activeAction.stop();
      }
      if (mixer) {
        mixer.stopAllAction();
      }
      set({
        clips: [],
        compiledClips: [],
        mixer: null,
        activeAction: null,
        activeClipIndex: 0,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      });
    },

    setMixer: (mixer, compiledClips) => {
      const { activeClipIndex, loop } = get();

      // Get the active clip
      const activeClip = compiledClips[activeClipIndex];
      let activeAction: THREE.AnimationAction | null = null;
      let duration = 0;

      if (activeClip) {
        activeAction = mixer.clipAction(activeClip);
        activeAction.setLoop(
          loop ? THREE.LoopRepeat : THREE.LoopOnce,
          Infinity,
        );
        activeAction.clampWhenFinished = !loop;
        duration = activeClip.duration;
      }

      set({
        mixer,
        compiledClips,
        activeAction,
        duration,
        currentTime: 0,
      });
    },

    clearMixer: () => {
      const { activeAction, mixer } = get();
      if (activeAction) {
        activeAction.stop();
      }
      if (mixer) {
        mixer.stopAllAction();
      }
      set({
        mixer: null,
        compiledClips: [],
        activeAction: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      });
    },

    selectClip: (index) => {
      const { compiledClips, mixer, activeAction, loop, isPlaying } = get();
      if (!mixer || index < 0 || index >= compiledClips.length) return;

      // Stop current action
      if (activeAction) {
        activeAction.stop();
      }

      // Create new action
      const newClip = compiledClips[index];
      if (!newClip) return;

      const newAction = mixer.clipAction(newClip);
      newAction.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      newAction.clampWhenFinished = !loop;
      newAction.reset();

      if (isPlaying) {
        newAction.play();
      }

      set({
        activeClipIndex: index,
        activeAction: newAction,
        duration: newClip.duration,
        currentTime: 0,
      });
    },

    play: () => {
      const { activeAction, mixer } = get();
      if (!activeAction || !mixer) return;

      // Debug: log action state
      console.log("[AnimationStore] Playing action:", {
        clip: activeAction.getClip().name,
        enabled: activeAction.enabled,
        weight: activeAction.getEffectiveWeight(),
        timeScale: activeAction.getEffectiveTimeScale(),
      });

      // Debug: log mixer root and its children
      const root = mixer.getRoot();
      if ("traverse" in root && typeof root.traverse === "function") {
        const obj3d = root as THREE.Object3D;
        console.log(
          "[AnimationStore] Mixer root:",
          obj3d.type,
          obj3d.uuid?.slice(0, 8),
        );
        console.log("[AnimationStore] Objects in mixer root:");
        obj3d.traverse((child) => {
          if (child.name) {
            console.log(`  - "${child.name}" (${child.type})`);
          }
        });
      } else {
        console.log(
          "[AnimationStore] Mixer root is AnimationObjectGroup, not Object3D",
        );
      }

      activeAction.paused = false;
      activeAction.play();
      set({ isPlaying: true });
    },

    pause: () => {
      const { activeAction } = get();
      if (!activeAction) return;

      activeAction.paused = true;
      set({ isPlaying: false });
    },

    stop: () => {
      const { activeAction, mixer } = get();
      if (!activeAction || !mixer) return;

      activeAction.stop();
      activeAction.reset();
      mixer.setTime(0);
      set({
        isPlaying: false,
        currentTime: 0,
      });
    },

    seek: (time) => {
      const { mixer, activeAction, duration } = get();
      if (!mixer || !activeAction) return;

      const clampedTime = Math.max(0, Math.min(time, duration));
      mixer.setTime(clampedTime);
      set({ currentTime: clampedTime });
    },

    setLoop: (loop) => {
      const { activeAction } = get();
      if (activeAction) {
        activeAction.setLoop(
          loop ? THREE.LoopRepeat : THREE.LoopOnce,
          Infinity,
        );
        activeAction.clampWhenFinished = !loop;
      }
      set({ loop });
    },

    tick: (delta) => {
      const { mixer, isPlaying, duration, loop } = get();
      if (!mixer || !isPlaying) return;

      mixer.update(delta);

      // Get current time from mixer
      const currentTime = mixer.time % duration;
      set({ currentTime: loop ? currentTime : Math.min(mixer.time, duration) });
    },
  })),
);

// Selector hooks for common subscriptions
export const useAnimationClips = () =>
  useAnimationStore((state) => state.clips);
export const useAnimationIsPlaying = () =>
  useAnimationStore((state) => state.isPlaying);
export const useAnimationCurrentTime = () =>
  useAnimationStore((state) => state.currentTime);
export const useAnimationDuration = () =>
  useAnimationStore((state) => state.duration);
export const useAnimationLoop = () => useAnimationStore((state) => state.loop);
export const useAnimationActiveClipIndex = () =>
  useAnimationStore((state) => state.activeClipIndex);
export const useHasAnimations = () =>
  useAnimationStore((state) => state.clips.length > 0);
