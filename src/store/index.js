import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 请求节目列表数据
        queryinfo: {
            title: '',
            pagenum: 1,
            id: "",
            name: '',
            sort: 'new'
        },
        // programlist 数据
        programlist: null,
        username: '',
        status: 0,
        userinfo: null,
        // 全局保存节目
        Allprogram: null
    },
    mutations: {
        getprogramlist(state, params, ) {
            state.queryinfo.title = params.title
            state.queryinfo.name = params.name
            // 获取数据
        },
        editstatus(state, status) {
            state.status = status
        },
        saveuserinfo(state, userinfo) {
            userinfo.program.reverse()
            state.userinfo = userinfo
        },
        // 更改排序方式
        editsort(state, type) {
            state.queryinfo.sort = type
        },
        // 全局保存所有节目
        saveprogramAll(state, program) {
            state.Allprogram = program
        }
    },
    actions: {
        // 发送网络请求 获取节目列表
        getlist({ state, commit }, params, ) {
            return new Promise((resolve, reject) => {
                commit('getprogramlist', params)
                axios.get("/home/program", {
                    params: state.queryinfo
                }).then(res => {

                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 修改用户状态
        async asyncstatus({ commit }, status) {
            await commit('editstatus', status)
        },
        // 
        asyncuserinfo({ commit }, userinfo) {
            commit('saveuserinfo', userinfo)
        },
        // 保存所有节目
        async saveallpro({ commit }) {
            let program = []
            const { data: Video } = await axios.get("/home/video", {
                params: { type: "all" }
            })
            const { data: res } = await axios.get("/home/program")
            // 保存所有的节目数据
            res.data.forEach(async item => {
                program.push(...item.data)
            })
            // 把对应的Src链接保存到对应的节目中
            Video.data.forEach(item => {
                let title = item.title
                let Src = item.Src
                let path = item.type
                program.forEach(programs => {
                    if (title === programs.title) {
                     
                        programs.Src = Src
                        programs.path = path
                    }
                })
            })
            // 对节目按热度排序
            program.sort((a, b) => {
                return b.hot - a.hot
            })
            
            commit('saveprogramAll',program)
        }
    },
    getters: {
        status(state) {
            return state.status
        }
    }
})

export default store