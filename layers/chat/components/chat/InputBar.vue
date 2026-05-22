<template>
  <div class="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
    <input
      v-model="text"
      @keyup.enter="send"
      type="text"
      placeholder="Ask Dasah…"
      class="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#e52033]/40 focus:ring-2 focus:ring-[#e52033]/15 transition"
      :disabled="disabled"
    />
    <button
      @click="send"
      :disabled="!text.trim() || disabled"
      class="bg-[#e52033] text-white rounded-full p-2.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c01020] active:scale-90 transition-all shadow-sm shadow-[#e52033]/30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 ml-0.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ disabled?: boolean }>()
const emit = defineEmits(['send'])
const text = ref('')

const send = () => {
  if (!text.value.trim()) return
  emit('send', text.value)
  text.value = ''
}
</script>
