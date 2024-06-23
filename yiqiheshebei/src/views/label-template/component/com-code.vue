<template>
  <!-- /**
  哪来的烟味
  */ -->
  <div
    class="info"
    :style="{ backgroundImage: listData.imgUrl ? 'url(' + listData.imgUrl + ')' : '', backgroundColor: color }"
  >
    <div class="info-left">
      <template v-for="(item, index) in items">
        <div class="info-text" v-if="listData[item.value]" :key="index">
          <div class="info-label">{{ item.label }}</div>
          <div class="info-value" :class="{ specification: item.value === 'specification' }">
            {{ listData[item.value] }}{{ item.value === 'number_year' ? '年' : '' }}
          </div>
          <div class="del" v-if="listData[item.value] && !refs.isBg.value" @click="handleDel(item.value)">-</div>
        </div>
      </template>
    </div>
    <div class="info-right">
      <img class="infoImg" :src="listData.qr_code" alt="" crossorigin="anonymous" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, watch, defineExpose } from 'vue'
const props = defineProps(['infoData', 'title', 'color', 'activeCom', 'isBg'])
let listData = ref()
const refs = toRefs(props)
listData.value = refs.infoData.value
console.log(86, listData.value)

const items2 = ref([
  {
    label: '分类编号：',
    value: 'number'
  },
  {
    label: '仪器名称：',
    value: 'deviceName'
  },
  {
    label: '规格型号：',
    value: 'specification'
  }
])
const items3 = ref([
  {
    label: '设备编号：',
    value: 'number'
  },
  {
    label: '设备名称：',
    value: 'deviceName'
  },
  {
    label: '规格型号：',
    value: 'specification'
  },
  {
    label: '保质期：',
    value: 'number_year'
  }
])
const items5 = ref([
  {
    label: '资产编号：',
    value: 'asset_number'
  },
  {
    label: '资产名称：',
    value: 'deviceName'
  },
  {
    label: '规格型号：',
    value: 'specification'
  },
  {
    label: '保质期：',
    value: 'number_year'
  },
  {
    label: '登记时间：',
    value: 'create_time'
  },
  {
    label: '位置：',
    value: 'position'
  }
])
let items: any = ref([])
watch(
  () => refs.activeCom.value,
  (newValue, oldValue) => {
    let arr = []
    switch (refs.activeCom.value) {
      case 2:
        arr = items2.value
        break
      case 3:
        arr = items3.value
        break
      case 5:
        arr = items5.value
        break
    }
    items.value = arr
  },
  { immediate: true }
)

let color = ref()
watch(
  () => refs.color.value,
  (newValue, oldValue) => {
    color.value = newValue
    // console.log('89')
  },
  { immediate: true }
)
const handleDel = (val: string) => {
  console.log(val)
  delete listData.value[val]
  // listData.value[val] = ''
}
defineExpose({ listData })
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 500px;
  height: 300px;
  padding: 20px;
  box-sizing: border-box;
  background-size: cover;
  background-repeat: no-repeat;

  .info-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    margin-right: 30px;

    .info-text {
      display: flex;
      margin: 10px 0;
      position: relative;

      .info-label {
        width: 100px;
        text-align: right;
      }
      .specification {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 设置行数 */
        -webkit-box-orient: vertical;
      }

      .info-value {
        width: 120px;
        text-align: left;
      }

      .del {
        width: 15px;
        height: 15px;
        line-height: 12px;
        font-size: 25px;
        text-align: center;
        color: #fff;
        background-color: red;
        border-radius: 50%;
        position: absolute;
        top: -10px;
        right: 20px;
        cursor: pointer;
      }
    }
  }

  .info-right {
    img {
      width: 200px;
      height: 200px;
      border-radius: 50%;
    }
  }
}
</style>
