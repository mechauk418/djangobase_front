<template>
  <div class="backgrounddiv">
    <div v-show="isLoading" class="loading" > 
        <img src="../assets/vic.gif" style="height: 100%;">
    </div>
    <div class="container" v-show="!isLoading">
      <!-- <input type="text" v-model="search_key">
      <button @click="searchbtn"> 검색 </button> -->
      <div class="banner">
        <p style="margin: 2rem; color: white; font-weight: bold; font-size:50px"> {{ userstats.nickname }} </p>
        <button @click="refreshbtn" style="margin-right: 40px; width:120px; height: 30px; background-color: white;">  
          <p v-show="infoloading == false" style="margin:0"> 전적갱신 </p> 
          <div v-show="infoloading == true" style="display: flex; height: 100%; justify-content: center; align-items: center;">
            <p style="margin:0"> 갱신중 &nbsp;</p>
            <img src="../assets/loading.gif" style="height: 90%; background-color: white;">
          </div>
        </button>
        <div style="margin-left: auto; margin-right: 2rem;">
          <select v-model="season_select" style="background-color: rgb(235, 233, 233); width: 10rem; height: 1.5rem; text-align: center;" @change="setSelectSeason($event)">
            <option value="19"> 정규 시즌1 </option>
            <option value="20" selected> 정규 프리 시즌2 </option>
            <option value="21"> 정규 시즌2 </option>
          </select>
        </div>
      </div>
      <div class="maindiv">
        <div class="maindiv1">
          <div class="userstatdiv">
            <div style="width:40%; display:flex; align-items: center; justify-content: center;">
              <img class="tierimg" src="../assets/tier/1.png" v-if="userstats.mmr<1000">
              <img class="tierimg" src="../assets/tier/2.png" v-if="1000<=userstats.mmr && userstats.mmr<2000">
              <img class="tierimg" src="../assets/tier/3.png" v-if="2000<=userstats.mmr && userstats.mmr<3000">
              <img class="tierimg" src="../assets/tier/4.png" v-if="3000<=userstats.mmr && userstats.mmr<4000">
              <img class="tierimg" src="../assets/tier/5.png" v-if="4000<=userstats.mmr && userstats.mmr<5000">
              <img class="tierimg" src="../assets/tier/6.png" v-if="5000<=userstats.mmr && userstats.mmr<6000 ">
              <img class="tierimg" src="../assets/tier/66.png" v-if="6000<=userstats.mmr && userstats.rank > 700">
              <img class="tierimg" src="../assets/tier/7.png" v-if="6000<=userstats.mmr && 200<userstats.rank && userstats.rank<=700">
              <img class="tierimg" src="../assets/tier/8.png" v-if="6000<=userstats.mmr && userstats.rank<=200">
            </div>
            <div style="width:60%; display:flex; align-items: center; justify-content: center; flex-direction: column;">
              <p v-if="userstats.mmr!='-'" style="font-size:30px; margin:0.5rem;"> {{ userstats.mmr }} RP </p>
              <p v-else style="font-size:30px; margin:0.5rem;"> 언랭크 </p>
              <p v-if="userstats.mmr!='-'" style="margin:0;"> {{ userstats.tier}} {{ userstats.grade }} - {{ userstats.RP }} RP</p>
              <p v-else style="margin:0;"> 기록 없음</p>
              <p v-if="userstats.mmr!='-'" style="margin:0;"> {{ userstats.rank }}위</p>
            </div>

          </div>

          <div style="display:flex; align-items: center; justify-content: center; flex-wrap: wrap; border:1px solid black">
            <div style="width:50%; margin-top:10px;">
              <p style="margin:2px;"> 총 게임 수</p>
              <progress value=100 min="0" max="100" class="winrate_progress" style="margin:2px;"></progress>
              <p style="margin:2px;">{{ userstats.totalGames }} </p>
            </div>
            <div style="width:50%; margin-top:10px;">
              <p style="margin:2px;"> 승률 </p>
              <progress :value='userstats.winrate' min="0" max="100" class="winrate_progress"></progress>
              <p v-if="userstats.mmr!='-'" style="margin:2px;">{{ userstats.winrate }}% </p>
              <p v-else style="margin:2px;"> - </p>
            </div>
            <div style="width:50%; margin-top:10px;">
              <p style="margin:2px;"> 평킬</p>
              <progress value=100 min="0" max="100" class="winrate_progress"></progress>
              <p style="margin:2px;">{{ userstats.averageKills }} </p>
            </div>
            <div style="width:50%; margin-top:10px;">
              <p style="margin:2px;"> 평딜</p>
              <progress value=100 min="0" max="100" class="winrate_progress"></progress>
              <p style="margin:2px;">{{ userstats.averageDamage }} </p>
            </div>
          </div>
          <div style="margin-top: 2rem; margin-bottom: 2rem; ">
            <div style="background-color: rgb(92, 89, 89); color: white; font-size: 20px; padding-top: 0.1rem; padding-bottom: 0.1rem; ">
              <p style="margin: 0;"> 실험체 통계 </p>
            </div>
            <div style="background-color: rgb(92, 89, 89); color: white; font-size: 15px; padding-top: 0.1rem; padding-bottom: 0.1rem; display: flex; justify-content: space-evenly; align-items: center; ">
              <div style="width: 34%;">
                실험체
              </div>
              <div style="width: 22%;">
                승률
              </div>
              <div style="width: 22%;">
                평킬
              </div>
              <div style="width: 22%;">
                평딜
              </div>
            </div>
            <div v-for="ch in userchlist" :key="ch" style="border: 1px solid black;">
              <div v-if="ch.character==0"></div>
              <div v-else style="display: flex; justify-content: center; align-items: center;">
                <div style="width:20%;">
                  <div class="ch_icon_div3">
                    <img class="ch_icon3" :src="require(`../assets/character/${ch.chname}.png`)">
                    <!-- <p>{{ game.playcharacter }}</p> -->
                  </div>
                </div>
                <p style="width:14%; margin: 0;"> {{ ch.allgames }}게임</p>
                <p style="width:22%; margin: 0;"> {{ ch.winrate.toFixed(2) }}%</p>
                <p style="width:22%; margin: 0;"> {{ ch.avgKill.toFixed(2) }}</p>
                <p style="width:22%; margin: 0;"> {{ ch.avgDamage.toFixed(0) }}</p>
              </div>
            </div>
          </div>

          <div>
            <div style="margin-top: 2rem; margin-bottom: 2rem; background-color: rgb(92, 89, 89); color: white; font-size: 20px; padding-top: 0.5rem; padding-bottom: 0.5rem;">
              <p> 2주간 RP 획득 내역 </p>
            </div>
            <div v-for="ch in recentch" :key="ch" style="border: 1px solid black;">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="flex:1;">
                  <div class="ch_icon_div2">
                    <img class="ch_icon2" :src="require(`../assets/character/${ch.chname}.png`)">
                    <!-- <p>{{ game.playcharacter }}</p> -->
                  </div>
                </div>
                <p style="flex:1; margin: 0; font-size: larger;"> {{ ch.trygame }}게임</p>
                <p style="flex:1; margin: 0; font-size: larger;"> {{ ch.mmrGain }}점</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 전적 -->
        <div class="전적">
          <div style="display: flex; background-color: black; color: white; align-items: center; justify-content: start;">
            <p style="width:10%">등수</p>
            <p style="width:20%">캐릭터</p>
            <p style="width:10%">KDA</p>
            <p style="width:10%">딜량</p>
            <p style="width:10%">RP</p>
            <p style="width:5%">와드</p>
            <p style="width:10%">사전큐</p>
            <p style="width:20%">아이템</p>
            <div class="chtoggle" style="width:10%;">
              <select v-model="selected_ch" @change="setSelect($event)">
                <option v-for="ch in userchlist" :key="ch.character" :value="ch.character">{{ch.koreanname}}</option>
              </select>
            </div>
          </div>
          <div v-if="userstats.mmr=='-'">
            <p> 이번 시즌 플레이 데이터가 없습니다.</p>
          </div>

          <div v-for="(game,index) in gamedetail" :key="index" style="margin-top: 0.4rem; margin-bottom: 0.4rem; border: 0.5px solid rgb(175, 171, 171);">
            <div :class="`rankdiv${game.gamerank}`" >
              <div style="width:9.5%; display: flex; justify-content: center; flex-direction: column;">
                <p v-if="game.escapeState ==0" style="font-size: x-large; font-weight: 700; margin:0;">#{{ game.gamerank }}</p>
                <p v-if="game.escapeState ==1" style="font-weight: 700; margin:0;">탈출 실패</p>
                <p v-if="game.escapeState ==2" style="font-weight: 700; margin:0;">탈출 실패</p>
                <p v-if="game.escapeState ==3" style="font-weight: 700; margin:0;">탈출</p>
                <p style="margin:0; margin-top:0.5rem;">{{ game.whenplay }}</p>
              </div>
              <div style="width:18%; display: flex; align-items: center; justify-content: center; padding-left: 5px; padding-right: 5px;">
                <div class="ch_icon_div">
                  <img class="ch_icon" :src="require(`../assets/character/${game.playcharacter}.png`)">
                  <!-- <p>{{ game.playcharacter }}</p> -->
                </div>
                <div style="display: flex; flex-wrap: wrap; width: 50%;">

                  <div style="display: flex; margin-bottom: 5px;">
                    <div style="margin-right: 5px; flex:1;">
                      <img style="background-color: black; width:100%;" class="tatic_icon" :src="require(`../assets/WeaponIcon/${game.bestWeapon}.png`)">
                    </div>
                    <div style="flex:1;">
                      <img v-if="game.traitFirstCore != ''" style="background-color: black; width:100%;" class="tatic_icon" :src="require(`../assets/trait/${game.traitFirstCore}.png`)">
                    </div>
                  </div>

                  <div style="display: flex;">
                    <div style="margin-right: 5px; position: relative; flex:1">
                      <img style="background-color: black; width:100%;" class="tatic_icon" :src="require(`../assets/skill/${game.tacticalSkillGroup}.png`)">
                      <div style="position: absolute; bottom:0%; right:0%; background-color: black; width: 10px; height: 10px;">
                        <p style="margin:0; font-size: 10px; color: white;"> {{ game.tacticalSkillLevel }}</p>
                      </div>
                    </div>
                    <div style="flex:1">
                      <img v-if="parseInt(game.traitSecondSub1/100000)==70 " style="background-color: black; width:100%;" class="tatic_icon" :src="require(`../assets/trait/파괴2.png`)">
                      <img v-if="parseInt(game.traitSecondSub1/100000)==71 " style="background-color: black; width:100%;" class="tatic_icon" :src="require(`../assets/trait/저항2.png`)">
                      <img v-if="parseInt(game.traitSecondSub1/100000)==72 " style="background-color: black; width:100%;" class="tatic_icon" :src="require(`../assets/trait/지원2.png`)">
                    </div>
                  </div>
                    <!-- {{ game.tacticalSkillLevel }} -->
                </div>
              </div>
              <div style="width:9%; display: flex; align-items: center; justify-content: center; font-size: large; padding-left: 5px;">
                <p>{{ game.playerkill}} / {{game.playerAss}} / {{game.mosterkill }}</p>
              </div>
              <div style="width:9.5%; display: flex; align-items: center; justify-content: center; font-size: large;">
                <p> {{ game.damageToPlayer  }}</p>
              </div>
              <div style="width:9.5%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <p style="margin-top:0px; margin-bottom: 0px; font-size: large;">{{ game.aftermmr }} </p>
                <p style="margin-top:0px; margin-bottom: 0px; color: red;" v-if="game.mmrGain>0">+{{ game.mmrGain}}</p>
                <p style="margin-top:0px; margin-bottom: 0px; color: blue;" v-if="game.mmrGain<0">-{{ -game.mmrGain  }}</p>
              </div>
              <div style="width:5%; display: flex; align-items: center; justify-content: center;">
                <p> {{ game.useWard }}</p>
              </div>
              <div style="width:10%; display: flex; align-items: center; justify-content: center;">
                <p v-if="game.premaid>1">O</p>
                <p v-if="game.premaid==1"></p>
              </div>
              <!-- 아이템 -->
              <div style="width:20%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <div style="width:90%">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;" >
                    <div style="width:30%;" :class="`itemcolordiv-${game.item0_grade}`">
                      <img style="width:100%;" v-if="game.item0!=0" :src="require(`../assets/Item/${game.item0}.png`)">
                    </div>
                    <div style="width:30%;" :class="`itemcolordiv-${game.item1_grade}`">
                      <img style="width:100%" v-if="game.item1!=0" :src="require(`../assets/Item/${game.item1}.png`)">
                    </div>
                    <div style="width:30%;" :class="`itemcolordiv-${game.item2_grade}`">
                      <img style="width:100%" v-if="game.item2!=0" :src="require(`../assets/Item/${game.item2}.png`)">
                    </div>
                  </div>

                  <div style="display: flex; justify-content: space-evenly;" >
                    <div style="width:30%; margin-left:0.5rem" :class="`itemcolordiv-${game.item3_grade}`">
                      <img style="width:100%" v-if="game.item3!=0" :src="require(`../assets/Item/${game.item3}.png`)">
                    </div>
                    <div style="width:30%; margin-right: 0.5rem;" :class="`itemcolordiv-${game.item4_grade}`">
                      <img style="width:100%" v-if="game.item4!=0" :src="require(`../assets/Item/${game.item4}.png`)">
                    </div>
                  </div>
                </div>
              </div>
              <button v-if="game.gamerank==1" @click="toggle(index, game.gamenumber)" class="addbtn1"> ▼ </button>
              <button v-if="game.gamerank==2 || game.gamerank==3" @click="toggle(index,game.gamenumber)" class="addbtn2"> ▼ </button>
              <button v-if="game.gamerank>3" @click="toggle(index,game.gamenumber)" class="addbtn3"> ▼ </button>
            </div>
                        
            <div v-show="show[index]">
              <div style="display: flex; background-color: black; color: white;">
                <p style="width:5%; align-self: center;">등수</p>
                <div style="display:flex; width: 95%; justify-self: center; align-items: center;">
                  <p style="flex:1.5; margin: 0;">캐릭터</p>
                  <p style="flex:2; margin: 0;">닉네임</p>
                  <p style="flex:1; margin: 0;">KDA</p>
                  <p style="flex:1; margin: 0;">딜량</p>
                  <p style="flex:1; margin: 0;">와드</p>
                  <p style="flex:0.5; margin: 0; letter-spacing: -3px;">사전큐</p>
                  <p style="flex:2; margin: 0;">아이템</p>
                </div>
              </div>
              
              <div v-for="rank in (detail_number[index])" :key="rank" :class="detail.gamerank==rank ? 'userteam' : 'nonuserteam' ">
                <div style="display: flex;">
                  <p style="align-self: center; width: 5%;">{{ rank }}</p>
                  <div style="width:95%">
                    <div v-for="gs in detail[index]" :key="gs" style="display: flex; align-items: center;">
                      <div class="detail_icon2_div">
                        <img class="detail_icon2" v-if="gs.gamerank == rank" :src="require(`../assets/character/${gs.playcharacter}.png`)">
                      </div>
                      <div v-if="gs.gamerank == rank" style="flex:2; font-size: large;">
                        <div style="display: flex;">
                          
                          <a style="font-weight: 700; text-align: start; margin-left:0.3rem; font-size: 1rem;" @click="userclickbtn(gs.user)">{{gs.user}}</a>
                        </div>
                        <div style="display: flex;">
                          <div style="width: 15%; height: 10%;">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/1.png" v-if="gs.tier=='아이언'">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/2.png" v-if="gs.tier=='브론즈' ">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/3.png" v-if="gs.tier=='실버' ">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/4.png" v-if="gs.tier=='골드' ">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/5.png" v-if="gs.tier=='플래티넘' ">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/6.png" v-if="gs.tier=='다이아몬드'  ">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/66.png" v-if="gs.tier=='미스릴'">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/7.png" v-if="gs.tier=='데미갓'">
                            <img style="width: 70%; align-self: center; justify-self: center; margin-top:0.3rem;" src="../assets/tier/8.png" v-if="gs.tier=='이터니티'">
                          </div>

                          <p style="color:gray; font-weight: 600; margin:0; align-self: center; margin-left:0.3rem; font-size: 0.8rem;">{{ gs.tier }}{{ gs.grade }}            {{gs.rp  }}RP</p>
                        </div>
                      </div>
                      <div v-if="gs.gamerank == rank" style="flex:1;">
                        <span style="font-weight: 700;"> {{ gs.playerkill }}</span>
                        <span style="color:gray"> / </span>
                        <span style="font-weight: 700;">{{ gs.playerAss }} </span>
                        <span style="color:gray"> / </span>
                        <span style="font-weight: 700;">{{ gs.mosterkill }} </span>
                      </div>
                      <!-- <span v-if="gs.gamerank == rank" style="flex:1; font-size: large;">{{gs.playerkill}}/{{ gs.playerAss }}/{{ gs.mosterkill }}</span> -->
                      <!-- <p v-if="gs.gamerank == rank" style="flex:1; font-size: large;">{{gs.playerkill}}/{{ gs.playerAss }}/{{ gs.mosterkill }}</p> -->
                      <p v-if="gs.gamerank == rank" style="flex:1; font-weight: 700;">{{gs.damageToPlayer}}</p>
                      <p v-if="gs.gamerank == rank" style="flex:1; font-weight: 700;">{{gs.useWard}}</p>
                      <p v-show="gs.gamerank == rank && (gs.premaid==2 || gs.premaid==3) " style="flex:0.5">O</p>
                      <p v-show="gs.gamerank == rank && gs.premaid==1 " style="flex:0.5"></p>

                      
                      <div v-if="gs.gamerank==rank" style="flex:2; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                        <div style="width:90%">
                          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;" >
                            <div style="width:30%;" :class="`itemcolordiv-${gs.item0_grade}`">
                              <img style="width:100%;" v-if="gs.item0!=0" :src="require(`../assets/Item/${gs.item0}.png`)">
                            </div>
                            <div style="width:30%;" :class="`itemcolordiv-${gs.item1_grade}`">
                              <img style="width:100%" v-if="gs.item1!=0" :src="require(`../assets/Item/${gs.item1}.png`)">
                            </div>
                            <div style="width:30%;" :class="`itemcolordiv-${gs.item2_grade}`">
                              <img style="width:100%" v-if="gs.item2!=0" :src="require(`../assets/Item/${gs.item2}.png`)">
                            </div>
                          </div>

                          <div style="display: flex; justify-content: space-evenly;" >
                            <div style="width:30%; margin-left:1rem" :class="`itemcolordiv-${gs.item3_grade}`">
                              <img style="width:100%" v-if="gs.item3!=0" :src="require(`../assets/Item/${gs.item3}.png`)">
                            </div>
                            <div style="width:30%; margin-right: 1rem;" :class="`itemcolordiv-${gs.item4_grade}`">
                              <img style="width:100%" v-if="gs.item4!=0" :src="require(`../assets/Item/${gs.item4}.png`)">
                            </div>
                          </div>
                        </div>
                      </div>


  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="nextbtn">
            <button style="width: 10rem;" v-if="this.pages>1" @click="prevbtn"> 이전 페이지 </button> &nbsp;
            <button style="width: 10rem;" @click="nextbtn"> 다음 페이지 </button>
          </div>

          <!-- <div class="chtoggle">
            <select v-model="selected" @change="setSelect($event)">
              <option v-for="ch in userchlist" :key="ch.chnumber" :value="ch.chnumber">{{ch.chname}}</option>
            </select>
          </div> -->
        </div>
        
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      search_key:null,
      gamedetail: [],
      show : [],
      userstats:[],
      pages:1,
      recentch: [],
      searchuserrank :[],
      userchlist:[],
      selected_ch:0,
      isLoading:false,
      infoloading:false,
      season_select:21,
      detail:[],
      detail_number: []
    }

  },
  mounted () {
    this.pageData()
  },
  methods:{
    searchbtn() {
      this.$router.push(this.search_key)
      axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + this.search_key + '/' + this.season_select)
      .then(res => {
          this.gamedetail = res.data.results
          this.show = Array(this.gamedetail.length).fill(false)
        }
      )
    },
    nextbtn() {
      if (this.selected_ch) {
        this.pages+=1
        axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + `${this.$route.params.nickname}/`+ this.season_select + '?character='+this.selected_ch +'&page='+this.pages)
        .then(res => {
            this.gamedetail = res.data.results
            this.show = Array(this.gamedetail.length).fill(false)
          }
        )
      }
      else {
        this.pages+=1
        axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + `${this.$route.params.nickname}/`+ this.season_select +'?page='+this.pages)
        .then(res => {
            this.gamedetail = res.data.results
            this.show = Array(this.gamedetail.length).fill(false)
          }
        ) 
      }
    },
    prevbtn() {
      if (this.selected_ch) {
        this.pages-=1
        axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + `${this.$route.params.nickname}/`+ this.season_select + '?character='+this.selected_ch +'&page='+this.pages)
        .then(res => {
            this.gamedetail = res.data.results
            this.show = Array(this.gamedetail.length).fill(false)
          }
        )
      }
      else {
        this.pages-=1
        axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + `${this.$route.params.nickname}/`+ this.season_select +'?page='+this.pages)
        .then(res => {
            this.gamedetail = res.data.results
            this.show = Array(this.gamedetail.length).fill(false)
          }
        ) 
      }
    },
    toggle(index,gamenumber) {
      axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/recorddetail/" + gamenumber)
        .then(res => {
            const data = res.data
            this.detail.splice(index, 0, data)
            this.detail_number.splice(index, 0, data.length/3)
            this.show.splice(index,1,!this.show[index])
          }
        )


    },
    async userclickbtn(value) {
      this.isLoading = true
      await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + value + '/')
      .then(res => {
        this.isLoading = false
        window.location.href = 'https://www.rollthun.site/search/' + value
      }
      )
    },
    async refreshbtn() {
      this.infoloading = true
      await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/refresh/" + `${this.$route.params.nickname}`)
      .then(res=>{
        this.infoloading=false
        this.$router.go(0)
      })
      .catch(res=>{
      })
      
    },
    async pageData() {
      
      const sdData = await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + this.$route.params.nickname + '/' + this.season_select)
      const dData = await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getdetail/" + this.$route.params.nickname + '/' + this.season_select)
      if ('message' in dData.data){
        this.userstats = dData.data
      }
      const useData = await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/userch/" + this.$route.params.nickname + '/'+this.season_select)
      const rcData = await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/recentgainrp/" + this.$route.params.nickname + '/' + this.season_select)
      
      this.gamedetail = sdData.data.results
      this.show = Array(this.gamedetail.length).fill(false)
      this.userstats = dData.data
      this.userchlist = useData.data.usechrank
      this.userchlist.push({chname: '전체', character: 0})
      this.recentch = rcData.data.result.slice(0,10)
    },
    async setSelect(event) {
      if (this.selected_ch) {
        const sdData = await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + this.$route.params.nickname + '/' + this.season_select + '?character='+ this.selected_ch)
        this.gamedetail = sdData.data.results
        this.show = Array(this.gamedetail.length).fill(false)
      }
      else {
        const sdData = await axios.get("https://port-0-eranca-gg-jvpb2alnb33u83.sel5.cloudtype.app/gamerecord/getsearch/" + this.$route.params.nickname + '/' + this.season_select)
        this.gamedetail = sdData.data.results
        this.show = Array(this.gamedetail.length).fill(false)
      }
    },
    async setSelectSeason(event) {
      this.pageData()
    },
    
  },
}
</script>

