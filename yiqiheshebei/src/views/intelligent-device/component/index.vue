<template>
  <div>
    <div class="base">
      <power-info @back="back2" @changeObj="changeObj2" v-if="props.propsData.id === 1" class="mian" :item-data="props.propsData" :item-detail="props.propsDetail" :item-id="props.propsId"></power-info>
      <environment-info @back="back2" @changeObj="changeObj2" v-if="props.propsData.id === 2" class="mian" :item-data="props.propsData" :item-detail="props.propsDetail" :item-id="props.propsId"></environment-info>
      <today-course @back="back2" @changeObj="changeObj2" v-if="props.propsData.id === 3" class="mian" :item-data="props.propsData" :item-detail="props.propsDetail" :item-id="props.propsId"></today-course>
      <real-time @back="back2" @changeObj="changeObj2" v-if="props.propsData.id === 4" class="mian" :item-data="props.propsData" :item-detail="props.propsDetail" :item-id="props.propsId"></real-time>
      <curriculum @back="back2" @changeObj="changeObj2" v-if="props.propsData.id === 5" class="mian" :item-data="props.propsData" :item-detail="props.propsDetail" :item-id="props.propsId"></curriculum>
      <lab-note @back="back2" @changeObj="changeObj2" v-if="props.propsData.id === 6" class="mian" :item-data="props.propsData" :item-detail="props.propsDetail" :item-id="props.propsId"></lab-note>
      <message @back="back2" @changeObj="changeObj2" v-if="props.propsData.id === 7" class="mian" :item-data="props.propsData" :item-detail="props.propsDetail" :item-id="props.propsId"></message>
<!--      <img src="@/assets/images/common/del-green.png" alt="" @click="removeAt(index)" />-->
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import environmentInfo from './environment-info'
import powerInfo from './power-info'
import todayCourse from './today-couser'
import realTime from './frame'
import curriculum from './curriculum'
import labNote from './lab-note'
import message from './message'
let props = defineProps({ propsData: Object,propsDetail: Object,propsId: Number})
function removeAt(index) {
  this.$emit('removeCallback', index)
}
let emit = defineEmits(['back2'])
function back2(e){
  emit('back2',e)
}
function changeObj2(e){
  emit('changeObj2',e)
}
</script>

<style lang="scss" scoped>
.base {
  display: flex;
  align-items: flex-start;
  height: 100%;
  color: #000000;
  .title {
    line-height: 30px;
    min-width: 80px;
    text-align: left;
    color: #848484;
  }
  .mian {
    height: 100%;
    flex: 1;
  }
  img {
    align-self: center;
    margin-left: 20px;
    width: 20px;
  }
  ::v-deep .row {
    display: flex;
    align-items: flex-start;
    .el-input {
      margin-right: 10px;
      width: 20% !important;
    }
  }
}
</style>
