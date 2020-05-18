<template>
  <div>
    <!-- 成功提示框 -->
    <prompt :prompt="prompt" :msg="'提示'" @isprompt="changeprompt" :content="message" />
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息与安全</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要区域 -->
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人信息" name="first"></el-tab-pane>
        <el-tab-pane label="密码管理" name="second"></el-tab-pane>
      </el-tabs>
      <div class="block">
        <!-- 左侧图片 -->
        <div style="width:300px" class="block-left">
          <img
            :src="imgdm[imgindex].src"
            alt
            class="block-img"
            v-if="imgindex===imgdm[imgindex].id"
          />
        </div>
        <!-- 分割线 -->
        <div class="xian"></div>
        <!-- 用户修改密码表单 -->
        <div class="info password" v-if="type==='password'">
          <el-form ref="pswForm" label-width="100px" class="demo-ruleForm" size="small">
            <el-form-item label="*旧密码" class="password-i">
              <el-input v-model="Oldpassword" class="input-p"></el-input>
              <span
                :class="['promptmsg',Oldcode===1?'success':'error']"
                v-if="Oldcode===0 || Oldcode"
              >
                <i :class="Oldcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
                {{promptmsg[Oldcode]}}
              </span>
            </el-form-item>
            <el-form-item label="*新密码" class="password-i">
              <el-input v-model="password" class="input-p"></el-input>
              <span
                :class="['promptmsg',Pswcode===1?'success':'error']"
                v-if="Pswcode===0 || Pswcode"
              >
                <i :class="Pswcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
                {{promptmsg[Pswcode]}}
              </span>
            </el-form-item>
            <el-form-item label="*确认密码" class="password-i">
              <el-input v-model="Newpassword" class="input-p"></el-input>
              <span
                :class="['promptmsg',Newcode===1?'success':'error']"
                v-if="Newcode===0 || Newcode"
              >
                <i :class="Newcode===1?'el-icon-circle-check':'el-icon-circle-close'"></i>
                {{promptmsg[Newcode]}}
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确认修改</el-button>
              <el-button @click="Handlereset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 用户表单 -->
        <div class="info" v-else>
          <div class="form-avatar">
            <div class="img-block">
              <img :src="'http://118.190.172.37:3000'+currentuser.avatar" alt />
            </div>
            <div class="avatar-btn">
              <el-button type="primary" size="mini" class="buttn">点击修改</el-button>
              <input type="file" @change="uploads" :name="currentuser.username" class="file" />
              <!-- <el-button size="mini" type="primary">点击上传</el-button> -->
            </div>
          </div>
          <!-- 用户编辑表单 -->
          <el-form
            :model="currentuser"
            :rules="userrules"
            ref="currentForm"
            label-width="100px"
            class="demo-ruleForm"
            v-if="currentuser"
            size="small"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="currentuser.username" class="input-w"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input v-model="currentuser.email" class="input-w"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="currentuser.phone" class="input-w"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-tag
                v-for="item in gender"
                :key="item.id"
                :type="currentuser.gender===item.id? '': 'info'"
                effect="plain"
                :class="{'margin':item.id==0}"
                @click="genders(item.id)"
              >{{item.value}}</el-tag>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
              <el-date-picker v-model="currentuser.birthday" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="地区" prop="region">
              <City
                :model="currentuser.region"
                @selected="selectCity"
                :width="'320px'"
                :size="'small'"
                :bottom="'bottom'"
              />
            </el-form-item>
            <el-form-item label="简介" prop="bio">
              <el-input v-model="currentuser.bio" type="textarea"></el-input>
            </el-form-item>
            <div class="btn">
              <el-button type="primary" size="samll" @click="update">保存</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { finddata } from "@/common/crod/index.js"
