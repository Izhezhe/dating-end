<template>
  <section class="app-container">
    <el-card shadow="never">
      <el-row class="sub-title">
        <el-col :span="12"><h4>产品详情</h4></el-col>
        <el-button type="primary" class="fr" @click.native="$router.go(-1)">返回</el-button>
      </el-row>

      <!-- 产品详情 -->
      <template v-if="activeName == 'first'">
        <!-- <el-col :span="15" class="pr mb" v-loading="loading">
          <el-card shadow="hover"> -->
            <el-row class="list-title" :span="24">
              <el-col :span="24" class="title-tag">
                  <h3>{{info.name}} <el-tag :type="info.status==0?'danger':'success'">{{constType.status[info.status]}}</el-tag></h3>
              </el-col>
              <!-- <el-col :span="6">
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <el-button size="small" type="primary">上传封面</el-button>
                    <div class="upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
              </el-col> -->
            </el-row>
            <el-form label-width="112px" class="list-detail">
              <el-form-item label="上架时间：">
                <el-row v-if="info.up_time">{{info.up_time}}</el-row>
                <el-row v-else>-</el-row>
              </el-form-item>
              <el-form-item label="下架时间：">
                <el-row v-if="info.down_time && info.status==0">{{info.down_time}}</el-row>
                <el-row v-else>-</el-row>
              </el-form-item>
              <el-form-item label="公司名称：">
                <el-row v-if="info.company">{{info.company.name}}</el-row>
                <el-row v-else>-</el-row>
              </el-form-item>
              <el-form-item label="保险险种：">
                <el-row v-if="info.category">{{info.category.name}}</el-row>
                <el-row v-else>-</el-row>
              </el-form-item>
              <el-form-item label="代理人推广费：">{{info.base_ratio+'%'}}
              </el-form-item>
              <el-form-item label="条款：">
                <div class="form-inside-row">
                  <el-row v-for="item in info.clause" :key="item.file_url"><a :href="item.file_url">{{item.detail}}</a></el-row>
                </div>
              </el-form-item>
              <el-form-item label="产品介绍：">
                <div class="form-inside-row">
                  <el-row v-for="item in info.detail" :key="item">{{item}}</el-row>
                </div>
              </el-form-item>
            </el-form>
          <!-- </el-card>
        </el-col> -->
        <!-- <el-col :span="9" v-loading="loading">
          <el-card class="detail-premium mb" shadow="hover">
            <span>保费</span>
            <span class="value">￥{{info.base_price}}元</span>
          </el-card>
          <el-card class="mb" shadow="hover">
            <div class="detail-return-list title">
              <span>共计产品返佣</span>
              <span class="value">{{info.base_price*info.base_ratio/100}}({{info.base_ratio}}%)</span>
            </div>
            <div class="detail-return-list">
              <span>公司佣金比</span>
              <span class="value">3000(60%)</span>
            </div>
            <div class="detail-return-list">
              <span>代理人佣金比</span>
              <span class="value">3000(60%)</span>
            </div>
          </el-card>
        </el-col> -->
      </template>

      <!-- 销售统计 -->
      <template v-if="activeName == 'second'">
        <!-- 工具条 -->
        <el-col :span="24" class="toolbar">
          <el-form :inline="true" :model="filters" @submit.native.prevent>
            <el-form-item label="选择时间：">
              <el-date-picker
                v-model="filters.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" v-on:click="getLists(filters.page=1)">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="lists" v-loading="loading" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
          <el-table-column prop="" label="保单号" width="200">
            </el-table-column>
            <el-table-column prop="" label="保障时间">
            </el-table-column>
            <el-table-column prop="" label="投保人">
            </el-table-column>
            <el-table-column prop="" label="保费">
            </el-table-column>
            <el-table-column prop="" label="渠道佣金">
            </el-table-column>
            <el-table-column prop="" label="代理人">
            </el-table-column>
            <el-table-column prop="" label="代理人佣金">
            </el-table-column>
            <el-table-column label="操作" width="170" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDel(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar toolbar-bottom" v-if="total!=0">
          <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
          </el-pagination>
        </el-col>
      </template>

    </el-card>

  </section>
</template>

<script>
import { getDetail } from '@/api/product'
import { mapGetters } from 'vuex'
export default {
  name: 'product-detail',
  data() {
    return {
      includeComponents: 'product-detail',
      loading: false,
      id: this.$route.query.id,
      activeName: 'first',
      info: {},
      imageUrl: '',
      value5: 3.5,

      // 销售统计
      filters: {
        time: ''
      },
      lists: [],
      total: 0,
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    getCurInfo() {
      const para = { product_id: this.id }
      this.loading = true
      getDetail(para).then(res => {
        this.loading = false
        if(res.data) {
          this.imageUrl = res.data.cover
          res.data.detail = res.data.detail.split('\n')
          this.info = res.data
        } else {
          this.$message({
            message: '暂无此数据',
            type: 'error'
          })
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
@import "~assets/style/variables";
.app-container {
  .list-title {
    .title-tag {
      // margin-bottom: 20px;
      h3 {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
        .states {
          color: $themeColor;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .avatar-uploader {
      float: right;
      width: 120px;
      height: 120px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      position: relative;
      right: 0;
      z-index: 10;
      &:hover {
        border-color: #409EFF;
      }
      .avatar {
        width: 120px;
        height: 120px;
        display: block;
      }
      .el-button {
        position: absolute;
        left: 0;
        bottom: -40px;
      }
      .upload__tip {
        margin-top: 7px;
        color: #606266;
        font-size: 12px;
        line-height: 16px;
        text-align: left;
        position: absolute;
        left: 0;
        bottom: -76px;
      }
    }
  }

  .detail-premium span {
    font-size: 18px;
    font-weight: bold;
    &.value {
      float: right;
      color: $themeColor;
    }
  }
  .detail-return-list {
    line-height: 22px;
    .value {
      float: right;
    }
    &.title {
      margin-bottom: 10px;
      font-size: 16px;
      line-height: 1em;
      span {
        font-weight: bold;
      }
    }
  }
  .detail-score {
    .el-card__body {
      &>span, &>.el-rate{
        display: inline-block;
        line-height: 12px;
      }
    }
  }
}
</style>

