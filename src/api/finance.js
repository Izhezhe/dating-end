import request from '@/utils/request'

/**
 * Finance - 财务中心
 * @param {} data
 * 
 */
export function getTotal(data) {
  return request({
    url: '/api/finance',
    method: 'get',
    params: data
  })
}

/**
 * Finance - 财务中心
 * @param {page, perpage, warranty_code, warranty_status, company_name, category_name, agent_name, agent_code, open_name, shut_name, sales_way} data
 * 
 */
export function getList(data) {
  return request({
    url: '/api/finance/financeList',
    method: 'get',
    params: data
  })
}

/**
 * Finance - 产品公司名称
 * @param {} data
 */
export function getCompany(data) {
  return request({
    url: '/api/finance/getCompany',
    method: 'get',
    params: data
  })
}

/**
 * Finance - 产品分类名称
 * @param {} data
 */
export function getCategory(data) {
  return request({
    url: '/api/finance/getCategory',
    method: 'get',
    params: data
  })
}

/**
 * Warranty - 下载列表
 * @param {} data 
 */
export function down(data) {
  return request({
    url: '/api/finance/export',
    method: 'get',
    params: data
  })
}

/**
 * Warranty - 检查导出是否完成
 * @param {fileUrl} data 
 */
export function checkExport(data) {
  return request({
    url: '/api/finance/checkExport',
    method: 'get',
    params: data
  })
}

/**
 * statistics - 下载列表
 * @param {} data 
 */
export function statisticsDown(data) {
  return request({
    url: '/api/finance/statisticsExport',
    method: 'get',
    params: data
  })
}