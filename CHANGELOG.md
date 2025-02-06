# @scayle/storefront-boilerplate-nuxt

## 1.7.1

### 💅 Minor Changes

- **\[Search\]** Fixed an issue where pressing enter in the search input didn't navigate to the first suggestion. Now, pressing enter will navigate to the first suggestion, or to the search results page if there are no suggestions.
- **\[E2E\]** Added an end-to-end test to verify that the product details page loads correctly after a product ID search is performed by pressing Enter. This addresses a previous issue where the product details page might not have loaded correctly in this scenario.

## 1.7.0

### 🔥 Highlights

#### 🛒 Basket Enhancements for a Streamlined Shopping Experience

This release delivers a significantly enhanced basket experience, prioritizing user clarity, streamlined functionality, and a smoother checkout process. We've refined the basket's underlying architecture and SEO performance through comprehensive component refactoring and metadata improvements. Key enhancements include clear labeling of sold-out items, prominent badging for promotional offers, a helpful voucher disclaimer, and integrated subscription details directly on relevant items. Transparency is further improved with a detailed breakdown of all discounts in the basket summary.

Visually, the basket boasts a refreshed design, featuring updated empty basket and wishlist states and a redesigned item card. A new confirmation modal prevents accidental deletions, while a convenient basket preview in the top navigation allows for quick access and management. The checkout flow is streamlined with a dedicated final summary section, clearly displaying the final price and a direct checkout link.

Under the hood, we've implemented new utility functions for precise price calculations, along with summaries of applied promotions and regular product prices for increased transparency. Promotional gifts are now automatically added to your basket for a seamless shopping experience.

#### 🧑‍🦯 Pushing Accessibility

We're committed to making our products accessible to all users. This release delivers key improvements to create a smoother, more inclusive experience.

Navigation is now easier with improvements for keyboard users throughout product listings and other areas. Interactive elements like search inputs and dropdowns are now easier to use.

We've also made information on product pages and account settings clearer and easier to understand through improved structure and organization. These updates demonstrate our continued focus on accessibility and delivering the best possible experience for all our customers.

#### 🏗️ Architectural Improvements

This release features key architectural enhancements focused on dependency management, Nuxt configuration, and component organization within tenant projects.

We've significantly improved the robustness and maintainability of our Google Tag Manager integration by migrating to a locally maintained module, @scayle/nuxt-gtm. This transition leverages the latest advancements in @gtm-support/vue-gtm, resulting in performance gains, bug fixes, and simplified dependency management.

Additionally, our Nuxt configuration now adopts the recommended bundler module resolution, aligning with Vite/Vue best practices and improving third-party library compatibility. This update ensures correct imports for packages with well-defined exports, simplifying development and reducing potential conflicts.

Finally, to better support tenant project development, we've introduced a standardized naming convention for local application components, prefixing them with SF. This enhances code readability and maintainability, while providing a clear distinction between Storefront Boilerplate components and tenant-specific customizations. This separation is essential for streamlined CLI management and update processes, preventing unintended overwrites and ensuring a smooth development experience.

### 🚀 Major Changes

- **\[Basket\]** Refactored the basket summary component to integrate `SFBasketSummaryMobile` into `SFBasketSummary` for centralized logic.
- **\[Basket\]** Sold-out items in the basket now display an additional title to clearly indicate their unavailability.
  **\[Basket\]** Added structured data and metadata to the basket page for improved SEO performance.
