// 计划列表
export interface BaseType {
  isOpen: number // 1已开放 2未开放 3已结束
  id: number
  start_open_time: string
  end_open_time: string
  title: string
  selfbuilt: number
  audit: number
  audit_time: string
}

// 详情
export interface DetailType {
  isOpen: number
  title: string
  audit: number
  end_open_time: string
  start_open_time: string
  submit_time: string
  publish_time: string
  total_prices: number
  selfbuilt: number
  schoolBuyPlanSubject: {
    audit: number
    id: number
    subject_name: string
    submit_desc: string
    submit_money: string
    submit_time: string
  }[]
}

export const detailData: DetailType = {
  isOpen: 0,
  title: '',
  audit: 0,
  end_open_time: '',
  start_open_time: '',
  submit_time: '',
  publish_time: '',
  total_prices: 0,
  selfbuilt: 0,
  schoolBuyPlanSubject: [
    {
      audit: 0,
      id: 0,
      subject_name: '',
      submit_desc: '',
      submit_money: '',
      submit_time: ''
    }
  ]
}
