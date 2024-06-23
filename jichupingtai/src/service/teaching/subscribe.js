import { teachRequest, zsRequest } from '../token/index'

export const getDatebyweek = () => {
  return zsRequest.post({
    url: '/swrserveadmin/YearTerm/findDatebyweek'
  })
}

// export const goClass = () => {
//   return teachRequest.post({
//     url: '/school/GoClass/find'
//   })
// }

// 本学期实验计划
export function getExpPlan(data) {
  return teachRequest.post({
    url: 'school/expBook/expPlanDetail',
    data
    // params: {
    //   groupId: data
    // }
  })
}
// 我的实验计划
export function getMyPlan(data) {
  return teachRequest.post({
    url: 'school/expBook/myExp',
    data
    // params: {
    //   groupId: data
    // }
  })
}
