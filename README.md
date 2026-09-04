# 📊 Magnificent Seven Dashboard

A Vue 3 dashboard visualizing quarterly financials — revenue, net income, gross margin, and growth — for the **Magnificent Seven**: Apple, Microsoft, Amazon, Alphabet, Meta, Nvidia, and Tesla.

![Vue](https://img.shields.io/badge/Vue-3.2-42b883?logo=vue.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4-ff6384?logo=chart.js&logoColor=white)
![Vue CLI](https://img.shields.io/badge/Vue%20CLI-5-35495e?logo=vuedotjs&logoColor=white)

---

## ✨ Features

- 🏢 **Company overview** — quarterly revenue per company with QoQ change, drag-to-scroll row
- 📈 **Revenue trend** — 3-year line chart, one hover shows every company's value for that quarter
- 🍩 **Revenue breakdown** — TTM revenue by company as a donut chart
- 💰 **Net income (TTM)** — ranked bar chart
- 📐 **Gross margin** — latest quarter, ranked bar chart with the reporting quarter on hover
- 📊 **Revenue growth (YoY)** — last 4 quarters per company, grouped bars
- 🔄 **Live data with caching** — fetches once per hour, manual refresh button, graceful error state
- 📱 **Responsive** — cards reflow down to mobile, no fixed layout breakage

## 🛠️ Tech stack

| | |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) (Options API), [Vue CLI](https://cli.vuejs.org/) |
| Charts | [Chart.js 4](https://www.chartjs.org/) + [chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.app/) |
| HTTP | [axios](https://axios-http.com/) |
| Data source | Google Sheet via [SheetDB](https://sheetdb.io/) |
| Fonts | [Rubik](https://fonts.google.com/specimen/Rubik), [Material Symbols](https://fonts.google.com/icons) |

No router, no state library — a single view fed by data loaded once at startup.

## 📂 Project structure

```
src/
├─ assets/
│  ├─ main.css          # design tokens, global styles
│  └─ logos/             # company logos (SVG/PNG)
├─ components/
│  ├─ BaseCard.vue              # generic card shell
│  ├─ BaseChart.vue             # Chart.js wrapper (lifecycle, resize, zoom fix)
│  ├─ CompanyOverview.vue       # scrollable company row
│  ├─ CompanyRevenueCard.vue    # single company card
│  ├─ CompanyLogo.vue
│  ├─ RevenueTrendChart.vue     # line chart
│  ├─ RevenueBreakdownChart.vue # donut chart
│  ├─ NetIncomeChart.vue        # bar chart
│  ├─ GrossMarginChart.vue      # bar chart
│  ├─ RevenueGrowthChart.vue    # grouped bar chart
│  └─ AppFooter.vue
├─ services/
│  └─ StockService.js    # SheetDB fetch + parsing + localStorage cache
├─ utils/
│  ├─ metrics.js         # TTM, YoY growth, quarter formatting/alignment
│  └─ companyStyle.js    # per-company colors and order
└─ App.vue
```

## 🔢 Data pipeline

1. **[StockService.js](src/services/StockService.js)** fetches one raw sheet tab per company from SheetDB, parses the messy string values (`"1,234"`, `"(538)"`, `"39.8%"`) into numbers, and keeps the last 12 quarters.
2. **[metrics.js](src/utils/metrics.js)** turns those into what the widgets need: TTM sums, YoY growth, and a shared calendar-quarter axis — companies with a different fiscal year (Apple, Microsoft, Nvidia) are shifted onto real calendar quarters.
3. Results are cached in `localStorage` for an hour to stay within SheetDB's free-tier request limit; the header's refresh button bypasses the cache.

## 🚀 Getting started

```bash
npm install
npm run serve    # dev server with hot-reload
npm run build    # production build -> dist/
npm run lint     # eslint
```

## 🌐 Deploying

`npm run build` produces a static `dist/` folder — upload its **contents** (not the folder itself) to any static host (Netlify, Vercel, GitHub Pages, or plain shared hosting via cPanel/FTP). No server-side code required; the app calls the SheetDB API directly from the browser.

If deploying to a subpath instead of a domain root, set `publicPath` in `vue.config.js` accordingly.

## ⚠️ Known limitations

- Fiscal-quarter alignment (Apple/Microsoft/Nvidia) is an approximation based on each company's known fiscal year end.
- SheetDB's free tier caps monthly requests; the 1-hour cache keeps normal usage well under it.

## 🎓 Context

Built as a self-implementation project for the Developer Akademie Vue.js course, following a Figma design and a written requirements checklist.
