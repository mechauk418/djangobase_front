<template>
  <div>
    <h1 style="margin-top: 50px; margin-bottom: 50px;"> 자유게시판 </h1>
    <div class="article_box">
      <div class="title"><p>[{{subject}}] {{article_title }}</p></div>
      <div class="writer">
        <p> {{ article_user }}</p> 
        <p style="left:80%"> {{ created_at }}</p>
      </div>
      <div style="border-bottom: 1px solid black; margin-top:3rem; margin-bottom: 5rem;">
      </div>
      <div class="imgbox" v-for="image in article_image" :key="image" style="text-align: start; margin-left: 1.5rem; margin-bottom: 2rem;">
        <img :src="image.image_original" v-if="image.image == null">
        <img :src="image.image" v-else>
      </div>
      <div class="content"> <p> {{ article_content }}</p></div>
      <div>
        <button @click="like_article()" class="btn_like"> {{ article_like }} 추천 </button>
      </div>
      <div class="div_btn">
        <button v-if="login_user==article_user" @click="modify_article" class="btn_crud"> 수정 </button>
        <button v-if="login_user==article_user" @click="delete_article" class="btn_crud"> 삭제 </button>
        <button @click="back_btn" class="btn_crud"> 목록 </button>
      </div>
      <div style="border:0.5px solid black; border-radius: 10px; width:100%; height: 30px; display: flex; align-items: center; background-color: whitesmoke;">
        <p style="margin:0px; margin-left:1rem; text-align: start;"> 댓글 {{comments_list.length}} 개</p>
      </div>
      <div v-for="(comment,index) in comments_list" :key="index" >
        <div class="comment">
          <div style="width:90%">
            <div class="comment_user">
              <p style="margin-top:0px;margin-bottom: 0px; font-weight: 900;"> {{comment.create_username  }} </p>
            </div>
            <div class="comment_content">
              <p>{{comment.content }}</p>
            </div>
          </div>
          <div class="comment_button" style="display: flex; align-items: center; width: 10%; margin-left: 20px; justify-content: center;">
            <button v-if="login_user" type="button" :class="`${comment.pk}`" @click="commentLike(comment.pk)" style="background-color: rgb(255, 255, 255); border: 1px solid black; margin-right: 1rem;">{{comment.like_count}} 추천</button>
            <button v-if="login_user==comment.create_username" type="button" :class="`${comment.pk}`" @click="commentDelete(comment.pk)" style="background-color: rgb(255, 255, 255); border: 1px solid black;">삭제</button>
          </div>
        </div>
      </div>
      <form @submit.prevent="create_comment" class="myform">
        <p style="text-align: start; font-size: larger;"> 댓글 쓰기 </p>
        <div class="input-wrap">
          <textarea id="comment" v-model="comments_content" autocomplete="off"></textarea>
          <button type="submit" style="cursor:pointer;">작성</button>
        </div>
      </form>
    </div>

  </div>

</template>

