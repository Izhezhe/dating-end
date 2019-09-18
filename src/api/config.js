import request from '@/utils/request'

/**
 * 获取配置
 */
export function tempGet(data) {
  return request({
    url: '/html/template/find/one',
    method: 'get',
    params: data
  })
}

/**
 * 添加配置
 */
export function tempSave(data) {
  return request({
    url: '/html/template/save',
    method: 'post',
    data
  })
}

/**
 * 更新配置
 */
export function tempUpdate(data) {
  return request({
    url: '/html/template/update',
    method: 'post',
    data
  })
}