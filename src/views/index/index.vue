<template>
  <section class="app-container">
    <el-row :gutter="20" class="chart-card-row">
      <el-col :span="12">
        <el-card shadow="never">
          <el-row>
            <el-col :span="5" class="pr">
              <h2>保费统计</h2>
              <div class="chart-total">
                <h3 class="blue">今日</h3>
                <p class="para">保费：<v-countup :end-value="days.today_warranty.premium"></v-countup></p>
                <p class="para">件数：<v-countup :end-value="days.today_warranty.count" class="yellow"></v-countup></p>
              </div>
              <div class="chart-total">
                <h3 class="yellow">昨日</h3>
                <p class="para">保费：<v-countup :end-value="days.yesterday_warranty.premium"></v-countup></p>
                <p class="para">件数：<v-countup :end-value="days.yesterday_warranty.count" class="yellow"></v-countup></p>
              </div>
            </el-col>
            <el-col :span="19" class="chart-wrapper">
              <el-select v-model="premiumTime" placeholder="请选择" @change="getChartPremium">
                <el-option
                  v-for="item in years"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <ve-line 
                :data="premiumData"
                :toolbox="toolbox"
                :extend="extend"
                :settings="premiumSettings"
                :loading="premiumLoading"
                :data-empty="premiumEmpty"
                height="280px">
              </ve-line>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <el-row>
            <el-col :span="19" class="chart-wrapper">
              <el-select v-model="comTime" placeholder="请选择" @change="getChartCom">
                <el-option
                  v-for="item in years"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <ve-histogram 
                :data="comData"
                :toolbox="toolbox"
                :extend="extend"
                :settings="comSettings"
                :loading="comLoading"
                :data-empty="comEmpty"
                height="280px">
                </ve-histogram>
            </el-col>
            <el-col :span="5" class="pl">
              <h2>佣金统计</h2>
              <div class="chart-total">
                <h3 class="blue">今日</h3>
                <p class="para">佣金：<v-countup :end-value="days.today_brokerage"></v-countup></p>
              </div>
              <div class="chart-total">
                <h3 class="yellow">昨日</h3>
                <p class="para">佣金：<v-countup :end-value="days.yesterday_brokerage"></v-countup></p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="chart-card-row">
      <el-col :span="12">
        <el-card shadow="never">
          <el-row>
            <el-col :span="5" class="pr">
              <h2>客户统计</h2>
              <div class="chart-total">
                <h3 class="blue">今日</h3>
                <p class="para">客户数：<v-countup :end-value="days.today_client"></v-countup></p>
              </div>
              <div class="chart-total">
                <h3 class="yellow">昨日</h3>
                <p class="para">客户数：<v-countup :end-value="days.yesterday_client"></v-countup></p>
              </div>
            </el-col>
            <el-col :span="19" class="chart-wrapper">
              <el-select v-model="customerTime" placeholder="请选择" @change="getChartCustomer">
                <el-option
                  v-for="item in years"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <ve-line 
                :data="customerData"
                :toolbox="toolbox"
                :extend="extend"
                :settings="customerSettings"
                :loading="customerLoading"
                :data-empty="customerEmpty"
                height="280px">
                </ve-line>
              <!-- <ve-heatmap 
                :data="chartDataMap"
                :extend="extend"
                :settings="chartSettingsMap"
                :data-empty="chartEmpty"
                height="280px">
              </ve-heatmap> -->
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <el-row>
            <el-col :span="19" class="chart-wrapper">
              <el-select v-model="surrenderTime" placeholder="请选择" @change="getChartSurrender">
                <el-option
                  v-for="item in years"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <ve-line 
                :data="surrenderData"
                :toolbox="toolbox"
                :extend="extend"
                :settings="surrenderSettings"
                :loading="surrenderLoading"
                :data-empty="surrenderEmpty"
                height="280px">
                </ve-line>
            </el-col>
            <el-col :span="5" class="pl">
              <h2>退保统计</h2>
              <!-- <div class="chart-total">
                <p class="para2">今日新增犹豫期退保数：<br/><v-countup :end-value="10"></v-countup></p>
              </div> -->
              <div class="chart-total">
                <p class="para2">今日新增退保数：<br/><v-countup :end-value="days.surrender"></v-countup></p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import util from '@/utils/table'
