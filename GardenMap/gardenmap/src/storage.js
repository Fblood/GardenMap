const KEY = "gardenmap.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { beds: [] };
    const parsed = JSON.parse(raw);
    return { beds: Array.isArray(parsed.beds) ? parsed.beds : [] };
  } catch {
    return { beds: [] };
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export { load, save, newId };
