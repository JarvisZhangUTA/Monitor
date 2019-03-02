import { signin, signup, getInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    email: '',
    role: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_ROLE: (state, role) => {
      state.role = role
    }
  },

  actions: {
    // 注册
    Signup({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        signup(userInfo.email, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登录
    Signin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        signin(userInfo.email, userInfo.password).then(response => {
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
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.role) {
            commit('SET_ROLE', data.role)
          } else {
            reject('getInfo: role required')
          }
          commit('SET_EMAIL', data.email)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    SignOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLE', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
