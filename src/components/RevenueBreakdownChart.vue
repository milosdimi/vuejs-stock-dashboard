<template>
  <div class="breakdown">
    <div class="breakdown__chart">
      <BaseChart
        type="doughnut"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :height="240"
        aria-label="Revenue Breakdown der Magnificent Seven als Donut-Chart"
      />
    </div>

    <ul class="breakdown__legend">
      <li v-for="item in items" :key="item.symbol" class="breakdown__row">
        <span class="breakdown__swatch" :style="{ background: item.color }"></span>
        <span>{{ item.name }} {{ item.billions }}</span>
      </li>
    </ul>

    <p class="breakdown__unit">In Billion USD TTM</p>
  </div>
</template>

<script>
import BaseChart from './BaseChart.vue'
import { COMPANY_COLORS, orderCompanies } from '../utils/companyStyle'
import { ttm, toBillions } from '../utils/metrics'

export default {
  name: 'RevenueBreakdownChart',
  components: { BaseChart },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  computed: {
    // pro Firma: TTM-Umsatz + Farbe + jüngstes Quartal
    items() {
      return orderCompanies(this.companies).map((company) => {
        const ttmRevenue = ttm(company.quarters, 'revenue')
        const latest = company.quarters[company.quarters.length - 1]
        return {
          symbol: company.symbol,
          name: company.name,
          color: COMPANY_COLORS[company.symbol],
          ttmRevenue,
          billions: toBillions(ttmRevenue).toFixed(1),
          latestQuarter: latest.quarter,
        }
      })
    },
    chartData() {
      return {
        labels: this.items.map((item) => item.name),
        datasets: [
          {
            data: this.items.map((item) => item.ttmRevenue),
            backgroundColor: this.items.map((item) => item.color),
            borderColor: '#ffffff',
            borderWidth: 1,
          },
        ],
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const item = this.items[ctx.dataIndex]
                return `${item.name}: ${item.billions} Mrd $ (TTM bis ${item.latestQuarter})`
              },
            },
          },
        },
      }
    },
  },
}
</script>

<style scoped>
.breakdown {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 32px;
  width: 100%;
}

.breakdown__chart {
  width: 240px;
  max-width: 100%;
  flex: none;
}

.breakdown__legend {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breakdown__row {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 10px;
  line-height: 12px;
}

.breakdown__swatch {
  width: 32px;
  height: 12px;
  flex: none;
  border: 1px solid #ffffff;
}

.breakdown__unit {
  position: absolute;
  right: 0;
  bottom: -8px;
  margin: 0;
  font-size: 8px;
  line-height: 9px;
}
</style>
