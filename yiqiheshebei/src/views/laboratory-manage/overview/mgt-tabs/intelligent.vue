<template>
  <div class="conmonDevice">
    <div class="title">
      <div>通用设备</div>
      <div class="line" />
    </div>
    <div class="picList" v-loading="picLoading" element-loading-text="加载中...">
      <div class="no-picList" v-if="picItemList.length === 0">暂无数据</div>
      <div class="picItem" v-for="(item, index) in picItemList" :key="index">
        <div class="left">
          <div class="mb-20 textOverflow">{{ item.name }}</div>
          <div class="mb-20 textOverflow">{{ item.device_no }}</div>
          <div :style="{ color: item.status === '在线' ? '#05c65d' : '#DE4747' }">{{ item.status }}</div>
        </div>
        <div class="right">
          <img
            class="picImg"
            :src="item.img || 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220707/102957039.jpg'"
            alt=""
          />
        </div>
      </div>
      <i v-for="num in 3" :key="num"></i>
    </div>
  </div>
  <div class="stuTerminal">
    <div class="title">
      <div>学生终端</div>
      <div class="line" />
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :cell-style="addClass"
      v-loading="loading"
      element-loading-text="加载中..."
    >
      <el-table-column type="index" label="序号" width="50" align="left" />
      <el-table-column prop="device_no" label="学生终端序号" width="180" align="left" />
      <el-table-column label="终端类型" width="180" align="left">
        <template #default="scope">
          {{ scope.row.terminal_type === 1 ? 'pc' : scope.row.terminal_type === 2 ? 'pad' : '智慧笔记本' }}
        </template>
      </el-table-column>
      <el-table-column label="分组" width="180" align="left">
        <template #default="scope">
          {{ '分组' + scope.row.group_n }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" width="180" align="left" />
      <el-table-column prop="status" label="设备状态" width="180" align="left" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { labPeripheralType, deviceListType } from '@/service/laboratory-manage/overview/types'
import { reactive, ref, useAttrs, defineExpose } from 'vue'
import { getStuTerminalList, labPeripheralList, laboratorySwitch } from '@service/laboratory-manage/overview/index'
import { STATUS } from '@/constants/laboratoryConst'
const $attrs: any = useAttrs()
const $emit = defineEmits(['isNoLaboratorySwitch'])
console.log(1111, $attrs)
let picItemList = ref<labPeripheralType[]>([])
let loading = ref(false)
let picLoading = ref(false)
const tableData = ref<deviceListType[]>([])

//获取空开
const getLaboratorySwitch = async () => {
  try {
    let params = {
      labor_id: $attrs._item.id
    }
    const { data, code } = await laboratorySwitch(params)
    if (code === 10) {
      // console.log(data)
      if (data.length === 0) {
        $emit('isNoLaboratorySwitch', 1)
      } else {
        $emit('isNoLaboratorySwitch', data)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
getLaboratorySwitch()
//获取某个实验室所有设备
const labPeripheralListData = async () => {
  picLoading.value = true
  let params = {
    lab_id: $attrs._item.id
    // lab_id: 224
  }
  try {
    const { data, code } = await labPeripheralList(params)
    if (code === 10) {
      format(data)
      picItemList.value = data
    }
    picLoading.value = false
  } catch (error) {
    picLoading.value = false
    throw new Error('error')
  }
}
labPeripheralListData()
//获取学生终端列表
const getStuTerminalListData = async () => {
  tableData.value = []
  loading.value = true
  let params = {
    labId: $attrs._item.id
  }
  try {
    const { data, code } = await getStuTerminalList(params)
    if (code === 10) {
      format(data)
      tableData.value = data
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    throw new Error('error')
  }
}
getStuTerminalListData()
const format = (_const: any[]) => {
  _const.forEach((item) => {
    STATUS.forEach((e) => {
      if (item.status === e.id) {
        item.status = e.name
      }
    })
  })
}
const addClass = ({ row, columnIndex }: any) => {
  if (columnIndex === 5) {
    if (row.status === '在线') {
      return 'color:#05c65d'
    } else {
      return 'color:#DE4747'
    }
  }
}
defineExpose({ getStuTerminalListData, labPeripheralListData })
</script>

<style scoped lang="scss">
.title {
  font-weight: bold;
  .line {
    margin: 10px 0 20px;
    width: 233px;
    height: 5px;
    background-color: #05c65d;
  }
}
.conmonDevice {
  text-align: left;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.picList {
  background-color: #e8e8e9;
  padding: 20px 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &::after {
    content: '';
    flex: auto;
  }
  .no-picList {
    position: relative;
    top: -10px;
    width: 100%;
    text-align: center;
  }
  i {
    width: 383px;
  }
  .picItem {
    display: flex;
    justify-content: space-between;
    width: 383px;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    margin: 0 0 20px 0;
    .left {
      width: 58%;
      .textOverflow {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .right {
      flex: 1;
      .picImg {
        width: 149px;
        height: 119px;
      }
    }
  }
}
.picList:after {
  content: '';
  flex: auto;
}
.stuTerminal {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  text-align: left;
}
</style>
