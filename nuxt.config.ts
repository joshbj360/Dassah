import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  extends: [
    './layers/core',
    './layers/chat',
    './layers/buyer',
    './layers/seller'
  ],
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Server-only — available via useRuntimeConfig() in server routes
    marketxApiUrl: process.env.MARKETX_API_URL || '',
    marketxApiKey: process.env.MARKETX_API_KEY || '',
    public: {
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000'
    }
  }
});
