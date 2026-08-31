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

// "26Q2" -> "Q2 2026"   |   "Q1 2024" bleibt   |   "Q4-26" -> "Q4 2026"
export function formatQuarter(label) {
  if (!label) return ''

  const compact = label.match(/^(\d{2})Q(\d)$/) // 26Q2
  if (compact) return `Q${compact[2]} 20${compact[1]}`

  const dashed = label.match(/^Q(\d)-(\d{2})$/) // Q4-26
  if (dashed) return `Q${dashed[1]} 20${dashed[2]}`

  return label
}
