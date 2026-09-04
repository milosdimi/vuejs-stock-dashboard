<template>
  <div class="base-chart" :style="rootStyle">
    <canvas ref="canvas" role="img" :aria-label="ariaLabel"></canvas>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import Chart from 'chart.js/auto'

// Wraps Chart.js: creates/destroys it on the lifecycle, rebuilds it when the
// data changes, and re-renders on browser zoom (devicePixelRatio fix).
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
    // height in px; without it the chart fills the parent's height
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
      // markRaw: keep the Chart.js instance out of Vue's reactivity, otherwise
      // its proxy clashes with Chart.js' own internal proxying.
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
    // Browser zoom changes devicePixelRatio but not the CSS size, so force a
    // re-measure or the canvas stays at the old resolution (blurry).
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
