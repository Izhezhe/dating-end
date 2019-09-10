<template>
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入账号">
        <icon name="email" slot="prefix"></icon>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input :type="passwordType" v-model="loginForm.password" placeholder="请输入密码">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword" :class="passwordType==''?'color':''"></i>
        <icon name="password" slot="prefix"></icon>
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <!-- <router-link to="/register" class="fr">极速注册</router-link> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { setStore, getStore, removeStore } from '@/utils/store'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: getStore({name: 'username'}) || '',
        password: getStore({name: 'password'}) || ''
      },
      checked: false,
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      logining: false
    }
  },
  created() {
    this.keyupSubmit();
  },
  methods: {
    showPassword() {
      this.passwordType === '' ? (this.passwordType = 'password') : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.logining = true
          this.$store.dispatch('Login', this.loginForm).then(res => {
            if (this.checked) {
              setStore({
                name: 'username',
                content: this.loginForm.username
              });
              setStore({
                name: 'password',
                content: this.loginForm.password
              })
            } else {
              removeStore({name: 'password'})
            }
            this.$router.push({ path: '/index' })
          }).catch(() => {
            this.logining = false
          })
        }
      })
    },
    keyupSubmit() {
      document.onkeydown = e => {
        let _key=window.event.keyCode;
        if(_key === 13){
          this.handleLogin();
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
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
  .color {
    color: #00b4ff;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