- **\[Basket\]** Added a visual badge to basket cards to clearly indicate when a promotional offer is applied to an item.
- **\[Basket\]** Added a voucher disclaimer to the basket page.
- **\[Basket\]** Introduced a new UI design for empty basket and wishlist states. This includes changes to the reusable `SFEmptyState` component.
- **\[Basket\]** Added a utility function called `getTotalPriceWithoutReductions` for calculating the total basket price before any reductions are applied.
- **\[Basket\]** Implemented a new section in the basket view that summarizes applied promotions and their corresponding reductions.
- **\[Basket\]** Implemented functionality to add promotional gifts to the basket if they are not already present.
- **\[Basket\]** Implemented a new section in the basket view that summarizes the prices of regular products, excluding discounts and promotions.
- **\[Basket\]** To streamline the shopping experience, a basket preview has been integrated into the top main navigation. This allows users to easily view and manage the items in their basket without leaving their current page, improving accessibility and convenience.
- **\[Basket\]** To provide greater transparency about discounts applied to the basket, a new section has been added to the basket summary. This section clearly displays both campaign-related discounts and sale reductions, allowing customers to easily understand how their final price is calculated.
- **\[Basket\]** Introduced a new basket item card design and a confirmation modal for deleting items from the basket, improving user experience and preventing accidental deletions.
- **\[Basket\]** To improve transparency and provide users with more information about their subscriptions, subscription details are now displayed on each subscription-relevant basket item.
- **\[Basket\]** To improve the user experience towards the checkout, a dedicated final summary section has been added to the basket page. This section clearly displays the final purchase price and provides a direct link to the checkout page, streamlining the checkout process and making it easier for customers to complete their purchase.
- **\[Basket\]** The basket page layout has been redesigned for improved clarity and organization. The basket item list generation has also been optimized to enhance performance and loading speed. These changes result in a more user-friendly and efficient basket experience.
- **\[Basket\]** Implemented a loading state for the basket page to provide better feedback to users during data fetching. Also added the ability to track `feature` errors using `trackFeatureError()`.
- **\[Architecture\]** To address the risks associated with using an unmaintained dependency and improve the long-term stability of our Google Tag Manager integration, we have replaced `@zadigetvoltaire/nuxt-gtm` with a locally maintained module, `@scayle/nuxt-gtm`. This new module incorporates the most recent version of `@gtm-support/vue-gtm`, benefiting from performance improvements, bug fixes, and ongoing maintenance. This migration also allows us to eliminate a custom patch previously required for compatibility, further simplifying our dependency management.
- **\[Architecture\]** Updated Nuxt configuration (`nuxt.config.ts`) to utilize the recommended `bundler` module resolution introduced in Nuxt v3.10, removing the `future.typescriptBundlerResolution: false` flag. This aligns our project with Vite/Vue best practices and improves compatibility with third-party libraries. While this change is generally beneficial, some packages might encounter issues. If you experience any problems, please report them in the affected library's repository. You can temporarily revert this change by adding `future.typescriptBundlerResolution: false` back to your `nuxt.config.ts` file.

  This update allows for correct imports of third-party packages with well-defined exports, such as:

      ```ts
      import {
        costFactory,
        basketItemsFactory,
      } from '@scayle/storefront-nuxt/test/factories'
      ```

  For further details on bundler module resolution and its advantages, refer to the [official Nuxt blog post](https://nuxt.com/blog/v3-10#bundler-module-resolution).

- **\[Architecture\]** As part of ongoing improvements to support the development and maintenance of tenant projects, all local application components (UI and subscription modules) now have the prefix `SF`. This standardized naming convention brings several benefits: improved code readability and maintainability across the codebase, and clear differentiation between Storefront Boilerplate components and custom components developed by tenants. This clear separation is crucial for the CLI, which will be responsible for managing and updating default components in tenant projects, preventing accidental overwrites and conflicts. See the example below for how this affects component imports.
- **\[Accessibility\]** Removed the unintended shift on hover from the side navigation on product listing pages to improve accessibility.
- **\[Accessibility\]** Addressed an accessibility issue where pagination items were not focusable using the Tab key. Replaced `<span>` elements with `<SFButton>` components to ensure proper keyboard navigation.
- **\[Accessibility\]** Enhanced accessibility of subscription selection dropdowns (`SFProductSubscriptionSelection`) by ensuring focusable elements are used.
- **\[Accessibility\]** RRemoved the focus style from the `input` element within the `SearchInput` component to address an issue where an unintended focus state was displayed on click.
- **\[Accessibility\]** Added `aria-label` and translation to `SFSearchInput` button.
- **\[Accessibility\]** Added the `role="presentation"` attribute to the icon within the `SFNavigationTreeItem` component to improve accessibility and conform with WCAG requirements.
- **\[Accessibility\]** To prevent redundant focusable elements and improve keyboard navigation within the `SFPriceRangeSlider` component, the button element's focusability has been disabled. The slider's dots (provided by `VueSlider`) already provide proper focus handling, making the button's focus redundant and potentially confusing for keyboard users.
- **\[Accessibility\]** Improved the heading structure within the `StoreVariantAvailability` component (used for displaying store variant availability) and account overview page (`account/index.vue`) to better reflect the informational hierarchy of the pages. This improves readability and accessibility for users, making it easier to understand the content. This involved adding new headings where necessary and adjusting existing headings to use the appropriate semantic level.

### 💅 Minor Changes

- **\[UI\]** Removed the `new` prefix that was recently added to icon names, reverting to the previous naming convention. In addition, unused icon files have been removed from the project, reducing the overall bundle size and improving performance. This cleanup also simplifies icon management and reduces the risk of naming conflicts.
- **\[UI\]** Removed the `stop` and `prevent` event modifiers from the `SFButton` component. These modifiers were complicating the reasoning about the expected behavior of buttons in various contexts, potentially leading to unintended side effects. This change simplifies the component's logic and makes it easier to predict how buttons will interact with other elements on the page.
- **\[Subscription\]** Introduced the `itemGroup` property to distinguish between standard and subscription product variants within the basket. This allows customers to add both variants of the same product to their basket simultaneously.
- **\[Subscriptions\]** The quantity selected on the product page is now correctly applied when adding subscription items to the basket. Previously, the quantity might have been reset or ignored.
- **\[Subscriptions\]** Subscription items with different definitions are now added as separate items to the basket instead of updating existing items. This aligns the subscription add-to-basket flow more closely with that of regular products.
- **\[PDP\]** To prevent potentially misleading price displays on product detail pages (`/pages/p/[...productName]-[id].vue`), subscription items in the basket are now ignored when determining the price to display for the corresponding regular product. Previously, the presence of subscription items with potential extra discounts could lead to inaccurate price displays for regular items. This change ensures that the displayed price accurately reflects the price of the regular product itself.
- **\[ShopSwitcher\]** Updated the `ShopSwitcher` component to use a Flyout menu instead of a Dropdown, improving accessibility and user experience.
- **\[ShopSwitcher\]** Introduced `useCurrentShopLocale` and `useCurrentShopTranslators` composables to simplify access to relevant shop localization data for the ShopSwitcher.
- **\[Performance\]** Addressed a hydration mismatch issue in the wishlist page (`/pages/wishlist.vue`) that was impacting performance. The count badge update is now delayed until hydration is complete, and the content is wrapped within an `<SFAsyncDataWrapper>` to ensure proper server/client synchronization. This prevents content flickering and improves the overall loading experience.
- **\[Performance\]** Resolved a hydration mismatch issue in the `SFQuantityInput` component specifically affecting Firefox. The disabled attribute was sometimes missing from the JavaScript DOM Node object, triggering hydration warnings. To prevent these warnings without impacting functionality, the `data-allow-mismatch="attribute"` attribute has been added. This tells the hydration process to tolerate mismatches on this specific attribute.
- **\[Performance\]** The product image zoom gallery is now rendered entirely on the client-side, resulting in significantly improved performance and interactivity. Previously, server-side rendering limitations impacted the gallery's responsiveness. This change ensures a smoother and more engaging user experience when viewing product images.
- **\[E2E\]** Enhanced end-to-end tests to ensure accurate price calculations in the shopping basket, covering scenarios with regular prices, sales, and promotions.
- **\[E2E\]** Implemented end-to-end (E2E) tests to validate client-side hydration against server-rendered content.
- **\[E2E\]** Added an end-to-end test to ensure seamless navigation from the main navigation menu to product listing pages. This test covers navigation to main categories and subcategories up to the second level (e.g., `Women > Clothing > Dresses`). This comprehensive test strengthens our automated testing coverage and helps ensure a smooth browsing experience for our users.
- **\[E2E\]** Introduced an RPC fixture to streamline end-to-end testing. This fixture allows direct RPC calls from test code, enabling efficient setup of server-side state without requiring UI interaction. This significantly reduces test execution time and complexity.

      ```ts
      test('Some description', async ({ rpc }) => {
        const res = await rpc.call('addItemToWishlist', {
          productId: 123,
        })

        expect(res).toMatchObject({ productId: 123 })
      })
      ```

- **\[Translations\]** Removed unused translation entries from the project.

- **\[Promotions\]** Refactored the handling of the bottom promotion banner height to improve performance and address several issues. Previously, the entire banner element was stored as a reference, leading to unnecessary layout re-renders and duplicated category API calls within the "Show deals" button triggered overlay due to `KeepAlive` issues. The implementation now uses a new `usePromotionBanner` composable to store only the banner's height. This simplifies gap calculations between the floating container and the banner, eliminates redundant re-renders, and resolves the API call duplication.
- **\[Promotions\]** Improved the performance of promotion loading by reducing the number of calls made to the `getCategoryById` function. This optimization reduces API requests and improves the overall responsiveness of the promotions feature.

  Example:

      ```ts
      // Before
      import Footer from '~/components/Footer.vue'

      // After
      import SFFooter from '~/components/SFFooter.vue'
      ```

- **\[SEO\]** To streamline SEO management and reduce code duplication, we've removed our custom SEO utility functions and integrated with the SEO utilities available through the `@scayle/storefront-nuxt` package. This simplifies maintenance and ensures we're using the most up-to-date SEO practices.
- **\[Types\]** Corrected the import paths for the `BasketItemUpdateData` and `PromotionReductionItem` types.

### 🩹 Patch Changes

- **\[Images\]** Improved the construction of image URLs by using URL.parse. This ensures more robust and consistent URL generation when using a CDN, improving image loading performance and reliability.
- **\[PDP\]** Implemented title truncation for excessively long titles within the product page breadcrumbs.
- **\[ShopSwitcher\]** Updated the `ShopSwitcher` component to display the language code instead of the full language name.
- **\[Account\]** Corrected the headline translation on the account page.
- **\[UI\]** Updated the `SFSlideIn` component to support full-screen display mode on mobile devices. This provides a more immersive experience and better utilizes screen real estate on smaller screens.
- **\[UI\]** Increased the bottom margin of the "Scroll to Top" button on medium and larger screens (breakpoints `md` and above) to prevent overlap with footer links.
- **\[Navigation\]** Added support for the `filters` properties on `navigationItem`'s that link to category pages.
- **\[Navigation\]** Ensured horizontal alignment between navigation list items and their
  corresponding header elements.
- **\[Navigation\]** Corrected a layout shift that occurred when hovering over navigation items.
- **\[Navigation\]** Refactored navigation lists to use semantically correct `ul` (unordered list) and `li` (list item) tags.
- **\[Navigation\]** Cleaned up and enhanced the `NavigationItem` test data. The `languages` field, which was no longer used, has been removed. Additionally, the `filters` property has been added to all category navigation items to facilitate more comprehensive testing of filtering functionality within the navigation. This change simplifies the test data and improves the accuracy of navigation-related tests.
- **\[Tracking\]** Added tracking for customer logout events to capture the `customer_data` event. This ensures improved tracking of customer sessions and provides valuable insights into user behavior.
- **\[Tracking\]** Updated search events to include page information attributes and added tracking for "show all results" clicks.
- **\[Tracking\]** Corrected the `search_destination` attribute value that is tracked when a user clicks on a suggested page in the search results.
- **\[Tracking\]** The `method` key in the `customer_data` tracking object has been renamed to `login_method` for clarity and consistency.
- **\[Tracking\]** Removed the explicit `cart` event trigger when removing basket items using `useBasketActions`. This event is already handled automatically by the `useUserItemsTrackingWatcher`.
- **\[Tracking\]** Corrected an issue where a tracking event was not being triggered when clicking the "Show All" button in search results if other suggestions were present.
- **\[E2E\]** Modified the end-to-end test suite to reflect recent updates to the Basket and Wishlist pages, including their empty states and updated page titles.
- **\[E2E\]** The `e2e-happy-path.spec.ts` end-to-end test, which covers the critical user journey on the Basket page, has been updated to reflect the recent design changes. This ensures that the core flow towards the checkout remains functional and provides a seamless experience for our customers.
- **\[E2E\]** As part of the ongoing improvements to our multi-shop platform and the introduction of global API routing for path-based shops, we've updated our E2E test suite. Tests relying on RPC calls have been refactored to reflect the new, simplified API access. This ensures our tests remain comprehensive and effective in validating multi-shop platform functionality, minimizing the risk of regressions and ensuring a seamless experience for our customers across all shops.
- **\[E2E\]** Updated the end-to-end tests to cover the redesigned `ShopSelector` functionality.
- **\[E2E\]** Enhanced the stability of the main navigation end-to-end tests by adding a check for DOM content loading.
- **\[E2E\]** Refactored the `ShopSelector` DOM element handling for determining the currently selected country. This simplifies the logic and improves performance.
- **\[E2E\]** Enhanced the reliability and stability of end-to-end (E2E) tests, particularly those involving user accounts. Each browser now uses a dedicated user account during test execution, preventing data conflicts and ensuring more consistent test results. Additionally, test timeout thresholds have been increased to accommodate potential temporary slowdowns and reduce the occurrence of false positives.
  To configure dedicated test user accounts for each browser, set the following environment variables (refer to `env.example` for reference):

  - `TEST_USER_EMAIL`
  - `TEST_USER_EMAIL2`
  - `TEST_USER_EMAIL3`
  - `TEST_USER_EMAIL4`
  - `TEST_USER_EMAIL5`
  - `TEST_USER_PASSWORD`
  - `TEST_USER_WRONG_PASSWORD`
  - `TEST_USER_NO_ORDERS_PASSWORD`

  These variables can be set in a `.env` file or via CI/CD variables. The mapping between browsers and user accounts is defined in the getUserForBrowser function in `playwright/support/utils`.

- **\[E2E\]** Extended the basket price summary end-to-end tests to cover mobile browsers. This ensures accurate price calculations and display for sale and promotion products on mobile devices, maintaining consistency across different platforms.
- **\[E2E\]** Improved the robustness of the end-to-end test for filter deep links. The test now validates filter functionality irrespective of the order in which filters are returned by the backend. This addresses an issue where variations in filter order could lead to false negative test results, ensuring more consistent and reliable testing.

### 🏡 Dependency Updates

- Added dependency `@gtm-support/vue-gtm@3.1.0`
- Added dependency `eslint-formatter-gitlab@5.1.0`
- Removed dependency `@zadigetvoltaire/nuxt-gtm@0.0.13`
- Updated dependency `@contentful/live-preview@4.6.3` to `@contentful/live-preview@4.6.5`
- Updated dependency `@scayle/nuxt-opentelemetry@0.5.3` to `@scayle/nuxt-opentelemetry@0.5.7`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.3` to `@scayle/omnichannel-nuxt@4.0.4`
- Updated dependency `@scayle/storefront-country-detection@1.0.1` to `@scayle/storefront-country-detection@1.1.0`
- Updated dependency `@scayle/storefront-nuxt@8.2.0` to `@scayle/storefront-nuxt@8.6.0`
- Updated dependency `@scayle/storefront-product-detail@1.0.1` to `@scayle/storefront-product-detail@1.0.2`
- Updated dependency `@scayle/storefront-product-listing@1.1.2` to `@scayle/storefront-product-listing@1.1.3`
- Updated dependency `@storyblok/nuxt@6.2.0` to `@storyblok/nuxt@6.2.2`
- Updated dependency `@storyblok/vue@8.1.6` to `@storyblok/vue@8.1.10`
- Updated dependency `@tailwindcss/forms@0.5.9` to `@tailwindcss/forms@0.5.10`
- Updated dependency `@tailwindcss/typography@0.5.15` to `@tailwindcss/typography@0.5.16`
- Updated dependency `@vueuse/components@12.0.0` to `@vueuse/components@12.5.0`
- Updated dependency `@vueuse/core@12.0.0` to `@vueuse/core@12.5.0`
- Updated dependency `@vueuse/integrations@12.0.0` to `@vueuse/integrations@12.5.0`
- Updated dependency `@vueuse/nuxt@12.0.0` to `@vueuse/nuxt@12.5.0`
- Updated dependency `check-password-strength@2.0.10` to `check-password-strength@3.0.0`
- Updated dependency `consola@3.2.3` to `consola@3.4.0`
- Updated dependency `contentful@11.3.3` to `contentful@11.4.4`
- Updated dependency `contentful-export@7.21.7` to `contentful-export@7.21.20`
- Updated dependency `dompurify@3.2.3` to `dompurify@3.2.4`
- Updated dependency `focus-trap@7.6.2` to `focus-trap@7.6.4`
- Updated dependency `nuxi@3.17.0` to `nuxi@3.21.1`
- Updated dependency `storyblok-js-client@6.10.4` to `storyblok-js-client@6.10.7`
- Updated dependency `@changesets/cli@2.27.11` to `@changesets/cli@2.27.12`
- Updated dependency `@nuxt/eslint@0.7.3` to `@nuxt/eslint@1.0.0`
- Updated dependency `@nuxt/image@1.8.1` to `@nuxt/image@1.9.0`
- Updated dependency `@nuxt/test-utils@3.15.1` to `@nuxt/test-utils@3.15.4`
- Updated dependency `@nuxtjs/tailwindcss@6.12.2` to `@nuxtjs/tailwindcss@6.13.1`
- Updated dependency `@scayle/eslint-config-storefront@4.4.0` to `@scayle/eslint-config-storefront@4.4.1`
- Updated dependency `@types/node@22.10.2` to `@types/node@22.12.0`
- Updated dependency `@typescript-eslint/scope-manager@8.18.1` to `@typescript-eslint/scope-manager@8.22.0`
- Updated dependency `@typescript-eslint/utils@8.18.1` to `@typescript-eslint/utils@8.22.0`
- Updated dependency `@vue/typescript-plugin@2.1.10` to `@vue/typescript-plugin@2.2.0`
- Updated dependency `eslint@9.17.0` to `eslint@9.19.0`
- Updated dependency `eslint-plugin-tailwindcss@3.17.5` to `eslint-plugin-tailwindcss@3.18.0`
- Updated dependency `happy-dom@15.11.7` to `happy-dom@16.7.3`
- Updated dependency `lint-staged@15.2.11` to `lint-staged@15.4.3`
- Updated dependency `nuxt-svgo@4.0.9` to `nuxt-svgo@4.0.14`
- Updated dependency `pathe@1.1.2` to `pathe@2.0.2`
- Updated dependency `postcss@8.4.49` to `postcss@8.5.1`
- Updated dependency `postcss-html@1.7.0` to `postcss-html@1.8.0`
- Updated dependency `storyblok-generate-ts@2.1.0` to `storyblok-generate-ts@2.2.0`
- Updated dependency `typescript@5.6.3` to `typescript@5.7.3`
- Updated dependency `unimport@3.13.4` to `unimport@4.0.0`
- Updated dependency `vue-tsc@2.1.10` to `vue-tsc@2.2.0`

## 1.6.0

### 🔥 Highlights

#### 🎨 Introducing the new Header & Footer

Enjoy a refreshed look for SCAYLE Storefront, with greater flexibility at your fingertips!
We've revamped both the header and footer design, as well as underlying technical implementation, now leveraging the [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) as its data source.
This change brings enhanced consistency and opens up a new world of customization possibilities through the [SCAYLE Panel](https://scayle.dev/en/user-guide/shops/storefront/navigation).
The design refresh is aligning the included header and footer with the updated design language introduced in the past months for the Product Listing Page and Product Detail Page.
This results in a more cohesive shopping experience across SCAYLE Storefront, and provides a modern foundation and flexible for your design customizations.

#### 🧰 Major update to Storefront SDKs v8

SCAYLE Storefront SDK v8 (`@scayle/storefront-nuxt@8.*`) delivers substantial enhancements to data handling, consistency, and overall developer experience.
This release introduces a revamped response structure and error handling for basket data, along with streamlined return values for RPC composables for increased predictability.
As part of our commitment to modernization, we have removed legacy code and deprecated features, including the `disableDefaultGetCachedDataOverride` setting and support for outdated approaches like faceted search (`useFacet`).
A [comprehensive migration guide](https://scayle.dev/en/storefront-guide/support-and-resources/upgrade-guides/migrate-to-storefront-v8) is available to ensure a smooth transition to this enhanced version, offering improved performance, stability, and a future-proof foundation for your storefront integrations.

#### 🏗️ Starting transition to Storefront Feature Packages

We're increasing the flexibility and scalability of SCAYLE Storefront by transitioning to a new feature package architecture.
This means breaking down core features into independent, manageable packages, giving tenants more control over upgrades and customization.
Going forward, you can choose to adopt updates to specific functionalities without requiring a complete overhaul of your application.
We've already begun this transition by migrating key Product Listing functionalities into the `@scayle/storefront-product-listing` package.
Additionally, our newly developed "Country Detection" feature is now available as the `@scayle/storefront-country-detection` package, offering immediate access to this powerful functionality.
This is just the first step towards our new architecture, and we'll be supplementing this approach with additional tooling and documentation in the future.

### 🚀 Major Changes

- **\[Header & Footer \]** We've updated the design of the page header. It now uses the [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) as its data source.
- **\[Header & Footer \]** We've updated the design of the page footer. It now uses the [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) as its data source.
- **\[Header & Footer\]** We're introducing a new simplified header and footer design, which will be now used by default for the checkout page.
- **\[Storefront v8\]** We've revamped the response structure and error handling for basket data. Expect a more organized and consistent data format.
- **\[Storefront v8\]** Removed `disableDefaultGetCachedDataOverride` setting as this behavior is now the default.
- **\[Storefront v8\]** We're aligning the return values of RPC composables by replacing `pending` with `status` and `fetch` with `refresh`.
- **\[Storefront Feature Packages\]** Replace the composable `useProductListFilter` with `useFiltersForListing` as has been renamed in `@scayle/storefront-product-listing`.
  We've also removed the return value `clearedPriceQuery`. Please use the utility function `getClearedFilterQueryByKey`.
- **\[Storefront Feature Package\]** Replace the composable `useProductsByCategory` with `useProductsForListing` from `@scayle/storefront-product-listing`.

  - Previous implementation:

    ```ts
    const {
      products,
      pagination,
      status: productsStatus,
      totalProductsCount,
      paginationOffset,
    } = useProductsByCategory(currentCategoryId, route, {
      params: {
        with: PRODUCT_TILE_WITH_PARAMS,
      },
      fetchingOptions: { lazy: true },
    })
    ```

  - Current implementation:

    ```ts
    const { selectedSort } = useProductListSort(route)
    const { appliedFilter } = useAppliedFilters(route)

    const {
      products,
      pagination,
      status: productsStatus,
      totalProductsCount,
      paginationOffset,
    } = useProductsForListing({
      params: {
        categoryId: currentCategoryId.value,
        with: PRODUCT_TILE_WITH_PARAMS,
        sort: selectedSort.value,
        perPage: PRODUCTS_PER_PAGE,
        where: appliedFilter.value,
      },
      fetchingOptions: { lazy: true },
    })
    ```

- **\[Storefront Feature Packages\]** Replace the composable `useCategorySeoData` with `useProductListingSeoData` from `@scayle/storefront-product-listing`.

  - Previous implementation:

    ```ts
    const {
      title,
      metaDescription,
      robots,
      canonicalLink,
      categoryBreadcrumbSchema,
    } = useCategorySeoData(currentCategory)
    ```

  - Current implementation:

    ```ts
    const route = useRoute()
    const { getBreadcrumbsFromCategory } = useBreadcrumbs()

    const breadcrumbs = computed(() =>
      currentCategory.value
        ? getBreadcrumbsFromCategory(currentCategory.value, true)
        : [],
    )

    const { title, robots, canonicalLink, categoryBreadcrumbSchema } =
      useProductListingSeoData(breadcrumbs.value, route, {
        baseUrl: $config.public.baseUrl,
        fullPath: route.fullPath,
      })
    ```

### 💅 Minor Changes

- **\[Search\]** Rename the search query parameter `term` to `filters[term]` to adhere to the established filter naming convention.
  This alignment ensures that search results only display filters matching the available products.
  To maintain existing functionality, all instances of accessing `route.query.term` need to be updated to `route.query.['filters[term]']`.

  - Example:

    ```ts
      //Before
      const route = useRoute()
      console.log(route.query.term)

      //After
      const route = useRoute()
      console.log(route.query.['filters[term]'])
    ```

  - This was done in:
    - `composables/useFilter.ts`
    - `composables/useProductsSearch.ts`
    - `composables/useRouteHelpers.ts`
    - `pages/search.vue`

- **\[Search\]** Use new filter query parameter name (`filters[term]`) for search term when updating current route.
- **\[UI\]** The component prop type in the `Button.vue` and `Link.vue` components has been renamed to variant. This change prevents conflicts with the native HTML type attribute, enhancing code maintainability and reducing the risk of unexpected behavior.
- **\[UI\]** Refactor `<Listbox />` to manage the `isOpen` state without the use of `useState`. Instead of passing a name to `<ListboxButton />` and `<ListboxOption />`, they now require a function to toggle the open state.

  - Example:

    ```html
    // Before
    <SFListbox>
      <template #default="{ isOpen, list }">
        <SFListboxButton :id="id" ref="button" :list-name="list">
          ...
        </SFListboxButton>
      </template>
      <template #options="{ isOpen, list, close }">
        <SFListboxOptions>
          <SFListboxOption :list-name="list"> ... </SFListboxOption>
        </SFListboxOptions>
      </template>
    </SFListbox>
    // After
    <SFListbox>
      <template #default="{ isOpen, toggleListboxOpen }">
        <SFListboxButton
          :id="id"
          ref="button"
          :toggleListboxOpen="toggleListboxOpen"
        >
          ...
        </SFListboxButton>
      </template>
      <template #options="{ isOpen, toggleListboxOpen, close }">
        <SFListboxOptions>
          <SFListboxOption :toggleListboxOpen="toggleListboxOpen">
            ...
          </SFListboxOption>
        </SFListboxOptions>
      </template>
    </SFListbox>
    ```

  - Affected files:
    - `components/layout/headers/ShopSwitcher.vue`

- **\[Accessibility\]** Improved keyboard navigation for better accessibility.
  Users can now navigate directly to a PDP from a focused `ProductCard.vue` by simply pressing the `Enter` key.
- **\[Accessibility\]** The `SFSwitch` component now provides improved touch interaction.
  The `<label>` is now associated with the switch control using the appropriate `id` and `for` attributes.
  This allows users to easily toggle the switch by simply tapping on the label, making it significantly easier to interact with on touch devices.
- **\[Dependencies\]** We've updated to `nuxt/i18n@9.x`. This introduces a new directory structure for localization to align with the upcoming changes of Nuxt 4.
  - `lang/` directory has been renamed to `i18n/`
  - `i18n.config.ts` has been moved to `i18n/i18n.config.ts`
  - `lang/{locale}.json` translation files have been moved to `i18n/locales/{locale}.json`
  - Removed preconfigured `i18n.langDir` option in `nuxt.config.ts` to use new default directory structure
  - Additional details can be found in the [official `nuxt/i18n` v8 to v9 migration guide](https://i18n.nuxtjs.org/docs/guide/migrating#upgrading-from-nuxtjsi18n-v8x-to-v9x)
- **\[Middleware\]** We've refactored the `redirectTrailingSlash.global.ts` middleware to use a `slice()`-based approach instead of a RegEx-based approach for normalizing the URL path and added some test cases to verify its intended functionality, including some performance comparison tests with the former implementation.
- **\[Performance\]** To avoid hydration mismatches, `<AccordionEntry>` no longer generates id's used for accessibility features on its own. It now requires the id being passed from the the parent component.
- **\[Tooling\]** We've introduced `@nuxt/fonts` to streamline web font integration. This change simplifies the process of adding and managing fonts in Storefront projects while improving performance:
  - Zero-config setup for popular font providers (_Google Fonts, etc._)
  - Customization options with support for custom providers
  - Seamless Tailwind CSS Integration: Easily incorporate downloaded fonts into your Tailwind configuration for streamlined styling
  - Enhanced Privacy and Performance through Local Font Downloads: Fonts are downloaded and served from your server, addressing privacy concerns related to third-party font hosting (_like Google Fonts and GDPR compliance_) while improving your website's loading speed
  - Performance benefits:
    - Automatic font metric optimization (_using [Fontaine](https://github.com/unjs/fontaine) and [Capsize](https://github.com/seek-oss/capsize)_)
    - Build-time font caching
- **\[Shop Switcher\]** Shop switching now defaults to redirecting users to the homepage of the newly selected shop. For cases where maintaining the current path is desired, the `<ShopSwitcher />` component now accepts a `switchToHomePage` prop. Setting this prop to `false` will preserve the current path during the shop switch.

  ```html
  <ShopSwitcher :switch-to-home-page="false" />
  ```

- **\[Product\]** Cleanup and simplify product include handling. All relevant includes are now defined in `constants/withParams.ts` and there are only two product includes defined now:
  - `PRODUCT_DETAIL_WITH_PARAMS` which includes all attributes and advanced attributes to be used on the PDP and Basket
  - `PRODUCT_TILE_WITH_PARAMS` a smaller subset of data to be used for the `ProductCard` component (e.g. on the Product Listing Page, in the Search or for the Wishlist)
- **\[Wishlist\]** We overhauled the wishlist implementation and design align with the new design language of the Storefront Boilerplate
  - Removes unnecessary tracking from other pages
  - Improves grid handling for the Wishlist
  - Updates loading view of the Wishlist
  - Updates the Wishlist Header to be aligned with the Product Listing Page
- **\[Runtime\]** Upgrade Dockerfiles to Node 22 which is now the official LTS Version for Node.
- **\[E2E\]** Implemented end-to-end tests to ensure the accuracy and functionality of the Store Locator feature.
- **\[E2E\]** Implemented end-to-end tests to ensure accurate and reliable sorting functionality within Product Listing Pages (PLP)
- **\[E2E\]** Ensured Search page filters work correctly by adding end-to-end tests to verify the functionality of the filters on the Search page.
- **\[E2E\]** Refined tests to guarantee the reliability and correctness of pagination on Product Listing pages.
- **\[E2E\]** Implemented end-to-end testing for search suggestion tags and integrated tag-based filtering into the search results page.
- **\[E2E\]** Implemented an end-to-end test to verify the functionality of the shop selector, ensuring users can seamlessly switch between different shops within the platform.

### 🩹 Patch Changes

- **\[Header & Footer\]** Standardized footer logo dimensions by setting a fixed width (`w-7` / `28px`) to improve usability and prevent accidental clicks.
- **\[Header & Footer\]** Adjusted footer spacing on mobile for a more visually appealing and consistent browsing experience.
- **\[Header & Footer\]** Addressed an unexpected UI behavior in the `FooterLinkSection` component where the `expanded` state persisted after navigation.
  This fix ensures the mobile footer menu reliably collapses when navigating to a different page.
- **\[Search\]** Enhanced the search result page user experience for users on low-bandwidth or slow connections.
  Instead of immediately displaying "0 hits" while results load, the page title now dynamically indicates loading progress, providing a clearer indication of ongoing search activity.
- **\[PDP\]** Adjusted layout to prevent the best price from displaying on the same line as the current price, improving price clarity for users.
- **\[PDP\]** Improved the visual presentation of tax information next to product prices.
  Tax details are now displayed as superscript using the `<sup>` tag for consistent alignment and improved readability.
- **\[PLP\]** Adjusted spacing of `ProductCardDetails`and `ProductPrice` within `ProductCardDetails` for both mobile and desktop view.
- **\[PLP\]** Fixed overlapping sales badges on top of product name within `ProductCardDetails` by adjusting `ProductPrice` positioning for mobile view.
- **\[PLP\]** Adjusted top padding for content containers when teaser images are absent.
  This ensures optimal spacing between the breadcrumb navigation and the top of the page, enhancing visual clarity and user experience.
- **\[PLP\]** This change addresses an issue where the price filter would incorrectly persist when the `SFPriceRangeSlider` was returned to its original minimum and maximum values.
  Now, an event is emitted based on whether the provided event values match these filter limits (`resetPriceFilter` or `applyPriceFilter`).
  This ensures that the filter is properly reset in all cases, even when the slider is moved back to its initial position.
  Previously, this scenario would result in the filter remaining active (applied), as potentially indicated by the filter counter on the `FilterToggleButton`.
- **\[Promotions\]** Only add alpha value to promotion color when alpha value was passed to `getBackgroundColorStyle()` and `getTextColorStyle()`.
- **\[Promotions\]** Show `<VariantPicker>` for products with only one variant within `ProductPromotionSelectionModal.vue` and remove unused `ONE_SIZE_KEY` constant.
- **\[Basket\]** Addressed a hydration mismatch issue in the `ProductCardBadgesFooter.vue` component that occurred when a product was already present in the user's basket.
- **\[Basket\]** Removed the redundant flag `isLowestPreviousPriceActive`.
  Price display logic now relies on the SCAYLE Core System, ensuring consistency and accuracy across all supported countries.
  This change simplifies our codebase and removes the need for country-specific configurations related to lowest price display.
- **\[Accessibility\]** The `primary` variant of `SFButton` now has its outline restored to improve its visibility for impaired users.
- **\[Utilities\]** Moved `useDefaultBreakpoints` to the UI module.
- **\[Utilities\]** `getBackgroundColorStyle()` and `getTextColorStyle()` now set alpha values when using the default color.
  Previously no alpha value was set, resulting in the same color for text and background of promotion prices.
- **\[Performance\]** Local history checks inside `GoBackLink.vue` now occur after hydration to prevent potential issues.
- **\[Tooling\]** Added all Tailwind CSS duration classes to the safe list, ensuring complete availability.
  This addresses an issue where durations defined with the `duration-{duration}` syntax were unintentionally purged.
  Also consistency is improved by updating transition components to exclusively accept duration values defined within the Tailwind configuration.
- **\[Tooling\]** Added a check for the existence of the `country_selection.override_codes.<...>` translation key before resolving its translation.
  This prevents console warnings that were previously triggered when attempting to resolve nonexistent translation keys.
- **\[Tooling\]** Added `resolutions` for `globals@15.x` in `package.json` to resolve issues with executing `eslint`.
- **\[UI\]** Remove hardcoded ID from `ListBox` to avoid conflicts.
- **\[UI\]** Fixed links not opening in a new tab when they should.
- **\[UX\]** Show a `404` error on the PDP when the product cannot be found.
- **\[UI\]** Fix button variant of `ShopSwitcherItem.vue` after the option was renamed in `Button.vue`.
- **\[UX\]** Resolved an issue with the ShopSwitcher where clicking the currently selected locale would unnecessarily reload the page.
- **\[E2E\]** Optimized end-to-end test suite for user login flow to prevent potential timeouts during authentication.
- **\[E2E\]** The footer end-to-end test was enhanced to verify correct homepage redirection and scroll-to-top functionality upon clicking the footer logo.
- **\[E2E\]** Updated end-to-end test for shop switching to enforce redirection to the Homepage after a user switches shops, ensuring alignment with the latest product requirements.
  Previously, tests allowed for redirects to non-Homepage destinations, which is no longer desired behavior.
- **\[E2E\]** Implemented end-to-end test for PLP filter functionality, ensuring product counter synchronization.
- **\[E2E\]** Updated end-to-end tests to reflect Header and Footer modifications.
- **\[E2E\]** Updated Footer Storefront guide URL constant value to match the updated page URL.
- **\[E2E\]** The "Verify Shop Selector switch from non-Homepage" end-to-end test `(e2e-ShopSelector.spec.ts`) is experiencing timeouts specifically on Mobile Safari during CI execution.
  This test is temporarily skipped for Mobile Safari to maintain a green CI pipeline. Investigation into the root cause of the timeouts is ongoing.
- **\[E2E\]** Ensured the accuracy of end-to-end tests for the new footer following recent updates.
- **\[E2E\]** Enhanced end-to-end tests for homepage links to ensure more robust validation.
  The tests now perform a more accurate check of response codes and status.
  Additionally, if the initial header request (`page.request.head()`) fails, a full page visit is attempted to provide more comprehensive error detection.
- **\[E2E\]** Updated tests to match the rename of the search query parameter `term` to `filters[term]` to adhere to the established filter naming convention.
  This alignment ensures that search results only display filters matching the available products.
- **\[E2E\]** Refined end-to-end test to check the PLP applied Filters counter.
- **\[E2E\]** Updated the end-to-end test for the "Happy Path" user journey to reflect recent changes made to the Header Search component.
  This ensures continued, comprehensive testing of core search functionality after implementation updates.
- **\[E2E\]** Improved the stability and consistency of tests for the Basket and Shop Selector features specifically targeting mobile Safari browser.

### 🏡 Dependency Updates

- Added dependency `@nuxt/fonts@0.10.3`
- Added dependency `@scayle/storefront-country-detection@1.0.1`
- Added dependency `@scayle/storefront-product-detail@1.0.1`
- Added dependency `@scayle/storefront-product-listing@1.1.2`
- Added dependency `dompurify@3.2.3`
- Updated dependency `@contentful/live-preview@4.5.14` to `@contentful/live-preview@4.6.3`
- Updated dependency `@scayle/nuxt-opentelemetry@0.4.0` to `@scayle/nuxt-opentelemetry@0.5.3`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.2` to `@scayle/omnichannel-nuxt@4.0.3`
- Updated dependency `@scayle/storefront-nuxt@7.95.0` to `@scayle/storefront-nuxt@8.2.0`
- Updated dependency `@storyblok/richtext@3.0.0` to `@storyblok/richtext@3.0.2`
- Updated dependency `@storyblok/vue@8.1.5` to `@storyblok/vue@8.1.6`
- Updated dependency `@vueuse/components@11.2.0` to `@vueuse/components@12.0.0`
- Updated dependency `@vueuse/core@11.2.0` to `@vueuse/core@12.0.0`
- Updated dependency `@vueuse/integrations@11.2.0` to `@vueuse/integrations@12.0.0`
- Updated dependency `@vueuse/nuxt@11.2.0` to `@vueuse/nuxt@12.0.0`
- Updated dependency `axios@1.7.7` to `axios@1.7.9`
- Updated dependency `contentful@11.2.1` to `contentful@11.3.3`
- Updated dependency `contentful-export@7.19.163` to `contentful-export@7.21.7`
- Updated dependency `dotenv@16.4.5` to `dotenv@16.4.7`
- Updated dependency `focus-trap@7.6.1` to `focus-trap@7.6.2`
- Updated dependency `knitwork@1.1.0` to `knitwork@1.2.0`
- Updated dependency `maska@3.0.3` to `maska@3.0.4`
- Updated dependency `nanoid@5.0.8` to `nanoid@5.0.9`
- Updated dependency `nuxi@3.15.0` to `nuxi@3.17.0`
- Updated dependency `storyblok-js-client@6.10.1` to `storyblok-js-client@6.10.4`
- Updated dependency `vue@3.5.12` to `vue@3.5.13`
- Updated dependency `@changesets/cli@2.27.9` to `@changesets/cli@2.27.11`
- Updated dependency `@eslint/eslintrc@3.1.0` to `@eslint/eslintrc@3.2.0`
- Updated dependency `@nuxt/eslint@0.6.1` to `@nuxt/eslint@0.7.3`
- Updated dependency `@nuxt/test-utils@3.14.4` to `@nuxt/test-utils@3.15.1`
- Updated dependency `@nuxtjs/i18n@8.5.6` to `@nuxtjs/i18n@9.1.1`
- Updated dependency `@scayle/eslint-config-storefront@4.3.2` to `@scayle/eslint-config-storefront@4.4.0`
- Updated dependency `@types/node@22.9.0` to `@types/node@22.10.2`
- Updated dependency `@typescript-eslint/scope-manager@8.14.0` to `@typescript-eslint/scope-manager@8.18.1`
- Updated dependency `@typescript-eslint/utils@8.14.0` to `@typescript-eslint/utils@8.18.1`
- Updated dependency `@vitest/coverage-v8@2.1.4` to `@vitest/coverage-v8@2.1.8`
- Updated dependency `eslint@9.14.0` to `eslint@9.17.0`
- Updated dependency `eslint-plugin-unimport@0.1.1` to `eslint-plugin-unimport@0.1.2`
- Updated dependency `happy-dom@15.11.4` to `happy-dom@15.11.7`
- Updated dependency `lint-staged@15.2.10` to `lint-staged@15.2.11`
- Updated dependency `nuxt@3.13.2` to `nuxt@3.14.1592`
- Updated dependency `nuxt-svgo@4.0.8` to `nuxt-svgo@4.0.9`
- Updated dependency `storyblok@3.35.0` to `storyblok@3.35.2`
- Updated dependency `tailwindcss@3.4.14` to `tailwindcss@3.4.17`
- Updated dependency `unimport@3.13.1` to `unimport@3.13.4`
- Updated dependency `vitest@2.1.4` to `vitest@2.1.8`

## 1.5.0

### 🔥 Highlights

#### 🤝🏼 Taking the First Steps Towards Enhanced Accessibility

This release marks the beginning of a dedicated effort to make Storefront truly inclusive for all users. We've taken the first steps by enhancing keyboard navigation, providing detailed alt text descriptions for product images, and ensuring proper language declaration for screen readers. These are just the initial steps in a long-term commitment to accessibility, with further enhancements planned in future releases. Our goal is to achieve full accessibility by 2025, making a Storefront-based shop a welcoming space for everyone.

#### 🧪 Quality Assurance Through Rigorous Testing

The team focused on expanding test coverage across critical user flows, including checkout, basket functionality, the Country Detector, and product listing pages. By addressing issues that could lead to instability and implementing stricter testing standards, this release strengthens the Storefront's reliability and minimizes the risk of errors, ultimately benefiting the end user.

#### ⚓ A More Stable and Reliable Foundation

Beyond the visible changes, this release includes numerous improvements that bolster the platform's stability and reliability. Addressing issues like inconsistent image heights, inaccurate price rounding in filters, and conflicts with the Country Detector modal ensures a smoother user experience with fewer unexpected errors. These under-the-hood enhancements contribute to a more robust and dependable Storefront for all users.

Additionally, enabling Brotli compression by default for the [Storefront Cache](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/caching#storefront-storage-cache-configuration) significantly reduces page load times, creating a snappier, more responsive browsing experience.

### 🚀 Major Changes

- **\[Architecture\]** Update default `node` version to `v22`
- **\[Accessibility\]** Enhanced the accessibility of the ShopSwitcher component by adding `aria-*` attributes to provide better context and functionality for assistive technologies. Additionally, we optimized keyboard navigation to ensure a smooth and intuitive experience for all users.
- **\[Architecture\]** Introduced `LocalizedLink`, a new wrapper component built around the existing `SFLink` of the local UI module. This component simplifies the implementation of localized links across the UI, ensuring a smoother experience for international shops.
- **\[UI\]** The ShopSelector component has been redesigned with an updated look and feel for a more intuitive and user-friendly experience.
- **\[Product Price\]** Implemented a feature to display the lowest price observed within the last 30 days alongside the current product price.

### 💅 Minor Changes

- **\[Accessibility\]** Added the `lang` attribute to the `<html>` tag across all pages. This enhancement explicitly defines the page's default language, improving accessibility for screen readers and other assistive technologies while also aiding search engines in properly indexing and displaying our content.
- **\[Architecture\]** Improved page load speed by enabling Brotli compression by default for cached data. This optimization can be customized via the `NUXT_STOREFRONT_STORAGE_CACHE_COMPRESSION` environment variable or the `storefront.storage.cache` option in `nuxt.config.ts`.
- **\[Architecture\]** We've decoupled localization functionality from individual local modules, leading to a more modular and maintainable codebase. This change paves the way to pass translated strings directly from the primary application into the respective module code.
- **\[CMS\]** Fixed handling of partial story data structures in Contentful stories of content and service pages.
- **\[Country Detection\]** Enhanced the `closeModal()` function within our Country Detection tests to include a check for the modal's visibility on page load. This improvement ensures greater test stability, particularly when the test suite is executed from a different time zone than the targeted shop, as it accounts for potential modal visibility differences based on location and time.
- **\[E2E\]** Implemented end-to-end tests (`e2e-CountryDetector.spec.ts`) to ensure robust functionality of the Country Detector feature. These tests cover key user flows such as closing the modal window, switching to a different shop, and remaining in the initial shop.
- **\[E2E\]** Improved the stability of our Checkout end-to-end tests when running in parallel by assigning a dedicated test user to each browser. This prevents conflicts that can occur when multiple tests interact with shared user data (like order information) simultaneously, leading to more reliable and consistent test results.
- **\[Internationalization\]**: Improved the localization handling within the local CMS module, ensuring accurate and efficient handling of multilingual content for a smoother user experience across all supported languages.
- **\[PDP / Subscription\]** Improved `getVariant()` method to optionally handle exact product variant ID when the parameter is passed from the test.
- **\[Product\]** Resolved the `Extraneous non-props attributes` warning within the `ProductPrice.vue` component. This ensures better code quality, making the component more readable and maintainable.
- **\[Promotion\]** Updated the `getPromotionGiftProducts` method to exclude sold-out promotion gift items, improving API response efficiency.
- **\[Search\]** Fixed an issue causing multiple requests to the `getSearchSuggestions` endpoint for a single user query. This reduces server load and improves the responsiveness of search suggestions.
- **\[UI\]** Streamlined minor part of the header to align with the new PLP and PDP.
- **\[Unit testing\]** Introduced the [factory pattern](https://thoughtbot.com/blog/announcing-fishery-a-javascript-and-typescript-factory-library#why-factories) for creating reusable mock data structures in unit tests using [`fishery`](https://github.com/thoughtbot/fishery)

### 🩹 Patch Changes

- **\[Accessibility\]** Enhanced the `useDropdownKeyboardBehavior` function to prevent potential conflicts. This is done by limiting its key-down event listeners to elements within the dropdown itself. It ensures that keyboard interactions are correctly scoped and do not unintentionally affect other page elements.
- **\[Accessibility\]** Improved accessibility of all product images by implementing detailed alt texts. This descriptive text, which now includes the product's brand, name, color, and relevant contextual information (such as gallery index or selected state), provides valuable information to users who are visually impaired, enhancing their overall browsing experience.
- **\[Basket\]** Campaign discounts are now clearly displayed within the basket summary, providing users with a transparent and accurate breakdown of their potential savings.
- **\[Cleanup\]** Remove unused components:
  - `components/addOns/AddOnsSelector.vue`
  - `product/card/ProductDetailsSkeleton.vue`
  - `product/promotion/gifts/ProductPromotionGiftImageGallery.vue`
  - `modules/ui/runtime/components/ThumbnailSlider.vue`
- **\[CMS\]** Fixed inconsistent heights of teaser images on product listing pages.
- **\[E2E\]** Addressed an issue affecting PDP end-to-end tests specifically within Chrome Mobile, where clicking the Variant Picker was frequently unsuccessful. While Playwright implements automatic retries for such actions, this often resulted in test timeouts. As the issue appears isolated to Chrome Mobile, we've introduced `{ force: true }` to the `variantPicker.click()` action. This is intended to bypass the problematic default click behavior and ensure consistent test execution across all browser environments.
- **\[E2E\]** Addressed an issue affecting sticky elements on scrolled pages in Mobile Safari. The solution replaces `mouse.wheel()` with `window.scrollTo()` for improved accuracy and reliability.
- **\[E2E\]** Enhanced Homepage end-to-end tests by refining how links are identified. We've transitioned from user-facing selectors (`getByRole('link')`) to a more comprehensive approach using (`page.locator('a')`). This ensures that we catch all links within the page, improving the thoroughness of our tests. We've also introduced a short delay using `page.waitForLoadState('domcontentloaded')` after each page visit within our Homepage end-to-end tests. This prevents issues that can arise when tests run faster than the page can load, leading to more stable and reliable test results.
- **\[E2E\]** Enhanced our Playwright end-to-end testing suite by integrating two new TypeScript linting rules within the `eslint.config.mjs` configuration:
  - `no-floating-promises`: This rule enforces the use of await for any call that returns a Promise, preventing unintentional side effects and ensuring that asynchronous operations are handled correctly within our tests.
  - `await-thenable`: This rule complements `no-floating-promises` by specifically targeting instances where await is used unnecessarily with values that are not Promises. This helps maintain consistency and clarity within our asynchronous code.
- **\[E2E\]** Enhanced PDP end-to-end testing reliability when adding products to the basket by implementing a `networkidle` wait state, ensuring all necessary network requests are complete before proceeding with the test steps.
- **\[E2E\]** Enhanced the happy path end-to-end test ( `e2e-happy-path.spec.ts`) to close the Country Detector modal window. This prevents potential blockages during test execution, leading to more reliable and consistent test results.
- **\[E2E\]** Implemented a standardized method for closing the Country Detector modal on page load across all relevant tests. This prevents potential conflicts and ensures a smoother, more reliable testing process.
- **\[E2E\]** Implemented various improvements to our end-to-end tests, making them more adaptable to data changes and reducing the likelihood of false positives. This ensures the tests remain robust and reliable even as the data evolves.
- **\[E2E\]** Improved the resilience of our PLP end-to-end tests by modifying the sibling product selection logic. Tests now dynamically target the first available product within a PLP category page instead of relying on a fixed product ID. This change ensures that tests remain valid even if the order or availability of products fluctuates.
- **\[E2E\]** Improved the robustness of the Country Detector shop switcher end-to-end test by incorporating the `first()` method. This ensures we consistently select the first matching shop element in cases where multiple options are present, preventing potential test ambiguities and enhancing overall reliability.
- **\[E2E\]** Improved the stability of our Basket end-to-end tests when running in parallel by assigning a dedicated test user to each browser. This prevents conflicts that can occur when multiple tests interact with shared user data, leading to more reliable and consistent test results.
- **\[E2E\]** Improvements in End-to-End test suite for PLP filters
  - Improved the accessibility and testability of Min and Max price input fields by adding the `data-testid` attribute.
  - Introduced the `openFilters()` method to the `productListingPage` class, simplifying the distinction between mobile and desktop test flows.
  - Updated the `Sale` filter switch element locator in `plpFilters` to reflect recent UI changes.
  - Enhanced Filter tests (`e2e-Plp.spec.ts`) to handle deep links with predefined filters more reliably and added `page.waitForLoadState('domcontentloaded')` for increased stability.
- **\[E2E\]** Improvements in End-to-End test suite for Wishlist:
  - Simplified the `productBrand` locator for greater reliability.
  - Tests related to adding products to the basket from the Wishlist have been temporarily skipped due to ongoing feature development. These tests will be reintroduced once the related functionality is fully implemented.
- **\[E2E\]** Improvements in End-to-End test suite of the PLP
  - Removed unnecessary navigation steps leading to the category page, optimizing test execution speed.
  - Improved the stability of add / remove Wishlist tests by incorporating additional DOM element waits.
- **\[E2E\]** Introduced page title checks to our PLP and PDP end-to-end tests. This ensures that the correct page titles are displayed to users, contributing to a smoother and more understandable browsing experience.
- **\[E2E\]** Made Filters deep-link test case on Product Listing Page more generic by excluding "Brand" filter.
- **\[E2E\]** Optimized mobile search tests by streamlining the `exactProductItem` locator to be more robust and less prone to errors and removing a redundant check for search category list visibility within `mobileNavigation.ts`. The test now directly verifies if the desired list item is visible and proceeds to click it, resulting in a more efficient and stable interaction flow.
- **\[E2E\]** Removed the serial execution constraint from Basket test cases, allowing them to run concurrently and further reducing overall test execution time.
- **\[E2E\]** Streamlined our Add to Basket end-to-end tests by combining the guest user and logged-in user flows. This change results in:
  - Improved Stability: Reduced the potential for inter-test interference during parallel execution.
  - Faster Execution: Eliminated redundant steps by merging separate test cases.
  - Expanded Coverage: Added a new assertion to verify that products remain in the basket after user authentication, covering a crucial aspect of the user journey.
- **\[Lighthouse\]** Implemented optimizations to significantly reduce the execution time of Lighthouse tests, enabling us to get quicker feedback on performance and identify areas for improvement more efficiently.
- **\[Lighthouse\]** The lighthouseAudit.ts script now accepts a viewportSize parameter, allowing users to run Lighthouse audits simulating either mobile or desktop environments. This improves the accuracy of performance and accessibility assessments for different device types.
- **\[PDP\]** Removed the unnecessary close icon between the size and quantity selectors.
- **\[PLP\]** Fixed price rounding in the price filter.
- **\[UI\]** Improved code consistency and readability by replacing unnecessary, arbitrary values in Tailwind classes with their more semantic equivalents. This makes our styling easier to understand and maintain.
- **\[UI\]** Removed the colons from the Countdown widget to create a cleaner and more visually appealing display.

### 🏡 Dependency updates

- Added dependency `@vueuse/components@11.2.0`
- Added dependency `@vueuse/integrations@11.2.0`
- Added dependency `focus-trap@7.6.1`
- Added dependency `tabbable@6.2.0`
- Added dependency `@testing-library/jest-dom@6.6.3`
- Added dependency `@testing-library/vue@8.1.0`
- Added dependency `fishery@2.2.2`
- Updated dependency `@contentful/live-preview@4.5.6` to `@contentful/live-preview@4.5.14`
- Updated dependency `@contentful/rich-text-html-renderer@16.6.10` to `@contentful/rich-text-html-renderer@17.0.0`
- Updated dependency `@scayle/nuxt-opentelemetry@0.3.2` to `@scayle/nuxt-opentelemetry@0.4.0`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.1` to `@scayle/omnichannel-nuxt@4.0.2`
- Updated dependency `@scayle/storefront-nuxt@7.85.12` to `@scayle/storefront-nuxt@7.95.0`
- Updated dependency `@storyblok/nuxt@6.0.12` to `@storyblok/nuxt@6.2.0`
- Updated dependency `@storyblok/richtext@2.1.0` to `@storyblok/richtext@3.0.0`
- Updated dependency `@storyblok/vue@8.1.3` to `@storyblok/vue@8.1.5`
- Updated dependency `@vueuse/core@11.1.0` to `@vueuse/core@11.2.0`
- Updated dependency `@vueuse/nuxt@11.1.0` to `@vueuse/nuxt@11.2.0`
- Updated dependency `contentful@11.0.3` to `contentful@11.2.1`
- Updated dependency `contentful-export@7.19.155` to `contentful-export@7.19.163`
- Updated dependency `nanoid@5.0.7` to `nanoid@5.0.8`
- Updated dependency `nuxi@3.14.0` to `nuxi@3.15.0`
- Updated dependency `storyblok-js-client@6.10.0` to `storyblok-js-client@6.10.1`
- Updated dependency `vue@3.5.11` to `vue@3.5.12`
- Updated dependency `@nuxt/eslint@0.5.7` to `@nuxt/eslint@0.6.1`
- Updated dependency `@nuxt/test-utils@3.14.3` to `@nuxt/test-utils@3.14.4`
- Updated dependency `@nuxtjs/i18n@8.5.5` to `@nuxtjs/i18n@8.5.6`
- Updated dependency `@nuxtjs/tailwindcss@6.12.1` to `@nuxtjs/tailwindcss@6.12.2`
- Updated dependency `@scayle/eslint-config-storefront@4.3.0` to `@scayle/eslint-config-storefront@4.3.2`
- Updated dependency `@types/color@3.0.6` to `@types/color@4.2.0`
- Updated dependency `@types/node@20.16.11` to `@types/node@22.9.0`
- Updated dependency `@typescript-eslint/scope-manager@8.8.1` to `@typescript-eslint/scope-manager@8.14.0`
- Updated dependency `@typescript-eslint/utils@8.8.1` to `@typescript-eslint/utils@8.14.0`
- Updated dependency `@upstash/redis@1.34.2` to `@upstash/redis@1.34.3`
- Updated dependency `@vitest/coverage-v8@2.1.2` to `@vitest/coverage-v8@2.1.4`
- Updated dependency `@vue/typescript-plugin@2.1.6` to `@vue/typescript-plugin@2.1.10`
- Updated dependency `eslint@9.12.0` to `eslint@9.14.0`
- Updated dependency `eslint-plugin-tailwindcss@3.17.4` to `eslint-plugin-tailwindcss@3.17.5`
- Updated dependency `eslint-plugin-unimport@0.1.0` to `eslint-plugin-unimport@0.1.1`
- Updated dependency `happy-dom@15.7.4` to `happy-dom@15.11.4`
- Updated dependency `nuxt-svgo@4.0.6` to `nuxt-svgo@4.0.8`
- Updated dependency `ofetch@1.4.0` to `ofetch@1.4.1`
- Updated dependency `postcss@8.4.47` to `postcss@8.4.49`
- Updated dependency `postcss-custom-properties@14.0.1` to `postcss-custom-properties@14.0.4`
- Updated dependency `storyblok@3.34.0` to `storyblok@3.35.0`
- Updated dependency `tailwindcss@3.4.13` to `tailwindcss@3.4.14`
- Updated dependency `typescript@5.6.2` to `typescript@5.6.3`
- Updated dependency `vitest@2.1.2` to `vitest@2.1.4`
- Updated dependency `vue-tsc@2.1.6` to `vue-tsc@2.1.10`

## 1.4.0

### 🔥 Highlights

#### 🛍️ New Product Detail Page

This release includes a newly refreshed Product Detail Page with an improved design, better accessibilty and extendability and more test coverage.

#### 🧪 PDP E2E tests

In this release we've also added a new set of E2E tests to cover the product detail page.

#### 📦 Removing Vue component auto imports

As part of our work to remove automatic imports, in this release Vue components will no longer be auto-imported. We've also added some ESLint rules to cover unimported components.

### 💅 Minor Changes

- Remove boolean props on `Modal.vue` to control styling. Instead styling is done by adding styles to the `<SFModal>` and its content.
- Add skeleton loader for the product detail page.
- Added PDP E2E tests, first phase.
- Disable auto-imports for Vue components
- Simplify the wishlist card by utilizing the plain product card and eliminating all basket-related actions.
- The basket does not allow quantity > 50. Therefore, we limit the quanty on the PDP to 50.
- Replace `InputToggle` with `Switch` component
- Enhance product card component by removing slots, simplifying the HTML structure and removing unnecessary slots.

### 🩹 Patch Changes

- Fix placement of price within the `ProductCardDetails.vue`
- Product color is now mapped by attribute value instead of ID
- Handle possibly undefined `orderData` when calculating `deliveryDate` on Order Success page
- Removes unused `useWishlistItem` and `useWishlistItemActions` from the project
- Fixed an issue on CMS content pages with empty teaser image leading to unnecessary white space
- Replace getters and setters across the app with `defineModel`
- End-to-End and Lighthouse tests adaptions to match latest changes in Storefront Boilerplate.
- Take campaign discounts into account when displaying prices on a product card
- Cleanup image utilities to always use `primaryImage`

### 🏡 Dependency updates

- Added dependency `@vueuse/gesture@2.0.0`
- Added dependency `@vue/typescript-plugin@2.1.6`
- Updated dependency `@scayle/nuxt-opentelemetry@0.3.1` to `@scayle/nuxt-opentelemetry@0.3.2`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.0` to `@scayle/omnichannel-nuxt@4.0.1`
- Updated dependency `@scayle/storefront-nuxt@7.85.7` to `@scayle/storefront-nuxt@7.85.12`
- Updated dependency `@storyblok/nuxt@6.0.10` to `@storyblok/nuxt@6.0.12`
- Updated dependency `@storyblok/richtext@2.0.0` to `@storyblok/richtext@2.1.0`
- Updated dependency `@storyblok/vue@8.1.0` to `@storyblok/vue@8.1.3`
- Updated dependency `@types/google.maps@3.58.0` to `@types/google.maps@3.58.1`
- Updated dependency `@vercel/kv@2.0.0` to `@vercel/kv@3.0.0`
- Updated dependency `axios@1.6.8` to `axios@1.7.7`
- Updated dependency `contentful@10.15.1` to `contentful@11.0.3`
- Updated dependency `contentful-export@7.19.148` to `contentful-export@7.19.155`
- Updated dependency `maska@2.1.11` to `maska@3.0.3`
- Updated dependency `nuxi@3.13.2` to `nuxi@3.14.0`
- Updated dependency `storyblok-js-client@6.9.2` to `storyblok-js-client@6.10.0`
- Updated dependency `vue@3.4.38` to `vue@3.5.11`
- Updated dependency `@changesets/cli@2.27.8` to `@changesets/cli@2.27.9`
- Updated dependency `@nuxt/image@1.7.0` to `@nuxt/image@1.8.1`
- Updated dependency `@nuxt/test-utils@3.14.2` to `@nuxt/test-utils@3.14.3`
- Updated dependency `@nuxtjs/i18n@8.5.3` to `@nuxtjs/i18n@8.5.5`
- Updated dependency `@scayle/eslint-plugin-vue-composable@0.2.0` to `@scayle/eslint-plugin-vue-composable@0.2.1`
- Updated dependency `@types/node@20.16.5` to `@types/node@20.16.11`
- Updated dependency `@typescript-eslint/scope-manager@8.6.0` to `@typescript-eslint/scope-manager@8.8.1`
- Updated dependency `@typescript-eslint/utils@8.6.0` to `@typescript-eslint/utils@8.8.1`
- Updated dependency `@upstash/redis@1.34.0` to `@upstash/redis@1.34.2`
- Updated dependency `@vitest/coverage-v8@2.1.1` to `@vitest/coverage-v8@2.1.2`
- Updated dependency `eslint@9.10.0` to `eslint@9.12.0`
- Updated dependency `nuxt@3.11.2` to `nuxt@3.13.2`
- Updated dependency `ofetch@1.3.4` to `ofetch@1.4.0`
- Updated dependency `storyblok@3.33.3` to `storyblok@3.34.0`
- Updated dependency `tailwindcss@3.4.12` to `tailwindcss@3.4.13`
- Updated dependency `unimport@3.12.0` to `unimport@3.13.1`
- Updated dependency `vitest@2.1.1` to `vitest@2.1.2`

## 1.3.0

### 🔥 Highlights

#### 🌍 Introducing Country Detection

The Storefront now includes basic functionality to detect a user's country without relying on 3rd-party services. If a user visits a shop from a different country than the one detected, a shop/country switcher modal will appear, offering the option to switch to the appropriate local or global shop or stay on the current one

##### How it works

In the `onMounted` hook, we look up the country of the user and check if it matches the current shop. If it does not match, we try to find a shop which does match that country and prompt the user to switch to the other shop. When a user is logged in or has already declined the prompt, we no longer show the dialog.

##### Disabling

If you want to disable this feature, remove the `<CountryDetection/>` component from the `default.vue` layout.

##### Customizing

The default implementation of the country detection uses the timezone of the browser to assume the user's country. If you would like to use a different method such as GeoIP lookup, the `getCurrentCountryFromTimezone` function can be easily swapped out. The replacement function should return a single country code which represents the user's country, or `undefined` if one cannot be found. Or in other words a function which matches the interface `() => string | undefined`

It's also possible to customize the `getShopsForRegion` function. The default implementation will search the available shops for those which match the detected region. If there are multiple matches, multiple options will be presented in the dialog. A fallback `shopId` can be passed as the second argument. This is useful if you have a global shop. When no shop matches the user's region, this fallback will be used instead. If there are no matches and a fallback is not specified, the user will not be prompted.

The country names shown in the prompt use the default translation of the shop's country code. If you would like to override this behavior, extend the translations file with the key `country_selection.override_codes.CODE`. The code should be uppercase.

#### 🧪 Playwright replaces Cypress as new End-to-End testing solution

We have fully transitioned from Cypress to Playwright as our End-to-End testing solution, enhancing overall test coverage in the process. Additionally, we’ve integrated Lighthouse performance testing to further improve application quality.

For more information check out the [Storefront End-To-End Testing Guide in the SCAYLE Resource Center](https://scayle.dev/en/storefront-guide/developer-guide/testing/end-to-end-testing)

#### 🛍️ PLP Performance Improvements

We’ve started further refining the performance of the new Storefront PLP. This includes resolving existing hydration issues, resulting in unnecessary partial re-rendering, optimizing the wishlist icon toggling for a more responsive user experience, as well as improving the responsiveness when switching between categories.

#### 🗞️ CMS Integration Stability Improvements

We’ve updated the CMS integration of Storefront, enhancing both Storyblok and Contentful to improve overall reliability and stability. These updates include removing unsupported legacy CMS components, optimizing content fetching behavior for certain page types, fixing multiple type-related issues, and consolidating CMS credential handling along with redundant plugin initialization.

### 🚀 Major Changes

- **\[Sorting\]** Introduced "Smart Sorting Keys" as new default sorting.

  To learn more about Smart Sorting Keys, visit the [SCAYLE Resource Center / Product Sorting](https://scayle.dev/en/developer-guide/products/product-sorting#smart-sorting-keys).

- **\[E2E\]** Removed `Cypress` and finished migration to `Playwright` as End-to-End testing suite
- **\[Country Detection\]** Added `getCurrentCountryFromTimezone` util function to determine user's country from the browser's timezone settings

### 💅 Minor Changes

- **\[PLP\]** Improve responsiveness of switching categories on the product listing page
  The following changes were made to optimize the navigation that occurs on a category switch:
  - Skipping unnecessary middlewares on the navigation
  - Not unnecessarily reloading root categories on category switch
  - Removing unnecessary awaits within `setup` functions
  - Passing `categoryId` to `useProducts` directly to avoid additional fetches
- **\[nuxt/image\]** Renamed the `default` image provider to `scayle` to improve clarity and removed the default provider setting in the `@nuxt/image` module settings to allow using local images with the `NuxtImg` component.
  For this, place your local image into the `public/` folder and use the following component:

  ```vue
  <NuxtImg src="/{fileName}" />
  ```

  _(NOTE: The filename should be without the `/public` folder name.)_

- **\[Utility Replacement\]** Replace `yn` with custom `stringToBoolean` utility function
- **\[Utility Replacement\]** Replaced `radash.sort` with native `toSorted`
- **\[Utility Replacement\]** Replaced functional utility `sort` with native `toSorted`
- **\[Utility Replacement\]** Replaced `radash.min` and `radash.sum` with custom functional utilities
- **\[Utility Replacement\]** Replaced `radash.isString` with native `typeof value === 'string` based check
- **\[Utility Replacement\]** Replaced `radash.alphabetical` with native `toSorted`
- **\[Utility Replacement\]** Replaced functional utility `isEmpty` with native `Object.values(obj).length === 0` check
- **\[Utility Replacement\]** Replaced instances of `radash.debounce` with `useDebounceFn` from `vueuse/core`
- **\[Utility Replacement\]** Replaced `sort` and `alphabetical` utils with native functionality
- **\[Utility Replacement\]** Replace `radash.sleep` with `wait` util from `@scayle/storefront-nuxt`
- **\[Utility Replacement\]** Replaced `radash.snake` with custom functional utility
- **\[Utility Replacement\]** Replaced `radash.unique` with native array operations:

  ```ts
  arrayValue.filter(
    (item, index, self) =>
      index === self.findIndex((arrayItem) => arrayItem.value === item.value),
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.dash` with native string operations

  ```ts
  stringValue
    .split(/[\s_.-]+|(?=[A-Z][a-z])/)
    .join('-')
    .toLowerCase()
  ```

- **\[Utility Replacement\]** Replaced `radash.isEqual` with custom `isEqual` util

  **NOTE:** Arbitrary comparison of objects can have a exponentially negative impact
  on performance the larger the compared objects are. We recommend to compare the
  values of explicit keys between two objects.

- **\[Utility Replacement\]** Replaced `radash.pascal` with native string operations:

  ```ts
  stringValue
    .split(/[\s_.-]+|(?=[A-Z][a-z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
  ```

- **\[Utility Replacement\]** Replaced `radash.sum` with native calculations and array operations:

  ```ts
  array.reduce((acc, item) => acc + item, 0)
  ```

- **\[Utility Replacement\]** Utility Replacement: Replaced `radash.min` with native array operations:

  ```ts
  // Plain array
  // Input: [4, 2, 8, 6]
  // Output: [2]
  Math.min(...(numbersArray.length ? numbersArray : []))

  // Array containing objects
  // Input: [{ numberValue: 4 }, { numberValue: 2 }, { numberValue: 8 }, { numberValue: 6 }]
  // Output: { numberValue: 2 }
  const getValueForComparison = (objectValue) => objectValue.numberValue
  array.reduce((a, b) =>
    getValueForComparison(a) < getValueForComparison(b) ? a : b,
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.snake` with custom native string operations:

  ```ts
  stringValue
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('_')
  ```

- **\[Utility Replacement\]** Replaced `radash.pick` with native array operations:

  ```ts
  // objectValue: Record<string, unknown>
  // keysList: string[]
  Object.fromEntries(
    keysList
      .filter((key) => key in objectValue)
      .map((key) => [key, objectValue[key]]),
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.group` with native array operations:

  ```ts
  arrayValue.reduce(
    (acc, item) => {
      const groupId = item.id // Exchange item.id with the appropriate object key
      if (!acc[groupId]) acc[groupId] = []
      acc[groupId].push(item)
      return acc
    },
    {} as Record<string, TypeOfArrayElement[]>,
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.capitalize` with native string operations:

  ```ts
  stringValue.charAt(0).toUpperCase() + stringValue.slice(1)
  ```

- **\[CMS\]** Removed auto-import capabilities of local CMS module in favor of using explicit imports for composables and utilities
- **\[CMS\]** Removed `axiosFetchAdapter` from Contentful CMS provider integration as Edge deployment support has been dropped
- **\[CMS\]** Refactored deprecated usage of `pending` from `fetchBySlug` in CMS related components to use `status` instead
- **\[CMS\]** Removed unsupported CMS components from Contentful component definitions
  - `SbListingDisruptor`
  - `SbNewsletter`
  - `SbStore`
  - `SbStorePage`
- **\[CMS\]** Removed unsupported CMS components from Storyblok component definitions -`SbListingDisruptor`
  - `SbNewsletter`
  - `SbStore`
  - `SbStorePage`
- **\[CMS\]** Fixed issues with fetching CMS data for categories and content pages due to changes in path slugs.
  Category slugs are expected to now have the form `c/c-{categoryId}` (before `category/{categoryId}`),
  while content pages are expected to have the form `content/{pageName}`(before `c/{pageName}`).
- **\[CMS\]** Fixed possible composable misuse errors.
  `useCMS` has been split into `useCMSBySlug` and `useCMSByFolder` to avoid possible errors,
  caused by calling a composable outside the appropriate context.
  This applies to both the Contentful and Storyblok providers.

  - Before:

    ```ts
    const { fetchBySlug } = useCMS('some-key')
    const { data } = fetchBySlug('some-slug')
    ```

  - After:

    ```ts
    const { data } = useCMSBySlug('some-key', 'some-slug')
    ```

- **\[E2E\]** Added tests for checking basic Home page layout and link validity
- **\[E2E\]** Added tests for Wishlist page
- **\[E2E\]** Added tests for User Orders page, user with and without orders
- **\[E2E\]** Added basic tests for Checkout page
- **\[E2E\]** Added tests to check Footer functionalities
- **\[E2E\]** Added tests for Promotion banner basic features
- **\[E2E\]** Added tests to verify User Account page features
  - Verify User personal data layout
  - Update birth date with correct and incorrect date format
  - Update password matching and non-matching new password
- **\[E2E\]** Added tests for Basket:
  - Empty state guest and logged in user
  - Add to Basket guest and logged in user
  - Basket features for regular product
- **\[E2E\]** Extended Product Listing Page test with sibling test cases
- **\[E2E\]** Extended tests for basket by adding `data-testid` attributes to "Login" and "Continue shopping" buttons in Basket empty state
- **\[E2E\]** Set up mobile testing in Playwright to cover Chrome and Safari
  - Adaption of test `e2e-happy-path.spec.ts` to work with mobile navigation
- **\[E2E\]** Extends tests for Search to run on mobile devices
  - Added mobile specific locators to work with navigation and search features on mobile devices.
- **\[E2E\]** Optimizing tests to run faster and be more resilient
  - Added `{ waitUntil: 'commit' }` or `{ waitUntil: 'load' }` to `page.goto()` method where possible
  - Implemented retry mechanism using `expect()` to handle callback function with the
    Playwright built-in `toPass()` method to avoid possible failures caused by hydration
  - Added `test.step` into some tests with more steps to complete, to achieve better readability in the reports
- **\[E2E\]** Adapting E2E tests to use new test ID attributes due to the migration of existing `data-test-id` to `data-testid`. This enables Playwright to use built-in locator `getByTestId()`
  - Deleted existing PLP `.spec.ts` files and added all PLP tests to `e2e-Plp-spec.ts`,
    so this file now contains all current and future PLP tests.
    Having multiple tests within one `.spec.ts` file follows the logic of having
    multiple tests within one test suite related to respective application section.
  - Added test to check add/remove to/from Wishlist from PLP page
- **\[UI\]** Updated the `Modal` component to use native HTML `<dialog>` element
- **\[UI\]** Removed unused `SFSlideshow` component

### 🩹 Patch Changes

- **\[CMS\]** Fixed footer social media icons not being visible even though content had been set via CMS provider
- **\[CMS\]** Fixed issues with Storyblok CMS setup by removing legacy runtime option (`public.storyblok` in `nuxt.config.ts`)
  and ensuring the necessary `accessToken` is not overriden during Storyblok module initialization.
- **\[CMS\]** Fixed issues with Storyblok CMS setup where the `@storyblok/vue` plugin has been initialized twice, resulting in misleading runtime warnings and errors.
- **\[CMS\]** Replaced Storyblok RichTextResolver class with dedicated `@storyblok/richtext` dependency
- **\[CMS\]** Removed deprecated `AppFooter` component as it has been replaced by `CMSAppFooter`
- **\[CMS\]** Fixed handling of empty Contentful CMS link values resulting in application crashes
- **\[CMS\]** Fixed type errors in Contentful's `useCms` composable
- **\[Code Style\]** Applied consistent `v-bind` style and enforced through lint rule
- **\[Code Style\]** Enabled and enforced `tailwindcss/no-custom-classname` lint rule
- **\[Code Style\]** Resolved `no-explicit-any` issues in Vue components
- **\[Code Style\]** Resolved `no-explicit-any` warnings in CMS modules
- **\[Code Style\]** Enabled and enforced `no-explicit-any` lint rule and resolved remaining warnings
- **\[Code Style\]** Resolved `no-explicit-any` warnings in tracking composables and utils
- **\[Config\]** Removed duplicate TailwindCSS generation
- **\[Config\]** Resolved nuxt-i18n issues with domain shop selection
  - Remove unused variable from `.env.example`
  - Use unique placeholder domains in nuxt-i18n config
  - Replace the deprecated `iso` option with `language`
- **\[Config\]** Removed `vite.build.rollupOptions.external` option to handle former
  `@scayle/omnichannel-nuxt` Nuxt 2-support for `@nuxtjs/composition-api` in `nuxt.config.ts`
- **\[Config\]** Enabled `noImplicitAny` in `tsconfig.json`
- **\[Config\]** Fixed missing image modifiers in SCAYLE provider for `nuxt/image` module
- **\[Config\]** Enable cookieStore option to resolve Lighthouse `bfcache` audit
- **\[PLP\]** Fixed focus behavior to don't focus close button in `FilterSlideIn`
- **\[PLP\]** Fixed hydration error on product list caused by invalid HTML (nested anchor elements)
- **\[PLP\]** Only fetch necessary product attributes from SAPI to reduce payload size
- **\[PLP\]** Improve perceived performance of the wishlist toggle by optimistically changing the icon
- **\[PLP\]** Tweaked `useFilter` and `useProductsByCategory` to use the same parameters to avoid discrepancies
- **\[PLP\]** Brought back `details` slot on `ProductCard.vue` which had been removed previously
- **\[PLP\]** Used correct product name in URL when linking to PDP
- **\[PLP\]** Fixed current `categoryID` not being passed to `FilterSlideIn`
- **\[PLP\]** Used responsive classes instead of rendering different DOM based on size
- **\[PLP\]** Fixed height of `FilterSlideIn` on mobile devices
- **\[Translations\]** Fixed the english translation for free gifts on the PDP
- **\[UI\]** Fixed scaling issue with large logout button on `AccountPage`

### 🏡 Dependency Updates

- Added dependency `@storyblok/richtext@2.0.0`
- Removed dependency `nuxt-jsonld@2.0.8`
- Removed dependency `radash@12.1.0`
- Removed dependency `yn@5.0.0`
- Updated dependency from `@contentful/live-preview@4.5.1` to `@contentful/live-preview@4.5.6`
- Updated dependency from `@contentful/rich-text-html-renderer@16.6.8` to `@contentful/rich-text-html-renderer@16.6.10`
- Updated dependency from `@scayle/storefront-nuxt@7.84.4` to `@scayle/storefront-nuxt@7.85.7`
- Updated dependency from `@storyblok/vue@8.0.8` to `@storyblok/vue@8.1.0`
- Updated dependency from `@tailwindcss/forms@0.5.7` to `@tailwindcss/forms@0.5.9`
- Updated dependency from `@tailwindcss/typography@0.5.14` to `@tailwindcss/typography@0.5.15`
- Updated dependency from `@types/google.maps@3.55.12` to `@types/google.maps@3.58.0`
- Updated dependency from `@vueuse/core@10.11.1` to `@vueuse/core@11.1.0`
- Updated dependency from `@vueuse/nuxt@10.11.1` to `@vueuse/nuxt@11.1.0`
- Updated dependency from `cf-content-types-generator@2.15.3` to `cf-content-types-generator@2.15.5`
- Updated dependency from `contentful-export@7.19.145` to `contentful-export@7.19.148`
- Updated dependency from `contentful@10.13.2` to `contentful@10.15.1`
- Updated dependency from `nuxi@3.12.0` to `nuxi@3.13.2`
- Updated dependency from `storyblok-js-client@6.8.1` to `storyblok-js-client@6.9.2`
- Updated dependency from `vue@3.4.36` to `vue@3.4.38`
- Updated dependency from `@changesets/cli@2.27.7` to `@changesets/cli@2.27.8`
- Updated dependency from `@nuxt/eslint@0.4.0` to `@nuxt/eslint@0.5.7`
- Updated dependency from `@nuxt/test-utils@3.14.0` to `@nuxt/test-utils@3.14.2`
- Updated dependency from `@nuxtjs/i18n@8.3.3` to `@nuxtjs/i18n@8.5.3`
- Updated dependency from `@types/node@20.14.15` to `@types/node@20.16.5`
- Updated dependency from `@typescript-eslint/scope-manager@8.0.1` to `@typescript-eslint/scope-manager@8.6.0`
- Updated dependency from `@typescript-eslint/utils@8.0.1` to `@typescript-eslint/utils@8.6.0`
- Updated dependency from `@vitest/coverage-v8@2.0.5` to `@vitest/coverage-v8@2.1.1`
- Updated dependency from `eslint-plugin-unimport@0.0.3` to `eslint-plugin-unimport@0.1.0`
- Updated dependency from `eslint@9.9.0` to `eslint@9.10.0`
- Updated dependency from `happy-dom@14.12.3` to `happy-dom@15.7.4`
- Updated dependency from `lint-staged@15.2.8` to `lint-staged@15.2.10`
- Updated dependency from `nuxt-svgo@4.0.3` to `nuxt-svgo@4.0.6`
- Updated dependency from `postcss-custom-properties@14.0.0` to `postcss-custom-properties@14.0.1`
- Updated dependency from `postcss@8.4.41` to `postcss@8.4.47`
- Updated dependency from `storyblok@3.32.3` to `storyblok@3.33.3`
- Updated dependency from `tailwindcss@3.4.9` to `tailwindcss@3.4.12`
- Updated dependency from `typescript@5.5.4` to `typescript@5.6.2`
- Updated dependency from `unimport@3.10.0` to `unimport@3.12.0`
- Updated dependency from `vitest-environment-nuxt@1.0.0` to `vitest-environment-nuxt@1.0.1`
- Updated dependency from `vitest@2.0.5` to `vitest@2.1.1`
- Updated dependency from `vue-tsc@2.0.29` to `vue-tsc@2.1.6`

## 1.2.0

### 🔥 Highlights

#### 🛍️ New Product Listing Page

This release not only introduces a fresh look and feel of the Product Listing Page
but also brings enhanced functionalities to improve the user experience:

- **Advanced filtering:** Improved filters to help users easily find the products
  they are looking for by dynamically updating filters and displaying only relevant filter options.
- **Intuitive category navigation:** Navigate seamlessly between nested and root categories.
- **Enhanced badges:** Badges highlight features, novelty, or other product attributes.
  This includes the "New In" badge for newly added products, custom badges for specific attributes (e.g., sustainability),
  and the "Already in Basket" badge to help users avoid duplicate selections.

Moreover, the new page is built with a simple and easily customizable codebase,
ensuring that it can be tailored to meet your specific needs.

To learn more about the main components, data fetching and filtering logic,
and customization opportunities, please refer to our [Storefront Guide](https://scayle.dev/en/storefront-guide/developer-guide/features/pages/product-listing-page).

#### 🔀 Multiple paths per shop

We now have the ability to configure multiple URL paths for single shops (per `shopId`),
where before could only handle one URL path per single shop.
As example, this allows the same shop to be reachable under multiple different
paths like `your-shop.com/en-gb/`, `your-shop.com/en-us/`, `your-shop.com/en-au/`.
This reduces the need for excessive configurations, while simultaneously enhancing performance.

The `path` property in the shop config can now be defined as an array of strings.
If this is the case, multiple path prefixes will point to the same shop.
For example, with the config `{ path: ['en', 'en-US'], shopId: 1001 }` both
`example.com/en` and `example.com/en-US` will use shop 1001.
Because it is the same shop, `/en` and `/en-US` will have the same locale and share user sessions, baskets and wishlists.
The first path in the array will be considered the default path and used for API calls.

#### 🔭 Dedicated NPM package for OpenTelemetry integration

A while back we introduced support for OpenTelemetry. OpenTelemetry is an open-source
standard for instrumenting your applications, providing valuable insights into performance and behavior.
It allows you to collect, process, and export telemetry data like metrics, logs,
and traces to various backend platforms, enabling better monitoring and troubleshooting.
As part of our commitment to contributing more to the open-source community,
we've published the previous integration as a dedicated NPM package, making it widely
accessible and improving its capabilities.

### 🚀 Major Changes

- Use the newly introduced `useRpcCall` helper composable
  _(More information can be found in the [SCAYLE Resource Center](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/rpc-methods#userpccall))_
- Replace the internal OpenTelemetry module with the `@scayle/nuxt-opentelemetry` package
- Re-enable caching for Vercel deployments
- Retrieve access token for `subscription-overview` web component via `getAccessToken` RPC
- Disabled `imports.autoImports` in `nuxt.config.ts`. All required composables,
  utils and constants now need to be explicitly imported.
- Added a hook within `nuxt.config.ts` to extend the `vite` client build configuration and allow for improved manual
  chunking of `storyblok`, `contentful` and `axios` dependencies. This results in smaller client chunks below 500kb.

### 💅 Minor Changes

- Migrate configuration key `bapi` to `sapi` within `nuxt.config.ts`
- Renamed buildtime environment variable `DISABLE_PAGE_CACHE` to `PAGE_CACHE_DISABLED`
- Renamed buildtime environment variable `ENABLE_CONFIG_LOG_BUILD` to `CONFIG_LOG_BUILD_ENABLED`
- Renamed buildtime environment variable `ENABLE_CONFIG_LOG_PRETTIER` to `CONFIG_LOG_PRETTIER_ENABLED`
- Renamed buildtime environment variable `ENABLE_CONFIG_LOG_RUNTIME` to `CONFIG_LOG_RUNTIME_ENABLED`
- Renamed buildtime environment variable `ENABLE_NUXT_DEBUGGING` to `NUXT_DEBUGGING_ENABLED`
- Show IDP login buttons in `RegisterForm.vue`
- Support toggling shop selection modes through a single const `SHOP_SELECTOR_MODE` in the nuxt config
- Switch to `ModuleBaseOptions.shops` and `ShopConfig.shopCampaignKeyword`

### 🩹 Patch Changes

- Add example multi-path shop
- Add missing `diverse` option to `UserPersonalInfoForm.vue`

- Allow `PromotionList.vue` to scroll to make all promotions accessible on smaller desktop sizes
- Disable global components in local `ui` module
- Fixed "More"-button of mobile search results now leads to search page
- Fixed disabled sold out sizes when adding wishlist items to the cart
- Hide `UpdatePasswordForm.vue` for IDP user within Account Overview page
- Remove `idp` from `AdditionalShopConfig`, as it is available in the base storefront configuration
- Remove required rule on `birthDate` field in `UserPersonalInfoForm.vue`
- Remove unnecessary `await` when using composables
- Use integrated `nuxi typecheck` instead of custom `vue-tsc` typecheck script command
- Use unique composable keys for `useOrderDetails` and within `usePromotionGifts`
- Wait for user input completion before displaying any errors in the login form

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Added `@scayle/nuxt-opentelemetry@0.3.0`
- Updated to `@contentful/live-preview@4.5.0`
- Updated to `@contentful/rich-text-html-renderer@16.6.8`
- Updated to `@googlemaps/js-api-loader@1.16.8`
- Updated to `@opentelemetry/auto-instrumentations-node@0.49.0`
- Updated to `@scayle/omnichannel-nuxt@3.0.3`
- Updated to `@scayle/storefront-nuxt@7.84.0`
- Updated to `@types/google.maps@3.55.12`
- Updated to `contentful@10.13.1`
- Updated to `redis@4.7.0`
- Updated to `storyblok-js-client@6.8.1`
- Updated to `ufo@1.5.4`
- Updated to `vue@3.4.35`
- Removed `@opentelemetry/api`
- Removed `@opentelemetry/auto-instrumentations-node`
- Removed `@opentelemetry/exporter-trace-otlp-proto`
- Removed `@opentelemetry/instrumentation`
- Removed `@opentelemetry/resources`
- Removed `@opentelemetry/sdk-node`
- Removed `@opentelemetry/semantic-conventions`
- Removed `@vercel/otel`

#### 🏠 dependencies

- Updated to `@changesets/cli@2.27.7`
- Updated to `@nuxt/eslint@0.4.0`
- Updated to `@nuxt/test-utils@3.14.0`
- Updated to `@nuxtjs/i18n@8.3.3`
- Updated to `@nuxtjs/tailwindcss@6.12.1`
- Updated to `@scayle/eslint-config-storefront@4.3.0`
- Updated to `@types/node@20.14.14`
- Updated to `@typescript-eslint/scope-manager@8.0.0`
- Updated to `@typescript-eslint/utils@8.0.0`
- Updated to `@upstash/redis@1.34.0`
- Updated to `@vitest/coverage-v8@2.0.5`
- Updated to `eslint-plugin-vuejs-accessibility@2.4.1`
- Updated to `eslint@9.8.0`
- Updated to `nuxt-svgo@4.0.2`
- Updated to `nuxt@3.11.2`
- Updated to `postcss-custom-properties@13.3.12`
- Updated to `postcss@8.4.40`
- Updated to `storyblok@3.32.3`
- Updated to `tailwindcss@3.4.7`
- Updated to `typescript@5.5.4`
- Updated to `unimport@3.9.1`
- Updated to `vitest@2.0.5`
- Updated to `vue-tsc@2.0.29`

## 1.1.0

### 🔥 Highlights

#### 👓 Live Preview for CMS provider

We have integrated proper Live Preview support for Storyblok and Contentful.
This allows to edit the CMS content elements within the respective CMS provider
web interface and show the changes immediately in the context of the Storefront application.

- \*\*\[Storyblok: Editor Guides - Visual Editor](https://www.storyblok.com/docs/editor-guides/visual-editor)
- \*\*\[Contentful: Developer Docs - Live preview](https://www.contentful.com/developers/docs/tutorials/general/live-preview/)

#### 🚚 Introduced usage of explicit imports for Vue components

To align more with the JavaScript and TypeScript developer ecosystem,
Storefront Boilerplate is slowly moving away on relying on the Nuxt "auto import" feature
for dependencies and source code. With the next `v1.2` release we will deepen
the commitment and will disable the option `imports.autoImport` within the `nuxt.config.ts`.

As a first step we added explicit imports to all Vue components.
As `defineProps`, `defineEmits` and `withDefaults` are Vue compiler macros,
they do not need to be imported explicitly and will trigger a compiler warning if done so.

### 🚀 Major Changes

- Enable live preview for CMS provider `storyblok`
- Enable live preview for CMS provider `contentful`
- Introduced local module `storefront-eslint-auto-explicit-import` to extend `eslint` with explicit import injection
- Introduced usage of explicit imports for composables, utilities and framework-specific functionalities in Vue components
- Fixed errors in async composable usage
  - This change enables all rules in `@scayle/eslint-plugin-vue-composable` and
    ensures that all composables in the application conform to best practices regarding asynchronous usage.
    These changes may fix various bugs relating to reactivity issues.
    As part of this change, some composables are now entirely synchronous.

### 💅 Minor Changes

- Introducing [eslint-plugin-vuejs-accessibility](https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility) for basic accessibility linting of Vue components
- Renamed prop `until` to `timeUntil` for `SFCountdown` and `PromotionCountdown` components to avoid name collision with `until` from `@vueuse/core`
- Replace `radash-nuxt` module with `radash` as dependency and use explicit imports instead
- Share PDP state with `useProductDetailsBasketActions` and `ProductBasketAndWishlistActions.vue`
- Updated mobile sidebar navigation to support expanding and collapsing top-level categories

### 🩹 Patch Changes

- Ensure `authGuard.global.ts` has user information during SSR
- Ensure the OSP only does the user refresh on client side
- Fixed `SFLink` in `Breadcrumbs`
- Fixed missing error alert on failed login
- Fixed mobile basket layout when there are products with long titles
- Fixed Regenerate the `itemGroup.id` each time an itemGroup is added to the basket
- Fixed selected gender being ignored during registration
- Prevent old user data from being applied to the state after `user.forceRefresh()` as happened on the OSP

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Added `@typescript-eslint/scope-manager@7.13.1`
- Added `@typescript-eslint/utils@7.13.1`
- Added `eslint-plugin-unimport@0.0.3`
- Added `eslint-plugin-vuejs-accessibility@2.3.0`
- Added `eslint@9.5.0`
- Added `pathe@1.1.2`
- Added `unimport@3.7.2`
- Updated to `@changesets/cli@2.27.5`
- Updated to `@types/node@20.14.6`
- Updated to `@typescript-eslint/scope-manager@7.13.1`
- Updated to `eslint-plugin-tailwindcss@3.17.4`
- Updated to `happy-dom@14.12.3`
- Updated to `lint-staged@15.2.7`
- Updated to `storyblok@3.32.1`
- Updated to `tailwindcss@3.4.4`
- Updated to `vue-tsc@2.0.21`

#### 🏠 dependencies

- Added `@contentful/live-preview@4.2.2`
- Added `radash@12.1.0`
- Removed `radash-nuxt`
- Updated to `@contentful/rich-text-html-renderer@16.5.2`
- Updated to `@opentelemetry/api@1.9.0`
- Updated to `@opentelemetry/auto-instrumentations-node@0.47.1`
- Updated to `@opentelemetry/exporter-trace-otlp-proto@0.52.1`
- Updated to `@opentelemetry/instrumentation@0.52.1`
- Updated to `@opentelemetry/resources@1.25.1`
- Updated to `@opentelemetry/sdk-node@0.52.1`
- Updated to `@opentelemetry/semantic-conventions@1.25.1`
- Updated to `@scayle/omnichannel-nuxt@3.0.2`
- Updated to `@scayle/storefront-nuxt@7.77.0`
- Updated to `@types/google.maps@3.55.10`
- Updated to `@vercel/kv@2.0.0`
- Updated to `@vueuse/core@10.11.0`
- Updated to `@vueuse/nuxt@10.11.0`
- Updated to `cf-content-types-generator@2.15.3`
- Updated to `contentful@10.12.1`
- Updated to `nuxi@3.12.0`

## 1.0.0

### 🔥 Highlights

#### 🧱 Introducing `storefront-ui` local module

We're introducing the first step towards more reusable components, the local `storefront-ui` module.
It contains most common and reused UI component from across the SCAYLE Storefront Boilerplate.
The first iteration consists of most components mostly formerly located within the `./components/ui` directory.

To foster an increased separation of concerns, the local `storefront-ui` module also contains composables and utilities that are closely related to the common and reused UI component.
Moreover, all components within the the local `storefront-ui` module are now prefixed with `SF` (_configurable via `nuxt.config`_) when using the components within the SCAYLE Storefront Boilerplate.

#### 📡 Create OpenTelemetry spans for Nitro requests

In addition to initializing the OpenTelemetry SDK, the OpenTelemetry module now instruments incoming requests to the Nitro server.
The spans include the matched route name, HTTP method and other request metadata.

### 💅 Minor Changes

- Implemented an early return in `authGuard.global.ts` for API routes to prevent middleware misuse.
- Switched from passing plain `basket-id` and `campaign-key` to passing JWT, containing `basket-id` and `campaign-key` as payload, to `scayle-checkout`

### 🩹 Patch Changes

- Updated badges to new arguments to use headlineParts as primary source and fallback to basketLabel if headlineParts are not defined.
- Fixed `ProductBadge` translation warnings
- Fixed banner price calculation for promotion aggregation
- Fixed contentful Image.vue and contentful ImageText.vue. Only show image when an src link is available. Both image components now behave similar to the storyblok implementation.
- Fixed lost reactivity of `lastLoggedInUser` from `useLastLoggedInUser()`
- Fixed filter reset all button when price is changed
- Fixed new icon on free product
- Added promotion price overlay on PDP
- Improved countdown element style across the basket page and PDP page
- Fixed badges position on mobile
- Added ability to show and hide promotions
- Fixed badge styling in product card
- Switched from `ay-checkout` to `scayle-checkout` web component

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Added `@vue/test-utils@2.4.6`
- Added `happy-dom@14.11.2`
- Removed `@crowdin/cli`
- Updated to `@changesets/cli@2.27.3`
- Updated to `@eslint/eslintrc@3.1.0`
- Updated to `@nuxt/eslint@0.3.13`
- Updated to `@nuxt/image@1.7.0`
- Updated to `@nuxt/test-utils@3.13.1`
- Updated to `@scayle/eslint-config-storefront@4.2.0`
- Updated to `@scayle/eslint-plugin-vue-composable@0.2.0`
- Updated to `@types/node@20.12.12`
- Updated to `@upstash/redis@1.31.3`
- Updated to `@vitest/coverage-v8@1.6.0`
- Updated to `eslint-plugin-tailwindcss@3.17.0`
- Updated to `eslint@9.3.0`
- Updated to `lint-staged@15.2.5`
- Updated to `nuxt-svgo@4.0.1`
- Updated to `postcss-custom-properties@13.3.10`
- Updated to `postcss-html@1.7.0`
- Updated to `storyblok-generate-ts@2.1.0`
- Updated to `storyblok@3.31.1`
- Updated to `vitest@1.6.0`
- Updated to `vue-tsc@2.0.19`

#### 🏠 dependencies

- Updated to `@opentelemetry/auto-instrumentations-node@0.46.1`
- Updated to `@opentelemetry/exporter-trace-otlp-proto@0.51.1`
- Updated to `@opentelemetry/instrumentation@0.51.1`
- Updated to `@opentelemetry/resources@1.24.1`
- Updated to `@opentelemetry/sdk-node@0.51.1`
- Updated to `@opentelemetry/semantic-conventions@1.24.1`
- Updated to `@scayle/storefront-nuxt@7.72.1`
- Updated to `@types/google.maps@3.55.9`
- Updated to `@vercel/otel@1.8.3`
- Updated to `contentful@10.11.7`
- Updated to `contentful-export@7.19.145`
- Updated to `import-in-the-middle@1.7.4`
- Updated to `redis@4.6.14`

## 1.0.0-rc.10

### 🔥 Highlights

#### 📡 HTTP Request tracing with OpenTelemetry

The Storefront Boilerplate now includes a built-in integration with [OpenTelemetry](https://opentelemetry.io/).
To enable the feature, set the environment variable `OTEL_ENABLED` to `true`.
This will inject additional code into your application's entrypoint which will initialize the OpenTelemetry SDK.
Automatic instrumentations as well as instrumentations from `storefront-nuxt` will be captured and exported via the OTLP protocol.

Currently, Vercel and Node are the only supported platforms for the OpenTelemetry integration.
Setting `OTEL_ENABLED` to `true` when building for other platforms will have no effect.

You should also set the runtime variable `OTEL_SERVICE_NAME` to configure the service name used in traces. e.g. `OTEL_SERVICE_NAME=storefront-boilerplate`
Note: this variable is used directly by the OpenTelemetry libraries and is not available in the Nuxt `runtimeConfiguration`.

#### 🛍️ Improved UX / UI for Promotions

We've redesigned the promotion badges displayed on the Product Listing Page, the Wishlist, and the Basket page.
The Badge text originates from Storefront APIs `customData`, with `headlineParts` in bold and `badgeLabel` in regular font.
We now implement ellipsis for long `badgeLabel` texts.

Please Note: Due to space constraints, the basket page shows only `badgeLabel`; if it is missing, it will fallback to `headlineParts`.

We have also improved the user experience on the Product Detail page with free gift options.
When the condition of a product, that has a free gift option configured, are met,
a free gift option will be displayed on the page with a grayed-out overlay.
Once conditions are met, a free gift option will be enabled and the user can add a free gift product to the cart.

#### 🔍 Improved linting setup with ESLint v9

The Storefront Boilerplate now includes an improved linting setup.
Relying on the new [ESLint 9](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) and [`@nuxt/eslint` module](https://eslint.nuxt.com/packages/module) to provide more project-aware linting.
To make configuration more easier the ESLint config has been updated to the new [flat config format](https://eslint.org/blog/2022/08/new-config-system-part-2/), allowing for simpler customization and overriding of rules.
Additionally the default Storefront ESLint config `@scayle/eslint-config-storefront` v4 is now using a subset of opinionated rules of [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).

### 💅 Minor Changes

- Added subscription cancellation page to the subscription module
- New Price adoptions for basket page for promotions
- Increased eslint `no-composable-after-await` rule error level and fix the issues
- Fix caching for domain-based setups where we now consider the host for the SSR cache key.

  Additionally, we now set an `integrity` value that invalidates the SSR cache automatically when a new build is deployed.
  You can control the value through the `VERSION` environment variable, which should be set to your current Git short commit sha.

  Either you can set this normally during your build process

  ```sh
  VERSION=147f33d yarn build
  ```

  or when using the docker image

  ```sh
  docker build --build-arg VERSION=${GIT_SHORT_COMMIT_SHA} -f docker/node/Dockerfile .
  ```

### 🩹 Patch Changes

- Removed an unnecessary CSS property which caused a visual bug on basket page
- Resolved a bug that affected the fetching of `combineWith` products
- Resolved the issue where the welcome login tab was displayed instead of the registration tab upon clicking the register link.
- Implemented a new utility function to format addresses dynamically. The function adjusts the address format according to the countryCode

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Added `"@eslint/eslintrc@3.0.2",`
- Added `@nuxt/eslint@0.3.10`
- Updated to `@nuxt/test-utils@3.12.1`
- Updated to `@nuxtjs/i18n@8.3.1`
- Updated to `@nuxtjs/tailwindcss@6.12.0`
- Updated to `@scayle/eslint-config-storefront@4.0.0`
- Updated to `@upstash/redis@1.30.0`
- Updated to `@vitest/coverage-v8@1.5.2`
- Updated to `eslint@9.1.1`
- Updated to `postcss-custom-properties@13.3.8`
- Updated to `vitest@1.5.2`
- Updated to `vue-tsc@2.0.15`

#### 🏠 dependencies

- Added `@opentelemetry/api": "1.8.0`
- Added `@opentelemetry/auto-instrumentations-node": "0.45.0`
- Added `@opentelemetry/exporter-trace-otlp-proto": "0.51.0`
- Added `@opentelemetry/instrumentation": "0.51.0`
- Added `@opentelemetry/resources": "1.24.0`
- Added `@opentelemetry/sdk-node": "0.51.0`
- Added `@opentelemetry/semantic-conventions": "1.24.0`
- Added `@vercel/otel": "1.8.2`
- Added `knitwork": "1.1.0`
- Updated to `@scayle/omnichannel-nuxt": "3.0.0` to be compatible with latest Omnichannel API
- Updated to `@scayle/storefront-nuxt": "7.66.4`
- Updated to `@storyblok/nuxt": "6.0.10`
- Updated to `@storyblok/vue": "8.0.8`
- Updated to `@tailwindcss/typography": "0.5.13`
- Updated to `cf-content-types-generator": "2.15.1`
- Updated to `contentful": "10.9.0`
- Updated to `storyblok-js-client": "6.7.3`

## 1.0.0-rc.9

### 🔥 Highlights

#### 📖 Introducing Contentful as new CMS Provider for StorefrontCMS

We've added a Contentful integration as alternative to using Storyblok as CMS provider. This allows you to fetch data from Contentful and use it in your SFB.
To use this feature, you need to provide your Contentful space ID and access token in the `.env` file. You can find these values in your Contentful account settings.

```sh
NUXT_PUBLIC_CMS_ACCESS_TOKEN=your-access-token
NUXT_PUBLIC_CMS_SPACE=your-space-id
```

Once you have added these values, you can use Contentful by selecting the `contentful` option in the `cms.provider` field of the `nuxt.config.ts` file.

```ts
export default defineNuxtConfig({
  // ...
  cms: {
    provider: 'contentful',
  },
  // ...
})
```

Now you have access to `useCMS` composables and fetch data from Contentful in your SFB. `useCMS` accepts a string as an argument that will be used for caching purposes and returns a `fetchBySlug` function that you can use to fetch data by slug. `fetchBySlug` is a wrapper around Nuxt's `useAsyncData` and accepts a generic type that you can use to define the shape of the data you are fetching. Here is and example of how you can use this feature:

```ts
import type { TypeListingPageSkeleton } from '~/modules/cms/providers/contentful/types/contentful-defs'

const props = defineProps<{
  selectedCategory: number | undefined
}>()

const route = useRoute()

if (!props.selectedCategory) {
  console.log('No category selected')
}
const { fetchBySlug } = useCMS(`ListingPage-${route.path}`)

const { data } = await fetchBySlug<TypeListingPageSkeleton>(
  `categories/${props.selectedCategory}`,
)
```

#### 🔎 Introducing Search Engine v2

We've implemented and replaced the whole search flow based on the new `Search Engine v2`.
This includes:

- Overall UI and UX adaptations (header search input, suggestions dropdown, applicable filter indicator, search within mobile sidebar, etc.)
- Category suggestions that can have filters applied
- Product suggestions that are resolved only by entering the exact ID
- Refined flow when resolving the search term
- Search page usage only as a fallback

#### Added Subscription Addon

We've implemented the Subscription Addons as a local module.
The subscription feature enables customers to subscribe to a specific variant of a product, which is then delivered at regular intervals on a chosen day.
This convenience allows customers to make regular purchases effortlessly.

### 🚀 Major Changes

- Fixed an issue where an empty IDP component was shown when no IDPs are enabled.
  The `useIDP` composable now returns an empty object when the IDP integration is not enabled.
  Ensure that the user is redirected to CO when entering the sign-in page with a `redirectUrl` parameter.
  This is now possible with the `@scayle/storefront-nuxt@{version}`.
  We refactored the IDP callback to have its own page to ensure we only call the IDP login RPC once.
- Improved Storyblok integration through SCAYLE Panel Add-on and plugin
- Disabled caching for Vercel Deployments
  Vercel's CDN Caching works slightly differently from the default Nuxt Page caching, which is currently incompatible with our Session handling.
  To disable all caching for Vercel Deployments, remove any `routeRules` you have configured in your `nuxt.config.ts`.
- Added ability to scroll to anchor links on the same page.
  The `Paragraph` component now supports an `anchor` prop that will be used to create an anchor target for that paragraph.
  If you have a Table of Contents and want to link to a specific paragraph, you can use the create links function on any text in your Content to create a link to it. When the user clicks on the link, he will scroll to the paragraph on the page.
  We also introduced a new component, `NestedParagraph,` that allows adding nested paragraphs, for example, for ordered lists.

### 💅 Minor Changes

- Tweaked account index page to be visually consistent with other account page layouts
- Introduced a new feature for logging both build and runtime configurations
  Configuration logging can now be toggled on or off using the `ENABLE_CONFIG_LOG_BUILD` and `ENABLE_CONFIG_LOG_RUNTIME` environment variables.
- Added `@scayle/eslint-plugin-vue-composable`
  This plugin includes three rules `@scayle/vue-composable/no-composable-after-await`, `@scayle/vue-composable/no-lifecycle-after-await`, `@scayle/vue-composable/no-watch-after-await` which catch common errors in composables. You can read more about the plugin [here](https://www.npmjs.com/package/@scayle/eslint-plugin-vue-composable).
- Improved user experience of time box element within Promotion Banner.
  Adds a clear understanding of the time left for the promotion to end by providing indicators of the time unit in the time box element for countdowns.
  The format of the time box element is changed to be more user-friendly with `(D : H : M)` format, or `(H : M : S)` format if the promotion lasts less than `24H`.

### Patch Changes

- Modified paddings of PromotionHurryToSaveBanners to have visual consistency with PromotionItemContent
- Fixed a german translation issue for "save_your_free_gift"
- Fixed promotion automatic discount price on PDP
- Removed full capitalization of PromotionHurryToSaveBanner label
- Handle possible `undefined` results from `useRpc` calls
- Add store address, phone and open status to the map marker card
- Fixed StoreLocator map covering navigation flyout
- Fixed a z-index issue with the ToastContainer so that notifications are not partially displayed underneath the Promotion Banner
- Adds missing Promotion Banner Link to Promotion Category on mobile view
- Removed dummy non-functional shipment detail link from OrderStatusBar
- An error has been fixed where an attempt was made to access the "document" object during server-side rendering, resulting in an inaccessible Order Success Page (_OSP_).
- Added translatable string 'pdp.no_product_information_provided' for ProductDescription and ProductCompositionAndCare components instead of static string

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Added `@scayle/eslint-plugin-vue-composable@0.1.1`
- Updated to `@crowdin/cli@3.19.2"`
- Updated to `@nuxt/test-utils@3.12.0`
- Updated to `@nuxtjs/i18n@8.3.0`
- Updated to `@scayle/eslint-config-storefront@3.2.7`
- Updated to `@types/node@20.12.7`
- Updated to `@typescript-eslint/eslint-plugin@7.7.0`
- Updated to `@typescript-eslint/parser@7.7.0`
- Updated to `@upstash/redis@1.29.0`
- Updated to `@vitest/coverage-v8@1.5.0`
- Updated to `autoprefixer@10.4.19`
- Updated to `eslint-plugin-tailwindcss@3.15.1`
- Updated to `nuxt@3.11.1`
- Updated to `ofetch@1.3.4`
- Updated to `postcss-custom-properties@13.3.7`
- Updated to `postcss-import@16.1.0`
- Updated to `postcss@8.4.38`
- Updated to `prettier-plugin-tailwindcss@0.5.13`
- Updated to `tailwindcss@3.4.3`
- Updated to `vitest@1.5.0`
- Updated to `vue-tsc@2.0.13`

#### 🏠 dependencies

- Added `@contentful/rich-text-html-renderer@16.3.5`
- Added `@storyblok/vue@8.0.7`
- Added `axios@1.6.8`
- Added `cf-content-types-generator@2.15.0`
- Added `consola@3.2.3`
- Added `contentful-export@7.19.144`
- Added `contentful@10.8.7`
- Added `globby@14.0.1`
- Removed `prettier-plugin-tailwindcss@0.5.13`
- Updated to `@scayle/omnichannel-nuxt@2.1.4`
- Updated to `@scayle/storefront-nuxt@7.66.0`
- Updated to `@tailwindcss/typography@0.5.12`
- Updated to `@types/google.maps@3.55.7`
- Updated to `nanoid@5.0.7`
- Updated to `nuxi@3.11.1`
- Updated to `storyblok-js-client@6.7.2`
- Updated to `ufo@1.5.3`

## 1.0.0-rc.8

This release focuses on stabilization and modularization, to improve the technical foundation and developer experience.

### 🔥 Highlights

#### ✨ Update to Nuxt 3.10.3 and Vue 3.4.21

Storefront Boilerplate now runs on both the latest Nuxt `v3.10.3` and Vue `v3.4.21` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.10 Announcement Blog](https://nuxt.com/blog/v3-10)
and the [Official Vue 3.4.21 Changelogs](https://github.com/vuejs/core/blob/main/CHANGELOG.md#3421-2024-02-28).

### 📍 SCAYLE Omnichannel Addon for Storefront

Storefront now support the SCAYLE Omnichannel Addon and introduces the `StoreLocator` page and includes the `StoreAvailability` within the Product Detail Page.

### 🔭 Additional Tracking Improvements

The included tracking implementation has been refactored and received various improvements to increase the tracking data quality, as well as tracking data reliability.

### 🚀 Major Changes

- **BREAKING:** Refactored default `sameSite` cookie settings from `none` to `lax` in `config/storefront.ts`
- Added `StoreLocator` page based on Google Maps and `SCAYLE Omnichannel`
- Added `StoreAvailability` to Product Detail Page using `SCAYLE Omnichannel`
- Added `patch-packages` for managing patches to third party packages.
  See `README.md` or the `patches/` directory for an up-to-date listing of currently applied patches.
  - Patched `unstorage` so the VercelKV driver is not logged as `undefined`
- Removed `auth` config in `composables/useAuthentication.ts` and `useRuntimeConfig().public.storefront.auth` field in `config/storefront.ts`
- Changed public `runtimeConfig` type to `ModulePublicRuntimeConfig`

### 💅 Minor Changes

- Fixed caching behaviour for account area via `routeRules` in `nuxt.config.ts`
- Fixed wishlist toggle if wishlist data is being toggled and fetched in `components/product/WishlistToggle.vue`
- Refactored error message handling during local development mode to show actual error with stack trace
- Fixed product detail page and product listing page (category page) behaviour if basket data is undefined
- Fixed Storyblok CMS data handling in `pages/s/[slug].vue`
- Fixed Storyblok CMS components handling in `pages/c/[slug].vue`
- Renamed `categoryNotFound` to `foundCategoryByPath` in `pages/[...category].vue`
- Fixed error handling for non existing category slug by throwing a `404` error and removed error handling from `layouts/defaults.vue`
- Fixed redirection from error page to homepage
- Converted `routeChangeTrackingObserver` to the route middleware and added delayed execution
- Fixed redirection behaviour on login from checkout, as it will now redirect after login back to checkout
- Used `onNuxtReady` instead of `tryOnMounted` for `composables/tracking/watchers/useCustomerDataChangeWatcher.ts` and removed user force refresh
- Fixed links on Storyblok grid tile, clickable image and banner link
  - `modules/cms/providers/storyblok/components/BannerLink.vue`
  - `modules/cms/providers/storyblok/components/ClickableImage.vue`
  - `modules/cms/providers/storyblok/components/GridTile.vue`
  - `modules/cms/providers/storyblok/components/StoryblokLink.vue`
- Fixed category behaviour by using new composable `useCategoryByPath` to source category data in `pages/[...category].vue`
- Fixed category behaviour by using `stripShopLocaleFromPath` and remove computed value in `pages/[...category].vue`
- Refactored root categories logic and implement app navigation trees
  - Added `composables/useCategory.ts`
  - Added `composables/useNavigationTreeItems.ts`
  - Added `composables/useRootCategories.ts`
  - Refactored `components/layout/footer/AppFooter.vue`
  - Refactored `components/layout/headers/AppHeader.vue`
  - Refactored `components/layout/headers/HeaderSubNavigation.vue`
  - Refactored `components/layout/navigation/MobileSidebar.vue`
  - Refactored `composables/useProductList.ts`
  - Refactored `pages/[...category].vue`
- Improved tracking behaviour
  - Refactored `composables/tracking/events/useUserActionEvents.ts`
  - Refactored `composables/tracking/watchers/useCustomerDataChangeWatcher.ts`
  - Refactored `composables/useWishlistPage.ts`
  - Refactored `nuxt.config.ts`
- Fixed promotion handling and hides gifts if minimum order value (`mov`) is not satisfied
  - Refactored `composables/useBasketItemPromotion.ts`
  - Refactored `composables/useProductPromotions.ts`
  - Refactored `composables/usePromotionProgress.ts`
  - Refactored `utils/promotion.ts`
- Adjusted promotion basket gift conditional banner labels
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `composables/useBasketItemPromotion.ts`
  - Refactored `langs/de-DE.json`
  - Refactored `langs/en-GB.json`
  - Refactored `langs/en_origin.json`
- Adjusted promotion conditional banner on product detail page
  - `components/basket/promotion/BasketGiftConditionBanner.vue`
  - `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
  - `composables/useProductPromotions.ts`
  - `pages/p/[slug].vue`
- Reduced duplicate promotion quantity and cost logic
  - Added `composables/usePromotionConditionBanner.ts`
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
  - Refactored `langs/de-DE.json`
  - Refactored `langs/en-GB.json`
  - Refactored `langs/en_origin.json`
- Extracted promotion condition banner to unified component and reuse it
  - Added `components/promotion/PromotionGiftConditionBanner.vue`
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
- Replaced used promotion `mov` abbreviation with full keyword `minOrderValue` to reduce complexity
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
  - Refactored `composables/useBasketItemPromotion.ts`
  - Refactored `composables/useProductPromotions.ts`
  - Refactored `composables/usePromotionConditionBanner.ts`
  - Refactored `langs/de-DE.json`
  - Refactored `langs/en-GB.json`
  - Refactored `langs/en_origin.json`
- Extended End-to-End testing behaviour with promotion features
  - Refactored `components/product/promotion/ProductPromotionSelectionModal.vue`
  - Refactored `components/promotion/PromotionHurryToSaveBanners.vue`
  - Refactored `composables/useBasketPromotions.ts`
  - Refactored `composables/useProductPromotions.ts`
  - Refactored `composables/usePromotionGifts.ts`
  - Refactored `pages/p/[slug].vue`
- Fixed and refactored Identity Provider support
  - Added `components/auth/IDPCallback.vue`
  - Refactored `components/auth/IDPForm.vue`
  - Refactored `components/auth/SignInForm.vue`
  - Refactored `components/auth/LoginForm.vue`
  - Refactored `composables/useAuthentication.ts`
  - Refactored `config/storefront.ts`

### 🩹 Patch Changes

- Aligned check icon within color chip
- Fixed missing flyout close for sub-navigation in `components/layout/headers/AppHeader.vue`
- Replaced default Nuxt favicon with SCAYLE favicon in `public/favicon.ico`
- Added `immediate: true` to watcher and refactored `composables/tracking/watchers/useCustomerDataChangeWatcher.ts` to avoid delayed execution and wrongly reported tracking data
- Fixed application crash during server-side rendering while trying to access `window.localStorage` in `composables/useLastLoggedInUser.ts`
- Fixed rendering issues with product price by using optional chaining `basketData.value?.items` in `components/product/ProductPrice.vue`
- Set default TTL of the cache storage provider with redis to `10` minutes to avoid unlimited cache keys
- Replaced translation `Sicht` with `Ansehen` for notification CTA
- Fixed wrong config type for `gtm.debug` in `nuxt.config.ts`
- Fixed incorrect triggering of `content_view` tracking event during server-rendering in `middleware/routeChangeTrackingObserver.global.ts`
- Hide scrollbar on homepage collection content

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Updated to `@types/node@30.11.25`
- Updated to `@upstash/redis@1.28.4`
- Updated to `@vitest/coverage-v8@1.3.1`
- Updated to `autoprefixer@10.4.18`
- Updated to `eslint@8.57.0`
- Updated to `eslint-plugin-tailwindcss@3.15.0`
- Updated to `happy-dom@13.7.3`
- Updated to `nuxt@3.10.3` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `postcss-custom-properties@13.3.5`
- Updated to `prettier-plugin-tailwindcss@0.5.12`
- Updated to `storyblok@3.27.0`
- Updated to `storyblok-generate-ts@2.0.2`
- Updated to `typescript@5.4.2`
- Updated to `vitest@1.3.1`
- Updated to `vue-tsc@2.0.6`

#### 🏠 dependencies

- Added `@googlemaps/js-api-loader@1.16.6`
- Added `@scayle/omnichannel-nuxt@2.1.3`
- Added `@types/google.maps@3.55.4`
- Updated to `@scayle/storefront-nuxt@7.61.3`
- Updated to `@storyblok/nuxt@6.0.6`
- Updated to `@vueuse/core@10.9.0`
- Updated to `@vueuse/nuxt@10.9.0`
- Updated to `dotenv@16.4.5`
- Updated to `nanoid@5.0.6`
- Updated to `storyblok-js-client@6.7.1`
- Updated to `vue@3.4.21` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)

## 1.0.0-rc.07

This release focuses on stabilization and modularization, to improve the technical foundation and developer experience.

### 🔥 Highlights

#### ✨ Update to Nuxt 3.10.2 and Vue 3.4.19

Storefront Boilerplate now runs on both the latest Nuxt `v3.10.2` and Vue `v3.4.19` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.10 Announcement Blog](https://nuxt.com/blog/v3-10)
and the [Official Vue 3.4.19 Changelogs](https://github.com/vuejs/core/blob/main/CHANGELOG.md#3419-2024-02-13).

#### 🧪 Modularization: Extracting Cypress into dedicated sub-package

The Cypress testing solution has been extracted into a dedicated child package located at `cypress/`. This decouples the dependencies from the main Storefront application. To install all relevant Cypress dependencies, execute `yarn install` within the `cypress/` directory.
By default the current Cypress integration does not rely anymore on the commercial Cypress Dashboard integration.
Please check the dedicated Readme file located at `cypress/README.md` for more details.

The following dependencies have moved from `package.json` to `cypress/package.json`:

- `cypress`
- `cypress-real-events`
- `eslint-plugin-cypress`

#### 🧱 Modularization: Extracting Storyblok Integration into local module

The Storyblok integration has been extracted into a dedicated local Nuxt module `storefront-cms`.
This allows to combine all CMS provider relevant functionalities within a central Nuxt module and allows for simple future inclusion of additional CMS providers.

The new local Nuxt module can be found under `modules/cms/` and its path has been added to `nuxt.config.ts` to the `modules` list.

### 🧲 Tracking Refactoring and Improvements

The included tracking implementation has been refactored and received various improvements to increase the tracking data quality, as well as tracking data reliability.

### 🚀 Major Changes

- **BREAKING:** The Image CDN config key has now moved to runtimeConfig under `public.cdnUrl`
  - The environment variable `NUXT_PUBLIC_IMAGE_BASE_URL` has been replaced by `NUXT_PUBLIC_CDN_URL`
- **BREAKING:** Added patch files for automatic dependency patching with [`patch-package`](https://www.npmjs.com/package/patch-package).
  The tool will run in `postinstall` and apply any patches present in the `patches/` directory to the respective dependency. Extended `README.md` with a section regarding `Patches` to explain the details and currently applied patches
  - Patched support for runtimeConfig with `@nuxt/image`
  - Patched missing (`undefined`) driver name in `unstorage` if using `VercelKV` as caching driver
  - Patches `nitro` (`nitropack`) to resolve session issues with page caching enabled
- Added full support for an easy way of running the application through docker compose

### 💅 Minor Changes

- Refactored Wishlist
  - Added `WishlistCardSlideIn`, `WishlistCardImage` and `WishlistCardDescription` components
  - Added `useWishlistPage`, `useWishlistItem` and `useWishlistItemActions` composables
- Fixed an issue with Guest User being able to access the Account page, even though it did not have any content
- Fixed an issue with the Order pages not properly displaying content due to page caching issues while using path-based routing
- Fixed various UX/UI issues for the new Promotion Engine feature
- Fixed hydration issues related to viewport-dependent font-size classes on PDP in `pages/p/[slug].vue`
- Fixed hydration issues related to viewport-dependent font-size classes on PLP in `components/product/card/ProductCard.vue`
- Refactored various components to use new Vue v3 `defineEmits` syntax for events
  - `components/layout/headers/search/MobileSearchInput.vue`
  - `components/search/CategorySuggestions.vue`
  - `components/search/ProductSuggestions.vue`
  - `components/search/SearchResultItem.vue`
  - `components/search/SearchResults.vue`
  - `components/search/SearchResultsContainer.vue`
- Fixed `DefaultLink` behaviour with path-based routing in `components/ui/links/DefaultLink.vue`
- Fixed client-side validation behaviour for login and registration forms
  - `components/auth/GuestLoginForm.vue`
  - `components/auth/LoginForm.vue`
  - `components/auth/RegisterForm.vue`
  - `components/auth/SalutationSelect.vue`
- Fixed "Register" link to open the "Registration" tab within the `SignInForm` in `components/auth/SignInForm.vue`

### 🩹 Patch Changes

- Added `hasOneSizeProductVariantOnly` helper within `sizes` util
- Fixed UX / UI issues for Order details page in `pages/account/orders.vue`
- Fixed UX / UI issues with login and registration forms
- Fixed window scrolling on PLP pagination in `components/ui/pagination/PaginationButton.vue`
- Disabled `swr` for page caching by default to mitigate potential broken pages and hydration issues

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Updated to `@crowdin/cli@3.18.0`
- Updated to `@nuxt/test-utils@3.11.0`
- Updated to `@nuxtjs/i18n@8.1.0`
- Updated to `@nuxtjs/tailwindcss@6.11.4`
- Updated to `@types/node@20.11.17`
- Updated to `@upstash/redis@1.28.3`
- Updated to `@vitest/coverage-v8@1.2.2`
- Updated to `eslint-plugin-tailwindcss@3.14.2`
- Updated to `happy-dom@13.3.8`
- Updated to `lint-staged@15.2.2`
- Updated to `nuxt@3.10.1`
- Updated to `postcss@8.4.35`
- Updated to `vitest@1.2.2`

#### 🏠 dependencies

- Updated to `@scayle/storefront-nuxt@7.57.1`
- Updated to `citty@0.1.5`
- Updated to `dotenv@16.4.3`
- Updated to `nanoid@5.0.5`
- Updated to `redis@4.6.13`
- Updated to `storyblok-js-client@6.6.7`
- Updated to `ufo@1.4.0`
- Updated to `vue@3.4.19`

## 1.0.0-rc.06

This release focuses on stabilization and refactoring, to improve the technical foundation and developer experience.

### 🚀 Major Changes

- **BREAKING:** Nested public Storefront-specific `runtimeConfig` properties under the `storefront` key
  - Replaced `useRuntimeConfig().public.log` and `useRuntimeConfig().public.auth`
    with `useRuntimeConfig().public.storefront.log` and `useRuntimeConfig().public.storefront.log`
  - Changed `(...storefrontRuntimeConfigPublic as any),` to `storefront: storefrontRuntimeConfigPublic as any,` in `nuxt.config.ts`
- **BREAKING**: Allow the session of an `RpcContext` to be `undefined`
  - This changes the structure of the `RpcContext`, so it may be a breaking change if you have written custom RPC methods.
    The affected properties on the `RpcContext` are `sessionId`, `wishlistKey` and `basketKey` and
    the affected methods are `destroySession`, `createUserBoundSession`, `updateUser`, and `updateTokens`.
    If you use these methods or properties in a custom RPC method, make sure that you handle the case where they might be undefined.
    TypeScript will also catch these cases if you have `strictNullChecks` enabled.
    You can check `context.sessionId` (or another session-dependent property) to determine if the session is present.
    If one of these properties is present, all will be. Alternatively, you can call `assertSession(context)`
    before referencing any properties on the context. If the session is not present,
    an error will be thrown. For any usage of `context` after `assertSession` is called,
    TypeScript will understand that the session properties are present.

### 💅 Minor Changes

- Extracted sorting and grouping basket helpers to `utils`
- Properly resolve `basketGroup` RPC with params
- Removed wishlist utils and moved them to the `useWishlistActions` composable
- Replaced `validation` plugin with `useValidationRules` composable
- Replaced `toast` plugin with `useNotification` composable
- Replaces `tracking` plugin with `useTracking` composable
- Renamed `divideWithHundred` price utility to `divideByHundred`
- Renamed `localeFormattedDate` date utility to `formatLocaleDate`
- Enforced using tracking sub-composables through the `useTrackingEvents` by turning off auto-import for sub-composables
- Simplified `Countdown` component logic by using `useIntervalFn` from `vueuse`
- Changed `radash` utils prefix to be underscore (`_`) instead of `use`, to avoid confusion between `radash`
  utilities and Vue composables. Resulting in e.g. `useSleep` to become `_sleep`.
- Used radash `_sort` (`useSort`) instead of native `sort` to avoid side effects
- Export composables as named functions
- Refactored components to use `withDefaults` and type generics to define component properties
- Refactored product and navigation components to reduce complexity
- Refactored account area component to reduce complexity and improve UI experience
  - `components/account/AccountHeader.vue`
  - `components/account/AccountWrapper.vue`
  - `components/addOns/AddOnsSelector.vue`
  - `components/order/OrderHeader.vue`
  - `components/order/OrderItemCard.vue`
  - `components/order/OrderOverviewHeader.vue`
  - `components/order/OrderStatusBar.vue`
  - `pages/account/orders.vue`
  - `pages/account/user.vue`
  - `pages/account/orders/[id].vue`
- Refactored account area orders components to reduce complexity and improve UI experience
  - `components/account/AccountWrapper.vue`
  - `components/order/OrderHistoryItem.vue`
  - `components/order/OrderItems.vue`
  - `composables/useOrders.ts`
- Refactored used Tailwind classes across the Storefront Boilerplate to comply with used Tailwind version
- Tweaked Promotion Engine implementation and UI experience across the Storefront Boilerplate
- Tweaked Order Success Page (OSP) complexity and UI experience
- Renamed buildtime environment variable `NUXT_STOREFRONT_DOMAIN_DEFAULT` to `DOMAIN_DEFAULT`
- Renamed buildtime environment variable `NUXT_STOREFRONT_DOMAIN_PER_LOCALE` to `DOMAIN_PER_LOCALE`
- Renamed buildtime environment variable `DISABLE_SSR_CACHE` to `DISABLE_PAGE_CACHE`

### 🩹 Patch Changes

- Refactored `slicedOrders` to be a `computed` property in `components/account/AccountWrapper.vue`
- Refactored `_sizes` to be a `computed` property in `components/product/ProductSizePicker.vue`
- Refactored `components/addOns/AddOnsSelector.vue` to use `computed` properties instead of `ref` and dedicated update functions
- Refactored `basketItems` to have an empty array as fallback in `components/basket/popover/BasketPopoverItems.vue`
- Added missing state key for `footerNavigationTrees` in `components/layout/footer/AppFooter.vue`
- Simplified watcher for `searchQuery` in `components/layout/headers/search/HederSearch.vue`
- Refactored Nuxt-specific imports to import from `#app` instead of `nuxt/app`
- Added `collapsed` component property to `components/product/detail/ProductDetailAccordionEntry.vue`
- Use object for lookup of headline sizes instead of `computed` property in `components/ui/headlines/Headline.vue`
- Fixed desktop sidebar overlapping navigation in `pages/[...category].vue`
- Added `time` constants in `constants/time.ts` and used it in `components/ui/Countdown.vue`
- Refactored `PromotionBanner` to be displayed on `onNuxtReady` instead of `onServerPrefetch`
  to avoid missing interactivity during page load and hydration
- Removed `runtimeConfig.public.storyblok.webhookSecret` from `nuxt.config.ts`, as it is not supported by the `storyblok-nuxt` module
- Use `yn` to typecast potential build value of `runtimeConfig.public.gtm.debug` via `yn(process.env.NUXT_PUBLIC_GTM_DEBUG)` in `nuxt.config.ts`

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Updated to `@crowdin/cli@3.16.1`
- Updated to `@nuxt/image@1.3.0`
- Updated to `@nuxt/test-utils@3.10.0`
- Updated to `@nuxtjs/tailwindcss@6.11.0`
- Updated to `@types/node@20.11.5`
- Updated to `@upstash/redis@1.28.2`
- Updated to `@vitest/coverage-v8@1.2.1`
- Updated to `autoprefixer@10.4.17`
- Updated to `cypress@13.6.3`
- Updated to `eslint-plugin-tailwindcss@3.14.0`
- Updated to `happy-dom@13.2.2`
- Updated to `nuxt@3.9.3` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `utility-types@3.11.0`
- Updated to `vitest@1.2.1`

#### 🏠 dependencies

- Updated to `@scayle/storefront-nuxt@7.53.1`
- Updated to `@storyblok/nuxt@6.0.4`
- Updated to `dotenv@16.3.2`
- Updated to `storyblok-js-client@6.6.3`
- Updated to `vue@3.4.15` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)

## 1.0.0-rc.05

### 🔥 Highlights

#### ✨ Update to Nuxt 3.9 and Vue 3.4

Storefront Boilerplate now runs on both the latest Nuxt `v3.9` and Vue `v3.4` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.9 Announcement Blog](https://nuxt.com/blog/v3-9)
and the [Official Vue 3.4 Announcement Blog](https://blog.vuejs.org/posts/vue-3-4).

#### 🛫 Introducing Promotion Engine

The Promotion Engine presents the user with various promotions that have specific conditions for receiving the discount.
The Storefront Boilerplate currently support the two types `Automatic discount` and `Buy X get Y` by default as promotions.

- \*\*\[SCAYLE Resource Center - Storefront Boilerplate / Promotion Engine](https://scayle.dev/en/storefront-guide/developer-guide/features/promotions)

#### 👥 Identity Provider support for Token-based Authentication

The Storefront Boilerplate now provides support for Single-Sign-On (SSO) via multiple Identity Provider (IDP) like Okta, KeyCloak or Google.
The IDP login / SSO flow integrates with the existing Token-based Authentication and can be used in parallel to the existing SCAYLE IDP.

- \*\*\[SCAYLE Resource Center - Storefront Core / Authentication](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication)

#### 🔋 Introducing Page Caching with unified cache handling

The distributed default configuration of the Storefront Boilerplate comes with page caching enabled and relies on the
global `storefront-cache` storage mountpoint available via [Storefront Core - Caching](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/caching)
and configured via [Storefront Core - Storage via Module Configuration](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#storage).

- \*\*\[SCAYLE Resource Center - Storefront Boilerplate / Page Caching](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/caching#page-caching-in-storefront-boilerplate)

#### 🛫 Introducing support for Vercel Edge deployment

Storefront Boilerplate does now support deployment to Vercel Edge, besides Docker-based deployments.

- \*\*\[SCAYLE Resource Center - Storefront Boilerplate / Vercel Edge](https://scayle.dev/en/storefront-guide/developer-guide/deployments/vercel)

### 🚀 Major Changes

- Updated Cypress E2E test suite
- Introduced new utility `formatCurrency()` in `useFormatHelpers` and refactored usage of `getCurrency()` & `toCurrency()`
- Removed `nuxt-viewport` and refactored application to use `useDefaultBreakpoints` composable based on `VueUse/useBreakpoints` (_​For details see [VueUse Documentation](https://vueuse.org/core/useBreakpoints/)_)
- Reduced the usage of viewport detection logic and refactored UI to rely on responsive layouts instead
- Extract and refactor Product Filter handling on Category and Search page
- Refactored i18n integration and usage across application due to update of `@nuxt/i18n` to `v1.0.0` stable release

### 💅 Minor Changes

- Removed `stylelint`, related dependencies and package script commands
- Replaced `nuxt-vitest` with `@nuxt/test-utils@3.9.0` as the projects have been officially been merged together (_For detailed changes see [Changelog of @nuxt/test-utils](https://github.com/nuxt/test-utils/releases/tag/v3.9.0)_)
  - Introduced `vitest-environment-nuxt@1.0.0`
- Remove unsupported `imageBaseUrl` option key from `storefrontRuntimeConfigPublic` in `config/storefront.ts`
- Removed usage of `process.env` from `nuxt.config` and `config/storefront.ts`, relying on using runtime environment variables instead (_For details see [Nuxt Documentation - runtimeConfig / Environment Variables](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables)_)
- Allowing to use HTTP during local development mode
- Extend `.env.example` with updated environment variables for locale development purposes
- Added documentation reference links into `nuxt.config.ts`
- Added comments with environment variables names to override runtimeConfig keys into `nuxt.config.ts` and `config/storefront.ts`
- Removed unused `nuxt/utils/cms.ts`
- Introduce `useOrders` composable to unify orders handling
- Changed usage of `forgotPassword(data: SendResetPasswordEmailRequest)` to `forgotPassword(email: string)` in `useAuthentication` composable, refactored occurrences accordingly
- Introduce `@vercel/kv` and `@upstash/redis` for VercelKV support
- Extend `routeRules` in `nuxt.config.ts` to handle Vercel page caching
- Extend `routeRules` in `nuxt.config.ts` to support multiple cache configurations
- Extend `routeRules` in `nuxt.config.ts` to allow disabling SSR Page Caching via environment variables during build time with `DISABLE_SSR_CACHE`
- Extend `cache-test.mjs`
- Set `differentDomains` based on environment variable `DOMAIN_PER_LOCALE` during build time in `nuxt.config.ts`
- Enable `debug: true` in `nuxt.config.ts` to being able to pinpoint potential hydration mismatches or enumerating key iusses
- Various type tweaks and refinements

### 🩹 Patch Changes

- Fixed Storyblok integration with handling of invalid `product_ids` in `storyblok/components/ProductSlider`
- Fixed Storyblok integration on Category pages without defined Storyblok CMS category slug resulting in error pages in `pages/[...category].vue`
- Fixed issue with unavailable product colors on Product Detail Page in `pages/p/[slug].vue]`
- Removed `version: getStoryblokContentVersion(),` from `composables/useCms.ts`
- Fixed caching behaviour incorrect product list layout in `components/productList/ProductList.vue` & `pages/[...category].vue]`
- Fixed Order types in `components/order/OrderHeader.vue`, `components/order/OrderItems.vue`, `components/order/summary/PaymentSummary.vue`, `pages/account/orders/[id].vue`
- Fixed computed property `orderItems` in `pages/account/orders/[id].vue`
- Fixed ProductBadge position in `components/product/ProductBadge.vue` and `components/productList/ProductList.vue`
- Fixed user information disappearing after reload by disabling `autoFetch` and fetching user data explicitly `onMounted` in `components/layout/headers/user/UserPopover.vue`
- Fixed re-fetching for product list in `pages/[...category].vue]`
- Fixed mobile sidebar overlapping issue in `components/layout/navigation/MobileSidebar.vue`
- Fixed size picker overlapping issue in `components/wishlist/card/WishlistCard.vue`
- Fixed SlideIn overlapping issue in `components/layout/SlideIn.vue` and `composables/useSlideIn.ts`
- Fixed Wishlist and Basket page being incorrectly cached
- Fixed incorrect routing behaviour in the following files
  - `components/layout/headers/search/HeaderSearch.vue`
  - `components/ui/links/DefaultLink.vue`
  - `composables/useRouteHelpers.ts`
  - `middleware/authGuard.global.ts`
  - `utils/route.ts`
- Various other smaller fixes and improvements

### 🏡 Dependency Updates

#### 🏘️ devDependencies

- Removed `@nuxt/devtools` from devDependencies, as its now included with `nuxt@3.8` or higher
- Updated to `vue@3.4.10` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)
- Updated to `nuxt@3.9.1` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `@crowdin/cli@3.16.0`
- Updated to `@nuxt/image@1.2.0`
- Updated to `@nuxt/test-utils@3.9.0`
- Updated to `@nuxtjs/i18n@8.0.0`
- Updated to `@nuxtjs/tailwindcss@6.10.4`
- Updated to `@scayle/eslint-config-storefront@3.2.6`
- Updated to `@types/color@3.0.6`
- Updated to `@types/node@20.11.1`
- Updated to `cypress@13.6.2`
- Updated to `eslint@8.56.0`
- Updated to `eslint-plugin-tailwindcss@3.13.1`
- `happy-dom@13.0.4`
- `lint-staged@15.2.0`
- Updated to `nuxt-svgo@4.0.0.`
- `postcss@8.4.33`
- `postcss-custom-properties@13.3.4`
- `postcss-html@1.6.0`
- `postcss-import@16.0.0`
- `prettier-plugin-tailwindcss@0.5.11`
- `storyblok@3.26.0`
- `storyblok-generate-ts@2.0.1`
- Updated to `tailwindcss@3.4.1`
- Updated to `typescript@3.4.1`
- Updated to `vitest@1.1.3` and `@vitest/coverage-v8@1.2.0`
- Updated to `vue-tsc@1.8.27` (_NOTE: This dependency update is required for proper `vue@3.4` type checking!_)

#### 🏠 dependencies

- Added `nuxi@3.10.0` as it is now a standalone project within the Nuxt ecosystem
- Added `vue@3.4.10` as explicit dependency to avoid potential version mismatches
- Updated to `@scayle/storefront-nuxt@7.50.1`
- Updated to `@storyblok/nuxt@6.0.1`
- Updated to `@tailwindcss/forms@0.5.7`
- Updated to `@vueuse/core@10.7.1` and `@vueuse/nuxt@10.7.1`
- Updated to `global@4.4.0`
- Updated to `maska@2.1.11`
- Updated to `nanoid@5.0.4`
- Updated to `redis@4.6.12`
- Updated to `ufo@1.3.2`

## 1.0.0-rc.04

### Major Changes

- Use public npmjs.org package registry for `@scayle` packages and remove the need for a local `.npmrc` file
- Use public `storyblok-generate-ts` package instead of private fork

### Minor Changes

- Updated to latest `@scayle/storefront-nuxt` package using `v7.37.2`
- Improved Dockerfiles for build and deployments

### Patch Changes

- Updated various dependencies to latest versions

## 1.0.0-rc.03

### Major Changes

- Introduced `vitest` for unit testing and created dummy test files for most components
- Introduced page caching using [Route Rules](https://nuxt.com/docs/guide/concepts/rendering#route-rules)
- Replacing AuthGuard component with router middleware
- Use `defineOptions` for `vue` component naming

### Minor Changes

- Introduce `localizedNavigateTo` for the programmatic routing approach
- Upgrade to Vue 3.3.7
- Replaced `useUiState` with smaller composables which are: `useFlyouts`, `useMobileSearch`, `useModal` & `useSideNavigation`.
- Enable auto-import for the `constants` folder
- Various dependency minor dependency

### Patch Changes

- Fixed session max age
- Handle AddToWishlist errors
- Added missing Storyblok components
- Resolved Storyblok link
- Fixed broken links when path-based shops are enabled
- Various bugfixes

## 1.0.0-rc.02

### Minor Changes

- Upgrade to Nuxt 3.7.4

### Patch Changes

- Reduction of hydration errors
- Improved error handling for invalid products on PDP, as well as category and service pages
- Improved handling of displaying account related UI elements for guest user
- Improved order refresh behaviour on Order Success Page
- Various smaller bug fixes

## 1.0.0-rc.01

### Major Changes

- Introduce Nuxt 3
- Tracking of all relevant shop interactions with GTM
- Implemented Search Engine optimizations
- Provide more CMS content integrations (Storyblok) into all relevant pages

### Minor Changes

- Improved error handling and displaying of error pages
- Improvements to redirect handling
- Improved SVG icon handling
- Improvements to mobile styling and behaviour

### Patch Changes

- Various bugfixes
