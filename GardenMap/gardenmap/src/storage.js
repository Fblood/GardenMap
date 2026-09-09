const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4001";

async function load() {
  try {
    const res = await fetch(`${API_BASE}/api/garden`, { cache: "no-store" });
    if (!res.ok) throw new Error(`load failed: ${res.status}`);
    const data = await res.json();
    return { beds: Array.isArray(data.beds) ? data.beds : [] };
  } catch (e) {
    console.warn("[gardenmap] could not reach local server, starting empty:", e.message);
    return { beds: [] };
  }
}

async function save(state) {
  try {
    await fetch(`${API_BASE}/api/garden`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
  } catch (e) {
    console.warn("[gardenmap] could not save to local server:", e.message);
  }
}

async function searchCultivar(query) {
  const res = await fetch(
    `${API_BASE}/api/cultivar/search?q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error(`cultivar search failed: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export { load, save, searchCultivar, newId };
