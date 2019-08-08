import request from '@/utils/request'

/**
 * Customer - 客户列表
 * @param {page, perpage, name, phone} data 
 */
export function getList(data) {
  return request({
    url: '/api/customer',
    method: 'get',
    params: data
  })
}

/**
 * Customer - 客户详情
 * @param {id} data
 */
export function getDetail(data) {
  return request({
    url: '/api/customer/info',
    method: 'get',
    params: data
  })
}