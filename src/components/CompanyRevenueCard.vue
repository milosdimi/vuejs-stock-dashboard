<template>
  <article class="revenue-card">
    <header class="revenue-card__head">
      <CompanyLogo :symbol="company.symbol" />
      <span class="revenue-card__name">{{ company.name }}</span>
    </header>

    <div v-if="current" class="revenue-card__body">
      <p class="revenue-card__label">Revenue {{ quarterLabel }}</p>

      <div class="revenue-card__figures">
        <span class="revenue-card__value">{{ revenueText }}</span>

        <div class="revenue-card__deltas" :class="trendClass">
          <span class="revenue-card__delta">
            {{ absoluteChangeText }}
            <span class="material-symbols-rounded revenue-card__arrow">arrow_upward_alt</span>
          </span>
          <span class="revenue-card__delta">
            {{ relativeChangeText }}
            <span class="material-symbols-rounded">percent</span>
          </span>
        </div>
      </div>

      <p class="revenue-card__unit">In Bill USD</p>
    </div>
  </article>
</template>

<script>
import CompanyLogo from './CompanyLogo.vue'
import { currentRevenue, toBillions, formatQuarter } from '../utils/metrics'

export default {
  name: 'CompanyRevenueCard',
  components: {
    CompanyLogo,
  },
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
  computed: {
    current() {
      return currentRevenue(this.company.quarters)
    },
    quarterLabel() {
      return formatQuarter(this.current.quarter)
    },
    isPositive() {
      return this.current.absoluteChange >= 0
    },
    trendClass() {
      return this.isPositive ? 'is-positive' : 'is-negative'
    },
    revenueText() {
      return toBillions(this.current.revenue).toFixed(2)
    },
    absoluteChangeText() {
      const value = toBillions(this.current.absoluteChange).toFixed(2)
      return this.isPositive ? `+${value}` : value
    },
    relativeChangeText() {
      return this.current.relativeChange.toFixed(2)
    },
  },
}
</script>

<style scoped>
.revenue-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px 24px;
  background: var(--color-card);
  border-radius: var(--radius-card);
}

.revenue-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.revenue-card__name {
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
}

.revenue-card__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.revenue-card__label {
  margin: 0;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  white-space: nowrap;
}

.revenue-card__figures {
  display: flex;
  align-items: center;
  gap: 4px;
}

.revenue-card__value {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
}

.revenue-card__deltas {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.revenue-card__deltas.is-positive {
  color: var(--color-positive);
}

.revenue-card__deltas.is-negative {
  color: var(--color-negative);
}

.revenue-card__delta {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
}

.revenue-card__delta .material-symbols-rounded {
  font-size: 20px;
}

.is-negative .revenue-card__arrow {
  transform: rotate(180deg);
}

.revenue-card__unit {
  margin: 0;
  font-weight: 400;
  font-size: 8px;
  line-height: 9px;
}
</style>
