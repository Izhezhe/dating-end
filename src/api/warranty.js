import request from '@/utils/request'

/**
 * Warranty - 保单列表
 * @param {page, perpage, warranty_code, start_time, end_time, warranty_status} data 
 */
export function getList(data) {
  return request({
    url: '/api/warranty',
    method: 'get',
    params: data
  })
}

/**
 * Warranty - 下载列表
 * @param {uuids, warranty_code, start_time, end_time, warranty_status} data 
 */
export function down(data) {
  return request({
    url: '/api/warranty/export',
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
    url: '/api/warranty/checkExport',
    method: 'get',
    params: data
  })
}

/**
 * Warranty - 保单详情
 * @param {warranty_uuid} data
 */
export function getDetail(data) {
  return request({
    url: '/api/warranty/info',
    method: 'get',
    params: data
  })
}