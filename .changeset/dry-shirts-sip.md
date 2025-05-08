---
'@scayle/storefront-application-nuxt': minor
---

**\[Components\]** Split `SFAsyncDataWrapper` and `SFAsyncStatusWrapper`

Both of these components can be used to conditionally render based on the state of an `AsyncData` object.

`SFAsyncStatusWrapper` accepts an `AsyncDataRequestStatus` as a prop. When the status is `success` it will render the default slot and when the `status` is `error` it will render an error slot. When the `status` is `pending` or `idle` it will render a loading slot.

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

`SFAsyncDataWrapper` accepts an `AsyncData` object as a prop. When data has been loaded it will render the default slot and pass the data as `data` slot prop.When there is no data loaded, it will render the error slot when the status is `error` and the `loading` slot when the status is `pending` or `idle`.

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
