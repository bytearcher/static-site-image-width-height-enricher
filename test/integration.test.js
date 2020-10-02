const fs = require("fs/promises");

const { enrichImageWidthsAndHeights } = require("../src/enrichImageWidthsAndHeights");

afterEach(() => {
  jest.restoreAllMocks();
});

describe("image width height enricher", () => {
  let writtenFile;

  beforeAll(async () => {
    async function writeFileSpy(filePath, fileContents) {
      writtenFile = fileContents;
    }
    jest.spyOn(fs, "writeFile").mockImplementation(writeFileSpy);
    await enrichImageWidthsAndHeights("test/tree");
  });

  function getImageAttributesFor(altText) {
    const imgTag = writtenFile.match(new RegExp(`<img[^>]*alt="${altText}"[^>]*>`))[0];

    function parseAttribute(attribute) {
      const attributeText = imgTag.match(new RegExp(`${attribute}="([^"]+)"`));
      if (!attributeText) {
        return;
      }
      const textValue = attributeText[1];
      return parseInt(textValue);
    }

    return {
      height: parseAttribute("height"),
      width: parseAttribute("width"),
    };
  }

  test("doesn't touch external links", async () => {
    expect(getImageAttributesFor("external link").height).toBeUndefined();
    expect(getImageAttributesFor("external link").width).toBeUndefined();
  });

  test("doesn't add height if width set", async () => {
    expect(getImageAttributesFor("width set").height).toBeUndefined();
  });

  test("doesn't add width if height set", async () => {
    expect(getImageAttributesFor("height set").width).toBeUndefined();
  });

  describe("tag endings", () => {
    test("recognises self-closing tags", async () => {
      expect(getImageAttributesFor("self-closing tag").width).toBe(1);
      expect(getImageAttributesFor("self-closing tag").height).toBe(2);
    });

    test("recognises html5 loose non-closed tag", async () => {
      expect(getImageAttributesFor("html5 loose non-closed tag").width).toBe(1);
      expect(getImageAttributesFor("html5 loose non-closed tag").height).toBe(2);
    });
  });

  describe("handles relative links", () => {
    test("/file.png", async () => {
      expect(getImageAttributesFor("/file.png").width).toBe(1);
      expect(getImageAttributesFor("/file.png").height).toBe(2);
    });
    test("./file.png", async () => {
      expect(getImageAttributesFor("./file.png").width).toBe(1);
      expect(getImageAttributesFor("./file.png").height).toBe(2);
    });
    test("file.png", async () => {
      expect(getImageAttributesFor("file.png").width).toBe(1);
      expect(getImageAttributesFor("file.png").height).toBe(2);
    });
  });
});
