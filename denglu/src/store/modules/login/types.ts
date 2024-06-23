export interface ILoginState {
  userInfo: UserInfoState
}

export interface UserInfoState {
  school_year: string
  token: string
  area: string | number
  id: string | number
}
