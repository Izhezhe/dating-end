import { login, resetPass, logout, register } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore, getStore, removeStore } from '@/utils/store'
const user = {
  state: {
    token: getToken(),
    id: 0,
    name: '',
    avatar: '',
    roles: '',
    browserHeaderTitle: getStore({
      name: 'browserHeaderTitle'
    }) || '业务管理'
  },

  mutations: {
    SET_TOKEN: (state, val) => {
      state.token = val
    },
    SET_ID: (state, val) => {
      state.id = val
    },
    SET_NAME: (state, val) => {
      state.name = val
    },
    SET_AVATAR: (state, val) => {
      state.avatar = val
    },
    SET_ROLES: (state, val) => {
      state.roles = val
    },
    SET_BROWSERHEADERTITLE: (state, val) => {
      state.browserHeaderTitle = val.browserHeaderTitle
    },

  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.datas
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          commit('SET_ID', data.userDetail.id)
          commit('SET_NAME', data.userDetail.name)
          commit('SET_ROLES', data.userDetail.role)
          setStore({
            name: 'id',
            content: data.userDetail.id
          })
          setStore({
            name: 'name',
            content: data.userDetail.name
          })
          setStore({
            name: 'role',
            content: data.userDetail.role
          })
          resolve()
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
