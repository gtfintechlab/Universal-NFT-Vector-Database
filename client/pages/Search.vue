<template>
  <div>
    <div class="graph-image-container">
        <UploadCard @runSearch="processImage" height="300px"/>
        <ChartCard v-if="searchStarted" :isLoading="multiScaleLoading"
                                        :height="300"
                                        :config="chartConfig"
                                        />
    </div>
    <div class="margin-modifier">
      <h2>Explore Similar NFTs</h2>
      <ImageCardGroup :config="imageGroupConfig" :isLoading="imageGroupLoad"></ImageCardGroup>
    </div>
  </div>
</template>

<script>

import UploadCard from '../components/UploadCard.vue'
import ChartCard from '../components/ChartCard.vue'
import ImageCardGroup from '~~/components/Groups/ImageCardGroup.vue'
import { noImageLoaded } from '~~/utils/Config'
import { searchClosestNFTs, getMultidimensionalScaling } from '../api-src/Search'

export default {
  name: 'SearchPage',
  data(){
    return {
      similarNFTs: {},
      searchStarted: false,
      multiScaleLoading: true,
      imageAndGraphHeight: "300px",
      chartConfig: [],
      imageGroupConfig: noImageLoaded,
      imageGroupLoad: false,
      topNfts: [],
      sourceVector: []
    }
  },
  components: { UploadCard, ChartCard, ImageCardGroup },
  methods: {
    async processImage(base64EncodedString){
      this.searchStarted = true;
      this.imageGroupLoad = true;
      this.multiScaleLoading = true;
      this.imageGroupConfig = noImageLoaded;

      await this.searchForNFTs(base64EncodedString);
      await this.multidimensionalScaling();
    },
    async searchForNFTs(base64EncodedString){
      const result = await searchClosestNFTs(base64EncodedString, 100, true, true);
      const topNfts = result.matches;
      this.topNfts = topNfts;
      this.sourceVector = result.source;

      const imageCardsConfig = [];
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
      this.imageGroupLoad = false;
    },

    async multidimensionalScaling(){
      const vectorDict = {};
      const parsedTopNFTs = JSON.parse(JSON.stringify(this.topNfts));
      const sourceVector = JSON.parse(JSON.stringify(this.sourceVector));

      parsedTopNFTs.map((nft) => {
        vectorDict[nft.id] = nft.values;
      })

      vectorDict['source'] = sourceVector;
      
      const multidimensionalScalingResult = await getMultidimensionalScaling(vectorDict);
      const sourceDataset = {
        label: 'Source Image',
        fill: false,
        borderColor: '#f87979',
        backgroundColor: '#f87979',
        data: [
          {
            x: multidimensionalScalingResult['source'][0],
            y: multidimensionalScalingResult['source'][1]
          }
        ]
      };

      delete multidimensionalScalingResult['source'];

      const similarNFTDataset = {
        label: 'Similar NFTs',
        fill: false,
        borderColor: '#7acbf9',
        backgroundColor: '#7acbf9',
        data: []
      };

      for (const [key, value] of Object.entries(multidimensionalScalingResult)) {
        similarNFTDataset.data.push({
          x: value[0],
          y: value[1]
        });
      }
      
      this.chartConfig = {datasets: [sourceDataset, similarNFTDataset]};
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
