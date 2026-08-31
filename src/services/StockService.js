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

// Eigene axios-Instanz: baseURL wird jeder Anfrage automatisch vorangestellt
const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

export default {
  // sheet = voller Tab-Name inkl. $, z.B. '$AAPL'
  // -> GET .../gfun0y0rgcz38?sheet=$AAPL
  async fetchData(sheet) {
    const response = await apiClient.get('', {
      params: { sheet },
    })
    return response.data
  },

  // Rohdaten ALLER 7 Firmen parallel holen
  fetchAllCompanies() {
    return Promise.all(
      COMPANIES.map(async (company) => ({
        ...company,
        rows: await this.fetchData(`$${company.symbol}`),
      }))
    )
  },
}
