import { useEffect, useState } from "react";
import "./App.css";
import GardenBed from "./components/GardenBed";
import BedPanel from "./components/BedPanel";
import AddBedModal from "./components/AddBedModal";
import PrintReport from "./components/PrintReport";
import { load, save, newId } from "./storage";

function App() {
  const [beds, setBeds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddBed, setShowAddBed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    load().then((state) => {
      setBeds(state.beds);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return; // don't overwrite the file with [] before the initial load completes
    save({ beds });
  }, [beds, loaded]);

  function handleCreateBed({ name, widthFt, heightFt }) {
    const bed = {
      id: newId(),
      name,
      widthFt,
      heightFt,
      x: 24 + ((beds.length * 40) % 300),
      y: 24 + ((beds.length * 30) % 200),
      plantings: [],
    };
    setBeds((prev) => [...prev, bed]);
    setShowAddBed(false);
    setSelectedId(bed.id);
  }

  function handleMoveBed(id, x, y) {
    setBeds((prev) => prev.map((b) => (b.id === id ? { ...b, x, y } : b)));
  }

  function handleDeleteBed(id) {
    setBeds((prev) => prev.filter((b) => b.id !== id));
    setSelectedId(null);
  }

  function handleAddPlanting(bedId, planting) {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, plantings: [...b.plantings, { id: newId(), ...planting }] }
          : b
      )
    );
  }

  function handleDeletePlanting(bedId, plantingId) {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, plantings: b.plantings.filter((p) => p.id !== plantingId) }
          : b
      )
    );
  }

  const selectedBed = beds.find((b) => b.id === selectedId) || null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <h1>🌱 GardenMap</h1>
          {loaded && beds.length > 0 && (
            <span className="bed-count-chip">
              {beds.length} bed{beds.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="header-actions">
          <button
            className="ghost-header-btn"
            onClick={() => window.print()}
            title="Print or save a PDF report of your garden"
          >
            🖨 Print / Export
          </button>
          <button className="primary-btn" onClick={() => setShowAddBed(true)}>
            + New Bed
          </button>
        </div>
      </header>

      <div className="app-body">
        <div className="yard" onPointerDown={() => setSelectedId(null)}>
          {!loaded && (
            <div className="yard-empty">
              <span className="yard-empty-icon">⏳</span>
              Loading garden data…
            </div>
          )}
          {loaded && beds.length === 0 && (
            <div className="yard-empty">
              <span className="yard-empty-icon">🌱</span>
              No beds yet — add one to start mapping your garden.
            </div>
          )}
          {beds.map((bed) => (
            <GardenBed
              key={bed.id}
              bed={bed}
              selected={bed.id === selectedId}
              onSelect={setSelectedId}
              onMove={handleMoveBed}
            />
          ))}
        </div>

        {selectedBed && (
          <BedPanel
            bed={selectedBed}
            onAddPlanting={handleAddPlanting}
            onDeletePlanting={handleDeletePlanting}
            onDeleteBed={handleDeleteBed}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      {showAddBed && (
        <AddBedModal
          onCreate={handleCreateBed}
          onCancel={() => setShowAddBed(false)}
        />
      )}

      <PrintReport beds={beds} />
    </div>
  );
}

export default App;
