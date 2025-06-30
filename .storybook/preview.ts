import type { Preview } from '@storybook-vue/nuxt'

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
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default preview
