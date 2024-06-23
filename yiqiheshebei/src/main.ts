import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import vue3JsonExcel from 'vue3-json-excel'
import 'element-plus/dist/index.css'

// eslint-disable-next-line prettier/prettier

import VueGridLayout from 'vue-grid-layout'


const app = createApp(App)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(store, key).use(router).use(ElementPlus, { locale }).use(vue3JsonExcel).use(VueGridLayout).mount('#app')
