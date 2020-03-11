<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="9">
        <el-card class="userreport">
          <div id="user"></div>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card>
          <div class="ratio">
            <div id="detail"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import { finddata } from "@/common/crod/index";
import echarts from "echarts";
// 引入饼图。
import "echarts/src/chart/pie";

// 基于准备好的dom，初始化echarts实例

export default {
  data() {
    return {
      // 北京地区用户
      Bj: [],
      // 湖南地区用户
      Hn: [],
      // 上海地区用户
      Sh: [],
      // 广东
      Gd: [],
      // 其他用户
      Other: [],
      // 北京地区详情
      Bdetail: [0, 0, 0, 0],
      // 湖南地区详情
      Hdetail: [0, 0, 0, 0],
      // 上海地区详情
      Sdetail: [0, 0, 0, 0],
      // 广东地区详情
      Gdetail: [0, 0, 0, 0],
      // 其他地区详情
      Odetail: [0, 0, 0, 0]
    };
  },
  created() {
    
  },
  methods: {
    // 获取用户数据
    async getusers() {
      const { data: res } = await this.$http.get("/home/users", {
        params: { type: "total" }
      });
      // 对数据拆解赋值
      if (res.code !== 1) return this.$message.error(res.msg);
      // 正则表达式，匹配其他地区的用户
      const reg = /^((?![北京|湖南|上海|广东]).)*$/;

      // 对不同地区的用户进行筛选
      this.Bj = res.data.filter(item => {
        return item.region === "北京";
      });
      this.Hn = res.data.filter(item => {
        return item.region === "湖南";
      });
      this.Sh = res.data.filter(item => {
        return item.region === "上海";
      });
      this.Gd = res.data.filter(item => {
        return item.region === "广东";
      });
      this.Other = res.data.filter(item => {
        return reg.test(item.region);
      });
      // 对不同地区的用户进行细分
      // 北京
      this.Bj.forEach(item => {
        let bir = new Date(item.birthday);
        let year = bir.getFullYear();
        let nowtime = new Date();
        let nowyear = nowtime.getFullYear();
        if (item.gender === 1) {
          this.Bdetail[0]++;
        }
        if (item.gender === 0) {
          this.Bdetail[1]++;
        }
        if (parseInt(nowyear) - parseInt(year) < 18) {
          this.Bdetail[2]++;
        }
        if (parseInt(nowyear) - parseInt(year) > 18) {
          this.Bdetail[3]++;
        }
      });
      // 湖南
      this.Hn.forEach(item => {
        let bir = new Date(item.birthday);
        let year = bir.getFullYear();
        let nowtime = new Date();
        let nowyear = nowtime.getFullYear();
        // console.log(item)
        if (item.gender === 1) {
          this.Hdetail[0]++;
        }
        if (item.gender === 0) {
          this.Hdetail[1]++;
        }
        if (parseInt(nowyear) - parseInt(year) < 18) {
          this.Hdetail[2]++;
        }
        if (parseInt(nowyear) - parseInt(year) > 18) {
          this.Hdetail[3]++;
        }
      });
      // 上海
      this.Sh.forEach(item => {
        let bir = new Date(item.birthday);
        let year = bir.getFullYear();
        let nowtime = new Date();
        let nowyear = nowtime.getFullYear();
        if (item.gender === 1) {
          this.Sdetail[0]++;
        }
        if (item.gender === 0) {
          this.Sdetail[1]++;
        }
        if (parseInt(nowyear) - parseInt(year) < 18) {
          this.Sdetail[2]++;
        }
        if (parseInt(nowyear) - parseInt(year) > 18) {
          this.Sdetail[3]++;
        }
      });
      // 广东
      this.Gd.forEach(item => {
        let bir = new Date(item.birthday);
        let year = bir.getFullYear();
        let nowtime = new Date();
        let nowyear = nowtime.getFullYear();
        if (item.gender === 1) {
          this.Gdetail[0]++;
        }
        if (item.gender === 0) {
          this.Gdetail[1]++;
        }
        if (parseInt(nowyear) - parseInt(year) < 18) {
          this.Gdetail[2]++;
        }
        if (parseInt(nowyear) - parseInt(year) > 18) {
          this.Gdetail[3]++;
        }
      });
      // 其他地区
      this.Other.forEach(item => {
        let bir = new Date(item.birthday);
        let year = bir.getFullYear();
        let nowtime = new Date();
        let nowyear = nowtime.getFullYear();
        if (item.gender === 1) {
          this.Odetail[0]++;
        }
        if (item.gender === 0) {
          this.Odetail[1]++;
        }
        if (parseInt(nowyear) - parseInt(year) < 18) {
          this.Odetail[2]++;
        }
        if (parseInt(nowyear) - parseInt(year) > 18) {
          this.Odetail[3]++;
        }
      });
    }
  },
  async mounted() {
    await this.getusers();
    var area = echarts.init(document.getElementById("user"));
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "用户地区分布",
        left: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["北京", "上海", "广东", "湖南", "其他"]
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
      // console.log(this.Bj, this.Hn, this.Sh, this.Other);
      option.series[0].data.push(
        { value: this.Bj.length, name: "北京" },
        { value: this.Sh.length, name: "上海" },
        { value: this.Gd.length, name: "广东" },
        { value: this.Hn.length, name: "湖南" },
        { value: this.Other.length, name: "其他" }
      );
      area.setOption(option);

    // 详情图表
    let detail = echarts.init(document.getElementById("detail"));
    let option2 = {
      title: {
        text: "用户详细图表分析"
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
      legend: {
        data: ["男", "女", "少年", "成人"]
      },

      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["北京","湖南", "上海", "广东",  "其他"]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "男",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: []
        },
        {
          name: "女",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: []
        },
        {
          name: "少年",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: []
        },
        {
          name: "成人",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: []
        }
      ]
    };
  
      // 设置用用户详情图表
      // console.log(option2)
      option2.series[0].data.push(this.Bdetail[0],this.Hdetail[0],this.Sdetail[0],this.Gdetail[0],this.Odetail[0])
      option2.series[1].data.push(this.Bdetail[1],this.Hdetail[1],this.Sdetail[1],this.Gdetail[1],this.Odetail[1])
      option2.series[2].data.push(this.Bdetail[2],this.Hdetail[2],this.Sdetail[2],this.Gdetail[2],this.Odetail[2])
      option2.series[3].data.push(this.Bdetail[3],this.Hdetail[3],this.Sdetail[3],this.Gdetail[3],this.Odetail[3])
      detail.setOption(option2);

  }
};
</script>
<style scoped>
#user {
  width: 450px;
  height: 350px;
}
#gender {
  width: 200px;
  height: 150px;
}
.userreport {
  display: flex;
  justify-content: center;
}
#detail {
  width: 780px;
  height: 350px;
}
</style>