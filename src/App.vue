<template>
  <BaseCard title="Revenue last 3 years">
    <p style="color: #fff">Hier kommt spaeter der Chart rein</p>
  </BaseCard>
</template>

<script>
import BaseCard from "./components/BaseCard.vue";

export default {
  name: "App",
  components: {
    BaseCard,
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
  width: 100vw;
  min-height: 100vh;
  padding: 100px;
  box-sizing: border-box;
  background: radial-gradient(
    71.11% 100% at 50% 0%,
    #020204 14.6%,
    #011f35 100%
  );
}
</style>
