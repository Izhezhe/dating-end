<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="23" class="mb">
        <!-- <el-col :span="6">
          <el-input size="small" v-model="filters.username" placeholder="请输入用户名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input size="small" v-model="filters.phone" placeholder="请输入手机号"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="getList(true)">查询</el-button>
          <el-button size="small" @click="filtersReset()">重置</el-button>
        </el-col> -->
        <!-- <el-col>
          <div class="fr">
            <el-button size="small" type="primary" @click="handleAdd()">添加</el-button>
          </div>
        </el-col> -->
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="配置code" prop="code"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="配置">
          <template slot-scope="scope">
            <div v-if="scope.row.code == 'SYS_INTRO_HTML'">
              <!-- <p>{{scope.row.value.split(',')}}</p> -->
              <p v-for="(item, index) in scope.row.value.split(',')" :key="index">{{item}}</p>
            </div>
            <div v-else>{{scope.row.value}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-link>
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
    <el-dialog title="编辑系统配置表" :visible.sync="operVisible">
      <el-form ref="operForm" :model="operData" :rules="operRules" label-width="100px">
        <el-form-item label="配置code" prop="code">
          <el-input v-model="operData.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="operData.remark"></el-input>
        </el-form-item>
        <el-form-item label="配置" prop="value">
          <el-input v-model="operData.value"></el-input>
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
import { mapGetters } from 'vuex'
import { paramGet, paramUpdate } from '@/api/system'
export default {
  name: 'sys-config',
  data() {
    return {
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],

      // 编辑
      operVisible: false,
      operData: {},
      operRules: {
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }, { max: 16, message: '备注最长为16位', trigger: 'blur' }],
        value: [{ required: true, message: '配置不能为空', trigger: 'blur' }],
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      paramGet().then(res => {
        this.tableData = res.datas.pageData
        this.total = res.datas.totalElements
      })
    },

     // 编辑
    handleEdit(row) {
      this.operVisible = true
      this.operData = row
    },
    // 保存
    operSave(formName) {
      // this.$refs[formName].validate((valid) => {
			// 	if(valid) {
          paramUpdate(this.operData).then(res => {
            this.$message({
              message: res.repMsg,
              type: 'success'
            })
            this.operVisible = false
            this.getList(true)
          })
      //   }
      // })
    },

  }
}
</script>