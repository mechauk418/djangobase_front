<template>
  <div>
    <h1 style="margin-top: 50px; margin-bottom: 50px;"> 문의 </h1>
    <div class="bestarticle" style="width:80%; margin: 0 auto; margin-bottom: 30px;">
      <div>
        <p style="margin:3rem; font-size: larger;"> 건의사항이나 개선해야할 점, 오류 제보 등등 남겨주세요 </p>
      </div>
    </div>
    <div class="container" style="width:90%; margin:0 auto;">
      <div style="margin: 0 auto; display: flex; width:80%; height: 50px;">
        <div>
          <button @click="prev" v-if="page_prev"> 인기글 </button>
        </div>
        <div>
          <button @click="prev" v-if="page_prev"> 내 글 </button>
        </div>
        <div>
          <button @click="prev" v-if="page_prev"> 내 댓글 </button>
        </div>

      </div>
      <table style="margin : 0 auto; width:80%; border-collapse: collapse;">
        <tr>
          <th> 글번호 </th>
          <th> 말머리 </th>
          <th style="width:50%"> 제목 </th>
          <th> 작성자 </th>
          <th> 작성일 </th>
          <th> 조회수 </th>
        </tr>
        <tr v-for="(article, index) in articles" :key="index" class="list">
          <td><p> {{ article.pk }}  </p> </td>
          <td><p> {{ article.subject }}  </p> </td>
          <td><router-link :to="{name:'detail', params:{pk:article.pk}}">{{ article.title }} </router-link></td>
          <td><p> {{ article.create_username }}  </p> </td>
          <td><p> {{ article.created_at.slice(5,10) }}  </p> </td>
          <td><p> {{ article.hits }}  </p> </td>
        </tr>
      </table>
      <button @click="prev" v-if="page_prev"> 이전 페이지 </button>
      <button @click="next" v-if="page_next"> 다음 페이지 </button>
      <div>
        <router-link :to="{name:'create'}"><button> 글 쓰기 </button></router-link>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'
export default {
  data () {
    return {
      articles: [],
      page_next:null,
      page_prev:null,
      islogin:'',
      year:null,
      month:null,
      date:null,
    }
  },
  mounted() {
    axios.get('http://127.0.0.1:8000/article/')
    .then(response => {
      this.articles = response.data.results
      this.page_next= response.data.next
      this.page_prev = response.data.previous
      const today = new Date()
      this.year = today.getFullYear();
      this.month = today.getMonth();
      this.date = today.getDate();
    })
  },
  methods:{
    next(){
      axios.get(this.page_next)
      .then(response => {
        this.articles = response.data.results
        this.page_next= response.data.next
        this.page_prev = response.data.previous
      })
    },
    prev(){
      axios.get(this.page_prev)
      .then(response => {
        this.articles = response.data.results
        this.page_next= response.data.next
        this.page_prev = response.data.previous
      })
    }
  }
}
</script>

<style>

table {
  border: 1px solid rgba(169,169,169,0.3);
  
}

th{
  border-bottom: 1px solid rgba(169,169,169,0.3);
  border-top: 1px solid rgba(169,169,169,0.3);
}

td{
  border-bottom: 1px solid rgba(169,169,169,0.3);
  border-top: 1px solid rgba(169,169,169,0.3);
}


</style>
  
  