<template>
  <div
    class="mt-1 flex items-center space-x-2 rounded-md bg-red-50 px-3 py-1.5 text-sm leading-3.5 text-status-error lg:mt-0.5"
  >
    <IconErrorHexagon class="size-4 text-status-error" />
    <span>
      {{ $t('pdp.sold_out') }}
    </span>
  </div>
</template>
