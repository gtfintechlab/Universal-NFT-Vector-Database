<template>
  <!-- <button @click="processContracts">Process Next Contracts</button> -->
</template>

<script>
import { processNextContracts } from '~~/api-src/GraphProtocol'

export default {
  name: 'AdminPage',
  methods: {
    async processContracts(){
      const result = await processNextContracts();
      console.log("Hello World")
      console.log(result);
    }
  }
}
</script>
