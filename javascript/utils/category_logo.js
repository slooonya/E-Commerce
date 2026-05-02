// Look up a category's logo image source. Returns null when nothing matches
// so the caller can decide whether to fall back to a placeholder.
function category_logo(name, logos) {
  if (!name || !Array.isArray(logos)) {
    return null;
  }

  for (let i = 0; i < logos.length; i++) {
    let entry = logos[i];
    if (entry && entry.name === name) {
      return entry.src || null;
    }
  }
  return null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { category_logo };
}
