import { Stack, Typography, Button, Box } from "@archway/valet";
import { ConfirmableNumberInput } from "./ConfirmableNumberInput";
import { useSceneStore } from "@/store/sceneStore";
import { useSettingsStore } from "@/store/settingsStore";
import { showError } from "@/store/notificationStore";
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
    // Open VS Code with the staging shader files (not live)
    const projectPath = useSettingsStore.getState().projectPath;
    const cwd = projectPath || import.meta.env["VITE_CWD"];

    if (!cwd) {
      showError("Set Project Path in Settings to use VS Code integration");
      return;
    }

    const openUrl = (url: string) => {
      const a = document.createElement("a");
      a.href = url;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    openUrl(`vscode://file${cwd}/shaders/staging/${shaderName}.vert`);
    setTimeout(() => {
      openUrl(`vscode://file${cwd}/shaders/staging/${shaderName}.frag`);
    }, 100);
  };

  const createShaderFilesAndLoad = async (shaderName: string) => {
    // Create shader files in staging by POSTing to a Vite dev endpoint
    try {
      const createRes = await fetch("/__create-shader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: shaderName }),
      });
      if (!createRes.ok) {
        throw new Error(`Failed to create shader: ${createRes.status}`);
      }

      // Load the shader content from staging and update the object
      const res = await fetch(`/__staging-shader/${shaderName}`);
      if (!res.ok) {
        throw new Error(`Failed to load shader: ${res.status}`);
      }
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
      uniforms: {
        ...mat.uniforms,
        [uniformName]: { ...uniform, [field]: value } as ShaderUniform,
      },
    };
    if (mat.shaderName) newMaterial.shaderName = mat.shaderName;
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
            opacity: 0.9,
            userSelect: "none",
          }}
        >
          <Typography variant="body" sx={{ fontSize: "12px" }}>
            Properties
          </Typography>
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
          opacity: 0.9,
          userSelect: "none",
        }}
      >
        <Typography variant="body" sx={{ fontSize: "12px" }}>
          Properties
        </Typography>
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

          {/* Transform Value Inputs - shows when a gizmo mode is active */}
          {transformMode && transformMode !== "rotate" && (
            <Stack gap={0} sx={{ padding: "4px 4px 8px 4px" }}>
              <Typography
                variant="body"
                sx={{
                  fontSize: "11px",
                  opacity: 0.7,
                  marginBottom: "4px",
                }}
              >
                {transformMode === "translate" ? "Position" : "Scale"}
              </Typography>
              <Stack direction="row" gap={1} sx={{ padding: 0 }}>
                {(["X", "Y", "Z"] as const).map((axis, index) => {
                  const values =
                    transformMode === "translate" ? obj.position : obj.scale;
                  const propKey =
                    transformMode === "translate" ? "position" : "scale";

                  return (
                    <Stack key={axis} gap={0} sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body"
                        sx={{
                          fontSize: "10px",
                          opacity: 0.5,
                          textAlign: "center",
                        }}
                      >
                        {axis}
                      </Typography>
                      <ConfirmableNumberInput
                        value={Math.round((values[index] ?? 0) * 1000) / 1000}
                        onChange={(val) => {
                          const newValues = [...values] as [
                            number,
                            number,
                            number,
                          ];
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
            <Stack gap={0} sx={{ padding: "4px 4px 8px 4px" }}>
              <Typography
                variant="body"
                sx={{
                  fontSize: "11px",
                  opacity: 0.7,
                  marginBottom: "4px",
                }}
              >
                Rotation
              </Typography>
              {(["X", "Y", "Z"] as const).map((axis, index) => {
                const radValue = obj.rotation[index] ?? 0;
                const degValue = Math.round((radValue * 180) / Math.PI);

                const applyRadians = (delta: number) => {
                  const newValues = [...obj.rotation] as [
                    number,
                    number,
                    number,
                  ];
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
                          fontSize: "10px",
                          opacity: 0.5,
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
                              fontSize: "9px",
                              opacity: 0.4,
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
                              fontSize: "9px",
                              opacity: 0.4,
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
                      sx={{ paddingLeft: "16px", justifyContent: "flex-start" }}
                    >
                      {quickButtons.map((btn) => (
                        <Button
                          key={btn.label}
                          size="sm"
                          onClick={() => applyRadians(btn.delta)}
                          sx={{
                            fontSize: "8px",
                            padding: "1px 3px",
                            minHeight: "14px",
                            minWidth: "22px",
                            lineHeight: 1,
                          }}
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

          {/* Box Geometry Options */}
          {obj.type === "box" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Width Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.boxWidthSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { boxWidthSegments: val })
                  }
                  min={1}
                  max={100}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Height Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.boxHeightSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { boxHeightSegments: val })
                  }
                  min={1}
                  max={100}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Depth Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.boxDepthSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { boxDepthSegments: val })
                  }
                  min={1}
                  max={100}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Sphere Geometry Options */}
          {obj.type === "sphere" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Width Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.sphereWidthSegments ?? 32}
                  onChange={(val) =>
                    updateObject(primaryId, { sphereWidthSegments: val })
                  }
                  min={3}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Height Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.sphereHeightSegments ?? 32}
                  onChange={(val) =>
                    updateObject(primaryId, { sphereHeightSegments: val })
                  }
                  min={2}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Phi Start
                </Typography>
                <ConfirmableNumberInput
                  value={obj.spherePhiStart ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { spherePhiStart: val })
                  }
                  min={0}
                  max={6.283}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Phi Length
                </Typography>
                <ConfirmableNumberInput
                  value={obj.spherePhiLength ?? Math.PI * 2}
                  onChange={(val) =>
                    updateObject(primaryId, { spherePhiLength: val })
                  }
                  min={0}
                  max={6.283}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Start
                </Typography>
                <ConfirmableNumberInput
                  value={obj.sphereThetaStart ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { sphereThetaStart: val })
                  }
                  min={0}
                  max={3.142}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Length
                </Typography>
                <ConfirmableNumberInput
                  value={obj.sphereThetaLength ?? Math.PI}
                  onChange={(val) =>
                    updateObject(primaryId, { sphereThetaLength: val })
                  }
                  min={0}
                  max={3.142}
                  step={0.1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Cylinder Geometry Options */}
          {obj.type === "cylinder" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius Top
                </Typography>
                <ConfirmableNumberInput
                  value={obj.cylinderRadiusTop ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { cylinderRadiusTop: val })
                  }
                  min={0}
                  max={10}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius Bottom
                </Typography>
                <ConfirmableNumberInput
                  value={obj.cylinderRadiusBottom ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { cylinderRadiusBottom: val })
                  }
                  min={0}
                  max={10}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radial Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.cylinderRadialSegments ?? 32}
                  onChange={(val) =>
                    updateObject(primaryId, { cylinderRadialSegments: val })
                  }
                  min={3}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Height Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.cylinderHeightSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { cylinderHeightSegments: val })
                  }
                  min={1}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Open Ended
                </Typography>
                <input
                  type="checkbox"
                  checked={obj.cylinderOpenEnded ?? false}
                  onChange={(e) => {
                    updateObject(primaryId, {
                      cylinderOpenEnded: e.target.checked,
                    });
                  }}
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Start
                </Typography>
                <ConfirmableNumberInput
                  value={obj.cylinderThetaStart ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { cylinderThetaStart: val })
                  }
                  min={0}
                  max={6.283}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Length
                </Typography>
                <ConfirmableNumberInput
                  value={obj.cylinderThetaLength ?? Math.PI * 2}
                  onChange={(val) =>
                    updateObject(primaryId, { cylinderThetaLength: val })
                  }
                  min={0}
                  max={6.283}
                  step={0.1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Cone Geometry Options */}
          {obj.type === "cone" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.coneRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { coneRadius: val })
                  }
                  min={0}
                  max={10}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radial Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.coneRadialSegments ?? 32}
                  onChange={(val) =>
                    updateObject(primaryId, { coneRadialSegments: val })
                  }
                  min={3}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Height Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.coneHeightSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { coneHeightSegments: val })
                  }
                  min={1}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Open Ended
                </Typography>
                <input
                  type="checkbox"
                  checked={obj.coneOpenEnded ?? false}
                  onChange={(e) => {
                    updateObject(primaryId, {
                      coneOpenEnded: e.target.checked,
                    });
                  }}
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Start
                </Typography>
                <ConfirmableNumberInput
                  value={obj.coneThetaStart ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { coneThetaStart: val })
                  }
                  min={0}
                  max={6.283}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Length
                </Typography>
                <ConfirmableNumberInput
                  value={obj.coneThetaLength ?? Math.PI * 2}
                  onChange={(val) =>
                    updateObject(primaryId, { coneThetaLength: val })
                  }
                  min={0}
                  max={6.283}
                  step={0.1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Torus Geometry Options */}
          {obj.type === "torus" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { torusRadius: val })
                  }
                  min={0}
                  max={10}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Tube
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusTube ?? 0.2}
                  onChange={(val) =>
                    updateObject(primaryId, { torusTube: val })
                  }
                  min={0.01}
                  max={5}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radial Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusRadialSegments ?? 16}
                  onChange={(val) =>
                    updateObject(primaryId, { torusRadialSegments: val })
                  }
                  min={3}
                  max={64}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Tubular Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusTubularSegments ?? 32}
                  onChange={(val) =>
                    updateObject(primaryId, { torusTubularSegments: val })
                  }
                  min={3}
                  max={200}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Arc
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusArc ?? Math.PI * 2}
                  onChange={(val) => updateObject(primaryId, { torusArc: val })}
                  min={0}
                  max={6.283}
                  step={0.1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Plane Geometry Options */}
          {obj.type === "plane" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Width Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.planeWidthSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { planeWidthSegments: val })
                  }
                  min={1}
                  max={100}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Height Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.planeHeightSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { planeHeightSegments: val })
                  }
                  min={1}
                  max={100}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Capsule Geometry Options */}
          {obj.type === "capsule" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.capsuleRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { capsuleRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Length
                </Typography>
                <ConfirmableNumberInput
                  value={obj.capsuleLength ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { capsuleLength: val })
                  }
                  min={0}
                  max={20}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Cap Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.capsuleCapSegments ?? 4}
                  onChange={(val) =>
                    updateObject(primaryId, { capsuleCapSegments: val })
                  }
                  min={1}
                  max={32}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radial Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.capsuleRadialSegments ?? 8}
                  onChange={(val) =>
                    updateObject(primaryId, { capsuleRadialSegments: val })
                  }
                  min={3}
                  max={64}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Circle Geometry Options */}
          {obj.type === "circle" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.circleRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { circleRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.circleSegments ?? 32}
                  onChange={(val) =>
                    updateObject(primaryId, { circleSegments: val })
                  }
                  min={3}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Start (rad)
                </Typography>
                <ConfirmableNumberInput
                  value={obj.circleThetaStart ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { circleThetaStart: val })
                  }
                  min={0}
                  max={6.28319}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Length (rad)
                </Typography>
                <ConfirmableNumberInput
                  value={obj.circleThetaLength ?? 6.28319}
                  onChange={(val) =>
                    updateObject(primaryId, { circleThetaLength: val })
                  }
                  min={0}
                  max={6.28319}
                  step={0.1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Ring Geometry Options */}
          {obj.type === "ring" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Inner Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.ringInnerRadius ?? 0.25}
                  onChange={(val) =>
                    updateObject(primaryId, { ringInnerRadius: val })
                  }
                  min={0}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Outer Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.ringOuterRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { ringOuterRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.ringThetaSegments ?? 32}
                  onChange={(val) =>
                    updateObject(primaryId, { ringThetaSegments: val })
                  }
                  min={3}
                  max={128}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Phi Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.ringPhiSegments ?? 1}
                  onChange={(val) =>
                    updateObject(primaryId, { ringPhiSegments: val })
                  }
                  min={1}
                  max={32}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Start (rad)
                </Typography>
                <ConfirmableNumberInput
                  value={obj.ringThetaStart ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { ringThetaStart: val })
                  }
                  min={0}
                  max={6.28319}
                  step={0.1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Theta Length (rad)
                </Typography>
                <ConfirmableNumberInput
                  value={obj.ringThetaLength ?? 6.28319}
                  onChange={(val) =>
                    updateObject(primaryId, { ringThetaLength: val })
                  }
                  min={0}
                  max={6.28319}
                  step={0.1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* TorusKnot Geometry Options */}
          {obj.type === "torusKnot" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusKnotRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { torusKnotRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Tube
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusKnotTube ?? 0.15}
                  onChange={(val) =>
                    updateObject(primaryId, { torusKnotTube: val })
                  }
                  min={0.01}
                  max={5}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Tubular Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusKnotTubularSegments ?? 64}
                  onChange={(val) =>
                    updateObject(primaryId, { torusKnotTubularSegments: val })
                  }
                  min={3}
                  max={256}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radial Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusKnotRadialSegments ?? 8}
                  onChange={(val) =>
                    updateObject(primaryId, { torusKnotRadialSegments: val })
                  }
                  min={3}
                  max={64}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  P (winds around axis)
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusKnotP ?? 2}
                  onChange={(val) =>
                    updateObject(primaryId, { torusKnotP: val })
                  }
                  min={1}
                  max={20}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Q (winds around interior)
                </Typography>
                <ConfirmableNumberInput
                  value={obj.torusKnotQ ?? 3}
                  onChange={(val) =>
                    updateObject(primaryId, { torusKnotQ: val })
                  }
                  min={1}
                  max={20}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Octahedron Geometry Options */}
          {obj.type === "octahedron" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.octaRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { octaRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Detail
                </Typography>
                <ConfirmableNumberInput
                  value={obj.octaDetail ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { octaDetail: val })
                  }
                  min={0}
                  max={5}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Dodecahedron Geometry Options */}
          {obj.type === "dodecahedron" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.dodecaRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { dodecaRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Detail
                </Typography>
                <ConfirmableNumberInput
                  value={obj.dodecaDetail ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { dodecaDetail: val })
                  }
                  min={0}
                  max={5}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Icosahedron Geometry Options */}
          {obj.type === "icosahedron" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.icosaRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { icosaRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Detail
                </Typography>
                <ConfirmableNumberInput
                  value={obj.icosaDetail ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { icosaDetail: val })
                  }
                  min={0}
                  max={5}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Tetrahedron Geometry Options */}
          {obj.type === "tetrahedron" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.tetraRadius ?? 0.5}
                  onChange={(val) =>
                    updateObject(primaryId, { tetraRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Detail
                </Typography>
                <ConfirmableNumberInput
                  value={obj.tetraDetail ?? 0}
                  onChange={(val) =>
                    updateObject(primaryId, { tetraDetail: val })
                  }
                  min={0}
                  max={5}
                  step={1}
                />
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

          {/* Tube Geometry Options */}
          {obj.type === "tube" && (
            <>
              <Typography
                variant="body"
                sx={{
                  fontSize: "10px",
                  opacity: 0.5,
                  padding: "8px 4px 2px 4px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "4px",
                }}
              >
                Geometry
              </Typography>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radius
                </Typography>
                <ConfirmableNumberInput
                  value={obj.tubeRadius ?? 0.1}
                  onChange={(val) =>
                    updateObject(primaryId, { tubeRadius: val })
                  }
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Tubular Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.tubeTubularSegments ?? 64}
                  onChange={(val) =>
                    updateObject(primaryId, { tubeTubularSegments: val })
                  }
                  min={1}
                  max={200}
                  step={1}
                />
              </Stack>

              <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Radial Segments
                </Typography>
                <ConfirmableNumberInput
                  value={obj.tubeRadialSegments ?? 8}
                  onChange={(val) =>
                    updateObject(primaryId, { tubeRadialSegments: val })
                  }
                  min={3}
                  max={64}
                  step={1}
                />
              </Stack>

              <Stack
                gap={0}
                sx={{
                  padding: "0 4px 4px 4px",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={obj.tubeClosed ?? false}
                  onChange={(e) => {
                    updateObject(primaryId, { tubeClosed: e.target.checked });
                  }}
                  style={{
                    width: "12px",
                    height: "12px",
                    margin: 0,
                    marginRight: "6px",
                  }}
                />
                <Typography
                  variant="body"
                  sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
                >
                  Closed
                </Typography>
              </Stack>

              <div
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginTop: "8px",
                }}
              />
            </>
          )}

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

                  // Helper to update a single standard material property
                  const updateStandardProp = (
                    prop: keyof StandardMaterialProps,
                    value: StandardMaterialProps[keyof StandardMaterialProps],
                  ) => {
                    updateObject(primaryId, {
                      material: { ...mat, type: "standard", [prop]: value },
                    });
                  };

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
                              updateStandardProp("color", result.data);
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
                            updateStandardProp(
                              "metalness",
                              parseFloat(e.target.value),
                            );
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
                            updateStandardProp(
                              "roughness",
                              parseFloat(e.target.value),
                            );
                          }}
                          style={{
                            width: "100%",
                            height: "12px",
                            margin: 0,
                            padding: 0,
                          }}
                        />
                      </Stack>

                      {/* Emissive Section */}
                      <Typography
                        variant="body"
                        sx={{
                          fontSize: "10px",
                          opacity: 0.5,
                          padding: "8px 4px 2px 4px",
                          borderTop: "1px solid rgba(255,255,255,0.1)",
                          marginTop: "4px",
                        }}
                      >
                        Emissive
                      </Typography>

                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
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
                            value={mat.emissive ?? "#000000"}
                            onChange={(e) => {
                              const result = HexColorSchema.safeParse(
                                e.target.value,
                              );
                              if (!result.success) return;
                              updateStandardProp("emissive", result.data);
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
                            {mat.emissive ?? "#000000"}
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
                          Emissive Intensity:{" "}
                          {(mat.emissiveIntensity ?? 0).toFixed(2)}
                        </Typography>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={mat.emissiveIntensity ?? 0}
                          onMouseDown={beginTransaction}
                          onMouseUp={commitTransaction}
                          onChange={(e) => {
                            updateStandardProp(
                              "emissiveIntensity",
                              parseFloat(e.target.value),
                            );
                          }}
                          style={{
                            width: "100%",
                            height: "12px",
                            margin: 0,
                            padding: 0,
                          }}
                        />
                      </Stack>

                      {/* Transparency Section */}
                      <Typography
                        variant="body"
                        sx={{
                          fontSize: "10px",
                          opacity: 0.5,
                          padding: "8px 4px 2px 4px",
                          borderTop: "1px solid rgba(255,255,255,0.1)",
                          marginTop: "4px",
                        }}
                      >
                        Transparency
                      </Typography>

                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          Opacity: {(mat.opacity ?? 1).toFixed(2)}
                        </Typography>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={mat.opacity ?? 1}
                          onMouseDown={beginTransaction}
                          onMouseUp={commitTransaction}
                          onChange={(e) => {
                            updateStandardProp(
                              "opacity",
                              parseFloat(e.target.value),
                            );
                          }}
                          style={{
                            width: "100%",
                            height: "12px",
                            margin: 0,
                            padding: 0,
                          }}
                        />
                      </Stack>

                      <Stack
                        gap={0}
                        sx={{
                          padding: "0 4px 4px 4px",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={mat.transparent ?? false}
                          onChange={(e) => {
                            updateStandardProp("transparent", e.target.checked);
                          }}
                          style={{
                            width: "12px",
                            height: "12px",
                            margin: 0,
                            marginRight: "6px",
                          }}
                        />
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          Transparent
                        </Typography>
                      </Stack>

                      {/* Rendering Section */}
                      <Typography
                        variant="body"
                        sx={{
                          fontSize: "10px",
                          opacity: 0.5,
                          padding: "8px 4px 2px 4px",
                          borderTop: "1px solid rgba(255,255,255,0.1)",
                          marginTop: "4px",
                        }}
                      >
                        Rendering
                      </Typography>

                      <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: "11px",
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          Side
                        </Typography>
                        <select
                          value={mat.side ?? "double"}
                          onChange={(e) => {
                            updateStandardProp(
                              "side",
                              e.target.value as "front" | "back" | "double",
                            );
                          }}
                          style={{
                            fontSize: "11px",
                            padding: "2px 4px",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "2px",
                            color: "inherit",
                          }}
                        >
                          <option value="front">Front</option>
                          <option value="back">Back</option>
                          <option value="double">Double</option>
                        </select>
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
                            if (!mat.shaderName) return;
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
                              <ConfirmableNumberInput
                                value={uniform.value as number}
                                onChange={(val) =>
                                  handleUniformChange(name, "value", val)
                                }
                                step={uniform.step ?? 0.1}
                                width="50px"
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
                                uniforms: mat.uniforms,
                                transparent: e.target.checked,
                              };
                              if (mat.shaderName)
                                newMat.shaderName = mat.shaderName;
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
                                uniforms: mat.uniforms,
                                side: e.target.value as
                                  | "front"
                                  | "back"
                                  | "double",
                              };
                              if (mat.shaderName)
                                newMat.shaderName = mat.shaderName;
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
