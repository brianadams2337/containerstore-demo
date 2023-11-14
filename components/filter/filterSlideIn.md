# Filter Slide in

- [Filter Slide in](#filter-slide-in)
  - [How it works](#how-it-works)
    - [Filter values](#filter-values)
    - [Filter state](#filter-state)
    - [Reset filter state](#reset-filter-state)
    - [Initial state](#initial-state)
  - [Sync state](#sync-state)
  - [what we need to pay attention to](#what-we-need-to-pay-attention-to)
  - [How to add new filters](#how-to-add-new-filters)
    - [1. Add key to supported filters](#1-add-key-to-supported-filters)
    - [2. Add Filter key to FilterState.](#2-add-filter-key-to-filterstate)
    - [3. Add initial state](#3-add-initial-state)
    - [4. Add filter values to template](#4-add-filter-values-to-template)

<a name="how-it-works"></a>

## How it works

To filter products we use the bapi client, to work with filters our goal is to format filters
to `ProductSearchQuery`
It looks like the following:

```json
{
  "where": {
    "attributes": [
      {
        "key": "size",
        "type": "attributes",
        "values": [41352, 41853, 41082]
      },
      {
        "key": "color",
        "type": "attributes",
        "values": [38932]
      },
      {
        "key": "sale",
        "type": "attributes",
        "values": [true]
      }
    ],
    "minPrice": 4587,
    "maxPrice": 5990
  }
}
```

Our query parameter looks like:

`decodeURI`

```js
quickFilter = {
  size: [41352, 41853, 41082],
  color: [38932],
  minPrice: 4587,
  maxPrice: 5990,
  sale: true,
}
```

<a name="filter-values"></a>

### Filter values

All possible filterable values are stored in `filterableValues` that's coming from
`useFilter` composable.

```ts
const { filterableValues, activeFilters } = await useFilter()
```

<a name="filter-state"></a>

### Filter state

To give the user feedback which filter is active and which not we need to use a state.
Our state should be synced with the query params.

In our `storefront-boilerplate` the filter state looks like this:

```ts
interface FilterState {
  brand: []
  size: []
  color: []
  prices: [CentAmount | undefined, CentAmount | undefined]
  sale: boolean
}
```

<a name="reset-filter-state"></a>

### Reset filter state

To reset the filter state, we need to save our initial state. Here is important that our prices are not 0 we need to
find out which is the `minPrice` and `maxPrice`, to achieve this we make use of the computed
property `availableFilterValues`. It includes all possible values for our filters.

```ts
const minPrice = computed(() => {
  return (
    availableFilterValues.value &&
    getFilterablePriceValue(availableFilterValues.value, 'min')
  )
})

const maxPrice = computed(() => {
  return (
    availableFilterValues.value &&
    getFilterablePriceValue(availableFilterValues.value, 'max')
  )
})
```

<a name="inital-state"></a>

### Initial state

```ts
const initialState: FilterState = {
  size: [],
  brand: [],
  color: [],
  prices: [minPrice.value, maxPrice.value],
  sale: false,
}
```

<a name="how-to-sync"></a>

## Sync state

If there is already a filter active, we need to sync it. From url params to state. When the FilterSlideIn gets opened we
trigger `setStateFromUrlParams`

What it does, it gets the active filters from url (as a prop) and transforms the plain
values: ` "size":[41352,41853,41082]` to something like this:

```json
{
  "size": [
    {
      "key": "size",
      "displayName": "29",
      "count": 10,
      "value": 41364,
      "whereCondition": {
        "size": 41364
      }
    },
    {
      "key": "size",
      "displayName": "32",
      "count": 1,
      "value": 41400,
      "whereCondition": {
        "size": 41400
      }
    },
    {
      "key": "size",
      "displayName": "36",
      "count": 219,
      "value": 41052,
      "whereCondition": {
        "size": 41052
      }
    }
  ],
  "brand": [],
  "color": [],
  "prices": [1790, 22900],
  "sale": false
}
```

<a name="trouble-shooting"></a>

## what we need to pay attention to

When our price range didnt changed, we dont need to add as a filter

<a name="add-new-filter"></a>

## How to add new filters

To add new filters we need to add the key of the filter to our supportedFilters

If we want to add a filter with key `gender`

### 1. Add key to supported filters

```js
const supportedFilters = [
  'brand',
  'size',
  'color',
  'prices',
  'sale',
  // add new key
  'gender',
]
```

### 2. Add Filter key to FilterState.

In this example, `gender` is a string and it's possible to select more than one value.

```ts
interface FilterState {
  brand: []
  size: []
  color: []
  prices: [CentAmount | undefined, CentAmount | undefined]
  sale: boolean
  // add new key
  gender: []
}
```

### 3. Add initial state

```ts
const initialState: FilterState = {
  size: [],
  brand: [],
  color: [],
  prices: [minPrice.value, maxPrice.value],
  sale: false,
  gender: [],
}
```

### 4. Add filter values to template

Now you have access to the filer values in template

`availableFilterValues.gender`

Example to use a mutliple selection value in template

```vue
<FilterGroup
  :badge="state.gender.length"
  :label="$t('filter.gender')"
  @click:reset="resetFilter('gender')"
>
<MultipleSelectionList
  v-model="state.gender"
  :items="availableFilterValues.gender"
  class="mt-2 flex flex-wrap mx-2"
  name="FilterSelectGender"
>
  <template #item="{ item, toggleItem, isActive }">
    <AppButton
      :class="{ 'font-bold': isActive }"
      class="mr-2 mb-2 text-xs"
      type="ghost"
      @click="toggleItem(item)"
    >
      {{ item.displayName }}
    </AppButton>
  </template>
</MultipleSelectionList>
</FilterGroup>
```
