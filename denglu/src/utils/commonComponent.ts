export default {
  install(Vue: any) {
    const controlFiles = require.context('../components/control', true, /index.vue$/)
    controlFiles.keys().forEach((item) => {
      const name = item.split('/')[1]
      Vue.component(`${name}`, controlFiles(item).default)
    })
  }
}
