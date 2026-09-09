import { useState } from "react";

function AddBedModal({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [widthFt, setWidthFt] = useState(4);
  const [heightFt, setHeightFt] = useState(8);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      widthFt: Number(widthFt) || 1,
      heightFt: Number(heightFt) || 1,
    });
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>New Bed</h2>
        <label>
          Name
          <input
            autoFocus
            placeholder="e.g. North Bed"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <div className="modal-row">
          <label>
            Width (ft)
            <input
              type="number"
              min="1"
              value={widthFt}
              onChange={(e) => setWidthFt(e.target.value)}
            />
          </label>
          <label>
            Length (ft)
            <input
              type="number"
              min="1"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">Create Bed</button>
        </div>
      </form>
    </div>
  );
}

export default AddBedModal;
