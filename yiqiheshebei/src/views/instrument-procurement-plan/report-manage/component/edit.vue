<template>
  <div class="box">
    <div class="recommend">
      <p>{{ itemId === 0 ? '新建计划' : '编辑计划' }}</p>
      <div class="btn-box">
        <div class="btn white-btn" @click="back()">取消</div>
        <div class="btn" @click="save()">保存</div>
      </div>
    </div>
    <div class="message">
      <p>
        <span>计划名称：</span>
        <el-input v-model="planName"></el-input>
      </p>
      <p>
        <span>开放时间：</span>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          unlink-panels
          size="small"
          value-format="YYYY-MM-DD"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </p>
    </div>
    <div class="title">
      <span>学校列表</span>
      <div class="select-box">
        <el-input type="text" placeholder="搜索" v-model="searchInput" @keyup.enter="search">
          <template #append>
            <el-button type="primary" @click="search">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
    <el-table
      :data="tableComputed"
      style="width: 100%"
      :header-cell-style="{ background: '#fff', borderColor: 'rgba(5, 198, 93, .5)', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
      <el-table-column prop="school_name" label="学校名称" align="left"></el-table-column>
      <el-table-column prop="belong_area" label="区域" align="left"></el-table-column>
      <el-table-column prop="" label="参考金额" align="left">
        <template #default="scope">
          <div class="my-checkbox-box">
            <!-- <el-input type="number" v-model.number="scope.row.total_prices"></el-input> -->
            <input class="my-input" v-model="scope.row.total_prices" @input="inputAdjust" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="学科" align="left">
        <el-table-column
          v-for="(item, index) in tableData[0].subject"
          :key="index"
          :label="item.subject_name"
          align="left"
        >
          <template #default="scope">
            <div class="my-checkbox-box">
              <input
                class="my-checkbox"
                type="checkbox"
                v-model="scope.row.subject[index].is_true"
                :disabled="scope.row.subject[index].disabled === 1"
              />
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- <el-table-column prop="" label="是否开放给该学校" align="left">
        <template #default="scope">
          <div class="my-checkbox-box">
            <input class="my-checkbox" type="checkbox" v-model="scope.row.is_open" />
          </div>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, computed } from 'vue'

import { Search } from '@element-plus/icons-vue'
import { editReport, saveReport } from '@service/instrument-procurement-plan/report-manage'
import { CreatRequestData } from '@service/instrument-procurement-plan/report-manage/types'

import { inputAdjust } from '@/utils/common'

const props = defineProps({ itemId: { type: Number, required: true } })
let { itemId } = toRefs(props)
console.log('🚀 ~ file: instrument-list.vue ~ line 70 ~ itemId', itemId.value)

const emit = defineEmits(['back'])

let dataMap = reactive({
  planName: '',
  dateValue: Array<string>(),
  searchInput: '',
  searchClick: '',
  tableData: Array<CreatRequestData>()
})

let { planName, dateValue, searchInput, searchClick, tableData } = toRefs(dataMap)

editReport(itemId.value === 0 ? {} : { id: itemId.value }).then((res) => {
  tableData.value = res.data.schoolBuyPlan
  if (itemId.value !== 0) {
    planName.value = res.data.title
    dateValue.value = [res.data.start_open_time, res.data.end_open_time]
  }
})

const tableComputed = computed(() => {
  let reg = new RegExp(searchClick.value, 'i')
  let list = tableData.value
  let returnList
  if (searchClick.value !== '') {
    returnList = list.filter((item: any) => {
      // 搜索指定键
      return ['school_name', 'belong_area', 'total_prices'].some((key) => {
        return reg.test(item[key].toString())
      })
      // 搜索所有键
      // return Object.keys(item).some((key) => {
      //   return item[key].toString().match(reg)
      // })
    })
  } else {
    returnList = list
  }
  return returnList
})

const search = () => {
  searchClick.value = searchInput.value
}

const back = () => {
  emit('back')
}

const save = () => {
  tableData.value.forEach((e, i) => {
    if (e.subject.some((m) => m.is_true)) {
      tableData.value[i].is_open = 1
    } else {
      tableData.value[i].is_open = 0
    }
  })
  let obj
  if (itemId.value === 0) {
    obj = {
      // id:1,
      title: planName.value,
      start_open_time: dateValue.value[0],
      end_open_time: dateValue.value[1],
      schoolBuyPlan: tableData.value
    }
  } else {
    obj = {
      id: itemId.value,
      title: planName.value,
      start_open_time: dateValue.value[0],
      end_open_time: dateValue.value[1],
      schoolBuyPlan: tableData.value
    }
  }
  console.log('🚀 ~ file: edit.vue ~ line 175 ~ saveReport ~ obj', obj)
  saveReport(obj).then((res) => {
    if (res.code === 10) {
      emit('back')
    }
  })
}
</script>

<style scoped lang="scss">
.box {
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
    .btn-box {
      display: flex;
      .btn {
        margin-left: 20px;
      }
      .white-btn {
        color: #05c65d;
        background: #f3f3f3;
        border: 1px solid #05c65d;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      }
    }
  }
  .message {
    padding: 10px 30px;
    width: 100%;
    height: 130px;
    background: #fff;
    box-sizing: border-box;
    & > p {
      margin: 10px 0;
      text-align: left;
      :deep(.el-input) {
        width: 300px;
      }
      :deep(.el-date-editor) {
        width: 300px;
      }
    }
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 32px;
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    & > span {
      font-size: 18px;
      color: #848484;
    }
    .select-box {
      width: 300px;
      :deep(.el-input) {
        line-height: normal;
        .el-input-group__append {
          padding: 0 8px;
          background: #05c65d;
          color: #ffffff;
        }
      }
    }
  }

  :deep(.el-table) {
    margin-top: 0px;
    .my-checkbox-box {
      display: flex;
      justify-content: center;
      align-items: center;
      .my-input {
        width: 80px;
        height: 30px;
        border: 1px solid #05c65d;
        border-radius: 2px;
        color: #05c65d;
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

input[type='checkbox'] {
  cursor: pointer;
  position: relative;
  width: 16px;
  height: 16px;
  font-size: 14px;
}

input[type='checkbox']::after {
  position: absolute;
  top: 0;
  color: #000;
  width: 16px;
  height: 16px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 3px;
}

input[type='checkbox']:checked::after {
  content: ' ';
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  background: #fff url('../../../../assets/images/common/check.png');
  background-size: cover;
}
</style>