<style>

.rankdiv1 {
  display: flex;
  background-color: rgb(188, 237, 188);
}

.rankdiv2 {
  display: flex;
  background-color: rgb(170, 209, 247);
}

.rankdiv3 {
  display: flex;
  background-color: rgb(170, 209, 247);
}

.rankdiv4 {
  display: flex;
}

.rankdiv5 {
  display: flex;
}

.rankdiv6 {
  display: flex;
}

.rankdiv7 {
  display: flex;
}

.rankdiv8 {
  display: flex;
}

.backgrounddiv {
  background-color: whitesmoke;
}

.maindiv {
  display: flex;
}

.addbtn1 {
  width:5%;
  margin-left:auto;
  background-color: rgb(188, 237, 188);
  border-right: 0;
  border-top:0;
  border-bottom:0;
  border-left:0.5px solid rgb(175, 171, 171);
}

.addbtn2 {
  width:5%;
  margin-left:auto;
  background-color: rgb(170, 209, 247);
  border-right: 0;
  border-top:0;
  border-bottom:0;
  border-left:0.5px solid rgb(175, 171, 171);
}

.addbtn3 {
  width:5%;
  margin-left:auto;
  border-right: 0;
  border-top:0;
  border-bottom:0;
  border-left:0.5px solid rgb(175, 171, 171);
}

