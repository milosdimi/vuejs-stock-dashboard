<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <span class="dashboard__pill"></span>
      <h1 class="dashboard__title">The Magnificent Seven Companies</h1>
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

    <p v-else class="dashboard__loading">Lade Daten &hellip;</p>
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
import stockService from "./services/StockService";

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
  },
  data() {
    return {
      companies: [],
    };
  },
  async created() {
    this.companies = await stockService.getAllCompanyHistories();
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
  gap: 24px;
  margin-bottom: 40px;
}

.dashboard__pill {
  flex: none;
  box-sizing: content-box;
  width: 96px;
  height: 32px;
  border-radius: 0 100px 100px 0;
  background: var(--color-accent);
  /* linke Kante bis zum Viewport-Rand ziehen; die Breite im Flex-Flow bleibt 96px */
  margin-left: calc(50% - 50vw);
  padding-left: calc(50vw - 50%);
}

.dashboard__title {
  margin: 0;
  font-weight: 500;
  font-size: 36px;
  line-height: 43px;
  color: #f9f9f9;
}

.dashboard__row {
  display: flex;
  gap: 32px;
  margin-top: 32px;
}

.dashboard__card--wide {
  width: 714px;
}

.dashboard__card--narrow {
  width: 494px;
}

.dashboard__card--w4 {
  width: 392px;
}

.dashboard__card--w5 {
  width: 293px;
}

.dashboard__card--w6 {
  width: 491px;
}
</style>
