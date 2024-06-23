<template>
  <div class="card2">
    <img class="code" :src="listData.qr_code" alt="" crossorigin="anonymous" />
    <div class="info">
      {{ listData.deviceName }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, toRefs } from 'vue'
const props = defineProps(['infoData'])
let listData = ref()
const refs = toRefs(props)
listData.value = refs.infoData.value
console.log(16, listData.value)
</script>

<style lang="scss" scoped>
.card2 {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 400px;
  height: 302px;
  border: 1px solid #c6e4d3;
  background-color: #fff;
  padding: 30px 60px;
  box-sizing: border-box;

  .info {
    position: absolute;
    bottom: 10px;
  }

  .code {
    width: 200px;
    height: 200px;
  }
}
</style>
