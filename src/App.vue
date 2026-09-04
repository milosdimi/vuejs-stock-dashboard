<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <span class="dashboard__pill"></span>

      <div class="dashboard__heading">
        <h1 class="dashboard__title">The Magnificent Seven Companies</h1>
        <p v-if="lastUpdatedText" class="dashboard__meta">
          Stand: {{ lastUpdatedText }}
        </p>
      </div>

      <button
        type="button"
        class="dashboard__refresh"
        :disabled="loading"
        title="Daten neu laden"
        @click="loadData(true)"
      >
        <span class="material-symbols-rounded">refresh</span>
      </button>
    </header>

    <template v-if="companies.length">
      <CompanyOverview :companies="companies" />

      <section class="dashboard__row">
        <BaseCard title="Revenue last 3 years" class="dashboard__card--wide">
          <RevenueTrendChart :companies="companies" />
        </BaseCard>

        <BaseCard
          title="Revenue Breakdown Magnificent Seven"
          class="dashboard__card--narrow"
        >
          <RevenueBreakdownChart :companies="companies" />
        </BaseCard>
      </section>

      <section class="dashboard__row">
        <BaseCard title="Net Income TTM" class="dashboard__card--w4">
          <NetIncomeChart :companies="companies" />
        </BaseCard>

        <BaseCard title="Gross Margin in % LQ" class="dashboard__card--w5">
          <GrossMarginChart :companies="companies" />
        </BaseCard>

        <BaseCard title="Revenue Growth in % YoY" class="dashboard__card--w6">
          <RevenueGrowthChart :companies="companies" />
        </BaseCard>
      </section>
    </template>

    <p v-else-if="loading" class="dashboard__status">Lade Daten &hellip;</p>

    <div v-else class="dashboard__status">
      <p>Daten konnten nicht geladen werden.</p>
      <button type="button" class="dashboard__retry" @click="loadData()">
        Erneut versuchen
      </button>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import CompanyOverview from "./components/CompanyOverview.vue";
import BaseCard from "./components/BaseCard.vue";
import RevenueTrendChart from "./components/RevenueTrendChart.vue";
import RevenueBreakdownChart from "./components/RevenueBreakdownChart.vue";
import NetIncomeChart from "./components/NetIncomeChart.vue";
import GrossMarginChart from "./components/GrossMarginChart.vue";
import RevenueGrowthChart from "./components/RevenueGrowthChart.vue";
import AppFooter from "./components/AppFooter.vue";
import stockService, { getLastUpdated } from "./services/StockService";

export default {
  name: "App",
  components: {
    CompanyOverview,
    BaseCard,
    RevenueTrendChart,
    RevenueBreakdownChart,
    NetIncomeChart,
    GrossMarginChart,
    RevenueGrowthChart,
    AppFooter,
  },
  data() {
    return {
      companies: [],
      loading: true,
      error: false,
      lastUpdated: null,
    };
  },
  computed: {
    lastUpdatedText() {
      if (!this.lastUpdated) return "";
      return new Intl.DateTimeFormat("de-DE", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(this.lastUpdated);
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData(force = false) {
      this.loading = true;
      this.error = false;
      try {
        this.companies = await stockService.getAllCompanyHistories({ force });
        this.lastUpdated = getLastUpdated();
      } catch (err) {
        this.error = true;
        console.error("Daten konnten nicht geladen werden", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: var(--dashboard-max-width);
  margin: 0 auto;
}

.dashboard__header {
  display: flex;
  align-items: center;
  gap: clamp(12px, 3vw, 24px);
  margin-bottom: 40px;
}

.dashboard__pill {
  flex: none;
  box-sizing: content-box;
  width: 96px;
  height: 32px;
  border-radius: 0 100px 100px 0;
  background: var(--color-accent);
  margin-left: calc(50% - 50vw);
  padding-left: calc(50vw - 50%);
}

.dashboard__heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard__title {
  margin: 0;
  font-weight: 500;
  font-size: clamp(24px, 5vw, 36px);
  line-height: 1.2;
  color: #f9f9f9;
}

.dashboard__meta {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.dashboard__refresh {
  margin-left: auto;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: var(--color-panel);
  color: var(--color-text);
  cursor: pointer;
}

.dashboard__refresh:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-card);
}

.dashboard__refresh:disabled {
  opacity: 0.4;
  cursor: default;
}

.dashboard__row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 32px;
}

.dashboard__card--wide {
  flex: 714 1 0%;
  min-width: 320px;
}

.dashboard__card--narrow {
  flex: 494 1 0%;
  min-width: 320px;
}

.dashboard__card--w4 {
  flex: 392 1 0%;
  min-width: 280px;
}

.dashboard__card--w5 {
  flex: 293 1 0%;
  min-width: 240px;
}

.dashboard__card--w6 {
  flex: 491 1 0%;
  min-width: 320px;
}

.dashboard__status {
  margin-top: 40px;
}

.dashboard__retry {
  margin-top: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: var(--color-accent);
  color: var(--color-card);
  font-family: var(--font-base);
  font-weight: 500;
  cursor: pointer;
}
</style>
