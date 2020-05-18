<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import store from "./store/index"
export default {
  store,
  name: "App",
  components: {},
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  created() {},
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
@import "assets/css/style.css";
.v-enter {
  opacity: 0;
}
.v-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
</style>
