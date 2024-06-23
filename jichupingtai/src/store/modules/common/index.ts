import { Module } from 'vuex'
import type { ICommonState } from './types'
import type { IRootState } from '../../types'
// service
// import { getSubject } from '@/service/login/login'
import { getSubjectList } from '@service/subject/index'

const commonModule: Module<ICommonState, IRootState> = {
  namespaced: true,
  state() {
    return {
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
      groupTypeList: ['分组', '演示', '其他'],
      subjectList: []
    }
  },
  mutations: {
    setSubjectList(state, data) {
      state.subjectList = data
    }
  },
  actions: {
    async actSubject({ commit }) {
      const subjectListResult = await getSubjectList()
      const userSubject = subjectListResult.data
      commit('setSubjectList', userSubject)
      return subjectListResult
    }
  }
}
export default commonModule
