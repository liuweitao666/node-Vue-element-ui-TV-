<template>
  <div>
    <!-- 页头 -->
    <el-page-header @back="goBack" :content="id?'编辑节目':'添加节目'"></el-page-header>
    <!-- 进度条 -->
    <el-steps :active="active" simple>
      <el-step title="填写基本内容" icon="el-icon-edit"></el-step>
      <el-step title="上传视频链接" icon="el-icon-upload"></el-step>
      <el-step title="完成" icon="el-icon-picture"></el-step>
    </el-steps>
    <!-- 表单 -->
    <el-card class="card">
      <el-row>
        <el-tabs tab-position="left" :before-leave="levavetab">
          <!-- 基本信息表单 -->
          <el-tab-pane label="基本信息">
            <el-form
              :model="program.data"
              :rules="rulesadd"
              ref="addform"
              label-width="80px"
              class="demo-ruleForm"
              size="small"
            >
              <el-form-item label="标题" prop="title">
                <el-input v-model="program.data.title" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="小标题" prop="subtitle">
                <el-input :placeholder="program.data.subtitle" v-model="program.data.subtitle"></el-input>
              </el-form-item>
              <el-form-item label="导演" prop="director">
                <el-input v-model="program.data.director" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="编剧" prop="writer">
                <el-input v-model="program.data.writer" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="主演" prop="star">
                <el-input v-model="program.data.star" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-input v-model="program.data.type" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="地区" prop="area">
                <el-input v-model="program.data.area" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="语言" prop="language">
                <el-input v-model="program.data.language" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="片长" prop="time">
                <el-input v-model="program.data.time" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="上映时间" prop="date">
                <el-input v-model="program.data.date" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="封面" prop="cover" class="cover">
                <div class="contain-cover">
                  <img
                    :src="id?'http://127.0.0.1:3000'+program.data.cover:program.data.cover"
                    :alt="program.data.title"
                    v-if="program.data.cover"
                    class="img-cover"
                  />
                  <div class="filebtn">
                    <i class="el-icon-plus"></i>
                    <input
                      type="file"
                      @change="uploadscover"
                      name="files"
                      ref="fileCover"
                      class="file"
                    />
                  </div>
                </div>
                <el-input v-model="program.data.cover" class="cover-input"></el-input>
              </el-form-item>
              <el-form-item label="banner" prop="banner">
                <div class="contain-cover">
                  <img
                    :src="id?'http://127.0.0.1:3000'+program.data.banner:program.data.banner"
                    v-if="program.data.banner"
                    class="img-cover img-banner"
                  />
                  <div class="filebtn">
                    <i class="el-icon-plus"></i>
                    <input type="file" @change="uploadsbanner" name="files" class="file" />
                  </div>
                </div>
                <el-input
                  :placeholder="program.data.banner"
                  v-model="program.data.banner"
                  class="cover-input"
                ></el-input>
              </el-form-item>
              <el-form-item label="简介">
                <el-input
                  type="textarea"
                  :placeholder="program.data.bio"
                  v-model="program.data.bio"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 视频链接表单 -->
          <el-tab-pane label="上传视频">
            <el-button type="primary" size="small" @click="addpro" class="addpro" v-if="!id">添加集数</el-button>
            <el-form label-width="55px" size="mini" ref="addpro" class="form-up">
              <el-form-item
                :label="index+1+'集'"
                prop="title"
                v-for="(item,index) in title"
                :key="index"
              >
                <el-input v-model="Src[index].src" class="editinp-src"></el-input>
                <el-button
                  style="margin-left:20px;"
                  type="primary"
                  size="mini"
                  @click="updatepro(Src[index]._id,Src[index].src)"
                  v-if="id"
                >更新</el-button>
                <el-button
                  style="margin-left:20px;"
                  type="danger"
                  size="mini"
                  @click="deletepro(index,Src[index]._id)"
                >删除</el-button>
              </el-form-item>
              <el-form-item label="添加" v-if="id">
                <el-input v-model="src" class="upinput"></el-input>
                <el-button type="primary" @click="editprogram">添加剧集</el-button>
              </el-form-item>
              <el-form-item v-else>
                <el-button type="primary" @click="addprogram">确认添加</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <div class="express">
        <p>*说明：基本信息填写完毕后，点击上传视频就会自动修改，未更改则会提示！</p>
        <p>*视频上传：一次可以上传多个视频，更新视频每次只能添加一个视频，可以多次添加！</p>
        <div class="cover-prompt">
          <span>*图片上传：封面建议矩形图,banner适合大图！</span>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 进度条进度
      active: 1,
      // 添加数据对象
      program: {
        title: "",
        data: {
          bio: "",
          title: "三生三世枕上书 (2020)",
          director: "杨玄",
          writer: "梁振华",
          star: "迪丽热巴 / 高伟光 / 陈楚河 / 郭品超 / 刘雨欣",
          type: ":剧情 / 爱情 / 奇幻",
          area: "中国大陆",
          language: "汉语普通话",
          date: "2020-01-22",
          time: "45分钟",
          cover: "",
          src: "",
          subtitle: "没有杨幂不好看",
          banner: ""
        }
      },
      // 添加表单验证规则
      rulesadd: {
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        director: [{ required: true, message: "不能为空", trigger: "blur" }],
        writer: [{ required: true, message: "不能为空", trigger: "blur" }],
        star: [{ required: true, message: "不能为空", trigger: "blur" }],
        type: [{ required: true, message: "不能为空", trigger: "blur" }],
        area: [{ required: true, message: "不能为空", trigger: "blur" }],
        language: [{ required: true, message: "不能为空", trigger: "blur" }],
        date: [{ required: true, message: "不能为空", trigger: "blur" }],
        time: [
          { required: true, message: "不能为空", trigger: "blur" },
          { max: 11, message: "长度不能大于 11 个字符", trigger: "blur" }
        ],
        cover: [{ required: true, message: "未上传", trigger: "blur" }],
        banner: [{ required: true, message: "未上传", trigger: "blur" }],
        subtitle: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      // 视频链接数组
      Src: [
        {
          title: "",
          src:
            "//player.yapi.xyz/p2p.php?url=https://bilibili.com-l-163.com/20181004/9753_762d7aa7/index.m3u8"
        }
      ],
      // 更新剧集
      src: "",
      type: "",
      // 节目信息请求体
      queryinfo: {
        title: "",
        pagesize: 12,
        pagenum: 1,
        id: ""
      },
      file: null,
      filebanner: null
    }
  },
  created() {
    // 获取传过来的参数并赋值
    this.program.title = this.path
    this.queryinfo.title = this.path
    this.queryinfo.id = this.id
    // id存在才发送网络请求
    if (this.id) {
      this.findById()
    }
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1)
    },
    // 添加节目
    async addprogram() {
      let data
      const result = await this.uploads(this.filebanner)
      this.program.data.banner = result.msg
      // 发送添加视频链接的请求
      const { data: src } = await this.$http.post("/home/video", {
        title: this.program.data.title,
        src: this.Src,
        type: this.program.title
      })

      // 对返回的数据进行判断
      if (src.code !== 1)
        return this.$message({
          showClose: true,
          message: src.msg,
          duration: 1500,
          type: "error"
        })
      const { data: res } = await this.$http.post("/home/program", this.program)
      data = res
      if (data.code !== 1)
        return this.$message({
          showClose: true,
          message: data.msg,
          duration: 1500,
          type: "error"
        })
      this.$message({
        showClose: true,
        message: data.msg,
        duration: 1500,
        type: "success"
      })
    },
    // 点击tab，离开之前触发的钩子函数
    levavetab(activeName) {
      if (activeName === "0") {
        return (this.active = 1)
      }
      if (this.$refs.addform) {
        // 验证信息表单是否正确
        this.$refs.addform.validate(async valid => {
          if (valid) {
            // 跳转的时候判断信息是否填写
            if (this.id && activeName == 1) {
              this.active = 2
              const { data: res } = await this.$http.put(
                "/home/program",
                this.program
              )

              if (res.code !== 1) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  duration: 1500,
                  type: "error"
                })
              }
              if (res.code === 1) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  duration: 1500,
                  type: "success"
                })
                this.findById()
              }
              this.active = 2
              return true
            }
            // 添加节目封面和banner
            this.active = 2
            const result = await this.uploads(this.file)
            this.program.data.cover = result.msg

            console.log(result.msg)
          }
        })
      }

      if (activeName === "1" && this.active !== 2) {
        this.$message.error("请输入正确的信息！")
        return false
      }
      // console.log(activeName);
      if (activeName === "2" && this.active !== 3) {
        this.$message.error("请输入正确的信息！")
        return false
      }
    },
    // addpro
    addpro() {
      this.Src.push({ src: "" })
      console.log(this.Src)
    },
    async deletepro(index, id) {
      // 如果id存在则发出删除请求
      if (this.id) {
        console.log(id)
        const { data: res } = await this.$http.delete("/home/video", {
          params: { id, title: this.program.data.title }
        })
        if (res.code !== 1) return this.$message.error("删除失败！")
        this.$message.success(res.msg)
        return this.findById()
      }
      this.Src.splice(index, 1)
    },
    // 根据传过来得id，找到对应数据
    async findById() {
      // 获取对应id得节目信息
      const { data: res } = await this.$http.get("/home/program", {
        params: this.queryinfo
      })
      if (res.code !== 1)
        return this.$message.error("服务器出错，请稍后再试！！")
      //获取对应id得src视频链接
      const { data: src } = await this.$http.get("/home/video", {
        params: { title: res.data[0].title }
      })
      this.Src = src.data
      console.log(this.Src)
      delete res.data[0].createtime
      this.program.data = res.data[0]
      console.log(this.program.data)
    },
    async editprogram() {
      if (this.src.trim() === "") {
        this.src = ""
        return this.$message.error("不能为空")
      }
      const { data: src } = await this.$http.put("/home/video", {
        title: this.program.data.title,
        type: this.path,
        Src: this.src
      })

      if (src.code !== 1) return this.$message.error(src.msg)
      this.findById()
      this.$message({
        showClose: true,
        message: src.msg,
        duration: 1500,
        type: "success"
      })
    },
    // updateByid 通过_id更新一个链接
    async updatepro(id, src) {
      console.log(21)
      const { data: res } = await this.$http.put("/home/videoById", {
        title: this.program.data.title,
        id,
        src
      })
      console.log(res)
    },
    // 上传图片的方法
    async uploads(file, cover) {
      // 传递一个 FormData 对象 即可
      let formData = new FormData()
      console.log(file)

      formData.append("program", file) // 'file' 可变 相当于 input 表单的name 属性
      formData.append("title", this.path)
      formData.append("id", this.id)
      formData.append("cover", cover)
      // 服务器只需按照正常的上传程序代码即可
      const { data: res } = await this.$http.post(
        "/home/program/upload",
        formData
      )
      return res
    },
    // 上传封面
    async uploadscover(e) {
      this.file = e.target.files[0]
      if (this.id) {
        const result = await this.uploads(this.file, "cover")
        if (result.code !== 1) return this.$message.error("封面上传失败！")
        return (this.program.data.cover = result.msg)
      }
      console.log(e.target.files)
      this.program.data.cover = this.getObjectUrl(this.file)
      console.log(this.program.data.cover)
    },
    // 上传banner
    async uploadsbanner(e) {
      this.filebanner = e.target.files[0]
      if (this.id) {
        const data = await this.uploads(this.filebanner)
        return (this.program.data.banner = data.msg)
      }
      const banner = this.getObjectUrl(this.filebanner)
      this.program.data.banner = banner
      console.log(this.program.data.banner)
    },
    getObjectUrl(file) {
      let url = null
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      }
      return url
    }
  },
  computed: {
    path() {
      return this.$route.query.title
    },
    title() {
      return this.Src
    },
    id() {
      return this.$route.query.id
    }
  }
}
</script>
<style lang="scss" scoped>
.el-steps {
  margin: 15px 0;
}
.el-form {
  width: 80%;
}
.addpro {
  margin: 0 0 20px 20px;
}
.el-row {
  width: 70%;
  margin: 0 auto;
}
.form-up {
  width: 85%;
}
.editinp-src {
  width: 50%;
}
.src-title {
  width: 50px;
  margin-right: 10px;
}
.upinput {
  width: 67%;
  margin-right: 20px;
}
.card {
  position: relative;
  min-height:260px;
}
.express {
  width: 260px;
  height: 250px;
  position: absolute;
  right: 50px;
  top: 50px;
  color: rgb(103, 211, 224);
  font-size: 13px;
  line-height: 24px;
}
// 上传图片样式
.file {
  position: absolute;
  z-index: 2;
  left: 0px;
  top: 0px;
  height: 148px;
  width: 148px;
  opacity: 0;
}
.cover {
  position: relative;
}
.contain-cover:hover .filebtn {
  border-color: #409eff;
}
.contain-cover {
  display: flex;
}
.contain-cover img {
  margin-right: 15px;
  background-size: cover;
  border-radius: 6px;
}
.filebtn {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  cursor: pointer;
  font-size: 28px;
  color: #8c939d;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.img-cover {
  width: 148px;
  height: 148px;
}
.cover-prompt {
  margin-top: 10px;
  color: #f56c6c;
}
.img-banner {
  width: 296px;
  height: 148px;
}
.cover-input {
  position: absolute;
  width: 75%;
  opacity: 0;
}
</style>