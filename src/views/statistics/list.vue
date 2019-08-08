<template>
	<section class="app-container">
		<el-card shadow="never">
      <!--工具条-->
      <el-row :span="24" class="toolbar toolbar-tabs">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="手机号：">
            <el-input v-model="filters.phone" clearable size="medium" style="width: 150px" placeholder="请输入手机号"></el-input>
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
          <el-form-item>
            <el-button type="warning" size="medium" @click="downWarranty">下载</el-button>
          </el-form-item>
        </el-form>
      </el-row>

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
  statisticsDown,
  checkExport,
} from '@/api/finance'

export default {
  data() {
    return {
      alltime: '',
      filters: {
        phone: '',
        start_time: '',
        end_time: ''
      },
      dialogUpload: false,
      checkInterval: null,
    }
  },
  methods: {
    downWarranty() {
      this.$confirm('确认根据当前条件下载吗？', '提示', {type: 'warning'})
        .then(() => {
          const para = this.filters
          this.toDown(para)
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
        statisticsDown(para).then(res => {
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
          this.filters.start_time = this.alltime[0] + ' 00:00:00'
          this.filters.end_time = this.alltime[1] + ' 23:59:59'
        } else {
          this.filters.start_time = this.filters.end_time = ''
        }
      })
    }
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
@import "~assets/style/variables";
.app-container {
  .toolbar-tabs {
    height: 40px;
  }
}
</style>