<script>
import axios from 'axios'
import loginStore from '../store/index'
import testaxios from '../../src/axios'
// @ is an alias to /src
export default {
  data() {
    return {
      article:null,
      article_title:null,
      article_content:null,
      article_user:null,
      article_image : [],
      comments_content:null,
      comments_list : [],
      show:[],
      createuser:'',
      password:'',
      login_user:null,
      created_at:null,
      article_like:null,
      subject:null,
    }
  },
  mounted() {
    if (loginStore.state.loginStore.isLogin) {
      this.login_user = loginStore.state.loginStore.userInfo.username
    }
    axios({
      method: "GET",
      url: 'http://localhost:8000/api/article/' + this.$route.params.pk + '/',
      withCredentials:true
    })
    .then(res =>{
      this.article = res.data
      this.article_title = res.data.title
      this.article_content = res.data.content
      this.article_user = res.data.create_username
      this.article_like = res.data.like_count
      this.article_image = res.data.images
      this.comments_list = res.data.comments
      this.subject = res.data.subject
      this.show = Array(this.comments_list.length).fill(false)
      this.created_at = res.data.created_at.slice(0,4) +'.' + res.data.created_at.slice(5,7) +'.' +res.data.created_at.slice(8,10) +' ㅤ'+res.data.created_at.slice(11,16)
    })

  },
  methods: {
    toggle(index) {
      this.show.splice(index,1,!this.show[index])
    },
    delete_article() {
      this.$router.push({ name: 'delete', params: { pk: this.$route.params.pk } })
    },
    modify_article() {
      this.$router.push({ name: 'modify', params: { pk: this.$route.params.pk } })
    },
    create_comment() {
      if (this.login_user==null) {
        alert('로그인이 필요합니다.')
      } else {
        const comment_data = {
          'content': this.comments_content,
        }
        testaxios.post('http://localhost:8000/api/article/' + `${this.$route.params.pk}/comment/`, comment_data,
        {headers:{Authorization: 'Bearer ' + localStorage.getItem('access_token')}})
        .then((response) => {
          axios({ // 댓글 작성해서 리스트를 다시 불러옴
            method: 'GET',
            url: 'http://localhost:8000/api/article/' + this.$route.params.pk + '/',
          })
          .then(res => {
            this.article = res.data
            this.article_title = res.data.title
            this.article_content = res.data.content
            this.article_user = res.data.createuser
            this.article_image = res.data.images
            this.comments_list = res.data.comments
          })
          .catch(response => {
          })
        })
      }
    },
    commentDelete(pk) {
      testaxios.delete('http://localhost:8000/api/article/' + `${this.$route.params.pk}/comment/${pk}`,
      {headers:{Authorization: 'Bearer ' + localStorage.getItem('access_token')} ,withCredentials: true} )
        .then(response => {
          axios({ // 댓글 작성해서 리스트를 다시 불러옴
            method: 'GET',
            url: 'http://localhost:8000/api/article/' + this.$route.params.pk + '/',
          })
          .then(res => {
            this.article = res.data
            this.comments_list = res.data.comments
          })
        })
    },
    commentLike(pk) {
      if (this.login_user==null){
        alert('로그인이 필요합니다.')
      } else {
        testaxios.post('http://localhost:8000/api/article/' + `${this.$route.params.pk}/comment/${pk}`+'/like/',
        {headers:{Authorization: 'Bearer ' + localStorage.getItem('access_token')} ,withCredentials: true} )
          .then((response) => {
            if (response.data.response=='이미 추천하셨습니다.') {
              alert('이미 추천하셨습니다.')
            } else {
              axios({
                method: 'GET',
                url: 'http://localhost:8000/api/article/' + this.$route.params.pk + '/',
              })
              .then(res => {
                this.article = res.data
                this.comments_list = res.data.comments
              })
            }
          })
      }
    },
    like_article(){
      if (this.login_user==null){
        alert('로그인이 필요합니다.')
      } else {
        testaxios.post('http://localhost:8000/api/article/' + `${this.$route.params.pk}/like/`,
        {headers:{Authorization: 'Bearer ' + localStorage.getItem('access_token')}})
        .then((response) => {
          if (response.data.response=='이미 추천하셨습니다.') {
            alert('이미 추천하셨습니다.')
          } else {
            axios({
              method: "GET",
              url: 'http://localhost:8000/api/article/' + this.$route.params.pk + '/',
              withCredentials:true
            })
            .then(res =>{
              this.article_like = res.data.like_count
            })
          }

        })
      }
    },
    back_btn(){
      this.$router.go(-1)
    }

  },
}
</script>

<style scoped>

.article_box {

  padding: 2rem;
  margin:0 auto;
  width:1200px;
}

.title {
  text-align: left;
  font-size : 2rem;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  background-color: rgb(237, 239, 241);
}

.title >p{
  margin-left:1.5rem;
  margin-top:10px;
  margin-bottom: 10px;
}

.writer {
  text-align: right;
  position: relative;
}

.writer > p {
  font-size :1.2rem;
  margin-top:10px;
  text-align: start;
  margin-left:1.5rem;
  position: absolute;
}

.content {
  text-align: left;
  font-size : 1rem;
  margin-left: 1.5rem;
  margin-bottom: 8rem;
}

.content > p {
  font-size:1.2rem;
  text-align: start;
  margin-bottom: 0px;
  margin-top:0px;
  width:90%;
  word-break: break-all;
}

.btn{
  margin:0.2rem
}

.input-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  height: 80px;
}

.input-wrap>input {
  width: 90%;
  height: 50px;
  border-radius: 3px;
  border: 1px solid black;
  padding: 0 20px;
  font-size: 16px;
}

.input-wrap>button {
  width: 90px;
  height: 33px;
  margin-left: 15px;
  background-color: rgb(73, 73, 73);
  color: white;
  font-size: 16px;
  border: 0;
  border-radius: 3px;
}

.myform {
  margin-top : 3rem;
  padding:1rem;
  border:1px solid rgb(175, 162, 162);
  border-radius: 10px;

}

#comment {
  display : flex;
  height: 80px;
  width:100%;
  text-align: start;
  resize: none;
  font-size: 1rem;
}

.comment {
  display: flex;
  height: auto;
  margin-bottom: 10px;
}

.comment_user{
  padding: 0.5rem;
  margin: 0.3rem;
  width:15%;
  text-align: start;
}

.comment_content{
  padding: 0.5rem;
  width:100%;
}

.comment_content > p{
  text-align: start;
  margin-left:0.3rem;
  margin-bottom: 0px;
  margin-top:0px;
  width:100%;
  word-break: break-all;
}

.btn_like{
  width:100px;
  height: 50px;
  margin: 5px;
  font-size: larger;
  background-color: white;
  border: 1px solid black;
  margin-bottom: 20px;
  border-radius: 5px;
}

.div_btn{
  display: flex;
  justify-content: end;
  margin-bottom: 2rem;
}

.btn_crud{
  background-color: white;
  border: 1px solid black;
  margin-right: 8px;
  margin-top:30px;
  width:50px;
  height: 25px;
}

</style>