<template>
  <section class="card">
    <h2 v-if="title" class="card__title">{{ title }}</h2>

    <div class="card__body">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 32px;
  background: #011f35;
  border-radius: 16px;
  box-sizing: border-box;
}

.card__title {
  margin: 0;
  font-family: 'Rubik', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
  color: #ffffff;
}

.card__body {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}
</style>
