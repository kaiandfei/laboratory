<template>
  <header>
    <span @click=";(secondTitle = ''), (modelShow = 0)">仪器设备库</span>
    <span>{{ secondTitle !== '' ? ' / ' + secondTitle : '' }}</span>
    <div v-show="modelShow === 0">
      <span>学科:</span>
      <el-select v-model="value" placeholder="Select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
  </header>
  <div class="page-body" v-show="modelShow === 0">
    <p class="category-title">仪器室</p>
    <div class="room-list">
      <Item v-for="(item, index) in instrumentRoomList" :key="index" @pageChange="pageChange"></Item>
      <p v-if="instrumentRoomList.length === 0">暂无数据</p>
    </div>
    <p class="category-title">准备室</p>
    <div class="room-list">
      <div v-for="(item, index) in preparationRoomList" :key="index" class="room-item">{{ item }}</div>
      <p v-if="preparationRoomList.length === 0">暂无数据</p>
    </div>
  </div>
  <div class="page-body" v-show="modelShow === 1">
    <p class="dispose-title">仓库配置-物理仪器室1</p>
    <p class="category-title">
      仪器柜
      <img :src="imgShow(fristShow)" alt="" @click="fristShow = !fristShow" :title="fristShow ? '收起' : '展开'" />
    </p>
    <div class="room-list" v-show="fristShow">
      <ItemCabinet v-for="(item, index) in cabinetList" :key="index"></ItemCabinet>
      <p v-if="cabinetList.length === 0">暂无数据</p>
    </div>
    <p class="category-title">
      资料柜
      <img :src="imgShow(secShow)" alt="" @click="secShow = !secShow" :title="secShow ? '收起' : '展开'" />
    </p>
    <div class="room-list" v-show="secShow">
      <div v-for="(item, index) in preparationRoomList" :key="index" class="room-item">{{ item }}</div>
      <p v-if="preparationRoomList.length === 0">暂无数据</p>
    </div>
    <p class="category-title">
      药品柜
      <img :src="imgShow(thrShow)" alt="" @click="thrShow = !thrShow" :title="thrShow ? '收起' : '展开'" />
    </p>
    <div class="room-list" v-show="thrShow">
      <ItemCabinet v-for="(item, index) in cabinetList" :key="index"></ItemCabinet>
      <p v-if="cabinetList.length === 0">暂无数据</p>
    </div>
  </div>
  <div class="page-body" v-show="modelShow === 2">
    <p class="dispose-title">仓库配置-物理仪器室1</p>
    <p class="category-title">
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
    </div>
    <div class="equ-box">
      <div class="title-other">
        <p class="other">其他</p>
        <p class="notes">(未入库)</p>
      </div>
      <div class="equ-list">
        <ItemEqu></ItemEqu>
        <ItemEqu></ItemEqu>
        <ItemEqu></ItemEqu>
      </div>

      <div class="more">更多></div>
    </div>
    <p class="category-title">
      仪器
      <img :src="imgShow(fristShow)" alt="" @click="fristShow = !fristShow" :title="fristShow ? '收起' : '展开'" />
    </p>
    <div class="btn-box">
      <button
        v-for="(item, index) in cabinets"
        :key="index"
        :class="{ selbtn: selnametwo === item.name }"
        @click="selnametwo = item.name"
      >
        {{ item.name }}
      </button>
    </div>

    <div class="room-list" v-show="secShow">
      <div v-for="(item, index) in preparationRoomList" :key="index" class="room-item">{{ item }}</div>
      <p v-if="preparationRoomList.length === 0">暂无数据</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Item from './item/laboratory-item.vue'
import ItemCabinet from './item/cabinet-item.vue'
import ItemEqu from './item/equ-item.vue'
const options = ref([
  { value: 0, label: '物理' },
  { value: 1, label: '化学' }
])
const value = ref(0)
const instrumentRoomList = ref([{ id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }])
const preparationRoomList = ref([])
const cabinetList = ref([{ id: 0 }, { id: 0 }, { id: 0 }, { id: 0 }])
const secondTitle = ref('')
const fristShow = ref(true)
const cabinets = ref([
  { name: '其他' },
  { name: '仪器柜1' },
  { name: '仪器柜2' },
  { name: '仪器柜3' },
  { name: '仪器柜4' }
])
const selnameone = ref('其他')
const selnametwo = ref('其他')
const secShow = ref(true)
const thrShow = ref(true)

const imgShow = (index: boolean) => {
  if (index) {
    return require('@/assets/images/common/close.png')
  } else {
    return require('@/assets/images/common/open.png')
  }
}

const modelShow = ref(0)

const pageChange = (value: number) => {
  console.log(value)
  if (value === 1) {
    secondTitle.value = '仓库配置'
    modelShow.value = value
  } else if (value === 2) {
    secondTitle.value = '库内详情'
    modelShow.value = value
  }
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  & > :nth-child(1):hover {
    color: #05c65d;
    cursor: pointer;
  }
  & > span {
    float: left;
    margin-right: 6px;
  }
  & > div {
    float: right;
    & > span {
      padding-right: 20px;
    }
  }
}
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
    margin-bottom: 20px;
    padding: 0 34px;
    height: 60px;
    line-height: 60px;
    text-align: left;
    font-size: 20px;
    background-color: #fff;
  }
  .room-list {
    & > p {
      margin-bottom: 20px;
    }
    &:after {
      display: block;
      clear: both;
      content: '';
      visibility: hidden;
      height: 0;
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
      height: 70%;
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
