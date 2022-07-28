<template>
  <div>
    <AnalyticsCardGroup :is-loading="false" />
    <ImageCardGroup />
  </div>
</template>

<script>
import { getAnalytics } from '../api/Analytics'
import AnalyticsCardGroup from '../components/Groups/AnalyticsCardGroup.vue'
import ImageCardGroup from '../components/Groups/ImageCardGroup.vue'

export default {
  name: 'DashboardPage',
  components: { AnalyticsCardGroup, ImageCardGroup },
  data () {
    return {
      analytics: {},
      error: null
    }
  },
  methods: {
    async loadAnalytics () {
      try {
        const dbAnalytics = await getAnalytics()
        this.analytics = dbAnalytics
      } catch (e) {
        this.error = e
      }
    }
  }
}
</script>
