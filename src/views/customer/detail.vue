<template>
  <section class="app-container">
    <el-card shadow="never">
      <el-row class="sub-title">
        <el-col :span="12"><h4>客户详情</h4></el-col>
        <el-button type="primary" class="fr" @click="goBack">返回</el-button>
      </el-row>

      <!-- 用户信息 -->
      <el-row :span="24">
        <el-tabs><el-tab-pane label="基本信息" name="none"></el-tab-pane></el-tabs>
        <el-form label-width="120px" class="list-detail" v-loading="loading">
            <el-form-item label="姓名：" style="display: block;">{{info.name}}
            </el-form-item>
            <el-form-item label="性别：">{{constType.sex[info.sex]}}
            </el-form-item>
            <el-form-item label="人员类型：">{{constType.type[info.type]}}
            </el-form-item>
            <el-form-item label="证件类型：">{{constType.card_type[info.card_type]}}
            </el-form-item>
            <el-form-item label="证件号码：">{{info.card_code}}
            </el-form-item>
            <el-form-item label="与投保人关系：">{{constType.relation_name[info.relation_name]}}
            </el-form-item>
            <el-form-item label="创建时间：">{{info.created_at}}
            </el-form-item>
            <el-form-item label="手机号码：">{{info.phone}}
            </el-form-item>
            <el-form-item label="邮箱：">{{info.email}}
            </el-form-item>
            <el-form-item label="地址：">{{info.address}}
            </el-form-item>
        </el-form>
      </el-row>
    </el-card>

    <!-- 投保产品 -->
    <el-card shadow="hover" class="mt">
      <el-tabs><el-tab-pane label="承保记录" name="none"></el-tab-pane></el-tabs>

      <el-table :data="warranty" v-loading="loading" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
        <el-table-column prop="warranty_code" label="保单号" width="200">
        </el-table-column>
        <el-table-column label="保险公司" min-width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.product.company_name" placement="top" v-if="scope.row.product">
              <div class="hoveTitle">{{scope.row.product.company_name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="保险产品名称" min-width="200">
           <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.product.name" placement="top" v-if="scope.row.product">
              <div class="hoveTitle">{{scope.row.product.name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="cost[0].pay_money" label="保费(元)">
        </el-table-column>
        <el-table-column label="投保人">
          <template slot-scope="scope">
            <p v-for="item in scope.row.person" v-if="item.type==1">{{item.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="被保人">
          <template slot-scope="scope">
            <p v-for="item in scope.row.person" v-if="item.type==2">{{item.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="toDetail(scope.row.warranty_uuid)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </section>
</template>

<script>
import { getDetail } from '@/api/customer'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      info: {},
      warranty: [],
    }
  },
  methods: {
    getCurInfo() {
      const para = { id: this.id }
      this.loading = true
      getDetail(para).then(res => {
        this.loading = false
        if(res.data) {
          this.info = res.data.customer
          this.warranty.push(res.data.warranty)
        } else {
          this.$message({
            message: '暂无此数据',
            type: 'error'
          })
        }
      })
    },
    goBack() {
      this.$router.push({ path: '/customer/list' })
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
  created() {
    this.getCurInfo()
  },
  computed: {
    ...mapGetters(['constType'])
  }
}
</script>

<style lang="scss" scoped>
.list-detail {
  .el-form-item {
    display: inline-block;
    width: 35%;
    vertical-align: middle;
  }
}
</style>
