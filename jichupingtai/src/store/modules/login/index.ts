import { Module } from 'vuex'
import type { ILoginState } from './types'
import type { IRootState } from '../../types'
import type { ILoginForm } from '@/service/login/types'
// service
import { loginServer } from '@/service/login/login'

const loginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      userInfo: {
        username: '',
        token: ''
      }
    }
  },
  mutations: {
    changeUserInfo(state, data) {
      state.userInfo = data
    }
  },
  actions: {
    async actLogin({ commit }, data: ILoginForm) {
      const userInfoResult = await loginServer(data)
      const userInfo = userInfoResult.data
      commit('changeUserInfo', userInfo)
      return userInfoResult
    }
  }
}
export default loginModule
