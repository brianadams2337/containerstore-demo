# @scayle/storefront-application-nuxt

## 1.9.0

### Minor Changes

- 1983ee4: **\[E2E\]** Introduced a new end-to-end test suite for the password change functionality.
  Coverage includes both successful password updates and expected failure scenarios (e.g., incorrect old password, policy violations).
- 5c58274: **\[UI\]** Prevented the filter panel (`SFFilterSlideIn.vue`) from automatically closing when the page route changes.
  This allows the panel to stay open when filters are applied, as filter application modifies the route via URL parameters.
- 543f526: **\[UI\]** Refined the Product Card's skeleton loader (`SFProductCardSkeleton.vue`) to better resemble the final `SFProductCard.vue` layout.
  This ensures a smoother visual transition as content loads and reducing layout shifts.
- dd55df0: **\[Navigation\]** Improved the navigation experience by ensuring the sidebar (`SFMobileSidebar.vue`) consistently closes itself before transitioning the user to the selected page.
- dc309d9: **\[Accessibility\]** Corrected the behavior of skip links to ensure they are only visible and interactive when receiving keyboard focus (e.g., via the Tab key).
  This prevents accidental activation by mouse users.
- dc309d9: **\[Promotions\]** Added the `@scayle/storefront-promotions` module.
  Developers can now leverage the `useApplyPromotions` composable to integrate logic that automatically updates promotions on basket items during any basket change event (add, remove, update quantity).

  - Example Usage

        ```ts
        import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'

        const { data: basket, addItem  } = await useBasket()
        const { applyPromotions } = useApplyPromotions()

        await applyPromotions(basket)

        await addItem({...})
        await applyPromotions(basket)
        ```

- 1983ee4: **\[Account Area\]** Introduced a redesigned profile page enabling users to easily manage their information.
  Key features include viewing consolidated account details, updating personal information (first/last name, gender, birth date),
  and changing their password, all within clearly defined sections.
- cefa223: **\[UI\]** The user navigation popover now automatically closes when it loses focus (e.g., when the user clicks outside of it or tabs away with the keyboard).
- 1983ee4: **\[E2E\]** Implemented new end-to-end tests to ensure the reliability of the User Account Area.
  Test cases validate page load, navigation through its tabs, the data update process,
  and crucial input validations such as birth date format checking.
- 93201d6: **\[Subscriptions\]** Renamed the URL route for the subscriptions section from `/subscription` to `/subscriptions`.
- c03178a: **\[Account Area\]** Items displayed using the `SFOrderItemCard` (e.g., in order details) are now clickable links, allowing users to easily navigate to the corresponding product page.
- 1983ee4: **\[Account Area\]** Introduced a fully redesigned "My Orders" page.
  The new layout presents a comprehensive list of the user's past orders, displaying key details for each entry and including a direct link to the specific Order Detail page for more information.
- 49426db: **\[UI\]** Applied `min` and `max` attributes to the underlying HTML input element within the price input component (`SFPriceInput.vue`).
  This introduces browser-level validation to restrict input to the specified range.
- 8bf9d89: **\[E2E\]** Added automated tests to confirm that the skip links functionality works as expected for keyboard users, specifically validating navigation to the "Main content" and "Search" targets.
- 1983ee4: **\[Account Area\]** Introduced a unified main Account page that seamlessly integrates sub-sections for Profile Management, Subscription Details, and Order History into a single, cohesive interface.
- 1983ee4: **\[Account Area\]** Updated the visual styling of the Subscriptions page title to align consistently with the presentation of other pages within the Account Area.
  The page's core functionality and integrated subscription component remain unchanged.
- bf2d29e: **\[Performance\]** Modified the `useBreadcrumbs()` composable to generate relative URLs instead of absolute URLs.
  This prevents Nuxt from treating breadcrumb links as external, which previously caused unnecessary full page reloads.
  Navigation via breadcrumbs now uses client-side routing.
- 79bba37: **\[Accessibility\]** Added `orderId` to the order detail button's `aria-label` on order cards for better screen reader context (via translation key update).
- f1825f8: **\[UI\]** Implemented a dedicated logout button within the mobile sidebar, enabling users to properly log out of their accounts directly from mobile devices.
- 5f6ffed: **\[Accessibility\]** Enhanced accessibility by enabling the user menu in the header to be opened via the keyboard.
  This ensures keyboard-only users can access account-related actions like Profile or Logout.
- a3114c8: **\[OSP\]** Adopted the `SFASyncDataWrapper` component to manage and display UI states related to asynchronous data fetching, improving consistency and reliability.
- 059774d: **\[E2E\]** Added end-to-end tests for the Login and Registration user flows.
  Key checks include ensuring the tab-based switching between forms works correctly and that mandatory links like the Privacy Disclaimer launch in a separate browser tab as required.
- 1983ee4: **\[Account Area\]** Introduced a completely redesigned Order Detail page, structured for clarity and comprehensive information.
  The page is thoughtfully organized into sections, including:

  - **Order Details**: Displays key information about the order.
  - **Payment Details**: Provides a breakdown of payment methods.
  - **Delivery/Billing Address**: Highlights the addresses associated with the order.

  Additionally, the page features a detailed list of all ordered products, complete with in-depth information about each item.
  At the bottom, a **Payment Summary** section presents a clear breakdown of the subtotal, shipping costs, and the final total.

