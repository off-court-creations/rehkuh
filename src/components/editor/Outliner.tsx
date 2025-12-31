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

  const [isDragOverRoot, setIsDragOverRoot] = useState(false);

  const handleAddPrimitive = (type: PrimitiveType | "group") => {
    addObject({ type });
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
    <Panel sx={{ flex: 1, overflow: "auto", padding: "12px", minHeight: 0 }}>
      <Stack gap={2}>
        <Typography variant="subtitle">Scene</Typography>

        <Stack direction="row" gap={1} sx={{ flexWrap: "wrap" }}>
          <Button size="sm" onClick={() => handleAddPrimitive("box")}>
            Box
          </Button>
          <Button size="sm" onClick={() => handleAddPrimitive("sphere")}>
            Sphere
          </Button>
          <Button size="sm" onClick={() => handleAddPrimitive("cylinder")}>
            Cylinder
          </Button>
          <Button size="sm" onClick={() => handleAddPrimitive("cone")}>
            Cone
          </Button>
          <Button size="sm" onClick={() => handleAddPrimitive("torus")}>
            Torus
          </Button>
          <Button size="sm" onClick={() => handleAddPrimitive("plane")}>
            Plane
          </Button>
          <Button size="sm" onClick={() => handleAddPrimitive("group")}>
            Group
          </Button>
        </Stack>

        <Box sx={{ marginTop: "8px" }}>
          {rootObjects.length === 0 ? (
            <Typography
              variant="body"
              sx={{ opacity: 0.5, fontStyle: "italic" }}
            >
              No objects in scene
            </Typography>
          ) : (
            <Stack gap={0}>
              {rootObjects.map((obj) => (
                <OutlinerNode key={obj.id} id={obj.id} depth={0} />
              ))}
            </Stack>
          )}

          {/* Drop zone to make items root-level */}
          <Box
            onDrop={handleDropToRoot}
            onDragOver={handleDragOverRoot}
            onDragLeave={handleDragLeaveRoot}
            sx={{
              marginTop: "8px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px dashed",
              borderColor: isDragOverRoot
                ? "rgba(75, 208, 210, 0.6)"
                : "rgba(255,255,255,0.2)",
              backgroundColor: isDragOverRoot
                ? "rgba(75, 208, 210, 0.1)"
                : "transparent",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body"
              sx={{ fontSize: "11px", opacity: 0.5, userSelect: "none" }}
            >
              Drop here for root level
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Panel>
  );
}
