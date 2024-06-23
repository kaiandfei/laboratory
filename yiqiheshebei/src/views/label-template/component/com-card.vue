<template>
  <ul>
    <li class="const" v-for="(item, index) in listData" :key="index">
      <div class="card" v-if="index !== 2 && refs.activeCom.value !== 5">
        <comCode :infoData="item" :activeCom="refs.activeCom.value" :color="item.color" :isBg="true" />
      </div>
      <div class="card" v-if="refs.activeCom.value === 5">
        <comCode :infoData="item" :activeCom="refs.activeCom.value" :color="item.color" :isBg="true" />
      </div>
      <div v-if="index === 2 && refs.activeCom.value !== 5">
        <templateThree :infoData="item" />
        <!-- <div class="card2">
          <img class="code" :src="item.qr_code" alt="" />
          <div class="info">
            {{ item.name }}
          </div>
        </div> -->
      </div>
      <div class="btn" :class="{ active: item.selected === 1 }" @click="handleActiveClick(index, item)">
        {{ item.name }}
      </div>
    </li>
    <li class="custom">
      <div class="custom-card" @click="customTemplate">
        <div class="add">+</div>
        <div class="custom-template">自定义模板</div>
      </div>
      <div class="custom-btn"></div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import comCode from './com-code.vue'
import templateThree from './template-three.vue'
import { ref, defineEmits, defineProps, toRefs, watch } from 'vue'
const emits = defineEmits(['toggleIsHome', 'selectNoteItem'])
let props = defineProps(['activeCom', 'list'])
const refs = toRefs(props)
const active = ref(0)
const IMG1 = require('@assets/images/label-template/code.png')
const instrumentLIST = ref([
  {
    qr_code: IMG1,
    deviceName: '仪器',
    specification: '规格',
    name: '模板1'
  },
  {
    qr_code: IMG1,
    number: '60001',
    deviceName: '仪器柜',
    specification: '规格',
    name: '模板2'
  },
  {
    qr_code: IMG1,
    deviceName: '仪器柜',
    name: '模板3'
  }
])
const deviceLIST = ref([
  {
    qr_code: IMG1,
    number: '60001',
    deviceName: '仪器柜',
    specification: '规格',
    number_year: '三',
    name: '模板1'
  },
  {
    qr_code: IMG1,
    number: '60001',
    deviceName: '仪器柜',
    specification: '规格',
    name: '模板2'
  },
  {
    qr_code: IMG1,
    deviceName: '仪器柜',
    name: '模板3'
  }
])
const meansLIST = ref([
  {
    qr_code: IMG1,
    asset_number: '60001',
    deviceName: '仪器柜',
    specification: '规格',
    number_year: '三',
    create_time: '2023',
    position: '柜子1',
    name: '模板1'
  },
  {
    qr_code: IMG1,
    asset_number: '60001',
    deviceName: '仪器柜',
    specification: '规格',
    number_year: '三',
    create_time: '2023',
    name: '模板2'
  },
  {
    qr_code: IMG1,
    asset_number: '60001',
    deviceName: '仪器柜',
    specification: '规格',
    name: '模板3'
  }
])
const format = (val: any, arr: any) => {
  listData.value = []
  val.forEach((item: any, index: number) => {
    if (index < 3) {
      let obj = {
        source: item.source,
        source_id: item.source_id,
        selected: item.selected
      }
      let obj2 = Object.assign({}, obj, arr[index])
      listData.value.push(obj2)
    } else {
      if (typeof item.extra === 'string' && item.extra !== '') {
        let reg1 = /&quot;/g
        let extra = item.extra.replace(reg1, '"')
        item.extra = JSON.parse(extra)
        item.qr_code = IMG1
        item = { ...item, ...item.extra }
        listData.value.push(item)
      } else {
        item.qr_code = IMG1
        item = { ...item, ...item.extra }
        listData.value.push(item)
      }
    }
  })
  // console.log('115',listData.value)
}
let listData: any = ref([])
watch(
  () => refs.list.value,
  (newValue, oldValue) => {
    switch (refs.activeCom.value) {
      case 2:
        format(newValue, instrumentLIST.value)
        break
      case 3:
        format(newValue, deviceLIST.value)
        break
      case 5:
        format(newValue, meansLIST.value)
        break
    }
  }
)
const handleActiveClick = (i: number, item: any) => {
  active.value = i
  if (i > 2) {
    emits('selectNoteItem', 2, item.source_id)
  } else {
    emits('selectNoteItem', 1, i + 1)
  }
}
const customTemplate = () => {
  let str = ''
  switch (refs.activeCom.value) {
    case 2:
      str = '仪器二维码'
      break
    case 3:
      str = '设备二维码'
      break
    case 5:
      str = '资产标签'
      break
  }
  emits('toggleIsHome', str)
}
</script>

<style lang="scss" scoped>
ul {
  display: flex;
  justify-content: left;
  align-items: center;
  overflow: auto;
  flex-wrap: wrap;
  flex: 1;
  padding: 20px;
  box-sizing: border-box;

  .const {
    width: 500px;
    position: relative;
    // margin-bottom: 20px;

    .card {
      border: 1px solid #c6e4d3;
      background-color: #fff;
    }

    // .card2 {
    //   position: relative;
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: center;
    //   align-items: center;
    //   min-width: 400px;
    //   height: 302px;
    //   border: 1px solid #c6e4d3;
    //   background-color: #fff;
    //   padding: 30px 60px;
    //   box-sizing: border-box;

    //   .info {
    //     position: absolute;
    //     bottom: 10px;
    //   }

    //   .code {
    //     width: 200px;
    //     height: 200px;
    //   }
    // }

    .btn {
      width: 160px;
      height: 40px;
      line-height: 40px;
      border-radius: 10px;
      background-color: #fff;
      margin: 20px auto 0;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 10px;
      box-sizing: border-box;
    }

    .active {
      color: white;
      background-color: #05c65d;
    }
  }

  .custom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 500px;

    .custom-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 302px;
      color: #05c65d;
      border: 1px solid #c6e4d3;
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;
      cursor: pointer;

      .add {
        font-size: 80px;
      }

      .custom-template {
        font-size: 20px;
      }
    }

    .custom-btn {
      width: 160px;
      height: 40px;
      margin: 20px auto 0;
    }
  }

  li {
    margin: 0 22px 20px;
  }
}
</style>
