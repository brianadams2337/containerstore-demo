---
'@scayle/storefront-application-nuxt': minor
---

**\[Promotions\]** To provide a unified experience for all types of offers, we've integrated Campaigns into our existing promotion components.
Components like the `SFDealRibbon`, `SFPromotionSlideIn` and `SFDealBanner` now display both promotions and campaigns, using new utility functions (`getCampaignDisplayData`, `getPromotionDisplayData`) to handle the display logic.

To better reflect this broader purpose, several components have been renamed from `SFProductPromotionBanner` to `SFDealBanner`, `SFPromotionRibbon` to `SFDealRibbon` and `SFPromotionTimer` to `SFDealTimer`.

- Before:

  ```html
  <SFProductPromotionBanner :promotion="promotion" show-condition />

  <SFPromotionRibbon :promotion="promotion" />
  ```

- After:

  ```html
  <script setup lang="ts">
    import {
      getPromotionDisplayData,
      getCampaignDisplayData,
    } from '~/utils/promotion'
  </script>

  <SFDealBanner
    :display-data="getPromotionDisplayData(promotion)"
    show-condition
    track-event="select_promotion"
  />

  <SFDealRibbon
    :display-data="getCampaignDisplayData(campaign)"
    track-event="view_campaign"
  />
  ```
