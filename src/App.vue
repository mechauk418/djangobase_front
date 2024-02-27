<template>
  <nav>
    <div>
      <input type="text" id="email" v-model="input_email" autocomplete="off" style="margin-left:3px; margin-right: 3px;">
      <input type="password" id="password" v-model="input_password" autocomplete="off" style="margin-left:3px; margin-right: 3px;">
      <button @click="loginbtn()" style="border: 1px solid black; background-color: white; margin-left:3px; margin-right: 3px;" > 로그인 </button>
    </div>

    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/articles">Article</router-link>
  </nav>
  <router-view/>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      input_email:null,
      input_password:null
    }

  },
  mounted () {
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
      })
      .then(response=>{
        console.log(response)
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
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
