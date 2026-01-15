import { useState } from "react";
import { Stack, Typography, IconButton, Box, Button } from "@archway/valet";
import {
  useAnimationStore,
  useAnimationClips,
  useAnimationIsPlaying,
  useAnimationCurrentTime,
  useAnimationDuration,
  useAnimationLoop,
  useAnimationActiveClipIndex,
  useHasAnimations,
} from "@/store/animationStore";

/**
 * Formats a time in seconds to MM:SS.ms format
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(1).padStart(4, "0")}`;
}

/**
 * Modal for selecting animation clips
 */
interface AnimationSelectorModalProps {
  open: boolean;
  onClose: () => void;
  clips: { name: string }[];
  activeClipIndex: number;
  onSelectClip: (index: number) => void;
}

function AnimationSelectorModal({
  open,
  onClose,
  clips,
  activeClipIndex,
  onSelectClip,
}: AnimationSelectorModalProps) {
  if (!open) return null;

  const handleSelect = (index: number) => {
    onSelectClip(index);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "rgba(26, 26, 46, 0.98)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          minWidth: "280px",
          maxWidth: "400px",
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Typography
          variant="h3"
          sx={{ marginBottom: "16px", fontSize: "16px", textAlign: "center" }}
        >
          Select Animation
        </Typography>

        <Stack gap={1}>
          {clips.map((clip, index) => (
            <Button
              key={clip.name}
              size="md"
              variant={index === activeClipIndex ? "filled" : "outlined"}
              onClick={() => handleSelect(index)}
              sx={{
                width: "100%",
                justifyContent: "center",
                backgroundColor:
                  index === activeClipIndex
                    ? "rgba(75, 208, 210, 0.3)"
                    : "transparent",
                borderColor:
                  index === activeClipIndex
                    ? "rgba(75, 208, 210, 0.6)"
                    : "rgba(255, 255, 255, 0.2)",
              }}
            >
              {clip.name}
            </Button>
          ))}
        </Stack>

        <Stack
          direction="row"
          gap={1}
          sx={{ marginTop: "16px", justifyContent: "center" }}
        >
          <Button size="sm" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

/**
 * AnimationControls provides playback UI for scene animations.
 * Only visible when the scene has animation clips.
 */
export function AnimationControls() {
  const [modalOpen, setModalOpen] = useState(false);
  const hasAnimations = useHasAnimations();
  const clips = useAnimationClips();
  const isPlaying = useAnimationIsPlaying();
  const currentTime = useAnimationCurrentTime();
  const duration = useAnimationDuration();
  const loop = useAnimationLoop();
  const activeClipIndex = useAnimationActiveClipIndex();

  const play = useAnimationStore((state) => state.play);
  const pause = useAnimationStore((state) => state.pause);
  const stop = useAnimationStore((state) => state.stop);
  const seek = useAnimationStore((state) => state.seek);
  const setLoop = useAnimationStore((state) => state.setLoop);
  const selectClip = useAnimationStore((state) => state.selectClip);

  // Don't render if no animations
  if (!hasAnimations) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const activeClipName = clips[activeClipIndex]?.name ?? "Select";

  return (
    <>
      <AnimationSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        clips={clips}
        activeClipIndex={activeClipIndex}
        onSelectClip={selectClip}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(26, 26, 46, 0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          padding: "8px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "400px",
          maxWidth: "600px",
          zIndex: 100,
        }}
      >
        {/* Top row: Controls */}
        <Stack direction="row" gap={2} sx={{ alignItems: "center" }}>
          {/* Clip selector button (if multiple clips) */}
          {clips.length > 1 && (
            <Button
              size="sm"
              variant="outlined"
              onClick={() => setModalOpen(true)}
              sx={{
                minWidth: "140px",
                justifyContent: "center",
              }}
            >
              {activeClipName}
            </Button>
          )}

          {/* Single clip name display */}
          {clips.length === 1 && clips[0] && (
            <Typography
              variant="body"
              sx={{ fontWeight: 500, minWidth: "80px" }}
            >
              {clips[0].name}
            </Typography>
          )}

          {/* Stop button */}
          <IconButton
            variant="outlined"
            size="sm"
            icon="mdi:stop"
            onClick={stop}
            aria-label="Stop"
          />

          {/* Play/Pause button */}
          <IconButton
            variant="filled"
            size="sm"
            icon={isPlaying ? "mdi:pause" : "mdi:play"}
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          />

          {/* Time display */}
          <Typography
            variant="body"
            sx={{
              fontFamily: "monospace",
              fontSize: "13px",
              minWidth: "100px",
              textAlign: "right",
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>

          {/* Loop toggle */}
          <IconButton
            variant={loop ? "filled" : "outlined"}
            size="sm"
            icon="mdi:repeat"
            onClick={() => setLoop(!loop)}
            aria-label={loop ? "Loop On" : "Loop Off"}
          />
        </Stack>

        {/* Bottom row: Timeline scrubber */}
        <Box sx={{ width: "100%", padding: "0 4px" }}>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: "100%",
              height: "4px",
              appearance: "none",
              background: `linear-gradient(to right, #00ffd5 0%, #00ffd5 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) 100%)`,
              borderRadius: "2px",
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
    </>
  );
}
