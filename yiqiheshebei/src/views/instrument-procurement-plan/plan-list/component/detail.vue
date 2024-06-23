<template>
  <div class="main">
    <div class="recommend">
      <p class="text-box">
        <span>{{ itemData.title }}</span>
        <span>{{ itemData.start_open_time ? itemData.start_open_time + '~' + itemData.end_open_time : '' }}</span>
      </p>
      <div class="btn_box">
        <div v-if="[2].includes(store.state.login.userInfo.role_id)" class="btn" @click="exportExcel()">导出</div>

        <div class="btn white_btn" v-if="[1, 4].includes(itemData.subject_audit)" @click="editItem()">编辑</div>

        <!-- <div
          v-if="
            itemData.school_audit === 3 &&
            itemData.subject_audit === 3 &&
            tableData.some((e) => {
              return e.status === 1
            })
          "
          class="btn"
          @click="warehouse(1)"
        >
          仪器入库
        </div>
        <div
          v-if="
            itemData.school_audit === 3 &&
            itemData.subject_audit === 3 &&
            tableData.some((e) => {
              return e.status === 1
            })
          "
          class="btn"
          @click="warehouse(2)"
        >
          设备入库
        </div> -->
      </div>
    </div>
    <div class="status_box">
      <div class="step">
        <self-step :props-item="itemData"></self-step>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      :header-cell-style="{ color: '#000', borderBottom: '1px solid #c9c7c7' }"
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="编号" prop="instrument_number" align="left" sortable="custom"></el-table-column>
      <el-table-column label="名称" prop="instrument_name" align="left"></el-table-column>
      <el-table-column label="参考规格" prop="specification" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" align="left"></el-table-column>
      <el-table-column label="数量" prop="total" align="left" sortable="custom"></el-table-column>
      <el-table-column label="已入库数量" prop="putstoragecount" align="left" sortable="custom"></el-table-column>
      <el-table-column label="剩余入库数" prop="left_storage_count" align="left" sortable="custom">
        <template #default="scope">
          <span>{{ scope.row.total - scope.row.putstoragecount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="参考价格" prop="price" align="left" sortable="custom"></el-table-column>
      <el-table-column prop="" label="类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.type === 1 ? '仪器' : '设备' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="配备类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.is_must === 1 ? '必配' : '选配' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="入库状态" align="left">
        <template #default="scope">
          <span>{{ scope.row.status === 1 ? '待入库' : '已入库' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <p>
        合计：
        <span>{{ sumComputed }}</span>
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, computed } from 'vue'
import { getSchoolBuyPlanDetail } from '@service/instrument-procurement-plan/plan-list'
import { ListItem, DetailType } from '@service/instrument-procurement-plan/plan-list/types'
// import { accountStatus } from '@/service/login/login'
// import { ElMessage } from 'element-plus'
import SelfStep from './self-step.vue'

import { useStore } from '@/store'
import localCache from '@/utils/localCache'
import axios from 'axios'

let store = useStore()

let props = defineProps({ itemData: { type: Object as () => ListItem, required: true } })
let { itemData } = toRefs(props)

const emit = defineEmits(['editItem', 'setWarehouse', 'getWarehouse'])

const dataMap = reactive({
  tableData: Array<DetailType>()
})
let { tableData } = toRefs(dataMap)

let sortData: any = reactive({})
const getData = (id: number) => {
  getSchoolBuyPlanDetail({
    buy_plan_subject_id: id,
    type: 0,
    ...sortData
  }).then((res) => {
    tableData.value = res.data
  })
}
getData(itemData.value.id)
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    getData(itemData.value.id)
    console.log(column, prop, order)
  }
}
const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolBuyPlanDetail/findSchoolBuyPlanDetail',
      { token, buy_plan_subject_id: itemData.value.id, type: 0, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + itemData.value.title + '.xlsx'
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

const sumComputed = computed(() => {
  let sum = 0
  tableData.value.forEach((e) => {
    sum += e.price * e.total
  })
  return sum
})
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
const editItem = () => {
  console.log(itemData.value.id)
  emit('editItem', itemData.value.id)
}

// const warehouse = async (type: number) => {
//   let status = await accountStatus({ type: type })
//   if (status.data !== 3) {
//     ElMessage({
//       type: 'warning',
//       message: `期初建帐结束后可用，请检查${type === 1 ? '仪器' : '设备'}期初建帐信息`
//     })
//     return
//   }
//   emit('setWarehouse', type)
// }
</script>

<style scoped lang="scss">
.main {
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
    .text-box {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      span:nth-of-type(1) {
        margin-right: 30px;
        color: #05c65d;
      }
    }
    .btn_box {
      display: flex;
      .btn {
        margin-left: 20px;
        box-sizing: border-box;
      }
      .white_btn {
        background: #ffffff;
        color: #05c65d;
        border: #05c65d 1px solid;
      }
    }
  }
  .status_box {
    padding-top: 20px;
    width: 100%;
    height: 100px;
    background: #ffffff;
    box-sizing: border-box;
    .over-border {
      border-color: #fcd3b3;
    }
    .open-border {
      border-color: #05c65d;
    }
    .step {
      // display: flex;
      // justify-content: space-around;
      padding: 10px 0 0 0;
      width: 100%;
      height: 80px;
      box-sizing: border-box;
      :deep(.el-steps) {
        .el-step {
          .el-step__head.is-process {
            .el-step__icon.is-text {
              color: #05c65d;
              border: 2px solid #05c65d;
            }
          }

          .el-step__main {
            text-align: center;
            .el-step__title {
              line-height: 28px;
            }
            .el-step__title.is-process {
              color: #05c65d;
              font-weight: 400;
            }
            .el-step__description {
              color: rgb(192, 196, 204);
            }
          }
        }
      }
    }
  }
  :deep(.el-table) {
    margin-top: 10px;
  }
  footer {
    text-align: right;
    & > p {
      padding: 15px 20px 30px;
      font-size: 18px;
      & > span {
        color: #05c65d;
        font-weight: bold;
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
