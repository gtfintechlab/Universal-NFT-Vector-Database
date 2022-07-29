<template>
  <div>
    <div class="graph-image-container">
        <UploadCard @runSearch="searchForNFTs" height="300px"/>
        <ChartCard v-if="searchStarted" :isLoading="multiScaleLoading"
                                        :height="300" 
                                        class="middle-margin-modifier"/>
    </div>
    <ImageCardGroup class="margin-modifier"></ImageCardGroup>
  </div>
</template>

<script>

import UploadCard from '../components/UploadCard.vue'
import ChartCard from '../components/UploadCard.vue'
import ImageCardGroup from '~~/components/Groups/ImageCardGroup.vue'

export default {
  name: 'SearchPage',
  data(){
    return {
      similarNFTs: {},
      searchStarted: false,
      multiScaleLoading: true
    }
  },
  components: { UploadCard, ChartCard, ImageCardGroup },
  methods: {
    async searchForNFTs(base64EncodedString){
      this.searchStarted = true;
      await new Promise(r => setTimeout(r, 10000));
      this.multiScaleLoading = false;
    }
  }
}
</script>

<style scoped>
.graph-image-container{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(325px, 1fr));
  margin: 25px 25px 12px 25px;
}

 @media only screen and (min-width: 992px) {
  .middle-margin-modifier{
    margin-left: 25px;
  }

  .margin-modifier{
    margin-left: 25px;
    margin-right: 25px;
  }
}
</style>
