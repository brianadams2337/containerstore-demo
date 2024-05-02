<template>
  <div class="my-8 divide-y">
    <FilterGroup
      :badge="state.size.length"
      :label="$t('filter.size')"
      @click:reset="resetFilter('size')"
    >
      <SFMultipleSelectionList
        v-model="state.size"
        :items="availableFilterValues?.size"
        class="flex flex-wrap"
        name="FilterSelectSize"
      >
        <template #item="{ item, toggleItem, isActive }">
          <SFButton
            :class="
              isActive
                ? 'border-[#2d2c2f] !bg-white text-primary'
                : 'border-gray-350 text-[#5c5b5f]'
            "
            class="mb-2 mr-2 border-2 px-3 py-2 text-xs font-medium"
            type="secondary"
            no-padding
            @click="toggleItem(item)"
            >{{ item.displayName }}
          </SFButton>
        </template>
      </SFMultipleSelectionList>
    </FilterGroup>

    <FilterGroup
      :badge="state.brand.length"
      :label="$t('filter.brands')"
      @click:reset="resetFilter('brand')"
    >
      <SFMultipleSelectionList
        v-model="state.brand"
        :items="availableFilterValues?.brand"
        :limit="6"
        selected-first
        class="grid grid-cols-2 gap-3"
        name="FilterSelectBrand"
      >
        <template #item="{ item }">
          <li class="mb-2 list-none">
            <SFCheckbox
              :id="item.displayName"
              v-model="state.brand"
              :item="item"
              :label="item.displayName"
            />
          </li>
        </template>
      </SFMultipleSelectionList>
    </FilterGroup>

    <FilterGroup
      :badge="state.color.length"
      :label="$t('filter.colors')"
      @click:reset="resetFilter('color')"
    >
      <SFMultipleSelectionList
        v-model="state.color"
        :items="availableFilterValues?.color"
        class="flex flex-wrap gap-3"
        name="FilterSelectColors"
      >
        <template #item="{ item, toggleItem, isActive }">
          <button
            :aria-label="`select color ${item.displayName}`"
            class="appearance-none focus:outline-none"
            @click="toggleItem(item)"
          >
            <SFColorChip
              data-test-id="filter-color-circle"
              :color="{
                id: +item.value,
                value: `${item.value}`,
                label: item.displayName,
              }"
              class="size-5"
              :is-active="isActive"
            />
          </button>
        </template>
      </SFMultipleSelectionList>
    </FilterGroup>

    <FilterGroup
      v-if="hasPriceRange"
      :label="$t('filter.price')"
      :show-action="hasActivePrices && priceChanged"
      @click:reset="resetFilter('prices')"
    >
      <SFRangeSlider
        v-model="state.prices"
        :max="maxPrice"
        :min="minPrice"
        :currency-code="currencyCode"
        :locale="locale"
      />
    </FilterGroup>

    <FilterGroup v-if="isSaleActive" :label="$t('filter.only_sale')">
      <template #action>
        <SFInputToggle v-model="state.sale" />
      </template>
    </FilterGroup>
  </div>
</template>

<script setup lang="ts">
const {
  state,
  resetFilter,
  availableFilterValues,
  hasPriceRange,
  priceChanged,
  maxPrice,
  minPrice,
  isSaleActive,
  hasActivePrices,
} = useFilter()

const currentShop = useCurrentShop()

const locale = currentShop.value!.locale?.replace('_', '-')
const currencyCode = currentShop.value!.currency
</script>
