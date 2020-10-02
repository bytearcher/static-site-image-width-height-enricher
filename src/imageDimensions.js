const sizeOf = require("image-size");

const imageDimensionsCache = new Map();

function readImageDimensions(imagePath) {
  return sizeOf(imagePath);
}

function getImageDimensions(imagePath) {
  if (!imageDimensionsCache.has(imagePath)) {
    imageDimensionsCache.set(imagePath, readImageDimensions(imagePath));
  }
  return imageDimensionsCache.get(imagePath);
}

module.exports = {
  getImageDimensions,
};
