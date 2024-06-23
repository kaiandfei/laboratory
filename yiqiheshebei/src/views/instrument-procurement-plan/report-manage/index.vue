<template>
  <div>
    <header>
      <div class="fl">
        仪器设备采购计划
        <el-icon><arrow-right /></el-icon>
        采购计划发布管理
        <el-icon v-show="status === 1"><arrow-right /></el-icon>
        <span v-show="status === 1">{{ detailItemId === 0 ? '新建计划' : '编辑计划' }}</span>
        <el-icon v-show="status >= 2"><arrow-right /></el-icon>
        <span v-show="status >= 2">计划详情</span>
        <el-icon v-show="status === 3"><arrow-right /></el-icon>
        <span v-show="status === 3">采购清单</span>
      </div>
      <div v-show="status > 0" class="fr cancel-box" @click="cancel">
        <img class="cancel" src="@assets/images/laboratory-standard/cancel.png" alt="返回" />
        返回
      </div>
    </header>
    <div class="home-page" v-if="status === 0">
      <!-- <div v-if="false" class="recommend">
        <p>仪器设备采购计划管理</p>
        <div class="btn" :class="{ 'gray-bg': false }" @click="edit(0)">发布新计划</div>
      </div> -->
      <div class="select-box">
        <div class="filter-box">
          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
        </div>
        <div class="btn" :class="{ 'gray-bg': false }" @click="edit(0)">发布新计划</div>
      </div>
      <el-table
        v-if="filterId === 1"
        :data="requestData"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
      >
        <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
        <el-table-column prop="title" label="计划名称" :align="'left'"></el-table-column>
        <el-table-column prop="" label="开放时间" align="left">
          <template #default="scope">
            <span>{{ scope.row.start_open_time }}至{{ scope.row.end_open_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publish_time" label="发布时间" align="left"></el-table-column>
        <el-table-column prop="" label="发布情况" align="left">
          <template #default="scope">
            <span v-show="scope.row.is_push === 1">未发布</span>
            <span v-show="scope.row.is_push === 2" class="blue">发布成功</span>
            <span v-show="scope.row.is_push === 3" class="yellow">已撤回</span>
          </template>
        </el-table-column>
        <el-table-column prop="appearSchool" label="上报学校(所)" align="left"></el-table-column>

        <el-table-column prop="" label="操作" align="center">
          <template #default="scope">
            <div class="click-box">
              <div class="click-text" @click="getDetail(scope.row.id)">详情</div>
              <div v-if="scope.row.is_push === 1" class="click-text" @click="edit(scope.row.id)">编辑</div>
              <div
                v-if="scope.row.is_push === 1 || scope.row.is_push === 3"
                class="click-text"
                :class="{ yellow: scope.row.is_push === 2 }"
                @click="program(scope.row)"
              >
                发布
              </div>
              <div
                v-if="scope.row.is_push === 2 && scope.row.appearSchool === 0"
                class="click-text yellow"
                @click="program(scope.row)"
              >
                撤回
              </div>
              <div
                v-if="
                  scope.row.is_push === 1 ||
                  scope.row.is_push === 3 ||
                  (scope.row.is_push === 2 && scope.row.isOpen === 3)
                "
                class="click-text red"
                @click="delItem(scope.row.id)"
              >
                删除
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="filterId === 2"
        :data="requestDataRight"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
      >
        <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
        <el-table-column prop="school_name" label="学校名称" align="left"></el-table-column>
        <el-table-column prop="area" label="区域" align="left"></el-table-column>
        <el-table-column prop="total_prices" label="参考金额" align="left" sortable>
          <template #default="scope">
            <div>
              {{ scope.row.total_prices - 0 === 0 ? '/' : scope.row.total_prices }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="学科" align="left">
          <template #default="scope">
            <div>
              <span v-for="(item, index) in scope.row.allsubject" :key="index">{{ item.subject_name }}&nbsp;</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="提交情况" align="left">
          <template #default="scope">
            <span>{{ scope.row.audit !== 1 ? '已提交' : '未提交' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="submit_money" label="提交金额" align="left" sortable></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" align="left" sortable></el-table-column>
        <el-table-column prop="" label="审核状态" align="left">
          <template #default="scope">
            <span>
              {{ ['', '待上报', '待审核', '审核通过', '审核不通过'][scope.row.audit] || '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="audit_time" label="审核时间" align="left"></el-table-column>

        <el-table-column prop="" label="操作" width="400" align="center">
          <template #default="scope">
            <div>
              <span class="btn-text" :class="{ 'gray-bg': scope.row.audit !== 2 }" @click="pass(scope.row, 3)">
                审核通过
              </span>
              <span
                class="btn-text yellow-bg"
                :class="{ 'gray-bg': scope.row.audit !== 2 }"
                @click="pass(scope.row, 4)"
              >
                审核不通过
              </span>
              <span class="click-text" @click="getList(scope.row.id)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Edit v-if="status === 1" :item-id="detailItemId" @back="cancel" />
    <Detail v-if="status === 2" :item-id="detailItemId" @show-list="getList" />
    <PurchaseList v-if="status === 3" :item-id="listItemId" />
    <el-dialog custom-class="program-dialog" :model-value="pragramShow" title="提示" width="30%">
      <p>
        <span>确认发布：</span>
        <span>{{ clickItem.title }}</span>
      </p>
      <p>
        <span>开放时间：</span>
        <span>{{ clickItem.start_open_time }}至{{ clickItem.end_open_time }}</span>
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="pragramShow = false">取消</el-button>
          <el-button type="primary" @click="sureClick()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'

import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'
import Detail from './component/detail.vue'
import Edit from './component/edit.vue'
import PurchaseList from './component/purchase-list.vue'

import {
  reportList,
  updateStatus,
  deleteItem,
  findBuyPlanwithSchool,
  planListAppear
} from '@service/instrument-procurement-plan/report-manage'
import { ListItem } from '@service/instrument-procurement-plan/report-manage/types'

const dataMap = reactive({
  filterData: Array<ConfigDataType>(),
  filterId: 1,
  requestData: [
    {
      id: 0,
      title: '',
      start_open_time: '',
      end_open_time: '',
      is_push: 0,
      area_code: '',
      area_level: 0,
      publish_time: '',
      isOpen: 1
    }
  ],
  clickItem: { end_open_time: '', id: 0, is_push: 0, start_open_time: '', title: '' },
  status: 0, // 0首页 1编辑 2详情 3采购清单
  detailItemId: 0,
  listItemId: 0,
  pragramShow: false,
  requestDataRight: [
    {
      id: 0,
      title: '',
      start_open_time: '',
      end_open_time: '',
      is_push: 0,
      area_code: '',
      area_level: 0,
      publish_time: '',
      isOpen: 1
    }
  ]
})
let { filterData, filterId, requestData, clickItem, status, detailItemId, listItemId, pragramShow, requestDataRight } =
  toRefs(dataMap)

filterData.value = [
  {
    name: '筛选',
    list: [
      {
        id: 1,
        name: '区域计划'
      },
      {
        id: 2,
        name: '非区域计划'
      }
    ],
    keyName: 'status_id'
  }
]

const getData = () => {
  reportList().then((res) => {
    requestData.value = res.data
  })
  findBuyPlanwithSchool().then((res) => {
    requestDataRight.value = res.data
  })
}

getData()

const changeFilter = (form: { status_id: number }) => {
  filterId.value = form.status_id
}

const cancel = () => {
  if (status.value === 3 && filterId.value === 1) {
    status.value = 2
  } else {
    status.value = 0
  }
  filterId.value = 1
  getData()
}

const edit = (id: number) => {
  status.value = 1
  detailItemId.value = id
}

const getDetail = (id: number) => {
  status.value = 2
  detailItemId.value = id
}

const pass = (item: { id: number; audit: number }, status: number) => {
  if (item.audit === 2) {
    planListAppear({ id: item.id, audit: status }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        })
        getData()
      }
    })
  }
}

const getList = (id: number) => {
  status.value = 3
  listItemId.value = id
}

const program = (item: ListItem) => {
  if (item.is_push !== 2) {
    // 未发布
    pragramShow.value = true
    clickItem.value = item
  } else {
    ElMessageBox.confirm('是否确认撤回', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        updateStatus({ id: item.id, is_push: 3 }).then((res) => {
          if (res.code === 10) {
            ElMessage({
              type: 'success',
              message: '撤回成功'
            })
            getData()
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消撤回'
        })
      })
  }
}
const sureClick = () => {
  updateStatus({ id: clickItem.value.id, is_push: 2 }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '发布成功'
      })
      pragramShow.value = false
      getData()
    }
  })
}

const delItem = (id: number) => {
  ElMessageBox.confirm('请问您是否需要删除此计划?删除后无法恢复!', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteItem({ id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getData()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
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
.home-page {
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
      width: 80%;
    }
  }

  :deep(.el-table) {
    margin-top: 20px;
    .click-box {
      display: flex;
      text-align: left;
      .click-text {
        margin: 0 10px;
        color: #05c65d;
        cursor: pointer;
      }
    }

    .btn-text {
      display: inline-block;
      margin: 0 10px;
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      background: #05c65d;
      color: #fff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 10px;
      cursor: pointer;
    }
  }
}

:deep(.program-dialog) {
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    p {
      padding-bottom: 20px;
      width: 100%;
      font-size: 16px;
      text-align: left;
      span:nth-of-type(1) {
        display: inline-block;
        width: 45%;
        text-align: right;
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

.blue {
  color: #5fafe4 !important;
}
.yellow {
  color: #ee9a59 !important;
}
.red {
  color: red !important;
}

.yellow-bg {
  background: #eea359 !important;
}
.gray-bg {
  background: #848484 !important;
  cursor: default !important;
}
</style>
