import { useState } from "react";
import { Box, Typography, Icon } from "@archway/valet";
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
    <Box sx={{ margin: 0, padding: 0 }}>
      <Box
        draggable
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        sx={{
          paddingLeft: `${depth * 12 + 2}px`,
          paddingRight: "14px",
          paddingTop: 0,
          paddingBottom: 0,
          height: "16px",
          width: "100%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          position: "relative",
          backgroundColor: isDragOver
            ? "rgba(75, 208, 210, 0.3)"
            : isSelected
              ? "rgba(75, 208, 210, 0.2)"
              : "transparent",
          borderRadius: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 0,
            margin: 0,
            padding: 0,
          }}
        >
          {hasChildren ? (
            <Box
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                width: "14px",
              }}
            >
              <Icon
                icon={expanded ? "mdi:chevron-down" : "mdi:chevron-right"}
                size={14}
              />
            </Box>
          ) : (
            <Box sx={{ width: "14px" }} />
          )}
          <Icon
            icon={isGroup ? "mdi:folder-outline" : "mdi:cube-outline"}
            size={14}
            sx={{ marginRight: "2px" }}
          />
          <Typography
            variant="body"
            sx={{
              flex: 1,
              fontSize: "12px",
              lineHeight: "16px",
              userSelect: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {obj.name}
          </Typography>
          {isSelected && (
            <Box
              onClick={handleDelete}
              role="button"
              aria-label="Delete object"
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "14px",
                height: "16px",
                position: "absolute",
                right: 0,
                top: 0,
                opacity: 0.9,
                zIndex: 1,
                backgroundColor: "rgba(0,0,0,0.25)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 13,
                  lineHeight: "16px",
                  fontWeight: 700,
                  userSelect: "none",
                }}
              >
                ×
              </span>
            </Box>
          )}
        </Box>
      </Box>

      {expanded &&
        children.map((child) => (
          <OutlinerNode key={child.id} id={child.id} depth={depth + 1} />
        ))}
    </Box>
  );
}
