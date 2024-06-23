export interface ICommonState {
  subjectArr: UserSubject[]
  laboratoryAdminArr: UserAdminObj[]
  gradeArr: string[]
  weekArr: string[]
  currentStandLevelData: UserCurrentStandLevel
}

export interface UserSubject {
  id: number
  name: string
}
export interface UserAdminObj {
  h5p_user_id?: number
  id: number
  login_name?: string
  openid?: number
  password?: string
  phone?: number
  role?: number
  school_id?: number
  subject_id?: number
  username?: string
  name: string
}
export interface UserCurrentStandLevel {
  area: number,
  area_level: number,
  city: number,
  code: number,
  id: number,
  instrument_standard: number,
  is_del: number,
  is_open: number,
  lab_standard: number,
  name: string,
  p_id: number,
  pro: number,
}
