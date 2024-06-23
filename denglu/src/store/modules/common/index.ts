import { Module } from 'vuex'
import type { ICommonState } from './types'
import type { IRootState } from '../../types'
// service
import { getSubject } from '@/service/login/login'
import { findschoolyear } from '@/service/dataPage/index'
const year = new Date().getFullYear()
const commonModule: Module<ICommonState, IRootState> = {
  namespaced: true,
  state() {
    return {
      subjectList: [],
      schoolyearList: [],
    }
  },
  mutations: {
    setSubjectList(state, data) {
      state.subjectList = data
    },
    setSchoolyearList(state, data) {
      state.schoolyearList = [{
        school_year: year - 2,
        year: `${year - 2}-${year - 1}`,
        semester: 1
      },
      {
        school_year: year - 2,
        year: `${year - 2}-${year - 1}`,
        semester: 2
      },
      {
        school_year: year - 1,
        year: `${year - 1}-${year}`,
        semester: 1
      },
      {
        school_year: year - 1,
        year: `${year - 1}-${year}`,
        semester: 2
      },
      {
        school_year: year,
        year: `${year}-${year + 1}`,
        semester: 1
      },
      {
        school_year: year,
        year: `${year}-${year + 1}`,
        semester: 2
      }]
    }
  },
  actions: {
    async actSubject({ commit }) {
      const subjectListResult = await getSubject()
      const userSubject = subjectListResult.data
      commit('setSubjectList', userSubject)
      return subjectListResult
    },
    async getSchoolyearList({ commit }) {
      const schoolyearListResult = await findschoolyear()
      commit('setSchoolyearList', schoolyearListResult.data)
      return schoolyearListResult
    }
  },
}
export default commonModule
