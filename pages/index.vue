<template>
  <div>
    <NuxtLazyHydrate when-visible>
      <div class="h-[600px]">
        {{ $t("global.user_greeting", { name: appUser }) }}
        <p>Nuxt Img</p>
        <nuxt-img
          class="h-full"
          provider="default"
          src="images/1bef383677e1873e174d75f52fc51a2a.jpg"
        />
      </div>
    </NuxtLazyHydrate>
  </div>
</template>

<script setup>
const appUser = ["AYK", "Connor", "Rob"][
  Math.floor(Math.random() * (2 - 0 + 1) + 0)
];

const count = ref(0);
const countUp = () => {
  count.value += 1;
};
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "Thing",
  name: `reactive json: count is ${count.value}`,
}));
</script>
