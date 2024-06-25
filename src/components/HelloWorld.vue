<template>
  <div class="vlog" style="margin-top:10%">
    <h1> DRF를 활용한 게시판 제작111 </h1>
    <h1> 사용 툴 : Python, DRF, Vue,postgresql, Docker, AWS EC2 </h1>

    <p @click="vlog" class="home_link"> Velog </p>
    <p @click="github" class="home_link"> Github (Backend) </p>
    <p @click="github_front" class="home_link"> Github (Frontend) </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  mounted(){
  },
  methods:{
    vlog(){
      window.open('https://velog.io/@mechauk418/series/FastAPI%EB%A1%9C-%EA%B2%8C%EC%8B%9C%ED%8C%90-%EB%A7%8C%EB%93%A4%EA%B8%B0')
    },
    github(){
      window.open('https://github.com/mechauk418/djangobase')
    },
    github_front(){
      window.open('https://github.com/mechauk418/djangobase_front')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.home_link{
  text-decoration: underline;
}

</style>
