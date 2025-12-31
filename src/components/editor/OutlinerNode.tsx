import { useState } from "react";
import { Box, Stack, Typography, Icon } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";

interface OutlinerNodeProps {
  id: string;
  depth: number;
}

export function OutlinerNode({ id, depth }: OutlinerNodeProps) {
  const obj = useSceneStore((state) => state.objects[id]);
  const children = useSceneStore((state) =>
    Object.values(state.objects).filter((o) => o.parentId === id),
  );
  const isSelected = useSceneStore((state) =>
    state.selection.selectedIds.includes(id),
  );
  const select = useSceneStore((state) => state.select);
  const reparent = useSceneStore((state) => state.reparentObject);
  const removeObject = useSceneStore((state) => state.removeObject);

  const [expanded, setExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    select(id, e.shiftKey);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("objectId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const draggedId = e.dataTransfer.getData("objectId");
    if (draggedId && draggedId !== id) {
      reparent(draggedId, id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeObject(id);
  };

  if (!obj) return null;

  const hasChildren = children.length > 0;
  const isGroup = obj.type === "group";

  return (
    <Box>
      <Box
        draggable
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        sx={{
          paddingLeft: `${depth * 16 + 4}px`,
          paddingRight: "4px",
          paddingTop: "4px",
          paddingBottom: "4px",
          cursor: "pointer",
          backgroundColor: isDragOver
            ? "rgba(75, 208, 210, 0.3)"
            : isSelected
              ? "rgba(75, 208, 210, 0.2)"
              : "transparent",
          borderRadius: "4px",
        }}
      >
        <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
          {hasChildren ? (
            <Box
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Icon
                icon={expanded ? "mdi:chevron-down" : "mdi:chevron-right"}
                size="sm"
              />
            </Box>
          ) : (
            <Box sx={{ width: "20px" }} />
          )}
          <Icon
            icon={isGroup ? "mdi:folder-outline" : "mdi:cube-outline"}
            size="sm"
          />
          <Typography
            variant="body"
            sx={{ flex: 1, fontSize: "13px", userSelect: "none" }}
          >
            {obj.name}
          </Typography>
          {isSelected && (
            <Box
              onClick={handleDelete}
              sx={{
                cursor: "pointer",
                opacity: 0.7,
              }}
            >
              <Icon icon="mdi:close" size="sm" />
            </Box>
          )}
        </Stack>
      </Box>

      {expanded &&
        children.map((child) => (
          <OutlinerNode key={child.id} id={child.id} depth={depth + 1} />
        ))}
    </Box>
  );
}
