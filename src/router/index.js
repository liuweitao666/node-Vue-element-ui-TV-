import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import('../views/login')
const home = () => import('../views/home')
const users = () => import('../components/home/users/users')
const movie = () => import('../components/home/program/movie')
const series=()=>import('../components/home/program/series')
const variety=()=>import('../components/home/program/variety')
const funny =()=>import('../components/home/program/funny')
const wlecome = ()=>import('../components/home/wlecome')

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
        redirect:'/wlecome',
        component: home,
        children: [
            {
                path: '/infousers', component: users
            },
            {
                path: '/pmovie', component: movie
            },
            {
                path:'/ptvseries',component:series
            },
            {
                path:'/pvariety',component:variety
            },
            {
                path:'/pfunny',component:funny
            },
            {
                path:'/wlecome',component:wlecome
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