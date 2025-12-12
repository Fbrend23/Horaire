// Station IDs:
// Lausanne: 8501120 (Main station usually, but 'Lausanne' works as query)
// Lausanne, Vennes: 8501210

const API_BASE = 'https://transport.opendata.ch/v1/connections'

export async function fetchM2Connections() {
  try {
    // 1. Gare -> Vennes
    const urlToVennes = `${API_BASE}?from=Lausanne&to=Lausanne, Vennes&limit=3&fields[]=connections/from/departure&fields[]=connections/to/arrival`
    const resToVennes = await fetch(urlToVennes)
    const dataToVennes = await resToVennes.json()

    // 2. Vennes -> Gare
    const urlToGare = `${API_BASE}?from=Lausanne, Vennes&to=Lausanne&limit=3&fields[]=connections/from/departure&fields[]=connections/to/arrival`
    const resToGare = await fetch(urlToGare)
    const dataToGare = await resToGare.json()

    return {
      toVennes: mapConnections(dataToVennes.connections),
      toGare: mapConnections(dataToGare.connections),
    }
  } catch (e) {
    console.error('Transport fetch failed', e)
    return null
  }
}

function mapConnections(connections) {
  if (!connections) return []
  return connections.map((conn) => {
    return {
      departure: new Date(conn.from.departure),
      arrival: new Date(conn.to.arrival),
    }
  })
}
