import type { ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import SFPaginationButton from './SFPaginationButton.vue'

/**
 * SFPaginationButton is a clickable button component used within pagination controls.
 * It displays page numbers or navigation icons and handles the active state styling.
 * The component automatically scrolls to the top of the page when clicked.
 */
export default {
  title: 'Base Components/SFPaginationButton',
  component: SFPaginationButton,
  render: (args: ComponentPropsAndSlots<typeof SFPaginationButton>) => ({
    components: { SFPaginationButton },
    setup() {
      return { args }
    },
    template: `<SFPaginationButton v-bind="args" />`,
  }),
}

/**
 * Inactive page button.
 * Shows the button in its default inactive state.
 */
export const Default = {
  args: {
    page: {
      number: 2,
      to: '/page/2',
      isActive: false,
    },
  },
}
