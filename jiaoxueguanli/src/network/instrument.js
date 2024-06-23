import { request } from './request'

// 获取仪器
export function prepareMaterial(data) {
  return request({
    method: 'post',
    url: 'teach/Material/prepareMaterial',
    data,
  })
}

// 根据实验室获取实验
export function expLaboratory(data) {
  return request({
    method: 'post',
    url: 'teach/Exp/expLaboratory',
    data,
  })
}
