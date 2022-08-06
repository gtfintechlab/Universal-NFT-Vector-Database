<template>
  <div>
    <div class="admin-container">
      <div class="login-container">
      <div class="not-authenticated-container" v-if="!authenticated">
        <label class="login-label">Username</label>
        <input v-model="username" class="credentials-input" type="text"/>
        <label class="login-label">Password</label>
        <input v-model="password" class="credentials-input" type="password"/>
        <button
                @click="authenticateUser"
                class="credentials-submit"
              >Login</button>
        <div v-if="error !== null" class="login-fail">{{error}}</div>
      </div>
      </div>
      <!-- If the User is authenticated then show this -->
      <div v-if="authenticated">
        <Table :config="tableConfig" class="table-margins" :isLoading="tableLoad"/>
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
              <button
                class="task-queue-button"
                :disabled="!finishedLoading"
                @click="loadNextContracts"
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
  </div>
</template>

<script>

import AnalyticsCardGroup from '~~/components/Groups/AnalyticsCardGroup.vue';
import { getNftAmountTaskQueue, getCollectionAmountTaskQueue } from '~~/actions/TaskQueue';
import { getAnalytics } from '~~/actions/Analytics';
import { getLastContract } from '~~/actions/Checkpoint';
import { getJWTToken, verifyJWTToken } from '~~/actions/Authentication';
import { BlockchainType, NFTType } from '~~/utils/Types';
import { processNextContracts } from '~~/actions/GraphProtocol';

export default {
  name: 'SearchPage',
  components: { AnalyticsCardGroup },
  data () {
    return {
      analytics: {},
      tableLoad: true,
      tableConfig: {
        title: "Overall Database Statistics",
        headers: ["Statistic", "Success Count", "Failure Count", "Success Rate"],
        data: []
      },
      taskQueueAnalyticsConfig: [{}, {}, {}],
      taskQueueAnalyticsLoading: true,
      searchApiAnalyticsConfig: [{}],
      searchApiAnalyticsLoading: true,
      lastContractLoading: true,
      finishedLoading: false,
      authenticated: false,
      webToken: "",
      username: "",
      password: "",
      error: null
    }
  },
  async mounted () {
    await this.loadAnalytics()
    this.getTaskQueueInformation()
    this.getSearchApiInformation()
    this.getOverallStatistics()
    this.finishedLoading = true
  },
  methods: {
    async authenticateUser(){
      this.error = null;
      try{
        const jwtToken = (await getJWTToken(this.username, this.password)).jwt;
        const verify = await verifyJWTToken(jwtToken);
        if (verify.authenticated){
          this.authenticated = true;
          this.webToken = jwtToken;
        }
      } catch{
        this.error = "Incorrect Login or Failed to Verify User!"
      }
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
    },
    async loadNextContracts(){
      if (this.finishedLoading){
        this.finishedLoading = false;
        await processNextContracts(this.webToken, 10, NFTType.ERC_721, BlockchainType.ETHEREUM)
        this.finishedLoading = true;
      }
    },

    async getOverallStatistics(){
      // NFT Success, NFT Collection, Search API
      this.tableLoad = true;
      const analytics = await getAnalytics();
      const nftSuccess = parseInt(analytics.nftSuccess);
      const nftFailure = parseInt(analytics.nftFailure);
      let nftSuccessRate = (nftSuccess / (nftFailure + nftSuccess)) * 100;
            if (Number.isNaN(Number(nftSuccessRate))){
        nftSuccessRate = 100;
      }

      const nftDict = {
        Statistic: "NFTs Processed",
        "Success Count": nftSuccess,
        "Failure Count": nftFailure,
        "Success Rate": Number(nftSuccessRate).toFixed(2) + '%',
      }
      const contractSuccess = parseInt(analytics.contractsSuccess);
      const contractFailure = parseInt(analytics.contractsFailure);
      let contractSuccessRate = (contractSuccess / (contractFailure + contractSuccess)) * 100;
      if (Number.isNaN(Number(contractSuccessRate))){
        contractSuccessRate = 100;
      }

      const contractDict = {
        Statistic: "NFT Collections Processed",
        "Success Count": contractSuccess,
        "Failure Count": contractFailure,
        "Success Rate": Number(contractSuccessRate).toFixed(2) + '%',
      }

      const searchSuccess = parseInt(analytics.searchApiSuccess);
      const searchFailure = parseInt(analytics.searchApiFailure);
      let searchSuccessRate = (searchSuccess / (searchFailure + searchSuccess)) * 100;
      if (Number.isNaN(Number(searchSuccessRate))){
        searchSuccessRate = 100;
      }
      const searchDict = {
        Statistic: "Search API",
        "Success Count": searchSuccess,
        "Failure Count": searchFailure,
        "Success Rate": Number(searchSuccessRate).toFixed(2) + '%',
      }

      this.tableConfig.data.push(nftDict, contractDict, searchDict)
      this.tableLoad = false;

    }
  }

}
</script>

<style scoped>
.login-container{
  display: flex;
  justify-content: center;
}
.not-authenticated-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  align-self: center;
}

input[type="text"]
{
  font-family: 'Outfit';
  font-weight: 400;
  font-size: 1.1em;
}
.credentials-input{
  flex: 1 1 0;
  align-self: center;
  width: 100%;
  padding: 12px 20px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.credentials-submit{
  flex: 1 1 0;
  align-self: center;
  width: 100%;
  background-color: #16324C;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Outfit';
  font-weight: 400;
  font-size: 1.1em;
}
.login-label{
  font-family: 'Outfit';
  font-weight: 400;
  font-size: 1.1em;
}

.login-fail{
  font-family: 'Outfit';
  font-weight: 400;
  font-size: 1.2em;
  color: red;

}
.admin-container{
  margin: 25px;
  height: calc(100vh);
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

.task-queue-button:hover{
  cursor: pointer;
  background-color: #0f5a9f;
}

button:disabled,
button[disabled]{
  background-color: #cccccc;
  color: black;
}

button:disabled,
button[disabled]:hover{
  background-color: #cccccc;
  pointer-events: none;
}
.task-queue-card{
  flex: 1 1 0;
}

.horizontal-flexor{
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
}

.table-margins{
  margin-bottom: 25px;
}
</style>
