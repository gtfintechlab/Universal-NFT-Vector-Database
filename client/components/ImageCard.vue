<template>
  <div class="card-container">
    <h1 v-if="!isLoading" class="title-text">
      {{ title }}
    </h1>
    <img v-if="!isLoading" :src="imageURL">
    <h3 v-for="(sub, index) in Object.keys(subtitle)" v-if="!isLoading" class="subtitle-text" :key="index">
      <span class="subtitle-topic">{{sub}}:</span> {{subtitle[sub]}}
      <br/>
      <br/>
    </h3>
    <PulseLoader v-if="isLoading" color="#16324C" class="vue-spinner" />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'ImageCard',
  components: { PulseLoader },
  props: {
    title: {
      type: String,
      default: 'Source NFT Searched',
      required: false
    },
    imageURL: {
      type: String,
      default: 'https://upload.wikimedia.org/wikipedia/en/0/07/Cryptopunks_general.jpg',
      required: false
    },
    subtitle: {
      type: null,
      default: 'Contract: 0x6KH5KJ6H54KHJHKJ4H5KJ3HK3EJ5H',
      required: false
    },
    width: {
      type: String,
      default: '40%',
      required: false
    },
    isLoading: {
      type: Boolean,
      default: false,
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
    justify-content: center;
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
    word-wrap: break-word;
}

img {
  border-radius: 5%;
  margin-bottom: 12px;
  width: 100%;
  align-self: center;
  height: 150px;
  object-fit: cover;
}

.subtitle-text{
    font-family: "Inter";
    font-weight: 400;
    font-size: 0.75rem;
    word-wrap: break-word;
    
}

.subtitle-topic{
  font-weight: bold;
}
</style>
