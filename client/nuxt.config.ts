import axios from 'axios'
import { defineNuxtConfig } from 'nuxt'
import { urls } from './utils/Config'

export default defineNuxtConfig(async () => {
  const dopplerSecrets = await getSecrets()
  return {
    modules: [
      ['unplugin-icons/nuxt', {}]
    ],
    router: {
      middleware: ['redirect']
    },
    privateRuntimeConfig: {
      apiSecret: process.env.DOPPLER_SERVICE_TOKEN,
      secretVariables: dopplerSecrets,
      environment: "development"
    }
  }
})

async function getSecrets () {
  const response = await axios.get(urls.secrets.doppler,
    {
      auth: {
        username: process.env.DOPPLER_SERVICE_TOKEN,
        password: ''
      }
    })
  return response.data
}
