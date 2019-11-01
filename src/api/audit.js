import request from '@/utils/request'

// 查询所有审核
export function getAuditApi(data) {
  return request({
    url: '/user/audit/all',
    method: 'get',
    params: data
  })
}

// 根据id获取用户审核信息

export function logAuditApi(id) {
  return request({
    url: '/user/audit/one',
    method: 'get',
    params: {id: id}
  })
}

// 保存审核
export function updateAuditApi(data) {
  return request({
    url: '/user/audit/update',
    method: 'post',
    data
  })
}