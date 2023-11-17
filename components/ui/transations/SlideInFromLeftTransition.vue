<template>
  <Transition
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    enter-active-class="transform transition duration-500 ease-in-out"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
    leave-active-class="transform transition duration-500 ease-in-out"
  >
    <slot />
  </Transition>
</template>
