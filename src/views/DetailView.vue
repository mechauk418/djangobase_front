<template>
  <div>
    <h1 style="margin-top: 50px; margin-bottom: 50px;"> 문의 </h1>
    <div class="article_box">
      <div class="title"><p>{{article_title }}</p></div>
      <div class="writer"><p> 작성자 :  {{ article_user }}</p> </div>
      <div class="imgbox" v-for="image in article_image" :key="image" style="text-align: start; margin-left: 1.5rem; margin-bottom: 2rem;">
        <img :src="image.image_original" v-if="image.image == null">
        <img :src="image.image" v-else>
      </div>
      <div class="content"> <p> {{ article_content }}</p></div>
      <div>
        <button @click="like_article" class="btn_like"> 추천 </button>
      </div>
      <div class="div_btn">
        <button @click="modify_article" class="btn_crud"> 수정 </button>
        <button @click="delete_article" class="btn_crud"> 삭제 </button>
        <router-link to="/articles"> <button class="btn_crud"> 목록 </button></router-link>
      </div>
      <div v-for="(comment,index) in comments_list" :key="index" style="margin:2rem 0">
        <div class="comment">
          <div class="comment_user">
            <p> {{comment.create_username  }} </p>
          </div>
          <div class="comment_content">
            <p> {{comment.content  }} </p>
          </div>
          <div class="comment_button" style="display: flex; align-items: center; width: 10%; margin-left: 20px; justify-content: center; flex-direction: column;">
            <button type="button" :class="`${comment.pk}`" @click="commentDelete(comment.pk)" style="background-color: rgb(255, 255, 255); border: 1px solid black;">삭제</button>
            <!-- <div v-if="show[index]" >
              <button type="button" :class="`${comment.pk}`" @click="commentDelete(comment.pk)" style="background-color: rgb(164, 161, 161); border: 0;">삭제</button>
            </div> -->
          </div>
        </div>
      </div>
      <form @submit.prevent="create_comment" class="myform">
        <div class="input-wrap">
          <div>
            <input type="text" id="createuser" v-model="createuser" autocomplete="off" style="margin-bottom: 10px;">  
            <input type="password" id="password" v-model="password" autocomplete="off">  
          </div>
          <input type="text" id="comment" v-model="comments_content" autocomplete="off">
          <button type="submit" style="cursor:pointer;">작성</button>
        </div>
      </form>
    </div>

  </div>

</template>

<script>
import axios from 'axios'
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
      comment_delete_password:'',
    }
  },
  mounted() {
    axios({
      method: "GET",
      url: 'http://127.0.0.1:8000/article/' + this.$route.params.pk + '/',
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
      this.show = Array(this.comments_list.length).fill(false)
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
      const comment_data = {
        'content': this.comments_content,
        'createuser': this.createuser,
        'password': this.password,
        'article':this.$route.params.pk
      }
      axios.post('http://127.0.0.1:8000/article/' + `${this.$route.params.pk}/comment/`, comment_data)
          .then((response) => {
            axios({ // 댓글 작성해서 리스트를 다시 불러옴
              method: 'GET',
              url: 'http://127.0.0.1:8000/article/' + this.$route.params.pk + '/',
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
    },
    commentDelete(pk) {
      axios.delete('http://127.0.0.1:8000/article/' + `${this.$route.params.pk}/comment/${pk}`)
        .then((response) => {
          axios({ // 댓글 작성해서 리스트를 다시 불러옴
            method: 'GET',
            url: 'http://127.0.0.1:8000/article/' + this.$route.params.pk + '/',
          })
          .then(response => {
            this.article = res.data
            this.article_title = res.data.title
            this.article_content = res.data.content
            this.article_user = res.data.createuser
            this.article_image = res.data.images
            this.comments_list = res.data.comments
          })
        })
    },

  },
}
</script>

<style scoped>

.article_box {
  border: 1px solid black;
  border-radius: 1cm;
  padding: 2rem;
  margin:0 auto;
  width:1200px;
}

.title {
  text-align: left;
  font-size : 1.5rem;
  margin-left: 1.5rem;
  margin-bottom: 2rem;
}

.writer {
  text-align: right;
  font-size : 1rem;
  margin-bottom: 8rem;
}

.content {
  text-align: left;
  font-size : 1rem;
  margin-left: 1.5rem;
  margin-bottom: 8rem;
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
  margin-bottom : 0.5rem;
  margin-top : 0.5rem;
  padding:1rem;

}

.comment {
  display : flex;
  margin-left: 50px;
}

.comment_user{
  padding: 0.5rem;
  margin: 0.5rem;
  width:15%;
}

.comment_content{
  padding: 0.5rem;
  margin: 0.5rem;
  width : 70%;
  text-align: left;
}


.btn_like{
  width:100px;
  height: 50px;
  margin: 5px;
  font-size: larger;
  background-color: white;
  border: 1px solid black;
  margin-bottom: 20px;
}

.div_btn{
  display: flex;
  justify-content: end;
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