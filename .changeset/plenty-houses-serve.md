---
'@scayle/storefront-boilerplate-nuxt': patch
---

Added ability to scroll to anchor links on the same page.

The `Paragraph` component now supports an `anchor` prop that will be used to create an anchor target for that paragraph.

If you have a Table of Contents and want to link to a specific paragraph, you can use the create links function on any text in your Content to create a link to it. When the user clicks on the link, he will scroll to the paragraph on the page.

We introduced a new component, `NestedParagraph,` that allows adding nested paragraphs, for example, for ordered lists.
