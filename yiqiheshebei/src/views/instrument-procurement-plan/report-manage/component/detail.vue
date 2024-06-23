<template>
  <div>
    <div class="recommend">
      <p>计划详情</p>
    </div>
    <div class="message">
      <div>
        <p>
          <span>开放状态：</span>
          <span :style="{ color: baseRequest.isOpen === 1 ? '#05C65D' : '#B5B5B5' }">
            {{
              baseRequest.isOpen === 1
                ? '开放中'
                : baseRequest.isOpen === 2
                ? '未开放'
                : baseRequest.isOpen === 3
                ? '已结束'
                : ''
            }}
          </span>
        </p>
        <p>
          <span>发布状态：</span>
          <span :style="{ color: baseRequest.is_push === 2 ? '#05C65D' : '#B5B5B5' }">
            {{
              baseRequest.is_push === 1
                ? '未发布'
                : baseRequest.is_push === 2
                ? '已发布'
                : baseRequest.is_push === 3
                ? '已撤回'
                : ''
            }}
          </span>
        </p>
      </div>
      <div>
        <p>
          <span>计划名称：</span>
          <span>{{ baseRequest.title }}</span>
        </p>
        <p>
          <span>开放时间：</span>
          <span>{{ baseRequest.start_open_time }} 至 {{ baseRequest.end_open_time }}</span>
        </p>
        <p>
          <span>发布时间：</span>
          <span>{{ baseRequest.publish_time }}</span>
        </p>
      </div>
    </div>
    <el-table
      :data="baseRequest.SchoolBuyPlan"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
      <el-table-column prop="school_name" label="学校名称" align="left"></el-table-column>
      <el-table-column prop="area" label="区域" align="left"></el-table-column>
      <el-table-column
        prop="total_prices"
        label="参考金额"
        align="left"
        sortable
        :sort-method="
          (a, b) => {
            return a.total_prices - b.total_prices
          }
        "
      >
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
      <el-table-column
        prop="submit_money"
        label="提交金额"
        align="left"
        sortable
        :sort-method="
          (a, b) => {
            return a.submit_money - b.submit_money
          }
        "
      >
        <template #default="scope">
          <span v-if="scope.row.audit !== 1">
            {{ scope.row.submit_money }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="submit_time" label="提交时间" align="left" sortable>
        <template #default="scope">
          <span v-if="scope.row.audit !== 1">
            {{ scope.row.submit_time }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="审核状态" align="left">
        <template #default="scope">
          <span v-if="scope.row.audit !== 1">
            {{ ['', '待上报', '待审核', '审核通过', '审核不通过'][scope.row.audit] || '' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="audit_time" label="审核时间" align="left">
        <template #default="scope">
          <span v-if="scope.row.audit !== 1">
            {{ scope.row.audit_time }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="操作" width="350" :align="'left'">
        <template #default="scope">
          <div v-if="scope.row.audit !== 1">
            <span class="btn-text" :class="{ 'gray-bg': scope.row.audit !== 2 }" @click="pass(scope.row, 3)">
              审核通过
            </span>
            <span class="btn-text yellow-bg" :class="{ 'gray-bg': scope.row.audit !== 2 }" @click="pass(scope.row, 4)">
              审核不通过
            </span>
            <span v-if="scope.row.audit > 1" class="click-text" @click="detail(scope.row.id)">详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <footer>
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="50"
      ></el-pagination>
    </footer> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { buyPlanDetail, planListAppear } from '@service/instrument-procurement-plan/report-manage'
import { DetailBuyPlan } from '@service/instrument-procurement-plan/report-manage/types'
import { ElMessage } from 'element-plus'

const props = defineProps({ itemId: { type: Number, required: true } })
let { itemId } = toRefs(props)
console.log('🚀 ~ file: instrument-list.vue ~ line 70 ~ itemId', itemId)

const emit = defineEmits(['showList'])

const dataMap = reactive({
  baseRequest: Object() as DetailBuyPlan
})
let { baseRequest } = toRefs(dataMap)

const getData = () => {
  buyPlanDetail({ id: itemId.value }).then((res) => {
    if (res.code === 10) {
      baseRequest.value = res.data
    }
  })
}

getData()

const pass = (item: { id: number; audit: number }, status: number) => {
  if (item.audit === 2) {
    planListAppear({ id: item.id, audit: status }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: '审核成功'
        })
        getData()
      }
    })
  }
}

const detail = (id: number) => {
  emit('showList', id)
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
  height: 120px;
  background: #fff;
  box-sizing: border-box;
  & > div {
    text-align: left;
    & > p {
      display: inline-block;
      width: 33%;
      height: 45px;
      line-height: 45px;
      & > span:nth-of-type(1) {
        color: #848484;
      }
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

footer {
  margin-top: 20px;
  text-align: right;
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
</style>
