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
      picimg: [
        {
          img:
            "http://pic0.iqiyipic.com/common/lego/20200301/39e2b60bc05e449584c9a85b86c91845.jpg",
          title: "遇见你",
          bio: "张哲瀚章若楠感情遇险"
        },
        {
          img:
            "http://pic2.iqiyipic.com/common/lego/20200301/75c200b65519442d928bf739d40a8189.jpg",
          title: "喜剧人",
          bio: "烧饼曹鹤阳变情感主播"
        },
        {
          img:
            "http://pic1.iqiyipic.com/common/lego/20200228/53c91bbc52af4f7395caa3a5ef841f74.jpg",
          title: "两世欢",
          bio: "阿原吃错药扑倒景辞"
        },
        {
          img:
            "http://pic0.iqiyipic.com/common/lego/20200302/21a77b5aaf224a18b59486011d0abd65.jpg",
          title: "宅家点歌台",
          bio: "福克斯唱爱情买卖"
        },
        {
          img:
            "http://pic1.iqiyipic.com/common/lego/20200229/b33edb826b6f4aca9d2bf3f75db8e6fd.jpg",
          title: "王牌",
          bio: "情深深雨濛濛20年重聚"
        },
        {
          img:
            "http://pic0.iqiyipic.com/common/lego/20200224/3c019ad4926e4879af6a6768cbf55050.jpg",
          title: "完美关系 ",
          bio: "黄轩佟丽娅职场交锋"
        },
        {
          img:
            "http://pic3.iqiyipic.com/common/lego/20200302/5e339e027ecc4d96ae6faeed026b1983.jpg",
          title: "上古密约",
          bio: "吴磊宋祖儿反目"
        },
        {
          img:
            "http://pic2.iqiyipic.com/common/lego/20200301/6e58ac95898f4f5899e6dbd308c88703.jpg",
          title: "歌手",
          bio: "华晨宇魂斗罗炸裂来袭"
        },
        {
          img:
            "http://pic1.iqiyipic.com/common/lego/20200302/b630c038f0a845e6990d50341cd60587.jpg",
          title: "国家德比",
          bio: "皇马2-0完胜巴萨"
        },
        {
          img:
            "http://pic2.iqiyipic.com/common/lego/20200201/0258d62b6e4b4e5b8534fd459fe7d5f4.jpg",
          title: "肥龙过江",
          bio: "甄子丹爆笑斗黑帮"
        },
      ]
    };
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