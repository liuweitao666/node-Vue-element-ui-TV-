<template>
  <div>
    <!-- 交易记录区域 -->
    <transition name="record">
      <div class="patment" v-if="isrecord">
        <div class="payment-title">
          <span>交易记录</span>
          <i class="el-icon-close icon" @click="closerecord" ></i>
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

    <!-- 提示区域 -->
    <prompt :prompt="prompts" :msg="'发现隐藏支付通道'" @isprompt="payment" :price="price" />
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>收费管理</el-breadcrumb-item>
      <el-breadcrumb-item>缴费</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <!-- 费用详情 -->
      <el-col :span="10">
        <el-card>
          <h4>费用详情</h4>
          <div class="expense-pro">
            <div class="avatar">
              <img :src="'http://127.0.0.1:3000'+avatar" alt class="avatar-img" />
              <div class="martop">
                <span>{{userinfo.username}}</span>
              </div>
            </div>
            <div class="progress">
              <el-progress type="dashboard" :percentage="price" :color="colors"></el-progress>
              <div>
                <span>欠费百分比</span>
              </div>
            </div>
          </div>
          <div class="expense" v-if="status">
            <span>尊贵的管理员，您可以免费使用！</span>
          </div>
          <div class="expense" v-else>
            <span>尊敬的用户，{{userinfo.username}}</span>
          </div>
          <div class="expense">
            <span>您当月已欠费：{{price}}元(RMB)</span>
            <span class="pad">
              上限：
              <span style="color:#f56c6c">1000</span>元
            </span>
          </div>
          <div class="expense">
            <span>
              请及时
              <span class="monipay" @click="hidepay">缴费</span>，否则将会影响您的正常使用！
            </span>
          </div>
        </el-card>
      </el-col>
      <!-- 支付方式 -->
      <el-col :span="14">
        <el-card>
          <div class="record">
            <h4>支付方式</h4>
            <div class="right" @click="record">
              <i class="el-icon-s-order color-order"></i>
              <span class="order">账单</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="payment">
            <div class="contain">
              <img src="@/assets/image/zfb.png" alt />
              <div class="martop">
                <span>支付宝</span>
              </div>
            </div>
            <div class="contain">
              <img src="@/assets/image/wxpay.png" alt />
              <div class="martop">
                <span>微信</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { finddata } from "@/common/crod/index";
import prompt from "../../common/prompt";
export default {
  data() {
    return {
      // 费用
      price: 0,
      username: null,
      // 仪盘表
      colors: [
        { color: "#5cb87a", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#1989fa", percentage: 60 },
        { color: "#6f7ad3", percentage: 80 },
        { color: "#f56c6c", percentage: 100 }
      ],
      avatar: null,
      prompts: false,
      isrecord: false,
      toll: null
    };
  },
  components: {
    prompt
  },
  created() {
    // 获取当前用户名，
    this.username = sessionStorage.getItem("username");
    this.gettoll();
  },
  methods: {
    // 获取当前用户消息
    async gettoll() {
      const { data: res } = await finddata("/home/users", {
        username: this.username
      });
      this.programs = res[0].program.reverse();
      this.price = (res[0].minute/100).toFixed(2);
      this.price = parseFloat(this.price)
      this.avatar = res[0].avatar;
      this.toll = res[0].toll.reverse();
    },
    // 控制弹窗是否出现
    hidepay() {
      this.prompts = true;
    },
    // 支付请求
    async payment(price) {
      if (price) {
        const { data: res } = await this.$http.put("/home/pay", {
          price,
          username: this.userinfo.username
        });
        if (res.code !== 1) {
          return this.$message.error(res.msg);
        }
        this.$message.success(res.msg);
        this.gettoll();
        return (this.prompts = false);
      }
     
        this.prompts = false;
    
    },
    // 显示支付记录
    record() {
      this.isrecord = true;
    },
    closerecord() {
      this.isrecord = false;
    }
  },
  // eslint-disable-next-line no-dupe-keys
  computed: {
    ...mapState(["userinfo", "status"])
  }
};
</script>
<style scoped>
/* 费用详情 */
.expense {
  margin-top: 15px;
  font-size: 15px;
}
.pad {
  display: inline-block;
  padding-left: 20px;
}
.expense-pro {
  display: flex;
  justify-content: space-around;
}
.expense-pro .progress {
  text-align: center;
}
.expense-pro .avatar {
  width: 116px;
  height: 116px;
  text-align: center;
  margin-top: 5px;
}
.expense-pro .avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.martop {
  padding-top: 5px;
}
/* 支付方式 */
.payment {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}
.contain {
  width: 30%;
  text-align: center;
}
.contain img {
  width: 100%;
  height: 204px;
}
/* 缴费 */
.monipay {
  color: #67c23a;
  font-weight: 700;
  cursor: pointer;
}
/* 支付记录 */
.record {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.color-order {
  color: #e6a23c;
}
.right {
  cursor: pointer;
  font-size: 17px;
}
.order {
  padding-left: 5px;
}
.right:hover {
  color: #e6a23c;
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
.icon{
  cursor: pointer;
}
</style>