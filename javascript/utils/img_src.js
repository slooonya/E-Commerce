function img_src(element) {
  if(Array.isArray(element.images)) {
      return element.images[0]
  } else{
      return element.images;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { img_src };
}