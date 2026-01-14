import { Stack, Typography, Box, Slider, Checkbox } from "@archway/valet";
import type { PhysicalMaterialProps, SceneObject } from "@/types";
import { HexColorSchema } from "@/schemas/scene";
import {
  compactLabelSx,
  sectionHeaderSx,
  sliderPrecisionFromStep,
} from "./styles";

interface PhysicalMaterialSectionProps {
  material: PhysicalMaterialProps;
  primaryId: string;
  updateObject: (id: string, update: Partial<SceneObject>) => void;
  beginTransaction: () => void;
  commitTransaction: () => void;
}

export function PhysicalMaterialSection({
  material,
  primaryId,
  updateObject,
  beginTransaction,
  commitTransaction,
}: PhysicalMaterialSectionProps) {
  const updatePhysicalProp = (
    prop: keyof PhysicalMaterialProps,
    value: PhysicalMaterialProps[keyof PhysicalMaterialProps],
  ) => {
    updateObject(primaryId, {
      material: { ...material, [prop]: value },
    });
  };

  const MaterialSlider = ({
    label,
    prop,
    min = 0,
    max = 1,
    step = 0.01,
  }: {
    label: string;
    prop: keyof PhysicalMaterialProps;
    min?: number;
    max?: number;
    step?: number;
  }) => {
    const val = (material[prop] as number) ?? 0;
    const precision = sliderPrecisionFromStep(step);
    const displayPrecision = Math.max(precision, 2);
    return (
      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={compactLabelSx}>
          {label}: {val.toFixed(displayPrecision)}
        </Typography>
        <Box fullWidth>
          <Slider
            size="xs"
            min={min}
            max={max}
            step={step}
            precision={precision}
            value={val}
            onPointerDown={beginTransaction}
            onValueChange={(value) => updatePhysicalProp(prop, value)}
            onValueCommit={(value) => {
              updatePhysicalProp(prop, value);
              commitTransaction();
            }}
            fullWidth
          />
        </Box>
      </Stack>
    );
  };

  const ColorPicker = ({
    label,
    prop,
  }: {
    label: string;
    prop: keyof PhysicalMaterialProps;
  }) => {
    const val = (material[prop] as string) ?? "#ffffff";
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "0 4px 2px 4px",
        }}
      >
        <input
          type="color"
          value={val}
          onChange={(e) => {
            const result = HexColorSchema.safeParse(e.target.value);
            if (result.success) updatePhysicalProp(prop, result.data);
          }}
          style={{
            width: "14px",
            height: "14px",
            padding: 0,
            margin: 0,
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        />
        <Typography variant="body" sx={compactLabelSx}>
          {label}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={compactLabelSx}>
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
              if (result.success) updatePhysicalProp("color", result.data);
            }}
            style={{
              width: "14px",
              height: "14px",
              padding: 0,
              margin: 0,
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          />
          <Typography variant="body" sx={{ fontSize: "11px" }}>
            {material.color}
          </Typography>
        </Box>
      </Stack>
      <MaterialSlider label="Metalness" prop="metalness" />
      <MaterialSlider label="Roughness" prop="roughness" />

      <Typography variant="body" sx={sectionHeaderSx}>
        Clearcoat
      </Typography>
      <MaterialSlider label="Clearcoat" prop="clearcoat" />
      <MaterialSlider label="Clearcoat Roughness" prop="clearcoatRoughness" />

      <Typography variant="body" sx={sectionHeaderSx}>
        Sheen
      </Typography>
      <MaterialSlider label="Sheen" prop="sheen" />
      <MaterialSlider label="Sheen Roughness" prop="sheenRoughness" />
      <ColorPicker label="Sheen Color" prop="sheenColor" />

      <Typography variant="body" sx={sectionHeaderSx}>
        Transmission
      </Typography>
      <MaterialSlider label="Transmission" prop="transmission" />
      <MaterialSlider label="Thickness" prop="thickness" min={0} max={10} step={0.1} />
      <ColorPicker label="Attenuation Color" prop="attenuationColor" />
      <MaterialSlider
        label="Attenuation Dist"
        prop="attenuationDistance"
        min={0}
        max={100}
        step={1}
      />

      <Typography variant="body" sx={sectionHeaderSx}>
        IOR
      </Typography>
      <MaterialSlider label="IOR" prop="ior" min={1} max={2.333} step={0.01} />

      <Typography variant="body" sx={sectionHeaderSx}>
        Specular
      </Typography>
      <MaterialSlider label="Specular Intensity" prop="specularIntensity" />
      <ColorPicker label="Specular Color" prop="specularColor" />
      <MaterialSlider label="Reflectivity" prop="reflectivity" />

      <Typography variant="body" sx={sectionHeaderSx}>
        Iridescence
      </Typography>
      <MaterialSlider label="Iridescence" prop="iridescence" />
      <MaterialSlider
        label="Iridescence IOR"
        prop="iridescenceIOR"
        min={1}
        max={2.333}
        step={0.01}
      />

      <Typography variant="body" sx={sectionHeaderSx}>
        Anisotropy
      </Typography>
      <MaterialSlider label="Anisotropy" prop="anisotropy" />
      <MaterialSlider
        label="Anisotropy Rotation"
        prop="anisotropyRotation"
        min={0}
        max={6.283}
        step={0.01}
      />

      <Typography variant="body" sx={sectionHeaderSx}>
        Dispersion
      </Typography>
      <MaterialSlider label="Dispersion" prop="dispersion" min={0} max={1} step={0.01} />

      <Typography variant="body" sx={sectionHeaderSx}>
        Other
      </Typography>
      <MaterialSlider label="Env Map Intensity" prop="envMapIntensity" min={0} max={5} step={0.1} />
      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Checkbox
          size="xs"
          checked={material.flatShading ?? false}
          onValueChange={(value) => updatePhysicalProp("flatShading", value)}
          label={
            <Typography variant="body" sx={compactLabelSx}>
              Flat Shading
            </Typography>
          }
        />
      </Stack>
    </>
  );
}
