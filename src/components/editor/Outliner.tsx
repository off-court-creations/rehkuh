import { useState } from "react";
import { Typography } from "@archway/valet";
import { useSceneStore } from "@/store/sceneStore";
import { OutlinerNode } from "./OutlinerNode";

export function Outliner() {
  const rootObjects = useSceneStore((state) =>
    Object.values(state.objects).filter((o) => o.parentId === null),
  );
  const reparent = useSceneStore((state) => state.reparentObject);

  const [isDragOverRoot, setIsDragOverRoot] = useState(false);

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
    <div
      onDrop={handleDropToRoot}
      onDragOver={handleDragOverRoot}
      onDragLeave={handleDragLeaveRoot}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: 0,
        backgroundColor: isDragOverRoot
          ? "rgba(75, 208, 210, 0.06)"
          : "transparent",
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: "8px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          opacity: 0.9,
          userSelect: "none",
        }}
      >
        <Typography variant="body" sx={{ fontSize: "12px" }}>
          Scene Outliner
        </Typography>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          padding: "4px 0",
        }}
      >
        {rootObjects.length === 0 ? (
          <div
            style={{
              opacity: 0.5,
              fontStyle: "italic",
              fontSize: "11px",
              padding: "8px 12px",
            }}
          >
            No objects in scene
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {rootObjects.map((obj) => (
              <OutlinerNode key={obj.id} id={obj.id} depth={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
