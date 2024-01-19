#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { storyblokCommands } from './providers/storyblok/commands'

const main = defineCommand({
  meta: {
    name: 'cms',
    description: 'CMS commands',
  },
  subCommands: {
    storyblok: () => storyblokCommands,
  },
})

runMain(main)
