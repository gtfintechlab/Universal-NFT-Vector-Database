<template>
  <div>
    <div class="graph-image-container">
        <UploadCard @runSearch="searchForNFTs" height="300px"/>
        <ChartCard v-if="searchStarted" :isLoading="multiScaleLoading"
                                        :height="300"
                                        />
    </div>
    <div class="margin-modifier">
      <h2>Explore Similar NFTs</h2>
      <ImageCardGroup :config="imageGroupConfig"></ImageCardGroup>
    </div>
  </div>
</template>

<script>

import UploadCard from '../components/UploadCard.vue'
import ChartCard from '../components/UploadCard.vue'
import ImageCardGroup from '~~/components/Groups/ImageCardGroup.vue'
import { noImageLoaded } from '~~/utils/Config'
import { searchClosestNFTs } from '../api/Search'

export default {
  name: 'SearchPage',
  data(){
    return {
      similarNFTs: {},
      searchStarted: false,
      multiScaleLoading: true,
      imageAndGraphHeight: "300px",
      imageGroupConfig: noImageLoaded
    }
  },
  components: { UploadCard, ChartCard, ImageCardGroup },
  methods: {
    async searchForNFTs(base64EncodedString){
      this.searchStarted = true;
      const result = await searchClosestNFTs(base64EncodedString, 100, true, true);
      const topNfts = result.matches;
      const imageCardsConfig = []
      topNfts.map((match) => {
        imageCardsConfig.push(
          {
            title: `Score: ${match.score.toLocaleString()}`,
            imageURL: match.metadata.media,
            subtitle: {'Contract': `${match.metadata.contract_address}`, 
                       'Token Id': `${match.metadata.token_id}`}
          }
        )
      });
      this.imageGroupConfig = imageCardsConfig;
      
      this.multiScaleLoading = false;
    }
  }
}
</script>

<style scoped>

  h2{
    font-family: 'Outfit';
    font-weight: 400;
    color: gray;
  }
  .graph-image-container{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(325px, 1fr));
    margin: 25px;
    grid-column-gap: 23px;
  }

  .margin-modifier{
    margin-left: 25px;
    margin-right: 25px;
    margin-bottom: 25px;
    margin-top: 0px;
  }

</style>
