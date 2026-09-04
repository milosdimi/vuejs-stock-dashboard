<template>
  <img :src="logoSrc" :alt="`${symbol} Logo`" class="company-logo" />
</template>

<script>
// Import each logo explicitly so mixed file types (.svg / .png) just work.
import AAPL from '@/assets/logos/AAPL.svg'
import AMZN from '@/assets/logos/AMZN.svg'
import GOOG from '@/assets/logos/GOOG.svg'
import META from '@/assets/logos/META.svg'
import MSFT from '@/assets/logos/MSFT.svg'
import NVDA from '@/assets/logos/NVDA.png'
import TSLA from '@/assets/logos/TSLA.svg'

const LOGOS = { AAPL, AMZN, GOOG, META, MSFT, NVDA, TSLA }

export default {
  name: 'CompanyLogo',
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  computed: {
    logoSrc() {
      return LOGOS[this.symbol]
    },
  },
}
</script>

<style scoped>
.company-logo {
  display: block;
  width: 24px;
  height: 20px;
  object-fit: contain;
  object-position: left center;
}
</style>
