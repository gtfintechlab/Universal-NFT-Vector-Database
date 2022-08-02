<template>
  <div class="card-group-container">
    <AnalyticsCard
      v-for="(card,index) in config"
      :key="index"
      :title="card.title"
      :statistic="card.statistic"
      :subtitle="card.subtitle"
      :is-loading="isLoading"
      class="card"
    />
  </div>
</template>

<script>
import { mockAnalyticsCardGroup } from '../../utils/MockData'
import AnalyticsCard from '../AnalyticsCard.vue'

export default {
  name: 'AnalyticsCardGroup',
  components: { AnalyticsCard },
  props: {
    config: {
      type: null,
      default: mockAnalyticsCardGroup,
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
    gap: 20px;
    flex-wrap: wrap;
}

.card{
    flex: 1 1;
}

</style>
