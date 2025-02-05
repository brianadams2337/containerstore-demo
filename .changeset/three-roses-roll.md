---
'@scayle/storefront-boilerplate-nuxt': minor
---

[Architecture] Leverage the [reactive props destructure](https://vuejs.org/guide/components/props.html#reactive-props-destructure) feature for defining component props in a more concise and readable manner:

```vue
<script setup lang="ts">
// Using reactive props destructure
const { name = '' } = defineProps<{ name?: string }>()

// Alternatively, defining props with `withDefaults` without destructuring
const props = withDefaults(defineProps<{ name?: string }>(), { name: '' })
</script>
```
