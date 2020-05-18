<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>收费管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户费用</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示区域 -->
    <!-- 交易记录区域 -->
    <transition name="record">
      <div class="patment" v-if="isrecord">
        <div class="payment-title">
          <span>交易记录</span>
          <i class="el-icon-close icon" @click="closerecord"></i>
        </div>
        <div v-if="toll.length>0">
          <div class="payment-content" v-for="item in toll" :key="item.id">
            <span>金额：-{{item.price}}元</span>
            <span>时间：{{item.createtime | dateformat()}}</span>
          </div>
        </div>
        <div class="null" v-else>暂无交易记录</div>
      </div>
    </transition>
    <prompt :prompt="prompts" :msg="'缴费'" @isprompt="payment" :price="Price" />
    <el-card>
      <div class="paytitle">
        <div class="left">
          <i class="el-icon-s-finance"></i>
          <span class="title">费用查缴</span>
        </div>
        <div class="right" @click="record">
          <i class="el-icon-s-order color-order"></i>
          <span class="order">账单</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="container">
        <!-- 查询费用表单 -->
        <el-form :model="paydata" label-width="100px" ref="seach" size="mini" :rules="payrules">
          <el-form-item label="城市" prop="city" class="selectarea">
            <city :model="paydata.city" @selected="selectCity" :width="'320px'" :top="'top'" />
          </el-form-item>
          <el-form-item label="出账机构" prop="organ">
            <el-dropdown @command="selectorgan">
              <el-input v-model="paydata.organ" suffix-icon="el-icon-arrow-down" placeholder="出账机构"></el-input>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in Organ"
                  :key="index"
                  :command="item"
                >{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="用户证号" prop="number">
            <el-input v-model="paydata.number" placeholder="请输入正确的用户证号" class="input-w"></el-input>
          </el-form-item>
          <el-form-item label="查询月份" prop="datetime">
            <el-date-picker
              v-model="paydata.datetime"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="seachdata">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="main-right">
          <!-- 展示数据区域 -->
          <div v-if="Dprice">
            <div class="calumn">
              <span>用户：</span>
              <span>{{Dprice.name}}</span>
            </div>
            <div class="price">
              <span>当前欠费：</span>
              <span>{{Dprice.price}}</span>
            </div>
            <el-button @click="handlesubmit" type="primary" size="small">缴费</el-button>
            <div style="padding-top:50px;">
              <el-alert title="本次缴费并不涉及真实金额，仅测试使用！" type="info" show-icon close-text="知道了"></el-alert>
            </div>
          </div>
          <div v-else class="p-null">
            <span>
              <i class="el-icon-search"></i>
              请先查询！
            </span>
          </div>
        </div>
      </div>

      <el-alert
        :title="status?'您是管理员，可以随意！':`当前已看视频${minute}分钟${second}秒，您目前观看视频产生费用${expense}元(RMB),请及时缴费!`"
        type="warning"
        show-icon
        :closable="false"
        v-if="time || price"
      ></el-alert>
      <!-- 历史记录 -->
      <history :pro="programs" :id="userinfo._id" v-if="programs && userinfo" />
    </el-card>
  </div>
</template>
<script>
import { mapState } from "vuex"
import { finddata } from "@/common/crod/index"
import history from "./history"
import { mockapi } from "@/network/request.js"
import city from "./city"
import prompt from "../../common/prompt"
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
      price: 0,
      paydata: {
        city: "",
        datetime: "",
        number: "",
        organ: ""
      },
      payrules: {
        city: [{ required: true, message: "不能为空", trigger: "blur" }],
        datetime: [{ required: true, message: "不能为空", trigger: "blur" }],
        number: [
          {
            required: true,

            message: "不能为空",
            trigger: "blur"
          },
          { min: 18, max: 18, message: "格式不正确", trigger: "blur" }
        ],
        organ: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      // 机构数据
      Organ: ["东方有线网络公司", "湘西有线网络公司"],
      Dprice: null,
      pickerOptions: {
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              picker.$emit("pick", [new Date(), new Date()])
            }
          },
          {
            text: "今年至今",
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit("pick", [start, end])
            }
          }
        ]
      },
      // 控制缴费区域
      prompts: false,
      // 缴费金额
      Price: 0,
      // 显示历史账单
      isrecord: false,
      toll: null,
      fakername: ""
    }
  },
  components: {
    history,
    city,
    prompt
  },
  created() {
    // 获取当前用户名，
    this.username = sessionStorage.getItem("username")
    // 获取费用数据和观看历史记录
    this.getprograms()
    // 获取地址
  },
  methods: {
    // 计算数据
    computedata() {
      this.minute = parseInt(this.time / 60)
      this.second = (this.time - this.minute * 60).toFixed(2)
      this.expense = (this.price / 100).toFixed(2)
    },
    async getprograms() {
      const { data: res } = await finddata("/home/users", {
        username: this.username
      })
      this.programs = res[0].program.reverse()
      // 用户总时间
      this.fakername = res[0].username
      this.time = res[0].minutes
      this.price = res[0].minute
      this.toll = res[0].toll.reverse()
      // console.log(this.price,this.username)
      this.computedata()
    },
    selectCity(city) {
      this.paydata.city = city
    },
    // 选择机构
    selectorgan(organ) {
      this.paydata.organ = organ
    },
    // 查询费用
    async seachdata() {
      this.$refs.seach.validate(async vlied => {
        if (!vlied) return this.$message.error("请输入正确的内容！")
        let faker = {}
        faker.price = this.price
        faker.name = this.username
        this.$message.success("查询成功！")
        this.Dprice = faker
        console.log(faker)
        // const { data: res } = await mockapi(
        //   `/api/expense/${this.userinfo.username}`
        // )
        // if (res.status === 200) {
        //   this.$message.success(res.message)
        //   this.Dprice = res.data
        //   console.log(this.Dprice)
        // }
      })
    },
    // 缴费
    handlesubmit() {
      this.prompts = true
    },
    // 获取地址
    async getaddress() {
      const { data: res } = await mockapi("/api/region")
      console.log(res)
    },
    // 支付
    async payment(price) {
      if (price) {
        const { data: res } = await this.$http.put("/home/pay", {
          price,
          username: this.userinfo.username,
          paydata: this.paydata
        })
        if (res.code !== 1) {
          return this.$message.error(res.msg)
        }

        this.$message.success(res.msg)
        setTimeout(() => {
          window.open(res.data)
        }, 1000)
        // this.gettoll()
        setTimeout(() => {
          this.getprograms()
          return (this.prompts = false)
        }, 5000)
      } else {
        this.prompts = false
      }
    },
    // 显示支付记录
    record() {
      this.isrecord = true
    },
    closerecord() {
      this.isrecord = false
    }
  },
  computed: {
    ...mapState(["userinfo", "status"])
  }
}
</script>
<style lang="scss" scoped>
.paytitle {
  height: 45px;
  line-height: 45px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    display: inline-block;
    padding-left: 5px;
  }
  .right {
    cursor: pointer;
    .color-order {
      color: #e6a23c;
      font-size: 17px;
    }
    .order {
      padding-left: 5px;
    }
  }
  .right:hover {
    color: #e6a23c;
  }
}
.selectarea {
  .el-dropdown {
    width: 120px;
  }
}
// 查询数据区域
.container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
  .main-right {
    width: 500px;
    padding-left: 20px;
    border-left: 1px solid #e5e5e5;
    display: flex;
    justify-content: center;
    text-align: center;
    .p-null {
      font-size: 25px;
      color: #999;
      padding-top: 90px;
    }
    .calumn {
      width: 490px;
      line-height: 45px;
      border-bottom: 1px solid #e5e5e5;
    }
    .price {
      width: 490px;
      line-height: 45px;
      margin-bottom: 20px;
    }
  }
}
/* 交易记录 */
.patment {
  position: fixed;
  right: 20px;
  top: 60px;
  width: 220px;
  height: 479px;
  background: #ffffff;
  z-index: 99;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  overflow-x: hidden;
}
.payment-title {
  padding: 10px 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
}
.payment-content {
  border-top: 1px solid #e5e5e5;
  padding-top: 10px;
}
.payment-content span {
  display: inline-block;
  width: 100%;
  color: #999;
  font-size: 13px;
  padding: 0px 15px 5px;
}
.null {
  width: 100%;
  text-align: center;
  padding: 30px 0;
  font-size: 20px;
  color: #999;
}
.record-enter,
.record-leave-to {
  opacity: 0;
  transform: translateX(50%);
}
.record-enter-active,
.record-leave-active {
  transition: all 0.5s ease;
}
.icon {
  cursor: pointer;
}
</style>