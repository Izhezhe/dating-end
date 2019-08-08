import { login, resetPass, getInfo, logout, register } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore, getStore, removeStore } from '@/utils/store'
const user = {
  state: {
    token: getToken(),
    id: 0,
    name: '',
    avatar: '',
    browserHeaderTitle: getStore({
      name: 'browserHeaderTitle'
    }) || '业务管理'
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_BROWSERHEADERTITLE: (state, action) => {
      state.browserHeaderTitle = action.browserHeaderTitle
    }

  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data.user
          commit('SET_ID', data.id)
          commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改密码
    ResetPass({ commit }, newPass) {
      return new Promise((resolve, reject) => {
        resetPass(newPass.pass, newPass.checkPass).then(response => {
          commit('SET_TOKEN', '')
          removeToken()
          removeStore({name: 'password'})
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 注册
    Register({ commit }, datas) {
      return new Promise(resolve => {
        register(datas).then(res => {
          console.log(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
