<template>
  <div>
    <div class="room-item" @mousemove="state = true" @mouseleave="state = false">
      <div v-show="state" class="pop-div">
        <button class="hover-button" @click="emit('pageChange', 1, itemData)">仓库配置</button>
        <button class="hover-button" @click="emit('pageChange', 2, itemData)">库内详情</button>
        <button class="hover-button" @click="getDetail(itemData.id)">基本信息</button>
      </div>
      <div class="item-box">
        <p class="item-title">
          <span>{{ itemData.title }}</span>
          <!-- <span>{{ standardList[itemData.level].name }}</span> -->
        </p>
        <p class="subject">{{ subjectName(itemData.subject) }}</p>
        <div class="img-box">
          <img
            v-show="itemData.picture"
            class="picture"
            :src="itemData.picture ? itemData.picture.url_path : ''"
            alt=""
          />
          <!-- <qrcode-vue class="qr" :value="itemData.qr_code || ''" level="H" /> -->
        </div>
        <p class="address">{{ itemData.location }}</p>
      </div>
    </div>
    <!-- <PopCurrency :popShow="detailShow" @close="detailShow = $event">
    <template v-slot:header>
      <p>实验室详情11111111111111111111111111111</p>
    </template>
    <template v-slot:main>
      <p class="aaa" @click="detailShow = false">中间</p>
      <p class="aaa">中间</p>
      <p class="aaa">中间</p>
      <p class="aaa">中间</p>
      <p class="aaa">中间</p>
      <p class="aaa">中间</p>
      <p class="aaa">中间</p>
      <p class="aaa">中间</p>
      <p class="aaa">中间</p>
    </template>
    <template v-slot:footer>
      <p class="bbb" @click="aaa">尾巴</p>
    </template>
  </PopCurrency> -->
    <el-dialog custom-class="ew-detail-dialog" v-model="detailShow" title="实验室详情" width="45%">
      <div class="list fl">
        <p>
          <span>实验名称：</span>
          <span>{{ detailData.title }}</span>
        </p>
        <p>
          <span>类型：</span>
          <span v-for="(item, index) in detailData.type" :key="index">{{ item.name }}&nbsp;&nbsp;</span>
        </p>
        <p>
          <span>学科：</span>
          <span v-for="(item, index) in detailData.subject" :key="index">
            {{ subjectArr.find((e) => e.id === item.subject_id)?.name }}&nbsp;&nbsp;
          </span>
        </p>
        <!-- <p>
          <span>分类：</span>
          <span>{{ standardList[detailData.level].name }}</span>
        </p>
        <p>
          <span>学科分类：</span>
          <span>
            {{ detailData.subject_type === 1 ? '文科' : detailData.subject_type === 2 ? '理科' : '文科/理科' }}
          </span>
        </p>
        <p>
          <span>配备：</span>
          <span>{{ requireList[detailData.is_must].name }}</span>
        </p> -->
        <p class="have-width">
          <span>功能描述：</span>
          <span>
            {{ detailData.desc }}
          </span>
        </p>
        <p>
          <span>位置：</span>
          <span>{{ detailData.location }}</span>
        </p>
        <p>
          <span>面积：</span>
          <span>{{ detailData.area }} ㎡</span>
        </p>
        <p>
          <span>实验室底色：</span>
          <i class="icon-square" :style="{ background: detailData.color_code }"></i>
        </p>
        <p class="have-width">
          <span>实验室照片：</span>
          <el-image
            v-for="(item, index) in detailData.picture"
            :key="index"
            style="width: 100px; height: 100px; margin-right: 10px"
            :src="item.url_path"
            :preview-src-list="[item.url_path]"
            :initial-index="1"
          ></el-image>
        </p>
      </div>
      <div class="message fr">
        <p class="header">信息</p>
        <p>
          <span>管理员：</span>
          <span v-for="(item, index) in detailData.users" :key="index">{{ item + ' ' }}</span>
        </p>
        <p>
          <span>实验室二维码：</span>
          <img class="qr-img" :src="detailData.qr_code" alt="" />

          <!-- <qrcode-vue class="qr-img" :value="detailData.qr_code" :size="100" level="H" /> -->
        </p>
        <!-- <div v-if="false" class="button">
          <img src="@assets/images/laboratory-manage/download.png" alt="" />
          下载
        </div> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button @click="detailShow = false">取消</el-button> -->
          <el-button type="primary" @click="detailShow = false">返回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, computed } from 'vue'
