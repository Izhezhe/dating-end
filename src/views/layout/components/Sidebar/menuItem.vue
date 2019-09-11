<template>
	<el-menu-item :index="menu.pageUrl">
		<i v-if="menu.menuIcon" :class="`${menu.menuIcon}`"></i>
    <i v-else-if="menu.iconSvg">
      <icon :name="menu.iconSvg"></icon>
    </i>
    <i v-else class="el-icon-menu"></i>
		<span slot="title">{{menu.name || '未命名菜单'}}</span>
	</el-menu-item>
</template>

<script>
	// import { uniqueId } from 'lodash'
	export default {
		name: 'zz-menu-item',
		props: {
			menu: {
				type: Object,
				required: false,
				default: () => {}
			}
		},
		data() {
			return {
				// uniqueId: uniqueId('d2-menu-empty-')
			}
		}
	}
</script>