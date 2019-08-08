<template>
	<section class="app-container">
		<el-card shadow="never">
		  <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="姓名：">
            <el-input v-model="filters.name" clearable size="medium" style="width: 150px" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="filters.phone" clearable size="medium" style="width: 150px" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" v-on:click="getLists(filters.page=1)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="lists" v-loading="loading" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
        <el-table-column prop="name" label="客户姓名">
        </el-table-column>
        <el-table-column label="证件类型">
          <template slot-scope="scope">{{constType.card_type[scope.row.card_type]}}</template>
        </el-table-column>
        <el-table-column prop="card_code" label="证件号">
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" :formatter="matPhone">
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
import util from '@/utils/table'
import {
  getList
} from '@/api/customer'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      filters: {
        page: 1,
        perpage: 10,
        name: '',
        phone: ''
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
      getList(para).then(res => {
        let myRes = res.data
        this.loading = false
        this.total = myRes.total
        this.lists = myRes.data
      })
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.getLists()
    },
    matPhone(row) {
      return row.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },
    // 查看详情
    toDetail(index) {
      this.$router.push({
        path: '/customer/detail',
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
