<template>
    <div>
      <div style="border: 1px solid black; margin-bottom: 5rem;">
        <h1> 주요 업무 </h1>
        <div>
          <div v-for="(task, index) in tasks" :key="index" style="display: flex;">
            <p> {{ task.id }}  </p>
            <!-- <td style="text-align: start; padding-left: 2rem;"><router-link style="color:black; text-decoration-line: none;" :to="{name:'detail', params:{pk:task.pk}}">{{ task.title }} </router-link -->
            <p> {{ task.create_user }}  </p>
            <p> {{ task.team }}  </p>
          </div>

        </div>

      </div>
      <div style="border: 1px solid black;">
        <h1> 하위 업무 </h1>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import testaxios from '@/axios'
  export default {
    data () {
      return {
        search_key:null,
        gamedetail: [],
        show : [],
        isLoading:false,
        tasks:null,
      }
  
    },
    mounted () {
      testaxios.get("http://127.0.0.1:8000/todo/mytask/")
      .then(res=>{
        this.tasks = res.data.results
      })
    },
    methods:{
      async searchbtn() {
        this.isLoading = true
        await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + this.search_key + '/20')
        .then(res => {
          console.log(res)
          this.isLoading = false
          this.$router.push('search/'+this.search_key)
        }
        )
      },
      toggle(index) {
        this.show.splice(index,1,!this.show[index])
      },
    }
  
  }
  </script>
  
  <style>
  
  .loading {
    top:0;
    left:0;
    height: 100%;
    width:100%;
    background-color: rgb(108, 106, 106);
    opacity: 0.7;
  }
  
  </style>