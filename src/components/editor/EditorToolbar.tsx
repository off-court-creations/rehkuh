import { Button, Stack, Box } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import { validateTSPFile } from "@/schemas/tsp";
import { showError } from "@/store/notificationStore";
import type { PrimitiveType, TSPFile } from "@/types";

interface EditorToolbarProps {
  section: "left" | "right";
}

export function EditorToolbar({ section }: EditorToolbarProps) {
  const addObject = useSceneStore((state) => state.addObject);
  const clearScene = useSceneStore((state) => state.clearScene);
  const serializeSceneAsTSP = useSceneStore(
    (state) => state.serializeSceneAsTSP,
  );
  const loadFromTSP = useSceneStore((state) => state.loadFromTSP);
  const undo = useSceneStore((state) => state.undo);
  const redo = useSceneStore((state) => state.redo);
  const canUndo = useSceneStore((state) => state.history.past.length > 0);
  const canRedo = useSceneStore((state) => state.history.future.length > 0);

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
    const tsp = serializeSceneAsTSP();

    let parsed: unknown;
    try {
      parsed = JSON.parse(tsp);
    } catch {
      showError("Cannot export: Invalid JSON");
      return;
    }

    const validation = validateTSPFile(parsed);
    if (!validation.success) {
      showError(`Cannot export: ${validation.error}`);
      return;
    }

    const sceneName = validation.data.metadata.name || "scene";

    try {
      const picker = (
        window as unknown as {
          showSaveFilePicker?: (options?: unknown) => Promise<unknown>;
        }
      ).showSaveFilePicker;

      if (typeof picker === "function") {
        const handle = (await picker({
          suggestedName: `${sceneName}.tsp`,
          types: [
            {
              description: "Three Shaded Primitive",
              accept: { "application/json": [".tsp"] },
            },
          ],
        })) as {
          createWritable: () => Promise<{
            write: (data: string) => Promise<void>;
            close: () => Promise<void>;
          }>;
        };

        const writable = await handle.createWritable();
        await writable.write(tsp);
        await writable.close();
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }

    const blob = new Blob([tsp], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sceneName}.tsp`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportTSP = async () => {
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
              description: "Three Shaded Primitive",
              accept: { "application/json": [".tsp"] },
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
        fileContent = await new Promise<string>((resolve, reject) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".tsp,application/json";
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

      const validation = validateTSPFile(parsed);
      if (!validation.success) {
        showError(`Import failed: ${validation.error}`);
        return;
      }

      loadFromTSP(validation.data as TSPFile);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      showError(
        `Import failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  if (section === "left") {
    return (
      <Stack direction="row" gap={1}>
        <Button
          size="sm"
          variant="plain"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </Button>
        <Button
          size="sm"
          variant="plain"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          Redo
        </Button>
        <Box
          sx={{
            width: "1px",
            height: "20px",
            backgroundColor: "rgba(255,255,255,0.2)",
            alignSelf: "center",
          }}
        />
        <Button size="sm" variant="plain" onClick={handleClearScene}>
          Clear
        </Button>
        <Button size="sm" variant="plain" onClick={handleImportTSP}>
          Import
        </Button>
        <Button size="sm" variant="plain" onClick={handleExportScene}>
          Export
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" gap={1}>
      <Button
        size="sm"
        variant="plain"
        onClick={() => handleAddPrimitive("box")}
      >
        Box
      </Button>
      <Button
        size="sm"
        variant="plain"
        onClick={() => handleAddPrimitive("sphere")}
      >
        Sphere
      </Button>
      <Button
        size="sm"
        variant="plain"
        onClick={() => handleAddPrimitive("cylinder")}
      >
        Cylinder
      </Button>
      <Button
        size="sm"
        variant="plain"
        onClick={() => handleAddPrimitive("cone")}
      >
        Cone
      </Button>
      <Button
        size="sm"
        variant="plain"
        onClick={() => handleAddPrimitive("torus")}
      >
        Torus
      </Button>
      <Button
        size="sm"
        variant="plain"
        onClick={() => handleAddPrimitive("plane")}
      >
        Plane
      </Button>
      <Button
        size="sm"
        variant="plain"
        onClick={() => handleAddPrimitive("group")}
      >
        Group
      </Button>
    </Stack>
  );
}
