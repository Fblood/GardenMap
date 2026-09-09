import { useRef } from "react";

const PX_PER_FT = 28;

function GardenBed({ bed, selected, onSelect, onMove }) {
  const dragRef = useRef(null);

  function handlePointerDown(e) {
    e.stopPropagation();
    onSelect(bed.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = bed.x;
    const originY = bed.y;
    dragRef.current = { startX, startY, originX, originY };

    function handlePointerMove(ev) {
      const d = dragRef.current;
      if (!d) return;
      const dx = ev.clientX - d.startX;
      const dy = ev.clientY - d.startY;
      onMove(bed.id, Math.max(0, d.originX + dx), Math.max(0, d.originY + dy));
    }
    function handlePointerUp() {
      dragRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  const plantingCount = bed.plantings.length;

  return (
    <div
      className={"garden-bed" + (selected ? " selected" : "")}
      style={{
        left: bed.x,
        top: bed.y,
        width: bed.widthFt * PX_PER_FT,
        height: bed.heightFt * PX_PER_FT,
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="garden-bed-label">
        <span className="garden-bed-name">{bed.name}</span>
        <span className="garden-bed-dims">{bed.widthFt}×{bed.heightFt}ft</span>
      </div>
      <div className="garden-bed-count">
        {plantingCount === 0 ? "empty" : `${plantingCount} planting${plantingCount === 1 ? "" : "s"}`}
      </div>
    </div>
  );
}

export { PX_PER_FT };
export default GardenBed;
