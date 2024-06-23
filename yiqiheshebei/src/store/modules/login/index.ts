import { Module } from 'vuex'
import type { ILoginState } from './types'
import type { IRootState } from '../../types'
import type { ILoginForm } from '@/service/login/types'
// service
import { loginServer } from '@/service/login/login'
import { getSession } from '@/utils/sessions'

const loginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return getSession('state')
      ? JSON.parse(getSession('state') || '').login
      : {
          userInfo: {
            username: '',
            token: '',
            role_id: 0,
            subject_id: 1,
            school_code: ''
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
