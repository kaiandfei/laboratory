<template>
  <div class="main">
    <div class="recommend">
      <p class="text-box">
        <span>{{ itemData.title }}</span>
        <span>{{ itemData.start_open_time ? itemData.start_open_time + '~' + itemData.end_open_time : '' }}</span>
      </p>
    </div>
    <div class="status_box">
      <div class="step">
        <self-step :props-item="itemData"></self-step>
        <!-- <el-steps :active="computedActive(itemData)" finish-status="success" align-center>
          <el-step :title="itemData.subject_audit === 1 ? '上报' : '已上报'">
            <template #description>
              <div v-if="itemData.subject_audit > 1">
                {{ '上报时间:' + itemData.subject_submit_time }}
              </div>
            </template>
          </el-step>
          <el-step
            :title="
              itemData.subject_audit < 3 ? '学校审核' : itemData.subject_audit === 3 ? '学校审核通过' : '学校审核未通过'
            "
            :status="itemData.subject_audit === 4 ? 'error' : ''"
          >
            <template #description>
              <div v-if="itemData.subject_audit > 2">
                {{ '审核时间:' + itemData.subject_audit_time }}
              </div>
            </template>
          </el-step>
          <el-step :title="itemData.school_audit === 1 ? '学校上报' : '学校已上报'">
            <template #description>
              <div v-if="itemData.school_audit > 1">
                {{ '上报时间:' + itemData.school_submit_time }}
              </div>
            </template>
          </el-step>
          <el-step
            :title="
              itemData.school_audit < 3 ? '区域审核' : itemData.school_audit === 3 ? '区域审核通过' : '区域审核未通过'
            "
            :status="itemData.school_audit === 4 ? 'error' : ''"
          >
            <template #description>
              <div v-if="itemData.school_audit > 2">
                {{ '审核时间:' + itemData.school_audit_time }}
              </div>
            </template>
          </el-step>
          <el-step title="验收入库"></el-step>
        </el-steps> -->
      </div>
    </div>
    <div class="tab-box">
      <div class="item" :class="{ active: type === 1 }" @click="warehouse(1)">仪器</div>
      <div class="item" :class="{ active: type === 2 }" @click="warehouse(2)">设备</div>
    </div>
    <component
      :is="type === 1 ? InsWarehouse : EquWarehouse"
      :item-data="itemData"
      :editStatus="editStatus"
    ></component>
    <!-- <InsWarehouse v-if="type === 1" :item-data="itemData"></InsWarehouse>
    <EquWarehouse v-else :item-data="itemData"></EquWarehouse> -->

    <!-- <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      :header-cell-style="{ color: '#000', borderBottom: '1px solid #c9c7c7' }"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="编号" prop="instrument_number" align="left"></el-table-column>
      <el-table-column label="名称" prop="instrument_name" align="left"></el-table-column>
      <el-table-column label="参考规格" prop="specification" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" align="left"></el-table-column>
      <el-table-column label="数量" prop="total" align="left"></el-table-column>
      <el-table-column label="已入库数量" prop="putstoragecount" align="left"></el-table-column>
      <el-table-column label="剩余入库数" align="left">
        <template #default="scope">
          <span>{{ scope.row.total - scope.row.putstoragecount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="参考价格" prop="price" align="left"></el-table-column>
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
    </el-table> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
// import { getSchoolBuyPlanDetail } from '@service/instrument-procurement-plan/plan-list'
import { ListItem } from '@service/instrument-procurement-plan/plan-list/types'
import { accountStatus } from '@/service/login/login'
import { ElMessage } from 'element-plus'
import SelfStep from './self-step.vue'
import InsWarehouse from './ins-warehouse'
import EquWarehouse from './equ-warehouse'

let props = defineProps({ itemData: { type: Object as () => ListItem, required: true } })
let { itemData } = toRefs(props)

// const emit = defineEmits(['editItem'])

const dataMap = reactive({
  // tableData: Array<DetailType>(),
  type: 1,
  editStatus: false
})
let { type, editStatus } = toRefs(dataMap)

// const getData = (id: number) => {
//   getSchoolBuyPlanDetail({
//     buy_plan_subject_id: id,
//     type: 0
//   }).then((res) => {
//     tableData.value = res.data
//   })
// }
// getData(itemData.value.id)

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

const warehouse = async (index: number) => {
  let status = await accountStatus({ type: index })
  if (status.data !== 3) {
    ElMessage({
      type: 'warning',
      message: `期初建帐结束后可用，请检查${index === 1 ? '仪器' : '设备'}期初建帐信息`
    })
    editStatus.value = false
    return
  }
  editStatus.value = true
  type.value = index
}
warehouse(1)
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
  .tab-box {
    margin-top: 10px;
    height: 60px;
    line-height: 60px;
    border-radius: 10px;
    background-color: #fff;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    .item {
      display: inline-block;
      width: 50%;
      cursor: pointer;
    }
    .active {
      color: #05c65d;
      background: #bef1d5;
      border-radius: 10px;
    }
  }

  // :deep(.el-table) {
  //   margin-top: 10px;
  // }
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
