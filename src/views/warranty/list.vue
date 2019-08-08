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
          <el-form-item label="支付状态：">
            <el-select v-model="filters.pay_status" clearable size="medium" style="width: 120px">
              <el-option
                v-for="(item, index) in constType.pay_status"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口来源：">
            <el-select v-model="filters.source" clearable size="medium" style="width: 120px">
              <el-option
                v-for="(item, index) in sources"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" v-on:click="getLists(filters.page=1)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="warning" size="medium" @click="downWarranty">下载保单</el-button>
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
            <el-tooltip class="item" effect="dark" v-if="scope.row.product && scope.row.product.name" :content="scope.row.product.name" placement="top">
              <div class="hoveTitle">{{scope.row.product.name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="warranty_status" label="保单状态" :formatter="matterStatus">
        </el-table-column>
        <el-table-column prop="holder.name" label="客户姓名">
        </el-table-column>
        <el-table-column prop="product.base_price" label="保费">
        </el-table-column>
        <el-table-column prop="agent.name" label="代理人">
        </el-table-column>
        <el-table-column label="代理人推广费" width="110">
          <template slot-scope="scope"><p v-if="scope.row.product">{{scope.row.product.base_ratio+'%'}}</p></template>
        </el-table-column>
        <el-table-column prop="api_from_uuid" label="接口来源">
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

    <!-- 进度条 -->
    <el-dialog title="导出进度" :visible.sync="dialogUpload" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="450px">
      <el-form role="upload"></el-form>
    </el-dialog>
	</section>
</template>

<script>
import util from '@/utils/table'
import NProgress from 'nprogress' // Progress 进度条
import {
  getList,
  down,
  checkExport
} from '@/api/warranty'
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
        pay_status: '',       // 支付状态
        source: '',           // 接口来源
      },
      total: 0,
      lists: [],
      sources: '',  // 接口来源list
      checkInterval: null,
      dialogUpload: false,
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
        this.sources = myRes.source
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
                pay_status: this.filters.pay_status,
                source: this.filters.source,
              }
              this.toDown(para)
            } else {
              this.$alert('请分批下载，每次下载不超过10000条', '提示' , {type: 'warning'}).then(() => {})
            }
          })
      }
    },
    toDown(para) {
      this.dialogUpload = true
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
                this.dialogUpload = false
                window.location.href = process.env.BASE_API + '/export/' + url
              }
            }).catch(() => {
              this.dialogUpload = false
            })
          }, 2000)
        })
      })
    },
    // 查看详情
    toDetail(index) {
      this.$router.push({
        path: '/warranty/detail',
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
    ...mapGetters(['userId', 'constType'])
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