import prompt from "../../common/prompt"
import { regpassword, regcompassword } from "@/common/util.js"
import { mapState } from "vuex"
import  City  from "../toll/city"
export default {
  data() {
    return {
      // 当前用户信息
      currentuser: {
        birthday: ""
      },
      userrules: {
        username: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "长度为 6-16 个字符", trigger: "blur" }
        ],
        email: [{ required: true, message: "不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 11, message: "手机格式不正确", trigger: "blur" }
        ]
      },
      passrules: {
        password: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 11, message: "长度不能小于11位", trigger: "blur" }
        ],
        Oldpassword: [{ required: true, message: "不能为空", trigger: "blur" }],
        Newpassword: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      },
      imgdm: [
        { id: 0, src: require("@/assets/image/info/sister.jpg") },
        { id: 1, src: require("@/assets/image/info/saber.jpg") },
        { id: 2, src: require("@/assets/image/info/asuna.jpg") }
      ],
      imgindex: 0,
      timer: null,
      // 性别
      gender: [
        { id: -1, value: "保密" },
        { id: 0, value: "女" },
        { id: 1, value: "男" }
      ],
      // 控制对话框是否显示
      prompt: false,
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
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
      // 旧密码
      Oldpassword: "",
      // 原密码
      password: "",
      // 确认密码
      Newpassword: "",
      Oldcode: null,
      Pswcode: null,
      Newcode: null,
      message: "",
    }
  },
  components: {
    prompt,
    City
  },
  created() {
    // 获取当前用户信息
    this.getcurrentusers()
    this.changeimg()
  },
  inject: ["reload"],
  methods: {
    // 选择城市
    selectCity(city){
      this.currentuser.region = city
    },
    // 获取当前用户信息
    async getcurrentusers() {
      const { data: res } = await finddata("/home/users", {
        _id: this.$route.params.type
      })
      this.currentuser = res[0]
      for (let key in res[0]) {
        this.currentuser[key] = res[0][key]
      }
    },
    // 更新用户信息async
    update() {
      this.$refs.currentForm.validate(async vlied => {
        if (!vlied) return this.$message.error("格式不正确")
        const { data: res } = await this.$http.post(
          "/home/users",
          this.currentuser
        )
        // console.log(res)
        if (res.code === 1) {
          this.message = "更新资料成功！"
          this.prompt = true
        }
      })
    },
    // 改变图片
    changeimg() {
      this.timer = setInterval(() => {
        this.imgindex++
        if (this.imgindex === this.imgdm.length) {
          this.imgindex = 0
        }
      }, 5000)
    },
    //改变gender的值
    genders(id) {
      this.currentuser.gender = id
    },
    // 控制提示框是否显示
    changeprompt() {
      this.prompt = false
    },
    // 上图片的方法
    uploads(e) {
      const file = e.target.files[0] //获取到当前文件对象
      // 传递一个 FormData 对象 即可
      let formData = new FormData()
      formData.append("avatar", file) // 'file' 可变 相当于 input 表单的name 属性
      formData.append("username", this.currentuser.username)
      // 服务器只需按照正常的上传程序代码即可
      this.$http
        .post("/home/upload/avatar", formData)
        .then(res => {
          let result = res.data
          if (result.code !== 1) return this.$message.error(result.msg)
          this.getcurrentusers()
          setTimeout(() => {
            this.reload()
          }, 1000)
          return this.$message.success(result.msg)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 更改密码的方法
    async onSubmit() {
      if (!this.Pass) {
        return this.$message.error("格式不正确！")
      }
      const { data: res } = await this.$http.post("/home/users", {
        _id: this.$route.params.type,
        password: this.Oldpassword,
        newpassword: this.Newpassword,
        Editpassword: "editpasswird"
      })
      if (res.code !== 1) return this.$message.error(res.msg)
      this.message = "修改密码成功！"
      this.prompt = true
    },
    // 重置密码表单
    Handlereset() {
      this.password = ""
      this.Newpassword = ""
      this.Oldpassword = ""
    },
    // 切换显示内容
    handleClick(tab) {
      if (tab.label === "个人信息") {
        this.$router.push({
          path: "/information/" + this.userinfo._id,
          query: { type: "info" }
        })
      } else {
        this.$router.push({
          path: "/information/" + this.userinfo._id,
          query: { type: "password" }
        })
      }
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    },
    // 验证表单密码验证是否通过
    Pass() {
      return this.Pswcode === 1 && this.Newcode === 1 && this.Oldcode === 1
    },
    ...mapState(["userinfo"]),
    activeName: {
      get: function() {
        return this.type === "info" ? "first" : "second"
      },
      set: function() {}
    }
  },
  watch: {
    // 验证原密码是否正确
    Oldpassword(newval) {
      regpassword(code => {
        this.Oldcode = code
      }, newval)
      if (newval === "") {
        this.Oldcode = null
      }
    },
    password(newval) {
      regpassword(code => {
        this.Pswcode = code
      }, newval)
      if (newval === "") {
        this.Pswcode = null
      }
    },
    Newpassword(newval) {
      regcompassword(
        code => {
          this.Newcode = code
        },
        newval,
        this.password
      )
      if (newval === "") {
        this.Newcode = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  display: flex;
  justify-content: center;
  align-items: center;
}
.info {
  width: 45%;
  min-height: 420px;
  margin-top: 20px;
  position: relative;
}
.password {
  min-height: 420px;
  display: flex;
  align-items: center;
  .input-p {
    width: 320px;
  }
}
.btn {
  display: flex;
  justify-content: center;
}
.block-left {
  display: flex;
  margin-right: 20px;
}
.block-img {
  width: 100%;
  animation: image 5s ease infinite;
}
.el-tag {
  cursor: pointer;
}
.margin {
  margin: 0 10px 0;
}
/* 成功提示框 */

.input-w {
  width: 220px;
}
.input-w-r {
  width: 60px;
}
.xian {
  height: 265px;
  border-left: 1px solid #e5e5e5;
}
/* 头像区域 */
.form-avatar {
  position: absolute;
  top: 0;
  right: 30px;
  z-index: 3;
}
.img-block {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e5e9ef;
  border-radius: 50%;
}
.form-avatar img {
  width: 78px;
  height: 78px;
  border-radius: 50%;
}

.avatar-btn {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  position: relative;
}
.avatar .el-btn {
  position: relative;
  z-index: 99;
}
.file {
  width: 70px;
  height: 26px;
  opacity: 0;
  position: absolute;
  z-index: 99;
  bottom: 0;
  cursor: pointer;
}
.buttn {
  transition: all 0.2s ease;
}
.avatar-btn:hover .buttn {
  background: #66b1ff;
}

// 密码表单
.password-i {
  position: relative;
}
/* input验证提示消息 */
.promptmsg {
  display: block;
  position: absolute;
  right: 5px;
  bottom: 0px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.5s ease;
}
.success {
  color: #67c23a;
  opacity: 1;
}
.error {
  color: #f56c6c;
  opacity: 1;
}
@keyframes image {
  0% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>