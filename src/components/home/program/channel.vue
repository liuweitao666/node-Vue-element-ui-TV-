<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节目管理</el-breadcrumb-item>
      <el-breadcrumb-item>频道信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容部分 -->
    <el-card>
      <!-- 频道分类数据 -->
      <div class="main">
        <div class="chan-main">
          <div class="chancate" v-if="channelcate">
            <div>
              <span
                v-for="(item,index) in channelcate"
                :key="item.id"
                @click="changecate(index,item.id)"
                :class="{'activeC':index===cateactive}"
              >{{item.name}}</span>
            </div>
            <div class="wenshushu-ad">
              <a
                href="https://www.wenshushu.cn/?from=tvsou"
                target="_blank"
                class="g-test"
                style="position: relative;display: inline-block;width: 100%;line-height: 40px;padding-left: 10px;font-size: 0;text-decoration: none;"
              >
                <i style="position: absolute;left: 0;width: 20px;height: 20px;text-align: center;">
                  <img
                    style="max-width: 100%;max-height: 100%;display:inline-block;vertical-align: middle;"
                    src="https://wss-static.wenshushu.cn/images/drainage/fireblue.png"
                    alt
                  />
                </i>
                <span
                  style="display: inline-block;max-width: 100%;font-size: 14px;color: #5189FF;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                >推荐：一个不限速的网盘</span>
              </a>
            </div>
          </div>
          <!-- 频道列表 -->
          <div class="channel">
            <div class="channel-list">
              <div class="chan-title">
                <span>数字频道列表</span>
              </div>
              <ul class="ul-list">
                <li
                  v-for="(item,index) in channel"
                  :key="index"
                  :class="{'liacrive':liactive===index}"
                  @click="changetime(index,item.rel)"
                >
                  <span>{{item.channelName}}</span>
                </li>
              </ul>
            </div>
            <!--  -->
            <div class="channel-time" v-if="TVtimes">
              <div class="tvtime">
                <span>{{TVtimes[0].cName}}*节目表({{date}})</span>
              </div>

              <div v-for="(item, index) in TVtimes" :key="index" class="TVtimes">
                <span class="time">{{item.time}}</span>
                <span class="pName">{{item.pName}}</span>
                <el-button size="mini" type="primary">回看</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="chan-right">
          <div class="clearfix">
            <h3 class="hot-title">
              热门频道
              <span>更多>></span>
            </h3>
            <div class="channel-hot" v-for="(item,index) in hotchannel" :key="index">
              <span>
                <img :src="item.src" alt />
                <label>{{item.name}}</label>
              </span>
              <label class="channel-list">{{item.label}}</label>
            </div>
          </div>
          <div class="clearfix" v-if="channeltv">
            <h3 class="hot-title">
              热门电视剧
              <span>更多>></span>
            </h3>
            <div
              class="ptvseries"
              v-for="(item,index) in channeltv"
              :key="index"
              @click="goplay(item._id,item.hot,item.path)"
            >
              <span>
                <span :class="['channel-tag',{'channel-tag-active':index<=2}]">{{index+1}}</span>
                <label class="tvname">{{item.title}}</label>
              </span>
              <label class="channel-list">更新至{{item.Src.length}}集</label>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { request2 } from "@/network/request"
