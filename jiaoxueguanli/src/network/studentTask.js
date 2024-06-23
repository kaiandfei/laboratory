import { request } from './request'

// 获取课程信息
export function shareGoClass(data) {
  return request({
    method: 'post',
    url: '/swrteach/GoClass/shareGoClass',
    data,
  })
}

// 获取h5pid
export function findByExp_id(data) {
  return request({
    method: 'post',
    url: '/teach/H5pH5pContents/findByExp_id',
    data,
  })
}