// import { PopCurrency } from '@/components/pop-currency'
import QrcodeVue from 'qrcode.vue'

import { getLaboratoryDetail } from '@service/laboratory-manage/overview/index'

import { RequestDataDetail } from '@service/laboratory-manage/overview/types'

import { useStore } from '@store/index'

const emit = defineEmits(['pageChange'])

let props = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})
let { itemData } = toRefs(props)

const store = useStore()

const dataMap = reactive({
  subjectArr: [...store.state.common.subjectArr],
  state: false,
  detailShow: false,
  detailData: RequestDataDetail
})
let { subjectArr, state, detailShow, detailData } = toRefs(dataMap)

const subjectName = computed(() => {
  return (list: { subject_id: number }[]) => {
    let str = ''
    list.forEach((e) => {
      subjectArr.value.forEach((i) => {
        if (i.id === e.subject_id) {
          if (str === '') {
            str = str + i.name
          } else {
            str = str + ',' + i.name
          }
        }
      })
    })
    return str
  }
})

const getDetail = (id: number) => {
  detailShow.value = true
  getLaboratoryDetail({ id }).then((res) => {
    detailData.value = res.data
  })
}

const standardList = reactive([
  {
    id: 0,
    name: '全部'
  },
  {
    id: 1,
    name: 'Ⅰ类'
  },
  {
    id: 2,
    name: 'Ⅱ类'
  },
  {
    id: 3,
    name: 'Ⅲ类'
  }
])
const requireList = reactive([
  {
    id: 0,
    name: '全部'
  },
  {
    id: 1,
    name: '必配'
  },
  {
    id: 2,
    name: '选配'
  }
])

// const aaa = () => {
//   console.log(b)
//   if (a.value) {
//     b = window.setTimeout(() => {
//       console.log('111111')
//     }, 4000)
//     console.log(b)
//     a.value = !a.value
//   } else {
//     console.log(b)
//     clearTimeout(b)
//   }
// }
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
}
:deep(.ew-detail-dialog) {
  margin-top: 60px;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    overflow: hidden;
    .list {
      width: 60%;
      & > p {
        display: flex;
        // align-items: center;
        width: 100%;
        min-height: 40px;
        text-align: left;
        color: #333;
        & > span:nth-of-type(1) {
          display: inline-block;
          padding-left: 15%;
          width: 40%;
          color: #848484;
          box-sizing: border-box;
        }
        // img {
        //   width: 200px;
        //   height: 114px;
        // }
        .icon-square {
          margin-top: -2px;
        }
      }
      & > .have-width {
        line-height: normal;
        overflow: hidden;
        & > span:nth-of-type(1) {
          float: left;
        }
        & > span:nth-of-type(2) {
          display: inline-block;
          line-height: 20px;
          width: 60%;
          min-height: 20px;
        }
      }
    }
    .message {
      margin-right: 6%;
      padding: 20px;
      width: 30%;
      height: 300px;
      background: #f3f3f3;
      box-sizing: border-box;
      .header {
        height: 31px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 31px;
        text-align: center;
        color: #05c65d;
      }
      & > p {
        text-align: left;
        color: #333;
        & > span {
          height: 24px;
          line-height: 24px;
        }
        & > span:nth-of-type(1) {
          display: inline-block;
          // padding-left: 10px;
          // min-width: 48%;
          color: #848484;
          box-sizing: border-box;
        }
        .qr-img {
          display: block;
          width: 150px;
          height: 150px;
          margin: 20px auto;
          background: rgba(0, 0, 0, 0.64);
          opacity: 1;
        }
      }
      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 100px;
        height: 36px;
        background: #05c65d;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 10px;
        img {
          margin: 6px;
        }
      }
    }
  }
}

.hover-button {
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
.hover-button:hover {
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

.icon-square {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background: #05c65d;
  margin-right: 8px;
  box-sizing: border-box;
}
</style>
