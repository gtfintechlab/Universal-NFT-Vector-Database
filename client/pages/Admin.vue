<template>
  <div>
    <div class="admin-container">
      <div class="contract-search-container">
        <div class="horizontal-flexor">
          <div class="task-queue-container">
            <AnalyticsCard
              subtitle-topic="Last Contract Processed: "
              :is-loading="lastContractLoading"
              :subtitle="analytics['lastContract']"
              title="Task Queue Control"
              class="task-queue-card"
            />
            <!--Change Later, keeping the button function as null so no one recklessly presses it-->
            <button
              class="task-queue-button"
              :disabled="!finishedLoading"
              @click="finishedLoading ? null : null"
            >
              Process Next 10 Contracts
            </button>
          </div>
        </div>
        <AnalyticsCardGroup
          :is-loading="searchApiAnalyticsLoading"
          :config="searchApiAnalyticsConfig"
          class="contract-search-item"
        />
      </div>

      <AnalyticsCardGroup
        :is-loading="taskQueueAnalyticsLoading"
        :config="taskQueueAnalyticsConfig"
        class="top-card-group"
      />
    </div>
  </div>
</template>

<script>

import AnalyticsCardGroup from '~~/components/Groups/AnalyticsCardGroup.vue'
import { getNftAmountTaskQueue, getCollectionAmountTaskQueue } from '~~/api-src/TaskQueue'
import { getAnalytics } from '~~/api-src/Analytics'
import { getLastContract } from '~~/api-src/Checkpoint'
export default {
  name: 'SearchPage',
  components: { AnalyticsCardGroup },
  data () {
    return {
      analytics: {},
      taskQueueAnalyticsConfig: [{}, {}, {}],
      taskQueueAnalyticsLoading: true,
      searchApiAnalyticsConfig: [{}],
      searchApiAnalyticsLoading: true,
      lastContractLoading: true,
      finishedLoading: false
    }
  },
  async mounted () {
    await this.loadAnalytics()
    this.getTaskQueueInformation()
    this.getSearchApiInformation()
    this.finishedLoading = true
  },
  methods: {
    async processContracts () {
      await processNextContracts()
    },
    async loadAnalytics () {
      this.taskQueueAnalyticsLoading = true
      this.searchApiAnalyticsLoading = true
      this.lastContractLoading = true

      this.analytics.nftsInTaskQueue = (await getNftAmountTaskQueue()).amount
      this.analytics.collectionsInTaskQueue = (await getCollectionAmountTaskQueue()).amount

      const overallAnalytics = await getAnalytics()
      this.analytics.searchApiSuccess = overallAnalytics.searchApiSuccess
      this.analytics.searchApiFailure = overallAnalytics.searchApiFailure

      const lastContract = (await getLastContract()).lastContract
      this.analytics.lastContract = lastContract
      this.lastContractLoading = false
    },
    getTaskQueueInformation () {
      const taskQueueInfo = []
      const nftsInTaskQueue = this.analytics.nftsInTaskQueue
      const contractsInTaskQueue = this.analytics.collectionsInTaskQueue
      const totalItemsTaskQueue = nftsInTaskQueue + contractsInTaskQueue

      taskQueueInfo.push({
        title: 'Total Items in Task Queue',
        statistic: totalItemsTaskQueue.toLocaleString()
      }, {
        title: 'NFTs in Task Queue',
        statistic: nftsInTaskQueue.toLocaleString()
      }, {
        title: 'NFT Collections in Task Queue',
        statistic: contractsInTaskQueue.toLocaleString()
      })

      this.taskQueueAnalyticsConfig = taskQueueInfo
      this.taskQueueAnalyticsLoading = false
    },
    getSearchApiInformation () {
      const searchApiInfo = []
      let successRate = 100
      const searchApiSuccess = this.analytics.searchApiSuccess
      const searchApiFailure = this.analytics.searchApiFailure
      if (parseInt(searchApiSuccess) + parseInt(searchApiFailure) !== 0) {
        successRate = (parseInt((searchApiSuccess)) / parseInt((searchApiSuccess + searchApiFailure))) * 100
      }
      searchApiInfo.push({
        title: 'Search API Success Rate',
        statistic: Number(successRate).toFixed(2) + '%',
        subtitle: searchApiSuccess.toLocaleString() + ' of ' + (searchApiSuccess + searchApiFailure).toLocaleString() + ' Successful'
      })

      this.searchApiAnalyticsConfig = searchApiInfo
      this.searchApiAnalyticsLoading = false
    }
  }

}
</script>

<style scoped>
.admin-container{
  margin: 25px;
}

.top-card-group{
  margin: 25px 0px 25px 0px;
}

.contract-search-container{
  display: flex;
  gap: 20px;
}

.task-queue-container{
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.contract-search-item{
  flex: 1 1 0;
}

.task-queue-button{
  border: none;
  background-color: #16324C;
  color: white;
  height: 100%;
  font-family: 'Outfit';
  font-weight: 400;
  font-size: 1.3em;
  border-radius: 10px;
  padding: 5px;
  width: 100%;
}

.task-queue-card{
  flex: 1 1 0;
}

.horizontal-flexor{
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
}
</style>
