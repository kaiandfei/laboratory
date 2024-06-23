import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { accountList } from './types'

export const getLaboratoryList = (data?: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/Laboratory/laboratoryList',
    data
  })
}

export const storeByLaboratory = (data: any) => {
  return myRequest.post<RootObject<any[]>>({
    url: '/schooldvc/InstrumentStore/storeByLaboratory',
    data
  })
}

// 获取仪器建帐列表数据
export const getAccountList = (data: any) => {
  return myRequest.post<RootObject<accountList>>({
    url: '/schooldvc/SchoolAccounts/accountsList',
    data
  })
}

// 获取详情信息
export const getDetailInfo = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolAccounts/accountsDetailList',
    data
  })
}

// 获取开始建帐信息
export const getAccountInfo = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolAccounts/schoolAccountsInstrument',
    data
  })
}

// 保存建帐信息
export const saveAccountInfo = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolAccounts/saveImmediately',
    data
  })
}
// 删除建账信息
export const delOne = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolAccounts/delOne',
    data
  })
}

// 结束建帐
export const endAccount = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolAccounts/endAccounts',
    data
  })
}
