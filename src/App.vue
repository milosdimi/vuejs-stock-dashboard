<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <span class="dashboard__pill"></span>
      <h1 class="dashboard__title">The Magnificent Seven Companies</h1>
    </header>

    <CompanyOverview v-if="companies.length" :companies="companies" />
    <p v-else class="dashboard__loading">Lade Daten &hellip;</p>
  </div>
</template>

<script>
import CompanyOverview from "./components/CompanyOverview.vue";
import stockService from "./services/StockService";

export default {
  name: "App",
  components: {
    CompanyOverview,
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
  width: 72px;
  height: 32px;
  border-radius: 999px;
  background: var(--color-accent);
}

.dashboard__title {
  margin: 0;
  font-weight: 700;
  font-size: 40px;
  line-height: 1.2;
}
</style>