- bc2a2d2: **\[Promotions\]** Promotions presented in the promotion slide-in panel (`SFPromotionSlideIn.vue`) are now ordered according to priority, ensuring higher-priority promotions are listed first.
- 78f537e: **\[Promotions\]** The `SFProductPromotionGifts` component is now shown conditionally on the Product Detail Page, appearing only when its gift promotion criteria are met.
- dc309d9: **\[Promotions\]** Revised the data structure for custom data associated with promotions.
  Refer to the `PromotionCustomData` TypeScript interface for the new schema details (including fields like `headline`, `product`, `color`, `link`, etc.).
  The `SFBasketSummaryPromotions.vue` component has been updated to work with this new structure.

  - New `PromotionCustomData` Interface:
    `ts
interface PromotionCustomData {
  product?: {
    attributeId: number
    badgeLabel: string
  }
  headline?: string
  subline?: string
  conditions?: string
  minimumOrderValue?: CentAmount
  color?: {
    background: string
    text: string
  }
  hideCountdown?: boolean
  link?: string
}
`

- 5f6ffed: **\[Account Area\]** Improved the navigation flow from the order detail page. The "Back" button now provides a more seamless experience by returning the user to the `/orders` list page, unless they were just on that page, in which case it functions as a standard browser back action.
- 60da8d9: **\[SEO\]** Enhanced URL handling for Product Detail and List Pages during client-side navigation.
  The application now automatically ensures the user lands on the SEO-optimized URL, redirecting from any non-canonical versions if necessary.
- befb502: **\[E2E\]** Added specific end-to-end test steps to validate the simplified footer shown during the checkout flow. The tests confirm both its visual rendering accuracy and that all embedded links correctly utilize `target="_blank"` (open in new tab).
- 1846482: **\[Performance\]** Optimized the `SFModal` and `SFSlideIn` components by designating them as client-only.
  Since their functionality is entirely based on client-side user interaction, this prevents unnecessary server-side rendering and can improve initial page load performance.
- 526b25f: **\[UI\]** Refactored the handling of the gift selection modal (`SFProductPromotionSelectionModal`).
  Firstly, its visibility state is now managed locally within this component instead of using global `useState`, resolving an issue where the modal incorrectly remained open after page navigation.
  Secondly, the implementation now utilizes a single, reusable modal instance for all gift options, optimizing component usage.
- d08d54b: **\[Architecture\]** Standardized date presentation by updating the `formatLocaleDate` utility.
  It now consistently outputs dates in a short numeric format and is being reused across various parts of the application.
  The function's signature has changed: it now requires a `Date` object as input, with date string parsing delegated to the calling code.

### Patch Changes

- 63af918: **\[Order Success Page\]** Improved error handling for cases where an order cannot be found. The correct empty state page is now displayed as intended.
- 76cef2a: **\[Order Success Page\]** Implemented error handling for failed attempts to fetch order data.
  In case of failure (e.g., network or server error during fetch), the user is now directed to the standard Nuxt error page.
- f135ea8: **\[E2E\]** Store Locator E2E tests are now skipped by default in automated/scheduled test runs to save resources.
  To execute them manually, remove the `.skip` suffix from the tests in `playwright/tests/e2e-StoreFinder.spec.ts` and relevant steps in `playwright/tests/e2e-Pdp.spec.ts`.
- - Added dependency `@scayle/storefront-promotions@0.1.1`
  - Added dependency `defu@6.1.4`
  - Added dependency `swiper@11.2.6`
  - Added dependency `@contentful/rich-text-types@17.0.0`
  - Added dependency `debug@4.4.0`
  - Removed dependency `check-password-strength@3.0.0`
  - Removed dependency `nuxt-swiper@1.2.2`
  - Updated dependency `@contentful/live-preview@4.6.11` to `@contentful/live-preview@4.6.12`
  - Updated dependency `@nuxt/fonts@0.11.0` to `@nuxt/fonts@0.11.1`
  - Updated dependency `@scayle/nuxt-image-provider@0.2.4` to `@scayle/nuxt-image-provider@0.2.5`
  - Updated dependency `@scayle/nuxt-opentelemetry@0.7.1` to `@scayle/nuxt-opentelemetry@0.9.4`
  - Updated dependency `@scayle/storefront-nuxt@8.12.1` to `@scayle/storefront-nuxt@8.21.0`
  - Updated dependency `@scayle/storefront-product-detail@1.1.3` to `@scayle/storefront-product-detail@1.1.4`
  - Updated dependency `@scayle/storefront-product-listing@1.3.1` to `@scayle/storefront-product-listing@1.3.2`
  - Updated dependency `@storyblok/nuxt@6.2.3` to `@storyblok/nuxt@6.2.4`
  - Updated dependency `@storyblok/richtext@3.0.2` to `@storyblok/richtext@3.2.0`
  - Updated dependency `@storyblok/vue@8.1.11` to `@storyblok/vue@8.2.2`
  - Updated dependency `@vueuse/components@13.0.0` to `@vueuse/components@13.1.0`
  - Updated dependency `@vueuse/core@13.0.0` to `@vueuse/core@13.1.0`
  - Updated dependency `@vueuse/integrations@13.0.0` to `@vueuse/integrations@13.1.0`
  - Updated dependency `@vueuse/nuxt@13.0.0` to `@vueuse/nuxt@13.1.0`
  - Updated dependency `axios@1.8.3` to `axios@1.8.4`
  - Updated dependency `consola@3.4.1` to `consola@3.4.2`
  - Updated dependency `contentful@11.5.8` to `contentful@11.5.13`
  - Updated dependency `contentful-export@7.21.32` to `contentful-export@7.21.42`
  - Updated dependency `dompurify@3.2.4` to `dompurify@3.2.5`
  - Updated dependency `dotenv@16.4.7` to `dotenv@16.5.0`
  - Updated dependency `maska@3.1.0` to `maska@3.1.1`
  - Updated dependency `nanoid@5.1.4` to `nanoid@5.1.5`
  - Updated dependency `nuxi@3.23.0` to `nuxi@3.24.1`
  - Updated dependency `storyblok-js-client@6.10.10` to `storyblok-js-client@6.10.11`
  - Updated dependency `ufo@1.5.4` to `ufo@1.6.1`
  - Updated dependency `@changesets/cli@2.28.1` to `@changesets/cli@2.29.0`
  - Updated dependency `@eslint/eslintrc@3.3.0` to `@eslint/eslintrc@3.3.1`
  - Updated dependency `@nuxt/eslint@1.2.0` to `@nuxt/eslint@1.3.0`
  - Updated dependency `@nuxt/image@1.9.0` to `@nuxt/image@1.10.0`
  - Updated dependency `@scayle/eslint-config-storefront@4.4.1` to `@scayle/eslint-config-storefront@4.5.0`
  - Updated dependency `@types/node@22.13.10` to `@types/node@22.14.1`
  - Updated dependency `@typescript-eslint/scope-manager@8.26.1` to `@typescript-eslint/scope-manager@8.29.1`
  - Updated dependency `@typescript-eslint/utils@8.26.1` to `@typescript-eslint/utils@8.29.1`
  - Updated dependency `@upstash/redis@1.34.5` to `@upstash/redis@1.34.7`
  - Updated dependency `eslint@9.22.0` to `eslint@9.24.0`
  - Updated dependency `nuxt-svgo@4.0.15` to `nuxt-svgo@4.0.17`
  - Updated dependency `storyblok@3.35.2` to `storyblok@3.36.0`
  - Updated dependency `typescript@5.8.2` to `typescript@5.8.3`
  - Updated dependency `unimport@4.1.2` to `unimport@4.2.0`
