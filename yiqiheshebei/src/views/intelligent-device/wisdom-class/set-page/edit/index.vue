<template>
  <div class="body-left">
    <!--    <div class="nav-wrapper-b">-->
    <!--      <div class="bar-title-b">-->
    <!--        {{getChangeLine + ' ' + barTitle}}-->
    <!--      </div>-->
    <!--      <div class="time-b">-->
    <!--        <span style="margin-left: 20px">{{ date }} {{ time }}</span>-->
    <!--        <div style="display: inline-block;position: absolute;right: 12%;">-->
    <!--          <el-button v-if="isEditDraggable"-->
    <!--                     type="success"-->
    <!--                     size="small"-->
    <!--                     @click="saveDragDataHome">保存-->
    <!--          </el-button>-->
    <!--          <el-button v-else-->
    <!--                     type="primary"-->
    <!--                     size="small"-->
    <!--                     @click="editDragDataHome">布局-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="operation">
      <span>{{ getChangeLine + ' ' + barTitle }}</span>
      <div class="button-box">
        <!--        <el-button v-if="isEditDraggable" type="success" size="small" @click="saveDragDataHome">保存</el-button>-->
        <!--        <el-button v-else type="primary" size="small" @click="editDragDataHome">布局</el-button>-->
        <div class="button-box" style="float: right">
          <div class="btn white-btn" style="background: #dcece3;border: 0;" @click="pageRetuen">
            <img src="@assets/images/laboratory-standard/cancel.png" alt="" />
            返回
          </div>
        </div>
      </div>
    </div>
    <div class="title-con">
      <input v-model="templateName" maxlength="25" class="title-input" placeholder="模版名称">
      <button v-if="isEditDraggable" class="save-con"  @click="saveDragDataHome">保&nbsp;&nbsp;存</button>
      <button v-else class="save-con" @click="editDragDataHome">布&nbsp;&nbsp;局</button>
    </div>
    <div class="home-container-b" id="main-body">
      <div class="title">
        <div class="title_name fonts">秦淮第一高中</div>
        <div class="title_name">
          <img src="@assets/images/intelligent-device/swr.png" />
          化学实验室一
        </div>
        <div class="title_name">
          本机序列号：
          <span>dz626542542</span>
        </div>
      </div>
      <!--********************** 实现自定义组件 *********************-->
      <div class="drag-body" :class="isEditDraggable ? 'drag-body-edit' : ''" id="targetElement">
        <grid-layout
            :layout.sync="layoutDraggableList"
            :col-num="12"
            :row-height="21"
            :maxRows="50"
            :is-draggable="draggableLayout"
            :is-resizable="resizableLayout"
            :vertical-compact="true"
            :use-css-transforms="true"
            :style="{backgroundColor:bgColorCode}"
        >
          <grid-item
              v-for="(item, index) in layoutDraggableList"
              :static="false"
              :key="index"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              @resized="resizedEvent"
          >
            <!--测试组件-->
            <div class="layout-component top-left-first-components">
              <div style="width: 100%; height: 100%;">
                <!--                <power-info></power-info>-->
                <draggable
                    style="height: 100%;"
                    class="dragArea list-group dragArea2"
                    :list="item.list"
                    group="people"
                    @change="log(item.i, $event)"
                    item-key="name"
                >
                  <template style="height: 100% !important;" #item="{ element }">
                    <div style="height: 100% !important;background: #ffffff;border-radius: 10px" class="list-group-item">
                      <span
                          v-show="delet"
                          style="position: fixed; top: 0px; right: 0px; z-index: 9999; color: #000000; cursor: pointer"
                          @click="del(item.i)"
                      >
                        <img src="@/assets/images/common/del.png" />
                      </span>
                      <sortTable
                          @back2="titles"
                          @changeObj2="changeListObj"
                          style="height: 100% !important"
                          v-if="item.mCss && item.list[0]"
                          :name="item.titleName"
                          :propsData="item.list[0]"
                          :propsDetail="item.obj"
                          :propsId="item.id"
                      />
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </grid-item>
        </grid-layout>
      </div>
    </div>
    <div class="module-set">
      <div class="set-name">设置</div>
      <div style="float:left;height: 100px;">
        <div>
          <div style="padding-left: 40px;line-height: 50px;display: flex">
            <span>组件标题:&nbsp;&nbsp;&nbsp;</span>
            <input v-model="mObj.title" maxlength="12" style="width: 240px;height: 30px;border: 1px solid #C9C7C7;margin-top: 10px;padding-left: 10px" @blur="changeTitle">
            <el-color-picker
                style="padding-left: 20px;margin-top: 10px"
                v-model="mObj.color"
                color-format="rgb"
                size="small"
            />
            <select v-model="mObj.fontSize" style="width: 90px;height: 30px;background: #FFFFFF;border-radius: 0px 0px 0px 0px;border: 1px solid #C9C7C7;margin-left: 20px;margin-top: 10px">
              <option v-for="(item, index) in totals" :key="index">{{ item }}</option>
            </select>
          </div>
        </div>
      </div>
      <div style="float:left;height: 100px;padding-left: 200px;">
        <div style="text-align: left;display: flex;line-height: 50px">
          <span>组件背景:</span>
          <el-color-picker
              style="padding-left: 20px;margin-top: 10px"
              v-model="mObj.bgColor"
              color-format="rgb"
              size="small"
          />
        </div>
        <div style="text-align: left;display: flex;line-height: 50px">
          <span>组件文本:</span>
          <el-color-picker
              style="padding-left: 20px;margin-top: 10px"
              v-model="mObj.contentColor"
              color-format="rgb"
              size="small"
          />
          <select v-model="mObj.contentSize" style="width: 90px;height: 30px;background: #FFFFFF;border-radius: 0px 0px 0px 0px;border: 1px solid #C9C7C7;margin-left: 20px;margin-top: 10px">
            <option v-for="(item, index) in totals" :key="index">{{ item }}</option>
          </select>
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
  </div>
  <div class="body-right">
    <div class="titles">
      <div class="big">
        <div class="small"></div>
      </div>
      <div class="titles-font">模块选择</div>
    </div>
    <div class="body-right-body">
      <draggable
          class="dragArea list-group"
          :list="list1"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="clone"
          item-key="name"
      >
        <template #item="{ element }">
          <div class="body-content" :class="element.id === 5 || element.id === 3 ? 'widthD2' : 'widthD1'">
            <div class="body-content-block">
              <div class="body-content-title">{{ element.name }}</div>
              <div class="item-bg">
                <power-infoT v-if="element.id === 1" style="height: 200px"></power-infoT>
                <environment-infoT v-if="element.id === 2" style="height: 200px"></environment-infoT>
                <today-courseT v-if="element.id === 3" style="width: 100%"></today-courseT>
                <real-timeT v-if="element.id === 4"></real-timeT>
                <curriculumT v-if="element.id === 5"></curriculumT>
                <lab-noteT v-if="element.id === 6" style="height: 200px"></lab-noteT>
                <messageT v-if="element.id === 7" style="height: 200px"></messageT>
              </div>
            </div>
            <!--          <div class="body-content-block">-->
            <!--            <div class="body-content-title">实验室环境监测信息</div>-->
            <!--            <div>-->
            <!--              <environment-info></environment-info>-->
            <!--            </div>-->
            <!--          </div>-->
            <!--          <div class="body-content-block">-->
            <!--            <div class="body-content-title">实验室环境监测信息</div>-->
            <!--            <div>-->
            <!--              <power-info></power-info>-->
            <!--            </div>-->
            <!--          </div>-->
            <div style="clear: both"></div>
          </div>
        </template>
      </draggable>
    </div>
    <div>
      <div style="text-align: left;display: flex;line-height: 50px;padding: 20px">
        <span>整体背景选择:</span>
        <el-color-picker
            style="padding-left: 20px;margin-top: 10px"
            v-model="bgColorCode"
            color-format="rgb"
            size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import html2canvas from 'html2canvas'
