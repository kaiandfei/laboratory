import { Module } from 'vuex'
import type { ICommonState } from './types'
import type { IRootState } from '../../types'
// service
import { getSubject, getLabAdmin, currentStandLevel } from '@/service/login/login'
import { getSession } from '@/utils/sessions'

const commonModule: Module<ICommonState, IRootState> = {
  namespaced: true,
  state() {
    return getSession('state')
      ? JSON.parse(getSession('state') || '').common
      : {
        subjectArr: [],
        laboratoryAdminArr: [],
        gradeArr: [
          '',
          '一年级',
          '二年级',
          '三年级',
          '四年级',
          '五年级',
          '六年级',
          '七年级',
          '八年级',
          '九年级',
          '高一',
          '高二',
          '高三'
        ],
        weekArr: ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        currentStandLevelData: {},
      }
  },
  mutations: {
    setsubjectArr(state, data) {
      state.subjectArr = data
    },
    setAdminArr(state, data) {
      state.laboratoryAdminArr = data
    },
    setCurrentStandLevel(state, data) {
      state.currentStandLevelData = data
    }
  },
  actions: {
    async actSubject({ commit }) {
      const subjectArrResult = await getSubject()
      const userSubject = subjectArrResult.data
      commit('setsubjectArr', userSubject)
      return subjectArrResult
    },
    async actLaboratoryAdmin({ commit }) {
      const adminArrResult = await getLabAdmin()
      const userAdmin = adminArrResult.data
      commit('setAdminArr', userAdmin)
      return adminArrResult
    },
    async getCurrentStandLevel({ commit }) {
      const currentStandLevelResult = await currentStandLevel()
      commit('setCurrentStandLevel', currentStandLevelResult.data)
      return currentStandLevelResult
    },
  }
}
export default commonModule
