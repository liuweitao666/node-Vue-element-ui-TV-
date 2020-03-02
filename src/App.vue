<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

import store from './store/index'
export default {
  store,
  name: 'App',
  components: {

  },
  data(){
    return {

    }
  },
  created(){
    
  }
}
</script>

<style>
@import 'assets/css/style.css';
</style>
