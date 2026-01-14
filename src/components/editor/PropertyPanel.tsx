import { Stack, Typography } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import type {
  StandardMaterialProps,
  PhysicalMaterialProps,
  ShaderMaterialProps,
} from "@/types";
import { isShaderMaterial, isStandardMaterial, isPhysicalMaterial } from "@/types";
import { panelHeaderStyle, panelScrollStyle } from "./property-panel/styles";
import { TransformSection } from "./property-panel/TransformSection";
import { GeometrySection } from "./property-panel/GeometrySection";
import { MaterialTypeToggle } from "./property-panel/MaterialTypeToggle";
import { StandardMaterialSection } from "./property-panel/StandardMaterialSection";
import { PhysicalMaterialSection } from "./property-panel/PhysicalMaterialSection";
import { ShaderMaterialSection } from "./property-panel/ShaderMaterialSection";
import type { MaterialType } from "./property-panel/types";

// Default standard material
const DEFAULT_STANDARD_MATERIAL: StandardMaterialProps = {
  type: "standard",
  color: "#4bd0d2",
  metalness: 0.2,
  roughness: 0.4,
};

// Default physical material
const DEFAULT_PHYSICAL_MATERIAL: PhysicalMaterialProps = {
  type: "physical",
  color: "#4bd0d2",
  metalness: 0.2,
  roughness: 0.4,
};

// Default shader material
const DEFAULT_SHADER_MATERIAL: ShaderMaterialProps = {
  type: "shader",
  shaderName: "new_shader",
  uniforms: {
    baseColor: { type: "color", value: "#4bd0d2" },
    time: { type: "float", value: 0, animated: true },
  },
  transparent: false,
  side: "double",
};

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

  const handleMaterialTypeChange = (newType: MaterialType) => {
    if (!obj || !primaryId) return;

    // Get current color for preservation
    const currentColor = isShaderMaterial(obj.material)
      ? ((obj.material.uniforms["baseColor"]?.value as string) ?? "#4bd0d2")
      : obj.material.color;

    if (newType === "standard") {
      if (!isStandardMaterial(obj.material)) {
        const newMat: StandardMaterialProps = {
          ...DEFAULT_STANDARD_MATERIAL,
          color: currentColor,
        };
        updateObject(primaryId, { material: newMat });
      }
    } else if (newType === "physical") {
      if (!isPhysicalMaterial(obj.material)) {
        const newMat: PhysicalMaterialProps = {
          ...DEFAULT_PHYSICAL_MATERIAL,
          color: currentColor,
        };
        updateObject(primaryId, { material: newMat });
      }
    } else if (newType === "shader") {
      if (!isShaderMaterial(obj.material)) {
        const shaderMat: ShaderMaterialProps = {
          ...DEFAULT_SHADER_MATERIAL,
          shaderName: obj.name.replace(/[^a-zA-Z0-9_]/g, "_"),
          uniforms: {
            ...DEFAULT_SHADER_MATERIAL.uniforms,
            baseColor: { type: "color", value: currentColor },
          },
        };
        updateObject(primaryId, { material: shaderMat });
      }
    }
  };

  if (!obj || !primaryId) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div style={panelHeaderStyle}>
          <Typography
            variant="body"
            sx={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}
          >
            Properties
          </Typography>
        </div>
        <div
          style={{
            opacity: 0.65,
            fontStyle: "italic",
            fontSize: "11px",
            padding: "6px 10px",
          }}
        >
          No object selected
        </div>
      </div>
    );
  }

  const isGroup = obj.type === "group";
  const materialType: MaterialType = isShaderMaterial(obj.material)
    ? "shader"
    : isPhysicalMaterial(obj.material)
      ? "physical"
      : "standard";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      <div style={panelHeaderStyle}>
        <Typography
          variant="body"
          sx={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}
        >
          Properties
        </Typography>
      </div>
      <div style={panelScrollStyle}>
        <Stack gap={0} sx={{ padding: 0 }}>
          <TransformSection
            obj={obj}
            primaryId={primaryId}
            transformMode={transformMode}
            setTransformMode={setTransformMode}
            updateObject={updateObject}
          />
          <GeometrySection
            obj={obj}
            primaryId={primaryId}
            updateObject={updateObject}
          />

          {!isGroup && (
            <>
              <MaterialTypeToggle
                materialType={materialType}
                onChange={handleMaterialTypeChange}
              />
              {isStandardMaterial(obj.material) && (
                <StandardMaterialSection
                  material={obj.material}
                  primaryId={primaryId}
                  updateObject={updateObject}
                  beginTransaction={beginTransaction}
                  commitTransaction={commitTransaction}
                />
              )}
              {isPhysicalMaterial(obj.material) && (
                <PhysicalMaterialSection
                  material={obj.material}
                  primaryId={primaryId}
                  updateObject={updateObject}
                  beginTransaction={beginTransaction}
                  commitTransaction={commitTransaction}
                />
              )}
              {isShaderMaterial(obj.material) && (
                <ShaderMaterialSection
                  obj={obj}
                  primaryId={primaryId}
                  updateObject={updateObject}
                />
              )}
            </>
          )}
        </Stack>
      </div>
    </div>
  );
}
