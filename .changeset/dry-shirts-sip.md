---
'@scayle/storefront-application-nuxt': minor
---

**\[Architecture\]** The `SFAsyncDataWrapper` has been split into two more specific components for handling async states:

1. `SFAsyncStatusWrapper`: Renders content based on a status prop.
   This wrapper component accepts an `AsyncDataRequestStatus` as a prop.
   When the status is `success` it will render the default slot and when the `status` is `error` it will render an error slot.
   When the `status` is `pending` or `idle` it will render a loading slot.

   ```html
   <SFAsyncStatusWrapper :status="status">
     <MyPage />
     <template #loading>
       <MyLoadingState />
     </template>
     <template #loading>
       <MyErrorState />
     </template>
   </SFAsyncStatusWrapper>
   ```

2. `SFAsyncDataWrapper`: Renders content based on an AsyncData object and provides the fetched data to its default slot.
   This wrapper component accepts an `AsyncData` object as a prop.
   When data has been loaded it will render the default slot and pass the data as `data` slot prop.
   When there is no data loaded, it will render the error slot when the status is `error` and the `loading` slot when the status is `pending` or `idle`.

   ```html
   <SFAsyncDataWrapper :async-data="asyncData">
     <template #default="{ data }">
       <MyPage :data="data" />
     </template>
     <MyPage />
     <template #loading>
       <MyLoadingState />
     </template>
     <template #loading>
       <MyErrorState />
     </template>
   </SFAsyncDataWrapper>
   ```
