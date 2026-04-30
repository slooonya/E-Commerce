function img_src(element) {
  if(Array.isArray(element.images)) {
      return element.images[0]
  } else{
      return element.images;
  }
}

module.exports = { img_src };