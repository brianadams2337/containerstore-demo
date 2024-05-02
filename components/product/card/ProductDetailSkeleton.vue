<template>
  <section class="container mt-10 overflow-hidden">
    <div class="flex max-w-6xl justify-between">
      <ProductCardSkeleton class="max-w-xl" />
      <div class="space-y-3">
        <SFSkeletonLoader type="headline" full-width />
        <div class="w-12">
          <SFSkeletonLoader type="headline" />
        </div>
        <SFSkeletonLoader type="headline" full-width />
        <SFSkeletonLoader type="headline" full-width />
        <SFSkeletonLoader class="mt-20" type="button" />
      </div>
    </div>
  </section>
</template>
