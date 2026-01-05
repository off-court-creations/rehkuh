import { useState } from "react";
import { Panel, Stack, Typography, Button, Box } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import { OutlinerNode } from "./OutlinerNode";
import type { PrimitiveType, TPJFile } from "@/types";
import { validateTPJFile } from "@/schemas/tpj";
import { showError } from "@/store/notificationStore";

export function Outliner() {
  const rootObjects = useSceneStore((state) =>
    Object.values(state.objects).filter((o) => o.parentId === null),
  );
  const addObject = useSceneStore((state) => state.addObject);
  const reparent = useSceneStore((state) => state.reparentObject);
  const clearScene = useSceneStore((state) => state.clearScene);
  const serializeSceneAsTPJ = useSceneStore(
    (state) => state.serializeSceneAsTPJ,
  );
  const loadFromTPJ = useSceneStore((state) => state.loadFromTPJ);
  const undo = useSceneStore((state) => state.undo);
  const redo = useSceneStore((state) => state.redo);
  const canUndo = useSceneStore((state) => state.history.past.length > 0);
  const canRedo = useSceneStore((state) => state.history.future.length > 0);

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
    const tpj = serializeSceneAsTPJ();

    // Validate before export
    let parsed: unknown;
    try {
      parsed = JSON.parse(tpj);
    } catch {
      showError("Cannot export: Invalid JSON");
      return;
    }

    const validation = validateTPJFile(parsed);
    if (!validation.success) {
      showError(`Cannot export: ${validation.error}`);
      return;
    }

    // Get scene name from metadata for filename
    const sceneName = validation.data.metadata.name || "scene";

    try {
      const picker = (
        window as unknown as {
          showSaveFilePicker?: (options?: unknown) => Promise<unknown>;
        }
      ).showSaveFilePicker;

      if (typeof picker === "function") {
        const handle = (await picker({
          suggestedName: `${sceneName}.tpj`,
          types: [
            {
              description: "Three Primitive JSON",
              accept: { "application/json": [".tpj"] },
            },
          ],
        })) as {
          createWritable: () => Promise<{
            write: (data: string) => Promise<void>;
            close: () => Promise<void>;
          }>;
        };

        const writable = await handle.createWritable();
        await writable.write(tpj);
        await writable.close();
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }

    const blob = new Blob([tpj], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sceneName}.tpj`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportTPJ = async () => {
    try {
      const picker = (
        window as unknown as {
          showOpenFilePicker?: (options?: unknown) => Promise<unknown[]>;
        }
      ).showOpenFilePicker;

      let fileContent: string;

      if (typeof picker === "function") {
        const handles = (await picker({
          types: [
            {
              description: "Three Primitive JSON",
              accept: { "application/json": [".tpj"] },
            },
          ],
          multiple: false,
        })) as Array<{ getFile: () => Promise<File> }>;

        const handle = handles[0];
        if (!handle) {
          return;
        }
        const file = await handle.getFile();
        fileContent = await file.text();
      } else {
        // Fallback for browsers without File System Access API
        fileContent = await new Promise<string>((resolve, reject) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".tpj,application/json";
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) {
              reject(new Error("No file selected"));
              return;
            }
            resolve(await file.text());
          };
          input.click();
        });
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(fileContent);
      } catch {
        showError("Import failed: Invalid JSON");
        return;
      }

      const validation = validateTPJFile(parsed);
      if (!validation.success) {
        showError(`Import failed: ${validation.error}`);
        return;
      }

      loadFromTPJ(validation.data as TPJFile);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      showError(
        `Import failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
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
                opacity: canUndo ? 1 : 0.4,
              }}
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              Undo
            </Button>
            <Button
              size="sm"
              sx={{
                padding: "0 4px",
                minHeight: "16px",
                fontSize: "11px",
                lineHeight: "16px",
                opacity: canRedo ? 1 : 0.4,
              }}
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
            >
              Redo
            </Button>
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
              onClick={handleImportTPJ}
            >
              Import
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
