<template>
  <div class="app-container">
    <div class="wrapper">
      <el-row :gutter="23" class="mb">
        <el-col :span="6">
          <el-input size="small" v-model="filters.name" placeholder="请输入用户名"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input size="small" v-model="filters.email" placeholder="请输入邮箱"></el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            size="small"
            v-model="times"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="getList(true)">查询</el-button>
          <el-button size="small" @click="filtersReset()">重置</el-button>
        </el-col>
        <el-col :span="24">
          <div class="fr">
            <el-button size="small" type="primary" @click="exportList()">导出</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" size="mini" :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="金额（$）" prop="incomeMoney"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-row class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="filters.pageNumber" :page-size="filters.pageSize" :total="total" style="float:right;">
        </el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getIncomeApi } from '@/api/income'
export default {
  name: 'income',
  data() {
    return {
      times: '',
      // 查询条件
      filters: {
        pageNumber: 1,
        pageSize: 20,
        name: '',
        email: '',
        startTime: '',
        endTime: '',
      },
      total: 0,
      tableData: [],

    }
  },
  created() {
    this.getList()
  },
  methods: {
    splitTime() {
      if (this.times) {
        this.filters.startTime = this.times[0]
        this.filters.endTime = this.times[1]
      }
    },
    getList(b=false) {
      if(b) {
        this.filters.pageNumber = 1
      }
      this.splitTime()
      getIncomeApi(this.filters).then(res => {
        this.tableData = res.datas.pageData
        this.total = res.datas.totalElements
      })
    },
    handleCurrentChange(val) {
      this.filters.pageNumber = val
      this.getList()
    },
    exportList() {
      this.splitTime()
      // window.location.href = process.env.BASE_API + '/api/user/balance/export' + JSON.stringify(this.filters)
      axios.get(process.env.BASE_API + '/api/user/balance/export').then((res) => {
        // 将文件流转成blob形式
        const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let filename = 'test.xls'
        // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
        const elink = document.createElement('a')
        elink.download = filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      }).catch(() => {
        this.$message.error('导出失败')
      })

    },

    filtersReset() {
      this.filters = {
        pageNumber: 1,
        pageSize: 20,
        name: '',
        email: '',
        startTime: '',
        endTime: ''
      }
      this.times = '';
      this.getList(true)
    },
  },
}
</script>