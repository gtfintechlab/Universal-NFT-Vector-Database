<template>
  <div>
    <CardGroup :is-loading="false" />
  </div>
</template>

<script>
import { getAnalytics } from '../api/Analytics'
import CardGroup from '~~/components/CardGroup.vue'

export default {
  name: 'DashboardPage',
  components: { CardGroup },
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
