<template>
  <div>
    <div class="recommend">
      <p>
        {{ detailObj.title }}
        <span v-show="detailObj.start_open_time">{{ `${detailObj.start_open_time}~${detailObj.end_open_time}` }}</span>
      </p>
      <div class="btn-box">
        <div v-if="detailObj.audit === 2" class="btn" @click="pass(detailObj, 3)">审核通过</div>
        <div v-if="detailObj.audit === 2" class="btn yellow-bg" @click="pass(detailObj, 4)">审核不通过</div>
      </div>
    </div>
    <div class="message">
      <div>
        <p>
          <span>学校审核情况：</span>
          <span>{{ ['', '待上报', '待审核', '审核通过', '审核不通过'][detailObj.audit] || '' }}</span>
        </p>
        <p>
          <span>区域审核情况：</span>
          <span>{{ ['', '待上报', '待审核', '审核通过', '审核不通过'][detailObj.areaaudit] || '' }}</span>
        </p>
        <p>
          <span>学校：</span>
          <span>{{ detailObj.school_name }}</span>
        </p>
        <p>
          <span>金额：</span>
          <span>{{ detailObj.submit_money }}元</span>
        </p>
        <p>
          <span>学科：</span>
          <span>{{ detailObj.subject_name }}</span>
        </p>
        <p>
          <span>提交时间：</span>
          <span>{{ detailObj.submit_time }}</span>
        </p>
        <p>
          <span>备注：</span>
          <span>{{ detailObj.submit_desc }}</span>
        </p>
      </div>
    </div>
    <el-table
      :data="detailObj.schoolbuyplandetail"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
      <el-table-column prop="instrument_number" label="编号" align="left"></el-table-column>
      <el-table-column prop="instrument_name" label="名称" align="left"></el-table-column>
      <el-table-column prop="specification" label="规格" show-overflow-tooltip align="left"></el-table-column>
      <el-table-column prop="unit" label="单位" align="left"></el-table-column>
      <el-table-column prop="total" label="数量" align="left"></el-table-column>
      <el-table-column prop="price" label="参考价格" align="left"></el-table-column>
      <el-table-column prop="" label="类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.type === 1 ? '仪器' : '设备' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" prop="" label="配备类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.is_must === 1 ? '必配' : '选配' }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { planListAddReportOfDetail } from '@service/instrument-procurement-plan/plan-list'
import { SchoolBuyPlanDetailType } from '@service/instrument-procurement-plan/report-manage/types'
import { planListAppear } from '@service/instrument-procurement-plan/plan-list'

import { ElMessage } from 'element-plus'

const props = defineProps({ itemId: { type: Number, required: true } })

let { itemId } = toRefs(props)
console.log('🚀 ~ file: instrument-list.vue ~ line 70 ~ itemId', itemId)

const emit = defineEmits(['back'])

const dataMap = reactive({
  detailObj: {
    id: 0,
    audit: 0,
    areaaudit: 0,
    title: '',
    submit_desc: '',
    submit_time: '',
    submit_money: 0,
    subject_name: '',
    start_open_time: '',
    end_open_time: '',
    school_name: '',
    schoolbuyplandetail: Array<SchoolBuyPlanDetailType>()
  }
})
let { detailObj } = toRefs(dataMap)

const getData = () => {
  planListAddReportOfDetail({ id: itemId.value }).then((res) => {
    detailObj.value = res.data
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
        emit('back')
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
    span {
      margin-left: 30px;
      color: #333333;
    }
  }
  .btn-box {
    display: flex;
    .btn {
      margin-left: 20px;
    }
  }
}
.message {
  padding: 10px 30px;
  width: 100%;
  // min-height: 200px;
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
    }
    & > p:nth-of-type(2n-1) {
      width: 35%;
    }
    & > p:nth-of-type(2n) {
      width: 65%;
    }
    & > p:last-of-type {
      width: 100%;
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

.yellow-bg {
  background: #eea359;
}
.gray-bg {
  background: #848484;
  cursor: default;
}

.blue {
  color: #5fafe4;
}
.yellow {
  color: #ee9a59;
}
</style>
