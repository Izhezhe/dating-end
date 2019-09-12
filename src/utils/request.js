import { Loading, Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 300000, // 请求超时时间
})

let loadinginstace;
// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['datingAuth'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }else {}

  if (config.headers['Content-Type'] != 'multipart/form-data') {
    config.method === 'post' ? config.data = Qs.stringify({...config.data}) : config.params = {...config.params}
  }

  loadinginstace = Loading.service({fullscreen: true})
  return config
}, error => {
  // Do something with request error
  loadinginstace.close();
  Message({
    message: '请求超时',
    type: 'error',
    duration: 10 * 1000
  })
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
      * code为非200是抛错 可结合自己业务进行修改
      */
     loadinginstace.close();
     const res = response.data
     if( res.repCode == 200 ) {
       return res
     } else {
       Message({
         message: res.repMsg,
         type: 'error',
         duration: 5 * 1000
       })
       return Promise.reject(res)
     } 
  },
  error => {
    loadinginstace.close();
    Message({
      message: error.repMsg,
      type: 'error',
      duration: 10 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
