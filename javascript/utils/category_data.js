// Find a category entry by name. Like category_logo, but gives back the
// whole {name, src, label, ...} object instead of just the src.
// Using == here so it behaves the same as category_matches.
function category_data(name, logos) {
  if (!name || !Array.isArray(logos)) {
    return null;
  }

  for (let i = 0; i < logos.length; i++) {
    let entry = logos[i];
    if (entry && entry.name == name) {
      return entry;
    }
  }
  return null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { category_data };
}
