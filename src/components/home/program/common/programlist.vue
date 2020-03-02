<template>
  <div>
    <!-- 节目列表 -->
    <el-row style="height:50px;">
      <el-col :span="3" style="display:flex; align-items:center;height:100%">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="addfrom('save')">添加</el-button>
      </el-col>
      <el-col :span="21" class="sort">
        <i class="el-icon-sort"></i>
        <span class="span-sort">排序方式</span>
        <div class="select-sort">
          <span
            :class="['select-sort-span',{'select-sort-span-active':sortClass===index}]"
            v-for="(item,index) in sort"
            :key="index"
            @click="sortpro(index)"
          >{{item}}</span>
        </div>
      </el-col>
    </el-row>
    <div class="list">
      <div v-for="item in programlist" :key="item.id" class="list-block">
        <div class="hidearea">
          <span>导演：{{item.director}}</span>
          <span>主演：{{item.star}}</span>
        </div>
        <img :src="item.cover" :alt="item.title" style="width:100%;height:275px;" />
        <span class="list-span">{{item.title}}</span>
        <!-- 用户与管理员页面 -->
        <div class="bottom-btn" v-if="status">
          <el-tooltip content="编辑" placement="top" :enterable="false">
            <el-button
              icon="el-icon-edit"
              circle
              type="primary"
              size="small"
              @click="findById(item._id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" :enterable="false">
            <el-button
              icon="el-icon-delete"
              circle
              type="danger"
              size="small"
              @click="deleted(item._id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="收藏" placement="top" :enterable="false">
            <el-button icon="el-icon-star-off" circle size="small" type="warning"></el-button>
          </el-tooltip>
        </div>
        <div class="bottom-btn" v-else>
          <el-tooltip content="下载" placement="top" :enterable="false">
            <el-button icon="el-icon-download" circle type="success" size="small"></el-button>
          </el-tooltip>
          <el-tooltip content="播放" placement="top" :enterable="false">
            <el-button
              icon="el-icon-video-play"
              circle
              type="primary"
              size="small"
              @click="playvideos(item.src,item.title)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="收藏" placement="top" :enterable="false">
            <el-button icon="el-icon-star-off" circle size="small" type="warning"></el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 添加节目对话框 更新内容对话框-->
    <el-dialog
      :title="type==='save'?'添加节目':'更新内容'"
      :visible.sync="dialogAdd"
      width="40%"
      @close="resetform"
      :top="5+'vh'"
    >
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
        <el-form-item label="简介">
          <el-input type="textarea" :placeholder="program.data.bio" v-model="program.data.bio"></el-input>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="program.data.src" class="editinp"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="addprogram" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 播放视频弹框 -->
    <el-dialog :title="playtitle" :visible.sync="playvideo" width="60%" :top="5+'vh'">
      <el-alert title="如未自动播放请手动点击播放按钮并耐心等待" type="warning" show-icon class="alert"></el-alert>
      <iframe
        width="100%"
        height="680px"
        :src="playsrc"
        frameborder="0"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowfullscreen="allowfullscreen"
        mozallowfullscreen="mozallowfullscreen"
        msallowfullscreen="msallowfullscreen"
        oallowfullscreen="oallowfullscreen"
        webkitallowfullscreen="webkitallowfullscreen"
        v-if="playvideo"
      ></iframe>
    </el-dialog>
  </div>
