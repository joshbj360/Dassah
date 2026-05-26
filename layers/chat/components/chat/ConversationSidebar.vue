<template>
  <!-- Overlay for mobile -->
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-30 sm:hidden"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Panel: always visible on sm+, slide-over on mobile -->
  <Transition
    enter-active-class="transition ease-out duration-200 sm:transition-none"
    enter-from-class="-translate-x-full sm:translate-x-0"
    enter-to-class="translate-x-0"
    leave-active-class="transition ease-in duration-150 sm:transition-none"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full sm:translate-x-0"
  >
    <aside
      v-show="open"
      class="fixed sm:relative inset-y-0 left-0 z-40 sm:z-auto flex flex-col w-64 bg-white border-r border-gray-100 shadow-xl sm:shadow-none sm:!flex"
    >
      <!-- Header -->
      <div class="px-4 py-3.5 flex items-center justify-between border-b border-gray-100 shrink-0">
        <h2 class="text-[15px] font-bold text-gray-900">Conversations</h2>
        <div class="flex items-center gap-1">
          <button
            @click="$emit('new')"
            title="New conversation"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#e52033] hover:bg-red-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            @click="$emit('close')"
            class="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto py-2">
        <!-- Empty state -->
        <div v-if="conversations.length === 0" class="flex flex-col items-center justify-center h-40 gap-2 px-4">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p class="text-xs text-gray-400 text-center">No conversations yet.<br>Start chatting to see them here.</p>
        </div>

        <!-- Conversation items -->
        <div
          v-for="conv in conversations"
          :key="conv.sessionId"
          @click="$emit('select', conv.sessionId)"
          :class="[
            'group mx-2 mb-0.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors flex items-start gap-2.5',
            activeSessionId === conv.sessionId
              ? 'bg-[#e52033]/8 border border-[#e52033]/15'
              : 'hover:bg-gray-100 border border-transparent',
          ]"
        >
          <!-- Mode icon -->
          <div
            :class="[
              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5',
              conv.mode === 'seller'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-50 text-[#e52033]',
            ]"
          >
            {{ conv.mode === 'seller' ? '🏪' : '🛍️' }}
          </div>

          <!-- Text -->
          <div class="flex-1 min-w-0">
            <p
              :class="[
                'text-[13px] font-semibold leading-tight truncate',
                activeSessionId === conv.sessionId ? 'text-[#e52033]' : 'text-gray-800',
              ]"
            >
              {{ conv.title }}
            </p>
            <!-- Store badge for seller conversations -->
            <p v-if="conv.mode === 'seller' && conv.storeName" class="text-[10px] font-semibold text-emerald-600 truncate mt-0.5">
              {{ conv.storeName }}
            </p>
            <p class="text-[11px] text-gray-400 leading-tight mt-0.5 truncate">{{ conv.preview }}</p>
            <p class="text-[10px] text-gray-300 mt-1">{{ relativeTime(conv.updatedAt) }}</p>
          </div>

          <!-- Delete button -->
          <button
            @click.stop="handleDelete(conv.sessionId)"
            class="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shrink-0 mt-0.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="conversations.length > 0" class="px-4 py-3 border-t border-gray-100 shrink-0">
        <button
          @click="handleClearAll"
          class="w-full text-xs text-gray-400 hover:text-red-500 transition-colors text-center py-1"
        >
          Clear all conversations
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { useConversations } from '../../composables/useConversations'

const props = defineProps<{
  open: boolean
  activeSessionId?: string | null
}>()

defineEmits<{
  close: []
  new: []
  select: [sessionId: string]
}>()

const { conversations, remove, clear } = useConversations()

function handleDelete(sessionId: string) {
  remove(sessionId)
}

function handleClearAll() {
  if (confirm('Clear all conversation history?')) clear()
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
</script>
