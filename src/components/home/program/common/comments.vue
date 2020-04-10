<template>
  <div>
    <!-- 评论列表 -->
    <div v-if="comments">
      <div class="container" v-for="(item,index) in comments" :key="item._id">
        <div class="face">
          <img :src="'http://127.0.0.1:3000'+item.avatar" alt />
        </div>
        <div class="content">
          <div class="username">
            <span>{{item.username}}</span>
            <i class="el-icon-close" v-if="status" @click="deletecom(item._id)"></i>
          </div>
          <div class="top">
            <span>{{item.content}}</span>
          </div>
          <div class="bottom">
            <span>来自pc端</span>
            <span>{{item.createtime | dateformat()}}</span>
            <span>
              <!-- :class="['img',{'imgactive':thumbs}]" -->
              <img
                :src="thactive===index?img[thumbs].thumbs:img[0].thumbs"
                class="img"
                @mouseover="thumbsactive(index,'dian')"
                @mouseleave="recover('dian')"
                @click="thumbsc(item._id,item.thumbs,'thumbs')"
              />
              {{item.thumbs}}
            </span>
            <span>
              <img
                class="img"
                :src="thactive===index?img[Nrecom].thumbs:img[1].thumbs"
                @mouseover="thumbsactive(index)"
                @mouseleave="recover"
                @click="thumbsc(item._id,item.Nrecom)"
              />
              {{item.Nrecom}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 无评论时 -->
    <div class="nonecomment" v-else>还没有评论，快来抢个沙发吧！！</div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import { deleted } from "../../../../common/crod/index"

export default {
  name: "comments",
  data() {
    return {
      thumbs: 0,
      Nrecom: 1,
      // 控制显示哪张图片
      thactive: -1,
      // 点赞和踩的图片
      img: [
        { thumbs: require("@/assets/image/comment/dian.png") },
        { thumbs: require("@/assets/image/comment/cai.png") },
        { thumbs: require("@/assets/image/comment/dactive.png") },
        { thumbs: require("@/assets/image/comment/Cactive.png") }
      ],
      
    }
  },
  props: {
    comments: {
      type: Array,
      defaults: []
    },
    title: {
      type: String,
      defaults: ""
    }
  },
  created() {},
  methods: {
    // 删除评论的请求
    async deletecom(id) {
      const code = await deleted("/home/program/comments", {
        id,
        title: this.title
      })
      if (code === 1) {
        this.$parent.$parent.$parent.$parent.getcomments()
      }
    },
    // 点赞请求
    async thumbsc(id, value, type) {
      const { data: res } = await this.$http.put("/home/program/comments", {
        id,
        value,
        type
      })
      this.$parent.$parent.$parent.$parent.getcomments()
      console.log(res)
    },
    // 点赞图标和踩图标经过的切换
    thumbsactive(index, type) {
      if (type) {
        this.thactive = index
        this.thumbs = 2
      } else {
        this.thactive = index
        this.Nrecom = 3
      }
    },
    recover(type) {
      if (type==='dian') {
        this.thumbs = 0
      } else {
        this.Nrecom = 1
      }
    }
  },
  computed: {
    ...mapState(["status"])
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  .face {
    margin: 3px 0 0 50px;
    width: 55px;
    height: 55px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .content {
    margin-left: 25px;
    width: 745px;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 0 10px;
    .username {
      font-size: 12px;
      line-height: 24px;
      color: #999;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      i:hover {
        transform: scale(1.2);
        color: #f56c6c;
      }
    }
    .top {
      line-height: 24px;
      padding: 8px 0;
      font-size: 14px;
      color: #303133;
    }
    .bottom {
      font-size: 12px;
      color: #999;
      display: flex;
      span {
        padding-right: 25px;
        display: flex;
        align-items: center;
        .img {
          width: 14px;
          height: 14px;
          margin-right: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
.nonecomment {
  text-align: center;
  font-size: 18px;
  color: #999;
  font-weight: 500;
  padding: 30px 0;
}
</style>