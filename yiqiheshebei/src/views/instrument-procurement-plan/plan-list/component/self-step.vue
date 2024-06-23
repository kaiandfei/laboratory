<template>
  <div class="box">
    <el-steps :active="computedActive(propsItem)" finish-status="success" align-center>
      <el-step :title="propsItem.subject_audit === 1 ? '上报' : '已上报'">
        <template #description>
          <div v-if="propsItem.subject_audit > 1">
            {{ '上报时间:' + propsItem.subject_submit_time }}
          </div>
        </template>
      </el-step>
      <el-step
        :title="
          propsItem.subject_audit < 3 ? '学校审核' : propsItem.subject_audit === 3 ? '学校审核通过' : '学校审核未通过'
        "
        :status="propsItem.subject_audit === 4 ? 'error' : ''"
      >
        <template #description>
          <div v-if="propsItem.subject_audit > 2">
            {{ '审核时间:' + propsItem.subject_audit_time }}
          </div>
        </template>
      </el-step>
      <el-step :title="propsItem.school_audit === 1 ? '学校上报' : '学校已上报'">
        <template #description>
          <div v-if="propsItem.school_audit > 1">
            {{ '上报时间:' + propsItem.school_submit_time }}
          </div>
        </template>
      </el-step>
      <el-step
        :title="
          propsItem.school_audit < 3 ? '区域审核' : propsItem.school_audit === 3 ? '区域审核通过' : '区域审核未通过'
        "
        :status="propsItem.school_audit === 4 ? 'error' : ''"
      >
        <template #description>
          <div v-if="propsItem.school_audit > 2">
            {{ '审核时间:' + propsItem.school_audit_time }}
          </div>
        </template>
      </el-step>
      <el-step title="验收">
        <template #description>
          <div v-if="propsItem.check_time">
            {{ '上次验收时间:' + propsItem.check_time.split(' ')[0] }}
          </div>
        </template>
      </el-step>
      <el-step title="入库"></el-step>
    </el-steps>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed } from 'vue'
const props = defineProps({
  propsItem: {
    type: Object,
    required: true
  }
})
let { propsItem } = toRefs(props)

// 0未上报 1已上报
const computedActive = computed(() => {
  return (item: any) => {
    let status: number = item.subject_audit < 3 ? item.subject_audit - 1 : 1
    if ((item.subject_audit === 3 || item.subject_audit === 4) && item.school_audit === 1) {
      status = 2
    } else if (item.subject_audit === 3 && item.school_audit === 2) {
      status = 3
    } else if (item.subject_audit === 3 && (item.school_audit === 3 || item.school_audit === 4)) {
      status = 4
    }
    if (item.all_check === 2) {
      status = 5
    }
    if (item.subject_audit === 3 && item.school_audit === 3 && item.isPut === 0) {
      status = 6
    }
    return status
  }
})
</script>

<style scoped lang="scss">
.box {
  // display: flex;
  // justify-content: space-around;
  width: 100%;
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

.green-font {
  color: #05c65d;
}
.red-font {
  color: #de4747;
}
</style>
