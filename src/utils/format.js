export function formatNumber(num) {
  if (!num && num !== 0) return '0'

  // Ensure it's a number
  const value = Number(num)
  if (isNaN(value)) return '0'

  // Define thresholds for suffixes
  // User requested suffixes "after 9 numbers" (starting at 1 Billion)
  // Check for large numbers first
  // Check for large numbers first
  // "always 6 numbers then suffix but full letters" -> Threshold 1e6 (Million)

  if (Math.abs(value) >= 1e66) {
    return value.toExponential(2).replace('+', '')
  }

  const suffixes = [
    { val: 1e63, symbol: ' Vigintillion' },
    { val: 1e60, symbol: ' Novemdecillion' },
    { val: 1e57, symbol: ' Octodecillion' },
    { val: 1e54, symbol: ' Septendecillion' },
    { val: 1e51, symbol: ' Sexdecillion' },
    { val: 1e48, symbol: ' Quindecillion' },
    { val: 1e45, symbol: ' Quattuordecillion' },
    { val: 1e42, symbol: ' Tredecillion' },
    { val: 1e39, symbol: ' Duodecillion' },
    { val: 1e36, symbol: ' Undecillion' },
    { val: 1e33, symbol: ' Decillion' },
    { val: 1e30, symbol: ' Nonillion' },
    { val: 1e27, symbol: ' Octillion' },
    { val: 1e24, symbol: ' Septillion' },
    { val: 1e21, symbol: ' Sextillion' },
    { val: 1e18, symbol: ' Quintillion' },
    { val: 1e15, symbol: ' Quadrillion' },
    { val: 1e12, symbol: ' Trillion' },
    { val: 1e9, symbol: ' Billion' },
    { val: 1e6, symbol: ' Million' },
  ]

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
      maximumFractionDigits: 0,
    })
    .replace(/’/g, "'") // Ensure it uses ' if locale gives right quote
}
