// Feste Farbe und Anzeige-Reihenfolge je Firma - aus dem Figma-Design.
// Blau-Verlauf von hell (Meta) nach dunkel (Amazon).

export const COMPANY_COLORS = {
  META: '#39daff',
  TSLA: '#31bfe2',
  NVDA: '#29a5c5',
  MSFT: '#218aa8',
  AAPL: '#196f8c',
  GOOG: '#11546f',
  AMZN: '#093a52',
}

// Reihenfolge in Charts und Legenden
export const COMPANY_ORDER = ['META', 'TSLA', 'NVDA', 'MSFT', 'AAPL', 'GOOG', 'AMZN']

// Bringt die geladenen Firmen in die Figma-Reihenfolge
export function orderCompanies(companies) {
  return COMPANY_ORDER.map((symbol) =>
    companies.find((company) => company.symbol === symbol),
  ).filter(Boolean)
}
