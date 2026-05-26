<template>
  <!-- On mobile: height shrinks by the 56px bottom nav. On sm+: full dvh. -->
  <div class="h-[calc(100dvh-56px)] sm:h-[100dvh] overflow-hidden bg-gray-100">
    <ChatWindow />
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
// useAuth, useSocket, ChatWindow, MobileBottomNav auto-imported from layers

definePageMeta({ middleware: 'auth' })

const { token } = useAuth()
const { connect, disconnect } = useSocket()

if (token.value) {
  connect(token.value)
}

onUnmounted(() => {
  disconnect()
})
</script>
