<template>
  <div class="container">
    <!-- 顶部logo部分 -->
    <div class="top">
      <div class="logo"></div>
      <!-- 头像区域 -->
      <div class="user-ifno">
        <div class="block">
          <el-avatar :size="40" :src="'http://127.0.0.1:3000'+avatar" class="avatar"></el-avatar>
        </div>
        <div class="username">
          <div class="user-con">
            <div>
              <span class="user-span">Wlecome</span>
              <span class="user-span">{{username}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 导航部分 -->
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#253e55"
      text-color="#fff"
      active-text-color="#67d3e0"
      unique-opened
      router
      v-if="navlist!==2"
    >
      <el-submenu :index="index+''" v-for="(item,index) in navlist" :key="item.id">
        <template slot="title">
          <i :class="navIcons[index]"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item :index="'/'+item.path" v-for="(item,index) in item.children" :key="index">
          <i class="el-icon-menu"></i>
          <span v-if="item.name==='故障设备'&&status===0">我的保修</span>
          <span v-else>{{item.name==='搞笑类'?'动画类':item.name }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <!-- 禁止登录用户可以看到 -->
    <div class="baned" v-else>您违规啦!</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 用户名
      // 导航栏图标
      navIcons: [
        "el-icon-s-custom",
        "el-icon-s-grid",
        "el-icon-s-data",
        "el-icon-s-platform",
        "el-icon-s-opportunity"
      ],
      // 默认头像
      navlist: null
      // status:0
    }
  },
  props: {
    navs: {
      type: Array,
      defaults: []
    },
    username: {
      type: String,
      defaults: "默认用户"
    },
    // 根据权限显示对应内容
    status: {
      type: Number,
      defaults: 0
    },
    avatar: {
      type: String
    },
    minute: {
      type: Number
    }
  },
  created() {},
  methods: {
    // 展示导航栏
    getnavs() {
      if (this.status === 0) {
        this.navlist = this.navs.filter(item => {
          if (this.minute >= 10000) {
            return item.title === "收费管理"
          }
          return item.status === this.status
        })
      } else if (this.status === 1) {
        this.navlist = this.navs
      } else {
        this.navlist = 2
      }
    }
  },
  // eslint-disable-next-line no-dupe-keys
  async mounted() {
    await this.getnavs()
  },
  computed: {}
}
</script>
<style scoped>
.container {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.el-menu {
  border: none;
}
.user-ifno {
  padding: 5px 0px 5px 20px;
  display: flex;
  justify-content: space-between;
}
.block {
  border: 3px solid #ffffff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
.username {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  margin-right: auto;
}
.username .user-con {
  padding-left: 15px;
  display: flex;
  height: 100%;
  align-items: center;
}
.username .user-span:first-child {
  display: block;
  color: #9ca5af;
  font-size: 12px;
}
.username .user-span:last-child {
  display: inline-block;
  font-size: 15px;
  color: #ffffff;
}
.avatar {
  width: 100%;
  height: 100%;
}
.hide {
  display: none;
}
.container .baned {
  padding: 20px 10px 0;
  text-align: center;
  color: #ffffff;
  font-size: 18px;
}
</style>