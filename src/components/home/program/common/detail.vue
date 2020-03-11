<template>
  <div v-if="list">
    <el-page-header @back="goBack" :content="list.title"></el-page-header>
    <el-card class="detail">
      <el-row :gutter="20">
        <el-col :span="17" class="video">
          <el-alert title="友情提示：如未自动播放请手动点击播放按钮并耐心等待" type="warning" show-icon class="alert"></el-alert>
          <div @click="clearVideo">
            <iframe
              width="100%"
              height="680px"
              :src="src[Vindex].src"
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
              v-if="src"
            ></iframe>
          </div>

          <!-- 视频详细信息 -->
          <div class="v-block">
            <div class="bg"></div>
            <div class="pro-detail">
              <!-- 左边图片区域 -->
              <div class="left">
                <img :src="list.cover" :alt="list.title" style="border-radius:4px;" />
              </div>
              <!-- 右侧文字区域 -->
              <div class="right">
                <div class="title">
                  <span class="s-title">{{list.title}}</span>
                  <div class="tag" v-for="(item,index) in tag" :key="index">{{item}}</div>
                </div>
                <div class="number">
                  <div class="n-left">
                    <div class="playn">
                      <span>总播放数</span>
                      <em>{{list.hot}}</em>
                    </div>
                    <div class="playn middle">
                      <span>追剧人数</span>
                      <em>{{list.Favorite}}</em>
                    </div>
                  </div>
                  <div class="n-right">
                    <div class="pingfen">
                      <span>8.9</span>
                    </div>
                    <div>
                      <span class="review-stars">
                        <i class="el-icon-star-on icon-star-light"></i>
                        <i class="el-icon-star-on icon-star-light"></i>
                        <i class="el-icon-star-on icon-star-light"></i>
                        <i class="el-icon-star-on icon-star-light"></i>
                        <i class="el-icon-star-on icon-star"></i>
                      </span>
                      <span class="people">2000人评</span>
                    </div>
                  </div>
                </div>
                <div class="video-bio">
                  <div class="video-time">上映日期：{{list.date}}</div>
                  <span class="biodetail">简介：{{list.bio}}</span>
                </div>
                <div class="share"></div>
                <!-- 底部区域 -->
                <div class="right-btm">
                  <div class="intership">开通会员抢先看</div>
                  <div class="follow" @click="Favorite">
                    <i class="el-icon-star-off"></i> 收藏该剧
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 右侧区域 -->
        <el-col :span="7" class="video-title">
          <div class="subtitle">
            <i class="icon-img"></i>
            <span>{{list.subtitle}}</span>
          </div>
          <div class="title-top">
            <!-- 选集部分 -->
            <div>
              <i class="el-icon-menu"></i>
              <span class="zhengpian">正片</span>
            </div>
            <el-row :gutter="20" class="el-row-col">
              <el-col
                :span="5"
                :class="['el-col-col',{'el-col-col-active':Vindex === index}]"
                v-for="(item,index) in src"
                :key="index"
                @click.native="playvideo(index)"
              >{{index+1}}</el-col>
            </el-row>
          </div>
          <!-- 推荐部分 -->
          <div class="recommend">
            <div class="re-title">
              <span>相关节目推荐</span>
            </div>
            <div
              class="re-content"
              v-for="(item,index) in recommend"
              :key="index"
              @click="select(item._id)"
            >
              <div class="left" :style="'background:url('+item.cover+');'">
                <!-- <img :src="item.cover" :alt="item.title"> -->
              </div>
              <div class="right">
                <span class="title">{{item.title}}</span>
                <span>导演：{{item.director}}</span>
                <span>主演：{{item.star}}</span>
                <span>类型：{{item.type}}</span>
                <span>地区：{{item.area}}</span>
                <span>语言：{{item.language}}</span>
                <span>年份：{{item.date}}</span>
                <span>热度：{{item.hot}}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      // 保存节目数据
      list: null,
      // 保存推荐节目数据
      recommend: null,
      // 标签
      tag: null,
      id: "",
      src: null,
      Vindex: 0,
      // 定时器
      timer: null,
      // 记录播放时间
      time: 0
    };
  },
  created() {
    console.log(this.title);
    this.id = this.$route.query.id;
    this.getdetail();
  },
  mounted() {},
  updated() {
    if (this.time) {
      this.clearVideo();
    }
  },
  methods: {
    ...mapActions(["getlist"]),
    // 获取节目详细信息
    async getdetail() {
      const { data: res } = await this.$http.get("/home/program", {
        params: { id: this.id, title: this.title }
      });
      if (res.code !== 1) {
        return this.$message.error("获取列表失败");
      }
      // 为详细节目信息赋值
      this.list = res.data[0];
      let title = res.data[0].title;
      // 获取播放链接
      const { data: src } = await this.$http.get("/home/video", {
        params: { title }
      });
      if (src.code !== 1) return this.$message.error("服务器出错，请稍后再试");
      this.src = src.data;
      this.Video = src.data[0].src;
      // 获取标签
      this.tag = this.list.type.split(/\//g);

      //获取推荐数据
      const { data: recommend } = await this.getlist({
        title: this.title,
        name: ""
      });
      if (recommend.code !== 1) {
        return this.$message.error(recommend.msg);
      }
      // 按收藏排序
      let Favorite = recommend.data.filter(item => {
        return item._id !== this.id;
      });
      this.recommend = Favorite.sort((a, b) => {
        return b.Favorite - a.Favorite;
      });
      console.log(this.recommend);
    },
    // 返回上一级
    goBack() {
      this.clearVideo();
      this.$router.push("/" + this.title);
    },
    select(id) {
      this.id = id;
      this.getdetail();
    },
    // 播放视频
    async playvideo(index) {
      this.Vindex = index;
      const { data: res } = await this.$http.put("/home/program/hot", {
        id: this.list._id,
        hot: this.list.hot
      });
      if (res.code === 1) {
        this.timer = setInterval(() => {
          this.time += 5;
        }, 2000);
      }
    },
    // 清除定时器并发送网络请求
    async clearVideo() {
      clearInterval(this.timer);
       await this.$http.post("/home/program/expense", {
        minute: this.time,
        title: this.title,
        id: this.list._id,
        _id: this.userinfo._id
      });
      this.time = 0;
    },
    // 收藏事件
    async Favorite() {
      console.log(123);
      const { data: res } = await this.$http.put("/home/program/hot", {
        id: this.list._id,
        value: this.list.Favorite
      });
      if (res.code !== 1) return this.$message.warning("不要重复收藏");
      this.$message.success("收藏成功！");
    }
  },
  computed: {
    ...mapState(["userinfo"]),
    title() {
      return this.$route.query.title;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-page-header {
  font-size: 14px;
}
.detail {
  margin-top: 20px;
}

.title-top {
  padding: 15px;
  color: #00a1d6;
  font-size: 16px;
  background: #f4f5f7;
  margin-top: 15px;
  max-height: 302px;
  overflow: hidden;
}
/* 小标题 */
.subtitle {
  text-align: center;
  background: #00a1d6;
  color: #ffffff;
  padding: 15px 0;
  position: relative;
}
/* 22粮 */
.icon-img {
  background: url(http://s1.hdslb.com/bfs/static/pgcv/asserts/func-icon-vip.png);
  background-size: cover;
  background-position: 100%;
  width: 60px;
  height: 60px;
  display: block;
  position: absolute;
  top: -9px;
}
.el-row-col {
  margin-top: 15px;
}
.coll {
  text-align: center;
  background: #00a1d6;
  color: #ffffff;
}
.el-col-col {
  background: #ffffff;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
  width: 20%;
  border: #f4f5f7 8px solid;
  color: #999;
  transition: all 0.3s ease;
}
.el-col-col:hover {
  color: #00a1d6;
  font-weight: 500;
  cursor: pointer;
}
.el-col-col-active {
  background: #00a1d6;
  color: #ffffff !important;
}

.recommend {
  height: 655px;
  overflow: hidden;
}
.recommend .re-title {
  padding: 15px 0;
}
.recommend .re-content {
  display: flex;
  cursor: pointer;
}
.recommend .re-content .left {
  box-sizing: border-box;
  width: 40%;
  height: 195px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-size: cover !important;
}
.recommend .re-content .right {
  box-sizing: border-box;
  width: 60%;
  border-left: 10px solid #ffffff;
  font-size: 13px;
  span {
    display: inline-block;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-bottom: 5px;
    color: #999;
  }
  .title {
    font-size: 16px;
    color: #000;
  }
  .bio {
    height: 87px;
    overflow: hidden;
    color: #999;
  }
}
// 视频详细介绍
.zhengpian {
  display: inline-block;
  padding-left: 5px;
}
.v-block {
  padding-top: 30px;
  position: relative;
}
.bg {
  background: url(../../../../assets/image/bg.png);
  background-size: cover;
  height: 300px;
  filter: blur(20px);
}

.pro-detail {
  position: absolute;
  top: 0px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.2);
  margin-top: 10px;
  padding: 10px;
  display: flex;
  .left {
    border: #ffffff 3px solid;
    border-radius: 4px;
    width: 220px;
    height: 300px;
    img {
      width: 220px;
      height: 300px;
      border-radius: 4px;
    }
  }
  // 播放详情页right
  .right {
    width: 632px;
    box-sizing: border-box;
    color: #fff;
    padding-left: 15px;
    position: relative;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .s-title {
        font-size: 20px;
        line-height: 22px;
        font-weight: 700;
        width: 230px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-right: 15px;
      }
      .tag {
        margin-left: 10px;
        border: solid 1px #ffff;
        padding: 0 4px;
        font-size: 12px;
        border-radius: 4px;
      }
    }
    // 追番人数
    .number {
      display: flex;
      font-size: 12px;
      margin-bottom: 20px;
      justify-content: space-between;
      .n-left {
        display: flex;
        justify-content: space-between;
        height: 36px;
        .playn {
          margin-right: 20px;

          width: 55px;
          span {
            display: inline-block;
            width: 100%;
          }
          em {
            display: inline-block;
            padding-top: 6px;
            line-height: 17px;
            font-style: normal;
            font-weight: 700;
          }
        }
        .middle {
          border-left: #fff 1px solid;
          padding-left: 25px;
        }
      }
      .n-right {
        display: flex;
        .pingfen {
          display: flex;
          align-items: center;
          height: 36px;
          span {
            display: block;
            margin: 0 7px 0 0;
            text-align: right;
            color: #ffa726;
            font-size: 36px;
            line-height: 36px;
          }
        }
        .review-stars {
          display: block;
        }
        .review-stars > i {
          display: inline-block;
          font-size: 12px;
          line-height: 21px;
        }
        .icon-star {
          color: #ccc;
        }
        .icon-star-light {
          color: #ffa726;
        }
      }
    }
    // 详情部分
    .video-bio {
      font-size: 12px;
      .video-time {
        padding-bottom: 10px;
      }
      .biodetail {
        display: inline-block;
        line-height: 20px;
        height: 121px;
        overflow: hidden;
      }
    }
  }
  // right边bottom
  .right-btm {
    position: absolute;
    width: 290px;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .intership {
      border-radius: 4px;
      padding: 10px 15px;
      background: #00a1d6;
      font-weight: 700;
      cursor: pointer;
    }
    .intership:hover {
      background: #00b5e5;
    }
    .follow {
      font-weight: 700;
      border-radius: 4px;
      padding: 10px 15px;
      background: #f36392;
      cursor: pointer;
    }
    .follow:hover {
      background: #ff85ad;
    }
  }
}
.alert {
  margin-bottom: 10px;
}
</style>