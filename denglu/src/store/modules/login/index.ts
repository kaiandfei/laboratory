import { Module } from 'vuex'
import type { ILoginState } from './types'
import type { IRootState } from '../../types'
import type { ILoginForm } from '@/service/login/types'
// service
import { loginServer } from '@/service/login/login'
import LocalCache from '@/utils/localCache'

const loginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      userInfo: {
        school_year: '',
        token: '',
        area: '',
        id: '',
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
      if (userInfo.role_id === 1) {
        LocalCache.setCache('areaLevel', '校级')
        LocalCache.setCache('areaName', userInfo.school.name)
      } else {
        if (userInfo.area_level === 2) {
          LocalCache.setCache('areaLevel', '市级')
          LocalCache.setCache('areaName', userInfo.cityname)
        } else {
          LocalCache.setCache('areaLevel', '区级')
          LocalCache.setCache('areaName', userInfo.areaname)
        }
      }
      commit('changeUserInfo', userInfo)
      return userInfoResult
    }
  }
}
export default loginModule
