<template>
  <header>
    <div class="border-b flex py-4">
      <nuxt-link to="/">Logo</nuxt-link>
      <div class="flex-1 flex justify-end space-x-2">
        <NuxtLink to="women">Women</NuxtLink>
        <NuxtLink to="men">Men</NuxtLink>
        <NuxtLink to="sale">Sale</NuxtLink>
        <SvgoUser />
        <SvgoUiBasket class="w-7 h-7" />
      </div>
    </div>
  </header>
</template>
