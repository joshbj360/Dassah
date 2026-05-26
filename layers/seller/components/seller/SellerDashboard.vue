<template>
  <div class="flex flex-col h-full overflow-y-auto px-4 py-6 gap-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">

    <!-- Greeting -->
    <div>
      <p class="text-xs text-slate-400 uppercase tracking-widest font-medium">Today</p>
      <h2 class="text-xl font-bold text-white mt-1">
        {{ greeting }}, {{ firstName }}
      </h2>
      <p class="text-sm text-slate-400 mt-0.5">Here's how <span class="text-slate-200 font-medium">{{ storeName }}</span> is doing.</p>
    </div>

    <!-- Analytics cards -->
    <div v-if="analyticsLoading" class="grid grid-cols-2 gap-3">
      <div v-for="i in 4" :key="i" class="h-20 rounded-2xl bg-slate-800 animate-pulse" />
    </div>

    <div v-else-if="analyticsError" class="rounded-2xl bg-slate-800 border border-slate-700 p-4 text-center">
      <p class="text-xs text-slate-400">Could not load analytics.</p>
      <button @click="loadAnalytics" class="text-xs text-[#e52033] mt-1 hover:underline">Retry</button>
    </div>

    <div v-else class="grid grid-cols-2 gap-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl bg-slate-800 border border-slate-700/50 p-4 flex flex-col gap-1"
      >
        <p class="text-xs text-slate-400 font-medium">{{ stat.label }}</p>
        <p class="text-xl font-bold text-white">{{ stat.value }}</p>
        <p
          v-if="stat.change !== null"
          class="text-[11px] font-medium"
          :class="stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'"
        >
          {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}% vs yesterday
        </p>
      </div>
    </div>

    <!-- Quick actions -->
    <div>
      <p class="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">Quick actions</p>
      <div class="flex flex-col gap-2">
        <button
          v-for="action in quickActions"
          :key="action.label"
          @click="$emit('action', action.prompt)"
          class="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/50 hover:border-[#e52033]/30 hover:bg-slate-750 transition-all text-left group"
        >
          <span class="text-lg leading-none">{{ action.icon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{{ action.label }}</p>
            <p class="text-xs text-slate-500">{{ action.description }}</p>
          </div>
          <svg class="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '~~/layers/core/composables/useAuth'

const props = defineProps<{
  storeId: string
  storeName: string
}>()

defineEmits<{
  action: [prompt: string]
}>()

const { user, token } = useAuth()

const firstName = computed(() => {
  const name = user.value?.name ?? ''
  return name.split(' ')[0] || 'there'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

// ── Analytics ─────────────────────────────────────────────────────────────────

const analyticsLoading = ref(false)
const analyticsError = ref(false)
const analytics = ref<Record<string, any>>({})

const stats = computed(() => [
  {
    label: 'Revenue today',
    value: formatCurrency(analytics.value.revenue ?? 0),
    change: analytics.value.revenueChange ?? null,
  },
  {
    label: 'Orders',
    value: analytics.value.orders ?? '—',
    change: analytics.value.ordersChange ?? null,
  },
  {
    label: 'Visitors',
    value: analytics.value.visitors ?? '—',
    change: analytics.value.visitorsChange ?? null,
  },
  {
    label: 'Conversion',
    value: analytics.value.conversionRate != null
      ? `${analytics.value.conversionRate}%`
      : '—',
    change: null,
  },
])

function formatCurrency(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(1)}K`
  return `₦${amount.toLocaleString()}`
}

async function loadAnalytics() {
  if (!token.value || !props.storeId) return
  analyticsLoading.value = true
  analyticsError.value = false
  try {
    const res = await $fetch<any>(`/api/orders/seller/analytics?storeId=${props.storeId}&timeframe=today`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    analytics.value = res?.data ?? res ?? {}
  } catch {
    analyticsError.value = true
  } finally {
    analyticsLoading.value = false
  }
}

watch(() => props.storeId, () => loadAnalytics(), { immediate: false })
onMounted(() => loadAnalytics())

// ── Quick actions ─────────────────────────────────────────────────────────────

const quickActions = [
  {
    icon: '📊',
    label: "Today's performance",
    description: 'Revenue, orders, and conversion rate',
    prompt: "Show me today's sales performance",
  },
  {
    icon: '📦',
    label: 'Pending orders',
    description: 'Orders waiting to be fulfilled',
    prompt: 'Show my pending orders',
  },
  {
    icon: '⚠️',
    label: 'Low stock alert',
    description: 'Products running out of inventory',
    prompt: 'Which products are running low on stock?',
  },
  {
    icon: '📣',
    label: 'Run a campaign',
    description: 'Post to social or send a promotion',
    prompt: 'Help me create a promotional post for my store',
  },
  {
    icon: '📈',
    label: 'Weekly report',
    description: 'Summary of the last 7 days',
    prompt: 'Give me a summary of my store performance this week',
  },
]
</script>
