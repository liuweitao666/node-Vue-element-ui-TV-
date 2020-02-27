<template>
  <el-container>
    <!-- 左侧导航栏区域 -->
    <el-aside width="180px">
      <navigation :navs="navs" />
    </el-aside>
    <!-- 右侧内容区域 -->
    <el-container>
      <!-- 右侧头部 -->
      <el-header>
        <el-row :gutter="20">
          <el-col :span="1">
            <img src="../assets/image/menu.png" :alt="username" class="head-icon" />
          </el-col>
          <el-col :span="12">
            <!-- users搜索框 -->
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="searchval"
              clearable
              @clear="clearsea"
            >
              <el-button slot="append" icon="el-icon-search" @click="queryuser" ></el-button>
            </el-input>
          </el-col>
          <el-col :span="11">
            <div class="block">
              <el-badge is-dot class="badge-item">
                <img src="../assets/image/msg.png" alt class="head-icon" />
              </el-badge>
              <el-dropdown @command="handleCommand">
                <div class="avatar">
                  <el-avatar :size="30" :src="circleUrl" shape="square"></el-avatar>
                  <span class="name">{{username}}</span>
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
        <router-view @finduser="finduser" ref="users" />
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
export default {
  data() {
    return {
      username: "默认用户",
      // 导航栏数据
      navs: null,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      //搜搜框的值
      searchval: "",
      finduserUrl: ""
    };
  },
  components: {
    navigation
  },
  created() {
    this.getNav();
  },
  methods: {
    // 获取导航栏数据
    async getNav() {
      const { data: res } = await this.$http.get("/home/navs");
      if (res.code !== 1) return console.log("获取数据失败");
      this.navs = res.data;
      // console.log(this.navs);
    },
    handleCommand(command) {
      if (command == 1) return console.log("click on item " + command);
      window.sessionStorage.removeItem("token");
      this.$router.go(0);
    },
    // users组件传值
    finduser(data) {
      this.finduserUrl = data;
    },
    // 搜索的方法
    async search(url, params) {
      const { data: res } = await this.$http.get(url, {
        params: { query: params, limit: 1 }
      });
      console.log(res);
    },
    // 搜索的点击事件
    queryuser() {
      this.$refs.users.queryinfo.query.username = this.searchval;
      this.$refs.users.getusers();
    },
    // 清空搜索框
    clearsea() {
      // console.log(this.$route.path)
      this.$refs.users.queryinfo.query.username = '';
      this.$refs.users.getusers();
    }
  }
};
</script>
<style >
.el-container {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
}

.el-aside {
  background: #253e55;
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
.el-main {
  background: #eff3f5;
  padding: 20px;
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
</style>