<template>
  <div class="container">
    <!-- 顶部logo部分 -->
    <div class="top">
      <div class="logo"></div>
      <!-- 头像区域 -->
      <div class="user-ifno">
        <div class="block">
          <el-avatar :size="40" :src="circleUrl"></el-avatar>
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
    >
      <el-submenu :index="index+''" v-for="(item,index) in navlist" :key="item.id">
        <template slot="title">
          <i :class="navIcons[index]"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item :index="'/'+item.path" v-for="(item,index) in item.children" :key="index">
          <i class="el-icon-menu"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
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
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      navlist: null
      // status:0
    };
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
    }
  },
  created() {
    this.getnavs();
  },
  mounted() {},
  methods: {
    // 展示导航栏
    getnavs() {
      if (this.status === 0) {
        this.navlist = this.navs.filter(item => {
          return item.status === this.status;
        });
      } else {
        this.navlist = this.navs;
      }
    }
  },
  computed: {}
};
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
</style>