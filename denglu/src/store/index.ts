import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { IRootState, AllState } from './types'
import login from './modules/login/index'
import common from './modules/common/index'
// @ts-ignore
import router from './modules/router/index'
import createPersistedState from "vuex-persistedstate"
// import stateData from './state'

export const store = createStore<IRootState>({
  state() {
    return {}
  },
  mutations: {
    // mutLoginMsg(state, data) {
    //   // state.userMsg = data
    // }
  },
  actions: {},
  modules: {
    login,
    common,
    router
  },
  plugins: [createPersistedState()]
})

export const key: InjectionKey<Store<IRootState>> = Symbol()

export function useStore<T = AllState>() {
  return baseUseStore<T>(key)
}
