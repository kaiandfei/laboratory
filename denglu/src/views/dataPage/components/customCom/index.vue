<template>
  <div class="panel-body">
    <grid-layout
      ref="gridLayout"
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="false"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        class="grid-item"
        ref="gridItem"
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
      >
        <div :id="'flag' + item.i" class="comCss">
          <component
            v-if="item.template && !item.flag"
            :is="item.template"
            :item="item"
            :isDefaultValue="false"
            :="$attrs"
          ></component>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUpdated } from 'vue'
import LocalCache from '@/utils/localCache'
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
let reg1 = /&quot;/g
let extra_data = ref(LocalCache.getCache('extra_data').replace(reg1, '"'))
// console.log('qwe', extra_data.value)
layout.value = JSON.parse(extra_data.value).tem
// console.log('ffff', layout.value)
const formatSize = () => {
  layout.value.forEach((item: any, i: number) => {
    setTimeout(() => {
      if (document.querySelector(`#flag${i} .count-item-count`)) {
        document.querySelector(`#flag${i} .count-item-count`).style.fontSize = (item.w / 3) * 30 + 'px'
      }
      if (document.querySelector(`#flag${i} .count-item-title`)) {
        document.querySelector(`#flag${i} .count-item-title`).style.fontSize = (item.w / 3) * 13 + 'px'
      }
      if (document.querySelector(`#flag${i} .open-course-list`)) {
        document.querySelectorAll(`#flag${i} .open-course-list li`).forEach((ele) => {
          ele.style.fontSize = (item.w / 3) * 10.5 + 'px'
        })
        document.querySelectorAll(`#flag${i} .open-course-list li`)[0].style.fontSize = (item.w / 3) * 15 + 'px'
      }
    }, 300)
    document.getElementById('flag' + i).style.fontSize = (item.w / 3) * 13 + 'px'
  })
}
onMounted(() => {
  formatSize()
})
onUpdated(() => {
  formatSize()
})
</script>

<style lang="scss" scoped>
.panel-body {
  height: 100%;
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