.userstatdiv {
  border: 1px solid black;
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
}

.banner {
  border: 1px solid black;
  display: flex;
  height: 200px;
  align-items: center;
  /* background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsZDS5WwrVlOqteGwBcz-5zacmsHgsGCmfA&usqp=CAU); */
  justify-content: start;
  margin:1rem;
  background-size: cover;
  background-image: linear-gradient(
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5)
      ), url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZsZDS5WwrVlOqteGwBcz-5zacmsHgsGCmfA&usqp=CAU);
}


.userteam {
  background-color: beige;
  border: 0.5px solid rgb(175, 171, 171);
}

.nonuserteam {
  border: 0.5px solid rgb(175, 171, 171);
}

.winrate_progress {
  appearance: none;
  width: 60%;
  height: 6px;
}

.winrate_progress::-webkit-progress-bar {
  background:#f0f0f0;
  border-radius:3px;
  box-shadow: inset 3px 3px 10px #ccc;
}

.winrate_progress::-webkit-progress-value {
  border-radius:3px;
  background: black;
}

.container {
  width:1200px;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .container {
    margin: 0 auto;
    margin-left: 40px;
    margin-right: 40px;
  }
}

.tierimg {
  display: block;
  width: 100%;
  height: auto;
}

@media (max-width: 1600px) {
  .tierimg {
    display: block;
    width: 50%;
    height: auto;
  }
}

