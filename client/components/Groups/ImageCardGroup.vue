<template>
  <div class="card-group-container">
    <ImageCard
      v-for="(card, index) in config"
      :key="index"
      :title="card.title"
      :image-u-r-l="card.imageURL"
      :subtitle="card.subtitle"
      :is-loading="isLoading"
      class="card"
    />
  </div>
</template>

<script>
import { mockImageCardGroup } from '../../utils/MockData'
import ImageCard from '../ImageCard.vue'

export default {
  name: 'ImageCardGroup',
  components: { ImageCard },
  props: {
    config: {
      type: null,
      default: mockImageCardGroup,
      required: false
    },
    direction: {
      type: String,
      default: 'row',
      required: false
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: false
    },
    numCards: {
      type: Number,
      default: 4,
      required: false
    }
  },
  data () {
    return {
      configLength: this.config.length
    }
  }
}
</script>

<style lang="scss" scoped>

    .card-group-container{
        margin: 25px;
        display: grid;
        // card width = 100% of container minus the gap space divided by number of cards
        grid-template-columns: repeat(v-bind('numCards'), calc((100% - (v-bind('numCards') - 1)*23px) / v-bind('numCards')));
        grid-column-gap: 23px;
        grid-row-gap: 23px;
    }

    .card{
        flex: 1 1;
    }
</style>
