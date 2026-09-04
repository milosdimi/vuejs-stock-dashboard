<template>
  <div class="grouped">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { yoyGrowth, formatQuarter } from '../utils/metrics'

// Reihenfolge der Firmen auf der X-Achse (aus Figma)
const X_ORDER = ['AAPL', 'MSFT', 'AMZN', 'GOOG', 'META', 'TSLA', 'NVDA']

// 4 Blautoene: aeltestes Quartal hell -> aktuelles Quartal dunkel
const QUARTER_SHADES = ['#39daff', '#29a5c5', '#196f8c', '#093a52']

const QUARTER_COUNT = 4

export default {
  name: 'RevenueGrowthChart',
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  computed: {
    orderedCompanies() {
      return X_ORDER.map((symbol) =>
        this.companies.find((company) => company.symbol === symbol),
      ).filter(Boolean)
    },
    // pro Firma: YoY-Wachstum der letzten 4 Quartale (aeltestes zuerst)
    growthByCompany() {
      return this.orderedCompanies.map((company) => ({
        name: company.name,
        points: yoyGrowth(company.quarters, QUARTER_COUNT),
      }))
    },
    // Labels der 4 Quartals-Positionen (von der ersten Firma)
    quarterLabels() {
      const first = this.growthByCompany[0]
      if (!first) return []
      return first.points.map((point) => formatQuarter(point.quarter))
    },
  },
  mounted() {
    this.chart = new Chart(this.$refs.canvas, {
      type: 'bar',
      data: {
        labels: this.growthByCompany.map((company) => company.name),
        // ein Datensatz pro Quartals-Position -> gruppierte Balken
        datasets: this.quarterLabels.map((label, quarterIndex) => ({
          label,
          data: this.growthByCompany.map(
            (company) => company.points[quarterIndex]?.growth ?? null,
          ),
          backgroundColor: QUARTER_SHADES[quarterIndex],
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#ffffff', font: { size: 10, family: 'Rubik' }, boxWidth: 32, boxHeight: 12 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y == null ? '-' : ctx.parsed.y.toFixed(1)}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#ffffff', font: { size: 9, family: 'Rubik' } },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(158, 158, 158, 0.35)' },
            border: { display: false },
            ticks: { color: '#ffffff', font: { size: 8, family: 'Rubik' } },
          },
        },
      },
    })
  },
  beforeUnmount() {
    if (this.chart) this.chart.destroy()
  },
}
</script>

<style scoped>
.grouped {
  width: 100%;
  height: 280px;
}
</style>
