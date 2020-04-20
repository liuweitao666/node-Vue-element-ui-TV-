<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{status?'故障设备管理':'我的报修'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体部分 -->
    <div class="device-main">
      <!-- 筛选区域 -->
      <div class="device-head">
        <div>
          <el-dropdown @command="selectlogo" trigger="click">
            <el-input
              class="input-down"
              size="mini"
              placeholder="选择品牌"
              suffix-icon="el-icon-arrow-down"
              v-model="label"
            ></el-input>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,index) in TVlogo" :key="index" :command="item.name">
                <img :src="item.url" alt class="tv-logo" />
                {{item.name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="date-picker">
          <el-date-picker
            v-model="datetime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
            size="mini"
          ></el-date-picker>
        </div>
        <div>
          <el-input placeholder="设备名称" size="mini" class="head-input"></el-input>
          <el-button type="primary" size="mini" round>搜索</el-button>
        </div>
      </div>
      <!-- 表格区域 -->
      <div class="device-table" v-if="Dlist">
        <table>
          <thead>
            <tr>
              <th class="face">序号</th>
              <th style="text-align:center;padding-right:6px;">品牌</th>
              <th>设备名称</th>
              <th style="text-align:center;padding-right:30px;">状态</th>
              <th>上报时间</th>
              <th>预约时间</th>
              <th>{{status?'预约人':'受理人'}}</th>
              <th>{{status?'地址':'联系方式'}}</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr v-for="(item,index) in Dlist" :key="item._id">
              <td class="face">{{index+1}}</td>
              <td style="text-align:center;padding-right:6px;">{{item.label}}</td>
              <td style="width:150px">{{item.devicename}}</td>
              <td class="tface">
                <div class="success" v-if="item.status">已处理</div>
                <div class="loading" v-else>未处理</div>
              </td>
              <td style="width:200px;">{{item.createtime|dateformat()}}</td>
              <td>{{item.startTime+'-'+item.endTime}}</td>
              <td>{{status?item.username:(item.status?item.adminname:'暂未受理')}}</td>
              <td>{{status?item.address:(item.status?item.Aphone:'请等待受理人接单')}}</td>
              <td class="caozuo">
                <span @click="operate('edit',item._id)">修改</span>
                <span class="see">查看</span>
                <span @click="operate('delete',item._id)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 修改对话框 -->
        <el-dialog :title="title"></el-dialog>
        <!-- 分页区域 -->
        <div class="pagenum">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryinfo.pagenum"
            :page-sizes="[1, 3, 5, 10]"
            :page-size="queryinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <!-- 修改对话框 -->
      <el-dialog title="详情内容" :visible.sync="dialogVisible" width="32%" v-if="editform">
        <el-form
          size="small"
          label-position="right"
          label-width="100px"
          :model="editform"
          :rules="rulerepair"
          class="editform"
        >
          <el-form-item label="用户名">
            <el-input v-model="editform.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="editform.label" :disabled="status"></el-input>
          </el-form-item>
          <!-- 管理员可见 -->
          <el-form-item label="状态" prop="status" v-if="status">
            <el-dropdown @command="selectstatus" trigger="click" style="width:100px;">
              <el-input
                class="input-down"
                size="mini"
                placeholder="修改状态"
                suffix-icon="el-icon-arrow-down"
                v-model="editform.status"
                style="width:100px"
              ></el-input>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">未处理</el-dropdown-item>
                <el-dropdown-item command="1">已处理</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="受理人" prop="adminname" v-if="status">
            <el-dropdown @command="selectman" trigger="click" style="width:100px;">
              <el-input
                class="input-down"
                size="mini"
                placeholder="受理人"
                suffix-icon="el-icon-arrow-down"
                v-model="editform.adminname"
                style="width:100px"
              ></el-input>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="李娟">李娟</el-dropdown-item>
                <el-dropdown-item command="裁缝">裁缝</el-dropdown-item>
                <el-dropdown-item command="工人一号">工人一号</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="联系方式" prop="Aphone" v-if="status">
            <el-input v-model="editform.Aphone"></el-input>
          </el-form-item>
          <!-- 用户可见 -->
          <el-form-item label="设备名称" prop="devicename" v-if="!status">
            <el-input class="input-w" placeholder="比如:小米电视4A" v-model="editform.devicename"></el-input>
          </el-form-item>
          <el-form-item label="故障描述" prop="detail" v-if="!status">
            <el-input class="input-w" placeholder="设备故障原因" v-model="editform.detail"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址" prop="address" v-if="!status">
            <el-input class="input-w" placeholder="维修人员上门维修" v-model="editform.address"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone" v-if="!status">
            <el-input class="input-w" placeholder="手机号" v-model="editform.phone"></el-input>
          </el-form-item>
          <el-form-item label="上门时间段" v-if="!status">
            <el-time-select
              placeholder="起始时间"
              style="width:165px;margin-right:15px;"
              v-model="editform.startTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
               }"
            ></el-time-select>
            <el-time-select
              placeholder="结束时间"
              style="width:165px"
              v-model="editform.endTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: editform.startTime
                }"
            ></el-time-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="Editdevice()" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import { deleted } from "@/common/crod/index"
