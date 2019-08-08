<template>
  <section class="app-container">
    <el-card shadow="never">
      <el-row class="sub-title">
        <el-col :span="12"><h4>保单详情</h4></el-col>
        <el-button type="primary" class="fr" @click="goBack">返回</el-button>
      </el-row>

      <el-row v-loading="loading">
        <!-- 保险详情 -->
        <el-col :span="13" class="pr">
          <el-card shadow="hover" class="insurance-detail">
            <div class="title">
              <h2>{{info.product_name}}</h2>
              <p>保单号：{{info.warranty_code}}</p>
              <p>订单号：{{info.warranty_uuid}}</p>
            </div>
            <el-form label-width="100px" class="list-detail">
              <el-form-item label="公司名称：">
                <p v-if="info.brokerage">{{info.brokerage.product_company}}</p>
              </el-form-item>
              <el-form-item label="保险险种：">
                <p v-if="info.brokerage">{{info.brokerage.product_insure_type}}</p>
              </el-form-item>
              <el-form-item label="条款：">
                <!-- <div class="form-inside-row" v-if="info.product">
                  <el-row v-for="item in info.product.clause"><a :href="item.file_url">{{item.detail}}</a></el-row>
                </div> -->
              </el-form-item>
              <el-form-item label="受益人：">
                <div v-for="item in info.person" v-if="item.type == 3"><p v-if="item.name">{{item.name}}</p><p v-else>-</p></div>
              </el-form-item>
              <el-form-item label="保费：">{{info.premium}}元
              </el-form-item>
              <el-form-item label="支付方式：">
                <p v-if="info.brokerage">{{constType.pay_way[info.brokerage.pay_way]}}</p>
              </el-form-item>
              <el-form-item label="支付金额：">{{info.premium}}元
              </el-form-item>
              <el-form-item label="支付时间：">{{formatTime(info.warranty_time)}}
              </el-form-item>
              <el-form-item label="缴费期限：">
                <p v-if="info.brokerage">{{info.brokerage.by_stages_way?info.brokerage.by_stages_way:'暂无'}}</p>
              </el-form-item>
              <el-form-item label="代理人：">
                <p v-if="info.agent_name">{{info.agent_name}}</p><p v-else>-</p>
              </el-form-item>
              <el-form-item label="代理人推广费：">
                <p v-if="info.brokerage">{{info.brokerage.market_agent_rate}}%</p><p v-else>-</p>
              </el-form-item>
              <el-form-item label="保单状态：">{{constType.warranty_status[info.warranty_status]}}
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="11">
          <!-- 投保人 -->
          <template v-for="item in info.person">
            <el-card shadow="hover" class="text-card">
              <el-button :type="item.type==1?'primary':item.type==2?'warning':'danger'">{{constType.type[item.type]}}</el-button>
              <el-row>
                <el-col class="custom-name">
                  <span>{{item.name}}</span>
                </el-col>
              </el-row>
              <el-row v-show="item.type==1?insureIsShow:(item.type==2?beInsureedIsShow:benefitIsShow)" class="custom-data">
                <el-col>
                  <el-form label-width="100px" class="list-small-detail inline">
                    <el-form-item label="性别：">{{formatSex(item.sex)}}
                    </el-form-item>
                    <el-form-item label="与被保人关系：">{{item.relation_name}}
                    </el-form-item>
                    <el-form-item label="手机号码：">{{item.phone}}
                    </el-form-item>
                    <el-form-item label="邮箱：">{{item.email}}
                    </el-form-item>
                    <el-form-item label="证件类型：">{{constType.card_type[item.card_type]}}
                    </el-form-item>
                    <el-form-item label="证件号码：">{{item.card_code}}
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row class="set-up-down">
                <i v-if="item.type==1" :class="insureIsShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="insureIsShow = !insureIsShow"></i>
                <i v-if="item.type==2" :class="beInsureedIsShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="beInsureedIsShow = !beInsureedIsShow"></i>
                <i v-if="item.type==3" :class="benefitIsShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="benefitIsShow = !benefitIsShow"></i>
              </el-row>
            </el-card>
          </template>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script>
import util from '@/utils/table'
import { getDetail } from '@/api/offline'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      info: {},

      // 保人信息显示
      insureIsShow: true,
      beInsureedIsShow: false,
      benefitIsShow: false
    }
  },
  methods: {
    getCurInfo() {
      const para = {
        warranty_uuid: this.id
      }
      this.loading = true
      getDetail(para).then(res => {
        this.loading = false
        if(res.data) {
          this.info = res.data
        } else {
          this.$message({
            message: '暂无此数据',
            type: 'error'
          })
        }
      })
    },
    // 认证时间校验
    formatTime(time) {
      return time ? util.formatDate.format(new Date(time)) : '-'
    },
    // 性别显示转换
    formatSex: function(name) {
      return this.constType.sex[name]
    },
    formatName: function(name) {
      return this.constType.relation_name[name]
    },
    goBack() {
      this.$router.push({ path: '/offline/list' })
    }
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
  .insurance-detail {
    padding: 0 80px;
    .title {
      margin-bottom: 40px;
      text-align: center;
      h2 {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: bold;
        line-height: 40px;
      }
      p {
        line-height: 20px;
      }
    }
  }
  .text-card {
    overflow: visible;
    position: relative;
    &+.text-card {
      margin-top: 20px;
    }
    .el-button {
      position: absolute;
      right: -10px;
      top: 10px;
      cursor: default;
    }
    .custom-avator {
      width: 70%;
      height: 70%;
      border-radius: 50%;
    }
    .custom-name>span {
      display: inline-block;
      font-size: 18px;
      &.real {
        margin-left: 10px;
      }
      &.name {
        color: #ebb563;
      }
    }
    .inline .el-form-item {
      display: inline-block;
      width: 40%;
      vertical-align: middle;
    }
    .custom-data {
      margin-top: -24px;
    }
  }

  .set-up-down {
    margin-left: -20px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    i {
      font-size: 24px;
      cursor: pointer;
    }
  }
  
}
</style>
