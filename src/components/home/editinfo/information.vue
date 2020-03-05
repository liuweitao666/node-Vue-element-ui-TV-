<template>
  <div>
    <!-- 成功提示框 -->

    <prompt :prompt ="prompt" :msg="'提示'" @isprompt='changeprompt'/>
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
        <!-- 用户编辑表单 -->
        <div class="info">
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
      prompt: false
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
      console.log(this.currentuser);
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
    changeprompt(){
      this.prompt =false
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
  width: 300px;
}
.input-w-r {
  width: 60px;
}
.xian {
  height: 265px;
  border-left: 1px solid #e5e5e5;
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