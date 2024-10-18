---
'@scayle/storefront-boilerplate-nuxt': patch
---

Ensure all product images have correct `alt` text

All product images now include an `alt` text attribute to improve accessibility. This `alt` text includes the product's brand, name and color. When the image is part of a gallery or slider, the index of the image is also included. For the sibling selection on the PDP the selected state is also included in the `alt` text.
