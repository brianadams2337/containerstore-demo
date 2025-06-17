import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import SFButton from './SFButton.vue'
import { ButtonVariant, Size } from '#storefront-ui'

/**
 * SFButton is a versatile button component that supports multiple variants, sizes, and states.
 * It can be used for primary actions, secondary actions, and navigation throughout the application.
 *
 * Key features:
 * - Multiple visual variants (Primary, Secondary, Tertiary, etc.)
 * - Different sizes for various contexts (Small, Medium, Large)
 * - Support for icons (prefix and suffix)
 * - Loading state for async operations
 * - Badge support for notifications/counts
 * - Link behavior when using the 'to' prop
 */
export default {
  title: 'Core/SFButton',
  component: SFButton,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ButtonVariant),
      description:
        'Determines the visual style and emphasis of the button. Primary is used for main actions, while other variants provide different levels of emphasis.',
    },
    size: {
      control: { type: 'select' },
      options: Object.values(Size),
      description:
        "Controls the button's dimensions and padding. Choose based on the context and importance of the action.",
    },
    to: {
      control: 'text',
      description:
        'When provided, the button behaves as a router link. Useful for navigation actions within the application.',
    },
    onClick: {
      action: 'clicked',
      description:
        'Event handler for button clicks. Use this for handling user interactions and triggering actions.',
    },
    loading: {
      description:
        'Shows a loading spinner and disables the button. Use during async operations to prevent multiple submissions.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFButton>) => ({
    components: { SFButton },
    setup() {
      return { args }
    },
    template: `<SFButton v-bind="args">{{ args.default }}</SFButton>`,
  }),
}

/**
 * Primary buttons are used for the main call-to-action in a section or page.
 * They have the highest visual emphasis and should be used sparingly to maintain their impact.
 */
export const Primary = {
  args: {
    variant: ButtonVariant.PRIMARY,
    size: Size.MD,
    default: 'Primary',
  },
}

/**
 * Raw buttons have minimal styling and are typically used for less important actions
 * or when you want the button to blend in with the surrounding content.
 */
export const Raw = {
  args: {
    variant: ButtonVariant.RAW,
    size: Size.MD,
  },
}

/**
 * Buttons can include icons to enhance visual communication and improve usability.
 * Icons can be placed before the text to indicate the action type or provide visual context.
 */
export const ButtonWithIcon = {
  render: (args) => ({
    components: { SFButton },
    setup() {
      return { args }
    },
    template: `
    <SFButton v-bind="args">
      <template #icon>
        <IconChevronDown class="size-5" />
      </template>
      {{ args.default }}
    </SFButton>`,
  }),
} satisfies Meta<typeof SFButton>

/**
 * Appended icons are placed after the text and are commonly used for actions
 * that indicate direction or additional information (like dropdowns or external links).
 */
export const ButtonWithAppendedIcon = {
  render: (args) => ({
    components: { SFButton },
    setup() {
      return { args }
    },
    template: `
    <SFButton v-bind="args">
      <template #append-icon>
        <IconChevronDown class="size-5" />
      </template>
      {{ args.default }}
    </SFButton>`,
  }),
} satisfies Meta<typeof SFButton>

/**
 * Loading state is essential for async operations to provide feedback to users
 * and prevent multiple submissions of the same action.
 */
export const Loading = {
  args: {
    variant: ButtonVariant.PRIMARY,
    size: Size.MD,
    loading: true,
  },
}
