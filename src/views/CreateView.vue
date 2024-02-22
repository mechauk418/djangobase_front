<template>
  <div>
    <h1 style="margin-top: 50px; margin-bottom: 50px;"> 문의 </h1>
    <div class="articlebox">
      <div class="articletitle">
        <div style="width:200px;">
          <label for="subject">말머리 </label>
          <select v-model="selected2">
            <option v-for="item in selectList" :key="item.value" :value="item.name"> {{ item.name }}</option>
          </select>
        </div>
        <div style="width:600px; text-align: left;">
          <label for="title">제목 </label>
          <input type="text" id="title" v-model="title" class="input-text" style="width:70%;">
        </div>
      </div>

      <div style="display: flex;">
        <div style="width:400px; text-align: left;">
          <label for="createuser">작성자 </label>
          <input type="text" id="createuser" v-model="createuser" class="input-text" style="width:70%;">
        </div>
        <div style="width:400px; text-align: left;">
          <label for="password">비밀번호 </label>
          <input type="password" id="password" v-model="password" class="input-text" style="width:70%;">
        </div>
      </div>

      <div class="articlecontent">
        <textarea v-model="content" id="content"></textarea>
      </div>
      <div style="display: flex; margin-left:25px; margin-top:20px;">
        <input multiple @change="OnArticleImage()" ref="ArticleImage" type="file" style="margin-right: auto;" />
      </div>
      <div style="display: flex; margin-right:20px; margin-top:20px;">
        <button @click="create" style="margin-left: auto;"> 글 쓰기 </button>
      </div>
    </div>
  </div>
</template>
    
<script>
import axios from 'axios'
export default {
  data () {
    return {
      title: '',
      content: '',
      createuser:'',
      password:'',
      images:'',
      images2:'',
      selected2: "0",
      selectList: [
        { name: "일반", value: "0" },
        { name: "건의사항", value: "1" },
        { name: "오류제보", value: "2" },
      ],
    }
  },
  mounted() {
    // this.islogin = loginStore.state.loginStore.isLogin
    // if (this.islogin) {

    // } else {
    //   alert('로그인해주세요')
    //   this.$router.go(-1)
    // }
  },
  methods:{
    create () {
      const createdata = new FormData()
      // createdata.title = this.title
      // createdata.content = this.content
      // createdata.images = this.images
      createdata.append('title',this.title)
      createdata.append('content',this.content)
      createdata.append('createuser',this.createuser)
      createdata.append('password',this.password)
      createdata.append('subject',this.selected2)
      for (const i of this.images) {
        createdata.append('image',i)
        console.log(i)
      }
      console.log(createdata)
      axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/article/', 
        data: createdata,
        withCredentials : true,
        headers:{
          'Content-Type': 'multipart/form-data'
        }
        
      })
      .then(response => {
        const article_pk = response.data.pk
        this.$router.push({name:'articles', params:{pk:article_pk}})
      })
    },
    OnArticleImage() {
      this.images = this.$refs.ArticleImage.files
    },
  }
}
</script>
    
<style>
  .articlebox {
    width : 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid black;
  }
  .articletitle {
    display: flex;
    margin-bottom: 20px;

  }
  .articlecontent{
    width:750px;
    margin: 0px auto;
  }
  textarea {
    width:750px;
    height: 600px;
    resize: none;
    margin-bottom: 20px;
    font-size: medium;
    font-family: 'Courier New', Courier, monospace;
  }
</style>