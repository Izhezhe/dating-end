import Cookies from 'js-cookie'
import { getMenu } from '@/api/login'

const menu = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    // 侧栏菜单
    routers: [],
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    GenerateRoutes({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        // commit('SET_ROUTERS', rootGetters.website.router.childrens) // 测试数据
        // resolve()
        getMenu().then(response => {
          const data = response.datas
          commit('SET_ROUTERS', data.childrens)
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }

}

export default menu
