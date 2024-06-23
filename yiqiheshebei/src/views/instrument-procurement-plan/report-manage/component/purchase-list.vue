<template>
  <div>
    <div class="recommend">
      <div class="text-box">
        <span>{{ baseObj.title }}</span>
        <span v-show="baseObj.start_open_time">{{ baseObj.start_open_time }} ~ {{ baseObj.end_open_time }}</span>
      </div>
      <div class="btn-box">
        <span class="btn-text" :class="{ 'gray-bg': baseObj.audit !== 2 }" @click="pass(baseObj, 3)">审核通过</span>
        <span class="btn-text yellow-bg" :class="{ 'gray-bg': baseObj.audit !== 2 }" @click="pass(baseObj, 4)">
          审核不通过
        </span>
      </div>
    </div>
    <div class="pass-box">
      <!-- <div  class="message">
           <div class="pass-message">
            <span>学科审核情况：</span>
            <span :style="{ color: baseObj.audit !== 3 ? '#EE9A59' : '#05C65D' }">
              {{ ['', '待上报', '待审核', '审核通过', '审核不通过'][baseObj.audit] || '' }}
            </span>
          </div>
          <div class="btn-box">
            <div class="btn" :class="{ 'gray-bg': baseObj.audit !== 2 }" @click="pass(baseObj, 3)">审核通过</div>
            <div class="btn yellow-bg" :class="{ 'gray-bg': baseObj.audit !== 2 }" @click="pass(baseObj, 4)">审核不通过</div>
          </div>
         </div> -->
    </div>
    <div v-for="(item, index) in baseObj.schoolBuyPlanSubject" :key="index">
      <div class="message">
        <div>
          <p>
            <span>学校：</span>
            <span>{{ baseObj.school_name }}</span>
          </p>
          <p>
            <span>提交金额：</span>
            <span>{{ item.submit_money - 0 === 0 ? '/' : item.submit_money }}元</span>
          </p>
          <p>
            <span>学科：</span>
            <span>{{ item.subject_name }}</span>
          </p>
          <p>
            <span>提交时间：</span>
            <span>{{ item.submit_time }}</span>
          </p>
          <p>
            <span>备注：</span>
            <span>{{ item.submit_desc }}</span>
          </p>
        </div>
      </div>
      <el-table
        :data="item.SchoolBuyPlanDetail"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
      >
        <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
        <el-table-column prop="instrument_number" label="编号" align="left"></el-table-column>
        <el-table-column prop="instrument_name" label="名称" align="left"></el-table-column>
        <el-table-column prop="specification" label="规格" align="left"></el-table-column>
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
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { buyPlanDetailList, planListAppear } from '@service/instrument-procurement-plan/report-manage'
import { DetailBuyPlanListData } from '@service/instrument-procurement-plan/report-manage/types'
import { ElMessage } from 'element-plus'

// import {} from '@service/instrument-procurement-plan/plan-list'

const props = defineProps({ itemId: { type: Number, required: true } })

let { itemId } = toRefs(props)

const dataMap = reactive({
  baseObj: DetailBuyPlanListData
})
let { baseObj } = toRefs(dataMap)

const getData = () => {
  buyPlanDetailList({ id: itemId.value }).then((res) => {
    baseObj.value = res.data
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
  margin: 10px 0;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  background: #dcece3;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  .text-box {
    & > span {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #05c65d;
    }
    & > span:nth-of-type(2) {
      margin-left: 30px;
      color: #333333;
    }
  }
}

.message {
  padding: 10px 30px;
  width: 100%;
  min-height: 180px;
  background: #fff;
  box-sizing: border-box;
  .pass-box {
    padding: 10px 30px;
    border: 1px dotted #05c65d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pass-message {
      font-size: 18px;

      span:nth-of-type(1) {
        color: #848484;
      }
      span:nth-of-type(2) {
        font-weight: bold;
      }
    }
  }
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
  margin: 20px 0 30px;
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

.yellow-bg {
  background: #eea359;
}

.gray-bg {
  background: #848484 !important;
  cursor: default !important;
}

.blue {
  color: #5fafe4;
}
.yellow {
  color: #ee9a59;
}
</style>
