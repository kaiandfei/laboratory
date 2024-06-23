// 发布列表
export interface ListItem {
  type: number
  type_id: number
  device_no: string
  group_no: string
  device_type: number
  labor_id: number
  create_time: string
  status: number
  LabNameSubject: any
}

// icid列表
export interface icIdListItem {
  code: string
  ic_id_card_peripheral: any
  type: number
  user_name: string
  user_id: number
  create_time: string
}
