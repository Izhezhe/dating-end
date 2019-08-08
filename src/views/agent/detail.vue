<template>
  <section class="app-container">
    <el-card shadow="never">
      <el-row class="sub-title">
        <el-col :span="12"><h4>代理人详情</h4></el-col>
        <el-button type="primary" class="fr" @click="goBack">返回</el-button>
      </el-row>

      <el-tabs class="tabs-title">
        <el-tab-pane label="基本信息" name="none"></el-tab-pane>
        <el-button type="primary" class="right-top-btn" @click="handleEdit()">编辑</el-button>
      </el-tabs>

      <!-- 基础信息 -->
      <el-form label-width="120px" class="list-detail" v-loading="baseLoading">
        <el-form-item label="代理人姓名：">
          {{baseInfo.name}}
          <el-tag style="margin-left: 20px;" :type="baseInfo.states==0?'success':'danger'">{{constType.states[baseInfo.states]}}</el-tag>
        </el-form-item>
        <el-form-item label="入职时间：" :class="baseInfo.states==1?'form-inline':''">{{baseInfo.entry_time}}
        </el-form-item>
        <el-form-item label="离职时间：" class="form-inline" v-if="baseInfo.states==1">{{baseInfo.quit_time}}
        </el-form-item>
        <el-form-item label="邮箱：" class="form-inline">{{baseInfo.email}}
        </el-form-item>
        <el-form-item label="联系电话：" class="form-inline">{{baseInfo.phone}}
        </el-form-item>
        <el-form-item label="开户行名称：" class="form-inline">{{baseInfo.bank_name}}
        </el-form-item>
        <el-form-item label="银行卡号：" class="form-inline">{{baseInfo.bank_code}}
        </el-form-item>
        <el-form-item label="地址：">{{baseInfo.address}}
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 代理人信息 -->
    <el-card class="mt" shadow="never">
      <el-tabs class="tabs-title">
        <el-tab-pane label="代理人信息" name="none"></el-tab-pane>
      </el-tabs>

      <el-form label-width="120px" class="list-detail" v-loading="loading">
        <el-form-item label="认证状态：">
          <el-tag :type="baseInfo.is_adopt==1?'success':'danger'">{{constType.is_adopt[baseInfo.is_adopt]}}</el-tag>
        </el-form-item>
        <el-form-item label="理由：" v-if="baseInfo.is_adopt==1">{{baseInfo.reason}}
        </el-form-item>
        <el-form-item label="代理人身份证号：">{{info.code}}
        </el-form-item>
        <el-form-item label="身份证图像：">
          <img :src="info.code_img" alt="img" class="form-img">
        </el-form-item>
        <el-form-item label="执业证编号：" class="form-inline">{{info.card}}
        </el-form-item>
        <el-form-item label="执业证有效期：" class="form-inline">{{info.card_time?info.card_time+'年':'暂未设置'}}
        </el-form-item>
        <el-form-item label="执业证图像：">
          <img :src="info.card_img" alt="img" class="form-img">
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt" shadow="never">
      <el-tabs class="tabs-title">
        <el-tab-pane label="合同信息" name="none"></el-tab-pane>
        <el-button type="primary" class="right-top-btn" @click="dialogEdit=true">编辑</el-button>
      </el-tabs>
      <el-form label-width="120px" class="list-detail" v-loading="baseLoading">
        <el-form-item label="协议/合同有效期：">{{baseInfo.contract_start_time}} 至 {{baseInfo.contract_end_time}}
        </el-form-item>
      </el-form>
    </el-card>

		<!-- 编辑界面 -->
		<el-dialog title="编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="126px" :rules="formRules" ref="editForm">
				<el-form-item label="姓名：" prop="name">
					<el-input v-model="editForm.name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="身份证号：" prop="code">
					<el-input v-model="editForm.code" placeholder="请输入" :maxlength="18"></el-input>
				</el-form-item>
				<el-form-item label="手机号：" prop="phone">
					<el-input v-model="editForm.phone" placeholder="请输入" :maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：" prop="email">
					<el-input v-model="editForm.email" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="地址：" prop="address">
					<el-input v-model="editForm.address" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="入职时间：" prop="entry_time">
          <el-date-picker
            v-model="editForm.entry_time"
            type="date"
            :clearable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间">
          </el-date-picker>
				</el-form-item>
				<el-form-item label="开户行名称：" prop="bank_name">
					<el-input v-model="editForm.bank_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="银行账号：" prop="bank_code">
					<el-input v-model="editForm.bank_code" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click.native="dialogFormVisible=false">取消</el-button>
			  <el-button type="primary" @click="operList">修改</el-button>
			</div>
		</el-dialog>

    <!-- 合同编辑界面 -->
    <el-dialog title="合同有效期修改" :visible.sync="dialogEdit" :close-on-click-modal="false" width="450px">
      <el-form label-width="130px">
        <el-form-item label="协议/合同有效期：" required>
          <el-date-picker
              v-model="alltime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false"
              style="width: 280px;">
            </el-date-picker>
        </el-form-item>
      </el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click.native="dialogEdit=false">取消</el-button>
			  <el-button type="primary" @click="operContract">修改</el-button>
			</div>
    </el-dialog>

  </section>
