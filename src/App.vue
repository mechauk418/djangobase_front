<template>
  <nav>
    <div style="width:100%;">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/articles">Article</router-link> |
      <a @click="refresh()"> refresh </a>
    </div>
    <div v-show="!logincheck" style="position: absolute; left: 70%;">
      <input type="text" id="email" v-model="input_email" autocomplete="off" style="margin-left:3px; margin-right: 3px; width: 7rem;" placeholder="아이디">
      <input type="password" id="password" v-model="input_password" autocomplete="off" style="margin-left:3px; margin-right: 3px; width: 7rem;" placeholder="비밀번호">
      <button @click="loginbtn()" style="border: 1px solid black; background-color: white; margin-left:3px; margin-right: 3px;" > 로그인 </button>
    </div>
    

    <div v-show="logincheck" style="position: absolute; left: 70%;">
      <span style="margin-right: 2rem; font-weight: bold;"> {{login_user}}님</span> 
      <button @click="logoutplz()">로그아웃</button>
    </div>
  </nav>
  <router-view/>
</template>

<script>
import axios from 'axios'
import loginStore from './store/index'
export default {
  data () {
    return {
      input_email:null,
      input_password:null,
      logincheck:false,
      login_user:null
    }

  },
  mounted () {
    this.logincheck = loginStore.state.loginStore.isLogin
    if (loginStore.state.loginStore.isLogin) {
      this.login_user = loginStore.state.loginStore.userInfo.username
    }
  },
  methods:{
    loginbtn () {
      const createdata = new FormData()
      createdata.append('email',this.input_email)
      createdata.append('password',this.input_password)
      axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/accounts/login/', 
        data: createdata,
        withCredentials:true,
      })
      .then(response=>{
        console.log(response)
        this.$store.dispatch('login',createdata)
      })
    },
    logoutplz() {
      this.$store.dispatch('logouttest_act')
    },
    refresh() {
      axios({
        method : 'POST',
        url : 'http://127.0.0.1:8000/accounts/token/refresh/',
        withCredentials : true
      })
      .then(res=>{
        console.log(res)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  /* display: flex; */
  position: relative;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
