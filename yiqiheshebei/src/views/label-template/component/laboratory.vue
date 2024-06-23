<template>
  <ul>
    <li class="const" v-for="(item, index) in listData" :key="index">
      <comLab :infoData="item" :isBg="true" :color="item.color" />
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
import comLab from './com-lab.vue'
import { ref, defineEmits, defineProps, toRefs, watch } from 'vue'
const emits = defineEmits(['toggleIsHome', 'selectNoteItem'])
const props = defineProps(['list', 'selectedNode', 'activeCom'])
const refs = toRefs(props)
const IMG1 = require('@assets/images/label-template/school_logo.png')
const IMG2 = require('@assets/images/label-template/code.png')
const laboratoryList = ref([
  {
    qr_code: IMG2,
    school_logo: IMG1,
    school: '苏威尔高级中学',
    title: '物理实验室1',
    isSchool_logo: true,
    name: '模板1'
  },
  {
    qr_code: IMG2,
    school: '苏威尔高级中学',
    title: '物理实验室2',
    isSchool_logo: false,
    name: '模板2'
  },
  {
    qr_code: IMG2,
    title: '物理实验室1',
    isSchool_logo: false,
    name: '模板3'
  }
])
const listData: any = ref([])
console.log(refs.list.value)

watch(
  () => refs.list.value,
  (newValue, oldValue) => {
    console.log(46, newValue)

    listData.value = []
    newValue.forEach((item: any, index: number) => {
      if (index < 3) {
        let obj = {
          source: item.source,
          source_id: item.source_id,
          selected: item.selected
        }
        let obj2 = Object.assign({}, obj, laboratoryList.value[index])
        listData.value.push(obj2)
      } else {
        if (typeof item.extra === 'string' && item.extra !== '') {
          let reg1 = /&quot;/g
          let extra = item.extra.replace(reg1, '"')
          item.extra = JSON.parse(extra)
          item.qr_code = IMG2
          item = { ...item, ...item.extra }
          listData.value.push(item)
        } else {
          item.qr_code = IMG2
          item = { ...item, ...item.extra }
          listData.value.push(item)
        }
      }
    })
    console.log(60, listData.value)
  }
)
const handleActiveClick = (i: number, item: any) => {
  console.log(58, item)
  if (i > 2) {
    emits('selectNoteItem', 2, item.source_id)
  } else {
    emits('selectNoteItem', 1, i + 1)
  }
}
const customTemplate = () => {
  emits('toggleIsHome', '实验室二维码')
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
  padding: 10px 0;

  .const {
    width: 354px;
    // height: 600px;
    position: relative;

    .card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 500px;
    }

    .background-image {
      background-image: url('../../../assets/images/common/model_bg.png');
      background-size: 100% 100%;
    }

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

    .code {
      width: 220px;
      height: 220px;
      margin: 120px 67px 0;
    }

    .info {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 115px;
      font-size: 20px;
      font-weight: bold;

      .avatar {
        width: 60px;
        height: 60px;
      }

      .lab-school {
        margin: 0 20px 0 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #05c65d;

        .lab {
          font-size: 18px;
          color: #189755;
        }
      }
    }
  }

  .custom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 354px;

    .custom-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 354px;
      height: 500px;
      color: #05c65d;
      border: 1px solid #c6e4d3;
      background-color: #fff;
      cursor: pointer;

      .add {
        font-size: 100px;
      }

      .custom-template {
        font-size: 30px;
      }
    }

    .custom-btn {
      width: 160px;
      height: 40px;
      margin: 20px auto 0;
    }
  }

  li {
    margin: 15px 30px;
  }
}
</style>
