export const STOCKS = [
  {
    id: 'yeast_coin',
    name: 'YeastCoin',
    symbol: 'YST',
    basePrice: 100,
    volatility: 0.15, // High volatility
    desc: 'Crypto-levure très instable.',
  },
  {
    id: 'hops_futures',
    name: 'Hops Futures',
    symbol: 'HOP',
    basePrice: 500,
    volatility: 0.08, // Medium volatility
    desc: 'Cours du houblon standard.',
  },
  {
    id: 'barley_bonds',
    name: 'Barley Bonds',
    symbol: 'BRL',
    basePrice: 1500,
    volatility: 0.03, // Low volatility
    desc: 'Obligations orge, valeur refuge.',
  },
]

// Simple random walk with mean reversion
export function getNextPrice(currentPrice, basePrice, volatility) {
  // Random move: -1 to 1 scaled by volatility
  const move = (Math.random() - 0.5) * 2 * volatility

  // Mean reversion factor (pulls price back to base if it strays too far)
  // Stronger pull if price is very far from base
  const deviation = (basePrice - currentPrice) / basePrice
  const reversion = deviation * 0.05

  const percentChange = move + reversion

  let newPrice = currentPrice * (1 + percentChange)

  // Hard limits to prevent 0 or infinity
  if (newPrice < 1) newPrice = 1

  return newPrice
}
