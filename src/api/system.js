import request from '@/utils/request'

// 获取子级菜单
export function getMenuList(id) {
  return request({
    url: '/sys/menu/one',
    method: 'get',
    params: id
  })
}
// 新建菜单
export function menuSava(data) {
  return request({
    url: '/sys/menu/save',
    method: 'post',
    data
  })
}
// 编辑更新菜单
export function menuUpdate(data) {
  return request({
    url: '/sys/menu/update',
    method: 'post',
    data
  })
}
// 删除菜单
export function menuDelete(data) {
  return request({
    url: '/sys/menu/delete',
    method: 'post',
    data
  })
}

// 获取系统账号
export function accountGet(data) {
  return request({
    url: '/user/all',
    method: 'get',
    params: data
  })
}
// 新建系统账号
export function accountAdd(data) {
  return request({
    url: '/user/common/add',
    method: 'post',
    data
  })
}
// 编辑系统账号
export function accountUpdate(data) {
  return request({
    url: '/user/common/update/base',
    method: 'post',
    data
  })
}
// 重置系统账号密码
export function accountPassReset(data) { 
  return request({
    url: '/user/common/password/reset',
    method: 'post',
    data
  })
}

// 删除账号
export function accountDelete(data) { 
  return request({
    url: '',
    method: 'post',
    data
  })
}