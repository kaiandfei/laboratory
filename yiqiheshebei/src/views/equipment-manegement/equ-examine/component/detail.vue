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
                <div>
                  <span v-show="scrapRegistrationList.cause === 1">
                    仪器超过使用年限，性能已不能达到实验需要的最低要求，且无法修复
                  </span>
                  <span v-show="scrapRegistrationList.cause === 2">损坏严重，无法修复</span>
                  <span v-show="scrapRegistrationList.cause === 3">主要部件无处购配，无法修复使用</span>
                  <span v-show="scrapRegistrationList.cause === 4">修理费昂贵，无修理价值</span>
                </div>
              </div>
              <div class="line">
                <div class="name">处理方式：</div>
                <div>{{ scrapRegistrationList.process_mode === 1 ? '实验室留用' : '建立废旧实验室' }}</div>
              </div>
              <div class="line">
                <div class="name">备注：</div>
                <div>{{ scrapRegistrationList.desc }}</div>
              </div>
              <div class="line">
                <div class="name">照片说明</div>
                <div v-for="item in scrapRegistrationList.pic" :key="item.id">
                  <img :src="item.url_path" class="img-size" />
                </div>
              </div>

              <div class="line">
                <div class="name">总价值</div>
                <div>{{ scrapRegistrationList.price }}</div>
              </div>

              <div class="line list">
                <div class="name">损耗报废仪器位置及数量清单：</div>
                <div v-for="item in scrapRegistrationList.list" :key="item.id" class="valueArea">
                  {{ item.asset_number }}
                  {{ item.name }}
                  {{ item.specification }}
                  {{ item.laboratory_name }}
                </div>
              </div>
            </div>
            <div class="fr">
              <div class="line">
                <div class="name">损耗报废单号：</div>
                <div>{{ scrapRegistrationList.record_number }}</div>
              </div>
              <div class="line">
                <div class="name">提交时间：</div>
                <div>{{ scrapRegistrationList.create_time }}</div>
              </div>
              <div class="line">
                <div class="name">提交人：</div>
                <div>{{ scrapRegistrationList.user_name }}</div>
              </div>
              <div class="line">
                <div class="name">审核人</div>
                <div>{{ scrapRegistrationList.audit_user_name }}</div>
              </div>
              <div class="line">
                <div class="name">审核时间</div>
                <div>{{ scrapRegistrationList.audit_time }}</div>
              </div>
              <div class="line">
                <div class="name">审核备注</div>
                <div>{{ scrapRegistrationList.audit_desc }}</div>
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
import { getScrapDetailInfo } from '@/service/equ-manage/scrapRegistration/index'
import { scrapDetailData } from '@/service/equ-manage/scrapRegistration/types'

let props = defineProps({ detailShow: Boolean, selectID: { type: Number, required: true } })
let { detailShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)

detailState.value = detailShow.value
const dataMap = reactive({
  scrapRegistrationList: scrapDetailData
})

getScrapDetailInfo({ id: selectID.value }).then((res) => {
  console.log(res)
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
      margin-left: 5%;
      padding: 0 0 10px 0;
      width: 90%;
      // min-height: 400px;
      float: left;
      border: 1px solid #05c65d;
      .nav {
        width: 50%;
        height: 40px;
        float: left;
        align-items: center;
        // justify-content: left;
        display: flex;
        .name {
          float: left;
          width: 120px;
          height: 40%;
          margin-left: 20px;
          font-weight: 600;
          align-items: center;
          display: flex;
        }
        .imgTitle {
          width: 100%;
          float: left;
          height: 30px;
          display: flex;
          align-items: center;
          justify-items: flex-start;
        }
        .showArea {
          width: 100%;
          height: 90px;
          float: left;
        }
        .value {
          display: flex;
          padding: 4px 0;
          // height: 20px;
          width: 100%;
          text-align: left;
          align-items: left;
        }
        .valueArea {
          float: left;
          margin-left: 20px;
          min-height: 80%;
          width: 80%;
        }
        .imgArea {
          margin-top: 10px;
          width: 80px;
          height: 80px;
          float: left;
        }
      }

      .nav2 {
        padding: 4px 20px;
        width: 50%;
        min-height: 160px;
        float: left;
        // justify-content: left;
        box-sizing: border-box;

        .name {
          width: 120px;
          display: flex;
          align-items: center;
          justify-items: flex-start;
          font-weight: 600;
        }
        .valueArea {
          margin-left: 0 !important;
          padding: 4px 0;
          display: flex;
          min-height: 20px;
          text-align: left;
          justify-content: flex-start;
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
