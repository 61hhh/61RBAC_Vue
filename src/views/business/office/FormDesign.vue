<template>
  <div>
    <iframe :src="`${server}`" style="width: 100%;height: 800px"/>
  </div>
</template>

<script>
export default {
  name: "FormDesign",
  data(){
    return{
      server: 'http://83945105.gitee.io/jvue/jform/#/designer?fullScreen=2'
      // server: 'https://mrhj.gitee.io/form-generator/#/'
    }
  }
}
</script>

<style scoped>

</style>
