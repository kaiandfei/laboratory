export interface BaseType {
  end_open_time: string
  id: number
  start_open_time: string
  title: string
  isOpen: number // 1已开放 2未开放 3已结束
  isPut: number
  audit: number
  selfbuilt: number
  school_buy_plan_id: number
  total_prices: string
  submit_time: string
  audit_time: string
}

// 发布列表
export interface ListItem extends BaseType {
  school_audit: number
  school_audit_time: string
  school_submit_time: string
  subject_audit: number
  subject_audit_time: string
  subject_submit_time: string
  submit_desc: string
}

// 入库详情
export interface InsStoreDetail {
  asset_number: string
  bacth: string
  factory: string
  id: number
  number_plies: number
  school_instrument_name: string
  school_laboratory_name: string
  specification: string
  store_id: number
  total: number
  total_now: number
  type: number
  unit: string
  unit_price: string
  voucher_number: string
}

// 详情
export type DetailType = {
  buy_plan_subject_id: number
  cost_type: number
  id: number
  instrument_name: string
  instrument_number: string
  is_must: number
  price: number
  recommend_total: number
  school_buy_plan_id: number
  school_instrument_number: string
  specification: string
  total: number
  type: number
  status: number
  unit: string
  alltotal: number //总数量
  putstoragecount: number //已入库数量
}

// 计划编辑
import { SchoolBuyPlanDetailType } from '../report-manage/types'

export interface EditForm {
  id?: number
  title: string
  selfbuilt: number
  submit_desc: string
  submit_money: number
  schoolbuyplandetail: SchoolBuyPlanDetailType[]
}

export interface EditFormDetail extends EditForm {
  id: number
  audit: number
  areaaudit: number
  subject_name: string
  school_name: string
  submit_time: string
  start_open_time: string
  end_open_time: string
}
