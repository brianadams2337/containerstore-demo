<template>
  <div>
    <div class="md:flex md:space-x-20">
      <div class="flex flex-col space-y-0.5 md:w-1/2">
        <NuxtPicture
          provider="storyblok"
          :src="detailItem.image.filename"
          :alt="detailItem.image.alt"
          class="w-full object-cover"
        />
      </div>

      <div class="px-5 md:w-1/2 md:pl-0 md:pr-10">
        <div class="text-sm">
          <DefaultLink
            v-if="routeList.lookbooks.parameter"
            :to="{
              name: routeList.lookbooks.name,
              params: {
                [routeList.lookbooks.parameter]: $route.params.slug,
              },
            }"
            class="hidden items-center gap-2 align-middle md:flex"
          >
            <IconBack class="h-4 w-4" /> {{ $t('lookbooks.back') }}
          </DefaultLink>
        </div>
        <ProductList
          class="mt-4 grid w-auto grid-cols-12 gap-1"
          :refreshing="fetching"
          :loading="fetching"
          :products="products"
          :show-add-to-cart="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const lookbookCategoryPath = computed(() => {
  return `/lookbooks/${route.params.slug}`
})

const itemId = computed(() => {
  return String(route.params.id)
})

const { data: categories } = await useCategories({
  params: { path: lookbookCategoryPath.value, children: 0 },
  key: lookbookCategoryPath.value,
})

const cmsPath = computed(() => {
  return `/lookbooks/${categories.value?.activeNode?.id}`
})

const { detailItem, products, fetching, fetch } = await useLookbookDetail({
  slug: cmsPath.value,
  id: itemId.value,
})
await fetchLazy(fetch())

defineOptions({ name: 'LookbookPage' })
definePageMeta({ pageType: 'lookbooks' })
</script>
