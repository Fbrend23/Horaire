<script setup>
import { ref } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { formatNumber } from '@/utils/format'
import { STOCKS } from '../../logic/marketLogic'

defineProps(['isOpen'])
const emit = defineEmits(['close'])
const gameStore = useGameStore()

const activeTab = ref('buy') // 'buy' or 'sell'

const tradeAmount = ref(1)

function setTradeAmount(amount) {
    tradeAmount.value = amount
}

function getPriceColor(stockId) {
    // Determine if price went up or down compared to last tick?
    // We can use history for this.
    const history = gameStore.marketHistory[stockId]
    if (!history || history.length < 2) return 'text-white'

    const current = history[history.length - 1]
    const prev = history[history.length - 2]

    return current >= prev ? 'text-green-400' : 'text-red-400'
}

function getTrendIcon(stockId) {
    const history = gameStore.marketHistory[stockId]
    if (!history || history.length < 2) return '➖'

    const current = history[history.length - 1]
    const prev = history[history.length - 2]

    return current >= prev ? '▲' : '▼'
}

function executeTrade(stock) {
    if (activeTab.value === 'buy') {
        gameStore.buyStock(stock.id, tradeAmount.value)
    } else {
        gameStore.sellStock(stock.id, tradeAmount.value)
    }
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-black/80 flex justify-center items-center z-[1100]"
        @click.self="emit('close')">
        <div
            class="relative bg-slate-800 rounded-xl w-[95%] max-w-2xl text-white shadow-2xl border border-slate-600 flex flex-col p-6 animate-fade-in overflow-hidden">

            <!-- Header -->
            <div class="flex justify-between items-center mb-6 pr-8">
                <div>
                    <h2 class="text-3xl font-extrabold text-amber-400 uppercase tracking-wide">La Bourse</h2>
                    <p class="text-xs text-gray-400">Investissez dans l'avenir de la bière</p>
                </div>
                <!-- Wallet -->
                <div class="text-right">
                    <p class="text-gray-400 text-xs uppercase">Solde Disponible</p>
                    <p class="text-xl font-mono text-amber-400 font-bold">{{ formatNumber(gameStore.beerScore) }} 🍺</p>
                </div>
            </div>

            <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white transition-colors"
                @click="emit('close')">
                &times;
            </button>

            <!-- Controls -->
            <div class="flex gap-4 mb-4">
                <div class="bg-slate-900 p-1 rounded-lg flex gap-1">
                    <button @click="activeTab = 'buy'" class="px-4 py-1 rounded text-sm font-bold transition-colors"
                        :class="activeTab === 'buy' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'">
                        ACHETER
                    </button>
                    <button @click="activeTab = 'sell'" class="px-4 py-1 rounded text-sm font-bold transition-colors"
                        :class="activeTab === 'sell' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'">
                        VENDRE
                    </button>
                </div>

                <div class="bg-slate-900 p-1 rounded-lg flex gap-1 ml-auto">
                    <button v-for="amt in [1, 10, 100, 1000]" :key="amt" @click="setTradeAmount(amt)"
                        class="px-3 py-1 rounded text-xs font-bold transition-colors"
                        :class="tradeAmount === amt ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-700'">
                        x{{ amt }}
                    </button>
                </div>
            </div>

            <!-- Stock List -->
            <div class="grid grid-cols-1 gap-3 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
                <div v-for="stock in STOCKS" :key="stock.id"
                    class="bg-slate-700 p-4 rounded-lg flex items-center justify-between border-l-4 hover:bg-slate-650 transition-colors"
                    :class="getPriceColor(stock.id) === 'text-green-400' ? 'border-green-500' : 'border-red-500'">

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-lg text-white">{{ stock.name }}</span>
                            <span class="text-xs bg-slate-900 px-1 rounded text-gray-400">{{ stock.symbol }}</span>
                        </div>
                        <p class="text-xs text-gray-400 mt-1">{{ stock.desc }}</p>
                    </div>

                    <!-- Price & Graph Trend (text for now) -->
                    <div class="text-right px-4">
                        <p class="text-2xl font-mono font-bold" :class="getPriceColor(stock.id)">
                            {{ formatNumber(gameStore.marketPrices[stock.id]) }}
                            <span class="text-sm ml-1">{{ getTrendIcon(stock.id) }}</span>
                        </p>
                        <p class="text-xs text-gray-400">Volatilité: {{ (stock.volatility * 100).toFixed(0) }}%</p>
                    </div>

                    <!-- Holdings -->
                    <div class="text-right px-4 border-r border-slate-600 min-w-[100px]">
                        <p class="text-xs text-gray-400 uppercase">Portefeuille</p>
                        <p class="text-lg font-bold text-white">{{ formatNumber(gameStore.marketShares[stock.id] || 0)
                        }}</p>
                    </div>

                    <!-- Action Button -->
                    <div class="pl-4">
                        <button @click="executeTrade(stock)"
                            class="w-[100px] py-2 rounded font-bold text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            :class="activeTab === 'buy' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'"
                            :disabled="(activeTab === 'buy' && gameStore.beerScore < (gameStore.marketPrices[stock.id] * tradeAmount)) || (activeTab === 'sell' && (gameStore.marketShares[stock.id] || 0) < tradeAmount)">
                            {{ activeTab === 'buy' ? 'ACHETER' : 'VENDRE' }}
                        </button>
                        <p class="text-[10px] text-center mt-1 text-gray-400">
                            {{ formatNumber(gameStore.marketPrices[stock.id] * tradeAmount) }} 🍺
                        </p>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}
</style>
