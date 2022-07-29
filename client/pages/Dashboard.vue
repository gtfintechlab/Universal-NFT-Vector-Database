<template>
  <div>
    <!-- <AnalyticsCardGroup :config="topCardConfig" :is-loading="topCardLoad" />
    <AnalyticsCardGroup :config="bottomCardConfig" :is-loading="bottomCardLoad" /> -->
  </div>
</template>

<script>
import { getAnalytics } from '../api-src/Analytics'
import { getNftAmountTaskQueue, getCollectionAmountTaskQueue } from '../api-src/TaskQueue'
import AnalyticsCardGroup from '../components/Groups/AnalyticsCardGroup.vue'
import { mockAnalyticsCardGroup } from '../utils/MockData'

export default {
  name: 'DashboardPage',
  components: { AnalyticsCardGroup },
  data () {
    return {
      analytics: {},
      topCardLoad: true,
      topCardConfig: mockAnalyticsCardGroup,
      bottomCardLoad: true,
      bottomCardConfig: mockAnalyticsCardGroup,
      error: null
    }
  },
  async mounted () {
    // this.analytics = await getAnalytics()
    // this.getConfigTopCards()
    // this.getConfigBottomCards()
  },
  methods: {
    async getConfigTopCards () {
      const cards = []
      const nftsInTaskQueue = (await getNftAmountTaskQueue()).amount
      let nftSuccessRate = 100
      if (parseInt(this.analytics.totalNFTs) !== 0) {
        nftSuccessRate = (parseInt((this.analytics.nftSuccess)) / parseInt((this.analytics.nftSuccess + this.analytics.nftFailure))) * 100
      }
      cards.push({
        title: 'Total NFTs in Vector Database',
        statistic: this.analytics.nftSuccess,
        subtitle: nftsInTaskQueue.toLocaleString() + ' NFTs in Task Queue'
      },
      {
        title: 'NFT Processing Success Rate',
        statistic: Number(nftSuccessRate).toFixed(2) + '%',
        subtitle: this.analytics.nftSuccess.toLocaleString() + ' of ' + (this.analytics.nftSuccess + this.analytics.nftFailure).toLocaleString() + ' Successful'
      }
      )
      this.topCardConfig = cards
      this.topCardLoad = false
    },
    async getConfigBottomCards () {
      const cards = []
      let contractSuccessRate = 100
      const contractsInTaskQueue = (await getCollectionAmountTaskQueue()).amount
      if (parseInt(this.analytics.totalContracts) !== 0) {
        contractSuccessRate = (parseInt((this.analytics.contractsSuccess)) / parseInt((this.analytics.totalContracts)))* 100
      }

      cards.push({
        title: 'Total NFT Collections Processed',
        statistic: this.analytics.totalContracts,
        subtitle: contractsInTaskQueue.toLocaleString() + ' NFT Collections in Task Queue'
      },
      {
        title: 'NFT Collection Processing Success Rate',
        statistic: Number(contractSuccessRate).toFixed(2) + '%',
        subtitle: this.analytics.contractsSuccess.toLocaleString() + ' of ' + this.analytics.totalContracts.toLocaleString() + ' Successful'
      })
      this.bottomCardConfig = cards
      this.bottomCardLoad = false
    }

  }
}
</script>
