<template>
  <div class="delete_main">
    <h1> 비밀번호를 입력해주세요 </h1>
    <input type="password" id="password" v-model="password" class="input-text" style="width:500px;">
    <button @click="checkbtn" style="margin-left: auto;"> 확인 </button>
  </div>
</template>

<script>
import axios from 'axios'
// @ is an alias to /src
export default {
  data () {
    return {
      password:'',
    }
  },
  methods:{
    checkbtn() {
      axios.post("http://127.0.0.1:8000/article/checkarticle/", {password:this.password, article_pk:this.$route.params.pk})
      .then(res => {
        if (res.data.result=='True') {
          axios.delete('http://127.0.0.1:8000/article/' + this.$route.params.pk + '/')
          .then(res => {
            this.$router.push({name:'articles'})
          })
        } else {
          alert('비밀번호가 다릅니다')
        }

      }

      )

    },
    routerbtn() {
      this.$router.push('../../articles')
    }
  }
}
</script>
<style scoped>



</style>