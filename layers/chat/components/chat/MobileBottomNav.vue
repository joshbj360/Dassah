<template>
  <nav class="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 flex items-stretch safe-area-bottom">
    <button
      v-for="item in items"
      :key="item.id"
      @click="item.action()"
      :class="[
        'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors',
        item.active ? 'text-[#e52033]' : 'text-gray-400 hover:text-gray-600',
      ]"
    >
      <component :is="item.icon" class="w-5 h-5" />
      <span class="text-[10px] font-semibold leading-none">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()

// Inline SVG icon components
const IconChat = () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
])

const IconStore = () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' })
])

const IconSettings = () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
])

const items = computed(() => [
  {
    id: 'chat',
    label: 'Chat',
    icon: IconChat,
    active: route.path === '/chat',
    action: () => router.push('/chat'),
  },
  {
    id: 'seller',
    label: 'Seller',
    icon: IconStore,
    active: route.path.startsWith('/seller'),
    action: () => router.push('/seller/chat'),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: IconSettings,
    active: route.path === '/settings',
    action: () => router.push('/settings'),
  },
])
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
