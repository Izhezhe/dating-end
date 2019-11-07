<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="23" class="search-wrapper mb">
        <el-col :span="6">
          <el-input size="small" v-model="filters.name" placeholder="请输入姓名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input size="small" v-model="filters.email" placeholder="请输入邮箱"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input size="small" v-model="filters.phone" placeholder="请输入手机号"></el-input>
        </el-col>
        <el-col :span="6">
            <el-select size="small" v-model="filters.role" clearable placeholder="请选择角色">
              <el-option label="普通用户" value="common"></el-option>
              <el-option label="客服" value="member"></el-option>
            </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="23" class="search-wrapper mb">
        <el-col :span="6">
            <el-select size="small" v-model="filters.isRecom" clearable placeholder="请选择是否推荐">
              <el-option label="推荐" value="true"></el-option>
              <el-option label="未推荐" value="false"></el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="getList(true)">查询</el-button>
          <el-button size="small" @click="filtersReset()">重置</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            {{scope.row.role == 'common' ? '普通用户':'客服'}}
          </template>
        </el-table-column>
        <el-table-column label="首页推荐">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isRecom == 'true'">推荐</el-tag>
            <el-tag v-else type="info">未推荐</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-link>
            <el-link :underline="false" size="small" type="primary" @click="toRecom(scope.row.id, true)" v-if="scope.row.isRecom == 'false'">推荐</el-link>
            <el-link :underline="false" size="small" type="primary" @click="toRecom(scope.row.id, false)" v-else>取消推荐</el-link>
            <!-- <el-link :underline="false" size="small" type="primary" @click="handleDelete(scope.row.id)">删除</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-row class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="filters.pageNumber" :page-size="filters.pageSize" :total="total" style="float:right;">
        </el-pagination>
      </el-row>
    </div>

    <!-- 查看 -->
    <el-dialog title="查看用户信息" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="operData.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="operData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="operData.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="operData.role" placeholder="请选择角色">
            <el-option label="普通用户" value="common"></el-option>
            <el-option label="客服" value="member"></el-option>
          </el-select>
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
import { userGet, setRecomApi, updateUser } from '@/api/user'
export default {
  name: 'account',
  data() {
    return {
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        phone: '',
        email: '',
        role: '',
        isRecom: '',
      },
      total: 0,
      tableData: [],

      // 编辑
      operVisible: false,
      operData: {},
      operRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        // phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        role: [{ required: true, message: '角色不能为空', trigger: 'change' }],
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
      userGet(this.filters).then(res => {
        this.tableData = res.datas.pageData
        this.total = res.datas.totalElements
      })
    },
    handleCurrentChange(val) {
      this.filters.pageNumber = val
      this.getList()
    },

    // 编辑
    handleEdit(row) {
      this.operVisible = true
      this.operData = JSON.parse(JSON.stringify(row))
    },
    // 保存
    operSave(formName) {
      this.$refs[formName].validate((valid) => {
				if(valid) {
          updateUser(this.operData).then(res => {
            this.$message({
              message: res.repMsg,
              type: 'success'
            })
            this.operVisible = false
            this.getList(true)
          })
        }
      })
    },
    // 推荐
    toRecom(id, boolean) {
      let tip = ''
      if (boolean) {
        tip = '推荐到首页？'
      } else {
        tip = '从首页取消推荐？'
      }
      this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            id: id,
            isRecom: boolean
          }
          setRecomApi(data).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.getList()
          })
        }).catch(() => {});
      
    },
    // 删除
    handleDelete(id) {
      // this.$confirm('确定删除？', '提示', {type: 'warning'}).then(() => {
      //   accountDelete({id: id}).then(res => {
      //     this.$message({
      //       message: res.repMsg,
      //       type: 'success'
      //     })
      //     this.getList(true)
      //   })
      // })
    },
    filtersReset() {
      this.filters = {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        phone: '',
        email: '',
        role: '',
        isRecom: '',
      }
      this.getList(true)
    },
  }
}
</script>

<style lang="scss" scope>
  .search-wrapper {
    span {
      display: inline-block;
    }
  }
</style>