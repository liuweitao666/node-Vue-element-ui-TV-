<template>
  <div>
    <el-dropdown @command="selectlogo" trigger="click">
      <el-input
        class="input-down"
        size="mini"
        placeholder="选择品牌"
        :suffix-icon="data?'el-icon-circle-close':'el-icon-arrow-down'"
        v-model="data"
      ></el-input>
      <div class="clear" @click.stop="clearmodel" v-if="data">

      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,index) in TVlogo" :key="index" :command="item.name">
          <img :src="item.url" alt class="tv-logo" />
          {{item.name}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 电视品牌数据
      TVlogo: [
        { name: "华为", url: require("@/assets/image/logo/华为.png") },
        { name: "康佳", url: require("@/assets/image/logo/康佳.png") },
        { name: "乐视", url: require("@/assets/image/logo/乐视.png") },
        { name: "三星", url: require("@/assets/image/logo/三星.png") },
        { name: "索尼", url: require("@/assets/image/logo/索尼.png") },
        { name: "小米", url: require("@/assets/image/logo/小米.png") },
        { name: "TCL", url: require("@/assets/image/logo/TCL.png") }
      ]
    }
  },
  props: {
    model: {
      type: String,
      defaults: ""
    }
  },
  methods: {
    //   选中品牌
    selectlogo(name) {
      // console.log(name)
      this.$emit("selectlabel", name)
    },
    clearmodel(){
      this.$emit("selectlabel", '')
    }
  },
  computed: {
    data(){
      return this.model
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown {
  width: 100px;
  position: relative;
}
.tv-logo {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}
.el-dropdown-menu__item {
  display: flex;
  align-items: center;
}
.clear{
  position: absolute;
  width: 12px;
  height: 12px;
  cursor: pointer;
  top: 50%;
  right: 12px;
  transform: translateY(-50%)
}
</style>