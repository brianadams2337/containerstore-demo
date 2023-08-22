<template>
  <header>
    <div class="flex items-center border-b py-4">
      <nuxt-link to="/">
        <SvgoUiLogo class="w-32" :font-controlled="false" />
      </nuxt-link>
      <div class="flex flex-1 items-center justify-end space-x-3">
        <HeaderSearch />
        <NuxtLink to="women">Women</NuxtLink>
        <NuxtLink to="men">Men</NuxtLink>
        <NuxtLink to="sale">Sale</NuxtLink>
        <SvgoUiUser class="w-4" />
        <SvgoUiBasket class="h-5 w-5" />
      </div>
    </div>
  </header>
</template>
