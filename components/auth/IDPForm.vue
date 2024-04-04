<template>
  <div class="flex flex-col gap-6">
    <div class="relative flex w-full items-center">
      <div class="h-px w-full bg-gray-300" aria-hidden="true" />
      <span class="px-6 text-gray-900">{{ $t('global.or') }}</span>
      <div class="h-px w-full bg-gray-300" aria-hidden="true" />
    </div>

    <div class="flex w-full flex-col gap-4">
      <DefaultLink
        v-for="provider in providers"
        :key="provider.title"
        class="group inline-flex w-full items-center justify-center gap-2 truncate whitespace-nowrap rounded-md border p-3 text-sm font-semibold leading-5 tracking-wide text-white transition duration-100 ease-linear focus:ring-1 disabled:opacity-30"
        :class="provider.classes"
        :to="provider.url"
        raw
      >
        {{ $t(`login_page.idp.${provider.title}`) }}
      </DefaultLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const idpClasses: Record<string, string> = {
  google: 'bg-[#4285F4] text-white hover:bg-[#3869c1] focus:bg-[#3869c1]',
  facebook: 'bg-[#1877F2] text-white hover:bg-[#165dbb] focus:bg-[#165dbb]',
  keycloak: 'bg-[#C43A31] text-white hover:bg-[#a32b26] focus:bg-[#a32b26]',
  apple: 'bg-black text-white hover:bg-[#333333] focus:bg-[#333333]',
  okta: 'bg-[#0061F2] text-white hover:bg-[#004ecb] focus:bg-[#004ecb]',
}

const props = defineProps<{
  redirects: Record<string, string>
}>()

const providers = computed<{ title: string; url: string; classes: string }[]>(
  () => {
    return Object.entries(props.redirects).map(([key, url]) => {
      return {
        title: key,
        url,
        classes:
          idpClasses[key] ??
          'bg-primary hover:bg-primary-400 focus:bg-primary-400',
      }
    })
  },
)
</script>
