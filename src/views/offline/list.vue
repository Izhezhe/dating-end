<template>
	<section class="app-container">
		<el-card shadow="never">
		  <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
           <el-form-item label="保单号：">
            <el-input v-model="filters.warranty_code" clearable size="medium" style="width: 150px" placeholder="请输入保单号"></el-input>
          </el-form-item>
          <el-form-item label="代理人身份证号：">
            <el-input v-model="filters.agent_code" clearable size="medium" style="width: 190px" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="投保时间：">
            <el-date-picker
              v-model="alltime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 250px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="保单状态：">
            <el-select v-model="filters.warranty_status" clearable size="medium" style="width: 120px">
              <el-option
                v-for="(item, index) in constType.warranty_status"
                v-if="index!=0"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" v-on:click="getLists(filters.page=1)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button size="medium" class="button"><a href="http://manager.lequncare.com/download/offline_example.xlsx">下载模版</a></el-button>
            <el-tooltip class="item" effect="dark" content="请选择 XLSX/XLS 格式文件" placement="top">
              <el-upload
                class="upload-btn"
                :auto-upload="false"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-change="fileSuccess"
                accept=".xlsx, .xls">
                <el-button type="primary" size="medium" class="button">上传表格</el-button>
              </el-upload>
            </el-tooltip>
            <el-button type="warning" size="medium" @click="downWarranty">下载保单</el-button>
            <el-button type="danger" size="medium" @click="batchRemove" :disabled="sels.length==0">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      
      <!--列表-->
      <el-table :data="lists" @selection-change="selsChange" v-loading="loading" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="保单号" min-width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-if="scope.row.warranty_code" :content="scope.row.warranty_code" placement="top">
              <div class="hoveTitle">{{scope.row.warranty_code}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="warranty_time" label="投保时间" :formatter="formatTime" width="100">
        </el-table-column>
        <el-table-column label="产品名称" min-width="240">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-if="scope.row.product_name" :content="scope.row.product_name" placement="top">
              <div class="hoveTitle">{{scope.row.product_name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="warranty_status" label="保单状态" :formatter="matterStatus">
        </el-table-column>
        <el-table-column prop="holder_name" label="客户姓名">
        </el-table-column>
        <el-table-column prop="premium" label="保费">
        </el-table-column>
        <el-table-column prop="agent_name" label="代理人">
        </el-table-column>
        <el-table-column prop="market_agent" label="代理人推广费" width="110">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="toDetail(scope.row.warranty_uuid)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.perpage" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-card>

    <!-- 上传进度条 -->
    <el-dialog title="上传进度" :visible.sync="dialogUpload" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="450px">
      <el-form role="upload"></el-form>
    </el-dialog>

    <!-- 进度条 -->
    <el-dialog title="导出进度" :visible.sync="dialogUpload2" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="450px">
      <el-form role="upload"></el-form>
    </el-dialog>

	</section>
</template>

<script>
import util from '@/utils/table'
import NProgress from 'nprogress' // Progress 进度条
import {
  getList,
  uploadFile,
  batchDelList,
  down,
  checkExport,
} from '@/api/offline'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      sels: [],
      alltime: '',
      filters: {
        page: 1,
        perpage: 10,
        warranty_code: '',    // 保单号
        agent_code: '',       // 代理人身份证号
        start_time: '',       // 投保开始时间
        end_time: '',         // 投保结束时间
        warranty_status: '',  // 保单状态
      },
      lists: [],
      total: 0,

      dialogUpload: false,
      checkInterval: null,
      dialogUpload2: false,
    }
  },
  methods: {
    // 获取用户列表
    getLists() {
      const para = this.filters
      this.loading = true
      getList(para).then(res => {
        let myRes = res.data
        this.loading = false
        this.filters.perpage = myRes.perpage
        this.total = myRes.total
        this.lists = myRes.data
      })
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt2M
    },
    fileSuccess(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      this.dialogUpload = true
      this.$nextTick(() => {
        NProgress.configure({
          template: '<div class="bar-center" role="bar"><div class="peg-center"></div></div>',
          parent: '[role="upload"]',
          trickleSpeed: 400,
        })
        NProgress.start()
        uploadFile(formData).then(res => {
          NProgress.done()
          setTimeout(() => {
            this.dialogUpload = false
            if(res.code == 200) {
              this.$alert('上传成功，重新加载数据？', '刷新数据' , {type: 'success'}).then(() => {
                this.filters.page=1
                this.getLists()
              })
            } else {
              this.$message({
                message: '上传失败',
                type: 'error'
              })
            }
          }, 500)
        }).catch(e => {
          this.dialogUpload = false
        })
      })
    },
    downWarranty() {
      let para = {}
      if (this.sels.length) {
        this.$confirm('确认下载，当前页选中项？', '提示', {type: 'warning'})
          .then(() => {
            para = {uuids: JSON.stringify(this.sels.map(item => item.warranty_uuid))}
            this.toDown(para)
          })
      } else {
        this.$confirm('确认下载当前查询结果吗？', '提示', {type: 'warning'})
          .then(() => {
            if(this.total < 10001) {
              para = {
                warranty_code: this.filters.warranty_code,
                agent_code: this.filters.agent_code,
                start_time: this.filters.start_time,
                end_time: this.filters.end_time,
                warranty_status: this.filters.warranty_status,
              }
              this.toDown(para)
            } else {
              this.$alert('请分批下载，每次下载不超过10000条', '提示' , {type: 'warning'}).then(() => {})
            }
          })
      }
    },
    toDown(para) {
      this.dialogUpload2 = true
      this.$nextTick(() => {
        NProgress.configure({
          template: '<div class="bar-center" role="bar"><div class="peg-center"></div></div>',
          parent: '[role="upload"]',
          trickleSpeed: 400,
        })
        NProgress.start()
        down(para).then(res => {
          let url = res.data
          this.checkInterval = setInterval(() => {
            checkExport({fileUrl: url}).then(resi => {
              if (resi.data == 1) {
                clearInterval(this.checkInterval)
                NProgress.done()
                this.dialogUpload2 = false
                window.location.href = process.env.BASE_API + '/export/' + url
              }
            }).catch(() => {
              this.dialogUpload2 = false
            })
          }, 2000)
        })
      })
    },
    selsChange(sels) {
      this.sels = sels
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.getLists()
    },
    // 认证时间校验
    formatTime(row) {
      return row.warranty_time ? util.formatDate.format(new Date(row.warranty_time)) : '-'
    },
    // 保单状态取值
    matterStatus(row) {
      return this.constType.warranty_status[row.warranty_status]
    },
    // 批量删除
    batchRemove() {
      this.$confirm('确认删除选中记录吗？', '提示', { type: 'warning' })
        .then(() => {
          let ids = this.sels.map(item => item.warranty_uuid)
          const para = { uuids: ids }
          batchDelList(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getLists()
          })
        })
        .catch(() => {})
    },
    // 查看详情
    toDetail(index) {
      this.$router.push({
        path: '/offline/detail',
        query: {
          id: index
        }
      })
    },
  },
  beforeRouteLeave (to, from, next) {
    if(this.checkInterval) { //如果定时器还在运行 或者直接关闭，不用判断
        clearInterval(this.checkInterval); //关闭
    }
    next()
  },
  watch: {
    alltime() {
      this.$nextTick(() => {
        if(this.alltime) {
          this.filters.start_time = this.alltime[0] + ' 00:00:00'
          this.filters.end_time = this.alltime[1] + ' 23:59:59'
        } else {
          this.filters.start_time = this.filters.end_time = ''
        }
      })
    }
  },
  mounted() {
    this.getLists()
  },
  computed: {
    ...mapGetters(['constType'])
  },
}
</script>

<style>
#nprogress {
  width: 410px;
  height: 16px;
  background-color: #ebeef5;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 100px;
}
</style>

<style lang="scss" scoped>
.app-container {
  .upload-btn {
    display: inline-block;
  }
  .button {
    margin-left: 4px;
  }
}
</style>
