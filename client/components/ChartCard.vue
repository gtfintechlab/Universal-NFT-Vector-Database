<template>
  <div class="chart-container">
    <div class="chart-align">
      <ScatterChart v-if="!isLoading" :height="height"></ScatterChart>
    </div>
    <PulseLoader v-if="isLoading" color="#16324C" class="vue-spinner" />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import {mockScatterChartPoints} from '../utils/MockData'
import ScatterChart from './Charts/ScatterChart.vue';

export default {
  name: 'ChartCard',
  components: { PulseLoader, ScatterChart },
  props: {
    config: {
      type: null,
      default: mockScatterChartPoints,
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
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    height: 90%;
    justify-content: center;
}

.chart-align{
    align-self: center !important;
}

.vue-spinner{
    align-self: center;
    justify-self: center;
}

</style>
