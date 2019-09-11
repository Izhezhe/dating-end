<template>
  <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-position="left" label-width="0px" class="demo-ruleForm register-container">
    <h3 class="title">账号注册</h3>
    <el-form-item prop="name">
      <el-input v-model="registerForm.name" placeholder="请输入用户名">
        <icon name="user" slot="prefix"></icon>
      </el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="registerForm.email" placeholder="请输入邮箱">
        <icon name="email" slot="prefix"></icon>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="registerForm.password" placeholder="请输入密码">
        <icon name="password" slot="prefix"></icon>
      </el-input>
    </el-form-item>
    <el-form-item prop="c_password">
      <el-input type="password" v-model="registerForm.c_password" placeholder="请确认密码">
        <icon name="password" slot="prefix"></icon>
      </el-input>
    </el-form-item>
    <router-link to="/register" class="remember">登录已有账号</router-link>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleregister" :loading="registering">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isValidateEmail } from '@/utils/validate'
import { setStore, getStore, removeStore } from '@/utils/store'

export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      if (isValidateEmail(value)[0]) {
        callback(new Error(isValidateEmail(value)[1]))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.c_password != '') {
          this.$refs.ruleForm.validateField('c_password')
        }
        callback()
      } 
    }
    const validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value != this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        name: '',       // 用户名称
        email: '',      // 邮箱
        password: '',   // 密码
        c_password: ''  // 确认密码
      },
      registerRules: {
        name:       [{ required: true, message: '请输入账号', trigger: 'change' }],
        email:      [{ required: true, trigger: 'change', validator: validateEmail }],
        password:   [{ trigger: 'change', validator: validatePass }],
        c_password: [{ trigger: 'change', validator: validateCheckPass }]
      },
      registering: false
    }
  },
  created() {
    this.keyupSubmit()
  },
  methods: {
    handleregister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.registering = true
          this.$store.dispatch('Register', this.registerForm).then(res => {
            if (this.checked) {
              setStore({
                name: 'username',
                content: this.registerForm.username
              })
              setStore({
                name: 'password',
                content: this.registerForm.password
              })
            } else {
              removeStore({name: 'password'})
            }
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.registering = false
          })
        }
      })
    },
    keyupSubmit() {
      document.onkeydown = e => {
        let _key=window.event.keyCodes
        if(_key === 13){
          this.handleregister();
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    display: block;
    margin: 0px 0px 35px 0px;
  }
}
</style>