export default {
  data() {
    return {
      // 请求体
      queryinfo: {
        pagenum: 1,
        pagesize: 5
      },
      datetime: "",
      total: 0,
      Dlist: null,
      title: "状态变动",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date())
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit("pick", date)
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", date)
            }
          }
        ]
      },
      label: "",
      // 电视品牌数据
      TVlogo: [
        { name: "华为", url: require("@/assets/image/logo/华为.png") },
        { name: "康佳", url: require("@/assets/image/logo/康佳.png") },
        { name: "乐视", url: require("@/assets/image/logo/乐视.png") },
        { name: "三星", url: require("@/assets/image/logo/三星.png") },
        { name: "索尼", url: require("@/assets/image/logo/索尼.png") },
        { name: "小米", url: require("@/assets/image/logo/小米.png") },
        { name: "TCL", url: require("@/assets/image/logo/TCL.png") }
      ],
      // 对话框
      dialogVisible: false,
      editform: null,
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
          { min: 11, message: "长度为11位" }
        ],
        adminname: [{ required: true, message: "不能为空", trigger: "blur" }],
        Aphone: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 11,max:11, message: "长度为11位" }
        ],
        status: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    }
  },
  async created() {
    // await this.getstatus()
    // 调用获取设备保修方法
    setTimeout(() => {
      this.getdevice()
    }, 200)
  },
  methods: {
    // 获取设备保修数据方法
    async getdevice() {
      let data
      // 获取用户状态
      let status = this.status
      if (!status) {
        // console.log(status)

        // 获取当前用户名
        this.queryinfo.username = window.sessionStorage.getItem("username")
        data = await this.$http.get("/home/device", {
          params: this.queryinfo
        })
      } else {
        data = await this.$http.get("/home/device", {
          params: this.queryinfo
        })
      }
      // 获取到的数据
      let result = data.data
      if (result.code !== 1) return this.$message.error(result.msg)

      this.Dlist = result.data
      this.total = result.total
    },
    // 监听每页显示多少条
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getdevice()
    },
    // 监听当前页的变化
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getdevice()
    },
    // 操作的方法
    async operate(type, id) {
      // 删除数据逻辑
      if (type === "delete") {
        const code = await deleted("/home/device", { _id: id })
        if (code === 1) {
          this.getdevice()
        }
      } else if (type === "edit") {
        console.log("edit", id)
        const { data: res } = await this.$http.get("/home/device", {
          params: { _id: id }
        })
        this.editform = res.data
        this.dialogVisible = true
      }
    },
    // 选择品牌名称
    selectlogo(name) {
      this.label = name
    },
    // 发送修改请求
    async Editdevice() {
      const { data: res } = await this.$http.put("/home/device", this.editform)
      if (res.code !== 1) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.getdevice()
      this.dialogVisible = false
    },
    // 选择状态
    selectstatus(command) {
      this.editform.status = parseInt(command)
    },
    // 选择受理人
    selectman(command) {
      this.editform.adminname = command
    }
  },
  computed: {
    ...mapState(["status"])
  }
}
</script>
<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
table tr {
  width: 100%;
}
// 头部搜索区域样式
.device-head {
  display: flex;
  margin-bottom: 15px;
  .head-input {
    width: 320px;
    margin-right: 10px;
  }
  .input-down {
    width: 110px;
  }
  .date-picker {
    margin: 0 10px;
  }
}
// 表格部分样式
.device-table {
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 4px;
  th {
    text-align: left;
    border-bottom: 1px #e5e5e5 solid;
    padding-bottom: 14px;
    font-size: 15px;
    color: #b8c4cc;
  }
  .face {
    width: 40px;
    text-align: center;
  }
  .pagenum {
    padding: 15px 30px 0 0;
    right: 0;
    width: 100%;
    display: flex;
  }
  .tbody {
    td {
      border-bottom: 1px #e5e5e5 solid;
      line-height: 45px;
      font-size: 13px;
    }
    .tface {
      width: 100px;
      text-align: center;
      padding-right: 30px;
      div {
        vertical-align: middle;
        line-height: 18px;
        font-size: 12px;
        display: inline-block;
        padding: 1px 8px;
        border-radius: 30px;
        height: 18px;
      }
      .success {
        border: #67c23a solid 1px;
        color: #67c23a;
        background: rgb(225, 243, 216);
      }
      .loading {
        background: rgb(240, 249, 235);
        border: #0150ff solid 1px;
        color: #0150ff;
      }
    }
    .caozuo {
      span {
        color: #0150ff;
        font-weight: 500;
        cursor: pointer;
      }
      span:hover {
        text-decoration: underline;
      }
    }
    .see {
      display: inline-block;
      padding: 0 5px 0;
    }
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
.editform .el-input {
  width: 345px;
}
// 表格分离标题
</style>