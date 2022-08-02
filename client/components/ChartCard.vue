<template>
  <div class="chart-container">
    <div class="chart-align">
      <ScatterChart
        v-if="!isLoading"
        :height="height"
        :chart-data="config"
        :x-axis-label="xAxisLabel"
        :y-axis-label="yAxisLabel"
      />
    </div>
    <PulseLoader v-if="isLoading" color="#16324C" class="vue-spinner" />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import ScatterChart from './Charts/ScatterChart.vue'

export default {
  name: 'ChartCard',
  components: { PulseLoader, ScatterChart },
  props: {
    config: {
      type: null,
      default: [],
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
    },
    cssHeight: {
      type: String,
      default: props => props.height + 'px',
      required: false
    },
    xAxisLabel: {
      type: String,
      default: '',
      required: false
    },
    yAxisLabel: {
      type: String,
      default: '',
      required: false
    }

  },
  // computed: {
  //   showCountOnSearchComputed () {
  //     return this.height + "px" || this.cssHeight
  //   }
  // },

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
    /* Take the height, add 32 to account for margins, subtract 20 for padding */
    height: calc(v-bind('cssHeight') + 32px - 20px);
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
