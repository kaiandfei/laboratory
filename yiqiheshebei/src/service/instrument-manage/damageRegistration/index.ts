import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  damageRegistrationList,
  instrumnetList,
  addDamageRegistrationList,
  instrumentDetailList,
  compensateInfoList,
  instrumentRegistrationList
} from './types'

//获取仪器损坏、赔偿登记情况
export const getDamageRegistrationList = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<damageRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsDamage/instrumentDamageList',
    data
  })
}

// 获取搜索到的仪器信息
export const getInstrumentInfo = (data: any) => {
  return myRequest.post<RootObject<instrumnetList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/schoolInstrument',
    data
  })
}

// 获取学校教师信息列表
export const getTeacherList = (data: { id: number }) => {
  return myRequest.post<RootObject<any[]>>({
    url: '/schooldvc/User/teacherList',
    data
  })
}

// 提交新增的仪器损坏、赔偿信息
export const postAddDamageInfo = (data: addDamageRegistrationList) => {
  return myRequest.post<RootObject<addDamageRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsDamage/schoolInstrumentAdd',
    data
  })
}

// 获取仪器损坏、赔偿详情信息
export const getInstrumentDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<instrumentDetailList>>({
    url: '/schooldvc/SchoolInstrumentsDamage/damageListing',
    data
  })
}

//删除仪器列表信息
export const deleteDamageList = (data: { id: number }) => {
  return myRequest.post<RootObject<instrumentDetailList>>({
    url: '/schooldvc/SchoolInstrumentsDamage/delDamageList',
    data
  })
}

//提交赔偿登记信息
export const postCompensateInfo = (data: compensateInfoList) => {
  return myRequest.post<RootObject<compensateInfoList>>({
    url: '/schooldvc/SchoolInstrumentsDamage/damageCompensation',
    data
  })
}

// 仪器登记总览（仪器损耗、赔偿情况）
export const getInstrumentRegistrationOverview = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<instrumentRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsDamage/instrumentRegistration',
    data
  })
}
