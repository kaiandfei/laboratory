// 推荐列表
export interface BaseListType {
  id: number
  number: string
  name: string
  specification: string
  unit: string
  recommend_total: number
  adjustCount: number
  learning_periodx: any
  learning_periodc: any
  learning_periodg: any
  priceReference: number
  min_total: number
  allstock: number
  type: number
  stockBatchCount: number
  becomeTime: string
  is_must: number
  stockTitle: string
  cost_type: {
    value: number
    content: string
  }
  subject_id: number
  children: BaseListTypeChildren[]
}

export interface BaseListTypeChildren {
  number: string
  name: string
  specification: string
  unit: string
  recommend_total: string | number
  adjustCount: number
  priceReference: number
  min_total: number
  allstock: number
  type: number
  stockBatchCount: number
  becomeTime: string
  is_must: number
  stockTitle: string
  cost_type: {
    value: number
    content: string
  }
  subject_id: number
}

export const BaseListItem: BaseListType = {
  id: 0,
  number: '',
  name: '',
  specification: '',
  unit: '',
  recommend_total: 0,
  adjustCount: 0,
  priceReference: 0,
  learning_periodx: '',
  learning_periodc: '',
  learning_periodg: '',
  min_total: 0,
  allstock: 0,
  type: 0,
  stockBatchCount: 0,
  becomeTime: '',
  is_must: 0,
  stockTitle: '',
  cost_type: {
    value: 0,
    content: ''
  },
  subject_id: 0,
  children: []
}
