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
