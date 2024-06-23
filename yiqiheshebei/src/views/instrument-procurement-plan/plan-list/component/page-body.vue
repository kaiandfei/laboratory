<template>
  <div class="list-body">
    <ul>
      <li v-for="(item, index) in tableData" :key="index">
        <div v-if="item.selfbuilt === 1" class="state-title user-plan">
          {{ '自建计划' }}
        </div>
        <div v-if="item.selfbuilt === 2" :class="[item.isOpen !== 1 ? 'over-bg' : 'open-bg']" class="state-title">
          {{ item.isOpen === 1 ? '开放中' : item.isOpen === 2 ? '未开放' : item.isOpen === 3 ? '已结束' : '' }}
        </div>
        <div class="fl">
          <div :class="[item.isOpen !== 1 ? 'over-border' : 'open-border']" class="li-top">
            <p>{{ item.title }}</p>
            <p v-show="item.start_open_time" :title="item.start_open_time + '~' + item.end_open_time">
              {{ '开放时间:' + item.start_open_time + '~' + item.end_open_time }}
            </p>
            <p v-show="item.selfbuilt === 2">{{ '金额:' + item.total_prices }}</p>
            <div>
              <span class="operable" @click="getDetail(item)">查看详情</span>
              <span
                :class="{ operable: item.isOpen === 1 && [1, 4].includes(item.subject_audit) }"
                @click="report(item)"
              >
                上报
              </span>
              <span :class="{ operable: item.subject_audit === 2 }" @click="revoke(item)">撤回</span>
              <!-- :class="{
                  operable: item.selfbuilt === 1 && [1].includes(item.subject_audit) && item.isOpen !== 1
                  ********  && item.subject_audit === 3 && item.school_audit === 3
                }" -->

              <span v-if="item.subject_audit === 3 && item.school_audit === 3" class="operable" @click="getCheck(item)">
                {{ item.all_check === 1 ? '验收' : '验收详情' }}
              </span>
              <span v-else>验收</span>

              <span v-if="!item.check_time" title="请先验收">入库</span>
              <span v-else class="operable" @click="getWarehouse(item)">入库</span>
              <span
                v-if="item.selfbuilt === 1 && [1].includes(item.subject_audit)"
                class="operable"
                @click="deleteItem(item)"
              >
                删除
              </span>
              <span v-else>删除</span>
            </div>
          </div>
          <div class="li-bottom">
            <self-step :props-item="item"></self-step>

            <!-- <div class="step-one">
            <div :class="{ 'green-font': item.audit !== 1 }">
              <div class="img-div" :class="[item.audit === 1 ? 'white-bg' : 'right-bg']">
                {{ item.audit === 1 ? '1' : '' }}
              </div>
              {{ item.audit === 1 ? '未上报' : '已上报' }}
            </div>
            <div>
              {{ item.audit === 1 ? '' : '(上报时间:' + (item.submit_time || '') + ')' }}
            </div>
          </div>
          <div class="img-box">
            <img v-show="item.audit === 1" src="@/assets/images/common/arrow-gray.png" alt="" />
            <img v-show="item.audit !== 1" src="@/assets/images/common/arrow-green.png" alt="" />
          </div>
          <div class="step-one">
            <div :class="{ 'green-font': [2, 3].includes(item.audit), 'red-font': item.audit === 4 }">
              <div
                class="img-div"
                :class="[
                  item.audit === 1
                    ? 'white-bg'
                    : item.audit === 2
                    ? 'green-bg'
                    : item.audit === 3
                    ? 'right-bg'
                    : 'red-bg'
                ]"
              >
                {{ [1, 2].includes(item.audit) ? '2' : '' }}
                <svg
                  v-show="item.audit === 4"
                  class="icon"
                  width="18"
                  height="18"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  data-v-365b8594=""
                >
                  <path
                    fill="currentColor"
                    d="M764.288 214.592L512 466.88 259.712 214.592a31.936 31.936 0 00-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1045.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0045.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 10-45.12-45.184z"
                  ></path>
                </svg>
              </div>
              {{
                item.audit === 2 ? '审核中' : item.audit === 3 ? '审核通过' : item.audit === 4 ? '审核不通过' : '未审核'
              }}
            </div>
            <div>
              {{ [1, 2].includes(item.audit) ? '' : '(审核时间:' + (item.audit_time || '') + ')' }}
            </div>
          </div>
          <div class="img-box">
            <img v-show="[1, 2, 4].includes(item.audit)" src="@/assets/images/common/arrow-gray.png" alt="" />
            <img v-show="item.audit === 3" src="@/assets/images/common/arrow-green.png" alt="" />
          </div>
          <div class="step-one">
            <div :class="{ 'green-font': item.audit === 3 }">
              <div
                class="img-div"
                :class="[[1, 2, 4].includes(item.audit) ? 'white-bg' : item.audit === 3 ? 'green-bg' : 'right-bg']"
              >
                {{ [1, 2, 3, 4].includes(item.audit) ? '3' : '' }}
              </div>
              验收入库
            </div>
          </div> -->
          </div>
        </div>
      </li>
    </ul>
    <el-dialog custom-class="pb-report-dialog" v-model="reportShow" title="采购清单上报" width="30%">
      <p>{{ reportObj.title }}</p>
      <p>备注:</p>
      <el-input v-model="reportObj.submit_desc" :rows="5" type="textarea" placeholder="请输入备注" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="back()">取消</el-button>
          <el-button type="primary" @click="submitForm()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, defineExpose } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { planList, planListAppear, delPlanList } from '@service/instrument-procurement-plan/plan-list'
