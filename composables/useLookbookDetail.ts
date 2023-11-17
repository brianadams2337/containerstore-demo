import type {
  SbDetailImage,
  SbListingPage,
} from '~/storyblok/types/storyblok.gen'

const findElement = (
  nodes: Record<string, any>[],
  id: string,
): Record<string, any> | undefined => {
  if (!nodes) {
    return
  }

  for (let i = 0; i < nodes.length; i++) {
    const currentNode = nodes[i]

    if (currentNode._uid === id) {
      return currentNode
    }

    if (typeof currentNode.columns !== 'undefined') {
      return findElement(currentNode.columns, id)
    }
  }
}

export const useLookbookDetail = async ({
  slug,
  id,
}: {
  slug: string
  id: string
}) => {
  const detailItem = useState<SbDetailImage>(slug + id + 'detailItem')
  const productIds = computed(() => {
    return (
      detailItem.value?.product_ids
        ?.split(',')
        ?.filter(Boolean)
        .map((id) => parseInt(id, 10)) || []
    )
  })
  const {
    data: cmsData,
    fetchBySlug,
    fetching,
  } = useCms<SbListingPage>(slug + id)

  const { data: products, fetch: fetchProducts } = await useProductsByIds({
    params: () => ({
      ids: productIds.value,
    }),
    key: `lookbookProducts-${id}`,
    options: { autoFetch: false },
  })
  const fetch = async () => {
    await fetchBySlug(slug)
    if (!cmsData.value.content.pre_listing_content) {
      return
    }
    detailItem.value = findElement(
      cmsData.value.content.pre_listing_content,
      id,
    ) as SbDetailImage
    await fetchProducts()
  }
  return { content: cmsData, detailItem, products, fetching, fetch }
}
