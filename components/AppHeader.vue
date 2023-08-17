<template>
  <header>
    <div class="border-b flex py-4 items-center">
      <nuxt-link to="/">
        <SvgoLogo class="w-32" :font-controlled="false" />
      </nuxt-link>
      <div class="flex-1 flex justify-end space-x-2">
        <NuxtLink to="women">Women</NuxtLink>
        <NuxtLink to="men">Men</NuxtLink>
        <NuxtLink to="sale">Sale</NuxtLink>
        <SvgoUser class="w-4" />
        <SvgoUiBasket class="w-5 h-5" />
      </div>
    </div>
  </header>
</template>
