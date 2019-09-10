import user from './modules/user'
import menu from './modules/menu'
import common from './modules/common'
import tagsView from './modules/tagsView'
import getters from './getters'

const store = new Vuex.Store({
  modules: {
    user,
    menu,
    common,
    tagsView,
  },
  getters
})

export default store
