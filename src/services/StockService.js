import axios from 'axios'

// Basis-URL des SheetDB-Endpoints (das ganze Google Sheet)
const API_BASE_URL = 'https://sheetdb.io/api/v1/gfun0y0rgcz38'

// Die "Magnificent Seven".
// symbol = Ticker, im Sheet heissen die Tabs $AAPL, $AMZN, ...
export const COMPANIES = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'GOOG', name: 'Alphabet' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'NVDA', name: 'Nvidia' },
  { symbol: 'TSLA', name: 'Tesla' },
]

// In welcher ZEILE des jeweiligen Firmen-Tabs steht welche Kennzahl?
// Jedes Tab ist anders aufgebaut -> pro Firma eigene Zeilen.
// Die Zahl ist der Index im rows-Array (0-basiert). Sheet-Zeile = Index + 2,
// weil SheetDB Zeile 1 als Spalten-Header nimmt.
// Verifiziert gegen echte Quartalszahlen, Stand August 2026.
export const METRIC_ROWS = {
  AAPL: { revenue: 7, netIncome: 34, grossMargin: 21 },
  AMZN: { revenue: 7, netIncome: 39, grossMargin: 13 },
  GOOG: { revenue: 3, netIncome: 47, grossMargin: 31 },
  META: { revenue: 3, netIncome: 25, grossMargin: 9 },
  MSFT: { revenue: 7, netIncome: 30, grossMargin: 14 },
  NVDA: { revenue: 3, netIncome: 28, grossMargin: 10 },
  TSLA: { revenue: 13, netIncome: 47, grossMargin: 27 },
}

// Wie viele der letzten Quartals-Spalten wir behalten.
// Aeltere Spalten im Sheet haben teils unsaubere oder fehlende Labels.
const QUARTERS_TO_KEEP = 12

// Eigene axios-Instanz: baseURL wird jeder Anfrage automatisch vorangestellt
const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Wandelt einen rohen Sheet-Wert in eine Zahl um.
// "1,234" -> 1234   "(538)" -> -538   "39.8%" -> 39.8   "" / "#DIV/0!" -> null
export function parseNumber(raw) {
  if (raw == null) return null

  let text = String(raw).trim()
  if (text === '' || text.startsWith('#')) return null

  // Klammern = negative Zahl (Buchhalter-Schreibweise)
  const isNegative = text.startsWith('(') && text.endsWith(')')
  if (isNegative) text = text.slice(1, -1)

  // $, %, Leerzeichen und Tausender-Kommas entfernen
  text = text.replace(/[$%\s,]/g, '')

  const number = Number(text)
  if (Number.isNaN(number)) return null

  return isNegative ? -number : number
}

// Rohe SheetDB-Zeilen einer Firma -> saubere, chronologisch sortierte Quartals-Punkte.
// Ergebnis: [{ quarter: '26Q2', revenue: 111184, netIncome: 29578, grossMargin: 49.3 }, ...]
function toQuarterlyPoints(symbol, rows) {
  const columnKeys = Object.keys(rows[0]) // Spalten stehen im Sheet schon chronologisch
  const quarterLabelRow = rows[1] // Sheet-Zeile 3 = Quartals-Bezeichnungen (21Q1, 21Q2, ...)
  const metricRows = METRIC_ROWS[symbol]

  return columnKeys
    .slice(-QUARTERS_TO_KEEP) // nur die letzten N Quartale
    .map((key) => ({
      quarter: (quarterLabelRow[key] || '').trim(),
      revenue: parseNumber(rows[metricRows.revenue][key]),
      netIncome: parseNumber(rows[metricRows.netIncome][key]),
      grossMargin: parseNumber(rows[metricRows.grossMargin][key]),
    }))
    .filter((point) => point.quarter !== '' && point.revenue !== null)
}

export default {
  // sheet = voller Tab-Name inkl. $, z.B. '$AAPL'
  // -> GET .../gfun0y0rgcz38?sheet=$AAPL, liefert die rohen Zeilen
  async fetchData(sheet) {
    const response = await apiClient.get('', {
      params: { sheet },
    })
    return response.data
  },

  // Eine Firma: holen + parsen + sortieren
  async getCompanyHistory(symbol) {
    const rows = await this.fetchData(`$${symbol}`)
    const company = COMPANIES.find((item) => item.symbol === symbol)

    return {
      ...company,
      quarters: toQuarterlyPoints(symbol, rows),
    }
  },

  // Alle 7 Firmen parallel
  getAllCompanyHistories() {
    return Promise.all(COMPANIES.map((company) => this.getCompanyHistory(company.symbol)))
  },
}
