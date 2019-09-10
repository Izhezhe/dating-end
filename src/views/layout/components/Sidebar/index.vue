<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <logo :isCollapse="isCollapse"></logo>
    <!-- <el-menu
      mode="vertical"
      router
      :show-timeout="200"
      :default-active="defaultActive"
      :collapse="isCollapse"
      background-color="#294d73"
      text-color="#fff"
      active-text-color="#00b4ff"
    >
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu> -->
    <el-menu
      mode="vertical"
      :collapse="isCollapse"
      :default-active="defaultActive"
      ref="menu"
      @select="handleMenuSelect">
      <template v-for="(menu, menuIndex) in menu_routers">
        <zz-menu-item v-if="menu.childrens.length === 0" :menu="menu" :key="menuIndex"/>
        <zz-menu-sub v-else :menu="menu" :key="menuIndex"/>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenu } from '@/api/login'
import SidebarItem from './SidebarItem'
import logo from './logo'
export default {
  data() {
    return {
      routers: []
    }
  },
  components: { 
    SidebarItem, 
    logo,
    'zz-menu-item': () => import('./menuItem'),
    'zz-menu-sub': () => import('./menuSub')
  },
  created() {
    this.getMenu();
    console.log(this.menu_routers)
    // getMenu().then(response => {
    //   const data = response.datas
    //   this.$store.commit('SET_ROUTERS', data.childrens)
    //   this.routers = data.childrens
    // })
  },
  computed: {
    ...mapGetters([
      'roles',
      'sidebar',
      'menu_routers'
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
  },
  methods: {
    getMenu() {
      this.$store.dispatch('GenerateRoutes')
    }
  }
}
</script>
