<template>
  <iframe :src="`${backendServer}/ureport/designer`"
          style="width: 100%;height: 800px"/>
</template>

<script>
import {backendServer} from '@/api/index'
export default {
  name: "Report",
  data() {
    return {
      backendServer: backendServer
    }
  },
}
</script>

<style scoped>

</style>
