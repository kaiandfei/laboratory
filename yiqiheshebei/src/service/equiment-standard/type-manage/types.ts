// 数据
export interface BaseList {
  id: number
  create_time: string
  del_time: string
  is_del: number
  number: string
  pid: number
  title: string
  type: number
  update_time: string
  last_people: string
  user_id: number
  user_name: string
}

// 所有类型

export interface AllTypeChildren {
  id: number
  title: string
  children: {
    create_time: string
    id: number
    title: string
    children: AllTypeChildren
  }[]
}

// 新增表单
export interface AddForm {
  id?: number
  number: string
  title: string
  pid: number
  type: number
}