</template>
<script>
import { deleted } from "@/common/crod/index";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 节目表单数据
      program: {
        title: this.$route.path.substr(1),
        data: {
          bio: "",
          title: "关于哈利的那些事 The Thing About Harry (2020)",
          director: "彼得·派格",
          writer: "彼得·派格 / 约书亚·森特",
          star:
            "布丽特·巴伦 / 杰克·博尔利 / 卡拉莫·布朗 / 彼得·派格 / 吉奥塔·特拉卡斯",
          type: "喜剧 / 爱情 / 同性",
          area: "美国",
          language: "英语",
          date: "90min",
          time: "2020-02-15",
          cover:
            "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2581161597.webp",
          src: ""
        }
      },
      dialogAdd: false,
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
      // 节目信息请求体
      queryinfo: {
        title: this.$route.path.substr(1),
        pagesize: 12,
        pagenum: 1,
        id: ""
      },
      // 决定是增加数据还是编辑数据
      type: "",
      // 保存节目数据
      parent: this.$parent.$parent,
      // programlist: null
      // sort排序
      sort: ["最新", "最热", "推荐"],
      sortClass: 0,
      sta: null,
      playvideo: false,
      playtitle: null,
      playsrc: ""
    };
  },
  props: {
    programlist: {
      type: Array,
      defaults: []
    }
  },
  created() {
    // this.getprogramlist();
  },
  methods: {
    // 将vuex的方法映射到组件
    // 添加/更新节目内容，发送网络请求
    addprogram() {
      this.$refs.addform.validate(async valid => {
        if (!valid) {
          console.log(valid);
          this.$message({
            showClose: true,
            message: "请输入正确的内容",
            duration: 1500,
            type: "error"
          });
          return false;
        }
        let data;
        if (this.type === "save") {
          const { data: res } = await this.$http.post(
            "/home/program",
            this.program
          );
          data = res;
        } else {
          const { data: res } = await this.$http.put(
            "/home/program",
            this.program
          );
          data = res;
        }
        // console.log(data)
        this.dialogAdd = false;
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
        this.queryinfo.id = "";
        console.log(this.$parent);
        // 调用父组件的方法
        this.parent.getprogramlist();
      });
    },
    addfrom() {
      this.type = "save";
      this.dialogAdd = true;
    },
    // 关闭添加对话框，重置表单内容
    resetform() {
      // console.log(123)
      // this.$refs.addform.resetFields();
      // 关闭对话框更新数据
    },
    // 删除节目数据
    async deleted(id) {
      const code = await deleted("/home/program", {
        title: this.program.title,
        id
      });
      if (code === 1) {
        // 调用父组件的方法
        this.parent.getprogramlist();
      }
    },
    // 根据id查询指定数据
    async findById(id) {
      this.type = "put";
      this.queryinfo.id = id;
      this.dialogAdd = true;
      const { data: res } = await this.$http.get("/home/program", {
        params: this.queryinfo
      });
      // 判断数据是否查询成功
      if (res.code !== 1) return this.$message.error(res.msg);
      delete res.data[0]._id;
      this.program.data = res.data[0];
    },
    sortpro(index) {
      this.sortClass = index;
    },
    playvideos(src, title) {
      this.playvideo = true;
      this.playtitle = title;
      this.playsrc = src;
      console.log(src, title);
    }
    // 映射vuex action
    // ...mapActions({
    //   getprogramlist:this.program.title
    // })
    // vuex 请求数据方法 获取节目列表
    // async getprogramlist() {
    //   const {data:res} = await this.getlist({title:this.program.title});
    //   if (res.code !== 1) return this.$message.error("获取数据失败");
    //   this.programlist = res.data;
    //   console.log(res)
    // }
  },
  computed: {
    ...mapState(["status"])
    // programlist() {
    //   return this.$store.getters.programlist;
    // }
  }
};
</script>
<style scoped>
.sort {
  display: flex;
  justify-content: flex-end;
}
.list {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  overflow: auto;
  font-size: 13px;
  margin-left: 5px;
}
.list-block {
  margin: 10px 10px 5px;
  cursor: pointer;
  width: 15%;
  border-radius: 5px;
  padding-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.list-block:hover .hidearea{
  transform: translateY(0)
}
.list-block .hidearea {
  position: absolute;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  transition: all 0.5s ease;
  transform: translateY(-100%) 
}
.list-block .hidearea span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
  line-height: 25px;
  text-align: left
}
.list-span {
  display: inline-block;
  width: 120px;
  padding: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bottom-btn {
  display: flex;
  justify-content: space-around;
}
.sort {
  display: flex;
  align-items: center;
  height: 50px;
}
.sort .span-sort {
  padding: 0 15px 0 5px;
  font-size: 14px;
}
.sort .select-sort {
  background: #ea644a;
  color: #ffffff;
  border-radius: 4px;
  overflow: hidden;
}
.sort .select-sort .select-sort-span {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  border: 1px solid;
  border-color: #e75033;
  transition: all 0.5s ease;
}
.sort .select-sort .select-sort-span:hover {
  background-color: #e64525;
  border-color: #e64525;
}
.sort .select-sort .select-sort-span-active {
  background-color: #e64525;
  border-color: #c63317;
}
.alert {
  margin-bottom: 10px;
}
</style>