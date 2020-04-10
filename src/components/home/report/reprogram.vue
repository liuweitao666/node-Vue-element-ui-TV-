<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>节目报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="play"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="quantity"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from "echarts";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      // 电影节目数量
      programnum: [],
      // 电影收藏数量
      Favoritenum: [],
      // 节目播放数
      playnum: []
    };
  },
  created() {},
  methods: {
    ...mapActions(["getlist"]),
    async getprograms() {
      // 获取电影数量和收藏数播放数
      const { data: res } = await this.getlist({ title: "pmovie", name: "" });
      let movienum = res.data.length;
      console.log(res.data);
      let Favoritem = 0;
      let playm = 0;
      res.data.forEach(item => {
        Favoritem = Favoritem + item.Favorite;
        playm = playm + item.hot;
      });
      console.log(Favoritem);
      //  console.log(Favoritem,playm)
      //  获取电视剧的数量和收藏数
      const { data: res1 } = await this.getlist({
        title: "ptvseries",
        name: ""
      });
      let tvseries = res1.data.length;
      let Favoriteptv = 0;
      let playtv = 0;
      res1.data.forEach(item => {
        Favoriteptv = Favoriteptv + item.Favorite;
        playtv = playtv + item.hot;
      });
      // 获取综艺数量的收藏数
      const { data: res2 } = await this.getlist({
        title: "pvariety",
        name: ""
      });
      let variety = res2.data.length;
      let pvariety = 0;
      let playpv = 0;
      res2.data.forEach(item => {
        pvariety = pvariety + item.Favorite;
        playpv = playpv + item.hot;
      });
      //  获取动画数量和收藏数
      const { data: res3 } = await this.getlist({ title: "pfunny", name: "" });
      let funny = res3.data.length;
      let pfunny = 0;
      let playfun = 0;
      res3.data.forEach(item => {
        pfunny = pfunny + item.Favorite;
        playfun = playfun + item.hot;
      });

      //  保存节目数量
      this.programnum.push(movienum, tvseries, variety, funny);
      // 保存节目收藏数
      this.Favoritenum.push(Favoritem, Favoriteptv, pvariety, pfunny);
      // 保存播放数量
      this.playnum.push(playm, playtv, playpv, playfun);
      // console.log(this.programnum,this.Favoritenum,this.playnum)
    }
  },
  async mounted() {
    // 节目数量图表
    await this.getprograms();

    let quantity = echarts.init(document.getElementById("quantity"));
    let optionquantity = {
      title: {
        text: "节目数"
      },
      tooltip: {},
      legend: {
        data: ["数量", "用户收藏"]
      },
      xAxis: {
        data: [
          "电影",
          "电视剧",
          "综艺",
          "动画",
          "脱口秀",
          "相声",
          "小品",
          "周星驰"
        ]
      },
      yAxis: {},
      series: [
        {
          name: "数量",
          type: "bar",
          data: [5, 10, 8, 7],
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
            color: "#227BFF"
          }
        },
        {
          name: "用户收藏",
          type: "bar",
          data: [5, 12, 6, 9],
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0],
            color: "#FCB24B"
          }
        }
      ]
    };

    optionquantity.series[0].data.unshift(...this.programnum);
    optionquantity.series[1].data.unshift(...this.Favoritenum);
    console.log(optionquantity.series[0].data);
    quantity.setOption(optionquantity);

    // 节目播放图表
    let play = echarts.init(document.getElementById("play"));
    let option = {
      title: {
        text: "节目播放统计"
      },
      xAxis: {
        type: "category",
        data: [
          "电影",
          "电视剧",
          "综艺",
          "动画",
          "脱口秀",
          "相声",
          "小品",
          "周星驰"
        ]
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [30, 20, 100, 123],
          type: "line",
          smooth: true,
          itemStyle: {
            color: "#489CF7"
          }
        }
      ]
    };

    option.series[0].data.unshift(...this.playnum);
    console.log(optionquantity.series[0].data);
    play.setOption(option);
  }
};
</script>
<style scoped>
#play {
  width: 600px;
  height: 400px;
}
#quantity {
  width: 600px;
  height: 400px;
}
</style>