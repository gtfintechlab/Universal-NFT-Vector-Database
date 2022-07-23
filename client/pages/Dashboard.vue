<template>
  <div>
    <h1>{{ analytics }}</h1>
    <button @click="loadAnalytics()" />
    <h2 v-if="error !== null">
      {{ error }}
    </h2>
  </div>
</template>

<script>
import { getAnalytics } from '../api/Analytics'

export default {
  name: 'DashboardPage',
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
