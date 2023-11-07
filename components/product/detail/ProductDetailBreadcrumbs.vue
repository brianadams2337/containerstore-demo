<template>
  <HorizontalItemsDivider tag="DefaultLink" :items="links">
    <template #default="{ items }">
      <DefaultLink
        v-for="(link, idx) in asLinks(items)"
        :key="link.value"
        raw
        class="inline text-sm font-light uppercase leading-5"
        data-test-id="categoryOnProductDetailPage"
        :to="link.to">
        {{ link.value }}
        <template v-if="showDividerTag(idx, items.length)"> / </template>
      </DefaultLink>
    </template>
  </HorizontalItemsDivider>
</template>

<script setup lang="ts">
type Link = { value: string; to: any }

defineProps({
  links: {
    type: Array as PropType<Link[]>,
    required: true,
  },
})

const asLinks = (items: any) => items as Link[]
</script>
