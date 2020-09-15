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

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


