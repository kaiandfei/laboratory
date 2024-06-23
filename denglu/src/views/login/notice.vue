<template>
  <div class="noticeHeader">
    <div class="left">
      <img src="@/assets/images/login/tip.png" alt="">
      通知公告 > 查看通知
    </div>
    <div class="right" @click="back">
      <img src="@images/laboratory/laboratory-standard/cancel.png" alt="" />
      <span>返回</span>
    </div>
  </div>
  <div class="list">
    <div class="item" v-for="(item, index) in noticListData" :key="index" @click="handleClick">
      <span>{{ item.title }}</span>
      <span>{{ item.create_time }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineProps, toRefs } from 'vue';
const $props = defineProps(['noticeData'])
const $emits = defineEmits(['toggleNotice'])
const refs = toRefs($props)
const noticListData: any = ref([])
const isCheckNotice = ref(false)
noticListData.value = refs.noticeData.value
const handleClick = () => {
  isCheckNotice.value = true
}
const back = () => {
  $emits('toggleNotice')
}
</script>

<style lang="scss" scoped>
.noticeHeader {
  width: 1390px;
  height: 60px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;

  .left {
    img {
      width: 17px;
      height: 21px;
      position: relative;
      top: 5px;
      margin-right: 10px;
    }
  }

  .right {
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
}

.list {
  width: 1390px;
  height: 740px;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 2px;
  background-color: #fff;
  overflow: auto;

  .item {
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid #05c65d;
    padding: 0 10px;
    margin-bottom: 20px;
  }
}
</style>
