class localCache {
  setCache(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  getCache(key: string) {
    const value = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  }

  deleteCache() {
    window.localStorage.clear()
  }
  // 设置cookie

  setCookie(cname: string, cvalue: any, exdays = 720, domain = process.env.VUE_APP_APP_BASE_DOMAIN) {
    console.log('🚀 ~ file: localCache.ts:19 ~ localCache ~ setCookie ~ domain:', domain)
    const d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()
    const _domain = ['localhost'].includes(document.domain) ? document.domain : domain
    document.cookie = cname + '=' + cvalue + '; ' + expires + ';domain=' + _domain + ';path=/'
  }

  getCookie(cname: string) {
    const name = cname + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') c = c.substring(1)
      if (c.indexOf(name) != -1) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
  clearCookie(cname: string) {
    this.setCookie(cname, '', -1)
  }
}

export default new localCache()
