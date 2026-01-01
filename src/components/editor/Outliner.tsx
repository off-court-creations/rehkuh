import { useState } from "react";
import { Panel, Stack, Typography, Button, Box } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import { OutlinerNode } from "./OutlinerNode";
import type { PrimitiveType } from "@/types";

export function Outliner() {
  const rootObjects = useSceneStore((state) =>
    Object.values(state.objects).filter((o) => o.parentId === null),
  );
  const addObject = useSceneStore((state) => state.addObject);
  const reparent = useSceneStore((state) => state.reparentObject);
  const clearScene = useSceneStore((state) => state.clearScene);
  const serializeScene = useSceneStore((state) => state.serializeScene);

  const [isDragOverRoot, setIsDragOverRoot] = useState(false);

  const handleAddPrimitive = (type: PrimitiveType | "group") => {
    addObject({ type });
  };

  const handleClearScene = () => {
    const shouldClear = window.confirm(
      "Clear the scene? This cannot be undone.",
    );
    if (!shouldClear) return;
    clearScene();
  };

  const handleExportScene = async () => {
    const json = serializeScene();

    try {
      const picker = (
        window as unknown as {
          showSaveFilePicker?: (options?: unknown) => Promise<unknown>;
        }
      ).showSaveFilePicker;

      if (typeof picker === "function") {
        const handle = (await picker({
          suggestedName: "scene.json",
          types: [
            {
              description: "JSON",
              accept: { "application/json": [".json"] },
            },
          ],
        })) as {
          createWritable: () => Promise<{
            write: (data: string) => Promise<void>;
            close: () => Promise<void>;
          }>;
        };

        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scene.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDropToRoot = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverRoot(false);
    const draggedId = e.dataTransfer.getData("objectId");
    if (draggedId) {
      reparent(draggedId, null);
    }
  };

  const handleDragOverRoot = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverRoot(true);
  };

  const handleDragLeaveRoot = () => {
    setIsDragOverRoot(false);
  };

  return (
    <Panel
      onDrop={handleDropToRoot}
      onDragOver={handleDragOverRoot}
      onDragLeave={handleDragLeaveRoot}
      sx={{
        flex: 1,
        overflow: "auto",
        padding: 0,
        minHeight: 0,
        backgroundColor: isDragOverRoot
          ? "rgba(75, 208, 210, 0.06)"
          : undefined,
      }}
    >
      <Stack gap={0} sx={{ padding: 0 }}>
        <Stack
          direction="row"
          gap={0}
          sx={{
            padding: 0,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle"
            sx={{
              padding: 0,
              margin: 0,
              fontSize: "11px",
              lineHeight: 1.2,
              opacity: 0.8,
              userSelect: "none",
            }}
          >
            Scene
          </Typography>
          <Stack direction="row" gap={0} sx={{ padding: 0 }}>
            <Button
              size="sm"
              sx={{
                padding: "0 4px",
                minHeight: "16px",
                fontSize: "11px",
                lineHeight: "16px",
              }}
              onClick={handleClearScene}
            >
              Clear
            </Button>
            <Button
              size="sm"
              sx={{
                padding: "0 4px",
                minHeight: "16px",
                fontSize: "11px",
                lineHeight: "16px",
              }}
              onClick={handleExportScene}
            >
              Export
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" gap={0} sx={{ flexWrap: "wrap", padding: 0 }}>
          <Button
            size="sm"
            sx={{ padding: 0, minHeight: "16px", fontSize: "11px" }}
            onClick={() => handleAddPrimitive("box")}
          >
            Box
          </Button>
          <Button
            size="sm"
            sx={{ padding: 0, minHeight: "16px", fontSize: "11px" }}
            onClick={() => handleAddPrimitive("sphere")}
          >
            Sphere
          </Button>
          <Button
            size="sm"
            sx={{ padding: 0, minHeight: "16px", fontSize: "11px" }}
            onClick={() => handleAddPrimitive("cylinder")}
          >
            Cylinder
          </Button>
          <Button
            size="sm"
            sx={{ padding: 0, minHeight: "16px", fontSize: "11px" }}
            onClick={() => handleAddPrimitive("cone")}
          >
            Cone
          </Button>
          <Button
            size="sm"
            sx={{ padding: 0, minHeight: "16px", fontSize: "11px" }}
            onClick={() => handleAddPrimitive("torus")}
          >
            Torus
          </Button>
          <Button
            size="sm"
            sx={{ padding: 0, minHeight: "16px", fontSize: "11px" }}
            onClick={() => handleAddPrimitive("plane")}
          >
            Plane
          </Button>
          <Button
            size="sm"
            sx={{ padding: 0, minHeight: "16px", fontSize: "11px" }}
            onClick={() => handleAddPrimitive("group")}
          >
            Group
          </Button>
        </Stack>

        <Box sx={{ padding: 0 }}>
          {rootObjects.length === 0 ? (
            <Typography
              variant="body"
              sx={{
                opacity: 0.5,
                fontStyle: "italic",
                fontSize: "11px",
                padding: "2px 4px",
              }}
            >
              No objects in scene
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {rootObjects.map((obj) => (
                <OutlinerNode key={obj.id} id={obj.id} depth={0} />
              ))}
            </Box>
          )}
        </Box>
      </Stack>
    </Panel>
  );
}
