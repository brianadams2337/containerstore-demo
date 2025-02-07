---
'@scayle/storefront-boilerplate-nuxt': patch
---

**\[Navigation\]** The Navigation's `SFNavigationTreeItem` now uses [`<NuxtImg>`](https://image.nuxt.com/usage/nuxt-img) for rendering and loading SVG icons, replacing the previous `<object>` method. This addresses layout shifts that occurred due to delayed SVG loading and resolves console errors encountered in certain browsers stemming from `content-security-policy` discrepancies. All SVG icons loaded within the NavigationTree items also now use the `preload` attribute for enhanced loading performance. The initial approach with the `<object>` tag was intended to enable modifications to the icon's visual appearance, such as color, but caused issues with browser `content-security-policy` settings, leading to delayed SVG loading and layout shifts for each navigation tree item displaying an SVG icon. The `<object>`-based implementation can be easily reinstated if needed.
