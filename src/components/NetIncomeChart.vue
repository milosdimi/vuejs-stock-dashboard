<template>
  <BaseChart
    type="bar"
    :chart-data="chartData"
    :chart-options="chartOptions"
    :chart-plugins="plugins"
    :height="280"
    aria-label="Net Income TTM per company as a bar chart"
  />
</template>

<script>
import BaseChart from './BaseChart.vue'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { BLUE_SCALE } from '../utils/companyStyle'
import { ttm, toBillions } from '../utils/metrics'

export default {
  name: 'NetIncomeChart',
  components: { BaseChart },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      plugins: [ChartDataLabels],
    }
  },
  computed: {
    rows() {
      return this.companies
        .map((company) => ({
          name: company.name,
          value: toBillions(ttm(company.quarters, 'netIncome')),
        }))
        .sort((a, b) => b.value - a.value)
    },
    chartData() {
      return {
        labels: this.rows.map((row) => row.name),
        datasets: [
          {
            data: this.rows.map((row) => row.value),
            backgroundColor: this.rows.map((row, index) => BLUE_SCALE[index]),
            borderColor: '#ffffff',
            borderWidth: 1,
            borderSkipped: false,
          },
        ],
      }
    },
    chartOptions() {
      return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 40 } }, // room for the value labels
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#ffffff',
            font: { size: 11, family: 'Rubik' },
            formatter: (value) => value.toFixed(2),
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.x.toFixed(2)} Mrd $ (TTM)`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(158, 158, 158, 0.35)' },
            border: { display: false },
            ticks: { color: '#ffffff', font: { size: 8, family: 'Rubik' } },
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#ffffff', font: { size: 10, family: 'Rubik' } },
          },
        },
      }
    },
  },
}
</script>
