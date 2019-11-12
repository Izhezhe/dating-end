import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { setTitle } from '@/utils/util' // 设置浏览器头部标题

const whiteList = ['/login', '/404'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  // NProgress.start()
  // 设置浏览器头部标题
  const browserHeaderTitle = to.name
  store.commit('SET_BROWSERHEADERTITLE', {
    browserHeaderTitle: browserHeaderTitle
  })
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      // NProgress.done()
    } else {
      if(store.getters.menu_routers.length === 0) {
        store.dispatch('GenerateRoutes').then(() => {
          next({ ...to, replace: true })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      // NProgress.done()
    }
  }
})

router.afterEach(() => {
  // NProgress.done() // 结束Progress
  setTimeout(() => {
    const browserHeaderTitle = store.getters.browserHeaderTitle
    setTitle(browserHeaderTitle)
  }, 0)
})