import { ListItem } from '@service/instrument-procurement-plan/plan-list/types'
import SelfStep from './self-step.vue'

const emit = defineEmits(['getDetail', 'getCheck', 'getWarehouse'])
const props = defineProps({
  filterData: {
    type: Object as () => { title: string; audit: number | string },
    required: true
  }
})
let { filterData } = toRefs(props)

const dataMap = reactive({
  tableData: Array<ListItem>(),
  reportShow: false,
  reportObj: {
    title: '',
    submit_desc: '',
    id: 0
  }
})

const { tableData, reportShow, reportObj } = toRefs(dataMap)

// // 0未上报 1已上报
// const computedActive = computed(() => {
//   return (item: any) => {
//     let status: number = item.subject_audit < 3 ? item.subject_audit - 1 : 1
//     if ((item.subject_audit === 3 || item.subject_audit === 4) && item.school_audit === 1) {
//       status = 2
//     } else if (item.subject_audit === 3 && item.school_audit === 2) {
//       status = 3
//     } else if (item.subject_audit === 3 && (item.school_audit === 3 || item.school_audit === 4)) {
//       status = 4
//     }
//     if (item.subject_audit === 3 && item.school_audit === 3 && item.isPut === 0) {
//       status = 5
//     }
//     return status
//   }
// })

const getData = (data: { title: string; audit: number | string }) => {
  planList({
    title: data.title,
    audit: data.audit
  }).then((res) => {
    tableData.value = res.data
  })
}
getData(filterData.value)
defineExpose({ getData })

const getDetail = (item: ListItem) => {
  emit('getDetail', item)
}

const getCheck = (item: ListItem) => {
  emit('getCheck', item)
}

const getWarehouse = (item: ListItem) => {
  emit('getWarehouse', item)
}

const report = (item: ListItem) => {
  if (item.isOpen === 1 && [1, 4].includes(item.subject_audit)) {
    reportShow.value = true
    reportObj.value.id = item.id
    reportObj.value.title = item.title
    reportObj.value.submit_desc = item.submit_desc
  }
}

const revoke = (item: ListItem) => {
  if (item.subject_audit === 2) {
    planListAppear({
      id: item.id,
      audit: 1
    }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: '撤回成功'
        })
        getData(filterData.value)
      }
    })
  }
}

const back = () => {
  reportShow.value = false
}
const submitForm = () => {
  planListAppear({
    id: reportObj.value.id,
    submit_desc: reportObj.value.submit_desc,
    audit: 2
  }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '上报成功'
      })
      reportShow.value = false
      getData(filterData.value)
    }
  })
}

const deleteItem = (item: ListItem) => {
  // if (item.selfbuilt === 1 && [1].includes(item.subject_audit) && item.isOpen !== 1) {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delPlanList({ id: item.id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getData(filterData.value)
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
  // }
}
</script>

