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
                <el-input v-model="program.data.title" class="editinp" ></el-input>
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
              <el-form-item label="封面" prop="cover">
                <el-input v-model="program.data.cover" class="editinp"></el-input>
              </el-form-item>
              <el-form-item label="小标题">
                <el-input :placeholder="program.data.subtitle" v-model="program.data.subtitle"></el-input>
              </el-form-item>
              <el-form-item label="banner">
                <el-input :placeholder="program.data.banner" v-model="program.data.banner"></el-input>
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
                <el-input v-model="Src[index].src" class="editinp-src" v-if="Src[index].src"></el-input>
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
        <p> *说明：基本信息填写完毕后，点击上传视频就会自动修改，未更改则会提示！</p>
        <p> *视频上传：一次可以上传多个视频，更新视频每次只能添加一个视频，可以多次添加！</p>
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
          title: "复仇者联盟2：奥创纪元 Avengers: Age of Ultron (2015)",
          director: "乔斯·韦登",
          writer: "乔斯·韦登 / 扎克·佩恩",
          star:
            "小罗伯特·唐尼 / 克里斯·埃文斯 / 斯嘉丽·约翰逊 / 克里斯·海姆斯沃斯 / 杰瑞米·雷纳 ",
          type: "动作 / 科幻 / 奇幻 / 冒险",
          area: "美国",
          language: "英语 / 俄语",
          date: "2015-05-12(中国大陆)",
          time: "142分钟",
          cover:
            "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1469137689.webp",
          src: "",
          subtitle: "奥创来袭",
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
        cover: [{ required: true, message: "不能为空", trigger: "blur" }]
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
      }
    };
  },
  created() {
    // 获取传过来的参数并赋值
    this.program.title = this.path;
    this.queryinfo.title = this.path;
    this.queryinfo.id = this.id;
    // id存在才发送网络请求
    if (this.id) {
      this.findById();
    }
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    // 添加节目
    async addprogram() {
      let data;
      // 发送添加视频链接的请求
      const { data: src } = await this.$http.post("/home/video", {
        title: this.program.data.title,
        src: this.Src,
        type: this.program.title
      });
      // 对返回的数据进行判断
      if (src.code !== 1)
        return this.$message({
          showClose: true,
          message: src.msg,
          duration: 1500,
          type: "error"
        });
      const { data: res } = await this.$http.post(
        "/home/program",
        this.program
      );
      data = res;
      if (data.code !== 1)
        return this.$message({
          showClose: true,
          message: data.msg,
          duration: 1500,
          type: "error"
        });
      this.$message({
        showClose: true,
        message: data.msg,
        duration: 1500,
        type: "success"
      });
    },
    // 点击tab，离开之前触发的钩子函数
    levavetab(activeName) {
      
      if (activeName === "0") {
        return  this.active = 1;
      }
      if (this.$refs.addform) {
        // 验证信息表单是否正确
        this.$refs.addform.validate(async valid => {
          if (valid) {
            // 跳转的时候判断信息是否填写
            if (this.id && activeName == 1) {
              this.active = 2;
              const { data: res } = await this.$http.put(
                "/home/program",
                this.program
              );

              if (res.code !== 1) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  duration: 1500,
                  type: "error"
                });
              }
              if (res.code === 1) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  duration: 1500,
                  type: "success"
                });
                this.findById();
              }
              this.active = 2;
              return true;
            }
            this.active = 2;
          }
        });
      }

      if (activeName === "1" && this.active !== 2) {
        return false;
      }
      // console.log(activeName);
      if (activeName === "2" && this.active !== 3) {
        this.$message.error("请输入正确的信息！");
        return false;
      }
    },
    // addpro
    addpro() {
      this.Src.push({ src: "" });
    },
    async deletepro(index, id) {
      // 如果id存在则发出删除请求
      if (this.id) {
        console.log(id);
        const { data: res } = await this.$http.delete("/home/video", {
          params: { id, title: this.program.data.title }
        });
        if (res.code !== 1) return this.$message.error("删除失败！");
        this.$message.success(res.msg);
        return this.findById();
      }
      this.Src.splice(index, 1);
    },
    // 根据传过来得id，找到对应数据
    async findById() {
      // 获取对应id得节目信息
      const { data: res } = await this.$http.get("/home/program", {
        params: this.queryinfo
      });
      if (res.code !== 1)
        return this.$message.error("服务器出错，请稍后再试！！");
      //获取对应id得src视频链接
      const { data: src } = await this.$http.get("/home/video", {
        params: { title: res.data[0].title }
      });
      this.Src = src.data;
      this.program.data = res.data[0];
    },
    async editprogram() {
      const { data: src } = await this.$http.put("/home/video", {
        title: this.program.data.title,
        type: this.path,
        Src: this.src
      });

      if (src.code !== 1) return this.$message.error(src.msg);
      this.findById();
      this.$message({
        showClose: true,
        message: src.msg,
        duration: 1500,
        type: "success"
      });
    },
    // updateByid 通过_id更新一个链接
    async updatepro(id,src) {
      console.log(21)
      const {data:res} = await this.$http.put('/home/videoById',{title:this.program.data.title,id,src})
      console.log(res)
    },
  },
  computed: {
    path() {
      return this.$route.query.title;
    },
    title() {
      return this.Src;
    },
    id() {
      return this.$route.query.id;
    }
  }
};
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
.card{
  position: relative;
}
.express{
  width: 260px;
  height: 250px;
  position: absolute;
  right: 50px;
  top: 50px;
  color: rgb(103, 211, 224);
  font-size: 13px;
  line-height: 24px;
}
</style>