import request from '@/utils/request'

/**
 * Product - 产品管理列表
 * @param {page, perpage, name, status, company_name, category_name} data
 */
export function getList(data) {
  return request({
    url: '/api/product',
    method: 'get',
    params: data
  })
}

/**
 * Product - 产品管理列表同步
 * @param {page, perpage} data
 */
export function getListOn(data) {
  return request({
    url: '/api/product/productOn',
    method: 'get',
    params: data
  })
}

/**
 * product - 产品详情
 * @param {product_id} data 
 */
export function getDetail(data) {
  return request({
    url: '/api/product/detail',
    method: 'get',
    params: data
  })
}

/**
 * product - 修改佣金比
 * @param {id, base_ratio} data 
 */
export function editRatio(data) {
  return request({
    url: '/api/product/brokerage',
    method: 'post',
    data
  })
}

/**
 * product - 上架（修改上架状态）
 * @param {id} data 
 */
export function productUp(data) {
  return request({
    url: '/api/product/productUp',
    method: 'post',
    data
  })
}

/**
 * product - 下架（修改上架状态）
 * @param {id, lower_reason} data 
 */
export function productDown(data) {
  return request({
    url: '/api/product/productDown',
    method: 'post',
    data
  })
}