.maindiv {
  display: flex;
  margin:1rem;
}

@media (max-width: 1600px) {
  .maindiv {
    display: block;
  }
}

.maindiv1 {
  width:30%;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 1600px) {
  .maindiv1 {
    width:100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

.전적 {
  width:70%;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left:1rem;
}

@media (max-width: 1600px) {
  .전적 {
    width:100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-left:0;
  }
}

.ch_icon_div {
  width: 80%;
  border-radius: 70%;
  overflow: hidden;
}

.ch_icon {
  width:80%;
  object-fit: cover;
}

.ch_icon_div2 {
  width: 50%;
  height: 50%;
  border-radius: 80%;
  overflow: hidden;
  margin:0 auto;
}

.ch_icon_div3 {
  width: 80%;
  height: 50%;
  border-radius: 80%;
  overflow: hidden;
  margin:0 auto;
}

.ch_icon2 {
  width:80%;
  object-fit: cover;
}

.ch_icon3 {
  width:80%;
  object-fit: cover;
}

.detail_icon2_div {
  width: 80%;
  height: 80%;
  border-radius: 70%;
  overflow: hidden;
  flex:1.5;
}

.detail_icon2 {
  width:50%;
  object-fit: cover;
}

.nextbtn{
  margin:1rem;
}


.itemcolordiv-Common {
  height: 100%;
  background-image: url('../assets/Item/grade1.svg');
  background-size: cover;
}

.itemcolordiv-Uncommon {
  height: 100%;
  background-image: url('../assets/Item/grade2.svg');
  background-size: cover;
}

.itemcolordiv-Rare {
  height: 100%;
  background-image: url('../assets/Item/grade3.svg');
  background-size: cover;
}

.itemcolordiv-Epic {
  height: 100%;
  background-image: url('../assets/Item/grade4.svg');
  background-size: cover;
}

.itemcolordiv-Legend {
  height: 100%;
  background-image: url('../assets/Item/grade5.svg');
  background-size: cover;
}

.loading {
  top:0;
  left:0;
  height: 100%;
  width:100%;
  background-color: rgb(108, 106, 106);
  position: absolute;
  opacity: 0.7;
}

</style>