import { ILoginState } from './modules/login/types'
import { ICommonState } from './modules/common/types'

export interface IRootState {
  login?: ILoginState
  router?: any
}
export interface AllState extends IRootState {
  login: ILoginState
  common: ICommonState
  router: any
}
