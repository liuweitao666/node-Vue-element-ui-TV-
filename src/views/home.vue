<template>
  <el-container>
    <!-- 点击让搜索记录消失 -->
    <div class="hidehis" v-if="history" @click="hidehis"></div>
    <!-- 左侧导航栏区域 -->
    <el-aside width="190px" style="position:relative">
      <navigation
        :navs="navs"
        :username="userinfo.username"
        :status="userinfo.status"
        :avatar="userinfo.avatar"
        :minute="userinfo.minute"
        v-if="userinfo"
      />
    </el-aside>
    <!-- 右侧内容区域 -->
    <el-container>
      <!-- 右侧头部 -->
      <el-header>
        <el-row v-if="weather">
          <el-col :span="1" class="cl-col-span-1">
            <img src="../assets/image/menu.png" alt class="head-icon" />
          </el-col>
          <el-col :span="4" class="weather" v-if="weather">
            <div class="weather-span">
              <span class="first">{{weather.city}}</span>
              <i class="el-icon-position"></i>
            </div>
            <!-- 显示天气图片 -->
            <div class="weather-span">
              <img :src="imgw[weaindex].src" alt="天气" style="width:30px;height:30px;" />
            </div>
            <div class="weather-span">
              <div class="first">{{weather.wea}}</div>
              <div>{{weather.week}}</div>
            </div>
            <img
              src="@/assets/image/wind.png"
              alt
              style="width:20px;height:20px;padding:0px 10px 0 0px;"
            />
            <div class="weather-span">
              <div class="first">{{weather.win}}</div>
              <div>{{weather.wden}}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <!-- users搜索框 -->
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              :class="{'bestup':history}"
              v-model="searchval"
              clearable
              @clear="clearsea"
              @keyup.native.13="searchkey"
              @focus="Shistory"
              :disabled="isinput"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchdata"></el-button>
            </el-input>
            <!-- 历史记录搜索框 -->
            <div class="Shistory" v-if="history">
              <div v-if="hisvalue.length===0" class="nonehis">暂无搜索记录</div>
              <div v-else>
                <div
                  class="his-span"
                  v-for="item in hisvalue"
                  :key="item._id"
                  @click="handleseach(item.value)"
                >
                  <span>{{item.value}}</span>
                  <i class="el-icon-close" @click.stop="deletehis(item._id)"></i>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="block">
              <el-badge is-dot class="badge-item">
                <img src="../assets/image/msg.png" alt class="head-icon" @click="msgprompt" />
              </el-badge>
              <!-- 通知提示框 -->
              <transition name="Msg">
                <div class="prompt-dis" v-if="promptVisible">
                  <div class="Button--plain">
                    <span class="arrow"></span>
                    <img src="@/assets/image/prompt.png" alt />
                    公告栏
                  </div>
                  <div class="Messages-list">
                    <div>
                      <img src="@/assets/image/tv.png" alt />
                    </div>
                    <div>
                      <span class="Message-content">本系统目前正处于测试阶段，如果您有什么好的建议，欢迎留言!</span>
                    </div>
                  </div>
                  <div class="Message-bottom" @click="toleave">
                    <i class="el-icon-edit"></i>
                    写留言
                  </div>
                </div>
              </transition>

              <!--用户头像，退出登录选项 -->
              <el-dropdown @command="handleCommand" v-if="userinfo">
                <div class="avatar">
                  <el-avatar
                    :size="30"
                    :src="'http://127.0.0.1:3000'+userinfo.avatar"
                    fit="fill"
                    shape="square"
                  ></el-avatar>
                  <span class="name" v-if="userinfo">{{userinfo.username}}</span>
                  <span class="name" v-else>默认用户</span>
                  <i class="el-icon-arrow-down"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit" command="1">修改资料</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-switch-button" command="0">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <!-- 右侧主体内容页面 -->
      <el-main>
        <router-view @finduser="finduser" @username="username" ref="router" />
      </el-main>
      <!-- 版权部分 -->
      <el-footer style="height: 60px;">
        <span>版权所有@16网络刘维韬</span>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import navigation from "../components/home/navigation"
import { mapActions, mapState } from "vuex"
import { finddata } from "@/common/crod/index"
import { request } from "@/network/request"