import { useRoute, useRouter } from 'vue-router'
import sortTable from '../../../component/index.vue'
import draggable from 'vuedraggable'
import powerInfo from '../../../component/power-info.vue'
import powerInfoT from '../../../component/power-infoT.vue'
import environmentInfo from '../../../component/environment-info'
import environmentInfoT from '../../../component/environment-infoT'
import todayCourse from '../../../component/today-couser'
import todayCourseT from '../../../component/today-couserT'
import realTime from '../../../component/frame'
import realTimeT from '../../../component/frameT'
import curriculum from '../../../component/curriculum'
import curriculumT from '../../../component/curriculumT'
import labNote from '../../../component/lab-note'
import labNoteT from '../../../component/lab-noteT'
import message from '../../../component/message'
import messageT from '../../../component/messageT'
import { computed, ref } from 'vue'
import { getCurrentInstance, nextTick } from '@vue/runtime-core'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { saveTypeClassCardSetting, uploadImage } from '@service/intelligent-device/wisdom-class/index'
import { findTypeClassCardSetting } from '@service/intelligent-device/wisdom-class/index'
let props = defineProps({
  selectDate: {
    type: Array,
    required: true
  }
})
const { proxy } = getCurrentInstance()
const delet = ref(true)
//年月日
const date = ref('')
//时分秒
const time = ref('')
const getChangeLine = ref('')
const hours = ref('')
const barTitle = ref('')
const router = useRouter()
const templateName = ref('')
const colorCode = ref('')
const fontSize = ref(12)
const mcolorCode = ref('')
const mtcolorCode = ref('')
const bgColorCode = ref('')
const totals = ref([12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44])
const mObj = ref({
  'title': '',
  'color': '',
  'fontSize': '',
  'bgColor': '',
  'contentSize': '',
  'contentColor': '',
})
function titles(e){
  mObj.value = e
}

