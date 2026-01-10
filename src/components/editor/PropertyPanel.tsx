import { Panel, Stack, Typography, Button, Box } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import type {
  TransformMode,
  StandardMaterialProps,
  ShaderMaterialProps,
  ShaderUniform,
} from "@/types";
import { isShaderMaterial, isStandardMaterial } from "@/types";
import { HexColorSchema } from "@/schemas/scene";

// Default standard material
const DEFAULT_STANDARD_MATERIAL: StandardMaterialProps = {
  type: "standard",
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

  const handleMaterialTypeChange = (newType: "standard" | "shader") => {
    if (!obj || !primaryId) return;

    if (newType === "standard" && isShaderMaterial(obj.material)) {
      // Convert shader to standard
      updateObject(primaryId, { material: DEFAULT_STANDARD_MATERIAL });
    } else if (newType === "shader" && isStandardMaterial(obj.material)) {
      // Convert standard to shader, preserve color as baseColor
      const shaderMat: ShaderMaterialProps = {
        ...DEFAULT_SHADER_MATERIAL,
        shaderName: obj.name.replace(/[^a-zA-Z0-9_]/g, "_"),
        uniforms: {
          ...DEFAULT_SHADER_MATERIAL.uniforms,
          baseColor: { type: "color", value: obj.material.color },
        },
      };
      updateObject(primaryId, { material: shaderMat });
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
  const materialType = isShaderMaterial(obj.material) ? "shader" : "standard";

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
            {/* Material Type Toggle */}
            <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
              <Typography
                variant="body"
                sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
              >
                Material Type
              </Typography>
              <Stack direction="row" gap={0} sx={{ padding: 0 }}>
                <Button
                  size="sm"
                  sx={{
                    padding: "0 4px",
                    minHeight: "16px",
                    fontSize: "11px",
                    lineHeight: "16px",
                    backgroundColor:
                      materialType === "standard"
                        ? "rgba(75, 208, 210, 0.3)"
                        : "transparent",
                  }}
                  onClick={() => handleMaterialTypeChange("standard")}
                >
                  Standard
                </Button>
                <Button
                  size="sm"
                  sx={{
                    padding: "0 4px",
                    minHeight: "16px",
                    fontSize: "11px",
                    lineHeight: "16px",
                    backgroundColor:
                      materialType === "shader"
                        ? "rgba(75, 208, 210, 0.3)"
                        : "transparent",
                  }}
                  onClick={() => handleMaterialTypeChange("shader")}
                >
                  Shader
                </Button>
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
                        sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
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
                        sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
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
                        sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
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

            {/* Shader Material Properties */}
            {isShaderMaterial(obj.material) &&
              (() => {
                const mat = obj.material;
                return (
                  <>
                    <Stack gap={0} sx={{ padding: "0 4px 4px 4px" }}>
                      <Typography
                        variant="body"
                        sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
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
                        sx={{ fontSize: "11px", lineHeight: 1.2, opacity: 0.7 }}
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
    </Panel>
  );
}
