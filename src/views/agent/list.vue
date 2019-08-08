<template>
	<section class="app-container">
		<el-card shadow="never">
		  <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item label="姓名：">
            <el-input v-model="filters.name" clearable size="medium" placeholder="请输入姓名查询" style="width: 150px;"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-input v-model="filters.code" clearable size="medium" placeholder="请输入身份证号" style="width: 190px;"></el-input>
          </el-form-item>
          <el-form-item label="认证状态：">
            <el-select v-model="filters.is_adopt" clearable size="medium" style="width: 120px;">
              <el-option v-for="(item, index) in constType.is_adopt"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="在职状态：">
            <el-select v-model="filters.states" clearable size="medium" style="width: 120px;">
              <el-option v-for="(item, index) in constType.states"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" v-on:click="getLists(filters.page=1)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" size="medium" @click="handleAdd">新增人员</el-button>
            <el-button type="primary" size="medium" @click="dialogExamine=true" :disabled="sels.length==0 || !isAdopt">认证审核</el-button>
            <el-button type="primary" size="medium" @click="barchIncu" :disabled="sels.length==0 || !isIncuStates">设为在职</el-button>
            <el-button type="danger" size="medium" @click="dialogQuit=true" :disabled="sels.length==0 || !isQuitStates">设为离职</el-button>
            <el-button type="danger" size="medium" @click="batchRemove" :disabled="sels.length==0">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="lists" @selection-change="selsChange" v-loading="loading" :header-cell-style="{'color':'#333'}" highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="代理人姓名">
          <template slot-scope="scope">
            <p v-if="scope.row.name">{{scope.row.name}}</p>
            <p v-else>{{scope.row.nickname}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="agent.code" label="代理人身份证号" width="170">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" :formatter="matPhone" width="110">
        </el-table-column>
        <el-table-column prop="agent.card" label="执业证编号">
        </el-table-column>
        <el-table-column prop="entry_time" label="入职时间" :formatter="formatTime">
        </el-table-column>
        <el-table-column label="认证状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_adopt==0?'danger':'success'">{{constType.is_adopt[scope.row.is_adopt]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="在职状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.states==0?'success':'danger'">{{constType.states[scope.row.states]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="toDetail(scope.row.id)"><!-- <icon name="detail" style="width: 12px; height: 13px;"></icon> -->查看</el-button>
            <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button> -->
            <!-- <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDel(scope.row.id)"></el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar toolbar-bottom" v-if="total!=0">
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length==0">批量删除</el-button> -->
        <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="filters.perpage" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
    </el-card>

		<!-- 添加界面 -->
		<el-dialog title="新增" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
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
        <!-- <el-form-item label="密码：" prop="password">
					<el-input v-model="editForm.password" placeholder="请输入"></el-input>
				</el-form-item> -->
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
			  <el-button type="primary" @click="operList">添加</el-button>
			</div>
		</el-dialog>

    <!-- 认证审核 -->
    <el-dialog title="资格认证审核" :visible.sync="dialogExamine" :close-on-click-modal="false" width="450px">
      <el-form label-width="100px">
        <el-form-item label="审核结果：" required>
          <el-select v-model="is_adopt" size="medium">
            <el-option key="0" label="同意" value="0"></el-option>
            <el-option key="1" label="不同意" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="理由：">
          <el-input type="textarea" v-model="reason"></el-input>
        </el-form-item>
      </el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click.native="dialogExamine=false">取消</el-button>
			  <el-button type="primary" @click="branchExamine">确定</el-button>
			</div>
    </el-dialog>

    <!-- 离职设置 -->
    <el-dialog title="离职设置" :visible.sync="dialogQuit" :close-on-click-modal="false" width="450px">
      <el-form label-width="100px">
        <el-form-item label="离职时间：" required>
          <el-date-picker
            v-model="time"
            type="date"
            :editable="false"
            :clearable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <p style="color: #8c8c8c;">注：变更离职状态后，所负责的客户将自动解绑，请谨慎操作！</p>
      </el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click.native="dialogQuit=false">取消</el-button>
			  <el-button type="primary" @click="batchQuit">确定</el-button>
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
  getList,
  operList,
  batchSetAdopt,
  batchIncuStates,
  batchQuitStates,
  batchDelList
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
      loading: false,
      sels: [],
      isIncuStates: false,  // 设为在职状态（是否能点击）
      isQuitStates: false,  // 设为离职状态（是否能点击）
      isAdopt: false,   // 认证按钮（是否能点击）
      filters: {
        page: 1,
        perpage: 10,
        name: '',      // 代理人姓名
        code: '',      // 身份证号
        states: '',    // 在职状态
        is_adopt: ''   // 认证状态
      },
      lists: [],
      total: 0,

      // 新增编辑页面是否显示
      dialogFormVisible: false,
      formRules: {
        name:       [{ required: true, message: '请输入姓名', trigger: 'change' }],
        code:       [{ required: true, trigger: 'change', validator: validateCode}],
        phone:      [{ required: true, trigger: 'change', validator: validatePhone }],
        email:      [{ required: true, trigger: 'change', validator: validateEmail }],
        address:    [{ required: true, message: '请输入地址', trigger: 'change' }],
        // password:   [
        //   { required: true, message: '请输入密码', trigger: 'change' },
        //   { min: 6, message: '密码长度最少为6位', trigger: 'change' }],
        entry_time: [{ required: true, message: '请输入入职时间', trigger: 'change' }],
        bank_name:  [{ required: true, message: '请输入开户行名称', trigger: 'change' }],
        bank_code:  [{ required: true, message: '请输入银行账号', trigger: 'change' }],
      },
      // 添加界面数据
      editForm: {},

      // 审核
      dialogExamine: false,
      is_adopt: '0',
      reason: '',

      // 设为离职
      dialogQuit: false,
      time: new Date(),
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
    // 全选单选多选
    selsChange(sels) {
      this.sels = sels
      let len = sels.length
      let quitStateLen = 0    // 离职数量，设为在职
      let insuStateLen = 0    // 在职数量，设为离职
      let adoptLen = 0
      for (let i = 0; i < len; i++) {
        const sel = sels[i]
        if(sel.states == 0) {
          insuStateLen = insuStateLen+1
        } else {
          quitStateLen = quitStateLen+1
        }
        if (sel.is_adopt == 0 && sel.states == 0) {
          adoptLen = adoptLen+1
        }
      }
      this.isQuitStates = insuStateLen > 0 && insuStateLen == len ? true : false
      this.isIncuStates = quitStateLen > 0 && quitStateLen == len ? true : false
      this.isAdopt = adoptLen > 0 && adoptLen == len ? true : false
    },
    matPhone(row) {
      return row.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },
    // 认证时间校验
    formatTime(row) {
      return row.entry_time ? util.formatDate.format(new Date(row.entry_time)) : '-'
    },
    handleCurrentChange(val) {
      this.filters.page = val
      this.getLists()
    },
    // 显示新增界面
    handleAdd() {
      this.dialogFormVisible = true
      this.editForm = {
        name: '',
        phone: '',
        email: '',
        occupation: '',
        address: '',
        password: '',
        entry_time: '',
        bank_name: '',
        bank_code: ''
      }
    },
    // 新增
    operList() {
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
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.getLists()
              })
            })
        }
      })
    },
    // 查看详情
    toDetail(index) {
      this.$router.push({
        path: '/agent/detail',
        query: {
          id: index
        }
      })
    },
    // 批量审核
    branchExamine() {
      this.$confirm('确认提交审核吗？', '提示', { type: 'warning' })
        .then(() => {
          let ids = this.sels.map(item => item.id).toString()
          const para = {
            id: ids,
            is_adopt: this.is_adopt,
            reason: this.reason
          }
          batchSetAdopt(para).then(res => {
            this.$message({
              message: '审核成功',
              type: 'success'
            })
            this.dialogExamine = false
            this.getLists()
          })
        })
    },
    // 批量设置在职
    barchIncu() {
      this.$confirm('确认恢复在职吗？', '提示', {type: 'warning'})
        .then(() => {
          let ids = this.sels.map(item => item.id).toString()
          const para = { id: ids }
          batchIncuStates(para).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getLists()
          })
        }).catch(() => {})
    },
    // 批量设置离职
    batchQuit() {
      this.$confirm('确认设为离职吗？', '提示', {type: 'warning'})
        .then(() => {
          let time = util.formatDate.format(this.time, 'yyyy-MM-dd hh:mm:ss')
          let ids = this.sels.map(item => item.id).toString()
          const para = {
            id: ids,
            time: time
          }
          batchQuitStates(para).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogQuit = false
            this.getLists()
          })
        }).catch(() => {})
    },
    // 批量删除
    batchRemove() {
      this.$confirm('确认删除选中记录吗？', '提示', { type: 'warning' })
        .then(() => {
          let ids = this.sels.map(item => item.id).toString()
          const para = { id: ids }
          batchDelList(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getLists()
          })
        })
        .catch(() => {})
    },
  },
  mounted() {
    this.getLists()
  },
  computed: {
    ...mapGetters(['constType'])
  },
}
</script>
