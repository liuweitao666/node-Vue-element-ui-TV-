/* eslint-disable vue/require-v-for-key */
<template>
  <div class="container">
    <!-- 提示弹框 -->
    <div :class="['toast',{'show':promsg?true:''}]">
      <i class="el-icon-warning-outline"></i>
      {{msg}}
    </div>
    <div class="login-from">
      <!-- logo部分 -->
      <div class="login-logo">
        <img src="../assets/image/head-logo.png" alt />
      </div>

      <!-- 登录注册表单区域 -->

      <!-- 表单头部 -->
      <div class="login-header">
        <p :class="{'login-active':isLogin}" @click="isShowl" ref="pass">{{swifelog?'免密登录':'密码登录'}}</p>
        <p :class="{'login-active':!isLogin}" @click="isShowr">用户注册</p>
      </div>
      <!-- 登录表单 -->
      <div class="from1" v-if="isLogin">
        <!-- 快速登录部分 -->
        <div v-if="swifelog">
          <form onsubmit="return false">
            <p>
              <input
                type="text"
                placeholder="Email"
                v-model="loginmailform.email"
                class="login-input"
                @blur="loginmail"
              />
              <span
                :class="['promptmsg',loginmailcode===1?'success':'error']"
                v-if="loginmailcode===0 || loginmailcode"
              >
                <i :class="loginmailcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
                {{promptmsg[loginmailcode]}}
              </span>
            </p>
            <p class="scode-login">
              <input
                type="text"
                placeholder="Code"
                v-model="loginmailform.code"
                class="login-input scode"
              />
              <button
                class="mailcode"
                @click="Sendlcode"
                :disabled="iscode"
              >{{iscode?`已发送(${ctime})`:'发送验证码'}}</button>
            </p>
            <div class="reset-pass">
              <span @click="backlogin">密码登录</span>
              <span @click="resetps">忘记密码</span>
            </div>
          </form>
          <button
            @click="maillogin"
            :class="['login-button',{'butactive':!(loginmailcode===1) ? '':true}]"
            :disabled="!(loginmailcode===1)"
          >登录</button>
        </div>
        <!-- 密码登录部分 -->
        <div v-else>
          <form>
            <p>
              <input
                type="text"
                placeholder="用户名/邮箱"
                v-model="loginform.username"
                class="login-input"
                @blur="loginregUser"
                required
              />
              <span
                :class="['promptmsg',Usercode===1?'success':'error']"
                v-if="Usercode===0 || Usercode"
              >
                <i :class="Usercode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
                {{promptmsg[Usercode]}}
              </span>
            </p>
            <p>
              <input
                type="password"
                placeholder="密码"
                v-model="loginform.password"
                class="login-input password"
                @blur="loginregPw"
              />
              <span :class="['promptmsg',Pwcode===1?'success':'error']" v-if="Pwcode">
                <i :class="Pwcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
                {{promptmsg[Pwcode]}}
              </span>
            </p>
            <p v-if="Usercode===1 && Pwcode===1">
              <!-- <input
              type="text"
              placeholder="请输入验证码"
              v-model="loginform.capcode"
              class="login-input password"
              @blur="loginregPw"
            />
            <span :class="['promptmsg',Pwcode===1?'success':'error']" v-if="Pwcode">
              <i :class="Pwcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
              {{promptmsg[Pwcode]}}
              </span>-->
              <Code @codesuccess="Scode" ref="code" />
            </p>
            <div class="reset-pass">
              <span @click="swifelogin">快速登录</span>
              <span @click="resetps">忘记密码</span>
            </div>
          </form>
          <button
            @click="pslogin"
            :class="['login-button',{'butactive':isbutton ? '':true}]"
            :disabled="isbutton"
          >登录</button>
        </div>
      </div>
      <!-- 注册表单 -->
      <div class="from1" v-else>
        <form onsubmit="return false">
          <p>
            <input
              type="text"
              placeholder="用户名"
              v-model="regform.username"
              class="login-input"
              @blur="registeruser"
            />
            <span
              :class="['promptmsg',Userregcode===1?'success':'error']"
              v-if="Userregcode===0 || Userregcode"
            >
              <i :class="Userregcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
              {{promptmsg[Userregcode]}}
            </span>
          </p>
          <p>
            <input
              type="password"
              placeholder="密码"
              v-model="regform.password"
              class="login-input"
              @blur="registerpw"
            />
            <span
              :class="['promptmsg',Pwregcode===1?'success':'error']"
              v-if="Pwregcode===0 || Pwregcode"
            >
              <i :class="Pwregcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
              {{promptmsg[Pwregcode]}}
            </span>
          </p>
          <p>
            <input
              type="password"
              placeholder="确认密码"
              v-model="comfrimpw"
              class="login-input"
              @blur="registercpwd"
            />
            <span :class="['promptmsg',compwd===1?'success':'error']" v-if="compwd===0 || compwd">
              <i :class="compwd===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
              {{promptmsg[compwd]}}
            </span>
          </p>
          <p>
            <input
              type="text"
              placeholder="手机"
              v-model="regform.phone"
              class="login-input"
              @blur="registerphone"
            />
            <span
              :class="['promptmsg',Phonecode===1?'success':'error']"
              v-if="Phonecode===0 || Phonecode"
            >
              <i :class="Phonecode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
              {{promptmsg[Phonecode]}}
            </span>
          </p>
          <p>
            <input
              type="text"
              placeholder="Email"
              v-model="regform.email"
              class="login-input"
              @blur="registermail"
            />
            <span
              :class="['promptmsg',Emailcode===1?'success':'error']"
              v-if="Emailcode===0 || Emailcode"
            >
              <i :class="Emailcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
              {{promptmsg[Emailcode]}}
            </span>
          </p>
          <p class="scode-p">
            <input
              type="text"
              placeholder="Code"
              v-model="regform.mailcode"
              class="login-input scode"
            />
            <button
              :class="['code',{'coded':iscode}]"
              @click="Sendrgcode"
              :disabled="iscode"
            >{{iscode?`已发送(${ctime})`:'发送验证码'}}</button>
          </p>
        </form>
        <button
          @click="registered"
          :class="['login-button',{'butactive':!isresbtn ? '':true}]"
          :disabled="!isresbtn"
          type="button"
        >注册</button>
      </div>

      <!-- 底部第三方登录 -->
      <div class="login-icon">
        <img
          :src="iconactive===index ?item.imgActive: item.image"
          v-for="(item,index) in img"
          v-bind:key="index"
          @mouseover="imgactive(index===0 ? 99 : index)"
          @mouseleave="imgactive()"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 正则表单验证
