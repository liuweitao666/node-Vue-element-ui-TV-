<template>
  <div class="block">
    <div class="history">
      <div>
        <i class="el-icon-pie-chart"></i>
        <span>观看历史</span>
      </div>
      <div class="delall" @click="delall">
        <i class="el-icon-close"></i>
        <span>清空历史</span>
      </div>
    </div>
    <div class="program-list" v-if="programs.length>0">
      <div
        :class="['program',{'hidelist':hidelist===index}]"
        v-for="(item,index) in programs"
        :key="index"
      >
        <div class="imgccover" @click="goplay(item._id,item.path)">
          <img :src="'http://127.0.0.1:3000'+item.cover" :alt="item.title" class="proimg" />
          <!-- <div class="hidearea">
            <span>导演：{{item.director}}</span>
            <span>主演：{{item.star}}</span>
          </div>-->
          <el-tag
            effect="dark"
            :type="index>2?'':'success'"
            class="tag-new"
            size="mini"
          >{{index===0?'最新':'HD'}}</el-tag>
          <div class="rtop">
            <img
              src="@/assets/image/close.png"
              alt
              style
              @click.stop="remove(item._id,index)"
              class="close-img"
            />
          </div>
        </div>
        <span class="list-span">
          <el-tag effect="dark" :type="index>2?'':'danger'" class="tag" size="mini">{{index+1}}</el-tag>
          {{item.title}}
        </span>
      </div>
    </div>
    <div class="seen" v-else>{{this.status?'尊贵的管理员，您可以享受VIP免费服务！':'暂无观看记录'}}</div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import { deleted } from "@/common/crod/index"
export default {
  data() {
    return {
      // 动画效果
      hidelist: -1,
      none: false,
      programs: null
    }
  },
  created() {
    // 获取历史记录
    this.programs = this.pro
  },
  props: {
    pro: {
      type: Array,
      defaults: []
    },
    id: {
      type: String
    }
  },
  methods: {
    // 删除记录
    async remove(id, index) {
      const { data: res } = await this.$http.delete("/home/rehistory", {
        params: { _id: id, id: this.id }
      })
      if (res.code === 1) {
        this.hidelist = index
        let i = index
        setTimeout(() => {
          this.programs = this.programs.filter((item, index) => {
            return index !== i
          })
        }, 1000)
      }
    },
    // 跳转到详情页
    goplay(id, title) {
      this.$router.push({ path: "/detail", query: { id, title } })
    },
    // 清空历史
    async delall() {
      console.log(this.programs)
      if(this.programs.length===0) return this.$message.warning('当前没有还没有观看记录！')
      const code = await deleted("/home/rehistory", {
        id: this.userinfo._id,
        type: "all"
      })
      if (code === 1) {
        this.programs = []
      }
    }
  },
  computed: {
    ...mapState(["status", "userinfo"])
    // programs(){
    //   return this.pro
    // }
  }
}
</script>
<style scoped>
.block {
  padding: 15px 0;
}
.history {
  margin-bottom: 15px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.delall {
  font-weight: 500;
  font-size: 13px;
  padding-right: 20px;
  color: #999;
  cursor: pointer;
}
.history span {
  display: inline-block;
  padding-left: 5px;
}
.program-list {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  overflow: auto;
  font-size: 13px;
  margin-left: 5px;
}
.program {
  margin: 10px 10px 5px;
  cursor: pointer;
  width: 15%;
  border-radius: 5px;
  box-sizing: border-box;
  overflow: hidden;
  min-width: 187px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.program .imgccover {
  width: 100%;
  height: 275px;
  overflow: hidden;
  position: relative;
}
.program .proimg {
  width: 100%;
  height: 275px;
  max-height: 275px;
  overflow: hidden;
  transition: all 0.5s ease;
}
.program .hidearea {
  position: absolute;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  top: 0;
  transition: all 0.5s ease;
  transform: translateY(-100%);
}
/* 设置两个元素的过渡动画 */
.proimg:hover {
  transform: scale(1.1);
}
.proimg:hover ~ .hidearea {
  transform: translateY(0);
}
.program .hidearea span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
  line-height: 25px;
  text-align: left;
}
.list-span {
  display: inline-block;
  width: 120px;
  padding: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag {
  margin-right: 5px;
}
.tag-new {
  position: absolute;
  right: 0;
  bottom: 0;
}
/* 删除按钮 */
.rtop {
  position: absolute;
  right: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  color: #f56c6c;
  border-radius: 50%;
  display: flex;
  align-items: center;
}

/* 删除列表动画 */
.hidelist {
  animation: hide 1s ease;
}
/* 无history时 */
.seen {
  height: 100px;
  text-align: center;
  color: #999;
  line-height: 100px;
  font-size: 20px;
}
.close-img {
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
}
.close-img:hover {
  transform: scale(1.2);
}
@keyframes hide {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>