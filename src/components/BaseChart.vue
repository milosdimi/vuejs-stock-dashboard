<template>
  <div class="base-chart" :style="rootStyle">
    <canvas ref="canvas" role="img" :aria-label="ariaLabel"></canvas>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import Chart from 'chart.js/auto'

// Zentraler Wrapper um Chart.js:
// - erstellt/zerstoert das Chart im Lifecycle
// - baut das Chart bei Daten-Aenderungen sauber neu auf
// - rendert bei Browser-Zoom neu (devicePixelRatio-Fix -> keine unscharfe Canvas)
export default {
  name: 'BaseChart',
  props: {
    type: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    chartPlugins: {
      type: Array,
      default: () => [],
    },
    // Hoehe in px; ohne Angabe fuellt das Chart die Hoehe des Elternelements
    height: {
      type: Number,
      default: null,
    },
    ariaLabel: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  computed: {
    rootStyle() {
      return { height: this.height ? `${this.height}px` : '100%' }
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.buildChart()
      },
    },
  },
  mounted() {
    this.buildChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.destroyChart()
  },
  methods: {
    buildChart() {
      this.destroyChart()
      // markRaw: Chart.js-Instanz NICHT reaktiv machen, sonst kollidiert
      // Vues Proxy mit Chart.js' eigener interner Proxy-Logik.
      this.chart = markRaw(
        new Chart(this.$refs.canvas, {
          type: this.type,
          data: this.chartData,
          options: this.chartOptions,
          plugins: this.chartPlugins,
        }),
      )
    },
    destroyChart() {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
    },
    // Browser-Zoom aendert devicePixelRatio, nicht die CSS-Groesse -> Chart.js
    // neu vermessen lassen, sonst bleibt die Canvas in alter Aufloesung (unscharf).
    handleResize() {
      if (this.chart) this.chart.resize()
    },
  },
}
</script>

<style scoped>
.base-chart {
  position: relative;
  width: 100%;
}
</style>
