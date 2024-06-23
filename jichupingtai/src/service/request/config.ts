/**
 * 对于不同的开发环境可以自动更换不同的BASE_URL
 * development -> 生产环境
 * production -> 线上环境
 * test -> 测试环境
 * https://swryzapi.swrtest.com/ 弃用
 */
// let BASE_URL: string
// let HC_URL: string

// if (process.env.NODE_ENV === 'development') {
//   BASE_URL = 'https://baseapimarket.swrtest.com/'
//   HC_URL = 'https://labapimarket.swrtest.com/'
// } else if (process.env.NODE_ENV === 'production') {
//   BASE_URL = 'https://baseapimarket.swrtest.com/'
//   HC_URL = 'https://labapimarket.swrtest.com/'
// } else {
//   BASE_URL = 'https://baseapimarket.swrtest.com/'
//   HC_URL = 'https://labapimarket.swrtest.com/'
// }

const BASE_URL: string = process.env.VUE_APP_BASE_URL as string
const HC_URL: string = process.env.VUE_APP_H_C_URL as string
const TEACH_URL: string = process.env.VUE_APP_TEACH_URL as string
export { BASE_URL, HC_URL, TEACH_URL }
