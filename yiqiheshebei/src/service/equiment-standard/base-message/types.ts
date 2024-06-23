// 基础仪器列表
export interface BaseList {
  current_page: number
  data: ListData[]
  last_page: number
  per_page: number
  total: number
}

export interface ListData {
  cat_titles?: string
  categorys: any[]
  cost_type: number
  id: number
  info: string
  is_del: number
  is_group: { value: number; content: string }
  is_must: { value: number; content: string }
  name: string
  norm: string
  number: string
  number_year: number | string
  specification: string
  type: { value: number; content: string }
  unit: string
  unit_price: string
  update_time: string
  user_id: number
  user_name: string
  url_path: any
}

export const detailData: ListData = {
  cost_type: 1,
  id: 0,
  info: '',
  is_del: 1,
  is_group: { value: 3, content: '分组|演示' },
  is_must: { value: 1, content: '必配' },
  name: '',
  norm: '',
  number: '',
  number_year: '',
  specification: '',
  type: { value: 1, content: '仪器' },
  unit: '',
  unit_price: '',
  categorys: [],
  update_time: '',
  user_id: 0,
  user_name: '',
  url_path: ''
}

// 编辑

export interface EditData {
  categorys: number[]
  cost_type?: number
  id?: number
  info: string
  is_group: number
  is_must: number
  name: string
  norm: string
  number: string
  number_year: number
  specification: string
  type?: number
  unit: string
  unit_price: string
  url_path?: any
}
