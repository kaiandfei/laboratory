// 获取设备号
export function getTerminalSN() {
  console.log('🚀 ~ init')
  return new Promise((res) => {
    try {
      window.receiveTerminalSNFromAndroid = function (message) {
        res(JSON.parse(message))
      }
      if (navigator.userAgent.match(/iPad/i)) {
        // 是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ iPad')
        window.webkit.messageHandlers.getTerminalSN.postMessage(null)
      } else {
        // 不是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ 不是iPad设备')
        window.bridge_js.getTerminalSN()
      }
    } catch (error) {
      res({
        err: '当前环境可能没有设备号',
      })
    }
  })
}
//控制门禁开关
export function electronicHouseNumberOpen(open) {
  console.log('🚀 ~ init')
  return new Promise((res) => {
    try {
      // window.receiveTerminalSNFromAndroid = function (message) {
      //   res(JSON.parse(message))
      // }
      if (navigator.userAgent.match(/iPad/i)) {
        // 是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ iPad')
        window.webkit.messageHandlers.electronicHouseNumberOpen.postMessage(null)
      } else {
        // 不是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ 不是iPad设备')
        window.bridge_js.electronicHouseNumberOpen(open)
      }
    } catch (error) {
      res({
        err: '门禁开门失败',
      })
    }
  })
}
// 退出发送设备号
export function exitLogin(data) {
  console.log('🚀 ~ init')
  return new Promise((res) => {
    try {
      if (navigator.userAgent.match(/iPad/i)) {
        // 是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ iPad')
        window.webkit.messageHandlers.exitLogin.postMessage(data)
      } else {
        // 不是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ 不是iPad设备')
        window.bridge_js.exitLogin(data)
      }
    } catch (error) {
      res({
        err: '当前环境可能没有设备号',
      })
    }
  })
}

// 获取手输的设备号
export function getEntryTerminalSN(data) {
  console.log('🚀 ~ init')
  return new Promise((res) => {
    try {
      if (navigator.userAgent.match(/iPad/i)) {
        // 是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ iPad')
        window.webkit.messageHandlers.getEntryTerminalSN.postMessage(data)
      } else {
        // 不是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ 不是iPad设备')
        window.bridge_js.getEntryTerminalSN(data)
      }
    } catch (error) {
      res({
        err: '当前环境可能没有设备号',
      })
    }
  })
}
// 获取手输的设备号
export function sendEntryTerminalSNFromJS(data) {
  console.log('🚀 ~ init')
  return new Promise((res) => {
    try {
      if (navigator.userAgent.match(/iPad/i)) {
        // 是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ iPad')
        window.webkit.messageHandlers.sendEntryTerminalSNFromJS.postMessage(data)
      } else {
        // 不是iPad设备
        console.log('🚀 ~ file: device-interaction.js:24 ~ init ~ 不是iPad设备')
        window.bridge_js.sendEntryTerminalSNFromJS(data)
      }
    } catch (error) {
      res({
        err: '当前环境可能没有设备号',
      })
    }
  })
}
