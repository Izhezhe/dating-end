<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <logo :isCollapse="isCollapse"></logo>
    <el-menu
      mode="vertical"
      router
      :show-timeout="200"
      :default-active="defaultActive"
      :collapse="isCollapse"
      background-color="#294d73"
      text-color="#fff"
      active-text-color="#00b4ff"
    >
      <!-- :unique-opened="true" -->
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import logo from './logo'
export default {
  components: { SidebarItem, logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routers'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    defaultActive() {
      let route = this.$route.path
      let arr = route.split('/')
      // console.log(arr)
      route = '/' + arr[1]
      return route
    }
  }
}
</script>
