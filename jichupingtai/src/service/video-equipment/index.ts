import { testRequest, hcRequest } from '../token/index'
import { IServerDataType } from '../token/types'

// 新增分组列表
export const addOneGroup = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: 'swrperipheral/GroupController/addOneGroup',
    data
  })
}

// 搜索组
export const searchGroup = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: 'swrperipheral/GroupController/searchGroup',
    data
  })
}

// 获取第一层分组列表
export const getGroupFirstList = () => {
  return testRequest.post<IServerDataType<any[]>>({
    url: 'swrperipheral/GroupController/groupFirstList'
  })
}

// 获取子分组列表
export const getGroupsChildrenList = (data: any) => {
  return testRequest.get<IServerDataType<any[]>>({
    url: `/swrperipheral/GroupController/groupsChildrenList?parentNo=${data}`,
  })
}

// 更新组
export const editGroup = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrperipheral/GroupController/editGroup',
    data
  })
}

// 分组删除
export const groupDelete = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/GroupController/groupDelete',
    data
  })
}
// 获取所有设备列表
export const getAllDeviceList = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: `/swrperipheral/DeviceController/getDeviceList?group_no=${data.group_no}`,
  })
}
// 获取设备列表
export const getDeviceList = (data: any) => {
  return testRequest.get<IServerDataType<any[]>>({
    url: `/swrperipheral/VideoController/deviceList?groupNo=${data.group_no}&pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
  })
}
// 获取在线率统计
export const getOnlineRateSummary = (data: any) => {
  return testRequest.get<IServerDataType<any[]>>({
    url: `/swrperipheral/DeviceController/onlineRateSummary?group_no=${data.group_no}`,
    // data
  })
}
// 获取学生终端列表
export const getStuTerminalList = (data: any) => {
  return testRequest.get<IServerDataType<any[]>>({
    url: `/swrperipheral/StudentTerminalController/deviceList?groupNo=${data.group_no}`,
    // url: '/swrperipheral/StudentTerminalController/deviceList',
    // data
  })
}
// 获取学生终端详情
export const getStuTerminalDetail = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/StudentTerminalController/deviceDetail',
    data
  })
}
// 获取学生终端新增
export const deviceAdd = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/StudentTerminalController/deviceAdd',
    data
  })
}
// 获取学生终端删除
export const deviceDelete = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/StudentTerminalController/deviceDelete',
    data
  })
}
// 获取学生终端修改
export const deviceEdit = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/StudentTerminalController/deviceEdit',
    data
  })
}
// 通过学校code获取旗下所有实验室
export const schoolLaborByCode = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/school_dev/laboratory/getSchoolLaborByCode',
    data
  })
}

// 添加设备
export const addDevice = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/DeviceController/addDevice',
    data
  })
}

// 注销设备
export const deleteDevice = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/DeviceController/deleteDevice',
    data
  })
}

// 修改设备信息
export const editDevice = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/VideoController/editDevice',
    data
  })
}
// 修改通用设备信息
export const editDeviceCommon = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/DeviceController/editDevice',
    data
  })
}
// 获取设备使用数据
export const getDeviceUseData = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/DeviceController/getDeviceUseData',
    data
  })
}

// 获取单个设备信息
// export const singleDevice = (data: any) => {
//   return testRequest.get<IServerDataType<any[]>>({
//     url: `/swrperipheral/VideoController/singleDevice?deviceSerial=${data.deviceSerial}`,
//     // url: '/swrperipheral/VideoController/singleDevice',
//     // data
//   })
// }
// 获取设备详情
export const singleDevice = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/DeviceController/getDeviceDetail',
    data
  })
}

// 获取icid卡
export const findPeripheralIcIdCard = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/peripheral/IcIdCard/findPeripheralIcIdCard',
    data
  })
}

// 保存icid卡
export const saveAllIcIdCard = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/peripheral/IcIdCard/saveAll',
    data
  })
}

// 删除icid卡
export const deletePeripheralIcIdCard = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/peripheral/IcIdCard/deletePeripheralIcIdCard',
    data
  })
}

// 获取通道列表
export const channelList = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: `/swrperipheral/VideoController/channelList?deviceSerial=${data.deviceSerial}&pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    // url: '/swrperipheral/VideoController/channelList',
    data
  })
}

// 绑定通道和实验室
export const editChannel = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/VideoController/editChannel',
    data
  })
}

// 将通道视频流解密
export const openChannel = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/VideoController/openChannel',
    data
  })
}

// 获取实时直播流
export const videoRealTimePlay = (data: any) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrperipheral/VideoController/videoRealTimePlay',
    data
  })
}

// 获取实验室
export const laboratoryList = (data: any) => {
  return hcRequest.post<IServerDataType<any>>({
    url: '/schooldvc/Laboratory/laboratoryList',
    data
  })
}
// 获取设备类型
export const getDeviceType = (data: any) => {
  return hcRequest.post<IServerDataType<any>>({
    url: '/swrperipheral/DeviceController/getDeviceType',
    data
  })
}
