<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>收费管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户费用</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        :title="status?'您是管理员，可以随意！':`当前已看视频${minute}分钟${second}秒，您目前欠费${expense}元(RMB),请及时缴费!`"
        type="warning"
        show-icon
        :closable="false"
        v-if="time || price"
      ></el-alert>
      <history :pro="programs" :id="id" v-if="programs" />
    </el-card>
  </div>
</template>
<script>
import {mapState } from "vuex";
import { finddata } from "@/common/crod/index";
import history from "./history";
export default {
  data() {
    return {
      // 分钟
      minute: null,
      // 秒
      second: null,
      // 费用
      expense: null,
      // 用户名
      username: "",
      programs: null,
      time: 0,
      price:0
    };
  },
  components: {
    history
  },
  created() {
    // 获取当前用户名，
    this.username = sessionStorage.getItem("username");
    // 获取费用数据和观看历史记录
    this.getprograms();
  },
  methods: {
    // 计算数据
    computedata() {
      this.minute = parseInt(this.time / 60);
      this.second = this.time - this.minute * 60;
      this.expense = this.price/10;
    },
    async getprograms() {
      const { data: res } = await finddata("/home/users", {
        username: this.username
      });
      this.programs = res[0].program.reverse();
      // 用户总时间
      this.time = res[0].minutes;
      this.price = res[0].minute
      this.computedata();
    }
  },
  computed: {
    ...mapState(['userinfo','status']),
    id(){
      return this.userinfo._id
    }
  }
};
</script>
<style scoped>
</style>