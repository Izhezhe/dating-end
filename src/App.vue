<template>
  <div id="app">
    <!--登入动画-->
    <router-view></router-view>
  </div>
</template>

<script>
// import 'vue-transition.css'
export default{
  name: 'App'
}
</script>

<style>
  .app-container {
    margin: 10px;
    padding: 10px;
    min-height: 100%;
    background-color: #fff;
    box-sizing: border-box;
  }
  .app-container .wrapper {
    height: 100%;
  }
</style>

