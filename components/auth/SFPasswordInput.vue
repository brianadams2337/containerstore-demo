<template>
  <SFTextInput
    v-model="modelValue"
    :placeholder="placeholder"
    :type="passwordInputType"
    :has-errors="!isValid"
    required
    :readonly="disabled"
    @change="$emit('change')"
    @input="$emit('input')"
  >
    <template #append-icon>
      <SFButton
        variant="raw"
        class="size-full"
        :aria-label="
          isPasswordHidden ? $t('password.show') : $t('password.hide')
        "
        @click.prevent="togglePasswordVisibility"
      >
        <IconPasswordHide
          v-if="isPasswordHidden"
          class="size-3 text-gray-750"
        />
        <IconPasswordShow v-else class="size-3 text-gray-750" />
      </SFButton>
    </template>
  </SFTextInput>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SFButton, SFTextInput } from '#storefront-ui/components'

const modelValue = defineModel({
  type: String,
  default: '',
  required: true,
})

const {
  disabled = false,
  isValid,
  placeholder,
} = defineProps<{
  disabled?: boolean
  isValid: boolean
  placeholder: string
}>()

defineEmits(['change', 'input'])

const passwordInputType = ref<'password' | 'text'>('password')

const isPasswordHidden = computed(() => passwordInputType.value === 'password')

const togglePasswordVisibility = (): void => {
  passwordInputType.value = isPasswordHidden.value ? 'text' : 'password'
}
</script>
