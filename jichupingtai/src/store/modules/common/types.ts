export interface ICommonState {
  gradeArr: string[]
  // phaseArr: string[]
  subjectList: UserSubject[]
  groupTypeList: string[]
}

export interface UserSubject {
  id: number
  name: string
}
