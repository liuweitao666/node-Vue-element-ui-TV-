<template>
  <div>
    <div class="local" v-if="prompt">
      <!-- 背景 -->
      <div class="entire" @click.stop="handlehide"></div>
      <!-- 内容区域 -->
      <div class="success">
        <div class="prompt">
          <span>详情页面</span>
          <i class="el-icon-close close" @click.stop="handlehide"></i>
        </div>
        <div v-if="content" class="prompt-buttom">
          <!-- 头像部分 -->
          <div class="avatar">
            <span class="image">
              <img :src="'http://127.0.0.1:3000'+content.avatar" alt />
            </span>
            <span>{{content.username}}</span>
          </div>
          <!-- 短字段部分 -->
          <div class="short-part">
            <div>
              <span>品牌：</span>
              <span>{{content.label}}</span>
            </div>
            <div class="status">
              <span>状态：</span>
              <span class="ready" v-if="content.status">已处理</span>
              <span class="loading" v-else>未处理</span>
            </div>
            <div>
              <span>设备名：</span>
              <span>{{content.devicename}}</span>
            </div>
          </div>
          <!-- 时间部分 -->
          <div class="time-part">
            <div>
              <span>上报时间：</span>
              <span>{{content.createtime | dateformat()}}</span>
            </div>
            <div>
              <span>预约时间段：</span>
              <span>{{content.startTime+'-'+content.endTime}}</span>
            </div>
          </div>
          <div>
            <span>联系方式：</span>
            <span>{{content.phone}}</span>
          </div>
        </div>
        <div class="langer">
          <div class="address">
            <span>地址：</span>
            <span>{{content.address}}</span>
          </div>
          <div class="detail">
            <span style="display:inline-block;text-overflow:ellipsis;white-space: nowrap">故障描述：</span>
            <span class="content">{{content.detail}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  data() {
    return {
      promptself: false,
      payment: 0
    }
  },
  props: {
    msg: {
      type: String
    },
    // 空字组件是否显示
    prompt: {
      type: Boolean,
      defaults: false
    },
    // 显示的内容
    content: {
      type: Object,
      default: null
    }
  },
  created() {},
  methods: {
    // 关闭
    close() {
      this.$emit("isprompt")
    },
    // 点击显示区域外关闭
    handlehide() {
      this.$emit("isprompt")
      console.log(this.content)
    }
  },
  computed: {
    ...mapState(["status"])
  }
}
</script>
<style lang="scss" scoped>
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
  .entire {
    width: 100%;
    height: 100%;
  }
}
.success {
  width: 486px;
  position: absolute;
  background: #ffffff;
  left: 50%;
  top: 40vh;
  z-index: 10001;
  transform: translate(-50%, -50%);
  box-shadow: 0 3px 26px rgba(0, 0, 0, 0.1);
  animation: success 0.3s ease;
}
.success .prompt {
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  .close{
      cursor: pointer;
  }
}

.prompt-buttom {
  padding: 0 15px;
  font-size: 14px;
  border-bottom: 1px solid #eee;
  div {
    padding-bottom: 20px;
  }
}
// 详情头像样式
.avatar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  padding: 10px 0;
  border-radius: 6px;
  margin: 10px 0;
  background: linear-gradient(
    to right,
    rgba(0, 161, 214, 1),
    rgba(64, 158, 255, 0.6),
    rgba(0, 161, 214, 0.6)
  );
  .image {
    display: block;
    width: 95px;
    height: 95px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    img {
      width: 95px;
      height: 95px;
      border-radius: 50%;
    }
  }
  span {
    line-height: 40px;
    font-weight: 700;
    color: #ffffff;
  }
}
// 短字段部分样式
.short-part {
  display: flex;
  justify-content: space-between;
  div {
    padding-bottom: 0px;
  }
  .status {
    span {
      border-radius: 30px;
      padding: 1px 8px;
    }
    .ready {
      font-size: 12px;
      border: #67c23a solid 1px;
      color: #67c23a;
      background: rgb(225, 243, 216);
    }
    .loading {
      font-size: 12px;
      background: rgb(240, 249, 235);
      border: #0150ff solid 1px;
      color: #0150ff;
    }
  }
}
// 时间部分
.time-part {
  div {
    padding-bottom: 0px;
  }
  display: flex;
  justify-content: space-between;
}
// 地址部分
.langer {
  padding: 20px 15px;
  font-size: 14px;
  .address {
    padding-bottom: 16px;
  }
}
.detail {
  display: flex;
  line-height: 24px;
}
/* 输入框 */
.close {
  cursor: pointer;
}
@keyframes success {
  0% {
    transform: translate(-50%, -55%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}
</style>