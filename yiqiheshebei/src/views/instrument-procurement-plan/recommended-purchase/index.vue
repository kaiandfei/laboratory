<template>
  <div>
    <header>
      <div class="fl">
        仪器设备采购计划
        <el-icon><arrow-right /></el-icon>
        推荐采购清单
        <el-icon v-if="addShow"><arrow-right /></el-icon>
        <span v-if="addShow">新建计划</span>
      </div>
      <div v-show="addShow" class="fr cancel-box" @click="addShow = false">
        <img class="cancel" src="@assets/images/laboratory-standard/cancel.png" alt="返回" />
        返回
      </div>
      <!-- <div class="fr search-box">
      <el-input v-model="inputValue" placeholder="搜索" />
      <img src="@assets/images/common/search.png" alt="搜索" />
    </div> -->
    </header>
    <div v-show="!addShow">
      <PageHeader :time-obj="timeObj" @getNewRecommend="getNewRecommend" @exportExcel="exportExcel" />
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        max-height="560"
        stripe
        row-key="id"
        :header-cell-style="{ background: '#C2E3D1' }"
        :cell-style="{}"
      >
        <el-table-column type="selection" width="45" :selectable="checkSelectable" />
        <el-table-column type="" width="55" label="序号" prop="index" />
        <el-table-column type="" label="编号" prop="number" sortable />
        <el-table-column type="" label="名称" prop="name" show-overflow-tooltip />
        <el-table-column type="" label="规格" prop="specification" show-overflow-tooltip />
        <el-table-column type="" label="单位" prop="unit" />
        <el-table-column
          type=""
          label="推荐采购数量"
          prop="recommend_total"
          sortable
          :sort-method="
            (a, b) => {
              return a.recommend_total - b.recommend_total
            }
          "
        />
        <el-table-column type="" label="调整数量" prop="adjustCount">
          <template #default="scope">
            <div class="input-box">
              <input
                v-if="'children' in scope.row"
                v-model.lazy="scope.row.adjustCount"
                @input="inputAdjust"
                @change="inputChange(scope.row)"
              />
              <span v-if="!('children' in scope.row)">{{ scope.row.adjustCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="" label="价格参考" prop="priceReference">
          <template #default="scope">
            <div class="input-box">
              <input
                v-if="'children' in scope.row"
                v-model.lazy="scope.row.priceReference"
                @input="inputAdjust"
                @change="inputChange(scope.row)"
              />
              <span v-if="!('children' in scope.row)">{{ scope.row.priceReference }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="searchForm.level === 1"
          type=""
          label="小学标准配备"
          prop="learning_periodx"
          sortable
          :sort-method="
            (a, b) => {
              return a.learning_periodx - b.learning_periodx
            }
          "
        />
        <el-table-column
          v-if="searchForm.level === 2"
          type=""
          label="初中标准配备"
          prop="learning_periodc"
          sortable
          :sort-method="
            (a, b) => {
              return a.learning_periodc - b.learning_periodc
            }
          "
        />
        <el-table-column
          v-if="searchForm.level === 3"
          type=""
          label="高中标准配备"
          prop="learning_periodg"
          sortable
          :sort-method="
            (a, b) => {
              return a.learning_periodg - b.learning_periodg
            }
          "
        />
        <el-table-column
          type=""
          label="总库存"
          prop="allstock"
          sortable
          :sort-method="
            (a, b) => {
              return a.allstock - b.allstock
            }
          "
        />
        <!-- <el-table-column type="" label="入库批次" prop="stockBatchCount" sortable /> -->
        <!-- <el-table-column type="" label="到期时间" prop="becomeTime" /> -->
        <el-table-column type="" label="类型" prop="type">
          <template #default="scope">
            <div>
              <span>{{ scope.row.type === 1 ? '仪器' : '设备' }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column type="" label="配备类型" prop="is_must">
          <template #default="scope">
            <div>
              <span>{{ scope.row.is_must === 1 ? '必配' : '选配' }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column type="" label="仪器库" prop="subject_id">
          <template #default="scope">
            <div>
              <span>{{ showSubjectNameById(scope.row.subject_id) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="" label="低值易耗" prop="cost_type.content" width="100"></el-table-column>
        <!-- <el-table-column label="" prop="" width="45" /> -->
      </el-table>
      <footer>
        <p>
          选中价值合计:
          <span>{{ computedCheck(checkList) }}</span>
        </p>
        <div class="btn" @click="clickAddReport()">将选中项加入采购申请计划</div>
      </footer>
    </div>
    <AddPlan v-if="addShow" :schoolbuyplandetail="checkList" />
    <el-dialog custom-class="open-plan-dialog" v-model="addReport" title="选择计划" width="50%">
      <div
        v-if="
          clickID !== -1 &&
          buyTableList.find((e) => e.id === clickID).selfbuilt === 2 &&
          computedCheck(checkList) >
            Number(
              buyTableList.find((e) => e.id === clickID) ? buyTableList.find((e) => e.id === clickID).total_prices : 0
            )
        "
        class="tips"
      >
        *提示：加入金额超出计划范围
      </div>
      <div v-for="(item, index) in buyTableList.filter((e) => e.selfbuilt === 2)" :key="index">
        <div v-if="index === 0">区域计划</div>
        <div class="plan-item" :class="{ 'active-item': item.id === clickID }" @click="clickID = item.id">
          <span>{{ item.title }}</span>
          <span v-if="item.start_open_time">开放时间：{{ item.start_open_time }}~{{ item.end_open_time }}</span>
          <span v-if="item.total_prices - 0 !== 0">{{ '金额：' + item.total_prices }}</span>
        </div>
      </div>
      <div v-for="(item, index) in buyTableList.filter((e) => e.selfbuilt === 1)" :key="index">
        <div v-if="index === 0">自建计划</div>
        <div class="plan-item" :class="{ 'active-item': item.id === clickID }" @click="clickID = item.id">
          <span>{{ item.title }}</span>
          <span v-if="item.start_open_time">开放时间：{{ item.start_open_time }}~{{ item.end_open_time }}</span>
          <span v-if="item.total_prices - 0 !== 0">{{ '金额：' + item.total_prices }}</span>
        </div>
      </div>

      <p class="message">
        *若无可选择的计划，可以
        <span @click="newPlan">&nbsp;点击此处&nbsp;</span>
        新建计划
      </p>
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
import { reactive, ref, toRefs, computed } from 'vue'
import PageHeader from './header/PageHeader.vue'
import AddPlan from './component/add-plan.vue'
import { inputAdjust } from '@/utils/common'

import { getBuyPlan, savePlan, cacheUpdate } from '@service/instrument-procurement-plan/recommended-purchase'
import { BaseListType } from '@service/instrument-procurement-plan/recommended-purchase/types'
import { planListAddReport } from '@service/instrument-procurement-plan/plan-list'
import { ListItem } from '@service/instrument-procurement-plan/plan-list/types'

import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

import { useStore } from '@/store'
import localCache from '@/utils/localCache'
import axios from 'axios'

let store = useStore()

let options = [...store.state.common.subjectArr]

let dataMap = reactive({
  tableData: Array<BaseListType>(),
  checkList: Array<BaseListType>(),
  addShow: false,
  addReport: false,
  clickID: -1,
  searchForm: {
    subject_id: store.state.login.userInfo.subject_id || '',
    school_id: store.state.login.userInfo.school.id || '',
    level: '',
    type: ''
  },
  timeObj: {
    create_time: '',
    update_time: ''
  },
  buyTableList: Array<ListItem>(),
  loading: false
})

let { tableData, checkList, addShow, addReport, clickID, searchForm, timeObj, buyTableList, loading } = toRefs(dataMap)

const getNewRecommend = (val: { type: number; subject_id: number }) => {
  searchForm.value = val
  getData(val)
}

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolBuyPlanDetail/schoolBuyPlanDetailCreate',
      { token, ...searchForm.value, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '推荐采购清单.xlsx'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}

let multipleTable = ref<any>(null)
const getData = (val: { type: number; subject_id: any }) => {
  tableData.value = []
  loading.value = true
  getBuyPlan(val)
    .then((res) => {
      if (res.code === 10) {
        // let res10 = (arr: any[]) => {
        //
        // }
        let arr = res.data.data

        if (arr.length <= 10) {
          tableData.value = arr
        } else {
          tableData.value.push(...arr.splice(0, 10))
          setTimeout(() => {
            tableData.value.push(...arr)
          }, 100)
        }
        timeObj.value = res.data
        multipleTable.value.toggleAllSelection()
      }
    })
    .finally(() => {
      loading.value = false
    })
}

getData(searchForm.value)

const inputChange = (item: any) => {
  cacheUpdate({
    id: item.id,
    adjustCount: item.adjustCount,
    priceReference: item.priceReference,
    number: item.number
  })
  console.log('🚀 ~ file: index.vue ~ line 196 ~ inputChange ~ e', item)
}

let computedCheck = computed(() => {
  return (list: BaseListType[]) => {
    let sum = 0
    list.forEach((body) => {
      let price = body.adjustCount * body.priceReference
      sum += price
    })
    return sum
  }
})

let showSubjectNameById = computed(() => {
  return (id: number) => {
    let name = ''
    options.forEach((body) => {
      if (body.id === id) {
        name = body.name
      }
    })
    return name
  }
})

const handleSelectionChange = (val: BaseListType[]) => {
  checkList.value = val
}
const checkSelectable = (row: BaseListType) => {
  //通过id来禁止不能选择的项
  // return row.id !== 1
  //通过索引index来禁止不能选择的项
  if ('children' in row) {
    return true
  } else {
    return false
  }
}

const back = () => {
  addReport.value = false
}

const newPlan = () => {
  addReport.value = false
  addShow.value = true
}

const submitForm = () => {
  if (checkList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请勾选至少一个仪器设备'
    })
    return
  }
  if (clickID.value === -1) {
    ElMessage({
      type: 'warning',
      message: '请选择计划'
    })
    return
  }
  if (
    buyTableList.value.find((e) => e.id === clickID.value).selfbuilt === 2 &&
    computedCheck.value(checkList.value) > Number(buyTableList.value.find((e) => e.id === clickID.value).total_prices)
  ) {
    ElMessage({
      type: 'warning',
      message: '加入金额超出计划范围'
    })
    return
  }
  savePlan({
    id: clickID.value,
    submit_money: computedCheck.value(checkList.value),
    schoolbuyplandetail: checkList.value
  }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      getData(searchForm.value)
    }
  })
  addReport.value = false
}

const clickAddReport = () => {
  planListAddReport().then((res) => {
    buyTableList.value = res.data
    addReport.value = true
  })
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  .search-box {
    position: relative;
    :deep(.el-input) {
      position: absolute;
      right: 0;
      top: 0;
      width: 300px;
      line-height: 30px;
    }
    img {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      padding: 5px 10px;
      background: #05c65d;
      cursor: pointer;
    }
  }
  .cancel-box {
    padding-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .cancel {
      margin-right: 8px;
      width: 20px;
      height: 20px;
    }
  }
}

footer {
  margin: 16px;
  display: flex;
  justify-content: right;
  p {
    margin-right: 30px;
    height: 36px;
    line-height: 36px;
    span {
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: #05c65d;
      opacity: 1;
    }
  }
}
:deep(.open-plan-dialog) {
  .el-dialog__body {
    text-align: left;
    padding: 20px 8%;
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    font-size: 16px;
    .tips {
      color: #eea359;
    }
    .plan-item {
      margin: 12px 0;
      padding: 0 20px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      color: #333333;
      background: #f3f3f3;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      box-sizing: border-box;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
      span:nth-of-type(2) {
        flex: 2;
      }
      span:nth-of-type(3) {
        flex: 0.8;
      }
    }
    .active-item {
      color: #ffffff;
      background: #05c65d;
    }
    .message {
      height: 30px;
      line-height: 30px;
      color: #333333;
      span {
        color: #05c65d;
        cursor: pointer;
      }
    }
  }
}
.btn {
  width: 210px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
}
.el-table {
  margin-top: 10px;
  .input-box {
    & > input {
      width: 80%;
      height: 30px;
      background: rgba(255, 255, 255, 0.39);
      border: 1px solid #c9c7c7;
      text-align: center;
    }
  }
}
:deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
  display: none;
}
</style>
