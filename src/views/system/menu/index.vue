<template>
  <div class="app-container">
    <el-row class="wrapper">
      <el-col :span="5" class="menu-tree">
        <!-- <div class="tree-box"> -->
          <el-tree
            node-key="id"
            :default-expanded-keys="['4028c6396bff97a2016bff9900000000']" 
            highlight-current
            :data="menuTree"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree1"></el-tree>
        <!-- </div> -->
      </el-col>
      <el-col :span="18">
        <el-row class="mb">
          <el-col>
            <div class="fr">
              <el-button size="small" type="primary" @click="handleAdd()">添加</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
          <el-table-column label="序号" prop="sort" width="70"></el-table-column>
          <el-table-column label="菜单名称" prop="name"></el-table-column>
          <el-table-column label="页面路径" prop="pageUrl"></el-table-column>
          <!-- <el-table-column label="图标" prop="icon"></el-table-column> -->
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link :underline="false" type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link :underline="false" type="primary" size="small" @click="handleDelete(scope.row.id)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 新增、编辑 -->
    <el-dialog :title="operTitle[operType]" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="100px">
        <el-form-item label="上级菜单" prop="parentId">
          <treeselect 
            @select="getPaths"
            v-model="operData.parentId"
            :options="menuTree"
            :normalizer="normalizer"
            placeholder="请选择上级"/>
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
        <!-- <el-form-item label="图标" prop="icon">
          <el-input v-model="operData.icon"></el-input>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="operData.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operVisible = false">取 消</el-button>
        <el-button type="primary" @click="operSave('operForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getMenu } from '@/api/login'
import { getMenuList, menuSava, menuUpdate, menuDelete } from '@/api/system'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'menu-manager',
  components: {
    Treeselect
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if(this.operData.parentId == '' || this.operData.parentId == null) {
        callback(new Error('请输入选择上级'));
      } else {
        callback();
      }
    };
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
      permissionId: '4028c6396bff97a2016bff9900000000',
      tableData: [],

      // 新增、编辑
      operVisible: false,
      operType: 'add',
      operTitle: {
        add: '添加菜单',
        edit: '编辑菜单'
      },
			pather: '',
      operData: {
        parentId: null, // 父id
        name: '', // 菜单名称
        path: '', // path
        pageUrl: '', // 访问路径
        icon: '', // icon
        sort: '', // 排序
        remark: '', // 备注
      },
      operRules: {
        parentId: [{ required: true, validator: validatePass,trigger: 'change' }],
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
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
      getMenuList({id: this.permissionId}).then(res => {
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

    getPaths(nodes, ids) {
      this.pather = nodes.path
    },
    normalizer(node) {
      if (node.childrens != null) {
        return {
          id: node.id,
          label: node.name,
          children: node.childrens,
        }
      } else {
        return {
          id: node.id,
          label: node.name,
          children: undefined,
        }
      }
      // console.log(node)
    },
    // 新增
    handleAdd() {
      this.operVisible = true
      this.operType = 'add'
      this.resetData()
    },
    // 编辑
    handleEdit(row) {
      this.operVisible = true
      this.operType = 'edit'
      this.operData = row
    },
    // 保存
    operSave(formName) {
      this.$refs[formName].validate((valid) => {
				if(valid) {
          if (this.operType == 'add') {
            menuSava(this.operData).then(res => {
              this.$message({
                message: res.repMsg,
                type: 'success'
              })
              this.operVisible = false
              this.getMenuTree()
              this.getList()
            })
          } else {
            menuUpdate(this.operData).then(res => {
              this.$message({
                message: res.repMsg,
                type: 'success'
              })
              this.operVisible = false
              this.getMenuTree()
              this.getList()
            })
          }
        }
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确定删除？', '提示', {type: 'warning'}).then(() => {
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
    resetData() {
      this.operData = {
        parentId: null, // 父id
        name: '', // 菜单名称
        pageUrl: '', // 访问路径
        icon: '', // icon
        sort: '', // 排序
        remark: '', // 备注
      }
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
    height: 100%;
    // .tree-box {
    //   height: 100%;
    // }
  }
</style>