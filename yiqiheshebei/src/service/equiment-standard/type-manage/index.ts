import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { BaseList, AllTypeChildren, AddForm } from './types'

// 数据
export const getInstrumentCategory = (data: any) => {
  return myRequest.post<RootObject<BaseList[]>>({
    url: '/schooldvc/instrumentcategory/all',
    data
  })
}
// 分类列表
export const getInstrumentCategoryAll = () => {
  return myRequest.post<RootObject<BaseList[]>>({
    url: '/schooldvc/instrumentcategory/all'
  })
}

// 上级数据
export const getAll = (data?: { type: number }) => {
  return myRequest.post<RootObject<AllTypeChildren[]>>({
    url: '/schooldvc/instrumentcategory/all',
    data
  })
}

// 新建|修改 仪器、设备分类接口
export const editInsCategory = (data: AddForm) => {
  return myRequest.post<RootObject<BaseList>>({
    url: '/schooldvc/Instrumentcategory/Save',
    data
  })
}

// 删除分类
export const delCategory = (data: { id: number }) => {
  return myRequest.post<RootObject<BaseList>>({
    url: '/schooldvc/Instrumentcategory/delete',
    data
  })
}
// 下载模板
export const downloadtp = () => {
  return myRequest.get<any>({
    url: '/schooldvc/Instrumentcategory/downloadtpl',
  })
}

// 导入类型
export const importExcel = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/instrumentcategory/saveExcelData',
    data,
    responseType: 'blob'
  })
}
// 导入类型
export const getAllCount = () => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/instrumentcategory/getAllCount'
  })
}
