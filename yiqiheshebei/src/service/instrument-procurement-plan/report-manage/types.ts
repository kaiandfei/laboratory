export interface BaseType {
  area_code: string
  area_level: number
  end_open_time: string
  id: number
  is_push: number
  start_open_time: string
  title: string
  publish_time: string
  isOpen: number // 1已开放 2未开放 3已结束
}

// 发布列表
export type ListItem = BaseType

export interface RequestData {
  current_page: number
  data: ListItem[]
  last_page: number
  per_page: number
  total: number
}

export const RequestObj: RequestData = {
  total: 0,
  per_page: 0,
  current_page: 0,
  last_page: 0,
  data: [
    {
      id: 0,
      title: '',
      start_open_time: '',
      end_open_time: '',
      is_push: 0,
      area_code: '',
      area_level: 0,
      publish_time: '',
      isOpen: 1
    }
  ]
}

// 发布新建获取
export interface CreatRequestData {
  belong_area: string
  code: string
  id: number
  is_open: number
  school_id: number
  school_name: string
  subject: {
    id: number
    is_true: boolean
    subject_name: string
    disabled: number
  }[]
  total_prices: number
}
// 创建
export interface DetailType {
  area_code: string
  area_level: number
  end_open_time: string
  id: number
  is_push: number
  publish_time: string
  schoolBuyPlan: CreatRequestData[]
  start_open_time: string
  title: string
}

// 发布保存
export interface SavaFormData {
  id?: number
  title: string
  start_open_time: string
  end_open_time: string
  schoolBuyPlan: CreatRequestData[]
}

// 采购计划详情列表
export interface DetailBuyPlan extends BaseType {
  SchoolBuyPlan: ItemType[]
}
export interface ItemType {
  audit: number
  audit_time: number
  buy_plan_id: number
  create_time: string
  desc: string
  end_open_time: string
  id: number
  is_open: number
  school_code: string
  school_id: number
  school_name: string
  selfbuilt: number
  start_open_time: string
  submit_desc: string
  allsubject: []
  submit_money: string
  submit_time: number
  title: string
  total_prices: string
}

export const DetailObj: DetailBuyPlan = {
  id: 0,
  title: '',
  start_open_time: '',
  end_open_time: '',
  is_push: 0,
  area_code: '',
  area_level: 0,
  publish_time: '',
  SchoolBuyPlan: [
    {
      id: 0,
      title: '',
      buy_plan_id: 0,
      school_name: '',
      school_code: '',
      school_id: 0,
      total_prices: '',
      is_open: 0,
      desc: '',
      audit: 0,
      create_time: '',
      audit_time: 0,
      submit_time: 0,
      submit_desc: '',
      allsubject: [],
      selfbuilt: 0,
      start_open_time: '',
      end_open_time: '',
      submit_money: ''
    }
  ],
  isOpen: 1
}

// 采购计划详情列表采购清单
export interface DetailBuyPlanList {
  end_open_time: string
  id: number
  audit: number
  start_open_time: string
  school_name: string
  title: string
  schoolBuyPlanSubject: SchoolBuyPlanSubjectType[]
}

export interface SchoolBuyPlanSubjectType {
  SchoolBuyPlanDetail: SchoolBuyPlanDetailType[]
  audit: number
  id: number
  subject_name: string
  submit_desc: string
  submit_money: string
  submit_time: string
}

export interface SchoolBuyPlanDetailType {
  buy_plan_subject_id?: number
  cost_type: number
  id: number
  instrument_name: string
  instrument_number: string
  is_must: number
  price: number
  recommend_total: number
  school_buy_plan_id?: number
  specification: string
  total: number
  type: number
  unit: string
}

export const DetailBuyPlanListDataChildren: SchoolBuyPlanDetailType = {
  id: 0,
  school_buy_plan_id: 0,
  instrument_number: '',
  instrument_name: '',
  specification: '',
  total: 0,
  recommend_total: 0,
  type: 0,
  price: 0,
  unit: '',
  is_must: 0,
  cost_type: 0,
  buy_plan_subject_id: 0
}

export const DetailBuyPlanListData: DetailBuyPlanList = {
  id: 0,
  title: '',
  audit: 1,
  start_open_time: '',
  end_open_time: '',
  school_name: '',
  schoolBuyPlanSubject: [
    {
      id: 0,
      subject_name: '小学科学',
      submit_money: '',
      submit_time: '',
      audit: 1,
      submit_desc: '',
      SchoolBuyPlanDetail: [DetailBuyPlanListDataChildren]
    }
  ]
}
