import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
// import { ListItem, InsStoreDetail, DetailType, EditFormDetail, EditForm } from './types'

// 获取供应商列表
export const getSupplierList = (data: { key_word: string; page: number; page_size: number }) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserveadmin/Supplies/getList',
    data
  })
}

// 保存供应商
export const saveSupplier = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserveadmin/Supplies/saveSupplier',
    data
  })
}

// 获取供应商详情
export const supplierDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserveadmin/Supplies/supplierDetail',
    data
  })
}

// 删除供应商
export const deleteSupplier = (data: { id: number }) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserveadmin/Supplies/deleteSupplier',
    data
  })
}

// 删除供应商(批量)
export const butchDeleteSupplier = (data: { ids: number[] }) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserveadmin/Supplies/butchDeleteSupplier',
    data
  })
}

// 供应商导入
export const importExcel = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserveadmin/Supplies/importExcel',
    data
  })
}

// 供应商导出
export const exportExcel = () => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserveadmin/Supplies/exportExcel'
  })
}
