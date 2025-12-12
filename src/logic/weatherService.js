import { ref } from 'vue'

const weatherState = ref('clear') // clear, cloudy, rain, snow
const isNight = ref(false)

// WMO Weather interpretation codes (http://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
function mapWmoToState(code) {
  // Clear / Mostly Clear
  if ([0, 1].includes(code)) return 'clear'
  // Cloudy / Overcast / Fog
  if ([2, 3, 45, 48].includes(code)) return 'cloudy'
  // Drizzle / Rain / Showers
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  // Snow / Grains / Hail
  if ([71, 73, 75, 77, 85, 86, 95, 96, 99].includes(code)) return 'snow'

  return 'clear'
}

export function useWeather() {
  async function fetchWeather() {
    try {
      // Lausanne Vennes (approx. 46.54, 6.66) using MeteoSwiss SwissHD (icon_ch)
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=46.54&longitude=6.66&current=weather_code,is_day&timezone=auto&models=icon_ch',
      )
      const data = await response.json()

      if (data.current) {
        weatherState.value = mapWmoToState(data.current.weather_code)
        isNight.value = data.current.is_day === 0
      }
    } catch (e) {
      console.warn('Weather fetch failed, defaulting to clear', e)
      weatherState.value = 'clear'
    }
  }

  // Fetch immediately
  fetchWeather()
  // Refresh every 30 mins
  setInterval(fetchWeather, 30 * 60 * 1000)

  return {
    weatherState,
    isNight,
    fetchWeather,
  }
}
