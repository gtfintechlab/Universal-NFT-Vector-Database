<template>
  <div class="chart-container">
    <div class="chart-align">
      <slot v-if="!isLoading" />
    </div>
    <PulseLoader v-if="isLoading" color="#16324C" class="vue-spinner" />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'ChartCard',
  components: { PulseLoader },
  props: {
    config: {
      type: null,
      default: {},
      required: false
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: false
    },
    height: {
      type: Number,
      default: 300,
      required: false
    }
  },

  methods: {
  }
}
</script>
<style scoped>
.chart-container{
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    min-width: 0 !important;
}

.chart-align{
    align-self: center !important;
}

.vue-spinner{
    align-self: center;
    justify-self: center;
}

</style>
