import type { Preview } from '@storybook-vue/nuxt'
import DocumentationTemplate from './templates/DocumentationTemplate.mdx'

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
    // Adds a custom template for the docs page.
    docs: {
      // <Stories /> cannot be used in this template due to a known bug in Nuxt Storybook.
      // See: https://github.com/nuxt-modules/storybook/issues/899
      page: DocumentationTemplate,
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default preview
