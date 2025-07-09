---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** Streamlined and polished the UI module components by removing outdated and redundant props.
Here’s what’s been tidied up:

- `SFModal.client`: Simplified by removing the `closeOnOutside` property.
- `SFPopover`: Decluttered with the removal of `disablePopoverContent` and `contentWrapperClass` properties.
- `SFSlideIn.client`: Transitioned to a single `default` slide type (X-axis) by removing the `slideType` property.
- `SFDropdown`: Refined by eliminating the `isLarge` property.
- `SFSwitch`: Lightened up with the removal of `name` and `required` properties.
- `SFTextInput`: Enhanced by dropping the `hint` and `mask` properties.
- `SFLink`: Unified `active` and `exactActive` classes, saying goodbye to `onlyExactActive`.
- `SFItemsSlider`: Simplified by removing `container` and `sliderClass` properties.
- `SFModal`: Removed the `hideCloseButton` prop, which was no longer in use.
- `SFItemsSlider`: Removed the `scrollable` prop, which was no longer in use.
