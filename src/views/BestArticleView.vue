<template>
  <div>
    <h1 style="margin-top: 50px; margin-bottom: 50px;"> 자유게시판 </h1>
    <div class="bestarticle" style="width:80%; margin: 0 auto; margin-bottom: 30px;">
      <div>
        <p style="margin:3rem; font-size: larger;"> 글을 자유롭게 남겨주세요 </p>
      </div>
    </div>
    <div class="container">
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

      <table style="margin : 0 auto; width:80%; border-collapse: collapse; margin-bottom: 2rem;">
        <tr style="height: 3rem;">
          <th style="font-size: 13px;"> 글번호 </th>
          <th style="font-size: 13px;"> 말머리 </th>
          <th style="width:50%; font-size: 13px;"> 제목 </th>
          <th style="width:20%; font-size: 13px;"> 작성자 </th>
          <th style="font-size: 13px;"> 작성일 </th>
          <th style="font-size: 13px;"> 조회수 </th>
          <th style="font-size: 13px;"> 추천수 </th>
        </tr>
        <tr v-for="(article, index) in articles" :key="index" class="list">
          <td><p> {{ article.pk }}  </p> </td>
          <td><p :class="`font${article.subject}`"> {{ article.subject }}  </p> </td>
          <td style="text-align: start; padding-left: 2rem;"><router-link style="color:black; text-decoration-line: none;" :to="{name:'detail', params:{pk:article.pk}}">{{ article.title }} </router-link></td>
          <td><p> {{ article.create_username }}  </p> </td>
          <td><p> {{ article.created_at.slice(5,10) }}  </p> </td>
          <td><p> {{ article.hits }}  </p> </td>
          <td><p> {{ article.like_count }}  </p> </td>
        </tr>
      </table>
      <div class="btn_write">
        <router-link :to="{name:'create'}">
          <button style="background-color: white; border: 1px solid black; width:100px; height: 40px; font-size: large;"> 글 쓰기 </button>
        </router-link>
      </div>
      <div style="display: flex; justify-content: center;">
        <el-pagination v-if="total_pages"
        layout="prev, pager, next"
        :page-size="20"
        :total="total_pages"
        :current-page="current_page"
        @current-change=page_change
        />
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'
import testaxios from '@/axios';
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
      total_pages:null,
      current_page:null,
    }
  },
  mounted() {
    const url = new URL(window.location.href);
    const urlParams = url.searchParams
    let test_page = urlParams.get('pages')
    if (test_page==null){
      testaxios.get('https://api.isdfans.site/api/article/bestarticle/')
      .then(response => {
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
      })
    } else {
      testaxios.get('https://api.isdfans.site/api/article/bestarticle/'+'?page='+test_page)
      .then(response => {
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
      })
    }

  },
  methods:{
    page_change(val){
      this.current_page = val;
      if (this.current_page==1) {
        this.$router.push({ name: 'articles'})
        testaxios.get('https://api.isdfans.site/api/article/bestarticle/')
        .then(response => {
          this.articles = response.data.results
          this.current_page = response.data.curPage
          this.total_pages = response.data.itemcount
        })
      } else {
        this.$router.push({ name: 'articles', query: { pages: this.current_page} })
        testaxios.get('https://api.isdfans.site/api/article/bestarticle/' + '?page='+this.current_page)
        .then(response => {
          this.articles = response.data.results
          this.current_page = response.data.curPage
          this.total_pages = response.data.itemcount
        })
      }
      
    }
  }
}
</script>

<style scoped>

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

.font일반{
  color: blue;
  font-weight: bold;
}

.font정보{
  color: green;
  font-weight: bold;
}

.font사진{
  color: rgb(167, 165, 26);
  font-weight: bold;
}

.font자랑{
  color: rgb(225, 80, 80);
  font-weight: bold;
}

.container{
  width:60%; 
  margin:0 auto;
}

.btn_write {
  display: flex;
  justify-content: end;
  width:80%;
  margin: 0 auto;
  margin-bottom: 1rem;
}

@media (max-width:1500px) {

  .container{
    width:90%; 
    margin:0 auto;
  }

}




</style>

