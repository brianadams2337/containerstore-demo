import { defineCommand } from 'citty'
export const storyblokCommands = defineCommand({
  meta: {
    name: 'storyblok',
    description: 'Storyblok commands',
  },
  subCommands: {
    download: () =>
      defineCommand({
        meta: {
          name: 'download',
          description: 'Storyblok download subcommand',
        },
        run(context) {
          console.log('download', context)
        },
      }),
    generate: () =>
      defineCommand({
        meta: {
          name: 'generate',
          description: 'Storyblok generate subcommand',
        },
      }),
    login: () =>
      defineCommand({
        meta: {
          name: 'login',
          description: 'Storyblok login subcommand',
        },
      }),
    unused: () =>
      defineCommand({
        meta: {
          name: 'unused',
          description: 'Storyblok unused subcommand',
        },
      }),
  },
})
