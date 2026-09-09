import { useState } from "react";
import { searchCultivar } from "../storage";
import { getFamilyHistory, findRotationConflict } from "../rotation";

function BedPanel({ bed, onAddPlanting, onDeletePlanting, onDeleteBed, onClose }) {
  const [plant, setPlant] = useState("");
  const [variety, setVariety] = useState("");
  const [datePlanted, setDatePlanted] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [cultivar, setCultivar] = useState(null);
  const [cultivarResults, setCultivarResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [rotationWarning, setRotationWarning] = useState(null);

  async function handleSearchCultivar() {
    if (!plant.trim()) return;
    setSearching(true);
    setSearchError("");
    setCultivarResults([]);
    try {
      const results = await searchCultivar(plant.trim());
      setCultivarResults(results.slice(0, 8));
      if (results.length === 0) setSearchError("No matches found.");
    } catch (e) {
      setSearchError("Lookup failed — is the local server running with a Trefle token configured?");
    }
    setSearching(false);
  }

  function pickCultivar(result) {
    setCultivar({
      trefleId: result.id,
      scientificName: result.scientific_name,
      commonName: result.common_name,
      family: result.family,
      imageUrl: result.image_url,
    });
    setCultivarResults([]);
    setRotationWarning(findRotationConflict(bed, result.family));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!plant.trim()) return;
    onAddPlanting(bed.id, {
      plant: plant.trim(),
      variety: variety.trim(),
      datePlanted,
      notes: notes.trim(),
      cultivar,
    });
    setPlant("");
    setVariety("");
    setNotes("");
    setCultivar(null);
    setCultivarResults([]);
    setSearchError("");
    setRotationWarning(null);
  }

  const sorted = [...bed.plantings].sort(
    (a, b) => new Date(b.datePlanted) - new Date(a.datePlanted)
  );
  const familyHistory = getFamilyHistory(bed);

  return (
    <div className="bed-panel">
      <div className="bed-panel-header">
        <h2>{bed.name}</h2>
        <button className="icon-btn" onClick={onClose} title="Close">×</button>
      </div>
      <div className="bed-panel-sub">{bed.widthFt}×{bed.heightFt} ft bed</div>

      <form className="planting-form" onSubmit={handleSubmit}>
        <div className="plant-search-row">
          <input
            placeholder="Plant (e.g. Tomato)"
            value={plant}
            onChange={(e) => {
              setPlant(e.target.value);
              setCultivar(null);
            }}
            required
          />
          <button
            type="button"
            className="search-btn"
            onClick={handleSearchCultivar}
            disabled={searching || !plant.trim()}
            title="Look up cultivar data via Trefle"
          >
            {searching ? "…" : "🔍"}
          </button>
        </div>

        {searchError && <div className="search-error">{searchError}</div>}

        {cultivarResults.length > 0 && (
          <div className="cultivar-results">
            {cultivarResults.map((r) => (
              <button
                type="button"
                key={r.id}
                className="cultivar-result"
                onClick={() => pickCultivar(r)}
              >
                <span className="cr-common">{r.common_name || r.scientific_name}</span>
                <span className="cr-sci">{r.scientific_name}</span>
              </button>
            ))}
          </div>
        )}

        {cultivar && (
          <div className="cultivar-attached">
            🌿 {cultivar.scientificName}
            {cultivar.family && <span className="ca-family"> · {cultivar.family}</span>}
            <button
              type="button"
              className="icon-btn small"
              onClick={() => setCultivar(null)}
              title="Detach cultivar data"
            >
              ×
            </button>
          </div>
        )}

        {rotationWarning && (
          <div className="rotation-warning">
            ⚠ {rotationWarning.family} was last grown here {rotationWarning.daysSince}d ago
            ({rotationWarning.plant}, {rotationWarning.datePlanted}) — consider rotating families.
          </div>
        )}

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
            {p.cultivar && (
              <div className="planting-cultivar">
                🌿 {p.cultivar.scientificName}
                {p.cultivar.family && <span> · {p.cultivar.family}</span>}
              </div>
            )}
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

      {familyHistory.length > 0 && (
        <div className="rotation-history">
          <div className="lbl" style={{ marginBottom: 6 }}>ROTATION HISTORY</div>
          {familyHistory.map((h, i) => (
            <div className="rotation-row" key={i}>
              <span className="rh-family">{h.family}</span>
              <span className="rh-plant"> · {h.plant}</span>
              <span className="rh-date">{h.datePlanted}</span>
            </div>
          ))}
        </div>
      )}

      <button className="danger-link" onClick={() => onDeleteBed(bed.id)}>
        Delete this bed
      </button>
    </div>
  );
}

export default BedPanel;
