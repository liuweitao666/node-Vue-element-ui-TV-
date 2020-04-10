<template>
  <div>
    <!-- 成功提示框 -->
    <prompt :prompt="prompt" :msg="'提示'" @isprompt="changeprompt" />
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要区域 -->
    <el-card>
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
        <!-- 用户头像 -->
        <div class="info">
          <div class="form-avatar">
            <div class="img-block">
              <img :src="'http://127.0.0.1:3000'+currentuser.avatar" alt />
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
              <el-input v-model="currentuser.region" class="input-w-r"></el-input>
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
import { finddata } from "@/common/crod/index.js";
import prompt from "../../common/prompt";
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
      }
    };
  },
  components: {
    prompt
  },
  created() {
    this.getcurrentusers();
    this.changeimg();
  },
  methods: {
    // 获取当前用户信息
    async getcurrentusers() {
      const { data: res } = await finddata("/home/users", this.$route.query);

      this.currentuser = res[0];
      for (let key in res[0]) {
        this.currentuser[key] = res[0][key];
      }
    },
    // 更新用户信息async
    update() {
      this.$refs.currentForm.validate(async vlied => {
        if (!vlied) return this.$message.error("格式不正确");
        const { data: res } = await this.$http.post(
          "/home/users",
          this.currentuser
        );
        if (res.code === 1) {
          this.prompt = true;
        }
      });
    },
    // 改变图片
    changeimg() {
      this.timer = setInterval(() => {
        this.imgindex++;
        if (this.imgindex === this.imgdm.length) {
          this.imgindex = 0;
        }
      }, 5000);
    },
    //改变gender的值
    genders(id) {
      this.currentuser.gender = id;
    },
    // 控制提示框是否显示
    changeprompt() {
      this.prompt = false;
    },
    // 上图片的方法
    uploads(e) {
      const file = e.target.files[0]; //获取到当前文件对象
      // 传递一个 FormData 对象 即可
      let formData = new FormData();
      formData.append("avatar", file); // 'file' 可变 相当于 input 表单的name 属性
      formData.append("username", this.currentuser.username);
      // 服务器只需按照正常的上传程序代码即可
      this.$http
        .post("/home/upload/avatar", formData)
        .then(res => {
          let result = res.data;
          if (result.code !== 1) return this.$message.error(result.msg);
          this.getcurrentusers();
          return this.$message.success(result.msg);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.block {
  display: flex;
  justify-content: center;
  align-items: center;
}
.info {
  width: 45%;
  margin-top: 20px;
  position: relative;
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