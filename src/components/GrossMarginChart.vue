<template>
  <div class="hbar">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { BLUE_SCALE } from '../utils/companyStyle'
import { formatQuarter } from '../utils/metrics'

export default {
  name: 'GrossMarginChart',
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
    // Rohmarge % des zuletzt gemeldeten Quartals, absteigend sortiert
    rows() {
      return this.companies
        .map((company) => {
          const latest = company.quarters[company.quarters.length - 1]
          return {
            name: company.name,
            value: latest.grossMargin,
            quarter: formatQuarter(latest.quarter),
          }
        })
        .sort((a, b) => b.value - a.value)
    },
  },
  mounted() {
    this.chart = new Chart(this.$refs.canvas, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: this.rows.map((row) => row.name),
        datasets: [
          {
            data: this.rows.map((row) => row.value),
            backgroundColor: this.rows.map((row, index) => BLUE_SCALE[index]),
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 40 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#ffffff',
            font: { size: 11, family: 'Rubik' },
            formatter: (value) => `${value.toFixed(1)}%`,
          },
          tooltip: {
            callbacks: {
              // Kontext: aus welchem Quartal stammt die Marge
              label: (ctx) => `${ctx.parsed.x.toFixed(1)}%  (${this.rows[ctx.dataIndex].quarter})`,
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
      },
    })
  },
  beforeUnmount() {
    if (this.chart) this.chart.destroy()
  },
}
</script>

<style scoped>
.hbar {
  width: 100%;
  height: 280px;
}
</style>
