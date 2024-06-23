/**
 * 对于不同的开发环境可以自动更换不同的BASE_URL
 * development -> 生产环境
 * production -> 线上环境
 * test -> 测试环境
 * https://swryzapi.swrtest.com/ 弃用
 */
const BASE_URL: string = process.env.VUE_APP_BASE_URL as string // 设备仪器管理后台
const BASE_URL_BASE: string = process.env.VUE_APP_BASE_URL_BASE as string // 基础信息后台

export { BASE_URL, BASE_URL_BASE }
