import { myRequest, BaseRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  RequestDataLabType,
  SelectForm,
  DetailForm,
  RequestDetailType,
  AddFormType,
  LabConfigType,
  bacthLabConfigType,
  FilterForm,
  EquListType,
  StoreItemType,
  AddConfigForm,
  noticeListType,
  labPeripheralType,
  labPeripheralParam,
  deviceListType,
  deviceListParam,
  saveNoticeType
} from './types'

// 实验室列表
export const getLaboratoryList = (data: SelectForm) => {
  return myRequest.post<RootObject<RequestDataLabType>>({
    url: '/schooldvc/Laboratory/laboratoryList',
    data
  })
}

// 实验室详情
export const getLaboratoryDetail = (data: DetailForm) => {
  return myRequest.post<RootObject<RequestDetailType>>({
    url: '/schooldvc/Laboratory/laboratoryDetail',
    data
  })
}

// 新建实验室
export const addLaboratory = (data: AddFormType) => {
  return myRequest.post<RootObject<RequestDetailType>>({
    url: '/schooldvc/Laboratory/laboratorySave',
    data
  })
}

// 删除实验室
export const delLaboratory = (data: { id: number }) => {
  return myRequest.post<RootObject<RequestDetailType>>({
    url: '/schooldvc/Laboratory/laboratoryDelete',
    data
  })
}

// 获取学校摄像头列表
export const getcameraAll = (data: any) => {
  return BaseRequest.post<RootObject<RequestDetailType>>({
    url: '/swrperipheral/VideoController/deviceList',
    data
  })
}

// 获取学校摄像头通道列表
export const getThoroughfareList = (data: any) => {
  return BaseRequest.get<any>({
    url:
      '/swrperipheral/VideoController/channelList?pageNo=' +
      data.pageNo +
      '&pageSize=' +
      data.pageNo +
      '&deviceSerial=' +
      data.deviceSerial,
    data
  })
}
// 获取直播流
export const getVideo = (data: any) => {
  return BaseRequest.get<any>({
    url:
      '/swrperipheral/VideoController/videoRealTimePlay?deviceSerial=' +
      data.device_serial +
      '&validateCode=' +
      data.validate_code +
      '&channelNo=' +
      data.channel_no,
    data
  })
}

// 获取直播流
export const getcameramsg = (data: any) => {
  return BaseRequest.get<any>({
    url: '/swrperipheral/VideoController/singleDevice?deviceSerial=' + data.deviceSerial
  })
}
// 实验室配置清单
export const laboratoryConfig = (data: { id: number }) => {
  return myRequest.post<RootObject<LabConfigType[]>>({
    url: '/schooldvc/Laboratory/laboratoryConfiguration',
    data
  })
}
// 基本设备
export const laboratoryEquipment = (data: { id: number }) => {
  return myRequest.post<RootObject<LabConfigType[]>>({
    url: '/school_dev/laboratory_equipment',
    data
  })
}

// 实验室批量配置
export const bacthLaboratoryConfig = (data: { id: number }) => {
  return myRequest.post<RootObject<bacthLabConfigType[]>>({
    url: '/schooldvc/Laboratory/bacthConfiguration',
    data
  })
}

// 设备查询
export const equipmentList = (data: FilterForm) => {
  return myRequest.post<RootObject<EquListType>>({
    url: '/schooldvc/Laboratory/equipmentList',
    data
  })
}

// 实验室配置删除
export const bacthConfigurationDel = (data: { id: number }) => {
  return myRequest.post<RootObject<EquListType>>({
    url: '/schooldvc/Laboratory/bacthConfigurationDel',
    data
  })
}

// 实验室批量配置保存
export const bacthConfigurationSave = (data: bacthLabConfigType[]) => {
  return myRequest.post<RootObject<EquListType>>({
    url: '/schooldvc/Laboratory/bacthConfigurationSave',
    data
  })
}

// 获取学校实验室和柜子
export const storeByLaboratory = (data: { id: number }) => {
  return myRequest.post<RootObject<StoreItemType[]>>({
    url: '/schooldvc/InstrumentStore/storeByLaboratory',
    data
  })
}

// 根据实验室获取仪器柜
export const getAllStore = (data: { id: number }) => {
  return myRequest.post<RootObject<StoreItemType[]>>({
    url: '/schooldvc/InstrumentStore/getAllStore',
    data
  })
}

// 所有仪器分类
export const allInstrument = () => {
  return myRequest.post<RootObject<{ id: number; title: string }[]>>({
    url: '/schooldvc/instrumentcategory/all'
  })
}

// 新建配置
export const configurationAdd = (data: AddConfigForm) => {
  return myRequest.post<RootObject<StoreItemType>>({
    url: '/schooldvc/Laboratory/configurationAdd',
    data
  })
}
// 获取实验室注意事项
export const noticeList = (data: any) => {
  return myRequest.get<RootObject<noticeListType>>({
    url: `/school_dev/laboratory/noticeList?labor_id=${data.labor_id}`,
  })
}
// 保存实验室注意事项
export const saveNotice = (data: saveNoticeType) => {
  return myRequest.post<RootObject>({
    url: '/school_dev/laboratory/saveNotice',
    data
  })
}
// 控制空开
export const controlAirSwitch = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/swrperipheral/DeviceController/controlAirSwitch',
    data
  })
}
// 获取空开
export const laboratorySwitch = (data: any) => {
  return myRequest.get<RootObject>({
    url: `/swrperipheral/DeviceController/getCurrentLabAirSwitch?labor_id=${data.labor_id}`,
  })
}

// 获取学生终端列表
export const getStuTerminalList = (data: deviceListParam) => {
  return myRequest.get<RootObject<deviceListType[]>>({
    url: `/swrperipheral/StudentTerminalController/deviceList?labId=${data.labId}`,
  })
}
// 获取某个实验室所有设备
export const labPeripheralList = (data: labPeripheralParam) => {
  return myRequest.get<RootObject<labPeripheralType[]>>({
    url: `/swrperipheral/DeviceController/labPeripheralList?lab_id=${data.lab_id}`,
    // url: `/swrperipheral/DeviceController/labPeripheralList?lab_id=${data.lab_id}&deviceId=${data.deviceId}`,
  })
}
