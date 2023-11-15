<template>
  <div>
    <CmsImage
      v-if="hasTeaserImage"
      :blok="{ ...content, component: 'CmsImage' }"
      is-teaser />
    <component
      :is="preContent.component"
      v-for="preContent in preListingContent"
      :key="preContent._uid"
      :blok="preContent" />

    <component
      :is="postContent.component"
      v-for="postContent in postListingContent"
      :key="postContent._uid"
      :blok="postContent" />

    <PageContent>
      <div class="relative">
        <Intersect @enter="trackViewListing">
          <ProductList
            class="mt-4 grid w-auto grid-cols-12 gap-1"
            :refreshing="productsFetching"
            :loading="productsFetching"
            :products="products" />
        </Intersect>
      </div>

      <LazyPagination
        v-if="pagination"
        :current-page="pagination.page"
        :first-page="pagination.first"
        :last-page="pagination.last" />
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import type { SbListingPage } from '~/storyblok/types/storyblok.gen'

const route = useRoute()
const lookbookCategoryCategoryPath = computed(
  () => `/lookbooks/${route.params.slug}`,
)
const { data: categories } = await useCategories({
  params: { path: lookbookCategoryCategoryPath.value, children: 0 },
  key: lookbookCategoryCategoryPath.value,
})

const cmsPath = computed(() => {
  return `/lookbooks/${categories.value.activeNode?.id}`
})

const {
  products,
  fetchProducts,
  productsFetching,
  pagination,
  selectedCategory,
} = await useFacet({
  key: 'lookbooks-plp-1',
  params: {
    with: {
      product: {
        attributes: {
          withKey: ['brand', 'name'],
        },
        variants: {
          attributes: {
            withKey: ['price'],
          },
          lowestPriorPrice: true,
        },
        images: {
          attributes: {
            withKey: ['imageType', 'imageView', 'imageBackground'],
          },
        },
      },
    },
  },
})

await fetchProducts({ path: lookbookCategoryCategoryPath.value })

const {
  fetchBySlug,
  data: cmsData,
  status,
} = useCms<SbListingPage>(`lookbooks-plp-${lookbookCategoryCategoryPath.value}`)
if (status.value === 'idle') {
  await fetchLazy(fetchBySlug(cmsPath.value))
}
const { content, hasTeaserImage, preListingContent, postListingContent } =
  useCmsListingContent(cmsData)

const listingMetaData = {
  name: 'Lookbooks',
  id: 'Lookbooks',
}
const { trackViewItemList } = useTrackingEvents()
const trackViewListing = () => {
  const positionOffset = ((pagination.value?.page || 1) - 1) * 24
  trackViewItemList({
    items: products.value as any,
    category: {
      name: selectedCategory.value?.name || '',
      id: selectedCategory.value?.id.toString() || '',
    },
    listingMetaData,
    positionOffset,
    source: `lookbooks|${selectedCategory.value}`,
    paginationOffset: positionOffset > -1 ? positionOffset : -1,
  })
}

defineOptions({ name: 'LookbookPLP' })
definePageMeta({ pageType: 'lookbooks' })
</script>