import { 
  getDays,
  getPremiumChart,
  getComChart,
  getCustomerChart,
  getSurrenderChart
} from '@/api/index'
  export default {
    data () {
      this.toolbox = {
        feature: {
          magicType: {type: ['line', 'bar']}
        }
      }
      this.extend = {
        legend: {
          left: 60,
          bottom: 20
        },
        grid: {
          left: 50,
          right: 30 //组件离容器左右侧的距离
        },
        toolbox: { right: 20 }
        // 'xAxis.0.splitLine.show': true  //x轴表格线显示
      }
      this.premiumSettings = {
        xAxisName: ['月份'],
        yAxisName: ['保费/元 - 件数/件'],
        labelMap: {
          'premium': '保费',
          'count': '件数',
        },
        legendName: {
          'premium': '保费',
          'count': '件数',
        }
      }
      this.comSettings = {
        xAxisName: ['月份'],
        yAxisName: ['佣金/元'],
        labelMap: {
          'money': '累计佣金',
          'piece_avg': '件均佣金',
          'people_avg': '人均佣金',
        },
        legendName: {
          'money': '累计佣金',
          'piece_avg': '件均佣金',
          'people_avg': '人均佣金',
        }
      }
      this.customerSettings = {
        xAxisName: ['月份'],
        yAxisName: ['保费/元 - 客户/个'],
        labelMap: {
          'premium': '累计佣金',
          'count': '件数',
          'premium_avg': '人均保费',
        },
        legendName: {
          'premium': '累计佣金',
          'count': '件数',
          'premium_avg': '人均保费',
        }
      }
      this.surrenderSettings = {
        xAxisName: ['月份'],
        yAxisName: ['数量/个'],
        labelMap: {
          'count': '退保人数',
        },
        legendName: {
          'count': '退保人数',
        }
      }
      this.chartSettingsMap = {
        position: 'china',
        type: 'map',
        geo: {
          roam: true,
          scaleLimit: {
            min: 1,
            max: 10
          },
          label: {
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#93b7e3',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#93b7e3'
            }
          }
        }
      }
      return {
        days: {},
        // 保费统计
        premiumData: {
          columns: ['month', 'premium', 'count'],
          rows: []
        },
        premiumLoading: false,
        premiumEmpty: false,

        // 佣金统计
        comData: {
          columns: ['month', 'money', 'piece_avg', 'people_avg'],
          rows: []
        },
        comLoading: false,
        comEmpty: false,

        // 客户统计
        customerData: {
          columns: ['month', 'premium', 'count', 'premium_avg'],
          rows: []
        },
        customerLoading: false,
        customerEmpty: false,

        // 退保统计
        surrenderData: {
          columns: ['month', 'count'],
          rows: []
        },
        surrenderLoading: false,
        surrenderEmpty: false,

        chartDataMap: {
          columns: ['lat', 'lng', '人数'],
          rows: [
            { 'lat': 115.892151, 'lng': 28.676493, '人数': 1000 },
            { 'lat': 117.000923, 'lng': 36.675807, '人数': 400 },
            { 'lat': 113.665412, 'lng': 34.757975, '人数': 800 },
            { 'lat': 114.298572, 'lng': 30.584355, '人数': 200 },
            { 'lat': 112.982279, 'lng': 28.19409, '人数': 100 },
            { 'lat': 113.280637, 'lng': 23.125178, '人数': 300 },
            { 'lat': 110.33119, 'lng': 20.031971, '人数': 800 },
            { 'lat': 104.065735, 'lng': 30.659462, '人数': 700 },
            { 'lat': 108.948024, 'lng': 34.263161, '人数': 300 },
            { 'lat': 103.823557, 'lng': 36.058039, '人数': 500 }
          ]
        },
        premiumTime: util.getTimeSlot.nowYear(),
        comTime: util.getTimeSlot.nowYear(),
        customerTime: util.getTimeSlot.nowYear(),
        surrenderTime: util.getTimeSlot.nowYear(),
        years: []
      }
    },
    methods: {
      getDay() {
        getDays().then(res => {
          this.days = res.data
        })
      },
      // 保费
      getChartPremium() {
        const para = { time: this.premiumTime }
        this.premiumLoading = true
        getPremiumChart(para).then(res => {
          this.premiumLoading = false
          this.premiumEmpty = res.data.length != 0 ? false : true
          this.premiumData.rows = res.data
        })
      },
      // 佣金
      getChartCom() {
        const para = { time: this.comTime }
        this.comLoading = true
        getComChart(para).then(res => {
          this.comLoading = false
          this.comEmpty = res.data.length != 0 ? false : true
          this.comData.rows = res.data
        })
      },
      // 客户
      getChartCustomer() {
        const para = { time: this.customerTime }
        this.customerLoading = true
        getCustomerChart(para).then(res => {
          this.customerLoading = false
          this.customerEmpty = res.data.length != 0 ? false : true
          this.customerData.rows = res.data
        })
      },
      // 退保
      getChartSurrender() {
        const para = { time: this.surrenderTime }
        this.surrenderLoading = true
        getSurrenderChart(para).then(res => {
          this.surrenderLoading = false
          this.surrenderEmpty = res.data.length != 0 ? false : true
          this.surrenderData.rows = res.data
        })
      },
      setOptionsYear() {
        let years = []
        let nowYear = util.getTimeSlot.nowYear()
        for( let i = 0; i < 30; i++ ) {
          years.push(nowYear)
          nowYear--
        }
        this.years = years.sort()
      }
    },
    created() {
      this.getDay()
      this.setOptionsYear()
      this.getChartPremium()
      this.getChartCom()
      this.getChartCustomer()
      this.getChartSurrender()
    }
  }
</script>

<style lang="scss" scoped>
.chart-card-row {
  &+.chart-card-row {
    margin-top: 20px;
  }
  h2 {
    text-align: center;
    color: #606266;
    font-size: 14px;
  }
  .chart-total {
    padding: 20px 0;
    &+.chart-total {
      border-top: 1px solid #e0e3e8;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 16px;
    }
    .para {
      color: #606266;
      margin-top: 6px;
      span {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .para2 {
      color: #606266;
      span {
        font-size: 18px;
        line-height: 30px;
        font-weight: bold;
      }
    }
    .blue {
      color: #00b4ff;
    }
    .yellow {
      color: #e6a23c;
    }
  }
  .chart-wrapper {
    height: 260px;
    position: relative;
    >div {
      margin-left: -20px;
    }
    .el-select {
      width: 100px;
      margin-left: -50px;
      position: absolute;
      left: 50%;
      z-index: 1;
    }
  }
}
</style>

