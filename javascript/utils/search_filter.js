// Plain substring search over a product list. We used to build a RegExp
// from the input - that crashed on "(" and was a ReDoS risk - this is fine.
function search_filter(products, query) {
  if (!Array.isArray(products)) {
    return [];
  }

  let term = (query || "").toString().toLowerCase().trim();
  if (!term) {
    return [];
  }

  return products.filter(p => {
    return p && typeof p.title === "string" &&
      p.title.toLowerCase().includes(term);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { search_filter };
}
