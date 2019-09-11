<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <logo :isCollapse="isCollapse"></logo>
    <el-menu
      mode="vertical"
      :collapse="isCollapse"
      :default-active="active"
      ref="menu"
      @select="handleMenuSelect">
      <template v-for="(menu, menuIndex) in menu_routers">
        <zz-menu-item v-if="menu.childrens === null" :menu="menu" :key="menuIndex"/>
        <zz-menu-sub v-else :menu="menu" :key="menuIndex"/>
      </template>
    </el-menu>
    <div v-if="menu_routers.length === 0 && !isCollapse" class="sidebar-menu-empty">
      <!-- <d2-icon name="inbox"/> -->
      <span>没有侧栏菜单</span>
    </div>
  </el-scrollbar>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { getMenu } from '@/api/login'
import SidebarItem from './SidebarItem'
import zzMenuItem from './menuItem'
import zzMenuSub from './menuSub'
import logo from './logo'

export default {
  name: 'sidebar',
  data() {
    return {
      active: '',
      routers: [],
      test: '',
    }
  },
  components: { 
    SidebarItem, 
    logo,
    zzMenuItem,
    zzMenuSub
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
  },
  methods: {
    handleMenuSelect (index, indexPath) {
      // if (/^d2-menu-empty-\d+$/.test(index)) {
      //   this.$message.warning('临时菜单')
      // } else if (/^https:\/\/|http:\/\//.test(index)) {
      //   util.open(index)
      // } else {
        this.$router.push({
          path: index
        })
      // }
    }
  },
  watch: {
    // 监听路由 控制侧边栏激活状态
    '$route.matched': {
      handler (val) {
        this.active = val[val.length - 1].path
        this.$nextTick(() => {
          if (this.menu_routers.length > 0) {
            this.$refs.menu.activeIndex = this.active
          }
        })
      },
      immediate: true
    },
  }
}
</script>
