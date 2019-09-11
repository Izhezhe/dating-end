<template>
  <el-submenu :index="menu.path">
    <template slot="title">
      <i v-if="menu.menuIcon" :class="`${menu.menuIcon}`"></i>
      <i v-else-if="menu.iconSvg">
        <icon :name="menu.iconSvg"></icon>
      </i>
      <i v-else class="el-icon-menu"></i>
      <span slot="title">{{menu.name}}</span>
    </template>
    <template v-for="(child, childIndex) in menu.childrens">
      <zz-menu-item v-if="child.childrens === null" :menu="child" :key="childIndex"/>
      <zz-menu-sub v-else :menu="child" :key="childIndex"/>
    </template>
  </el-submenu>
</template>

<script>
// import { uniqueId } from 'lodash'

export default {
  name: 'zz-menu-sub',
  data () {
    return {
      // uniqueId: uniqueId('d2-menu-empty-')
    }
  },
  props: {
    menu: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  components: {
    'zz-menu-item': () => import('./menuItem')
  },
}
</script>
