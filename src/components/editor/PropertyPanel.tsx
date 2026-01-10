import { Stack, Typography, Button, Box } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import type {
  TransformMode,
  StandardMaterialProps,
  PhysicalMaterialProps,
  ShaderMaterialProps,
  ShaderUniform,
} from "@/types";
import {
  isShaderMaterial,
  isStandardMaterial,
  isPhysicalMaterial,
} from "@/types";
import { HexColorSchema } from "@/schemas/scene";

// Material type for UI
type MaterialType = "standard" | "physical" | "shader";

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

  const modes: TransformMode[] = ["translate", "rotate", "scale"];

  const handleModeClick = (mode: TransformMode) => {
    setTransformMode(transformMode === mode ? null : mode);
  };

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

  const openInVSCode = (shaderName: string) => {
    // Open VS Code with the shader files using anchor click (avoids blank tabs)
    const cwd = import.meta.env["VITE_CWD"] || "/home/xbenc/occ/pngwin/rehkuh";

    const openUrl = (url: string) => {
      const a = document.createElement("a");
      a.href = url;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    openUrl(`vscode://file${cwd}/shaders/${shaderName}.vert`);
    setTimeout(() => {
      openUrl(`vscode://file${cwd}/shaders/${shaderName}.frag`);
    }, 100);
  };

  const createShaderFilesAndLoad = async (shaderName: string) => {
    // Create shader files by POSTing to a Vite dev endpoint
    try {
      await fetch("/__create-shader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: shaderName }),
      });

      // Load the shader content and update the object
      const res = await fetch(`/__shader/${shaderName}`);
      const { vert, frag } = await res.json();

      if (obj && primaryId && isShaderMaterial(obj.material)) {
        updateObject(primaryId, {
          material: {
            ...obj.material,
            vertex: vert,
            fragment: frag,
          },
        });
      }
    } catch (e) {
      console.error("Failed to create shader files:", e);
    }
  };

  const handleAddUniform = () => {
    if (!obj || !primaryId || !isShaderMaterial(obj.material)) return;

    const uniformName = `uniform${Object.keys(obj.material.uniforms).length + 1}`;
    const newUniform: ShaderUniform = { type: "float", value: 0 };

    updateObject(primaryId, {
      material: {
        ...obj.material,
        uniforms: {
          ...obj.material.uniforms,
          [uniformName]: newUniform,
        },
      },
    });
  };

  const handleRemoveUniform = (uniformName: string) => {
    if (!obj || !primaryId || !isShaderMaterial(obj.material)) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [uniformName]: _removed, ...remainingUniforms } =
      obj.material.uniforms;
    updateObject(primaryId, {
      material: {
        ...obj.material,
        uniforms: remainingUniforms,
      },
    });
  };

  const handleUniformChange = (
    uniformName: string,
    field: keyof ShaderUniform,
    value: ShaderUniform[keyof ShaderUniform],
  ) => {
    if (!obj || !primaryId || !isShaderMaterial(obj.material)) return;

    const mat = obj.material;
    const uniform = mat.uniforms[uniformName];
    const newMaterial: ShaderMaterialProps = {
      type: "shader",
      shaderName: mat.shaderName,
      uniforms: {
        ...mat.uniforms,
        [uniformName]: { ...uniform, [field]: value } as ShaderUniform,
      },
    };
    if (mat.vertex) newMaterial.vertex = mat.vertex;
    if (mat.fragment) newMaterial.fragment = mat.fragment;
    if (mat.transparent !== undefined)
      newMaterial.transparent = mat.transparent;
    if (mat.side) newMaterial.side = mat.side;
    if (mat.depthWrite !== undefined) newMaterial.depthWrite = mat.depthWrite;
    if (mat.depthTest !== undefined) newMaterial.depthTest = mat.depthTest;
    updateObject(primaryId, { material: newMaterial });
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
        <div
          style={{
            flexShrink: 0,
            padding: "8px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            fontSize: "12px",
            opacity: 0.9,
            userSelect: "none",
          }}
        >
          Properties
        </div>
        <div
          style={{
            opacity: 0.5,
            fontStyle: "italic",
            fontSize: "11px",
            padding: "8px 12px",
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
      <div
        style={{
          flexShrink: 0,
          padding: "8px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          fontSize: "12px",
          opacity: 0.9,
          userSelect: "none",
        }}
      >
        Properties
      </div>
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <Stack gap={0} sx={{ padding: 0 }}>
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
              {/* Material Type Toggle */}
              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Material Type
                </Typography>
                <Stack
                  direction="row"
                  gap={0}
                  sx={{ padding: 0, flexWrap: "wrap" }}
                >
                  {(["standard", "physical", "shader"] as const).map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      sx={{
                        padding: "0 4px",
                        minHeight: "16px",
                        fontSize: "11px",
                        lineHeight: "16px",
                        backgroundColor:
                          materialType === type
                            ? "rgba(75, 208, 210, 0.3)"
                            : "transparent",
                      }}
                      onClick={() => handleMaterialTypeChange(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </Stack>
              </Stack>

              {/* Standard Material Properties */}
              {isStandardMaterial(obj.material) &&
                (() => {
                  const mat = obj.material;
                  return (
                    <>
                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
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
                            value={mat.color}
                            onChange={(e) => {
                              const result = HexColorSchema.safeParse(
                                e.target.value,
                              );
                              if (!result.success) return;
                              const newMat: StandardMaterialProps = {
                                type: "standard",
                                color: result.data,
                                metalness: mat.metalness,
                                roughness: mat.roughness,
                              };
                              updateObject(primaryId, { material: newMat });
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
                            {mat.color}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          Metalness: {mat.metalness.toFixed(2)}
                        </Typography>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={mat.metalness}
                          onMouseDown={beginTransaction}
                          onMouseUp={commitTransaction}
                          onChange={(e) => {
                            const newMat: StandardMaterialProps = {
                              type: "standard",
                              color: mat.color,
                              metalness: parseFloat(e.target.value),
                              roughness: mat.roughness,
                            };
                            updateObject(primaryId, { material: newMat });
                          }}
                          style={{
                            width: "100%",
                            height: "12px",
                            margin: 0,
                            padding: 0,
                          }}
                        />
                      </Stack>

                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          Roughness: {mat.roughness.toFixed(2)}
                        </Typography>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={mat.roughness}
                          onMouseDown={beginTransaction}
                          onMouseUp={commitTransaction}
                          onChange={(e) => {
                            const newMat: StandardMaterialProps = {
                              type: "standard",
                              color: mat.color,
                              metalness: mat.metalness,
                              roughness: parseFloat(e.target.value),
                            };
                            updateObject(primaryId, { material: newMat });
                          }}
                          style={{
                            width: "100%",
                            height: "12px",
                            margin: 0,
                            padding: 0,
                          }}
                        />
                      </Stack>
                    </>
                  );
                })()}

              {/* Physical Material Properties */}
              {isPhysicalMaterial(obj.material) &&
                (() => {
                  const mat = obj.material;

                  // Helper to update a single physical material property
                  const updatePhysicalProp = (
                    prop: keyof PhysicalMaterialProps,
                    value: PhysicalMaterialProps[keyof PhysicalMaterialProps],
                  ) => {
                    updateObject(primaryId, {
                      material: { ...mat, [prop]: value },
                    });
                  };

                  // Slider component for numeric props
                  const Slider = ({
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
                    const val = (mat[prop] as number) ?? 0;
                    return (
                      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "10px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          {label}: {val.toFixed(2)}
                        </Typography>
                        <input
                          type="range"
                          min={min}
                          max={max}
                          step={step}
                          value={val}
                          onMouseDown={beginTransaction}
                          onMouseUp={commitTransaction}
                          onChange={(e) =>
                            updatePhysicalProp(prop, parseFloat(e.target.value))
                          }
                          style={{
                            width: "100%",
                            height: "10px",
                            margin: 0,
                            padding: 0,
                          }}
                        />
                      </Stack>
                    );
                  };

                  // Color picker component
                  const ColorPicker = ({
                    label,
                    prop,
                  }: {
                    label: string;
                    prop: keyof PhysicalMaterialProps;
                  }) => {
                    const val = (mat[prop] as string) ?? "#ffffff";
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
                            const result = HexColorSchema.safeParse(
                              e.target.value,
                            );
                            if (result.success)
                              updatePhysicalProp(prop, result.data);
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
                        <Typography
                          variant="body"
                          sx={{ fontSize: "10px", opacity: 0.7 }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    );
                  };

                  // Section header component
                  const SectionHeader = ({ title }: { title: string }) => (
                    <Typography
                      variant="body"
                      sx={{
                        fontSize: "10px",
                        lineHeight: 1.2,
                        opacity: 0.5,
                        padding: "4px 4px 2px 4px",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        marginTop: "4px",
                      }}
                    >
                      {title}
                    </Typography>
                  );

                  return (
                    <>
                      {/* Base Properties */}
                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
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
                            value={mat.color}
                            onChange={(e) => {
                              const result = HexColorSchema.safeParse(
                                e.target.value,
                              );
                              if (result.success)
                                updatePhysicalProp("color", result.data);
                            }}
                            style={{
                              width: "16px",
                              height: "16px",
                              padding: 0,
                              margin: 0,
                              border: "none",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                          />
                          <Typography variant="body" sx={{ fontSize: "11px" }}>
                            {mat.color}
                          </Typography>
                        </Box>
                      </Stack>
                      <Slider label="Metalness" prop="metalness" />
                      <Slider label="Roughness" prop="roughness" />

                      {/* Clearcoat */}
                      <SectionHeader title="Clearcoat" />
                      <Slider label="Clearcoat" prop="clearcoat" />
                      <Slider
                        label="Clearcoat Roughness"
                        prop="clearcoatRoughness"
                      />

                      {/* Sheen */}
                      <SectionHeader title="Sheen" />
                      <Slider label="Sheen" prop="sheen" />
                      <Slider label="Sheen Roughness" prop="sheenRoughness" />
                      <ColorPicker label="Sheen Color" prop="sheenColor" />

                      {/* Transmission */}
                      <SectionHeader title="Transmission" />
                      <Slider label="Transmission" prop="transmission" />
                      <Slider
                        label="Thickness"
                        prop="thickness"
                        min={0}
                        max={10}
                        step={0.1}
                      />
                      <ColorPicker
                        label="Attenuation Color"
                        prop="attenuationColor"
                      />
                      <Slider
                        label="Attenuation Dist"
                        prop="attenuationDistance"
                        min={0}
                        max={100}
                        step={1}
                      />

                      {/* IOR */}
                      <SectionHeader title="IOR" />
                      <Slider
                        label="IOR"
                        prop="ior"
                        min={1}
                        max={2.333}
                        step={0.01}
                      />

                      {/* Specular */}
                      <SectionHeader title="Specular" />
                      <Slider
                        label="Specular Intensity"
                        prop="specularIntensity"
                      />
                      <ColorPicker
                        label="Specular Color"
                        prop="specularColor"
                      />
                      <Slider label="Reflectivity" prop="reflectivity" />

                      {/* Iridescence */}
                      <SectionHeader title="Iridescence" />
                      <Slider label="Iridescence" prop="iridescence" />
                      <Slider
                        label="Iridescence IOR"
                        prop="iridescenceIOR"
                        min={1}
                        max={2.333}
                        step={0.01}
                      />

                      {/* Anisotropy */}
                      <SectionHeader title="Anisotropy" />
                      <Slider label="Anisotropy" prop="anisotropy" />
                      <Slider
                        label="Anisotropy Rotation"
                        prop="anisotropyRotation"
                        min={0}
                        max={6.283}
                        step={0.01}
                      />

                      {/* Dispersion */}
                      <SectionHeader title="Dispersion" />
                      <Slider
                        label="Dispersion"
                        prop="dispersion"
                        min={0}
                        max={1}
                        step={0.01}
                      />

                      {/* Other */}
                      <SectionHeader title="Other" />
                      <Slider
                        label="Env Map Intensity"
                        prop="envMapIntensity"
                        min={0}
                        max={5}
                        step={0.1}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "0 4px 2px 4px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={mat.flatShading ?? false}
                          onChange={(e) =>
                            updatePhysicalProp("flatShading", e.target.checked)
                          }
                          style={{ width: "12px", height: "12px", margin: 0 }}
                        />
                        <Typography
                          variant="body"
                          sx={{ fontSize: "10px", opacity: 0.7 }}
                        >
                          Flat Shading
                        </Typography>
                      </Box>
                    </>
                  );
                })()}

              {/* Shader Material Properties */}
              {isShaderMaterial(obj.material) &&
                (() => {
                  const mat = obj.material;
                  return (
                    <>
                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          Shader: {mat.shaderName}
                        </Typography>
                        <Button
                          size="sm"
                          sx={{
                            padding: "2px 6px",
                            minHeight: "20px",
                            fontSize: "11px",
                            lineHeight: "16px",
                            backgroundColor: "rgba(100, 150, 255, 0.3)",
                            marginTop: "2px",
                          }}
                          onClick={async () => {
                            await createShaderFilesAndLoad(mat.shaderName);
                            openInVSCode(mat.shaderName);
                          }}
                        >
                          Edit in VS Code
                        </Button>
                      </Stack>

                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body"
                            sx={{
                              fontSize: "11px",
                              lineHeight: 1.2,
                              opacity: 0.7,
                            }}
                          >
                            Uniforms
                          </Typography>
                          <Button
                            size="sm"
                            sx={{
                              padding: "0 4px",
                              minHeight: "14px",
                              fontSize: "10px",
                              lineHeight: "14px",
                            }}
                            onClick={handleAddUniform}
                          >
                            + Add
                          </Button>
                        </Box>

                        {Object.entries(mat.uniforms).map(([name, uniform]) => (
                          <Box
                            key={name}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              marginTop: "2px",
                              padding: "2px",
                              backgroundColor: "rgba(255,255,255,0.05)",
                              borderRadius: "2px",
                            }}
                          >
                            <Typography
                              variant="body"
                              sx={{
                                fontSize: "10px",
                                minWidth: "50px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {name}
                            </Typography>

                            {uniform.type === "color" && (
                              <input
                                type="color"
                                value={uniform.value as string}
                                onChange={(e) =>
                                  handleUniformChange(
                                    name,
                                    "value",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  padding: 0,
                                  margin: 0,
                                  border: "none",
                                  borderRadius: "2px",
                                  cursor: "pointer",
                                }}
                              />
                            )}

                            {uniform.type === "float" && (
                              <input
                                type="number"
                                value={uniform.value as number}
                                step={uniform.step ?? 0.1}
                                onChange={(e) =>
                                  handleUniformChange(
                                    name,
                                    "value",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                style={{
                                  width: "50px",
                                  height: "14px",
                                  fontSize: "10px",
                                  padding: "0 2px",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  borderRadius: "2px",
                                  backgroundColor: "rgba(0,0,0,0.3)",
                                  color: "inherit",
                                }}
                              />
                            )}

                            {uniform.animated && (
                              <Typography
                                variant="body"
                                sx={{ fontSize: "10px", opacity: 0.5 }}
                                title="Animated"
                              >
                                ⚡
                              </Typography>
                            )}

                            <Button
                              size="sm"
                              sx={{
                                padding: "0 2px",
                                minHeight: "14px",
                                fontSize: "10px",
                                lineHeight: "14px",
                                marginLeft: "auto",
                                opacity: 0.5,
                              }}
                              onClick={() => handleRemoveUniform(name)}
                            >
                              ×
                            </Button>
                          </Box>
                        ))}
                      </Stack>

                      {/* Shader Options */}
                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          Options
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={mat.transparent ?? false}
                            onChange={(e) => {
                              const newMat: ShaderMaterialProps = {
                                type: "shader",
                                shaderName: mat.shaderName,
                                uniforms: mat.uniforms,
                                transparent: e.target.checked,
                              };
                              if (mat.vertex) newMat.vertex = mat.vertex;
                              if (mat.fragment) newMat.fragment = mat.fragment;
                              if (mat.side) newMat.side = mat.side;
                              if (mat.depthWrite !== undefined)
                                newMat.depthWrite = mat.depthWrite;
                              if (mat.depthTest !== undefined)
                                newMat.depthTest = mat.depthTest;
                              updateObject(primaryId, { material: newMat });
                            }}
                            style={{ width: "12px", height: "12px", margin: 0 }}
                          />
                          <Typography variant="body" sx={{ fontSize: "10px" }}>
                            Transparent
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "2px",
                          }}
                        >
                          <Typography
                            variant="body"
                            sx={{ fontSize: "10px", minWidth: "30px" }}
                          >
                            Side:
                          </Typography>
                          <select
                            value={mat.side ?? "front"}
                            onChange={(e) => {
                              const newMat: ShaderMaterialProps = {
                                type: "shader",
                                shaderName: mat.shaderName,
                                uniforms: mat.uniforms,
                                side: e.target.value as
                                  | "front"
                                  | "back"
                                  | "double",
                              };
                              if (mat.vertex) newMat.vertex = mat.vertex;
                              if (mat.fragment) newMat.fragment = mat.fragment;
                              if (mat.transparent !== undefined)
                                newMat.transparent = mat.transparent;
                              if (mat.depthWrite !== undefined)
                                newMat.depthWrite = mat.depthWrite;
                              if (mat.depthTest !== undefined)
                                newMat.depthTest = mat.depthTest;
                              updateObject(primaryId, { material: newMat });
                            }}
                            style={{
                              fontSize: "10px",
                              padding: "1px 2px",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: "2px",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              color: "inherit",
                            }}
                          >
                            <option value="front">Front</option>
                            <option value="back">Back</option>
                            <option value="double">Double</option>
                          </select>
                        </Box>
                      </Stack>
                    </>
                  );
                })()}
            </>
          )}
        </Stack>
      </div>
    </div>
  );
}
