<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节目管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题部分 -->
    <el-card>
      <programList :programlist="programlist" v-if="programlist"/>
     
    </el-card>
  </div>
</template>
<script>
import programList from "./common/programlist"
import { mapActions } from "vuex"
export default {
  data() {
    return {
      // 保存电影数据
      programlist: null,
      name: ""
    }
  },
  components: {
    programList
  },
  created() {
    this.getprogramlist()
  },
  methods: {
    ...mapActions(["getlist"]),
    // 获取电影列表
    async getprogramlist() {
      const { data: res } = await this.getlist({
        title: this.$route.path.slice(1),
        name: this.name
      })
      if (res.code !== 1) return this.$message.error(res.msg)
      this.programlist = res.data
      // console.log(res)
    }
  }
}
</script>
<style scoped>
</style>