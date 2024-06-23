<template>
  <div>
    <header>
      <div class="fl">
        仪器设备采购计划
        <el-icon><arrow-right /></el-icon>
        采购计划管理
        <el-icon v-show="status >= 1"><arrow-right /></el-icon>
        <span v-show="status >= 1">计划详情</span>
        <el-icon v-show="status === 2"><arrow-right /></el-icon>
        <span v-show="status === 2">仪器清单</span>
      </div>
      <div v-show="status > 0" class="fr cancel-box" @click="cancel">
        <img class="cancel" src="@assets/images/laboratory-standard/cancel.png" alt="返回" />
        返回
      </div>
    </header>
    <div v-if="status === 0">
      <!-- <div v-if="false" class="recommend">
        <p>仪器设备采购计划</p>
      </div> -->
      <div class="select-box">
        <div class="filter-box">
          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
      >
        <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
        <el-table-column prop="title" label="计划名称" :align="'left'"></el-table-column>
        <el-table-column prop="" label="开放时间" align="left">
          <template #default="scope">
            <span v-if="scope.row.start_open_time">
              {{ scope.row.start_open_time + '~' + scope.row.end_open_time }}
            </span>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="user_name" label="发布状态" align="left"></el-table-column> -->
        <el-table-column prop="" label="开放情况" align="left">
          <template #default="scope">
            <span v-if="!scope.row.start_open_time">/</span>
            <div v-else>
              <span v-show="scope.row.isOpen === 1" class="blue">已开放</span>
              <span v-show="scope.row.isOpen === 2" class="yellow">未开放</span>
              <span v-show="scope.row.isOpen === 3">已结束</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="上报情况" align="left">
          <template #default="scope">
            <span>{{ scope.row.audit === 1 ? '未上报' : '已上报' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="区域审核情况" align="left">
          <template #default="scope">
            <span>
              {{
                scope.row.audit === 2
                  ? '待审核'
                  : scope.row.audit === 3
                  ? '审核通过'
                  : scope.row.audit === 4
                  ? '审核不通过'
                  : '/'
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="" label="操作" align="center">
          <template #default="scope">
            <span class="click-text" @click="getDetail(scope.row.id)">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Detail v-if="status === 1" :item-id="detailItemId" @get-list="getInsList" />
    <InstrumentList v-if="status === 2" :item-id="listItemId" @back="cancel" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'

import { ArrowRight } from '@element-plus/icons-vue'

import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'
import { programList } from '@service/instrument-procurement-plan/program-manage'
import { BaseType } from '@service/instrument-procurement-plan/program-manage/types'

import Detail from './component/detail.vue'
import InstrumentList from './component/instrument-list.vue'

const dataMap = reactive({
  filterData: Array<ConfigDataType>(),
  tableData: Array<BaseType>(),
  status: 0, // 0首页 1详情
  detailItemId: 0,
  listItemId: 0
})
let { filterData, tableData, status, detailItemId, listItemId } = toRefs(dataMap)

filterData.value = [
  {
    name: '筛选',
    list: [
      {
        id: 0,
        name: '全部'
      },
      {
        id: 2,
        name: '区域计划'
      },
      {
        id: 1,
        name: '非区域计划'
      }
    ],
    keyName: 'selfbuilt'
  }
]

const getData = (data: any) => {
  programList({
    ...data,
    is_open: 1
  }).then((res) => {
    tableData.value = res.data
    console.log('🚀 ~ file: index.vue ~ line 111 ~ programList ~ res', res)
  })
}
getData({ selfbuilt: 0 })

const changeFilter = (form: { selfbuilt: number }) => {
  console.log('🚀 ~ file: index.vue ~ line 109 ~ changeFilter ~ form', form)
  getData(form)
}

const cancel = () => {
  status.value = status.value - 1
  getData({ selfbuilt: 0 })
}

const getDetail = (id: number) => {
  status.value = 1
  detailItemId.value = id
  console.log('🚀 ~ file: index.vue ~ line 97 ~ getDetail ~ id', id)
}

const getInsList = (id: number) => {
  status.value = 2
  listItemId.value = id
  console.log('🚀 ~ file: index.vue ~ line 97 ~ getInsList ~ id', id)
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
  p {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #05c65d;
  }
}
.select-box {
  margin-top: 10px;
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

:deep(.el-table) {
  margin-top: 20px;
  .click-text {
    color: #05c65d;
    cursor: pointer;
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

.blue {
  color: #5fafe4;
}
.yellow {
  color: #ee9a59;
}
</style>
