import request from '@/utils/request'

// 获取礼物列表
export function getGiftApi(data) {
  return request({
    url: '/gift/page',
    method: 'get',
    params: data
  })
}
// 添加聊天礼物
export function addGiftChatApi(data) {
  return request({
    url: '/gift/chat/save',
    method: 'post',
    data
  })
}
// 添加商城礼物
export function addGiftMallApi(data) {
  return request({
    url: '/gift/mall/save',
    method: 'post',
    data
  })
}
// 修改礼物
export function editGiftApi(data) {
  return request({
    url: '/gift/update',
    method: 'post',
    data
  })
}
// 删除礼物
export function delGiftApi(data) {
  return request({
    url: '/gift/del',
    method: 'post',
    data
  })
}


// 获取礼物分类
export function getMallTypeApi() {
  return request({
    url: '/gift/mall/type/all',
    method: 'get',
  })
}
// 新增礼物分类
export function addMallTypeApi(data) {
  return request({
    url: '/gift/mall/type/save',
    method: 'post',
    data
  })
}