<template>
  <BaseChart
    type="bar"
    :chart-data="chartData"
    :chart-options="chartOptions"
    :height="280"
    aria-label="Revenue growth YoY of the last 4 quarters per company as a bar chart"
  />
</template>

<script>
import BaseChart from './BaseChart.vue'
import { yoyGrowth, toCalendarQuarter } from '../utils/metrics'

// Company order on the X-axis (from Figma)
const X_ORDER = ['AAPL', 'MSFT', 'AMZN', 'GOOG', 'META', 'TSLA', 'NVDA']

// 4 shades: oldest quarter light -> current quarter dark
const QUARTER_SHADES = ['#39daff', '#29a5c5', '#196f8c', '#093a52']

const QUARTER_COUNT = 4

export default {
  name: 'RevenueGrowthChart',
  components: { BaseChart },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  computed: {
    orderedCompanies() {
      return X_ORDER.map((symbol) =>
        this.companies.find((company) => company.symbol === symbol),
      ).filter(Boolean)
    },
    growthByCompany() {
      return this.orderedCompanies.map((company) => ({
        name: company.name,
        points: yoyGrowth(company.quarters, QUARTER_COUNT),
      }))
    },
    quarterLabels() {
      const first = this.orderedCompanies[0]
      if (!first) return []
      return this.growthByCompany[0].points.map((point) =>
        toCalendarQuarter(first.symbol, point.quarter),
      )
    },
    chartData() {
      return {
        labels: this.growthByCompany.map((company) => company.name),
        // one dataset per quarter position -> grouped bars
        datasets: this.quarterLabels.map((label, quarterIndex) => ({
          label,
          data: this.growthByCompany.map(
            (company) => company.points[quarterIndex]?.growth ?? null,
          ),
          backgroundColor: QUARTER_SHADES[quarterIndex],
          borderColor: '#ffffff',
          borderWidth: 1,
          borderSkipped: false,
        })),
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#ffffff',
              font: { size: 10, family: 'Rubik' },
              boxWidth: 32,
              boxHeight: 12,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${ctx.parsed.y == null ? '-' : ctx.parsed.y.toFixed(1)}%`,
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
      }
    },
  },
}
</script>
