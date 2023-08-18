<template>
  <header>
    <div class="border-b flex py-4 items-center">
      <nuxt-link to="/">
        <SvgoUiLogo class="w-32" :font-controlled="false" />
      </nuxt-link>
      <div class="flex-1 flex justify-end space-x-3 items-center">
        <HeaderSearch />
        <NuxtLink to="women">Women</NuxtLink>
        <NuxtLink to="men">Men</NuxtLink>
        <NuxtLink to="sale">Sale</NuxtLink>
        <SvgoUiUser class="w-4" />
        <SvgoUiBasket class="w-5 h-5" />
      </div>
    </div>
  </header>
</template>
