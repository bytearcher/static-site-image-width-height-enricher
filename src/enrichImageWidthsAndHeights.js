const fs = require("fs/promises");
const path = require("path");
const rawGlob = require("glob");
const util = require("util");

const { getImageDimensions } = require("./imageDimensions");

const glob = util.promisify(rawGlob);

function getAbsoluteImagePath(siteRoot, htmlPath, imagePath) {
  if (imagePath.startsWith("/")) {
    return path.join(siteRoot, "/", imagePath);
  } else {
    return path.join(siteRoot, "/", path.dirname(htmlPath), "/", imagePath);
  }
}

function addHeightAndWidthToImageHtmlElement(siteRoot, htmlPath, imgTag) {
  const hasExistingHeight = imgTag.match('height="');
  const hasExistingWidth = imgTag.match('width="');
  if (hasExistingHeight || hasExistingWidth) {
    return imgTag;
  }

  const imagePath = imgTag.match(/src="([^"]*)"/)[1];
  const isExternalLink = imagePath.startsWith("http") || imagePath.startsWith(":");
  if (isExternalLink) {
    return imgTag;
  }

  const { height, width } = getImageDimensions(getAbsoluteImagePath(siteRoot, htmlPath, imagePath));

  return imgTag.replace(/([\s]*[/]*>)$/, ` height="${height}" width="${width}"$1`);
}

async function processHtmlFile(siteRoot, htmlPath) {
  const absoluteHtmlPath = path.join(siteRoot, "/", htmlPath);
  const html = await fs.readFile(absoluteHtmlPath, "utf8");

  const newHtml = html.replace(/<img[^>]*[/]?>/gm, (imagePath) => addHeightAndWidthToImageHtmlElement(siteRoot, htmlPath, imagePath));

  await fs.writeFile(absoluteHtmlPath, newHtml);
}

async function enrichImageWidthsAndHeights(siteRoot) {
  const files = await glob("**/*.html", { cwd: siteRoot });
  await Promise.all(files.map((htmlPath) => processHtmlFile(siteRoot, htmlPath)));
}

module.exports = {
  enrichImageWidthsAndHeights,
};
