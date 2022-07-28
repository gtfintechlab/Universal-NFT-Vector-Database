<template>
  <div class="card-container">
    <h1 v-if="!isLoading" class="title-text">
      {{ title }}
    </h1>
    <h2 v-if="!isLoading" class="statistic-text">
      {{ statistic }}
    </h2>
    <h3 v-if="!isLoading" class="subtitle-text">
      {{ subtitle }}
    </h3>
    <PulseLoader v-if="isLoading" color="#16324C" class="vue-spinner" />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'AnalyticsCard',
  components: { PulseLoader },
  props: {
    title: {
      type: String,
      default: 'Total NFTs in Vector Database',
      required: false
    },
    statistic: {
      type: String,
      default: '500,230',
      required: false
    },
    subtitle: {
      type: String,
      default: '432,000 in Task Queue',
      required: false
    },
    width: {
      type: String,
      default: '40%',
      required: false
    },
    isLoading: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>

<style scoped>
h1, h2, h3{
    margin: 0;
}
.card-container{
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
}

.vue-spinner{
    align-self: center;
    justify-self: center;
}

.title-text{
    font-family: 'Outfit';
    color: #000000;
    opacity: 50%;
    font-size: 1.4rem;
    font-weight: 400;
    margin-bottom: 23px;
}

.statistic-text{
    font-family: "Inter";
    font-weight: 900;
    font-size: 2rem;
    margin-bottom: 12px;
}
.subtitle-text{
    font-family: "Inter";
    font-weight: 400;
    font-size: 1rem;
}
</style>
