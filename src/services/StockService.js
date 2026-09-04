import axios from 'axios'

const API_BASE_URL = 'https://sheetdb.io/api/v1/gfun0y0rgcz38'

// The "Magnificent Seven". Each company is a sheet tab named $AAPL, $AMZN, ...
export const COMPANIES = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'GOOG', name: 'Alphabet' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'NVDA', name: 'Nvidia' },
  { symbol: 'TSLA', name: 'Tesla' },
]

// Which row holds which metric per company tab. Values are 0-based indexes into
// the rows array (sheet row = index + 2, SheetDB uses row 1 as the header).
// Verified against real quarterly figures (Aug 2026).
export const METRIC_ROWS = {
  AAPL: { revenue: 7, netIncome: 34, grossMargin: 21 },
  AMZN: { revenue: 7, netIncome: 39, grossMargin: 13 },
  GOOG: { revenue: 3, netIncome: 47, grossMargin: 31 },
  META: { revenue: 3, netIncome: 25, grossMargin: 9 },
  MSFT: { revenue: 7, netIncome: 30, grossMargin: 14 },
  NVDA: { revenue: 3, netIncome: 28, grossMargin: 10 },
  TSLA: { revenue: 13, netIncome: 47, grossMargin: 27 },
}

// Older sheet columns have missing or malformed labels, so keep only the latest ones.
const QUARTERS_TO_KEEP = 12

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Parses a raw sheet value into a number.
// "1,234" -> 1234 | "(538)" -> -538 | "39.8%" -> 39.8 | "" / "#DIV/0!" -> null
export function parseNumber(raw) {
  if (raw == null) return null

  let text = String(raw).trim()
  if (text === '' || text.startsWith('#')) return null

  const isNegative = text.startsWith('(') && text.endsWith(')')
  if (isNegative) text = text.slice(1, -1)

  text = text.replace(/[$%\s,]/g, '')

  const number = Number(text)
  if (Number.isNaN(number)) return null

  return isNegative ? -number : number
}

// Raw SheetDB rows for one company -> sorted quarterly points:
// [{ quarter, revenue, netIncome, grossMargin }, ...]
function toQuarterlyPoints(symbol, rows) {
  const columnKeys = Object.keys(rows[0]) // already in chronological order
  const quarterLabelRow = rows[1]
  const metricRows = METRIC_ROWS[symbol]

  return columnKeys
    .slice(-QUARTERS_TO_KEEP)
    .map((key) => ({
      quarter: (quarterLabelRow[key] || '').trim(),
      revenue: parseNumber(rows[metricRows.revenue][key]),
      netIncome: parseNumber(rows[metricRows.netIncome][key]),
      grossMargin: parseNumber(rows[metricRows.grossMargin][key]),
    }))
    .filter((point) => point.quarter !== '' && point.revenue !== null)
}

export default {
  // sheet = full tab name incl. $, e.g. '$AAPL'
  async fetchData(sheet) {
    const response = await apiClient.get('', {
      params: { sheet },
    })
    return response.data
  },

  async getCompanyHistory(symbol) {
    const rows = await this.fetchData(`$${symbol}`)
    const company = COMPANIES.find((item) => item.symbol === symbol)

    return {
      ...company,
      quarters: toQuarterlyPoints(symbol, rows),
    }
  },

  // All 7 companies, from cache when fresh (otherwise 7 requests).
  async getAllCompanyHistories({ force = false } = {}) {
    if (!force) {
      const cached = readCache()
      if (cached) return cached
    }

    const result = await Promise.all(
      COMPANIES.map((company) => this.getCompanyHistory(company.symbol)),
    )
    writeCache(result)
    return result
  },
}

// ---- Cache (localStorage) -----------------------------------------------------
// SheetDB free tier is ~500 requests/month, 7 per load, so cache for one hour.

const CACHE_KEY = 'magnificent-seven'
const CACHE_TTL_MS = 60 * 60 * 1000

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { timestamp, data } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL_MS) return null
    return data
  } catch (error) {
    console.warn('Could not read cache', error)
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }))
  } catch (error) {
    console.warn('Could not write cache', error)
  }
}

// When the data was last fetched fresh (Date or null).
export function getLastUpdated() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return new Date(JSON.parse(raw).timestamp)
  } catch (error) {
    return null
  }
}
