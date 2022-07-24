<template>
  <div>
    <!-- <h1>Dashboard Page</h1> -->
    <AnalyticsCardGroup></AnalyticsCardGroup>
  </div>
</template>

<script>
import { getAnalytics } from '../api/Analytics'
import AnalyticsCard from '../components/AnalyticsCard.vue'

export default {
    name: "DashboardPage",
    data() {
        return {
            analytics: {},
            error: null
        };
    },
    methods: {
        async loadAnalytics() {
            try {
                const dbAnalytics = await getAnalytics();
                this.analytics = dbAnalytics;
            }
            catch (e) {
                this.error = e;
            }
        }
    },
    components: { AnalyticsCard }
}
</script>
