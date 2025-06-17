import type { ComponentPropsAndSlots, StoryObj } from '@storybook-vue/nuxt'
import SFAccountTabs from './SFAccountTabs.vue'

/**
 * SFAccountTabs provides a consistent navigation interface for the account section of the application.
 * It helps users navigate between different account-related sections like orders, profile, and settings.
 *
 * Key features:
 * - Responsive tab navigation for account sections
 * - Visual indication of the current active section
 * - Consistent styling across the account area
 * - Automatic route-based active state
 */
export default {
  title: 'Account/SFAccountTabs',
  component: SFAccountTabs,
  render: (args: ComponentPropsAndSlots<typeof SFAccountTabs>) => ({
    components: { SFAccountTabs },
    setup() {
      return { args }
    },
    template: `<SFAccountTabs v-bind="args" />`,
  }),
}

/**
 * The default implementation shows all available account sections as tabs.
 * The active tab is determined by the current route, providing a seamless navigation experience.
 */
export const Default: StoryObj<typeof SFAccountTabs> = {}
