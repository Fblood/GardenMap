import { useState } from "react";

function BedPanel({ bed, onAddPlanting, onDeletePlanting, onDeleteBed, onClose }) {
  const [plant, setPlant] = useState("");
  const [variety, setVariety] = useState("");
  const [datePlanted, setDatePlanted] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!plant.trim()) return;
    onAddPlanting(bed.id, {
      plant: plant.trim(),
      variety: variety.trim(),
      datePlanted,
      notes: notes.trim(),
    });
    setPlant("");
    setVariety("");
    setNotes("");
  }

  const sorted = [...bed.plantings].sort(
    (a, b) => new Date(b.datePlanted) - new Date(a.datePlanted)
  );

  return (
    <div className="bed-panel">
      <div className="bed-panel-header">
        <h2>{bed.name}</h2>
        <button className="icon-btn" onClick={onClose} title="Close">×</button>
      </div>
      <div className="bed-panel-sub">{bed.widthFt}×{bed.heightFt} ft bed</div>

      <form className="planting-form" onSubmit={handleSubmit}>
        <input
          placeholder="Plant (e.g. Tomato)"
          value={plant}
          onChange={(e) => setPlant(e.target.value)}
          required
        />
        <input
          placeholder="Variety (optional, e.g. Brandywine)"
          value={variety}
          onChange={(e) => setVariety(e.target.value)}
        />
        <input
          type="date"
          value={datePlanted}
          onChange={(e) => setDatePlanted(e.target.value)}
          required
        />
        <input
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit">+ Add Planting</button>
      </form>

      <div className="planting-list">
        {sorted.length === 0 && (
          <div className="empty-hint">No plantings logged yet.</div>
        )}
        {sorted.map((p) => (
          <div className="planting-item" key={p.id}>
            <div className="planting-main">
              <span className="planting-plant">{p.plant}</span>
              {p.variety && <span className="planting-variety"> · {p.variety}</span>}
            </div>
            <div className="planting-meta">
              planted {p.datePlanted}
              {p.notes && <span className="planting-notes"> — {p.notes}</span>}
            </div>
            <button
              className="icon-btn small"
              title="Remove planting"
              onClick={() => onDeletePlanting(bed.id, p.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button className="danger-link" onClick={() => onDeleteBed(bed.id)}>
        Delete this bed
      </button>
    </div>
  );
}

export default BedPanel;
