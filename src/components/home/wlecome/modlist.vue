<template>
  <div class="container">
    <div class="head" v-if="data">
      <div class="head-contain" @click="gopath(data[0].path)">
        <span class="head-image anima" v-if="data[0].path==='pfunny'"></span>
        <span class="head-image movie" v-if="data[0].path==='pmovie'"></span>
        <span class="head-image tvseries" v-if="data[0].path==='ptvseries'"></span>
        <span class="head-image variety" v-if="data[0].path==='pvariety'"></span>
        <span class="qy-mod-text">{{title}}</span>
        <span class="more">更多></span>
      </div>
    </div>
    <div class="content">
      <!-- 左部 -->
      <div class="content-left" @click="goplay(data[index]._id,data[index].path)">
        <div class="left-image">
          <img src="//pic2.iqiyipic.com/common/lego/20200328/23839af121344eda8d389b7e0178697a.webp" />
          <div class="qy-mod-img-turn">
            <span class="span-left" @click.stop="handleindex">
              <i class="el-icon-arrow-left"></i>
            </span>
            <span class="span-right" @click.stop="handleindex">
              <i class="el-icon-arrow-right"></i>
            </span>
          </div>
        </div>
        <div class="list-title" v-if="data">
          <span class="title">{{data[index].title}}</span>
          <span class="subtitle">{{data[index].subtitle}}</span>
        </div>
      </div>
      <!-- 右部 -->
      <div class="content-right">
        <!-- list上面部分 -->
        <div class="list-main" v-if="listTop && JSON.stringify(listTop)!=='[]'">
          <div
            class="list"
            v-for="(item,index) in listTop"
            :key="index"
            @click="goplay(item._id,item.path)"
          >
            <div class="image">
              <img src alt />
            </div>
            <div class="list-title">
              <span class="title">{{item.title}}</span>
              <span class="subtitle">{{item.subtitle}}</span>
            </div>
          </div>
        </div>
        <div class="list-main" v-else>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
        </div>
        <!-- list下部 -->
        <div class="list-main" v-if="listBottom  && JSON.stringify(listBottom)!=='[]'">
          <div
            class="list"
            v-for="(item,index) in listBottom"
            :key="index"
            @click="goplay(item._id,item.path)"
          >
            <div class="image">
              <img src alt />
            </div>
            <div class="list-title">
              <span class="title">{{item.title}}</span>
              <span class="subtitle">{{item.subtitle}}</span>
            </div>
          </div>
        </div>
        <div class="list-main" v-else>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
          <div class="list">
            <div class="image loading">
              <i class="el-icon-loading"></i>
            </div>
            <div class="list-title">
              <span class="title">正在加载</span>
              <span class="subtitle">请先去浏览其它页面</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      index: 0,
      listTop: null,
      listBottom: null
    }
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ""
    }
  },
  components: {},
  created() {},
  methods: {
    //  点击切换显示图片
    handleindex() {
      this.index = this.index === 0 ? 1 : 0
    },
    // 跳转到播放页面
    goplay(id, title) {
      console.log(id, title)
      this.$router.push({ path: "/detail", query: { id, title } })
    },
    gopath(path) {
      this.$router.push("/" + path)
    }
  },
  computed: {},
  watch: {
    //   获取两边数据
    data(val) {
      if (val) {
        this.listTop = this.data.slice(2, 6)
        this.listBottom = this.data.slice(6)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}
.list-title {
  padding: 6px 10px;
  background: #f8f8f8;
  span {
    display: inline-block;
    width: 100%;
    line-height: 23px;
    height: 23px;
    font-size: 15px;
    vertical-align: baseline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title {
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
  .subtitle {
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
}
.container {
  margin: 15px 0px 20px;
  .head {
    padding-bottom: 15px;
    padding-top: 10px;
    .head-contain {
        width: 200px;
      .head-image {
        display: inline-block;
        vertical-align: bottom;
        width: 28px;
        height: 28px;
        background: url(//www.iqiyipic.com/common/fix/site-v4/sprite-channelTitle-icons@2x-0422.png)
          no-repeat 50%;
        background-size: 400px 120px;
        margin-right: 10px;
        position: relative;
        top: 1px;
      }
      .anima {
        background-position: -320px 0;
      }
      .movie {
        background-position: -240px 0;
      }
      .variety {
        background-position: -80px 0;
      }
      .tvseries {
        background-position: -280px 0;
      }
      .qy-mod-text {
        display: inline-block;
        font-size: 26px;
        line-height: 28px;
        color: #222;
      }
      .more {
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
        margin-top: 12px;
        font-size: 14px;
        line-height: 16px;
      }
    }
    .head-contain:hover {
      color: #00be06;
      cursor: pointer;
    }
    .head-contain:hover .qy-mod-text {
      color: #00be06;
    }
  }
  .content {
    display: flex;
    .content-left {
      cursor: pointer;
      width: 405px;
      height: 369px;
      background: #e5e5e5;
      .left-image {
        height: 310px;
        width: 100%;
        background: #e5e5e5;
        overflow: hidden;
        position: relative;
        .qy-mod-img-turn {
          width: 100%;
          height: 40px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          span {
            width: 32px;
            height: 40px;
            line-height: 40px;

            text-align: center;
            i {
              font-size: 20px;
              font-weight: 700;
              color: #ffffff;
            }
          }
          //   左右切换按钮样式
          .span-right {
            border-radius: 30px 0px 0px 30px;
            background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0.1)
            );
          }
          .span-right:hover {
            background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.8),
              rgba(0, 0, 0, 0.3)
            );
          }
          .span-left {
            border-radius: 0 30px 30px 0;
            background: linear-gradient(
              to left,
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0.1)
            );
          }
          .span-left:hover {
            background: linear-gradient(
              to left,
              rgba(0, 0, 0, 0.8),
              rgba(0, 0, 0, 0.3)
            );
          }
        }
      }
    }
    .content-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .list-main {
        display: flex;
      }
      .list {
        width: 25%;
        height: 177px;
        box-sizing: border-box;
        border: 2px solid #ffffff;
        border-top: none;
        background: #e5e5e5;
        cursor: pointer;
        .image {
          width: 100%;
          height: 118px;
          overflow: hidden;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 35px;
          color: #fff;
        }
      }
    }
  }
}
// hover样式
.list:hover .list-title > .title {
  color: #00be06;
}
.content-left:hover .list-title > .title {
  color: #00be06;
}
.image:hover img {
  transform: scale(1.05);
}
.left-image:hover img {
  transform: scale(1.05);
}
</style>