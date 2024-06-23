<template>
  <div class="config-header">
    <!-- 返回 -->
    <div class="header-back" @click="backHome">
      <img src="@/assets/images/bigData/back.png" alt="" />
      返回
    </div>
  </div>
  <div class="com-container">
    <!-- 操作面板 -->
    <div class="panel">
      <panel-header
        :panelList="panelList"
        :panelBodyId="panelBodyId"
        @backHome="backHome"
        @getPanelBody="getPanelBody"
        :temName="temName"
        :temId="temId"
      />
      <panel-body
        class="panelBody"
        :currentWidget="currentWidget"
        @getPanelList="getPanelList"
        :layoutList="layoutList"
      />
    </div>
    <!-- 组件列表 -->
    <WidgetList :list="widgetList" @onMousedown="onMousedown" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PanelHeader from './panel-header.vue'
import PanelBody from './panel-body.vue'
import WidgetList from './widgetList.vue'
import { WIDGETLIST } from '@/constents/config'
import { useRouter, useRoute } from 'vue-router'
//路由
const router = useRouter()
const route: any = useRoute()
let layoutList = ref<any>([])
const reg = /&quot;/g
let temName = ref('')
let temId = ref('')
if (route.query.isEdit == '1') {
  const extra_data = ref(JSON.parse(route.query.temList)?.extra_data.replace(reg, '"'))
  temName.value = JSON.parse(route.query.temList)?.name
  temId.value = JSON.parse(route.query.temList)?.id
  layoutList.value = JSON.parse(extra_data.value).tem
}
const currentWidget = ref({})
const panelList = ref<any>([])
const widgetList = ref(WIDGETLIST)
//鼠标按下
const onMousedown = (e: any, item: any) => {
  currentWidget.value = item
  // console.log('111', e)
}
//返回
const backHome = () => {
  router.push('/configPage')
}
//获取操作面板的值
const getPanelList = (_val: any) => {
  panelList.value = _val
  // console.log('获取操作面板的值', _val)
}
//获取操作面板实例
const panelBodyId = ref(null)
const getPanelBody = () => {
  panelBodyId.value = document.querySelector('.panelBody .vue-grid-layout')
  // console.log('ssss', panelBodyId.value)
}
</script>

<style lang="scss" scoped>
.config-header {
  background-color: #020937;
  padding-left: 20px;
  color: #fff;
  .header-back {
    display: flex;
    align-items: center;
    width: 60px;
    height: 60px;
    cursor: pointer;
    > img {
      margin-right: 5px;
      width: 20px;
      height: 20px;
    }
  }
}
.com-container {
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: space-between;
  text-align: left;
  background-color: #04061c;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  // background-color: pink;
  position: relative;
  background-image: url('../../assets/images/bigData/bg1.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
