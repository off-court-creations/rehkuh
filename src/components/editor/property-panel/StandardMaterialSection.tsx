import {
  Stack,
  Typography,
  Box,
  Slider,
  Checkbox,
  Select,
} from "@archway/valet";
import type { SceneObject, StandardMaterialProps } from "@/types";
import { HexColorSchema } from "@/schemas/scene";
import {
  fieldLabelSx,
  sectionHeaderSx,
  sliderPrecisionFromStep,
} from "./styles";

interface StandardMaterialSectionProps {
  material: StandardMaterialProps;
  primaryId: string;
  updateObject: (id: string, update: Partial<SceneObject>) => void;
  beginTransaction: () => void;
  commitTransaction: () => void;
}

export function StandardMaterialSection({
  material,
  primaryId,
  updateObject,
  beginTransaction,
  commitTransaction,
}: StandardMaterialSectionProps) {
  const updateStandardProp = (
    prop: keyof StandardMaterialProps,
    value: StandardMaterialProps[keyof StandardMaterialProps],
  ) => {
    updateObject(primaryId, {
      material: { ...material, type: "standard", [prop]: value },
    });
  };

  const sliderPrecision = sliderPrecisionFromStep(0.01);

  return (
    <>
      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Color
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <input
            type="color"
            value={material.color}
            onChange={(e) => {
              const result = HexColorSchema.safeParse(e.target.value);
              if (!result.success) return;
              updateStandardProp("color", result.data);
            }}
            style={{
              width: "14px",
              height: "14px",
              padding: 0,
              margin: 0,
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              backgroundColor: "transparent",
            }}
          />
          <Typography variant="body" sx={{ fontSize: "11px" }}>
            {material.color}
          </Typography>
        </Box>
      </Stack>

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Metalness: {material.metalness.toFixed(2)}
        </Typography>
        <Box fullWidth>
          <Slider
            size="xs"
            min={0}
            max={1}
            step={0.01}
            precision={sliderPrecision}
            value={material.metalness}
            onPointerDown={beginTransaction}
            onValueChange={(value) => updateStandardProp("metalness", value)}
            onValueCommit={(value) => {
              updateStandardProp("metalness", value);
              commitTransaction();
            }}
            fullWidth
          />
        </Box>
      </Stack>

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Roughness: {material.roughness.toFixed(2)}
        </Typography>
        <Box fullWidth>
          <Slider
            size="xs"
            min={0}
            max={1}
            step={0.01}
            precision={sliderPrecision}
            value={material.roughness}
            onPointerDown={beginTransaction}
            onValueChange={(value) => updateStandardProp("roughness", value)}
            onValueCommit={(value) => {
              updateStandardProp("roughness", value);
              commitTransaction();
            }}
            fullWidth
          />
        </Box>
      </Stack>

      <Typography variant="body" sx={sectionHeaderSx}>
        Emissive
      </Typography>

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Emissive Color
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <input
            type="color"
            value={material.emissive ?? "#000000"}
            onChange={(e) => {
              const result = HexColorSchema.safeParse(e.target.value);
              if (!result.success) return;
              updateStandardProp("emissive", result.data);
            }}
            style={{
              width: "14px",
              height: "14px",
              padding: 0,
              margin: 0,
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              backgroundColor: "transparent",
            }}
          />
          <Typography variant="body" sx={{ fontSize: "11px" }}>
            {material.emissive ?? "#000000"}
          </Typography>
        </Box>
      </Stack>

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Emissive Intensity: {(material.emissiveIntensity ?? 0).toFixed(2)}
        </Typography>
        <Box fullWidth>
          <Slider
            size="xs"
            min={0}
            max={1}
            step={0.01}
            precision={sliderPrecision}
            value={material.emissiveIntensity ?? 0}
            onPointerDown={beginTransaction}
            onValueChange={(value) =>
              updateStandardProp("emissiveIntensity", value)
            }
            onValueCommit={(value) => {
              updateStandardProp("emissiveIntensity", value);
              commitTransaction();
            }}
            fullWidth
          />
        </Box>
      </Stack>

      <Typography variant="body" sx={sectionHeaderSx}>
        Transparency
      </Typography>

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Opacity: {(material.opacity ?? 1).toFixed(2)}
        </Typography>
        <Box fullWidth>
          <Slider
            size="xs"
            min={0}
            max={1}
            step={0.01}
            precision={sliderPrecision}
            value={material.opacity ?? 1}
            onPointerDown={beginTransaction}
            onValueChange={(value) => updateStandardProp("opacity", value)}
            onValueCommit={(value) => {
              updateStandardProp("opacity", value);
              commitTransaction();
            }}
            fullWidth
          />
        </Box>
      </Stack>

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Checkbox
          size="xs"
          checked={material.transparent ?? false}
          onValueChange={(value) => updateStandardProp("transparent", value)}
          label={
            <Typography variant="body" sx={fieldLabelSx}>
              Transparent
            </Typography>
          }
        />
      </Stack>

      <Typography variant="body" sx={sectionHeaderSx}>
        Rendering
      </Typography>

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Side
        </Typography>
        <Select
          size="xs"
          value={material.side ?? "front"}
          onValueChange={(value) =>
            updateStandardProp("side", value as "front" | "back" | "double")
          }
          fullWidth
        >
          <Select.Option value="front">Front</Select.Option>
          <Select.Option value="back">Back</Select.Option>
          <Select.Option value="double">Double</Select.Option>
        </Select>
      </Stack>
    </>
  );
}
