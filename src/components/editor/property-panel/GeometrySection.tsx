import { Stack, Typography, Checkbox } from "@archway/valet";
import type { SceneObject } from "@/types";
import { ConfirmableNumberInput } from "../ConfirmableNumberInput";
import { fieldLabelSx, sectionHeaderSx } from "./styles";

interface GeometrySectionProps {
  obj: SceneObject;
  primaryId: string;
  updateObject: (id: string, update: Partial<SceneObject>) => void;
}

const dividerStyle = {
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  marginTop: "6px",
};

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: NumberFieldProps) {
  const maybeBoundsProps = {
    ...(min !== undefined ? { min } : {}),
    ...(max !== undefined ? { max } : {}),
    ...(step !== undefined ? { step } : {}),
  };

  return (
    <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
      <Typography variant="body" sx={fieldLabelSx}>
        {label}
      </Typography>
      <ConfirmableNumberInput
        value={value}
        onChange={onChange}
        {...maybeBoundsProps}
      />
    </Stack>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
      <Checkbox
        size="xs"
        checked={checked}
        onValueChange={onChange}
        label={
          <Typography variant="body" sx={fieldLabelSx}>
            {label}
          </Typography>
        }
      />
    </Stack>
  );
}

export function GeometrySection({
  obj,
  primaryId,
  updateObject,
}: GeometrySectionProps) {
  const header = (
    <Typography variant="body" sx={sectionHeaderSx}>
      Geometry
    </Typography>
  );

  if (obj.type === "box") {
    return (
      <>
        {header}
        <NumberField
          label="Width Segments"
          value={obj.boxWidthSegments ?? 1}
          onChange={(val) => updateObject(primaryId, { boxWidthSegments: val })}
          min={1}
          max={100}
          step={1}
        />
        <NumberField
          label="Height Segments"
          value={obj.boxHeightSegments ?? 1}
          onChange={(val) =>
            updateObject(primaryId, { boxHeightSegments: val })
          }
          min={1}
          max={100}
          step={1}
        />
        <NumberField
          label="Depth Segments"
          value={obj.boxDepthSegments ?? 1}
          onChange={(val) => updateObject(primaryId, { boxDepthSegments: val })}
          min={1}
          max={100}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "sphere") {
    return (
      <>
        {header}
        <NumberField
          label="Width Segments"
          value={obj.sphereWidthSegments ?? 32}
          onChange={(val) =>
            updateObject(primaryId, { sphereWidthSegments: val })
          }
          min={3}
          max={128}
          step={1}
        />
        <NumberField
          label="Height Segments"
          value={obj.sphereHeightSegments ?? 32}
          onChange={(val) =>
            updateObject(primaryId, { sphereHeightSegments: val })
          }
          min={2}
          max={128}
          step={1}
        />
        <NumberField
          label="Phi Start"
          value={obj.spherePhiStart ?? 0}
          onChange={(val) => updateObject(primaryId, { spherePhiStart: val })}
          min={0}
          max={6.283}
          step={0.1}
        />
        <NumberField
          label="Phi Length"
          value={obj.spherePhiLength ?? Math.PI * 2}
          onChange={(val) => updateObject(primaryId, { spherePhiLength: val })}
          min={0}
          max={6.283}
          step={0.1}
        />
        <NumberField
          label="Theta Start"
          value={obj.sphereThetaStart ?? 0}
          onChange={(val) => updateObject(primaryId, { sphereThetaStart: val })}
          min={0}
          max={3.142}
          step={0.1}
        />
        <NumberField
          label="Theta Length"
          value={obj.sphereThetaLength ?? Math.PI}
          onChange={(val) =>
            updateObject(primaryId, { sphereThetaLength: val })
          }
          min={0}
          max={3.142}
          step={0.1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "cylinder") {
    return (
      <>
        {header}
        <NumberField
          label="Radius Top"
          value={obj.cylinderRadiusTop ?? 0.5}
          onChange={(val) =>
            updateObject(primaryId, { cylinderRadiusTop: val })
          }
          min={0}
          max={10}
          step={0.1}
        />
        <NumberField
          label="Radius Bottom"
          value={obj.cylinderRadiusBottom ?? 0.5}
          onChange={(val) =>
            updateObject(primaryId, { cylinderRadiusBottom: val })
          }
          min={0}
          max={10}
          step={0.1}
        />
        <NumberField
          label="Radial Segments"
          value={obj.cylinderRadialSegments ?? 32}
          onChange={(val) =>
            updateObject(primaryId, { cylinderRadialSegments: val })
          }
          min={3}
          max={128}
          step={1}
        />
        <NumberField
          label="Height Segments"
          value={obj.cylinderHeightSegments ?? 1}
          onChange={(val) =>
            updateObject(primaryId, { cylinderHeightSegments: val })
          }
          min={1}
          max={128}
          step={1}
        />
        <CheckboxField
          label="Open Ended"
          checked={obj.cylinderOpenEnded ?? false}
          onChange={(value) =>
            updateObject(primaryId, { cylinderOpenEnded: value })
          }
        />
        <NumberField
          label="Theta Start"
          value={obj.cylinderThetaStart ?? 0}
          onChange={(val) =>
            updateObject(primaryId, { cylinderThetaStart: val })
          }
          min={0}
          max={6.283}
          step={0.1}
        />
        <NumberField
          label="Theta Length"
          value={obj.cylinderThetaLength ?? Math.PI * 2}
          onChange={(val) =>
            updateObject(primaryId, { cylinderThetaLength: val })
          }
          min={0}
          max={6.283}
          step={0.1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "cone") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.coneRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { coneRadius: val })}
          min={0}
          max={10}
          step={0.1}
        />
        <NumberField
          label="Radial Segments"
          value={obj.coneRadialSegments ?? 32}
          onChange={(val) =>
            updateObject(primaryId, { coneRadialSegments: val })
          }
          min={3}
          max={128}
          step={1}
        />
        <NumberField
          label="Height Segments"
          value={obj.coneHeightSegments ?? 1}
          onChange={(val) =>
            updateObject(primaryId, { coneHeightSegments: val })
          }
          min={1}
          max={128}
          step={1}
        />
        <CheckboxField
          label="Open Ended"
          checked={obj.coneOpenEnded ?? false}
          onChange={(value) =>
            updateObject(primaryId, { coneOpenEnded: value })
          }
        />
        <NumberField
          label="Theta Start"
          value={obj.coneThetaStart ?? 0}
          onChange={(val) => updateObject(primaryId, { coneThetaStart: val })}
          min={0}
          max={6.283}
          step={0.1}
        />
        <NumberField
          label="Theta Length"
          value={obj.coneThetaLength ?? Math.PI * 2}
          onChange={(val) => updateObject(primaryId, { coneThetaLength: val })}
          min={0}
          max={6.283}
          step={0.1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "torus") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.torusRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { torusRadius: val })}
          min={0}
          max={10}
          step={0.1}
        />
        <NumberField
          label="Tube"
          value={obj.torusTube ?? 0.2}
          onChange={(val) => updateObject(primaryId, { torusTube: val })}
          min={0.01}
          max={5}
          step={0.01}
        />
        <NumberField
          label="Radial Segments"
          value={obj.torusRadialSegments ?? 16}
          onChange={(val) =>
            updateObject(primaryId, { torusRadialSegments: val })
          }
          min={3}
          max={64}
          step={1}
        />
        <NumberField
          label="Tubular Segments"
          value={obj.torusTubularSegments ?? 32}
          onChange={(val) =>
            updateObject(primaryId, { torusTubularSegments: val })
          }
          min={3}
          max={200}
          step={1}
        />
        <NumberField
          label="Arc"
          value={obj.torusArc ?? Math.PI * 2}
          onChange={(val) => updateObject(primaryId, { torusArc: val })}
          min={0}
          max={6.283}
          step={0.1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "plane") {
    return (
      <>
        {header}
        <NumberField
          label="Width Segments"
          value={obj.planeWidthSegments ?? 1}
          onChange={(val) =>
            updateObject(primaryId, { planeWidthSegments: val })
          }
          min={1}
          max={100}
          step={1}
        />
        <NumberField
          label="Height Segments"
          value={obj.planeHeightSegments ?? 1}
          onChange={(val) =>
            updateObject(primaryId, { planeHeightSegments: val })
          }
          min={1}
          max={100}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "capsule") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.capsuleRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { capsuleRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Length"
          value={obj.capsuleLength ?? 1}
          onChange={(val) => updateObject(primaryId, { capsuleLength: val })}
          min={0}
          max={20}
          step={0.1}
        />
        <NumberField
          label="Cap Segments"
          value={obj.capsuleCapSegments ?? 4}
          onChange={(val) =>
            updateObject(primaryId, { capsuleCapSegments: val })
          }
          min={1}
          max={32}
          step={1}
        />
        <NumberField
          label="Radial Segments"
          value={obj.capsuleRadialSegments ?? 8}
          onChange={(val) =>
            updateObject(primaryId, { capsuleRadialSegments: val })
          }
          min={3}
          max={64}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "circle") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.circleRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { circleRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Segments"
          value={obj.circleSegments ?? 32}
          onChange={(val) => updateObject(primaryId, { circleSegments: val })}
          min={3}
          max={128}
          step={1}
        />
        <NumberField
          label="Theta Start (rad)"
          value={obj.circleThetaStart ?? 0}
          onChange={(val) => updateObject(primaryId, { circleThetaStart: val })}
          min={0}
          max={6.28319}
          step={0.1}
        />
        <NumberField
          label="Theta Length (rad)"
          value={obj.circleThetaLength ?? 6.28319}
          onChange={(val) =>
            updateObject(primaryId, { circleThetaLength: val })
          }
          min={0}
          max={6.28319}
          step={0.1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "ring") {
    return (
      <>
        {header}
        <NumberField
          label="Inner Radius"
          value={obj.ringInnerRadius ?? 0.25}
          onChange={(val) => updateObject(primaryId, { ringInnerRadius: val })}
          min={0}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Outer Radius"
          value={obj.ringOuterRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { ringOuterRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Theta Segments"
          value={obj.ringThetaSegments ?? 32}
          onChange={(val) =>
            updateObject(primaryId, { ringThetaSegments: val })
          }
          min={3}
          max={128}
          step={1}
        />
        <NumberField
          label="Phi Segments"
          value={obj.ringPhiSegments ?? 1}
          onChange={(val) => updateObject(primaryId, { ringPhiSegments: val })}
          min={1}
          max={32}
          step={1}
        />
        <NumberField
          label="Theta Start (rad)"
          value={obj.ringThetaStart ?? 0}
          onChange={(val) => updateObject(primaryId, { ringThetaStart: val })}
          min={0}
          max={6.28319}
          step={0.1}
        />
        <NumberField
          label="Theta Length (rad)"
          value={obj.ringThetaLength ?? 6.28319}
          onChange={(val) => updateObject(primaryId, { ringThetaLength: val })}
          min={0}
          max={6.28319}
          step={0.1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "torusKnot") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.torusKnotRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { torusKnotRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Tube"
          value={obj.torusKnotTube ?? 0.15}
          onChange={(val) => updateObject(primaryId, { torusKnotTube: val })}
          min={0.01}
          max={5}
          step={0.01}
        />
        <NumberField
          label="Tubular Segments"
          value={obj.torusKnotTubularSegments ?? 64}
          onChange={(val) =>
            updateObject(primaryId, { torusKnotTubularSegments: val })
          }
          min={3}
          max={256}
          step={1}
        />
        <NumberField
          label="Radial Segments"
          value={obj.torusKnotRadialSegments ?? 8}
          onChange={(val) =>
            updateObject(primaryId, { torusKnotRadialSegments: val })
          }
          min={3}
          max={64}
          step={1}
        />
        <NumberField
          label="P (winds around axis)"
          value={obj.torusKnotP ?? 2}
          onChange={(val) => updateObject(primaryId, { torusKnotP: val })}
          min={1}
          max={20}
          step={1}
        />
        <NumberField
          label="Q (winds around interior)"
          value={obj.torusKnotQ ?? 3}
          onChange={(val) => updateObject(primaryId, { torusKnotQ: val })}
          min={1}
          max={20}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "octahedron") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.octaRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { octaRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Detail"
          value={obj.octaDetail ?? 0}
          onChange={(val) => updateObject(primaryId, { octaDetail: val })}
          min={0}
          max={5}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "dodecahedron") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.dodecaRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { dodecaRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Detail"
          value={obj.dodecaDetail ?? 0}
          onChange={(val) => updateObject(primaryId, { dodecaDetail: val })}
          min={0}
          max={5}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "icosahedron") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.icosaRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { icosaRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Detail"
          value={obj.icosaDetail ?? 0}
          onChange={(val) => updateObject(primaryId, { icosaDetail: val })}
          min={0}
          max={5}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "tetrahedron") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.tetraRadius ?? 0.5}
          onChange={(val) => updateObject(primaryId, { tetraRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Detail"
          value={obj.tetraDetail ?? 0}
          onChange={(val) => updateObject(primaryId, { tetraDetail: val })}
          min={0}
          max={5}
          step={1}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  if (obj.type === "tube") {
    return (
      <>
        {header}
        <NumberField
          label="Radius"
          value={obj.tubeRadius ?? 0.1}
          onChange={(val) => updateObject(primaryId, { tubeRadius: val })}
          min={0.01}
          max={10}
          step={0.01}
        />
        <NumberField
          label="Tubular Segments"
          value={obj.tubeTubularSegments ?? 64}
          onChange={(val) =>
            updateObject(primaryId, { tubeTubularSegments: val })
          }
          min={1}
          max={200}
          step={1}
        />
        <NumberField
          label="Radial Segments"
          value={obj.tubeRadialSegments ?? 8}
          onChange={(val) =>
            updateObject(primaryId, { tubeRadialSegments: val })
          }
          min={3}
          max={64}
          step={1}
        />
        <CheckboxField
          label="Closed"
          checked={obj.tubeClosed ?? false}
          onChange={(value) => updateObject(primaryId, { tubeClosed: value })}
        />
        <div style={dividerStyle} />
      </>
    );
  }

  return null;
}
