import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    ['unplugin-icons/nuxt', {}]
  ],
  router: {
    middleware: ['redirect']
  }
})
