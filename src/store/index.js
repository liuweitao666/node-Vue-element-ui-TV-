import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 请求节目列表数据
        queryinfo: {
            title: '',
            pagesize: 12,
            pagenum: 1,
            id: "",
            name:''
        },
        // programlist 数据
        programlist: null,
        username:'',
        status:1
    },
    mutations: {
        getprogramlist(state, params,) {
            state.queryinfo.title = params.title
            state.queryinfo.name = params.name
            // 获取数据
        },
        editstatus(state,status){
            state.status = status
        }
    },
    actions: {
        // 发送网络请求 获取节目列表
        getlist({ state, commit}, params, ) {
            return new Promise((resolve, reject) => {
                commit('getprogramlist', params,)
                axios.get("/home/program", {
                    params: state.queryinfo
                }).then(res => {
                    // console.log(res)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 修改用户状态
        asyncstatus({commit},status){
            commit('editstatus',status)
        }
    },
    getters: {
        status(state) {
                return state.status
        }
    }
})

export default store