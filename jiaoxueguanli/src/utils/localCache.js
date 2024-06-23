class LocalCache {
  // 设置cookie

  setCookie(cname, cvalue, exdays = 720, domain = process.env.VUE_APP_APP_BASE_DOMAIN) {
    const d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()
    const _domain = ['localhost'].includes(document.domain) ? document.domain : domain
    document.cookie =
      cname + '=' + cvalue + '; ' + expires + ';domain=' + _domain + ';path=/'
  }

  getCookie(cname) {
    const name = cname + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1)
      if (c.indexOf(name) !== -1) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
  clearCookie(cname) {
    this.setCookie(cname, '', -1)
  }
}

export default new LocalCache()
