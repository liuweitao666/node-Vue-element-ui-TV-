<template>
  <el-container>
    <!-- 左侧导航栏区域 -->
    <el-aside width="190px" style="position:relative">
      <navigation
        :navs="navs"
        :username="userinfo.username"
        :status="userinfo.status"
        :avatar="userinfo.avatar"
        :minute ="userinfo.minute"
        v-if="userinfo"
      />
    </el-aside>
    <!-- 右侧内容区域 -->
    <el-container>
      <!-- 右侧头部 -->
      <el-header>
        <el-row>
          <el-col :span="1" class="cl-col-span-1">
            <img src="../assets/image/menu.png" alt class="head-icon" />
          </el-col>
          <el-col :span="4" class="weather" v-if="weather">
            <span class="weather-span">
              <span>{{weather.city}}</span>
              <i class="el-icon-position"></i>
            </span>
            <span class="weather-span">
              <img :src="weather.weatherimg" alt="天气" style="width:40px;height:40px;" />
            </span>
            <span class="weather-span">
              <div>{{weather.weather}}</div>
              <span>{{weather.today}}</span>
            </span>
            <img
              src="@/assets/image/wind.png"
              alt
              style="width:20px;height:20px;padding:0px 5px 0 5px;"
            />
            <span class="weather-span" style="width:50px;margin-right:5px">
              <div>{{weather.wd}}</div>
              <span>{{weather.wden}}</span>
            </span>
          </el-col>
          <el-col :span="12">
            <!-- users搜索框 -->
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="searchval"
              clearable
              @clear="clearsea"
              @keyup.native.13="searchkey"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchdata"></el-button>
            </el-input>
          </el-col>
          <el-col :span="7">
            <div class="block">
              <el-badge is-dot class="badge-item">
                <img src="../assets/image/msg.png" alt class="head-icon" />
              </el-badge>
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
          <router-view @finduser="finduser" ref="router" />
      </el-main>
      <!-- 版权部分 -->
      <el-footer style="height: 60px;">
        <span>版权所有@16网络刘维韬</span>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import navigation from "../components/home/navigation";
import { mapActions, mapState } from "vuex";
import { finddata } from "@/common/crod/index";

export default {
  data() {
    return {
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
      userinfo: null
    };
  },
  components: {
    navigation
  },
  beforeCreate() {},
  created() {
    this.username = sessionStorage.getItem("username");
    // 调用获取导航数据方法
    this.getNav();
    // 获取当天天气预报
    this.getweather();
    // 登录提示
    // this.userprompt();
    // 获取当前用户数据
    this.getuserinfo();
    // 当前用户权限
  },
  methods: {
    // 映射actions中的方法
    ...mapActions(["getlist"]),
    // 获取导航栏数据
    async getNav() {
      const { data: res } = await this.$http.get("/home/navs");
      if (res.code !== 1) return console.log("获取数据失败");
      this.navs = res.data;
      // console.log(this.navs);
    },
    // 退出登录
    handleCommand(command) {
      if (command == 1) return this.$router.push({path:'/information',query:{'_id':this.userinfo._id}});
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("username");
      window.sessionStorage.removeItem("token_exp");
      this.$router.go(0);
    },
    // users组件传值
    finduser(data) {
      this.finduserUrl = data;
    },
    // 搜索的点击事件
    searchdata() {
      // 根据路由来判断搜索的是那个组件的数据
      if (this.pathtitle === "infousers") {
        this.$refs.router.queryinfo.query.username = this.searchval;
        this.$refs.router.getusers();
      }
      if (this.program) {
        // console.log(this.searchval)
        this.$refs.router.name = this.searchval;
        this.$refs.router.getprogramlist();
      }
    },
    // 清空搜索框
    clearsea() {
      // console.log(this.$route.path)
      // 根据路由来决定发送网络请求
      if (this.pathtitle === "infousers") {
        this.$refs.router.queryinfo.query.username = "";
        this.$refs.router.getusers();
      }
      if (this.program) {
        this.$refs.router.name = this.searchval;
        // console.log(this.program)
        this.$refs.router.getprogramlist();
      }
    },
    // 获取当天天气
    async getweather() {
      const { data: res } = await this.$http.get(
        "http://api.help.bj.cn/apis/weather/?id=101280101"
      );
      res.today = res.today.split(" ")[1];
      this.weather = res;
      // console.log(this.weather);
    },
    // 提示用户的消息
    async getuserinfo() {
      const { data: res } = await finddata("/home/users", {
        username: this.username
      });
      // console.log(res)
      if (res.length !== 0) {
        this.userinfo = res[0];
        // 把当前用户的信息用vuex保存起来
        await this.$store.dispatch("asyncstatus", this.userinfo.status);
        await this.$store.dispatch("asyncuserinfo",res[0]);
        if(this.userinfo.minute>=1000){
          this.$router.push('/tolluay')
          return this.$notify({
          title: "用户异常",
          message: "尊敬的" + res[0].username+',你目前欠费已超上限，请缴费',
          type: "error"
        });
        }
        return this.$notify({
          title: "登录成功",
          message: "Wlecome来到TV用户管理系统，" + res[0].username,
          type: "success"
        });
      }
    },
    // 键盘enter键搜索事件
    searchkey(){
      // 根据路由来判断搜索的是那个组件的数据
      if (this.pathtitle === "infousers") {
        this.$refs.router.queryinfo.query.username = this.searchval;
        this.$refs.router.getusers();
      }
      if (this.program) {
        // console.log(this.searchval)
        this.$refs.router.name = this.searchval;
        this.$refs.router.getprogramlist();
      }
    }
  },
  computed: {
    // 获取当前路径
    pathtitle() {
      return this.$route.path.slice(1);
    },
    // 判断是否为节目管理路由
    program() {
      return (
        this.pathtitle === "pmovie" ||
        this.pathtitle === "ptvseries" ||
        this.pathtitle === "pvariety" ||
        this.pathtitle === "pfunny"
      );
    },
    ...mapState(["status"])
  }
};
</script>
<style >
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
  display: inline-block;
  width: 40px;
  text-align: center;
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
.el-avatar > img {
  width: 100%;
}
/* .el-aside{
  min-width: 180px;
  max-width: 180px;
} */
/* 右侧导航栏图片 */
/* 动画  性能低已弃用*/ 
.router-enter {
  opacity: 0;
  position: absolute;
  transform: translateX(20%);
}
.router-leave-to {
  opacity: 0;
  transform: translateY(20%);
  position: absolute;
  z-index:0;
  width: 1306px;
}
.router-enter-active,
.router-leave-active {
  transition: all 0.8s ease;
}
</style>