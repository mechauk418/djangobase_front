<template>
  <div class="delete_main">
    <h1> 이 게시물을 진짜 삭제하시겠습니까? </h1>
    <button @click="checkbtn" style="margin-left: auto;"> 확인 </button>
  </div>
</template>

<script>
import axios from 'axios'
import testaxios from '../../src/axios'
// @ is an alias to /src
export default {
  data () {
    return {
      password:'',
    }
  },
  methods:{
    checkbtn() {
      testaxios.delete('https://api.isdfans.site/api/article/' + this.$route.params.pk + '/')
      .then(res => {
        this.$router.push({name:'articles'})
        })
      },
    routerbtn() {
      this.$router.push('../../articles')
    }
  }
}
</script>
<style scoped>



</style>