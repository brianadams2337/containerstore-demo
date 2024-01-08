<template>
  <div
    class="z-10 inline-block w-max rounded-md bg-black p-1.5 px-2 text-xs font-bold uppercase leading-none text-white md:mt-3"
  >
    {{ label }}
  </div>
</template>

<script setup lang="ts">
type Props = {
  badgeLabel?: string
  translate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  badgeLabel: undefined,
  translate: true,
})

const { $i18n } = useNuxtApp()

const label = computed(() => {
  return $i18n.t((props.translate ? 'badge_labels.' : '') + props.badgeLabel)
})
</script>
