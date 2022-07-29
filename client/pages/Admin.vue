<template>
  <button @click="processContracts">Process Next Contracts</button>
</template>

<script>
import { processNextContracts } from '~~/api/GraphProtocol'

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
