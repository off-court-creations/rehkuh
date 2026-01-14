import { useState, useRef, useEffect } from "react";
import {
  Button,
  Stack,
  Tooltip,
  IconButton,
  Divider,
  Box,
  Icon,
  Typography,
} from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import { useSettingsStore } from "@/store/settingsStore";
import { validateTSPFile } from "@/schemas/tsp";
import { showError, showSuccess } from "@/store/notificationStore";
import { SettingsModal } from "./SettingsModal";
import type { PrimitiveType, TSPFile } from "@/types";

interface PrimitiveOption {
  label: string;
  type: PrimitiveType | "group";
  icon: string;
}

function CreateMenuItem({
  option,
  onClick,
}: {
  option: PrimitiveOption;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "background-color 0.15s",
        backgroundColor: hovered ? "rgba(255,255,255,0.08)" : "transparent",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Icon icon={option.icon} size="sm" />
      <Typography variant="body" sx={{ fontSize: "13px" }}>
        {option.label}
      </Typography>
    </Box>
  );
}

const PRIMITIVE_OPTIONS: PrimitiveOption[] = [
  { label: "Group", type: "group", icon: "mdi:folder-outline" },
  { label: "Box", type: "box", icon: "mdi:cube-outline" },
  { label: "Sphere", type: "sphere", icon: "mdi:sphere" },
  { label: "Cylinder", type: "cylinder", icon: "mdi:cylinder" },
  { label: "Cone", type: "cone", icon: "mdi:cone" },
  { label: "Torus", type: "torus", icon: "mdi:circle-double" },
  { label: "Plane", type: "plane", icon: "mdi:square-outline" },
  { label: "Capsule", type: "capsule", icon: "mdi:pill" },
  { label: "Circle", type: "circle", icon: "mdi:circle-outline" },
  { label: "Ring", type: "ring", icon: "mdi:ring" },
  { label: "Tetrahedron", type: "tetrahedron", icon: "mdi:triangle-outline" },
  { label: "Octahedron", type: "octahedron", icon: "mdi:octagram-outline" },
  {
    label: "Icosahedron",
    type: "icosahedron",
    icon: "mdi:hexagon-multiple-outline",
  },
  { label: "Dodecahedron", type: "dodecahedron", icon: "mdi:pentagon-outline" },
  { label: "Torus Knot", type: "torusKnot", icon: "mdi:infinity" },
];

interface EditorToolbarProps {
  section: "left" | "right";
}

export function EditorToolbar({ section }: EditorToolbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);

  const previewMode = useSettingsStore((state) => state.previewMode);
  const togglePreviewMode = useSettingsStore(
    (state) => state.togglePreviewMode,
  );
  const showGrid = useSettingsStore((state) => state.showGrid);
  const toggleShowGrid = useSettingsStore((state) => state.toggleShowGrid);
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

  // Close menu when clicking outside
  useEffect(() => {
    if (!createMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(e.target as Node)
      ) {
        setCreateMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [createMenuOpen]);

  const handleAddPrimitive = (type: PrimitiveType | "group") => {
    addObject({ type });
    setCreateMenuOpen(false);
  };

  const handleClearScene = async () => {
    const shouldClear = window.confirm(
      "Clear the scene? This cannot be undone.",
    );
    if (!shouldClear) return;

    try {
      await fetch("/__reset-scene-files", { method: "POST" });
    } catch {
      // Non-fatal: fall back to clearing store (which will still POST /__scene)
    }

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

    try {
      if (typeof window.showSaveFilePicker === "function") {
        const handle = await window.showSaveFilePicker({
          suggestedName: "scene.tsp",
          types: [
            {
              description: "Three Shaded Primitive",
              accept: { "application/json": [".tsp"] },
            },
          ],
        });

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
    link.download = "scene.tsp";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyToStaging = async () => {
    try {
      const res = await fetch("/__copy-to-staging", { method: "POST" });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (data.ok) {
        showSuccess(data.message || "Copied to staging");
      } else {
        showError(data.error || "Copy to staging failed");
      }
    } catch (err) {
      showError(
        `Copy to staging failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handlePromoteStaging = async () => {
    try {
      const res = await fetch("/__promote-staging", { method: "POST" });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (data.ok) {
        showSuccess(data.message || "Promoted to live");
      } else {
        showError(data.error || "Promote failed");
      }
    } catch (err) {
      showError(
        `Promote failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleImportTSP = async () => {
    try {
      let fileContent: string;

      if (typeof window.showOpenFilePicker === "function") {
        const handles = await window.showOpenFilePicker({
          types: [
            {
              description: "Three Shaded Primitive",
              accept: { "application/json": [".tsp"] },
            },
          ],
          multiple: false,
        });

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
        <Tooltip
          placement="bottom"
          title={previewMode ? "Edit Mode" : "Preview Mode"}
        >
          <IconButton
            variant={previewMode ? "filled" : "outlined"}
            size="sm"
            icon={previewMode ? "mdi:pencil" : "mdi:eye"}
            onClick={togglePreviewMode}
            aria-label={
              previewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"
            }
          />
        </Tooltip>
        <Tooltip
          placement="bottom"
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <IconButton
            variant={showGrid ? "filled" : "outlined"}
            size="sm"
            icon="mdi:grid"
            onClick={toggleShowGrid}
            aria-label={showGrid ? "Hide Grid" : "Show Grid"}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="Settings">
          <IconButton
            variant="outlined"
            size="sm"
            icon="mdi:cog"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          />
        </Tooltip>
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
        <Divider orientation="vertical" />
        <Button
          size="sm"
          variant="filled"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </Button>
        <Button
          size="sm"
          variant="filled"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          Redo
        </Button>
        <Divider orientation="vertical" />
        <Button size="sm" variant="filled" onClick={handleClearScene}>
          Clear
        </Button>
        <Button size="sm" variant="filled" onClick={handleImportTSP}>
          Import
        </Button>
        <Button size="sm" variant="filled" onClick={handleExportScene}>
          Export
        </Button>
        <Divider orientation="vertical" />
        <Tooltip
          placement="bottom"
          title="Copy scene + shaders to staging for editing"
        >
          <Button size="sm" variant="outlined" onClick={handleCopyToStaging}>
            To Staging
          </Button>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title="Promote staging scene + shaders to live"
        >
          <Button size="sm" variant="outlined" onClick={handlePromoteStaging}>
            Promote
          </Button>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <div ref={createMenuRef} style={{ position: "relative" }}>
      <Tooltip placement="bottom" title="Create Object">
        <IconButton
          variant="filled"
          size="sm"
          icon="mdi:plus"
          onClick={() => setCreateMenuOpen((prev) => !prev)}
          aria-label="Create Object"
          aria-expanded={createMenuOpen}
        />
      </Tooltip>

      {createMenuOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            backgroundColor: "var(--surface-1)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            zIndex: 1000,
            minWidth: "160px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {PRIMITIVE_OPTIONS.map((option) => (
            <CreateMenuItem
              key={option.type}
              option={option}
              onClick={() => handleAddPrimitive(option.type)}
            />
          ))}
        </Box>
      )}
    </div>
  );
}
