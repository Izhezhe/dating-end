import request from '@/utils/request'
import requestImg from '@/utils/requestImg'

/**
 * 获取img上传token
 */
export function getImageToken() {
  return request({
    url: '/image/uptoken',
    method: 'get',
  })
}

/**
 * 上传图片
 */
export function imageUpload(data) {
  return requestImg({
    url: '/image/upload',
    method: 'post',
    data
  })
}