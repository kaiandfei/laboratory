<template>
  <div>
    <el-dialog
      custom-class="detail-dialog"
      v-model="detailState"
      width="50%"
      title="损坏赔偿登记卡详情"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="topArea">
        <div class="status-box">
          损坏赔偿状态:
          <span>
            {{ damageRegistrationList.status === 1 ? '未赔偿' : '已赔偿' }}
          </span>
        </div>
        <div class="base-box-detail">
          <div class="base-box">
            <div class="fl">
              <div class="line">
                <div class="name">损坏人：</div>
                <div>{{ damageRegistrationList.damage_man }}</div>
              </div>
              <div class="line">
                <div class="name">损坏情况与原因：</div>
                <div>
                  {{ damageRegistrationList.desc }}
                </div>
              </div>
              <div class="line">
                <div class="name">赔偿人：</div>
                <div>{{ damageRegistrationList.repay_man }}</div>
              </div>
              <div class="line">
                <div class="name">赔偿金额：</div>
                <div>{{ damageRegistrationList.repay_price }}</div>
              </div>

              <div class="line">
                <div class="name">赔偿时间</div>
                <div>{{ damageRegistrationList.repay_time }}</div>
              </div>
              <div class="line">
                <div class="name">赔偿说明</div>
                <div>{{ damageRegistrationList.repay_desc }}</div>
              </div>
              <div class="line" style="display: flex">
                <div class="name">照片说明</div>
                <img
                  v-for="(item, index) in damageRegistrationList.pic"
                  :key="index"
                  :src="item.url_path"
                  class="img-size"
                />
              </div>
              <div class="line list">
                <div class="name">损坏赔偿仪器位置及数量清单：</div>
                <div v-for="item in damageRegistrationList.list" :key="item.id" class="valueArea">
                  {{ item.name }}
                  {{ '(' + item.asset_number + ')' }}
                  {{ item.laboratory_name }}
                  {{ item.store_name }}
                  {{ '第' + item.number_plies + '层' }}
                  {{ item.total + '个' }}
                </div>
                <spam v-show="damageRegistrationList.list.length === 0" class="valueArea">无</spam>
              </div>
            </div>
            <div class="fr">
              <div class="line">
                <div class="name">损耗报废单号：</div>
                <div>{{ damageRegistrationList.record_number }}</div>
              </div>
              <div class="line">
                <div class="name">登记时间：</div>
                <div>{{ damageRegistrationList.create_time }}</div>
              </div>

              <div class="line">
                <div class="name">登记人：</div>
                <div>{{ damageRegistrationList.user_name }}</div>
              </div>
            </div>
          </div>

          <!-- <div class="line" style="float: right">
            <div class="name">损耗报废单号：</div>
            <div>{{ damageRegistrationList.record_number }}</div>
          </div> -->

          <!-- <div class="line" style="float: right">
            <div class="name">登记时间：</div>
            <div>{{ damageRegistrationList.create_time }}</div>
          </div> -->

          <!-- <div class="line" style="float: right; margin-bottom: 240px">
            <div class="name">登记人：</div>
            <div>{{ damageRegistrationList.user_name }}</div>
          </div> -->

          <!-- <div class="line" style="width: 50%; height: 100px; display: block">
            <div class="name">照片说明</div>
            <div v-for="(item, index) in damageRegistrationList.pic" :key="index">
              <img :src="item" class="imgArea" />
            </div>
          </div> -->
        </div>
      </div>
      <div class="buttonArea">
        <el-button type="primary" @click="back()">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { getInstrumentDetail } from '@/service/instrument-manage/damageRegistration/index'
import { instrumnetDetailData } from '@/service/instrument-manage/damageRegistration/types'

let props = defineProps({ detailShow: Boolean, selectID: { type: Number, required: true } })
let { detailShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)

detailState.value = detailShow.value
const dataMap = reactive({
  // damageRegistrationList: {
  //   damage_status: '已赔偿',
  //   damage_user: '张老师',
  //   damage_situation: '人为损坏',
  //   damage_number: '损坏赔偿单号',
  //   registration_time: '2021.03.21',
  //   compensate_user: '张老师',
  //   registration_user: '张管理员',
  //   compensate_value: 1000,
  //   compensate_time: '',
  //   compensate_detail: '',
  //   imgDetail: [
  //     {
  //       id: 1,
  //       url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220209/172710585.jpg'
  //     },
  //     {
  //       id: 2,
  //       url: ''
  //     }
  //   ],
  //   damage_instrument_info: [
  //     {
  //       damage_instrument_name: '烧杯',
  //       damage_school_id: '60001',
  //       data: [
  //         {
  //           school_laboratory_name: '物理仪器库',
  //           store_id: '仪器柜1',
  //           number_plies: '第一层',
  //           number: 30
  //         },
  //         {
  //           school_laboratory_name: '物理仪器库',
  //           store_id: '仪器柜1',
  //           number_plies: '第二层',
  //           number: 30
  //         },
  //         {
  //           school_laboratory_name: '物理仪器库',
  //           store_id: '仪器柜1',
  //           number_plies: '第三层',
  //           number: 30
  //         }
  //       ]
  //     }
  //   ]
  // }
  damageRegistrationList: instrumnetDetailData
})
let { damageRegistrationList } = toRefs(dataMap)

const initData = () => {
  getInstrumentDetail({ id: selectID.value }).then((res) => {
    damageRegistrationList.value = res.data
  })
}

initData()

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.detail-dialog) {
  margin-top: 50px;
  overflow: hidden;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    .title-box {
      display: flex;
      justify-content: space-evenly;
      height: 60px;
      .edit-title {
        width: 24%;
        height: 40px;
        line-height: 40px;
        color: #848484;
        border: #b5b5b5 1px solid;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        cursor: pointer;
      }
      .active-item {
        color: #05c65d;
      }
    }
    .titleArea {
      width: 200px;
      height: 5%;
      float: left;
      font-weight: 600;
      margin-left: 60px;
      justify-content: left;
      display: flex;
    }
    .detailArea {
      width: 90%;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #05c65d;
      .nav {
        width: 50%;
        height: 40px;
        float: left;
        align-items: center;
        display: flex;
        text-align: left;
        .name {
          float: left;
          width: 40%;
          font-weight: 600;
          margin-left: 20px;
          align-items: center;
          display: flex;
        }
        .value {
          display: flex;
          height: 20px;
          width: 100%;
          align-items: left;
        }
        .valueArea {
          margin: 4px 30px;
          float: left;
          min-height: 20px;
          width: 80%;
        }
        .imgArea {
          width: 80px;
          height: 80px;
          float: left;
        }
      }
    }
    .buttonArea {
      height: 50px;
      margin: 20px 5% 10px 0;
      float: right;
    }
  }
}
</style>
