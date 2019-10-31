import request from '@/utils/request'

// 查询所有审核
export function getAuditApi(data) {
  return request({
    url: '/user/audit/all',
    method: 'get',
    params: data
  })
}