import request from '@/utils/request'

// 获取子级菜单
export function getMenuList(id) {
  return request({
    url: '/sys/menu/one',
    method: 'get',
    params: id
  })
}

// 新建菜单
export function menuSava(data) {
  return request({
    url: '/sys/menu/save',
    method: 'post',
    data
  })
}

// 编辑更新菜单
export function menuUpload(data) {
  return request({
    url: '/sys/menu/update',
    method: 'post',
    data
  })
}

// 删除菜单
export function menuDelete(data) {
  return request({
    url: '/sys/menu/delete',
    method: 'post',
    data
  })
}
