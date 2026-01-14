import { Stack, Typography, Button } from "@archway/valet";
import type { SceneObject, TransformMode } from "@/types";
import { ConfirmableNumberInput } from "../ConfirmableNumberInput";
import {
  AXES,
  TRANSFORM_MODES,
  axisLabelSx,
  fieldLabelSx,
  quickButtonSx,
  tinyLabelSx,
  toggleButtonSx,
  wrapRowSx,
} from "./styles";

interface TransformSectionProps {
  obj: SceneObject;
  primaryId: string;
  transformMode: TransformMode | null;
  setTransformMode: (mode: TransformMode | null) => void;
  updateObject: (id: string, update: Partial<SceneObject>) => void;
}

export function TransformSection({
  obj,
  primaryId,
  transformMode,
  setTransformMode,
  updateObject,
}: TransformSectionProps) {
  const handleModeClick = (mode: TransformMode) => {
    setTransformMode(transformMode === mode ? null : mode);
  };

  return (
    <>
      <Stack gap={0} sx={{ padding: "2px 4px 6px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Transform Mode
        </Typography>
        <Stack direction="row" gap={0} sx={{ padding: 0, ...wrapRowSx }}>
          {TRANSFORM_MODES.map((mode) => (
            <Button
              key={mode}
              size="sm"
              sx={{
                ...toggleButtonSx,
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

      {/* Transform Value Inputs - shows when a gizmo mode is active */}
      {transformMode && transformMode !== "rotate" && (
        <Stack gap={0} sx={{ padding: "4px 4px 6px 4px" }}>
          <Typography
            variant="body"
            sx={{
              ...fieldLabelSx,
              marginBottom: "2px",
            }}
          >
            {transformMode === "translate" ? "Position" : "Scale"}
          </Typography>
          <Stack direction="row" gap={1} sx={{ padding: 0 }}>
            {AXES.map((axis, index) => {
              const values =
                transformMode === "translate" ? obj.position : obj.scale;
              const propKey = transformMode === "translate" ? "position" : "scale";

              return (
                <Stack key={axis} gap={0} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body" sx={axisLabelSx}>
                    {axis}
                  </Typography>
                  <ConfirmableNumberInput
                    value={Math.round((values[index] ?? 0) * 1000) / 1000}
                    onChange={(val) => {
                      const newValues = [...values] as [number, number, number];
                      newValues[index] = val;
                      updateObject(primaryId, { [propKey]: newValues });
                    }}
                    step={0.1}
                    width="100%"
                  />
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      )}

      {/* Rotation Value Inputs - shows both degrees and radians */}
      {transformMode === "rotate" && (
        <Stack gap={0} sx={{ padding: "4px 4px 6px 4px" }}>
          <Typography
            variant="body"
            sx={{
              ...fieldLabelSx,
              marginBottom: "2px",
            }}
          >
            Rotation
          </Typography>
          {AXES.map((axis, index) => {
            const radValue = obj.rotation[index] ?? 0;
            const degValue = Math.round((radValue * 180) / Math.PI);

            const applyRadians = (delta: number) => {
              const newValues = [...obj.rotation] as [number, number, number];
              newValues[index] = radValue + delta;
              updateObject(primaryId, { rotation: newValues });
            };

            const quickButtons = [
              { label: "-90", delta: (-90 * Math.PI) / 180 },
              { label: "-45", delta: (-45 * Math.PI) / 180 },
              { label: "0", delta: -radValue }, // Reset to 0
              { label: "+45", delta: (45 * Math.PI) / 180 },
              { label: "+90", delta: (90 * Math.PI) / 180 },
            ];

            return (
              <Stack key={axis} gap={0} sx={{ marginBottom: "4px" }}>
                <Stack
                  direction="row"
                  gap={1}
                  sx={{ padding: "2px 0", alignItems: "center" }}
                >
                  <Typography
                    variant="body"
                    sx={{
                      ...tinyLabelSx,
                      width: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {axis}
                  </Typography>
                  <Stack gap={0} sx={{ flex: 1, minWidth: 0 }}>
                    {index === 0 && (
                      <Typography
                        variant="body"
                        sx={{
                          ...tinyLabelSx,
                          textAlign: "center",
                        }}
                      >
                        deg
                      </Typography>
                    )}
                    <ConfirmableNumberInput
                      value={degValue}
                      onChange={(val) => {
                        const newValues = [...obj.rotation] as [
                          number,
                          number,
                          number,
                        ];
                        newValues[index] = (val * Math.PI) / 180;
                        updateObject(primaryId, { rotation: newValues });
                      }}
                      step={1}
                      width="100%"
                    />
                  </Stack>
                  <Stack gap={0} sx={{ flex: 1, minWidth: 0 }}>
                    {index === 0 && (
                      <Typography
                        variant="body"
                        sx={{
                          ...tinyLabelSx,
                          textAlign: "center",
                        }}
                      >
                        rad
                      </Typography>
                    )}
                    <ConfirmableNumberInput
                      value={Math.round(radValue * 1000) / 1000}
                      onChange={(val) => {
                        const newValues = [...obj.rotation] as [
                          number,
                          number,
                          number,
                        ];
                        newValues[index] = val;
                        updateObject(primaryId, { rotation: newValues });
                      }}
                      step={0.01}
                      width="100%"
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  gap={0}
                  sx={{
                    paddingLeft: "12px",
                    justifyContent: "flex-start",
                    ...wrapRowSx,
                  }}
                >
                  {quickButtons.map((btn) => (
                    <Button
                      key={btn.label}
                      size="sm"
                      onClick={() => applyRadians(btn.delta)}
                      sx={{ ...quickButtonSx }}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
    </>
  );
}
