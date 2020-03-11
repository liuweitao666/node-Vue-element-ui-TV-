<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>电视设备</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题部分 -->
    <el-card>
        <el-alert type="error" title="友情提示：开发中……" show-icon ></el-alert>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  created() {},
  methods: {}
};
</script>
<style scoped>
</style>