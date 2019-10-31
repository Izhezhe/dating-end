<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="23" class="mb">
        <el-col :span="6">
          <el-input size="small" v-model="filters.username" placeholder="请输入用户名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input size="small" v-model="filters.phone" placeholder="请输入手机号"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="getList(true)">查询</el-button>
          <el-button size="small" @click="filtersReset()">重置</el-button>
        </el-col>
        <el-col :span="6">
          <div class="fr">
            <el-button size="small" type="primary" @click="handleAdd()">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-link>
            <el-link :underline="false" size="small" type="primary" @click="handleResetPass(scope.row.id)">重置密码</el-link>
            <el-link :underline="false" size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-row class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="filters.pageNumber" :page-size="filters.pageSize" :total="total" style="float:right;">
        </el-pagination>
      </el-row>
    </div>

    <!-- 新增、编辑 -->
    <el-dialog :title="operTitle[operType]" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="operData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="operType == 'add'">
          <el-input v-model="operData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="operData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="operData.phone"></el-input>
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
import { isValidateMobile } from '@/utils/validate'
import { accountGet, accountAdd, accountUpdate, accountPassReset, accountDelete } from '@/api/system'
export default {
  name: 'account',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isValidateMobile(value)[0]) {
        callback(new Error(isValidateMobile(value)[1]))
      } else {
        callback()
      }
    }
    return {
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 10,
        username: '',
        phone: '',
      },
      total: 0,
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
        email: '', // 邮箱
        phone: '', // 手机号
      },
      operRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }, { max: 16, message: '用户名最长为16位', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, message: '密码最少为6位', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        phone: [{ required: true, trigger: 'change', validator: validatePhone }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(b=false) {
      if(b) {
        this.filters.pageNumber = 1
      }
      accountGet(this.filters).then(res => {
        this.tableData = res.datas.pageData
        this.total = res.datas.totalElements
      })
    },
    handleCurrentChange(val) {
      this.filters.pageNumber = val
      this.getList()
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
      this.operData = JSON.parse(JSON.stringify(row))
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
              this.getList(true)
            })
          } else {
            accountUpdate(this.operData).then(res => {
              this.$message({
                message: res.repMsg,
                type: 'success'
              })
              this.operVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 重置密码
    handleResetPass(id) {
      this.$confirm('确定重置密码？', '提示', {type: 'warning'}).then(() => {
        accountPassReset({id: id}).then(res => {
          this.$message({
            message: res.repMsg,
            type: 'success'
          })
        })
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确定删除？', '提示', {type: 'warning'}).then(() => {
        accountDelete({id: id}).then(res => {
          this.$message({
            message: res.repMsg,
            type: 'success'
          })
          this.getList(true)
        })
      })
    },
    filtersReset() {
      this.filters = {
        pageNumber: 1,
        pageSize: 10,
        username: '',
        phone: '',
      }
      this.getList(true)
    },
    resetData() {
      this.operData = {
        id: '', // id
        username: '', // 用户名
        password: '', // 密码
        email: '', // 邮箱
        phone: '', // 手机号
      }
    },
  }
}
</script>