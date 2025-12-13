import { ref } from 'vue'

const weatherState = ref('clear') // clear, cloudy, rain, snow
const isNight = ref(false)
const weatherIntensity = ref(0.5) // 0 to 1, default medium
const windSpeed = ref(0) // km/h

// WMO Weather interpretation codes (http://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
function mapWmoToState(code) {
  // Clear / Mostly Clear
  if ([0, 1].includes(code)) return 'clear'
  // Fog
  if ([45, 48].includes(code)) return 'fog'
  // Cloudy / Overcast
  if ([2, 3].includes(code)) return 'cloudy'
  // Drizzle / Rain / Showers
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  // Snow / Grains / Hail
  if ([71, 73, 75, 77, 85, 86, 95, 96, 99].includes(code)) return 'snow'

  return 'clear'
}

const CACHE_KEY = 'weather_cache'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

export function useWeather() {
  async function fetchWeather() {
    const now = Date.now()
    const cached = localStorage.getItem(CACHE_KEY)
    let data = null

    // 1. Try Cache
    if (cached) {
      try {
        const { timestamp, data: cachedData } = JSON.parse(cached)
        if (now - timestamp < CACHE_DURATION) {
          data = cachedData
        }
      } catch {
        // Invalid cache
        localStorage.removeItem(CACHE_KEY)
      }
    }

    // 2. Fetch if no valid cache
    if (!data) {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=46.54&longitude=6.66&current=weather_code,is_day,precipitation,wind_speed_10m&timezone=auto',
        )
        data = await response.json()

        // Save to cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(), // update timestamp
            data,
          }),
        )
      } catch (e) {
        weatherState.value = 'clear'
        return
      }
    }

    // 3. Apply Data
    if (data && data.current) {
      weatherState.value = mapWmoToState(data.current.weather_code)
      isNight.value = data.current.is_day === 0

      // Calculate intensity based on precipitation (mm)
      const precip = data.current.precipitation || 0
      weatherIntensity.value = Math.min(1, Math.max(0.1, precip / 2))

      windSpeed.value = data.current.wind_speed_10m || 0
    }
  }

  // Fetch immediately
  fetchWeather()

  // Refresh every 30 mins (API update rate)
  // We can keep this longer than cache duration, or match it.
  // 30 mins is fine.
  setInterval(fetchWeather, 30 * 60 * 1000)

  return {
    weatherState,
    isNight,
    weatherIntensity,
    windSpeed,
    fetchWeather,
  }
}
