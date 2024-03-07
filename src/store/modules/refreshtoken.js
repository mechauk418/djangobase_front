import axios from 'axios'
const axiosRefresh = axios.create()
axiosRefresh.defaults.withCredentials = true
const refreshtoken = {
  state: {
  },
  mutations: {
  },
  actions: {
    async refreshtt (dispatch) {
      await axiosRefresh
        .post('https://api.isdfans.site/api/accounts/token/refresh/') // 로그인 URL로 ID, PW를 보냄
        .then((response) => {
          const newToken = response.data.access
          localStorage.setItem('access_token', newToken)
        })
    }
  }
}
export default refreshtoken