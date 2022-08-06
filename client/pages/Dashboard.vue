<template>
  <div>
    <div class="dashboard-container">
      <AnalyticsCardGroup :config="topCardConfig" :is-loading="topCardLoad" class="top-card-group" />
      <AnalyticsCardGroup :config="bottomCardConfig" :is-loading="bottomCardLoad" />
      <Table :config="tableData" class="table-margins" :isLoading="tableLoad"/>
    </div>
  </div>
</template>

<script>
import { getAnalytics } from '../actions/Analytics'
import { getNftAmountTaskQueue, getCollectionAmountTaskQueue, getTaskQueueItems } from '../actions/TaskQueue'
import AnalyticsCardGroup from '../components/Groups/AnalyticsCardGroup.vue'
import { mockAnalyticsCardGroup } from '../utils/MockData'
import {TaskQueueType} from '../utils/Types';
import Table from '../components/Table.vue'

export default {
  name: 'DashboardPage',
  components: {
    AnalyticsCardGroup,
    Table
},
  data () {
    return {
      tableLoad: true,
      tableData: {
        title: "Task Queue Items to be Processed",
        headers: ["Item Type", "Item Identifier", "Blockchain"],
        data: []
      },
      analytics: {},
      topCardLoad: true,
      topCardConfig: mockAnalyticsCardGroup,
      bottomCardLoad: true,
      bottomCardConfig: mockAnalyticsCardGroup,
      error: null
    }
  },
  async mounted () {
    this.analytics = await getAnalytics()
    this.getConfigTopCards()
    this.getConfigBottomCards()
    this.getTaskQueueTable()
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
        statistic: this.analytics.nftSuccess.toLocaleString(),
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
        contractSuccessRate = (parseInt((this.analytics.contractsSuccess)) / parseInt((this.analytics.totalContracts))) * 100
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
    },
    async getTaskQueueTable(){
      this.tableLoad = true;
      const taskQueueItems = (await getTaskQueueItems()).items
      const taskQueueItemsSpliced = taskQueueItems.splice(0,5);
      
      taskQueueItemsSpliced.map((item) => {
        let itemType = item.type;
        let itemIdentifier = "";
        let blockchain = "";
        
        if (itemType === TaskQueueType.ITEM_CONTRACT){
          itemType = "NFT Collection";
          itemIdentifier = item.data.address;
          blockchain = item.data.chain;
        } else if (itemType === TaskQueueType.ITEM_NFT){
          itemType = "Single NFT";
          itemIdentifier = item.data.media;
          blockchain = item.data.chain;
        }

        this.tableData.data.push({
          "Item Type": itemType,
          "Item Identifier": itemIdentifier,
          "Blockchain": blockchain
        })
      });

      this.tableLoad = false;
    }

  }
}
</script>

<style scoped>
.dashboard-container{
  margin: 25px;
}
.top-card-group{
  margin: 25px 0px 25px 0px;
}

.table-margins{
  margin-top: 25px;
}
</style>
