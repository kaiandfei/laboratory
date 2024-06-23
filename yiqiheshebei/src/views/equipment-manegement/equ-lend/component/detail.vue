<template>
  <div>
    <el-dialog
      custom-class="detail-dialog"
      v-model="detailState"
      width="50%"
      title="出借登记卡详情"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="topArea">
        <div class="status-box">
          借单状态:
          <span>
            {{ lendRegistrationList.is_finish === 1 ? '已结束' : '未结束' }}
          </span>
        </div>
        <div class="base-box-detail">
          <div class="base-box">
            <div class="fl">
              <div class="line">
                <div class="name">*出借人：</div>
                <div>{{ lendRegistrationList.lender }}</div>
              </div>
              <div class="line">
                <div class="name">借单号:</div>
                <div>
                  {{ lendRegistrationList.record_number }}
                </div>
              </div>
              <div class="line">
                <div class="name">*出借时间：</div>
                <div>{{ lendRegistrationList.start_time }}</div>
              </div>
              <div class="line">
                <div class="name">预计归还时间：</div>
                <div>{{ lendRegistrationList.plan_end_time }}</div>
              </div>
              <div class="line">
                <div class="name">出借备注：</div>
                <div>{{ lendRegistrationList.lend_desc }}</div>
              </div>
              <div class="line list">
                <div class="name">出借仪器位置及数量清单：</div>
                <div v-for="item in lendRegistrationList.list" :key="item.id">
                  {{ item.name }}
                  {{ '(' + item.asset_number + ')' }}
                  &nbsp; {{ item.laboratory_name }}&nbsp;
                  {{ item.store_name ? item.store_name + '第' + item.number_plies + '层' : '' }}&nbsp;
                  {{ item.total + '个' }}
                </div>
              </div>
            </div>
            <div class="fr">
              <div class="line">
                <div class="name">归还状态:</div>
                <div>
                  <span v-show="lendRegistrationList.status === 1">{{ '待归还' }}</span>
                  <span v-show="lendRegistrationList.status === 2">{{ '未全部归还' }}</span>
                  <span v-show="lendRegistrationList.status === 3">{{ '全部归还' }}</span>
                </div>
              </div>

              <div class="line list">
                <div class="name">未归还仪器清单：</div>
                <div v-for="item in lendRegistrationList.nuReturn" :key="item.id">
                  {{ item.asset_number }}
                  {{ item.name }}
                  &nbsp; {{ item.laboratory_name }}&nbsp;
                  {{ item.store_name ? item.store_name + '第' + item.number_plies + '层' : '' }}&nbsp;
                  {{ item.total + '个' }}&nbsp;
                  <span v-show="item.maintain_total">{{ '维修：' + item.maintain_total }}</span>
                  <span v-show="item.scrap_total">{{ '损耗：' + item.scrap_total }}</span>
                  <span v-show="item.damage_total">{{ '损坏：' + item.damage_total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="middleArea">
        <div class="left">
          <div class="nav">
            <div class="name">实际归还时间</div>
            <div>{{ lendRegistrationList.end_time }}</div>
          </div>
          <div class="nav">
            <div class="name">归还备注</div>
            <div>{{ lendRegistrationList.return_tips }}</div>
          </div>
          <div class="nav" style="display: block">
            <div class="name" style="width: 50%; height: 20%">归还仪器位置及数量清单</div>
            <div v-for="item in lendRegistrationList.returnList" :key="item.id" class="value" style="margin-left: 20px">
              {{ item.name }}
              {{ '(' + item.asset_number + ')' }}
              &nbsp; {{ item.laboratory_name }}&nbsp;
              {{ item.store_name ? item.store_name + '第' + item.number_plies + '层' : '' }}&nbsp;

              {{ item.total + '个' }}
            </div>
          </div>
        </div>
      </div>
      <div class="titleArea">
        <span v-show="listStatus !== 2" class="title" @click="showList(2)">查看损耗报废清单</span>
        <span v-show="listStatus === 2" class="title" @click="showList(1)">取消查看损耗报废清单</span>
        <span v-show="listStatus !== 3" class="title" @click="showList(3)">查看维修保养清单</span>
        <span v-show="listStatus === 3" class="title" @click="showList(1)">取消查看维修保养清单</span>
        <span v-show="listStatus !== 4" class="title" @click="showList(4)">查看损坏赔偿清单</span>
        <span v-show="listStatus === 4" class="title" @click="showList(1)">取消查看损坏赔偿清单</span>
      </div>
      <div class="listArea" v-show="listStatus === 2 || listStatus === 3 || listStatus === 4">
        <div class="left" v-for="(item, index) in listData" :key="index">
          <div class="nav">
            <div class="name">登记时间</div>
            <div>{{ item.creat_time }}</div>
          </div>
          <div class="nav">
            <div class="valueArea">
              <div v-for="n in item.list" :key="n.id">
                <div class="Area">
                  {{ n.asset_number }}
                  {{ n.name }}
                  {{ n.bacth + '批次' }}
                  {{ n.total + '个' }}
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
import { ref, toRefs, reactive } from 'vue'
import { getLendDetail, getLendDetailInventoryList } from '@/service/instrument-manage/lendRegistration/index'
import { lendDetailData, lendDetailInventoryData } from '@/service/instrument-manage/lendRegistration//types'

let props = defineProps({ detailShow: Boolean, selectInstrumentId: { type: Number, required: true } })
let { detailShow, selectInstrumentId } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)
let listStatus = ref(1)
let inventoryType = ref(1)

detailState.value = detailShow.value
const dataMap = reactive({
  lendRegistrationList: lendDetailData,
  listData: [lendDetailInventoryData],
  scrapListData: {
    registrationTime: '2021.12.20',
    instrumentList: [
      {
        school_number: '60001',
        instrument_name: '烧杯',
        number: 5,
        data: [
          {
            time: '2010.10.10',
            number: 2
          },
          {
            time: '2012.10.10',
            number: 3
          }
        ]
      }
    ]
  },
  repairListData: {
    registrationTime: '2021.12.20',
    instrumentList: [
      {
        school_number: '60001',
        instrument_name: '试管',
        number: 5,
        data: [
          {
            time: '2010.10.10',
            number: 2
          },
          {
            time: '2012.10.10',
            number: 3
          }
        ]
      }
    ]
  },
  damageListData: {
    registrationTime: '2021.12.20',
    instrumentList: [
      {
        school_number: '60001',
        instrument_name: '导线',
        number: 5,
        data: [
          {
            time: '2010.10.10',
            number: 2
          },
          {
            time: '2012.10.10',
            number: 3
          }
        ]
      }
    ]
  }
})
let { lendRegistrationList, listData } = toRefs(dataMap)

getLendDetail({ id: selectInstrumentId.value }).then((res) => {
  console.log(res)
  lendRegistrationList.value = res.data
})

const showList = (status: number) => {
  listStatus.value = status
  switch (status) {
    case 2:
      inventoryType.value = 1
      break
    case 3:
      inventoryType.value = 2
      break
    case 4:
      inventoryType.value = 3
      break
  }
  listData.value = []
  getLendDetailInventoryList({ number: lendRegistrationList.value.record_number, type: inventoryType.value }).then(
    (res) => {
      listData.value = res.data
    }
  )
}

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.detail-dialog) {
  margin-top: 50px;
  height: 850px;
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
      justify-content: left;
      display: flex;
    }
    .statusTitle {
      width: 160px;
      height: 5%;
      float: left;
      justify-content: left;
      display: flex;
      margin-left: 60px;
      font-weight: 600;
    }
    .detailArea,
    .middleArea {
      padding: 0 0 10px 0;
      width: 90%;
      float: left;
      margin-left: 5%;
      border: 1px solid #05c65d;
      .nav {
        width: 50%;
        min-height: 40px;
        float: left;
        align-items: center;
        // justify-content: left;
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
          padding: 4px 0;
          display: flex;
          height: 30%;
          width: 100%;
          align-items: center;
          justify-content: left;
          text-align: left;
        }
        .valueArea {
          float: left;
          margin-left: 20px;
          width: 100%;
        }
      }
      .nav2 {
        width: 50%;
        padding-left: 20px;
        min-height: 40px;
        float: right;
        align-items: center;
        // justify-content: left;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
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
          display: flex;
          min-height: 20px;
          text-align: left;
          justify-content: flex-start;
        }
      }
    }
    .middleArea {
      margin-top: 20px;
      .left {
        width: 40%;
        height: 100%;
        float: left;
        .nav {
          width: 100%;
          float: left;
          align-items: center;
          // justify-content: left;
          display: flex;
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
        color: #05c65d;
        cursor: pointer;
      }
    }
    .listArea {
      width: 90%;
      float: left;
      margin-left: 5%;
      height: 100px;
      border: 1px solid #848484;
      .left {
        width: 40%;
        height: 100%;
        float: left;
        .nav {
          width: 100%;
          height: 40px;
          float: left;
          align-items: center;
          // justify-content: left;
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
            height: 20%;
            width: 100%;
            align-items: left;
          }
          .valueArea {
            float: left;
            margin-left: 20px;
            height: 80%;
            width: 100%;
            .title {
              float: left;
              height: 50px;
            }
            .Area {
              width: 100%;
              height: 20px;
              float: left;
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
