// Tiny wrapper around `==` so we can actually unit-test the category check.
// We use loose equality on purpose - sometimes the id is a number,
// sometimes a string, and we want both to work.
function category_matches(product_category, selected_category) {
  return product_category == selected_category;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { category_matches };
}
