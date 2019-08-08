<template>
	<section class="app-container">
		<el-card shadow="never">
      <!--工具条-->
      <el-row :span="24" class="toolbar toolbar-tabs">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="代理人姓名：">
            <el-input v-model="filters.agent_name" clearable size="medium" style="width: 150px" placeholder="请输入姓名"></el-input>
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
          <el-form-item label="保险公司：">
            <el-select v-model="filters.company_name" clearable filterable size="medium">
              <el-option v-for="item in company_names"
                :key="item.company_name"
                :label="item.company_name"
                :value="item.company_name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保险公司分类：">
            <el-select v-model="filters.category_name" clearable filterable size="medium" style="width: 120px;">
              <el-option v-for="item in category_names"
                :key="item.category_name"
                :label="item.category_name"
                :value="item.category_name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保单号：">
            <el-input v-model="filters.warranty_code" clearable size="medium" placeholder="请输入保单号" style="width: 150px;"></el-input>
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
          <el-form-item label="销售方式：">
            <el-select v-model="filters.sales_way" size="medium" style="width: 120px;">
              <el-option :key="1" label="线上保单" :value="1">
              </el-option>
              <el-option :key="2" label="线下保单" :value="2">
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
      </el-row>

      <el-row :gutter="20" class="toolbar-data">
        <el-col :span="6"><el-card shadow="hover"><h4>总保费</h4>
            <v-countup :end-value="head.total_base_price" :decimals="2" :options="{prefix: '￥'}"></v-countup>
          </el-card></el-col>
        <el-col :span="6"><el-card shadow="hover"><h4>总保单件数</h4>
            <v-countup :end-value="head.total_number"></v-countup>
          </el-card></el-col>
        <el-col :span="6"><el-card shadow="hover"><h4>件均保费</h4>
            <v-countup :end-value="head.avg_premium" :decimals="2" :options="{prefix: '￥'}"></v-countup>
          </el-card></el-col>
        <el-col :span="6"><el-card shadow="hover"><h4>代理人总推广费</h4>
            <v-countup :end-value="head.agent_money" :decimals="2" :options="{prefix: '￥'}"></v-countup>
          </el-card></el-col>
      </el-row>

      <!--列表-->
      <el-table :data="lists" v-loading="loading" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
        <el-table-column prop="agent_name" label="代理人姓名" width="90">	
        </el-table-column>	
        <el-table-column prop="agent_code" label="代理人身份证号" width="170">	
        </el-table-column>
        <el-table-column label="保单号" min-width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-if="scope.row.warranty_code" :content="scope.row.warranty_code" placement="top">
              <div class="hoveTitle">{{scope.row.warranty_code}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
         <el-table-column label="保单状态">
          <template slot-scope="scope">{{constType.warranty_status[scope.row.warranty_status]}}</template>
        </el-table-column>
        <el-table-column label="产品名称" min-width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.product_name" placement="top">
              <div class="hoveTitle">{{scope.row.product_name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="保险公司" min-width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" v-if="filters.sales_way==1" :content="scope.row.product_company_name" placement="top">
              <div class="hoveTitle">{{scope.row.product_company_name}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" v-else :content="scope.row.product_company" placement="top">
              <div class="hoveTitle">{{scope.row.product_company}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="投保人姓名" width="90">
          <template slot-scope="scope">
            <p v-for="item in scope.row.person" :key="item.id" v-if="item.type==1">{{item.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="被保险人姓名" width="110">
          <template slot-scope="scope">
            <p v-for="item in scope.row.person" :key="item.id" v-if="item.type==2">{{item.name}}</p>
          </template>
        </el-table-column>	
        <el-table-column label="交费方式">
          <template slot-scope="scope">
            <p v-if="filters.sales_way==1" v-for="item in scope.row.cost" :key="item.warranty_uuid">{{constType.pay_way[item.pay_way]}}</p>
            <p v-else>{{constType.pay_way[scope.row.pay_way]}}</p>
          </template>
        </el-table-column>	
        <el-table-column prop="by_stages_way" label="交费期限">	
        </el-table-column>	
        <el-table-column prop="base_price" label="保费">	
        </el-table-column>	
        <el-table-column label="代理人推广费比例" width="140">
          <template slot-scope="scope">
            <p v-if="filters.sales_way==1">{{scope.row.agent_rate}}%</p>
            <p v-else>{{scope.row.market_agent_rate}}%</p>
          </template>
        </el-table-column>
        <el-table-column label="代理人推广费" width="110">
          <template slot-scope="scope">
            <p v-if="filters.sales_way==1">{{scope.row.agent_money}}</p>
            <p v-else>{{scope.row.market_agent}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="warranty_time" label="承保日期" width="100" :formatter="formatTime">
        </el-table-column>	
        <el-table-column prop="created_at" label="投保日期" width="100" :formatter="formatTime">	
        </el-table-column>
        <el-table-column label="销售方式" width="100">
          <template slot-scope="scope">
            <p v-if="filters.sales_way==1">线上</p><p v-else>线下</p>
          </template>
        </el-table-column>
        <el-table-column prop="api_from_uuid" label="接口来源">
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.perpage" :total="total" style="float:right;">
        </el-pagination>
      </el-col>

      <!-- 进度条 -->
      <el-dialog title="导出进度" :visible.sync="dialogUpload" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="450px">
        <el-form role="upload"></el-form>
      </el-dialog>

    </el-card>
	</section>
</template>

<script>
import util from '@/utils/table'
import NProgress from 'nprogress' // Progress 进度条
import {
  getTotal,
  getList,
  getCompany,
  getCategory,
  down,
  checkExport,
} from '@/api/finance'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      company_names: [],
      category_names: [],
      alltime: '',
      filters: {
        page: 1,
        perpage: 10,
        warranty_code: '',     // 保单号
        warranty_status: '',   // 保单状态
        company_name: '',      // 产品公司名称
        category_name: '',     // 产品分类名称
        agent_name: '',        // 代理人名称
        agent_code: '',        // 代理人身份证号
        open_name: '',         // 投保开始时间
        shut_name: '',         // 投保结束时间
        sales_way: 1,          // 销售方式 1线上 2线下
        source: '',           // 接口来源
      },
      head: {},
      lists: [],
      sources: '',  // 接口来源list
      total: 0,
      dialogUpload: false,
      checkInterval: null,
    }
  },
  methods: {
    getCompanys() {
      getCompany().then(res => {
        this.company_names = res.data
      })
    },
    getCategorys() {
      getCategory().then(res => {
        this.category_names = res.data
      })
    },
    // 获取搜索结果
    getLists() {
      const para = this.filters
      this.loading = true
      getList(para).then(res => {
        let myRes = res.data
        this.loading = false
        this.total = myRes.total
        this.head = myRes.statistics
        this.lists = myRes.data
        this.sources = myRes.source
      })
    },
    // 认证时间校验
    formatTime(row) {
      return row.created_at ? util.formatDate.format(new Date(row.created_at)) : '-'
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.getLists()
    },
    downWarranty() {
      let para = {}
      this.$confirm('确认下载当前查询结果吗？', '提示', {type: 'warning'})
        .then(() => {
          if(this.total < 10001) {
            para = {
              warranty_code: this.filters.warranty_code,     // 保单号
              warranty_status: this.filters.warranty_status, // 保单状态
              company_name: this.filters.company_name,       // 产品公司名称
              category_name: this.filters.category_name,     // 产品分类名称
              agent_name: this.filters.agent_name,           // 代理人名称
              agent_code: this.filters.agent_code,           // 代理人身份证号
              open_name: this.filters.open_name,             // 投保开始时间
              shut_name: this.filters.shut_name,             // 投保结束时间
              sales_way: this.filters.sales_way,             // 销售方式 1线上 2线下
              source: this.filters.source,
            }
            this.toDown(para)
          } else {
            this.$alert('请分批下载，每次下载不超过10000条', '提示' , {type: 'warning'}).then(() => {})
          }
        })
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
          this.filters.open_name = this.alltime[0] + ' 00:00:00'
          this.filters.shut_name = this.alltime[1] + ' 23:59:59'
        } else {
          this.filters.open_name = this.filters.shut_name = ''
        }
      })
    }
  },
  mounted() {
    this.getCompanys()
    this.getCategorys()
    this.getLists()
  },
  computed: {
    ...mapGetters(['constType'])
  }
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
@import "~assets/style/variables";
.app-container {
  .toolbar-tabs {
    margin-bottom: 20px;
  }
  .toolbar-data {
    margin-bottom: 20px;
    .el-card {
      text-align: center;
       span {
        display: block;
        margin-top: 30px;
        color: $themeColor;
        font-size: 16px;
      }
    }
  }
}
</style>

