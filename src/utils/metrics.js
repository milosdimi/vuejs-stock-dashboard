// Metric helpers. Raw values are in millions USD; display is in billions.

export function toBillions(millions) {
  if (millions == null) return null
  return millions / 1000
}

// Latest quarter plus change vs. the previous quarter (absolute + percent).
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

// The last `count` completed calendar quarters, e.g. ["Q3 2023", ..., "Q2 2026"].
export function lastCalendarQuarters(count) {
  const now = new Date()
  let year = now.getFullYear()
  let quarter = Math.floor(now.getMonth() / 3) // last completed quarter (1..4)
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

// Trailing twelve months: sum of the last 4 quarters of a metric.
export function ttm(quarters, key = 'revenue') {
  if (!quarters || quarters.length < 4) return null
  return quarters.slice(-4).reduce((sum, point) => sum + (point[key] || 0), 0)
}

// Year-over-year growth for the last `count` quarters, each vs. 4 quarters back.
// Returns [{ quarter, growth }, ...], oldest first.
export function yoyGrowth(quarters, count = 4) {
  const result = []
  for (let i = quarters.length - count; i < quarters.length; i++) {
    const now = quarters[i]
    const yearAgo = quarters[i - 4]
    if (!now || !yearAgo || !yearAgo.revenue) continue
    result.push({
      quarter: now.quarter,
      growth: ((now.revenue - yearAgo.revenue) / yearAgo.revenue) * 100,
    })
  }
  return result
}

// "26Q2" -> "Q2 2026" | "Q4-26" -> "Q4 2026" | "Q1 2024" -> unchanged
export function formatQuarter(label) {
  if (!label) return ''

  const compact = label.match(/^(\d{2})Q(\d)$/)
  if (compact) return `Q${compact[2]} 20${compact[1]}`

  const dashed = label.match(/^Q(\d)-(\d{2})$/)
  if (dashed) return `Q${dashed[1]} 20${dashed[2]}`

  return label
}

// Fiscal-to-calendar shift in quarters: Apple FY ends Sept (-1),
// Microsoft FY ends June (-2), Nvidia FY ends Jan with the year label one ahead (-4).
const FISCAL_OFFSET = { AAPL: -1, MSFT: -2, NVDA: -4 }

function parseQuarterLabel(label) {
  let m
  if ((m = label.match(/^(\d{2})Q(\d+)$/))) return { year: 2000 + Number(m[1]), q: Number(m[2]) }
  if ((m = label.match(/^Q(\d)-(\d{2})$/))) return { year: 2000 + Number(m[2]), q: Number(m[1]) }
  if ((m = label.match(/^Q(\d)\s+(\d{4})$/))) return { year: Number(m[2]), q: Number(m[1]) }
  return null
}

// Company quarter label -> real calendar quarter, e.g. ('NVDA', '27Q1') -> 'Q1 2026'.
// Works through a running quarter index, which also normalises broken labels
// such as Tesla's '25Q6' -> 'Q2 2026'.
export function toCalendarQuarter(symbol, label) {
  const parsed = parseQuarterLabel(label)
  if (!parsed) return label

  const offset = FISCAL_OFFSET[symbol] || 0
  const index = parsed.year * 4 + parsed.q + offset

  const year = Math.floor((index - 1) / 4)
  const quarter = ((index - 1) % 4) + 1
  return `Q${quarter} ${year}`
}
