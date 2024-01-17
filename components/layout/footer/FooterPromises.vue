<template>
  <div id="shopping-promises" class="border-y border-gray-200 py-8">
    <div
      class="container flex flex-col justify-center gap-6 px-6 uppercase md:flex-row md:items-center"
    >
      <p class="inline-flex items-center gap-2 text-xs md:gap-4">
        <IconInvoice class="size-4 md:size-6" />
        {{ $t('promises.pay_with_invoice') }}
      </p>
      <p class="inline-flex items-center gap-2 text-xs md:gap-4">
        <IconDelivery class="size-4 md:size-6" />
        {{ $t('promises.free_return_and_shipping') }}
      </p>
      <p class="inline-flex items-center gap-2 text-xs md:gap-4">
        <IconReturn class="size-4 md:size-6" />
        {{ $t('promises.return_policy') }}
      </p>
    </div>
  </div>
</template>
