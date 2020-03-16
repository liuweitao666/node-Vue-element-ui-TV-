<template>
  <!-- 首页轮播图组件 -->
  <div>
    <!--容器 -->
    <div class="container" @mouseover="cleartime" @mouseleave="starttime">
      <!-- 图片区域 -->
      <div class="block" ref="lunbo">
        <img
          :src="'http://127.0.0.1:3000'+item.banner"
          :alt="item.title"
          v-for="(item,index) in piclist"
          :key="item.title"
          :class="{'active':index===selected && act===true,'block-act':index===selected}"
          @click="goplay(item._id,item.path)"
        />
      </div>
      <!-- 文字区域 -->
      <ul class="side">
        <li
          :class="['side-item',{'li-selected':index ===selected}]"
          v-for="(item,index) in piclist"
          :key="index"
          @mouseover="changeClass(index)"
          @click="goplay(item._id,item.path)"
        >
          <!-- 选中之后跟之前的样式切换 -->
          <span :class="[{'side-item-title selected':index ===selected}]">{{item.title.slice(0,5)}}</span>
          <span v-if="!(index ===selected)">：</span>
          <span
            :class="[{'side-item-bio selected':index ===selected},'side-span']"
          >{{item.subtitle}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: 0,
      timer: null,
      act: true
    }
  },
  props: {
    piclist: {
      type: Array,
      defaults: []
    }
  },
  created() {
    // console.log(this.piclist);
  },
  mounted() {
    this.lunbo()
  },
  methods: {
    //   改变li的样式
    changeClass(index) {
      //   console.log(index);
      this.selected = index
    },
    // 轮播动画的方法
    lunbo() {
      this.timer = setInterval(() => {
        this.selected++
        if (this.selected === this.piclist.length) {
          this.selected = 0
        }
      }, 4000)
    },
    // 鼠标移入清除定时器
    cleartime() {
      clearInterval(this.timer)
      this.act = false
    },
    // 鼠标移出启动定时器
    starttime() {
      this.lunbo()
      setTimeout(() => {
        this.act = true
      }, 4000)
    },
    // 跳转到播放页面
    goplay(id, title) {
      console.log(id, title)
      this.$router.push({ path: "/detail", query: { id, title } })
    }
  }
}
</script>
<style scoped>
.container {
  height: 456px;
  position: relative;
  margin-top: 10px;
}
/* header部分 */
/* 轮播图 */
.block {
  height: 456px;
  overflow: hidden;
}
.block img {
  width: 100%;
  height: 100%;
  display: none;
  cursor: pointer;
}
.block-act {
  display: block !important;
}
.block .active {
  animation: transimg 4s ease;
}
/* ul 选择框 */
.side {
  width: 276px;
  position: absolute;
  list-style: none;
  padding: 14px 0 12px;
  right: 120px;
  top: 0;
  height: 430px;
  background: rgba(0, 0, 0, 0.5);
}
/* li样式 */
.side .side-item {
  padding: 9px 20px;
  color: #ffffff;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.side .side-item .selected {
  display: block;
  width: 100%;
}
.side-item-title {
  color: #00be06;
  font-size: 24px;
  margin-bottom: 10px;
  height: 32px;
  animation: extra ease 0.3s;
  -moz-animation: extra 0.3s; /* Firefox */
  -webkit-animation: extra 0.3s; /* Safari 和 Chrome */
  -o-animation: extra 0.3s;
}
.side-item-bio {
  color: #00be06;
  display: block;
}
/* 鼠标经过样式 */
.li-selected {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
  background: -webkit-linear-gradient(
    to right,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
  height: 62.8px;
  background: -moz-linear-gradient(
    to right,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
}
/* 动画 */
@keyframes extra {
  0% {
    font-size: 14px;
  }
  100% {
    font: 24px;
  }
}
@keyframes transimg {
  0% {
    transform: translateY(100%);
  }
  20% {
    transform: translateY(0);
  }
  90% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
</style>