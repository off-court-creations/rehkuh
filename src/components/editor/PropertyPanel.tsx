import { Panel, Stack, Typography, Button, Box } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import type { TransformMode } from "@/types";

export function PropertyPanel() {
  const primaryId = useSceneStore((state) => state.selection.primaryId);
  const obj = useSceneStore((state) =>
    primaryId ? state.objects[primaryId] : null,
  );
  const updateObject = useSceneStore((state) => state.updateObject);
  const transformMode = useSceneStore((state) => state.transformMode);
  const setTransformMode = useSceneStore((state) => state.setTransformMode);

  const modes: TransformMode[] = ["translate", "rotate", "scale"];

  const handleModeClick = (mode: TransformMode) => {
    // Toggle off if clicking the same mode
    setTransformMode(transformMode === mode ? null : mode);
  };

  if (!obj || !primaryId) {
    return (
      <Panel sx={{ height: "200px", padding: "12px" }}>
        <Typography variant="body" sx={{ opacity: 0.5, fontStyle: "italic" }}>
          No object selected
        </Typography>
      </Panel>
    );
  }

  const isGroup = obj.type === "group";

  return (
    <Panel
      sx={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      <Stack gap={3}>
        <Typography variant="subtitle">Properties</Typography>

        <Stack gap={1}>
          <Typography variant="body" sx={{ fontSize: "12px", opacity: 0.7 }}>
            Transform Mode
          </Typography>
          <Stack direction="row" gap={1}>
            {modes.map((mode) => (
              <Button
                key={mode}
                size="sm"
                sx={{
                  backgroundColor:
                    transformMode === mode
                      ? "rgba(75, 208, 210, 0.3)"
                      : "transparent",
                }}
                onClick={() => handleModeClick(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </Stack>
        </Stack>

        {!isGroup && (
          <>
            <Stack gap={1}>
              <Typography
                variant="body"
                sx={{ fontSize: "12px", opacity: 0.7 }}
              >
                Color
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="color"
                  value={obj.material.color}
                  onChange={(e) =>
                    updateObject(primaryId, {
                      material: { ...obj.material, color: e.target.value },
                    })
                  }
                  style={{
                    width: "40px",
                    height: "30px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                />
                <Typography variant="body" sx={{ fontSize: "13px" }}>
                  {obj.material.color}
                </Typography>
              </Box>
            </Stack>

            <Stack gap={1}>
              <Typography
                variant="body"
                sx={{ fontSize: "12px", opacity: 0.7 }}
              >
                Metalness: {obj.material.metalness.toFixed(2)}
              </Typography>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={obj.material.metalness}
                onChange={(e) =>
                  updateObject(primaryId, {
                    material: {
                      ...obj.material,
                      metalness: parseFloat(e.target.value),
                    },
                  })
                }
                style={{ width: "100%" }}
              />
            </Stack>

            <Stack gap={1}>
              <Typography
                variant="body"
                sx={{ fontSize: "12px", opacity: 0.7 }}
              >
                Roughness: {obj.material.roughness.toFixed(2)}
              </Typography>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={obj.material.roughness}
                onChange={(e) =>
                  updateObject(primaryId, {
                    material: {
                      ...obj.material,
                      roughness: parseFloat(e.target.value),
                    },
                  })
                }
                style={{ width: "100%" }}
              />
            </Stack>
          </>
        )}
      </Stack>
    </Panel>
  );
}
