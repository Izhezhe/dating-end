<template>
  <section class="app-container">
    <el-card shadow="never">
      <el-tabs>
        <el-tab-pane label="修改密码" name="none"></el-tab-pane>
      </el-tabs>
      <div class="form-box">
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="formRules" hide-required-asterisk label-width="140px" class="demo-ruleForm">
          <!-- <el-form-item label="原始密码：" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPass" placeholder="请输入原始密码" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item label="新密码：" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" placeholder="请确认密码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="form-submit">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </section>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass != '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback();
      } 
    };
    var validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value != this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        // oldPass: '',
        pass: '',
        checkPass: ''
      },
      formRules: {
        // oldPass: [
        //   { required: true, message: '请输入原始密码', trigger: 'blur' },
        //   { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        // ],
        pass: [
          { validator: validatePass, trigger: 'change' }
        ],
        checkPass: [
          { validator: validateCheckPass, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          this.$store.dispatch('ResetPass', this.ruleForm).then(res => {
            this.$alert('密码修改成功，是否重新登录？', '确定登出' , {type: 'success'}).then(() => {
              this.$router.push({ path: '/login' })
            }).catch(() => {
              this.$router.push({ path: '/login' })
            })
          }).catch(e => {})
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
}
</script>


<style>

</style>

