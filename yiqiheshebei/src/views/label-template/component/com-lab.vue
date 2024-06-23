<template>
  <div
    class="li-item"
    :style="{
      backgroundImage:
        listData.source === 1 ? 'url(' + imgUrl + ')' : listData.imgUrl ? 'url(' + listData.imgUrl + ')' : '',
      backgroundColor: color
    }"
  >
    <div class="card">
      <div class="tem-title">
        {{ listData.header }}
        <div class="del" v-if="listData.header && !refs.isBg.value" @click="handleDel('header')">-</div>
      </div>
      <img class="code" :src="listData.qr_code" alt="" crossorigin="anonymous" />
      <div class="info">
        <div
          class="avatar"
          v-if="(listData.isSchool_logo && listData.school_logo) || (listData.source === 1 && listData.source_id === 1)"
        >
          <img :src="listData.school_logo" alt="" crossorigin="anonymous" />
          <div class="del" @click="handleDel('school_logo')" v-if="listData.school_logo && !refs.isBg.value">-</div>
        </div>
        <div class="lab-school" v-if="listData.school || listData.title">
          <div class="school" v-if="listData.school">
            {{ listData.school }}
            <div class="del1" @click="handleDel('school')" v-if="listData.school && !refs.isBg.value">-</div>
          </div>
          <div class="lab" v-if="listData.title">
            {{ listData.title }}
            <div class="del2" @click="handleDel('title')" v-if="listData.title && !refs.isBg.value">-</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch, toRefs, defineExpose } from 'vue'
const props = defineProps(['infoData', 'color', 'isBg'])
const refs = toRefs(props)
let color = ref()
watch(
  () => refs.color.value,
  (newValue, oldValue) => {
    color.value = newValue
  },
  { immediate: true }
)
let listData = ref()
let imgUrl = require('../../../assets/images/common/model_bg.png')
// let imgUrl = ref('../../../assets/images/common/model_bg.png')
listData.value = refs.infoData.value
// console.log(46, listData.value)

const handleDel = (val: string) => {
  if (val === 'school_logo') {
    delete listData.value['isSchool_logo']
  }
  delete listData.value[val]
  // listData.value[val] = ''
}
defineExpose({ listData })
</script>

<style lang="scss" scoped>
.bgImg {
  background: url(../../../assets/images/common/model_bg.png) no-repeat;
  background-size: 100% 100%;
}

.bgC {
  background-color: v-bind('color');
}

.li-item {
  // width: 400px;
  height: 500px;
  padding: 20px;
  box-sizing: border-box;
  background-size: cover;
  background-repeat: no-repeat;

  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .tem-title {
      height: 30px;
      font-size: 25px;
      text-align: center;
      position: relative;

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
        top: -12px;
        right: -15px;
        cursor: pointer;
      }
    }
  }

  .code {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    margin: 30px 67px 0;
  }

  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    // height: 115px;
    font-size: 20px;
    font-weight: bold;
    position: relative;

    .avatar {
      width: 60px;
      height: 60px;
      position: relative;

      img {
        width: 60px;
        height: 60px;
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
        top: -12px;
        right: -15px;
        cursor: pointer;
      }
    }

    .lab-school {
      display: flex;
      flex-direction: column;
      justify-content: center;
      // width: 140px;
      color: #05c65d;
      margin: 0 20px 0 40px;

      .school {
        height: 26px;
        position: relative;
      }

      .del1 {
        width: 15px;
        height: 15px;
        line-height: 12px;
        font-size: 25px;
        text-align: center;
        color: #fff;
        background-color: red;
        border-radius: 50%;
        position: absolute;
        top: -12px;
        right: -15px;
        cursor: pointer;
      }

      .lab {
        height: 24px;
        font-size: 18px;
        color: #189755;
        margin-top: 10px;
        position: relative;
      }

      .del2 {
        width: 15px;
        height: 15px;
        line-height: 12px;
        font-size: 25px;
        text-align: center;
        color: #fff;
        background-color: red;
        border-radius: 50%;
        position: absolute;
        top: -6px;
        right: 3px;
        cursor: pointer;
      }
    }
  }
}
</style>
