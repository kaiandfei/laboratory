import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  repairRegistrationList,
  instrumnetList,
  addRepairList,
  repairDetailInfo,
  editRepairInfoDetail,
  editRepairInfo,
  instrumentExamineList,
  repairFinishList,
  postRepairRegistrationInfo,
  scrapRegistrationList
} from './types'

// 获取设备维修登记列表信息  11
export const getRepairRegistrationList = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<repairRegistrationList>>({
    url: '/schooldvc/SchoolEquipmentMaintain/equipmentMaintainList',
    data
  })
}

// 获取搜索到的设备信息
export const getInstrumentInfo = (data: { keyword: string }) => {
  return myRequest.post<RootObject<instrumnetList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/schoolInstrument',
    data
  })
}

//提交新增的设备维修登记信息 11
export const postAddRepairInfo = (data: addRepairList) => {
  return myRequest.post<RootObject<addRepairList>>({
    url: '/schooldvc/SchoolEquipmentMaintain/schoolEquipmentAdd',
    data
  })
}

//获取维修详情 11
export const getMaintainListing = (data: { id: number }) => {
  return myRequest.post<RootObject<repairDetailInfo>>({
    url: '/schooldvc/SchoolEquipmentMaintain/maintainListing',
    data
  })
}

//删除维修信息 11
export const deleteRepairList = (data: { id: number }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrumentsMaintain/delMaintainList',
    data
  })
}

//提交审核申请
export const submitRepairInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<repairDetailInfo>>({
    url: '/schooldvc/SchoolEquipmentRepair/repairSubmit',
    data
  })
}

//查看维修保养转报废清单 11
export const maintainChangeScrap = (data: { number: any }) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolEquipmentMaintain/maintainChangeScrap',
    data
  })
}

//获取编辑所对应的设备信息
export const getEditRepairInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<editRepairInfoDetail>>({
    url: '/schooldvc/SchoolEquipmentRepair/repairEdit',
    data
  })
}

// 编辑时删除设备信息
export const deleteEquInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<editRepairInfoDetail>>({
    url: '/schooldvc/SchoolEquipmentRepair/delOne',
    data
  })
}

//提交编辑的设备维修登记信息
export const postEditRepairInfo = (data: editRepairInfo) => {
  return myRequest.post<RootObject<editRepairInfo>>({
    url: '/schooldvc/SchoolEquipmentRepair/schoolEquipmentAdd',
    data
  })
}

//提交仪器审核信息
export const postInstrumentExamineInfo = (data: instrumentExamineList) => {
  return myRequest.post<RootObject<instrumentExamineList>>({
    url: '/schooldvc/SchoolEquipmentRepair/repairAudit',
    data
  })
}

// 获取维修完成登记信息 11
export const getRepairFinishData = (data: { id: number }) => {
  return myRequest.post<RootObject<repairFinishList>>({
    url: '/schooldvc/SchoolEquipmentMaintain/maintainRegistrationList',
    data
  })
}

// 提交维修完成登记信息  11
export const postRepairFinishInfo = (data: postRepairRegistrationInfo) => {
  return myRequest.post<RootObject<postRepairRegistrationInfo>>({
    url: '/schooldvc/SchoolEquipmentMaintain/maintainRegistration',
    data
  })
}

//提交维修转损耗、报废登记数据  11
export const postScrapRegistrationList = (data: scrapRegistrationList) => {
  return myRequest.post<RootObject<scrapRegistrationList>>({
    url: '/schooldvc/SchoolEquipmentMaintain/maintainScrap',
    data
  })
}
