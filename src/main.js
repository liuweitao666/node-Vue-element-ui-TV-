import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import './common/element-ui'
import md5 from 'js-md5'
import store from './store/index'

// 进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import { Message } from 'element-ui'

// 把md5加密包挂载到Vue实例上
Vue.prototype.$md5 = md5
// 设置baseUrl
axios.defaults.baseURL = 'http://127.0.0.1:3000'
Vue.prototype.$http = axios

// 设置axios请求拦截器，使每次请求带token
axios.interceptors.request.use(config => {
  NProgress.start();
  const token = sessionStorage.getItem('token');
  // 验证token是否过期
  const tokenexp = sessionStorage.getItem('token_exp')
  const limit = 60 * 60 * 2

  const nowtime = new Date().getTime()
  if (tokenexp && nowtime - tokenexp >= limit * 1000) {
    Message.error({
      showClose: true,
      duration: 1000,
      message: '登录已过期,请重新登录'
    })
    return setTimeout(() => {
      sessionStorage.removeItem('token_exp')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('username')
      router.push('/')
    }, 1000)
  }
  // console.log(nowtime - tokenexp, limit * 1000)
  // 每次请求往请求头里加入token认证
  config.headers.common['Authorization'] = 'Bearer ' + token;
  return config
})

// 设置响应拦截，关闭进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.config.productionTip = false

// 设置一个全局时间格式过滤器
Vue.filter('dateformat', function (origantime) {
  const dt = new Date(origantime)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  store,
  render: h => h(App),
  router
}).$mount('#app')
