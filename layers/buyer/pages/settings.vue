<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
        <button
          @click="router.back()"
          class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-base font-bold text-gray-900">Settings</h1>
      </div>
    </div>

    <div class="max-w-xl mx-auto px-4 py-6 space-y-4">
      <!-- AI Model -->
      <AIModelConfig />

      <!-- Account section -->
      <div class="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-[15px] font-bold text-gray-900">Account</h2>
        </div>

        <div class="px-5 py-4 flex items-center gap-3">
          <img
            :src="avatarSrc"
            :alt="user?.name ?? 'User'"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ user?.name || 'User' }}</p>
            <p class="text-xs text-gray-400 truncate">{{ user?.email || '' }}</p>
          </div>
          <button
            @click="handleLogout"
            class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from '#app'

definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()
const router = useRouter()

const avatarSrc = computed(() =>
  user.value?.picture ||
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.value?.name || user.value?.email || 'U')}`
)

function handleLogout() {
  logout()
}
</script>