/*____________________________主页拖拽布局开始_______________________________*/
let isEditDraggable = ref(false)
const draggableLayout = ref(false)
const resizableLayout = ref(false)
const layoutDraggableList = ref([])
const ids = ref(0)
const list1 = ref([
  { name: '实验室控电信息', id: 1, temp: 'control-electricity' },
  { name: '实验室环境监测信息', id: 2, temp: 'env-monitor' },
  { name: '今日课程', id: 3, temp: 'today-course' },
  { name: '实时画面', id: 4, temp: 'frame' },
  { name: '实验室周课表', id: 5, temp: 'curriculum' },
  { name: '实验室注意事项', id: 6, temp: 'note' },
  { name: '消息通知', id: 7, temp: 'message' }
])
//模拟后端请求到的数据
let demoData = ref({
  id: 162,
  subjectId: 161,
  name: '主页',
  title: '页面配置',
  description: '第一个看板菜单信息',
  templateList: [
    {
      id: 163,
      titleName: '实验室环境监测信息',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 0,
      x: 0,
      y: 0,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 164,
      titleName: '实验室环境监测信息',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 1,
      x: 4,
      y: 0,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 165,
      titleName: '今日课程',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 2,
      x: 8,
      y: 0,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 166,
      titleName: '四号位',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 3,
      x: 0,
      y: 9,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 167,
      titleName: '五号位',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 4,
      x: 4,
      y: 9,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 168,
      titleName: '六号位',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 5,
      x: 8,
      y: 9,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 169,
      titleName: '七号位',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 6,
      x: 0,
      y: 18,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 170,
      titleName: '八号位',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: true,
      i: 7,
      x: 4,
      y: 18,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    },
    {
      id: 171,
      titleName: '九号位',
      obj:{
        'title': '',
        'color': '',
        'fontSize': '',
        'bgColor': '',
        'contentSize': '',
        'contentColor': '',
      },
      disabled: false,
      i: 8,
      x: 8,
      y: 18,
      w: 4,
      h: 9,
      menuId: 162,
      moved: false,
      list: []
    }
  ]
})
const inits = () => {
  if (props.selectDate.templateList) {
    props.selectDate.templateList.forEach(function(item){
      if(item.list.length<=0){
        item.h = 10
      }
    })
    demoData.value.templateList = props.selectDate.templateList
    demoData.value.templateList.forEach(function(item){
        item.mCss = true
    })
    ids.value = props.selectDate.id
    templateName.value = props.selectDate.name?props.selectDate.name:''
    bgColorCode.value = props.selectDate.background?props.selectDate.background:'#e8e8e9'
  }else{
    findTypeClassCardSetting().then((res)=>{
      if(res.code===10){
        templateName.value = '模版'+res.data.length
      }else{
        ElMessage({
          type: 'warning',
          message: res.msg
        })
      }

    })
  }
}
inits()
onMounted(()=>{
  document.querySelector('.vue-grid-layout').style.backgroundColor = bgColorCode.value
})
function log(i, evt) {
  if(evt.added){
    layoutDraggableList.value[i].mCss = false
    nextTick(()=>{
      layoutDraggableList.value[i].list = [evt.added.element]
      layoutDraggableList.value[i].list[0].temp = list1.value[evt.added.element.id-1].temp
      layoutDraggableList.value[i].obj = {
        'title': '',
        'color': '',
        'fontSize': 14,
        'bgColor': '#ffffff',
        'contentSize': 14,
        'contentColor': '',
      }
      layoutDraggableList.value[i].mCss = true
    })
  }
}
function clone({ id }) {
  console.log({ id })
  return { id }
}
function del(i) {
  layoutDraggableList.value[i].list = []
}
function cloneDog(obj) {
  console.log('🚀 ~ file: edit.vue:164 ~ cloneDog ~ obj:', obj)
  let o = JSON.parse(JSON.stringify(obj))
  return {
    ...o,
    key: Date.now()
  }
}
function onMove(evt) {
  console.log('🚀 ~ file: edit.vue:167 ~ onMove ~ evt:', evt)
}
function datadragEnd(item) {
  console.log('🚀 ~ file: edit.vue:177 ~ datadragEnd ~ item:', item)
}
const bgColorChange= (color) => {
  document.querySelector('.vue-grid-layout').style.backgroundColor = color
  bgColorCode.value = color
}
// const colorChange = (color) => {
//   mObj.value.color = color
// }
// const mBgColorChange = (color) => {
//   mObj.value.bgColor = color
// }
// const mColorChange = (color) => {
//   mObj.value.contentColor = color
// }

