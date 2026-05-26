<template>
  <div class="mt-3 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">

    <!-- Header -->
    <div class="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50/60">
      <div class="w-7 h-7 rounded-lg bg-[#e52033]/8 flex items-center justify-center shrink-0">
        <svg class="w-3.5 h-3.5 text-[#e52033]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <span class="text-sm font-bold text-gray-900">Order Confirmation</span>
    </div>

    <!-- Product row -->
    <div v-if="metadata.productName" class="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
      <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
        <img
          v-if="metadata.imageUrl"
          :src="metadata.imageUrl"
          :alt="metadata.productName"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-xl">🛍️</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 leading-tight truncate">{{ metadata.productName }}</p>
        <p v-if="metadata.seller" class="text-[11px] text-gray-400 mt-0.5">{{ metadata.seller }}</p>
        <p class="text-[11px] text-gray-400 mt-0.5">Qty: 1</p>
      </div>
    </div>

    <!-- Price breakdown -->
    <div class="px-4 py-3 space-y-2.5">
      <div v-if="metadata.price" class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Item total</span>
        <span class="text-sm font-semibold text-gray-900">{{ formatPrice(metadata.price, metadata.currency) }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Shipping</span>
        <span class="text-[11px] text-gray-400 italic">Calculated at checkout</span>
      </div>
      <div class="pt-2 border-t border-gray-100 flex items-center justify-between">
        <span class="text-sm font-bold text-gray-900">Total</span>
        <span class="text-base font-black text-gray-900">
          {{ metadata.price ? formatPrice(metadata.price, metadata.currency) : 'See checkout' }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-4 pb-4 flex flex-col gap-2">
      <a
        :href="metadata.paymentUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#e52033] text-white text-sm font-bold hover:bg-[#c01020] active:scale-[0.98] transition-all shadow-sm shadow-[#e52033]/25"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Pay with Paystack
      </a>

      <div v-if="paid" class="flex items-center justify-center gap-1.5 text-emerald-600 text-sm font-semibold py-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Payment confirmed — processing your order
      </div>
      <button
        v-else
        @click="handleApprove"
        class="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all"
      >
        I've already paid ✓
      </button>
    </div>

    <!-- Security footer -->
    <div class="px-4 pb-3 flex items-center gap-1.5">
      <svg class="w-3 h-3 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
      </svg>
      <span class="text-[11px] text-gray-400">Secured by Paystack · Your card details are never stored</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PaymentMetadata {
  approvalToken?: string
  paymentUrl?: string
  productName?: string
  productId?: string | number
  price?: number
  currency?: string
  seller?: string
  imageUrl?: string
}

const props = defineProps<{ metadata: PaymentMetadata }>()
const emit = defineEmits(['approve'])

const paid = ref(false)

function handleApprove() {
  paid.value = true
  emit('approve')
}

function formatPrice(price: number, currency = 'NGN'): string {
  const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : `${currency} `
  return symbol + price.toLocaleString('en-NG')
}
</script>
