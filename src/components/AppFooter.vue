<template>
  <footer class="app-footer">
    <p class="app-footer__line">
      Daten aus einem
      <a
        class="app-footer__link"
        href="https://docs.google.com/spreadsheets/d/1m3h9Xce3SRMaq20li2Qg4HuSZowwxQSd9FkQmeuI7Dw"
        target="_blank"
        rel="noopener"
      >
        Google Sheet
      </a>
      via SheetDB &middot; keine Anlageberatung
    </p>
    <p class="app-footer__line">Gebaut mit Vue 3 &amp; Chart.js &middot; {{ year }}</p>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style scoped>
.app-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.5);
}

.app-footer__line {
  margin: 0;
}

.app-footer__link {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: underline;
}

.app-footer__link:hover {
  color: var(--color-accent);
}
</style>
