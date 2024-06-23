<template>
  <div>
    <el-dialog
      custom-class="detail-dialog"
      v-model="detailState"
      width="50%"
      title="损耗、报废登记卡详情"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="topArea">
        <div class="status-box">
          损耗报废状态:
          <!-- <span style="margin-left: 25%; color: #05c65d">
            {{ scrapRegistrationList.status === 5 ? '已通过' : '未通过' }}

          </span> -->
          <span v-show="scrapRegistrationList.status === 1">未提交</span>
          <span v-show="scrapRegistrationList.status === 2">待审核</span>
          <span v-show="scrapRegistrationList.status === 3">已撤回</span>
          <span v-show="scrapRegistrationList.status === 4">审核通过</span>
          <span v-show="scrapRegistrationList.status === 5">审核未通过</span>
        </div>
        <div class="base-box-detail">
          <div class="base-box">
            <div class="fl">
              <div class="line">
                <div class="name">类型：</div>
                <div>{{ scrapRegistrationList.mode === 1 ? '损耗' : '报废' }}</div>
              </div>
              <div class="line">
                <div class="name">原因：</div>
                <div v-show="scrapRegistrationList.cause === 1">
                  仪器超过使用年限，性能已不能达到实验需要的最低要求，且无法修复
                </div>
                <div v-show="scrapRegistrationList.cause === 2">损坏严重，无法修复</div>
                <div v-show="scrapRegistrationList.cause === 3">主要部件无处购配，无法修复使用</div>
                <div v-show="scrapRegistrationList.cause === 4">修理费昂贵，无修理价值</div>
              </div>
              <div class="line">
                <div class="name">处理方式：</div>
                <span>{{ scrapRegistrationList.process_mode === 1 ? '实验室留用' : '建立废旧实验室' }}</span>
              </div>
              <div class="line">
                <div class="name">总价值</div>
                <span>{{ scrapRegistrationList.price }}</span>
              </div>
              <div class="line">
                <div class="name">备注：</div>
                <span>{{ scrapRegistrationList.desc }}</span>
              </div>
              <div class="line" style="display: flex">
                <div class="name">照片说明</div>
                <img v-for="item in scrapRegistrationList.pic" :key="item.id" :src="item.url_path" class="img-size" />
              </div>
              <div class="line list">
                <div class="name">损耗报废仪器位置及数量清单：</div>
                <div v-for="item in scrapRegistrationList.list" :key="item.id" class="valueArea">
                  {{ item.name }}
                  {{ '(' + item.asset_number + ')' }}
                  {{ item.laboratory_name }}
                  {{ item.store_name }}
                  {{ '第' + item.number_plies + '层' }}
                  {{ item.total + '个' }}
                </div>
                <span v-show="scrapRegistrationList.list.length === 0" class="valueArea">无</span>
              </div>
            </div>
            <div class="fr">
              <div class="line">
                <div class="name">损耗报废单号：</div>
                <span>{{ scrapRegistrationList.record_number }}</span>
              </div>
              <div class="line">
                <div class="name">提交时间：</div>
                <span>{{ scrapRegistrationList.put_time }}</span>
              </div>
              <div class="line">
                <div class="name">提交人：</div>
                <span>{{ scrapRegistrationList.status !== 1 ? scrapRegistrationList.user_name : '' }}</span>
              </div>
              <div class="line">
                <div class="name">审核人</div>
                <span>{{ scrapRegistrationList.audit_user_name }}</span>
              </div>
              <div class="line">
                <div class="name">审核时间</div>
                <span>{{ scrapRegistrationList.audit_time }}</span>
              </div>
              <div class="line">
                <div class="name">审核备注</div>
                <span>{{ scrapRegistrationList.audit_desc }}</span>
              </div>
            </div>
          </div>

          <!-- <div class="line" >
            <div class="name">损耗报废单号：</div>
            <div>{{ scrapRegistrationList.record_number }}</div>
          </div> -->

          <!-- <div class="line" >
            <div class="name">提交时间：</div>
            <div>{{ scrapRegistrationList.create_time }}</div>
          </div> -->

          <!-- <div class="line" style="float: right; margin-bottom: 80px">
            <div class="name">提交人：</div>
            <div>{{ scrapRegistrationList.user_name }}</div>
          </div> -->

          <!-- <div class="line" style="width: 50%; height: 100px; display: block">
            <div class="name" style="width: 100%">照片说明</div>
            <div v-for="item in scrapRegistrationList.pic" :key="item.id">
              <img :src="item.url_path" class="imgArea" />
            </div>
          </div> -->

          <!-- <div class="line" style="width: 40%; height: 30%; display: block">
            <div class="name" style="width: 60%; height: 20%">损耗报废仪器位置及数量清单：</div>
            <div v-for="item in scrapRegistrationList.list" :key="item.id" class="valueArea">
              {{ item.name }}
              {{ '(' + item.asset_number + ')' }}
              {{ item.laboratory_name }}
              {{ item.store_name }}
              {{ '第' + item.number_plies + '层' }}
              {{ item.total + '个' }}
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
import { getScrapDetailInfo } from '@/service/instrument-manage/scrapRegistration/index'
import { scrapDetailData } from '@/service/instrument-manage/scrapRegistration/types'

let props = defineProps({ detailShow: Boolean, selectID: { type: Number, required: true } })
let { detailShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)

detailState.value = detailShow.value
const dataMap = reactive({
  scrapRegistrationList: scrapDetailData
})

getScrapDetailInfo({ id: selectID.value }).then((res) => {
  scrapRegistrationList.value = res.data
})

let { scrapRegistrationList } = toRefs(dataMap)

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
      width: 30%;
      height: 5%;
      float: left;
      margin-left: 8%;
      justify-content: left;
      display: flex;
      font-weight: 600;
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
        .name {
          float: left;
          width: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
          font-weight: 600;
        }
        span {
          width: 60%;
          float: left;
          display: flex;
          text-align: left;
          justify-content: flex-start;
        }
        .value {
          display: flex;
          height: 20px;
          width: 100%;
          align-items: left;
        }
        .valueArea {
          float: left;
          height: 80%;
          margin-left: 20px;
          width: 80%;
          display: flex;
          justify-content: flex-start;
          text-align: left;
        }
        .imgArea {
          margin-top: 20px;
          width: 30%;
          height: 80px;
          margin-left: 3%;
          float: left;
          border: 1px solid #05c65d;
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
