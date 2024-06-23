<template>
  <div>
    <div class="title">
      <div class="text-box">
        <p>
          适用学段：
          <span>{{ props.item?.learning_info[0]?.title }}</span>
        </p>
        <p>
          轨数：
          <span>{{ props.item?.rail_min }}~{{ props.item?.rail_max }}轨</span>
        </p>
      </div>
      <div class="btn-box">
        <p v-show="editStatus === 1" class="btn btn-gray" @click="changeEditStatus(0)">取消编辑</p>
        <p
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          v-show="editStatus === 0"
          class="btn btn-white"
          @click="changeEditStatus(1)"
        >
          编辑
        </p>
        <p v-show="editStatus === 1" class="btn" @click="sureClick">保存</p>
      </div>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
      >
        <el-table-column prop="scope" label="学科" width="200" align="left">
          <template #default="scope">
            <span v-show="editStatus === 0">
              {{ scope.row.subject_info ? scope.row.subject_info.name : '' }}
            </span>
            <select
              class="table-input"
              v-show="editStatus === 1"
              v-model="scope.row.subject_info.id"
              placeholder="学科"
            >
              <option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></option>
            </select>
          </template>
        </el-table-column>
        <el-table-column label="Ⅰ类" align="left">
          <template #default="scope">
            <span v-show="editStatus === 0">{{ scope.row.i_level }}</span>
            <input
              class="table-input"
              v-show="editStatus === 1"
              v-model="scope.row.i_level"
              @input="inputAdjust"
              placeholder=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="" label="Ⅱ类" align="left">
          <template #default="scope">
            <span v-show="editStatus === 0">{{ scope.row.ii_level }}</span>
            <input
              class="table-input"
              v-show="editStatus === 1"
              @input="inputAdjust"
              v-model="scope.row.ii_level"
              placeholder=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="" label="Ⅲ类" align="left">
          <template #default="scope">
            <span v-show="editStatus === 0">{{ scope.row.iii_level }}</span>
            <input
              class="table-input"
              v-show="editStatus === 1"
              @input="inputAdjust"
              v-model="scope.row.iii_level"
              placeholder=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="" label="其他" align="left">
          <template #default="scope">
            <span v-show="editStatus === 0">{{ scope.row.other_level }}</span>
            <input
              class="table-input"
              v-show="editStatus === 1"
              v-model="scope.row.other_level"
              @input="inputAdjust"
              placeholder=""
            />
          </template>
        </el-table-column>
        <el-table-column v-if="editStatus === 1" prop="" label="操作" width="400" align="center">
          <template #default="scope">
            <div class="click-box">
              <span v-show="tableData.length > 1" class="click-text" @click="deleteItem(scope.$index)">
                <img src="@assets/images/laboratory-standard/delete.png" alt="" />
                删除
              </span>
              <span v-show="scope.$index === tableData.length - 1" class="click-text green" @click="addItem()">
                <img src="@assets/images/laboratory-standard/add.png" alt="" />
                新增
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive, toRefs } from 'vue'

import { ElMessage } from 'element-plus'

import { tracksDetail, editTracks } from '@service/laboratory-standard/equipped-standard/index'
import { TracksDetailData, TracksDetailRequest } from '@service/laboratory-standard/equipped-standard/types'
import { useStore } from '@store/index'

import { inputAdjust } from '@/utils/common'

const props = defineProps({ item: Object })
const store = useStore()
let options = [...store.state.common.subjectArr]

console.log(props.item)

let dataMap = reactive({
  tableData: [TracksDetailData]
})

let { tableData } = toRefs(dataMap)
tableData.value = []

const getDetail = () => {
  tracksDetail({
    rail_id: props.item?.id
  }).then((res) => {
    tableData.value = res.data
    // tableData.value.forEach((e) => {
    //   e.subject_id = e.subject_info ? (e.subject_info[0] ? e.subject_info[0].id : 1) : 1
    // })
  })
}
getDetail()

let editStatus = ref(0)
const changeEditStatus = (type: number) => {
  editStatus.value = type
  if (type === 0) {
    getDetail()
  }
  if (tableData.value.length === 0) {
    addItem()
  }
}

const sureClick = () => {
  if (tableData.value.some((e) => e.subject_info?.id === 0)) {
    ElMessage({
      type: 'error',
      message: '请为新增行选择学科'
    })
  } else {
    tableData.value.forEach((e, i) => {
      let index = deleteList.findIndex((m) => m.subject_info?.id === e.subject_info?.id)
      if (index !== -1) {
        tableData.value[i] = { ...e, id: deleteList[index].id }
        deleteList.splice(index, 1)
      }
    })
    let arr = JSON.parse(JSON.stringify(tableData.value.concat(deleteList)))
    arr.forEach((e: typeof TracksDetailData) => {
      e.subject_id = e.subject_info?.id
      delete e.subject_info
    })
    editTracks({
      data: arr
    }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: '保存成功'
        })
        editStatus.value = 0
        getDetail()
      }
    })
  }
}

const addItem = () => {
  const newLine = JSON.parse(JSON.stringify(TracksDetailData))
  newLine.rail_id = props.item?.id
  tableData.value.push(newLine)
}

let deleteList: Array<TracksDetailRequest> = reactive([])
const deleteItem = (index: number) => {
  if ('id' in tableData.value[index]) {
    tableData.value[index].is_del = 0
    deleteList.push(tableData.value[index])
  }
  tableData.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  box-sizing: border-box;
  background: #dcece3;
  .text-box {
    display: flex;
    color: #05c65d;
    p {
      margin-right: 80px;
    }
  }
  .btn-box {
    width: 200px;
    display: flex;
    justify-content: space-between;
  }
}
.content {
  margin-top: 20px;
  .click-box {
    display: flex;
    justify-content: space-evenly;
    .click-text {
      display: flex;
      align-items: center;
      margin: 0 20px;
      cursor: pointer;
      img {
        margin-right: 10px;
      }
    }
  }
  span {
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
  }
  .table-input {
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #c9c7c7;
    border-radius: 2px;
    text-align: center;
    option {
      text-align: left;
    }
  }
}
.btn {
  width: 78px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.btn-white {
  color: #05c65d;
  border: 1px solid #05c65d;
  background: #f3f3f3;
}
.btn-gray {
  color: #fff;
  border: 1px solid #b5b5b5;
  background: #b5b5b5;
}
.green {
  color: #05c65d;
}
.yellow {
  color: #ec8c42;
}
</style>
