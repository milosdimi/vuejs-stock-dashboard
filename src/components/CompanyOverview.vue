<template>
  <section class="company-overview">
    <div
      ref="scroller"
      class="company-overview__track"
      :class="{ 'is-scrolling': isScrolling, 'is-dragging': isDragging }"
      @scroll="onScroll"
      @wheel="onWheel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <CompanyRevenueCard
        v-for="company in companies"
        :key="company.symbol"
        :company="company"
      />
    </div>

    <button
      type="button"
      class="company-overview__scroll"
      aria-label="Weiter scrollen"
      @click="scrollRight"
    >
      <span class="material-symbols-rounded">chevron_right</span>
    </button>
  </section>
</template>

<script>
import CompanyRevenueCard from './CompanyRevenueCard.vue'

export default {
  name: 'CompanyOverview',
  components: {
    CompanyRevenueCard,
  },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isScrolling: false,
      scrollTimer: null,
      isDragging: false,
      dragStartX: 0,
      dragStartScroll: 0,
    }
  },
  beforeUnmount() {
    clearTimeout(this.scrollTimer)
  },
  methods: {
    canScroll() {
      const el = this.$refs.scroller
      return el.scrollWidth > el.clientWidth
    },

    scrollRight() {
      this.$refs.scroller.scrollBy({ left: 240, behavior: 'smooth' })
    },

    onScroll() {
      this.isScrolling = true
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false
      }, 700)
    },

    // Wheel-scroll the row horizontally
    onWheel(event) {
      if (event.deltaY === 0 || !this.canScroll()) return
      event.preventDefault()
      this.$refs.scroller.scrollLeft += event.deltaY
    },

    onPointerDown(event) {
      if (!this.canScroll()) return
      this.isDragging = true
      this.dragStartX = event.clientX
      this.dragStartScroll = this.$refs.scroller.scrollLeft
      this.$refs.scroller.setPointerCapture(event.pointerId)
    },

    onPointerMove(event) {
      if (!this.isDragging) return
      const distance = event.clientX - this.dragStartX
      this.$refs.scroller.scrollLeft = this.dragStartScroll - distance
    },

    onPointerUp(event) {
      if (!this.isDragging) return
      this.isDragging = false
      this.$refs.scroller.releasePointerCapture(event.pointerId)
    },
  },
}
</script>

<style scoped>
.company-overview {
  position: relative;
  padding: 24px;
  background: var(--color-panel);
  border-radius: var(--radius-panel);
}

.company-overview__track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  cursor: grab;

  /* Firefox: thin scrollbar, hidden until scrolling/dragging */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}

.company-overview__track:hover,
.company-overview__track.is-scrolling,
.company-overview__track.is-dragging {
  scrollbar-color: var(--color-scrollbar) transparent;
}

.company-overview__track.is-dragging {
  cursor: grabbing;
  user-select: none;
}

/* Chrome / Edge / Safari */
.company-overview__track::-webkit-scrollbar {
  height: 6px;
}

.company-overview__track::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 999px;
  transition: background 0.3s ease;
}

.company-overview__track:hover::-webkit-scrollbar-thumb,
.company-overview__track.is-scrolling::-webkit-scrollbar-thumb,
.company-overview__track.is-dragging::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar);
}

.company-overview__scroll {
  position: absolute;
  top: 50%;
  right: -16px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-card);
  cursor: pointer;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
}
</style>
