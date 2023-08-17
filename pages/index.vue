<template>
  <div>
    <div class="h-[600px]">
      {{ $t("global.user_greeting", { name: appUser }) }}
      <p>Nuxt Img</p>
      <nuxt-img
        class="h-5/6"
        provider="default"
        src="images/1bef383677e1873e174d75f52fc51a2a.jpg"
      />
    </div>
  </div>
</template>

<script setup>
const appUser = ["AYK", "Connor", "Rob"][
  Math.floor(Math.random() * (2 - 0 + 1) + 0)
];
</script>