- ce6d335: **\[Product Detail Page\]** Resolved a hydration mismatch error related to product subscriptions.
  The fix ensures that product subscription data is fetched and included during server-side rendering (SSR),
  preventing inconsistencies between the server-generated HTML and the client-side render.
- 3703ad7: **\[Unit Testing\]** Updated unit tests to import and use `buyXGetYPromotionFactory` with the correct casing from the `@scayle/storefront-nuxt` package, replacing the previously used incorrect `buyXgetYPromotionFactory`.
- 3dc62da: **\[E2E\]** Aligned the end-to-end test for gift product quantity handling in the basket with recent updates to the promotion system. The test now correctly validates quantity increments based on the current promotion rules.
- 1983ee4: **\[E2E\]** Expanded end-to-end test coverage for the Orders page.
  Tests now verify the page's appearance and functionality for both users who have an order history and users who have no orders (empty state).
- 546c082: **\[Product Detail Page\]** Corrected visual inconsistencies in the skeleton loader's appearance across different screen widths. The loader now maintains proper alignment and styling at all relevant breakpoints.
- 5f04371: **\[UI\]** Resolved a layout issue where the wishlist toggle button on product cards could overlap and obstruct the global "Scroll to Top" button, ensuring both elements remain clickable.
- 475d976: **\[E2E\]** Aligned the login and logout end-to-end test flows with recent application updates.
  Specifically, tests were modified to accommodate changes within the User Profile section and the new logout interaction path on mobile.
- 461dda8: **\[E2E\]** Modified the end-to-end test to validate country selection in a language-agnostic way.
  The test no longer checks the visible country label (which varies with language settings) and instead confirms the selection using a stable, non-display mechanism.
- 257dea7: **\[E2E\]** Aligned end-to-end test scenarios with the latest Promotion feature updates.
  Tests covering the Promotion Ribbon and Promotions Flyout components have been modified to match the new expected behaviors and appearances.
- 4d43b2a: **\[Unit Testing\]** Added a global `vi.mock()` for the `routeChangeTrackingObserver.global.ts` middleware.
  This intercepts the middleware import during tests and provides a dummy function (`vi.fn()`) instead.
  This is necessary because the original middleware's `setTimeout` could attempt to access the DOM (document) after happy-dom was destroyed, causing errors.
  Global mocks are now managed in the renamed `test/vitest-setup/storefront.ts`.

  - Renamed `templates/nuxt/test/vitest-setup/storefront-nuxt.ts` to `templates/nuxt/test/vitest-setup/storefront.ts` to define global mocks.

- 3bd031a: **\[Performance\]** Optimized the price range filter by removing the `@update:model-value` event listener from the `SFPriceRangeSlider` component.
  This eliminates redundant API calls that were previously triggered during the slider adjustment process.

## 1.8.0

### 🔥 Highlights

#### ✨ Streamlined CMS Integration in SCAYLE Storefront

We've streamlined our CMS integration to simplify setup, boost performance, and focus on content pages. A new static placeholder CMS provider (`scayle`) makes initial setup for development purposes a breeze . Content fetching and display are also improved with new components like `CMSProductListingPageTeaser` and `CMSContentPage`, replacing older, less efficient methods. We've also removed service page support from the Storyblok and Contentful integrations, concentrating our efforts on content pages for a more streamlined experience.

#### 🔑 Revamped Login & Registration

We've completely overhauled our login and registration process for a smoother, more user-friendly experience. Enjoy a cleaner login interface with simplified customization options for tenants. The redesigned registration flow now includes guest registration and support for IDP registration, along with prominent links to privacy and terms. Password resets are also streamlined with a new UI and improved security. Finally, we've boosted performance with server-side rendering and simplified data handling. These enhancements provide a more accessible and efficient login and registration journey for all users.

#### 🛍️ Order Success Page Refresh

We've polished the Order Success Page (OSP) to provide a more enjoyable and informative post-purchase experience. Improvements include a visually refreshed greeting box, a redesigned order information section for improved clarity, and a simplified cost summary for easier understanding. These updates create a cleaner, more user-friendly OSP.

#### 🔍 Optimized Search Results Page

We've redesigned the Search Results Page for a smoother, more consistent browsing experience. Leveraging existing components, it now shares the same structure and styling as the Product Listing Page. We've also streamlined filtering, dynamically hiding filter options when no results are found. Sorting is now automatic by relevance, simplifying the interface and prioritizing the most pertinent results. These changes create a cleaner, more user-friendly search experience.

