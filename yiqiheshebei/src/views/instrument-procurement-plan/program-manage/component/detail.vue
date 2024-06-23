<template>
  <div>
    <div class="recommend">
      <p>计划详情</p>
      <div v-if="baseObj.audit === 1 && baseObj.isOpen === 1" class="btn" @click="report(itemId)">上报</div>
      <div v-else class="btn gray-bg" title="当前计划未开放或者已上报">上报</div>
    </div>
    <div class="message">
      <div>
        <p class="l-text" v-if="baseObj.selfbuilt === 2">
          <span>开放状态：</span>
          <i class="icon" :style="{ 'background-color': baseObj.isOpen === 1 ? '#05C65D' : '#B5B5B5' }"></i>
          <span :style="{ color: baseObj.isOpen === 1 ? '#05C65D' : '#B5B5B5' }">
            {{
              baseObj.isOpen === 1 ? '开放中' : baseObj.isOpen === 2 ? '未开放' : baseObj.isOpen === 3 ? '已结束' : ''
            }}
          </span>
        </p>
      </div>
      <div>
        <p>
          <span>计划名称：</span>
          <span>{{ baseObj.title }}</span>
        </p>
        <p>
          <span>参考金额：</span>
          <span>
            {{ baseObj.total_prices - 0 === 0 ? '/' : baseObj.total_prices + '元' }}
          </span>
        </p>
        <p v-if="baseObj.selfbuilt === 2">
          <span>开放时间：</span>
          <span>{{ baseObj.start_open_time }} 至 {{ baseObj.end_open_time }}</span>
        </p>
        <p>
          <span>开放学科：</span>
          <span>{{ showSubComputed }}</span>
        </p>
        <p v-if="baseObj.selfbuilt === 2">
          <span>发布时间：</span>
          <span>{{ baseObj.publish_time }}</span>
        </p>
      </div>
    </div>
    <el-table
      :data="baseObj.schoolBuyPlanSubject"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
      <el-table-column prop="subject_name" label="学科" align="left"></el-table-column>
      <el-table-column prop="tips" label="实验员提交情况" align="left">
        <template #default="scope">
          <span>{{ scope.row.audit === 1 ? '未提交' : '已提交' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="submit_money" label="提交金额" align="left"></el-table-column>
      <el-table-column prop="submit_time" label="提交时间" align="left"></el-table-column>
      <el-table-column prop="" label="学校审核情况" align="left">
        <template #default="scope">
          <span v-if="scope.row.audit !== 1">
            {{ ['', '待上报', '待审核', '审核通过', '审核不通过'][scope.row.audit] || '' }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="" label="装备审核情况" align="left">
        <template #default="scope">
          <span>{{ scope.row.status === 0 ? '未上报' : '已上报' }}</span>
        </template>
      </el-table-column> -->

      <el-table-column v-if="true" prop="" label="操作" width="400" align="center">
        <template #default="scope">
          <div v-if="scope.row.audit !== 1" class="left">
            <span class="btn-text" :class="{ 'gray-bg': scope.row.audit !== 2 }" @click="pass(scope.row, 3)">
              审核通过
            </span>
            <span class="btn-text yellow-bg" :class="{ 'gray-bg': scope.row.audit !== 2 }" @click="pass(scope.row, 4)">
              审核不通过
            </span>
            <span v-show="scope.row.audit > 1" class="click-text" @click="getListDetail(scope.row.id)">
              <img src="@images/menu/detail-green.png" alt="" />
              仪器清单
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import { programListDetail, reportPlan } from '@service/instrument-procurement-plan/program-manage'
import { detailData } from '@service/instrument-procurement-plan/program-manage/types'
import { planListAppear } from '@service/instrument-procurement-plan/plan-list'

const props = defineProps({ itemId: { type: Number, required: true } })

let { itemId } = toRefs(props)
console.log('🚀 ~ file: instrument-list.vue ~ line 70 ~ itemId', itemId)
const emit = defineEmits(['getList'])

const dataMap = reactive({
  baseObj: detailData
})
let { baseObj } = toRefs(dataMap)

const getData = (id: number) => {
  programListDetail({ id: id }).then((res) => {
    baseObj.value = res.data
  })
}

getData(itemId.value)

const report = (id: number) => {
  ElMessageBox.confirm('请问您是否确认上报计划? 上报后不可更改!', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      reportPlan({ id, audit: 2 }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '上报成功'
          })
          baseObj.value.audit = 2
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '点击返回'
      })
    })
}

const showSubComputed = computed(() => {
  let str = ''
  baseObj.value.schoolBuyPlanSubject.forEach((e) => {
    if (e.subject_name !== '') {
      if (str === '') {
        str += `${e.subject_name}`
      } else {
        str += `、${e.subject_name}`
      }
    }
  })
  return str
})

const getListDetail = (id: number) => {
  emit('getList', id)
}

const pass = (item: { id: number; audit: number }, status: number) => {
  if (item.audit === 2) {
    planListAppear({ id: item.id, audit: status }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: '审核成功'
        })
        getData(itemId.value)
      }
    })
  }
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
.message {
  padding: 10px 30px;
  width: 100%;
  height: 200px;
  background: #fff;
  box-sizing: border-box;
  & > div {
    text-align: left;
    & > p {
      display: inline-block;
      height: 45px;
      line-height: 45px;
      & > span:nth-of-type(1) {
        color: #848484;
      }
      .icon {
        margin: 0 6px -3px 0;
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 8px;
      }
    }
    & > p:nth-of-type(2n-1) {
      width: 35%;
    }
    & > p:nth-of-type(2n) {
      width: 65%;
    }
  }
}

:deep(.el-table) {
  margin-top: 20px;
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

  .click-text {
    margin: 0 10px;
    color: #05c65d;
    cursor: pointer;
    img {
      vertical-align: middle;
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
  color: #5fafe4;
}
.yellow {
  color: #ee9a59;
}

.yellow-bg {
  background: #eea359 !important;
}
.gray-bg {
  background: #848484 !important;
  cursor: default !important;
}

.left {
  text-align: left;
}
</style>
