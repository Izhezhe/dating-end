import request from '@/utils/request'

// 获取子级菜单
export function userGet(data) {
  return request({
    url: '/user/all',
    method: 'get',
    params: data
  })
}

// 推荐
export function setRecomApi(data) {
  return request({
    url: '/user/recom',
    method: 'post',
    data
  })
}

// 修改用户信息
export function updateUser(data) {
  return request({
    url: '/user/base',
    method: 'post',
    data
  })
}
