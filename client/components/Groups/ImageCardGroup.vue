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
    minWidth: {
      type: String,
      default: '200px',
      required: false
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

    .card-group-container{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(v-bind('minWidth'), 1fr));
        grid-column-gap: 23px;
        grid-row-gap: 23px;
    }

    .card{
        flex: 1 1;
    }
</style>
