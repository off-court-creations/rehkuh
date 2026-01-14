import { Stack, Typography, Button, Box, Checkbox, Select } from "@archway/valet";
import type { SceneObject, ShaderMaterialProps, ShaderUniform } from "@/types";
import { useSettingsStore } from "@/store/settingsStore";
import { showError } from "@/store/notificationStore";
import { ConfirmableNumberInput } from "../ConfirmableNumberInput";
import { compactLabelSx, fieldLabelSx } from "./styles";

interface ShaderMaterialSectionProps {
  obj: SceneObject;
  primaryId: string;
  updateObject: (id: string, update: Partial<SceneObject>) => void;
}

export function ShaderMaterialSection({
  obj,
  primaryId,
  updateObject,
}: ShaderMaterialSectionProps) {
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

      if (obj && primaryId && obj.material.type === "shader") {
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
    if (!obj || !primaryId || obj.material.type !== "shader") return;

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
    if (!obj || !primaryId || obj.material.type !== "shader") return;

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
    if (!obj || !primaryId || obj.material.type !== "shader") return;

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
    if (mat.transparent !== undefined) newMaterial.transparent = mat.transparent;
    if (mat.side) newMaterial.side = mat.side;
    if (mat.depthWrite !== undefined) newMaterial.depthWrite = mat.depthWrite;
    if (mat.depthTest !== undefined) newMaterial.depthTest = mat.depthTest;
    updateObject(primaryId, { material: newMaterial });
  };

  const mat = obj.material;
  if (mat.type !== "shader") return null;

  return (
    <>
      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Shader: {mat.shaderName}
        </Typography>
        <Button
          size="sm"
          sx={{
            padding: "1px 6px",
            minHeight: "18px",
            fontSize: "10px",
            lineHeight: "16px",
            fontWeight: 600,
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

      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body" sx={fieldLabelSx}>
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
                  handleUniformChange(name, "value", e.target.value)
                }
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
            )}

            {uniform.type === "float" && (
              <ConfirmableNumberInput
                value={uniform.value as number}
                onChange={(val) => handleUniformChange(name, "value", val)}
                step={uniform.step ?? 0.1}
                width="50px"
              />
            )}

            {uniform.animated && (
              <Typography
                variant="body"
                sx={{ fontSize: "10px", opacity: 0.65 }}
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
                opacity: 0.65,
              }}
              onClick={() => handleRemoveUniform(name)}
            >
              ×
            </Button>
          </Box>
        ))}
      </Stack>

      {/* Shader Options */}
      <Stack gap={0} sx={{ padding: "0 4px 2px 4px" }}>
        <Typography variant="body" sx={fieldLabelSx}>
          Options
        </Typography>
        <Checkbox
          size="xs"
          checked={mat.transparent ?? false}
          onValueChange={(value) => {
            const newMat: ShaderMaterialProps = {
              type: "shader",
              uniforms: mat.uniforms,
              transparent: value,
            };
            if (mat.shaderName) newMat.shaderName = mat.shaderName;
            if (mat.vertex) newMat.vertex = mat.vertex;
            if (mat.fragment) newMat.fragment = mat.fragment;
            if (mat.side) newMat.side = mat.side;
            if (mat.depthWrite !== undefined) newMat.depthWrite = mat.depthWrite;
            if (mat.depthTest !== undefined) newMat.depthTest = mat.depthTest;
            updateObject(primaryId, { material: newMat });
          }}
          label={
            <Typography variant="body" sx={compactLabelSx}>
              Transparent
            </Typography>
          }
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "2px",
          }}
        >
          <Typography variant="body" sx={{ ...compactLabelSx, minWidth: "30px" }}>
            Side:
          </Typography>
          <Select
            size="xs"
            value={mat.side ?? "front"}
            onValueChange={(value) => {
              const newMat: ShaderMaterialProps = {
                type: "shader",
                uniforms: mat.uniforms,
                side: value as "front" | "back" | "double",
              };
              if (mat.shaderName) newMat.shaderName = mat.shaderName;
              if (mat.vertex) newMat.vertex = mat.vertex;
              if (mat.fragment) newMat.fragment = mat.fragment;
              if (mat.transparent !== undefined)
                newMat.transparent = mat.transparent;
              if (mat.depthWrite !== undefined) newMat.depthWrite = mat.depthWrite;
              if (mat.depthTest !== undefined) newMat.depthTest = mat.depthTest;
              updateObject(primaryId, { material: newMat });
            }}
          >
            <Select.Option value="front">Front</Select.Option>
            <Select.Option value="back">Back</Select.Option>
            <Select.Option value="double">Double</Select.Option>
          </Select>
        </Box>
      </Stack>
    </>
  );
}
