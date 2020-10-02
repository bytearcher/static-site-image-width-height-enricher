# Static Site Image Width and Height Enricher

Scans directory tree for html pages with `<img>`-tags that use relative links to images in the same tree. Reads the referenced images for dimensions and adds `height="..."` and `width="..."` attributes to every `<img>` if they don't already have one.

    npx static-site-image-width-height-enricher <site root directory>
