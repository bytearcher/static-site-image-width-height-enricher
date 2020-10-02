#!/usr/bin/env node

const { enrichImageWidthsAndHeights } = require("..");

(async () => {
  const siteRoot = process.argv[2];
  await enrichImageWidthsAndHeights(siteRoot);
})();