export default {
  data() {
    return {
      isinput:true,
      username: "",
      // 导航栏数据
      navs: null,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      //搜搜框的值
      searchval: "",
      finduserUrl: "",
      weather: null,
      // 保存用户信息
      userinfo: null,
      history: false,
      hisvalue: null,
      // 控制刚开始登录弹窗只出现一次
      flag: false,
      imgw: [
        { src: require("@/assets/image/yin.png") },
        { src: require("@/assets/image/yu.png") },
        { src: require("@/assets/image/yun.png") },
        { src: require("@/assets/image/wind.png") },
        { src: require("@/assets/image/qing.png") }
      ],
      weaimg: ["yin", "yu", "yun", "wind", "qing"],
      weaindex: null,
      // 公告栏
      promptVisible: false
    }
  },
  components: {
    navigation
  },
  beforeCreate() {},
  created() {
    this.username = sessionStorage.getItem("username")
    // 调用获取导航数据方法
    this.getNav()
    // 获取当天天气预报
    this.getweather()
    // 登录提示
    // this.userprompt();
    // 获取当前用户数据
    this.getuserinfo()
    // 当前用户权限
  },
  mounted() {
    document.addEventListener("click", e => {
      if (e.target.className === "head-icon"||e.target.className === "prompt-dis") {
        this.promptVisible = true
      }else{
        this.promptVisible =false
      }
    })
    //如果有报错可以写
    // this.$nextTick(()=>{
    //         document.addEventListener('click', (e)=> {
    //         console.log(e.target)
    //         if (e.target.className != 'modalDiaLog') {
    //             this.dialog = false;
    //         }
    //     })
    // })
  },
  methods: {
    // 映射actions中的方法
    ...mapActions(["getlist"]),
    // 获取导航栏数据
    async getNav() {
      const { data: res } = await this.$http.get("/home/navs")
      if (res.code !== 1) return console.log("获取数据失败")
      this.navs = res.data
      // console.log(this.navs);
    },
    // 退出登录
    handleCommand(command) {
      if (command == 1)
        return this.$router.push({
          path: "/information",
          query: { _id: this.userinfo._id }
        })
      window.sessionStorage.removeItem("token")
      window.sessionStorage.removeItem("username")
      window.sessionStorage.removeItem("token_exp")
      this.$router.go(0)
    },
    // users组件传值
    finduser(data) {
      this.finduserUrl = data
    },
    // 搜索的点击事件
    searchdata() {
      this.Addhistory()
      this.realsearch()
      this.history = false
    },
    // 清空搜索框
    clearsea() {
      // console.log(this.$route.path)
      // 根据路由来决定发送网络请求
      if (this.pathtitle === "infousers") {
        this.$refs.router.queryinfo.query.username = ""
        this.$refs.router.getusers()
      }
      if (this.program) {
        this.$refs.router.name = this.searchval
        // console.log(this.program)
        this.$refs.router.getprogramlist()
      }
    },
    // 获取当天天气
    async getweather() {
      const { data: res } = await request({
        params: {
          version: "v6",
          appid: "34769248",
          appsecret: "k1kDNkh9",
          vue: "1"
        }
      })
      this.weather = res
      this.weaindex = this.weaimg.findIndex(item => {
        return item == res.wea_img
      })
    },
    // 提示用户的消息
    async getuserinfo() {
      const { data: res } = await finddata("/home/users", {
        username: this.username
      })
      // console.log(res)
      if (res.length !== 0) {
        this.userinfo = res[0]
        this.hisvalue = res[0].history.reverse()
        // 把当前用户的信息用vuex保存起来
        await this.$store.dispatch("asyncstatus", this.userinfo.status)
        await this.$store.dispatch("asyncuserinfo", res[0])
        if (this.userinfo.minute >= 1000 && this.status === 0) {
          this.$router.push("/tolluay")
          this.flag = true
          return this.$notify({
            title: "用户异常",
            message: "尊敬的" + res[0].username + ",你目前欠费已超上限，请缴费",
            type: "error"
          })
        }
        if (!this.flag) {
          this.flag = true
          return this.$notify({
            title: "登录成功",
            message: "Wlecome来到TV用户管理系统，" + res[0].username,
            type: "success"
          })
        }
      }
    },
    // 键盘enter键搜索事件
    searchkey() {
      // 添加搜索历史记录
      this.Addhistory()
      this.realsearch()
      this.history = false
      this.getuserinfo()
    },
    // 显示历史搜索框
    Shistory() {
      
      this.isinput =false
      this.history = true
    },
    // 添加历史记录
    async Addhistory() {
      const { data: res } = await this.$http.put("/home/shistory", {
        username: this.username,
        value: this.searchval
      })
      console.log(res)
    },
    // 点击搜索记录搜索
    handleseach(value) {
      this.searchval = value
      this.realsearch()
      this.history = false
      this.getuserinfo()
    },
    // 删除搜索历史
    async deletehis(id) {
      const { data: res } = await this.$http.delete("/home/shistory", {
        params: { id, username: this.username }
      })
      if (res.code === 1) return this.getuserinfo()
    },
    // 搜索事件
    realsearch() {
      // 根据路由来判断搜索的是那个组件的数据
      if (this.pathtitle === "infousers") {
        this.$refs.router.queryinfo.query.username = this.searchval
        this.$refs.router.getusers()
      } else if (this.program) {
        // console.log(this.searchval)
        this.$refs.router.name = this.searchval
        this.$refs.router.getprogramlist()
      }
    },
    // 隐藏历史搜索框
    hidehis() {
      this.history = false
    },
    msgprompt() {
      this.promptVisible = !this.promptVisible
    },
    // 留言
    toleave() {
      this.$router.push("/wlecome")
      this.promptVisible = false
    }
  },
  computed: {
    // 获取当前路径
    pathtitle() {
      return this.$route.path.slice(1)
    },
    // 判断是否为节目管理路由
    program() {
      return (
        this.pathtitle === "pmovie" ||
        this.pathtitle === "ptvseries" ||
        this.pathtitle === "pvariety" ||
        this.pathtitle === "pfunny"
      )
    },
    ...mapState(["status"])
  },
  watch:{
    pathtitle(newval){
      const reg = /^[p|i].*$/
      if (!reg.test(newval)) {
        return this.isinput = true
      }else{
        return this.isinput = false
      }
    }
  }
}
</script>
<style lang="scss" >
.el-container {
  height: 100vh;
  width: 100vw;
  min-width: 1300px;
  overflow-x: hidden;
}
.header {
  display: flex;
  align-items: center;
}

