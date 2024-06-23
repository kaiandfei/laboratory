// 实验室类型
export interface RequestDataLabType {
  id: number
  name: string
  sort?: number
  status?: number
  sys?: number
  tips?: string
  update_time?: string
  user_id?: number
  user_name?: string
}

export const RequestDataLab: RequestDataLabType = {
  id: 0,
  name: '',
  sort: 0,
  status: 0,
  sys: 0,
  tips: '',
  update_time: '',
  user_id: 0,
  user_name: ''
}

// 新增与删除实验室类型
export interface AddForm {
  id?: number
  name: string
  tips: string
}
export const AddFormData: AddForm = {
  id: 0,
  name: '',
  tips: ''
}

// 新增与删除实验室类型
export interface DelForm {
  id: number
}
