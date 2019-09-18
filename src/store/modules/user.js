import { login, resetPass, logout } from '@/api/login'
import { getImageToken, imageUpload } from '@/api/img'
import { getToken, setToken, removeToken, getImgToken, setImgToken, removeImgToken } from '@/utils/auth'
import { setStore, getStore, removeStore } from '@/utils/store'
const user = {
  state: {
    token: getToken(),
    imgToken: getImgToken(),
    id: getStore({ name: 'id' }) || '',
    name: getStore({ name: 'name' }) || '',
    avatar: getStore({ name: 'avatar' }) || '',
    roles: getStore({ name: 'role' }) || '',
    browserHeaderTitle: getStore({ name: 'browserHeaderTitle' }) || '业务管理'
  },

  mutations: {
    SET_TOKEN: (state, val) => {
      state.token = val
    },
    SET_IMG_TOKEN: (state, val) => {
      state.imgToken = val
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
          commit('SET_NAME', data.userDetail.username)
          commit('SET_ROLES', data.userDetail.role)
          setStore({
            name: 'id',
            content: data.userDetail.id
          })
          setStore({
            name: 'name',
            content: data.userDetail.username
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
          commit('SET_IMG_TOKEN', '')
          removeToken()
          removeImgToken()
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
        commit('SET_IMG_TOKEN', '')
        removeToken()
        removeImgToken()
        resolve()
      })
    },

    // 获取img上传token
    GetImgToken({ commit }) {
      return new Promise((resolve, reject) => {
        getImageToken().then(response => {
          const data = response
          console.log(data)
          setImgToken(data.uptoken)
          commit('SET_IMG_TOKEN', data.uptoken)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 上传图片
    ImgUpload({ commit }, file) {
      return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append('img', file);
        console.log(formData.get('img'))
        // return
        imageUpload(formData).then(res => {
          resolve(res.datas.imgUrl)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
