import environment from "../environment";

// https://github.com/storyblok/storyblok-nuxt#options
export const storyblokRuntimeConfigPrivate = {
  // Following keys are overridable using prefix NUXT_STORYBLOK_ACCESS_TOKEN
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  webhookSecret: environment.STORYBLOK_WEBHOOK_SECRET,
}
