<template>
  <div class="flex flex-col items-center justify-center h-full px-6 py-12 gap-8">

    <!-- Brand mark -->
    <div class="text-center">
      <div class="w-12 h-12 rounded-2xl bg-[#e52033] flex items-center justify-center shadow-lg shadow-red-900/30 mx-auto mb-4">
        <span class="text-white text-lg font-black">DA</span>
      </div>
      <h2 class="text-lg font-bold text-white">Select a store</h2>
      <p class="text-sm text-slate-400 mt-1">Which store do you want to manage?</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center gap-3 py-8">
      <div class="w-8 h-8 border-2 border-slate-600 border-t-[#e52033] rounded-full animate-spin" />
      <span class="text-sm text-slate-400">Loading your stores…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-sm text-red-400 mb-4">{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-600 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Store grid -->
    <div v-else class="w-full max-w-sm grid gap-3">
      <button
        v-for="store in stores"
        :key="store.id"
        @click="$emit('select', store)"
        class="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:border-[#e52033]/40 hover:bg-slate-750 transition-all text-left group"
      >
        <!-- Logo / initials -->
        <div class="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-700 flex items-center justify-center">
          <img
            v-if="store.store_logo"
            :src="store.store_logo"
            :alt="store.store_name"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-slate-300 text-sm font-bold uppercase">
            {{ initials(store.store_name) }}
          </span>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate group-hover:text-[#e52033] transition-colors">
            {{ store.store_name }}
          </p>
          <p class="text-xs text-slate-400 mt-0.5">
            <span v-if="store.averageRating">★ {{ store.averageRating.toFixed(1) }} · </span>
            {{ store.followers_count }} followers
          </p>
        </div>

        <!-- Active badge -->
        <div
          v-if="store.is_active"
          class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
          title="Active"
        />
        <div
          v-else
          class="w-2 h-2 rounded-full bg-slate-600 shrink-0"
          title="Inactive"
        />
      </button>
    </div>

    <!-- Add store hint -->
    <p v-if="!loading && !error && stores.length > 0" class="text-xs text-slate-500 text-center">
      Manage multiple stores by switching in the header.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { SellerStoreSummary } from '../../composables/useSellerStores'

defineProps<{
  stores: SellerStoreSummary[]
  loading: boolean
  error: string | null
}>()

defineEmits<{
  select: [store: SellerStoreSummary]
  retry: []
}>()

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
</script>