.cl-col-span-1 {
  width: 35px;
}
/* 天气部分 */
.weather {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 14px;
  color: #b4ababea;
  letter-spacing: 2px;
}
.weather-span {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  text-align: center;
  margin: 0 10px 5px 0;
}
/* 左部侧栏 */
.el-aside {
  background: #253e55;
  overflow-x: hidden;
}
.el-header {
  height: 40px;
  padding: 10px 20px;
}
.el-header .block {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.el-avatar {
  background: #ffffff;
}
.el-avatar > img {
  width: 100%;
}
.el-header .block .avatar {
  display: flex;
  align-items: center;
  margin-left: 15px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 3px;
  cursor: pointer;
}
.el-header .block .avatar .name {
  padding: 0 5px;
  color: #cfcfcf;
}
.head-icon {
  width: 30px;
  height: 30px;
  padding-top: 5px;
  cursor: pointer;
}
.el-dialog__body {
  padding: 15px 20px !important;
}

/* 主体部分样式 */
.el-main {
  background: #eff3f5;
  padding: 20px;
  overflow-x: hidden;
}
.el-footer {
  background: #eff3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.el-badge__content.is-fixed.is-dot {
  right: 6px;
  top: 3px;
}

/* .el-aside{
  min-width: 180px;
  max-width: 180px;
} */
/* 右侧导航栏图片 */
/* 动画  性能低已弃用*/
.Msg-enter {
  opacity: 0;
}
.Msg-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}
.Msg-enter-active,
.Msg-leave-active {
  transition: all 0.5s ease;
}
/* 搜索历史 */
.Shistory {
  width: 595px;
  box-sizing: border-box;
  padding: 10px 0;
  background: #ffffff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
  z-index: 9999;
  position: relative;
}
.nonehis {
  margin: 20px auto;
  color: #999;
  font-size: 16px;
  text-align: center;
}
.his-span {
  padding: 9px 15px;
  color: #222;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in;
}
.his-span:hover {
  background: #f4f4f4;
}
.hidehis {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
}
.el-icon-close:hover{
  color:#00a1d6;
}
.bestup {
  position: relative;
  z-index: 9999;
}
/* 通知 */
.prompt-dis {
  position: fixed;
  top: 60px;
  right: 35px;
  width: 360px;
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  -webkit-box-shadow: 0 5px 20px rgba(26, 26, 26, 0.1);
  box-shadow: 0 5px 20px rgba(26, 26, 26, 0.1);
  z-index: 203;
  .Button--plain {
    border-bottom: 1px solid #ebebeb;
    height: 45px;
    font-size: 14px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .arrow {
      position: absolute;
      width: 32px;
      height: 16px;
      overflow: hidden;
      top: -16px;
      left: 50%;
    }
    .arrow::after {
      content: "";
      display: inline-block;
      width: 33px;
      height: 33px;
      border: #ebebeb 1px solid;
      background: #fff;
      transform: rotate(52deg);
      position: relative;
      top: 10px;
    }
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
  .Messages-list {
    padding: 15px;
    display: flex;
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .Message-content {
      line-height: 20px;
      color: #8590a6;
      font-size: 14px;
    }
  }
  .Message-bottom {
    border-top: 1px solid #ebebeb;
    cursor: pointer;
    height: 35px;
    line-height: 35px;
    color: #8590a6;
    text-align: center;
  }
  .Message-bottom:hover {
    color: #000;
  }
}
.prompt-mes {
  width: 30px;
  height: 35px;
  color: #67c23a;
  background: #ffffff;
  font-size: 25px;
  text-align: center;
}
</style>