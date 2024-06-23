<template>
  <div class="panel-body">
    <grid-layout
      ref="gridLayout"
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        class="grid-item"
        ref="gridItem"
        v-for="(item, index) in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        @resized="resizedEvent"
        @dragover="(e:any) => e.preventDefault()"
        @drop="(e:any) => onDrop(e, layout,index, item)"
      >
        <div :id="'flag' + item.i" class="comCss">
          <component v-if="item.template && !item.flag" :is="item.template" :item="item"></component>
          <img
            v-if="item.template"
            class="delImg"
            src="@/assets/images/bigData/del.png"
            alt=""
            @click="handleDel(item)"
          />
        </div>
        <!-- <span class="close" @click="delItem(item)"><i class="iconfont icon-guanbi"></i></span> -->
      </grid-item>
    </grid-layout>
    <!-- <div class="col">
      <div
        class="row"
        v-for="(item, index) in list"
        :key="index"
        @dragover="(e) => e.preventDefault()"
        @drop="(e) => onDrop(e, list, index)"
      >
        <component v-if="item.template" :is="item.template" :item="item"></component>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose, nextTick, onMounted } from 'vue'
const props = defineProps(['currentWidget', 'layoutList', 'temName'])
const $emit = defineEmits(['getPanelList'])
const layout = ref([
  { x: 0, y: 0, w: 4, h: 6, i: '0', template: '', flag: false },
  { x: 4, y: 0, w: 4, h: 6, i: '1', template: '', flag: false },
  { x: 8, y: 0, w: 4, h: 6, i: '2', template: '', flag: false },
  { x: 0, y: 4, w: 4, h: 6, i: '3', template: '', flag: false },
  { x: 4, y: 4, w: 4, h: 6, i: '4', template: '', flag: false },
  { x: 8, y: 4, w: 4, h: 6, i: '5', template: '', flag: false },
  { x: 0, y: 8, w: 4, h: 6, i: '6', template: '', flag: false },
  { x: 4, y: 8, w: 4, h: 6, i: '7', template: '', flag: false },
  { x: 8, y: 8, w: 4, h: 6, i: '8', template: '', flag: false }
])
onMounted(() => {
  if (props.layoutList && props.layoutList.length > 0) {
    layout.value = props.layoutList
    $emit('getPanelList', layout.value)
  }
})
//放置
const onDrop = (e: any, arr: any, i: number, item: any) => {
  // console.log('12313123213', item)
  // console.log('asdasafafa', props.currentWidget)
  item.flag = true
  nextTick(() => {
    item = {
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      i: item.i
    }
    item.flag = false
    arr.splice(i, 1, {
      ...item,
      ...props.currentWidget
    })
    $emit('getPanelList', layout.value)
    console.log('qweqe', layout.value)
  })
}

// 尺寸变更后，触发resize事件，使图表resize
const resizedEvent = (i, newH, newW, newHPx, newWPx) => {
  if (document.querySelector(`#flag${i} .count-item-count`)) {
    document.querySelector(`#flag${i} .count-item-count`).style.fontSize = (newW / 3) * 30 + 'px'
  }
  if (document.querySelector(`#flag${i} .count-item-title`)) {
    document.querySelector(`#flag${i} .count-item-title`).style.fontSize = (newW / 3) * 13 + 'px'
  }
  if (document.querySelector(`#flag${i} .open-course-list`)) {
    document.querySelectorAll(`#flag${i} .open-course-list li`).forEach((item) => {
      item.style.fontSize = (newW / 3) * 10.5 + 'px'
    })
    document.querySelectorAll(`#flag${i} .open-course-list li`)[0].style.fontSize = (newW / 3) * 15 + 'px'
  }
  document.getElementById('flag' + i).style.fontSize = (newW / 3) * 13 + 'px'
  if (document.createEvent) {
    let ev = new Event('resize')
    window.dispatchEvent(ev)
  } else if (document.createEventObject) {
    window.fireEvent('onresize')
  }
}
const handleDel = (item: any) => {
  item.template = ''
  if (item.type) delete item.type
  if (item.customOption) delete item.customOption
  if (item.count) delete item.count
  if (item.title) delete item.title
}
defineExpose({ layout })
</script>

<style lang="scss" scoped>
.panel-body {
  height: calc(100% - 100px);
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  .col {
    height: 100%;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .row {
      width: 32%;
      height: 32%;
      margin: 5px;
      border: 1px dashed #aaa;
      color: #fff;
    }
  }
}
.grid-item {
  border: 2px dashed #aaa;
}
.comCss {
  width: 100%;
  height: 100%;
  font-size: 18px;
  position: relative;
  .delImg {
    width: 15px;
    position: absolute;
    right: 0;
    top: 0;
    background-color: #0d3150;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
}
</style>
