import { Panel, Stack, Typography, Button, Box } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import type { TransformMode } from "@/types";
import { HexColorSchema } from "@/schemas/scene";

export function PropertyPanel() {
  const primaryId = useSceneStore((state) => state.selection.primaryId);
  const obj = useSceneStore((state) =>
    primaryId ? state.objects[primaryId] : null,
  );
  const updateObject = useSceneStore((state) => state.updateObject);
  const transformMode = useSceneStore((state) => state.transformMode);
  const setTransformMode = useSceneStore((state) => state.setTransformMode);
  const beginTransaction = useSceneStore((state) => state.beginTransaction);
  const commitTransaction = useSceneStore((state) => state.commitTransaction);

  const modes: TransformMode[] = ["translate", "rotate", "scale"];

  const handleModeClick = (mode: TransformMode) => {
    // Toggle off if clicking the same mode
    setTransformMode(transformMode === mode ? null : mode);
  };

  if (!obj || !primaryId) {
    return (
      <Panel sx={{ padding: 0, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Typography
          variant="body"
          sx={{
            opacity: 0.5,
            fontStyle: "italic",
            fontSize: "11px",
            lineHeight: 1.2,
            padding: "2px 4px",
          }}
        >
          No object selected
        </Typography>
      </Panel>
    );
  }

  const isGroup = obj.type === "group";

  return (
    <Panel
      sx={{
        padding: 0,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Stack gap={0} sx={{ padding: 0 }}>
        <Typography
          variant="subtitle"
          sx={{
            padding: "2px 4px",
            fontSize: "11px",
            lineHeight: 1.2,
            opacity: 0.8,
            userSelect: "none",
          }}
        >
          Properties
        </Typography>

        <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
          <Typography variant="body" sx={{ fontSize: "12px", opacity: 0.7 }}>
            Transform Mode
          </Typography>
          <Stack direction="row" gap={0} sx={{ padding: 0 }}>
            {modes.map((mode) => (
              <Button
                key={mode}
                size="sm"
                sx={{
                  padding: "0 4px",
                  minHeight: "16px",
                  fontSize: "11px",
                  lineHeight: "16px",
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
            <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
              <Typography
                variant="body"
                sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
              >
                Color
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <input
                  type="color"
                  value={obj.material.color}
                  onChange={(e) => {
                    const result = HexColorSchema.safeParse(e.target.value);
                    if (!result.success) return;
                    updateObject(primaryId, {
                      material: { ...obj.material, color: result.data },
                    });
                  }}
                  style={{
                    width: "16px",
                    height: "16px",
                    padding: 0,
                    margin: 0,
                    border: "none",
                    borderRadius: "2px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                />
                <Typography variant="body" sx={{ fontSize: "11px" }}>
                  {obj.material.color}
                </Typography>
              </Box>
            </Stack>

            <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
              <Typography
                variant="body"
                sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
              >
                Metalness: {obj.material.metalness.toFixed(2)}
              </Typography>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={obj.material.metalness}
                onMouseDown={beginTransaction}
                onMouseUp={commitTransaction}
                onChange={(e) =>
                  updateObject(primaryId, {
                    material: {
                      ...obj.material,
                      metalness: parseFloat(e.target.value),
                    },
                  })
                }
                style={{ width: "100%", height: "12px", margin: 0, padding: 0 }}
              />
            </Stack>

            <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
              <Typography
                variant="body"
                sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
              >
                Roughness: {obj.material.roughness.toFixed(2)}
              </Typography>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={obj.material.roughness}
                onMouseDown={beginTransaction}
                onMouseUp={commitTransaction}
                onChange={(e) =>
                  updateObject(primaryId, {
                    material: {
                      ...obj.material,
                      roughness: parseFloat(e.target.value),
                    },
                  })
                }
                style={{ width: "100%", height: "12px", margin: 0, padding: 0 }}
              />
            </Stack>
          </>
        )}
      </Stack>
    </Panel>
  );
}
