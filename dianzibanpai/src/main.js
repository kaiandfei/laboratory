import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import router from './router'
import Footer from './components/com-footer.vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/style/theme/index.css'
import '../src/assets/icons/font_2922638_szwnxphchq/iconfont.css'
import './utils/rem'
import commonComponent from '@/utils/commonComponent'

import VConsole from 'vconsole'

if (process.env.VUE_APP_TITLE !== 'market') {
  const vConsole = new VConsole()
  console.log('🚀 ~ file: main.js:21 ~ vConsole:', vConsole)
}

Vue.use(Router)

// 防止路由重复点击报错，
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(ElementUI)
Vue.use(commonComponent)
Vue.component('Footer', Footer)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  axios,
  render: (h) => h(App),
}).$mount('#app')