const changeListObj = (e) => {
  layoutDraggableList.value.forEach(function(item){
    if(item.id === e){
      item.obj = mObj.value
    }
  })
}
const screenshotUrl = ref('')

const getFileFromBase64 = (data) => {
  let _base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgAB...'
  let fileName = 'image1.jpg' // 文件名
  let opType = _base64.split(';base64')[0].slice(5)
  const dataArr = data.split(',')
  const byteString = atob(dataArr[1])
  const options = {
    type: opType,
    endings: 'native'
  }
  const u8Arr = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i)
  }
  let _fileObj = new File([u8Arr], fileName, options)
  return _fileObj
}

//点击编辑布局
function editDragDataHome() {
  isEditDraggable.value = true
}
//保存布局
function saveDragDataHome() {
  // let oldArr = demoData.value.templateList
  // demoData.value.templateList.forEach(function(item){
  //   if(item.list.length<=0){
  //     item.h = 1
  //   }
  // })
  isEditDraggable.value = false
  //   for(let i=0;i<document.getElementsByClassName('vue-grid-item').length;i++){
  //     document.getElementsByClassName('vue-grid-item')[i].style.border = 'none'
  //   }
  //   delet.value = false
  // let aa = document.getElementsByClassName('vue-grid-layout')[0]
  // aa.style.height = 'auto'
  //   const element = document.querySelector('.vue-grid-item')
  //   element.classList.remove('cssTransforms')
  //   let id = document.querySelector("#targetElement")
  // document.getElementById('main-body').innerHTML = ""
  // document.getElementById('main-body').appendChild(id)


  let gridItems = Array.from(document.getElementsByClassName("vue-grid-item"));
  gridItems.forEach(item=>{
    let classStr = item.getAttribute("class");
    let newClass = classStr.replace("cssTransforms","");
    item.setAttribute("class",newClass);
    item.style.transform = "none";
  })
  const element2 = document.querySelector('.vue-grid-item')
  element2.classList.remove('cssTransforms')
  // let id2 = document.querySelector("#targetElement")
  let id2 = document.querySelector('.vue-grid-layout')
  nextTick(()=>{
    html2canvas(id2, {
      // taintTest: false,
      allowTaint: false,
      useCORS: true, //允许跨域
      backgroundColor: '#fff', //画布背景色，设置null为透明
      scale: 2, // 处理模糊问题
      dpi: 300 // 处理模糊问题
    }).then((canvas) => {
      screenshotAndUpload(getFileFromBase64(canvas.toDataURL('image/png')))

      // 返回一个 canvas 对象，在dom中渲染 canvas 对象
      // 转化成 dataurL
      // let url = canvas.toDataURL('image/png')
      // console.log(198, url)
      //调用下载方法
      // let a = document.createElement('a') //创建一个a标签
      // a.download = 'html.png' // 设置图片名称
      // a.href = url // 将生成的URL设置为a.href属性
      // a.click()
      // save()
    })

  })

  // demoData.value.templateList.splice(0,demoData.value.templateList.length,...oldArr)
  // demoData.value = JSON.parse(JSON.stringify(demoData.value))

}

