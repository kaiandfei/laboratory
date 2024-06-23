<template>
  <div
    class="instrument"
    :style="{ backgroundImage: listData.imgUrl ? 'url(' + listData.imgUrl + ')' : '', backgroundColor: color }"
  >
    <div class="header">
      <div class="header-title">
        {{ listData.header }}
        <div class="del" v-if="listData.header && !refs.isBg.value" @click="handleDel('header')">-</div>
      </div>
      <img class="code" :src="listData.qr_code" alt="" crossorigin="anonymous" />
    </div>
    <el-table :data="tableData" border class="table">
      <!-- <el-table-column type="index" width="50">
        <template #header="{ column }">
          序号
          <div class="tableDel" v-if="!refs.isBg.value" @click="handleDel(column.property)">-</div>
        </template>
      </el-table-column> -->
      <el-table-column
        v-for="(item, index) in listData.columns"
        :key="index"
        :prop="item.prop"
        :type="item.type"
        :width="item.width"
      >
        <template #header="{ column }">
          {{ item.label }}
          <div class="tableDel" v-if="!refs.isBg.value" @click="handleDel(column.property)">-</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, toRefs, watch, defineExpose } from 'vue'
const props = defineProps(['infoData', 'color', 'isBg'])
const refs = toRefs(props)
let color = ref()
watch(
  () => refs.color.value,
  (newValue, oldValue) => {
    color.value = newValue
  },
  { immediate: true }
)
const tableData: any = ref([])
let listData = ref()
listData.value = refs.infoData.value
tableData.value = refs.infoData.value.tableData || []
console.log(65, listData.value)

const handleDel = (val: string) => {
  if (val === 'header') {
    delete listData.value[val]
    // listData.value[val] = ''
    return
  }
  for (let i = 0; i < tableData.value.length; i++) {
    delete tableData.value[i][val]
  }
  for (let i = 0; i < listData.value.columns.length; i++) {
    if (listData.value.columns[i].prop === val) {
      listData.value.columns.splice(i, 1)
    }
  }
}
defineExpose({ listData })
</script>

<style lang="scss" scoped>
::v-deep .cell {
  height: 100%;
  position: relative;
  overflow: visible;

  .tableDel {
    width: 15px;
    height: 15px;
    font-size: 25px;
    line-height: 12px;
    text-align: center;
    color: #fff;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: -8px;
    right: -0px;
    cursor: pointer;
  }
}

.instrument {
  width: 500px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #05c65d;
  background-size: cover;
  background-repeat: no-repeat;

  .header {
    display: flex;
    justify-content: right;
    align-items: center;
    margin-bottom: 10px;
    font-size: 20px;

    .header-title {
      flex: 1;
      text-align: center;
      position: relative;

      .del {
        width: 15px;
        height: 15px;
        line-height: 12px;
        color: #fff;
        background-color: red;
        border-radius: 50%;
        font-size: 25px;
        position: absolute;
        top: -12px;
        right: 30px;
        cursor: pointer;
      }
    }

    .code {
      width: 100px;
      height: 100px;
      margin-left: 10px;
      border-radius: 50%;
    }
  }
}

// ::v-deep .el-table__body-wrapper {
//   display: none;
// }
.table {
  min-height: 350px;
}
</style>
