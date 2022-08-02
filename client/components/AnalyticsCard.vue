<template>
  <div class="card-container">
    <div class="content-container">
      <h1 v-if="!isLoading" class="title-text">
        {{ title }}
      </h1>
      <h2
        v-if="!isLoading"
        :class="{'statistic-text': statistic !== '',
                 'statistic-margin': subtitle !== '' && statistic !== ''
        }"
      >
        {{ statistic }}
      </h2>
      <h3 v-if="!isLoading && subtitle !== ''" class="subtitle-text">
        <span class="subtitle-topic">{{ subtitleTopic }}</span>{{ subtitle }}
      </h3>
    </div>
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
      default: '',
      required: false
    },
    subtitle: {
      type: String,
      default: '',
      required: false
    },
    subtitleTopic: {
      type: String,
      default: '',
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
    justify-content: baseline;
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
}
.statistic-margin{
  margin-bottom: 12px;
}
.subtitle-text{
    font-family: "Inter";
    font-weight: 400;
    font-size: 1rem;
    word-break: break-all;
}

.subtitle-topic{
  font-weight: bold;
}
.content-container{
  display: flex;
  flex-direction: column;
}
</style>
