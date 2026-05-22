<template>
  <div class="flex flex-wrap gap-2 mt-3">
    <button
      v-for="reply in replies"
      :key="reply"
      @click="$emit('select', reply)"
      class="px-3 py-1.5 bg-[#e52033]/5 text-[#e52033] border border-[#e52033]/25 rounded-full text-xs font-semibold hover:bg-[#e52033]/10 hover:border-[#e52033]/40 active:scale-95 transition-all whitespace-nowrap"
    >
      {{ reply }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ replies: string[] }>()
defineEmits<{ select: [reply: string] }>()
</script>
