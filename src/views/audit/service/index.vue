<template>
  <div class="app-container">
    <div class="wrapper mb">
      <el-row :gutter="23" class="search-wrapper">
        <el-col :span="12">
          <span>当前促销码：</span>
          <span style="margin-right: 20px;">{{promCode}}</span>
          <el-button size="small" @click="updateProm()">立即更新</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="wrapper">
      <el-row :gutter="23" class="search-wrapper mb">
        <el-col :span="6">
          <el-input size="small" v-model="filters.name" placeholder="请输入姓名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input size="small" v-model="filters.email" placeholder="请输入邮箱"></el-input>
        </el-col>
        <el-col :span="6">
          <el-select size="small" v-model="filters.role" clearable placeholder="请选择审核状态">
            <el-option label="待审核" value="init"></el-option>
            <el-option label="驳回" value="reject"></el-option>
            <el-option label="通过" value="finish"></el-option>
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
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 'init'" type="info">待审核</el-tag>
            <el-tag v-if="scope.row.status == 'reject'" type="danger">驳回</el-tag>
            <el-tag v-if="scope.row.status == 'finish'">通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-row class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="filters.pageNumber" :page-size="filters.pageSize" :total="total" style="float:right;">
        </el-pagination>
      </el-row>
    </div>

    <!-- 编辑 -->
    <el-dialog title="客服审核" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="operData.name"></el-input>
        </el-form-item>
        <el-form-item label="审核" prop="status">
          <el-select v-model="operData.status" placeholder="请选择审核状态">
            <el-option label="驳回" value="reject"></el-option>
            <el-option label="通过" value="finish"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证正面">
          <el-image v-if="operData.idcardFront != ''" :src="operData.idcardFront" fil="contain" class="idcard-image"></el-image>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcardNum">
          <el-input v-model="operData.idcardNum"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker v-model="operData.birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核原因" :prop="operData.status == 'reject' ? 'advice':''">
          <el-input autosize type="textarea" v-model="operData.advice"></el-input>
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
import { isValidateCode } from '@/utils/validate'
import { getAuditApi, logAuditApi, updateAuditApi, getPromApi, updatePromApi } from '@/api/audit'
export default {
  name: 'account',
  data() {
    const validateCode = (rule, value, callback) => {
      if (isValidateCode(value)[0]) {
        callback(new Error(isValidateCode(value)[1]))
      } else {
        callback()
      }
    }
    return {
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        email: '',
        status: '',
      },
      total: 0,
      tableData: [],

      // 查看
      operVisible: false,
      operData: {},
      operRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        idcardNum: [{ required: true, message: '身份证号不能为空', trigger: 'change' }],
        birthday: [{ required: true, message: '出生日期不能为空', trigger: 'blur' }],
        advice: [{ required: true, message: '驳回时', trigger: 'blur' }],
      },

      // 促销码
      promCode: '',
    }
  },
  created() {
    this.getList()
    this.getProm()
  },
  methods: {
    getList(b=false) {
      if(b) {
        this.filters.pageNumber = 1
      }
      getAuditApi(this.filters).then(res => {
        this.tableData = res.datas.pageData
        this.total = res.datas.totalElements
      })
    },
    handleCurrentChange(val) {
      this.filters.pageNumber = val
      this.getList()
    },

    // 编辑
    handleEdit(id) {
      this.operVisible = true
      logAuditApi(id).then(res => {
        if (res.datas.status == 'init') {
          res.datas.status = ''
        }
        this.operData = res.datas
      })
    },
    // 审核
    operSave(formName) {
      this.$refs[formName].validate((valid) => {
				if(valid) {
          updateAuditApi(this.operData).then(res => {
            this.$message({
              message: res.repMsg,
              type: 'success'
            })
            this.operVisible = false
            this.getList()
          })
        }
      })
    },
    filtersReset() {
      this.filters = {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        email: '',
        status: '',
      }
      this.getList(true)
    },

    getProm() {
      getPromApi().then(res => {
        this.promCode = res.datas
      })
    },
    updateProm() {
      updatePromApi().then(res => {
        this.promCode = res.datas
      })
    }
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