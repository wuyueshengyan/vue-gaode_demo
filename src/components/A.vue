<template>
<div>
        <h1>{{msg}}</h1>
        <button @click="init">拿值</button>
</div>

  
</template>
 
<script>
export default {

  data() {
    return {
        msg:'123'
    }
  },
  methods:{
      init(msg){
        //   console.log(this.$refs)
        //   console.log(msg)
        //  this.msg = this.$refs.sss
      }
  }

}
</script>
 
<style scoped>
</style>