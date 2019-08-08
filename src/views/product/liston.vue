<template>
	<section class="app-container">
		<el-card shadow="never">
      <el-row class="tabs-title">
        <div class="tab"><router-link to="/product/list">产品管理</router-link></div>
        <div class="tab"><router-link to="/product/liston" class="active">产品同步</router-link></div>
      </el-row>

      <!--列表-->
      <el-table :data="lists" @selection-change="selsChange" v-loading="loading" :show-overflow-tooltip="true" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
        <el-table-column label="产品名称" min-width="240">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.display_name" placement="top">
              <div class="hoveTitle">{{scope.row.display_name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="category.name" label="产品分类" width="110">
        </el-table-column>
        <el-table-column label="所属公司" min-width="240">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.company.name" placement="top">
              <div class="hoveTitle">{{scope.row.company.name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="代理人推广费" width="110">
          <template slot-scope="scope">{{''+scope.row.base_ratio+'%'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="toDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.perpage" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-card>

	</section>
</template>

<script>
import {
  getListOn,
} from '@/api/product'
import { getCategory } from '@/api/finance'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      // activeName: '/product/liston',
      loading: false,
      sels: [],
      filters: {
        page: 1,
        perpage: 10,
      },
      lists: [],
      total: 0,
    }
  },
  methods: {
    // 获取用户列表
    getLists() {
      const para = this.filters
      this.loading = true
      getListOn(para).then(res => {
        let myRes = res.data
        this.loading = false
        this.total = myRes.limit.count
        this.lists = myRes.result
      })
    },
    // 全选单选多选
    selsChange(sels) {
      this.sels = sels
      let len = sels.length
      let upLen = 0     // 下架数量，设为上架
      let downLen = 0   // 上架数量，设为下架
      for (let i = 0; i < len; i++) {
        const sel = sels[i]
        if(sel.status == 0) {
          upLen = upLen+1
        } else {
          downLen = downLen+1
        }
      }
      this.isProductUp = upLen > 0 && upLen == len ? true : false
      this.isProductDown = downLen > 0 && downLen == len ? true : false
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.getLists()
    },
    handleClick(tab, event) {	
      this.activeName = tab.name	
      this.$router.push({path: tab.name})	
    },
    // 查看详情
    toDetail(index) {
      this.$router.push({
        path: '/product/detail',
        query: {
          id: index
        }
      });
    },
  },
  mounted() {
    this.getLists()
  },
  computed: {
    ...mapGetters(['constType'])
  }
}
</script>


<style lang="scss" scoped>
.tabs-title {
  margin-top: -12px;
  margin-bottom: 15px;
  border-bottom: 2px solid #e4e7ed;
  .tab {
    display: inline-block;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
    a {
      display: block;
      color: #303133;
      border-bottom: 2px solid #e4e7ed;
      &.active {
        color: #409eff;
        border-color: #409eff;
      }
    }
  }
  .tab:nth-child(1) {
    padding-left: 0;
  }
  .tab:last-child {
    padding-right: 0;
  }
}
</style>
