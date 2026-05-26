import { ref, computed } from 'vue'
import { useAuth } from '~~/layers/core/composables/useAuth'

export interface SellerStoreSummary {
  id: string
  store_name: string
  store_slug: string
  store_logo: string | null
  is_active: boolean
  averageRating: number | null
  totalReviews: number
  followers_count: number
}

const ACTIVE_STORE_KEY = 'dasah:seller:activeStoreId'

// ── Module-level singleton ────────────────────────────────────────────────────

const stores = ref<SellerStoreSummary[]>([])
const activeStoreId = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let fetched = false

function persistActive(id: string | null) {
  if (!process.client) return
  if (id) localStorage.setItem(ACTIVE_STORE_KEY, id)
  else localStorage.removeItem(ACTIVE_STORE_KEY)
}

function loadCached() {
  if (!process.client) return
  const cached = localStorage.getItem(ACTIVE_STORE_KEY)
  if (cached) activeStoreId.value = cached
}

// ── Composable ────────────────────────────────────────────────────────────────

export const useSellerStores = () => {
  const { token } = useAuth()

  const activeStore = computed(() =>
    stores.value.find(s => s.id === activeStoreId.value) ?? null
  )

  async function fetchStores() {
    if (fetched) return
    if (!token.value) return

    loading.value = true
    error.value = null

    try {
      const res = await $fetch<{ success: boolean; data: SellerStoreSummary[] }>(
        '/api/seller/stores',
        { headers: { Authorization: `Bearer ${token.value}` } }
      )
      stores.value = res.data ?? []
      fetched = true

      // Auto-select: restore cached, fall back to first store if only one
      loadCached()
      const cached = stores.value.find(s => s.id === activeStoreId.value)
      if (!cached) {
        if (stores.value.length === 1) {
          activeStoreId.value = stores.value[0].id
          persistActive(stores.value[0].id)
        } else {
          activeStoreId.value = null
        }
      }
    } catch (e: any) {
      error.value = e?.data?.statusMessage ?? 'Failed to load stores'
    } finally {
      loading.value = false
    }
  }

  function setActiveStore(id: string) {
    activeStoreId.value = id
    persistActive(id)
  }

  function clearActiveStore() {
    activeStoreId.value = null
    persistActive(null)
  }

  // Allow forcing a re-fetch (e.g. after creating a new store)
  function invalidate() {
    fetched = false
    stores.value = []
  }

  return {
    stores,
    activeStore,
    activeStoreId,
    loading,
    error,
    fetchStores,
    setActiveStore,
    clearActiveStore,
    invalidate,
  }
}
