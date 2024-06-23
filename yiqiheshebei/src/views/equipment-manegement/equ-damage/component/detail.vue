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
                <img v-for="(item, index) in damageRegistrationList.pic" :key="index" :src="item" class="img-size" />
              </div>
              <div class="line list">
                <div class="name">损坏赔偿设备位置及数量清单：</div>
                <div v-for="item in damageRegistrationList.list" :key="item.id">
                  {{ item.asset_number }}
                  {{ item.name }}
                  {{ item.specification }}
                  {{ item.laboratory_name }}
                </div>
                <span v-show="damageRegistrationList.list.length === 0">无</span>
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
import { getInstrumentDetail } from '@/service/equ-manage/damageRegistration/index'
import { instrumnetDetailData } from '@/service/equ-manage/damageRegistration/types'

let props = defineProps({ detailShow: Boolean, selectID: { type: Number, required: true } })
let { detailShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)

detailState.value = detailShow.value
const dataMap = reactive({
  damageRegistrationList: instrumnetDetailData
})
let { damageRegistrationList } = toRefs(dataMap)

const initData = () => {
  getInstrumentDetail({ id: selectID.value }).then((res) => {
    damageRegistrationList.value = JSON.parse(JSON.stringify(res.data))
    damageRegistrationList.value.pic = []
    res.data.pic.forEach((item: any) => {
      damageRegistrationList.value.pic.push(item.url_path)
    })
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
  // height: 650px;
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
      width: 180px;
      height: 5%;
      float: left;
      margin-left: 60px;
      justify-content: left;
      display: flex;
      font-weight: 600;
    }
    .detailArea {
      width: 90%;
      height: 450px;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #05c65d;
      .nav {
        width: 35%;
        height: 40px;
        float: left;
        align-items: center;
        display: flex;
        .name {
          float: left;
          width: 40%;
          height: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
          font-weight: 600;
        }
        .value {
          display: flex;
          height: 20px;
          width: 100%;
          align-items: left;
        }
        .valueArea {
          float: left;
          margin-left: 20px;
          height: 30%;
          width: 60%;
          text-align: left;
        }
        .imgArea {
          margin-top: 20px;
          width: 80px;
          height: 80px;
          margin-left: 5px;
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
