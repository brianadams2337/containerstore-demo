---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** Introduced Storybook for UI component development and documentation.

Storybook is an open-source tool for building and documenting UI components in isolation. It allows developers and designers to visually develop, test, and review components outside the main application, improving design consistency and development speed.

In this project, Storybook has been integrated as a development dependency, configured specifically for Nuxt 3 and our component architecture.
It serves as a living component library and a central place to showcase UI patterns, aiding both internal teams and external stakeholders in understanding and reusing shared components.

Initial example stories have been added for key UI components to demonstrate usage and recommended best practices.

To run Storybook locally:

```bash
pnpm storybook
```

This starts a development server at [http://localhost:6006](http://localhost:6006).

To generate a static Storybook build, use:

```bash
pnpm storybook:build
```

The output will be placed in the `public/storybook` directory and can be accessed at [http://localhost:3000/storybook](http://localhost:3000/storybook).

Further information can be found in the official [Storybook documentation](https://storybook.js.org/docs/vue/get-started/introduction) and the [Nuxt Storybook guide](https://storybook.nuxtjs.org/getting-started/setup).

The following components are now available within Storybook:

- Order
  - `SFOrderList`
- Product
  - `SFProductCard`
  - `SFProductPromotionBanner`
- Base Components
  - `SFAccordionEntry`
  - `SFButton`
  - `SFChip`
  - `SFCountdown`
  - `SFModal`
  - `SFPopover`
  - `SFSkeletonLoader`
  - `SFSliderIn`
  - `SFSliderArrowButton`
  - `SFCheckbox`
  - `SFDropdown`
  - `SFFilterRangeSlider`
  - `SFPriceInput`
  - `SFSwitch`
  - `SFTextInput`
  - `SFValidatedInputGroup`
  - `SFHeadline`
  - `SFGoBackLink`
  - `SFLink`
  - `SFPagination`
  - `SFItemsSlider`
  - `SFToast`
  - `SFToastContainer`
- Base Components / Transitions
  - `SFSlideInFromBottomTransition`
  - `SFSlideInFromLeftTransition`
  - `SFFadeInFromBottomTransition`
  - `SFFadeInTransition`
