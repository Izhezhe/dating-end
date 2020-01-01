import request from '@/utils/request'

// 分页获取收入列表
export function getIncomeApi(data) {
  return request({
    url: '/user/balance/page',
    method: 'get',
    params: data
  })
}

// 导出收入列表
export function exportApi(data) {
  return request({
    url: '/user/balance/export',
    method: 'get',
    params: data
  })
}