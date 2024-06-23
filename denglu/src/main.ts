import { createApp } from 'vue'
import App from './App.vue'
import router, { routes } from './router'
import { store, key } from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import commonComponent from '@/utils/commonComponent';
import LocalCache from '@/utils/localCache'

import VueGridLayout from 'vue-grid-layout'
// import VueCookies from 'vue-cookies'

import 'element-plus/dist/index.css'
window.addEventListener("beforeunload", function (event) {
  const routesArr: any = routes
  // 在这里执行一些操作
  store.commit('router/setHasPermission', false)
  LocalCache.setCache('menuItemI', 0)
  if (Array.isArray(routesArr) && routesArr.length > 0 && routesArr[routesArr.length - 1]?.children) {
    LocalCache.setCache('menuItemTitle', routesArr[routesArr.length - 1]?.children[0].meta.title || "")
  }
});

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.config.globalProperties.$cookies = VueCookies
app.use(store, key).use(router).use(ElementPlus, { locale }).use(commonComponent).use(VueGridLayout).mount('#app')
