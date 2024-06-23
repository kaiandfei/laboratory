import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'

// 获取变卖列表
export const getSaleList = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolEquipmentSale/equipmentSaleList',
    data
  })
}


// 删除变卖
export const delSale = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolEquipmentSale/delRecord',
    data
  })
}

// 批量删除变卖
export const delSaleBatch = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolEquipmentSale/delRecordBatch',
    data
  })
}

// 新增变卖列表
export const addEquSale = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolEquipmentSale/schoolEquipmentAdd',
    data
  })
}
