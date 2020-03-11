<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节目管理</el-breadcrumb-item>
      <el-breadcrumb-item>电视剧类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题部分 -->
    <el-card>
      <programlist  :programlist ="programlist"/>
    </el-card>
  </div>
</template>
<script>
import programlist from './common/programlist'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      // 电视剧列表数据 
      programlist:null,
      name:''
    };
  },
  components:{
    programlist
  },
  created() {
    this.getprogramlist()
  },
  methods: {
    ...mapActions([
      'getlist'
    ]),
    async getprogramlist() {
      const {data:res} = await this.getlist({title:this.$route.path.slice(1),name:this.name});
      if (res.code !== 1) return this.$message.error("获取数据失败");
      this.programlist = res.data;
    },
  }
};
</script>
<style >

</style>