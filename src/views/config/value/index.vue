<template>
  <div class="app-container">
    <div class="wrapper">
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="code" prop="code"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="值">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.value.split(',')" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link v-if="scope.row.code != 'SYS_INTRO_HTML'" :underline="false" size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-link>
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="operData.remark"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input autosize type="textarea" v-model="operData.value"></el-input>
          <p style="color: red;">若值是多个字段，需用英文逗号","隔开</p>
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
      addValue: '',
      operData: {},
      operRules: {
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }, { max: 16, message: '备注最长为16位', trigger: 'blur' }],
        value: [{ required: true, message: '值不能为空', trigger: 'blur' }],
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
      this.operData = JSON.parse(JSON.stringify(row))
      this.addValue = ''
    },
    // 保存
    operSave(formName) {
      this.$refs[formName].validate((valid) => {
				if(valid) {
          paramUpdate(this.operData).then(res => {
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

  }
}
</script>