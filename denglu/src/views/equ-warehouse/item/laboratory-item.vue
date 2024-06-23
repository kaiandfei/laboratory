<template>
  <div class="room-item" @mousemove="state = true" @mouseleave="state = false">
    <div v-show="state" class="pop-div">
      <button @click="emit('pageChange', 1)">仓库配置</button>
      <button @click="emit('pageChange', 2)">库存详情</button>
      <button @click="popState = true">基本信息</button>
    </div>
    <div class="item-box">
      <p class="item-title">
        <span>物理仪器室1</span>
        <span>Ⅰ类</span>
      </p>
      <p class="subject">物理</p>
      <div class="img-box">
        <img class="picture" src="@/assets/images/test/bg.png" alt="" />
        <img class="qr" src="@/assets/images/test/qr.png" alt="" />
      </div>
      <p class="address">教学楼A区</p>
    </div>
  </div>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>实验室详情11111111111111111111111111111</p>
    </template>
    <template v-slot:main>
      <p class="aaa">中间</p>
    </template>
    <template v-slot:footer>
      <p class="bbb" @click="aaa">尾巴</p>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PopCurrency } from '@/components/pop-currency'
const emit = defineEmits(['pageChange'])
const popState = ref(false)
const state = ref(false)
const a = ref(true)
let b: number

const aaa = () => {
  console.log(b)
  if (a.value) {
    b = setTimeout(() => {
      console.log('111111')
    }, 4000)
    console.log(b)
    a.value = !a.value
  } else {
    console.log(b)
    clearTimeout(b)
  }
}
</script>

<style scoped lang="scss">
.room-item {
  float: left;
  position: relative;
  margin: 0 0.5% 30px;
  width: 24%;
  min-width: 400px;
  height: 345px;
  background-color: #fff;
  border-radius: 0 10px 10px 10px;
  .item-box {
    position: absolute;
    padding: 0 9.25% 0 6.75%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .item-title {
      margin-top: 20px;
      height: 26px;
      line-height: 26px;
      font-size: 20px;
      font-weight: bold;
      color: #05c65d;
      & > :nth-child(1) {
        float: left;
      }
      & > :nth-child(2) {
        float: right;
      }
    }
    .subject {
      margin-top: 10px;
      height: 20px;
      line-height: 20px;
      color: #333;
      font-size: 14px;
      text-align: left;
    }
    .address {
      margin-top: 20px;
      height: 20px;
      line-height: 20px;
      color: #333;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    .img-box {
      position: relative;
      width: 100%;
      height: 200px;
      .picture {
        position: absolute;
        left: 0;
        width: 80%;
        height: 100%;
      }
      .qr {
        position: absolute;
        top: 46px;
        right: 5px;
        width: 30%;
        z-index: 1;
      }
    }
  }
}
.pop-div {
  position: absolute;
  margin: auto;
  padding-top: 92px;
  width: 100%;
  height: 100%;
  background-color: rgba(84, 84, 84, 0.51);
  border-radius: 0 10px 10px 10px;
  box-sizing: border-box;
  z-index: 2;
}
button {
  display: block;
  margin-left: 37.5%;
  margin-bottom: 30px;
  width: 25%;
  height: 36px;
  font-size: 14px;
  border: 1px solid #c9c7c7;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  cursor: pointer;
}
button:hover {
  background-color: #05c65d;
  border: 0;
  color: #fff;
}
.aaa {
  color: #05c65d;
}
.bbb {
  color: red;
}
</style>
