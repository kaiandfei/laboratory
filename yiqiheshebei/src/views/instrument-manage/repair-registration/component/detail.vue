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
          维修保养单状态:
          <span>{{ repairRegistrationList.is_finish === 1 ? '已结束' : '未结束' }}</span>
        </div>
        <div class="base-box-detail">
          <div class="base-box">
            <div class="fl">
              <div class="line">
                <div class="name">类型：</div>
                <div>{{ repairRegistrationList.mode === 1 ? '维修' : '保养' }}</div>
              </div>
              <div class="line">
                <div class="name">负责企业</div>
                <div>
                  {{ repairRegistrationList.factory }}
                </div>
              </div>
              <div class="line">
                <div class="name">开始时间</div>
                <div>{{ repairRegistrationList.start_time }}</div>
              </div>
              <div class="line">
                <div class="name">预计完成时间：</div>
                <div>{{ repairRegistrationList.plan_end_time }}</div>
              </div>
              <div class="line">
                <div class="name">损坏情况</div>
                <div>{{ repairRegistrationList.desc }}</div>
              </div>
              <div class="line">
                <div class="name">照片说明</div>
                <img
                  v-for="(item, index) in repairRegistrationList.pic"
                  :key="index"
                  :src="item.url_path"
                  class="img-size"
                />
              </div>
              <div class="line list">
                <div class="name">维修保养仪器位置及数量清单：</div>
                <div v-for="item in repairRegistrationList.list" :key="item.id" class="value">
                  {{ item.name }}
                  {{ '(' + item.asset_number + ')' }}
                  {{
                    item.store_name
                      ? item.laboratory_name + ' ' + item.store_name + ' ' + '第' + item.number_plies + '层'
                      : item.laboratory_name
                  }}
                  {{ item.total + '个' }}
                </div>
                <span v-show="!repairRegistrationList.list" class="value">无</span>
              </div>
            </div>
            <div class="fr">
              <div class="line">
                <div class="name">维修保养单号：</div>
                <div>{{ repairRegistrationList.record_number }}</div>
              </div>
              <div class="line">
                <div class="name">维修保养状态</div>
                <span v-show="repairRegistrationList.mode === 1 && repairRegistrationList.status === 1">维修中</span>
                <span v-show="repairRegistrationList.mode === 1 && repairRegistrationList.status === 2">
                  维修部分完成
                </span>
                <span v-show="repairRegistrationList.mode === 1 && repairRegistrationList.status === 3">维修完成</span>
                <span v-show="repairRegistrationList.mode === 1 && repairRegistrationList.status === -1">
                  维修中（已转报废）
                </span>
                <span v-show="repairRegistrationList.mode === 2 && repairRegistrationList.status === 1">保养中</span>
                <span v-show="repairRegistrationList.mode === 2 && repairRegistrationList.status === 2">
                  保养部分完成
                </span>
                <span v-show="repairRegistrationList.mode === 2 && repairRegistrationList.status === 3">保养完成</span>
              </div>
              <div class="line list">
                <div class="name">未维修保养完成仪器清单</div>
                <div v-for="item in repairRegistrationList.nuReturn" :key="item.id" class="value">
                  {{ item.asset_number }}
                  {{ item.name }}
                  {{
                    item.store_name
                      ? item.laboratory_name + ' ' + item.store_name + ' ' + '第' + item.number_plies + '层'
                      : item.laboratory_name
                  }}
                  {{ item.residue + '个' }}
                  {{ '[ 报废：' + (item.scrap_total || 0) + ' ]' }}
                </div>
                <span v-show="!repairRegistrationList.nuReturn" class="value">无</span>
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
              v-for="(n, index) in repairRegistrationList.returnList"
              :key="index"
              class="value"
              style="margin-left: 20px"
            >
              <div class="valueList">
                {{ n.name }}
                {{ n.hardware_number ? '(' + n.hardware_number + ')' : '' }}
                {{ n.laboratory_name }}
                {{ n.store_name }}
                {{ '第' + n.number_plies + '层' }}
                {{ n.total + '个' }}
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
        <span v-show="listStatus === false" class="title" @click="showDamageInfo(repairRegistrationList.record_number)">
          查看损耗报废清单
        </span>
        <span v-show="listStatus" class="title" @click="showDamageInfo(repairRegistrationList.record_number)">
          取消查看损耗报废清单
        </span>
      </div>
      <div class="listArea" v-show="listStatus">
        <div class="left" v-for="(n, index) in listData" :key="index">
          <div class="nav">
            <div class="name">登记时间</div>
            <div>{{ n.create_time }}</div>
          </div>
          <div class="nav">
            <div class="valueArea">
              <div v-for="item in n.list" :key="item.id">
                <div class="title">{{ item.asset_number }}&nbsp;&nbsp;{{ item.name }}</div>
                <div class="Area">
                  {{ item.total + '个' }}
                </div>
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
import { ref, toRefs } from 'vue'
import { getDetailInfo, getDamageDetailInfo } from '@/service/instrument-manage/repairRegistration/index'

let props = defineProps({ detailShow: Boolean, selectID: { type: Number, required: true } })
let { detailShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)
let listStatus = ref(false)

detailState.value = detailShow.value
// const dataMap = reactive({
//   listData: damageData
// })
// let { listData } = toRefs(dataMap)
const listData: any = ref({})
const repairRegistrationList: any = ref({})

const initData = () => {
  getDetailInfo({ id: selectID.value }).then((res) => {
    repairRegistrationList.value = res.data
    console.log(res)
  })
}

initData()

const showDamageInfo = (data: string) => {
  if (listStatus.value) {
    listStatus.value = !listStatus.value
  } else {
    getDamageDetailInfo({ number: data }).then((res) => {
      if (res.code === 10) {
        listData.value = res.data
        listStatus.value = !listStatus.value
        console.log(listData.value)
      } else {
        return
      }
    })
  }
}

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.detail-dialog) {
  margin-top: 50px;
  // padding: 0 0 10px 0;
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
      width: 20%;
      height: 5%;
      float: left;
      margin-left: 66%;
      font-weight: 600;
      justify-content: left;
      display: flex;
    }
    .detailArea {
      margin-left: 5%;
      padding: 0 0 10px 0;
      width: 90%;
      // min-height: 400px;
      float: left;
      border: 1px solid #05c65d;
      .nav {
        width: 35%;
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
        width: 40%;
        min-height: 40px;
        float: right;
        align-items: center;
        // justify-content: left;
        display: flex;
        flex-wrap: wrap;
        .name {
          width: 120px;
          height: 40%;
          display: flex;
          align-items: center;
          justify-items: flex-start;
          font-weight: 600;
        }
        .value {
          margin-left: 0 !important;
          padding: 4px 0;
          // display: flex;
          min-height: 20px;
          text-align: left;
          // justify-content: flex-start;
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
