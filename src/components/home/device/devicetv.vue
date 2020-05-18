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
        <!-- 筛选左边区域 -->
        <div class="left">
          <div>
            <tvlogo :model="seachquery.label" @selectlabel="selectlogo" @changelabel="changelabel" />
          </div>
          <div class="date-picker">
            <el-date-picker
              v-model="seachquery.datetime"
              type="date"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions"
              size="mini"
            ></el-date-picker>
          </div>
          <div>
            <el-input
              placeholder="设备名称"
              size="mini"
              class="head-input"
              v-model="seachquery.devicename"
            ></el-input>
            <el-button type="primary" size="mini" round @click="seachval">搜索</el-button>
            <el-button type="warning" size="mini" round @click="clearquery" :disabled="alldata">重置</el-button>
          </div>
        </div>
        <!-- 筛选右部区域 -->
        <div class="sort-device" v-if="status">
          <div :class="{'Dactive':sortdevice}" @click="sortDevice(true,'entire')">
            <span>全部设备</span>
          </div>
          <div :class="{'Dactive':!sortdevice}" @click="sortDevice(false,'common')">
            <span>未处理</span>
          </div>
          <div :class="['warp-user',{'warp-active':!sortdevice}]"></div>
        </div>
      </div>
      <!-- 表格区域 -->
      <div class="device-table" v-if="Dlist && JSON.stringify(Dlist)!=='[]'">
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
                <span class="see" @click="operate('',item._id,item.username)">查看</span>
                <span @click="operate('delete',item._id)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 详情对话框 -->
        <card :prompt="dialogdetail" @isprompt="closedialog" :content="editform" />
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
      <el-card v-else>
        <div class="seen" >{{'暂无设备记录'}}</div>
      </el-card>

      <!-- 修改对话框 -->
      <el-dialog title="编辑内容" :visible.sync="dialogVisible" width="32%" v-if="editform">
        <el-form
          size="small"
          label-position="right"
          label-width="100px"
          :model="editform"
          ref="editform"
          :rules="rulerepair"
          class="editform"
        >
          <el-form-item label="用户名">
            <el-input v-model="editform.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input
              class="input-down"
              size="mini"
              placeholder="选择品牌"
              suffix-icon="el-icon-arrow-down"
              v-model="editform.label"
              :disabled="status?true:false"
              v-if="status"
              style="width:100px"
            ></el-input>
            <tvlogo v-else :model="editform.label" @selectlabel="Slogo" />
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
import tvlogo from "./comon/tvLogo"
import card from "@/components/common/card"
export default {
  data() {
    return {
      // 请求体
      queryinfo: {
        query: null,
        pagenum: 1,
        pagesize: 10
      },
      // 控制顶部未处理动画
      sortdevice: true,
      total: 0,
      Dlist: null,
      // 详情对话框
      dialogdetail: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
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
      // 搜索请求体
      seachquery: {
        label: "",
        datetime: "",
        devicename: ""
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
          { min: 11, max: 11, message: "长度为11位" }
        ],
        status: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    }
  },
  components: {
    tvlogo,
    card
  },
  created() {
    // await this.getstatus()
    // 调用获取设备保修方法
    this.getdevice()
  },
  methods: {
    // 获取设备保修数据方法
    async getdevice() {
      let data
      // 获取用户状态
      const username = window.sessionStorage.getItem('username')
      const {data:info} = await this.$http.get('/home/users',{params:{
        username
      }})
      const Uinfo = info.data[0]
      if (!Uinfo.status) {
        // 获取当前用户名
        this.queryinfo.username = Uinfo.username
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
    // 根据_id获取对应的信息
    async getdevicebyid(data) {
      const { data: res } = await this.$http.get("/home/device", {
        params: data
      })
      this.editform = res.data
    },
    // 操作的方法
    async operate(type, id, username) {
      // 删除数据逻辑
      if (type === "delete") {
        const code = await deleted("/home/device", { _id: id })
        if (code === 1) {
          return this.getdevice()
        }
      } else if (type === "edit") {
        // console.log("edit", id)
        this.getdevicebyid({ _id: id })
        return (this.dialogVisible = true)
      }
      await this.getdevicebyid({ _id: id, username })
      this.dialogdetail = true
    },
    // 选择品牌名称
    selectlogo(name) {
      this.seachquery.label = name
    },
    Slogo(name) {
      this.editform.label = name
    },
    // 发送修改请求
    Editdevice() {
      this.$refs.editform.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            "/home/device",
            this.editform
          )
          if (res.code !== 1) return this.$message.error(res.msg)
          this.$message.success(res.msg)
          this.getdevice()
          this.dialogVisible = false
        } else {
          this.$message.error("请输入正确的信息！！")
          return false
        }
      })
    },
    // 选择状态
    selectstatus(command) {
      this.editform.status = parseInt(command)
    },
    // 选择受理人
    selectman(command) {
      this.editform.adminname = command
    },
    // 搜索设备
    async seachval() {
      if (!this.status) {
        this.seachquery.username = this.userinfo.username
      }
      this.seachquery.datetime = this.seachquery.datetime
        ? this.format(this.seachquery.datetime)
        : ""
      this.queryinfo.query = this.seachquery
      this.getdevice()
    },
    clearquery() {
      this.seachquery.datetime = ""
      this.seachquery.label = ""
      this.seachquery.devicename = ""
      this.getdevice()
    },
    // 顶部选择未处理数据
    sortDevice(val, type) {
      this.sortdevice = val
      if (type === "entire") {
        this.queryinfo.query = null
        for (let i in this.seachquery) {
          this.seachquery[i] = ""
        }
        this.getdevice()
      } else {
        this.queryinfo.query = 0
        for (let i in this.seachquery) {
          this.seachquery[i] = ""
        }
        this.getdevice()
      }
    },
    // 过滤时间方法
    format(origantime) {
      const dt = new Date(origantime)

      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + "").padStart(2, "0")
      const d = (dt.getDate() + "").padStart(2, "0")

      return `${y}-${m}-${d}`
    },
    // 关闭上次情况
    closedialog() {
      this.dialogdetail = false
    },
    // 改变品牌的值
    changelabel(value) {
      this.seachquery.label = value
    }
  },
  computed: {
    ...mapState(["status"]),
    alldata() {
      return (
        this.seachquery.label === "" &&
        this.seachquery.datetime === "" &&
        this.seachquery.devicename === ""
      )
    }
  },
  watch: {
    dialogVisible(newval) {
      if (!newval) {
        this.$refs.editform.resetFields()
      }
    }
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
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
  }
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
.seen {
  height: 100px;
  text-align: center;
  color: #999;
  line-height: 100px;
  font-size: 20px;
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
/* 顶部筛选 */
.sort-device {
  width: 250px;
  height: 28px;
  line-height: 28px;
  border-radius: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  background: #ffffff;
  justify-content: space-between;
  position: relative;
  div {
    font-size: 13px;
    color: #00a1d6;
    width: 50%;
    text-align: center;
    cursor: pointer;
    transition: color 0.5s ease;
  }
  .Dactive {
    color: #ffffff;
    position: relative;
    z-index: 99;
  }
  .warp-user {
    position: absolute;
    transition: all 0.5s ease;
    background: #00a1d6;
    width: 50%;
    height: 28px;
    border-radius: 30px;
    right: 50%;
  }
  .warp-active {
    right: 0;
  }
}
</style>