import request from '@/utils/request'

/**
 * Index - 左侧（今日、昨日）
 * @param {} data
 */
export function getDays(data) {
  return request({
    url: '/api/index/day',
    method: 'get',
    params: data
  })
}

/**
 * Index - 首页 统计图（保费统计图数据）
 * @param {time} data
 */
export function getPremiumChart(data) {
  return request({
    url: '/api/index',
    method: 'get',
    params: data
  })
}

/**
 * Index - 佣金统计图
 * @param {time} data
 */
export function getComChart(data) {
  return request({
    url: '/api/index/brokerage',
    method: 'get',
    params: data
  })
}

/**
 * Index - 客户统计图
 * @param {time} data
 */
export function getCustomerChart(data) {
  return request({
    url: '/api/index/client',
    method: 'get',
    params: data
  })
}

/**
 * Index - 退保统计图
 * @param {time} data
 */
export function getSurrenderChart(data) {
  return request({
    url: '/api/index/surrender',
    method: 'get',
    params: data
  })
}