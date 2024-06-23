export interface ILoginState {
  userInfo: UserInfoState
}

export interface UserInfoState {
  username: string
  token: string
}
