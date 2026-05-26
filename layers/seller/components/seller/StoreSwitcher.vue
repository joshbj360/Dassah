<template>
  <div class="relative" ref="rootEl">
    <!-- Trigger -->
    <button
      @click="open = !open"
      class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors max-w-[180px]"
    >
      <!-- Logo / initials -->
      <div class="w-6 h-6 rounded-lg overflow-hidden shrink-0 bg-slate-600 flex items-center justify-center">
        <img
          v-if="activeStore?.store_logo"
          :src="activeStore.store_logo"
          :alt="activeStore.store_name"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-slate-300 text-[10px] font-bold uppercase leading-none">
          {{ activeStore ? initials(activeStore.store_name) : '?' }}
        </span>
      </div>

      <span class="text-xs font-semibold text-slate-200 truncate flex-1">
        {{ activeStore?.store_name ?? 'Select store' }}
      </span>

      <!-- Chevron -->
      <svg
        class="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform"
        :class="{ 'rotate-180': open }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute left-0 top-full mt-1.5 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl shadow-black/40 z-50 overflow-hidden"
      >
        <div class="p-1.5">
          <button
            v-for="store in stores"
            :key="store.id"
            @click="select(store)"
            class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-700 transition-colors text-left"
            :class="store.id === activeStore?.id ? 'bg-slate-700' : ''"
          >
            <div class="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-slate-600 flex items-center justify-center">
              <img
                v-if="store.store_logo"
                :src="store.store_logo"
                :alt="store.store_name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-slate-300 text-[10px] font-bold uppercase">
                {{ initials(store.store_name) }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-white truncate">{{ store.store_name }}</p>
              <p class="text-[10px] text-slate-400 truncate">@{{ store.store_slug }}</p>
            </div>
            <svg
              v-if="store.id === activeStore?.id"
              class="w-3.5 h-3.5 text-[#e52033] shrink-0"
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { SellerStoreSummary } from '../../composables/useSellerStores'

const props = defineProps<{
  stores: SellerStoreSummary[]
  activeStore: SellerStoreSummary | null
}>()

const emit = defineEmits<{
  select: [store: SellerStoreSummary]
}>()

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

function select(store: SellerStoreSummary) {
  emit('select', store)
  open.value = false
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function handleOutsideClick(e: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick, true))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick, true))
</script>
