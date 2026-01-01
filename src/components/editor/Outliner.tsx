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
