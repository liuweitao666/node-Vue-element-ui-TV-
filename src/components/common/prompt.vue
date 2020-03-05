<template>
  <div>
    <div class="local" v-if="prompt">
      <div class="success">
        <div class="prompt">
          <span>{{msg}}</span>
          <i class="el-icon-close close" @click="closeprompt" v-if="!price"></i>
          <i class="el-icon-close close" @click="close" v-else></i>
        </div>
        <div class="success-bottom">
          <img src="@/assets/image/info/success.000f491.png" alt />
          <div style="padding:30px 0;">
            <label class="label">缴费金额:</label> <el-input v-if="price"  v-model="payment" class="price" size="small"></el-input>
            <span v-else>更新资料成功！</span>
          </div>
          <el-button type="primary" size="middle" @click="closeprompt">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      promptself:false,
      payment:0
    };
  },
  props: {
    msg: {
      type: String
    },
    prompt: {
      type: Boolean,
      defaults: false
    },
    price:{
        type:Number,
        defaults:0
    }
  },
  created(){
      console.log(this.peice)
      this.payment = this.price
  },
  methods: {
    //   关闭选框
    closeprompt() {
      this.$emit('isprompt',this.payment)
    },
    // 关闭
    close(){
        this.$emit('isprompt')
    }
  },
  computed:{
      
  }
};
</script>
<style scoped>
.local {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}
.success {
  width: 400px;
  height: 335px;
  position: absolute;
  background: #ffffff;
  left: 50%;
  top: 50%;
  height: 50%;
  z-index: 10001;
  transform: translate(-50%, -50%);
  box-shadow: 0 3px 26px rgba(0, 0, 0, 0.5);
  animation: success 0.3s ease;
}
.success .prompt {
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
}
.success .success-bottom {
  margin-top: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
/* 输入框 */
.price{
    width: 100px;
}
.label{
    font-size: 14px;
}
.close{
    cursor: pointer;
}
@keyframes success {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
  }
  80% {
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>