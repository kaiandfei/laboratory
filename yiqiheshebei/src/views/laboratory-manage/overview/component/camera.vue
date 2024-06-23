<template>
  <div class="carema-box">
    <div class="camera">
      <header>
        <span>{{ props.item.labName }}</span>
        <div class="return" @click="closePage">退出</div>
      </header>
      <video id="videoElement" controls autoplay muted></video>
      <div class="equid" @click="chushi">{{ props.item.id }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, toRefs, onMounted } from 'vue'
import Configuration from './configuration.vue'

import { laboratoryConfig } from '@service/laboratory-manage/overview/index'
import { labConfig } from '@service/laboratory-manage/overview/types'
import { useStore } from '@/store/index'
import * as flvjs from 'flv.js'

const props = defineProps({ item: { type: Object, required: true } })

console.log(props.item)
const emit = defineEmits(['closepage'])
const play: any = ref(null)
const flvPlayer: any = ref(null)
const chushi = () => {
  if (flvjs.default.isSupported()) {
    console.log('123114')
    play.value = document.getElementById('videoElement')
    flvPlayer.value = flvjs.default.createPlayer({
      type: 'flv',
      isLive: true,
      hasAudio: false,
      url: props.item.url // 自己的flv视频流
    })
    flvPlayer.value.attachMediaElement(play.value)
    flvPlayer.value.load()
    flvPlayer.value.play()
  }
}
const closePage = () => {
  destoryPlay()
  emit('closepage')
}
const destoryPlay = () => {
  flvPlayer.value.pause()
  flvPlayer.value.unload()
  // 卸载DOM对象
  flvPlayer.value.detachMediaElement()
  // 销毁flvjs对象
  flvPlayer.value.destroy()
}
onMounted(() => {
  chushi()
})
</script>

<style scoped lang="scss">
.carema-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(59, 59, 59, 0.233);
  z-index: 1000;
  .camera {
    margin: 15vh auto;
    width: 60vw;
    height: 70vh;
    background-color: #fff;
    border-radius: 10px;
    header {
      height: 8vh;
      line-height: 8vh;
      font-size: 4vh;
      .return {
        float: right;
        margin: 2vh 1vw;
        width: 4vw;
        height: 2vh;
        line-height: 2vh;
        font-size: 1vh;
        border: 1px solid rgb(94, 94, 94);
        border-radius: 4px;
        cursor: pointer;
      }
    }
    video {
      width: 50vw;
      height: 55vh;
    }
    .equid {
      margin-top: 2vh;
      padding-right: 4vw;
      text-align: right;
    }
  }
}
</style>
