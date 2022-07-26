<template>
  <div class="card-group-container">
    <div v-for="(card, index) in config" :key="index" class="card">
      <AnalyticsCard
        v-if="card.type === 'Analytics'"
        :title="card.title"
        :statistic="card.statistic"
        :subtitle="card.subtitle"
        :is-loading="isLoading"
      />

      <ChartCard v-if="card.type === 'Scatter Chart'">
        <ScatterChart :height="card.chartHeight ? card.chartHeight : 300" />
      </ChartCard>
    </div>
  </div>
</template>

<script>
import { mockCardGroup } from '../utils/MockData'
import AnalyticsCard from './AnalyticsCard.vue'
import ChartCard from './ChartCard.vue'
import ScatterChart from './Charts/ScatterChart.vue'

export default {
  name: 'CardGroup',
  components: { AnalyticsCard, ChartCard, ScatterChart },
  props: {
    config: {
      type: null,
      default: mockCardGroup,
      required: false
    },
    direction: {
      type: String,
      default: 'row',
      required: false
    },
    isLoading: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>

<style scoped>
.card-group-container{
    display: flex;
    flex-direction: v-bind('direction');
    margin: 25px;
    gap: 20px;
    flex-wrap: wrap;
}

.card{
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
}

</style>
