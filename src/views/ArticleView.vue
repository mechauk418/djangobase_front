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
        <div style="margin-right:1rem;">
          <router-link :to="{name:'bestarticles'}">
            <button style="background-color: white; border: 1px solid black; width:100px; height: 40px; font-size: large; cursor: pointer;"> 인기글 </button>
          </router-link>
        </div>
        <div v-if="islogin" style="margin-right:1rem;">
          <router-link :to="{name:'myarticles'}">
            <button style="background-color: white; border: 1px solid black; width:100px; height: 40px; font-size: large; cursor: pointer;"> 내 글 </button>
          </router-link>
        </div>
        <div v-if="islogin">
          <router-link :to="{name:'mycomments'}">
            <button style="background-color: white; border: 1px solid black; width:100px; height: 40px; font-size: large; cursor: pointer;"> 내 댓글 </button>
          </router-link>
        </div>
      </div>
      
      <table style="margin : 0 auto; width:80%; border-collapse: collapse; margin-bottom: 2rem;">
        <tr>
          <th style="text-align: start; height: 3rem;" colspan="7">
            <span style="margin-left:3rem; cursor: pointer;" @click="subject_fliter1">일반</span>
            <span style="margin-left:3rem; cursor: pointer;" @click="subject_fliter2">정보</span>
            <span style="margin-left:3rem; cursor: pointer;" @click="subject_fliter3">사진</span>
            <span style="margin-left:3rem; cursor: pointer;" @click="subject_fliter4">자랑</span>
          </th>
        </tr>
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
          <button style="background-color: white; border: 1px solid black; width:100px; height: 40px; font-size: large; cursor: pointer;"> 글 쓰기 </button>
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
      <div style="height: 2rem; display: flex; margin-top:1rem; justify-content: center;">
        <select v-model="selected2" style="width: 10%;">
          <option v-for="item in selectList" :key="item.name" :value="item.name"> {{ item.name }}</option>
        </select>
        <input type="text" v-model="search_key" @keyup.enter="searchbtn" style="border: 1px solid black; width:20%;">
        <button @click="searchbtn" style="border: 0; background-color: white; width:5%;">
          <img src="../assets/searchicon.png" style="width:40%; cursor: pointer;">
        </button>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'
import loginStore from '../store/index'
export default {
  data () {
    return {
      articles: [],
      page_next:null,
      page_prev:null,
      islogin:false,
      year:null,
      month:null,
      date:null,
      total_pages:null,
      current_page:null,
      search_key:null,
      selected2: "제목",
      selectList: [
        { name: "제목"},
        { name: "내용"},
        { name: "제목+내용"},
        { name: "작성자"},
      ],
      search_subject:null,
    }
  },
  mounted() {
    if (loginStore.state.loginStore.isLogin) {
      this.islogin = loginStore.state.loginStore.isLogin
    }
    const url = new URL(window.location.href);
    const urlParams = url.searchParams
    let test_page = urlParams.get('pages')
    if (test_page==null){
      axios.get('https://api.isdfans.site/article/', {headers:{Authorization:null}})
      .then(response => {
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
      })
    } else {
      axios.get('https://api.isdfans.site/article/'+'?page='+test_page, {headers:{Authorization:null}})
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
        axios.get('https://api.isdfans.site/article/')
        .then(response => {
          this.articles = response.data.results
          this.current_page = response.data.curPage
          this.total_pages = response.data.itemcount
        })
      } else {
        this.$router.push({ name: 'articles', query: { pages: this.current_page} })
        axios.get('https://api.isdfans.site/article/' + '?page='+this.current_page, {headers:{Authorization:null}})
        .then(response => {
          this.articles = response.data.results
          this.current_page = response.data.curPage
          this.total_pages = response.data.itemcount
        })
      }
      
    },
    async searchbtn() {
      if (this.selected2=="제목") {
        this.search_subject="title_only"
      } else if (this.selected2=="내용") {
        this.search_subject="content_only"
      } else if (this.selected2=="제목+내용") {
        this.search_subject="title_content_only"
      } else {
        this.search_subject="create_user__username_only"
      }
      await axios.get("https://api.isdfans.site/article/?search=" + this.search_key + '&' + this.search_subject + '=True', {headers:{Authorization:null}})
      .then(response => {
        console.log(response)
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
        // this.$router.push('search/'+this.search_key)
      }
      )
    },
    subject_fliter1() {
      axios.get("https://api.isdfans.site/article/?subject="+"일반", {headers:{Authorization:null}})
      .then(response => {
        console.log(response)
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
        // this.$router.push('search/'+this.search_key)
      }
      )
    },
    subject_fliter2() {
      axios.get("https://api.isdfans.site/article/?subject="+"정보", {headers:{Authorization:null}})
      .then(response => {
        console.log(response)
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
        // this.$router.push('search/'+this.search_key)
      }
      )
    },
    subject_fliter3() {
      axios.get("https://api.isdfans.site/article/?subject="+"사진", {headers:{Authorization:null}})
      .then(response => {
        console.log(response)
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
        // this.$router.push('search/'+this.search_key)
      }
      )
    },
    subject_fliter4() {
      axios.get("https://api.isdfans.site/article/?subject="+"자랑", {headers:{Authorization:null}})
      .then(response => {
        console.log(response)
        this.articles = response.data.results
        this.current_page = response.data.curPage
        this.total_pages = response.data.itemcount
        // this.$router.push('search/'+this.search_key)
      }
      )
    },
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

