---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Architecture] Use `useI18n` composable directly in script `setup` as it provides a more
straightforward and efficient way to access internationalization (i18n) functionalities.
Reasons are as follows:

1. **Simplicity**: Directly using `useI18n` is simpler and more intuitive, reducing the complexity of code.
2. **Performance**: Accessing `useI18n` directly can be more performant as it avoids the additional overhead of going through `useNuxtApp`.
3. **Type Safety**: Direct usage often provides better TypeScript support, ensuring type safety and better developer experience.
4. **Readability**: It makes the code more readable and maintainable by clearly indicating the use of i18n functionalities.

The only disadvantage of this approach is that it must be called via script `setup`.
This means that if it is used within another composable that is not called in `setup`, an error will be thrown.
