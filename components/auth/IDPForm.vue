<script setup lang="ts">
const { getIDPButtonClass } = useStyledIDPButtons()

const props = defineProps<{
  redirects: Record<string, string>
}>()

const providers = computed<{ title: string; url: string; classes: string }[]>(
  () => {
    return Object.keys(props.redirects).map((idpKey: string) => {
      return {
        title: idpKey,
        url: props.redirects?.[idpKey] ?? '',
        classes: getIDPButtonClass(idpKey),
      }
    })
  },
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="relative flex w-full items-center">
      <div class="h-[1px] w-full bg-gray-300" aria-hidden="true" />
      <span class="px-6 text-gray-900">{{ $t('global.or') }}</span>
      <div class="h-[1px] w-full bg-gray-300" aria-hidden="true" />
    </div>

    <div class="flex w-full flex-col gap-4">
      <RawLink
        v-for="provider in providers"
        :key="provider.title"
        class="group inline-flex w-full items-center justify-center gap-2 truncate whitespace-nowrap rounded-md border p-3 text-sm font-semibold leading-5 tracking-wide text-white transition duration-100 ease-linear focus:ring-1 disabled:opacity-30"
        :class="
          provider.classes ??
          'bg-primary hover:bg-primary-400 focus:bg-primary-400'
        "
        :to="provider.url">
        {{ $t(`login_page.idp.${provider.title}`) }}
      </RawLink>
    </div>
  </div>
</template>
