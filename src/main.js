import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import './common/element-ui'
import md5 from 'js-md5'

// 把md5加密包挂载到Vue实例上
Vue.prototype.$md5 = md5
// 设置baseUrl
axios.defaults.baseURL = 'http://127.0.0.1:3000'
Vue.prototype.$http = axios

// 设置axios拦截器，使每次请求带token
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  // console.log(config.headers)
  config.headers.common['Authorization'] = 'Bearer ' + token;
  return config
})


Vue.config.productionTip = false

// 设置一个全局过滤器
Vue.filter('dateformat',function(origantime){
  const dt =new Date(origantime)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
