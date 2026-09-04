// Kleine Rechen-Helfer fuer die Kennzahlen.
// Die Rohdaten stehen in Millionen $ - fuer die Anzeige rechnen wir in Milliarden.

export function toBillions(millions) {
  if (millions == null) return null
  return millions / 1000
}

// Nimmt die quarters-Liste einer Firma und liefert das aktuelle Quartal
// plus die Veraenderung zum Vorquartal (absolut + relativ in %).
export function currentRevenue(quarters) {
  if (!quarters || quarters.length < 2) return null

  const current = quarters[quarters.length - 1]
  const previous = quarters[quarters.length - 2]

  const absoluteChange = current.revenue - previous.revenue
  const relativeChange = (absoluteChange / previous.revenue) * 100

  return {
    quarter: current.quarter,
    revenue: current.revenue,
    absoluteChange,
    relativeChange,
  }
}

// Liste der letzten `count` abgeschlossenen Kalenderquartale, z.B. ["Q3 2023", ..., "Q2 2026"].
// Gemeinsame X-Achse fuer den Line Chart - die Firmen werden per Position darauf gelegt.
export function lastCalendarQuarters(count) {
  const now = new Date()
  let year = now.getFullYear()
  let quarter = Math.floor(now.getMonth() / 3) + 1 // 1..4, aktuelles Quartal
  quarter -= 1 // letztes abgeschlossenes
  if (quarter === 0) {
    quarter = 4
    year -= 1
  }

  const labels = []
  for (let i = 0; i < count; i++) {
    labels.unshift(`Q${quarter} ${year}`)
    quarter -= 1
    if (quarter === 0) {
      quarter = 4
      year -= 1
    }
  }
  return labels
}

// Trailing Twelve Months: Summe der letzten 4 Quartale einer Kennzahl.
export function ttm(quarters, key = 'revenue') {
  if (!quarters || quarters.length < 4) return null
  return quarters.slice(-4).reduce((sum, point) => sum + (point[key] || 0), 0)
}

// "26Q2" -> "Q2 2026"   |   "Q1 2024" bleibt   |   "Q4-26" -> "Q4 2026"
export function formatQuarter(label) {
  if (!label) return ''

  const compact = label.match(/^(\d{2})Q(\d)$/) // 26Q2
  if (compact) return `Q${compact[2]} 20${compact[1]}`

  const dashed = label.match(/^Q(\d)-(\d{2})$/) // Q4-26
  if (dashed) return `Q${dashed[1]} 20${dashed[2]}`

  return label
}
