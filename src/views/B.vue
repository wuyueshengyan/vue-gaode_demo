<template>
    <div>
        <A ref="A"> </A>
        <button @click="add">父组件</button>
    </div>
</template>
 
<script>
import A from '@/components/A.vue'
export default {
    components:{
        A
    },
  data() {
    return {
        sss: 54688
    }
  },
  methods:{
      add(){
          console.log(this.$refs.A.msg)
          this.$refs.A.msg = this.sss
      }
  }

}
</script>
 
<style scoped>
</style>