</template>

<script>
import util from '@/utils/table'
import {
  isValidateCode,
  isValidateMobile,
  isValidateEmail
} from '@/utils/validate'
import { 
  getBaseDetail,
  getDetail,
  operList,
  editContract
} from '@/api/agent'
import { mapGetters } from 'vuex'
export default {
  data() {
    const validateCode = (rule, value, callback) => {
      if (isValidateCode(value)[0]) {
        callback(new Error(isValidateCode(value)[1]))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (isValidateMobile(value)[0]) {
        callback(new Error(isValidateMobile(value)[1]))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (isValidateEmail(value)[0]) {
        callback(new Error(isValidateEmail(value)[1]))
      } else {
        callback()
      }
    }
    return {
      id: this.$route.query.id,
      baseLoading: false,
      loading: false,
      baseInfo: {},
      info: {},

      // 编辑页面是否显示
      dialogFormVisible: false,
      formRules: {
        name:       [{ required: true, message: '请输入姓名', trigger: 'change' }],
        code:       [{ required: true, trigger: 'change', validator: validateCode}],
        phone:      [{ required: true, trigger: 'change', validator: validatePhone }],
        email:      [{ required: true, trigger: 'change', validator: validateEmail }],
        address:    [{ required: true, message: '请输入地址', trigger: 'change' }],
        entry_time: [{ required: true, message: '请输入入职时间', trigger: 'change' }],
        bank_name:  [{ required: true, message: '请输入开户行名称', trigger: 'change' }],
        bank_code:  [{ required: true, message: '请输入银行账号', trigger: 'change' }],
      },
      // 添加界面数据
      editForm: {},

      // 合同编辑页面是否显示
      dialogEdit: false,
      alltime: ''
    }
  },
  methods: {
    getBaseInfo() {
      const para = {
        id: this.id
      }
      this.baseLoading = true
      getBaseDetail(para).then(res => {
        this.baseLoading = false
        if(res.data) {
          if(res.data.contract_start_time && res.data.contract_end_time) {
            res.data.contract_start_time = util.formatDate.format(new Date(res.data.contract_start_time), 'yyyy-MM-dd')
            res.data.contract_end_time = util.formatDate.format(new Date(res.data.contract_end_time), 'yyyy-MM-dd')
            this.alltime = [res.data.contract_start_time, res.data.contract_end_time]
          }else {
            this.alltime = [util.getTimeSlot.today(), util.getTimeSlot.threeYearsLater()]
          }
          res.data.entry_time = util.formatDate.format(new Date(res.data.entry_time), 'yyyy-MM-dd')
          res.data.quit_time = util.formatDate.format(new Date(res.data.quit_time), 'yyyy-MM-dd')
          this.baseInfo = res.data
        } else {
          this.$message({
            message: '暂无此数据',
            type: 'error'
          })
        }
      })
    },
    getCurInfo() {
      const para = {
        id: this.id
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
    // 显示编辑界面
    handleEdit() {
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, this.baseInfo, this.info)
    },
    // 显示合同编辑界面
    operContract() {
      this.$confirm('确认修改合同有效期？', '提示', {type: 'warning'})
        .then(() => {
          const para = {
            id: this.id,
            contract_start_time: this.alltime[0],
            contract_end_time: this.alltime[1]
          }
          editContract(para).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogEdit = false
            this.getBaseInfo()
          })
        })
    },
    // 修改
    operList: function() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {type: 'warning'})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              operList(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.getBaseInfo()
              })
            })
        }
      })
    },
    goBack() {
      this.$router.push({ path: '/agent/list' })
    }
  },
  created() {
    this.getBaseInfo()
    this.getCurInfo()
  },
  computed: {
    ...mapGetters(['constType'])
  }
}
</script>

<style lang="scss" scoped>
.tabs-title{
  position: relative;
}
.form-inline {
  display: inline-block;
  width: 35%;
  vertical-align: middle;
}
.form-img {
  width: 100px;
  height: 100px;
}
.right-top-btn{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}
</style>