<template>
	<section class="app-container">
		<el-card shadow="never">
      <el-row class="tabs-title">
        <div class="tab"><router-link to="/product/list" class="active">产品管理</router-link></div>
        <div class="tab"><router-link to="/product/liston">产品同步</router-link></div>
      </el-row>
		  <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="产品名称：">
            <el-input v-model="filters.name" clearable size="medium" placeholder="请输入产品名称" style="width: 150px;"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：">
            <el-input v-model="filters.company_name" clearable size="medium" placeholder="请输入公司名称" style="width: 150px;"></el-input>
          </el-form-item>
          <el-form-item label="销售状态：">
            <el-select v-model="filters.status" clearable size="medium" style="width: 120px">
              <el-option 
                v-for="(item, index) in constType.status" 
                :key="index" 
                :label="item" 
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品分类：">
            <el-select v-model="filters.category_name" clearable size="medium" style="width: 120px">
              <el-option 
                v-for="item in category_names" 
                :key="item.category_name" 
                :label="item.category_name" 
                :value="item.category_name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" v-on:click="getLists(filters.page=1)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" size="medium" @click="batchComRatio=true" :disabled="sels.length==0">修改佣金比</el-button>
            <el-button type="primary" size="medium" @click="productUp" :disabled="sels.length==0 || !isProductUp">上架产品</el-button>
            <el-button type="danger" size="medium" @click="batchDown=true" :disabled="sels.length==0 || !isProductDown">下架产品</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="lists" @selection-change="selsChange" v-loading="loading" :show-overflow-tooltip="true" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
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
        <el-table-column label="销售状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==0?'danger':'success'">{{constType.status[scope.row.status]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="toDetail(scope.row.product_id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar toolbar-bottom" v-if="total!=0">
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.perpage" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-card>

    <!-- 佣金比修改 -->
    <el-dialog title="产品佣金比设置" :visible.sync="batchComRatio" :close-on-click-modal="false" width="450px">
      <el-form label-width="100px" ref="editForm1">
        <el-form-item label="佣金比：" required>
          <el-input-number v-model="base_ratio" @change="handleChange" :min="1" :max="60"></el-input-number>
        </el-form-item>
      </el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click.native="batchComRatio=false">取消</el-button>
			  <el-button type="primary" @click="comRatio">确定</el-button>
			</div>
    </el-dialog>

    <!-- 产品下架 -->
    <el-dialog title="产品状态设置" :visible.sync="batchDown" :close-on-click-modal="false" width="450px">
      <el-form label-width="100px" ref="editForm">
        <el-form-item label="下架理由：" required>
          <el-input type="textarea" v-model="lower_reason"></el-input>
        </el-form-item>
      </el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click.native="batchDown=false">取消</el-button>
			  <el-button type="primary" @click="productDown">确定</el-button>
			</div>
    </el-dialog>

	</section>
</template>

<script>
import {
  getList,
  editRatio,
  productUp,
  productDown
} from '@/api/product'
import { getCategory } from '@/api/finance'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      activeName: '/product/list',
      loading: false,
      sels: [],
      category_names: [],
      isProductUp: false,   // 上架（是否能点击）
      isProductDown: false, // 下架（是否能点击）
      filters: {
        page: 1,
        perpage: 10,
        name: '',           // 产品名称
        status: null,       // 上下架状态，1上架，0下架
        company_name: '',   // 公司名称
        category_name: '',  // 分类名称
      },
      lists: [],
      total: 0,

      batchComRatio: false,
      base_ratio: 30,

      batchDown: false,
      lower_reason: '',
    }
  },
  methods: {
    getCategorys() {
      getCategory().then(res => {
        this.category_names = res.data
      })
    },
    // 获取用户列表
    getLists() {
      const para = this.filters
      this.loading = true
      getList(para).then(res => {
        let myRes = res.data
        this.loading = false
        this.total = myRes.total
        this.lists = myRes.data
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
    comRatio() {
      if(this.base_ratio) {
        this.$confirm('确定修改佣金比吗？', '提示', {type: 'warning'})
          .then(() => {
            let ids = this.sels.map(item => item.id).toString()
            const para = { id: ids, base_ratio: this.base_ratio }
            editRatio(para).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.batchComRatio = false
              this.getLists()
            })
          })
      }
    },
    productUp() {
      this.$confirm('确定上架产品吗？', '提示', {type: 'warning'})
        .then(() => {
          let ids = this.sels.map(item => item.id).toString()
          const para = { id: ids }
          productUp(para).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getLists()
          })
        })
    },
    productDown() {
      if(this.lower_reason) {
        this.$confirm('确定下架产品吗？', '提示', {type: 'warning'})
          .then(() => {
            let ids = this.sels.map(item => item.id).toString()
            const para = { id: ids, lower_reason: this.lower_reason }
            productDown(para).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.batchDown = false
              this.getLists()
            })
          })
      }
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
    this.getCategorys()
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
