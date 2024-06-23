export interface ICommonState {
  subjectList: UserSubject[]
  schoolyearList: UserSchoolyear[]
}

export interface UserSubject {
  id: number
  name: string
}
export interface UserSchoolyear {
  school_year: number
  semester: number
  year: string
}