### 🚀 Major Changes

- **\[CMS\]** Introducing a new static CMS placeholder provider `scayle`, that simplifies the initial setup process for Storefront applications.
  The `scayle` static CMS placeholder delivers a single CMS page as static content, eliminating the need for access tokens, tenant space IDs, and other configuration typically required when setting up a Storefront applications and CMS.
  This new provider is intended for development purposes only and should not be used in production environments.
- **\[CMS\]** The `CMSCategoryData` fetching component has been removed and
  replaced by the newly introduced `CMSProductListingPageTeaser` component.
  This new component is designed to handle the rendering of teaser images and manage
  the associated data fetching for each CMS provided.

  - Example Usage on PLP:

    ```vue
    <template>
      <div class="flex flex-col">
        <CMSProductListingPageTeaser :category-id="currentCategoryId" />
      </div>
    </template>
    ```

- **\[CMS\]** The `CMSServicePageData`component, responsible for fetching content data for service pages (`/pages/s/[slug].vue`), has been removed from all CMS providers.
  Going forwards the Storefront Boilerplate CMS integration for Storyblok and Contentful are only supporting content pages (`/pages/content/[slug].vue`).
- **\[CMS\]** The `CMSPage` component has been removed from the Storefront Boilerplate and replaced with the new `CMSContentPage` component.
  This change aligns the homepage structure with the refactored CMS content types in Storyblok and Contentful.
  The `CMSContentPage` component directly renders the `CMSStory` component, eliminating the overhead of custom dynamic component loading.
  Additionally, the introduction of status-specific slots within `CMSContentPage` simplifies data fetching and handling by providing a more structured and predictable approach compared to the previous awaited fetching method in CMSPage.
  This change improves the overall maintainability and performance of the homepage.

  - Example Usage:

    ```vue
    <template>
      <!-- `pages/index.vue` -->
      <CMSContentPage slug="homepage" data-testid="home-page-content">
        <template #loading>
          <!-- Skeleton loader -->
        </template>
      </CMSContentPage>
    </template>
    ```

- **\[Login & Registration\]** The login user interface has been enhanced to provide a cleaner, more user-friendly experience and greater flexibility for tenant customization.
  The updated user interface features a standard login form with email and password fields, providing a familiar and intuitive login process.
  Existing integrations with external Identity Providers (IDPs) like Google remain unaffected by these changes.
  A key improvement in this update is the removal of IDP-specific styles that were previously embedded in the login user interface.
  This change simplifies the UI and empowers tenants to fully customize the styling and branding of their login experience, ensuring seamless integration with their overall website design.
- **\[Login & Registration\]** The user registration process has been completely redesigned for a more intuitive and streamlined experience.
  The new flow features a redesigned registration form with fields for gender, first name, last name, email, and password.
  A guest registration option simplifies the process for users who prefer not to create an account, omitting the password field.
  Support for IDP registration has been integrated, offering a secure and convenient way to sign up using existing identity providers.
  This implementation maintains a consistent and clean style, mirroring the design of the login page.
  Furthermore, prominent links to the privacy policy and terms of service are now displayed during registration, ensuring user awareness and compliance.
- **\[Login & Registration\]** The forgot password process has been redesigned with a new user interface.
  A `"forgot password"` button on the login page now opens a slide-in form for requesting a password reset link.
  The reset link directs users to the sign-in page, where another slide-in form allows them to set a new password.
  Email validation and other improvements ensure a smooth and secure password reset experience.
- **\[Login & Registration\]** Users will experience a smoother and more accessible login process.
  The login/registration flow has been redesigned with a focus on simplicity and accessibility.
  Changes include:
  - **UI/UX:** Simplified layout, updated styling for text input fields and gender selection, and enhanced accessibility features (improved semantics and keyboard navigation).
  - **Functionality:** Standardized handling of `redirectUrl` to ensure users are redirected to their intended destination after login. Improved form validation and more informative error messages displayed in a dedicated error container. Successful logins are now confirmed with a toast notification.
  - **Performance:** Implemented SSR for the signin page, resulting in faster initial load times. Removed client-side handling of the last logged in user information, eliminating the need for local storage management and further improving performance.
- **\[OSP\]** Improved the look and feel of the greeting box.
- **\[OSP\]** The order information section has been redesigned for a clearer and more user-friendly experience.
- **\[OSP\]** The cost summary on the Order Success Page has been simplified to improve clarity and user experience.
- **\[Search\]** The Search Results Page has undergone a redesign to create a more consistent and user-friendly experience.
  By leveraging composables from `@scayle/storefront-product-listing`, the page now shares the same underlying structure and styling as the Product Listing Page, providing a unified browsing experience.
  The filtering functionality has been streamlined; the filters button is now dynamically hidden when no search results are returned, reducing visual clutter.
  Additionally, the sorting button has been removed as search results are now automatically sorted by relevance, simplifying the user interface and prioritizing the most relevant results.
  This redesign enhances usability and improves the overall search experience.

### 💅 Minor Changes