import {
  regusername,
  regpassword,
  regemail,
  regphone,
  regcompassword
} from "../common/util"
import Code from "../components/login/code"
export default {
  name: "login",
  components: {
    Code
  },
  data() {
    return {
      // 控制切换快速登录节目
      swifelog: false,
      // 验证码
      scode: null,
      // 控制是否可发送验证码
      iscode: false,
      // 发送验证码等待时间
      ctime: 60,
      // 一个等待计时器
      timer: null,
      // 邮箱登录验证
      loginmailform: {
        email: "",
        code: ""
      },
      // 邮箱验证码
      loginmailcode: null,
      // 登录用户名和密码
      loginform: {
        username: "Lwtlppp",
        password: "123456"
      },
      // qq wx wb 图片数据
      img: [
        {
          image: require("../assets/image/qq.png"),
          imgActive: require("../assets/image/qq-active.png")
        },
        {
          image: require("../assets/image/wx.png"),
          imgActive: require("../assets/image/wx-active.png")
        },
        {
          image: require("../assets/image/wb.png"),
          imgActive: require("../assets/image/wb-active.png")
        }
      ],
      // 控制图片的高亮显示
      iconactive: -1,
      isLogin: true,
      // 注册表单数据
      regform: {
        username: "",
        password: "",
        email: "",
        phone: "",
        mailcode: ""
      },
      comfrimpw: "",
      // 弹框toast提示消息
      promsg: false,
      msg: "",
      // 表单验证提示消息
      promptmsg: [
        "用户名不能为空",
        "验证通过",
        "首字母需要大写",
        "用户名长度应在6~16字符个之间",
        "密码不能为空",
        "密码长度应在6~16字符个之间",
        "邮箱格式不正确",
        "没有@符",
        "不能为空",
        "手机格式不正确",
        "两次密码不一致"
      ],
      // 用户名提示消息code
      Usercode: null,
      // 登录提示消息密码code
      Pwcode: null,
      // 注册用户名提示消息code
      Userregcode: null,
      // 注册密码提示消息code
      Pwregcode: null,
      // 确认密码提示消息
      compwd: null,
      // 注册邮箱提示消息code
      Emailcode: null,
      // 注册手机号提示消息code
      Phonecode: null,
      // 判断form表单是否可以提交
      isbutton: true
    }
  },
  created() {
    this.loginregUser()
    this.loginregPw()
  },
  methods: {
    // 发送登录请求
    async login(logins) {
      // 对密码进行md5加密
      // this.loginform.password = this.$md5(this.$md5(this.loginform.password))
      // console.log(this.loginform)
      const { data: res } = await this.$http.post("/login", logins)
      if (res.error_code === 1) {
        this.showtoast(res.msg)
        // eslint-disable-next-line no-unreachable
        // 保存token令牌
        window.sessionStorage.setItem("token", res.token)
        // 保存用户名
        logins.username && window.sessionStorage.setItem("username", logins.username)
        logins.email && window.sessionStorage.setItem("username", logins.email)
        // 获取当前时间
        window.sessionStorage.setItem("token_exp", new Date().getTime())
        this.$router.push({ path: "/home" })
        return
        // this.$router.push("/home");
      } else if (res.error_code === 0) {
        this.showtoast(res.msg)
        this.scode = null
        this.Usercode = null
      } else {
        this.showtoast(res.msg)
        this.scode = null
        this.Pwcode = null
      }
    },
    // 密码登录
    pslogin() {
      this.login(this.loginform)
    },
    // 邮箱登录
    maillogin(){
      this.login(this.loginmailform)
    },
    // 注册请求
    async registered() {
      const { data: res } = await this.$http.post("/registered", this.regform)
      if (res.error_code === 1) {
        this.showtoast(res.msg + ",请登录")
        return this.$refs.pass.click()
      }
      this.showtoast(res.msg)
    },
    // 展示底部高亮图片
    imgactive(index) {
      if (index === 99) {
        return (this.iconactive = 0)
      }
      index ? (this.iconactive = index) : (this.iconactive = -1)
    },
    // 控制登录注册模块的切换
    isShowl() {
      if (!this.isLogin) {
        this.isLogin = !this.isLogin
      }
      this.isbtnlogin()
    },
    isShowr() {
      if (this.isLogin) {
        this.isLogin = !this.isLogin
        this.isbutton = true
        this.scode = null
      }
    },
    // 验证登录表单和注册表单输入的信息是否正确（正则）
    loginregUser() {
      // 验证用户名是否正确
      regusername(code => {
        this.Usercode = code
      }, this.loginform.username)
      this.isbtnlogin()
    },
    // 验证登陆密码是否正确
    loginregPw() {
      regpassword(code => {
        this.Pwcode = code
      }, this.loginform.password)
      this.isbtnlogin()
    },
    // 注册表单username的验证
    registeruser() {
      regusername(code => {
        this.Userregcode = code
      }, this.regform.username)
    },
    // 注册表单password的验证
    registerpw() {
      regpassword(code => {
        this.Pwregcode = code
      }, this.regform.password)
    },
    // 确认密码
    registercpwd() {
      regcompassword(
        code => {
          this.compwd = code
        },
        this.regform.password,
        this.comfrimpw
      )
    },
    // 注册表单邮箱的验证
    registermail() {
      regemail(code => {
        this.Emailcode = code
      }, this.regform.email)
    },
    // 登录邮箱验证
    loginmail() {
      regemail(code => {
        this.loginmailcode = code
      }, this.loginmailform.email)
    },
    // 注册表单手机号
    registerphone() {
      regphone(code => {
        this.Phonecode = code
      }, this.regform.phone)
    },
    // 控制toast弹窗
    showtoast(msg) {
      this.promsg = true
      this.msg = msg
      setTimeout(() => {
        this.promsg = false
      }, 2000)
    },
    // form表单按钮是否可以点击
    isbtnlogin() {
      // console.log(this.Usercode, this.Pwcode);
      if (this.Usercode === 1 && this.Pwcode === 1 && this.scode === 1) {
        return (this.isbutton = false)
      } else {
        return (this.isbutton = true)
      }
    },
    // form表单注册按钮是否可以点击
    isbuttonres() {},
    Scode(code) {
      this.scode = code
    },
    // 发送邮箱验证码
    async Sendcode(url, email) {
      const { data: res } = await this.$http.post(url, {
        email: email
      })
      // 提示弹框
      this.showtoast(res.msg)
      if (res.code === 1) {
        this.iscode = true
        this.timer = setInterval(() => {
          this.ctime--
          if (this.ctime === 0) {
            this.iscode = false
            this.ctime = 60
            clearInterval(this.timer)
          }
        }, 1000)
      }
    },
    // 注册时的邮箱验证码
    Sendrgcode() {
      this.Sendcode("/sendmCode", this.regform.email)
    },
    // 登录时的邮箱验证码
    Sendlcode() {
      this.Sendcode("/login/mail", this.loginmailform.email)
    },
    // 快速登录
    swifelogin() {
      this.swifelog = true
    },
    // 忘记密码
    resetps() {
      console.log(123)
    },
    // 返回密码登录
    backlogin() {
      this.swifelog = false
    }
  },
  computed: {
    isresbtn() {
      return (
        this.Pwregcode !== 4 &&
        this.Userregcode +
          this.Emailcode +
          this.Phonecode +
          this.Pwregcode +
          this.compwd ===
          5
      )
    }
  },

  watch: {
    // 监听滑动验证是否成功
    scode(newval) {
      if (newval === 1) {
        this.isbtnlogin()
      } else {
        this.isbtnlogin()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background: url(../assets/image/reg_bg.jpg) no-repeat center;
  background-size: cover;
  position: relative;
}
.login-logo {
  width: 258px;
  height: 120px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -60px;
}
.login-logo img {
  width: 100%;
  height: 100%;
}
/* 登录表单 */
.login-from {
  width: 460px;
  background: #ffffff;
  border-radius: 20px;
  position: fixed;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
  padding: 60px 0px 30px;
}
.login-header {
  display: flex;
  justify-content: space-around;
  color: #cacaca;
  width: 400px;
  margin: 0 auto 10px;
  font-size: 14px;
}
.login-header p {
  cursor: pointer;
}
.login-active {
  color: #3d7eff;
}
/* 登录页from表单样式 */
.from1 {
  display: flex;
  flex-direction: column;
  width: 400px;
  justify-content: center;
  margin: 0 auto;
}
.from1 p {
  width: 340px;
  margin: 0 auto 21px;
  padding: 5px 0 0 0;
  font-size: 13px;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
}
.login-input {
  border: none;
  display: block;
  width: 340px;
  padding: 10px 0 3px 3px;
  outline: none;
}
/* 发送验证码 */
.code {
  display: inline-block;
  border: none;
  padding: 8px 20px;
  background: #67c23a;
  position: absolute;
  right: 3px;
  top: 2px;
  color: #ffffff;
  cursor: pointer;
}
.code:hover {
  opacity: 0.9;
}
// 登录验证码
.scode-login {
  display: flex;
  justify-content: space-between;
}
.mailcode {
  background: #ffffff;
  border: none;
  color: #8d8d8d;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}
.mailcode:hover {
  color: #3d7eff;
}
/* 发送验证码后的样式 */
.coded {
  background: #e5e5e5;
  color: #a0a0a0;
}
.scode {
  width: 250px;
}
.reset-pass {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  width: 340px;
  margin: 0 auto;
  color: #8d8d8d;
  span:hover {
    cursor: pointer;
    color: #3d7eff;
  }
}
.login-button {
  width: 340px;
  height: 50px;
  line-height: 50px;
  margin: 20px auto;
  text-align: center;
  display: block;
  border: none;
  background: #e5e5e5;
  font-size: 18px;
  font-weight: bold;
  color: #a0a0a0;
  cursor: pointer;
  border-radius: 5px;
}
.login-icon {
  height: 40px;
  display: flex;
  justify-content: space-around;
}
.login-icon img {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
/* 按钮样式 */
.butactive {
  background: #3d7eff;
  color: #ffffff;
}
/* 弹出框 */
.toast {
  width: 460px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  opacity: 0;
  color: #ffffff;
  background: #3d7eff;
  position: absolute;
  left: 50%;
  top: 0;
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  transform: translate(-50%, -20%);
  transition: all 0.2s ease;
}
.show {
  opacity: 1;
  transform: translate(-50%);
}
/* input验证提示消息 */
.from1 p .promptmsg {
  display: block;
  position: absolute;
  right: 5px;
  bottom: 5px;
  opacity: 0;
  transition: all 0.5s ease;
}
.from1 p .success {
  color: #67c23a;
  opacity: 1;
}
.from1 p .error {
  color: #f56c6c;
  opacity: 1;
}
/* 动画 */
</style>