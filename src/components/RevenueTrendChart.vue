<template>
  <div class="trend">
    <div class="trend__chart">
      <BaseChart
        type="line"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :height="270"
        aria-label="Umsatzentwicklung der Magnificent Seven ueber die letzten 3 Jahre"
      />
    </div>

    <ul class="trend__legend">
      <li v-for="item in items" :key="item.symbol" class="trend__row">
        <span class="trend__swatch" :style="{ background: item.color }"></span>
        <span>{{ item.name }} {{ item.latestBillions }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import BaseChart from './BaseChart.vue'
import { COMPANY_COLORS, orderCompanies } from '../utils/companyStyle'
import { toBillions, lastCalendarQuarters } from '../utils/metrics'

const QUARTER_COUNT = 12

export default {
  name: 'RevenueTrendChart',
  components: { BaseChart },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  computed: {
    labels() {
      return lastCalendarQuarters(QUARTER_COUNT)
    },
    // pro Firma: 12 Umsatzwerte (Mrd $), auf die gemeinsame Achse gelegt
    items() {
      return orderCompanies(this.companies).map((company) => {
        const values = company.quarters
          .slice(-QUARTER_COUNT)
          .map((point) => toBillions(point.revenue))

        // falls eine Firma weniger als 12 Quartale hat: vorne mit null auffuellen
        while (values.length < QUARTER_COUNT) values.unshift(null)

        const latest = values[values.length - 1]

        return {
          symbol: company.symbol,
          name: company.name,
          color: COMPANY_COLORS[company.symbol],
          values,
          latestBillions: latest == null ? '-' : latest.toFixed(1),
        }
      })
    },
    chartData() {
      return {
        labels: this.labels,
        datasets: this.items.map((item) => ({
          label: item.name,
          data: item.values,
          borderColor: item.color,
          backgroundColor: item.color,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.3,
        })),
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        // Maus irgendwo -> naechstes Quartal, ALLE Datensaetze im Tooltip
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${ctx.parsed.y == null ? '-' : ctx.parsed.y.toFixed(1)} Mrd $`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(158, 158, 158, 0.35)' },
            border: { display: false },
            ticks: {
              color: '#ffffff',
              font: { size: 8, family: 'Rubik' },
              maxRotation: 20,
              minRotation: 20,
            },
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

<style scoped>
.trend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.trend__chart {
  flex: 1 1 220px;
  min-width: 0;
}

.trend__legend {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 0 0 auto;
}

.trend__row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  line-height: 12px;
}

.trend__swatch {
  width: 32px;
  height: 12px;
  flex: none;
  border: 1px solid #ffffff;
}
</style>
