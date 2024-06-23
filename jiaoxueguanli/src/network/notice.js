import { request } from './request'
//获取通知列表
export const noticeList = (data) => {
  return request({
    method: 'post',
    url: '/swrserve/Notice/getPageData',
    data,
  })
}
//获取通知公告
export const noticList = (data) => {
  return request({
    method: 'post',
    url: '/swrserve/Notice/getPageData',
    data,
  })
}
//获取通知详情
export const noticeDetail = (data) => {
  return request({
    method: 'post',
    url: '/serve/Notice/findNotice',
    data,
  })
}
//获取通知详情
export const updateSeeCount = (data) => {
  return request({
    method: 'post',
    url: '/swrserve/Notice/updateSeeCount',
    data,
  })
}
//新建通知
export const saveNotice = (data) => {
  return request({
    method: 'post',
    url: '/serve/Notice/save',
    data,
  })
}
//编辑通知
export const editNotice = (data) => {
  return request({
    url: '',
    data,
  })
}
//发布状态修改
export const releaseStatus = (data) => {
  return request({
    method: 'post',
    url: '/serve/Notice/updateStatus',
    data,
  })
}
