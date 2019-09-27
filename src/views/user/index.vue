<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="23" class="mb">
        <el-col :span="6">
          <el-input size="small" v-model="filters.name" placeholder="请输入姓名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input size="small" v-model="filters.phone" placeholder="请输入手机号"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="getList(true)">查询</el-button>
          <el-button size="small" @click="filtersReset()">重置</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" size="small" type="primary" @click="handleEdit(scope.row)">查看</el-link>
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

    <!-- 查看 -->
    <el-dialog title="查看用户信息" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="100px">
        <el-form-item label="姓名" prop="name">{{operData.name}}</el-form-item>
        <el-form-item label="邮箱" prop="email">{{operData.email}}</el-form-item>
        <el-form-item label="手机号" prop="phone">{{operData.phone}}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { userGet } from '@/api/user'
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
      },
      total: 0,
      tableData: [],

      // 查看
      operVisible: false,
      operData: {}
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

    // 查看
    handleEdit(row) {
      this.operVisible = true
      this.operData = row
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
      }
      this.getList(true)
    },
  }
}
</script>