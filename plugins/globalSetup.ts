import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async () => {
  // Initialize data
  console.log('Global Setup')
  await useUser()
  await useWishlist()
  await useBasket()
  await useRootCategories()
})
