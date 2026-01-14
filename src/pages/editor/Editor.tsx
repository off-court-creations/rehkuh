import { useEffect, useCallback } from "react";
import { Surface } from "@archway/valet";
import { Viewport } from "@/components/editor/Viewport";
import { Outliner } from "@/components/editor/Outliner";
import { PropertyPanel } from "@/components/editor/PropertyPanel";
import { GlobalSnackbar } from "@/components/GlobalSnackbar";
import { useSceneStore } from "@/store/sceneStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useUndoRedoKeyboard } from "@/hooks/useUndoRedoKeyboard";
import { EditorToolbar } from "@/components/editor/EditorToolbar";

const SIDEBAR_WIDTH = 280;
const APPBAR_HEIGHT = 48;

export default function Editor() {
  const loadScene = useSceneStore((s) => s.loadScene);
  const isLoaded = useSceneStore((s) => s.isLoaded);
  const previewMode = useSettingsStore((s) => s.previewMode);

  useUndoRedoKeyboard();

  const reloadScene = useCallback(async () => {
    useSceneStore.setState({ objects: {}, isLoaded: false });
    await loadScene();
  }, [loadScene]);

  useEffect(() => {
    if (!isLoaded) {
      loadScene();
    }
  }, [isLoaded, loadScene]);

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

    return () => {
      import.meta.hot?.off?.("scene-changed", handleSceneChanged);
      import.meta.hot?.off?.("shader-changed", handleShaderChanged);
    };
  }, [reloadScene]);

  return (
    <Surface>
      {/* Root container - full viewport */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* AppBar */}
        <div
          style={{
            height: APPBAR_HEIGHT,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            backgroundColor: "rgba(26, 26, 46, 0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <EditorToolbar section="left" />
          <EditorToolbar section="right" />
        </div>

        {/* Main content - horizontal layout */}
        <div
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Left sidebar - Outliner */}
          {!previewMode && (
            <div
              style={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(26, 26, 46, 0.95)",
                overflow: "hidden",
              }}
            >
              <Outliner />
            </div>
          )}

          {/* Center - Viewport */}
          <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
            <Viewport />
          </div>

          {/* Right sidebar - Property Panel */}
          {!previewMode && (
            <div
              style={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(26, 26, 46, 0.95)",
                overflow: "hidden",
              }}
            >
              <PropertyPanel />
            </div>
          )}
        </div>
      </div>

      <GlobalSnackbar />
    </Surface>
  );
}
