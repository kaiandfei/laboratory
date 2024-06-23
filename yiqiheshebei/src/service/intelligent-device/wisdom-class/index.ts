import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { ListItem,icIdListItem } from './types'

// 获取所有班牌
export const getElectronicClassCard = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/getElectronicClassCard',
  })
}

// 获取所有icid卡
export const findAllIcIdCard = () => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/peripheral/IcIdCard/findAllIcIdCard',
  })
}

// 新增保存icid卡
export const icIdCardSave = (data: { id?: any; code: string; type: number; user_id: number; ic_id_card_peripheral: any }) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/peripheral/IcIdCard/save',
    data
  })
}

// 删除icid卡
export const icIdCardDelete = (data: { id: number }) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/peripheral/IcIdCard/delete',
    data
  })
}

// 上传图片
export const uploadImage = (data: any) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/swrperipheral/ElectronicCardController/uploadImage',
    data
  })
}

// 新增修改页面配置
export const saveTypeClassCardSetting = (data: { id?: number; templateList: any; status: number; img_url:any }) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/peripheral/DeviceController/saveTypeClassCardSetting',
    data
  })
}

// 禁用启用页面/peripheral/DeviceController/deleteTypeClassCardSetting
export const updateTypeClassCardSetting = (data: { id: number; status: number }) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/peripheral/DeviceController/updateTypeClassCardSetting',
    data
  })
}

// 删除页面
export const deleteTypeClassCardSetting = (data: { id: number }) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/peripheral/DeviceController/deleteTypeClassCardSetting',
    data
  })
}

// 查看页面配置列表
export const findTypeClassCardSetting = (data: {school_id?: string,status?:string,create_user_id?:string}) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/peripheral/DeviceController/findTypeClassCardSetting',
    data
  })
}

// 查询学校管理员
export const findSchoolUser = (data: {role_id?: any}) => {
  return myRequest.post<RootObject<icIdListItem[]>>({
    url: '/swrserveadmin/User/findSchoolUser',
    data
  })
}