const screenshotAndUpload = async (val) => {
  try {
    let formData = new FormData()
    formData.append('image', val)
    const { data, code } = await uploadImage(formData)
    if (code === 10) {
      screenshotUrl.value = data.file_url
      save()
    }
  } catch (error) {
    console.log(error)
    // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
  }
}

const save = () => {
  layoutDraggableList.value.forEach(item=>{
    if(item.list.length>0 && item.obj.title === ''){
      item.obj.title = list1.value[item.list[0].id-1].name
    }
  })
  let dataS = {}
  if (ids.value <= 0) {
    dataS = {
      templateList: layoutDraggableList.value,
      status: 1,
      name: templateName.value,
      background: bgColorCode.value,
      img_url: screenshotUrl.value
    }
  } else {
    dataS = {
      templateList: layoutDraggableList.value,
      status: 1,
      img_url: screenshotUrl.value,
      name: templateName.value,
      background: bgColorCode.value,
      id: ids.value
    }
  }
  saveTypeClassCardSetting(dataS).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      emit('back')
    }
  })
}

function resizedEvent(i, newH, newW, newHPx, newWPx) {
  // document.getElementById('test' + i).style.fontSize = (newW / 5) * 16 + 'px'
}
const itemRefs = ref([])
const setItemRef = (el) => {
  if (el) {
    itemRefs.value.push(el)
  }
  return el
}
/*_____________________________主页拖拽布局结束______________________________*/
initialHeightFun(demoData.value)

//根据高度进行调整尺寸
function initialHeightFun(data) {
  nextTick(() => {
    layoutDraggableList.value = data.templateList
    barTitle.value = data.title
  })
}

onBeforeUnmount(() => {})

//监听拖拽功能
watch(isEditDraggable, (res) => {
  draggableLayout.value = !draggableLayout.value
  resizableLayout.value = !resizableLayout.value
})

let emit = defineEmits(['back'])
const pageRetuen = () => {
  console.log(512132321)
  emit('back')
}
</script>

<style lang="scss" scoped>
.body-left {
  width: 70%;
  float: left;
}
/*----------------拖拽样式开始----------------*/
.drag-body {
  width: 100%;
  height: 100%;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.38);
}

.layout-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}

.layout-component-low-warning-second {
  width: 95%;
  height: 100%;
  margin-right: 1%;
  float: left;
}

.layout-component-low-warning-text {
  width: 4%;
  height: 100%;
  float: right;
}

.layout-component-low-throwing-second {
  width: 100%;
  height: 100%;
}

.drag-body-edit {
  .vue-grid-item:not(.vue-grid-placeholder) {
    outline: 1px solid rgba(255, 96, 28, 0.71);
  }
}

.vue-grid-item {
  box-sizing: border-box !important;
  border: 1px dashed #848484;
}

.vue-grid-layout {
  height: 1000px;
  background: #e8e8e9;
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
}

