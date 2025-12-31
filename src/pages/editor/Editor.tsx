import { useEffect, useCallback } from "react";
import { Surface, Box } from "@archway/valet";
import { Viewport } from "@/components/editor/Viewport";
import { Outliner } from "@/components/editor/Outliner";
import { PropertyPanel } from "@/components/editor/PropertyPanel";
import { useSceneStore } from "@/store/sceneStore";

export default function Editor() {
  const loadScene = useSceneStore((s) => s.loadScene);
  const isLoaded = useSceneStore((s) => s.isLoaded);

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
      console.log("[Clay] Scene file changed externally, reloading...");
      reloadScene();
    };

    import.meta.hot.on("scene-changed", handleSceneChanged);

    // Cleanup listener on unmount
    return () => {
      import.meta.hot?.off?.("scene-changed", handleSceneChanged);
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
    </Surface>
  );
}
