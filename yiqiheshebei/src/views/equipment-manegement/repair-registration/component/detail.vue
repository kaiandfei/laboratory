<template>
  <div>
    <el-dialog
      custom-class="detail-dialog"
      v-model="detailState"
      width="50%"
      title="维修保养登记卡详情"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="topArea">
        <div class="status-box">
          维修保养状态:
          <span>
            {{ repairRegistrationList.status === 3 ? '已完成' : '未完成' }}
          </span>
        </div>
        <div class="base-box-detail">
          <div class="base-box">
            <div class="fl">
              <div class="line">
                <div class="name">类型：</div>
                <div>{{ repairRegistrationList.mode === 1 ? '维修' : '保养' }}</div>
              </div>
              <div class="line">
                <div class="name">负责企业：</div>
                <div>{{ repairRegistrationList.factory }}</div>
              </div>

              <div class="line">
                <div class="name">开始时间：</div>
                <div>{{ repairRegistrationList.start_time }}</div>
              </div>
              <div class="line">
                <div class="name">预计完成时间：</div>
                <div>{{ repairRegistrationList.plan_end_time }}</div>
              </div>

              <div class="line">
                <div class="name">损坏情况：</div>
                <div>{{ repairRegistrationList.desc }}</div>
              </div>
              <div class="line list">
                <div class="name">照片说明</div>
                <img v-for="item in repairRegistrationList.pic" :key="item.id" :src="item.url_path" class="img-size" />
              </div>
              <div class="line list">
                <div class="name">维修保养仪器位置及数量清单：</div>
                <div v-for="item in repairRegistrationList.list" :key="item.id">
                  {{ item.asset_number }}
                  {{ item.name }}&nbsp;
                  <span :title="item.specification">{{ item.specification }}</span>
                  &nbsp; {{ item.laboratory_name }}&nbsp;
                  {{ item.store_name ? item.store_name + '第' + item.number_plies + '层' : '' }}&nbsp;
                  {{ item.total }}个
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="middleArea">
        <div class="left">
          <div class="nav">
            <div class="name">实际完成时间</div>
            <div>{{ repairRegistrationList.complete_time }}</div>
          </div>

          <div class="nav" style="display: block">
            <div class="name" style="width: 80%; height: 20%">维修保养后仪器位置及数量清单</div>
            <div
              v-for="(item, index) in repairRegistrationList.returnList"
              :key="index"
              class="value"
              style="margin-left: 20px"
            >
              <div class="valueList">
                {{ item.asset_number }}
                {{ item.name }}
                <span :title="item.specification">&nbsp;{{ item.specification }}&nbsp;</span>
                {{ item.laboratory_name }}&nbsp;
                {{ item.store_name ? item.store_name + '第' + item.number_plies + '层' : '' }}&nbsp; {{ item.total }}个
              </div>
            </div>
            <span
              v-show="!repairRegistrationList.returnList"
              class="value"
              style="width: 30%; float: left; text-align: left; margin-left: 20px"
            >
              无
            </span>
          </div>
        </div>
      </div>
      <div class="titleArea">
        <span v-show="lookTran === false" class="title" @click="getBottomList">查看损耗报废清单</span>
        <span v-show="lookTran" class="title" @click="getBottomList">取消查看损耗报废清单</span>
      </div>
      <div class="listArea" v-show="lookTran">
        <div class="left" v-for="(n, index) in lookDetail" :key="index">
          <div class="nav">
            <div class="name">登记时间</div>
            <div>{{ n.create_time }}</div>
          </div>
          <div class="nav">
            <div class="valueArea">
              <div v-for="(e, index) in n.list" :key="index">
                <div class="title">
                  {{ e.asset_number + ' ' + e.name }} &nbsp; {{ e.laboratory_name || '' }}&nbsp;
                  {{ e.store_name ? e.store_name + '第' + e.number_plies + '层' : '' }}&nbsp;
                </div>
                <div class="Area">
                  {{ e.total + '个' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonArea">
        <el-button type="primary" @click="back()">返回</el-button>
      </div>
      <!-- <template #footer>
        <el-button type="primary" @click="back()">返回</el-button>
      </template> -->
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { getMaintainListing, maintainChangeScrap } from '@/service/equ-manage/repairRegistration/index'
import { repairDetailData } from '@/service/equ-manage/repairRegistration/types'

let props = defineProps({ detailShow: Boolean, selectID: { type: Number, required: true } })
let { detailShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)

detailState.value = detailShow.value
const dataMap = reactive({
  repairRegistrationList: repairDetailData,
  lookTran: false,
  lookDetail: Array<{
    create_time: string
    list: [
      {
        asset_number: ''
        name: ''
        laboratory_name: ''
        store_name: ''
        number_plies: 0
        total: 0
      }
    ]
  }>()
})

getMaintainListing({ id: selectID.value }).then((res) => {
  repairRegistrationList.value = res.data
})

const getBottomList = () => {
  lookTran.value = !lookTran.value
  if (lookTran.value) {
    maintainChangeScrap({ number: repairRegistrationList.value.record_number }).then((res) => {
      lookDetail.value = res.data
    })
  }
}

let { repairRegistrationList, lookTran, lookDetail } = toRefs(dataMap)

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
    .detailArea {
      width: 90%;

      .nav {
        width: 50%;
        min-height: 40px;
        align-items: center;
        display: flex;
        .name {
          width: 30%;
          margin-left: 20px;
          align-items: center;
          display: flex;
          font-weight: 600;
        }

        .valueArea {
          margin-left: 20px;
          width: 30%;
          text-align: left;
        }
        .imgArea {
          width: 100px;
          height: 80px;
          margin-left: 3%;
          text-align: left;
          border: 1px solid #05c65d;
        }
      }

      .list-box {
        display: block;
        .name {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .valueArea {
          padding: 0 10px;
          width: 90%;
          & > span {
            display: inline-block;
            max-width: 20%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
          }
        }
      }
    }
    .middleArea {
      width: 90%;
      // min-height: 170px;
      float: left;
      margin-left: 5%;
      margin-top: 20px;
      padding: 0;
      border: 1px solid #05c65d;
      .left {
        width: 80%;
        height: 100%;
        float: left;
        .nav {
          width: 100%;
          min-height: 40px;
          float: left;
          align-items: center;
          // justify-content: left;
          display: flex;
          .name {
            float: left;
            width: 40%;
            height: 40%;
            font-weight: 600;
            margin-left: 20px;
            align-items: center;
            display: flex;
          }
          .value {
            // display: flex;
            // min-height: 30px;
            // width: 100%;
            // align-items: center;
            // border: 1px solid red;
            .valueList {
              float: left;
              display: flex;
              height: 30px;
              width: 100%;
              align-items: left;
            }
          }
          .valueArea {
            float: left;
            margin-left: 20px;
            min-height: 80%;
            width: 80%;
          }
        }
      }
    }
    .titleArea {
      width: 50%;
      float: left;
      margin-left: 5%;
      margin-top: 20px;
      .title {
        margin-left: 10px;
        float: left;
        color: green;
        cursor: pointer;
      }
    }
    .listArea {
      padding: 10px 20px;
      width: 90%;
      float: left;
      margin-left: 5%;
      height: 100px;
      border: 1px solid #05c65d;
      box-sizing: border-box;
      overflow: auto;
      .left {
        // width: 40%;
        height: 100%;
        float: left;
        .nav {
          width: 100%;
          float: left;
          align-items: center;
          // justify-content: left;
          display: flex;
          .name {
            float: left;
            width: 40%;
            height: 40%;
            font-weight: 600;
            align-items: center;
            display: flex;
          }
          .value {
            display: flex;
            // height: 20%;
            width: 100%;
            align-items: left;
          }
          .valueArea {
            float: left;
            min-height: 30px;
            width: 100%;
            & > div {
              display: flex;
            }
            .title {
              // float: left;
              // height: 50px;
            }
            .Area {
              margin: 0 6px;
              // width: 100%;
              // height: 60px;
            }
          }
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
