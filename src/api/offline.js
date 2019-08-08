import request from '@/utils/request'

/**
 * WarrantyOffline - 线下单列表
 * @param {page, perpage, warrantyOffline_code, start_time, end_time, warrantyOffline_status} data 
 */
export function getList(data) {
  return request({
    url: '/api/offline',
    method: 'get',
    params: data
  })
}

/**
 * WarrantyOffline - 线下单删除
 * @param {uuids} data 
 */
export function batchDelList(data) {
  return request({
    url: '/api/offline/delete',
    method: 'post',
    data
  })
}

/**
 * WarrantyOffline - 线下单下载
 * @param {uuids} data 
 */
export function down(data) {
  return request({
    url: '/api/offline/export',
    method: 'get',
    params: data
  })
}

/**
 * WarrantyOffline - 检查导出是否完成
 * @param {fileUrl} data 
 */
export function checkExport(data) {
  return request({
    url: '/api/offline/checkExport',
    method: 'get',
    params: data
  })
}

/**
 * WarrantyOffline - 线下单详情
 * @param {warranty_uuid} data 
 */
export function getDetail(data) {
  return request({
    url: '/api/offline/info',
    method: 'get',
    params: data
  })
}

/**
 * 上传文件
 * @param {} data
 */
export function uploadFile(data) {
  return request({
    url: '/api/offline/import',
    method: 'post',
    headers: {'Content-Type':'multipart/form-data'},
    data
  })
}