::v-deep .vue-resizable-handle {
  //background: yellow;
  padding: 0 3px 3px 0;
  background-origin: content-box;
  -webkit-box-sizing: border-box;
  position: absolute;
  width: 80px;
  height: 80px;
  bottom: 0;
  right: 0;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  //border: 1px solid #409eff;
  color: #ffffff;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.vue-grid-item .static {
  background: transparent;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

/*----------------拖拽样式结束----------------*/

.nav-wrapper-b {
  height: 60px;
  line-height: 60px;
  width: 100%;
  background: red;
  background-size: 100% 100%;
  text-align: center;
  position: relative;
  color: #d5dfe8;
  font-family: '黑体';

  .bar-title-b {
    font-size: 32px;
    color: #ffffff;
    font-weight: bolder;
  }

  .time-b {
    position: absolute;
    right: 1%;
    top: 50%;
    transform: translateY(-35%);
    font-family: 'Time Number';
    font-weight: bold;
    font-size: 29px;
    width: 35%;
  }

  .mapChoose-b {
    position: absolute;
    left: 22px;
    bottom: 15px;
    color: #eee;
  }
}

.home-container-b {
  width: 100%;
  aspect-ratio: 16 / 9;
  //height: 850px;
  position: relative;
  margin-top: 0;
  overflow-y: scroll;
  box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.38);
  border-radius: 0px 0px 0px 0px;
  background: #E8E8E9;
}

.nav_btn {
  position: absolute;
  top: 5px;
  width: 50%;
  height: auto;
}

.operation {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: rgb(220, 236, 227);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

  & > span {
    float: left;
    margin-left: 1.8%;
    font-size: 20px;
    color: #05c65d;
    font-weight: bold;
  }

  .button-box {
    display: flex;
    justify-content: space-between;
    margin-right: 50px;
    div {
      margin-right: 20px;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
.title {
  height: 49px;
  background: #f8ffff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  display: flex;
  line-height: 49px;
  .title_name {
    flex: 1;
    font-size: 14px;
    span {
      color: #05c65d;
    }
    img {
      width: 60px;
      vertical-align: middle;
    }
  }
  .fonts {
    text-align: left;
    padding-left: 30px;
  }
}
.title-con {
  text-align: left;display: flex;
  .title-input {
    width: 80%;height: 50px;border: 1px solid #C9C7C7;padding-left: 10px
  }
  .save-con {
    width: 20%;
    height: 50px;
    background: #05c65d;
    border: 1px solid #05c65d;
    border-radius: 5px;
    color: #FFFFFF;
    font-size: 16px;
  }
}
.module-set {
  height: 120px;width: 100%;
  border: 1px solid #E8E8E9;
  background: #F3F3F3;
  border-radius: 0px 0px 0px 0px;
  .set-name {
    float:left;width: 20px;padding: 10px 10px;line-height: 50px;background: #DCECE3
  }
}
.dragArea2 {
  .body-content {
    display: none;
  }
}
.body-right {
  width: 30%;
  float: left;
  background: white;
  .titles {
    display: flex;
    margin-top: 20px;
    padding-left: 20px;
    .titles-font {
      font-size: 24px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }
    .big {
      width: 0px;
      height: 0px;
      border-width: 37px 25px 0 23px;
      border-style: solid;
      border-color: #05c65d transparent transparent transparent;
      position: relative;
    }
    .small {
      width: 0px;
      height: 0px;
      border-width: 28px 18px 0 18px;
      border-style: solid;
      border-color: white transparent transparent transparent;
      position: absolute;
      bottom: 6px;
      left: -18px;
    }
  }
  .body-right-body {
    max-height: 1000px;
    overflow-y: scroll;
  }
  .body-content {
    float: left;
    .body-content-block {
      background: #e8e8e9;
      margin: 5px 10px;
      padding: 0 5px;
    }
    .body-content-title {
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      color: #05c65d;
      padding: 10px;
    }
    .item-bg {
      background: #ffffff;
    }
  }
  .widthD1 {
    min-width: 50%;
    max-width: 100%;
  }
  .widthD2 {
    min-width: 80%;
    max-width: 100%;
  }
}
</style>