<style scoped lang="scss">
.list-body {
  margin-top: 10px;
  // height: calc(100% - 210px);
  width: 100%;
  // overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0px;
  }
  // &::-webkit-scrollbar-track {
  //   border-radius: 0;
  //   background-color: rgb(255, 255, 255);
  // }
  // &::-webkit-scrollbar-thumb {
  //   width: 0;
  //   border-radius: 10px;
  //   background-color: rgba(0, 0, 0, 0.1);
  // }
  li {
    margin-bottom: 20px;
    width: 100%;
    // height: 130px;
    overflow: hidden;
    background-color: #fff;
    .state-title {
      float: left;
      width: 100px;
      min-height: 180px;
      font-size: 20px;
      letter-spacing: 6px;
      display: flex;
      writing-mode: vertical-lr;
      text-align: center;
      justify-content: center;
      flex-direction: column;
    }
    .over-bg {
      background-color: #fcd3b3;
      color: #c76300;
    }
    .user-plan {
      background-color: #05c65d;
    }
    .open-bg {
      background-color: #d8ffd8;
      color: #05c65d;
    }
    .fl {
      width: calc(100% - 100px);
      .li-top {
        height: 60px;
        box-sizing: border-box;
        border-bottom: 1px solid #05c65d;
        & > p {
          float: left;
          margin-left: 2%;
          width: 18%;
          height: 60px;
          line-height: 60px;
          text-align: left;
          font-size: 18px;
          font-weight: bold;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        // & > :nth-child(3) {
        //   color: #666;
        // }
        & > :nth-child(4) {
          float: right;
          // display: flex;
          // justify-content: space-between;
          margin-right: 10px;
          // width: 280px;
          height: 60px;
          line-height: 60px;
          color: #999;
          text-align: left;
          cursor: default;
          & > span {
            margin: 0 16px;
          }
          .operable {
            color: #333;
            cursor: pointer;
            &:hover {
              color: #05c65d;
            }
          }
        }
      }
      .over-border {
        border-color: #fcd3b3;
      }
      .open-border {
        border-color: #05c65d;
      }
      .li-bottom {
        // display: flex;
        // justify-content: space-around;
        padding: 30px 0 0 0;
        width: 100%;
        height: 100px;
        box-sizing: border-box;
        :deep(.el-steps) {
          .el-step__line {
            height: 0px;
            border-top: 2px dotted #848484;
            background: none;
            // background: #05c65d;
          }
          .is-success {
            .el-step__line {
              height: 0px;
              border-top: 2px solid #05c65d;
              // background: #05c65d;
            }
          }
        }

        // color: #b5b5b5;
        // & > div {
        //   width: 18%;
        // }
        // .step-one {
        //   & > :nth-child(1) {
        //     margin-top: 20px;
        //     height: 18px;
        //     line-height: 18px;
        //     text-align: left;
        //     cursor: default;
        //     .img-div {
        //       float: left;
        //       margin: 0 8% 0 8%;
        //       width: 18px;
        //       height: 18px;
        //       line-height: 18px;
        //       text-align: center;
        //     }
        //   }
        //   & > :nth-child(2) {
        //     margin-top: 8px;
        //     padding-left: 20%;
        //     height: 18px;
        //     line-height: 18px;
        //     text-align: left;
        //   }
        // }
        // .img-box {
        //   position: relative;
        //   img {
        //     position: absolute;
        //     top: 40%;
        //     left: 18%;
        //     width: 64%;
        //     height: 20%;
        //   }
        // }
      }
    }
  }
  ul > :nth-last-child(1) {
    margin-bottom: 0;
  }
  :deep(.pb-report-dialog) {
    // margin-top: 50px;
    .el-dialog__body {
      text-align: left;
      padding: 20px 10%;
      border-top: #05c65d 1px solid;
      box-sizing: border-box;
      & > p {
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        color: #333333;
      }
    }
  }
}
.white-bg {
  background-image: url('../../../../assets/images/common/circular-white.png');
  background-size: 100% 100%;
}
.right-bg {
  background-image: url('../../../../assets/images/common/right.png');
  background-size: 100% 100%;
}
.red-bg {
  background-image: url('../../../../assets/images/common/circular-red.png');
  background-size: 100% 100%;
  color: #fff;
}
.green-bg {
  background-image: url('../../../../assets/images/common/circular-green.png');
  background-size: 100% 100%;
  color: #fff;
}
.green-font {
  color: #05c65d;
}
.red-font {
  color: #de4747;
}
</style>
