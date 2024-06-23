<template>
  <div class="base-box">
    <div v-for="(baseItem, baseIndex) in configData" :key="baseIndex">
      <span>{{ baseItem.name }}:</span>
      <p>
        <span
          v-for="(item, index) in baseItem.list"
          :class="{ activeItem: item.id === activeIdList[baseIndex] }"
          :key="index"
          @click="clickTab(item, baseIndex)"
        >
          {{ item.name }}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, reactive, defineEmits } from 'vue'
import { ConfigDataType, ConfigListItem } from './types'
// 两个参数：configData（配置参数）:[{
//  name:
//  list: {
//    id
//    name
//  }
//   keyName:
// }]
// selectData(筛选数据对象)
let props = defineProps({
  configData: {
    type: Array as () => Array<ConfigDataType>,
    required: true
  }
})

let { configData } = toRefs(props)

const Emit = defineEmits(['changeFilter'])

let dataMap = reactive({
  activeIdList: Array<number | string>()
})

let { activeIdList } = toRefs(dataMap)

const length = configData.value.length
let obj: any = {} // 用于返回数据
for (let i = 0; i < length; i++) {
  activeIdList.value.push(configData.value[i].list[0].id)
  let key = configData.value[i].keyName
  let val = configData.value[i].list[0].id
  obj[key] = val
}

const clickTab = (item: ConfigListItem, index: number) => {
  activeIdList.value[index] = item.id
  const mykey = configData.value[index].keyName
  obj[mykey] = item.id
  Emit('changeFilter', obj)
}
</script>

<style scoped lang="scss">
.base-box {
  width: 100%;
  & > div {
    display: flex;
    align-items: center;
    span {
      align-self: flex-start;
      margin: 10px 0;
      display: block;
      min-width: 7%;
      text-align: left;
      color: #848484;
      float: left;
    }
    p {
      max-width: 93%;
      display: inline-block;
      span {
        align-self: flex-start;
        display: inline-block;
        margin-right: 50px;
        min-width: 0px;
        height: 20px;
        text-align: center;
        color: #333333;
        cursor: pointer;
        box-sizing: border-box;
      }
      span:hover {
        color: #05c65d;
      }
    }
  }
}
.activeItem {
  border: 1px solid #05c65d;
  padding: 0 2px;
  border-radius: 4px;
  color: #05c65d !important;
  box-sizing: border-box;
}
</style>
