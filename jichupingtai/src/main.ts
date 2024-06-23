import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '../src/assets/icons/font_2922638_szwnxphchq/iconfont.css'

import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(store, key).use(router).use(ElementPlus, { locale }).mount('#app')
