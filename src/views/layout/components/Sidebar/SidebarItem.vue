<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      
      <el-menu-item :index="item.path" :key="item.children[0].name" v-if="hasOneShowingChildren(item, item.children) && !item.children[0].children">
        <template v-if="item.select">
          <icon v-if="item.meta.icon" :name="item.meta.icon"></icon>
          <span slot="title">{{ item.meta.title }}</span>
        </template>
        <template v-else>
          <icon v-if="item.children[0].meta.icon" :name="item.children[0].meta.icon"></icon>
          <span slot="title">{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>

      <el-submenu v-else :index="item.path" :key="item.name">
        <template slot="title">
          <icon v-if="item.meta.icon" :name="item.meta.icon"></icon>
          <span slot="title">{{ item.meta.title }}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <el-menu-item v-else :index="item.path+'/'+child.path" :key="child.name">
            <icon v-if="child.meta.icon" :name="child.meta.icon"></icon>
            <span slot="title">{{ child.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
// import { generateTitle } from '@/utils/i18n'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // generateTitle,
    hasOneShowingChildren(item, children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      if (item.select) {
        return true
      }
      return false
    }
  }
}
</script>
