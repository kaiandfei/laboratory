<template>
  <div>
    <el-dialog
      custom-class="examine-dialog"
      v-model="examineState"
      width="50%"
      title="审核通过 OR 不通过"
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
                <div>
                  <el-select v-model="examineInfo.process_mode">
                    <el-option
                      v-for="item in optionSolution"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="line">
                <div class="name">备注：</div>
                <div>{{ scrapRegistrationList.desc }}</div>
              </div>
              <div class="line">
                <div class="name">总价值</div>
                <div>{{ scrapRegistrationList.cost }}</div>
              </div>
              <div class="line">
                <div class="name">照片说明</div>
                <div v-for="item in scrapRegistrationList.pic" :key="item.id">
                  <img :src="item.url_path" class="img-size" />
                </div>
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
                <div class="name">审核备注</div>
                <div>
                  <el-input type="textarea" :row="4" v-model="examineInfo.audit_desc"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonArea">
        <el-button type="primary" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { postInstrumentExamineInfo, getScrapDetailInfo } from '@/service/equ-manage/scrapRegistration/index'
import { scrapDetailData, instrumentExamineData } from '@/service/equ-manage/scrapRegistration/types'

let props = defineProps({
  examineShow: Boolean,
  selectID: { type: Number, required: true },
  status: { type: Number, required: true }
})
let { examineShow, selectID, status } = toRefs(props)
let emit = defineEmits(['back'])
let examineState = ref(false)

examineState.value = examineShow.value
const dataMap = reactive({
  // scrapRegistrationList: {
  //   scrap_status: '已通过',
  //   type: '损耗',
  //   scrapNumber: '202121212',
  //   reason: '',
  //   submit_time: '2021.0.20',
  //   deal_type: '实验室留用',
  //   submit_user: '张管理员',
  //   detail: '仪器超过使用年限、性能已不能达到实验需要的最低要求，且无法修复',
  //   value: 10000,
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
  //   audit_user: '张校长',
  //   audit_time: '2021.10.21',
  //   audit_detail: '',
  //   scrap_instrument_info: [
  //     {
  //       scrap_instrument_name: '烧杯',
  //       scrap_school_id: '60001',
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
  // },
  scrapRegistrationList: scrapDetailData,
  examineInfo: instrumentExamineData,
  optionSolution: [
    {
      label: '实验室留用',
      value: 1
    },
    {
      label: '建立废旧仪器实验室',
      value: 2
    }
  ]
})

let { scrapRegistrationList, optionSolution, examineInfo } = toRefs(dataMap)

const initData = () => {
  getScrapDetailInfo({ id: selectID.value }).then((res) => {
    scrapRegistrationList.value = res.data
  })
}

initData()

const cancel = () => {
  emit('back')
}

const confirm = () => {
  examineInfo.value.id = selectID.value
  examineInfo.value.status = status.value
  examineInfo.value.list = []
  scrapRegistrationList.value.list.forEach((item) => {
    examineInfo.value.list.push({
      name: item.name,
      store_id: item.store_id,
      id: item.id,
      instrument_id: item.instrument_id,
      laboratory_id: item.laboratory_id,
      number_plies: item.number_plies,
      asset_number: item.asset_number,
      laboratory_name: item.laboratory_name,
      specification: item.specification,
      total: 1
    })
  })
  postInstrumentExamineInfo(examineInfo.value).then((res) => {
    if (res.code === 10) {
      emit('back')
    }
  })
}
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
  width: 200px;
}
:deep(.el-textarea) {
  width: 250px;
}
:deep(.examine-dialog) {
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
      margin-left: 7%;
      justify-content: left;
      display: flex;
    }
    .detailArea {
      width: 90%;
      height: 450px;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #848484;
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
          height: 80%;
          width: 80%;
        }
        .imgArea {
          margin-top: 20px;
          width: 30%;
          height: 80px;
          float: left;
          border: 1px solid #05c65d;
          margin-left: 3%;
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
