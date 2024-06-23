<template>
  <ul>
    <li v-for="(item, index) in listData" :key="index">
      <div class="table" v-if="index !== 1">
        <comInstrumentCard :infoData="item" :isBg="true" :color="item.color" />
      </div>
      <div class="table2" v-if="index === 1">
        <comInstrumentCard :infoData="item" :isBg="true" />
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
import comInstrumentCard from './com-instrument-card.vue'
import { ref, defineEmits, defineProps, toRefs, watch } from 'vue'
const emits = defineEmits(['toggleIsHome', 'selectNoteItem'])
const props = defineProps(['list', 'selectedNode', 'activeCom'])
const refs = toRefs(props)
const active = ref(0)
const IMG1 = require('@assets/images/label-template/code.png')
const insList = ref([
  {
    header: '仪器柜一号仪器（药品存放卡）',
    qr_code: IMG1,
    // tableData: [],
    name: '模板1',
    columns: [
      {
        label: '序号',
        prop: 'index',
        width: '50'
      },
      {
        label: '编号',
        prop: 'asset_number',
        width: '50'
      },
      {
        label: '名称',
        prop: 'name',
        width: '50'
      },
      {
        label: '规格型号',
        prop: 'specification',
        width: '70'
      },
      {
        label: '单位',
        prop: 'unit',
        width: '50'
      },
      {
        label: '数量',
        prop: 'total',
        width: '50'
      },
      {
        label: '存放位置（层）',
        prop: 'number_plies'
        // width: '80'
      }
    ]
  },
  {
    header: '仪器柜一号仪器（药品存放卡）',
    qr_code: IMG1,
    // tableData: [],
    name: '模板2',
    columns: [
      {
        label: '序号',
        prop: 'index',
        width: '50'
      },
      {
        label: '编号',
        prop: 'asset_number',
        width: '50'
      },
      {
        label: '名称',
        prop: 'name',
        width: '50'
      },
      {
        label: '规格型号',
        prop: 'specification',
        width: '70'
      },
      {
        label: '单位',
        prop: 'unit',
        width: '50'
      },
      {
        label: '数量',
        prop: 'total',
        width: '50'
      },
      {
        label: '存放位置（层）',
        prop: 'number_plies',
        width: '80'
      }
    ]
  }
])
const listData: any = ref([])
watch(
  () => refs.list.value,
  (newValue, oldValue) => {
    listData.value = []
    newValue.forEach((item: any, index: number) => {
      if (index < 2) {
        let obj = {
          source: item.source,
          source_id: item.source_id,
          selected: item.selected
        }
        let obj2 = Object.assign({}, obj, insList.value[index])
        listData.value.push(obj2)
      } else {
        if (typeof item.extra === 'string' && item.extra !== '') {
          let reg1 = /&quot;/g
          let extra = item.extra.replace(reg1, '"')
          item.extra = JSON.parse(extra)
          item = { ...item, ...item.extra }
          listData.value.push(item)
        } else {
          item = { ...item, ...item.extra }
          listData.value.push(item)
        }
      }
    })
    console.log(60, listData.value)
  }
)
const handleActiveClick = (i: number, item: any) => {
  active.value = i
  if (i > 1) {
    emits('selectNoteItem', 2, item.source_id)
  } else {
    emits('selectNoteItem', 1, i + 1)
  }
}
const customTemplate = () => {
  emits('toggleIsHome', '仪器柜卡')
}
</script>

<style lang="scss" scoped>
ul {
  display: flex;
  // align-items: center;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  overflow: auto;
  flex-wrap: wrap;

  li {
    margin: 20px;

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
}

// .card {
//   display: flex;
//   flex-direction: column;
//   height: 500px;
//   background-color: #fff;
//   border: 10px solid #c6e4d3;
//   padding: 20px;
//   box-sizing: border-box;

.header {
  display: flex;
  justify-content: center;
  align-items: center;

  .header-img {
    width: 30px;
    height: 30px;
  }
}

.table {
  overflow: auto;
  // margin-top: 10px;

  ::v-deep .el-table__body-wrapper {
    display: none;
  }
}

.table2 {
  overflow: auto;
  // margin-top: 10px;

  ::v-deep .el-table--border {
    border: 1px solid red;

    .el-table__body-wrapper {
      display: none;
    }

    th {
      border-bottom: 1px solid red !important;
    }

    th:not(:last-child) {
      border-right: 1px solid red;
    }
  }
}

// }

.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // width: 500px;

  .custom-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 502px;
    color: #05c65d;
    border: 1px solid #c6e4d3;
    background-color: #fff;
    margin-top: 10px;
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
</style>
