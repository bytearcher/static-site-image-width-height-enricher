if (typeof TextDecoder === "undefined") {
  global.TextDecoder = require("util").TextDecoder;
}

const fs = require("fs");
const { imageSize } = require("image-size-next");

const imageDimensionsCache = new Map();

function readImageDimensions(imagePath) {
  return imageSize(fs.readFileSync(imagePath));
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
