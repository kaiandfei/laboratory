<template>
  <div>
    <div v-show="!configShow">
      <div class="title">
        <p>{{ props.item.title }}配置清单</p>
        <div v-if="false && ![1].includes(store.state.login.userInfo.role_id)" class="btn" @click="getConfig()">
          更新配置
        </div>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{
            padding: '4px 0',
            background: '#EFEFEF',
            color: '#000',
            borderLeft: '1px solid #05c65d',
            borderBottom: '1px solid #05c65d'
          }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          height="600"
        >
          <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
          <el-table-column label="编号" prop="number" align="left"></el-table-column>
          <el-table-column label="名称" prop="name" align="left"></el-table-column>
          <el-table-column
            label="参考规格"
            prop="specification"
            width="200"
            align="left"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="单位" prop="unit" width="80" align="left"></el-table-column>
          <el-table-column label="库存数量" prop="total" align="left"></el-table-column>
          <!-- <el-table-column label="配备数量" align="left">
            <el-table-column prop="I" label="Ⅰ类" align="left"></el-table-column>
            <el-table-column prop="II" label="Ⅱ类" align="left"></el-table-column>
            <el-table-column prop="III" label="Ⅲ类" align="left"></el-table-column>
          </el-table-column>
          <el-table-column v-if="false" prop="" label="配置达标情况" align="left">
            <template #default="scope">
              <span v-show="scope.row.is_standard === 1">达标</span>
              <span class="red" v-show="scope.row.is_standard === 0">不达标</span>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <Configuration v-if="configShow" @back="back" :item="props.item" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, toRefs } from 'vue'
import Configuration from './configuration.vue'

import { laboratoryConfig } from '@service/laboratory-manage/overview/index'
import { labConfig } from '@service/laboratory-manage/overview/types'
import { useStore } from '@/store/index'
let store = useStore()

const props = defineProps({ item: { type: Object, required: true } })

const dataMap = reactive({
  tableData: [labConfig]
})

let { tableData } = toRefs(dataMap)

const getData = () => {
  laboratoryConfig({ id: props.item.id }).then((res) => {
    tableData.value = res.data
  })
}
getData()

let configShow = ref(false)
const getConfig = () => {
  configShow.value = true
}
const back = () => {
  getData()
  configShow.value = false
}
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  background: #ffffff;
  box-sizing: border-box;
  p:nth-of-type(1) {
    margin-right: 80px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }
}
.btn {
  width: 120px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}
.content {
  width: 100%;
  margin-top: 10px;
  span {
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
  }
}
.green {
  color: #05c65d !important;
}
.red {
  color: #de4747 !important;
}
</style>
