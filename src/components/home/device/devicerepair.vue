<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备报修</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题部分 -->
    <el-card>
      <div class="container">
        <img src="@/assets/image/repair.png" alt />
        <div class="card-right" v-if="userinfo">
          <el-form
            ref="repair"
            :model="repairinfo"
            :rules="rulerepair"
            size="small"
            label-position="top"
          >
            <el-form-item label="用户名">
              <el-input class="input-w" :value="userinfo.username" disabled></el-input>
            </el-form-item>
            <!-- 选择品牌 -->
            <el-form-item label="品牌" prop="label">
              <div class="label">
                <el-dropdown @command="selectlogo" trigger="click">
                  <el-input
                    class="input-down"
                    size="mini"
                    placeholder="选择品牌"
                    suffix-icon="el-icon-arrow-down"
                    v-model="repairinfo.label"
                  ></el-input>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item,index) in TVlogo"
                      :key="index"
                      :command="item.name"
                    >
                      <img :src="item.url" alt class="tv-logo" />
                      {{item.name}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <span>* 目前仅提供7种品牌，请谅解！</span>
              </div>
            </el-form-item>
            <el-form-item label="设备名称" prop="devicename">
              <el-input class="input-w" placeholder="比如:小米电视4A" v-model="repairinfo.devicename"></el-input>
            </el-form-item>
            <el-form-item label="故障描述" prop="detail">
              <el-input class="input-w" placeholder="设备故障原因" v-model="repairinfo.detail"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <el-input class="input-w" placeholder="维修人员上门维修" v-model="repairinfo.address"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input class="input-w" placeholder="手机号" v-model="repairinfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="上门时间段">
              <el-time-select
                placeholder="起始时间"
                v-model="repairinfo.startTime"
                :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
               }"
              ></el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="repairinfo.endTime"
                :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: repairinfo.startTime
                }"
              ></el-time-select>
            </el-form-item>
            <div class="btn">
              <el-button size="small" @click="clearinfo">重置</el-button>
              <el-button type="primary" size="small" @click="upload">上报</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  data() {
    return {
      // 保修数据请求体
      repairinfo: {
        username: "",
        devicename: "",
        startTime: "",
        endTime: "",
        detail: "",
        address: "",
        label: "",
        phone: ""
      },
      //验证表单字段
      rulerepair: {
        devicename: [{ required: true, message: "不能为空", trigger: "blur" }],
        detail: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 6, message: "描述太短", trigger: "blur" }
        ],
        address: [{ required: true, message: "不能为空", trigger: "blur" }],
        label: [{ required: true, message: "不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 11, message: "长度不能少于11位" }
        ]
      },
      // 电视品牌数据
      TVlogo: [
        { name: "华为", url: require("@/assets/image/logo/华为.png") },
        { name: "康佳", url: require("@/assets/image/logo/康佳.png") },
        { name: "乐视", url: require("@/assets/image/logo/乐视.png") },
        { name: "三星", url: require("@/assets/image/logo/三星.png") },
        { name: "索尼", url: require("@/assets/image/logo/索尼.png") },
        { name: "小米", url: require("@/assets/image/logo/小米.png") },
        { name: "TCL", url: require("@/assets/image/logo/TCL.png") }
      ]
    }
  },
  created() {},
  methods: {
    // 重置保修表单
    clearinfo() {
      this.$refs.repair.resetFields()
    },
    // 上传保修数据
    upload() {
      this.$refs.repair.validate(async valid => {
        if (valid) {
          this.repairinfo.username = this.userinfo.username
          const { data: res } = await this.$http.post(
            "/home/device",
            this.repairinfo
          )
          if (res.code !== 1) return this.$message.error(res.msg)
          this.$message.success(res.msg)
        } else {
          this.$message.error("请输入正确的信息！！")
          return false
        }
      })
    },
    selectlogo(name) {
      this.repairinfo.label = name
    }
  },
  computed: {
    ...mapState(["userinfo"])
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  background: #f7f8fc;
  .container {
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    img {
      width: 420px;
      margin-right: 50px;
    }
    .card-right {
      position: relative;
      background: #ffffff;
      border-radius: 5px;
      padding: 20px;
      margin-right: 40px;
      box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.2);
      .input-w {
        width: 350px;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 165px;
        margin-right: 10px;
      }
      .btn {
        padding-top: 5px;
        padding-right: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
.el-dropdown {
  width: 100px;
}
// 品牌样式
.label {
  display: flex;
  justify-content: space-between;
  span {
    color: #0150ff;
    display: inline-block;
    font-size: 12px;
  }
}
.tv-logo {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}
.el-dropdown-menu__item {
  display: flex;
  align-items: center;
}
</style>