import { mapState, mapActions } from "vuex"
export default {
  name: "channel",
  data() {
    return {
      // 频道分类数据
      channelcate: null,
      // 默认频道id
      pid: 1,
      // 频道数据
      channel: null,
      TVtimes: null,
      cName: "cctv-1",
      cateactive: 0,
      liactive: 0,
      date: null,
      hotchannel: [
        {
          src: "//file.tvsou.com/f/5631a69a5a59/zm48-24",
          name: "天津卫视-TJTV-1",
          label: "天津电视台"
        },
        {
          src: "//file.tvsou.com/f/b805e0625017/zm48-24",
          name: "浙江卫视-ZJTV-1",
          label: "浙江电视台"
        },
        {
          src: "//file.tvsou.com/f/f9ae71e5e6ba/zm48-24",
          name: "东方卫视-SMG",
          label: "上海电视台"
        },
        {
          src: "//file.tvsou.com/f/6a17179d8b9e/zm48-24",
          name: "江苏卫视-JSTV-1",
          label: "江苏电视台"
        },
        {
          src: "//file.tvsou.com/f/7c49f93770c7/zm48-24",
          name: "北京卫视-BTV-1",
          label: "北京电视台"
        },
        {
          src: "//file.tvsou.com/f/e8db5604b4b2/zm48-24",
          name: "湖南卫视-HNTV-1",
          label: "湖南电视台"
        },
        {
          src: "//file.tvsou.com/f/5d3353db8da3/zm48-24",
          name: "综合频道-CCTV-1",
          label: "中央电视台"
        },
        {
          src: "//file.tvsou.com/f/236494475564/zm48-24",
          name: "电视剧频道-CCTV-8",
          label: "中央电视台"
        },
        {
          src: "//file.tvsou.com/f/022aa758edae/zm48-24",
          name: "纪录片频道-CCTV-9",
          label: "中央电视台"
        }
      ],
      channeltv: null
    }
  },
  components: {},
  created() {
    // 调用方法获取对应数据
    this.getchannelcate(), this.getlookup()
    this.getallprogram()
  },
  methods: {
    ...mapActions(["saveallpro"]),
    // 获取频道分类
    async getchannelcate() {
      const { data: res } = await request2("/TVTime/Query", {
        key: "aceed97ba96e4eed9b7b12a5574ec2f1"
      })
      if (res.error_code === 0) {
        this.channelcate = res.result
      }
    },
    // 获取对应分类数据
    async getlookup() {
      const { data: res } = await request2("/TVTime/LookUp", {
        key: "aceed97ba96e4eed9b7b12a5574ec2f1",
        pId: this.pid
      })
      this.channel = res.result
      this.cName = res.result[0].rel
      this.getchanneltime()
    },
    // 获取节目预告消息
    async getchanneltime() {
      const { data: res } = await request2("/TVTime/TVlist", {
        key: "aceed97ba96e4eed9b7b12a5574ec2f1",
        code: this.cName
      })
      // 获取当前节目日期
      this.date = res.result[0].time.split(" ")[0]
      res.result.forEach(item => {
        item.time = item.time.split(" ")[1]
      })

      this.TVtimes = res.result
    },
    // 分类点击事件
    async changecate(index, pid) {
      this.cateactive = index
      this.pid = pid
      this.liactive = 0
      this.getlookup()
    },
    // 获取频道
    async changetime(index, cName) {
      this.liactive = index
      this.cName = cName
      this.getchanneltime()
    },
    // 获取节目数据
    async getallprogram() {
      await this.saveallpro()
      this.channeltv = this.Allprogram.slice(0, 10)
    },
    // 跳转到详情页
    async goplay(id, hot, title) {
      const { data: res } = await this.$http.put("/home/program/hot", {
        id,
        hot
      })
      if (res.code !== 1)
        return this.$message.error("服务器出错，请稍后再试！！")

      this.$router.push({ path: "/detail", query: { id, title } })
    }
  },
  computed: {
    ...mapState(["Allprogram"])
  }
}
</script>
<!-- Add "scoped " attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chancate {
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 20px;
  justify-content: space-between;
  .activeC {
    background: #409eff;
    color: #ffffff;
  }
  span {
    display: inline-block;
    padding: 0 20px;
    cursor: pointer;
  }
}
.channel {
  display: flex;
  .channel-list {
    .chan-title {
      font-size: 18px;
      padding: 10px 0 15px 15px;
    }
    ul {
      line-height: 35px;
      font-size: 15px;
      list-style: none;
      background: rgb(217, 236, 255);
      .liacrive {
        border-left: 2px solid #409eff;
        background: #ffffff;
      }
      li {
        padding: 0 15px;
        border-left: 2px solid rgb(217, 236, 255);
        border-bottom: 1px solid #ffffff;
        cursor: pointer;
      }
    }
  }
  .channel-time {
    padding-left: 15px;
    .tvtime {
      padding: 10px 0 15px;
      font-size: 14px;
      span {
        font-size: 18px;
      }
    }
  }
}
.main {
  display: flex;
  justify-content: space-between;
}
// 右边
.chan-right {
  width: 380px;
  // 热门频道区域
  .clearfix {
    margin-bottom: 20px;
    .hot-title {
      line-height: 42px;
      border-bottom: solid #409eff 2px;
      color: #409eff;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      span {
        font-size: 14px;
        color: #999;
      }
    }
    .channel-hot {
      line-height: 50px;
      font-size: 14px;
      padding-right: 8px;
      cursor: pointer;
      span {
        img {
          display: inline;
          vertical-align: middle;
          padding: 0 8px;
        }
        label {
          display: inline-block;
          margin-left: 8px;
          cursor: pointer;
        }
      }
    }
    .channel-hot:hover {
      background: #f7fafd;
    }
    .channel-hot:hover span {
      color: #409eff;
    }
    .channel-list {
      float: right;
      color: #999;
    }
    // 热门电视剧区域
    .ptvseries {
      padding: 0 8px 0 10px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      span {
        display: flex;
        align-items: center;
        .channel-tag {
          font-size: 14px;
          color: #999;
          width: 18px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          background: #fff;
          border-radius: 2px;
          display: inline-block;
        }
        .channel-tag-active {
          background: #409eff;
          color: #ffffff;
        }
        .tvname {
          display: inline-block;
          margin-left: 18px;
          font-size: 14px;
          width: 163px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s linear;
        }
      }
      label {
        font-size: 13px;
        line-height: 18px;
      }
    }
    .ptvseries:hover .tvname {
      color: #1890ff;
    }
  }
}
.TVtimes {
  width: 600px;
  display: flex;
  justify-content: space-between;
  padding: 8px 20px;
  align-items: center;
  font: 14px/1.5em Tahoma, Helvetica, Arial, microsoft yahei, simsun;
  .time {
    display: inline-block;
  }
  .pName {
    display: inline-block;
  }
}
</style>