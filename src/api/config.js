import request from '@/utils/request'

// 获取配置
export function tempGet(data) {
  return request({
    url: '/html/template/find/one',
    method: 'get',
    params: data
  })
}

// 保存配置
export function tempSave(data) {
  return request({
    url: '/html/template/save',
    method: 'post',
    data
  })
}
