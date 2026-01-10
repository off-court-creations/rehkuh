import { useEffect, useCallback } from "react";
import { Surface, Box } from "@archway/valet";
import { Viewport } from "@/components/editor/Viewport";
import { Outliner } from "@/components/editor/Outliner";
import { PropertyPanel } from "@/components/editor/PropertyPanel";
import { GlobalSnackbar } from "@/components/GlobalSnackbar";
import { useSceneStore } from "@/store/sceneStore";
import { useUndoRedoKeyboard } from "@/hooks/useUndoRedoKeyboard";

export default function Editor() {
  const loadScene = useSceneStore((s) => s.loadScene);
  const isLoaded = useSceneStore((s) => s.isLoaded);

  useUndoRedoKeyboard();

  // Reload scene from file
  const reloadScene = useCallback(async () => {
    // Clear current state and reload
    useSceneStore.setState({ objects: {}, isLoaded: false });
    await loadScene();
  }, [loadScene]);

  useEffect(() => {
    if (!isLoaded) {
      loadScene();
    }
  }, [isLoaded, loadScene]);

  // Listen for file changes from Vite HMR
  useEffect(() => {
    if (!import.meta.hot) return;

    const handleSceneChanged = () => {
      console.log("[rehkuh] Scene file changed externally, reloading...");
      reloadScene();
    };

    const handleShaderChanged = (data: {
      shaderName: string;
      shaderType: "vert" | "frag";
      content: string;
    }) => {
      console.log(
        `[Clay] Shader changed: ${data.shaderName}.${data.shaderType}`,
      );

      // Update all objects using this shader
      const state = useSceneStore.getState();
      const updates: Record<
        string,
        { material: (typeof state.objects)[string]["material"] }
      > = {};

      for (const [id, obj] of Object.entries(state.objects)) {
        if (
          obj.material?.type === "shader" &&
          obj.material.shaderName === data.shaderName
        ) {
          const newMaterial = { ...obj.material };
          if (data.shaderType === "vert") {
            newMaterial.vertex = data.content;
          } else {
            newMaterial.fragment = data.content;
          }
          updates[id] = { material: newMaterial };
        }
      }

      // Apply all updates
      if (Object.keys(updates).length > 0) {
        const newObjects = { ...state.objects };
        for (const [id, update] of Object.entries(updates)) {
          const existing = newObjects[id];
          if (existing) {
            newObjects[id] = { ...existing, material: update.material };
          }
        }
        useSceneStore.setState({ objects: newObjects });
      }
    };

    import.meta.hot.on("scene-changed", handleSceneChanged);
    import.meta.hot.on("shader-changed", handleShaderChanged);

    // Cleanup listeners on unmount
    return () => {
      import.meta.hot?.off?.("scene-changed", handleSceneChanged);
      import.meta.hot?.off?.("shader-changed", handleShaderChanged);
    };
  }, [reloadScene]);
  return (
    <Surface>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Box
          sx={{
            width: "300px",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Outliner />
          <PropertyPanel />
        </Box>
        <div style={{ flex: 1, position: "relative" }}>
          <Viewport />
        </div>
      </div>
      <GlobalSnackbar />
    </Surface>
  );
}
