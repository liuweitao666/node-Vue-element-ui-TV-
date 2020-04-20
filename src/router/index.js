import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件模块
const login = () => import('../views/login')
const home = () => import('../views/home')
const wlecome = () => import('../components/home/wlecome')

// 节目组件
const users = () => import('../components/home/users/users')
const movie = () => import('../components/home/program/movie')
const series = () => import('../components/home/program/series')
const variety = () => import('../components/home/program/variety')
const funny = () => import('../components/home/program/funny')
// 节目详情组件
const detail = ()=>import('../components/home/program/common/detail')
// 添加节目更新节目组件
const addprogram = ()=>import('../components/home/program/addprogram/addgram')

// 报表组件
const userReport = () => import('../components/home/report/userReport')
const reprogram = () => import('../components/home/report/reprogram')
const information = () => import('../components/home/editinfo/information')
// 收费管理组件
const tolluay = () => import('../components/home/toll/tollpay')
const tolluser = () => import('../components/home/toll/tolluser')

// 设备管理组件
const devicetv = () => import('../components/home/device/devicetv')
const devicerepair = () => import('../components/home/device/devicerepair')
const channel = ()=>import('../components/home/program/channel')

// 挂载路由
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/home',
        name: 'home',
        redirect: '/wlecome',
        component: home,
        // 定义子路由规则
        children: [
            // 首页
            {
                path: '/wlecome', component: wlecome
            },
            // 用户管理路由
            {
                path: '/infousers', component: users
            },
            // 节目管理路由
            {
                path: '/pmovie', component: movie
            },
            {
                path: '/ptvseries', component: series
            },
            {
                path: '/pvariety', component: variety
            },
            {
                path: '/pfunny', component: funny
            },
            {
                path:'/detail',component:detail
            },
            {
                path:'/addprogram',component:addprogram
            },
            {
                path:'/channel',component:channel
            },
            // 报表管理路由
            {
                path: '/repusers', component: userReport
            },
            {
                path: '/reprogram', component: reprogram
            },
            {
                path: '/information', component: information
            },
            // 用户费用管理
            {
                path: '/tolluay', component: tolluay
            },
            {
                path: '/tolluser', component: tolluser
            },
            // 设备路由
            {
                path:'/devicetv',component:devicetv
            },
            {
                path:'/devicepc',component:devicerepair
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

// 设置路由导航守卫，判断用户是否已经登录
router.beforeEach((to, from, next) => {
    if (to.path === '/login' || to.path === '/') {
        return next()
    }
    // get获取token
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})
export default router