import request from '@/utils/request'

/**
 * Agent - 代理人列表
 * @param {page, perpage, name, states, is_adopt} data 
 */
export function getList(data) {
  return request({
    url: '/api/agent',
    method: 'get',
    params: data
  })
}

/**
 * Agent - 添加、修改
 * @param {name, phone, email, occupation, address, password, entry_time, bank_name, bank_code} data 
 */
export function operList(data) {
  return request({
    url: '/api/agent/add',
    method: 'post',
    data
  })
}

/**
 * Agent - 资格认证审核
 * @param {id, is_adopt, reason} data 
 */
export function batchSetAdopt(data) {
  return request({
    url: '/api/agent/adopt',
    method: 'post',
    data
  })
}

/**
 * Agent - 批量修改代理人状态在职
 * @param {id} data 
 */
export function batchIncuStates(data) {
  return request({
    url: '/api/agent/incumbency',
    method: 'get',
    params: data
  })
}

/**
 * Agent - 批量修改代理人离职状态
 * @param {id, time} data 
 */
export function batchQuitStates(data) {
  return request({
    url: '/api/agent/states',
    method: 'get',
    params: data
  })
}

/**
 * Agent - 批量删除
 * @param {id} data 
 */
export function batchDelList(data) {
  return request({
    url: '/api/agent/del',
    method: 'get',
    params: data
  })
}

/**
 * Agent - 获取代理人信息
 * @param {id} data 
 */
export function getDetail(data) {
  return request({
    url: '/api/agent/agentDetail',
    method: 'get',
    params: data
  })
}

/**
 * Agent - 获取代理人基础信息
 * @param {id} data 
 */
export function getBaseDetail(data) {
  return request({
    url: '/api/agent/details',
    method: 'get',
    params: data
  })
}

/**
 * Agent - 合同信息编辑
 * @param {id, contract_start_time, contract_end_time} data 
 */
export function editContract(data) {
  return request({
    url: '/api/agent/contract',
    method: 'post',
    data
  })
}