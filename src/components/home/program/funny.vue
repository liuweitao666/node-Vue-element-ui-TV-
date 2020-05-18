<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节目管理</el-breadcrumb-item>
      <el-breadcrumb-item>动漫类</el-breadcrumb-item>
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
        { title: "搞笑" },
        { title: "热血" },
        { title: "催泪" },
        { title: "治愈" },
        { title: "励志" },
        { title: "恋爱" },
        { title: "奇幻" },
        { title: "科幻" },
        { title: "推理" },
        { title: "日常" },
        { title: "历史" },
        { title: "美食" },
        { title: "职场" },
        { title: "偶像" },
        { title: "泡面" },
        { title: "冒险" },
        { title: "竞技" },
        { title: "武侠" },
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