<template>
  <div class="page-body">
    <div class="dispose-title">
      {{ itemData.title }}
      <div class="btn" @click="back">返回</div>
    </div>
    <!-- <p class="category-title">
      设备
      <img :src="imgShow(fristShow)" alt="" @click="fristShow = !fristShow" :title="fristShow ? '收起' : '展开'" />
    </p>
    <div class="btn-box">
      <button
        v-for="(item, index) in cabinets"
        :key="index"
        :class="{ selbtn: selnameone === item.name }"
        @click="selnameone = item.name"
      >
        {{ item.name }}
      </button>
    </div> -->
    <!-- <div class="equ-box">
      <div class="title-other">
        <p class="other">其他</p>
        <p class="notes">(未入库)</p>
      </div>
      <div class="equ-list">
        <EquItem :type="1"></EquItem>
        <EquItem :type="1"></EquItem>
        <EquItem :type="1"></EquItem>
      </div>

      <div class="more">更多></div>
    </div> -->
    <!-- <p class="category-title">
      仪器
      <img :src="imgShow(fristShow)" alt="" @click="fristShow = !fristShow" :title="fristShow ? '收起' : '展开'" />
    </p> -->
    <div class="btn-box">
      <button
        v-for="(item, index) in listData"
        :key="index"
        :class="{ selbtn: selname === item.title }"
        @click="selname === item.title ? (selname = '') : (selname = item.title)"
      >
        {{ item.title }}
      </button>
    </div>

    <div v-for="(item, index) in listData.filter((e) => selname === e.title || selname === '')" :key="index">
      <div class="equ-box" v-for="(it, ind) in numberCom(item.number_plies)" :key="ind">
        <div class="title-other">
          <p class="other">{{ it }}</p>
          <!-- <p class="notes">(未入库)</p> -->
        </div>
        <div class="equ-list">
          <EquItem v-for="(li, i) in listCom(item.list, it)" :key="i" :item-data="li" :base-message="item"></EquItem>
          <p v-show="listCom(item.list, it).length === 0">暂无</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, computed } from 'vue'

import { getStoreDetail } from '@service/equ-warehouse/index'
import { StoreDetailType } from '@service/equ-warehouse/types'

import EquItem from './equ-item.vue'

let props = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})
let { itemData } = toRefs(props)
let emit = defineEmits(['back'])

const back = () => {
  emit('back')
}
const dataMap = reactive({
  selname: '',
  listData: Array<StoreDetailType>()
})
let { selname, listData } = toRefs(dataMap)

const getData = (id: number) => {
  getStoreDetail({ id }).then((res) => {
    console.log('🚀 ~ file: stock-detail.vue ~ line 98 ~ getStoreDetail ~ res', res.data)
    listData.value = res.data
    selname.value = listData.value[0]?.title
  })
}

getData(itemData.value.id)

const numberCom = computed(() => {
  return (floor: number) => {
    let arr: string[] = []
    if (floor > 0) {
      for (let i = 1; i <= floor; i++) {
        let str = `第${i}层`
        arr.push(str)
      }
    }
    arr.push('其他')
    return arr
  }
})

const listCom = computed(() => {
  return (list: { number_plies: number; type: number }[], floor: string) => {
    let arr: { number_plies: number; type: number }[] = []
    list.forEach((e) => {
      if (floor.indexOf(e.number_plies.toString()) !== -1 || (floor === '其他' && e.number_plies === 0)) {
        arr.push(e)
      }
    })

    return arr
  }
})
</script>

<style scoped lang="scss">
.page-body {
  margin-top: 10px;
  .category-title {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 34px;
    height: 56px;
    line-height: 60px;
    background-color: #fff;
    color: #05c65d;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 4px solid #05c65d;
    img {
      cursor: pointer;
    }
  }
  .dispose-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 0 34px;
    height: 60px;
    text-align: left;
    font-size: 20px;
    background-color: #fff;
    .btn {
      display: inline-block;
      width: 108px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      background: #05c65d;
      border-radius: 10px;
      font-size: 14px;
      text-align: center;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      cursor: pointer;
    }
  }

  .btn-box {
    button {
      float: left;
      margin: 0 20px 20px 0;
      width: 140px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.8);
      border: 2px solid #c9c7c7;
      color: #848484;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      cursor: pointer;
    }
    .selbtn {
      border-color: #05c65d;
      color: #05c65d;
    }
    &:after {
      display: block;
      clear: both;
      content: '';
      visibility: hidden;
      height: 0;
    }
  }
}
.equ-box {
  display: flex;
  margin-bottom: 20px;
  min-height: 150px;

  .title-other {
    width: 140px;
    font-weight: bold;
    color: #05c65d;
    background-color: rgba(220, 255, 236, 0.39);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    .other {
      padding: 0 58px;
      height: 100%;
      width: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
    }
    .notes {
      height: 30%;
      font-size: 16px;
    }
  }
  .equ-list {
    width: 100%;
    padding-bottom: 10px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    & > div {
      margin: 10px 0 0 1%;
    }
    & > p {
      height: 140px;
      line-height: 140px;
    }
  }
  .more {
    margin-left: 10px;
    padding: 0 15px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    font-weight: bold;
    color: #05c65d;
    background-color: rgba(220, 255, 236, 0.39);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    border-radius: 0 10px 10px 0;
  }
}
</style>
