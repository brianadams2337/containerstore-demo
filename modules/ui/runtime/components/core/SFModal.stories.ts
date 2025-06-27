import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import { fn } from '@storybook/test'
import SFModal from './SFModal.client.vue'
import SFButton from './SFButton.vue'

/**
 * SFModal is a client-side modal dialog component that provides a focused overlay interface.
 * It's commonly used for forms, confirmations, detailed information display, and user interactions
 * that require immediate attention while maintaining context.
 *
 * Key features:
 * - Client-only rendering to prevent SSR issues
 * - Focus trap for accessibility and keyboard navigation
 * - Backdrop click to close functionality
 * - Escape key support for closing
 * - Configurable close button visibility
 * - Customizable transition animations
 * - Proper ARIA attributes and accessibility
 */
export default {
  title: 'Base Components/SFModal',
  component: SFModal,
  args: {
    onClose: fn(),
  },
  argTypes: {
    visible: {
      control: 'boolean',
      description:
        'Controls the visibility of the modal. Use v-model for two-way binding.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFModal>) => ({
    components: { SFModal },
    setup() {
      const isVisible = ref(false)
      return { args, isVisible }
    },
    template: `<SFModal v-model:visible="isVisible" v-bind="args">
      <div class="p-6">
        <h2 class="mb-4 text-xl font-semibold">Modal Content</h2>
        <p class="mb-4 text-gray-600">This is the modal content area. You can put any content here.</p>
        <div class="flex justify-end gap-2">
          <SFButton variant="secondary" @click="isVisible = false">Cancel</SFButton>
          <SFButton @click="isVisible = false">Confirm</SFButton>
        </div>
      </div>
    </SFModal>`,
  }),
}

/**
 * Basic modal with default settings. This is the most common usage pattern
 * for displaying forms, confirmations, or detailed information.
 */
export const Default = {
  render: (args) => ({
    components: { SFModal, SFButton },
    setup() {
      const isVisible = ref(false)
      return { args, isVisible }
    },
    template: `
    <div>
      <SFButton @click="isVisible = true">Open Modal</SFButton>
      <SFModal v-model:visible="isVisible" v-bind="args">
        <div class="p-6">
          <h2 class="mb-4 text-xl font-semibold">Welcome to Our Store</h2>
          <p class="mb-4 text-gray-600">
            This is a sample modal that demonstrates the basic functionality.
            You can close it by clicking the X button, clicking outside, or pressing Escape.
          </p>
          <div class="flex justify-end gap-2">
            <SFButton variant="secondary" @click="isVisible = false">Cancel</SFButton>
            <SFButton @click="isVisible = false">Continue</SFButton>
          </div>
        </div>
      </SFModal>
    </div>`,
  }),
} satisfies Meta<typeof SFModal>

/**
 * Modal without a close button, requiring users to interact with the content
 * or use the escape key to close. Useful for important confirmations or forms.
 */
export const NoCloseButton = {
  render: (args) => ({
    components: { SFModal, SFButton },
    setup() {
      const isVisible = ref(false)
      return { args, isVisible }
    },
    template: `
    <div>
      <SFButton @click="isVisible = true">Open Modal (No Close Button)</SFButton>
      <SFModal v-model:visible="isVisible" v-bind="args">
        <div class="p-6">
          <h2 class="mb-4 text-xl font-semibold">Important Action Required</h2>
          <p class="mb-4 text-gray-600">
            This modal doesn't have a close button. You must make a choice or press Escape to close.
          </p>
          <div class="flex justify-end gap-2">
            <SFButton variant="secondary" @click="isVisible = false">Cancel</SFButton>
            <SFButton @click="isVisible = false">Confirm Action</SFButton>
          </div>
        </div>
      </SFModal>
    </div>`,
  }),
  args: {
    hideCloseButton: true,
  },
} satisfies Meta<typeof SFModal>
