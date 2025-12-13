export function formatNumber(num) {
  if (!num && num !== 0) return '0'

  // Ensure it's a number
  const value = Number(num)
  if (isNaN(value)) return '0'

  // Define thresholds for suffixes
  const suffixes = [
    { val: 1e33, symbol: ' Dc' }, // Decillion
    { val: 1e30, symbol: ' No' }, // Nonillion
    { val: 1e27, symbol: ' Oc' }, // Octillion
    { val: 1e24, symbol: ' Sp' }, // Septillion
    { val: 1e21, symbol: ' Sx' }, // Sextillion
    { val: 1e18, symbol: ' Qi' }, // Quintillion
    { val: 1e15, symbol: ' Qa' }, // Quadrillion
    { val: 1e12, symbol: ' T' }, // Trillion
    { val: 1e9, symbol: ' B' }, // Billion
    { val: 1e6, symbol: ' M' }, // Million
  ]

  // Check for large numbers first
  for (const { val, symbol } of suffixes) {
    if (Math.abs(value) >= val) {
      return (value / val).toFixed(2) + symbol
    }
  }

  // For numbers less than 1 million, use the requested ' separator
  // We can use Intl.NumberFormat roughly, or just replace functionality
  // Swiss style: 1'234.56
  return value
    .toLocaleString('fr-CH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })
    .replace(/’/g, "'") // Ensure it uses ' if locale gives right quote
}
