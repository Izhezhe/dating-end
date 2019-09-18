<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="10">
        <el-col :span="7">
          <div class="">
            <el-button class="m0" size="small" @click="handleAdd()">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe class="mt">
        <el-table-column label="序号" prop="sort" width="70"></el-table-column>
        <el-table-column label="菜单名称" prop="name"></el-table-column>
        <el-table-column label="页面路径" prop="pageUrl"></el-table-column>
        <el-table-column label="图标" prop="icon"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-link>
            <el-link :underline="false" type="primary" size="small" @click="handleDelete(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
        <el-form-item label="图标" prop="icon">
          <el-input v-model="operData.icon"></el-input>
        </el-form-item>
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
import { accountGet, accountAdd, accountUpdate, accountPassReset } from '@/api/system'
export default {
  name: 'account',
  data() {
    return {
      tableData: [],

      // 新增、编辑
      operVisible: false,
      operType: 'add',
      operTitle: {
        add: '添加系统账号',
        edit: '编辑系统账号'
      },
      operData: {
        id: '', // id
        username: '', // 用户名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
      },
      operRules: {
        // parentId: [{ required: true, validator: validatePass,trigger: 'change' }],
        // name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      accountGet().then(res => {
        this.tableData = res.datas
      })
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
            accountAdd(this.operData).then(res => {
              this.$message({
                message: res.repMsg,
                type: 'success'
              })
              this.operVisible = false
              this.getMenuTree()
              this.getList()
            })
          } else {
            accountUpdate(this.operData).then(res => {
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
      // this.$confirm('确定删除？', '提示', {type: 'warning'}).then(() => {
      //   menuDelete({id: id}).then(res => {
      //     this.$message({
      //       message: res.repMsg,
      //       type: 'success'
      //     })
      //     this.getMenuTree()
      //     this.getList()
      //   })
      // })
    },
    resetData() {
      this.operData = {
        id: '', // id
        username: '', // 用户名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
      }
    },
  }
}
</script>