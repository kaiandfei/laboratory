<template>
  <div>
    <header>
      <div class="fl">
        仪器设备采购计划
        <el-icon><arrow-right /></el-icon>
        计划列表
        <el-icon v-show="detailShow"><arrow-right /></el-icon>
        <span v-show="detailShow">详情</span>
        <!-- <el-icon v-show="status === 3"><arrow-right /></el-icon>
        <span v-show="status === 3">入库详情</span> -->
        <template v-if="addShow">
          <el-icon><arrow-right /></el-icon>
          <span>{{ addId === 0 ? '新建' : '编辑' }}采购计划</span>
        </template>

        <div v-show="checkShow">
          <el-icon><arrow-right /></el-icon>
          <span>验收</span>
        </div>
        <div v-show="warehouseShow">
          <el-icon><arrow-right /></el-icon>
          <span>入库</span>
        </div>
      </div>
      <div v-show="computedHome" class="fr search-box">
        <el-input v-model="searchObj.title" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="bodyRef.getData(searchObj)" />
      </div>
      <div v-show="!computedHome" class="fr cancel-box" @click="cancel">
        <img class="cancel" src="@assets/images/laboratory-standard/cancel.png" alt="返回" />
        返回
      </div>
    </header>
    <div v-show="computedHome">
      <div class="recommend">
        <p>仪器设备采购计划推荐列表</p>
        <div class="btn" @click="clickAddReport()">点击新建仪器采购计划</div>
      </div>
      <div v-if="false" class="select-box">
        <div class="filter-box">
          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
        </div>
      </div>
    </div>
    <AddPlan v-if="addShow" @back="cancel" :item-id="addId" />
    <PageBody
      ref="bodyRef"
      v-if="computedHome"
      @get-detail="getDetail"
      @get-check="getCheck"
      @get-warehouse="getWarehouse"
      :filter-data="searchObj"
    />
    <Detail v-if="detailShow && !addShow" @edit-item="editItem" :item-data="detailItem" />
    <CheckVue v-if="checkShow" :item-data="detailItem" @back="cancel" />
    <Warehouse v-if="warehouseShow" :item-data="detailItem"></Warehouse>

    <!-- <WarehouseDetail v-if="status === 3" :item-data="detailItem" /> -->
    <el-dialog custom-class="add-report-dialog" v-model="addReport" title="选择计划" width="50%">
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
        <span @click=";(addShow = true), (addReport = false)">&nbsp;点击此处&nbsp;</span>
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
import { ArrowRight } from '@element-plus/icons-vue'

import AddPlan from './component/add-plan.vue'
import PageBody from './component/page-body.vue'
import Detail from './component/detail.vue'
import CheckVue from './component/check.vue'
import Warehouse from './component/warehouse.vue'

// import InsWarehouse from './component/ins-warehouse.vue'
// import EquWarehouse from './component/equ-warehouse.vue'
// import WarehouseDetail from './component/warehouse-detail.vue'

import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'

import { planListAddReport } from '@service/instrument-procurement-plan/plan-list'
import { ListItem } from '@service/instrument-procurement-plan/plan-list/types'

import { reactive, toRefs, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const dataMap = reactive({
  filterData: Array<ConfigDataType>(),
  searchObj: {
    title: '',
    audit: ''
  },
  addShow: false,
  addId: 0,
  addReport: false,
  checkShow: false,
  warehouseShow: false,
  detailItem: Object(),
  buyTableList: Array<ListItem>(),
  clickID: -1,
  warehouseType: 1,
  detailShow: false
})
let {
  filterData,
  searchObj,
  addShow,
  addId,
  addReport,
  checkShow,
  warehouseShow,
  detailItem,
  buyTableList,
  clickID,
  warehouseType,
  detailShow
} = toRefs(dataMap)

filterData.value = [
  {
    name: '筛选',
    list: [
      {
        id: '',
        name: '全部'
      },
      {
        id: 2,
        name: '待审核'
      },
      {
        id: 3,
        name: '审核通过'
      }
    ],
    keyName: 'audit'
  }
]

let bodyRef: any = ref(null)
const changeFilter = (form: { audit: any }) => {
  searchObj.value.audit = form.audit
  bodyRef.value.getData(searchObj.value)
}

const cancel = () => {
  checkShow.value = false
  warehouseShow.value = false
  if (addShow.value) {
    addShow.value = false
    addId.value = 0
    return
  }
  detailShow.value = false
}

const back = () => {
  addReport.value = false
}

const submitForm = () => {
  if (clickID.value === -1) {
    ElMessage({
      type: 'warning',
      message: '请选择计划'
    })
    return
  }
  addReport.value = false
  addId.value = clickID.value
  addShow.value = true
  clickID.value = -1
}

const editItem = (id: number) => {
  addId.value = id
  // status.value = 0
  addShow.value = true
}

const clickAddReport = () => {
  planListAddReport().then((res) => {
    buyTableList.value = res.data
    addReport.value = true
  })
}

const getDetail = (item: ListItem) => {
  detailItem.value = item
  detailShow.value = true
}

const getCheck = (item: ListItem) => {
  detailItem.value = item
  checkShow.value = true
}

// const setWarehouse = (type: number) => {
//   status.value = 2
//   warehouseType.value = type
// }

const getWarehouse = (item: ListItem) => {
  detailItem.value = item
  warehouseShow.value = true
}

let computedHome = computed(() => {
  return !detailShow.value && !addShow.value && !checkShow.value && !warehouseShow.value
})
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
  .fl {
    display: flex;
    align-items: center;
  }
  .search-box {
    position: relative;
    :deep(.el-input) {
      position: absolute;
      right: 0;
      top: 0;
      width: 300px;
      line-height: 30px;
    }
    .search {
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
.recommend {
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  background: #dcece3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  p {
    font-size: 16px;
    span:nth-of-type(1) {
      margin-right: 30px;
      color: #848484;
    }
  }
  p:nth-of-type(1) {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #05c65d;
  }
}
.select-box {
  padding: 0 30px;
  width: 100%;
  height: 73px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .filter-box {
    padding: 15px 0;
    width: 90%;
  }
}
:deep(.add-report-dialog) {
  // margin-top: 50px;
  .el-dialog__body {
    text-align: left;
    padding: 20px 8%;
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    font-size: 16px;
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
  padding: 0 30px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
}
</style>
