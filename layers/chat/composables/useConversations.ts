import { ref, computed } from 'vue'

export interface ConversationSummary {
  sessionId: string
  title: string
  preview: string
  createdAt: string
  updatedAt: string
  mode: 'buyer' | 'seller'
  storeId?: string
  storeName?: string
}

const STORAGE_KEY = 'dasah:conversations'
const MAX_STORED = 30

// ── Module-level singleton ────────────────────────────────────────────────────

const conversations = ref<ConversationSummary[]>([])
let loaded = false

function load() {
  if (loaded || !process.client) return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) conversations.value = JSON.parse(raw)
  } catch {
    conversations.value = []
  }
}

function save() {
  if (!process.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.value.slice(0, MAX_STORED)))
  } catch { /* quota exceeded — silent */ }
}

// ── Composable ────────────────────────────────────────────────────────────────

export const useConversations = () => {
  load()

  const activeSessionId = ref<string | null>(null)

  const sorted = computed(() =>
    [...conversations.value].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  )

  function upsert(
    sessionId: string,
    firstUserMessage: string,
    mode: 'buyer' | 'seller' = 'buyer',
    storeId?: string,
    storeName?: string,
  ) {
    const now = new Date().toISOString()
    const title = firstUserMessage.length > 48
      ? firstUserMessage.slice(0, 48).trimEnd() + '…'
      : firstUserMessage
    const preview = firstUserMessage.length > 72
      ? firstUserMessage.slice(0, 72).trimEnd() + '…'
      : firstUserMessage

    const idx = conversations.value.findIndex(c => c.sessionId === sessionId)
    if (idx === -1) {
      conversations.value.unshift({
        sessionId, title, preview, createdAt: now, updatedAt: now,
        mode, storeId, storeName,
      })
    } else {
      conversations.value[idx] = { ...conversations.value[idx], updatedAt: now, preview }
    }
    save()
  }

  function remove(sessionId: string) {
    conversations.value = conversations.value.filter(c => c.sessionId !== sessionId)
    save()
  }

  function clear() {
    conversations.value = []
    save()
  }

  return { conversations: sorted, activeSessionId, upsert, remove, clear }
}
