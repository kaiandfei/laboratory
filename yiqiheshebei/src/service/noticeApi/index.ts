import { myRequest } from '../token/index'
import { RootObject } from '../rootObject'
//获取通知列表
export const noticeList = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserve/Notice/getPageData',
    data
  })
}
//获取通知公告
export const noticList = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/swrserve/Notice/getPageData',
    data
  })
}
//获取通知详情
export const noticeDetail = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/serve/Notice/findNotice',
    data
  })
}
//新建通知
export const saveNotice = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/serve/Notice/save',
    data
  })
}
//编辑通知
export const editNotice = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '',
    data
  })
}
//发布状态修改
export const releaseStatus = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/serve/Notice/updateStatus',
    data
  })
}