- **\[Architecture\]** Simplified component prop declarations by leveraging [Vue's reactive destructuring](https://vuejs.org/guide/components/props.html#reactive-props-destructure).
  This allows for more concise and readable prop definitions, reducing boilerplate code.

  - Example:

    ```vue
    <script setup lang="ts">
    // Using reactive props destructure
    const { name = '' } = defineProps<{ name?: string }>()

    // Alternatively, defining props with `withDefaults` without destructuring
    const props = withDefaults(defineProps<{ name?: string }>(), { name: '' })
    </script>
    ```

- **\[Architecture\]** Improved the Storefront application's internationalization (i18n) implementation by switching to direct usage of the `useI18n` composable within the `setup` script blocks.
  This approach offers several advantages over accessing i18n through `useNuxtApp`:

  - **Simplicity**: Directly using `useI18n` is simpler and more intuitive, reducing the complexity of code.
  - **Performance**: Accessing `useI18n` directly can be more performant as it avoids the additional overhead of going through `useNuxtApp`.
  - **Type Safety**: Direct usage often provides better TypeScript support, ensuring type safety and better developer experience.
  - **Readability**: It makes the code more readable and maintainable by clearly indicating the use of i18n functionalities.

  However, it's important to note that this change introduces a constraint: `useI18n` must now be called directly within the `setup` script.
  Attempting to use it within other composables that are not called within setup will result in an error.
  This trade-off is considered acceptable given the overall benefits of this optimization.

- **\[Architecture\]** Improved the reactivity of several key composables (`useSubscription`, `useProductBaseInfo`, `useRowIntersection`, useProductPromotions, `useProductPrice`, `usePagination`, and `useBasketPromotionReductions`) by optimizing how getter values are passed and explicitly using `toRef` where needed.
  This ensures consistent and predictable reactivity throughout the application. For more details, see the [Vue documentation on prop passing](https://vuejs.org/guide/components/props.html#passing-destructured-props-into-functions).
- **\[Architecture\]** Integrated the `@scayle/nuxt-image-provider` Nuxt module to optimize image delivery and leverage the full capabilities of the SCAYLE CDN.
  This module introduces a dedicated provider for `@nuxt/image`, enabling support for SCAYLE-specific image modifiers that provide greater control over image transformations and optimizations.
  The module also includes the `ScayleImg` and `ScaylePicture` components, which offer a simplified way to integrate images optimized for SCAYLE CDN within your application.
  This enhancement improves image performance, reduces bandwidth consumption, and simplifies image management.
- **\[Architecture\]** Enforced consistent `defineEmits` [`type-literal`](https://eslint.vuejs.org/rules/define-emits-declaration.html#type-literal) syntax using the [`vue/define-emits-declaration`](https://eslint.vuejs.org/rules/define-emits-declaration.html#vue-define-emits-declaration) ESLint rule.

  - Before:

    ```vue
    <script setup lang="ts">
    const props = defineProps(['foo', 'bar'])
    // or
    const emit = defineEmits<{
      (e: 'foo', id: number): void
      (e: 'bar', value: string): void
    }>()
    </script>
    ```

  - After:

    ```vue
    <script setup lang="ts">
    const emit = defineEmits<{
      foo: [id: number]
      bar: [value: string]
    }>()
    </script>
    ```

- **\[Accessibility\]** The `SFProductCard` component now has a role of `"link"` and the `SFProductImage`component within the `SFProductGallery` component now has a role of `"button"`.
  This improves how these elements are interpreted by screen readers and other assistive devices.
- **\[Accessibility\]** Improved the accessibility of the side navigation open button by providing an `aria-label`.
- **\[Accessibility\]** Refactored the keyboard interaction logic for the `SFSlideIn` component within the local `storefront-ui` module.
  The core keyboard behavior, including focus trapping, tab order management, and 'Esc' key functionality, is now centralized within the `SFSlideIn` component.
  This change eliminates redundant code in individual slide-in instances (e.g., `SFFilterSlideIn.vue`) and ensures consistent accessibility features across all slide-in components.
- **\[Accessibility\]** Improved the accessibility of the `SFSearchInput` component by adding an `aria-placeholder` attribute to the input field, providing better support for assistive technologies.
- **\[Accessibility\]** Enhanced the accessibility of the `SFQuantityInput` component by adding an `aria-label` attribute to the input field.
- **\[Accessibility\]** Enhanced filter accessibility by adding `aria-label` attributes to filter elements, including the price range slider, size selection checkboxes, and the close button.
  This improvement makes filtering more accessible for users of assistive technologies such as screen readers.
- **\[Accessibility\]** Improved accessibility for screen readers on the search button (`SFSearchInput` component).
  Using `aria-hidden=true` now correctly conveys the button's function to assistive technologies.
- **\[Authentication\]** Refactored `/middleware/authGuard.global.ts` to conditionally fetch user data, skipping the process when an unprotected route is accessed.
  This optimization reduces the number of network requests and improves page load times.
- **\[Authentication\]** Strengthened application security by centralizing route access control using route names within the global authentication guard (`/middleware/authGuard.global.ts`).
  The list of available routes (`/utils/route.ts`) has been updated to contain all available routes to support this enhancement.
- **\[Authentication\]** A redirect fallback to the homepage has been added for authentication flows.
  If no redirect URL is present in the query parameters, users will now be redirected to the homepage after authentication.
  This provides a smoother experience and prevents potential redirect errors.
- **\[Build\]** The file watcher has been configured to ignore files that are not relevant to the build process.
  This optimization reduces the workload on the watcher and improves overall build times during local development.
- **\[CMS\]** The `CMSAppFooterData` component has been removed from all CMS providers.
  This component was previously used to fetch and render footer links, but this approach has been replaced by a more efficient and centralized method.
  Footer content is now managed through dedicated composables from the `@scayle/storefront-nuxt` package and configured using [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) in the Panel.
  This change reduces code duplication and simplifies maintenance while providing a more consistent and flexible approach to managing footer links.
- **\[Login & Registration\]** Enhanced the `404` error message to provide clearer and more user-friendly guidance.
- **\[Login & Registration\]** The gender selection dropdown on the login and registration pages has been visually enhanced to seamlessly integrate with the design of the text input fields.
  This change creates a more cohesive and user-friendly form experience.
- **\[E2E\]** Expanded the promotions end-to-end test suite with scenarios covering the display and hiding of terms and conditions within the promotion tile, ensuring correct functionality.
- **\[E2E\]** Implemented E2E tests covering the resolution of matched pages and result accuracy in the Search feature when searching by product reference key.
  This ensures that searches using product reference keys consistently return the expected results.
- **\[E2E\]** Implemented end-to-end tests to verify the accuracy of SEO data on the Product Details, Basket, and Wishlist pages.
- **\[E2E\]** Expanded E2E test coverage to include validation of the `variantId` URL parameter on PDPs for products with multiple sizes and available variants.
- **\[E2E\]** Added Guest User Registration E2E Test: A new end-to-end test has been implemented to cover the complete guest user registration process.
  This test validates the functionality and user flow of registering as a guest, ensuring a smooth and error-free experience.
- **\[E2E\]** Implemented an end-to-end test to verify the display of product variant availability information on the Product Details Page (PDP).
- **\[E2E\]** Implemented end-to-end tests to verify the behavior of updating product quantities in the basket, considering different maximum available quantity thresholds.
- **\[E2E\]** Implemented additional step in Order Success Page end-to-end test to verify page SEO data.
- **\[E2E\]** Implemented an end-to-end test to verify the display of sold-out products in the user's basket.
- **\[E2E\]** Implemented end-to-end tests for the Order Success page, covering the following key components:
  Greeting box, Payment details, Order details, Delivery address, Product card, Price summary, and CTA buttons.
  These tests ensure that the page renders correctly and all interactive elements function as expected after a user completes an order.
- **\[E2E\]** Expanded E2E test coverage to verify default Store Locator visibility on PDPs for one-sized products.
- **\[E2E\]** Implemented end-to-end tests to validate the accuracy of SEO data on the PLP for default views, filtered results, and sorted listings.
- **\[E2E\]** Implemented an end-to-end test to verify the handling of registration attempts with an existing email address.
- **\[E2E\]** Implemented an end-to-end test to verify the password reset process.
- **\[E2E\]** Implemented an end-to-end test to verify the functionality of the password visibility toggle on the Registration page.
- **\[E2E\]** Implemented an end-to-end test to verify the Order Success Page behavior when accessed with an incorrect CBD token.
- **\[E2E\]** Implemented end-to-end tests to verify the complete password reset process, including both successful resets and error handling.
- **\[E2E\]** Implemented end-to-end tests to verify the `variantId` URL parameter behavior on Product Detail Pages (PDPs) for both available one-size products and sold-out variants of multi-size products.
- **\[E2E\]** Implemented an end-to-end test to ensure the Country Detection modal operates correctly, even when another flyout is already open.
- **\[E2E\]** Implemented end-to-end tests to cover the functionality of increasing and decreasing the quantity of free promotional items within the basket.
- **\[E2E\]** Implemented E2E tests to verify the SEO data on the Login and Registration pages.
- **\[Orders\]** The `Order` type is improved by introducing a new generic `Order<Product, Variant>`
  type. The related order helpers are now part of the Storefront Boilerplate and are used within `usePurchaseEvents`, where the `useOrder` generic is now ensuring correct order detail types.
- **\[Search\]** Migrated to search utilities from `@scayle/storefront-search` and `@scayle/storefront-product-listing`, replacing the existing implementation and allowing for improved upgradability and feature updates.
- **\[Search\]** Migrated from `useSearchData` to `useSearch` from `@scayle/storefront-search`, providing improved upgradability and feature updates.
- **\[SEO\]** Add redirect to correct PDP URL when the PDP URL does not match the expected format.
- **\[SEO\]** Added [OnlineStore](https://schema.org/OnlineStore) schema to homepage.
- **\[SEO\]** Added missing meta data to the wishlist page.
- **\[SEO\]** Modified `/pages/p/[...productName]-[id].vue` to utilize the [ProductGroup JSON-LD schema](https://schema.org/ProductGroup).
- **\[SEO\]** Implemented an optional `variantId` query parameter for PDP URLs. When this parameter is present and contains a valid variant ID, the corresponding product variant will be preselected on page load.
  This improvement enables deep linking to specific product variations and enhances user experience.
- **\[Navigation\]** The Navigation's `SFNavigationTreeItem` now uses [`<ScayleImg>`](https://www.npmjs.com/package/@scayle/nuxt-image-provider) for rendering and loading SVG icons, replacing the previous `<object>` method.
  This addresses layout shifts that occurred due to delayed SVG loading and resolves console errors encountered in certain browsers stemming from `content-security-policy` discrepancies.
  All SVG icons loaded within the NavigationTree items also now use the `preload` attribute for enhanced loading performance.
  The initial approach with the `<object>` tag was intended to enable modifications to the icon's visual appearance, such as color,
  but caused issues with browser `content-security-policy` settings, leading to delayed SVG loading and layout shifts for each navigation tree item displaying an SVG icon.
  The `<object>`-based implementation can be easily reinstated if needed.
- **\[Tooling\]** Updated the OpenTelemetry configuration to capture common headers in span attributes.
- **\[Tooling\]** Introducing [license-checker](https://github.com/davglass/license-checker) to generate a license overview file (`node-licenses.csv`) of used project dependencies.
  This is crucial for managing legal compliance and risk, ensuring that all used dependencies' licenses are compatible
  with the projects commercial software's licensing model. This automated overview simplifies audits,
  minimizes potential legal issues, and streamlines the process of addressing license conflicts.

### 🩹 Patch Changes

- **\[Accessibility\]** Removed arrow key handling from the focus change logic in the following components to align with [WCAG accessibility guidelines for keyboard navigation](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#fundamentalkeyboardnavigationconventions).
  - Removed all arrow key navigation in `/modules/ui/runtime/components/core/SFSlideIn.vue`
  - Removed left and right arrow key navigation in `/components/layout/headers/SFHeaderNavigationItem.vue`
  - Removed left and right arrow key navigation in `/modules/ui/runtime/composables/useDropdownKeyboardBehavior.ts`
- **\[Account Area\]** Modified the `pickElements` function within the `SFAddressSummary` component to support the new `OrderAddress` type from `@scayle/storefront-nuxt@8.10`.
  This update narrows and clarifies the supported types.
- **\[CMS\]** Fixed missing product data in `CmsProduct` click event.
  The `clickProduct` event in the `CmsProduct` component was not correctly emitting product data.
  This issue has been resolved, and the event now includes the necessary product information when triggered.
  - Related Components:
    - Storyblok: `/modules/cms/providers/storyblok/components/Product.vue`
    - Contentful: `/modules/cms/providers/contentful/components/Product.vue`
- **\[Code Style\]** Improved clarity and consistency of `ExistingItemHandling` value names within `/composables/usePromotionGiftSelection.ts`, `/composables/useBasketActions.ts`, and `/composables/useBasketActions.nuxt.test.ts`
- **\[Config\]** Improved Redis connection stability by adding `maxRetriesPerRequest` to prevent indefinite hangs.
- **\[Config\]** Extended the `PublicShopConfig` interface with a new property: `countryCode`.
  This addition addresses the need to distinguish shops based on region, especially in cases where the locale (language) is the same but the target country is different.
  This allows for proper identification of shops in scenarios like Germany having both `de_DE` (German) and en_US (English) storefronts, where the locale alone is insufficient.
- **\[E2E\]** Adapted the Search results page E2E tests to account for the updated design, specifically for scenarios with no search results.
- **\[E2E\]** Improved stability of guest user registration E2E test by handling Toast message and User popover overlap.
- **\[E2E\]** Enhanced the stability of end-to-end tests for PLP Filters and Pagination across all browsers during parallel test runs.
- **\[E2E\]** Enhanced the reliability of end-to-end tests covering Search page Filters, ensuring consistent execution across all browsers when running in parallel.
- **\[E2E\]** Increased the reliability of logged-in user hydration tests by adding timeout waits to mitigate potential RPC issues.
- **\[E2E\]** Improved the hydration error tests by differentiating between guest and logged-in user contexts. Guest user tests now validate empty states for pages like Wishlist and Basket, while logged-in user tests verify pre-populated states. The scope of hydration testing has been expanded to include additional URLs defined in `/playwright/support/pages-hydration-check.json`. Error reporting has also been enhanced to provide more specific arguments and context for improved debugging.
- **\[E2E\]** Enhanced the stability of end-to-end tests for basket summary price verification with promotion products, specifically for mobile browser execution.
- **\[E2E\]** Enhanced the "Verify PDP Multi-size product Store selector" end-to-end test to ensure the store selector flyout closes after store selection.
- **\[E2E\]** Adapted existing end-to-end tests to accommodate the recent design changes to the Login and Registration pages.
- **\[E2E\]** Enhanced the reliability of the Country Detector end-to-end test in CI environments by addressing Safari-specific performance characteristics.
- **\[E2E\]** Updated end-to-end tests for the Account, Wishlist, and Basket features to accommodate the recent changes to login redirection.
  Tests now verify correct redirection after successful login.
- **\[OSP\]** Fixed an edge case within the `SFOspProductCard` component where the OSP would throw an error if a product variant was missing a size attribute.
  This scenario is rare but could occur under specific circumstances. The issue stemmed from a missing optional chaining operator when accessing the size attribute.
  This has been corrected by adding the necessary optional chaining operator (`?.`) to the size attribute accessor.
- **\[PDP\]** Product data is now loaded lazily by setting the `lazy` option of to `true`.
  This change allows for variant preselection during Server-Side Rendering (SSR) and ensures that an appropriate HTTP error status code is returned if product data fetching fails.
- **\[Search\]** The search result counter is now hidden while loading results.
- **\[Search\]** The search functionality now handles whitespace-only search queries more effectively.
  Instead of performing a search, these queries are now ignored, preventing unnecessary API calls and providing a smoother user experience.
- **\[SEO\]** Improved SEO by switching the [BreadcrumbList JSON-LD schema-based markup](https://schema.org/BreadcrumbList) to use absolute URLs.
  This change ensures search engines can correctly interpret the website's structure.
- **\[UI\]** Use [color](https://github.com/Qix-/color) for RGBA manipulation and replacing the redundant `hexToRGBAColor` utility.
- **\[UI\]** Input labels are now truncated when their text content exceeds the width of the corresponding input field.
  This prevents labels from overflowing and overlapping other UI elements, maintaining a clean and organized interface.
- **\[UI\]** The `SFBasketPopoverItems` component now displays sold-out items, providing users with a clearer view of all items in their basket, regardless of availability.
- **\[UI\]** After refactoring to use prop destructuring in the `SFProductCardBadgesFooter` component, the default value of the `isPromotionBadgeFullWidth` prop was not being applied correctly.
  This has been fixed, restoring the intended default behavior.
- **\[UI\]** Implemented a focus trap in the `SFModal` component to maintain responsiveness when a `SFSlideIn` is also open.
- **\[UI\]** The `isGiftSelectionShown` property in `SFProductPromotionSelectionModal` is now reset when the component is unmounted, preventing the modal from persisting across page navigations.
- **\[UI\]** The `SFPriceInput` component now only emits the `update:model-value` event when the input value actually changes, preventing unnecessary updates.
- **\[UI\]** Resolved a layout issue with the filter button within the `/pages/c/[...categories]/[...slug]-[id].vue` component.
- **\[UI\]** Fix sticky behavior of category side navigation in `/pages/c/[...categories]/[...slug]-[id].vue`.

### 🏡 Dependency Updates

- Added dependency `@scayle/nuxt-image-provider@0.2.4`
- Added dependency `@scayle/storefront-navigation@0.1.0`
- Added dependency `@scayle/storefront-search@0.2.1`
- Added dependency `jiti@2.4.2`
- Added dependency `license-checker@25.0.1`
- Removed dependency `globby@14.0.2`
- Updated dependency `@contentful/live-preview@4.6.5` to `@contentful/live-preview@4.6.11`
- Updated dependency `@nuxt/fonts@0.10.3` to `@nuxt/fonts@0.11.0`
- Updated dependency `@scayle/nuxt-opentelemetry@0.5.7` to `@scayle/nuxt-opentelemetry@0.7.1`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.4` to `@scayle/omnichannel-nuxt@4.2.0`
- Updated dependency `@scayle/storefront-country-detection@1.1.0` to `@scayle/storefront-country-detection@1.1.1`
- Updated dependency `@scayle/storefront-nuxt@8.6.0` to `@scayle/storefront-nuxt@8.12.1`
- Updated dependency `@scayle/storefront-product-detail@1.0.2` to `@scayle/storefront-product-detail@1.1.3`
- Updated dependency `@scayle/storefront-product-listing@1.1.3` to `@scayle/storefront-product-listing@1.3.1`
- Updated dependency `@storyblok/nuxt@6.2.2` to `@storyblok/nuxt@6.2.3`
- Updated dependency `@storyblok/vue@8.1.10` to `@storyblok/vue@8.1.11`
- Updated dependency `@vueuse/components@12.5.0` to `@vueuse/components@13.0.0`
- Updated dependency `@vueuse/core@12.5.0` to `@vueuse/core@13.0.0`
- Updated dependency `@vueuse/integrations@12.5.0` to `@vueuse/integrations@13.0.0`
- Updated dependency `@vueuse/nuxt@12.5.0` to `@vueuse/nuxt@13.0.0`
- Updated dependency `axios@1.7.9` to `axios@1.8.3`
- Updated dependency `color@4.2.3` to `color@5.0.0`
- Updated dependency `consola@3.4.0` to `consola@3.4.1`
- Updated dependency `contentful@11.4.4` to `contentful@11.5.8`
- Updated dependency `contentful-export@7.21.20` to `contentful-export@7.21.32`
- Updated dependency `maska@3.0.4` to `maska@3.1.0`
- Updated dependency `nanoid@5.0.9` to `nanoid@5.1.4`
- Updated dependency `nuxi@3.21.1` to `nuxi@3.23.0`
- Updated dependency `schema-dts@1.1.2` to `schema-dts@1.1.5`
- Updated dependency `storyblok-js-client@6.10.7` to `storyblok-js-client@6.10.10`
- Updated dependency `@changesets/cli@2.27.12` to `@changesets/cli@2.28.1`
- Updated dependency `@eslint/eslintrc@3.2.0` to `@eslint/eslintrc@3.3.0`
- Updated dependency `@nuxt/eslint@1.0.0` to `@nuxt/eslint@1.2.0`
- Updated dependency `@nuxt/test-utils@3.15.4` to `@nuxt/test-utils@3.17.2`
- Updated dependency `@types/node@22.12.0` to `@types/node@22.13.10`
- Updated dependency `@typescript-eslint/scope-manager@8.22.0` to `@typescript-eslint/scope-manager@8.26.1`
- Updated dependency `@typescript-eslint/utils@8.22.0` to `@typescript-eslint/utils@8.26.1`
- Updated dependency `@upstash/redis@1.34.3` to `@upstash/redis@1.34.5`
- Updated dependency `@vitest/coverage-v8@2.1.8` to `@vitest/coverage-v8@2.1.9`
- Updated dependency `@vue/typescript-plugin@2.2.0` to `@vue/typescript-plugin@2.2.8`
- Updated dependency `autoprefixer@10.4.20` to `autoprefixer@10.4.21`
- Updated dependency `eslint@9.19.0` to `eslint@9.22.0`
- Updated dependency `fishery@2.2.2` to `fishery@2.2.3`
- Updated dependency `happy-dom@16.7.3` to `happy-dom@17.4.4`
- Updated dependency `lint-staged@15.4.3` to `lint-staged@15.5.0`
- Updated dependency `nuxt@3.14.1592` to `nuxt@3.15.4`
- Updated dependency `nuxt-svgo@4.0.14` to `nuxt-svgo@4.0.15`
- Updated dependency `pathe@2.0.2` to `pathe@2.0.3`
- Updated dependency `postcss@8.5.1` to `postcss@8.5.3`
- Updated dependency `typescript@5.7.3` to `typescript@5.8.2`
- Updated dependency `unimport@4.0.0` to `unimport@4.1.2`
- Updated dependency `vitest@2.1.8` to `vitest@2.1.9`
- Updated dependency `vue-tsc@2.2.0` to `vue-tsc@2.2.8`

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

This release includes a newly refreshed Product Detail Page with an improved design, better accessibility and extendability and more test coverage.

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
- The basket does not allow quantity > 50. Therefore, we limit the quantity on the PDP to 50.
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

  To learn more about Smart Sorting Keys, visit the [SCAYLE Resource Center / Product Sorting](https://scayle.dev/en/developer-guide/products/product-sorting#smart-sorting).

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
  chunking of `storyblok`, `contentful` and `axios` Dependencies. This results in smaller client chunks below 500kb.

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

#### 🏘️ DevDependencies

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

#### 🏠 Dependencies

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

- [Storyblok: Editor Guides - Visual Editor](https://www.storyblok.com/docs/editor-guides/visual-editor)
- [Contentful: Developer Docs - Live preview](https://www.contentful.com/developers/docs/tutorials/general/live-preview/)

#### 🚚 Introduced usage of explicit imports for Vue components

To align more with the JavaScript and TypeScript developer ecosystem,
Storefront Boilerplate is slowly moving away on relying on the Nuxt "auto import" feature
for Dependencies and source code. With the next `v1.2` release we will deepen
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

#### 🏘️ DevDependencies

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

#### 🏠 Dependencies

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

#### 🏘️ DevDependencies

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

#### 🏠 Dependencies

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
