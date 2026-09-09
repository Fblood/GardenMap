function PrintReport({ beds }) {
  const today = new Date().toLocaleDateString();

  return (
    <div className="print-report">
      <h1>GardenMap — Garden Report</h1>
      <div className="print-meta">Generated {today} · {beds.length} bed{beds.length === 1 ? "" : "s"}</div>

      {beds.length === 0 && <p>No beds logged yet.</p>}

      {beds.map((bed) => {
        const sorted = [...bed.plantings].sort(
          (a, b) => new Date(a.datePlanted) - new Date(b.datePlanted)
        );
        return (
          <section className="print-bed" key={bed.id}>
            <h2>{bed.name} <span className="print-dims">({bed.widthFt}×{bed.heightFt} ft)</span></h2>
            {sorted.length === 0 ? (
              <p className="print-empty">No plantings logged.</p>
            ) : (
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Plant</th>
                    <th>Variety</th>
                    <th>Scientific name / family</th>
                    <th>Planted</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p) => (
                    <tr key={p.id}>
                      <td>{p.plant}</td>
                      <td>{p.variety || "—"}</td>
                      <td>
                        {p.cultivar
                          ? `${p.cultivar.scientificName}${p.cultivar.family ? ` (${p.cultivar.family})` : ""}`
                          : "—"}
                      </td>
                      <td>{p.datePlanted}</td>
                      <td>{p.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default PrintReport;
