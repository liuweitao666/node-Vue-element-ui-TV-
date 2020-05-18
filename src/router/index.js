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
const detail = () => import('../components/home/program/common/detail')
// 添加节目更新节目组件
const addprogram = () => import('../components/home/program/addprogram/addgram')

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
const channel = () => import('../components/home/program/channel')

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
        component: login,
        meta: {
            title: '登录页',
            keepAlive: true, // 需要被缓存
        }
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
                path: '/wlecome', component: wlecome,
                meta: {
                    title: '首页',
                    keepAlive: true, // 需要被缓存
                }
            },
            // 用户管理路由
            {
                path: '/infousers', component: users,
                meta: {
                    title: '用户管理',
                    keepAlive: true, // 需要被缓存
                }
            },
            // 节目管理路由
            {
                path: '/pmovie', component: movie,
                meta: {
                    title: '电影',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/ptvseries', component: series,
                meta: {
                    title: '电视剧',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/pvariety', component: variety,
                meta: {
                    title: '综艺',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/pfunny', component: funny,
                meta: {
                    title: '动漫',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/detail', component: detail
            },
            {
                path: '/addprogram', component: addprogram,
                meta: {
                    title: '添加节目',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/channel', component: channel,
                meta: {
                    title: '频道信息',
                    keepAlive: true, // 需要被缓存
                }
            },
            // 报表管理路由
            {
                path: '/repusers', component: userReport,
                meta: {
                    title: '用户报表',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/reprogram', component: reprogram,
                meta: {
                    title: '节目报表',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/information/:type', component: information,
                meta: {
                    title: '个人中心',
                    keepAlive: true, // 需要被缓存
                }
            },
            // 用户费用管理
            {
                path: '/tolluay', component: tolluay,
                meta: {
                    title: '缴费',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/tolluser', component: tolluser,
                meta: {
                    title: '费用情况',
                    keepAlive: true, // 需要被缓存
                }
            },
            // 设备路由
            {
                path: '/devicetv', component: devicetv,
                meta: {
                    title: '我的保修',
                    keepAlive: true, // 需要被缓存
                }
            },
            {
                path: '/devicepc', component: devicerepair,
                meta: {
                    title: '设备报修',
                    keepAlive: true, // 需要被缓存
                }
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
    window.document.title = to.meta.title == undefined ? '默认标题' : to.meta.title
    if (to.path === '/login' || to.path === '/') {
        return next()
    }
    // get获取token
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})
export default router