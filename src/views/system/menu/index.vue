<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5" class="menu-tree">
        <el-tree
          node-key="id"
          :default-expanded-keys="['4028c6396bff97a2016bff9900000000']" 
          highlight-current
          :data="menuTree"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          ref="tree1"></el-tree>
      </el-col>
      <!-- <el-col :span="18">
				<div style="margin-bottom: 10px;">
					<el-row :gutter="10">
						<el-col :span="10">
							<el-input placeholder="请输入菜单名称" v-model="listQuery.name" size='small' clearable>
								<template slot="prepend">菜单</template>
							</el-input>
						</el-col>
						<el-col :span="7">
							<el-button @click="perSearch" type="primary" size="small">查询
							</el-button>
						</el-col>
						<el-col :span="7">
							<div style="float: right;">
								<el-button style="margin: 0;" size="small" @click="handleCreate">添加</el-button>
							</div>
							<div style="clear: both;"></div>
						</el-col>
					</el-row>
				</div>
				<el-table id="mr-table" :key='tableKey' size="mini" align="center" :data="list.content" border stripe fit highlight-current-row @selection-change="setSelection" style="width: 100%">
					<el-table-column type="selection" width="55" label="全选" align="center"></el-table-column>
					<el-table-column type="index" label="序号" width="65" align="center">
						<template scope="scope">
							<span>{{scope.row.SORT}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" :show-overflow-tooltip="true" label="权限名称">
						<template scope="scope">
							<span>{{scope.row.NAME}}</span>
						</template>
					</el-table-column>

					<el-table-column label="页面名称" :show-overflow-tooltip="true" align="center" min-width="200">
						<template scope="scope">
							<span>{{scope.row.PAGE_URL}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" label="图标">
						<template scope="scope">
							<span>{{scope.row.MENU_ICON}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" :show-overflow-tooltip="true" label="备注">
						<template scope="scope">
							<span>{{scope.row.REMARK}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template scope="scope">
							<p id="p_icon">
								<i class="el-icon-view" title="查看" @click="handleDetail(scope.row)"></i>
								<i class="el-icon-edit" title="编辑" @click="handleUpdate(scope.row)"></i>
								<i class="el-icon-delete" title="删除" @click="deleteCurrent(scope.row)"></i>
							</p>
						</template>
					</el-table-column>

				</el-table>
			</el-col> -->
    </el-row>

  </div>
</template>

<script>
import { getMenu } from '@/api/login'
export default {
  name: 'menu-manager',
  data() {
    return {
      filterText: '',
      menuTree: [],
      defaultProps: {
        children: 'childrens',
        label: 'name',
        id: 'id'
      },
      listQuery: {
        page: 1,
        rows: 20,
        permissionId: '4028c6396bff97a2016bff9900000000',
        name: ''
      },
    }
  },
  created() {
    this.getMenuTree()
    this.getList()
  },
  methods: {
    getMenuTree() {
      this.menuTree = [];
      getMenu().then(res => {
        this.menuTree.push(res.datas)
      })
    },
    getList() {
      // getMenuList(this.listQuery).then(res => {

      // })
    },
    filterNode(value, data) {
      if(!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      // this.listQuery.permissionId = data.id
      this.getList();
    },
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree1.filter(val);
    // }
  },
}
</script>