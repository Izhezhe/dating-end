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
      <el-col :span="18">
        <el-button @click="handleAdd('operForm')">新增</el-button>
        <el-table ref="multipleTable" :data="tableData" :loading="loading" border tooltip-effect="dark">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜单名称">
          </el-table-column>
          <el-table-column
            prop="pageUrl"
            label="页面路径">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="图标">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 新增、编辑 -->
    <el-dialog :title="operTitle" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" label-width="100px">
        <el-form-item label="上级菜单" prop="parentId">
          <el-input v-model="operData.parentId"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="operData.name"></el-input>
        </el-form-item>
        <el-form-item label="页面路径" prop="pageUrl">
          <el-input v-model="operData.pageUrl"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input v-model="operData.sort"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="operData.icon"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="operData.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operVisible = false">取 消</el-button>
        <el-button type="primary" v-if="operType == 'add'" @click="operSave()">确 定</el-button>
        <el-button type="primary" v-if="operType == 'edit'" @click="operUpload()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getMenu } from '@/api/login'
import { getMenuList, menuSava, menuUpload, menuDelete } from '@/api/system'
export default {
  name: 'menu-manager',
  data() {
    return {
      // 菜单树
      filterText: '',
      menuTree: [],
      defaultProps: {
        children: 'childrens',
        label: 'name',
        id: 'id'
      },

      // 子级菜单
      loading: false,
      permissionId: '4028c6396bff97a2016bff9900000000',
      tableData: [],

      // 新增、编辑
      operVisible: false,
      operType: 'add',
      operTitle: '新增菜单',
      operData: {
        parentId: '', // 父id
        name: '', // 菜单名称
        pageUrl: '', // 访问路径
        icon: '', // icon
        sort: '', // 排序
        remark: '', // 备注
      }

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
      this.loading = true
      getMenuList({id: this.permissionId}).then(res => {
        this.loading = false
        this.tableData = res.datas
      })
    },
    filterNode(value, data) {
      if(!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.permissionId = data.id
      this.getList();
    },

    // 新增菜单
    handleAdd(formName) {
      this.operVisible = true
      this.operType = 'add'
      this.operTitle = '新增菜单'
      this.$refs[formName].resetFields();
    },
    operSave() {
      menuSava(this.operData).then(res => {
        this.$message({
          message: res.repMsg,
          type: 'success'
        })
        this.operVisible = false
        this.getMenuTree()
        this.getList()
      })
    },
    // 编辑菜单
    handleEdit(row) {
      this.operVisible = true
      this.operType = 'edit'
      this.operTitle = '编辑菜单'
      this.operData = row
    },
    operUpload() {
      menuUpload(this.operData).then(res => {
        this.$message({
          message: res.repMsg,
          type: 'success'
        })
        this.operVisible = false
        this.getMenuTree()
        this.getList()
      })
    },
    // 删除菜单
    handleDelete(id) {
      this.$confirm('确定删除？').then(() => {
        menuDelete({id: id}).then(res => {
          this.$message({
            message: res.repMsg,
            type: 'success'
          })
          this.getMenuTree()
          this.getList()
        })
      })
    },
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree1.filter(val);
    // }
  },
}
</script>

<style lang="scss" scoped>
  .menu-tree {
    margin-right: 20px;
  }
</style>