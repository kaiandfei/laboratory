import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getRoleList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Role/getPageData',
    data
  })
}
export const getMenuList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/AuthRule/getPageData',
    data
  })
}
export const getallMenu = () => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/common/AuthRule/create'
  })
}
// 获取权限菜单
export const getTreeMenu = (data: { roof: number }) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: '/swrcommon/AuthRule/findAuthList',
    data
  })
}

// 修改权限菜单
export const setMenu = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/common/AuthRule/Save',
    data
  })
}

// 删除权限菜单
export const delMenu = (data: { id: number }) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/AuthRule/delete',
    data
  })
}

export const getrolerule = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: '/swrserveadmin/Role/getRole',
    data
  })
}
export const saverolerule = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: '/swrserveadmin/Role/save',
    data
  })
}
