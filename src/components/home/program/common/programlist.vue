<template>
  <div>
    <el-alert
      title="友情提示，播放后则会产生费用，且播且珍惜！"
      type="warning"
      show-icon
      :closable="true"
      v-if="!status"
    ></el-alert>
    <!-- 节目列表 -->
    <el-row style="height:50px;">
      <!-- 添加节目 -->
      <el-col :span="3" style="display:flex; align-items:center;height:100%" v-if="status">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="addfrom('save')">添加</el-button>
      </el-col>

      <!-- 用户可以看到 -->
      <el-col :span="3" style="display:flex; align-items:center;height:100%" v-else>
        <h4 v-if="path==='pmovie'">电影</h4>
        <h4 v-else-if="path==='ptvseries'">电视剧</h4>
        <h4 v-else-if="path==='pvariety'">综艺</h4>
        <h4 v-else>搞笑视频</h4>
      </el-col>

      <!-- 排序方式 -->
      <el-col :span="21" class="sort">
        <i class="el-icon-sort"></i>
        <span class="span-sort">排序方式</span>
        <div class="select-sort">
          <span
            :class="['select-sort-span',{'select-sort-span-active':sortClass===index}]"
            v-for="(item,index) in sort"
            :key="index"
            @click="sortpro(index,item.type)"
          >{{item.title}}</span>
        </div>
      </el-col>
    </el-row>
    <!-- 节目内容区域 -->
    <div class="list">
      <div
        v-for="(item,index) in programlist"
        :key="item.id"
        class="list-block"
        @click="goplay(item._id,item.hot)"
      >
        <div class="proimg" @mouseover="hovers(index)" @mouseleave="remove()">
          <div :class="['hidearea',{'hidearea-hover':hover===index}]">
            <span>导演：{{item.director}}</span>
            <span>主演：{{item.star}}</span>
          </div>
          <img
            :src="'http://127.0.0.1:3000'+item.cover"
            :alt="item.title"
            :class="['proimage',{'proimage-hover':hover===index}]"
          />
          <el-tag
            effect="dark"
            :type="index>2?'':'success'"
            class="tag-new"
            size="mini"
          >{{index===0?'最新':'HD'}}</el-tag>
        </div>
        <span class="list-span">{{item.title}}</span>

        <!-- 用户与管理员页面 -->
        <div class="bottom-btn-ad" v-if="status">
          <el-tooltip content="编辑" placement="top" :enterable="false">
            <el-button
              icon="el-icon-edit"
              circle
              type="primary"
              size="small"
              @click.stop="findById(item._id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" :enterable="false">
            <el-button
              icon="el-icon-delete"
              circle
              type="danger"
              size="small"
              @click.stop="deleted(item._id,item.title)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="收藏" placement="top" :enterable="false">
            <el-button icon="el-icon-star-off" circle size="small" type="warning"></el-button>
          </el-tooltip>
        </div>

        <!-- 用户可选项 -->
        <div class="bottom-btn" v-else>{{item.subtitle}}</div>
      </div>
    </div>
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
          title: "",
          director: "",
          writer: "",
          star: "",
          type: "",
          area: "",
          language: "",
          date: "",
          time: "",
          cover: "",
          src: "",
          subtitle: "",
          banner: ""
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
      sort: [
        { title: "最新", type: "new" },
        { title: "最热", type: "hot" },
        { title: "推荐", type: "recommend" }
      ],
      sortClass: 0,
      sta: null,
      videoid: "",
      hover: -1
    };
  },
  props: {
    programlist: {
      type: Array,
      defaults: []
    }
  },
  created() {
      console.log(this.program.data.title)

  },
  methods: {
    // 添加/更新节目内容，发送网络请求
    addfrom() {
      this.$router.push({
        path: "/addprogram",
        query: { title: this.$route.path.substr(1) }
      });
      this.type = "save";
      // this.dialogAdd = true;
    },
    // 删除节目数据
    async deleted(id,title) {
      const code = await deleted("/home/program", {
        title: this.program.title,
        id,
        stitle:title
      });
      if (code === 1) {
        // 调用父组件的方法
        this.parent.getprogramlist();
      }
    },
    // 根据id查询指定数据
    async findById(id) {
      this.$router.push({
        path: "/addprogram",
        query: { title: this.path, id }
      });
    },
    // 排序方法
    sortpro(index, type) {
      this.sortClass = index;
      this.$store.commit("editsort", type);
      this.parent.getprogramlist();
    },
    // 动画
    hovers(index) {
      this.hover = index;
    },
    remove() {
      this.hover = -1;
    },
    // 跳转到播放页面
    async goplay(id,hot) {
      const { data: res } = await this.$http.put("/home/program/hot", {
        id,
        hot
      });
      if(res.code!==1) return this.$message.error('服务器出错，请稍后再试！！')
      this.$router.push({ path: "/detail", query: { id, title: this.path } });
    }
  },
  computed: {
    ...mapState(["status", "userinfo"]),
    // programlist() {
    //   return this.$store.getters.programlist;
    // }
    path() {
      return this.$route.path.slice(1);
    }
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
  margin-left: 2px;
  color: #303133
}
.list-block {
  margin: 10px 10px 5px;
  cursor: pointer;
  width: 15%;
  border-radius: 5px;
  padding-bottom: 10px;
  overflow: hidden;
  position: relative;
  min-width: 187px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.proimage {
  width: 100%;
  height: 275px;
  transition: all 0.5s ease;
}

.hidearea {
  position: absolute;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  transition: all 0.5s ease;
  transform: translateY(-100%);
  z-index: 99;
}
.proimage-hover {
  transform: scale(1.1);
}

.hidearea-hover {
  transform: translateY(0);
}
.list-block .hidearea span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
  line-height: 25px;
  text-align: left;
}
.list-span {
  display: block;
  width: 120px;
  padding: 8px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  text-align: left
}
.bottom-btn {
  width: 120px;
  text-align: left;
  padding:0 10px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bottom-btn-ad{
  display: flex;
  justify-content: space-around;
}
/* 排序 */
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
/* 图片区域 */
.proimg {
  height: 275px;
  overflow: hidden;
  position: relative;
}
.tag-new {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>