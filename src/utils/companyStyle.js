// Per-company colour and display order, from the Figma design.
// Blue gradient from light (Meta) to dark (Amazon).

export const COMPANY_COLORS = {
  META: '#39daff',
  TSLA: '#31bfe2',
  NVDA: '#29a5c5',
  MSFT: '#218aa8',
  AAPL: '#196f8c',
  GOOG: '#11546f',
  AMZN: '#093a52',
}

export const COMPANY_ORDER = ['META', 'TSLA', 'NVDA', 'MSFT', 'AAPL', 'GOOG', 'AMZN']

// Same gradient as an ordered palette, for rank-coloured bars.
export const BLUE_SCALE = [
  '#39daff',
  '#31bfe2',
  '#29a5c5',
  '#218aa8',
  '#196f8c',
  '#11546f',
  '#093a52',
]

export function orderCompanies(companies) {
  return COMPANY_ORDER.map((symbol) =>
    companies.find((company) => company.symbol === symbol),
  ).filter(Boolean)
}
