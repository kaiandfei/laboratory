/**
 * 对于不同的开发环境可以自动更换不同的BASE_URL
 * development -> 生产环境
 * production -> 线上环境
 * test -> 测试环境
 * https://swryzapi.swrtest.com/ 弃用
 *  /swrswrcommon/Login/loginCheck
 */

const BASE_URL: string = process.env.VUE_APP_BASE_URL as string
const H_C_URL: string = process.env.VUE_APP_H_C_URL as string

export { BASE_URL, H_C_URL }
