<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节目管理</el-breadcrumb-item>
      <el-breadcrumb-item>综艺类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题部分 -->
    <el-card>
      <programList :programlist="programlist" @resetdata ="resetdata" :Type="Type" v-if="programlist"/>
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
      name: "",
      Type: [
        { title: "全部类型" },
        { title: "播报" },
        { title: "情感" },
        { title: "搞笑" },
        { title: "访谈" },
        { title: "选秀" },
        { title: "游戏" },
        { title: "相亲" },
        { title: "职场" },
        { title: "脱口秀" },
        { title: "真人秀" },
        { title: "音乐" }         
      ],
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
      console.log(res)
      if (res.code !== 1) return this.$message.error(res.msg)
      this.programlist = res.data
    },
    // 获取筛选数据
    resetdata(data){
      console.log(data)
      this.programlist = data
    }
  }
}
</script>
<style scoped>
</style>