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
            <span class="user-span">Wlecome</span>
            <span class="user-span">{{username}}</span>
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
      <el-submenu :index="index+''" v-for="(item,index) in navs" :key="item.id">
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
      username: "默认用户",
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
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    };
  },
  props: {
    navs: {
      type: Array,
      defaults: []
    }
  },
  created() {},
  mounted() {},
  methods: {
  }
};
</script>
<style scoped>
.container{
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
}
.el-menu {
  border: none;
}
.user-ifno {
  padding:5px 0px 5px 20px;
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
}
.username .user-con{
  padding-left: 15px;
}
.username .user-span:first-child {
  display: inline-block;
  color: #9CA5AF;
  font-size: 12px;
}
.username .user-span:last-child {
  display: inline-block;
  font-size: 15px;
  color: #ffffff
}
</style>