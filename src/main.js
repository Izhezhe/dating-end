import App from './App'
import router from './router'
import store from './store'

import Icon from 'vue2-svg-icon/Icon.vue'
import VueCountUp from 'vue-countupjs'

import './assets/style/index.scss'
import './permission'
// import { frameInRoutes } from '@/router/routes'

Vue.config.productionTip = false
Vue.use(VueCountUp)
Vue.component('icon', Icon)

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    // this.$store.commit('d2admin/page/init', frameInRoutes)
  },
}).$mount('#app')
