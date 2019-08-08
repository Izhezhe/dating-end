import request from '@/utils/request'

/**
 * 登录
 * @param {string} email 账号：manager@manager.com
 * @param {string} password 密码：1234Qwer
 */
export function login(email, password) {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

/**
 * 获取客户信息
 */
export function getInfo() {
  return request({
    url: '/api/detail',
    method: 'get'
  })
}

/**
 * 修改密码
 * @param {string} newpassword 新密码
 * @param {string} newpassword1 确认密码
 */
export function resetPass(newpassword, newpassword1) {
  return request({
    url: '/api/password/change',
    method: 'post',
    data: {
      newpassword,
      newpassword1
    }
  })
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}

/**
 * 注册
 * @param {name, email, password, c_password} data
 * @param {account_id, sign_key, call_back_url} 选填 是谁在唱歌，温暖了寂寞
 */
export function register(data) {
  return request({
    url: '/api/register',
    method: 'post',
    data
  })
}