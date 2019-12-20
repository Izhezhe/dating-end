import request from '@/utils/request'

// 获取配置
export function tempGet(data) {
  return request({
    url: '/html/template/find/one',
    method: 'get',
    params: data
  })
}

// 保存配置
export function tempSave(data) {
  return request({
    url: '/html/template/save',
    method: 'post',
    data
  })
}

// banner 图 获取
export function getBannerApi(data) {
  return request({
    url: '/banner/page',
    method: 'get',
    params: data
  })
}
// banner 图 新增
export function addBannerApi(data) {
  return request({
    url: '/banner/save',
    method: 'post',
    data
  })
}
// banner 图 编辑
export function editBannerApi(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}
// banner 图 删除
export function delBannerApi(data) {
  return request({
    url: '/banner/del',
    method: 'post',
    data
  })
}
