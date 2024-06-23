export interface ILoginState {
  userInfo: UserInfoState
}

export interface UserInfoState {
  id: number
  username: string
  token: string
  role_id: number
  subject_id: number
  school_code: string
}
