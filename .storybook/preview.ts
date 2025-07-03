import type { Preview } from '@storybook-vue/nuxt'
import { useI18n } from '#imports'

const preview: Preview = {
  // https://storybook.js.org/docs/writing-stories/parameters
  // https://storybook.js.org/docs/api/parameters#available-parameters
  parameters: {
    controls: {
      // These controls automatically match properties to a better fitting control.
      // e.g. props with color will be displayed as a color picker.
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    test: {
      // This is needed to ignore errors for the interaction addon. If not set the addon will shown an error for missing assertions in the interaction.
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      components: { story },
      template:
        '<div class="flex justify-center items-center p-8"><story /></div>',
      setup: () => {
        const i18n = useI18n()
        i18n.locale.value = 'en'
      },
    }),
  ],
}

export default preview
