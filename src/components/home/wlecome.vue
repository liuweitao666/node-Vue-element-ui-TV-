<template>
  <div>
    <!-- 首页主题部分 -->
    <el-card class="new-col">
      <h4>最新节目</h4>
      <!-- 首页轮播图组件 -->
      <piclist :piclist="picimg" />
    </el-card>
  </div>
</template>
<script>
import piclist from "./piclist";
export default {
  components: {
    piclist
  },
  data() {
    return {
      picimg: []
    };
  },
  created() {
    this.getallprogram();
  },
  methods: {
    async getallprogram() {
      const { data: res } = await this.$http.get("/home/program");
      // 添加首页的数据
      let movie = res.data[0].data.reverse().slice(0, 3);
      movie.forEach(item => {
        item.path = res.data[0].title;
      });
      let tv = res.data[1].data.reverse().slice(0, 2);
      tv.forEach(item => {
        item.path = res.data[1].title;
      });
      let zy = res.data[2].data.reverse().slice(0, 2);
      zy.forEach(item => {
        item.path = res.data[2].title;
      });
      let dh = res.data[3].data.reverse().slice(0, 4);
      dh.forEach(item => {
        item.path = res.data[3].title;
      });
      this.picimg.push(...movie, ...tv, ...zy, ...dh);
    }
  }
};
</script>
<style scoped>
.new-col {
  display: flex;
  flex-direction: column;
}
.carousel {
  margin-top: 10px;
}
.carousel img {
  width: 100%;
  height: 100%;
}
</style>