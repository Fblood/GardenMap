// Crop rotation is scoped per-bed: don't repeat a plant family in the same
// physical plot too soon. Only plantings with attached cultivar data (family)
// count — there's no family to compare without it.

function getFamilyHistory(bed) {
  return bed.plantings
    .filter((p) => p.cultivar && p.cultivar.family)
    .map((p) => ({ family: p.cultivar.family, plant: p.plant, datePlanted: p.datePlanted }))
    .sort((a, b) => new Date(b.datePlanted) - new Date(a.datePlanted));
}

// Most recent prior planting of the same family in this bed, if any.
function findRotationConflict(bed, family) {
  if (!family) return null;
  const match = getFamilyHistory(bed).find((h) => h.family === family);
  if (!match) return null;
  const daysSince = Math.floor((Date.now() - new Date(match.datePlanted)) / 86400000);
  return { ...match, daysSince };
}

export { getFamilyHistory, findRotationConflict };
