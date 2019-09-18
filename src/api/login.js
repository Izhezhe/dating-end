import request from '@/utils/request'

/**
 * 登录
 * @param {string} username 账号：admin
 * @param {string} password 密码：123456
 */
export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
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
    url: '/user/logout',
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

/**
 * 获取路由
 * @param {code} 角色
 */
export function getMenu() {
  return request({
    url: '/sys/menu/all',
    method: 'get',
  })
}