// Station IDs:
// Lausanne: 8501120 (Main station usually, but 'Lausanne' works as query)
// Lausanne, Vennes: 8501210

const API_BASE = 'https://transport.opendata.ch/v1/stationboard'

const CACHE_KEY = 'transport_cache'
const CACHE_DURATION = 60 * 1000 // 60 seconds

export async function fetchM2Connections() {
  const now = Date.now()
  const cached = localStorage.getItem(CACHE_KEY)

  if (cached) {
    const { timestamp, data } = JSON.parse(cached)
    if (now - timestamp < CACHE_DURATION) {
      return data
    }
  }

  try {
    // 1. Gare -> Vennes (Direction Croisettes)
    // Filter for 'm2' line and direction 'Croisettes'
    const urlGare = `${API_BASE}?station=Lausanne, Gare&limit=20`
    const resGare = await fetch(urlGare)
    const dataGare = await resGare.json()

    const toVennesRaw = dataGare.stationboard.filter(
      (e) => e.number === 'm2' && e.to.includes('Croisettes'),
    )

    // 2. Vennes -> Gare (Direction Ouchy)
    const urlVennes = `${API_BASE}?station=Lausanne, Vennes&limit=20`
    const resVennes = await fetch(urlVennes)
    const dataVennes = await resVennes.json()

    const toGareRaw = dataVennes.stationboard.filter(
      (e) => e.number === 'm2' && e.to.includes('Ouchy'),
    )

    const result = {
      toVennes: mapStationboard(toVennesRaw),
      toGare: mapStationboard(toGareRaw),
    }

    // Save to cache
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: now,
        data: result,
      }),
    )

    return result
  } catch {
    return null
  }
}

function mapStationboard(entries) {
  if (!entries) return []
  return entries.map((e) => {
    return {
      departure: new Date(e.stop.departure),
      // stationboard doesn't give arrival at destination, but Widget doesn't use it.
      arrival: null,
    }
  })
}
