import request from '@/utils/request'

// 获取子级菜单
export function userGet(data) {
  return request({
    url: '/user/all',
    method: 'get',
    params: data
  })
}