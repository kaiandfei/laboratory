<template>
  <div v-for="(item, index) in requestData" :key="index" class="config-require">
    <div class="title">
      <div>
        <span>
          {{ item.phase_study_id !== 0 && item.phase_study_id !== 1 ? phase_study_Name(item.phase_study_id) : '' }}
          {{ subjectName(item.subject_id) }}{{ item.type }}配置要求
        </span>
        <img
          v-show="showDetail[index] === true"
          @click="changeShowDetail(index, false)"
          src="@assets/images/laboratory-standard/up-double.png"
          alt="收起"
        />
        <img
          v-show="showDetail[index] === false"
          @click="changeShowDetail(index, true)"
          src="@assets/images/laboratory-standard/down-double.png"
          alt="展开"
        />
      </div>
      <div>
        <p>
          <span>面积要求：</span>
          <span v-show="editStatus[index] === 0" class="area-text black">{{ item.area }}</span>
          <el-input
            v-show="editStatus[index] === 1"
            v-model="item.area"
            type="number"
            @input="limitLength(item)"
            class="black"
          ></el-input>
          <span>m²</span>
        </p>
        <!-- <img v-show="editStatus[index] === 1" src="@assets/images/laboratory-standard/edit-white.png" alt="" /> -->
        <img
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          v-show="editStatus[index] === 0"
          @click="changeEditStatus(index, 1)"
          src="@assets/images/laboratory-standard/edit.png"
          alt=""
        />
        <span v-show="editStatus[index] === 1" @click="cancelEdit(index, 0)">取消编辑</span>
        <img
          :style="{ visibility: editStatus[index] === 0 ? 'hidden' : 'visible' }"
          src="@assets/images/laboratory-standard/save.png"
          alt=""
          @click="saveItem(item, index)"
        />
        <img
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          src="@assets/images/laboratory-standard/delete-green.png"
          alt=""
          @click="deleteConfig(item.id, index)"
        />
      </div>
    </div>
    <div v-show="showDetail[index] === true" class="content">
      <div class="content-l">
        <el-table
          :data="item.list"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          max-height="600"
        >
          <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
          <el-table-column label="编号" align="left">
            <template #default="scope">
              <span v-show="editStatus[index] === 0">{{ scope.row.instrument_number }}</span>
              <input
                class="table-input"
                v-show="editStatus[index] === 1"
                v-model="scope.row.instrument_number"
                placeholder=""
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" width="160" align="left">
            <template #default="scope">
              <span v-show="editStatus[index] === 0">{{ scope.row.name }}</span>
              <input
                class="table-input long-input"
                v-show="editStatus[index] === 1"
                v-model="scope.row.name"
                placeholder=""
              />
            </template>
          </el-table-column>
          <el-table-column label="参考规格" align="left" show-overflow-tooltip>
            <template #default="scope">
              <span v-show="editStatus[index] === 0">{{ scope.row.specification }}</span>
              <input
                class="table-input long-input"
                v-show="editStatus[index] === 1"
                v-model="scope.row.specification"
                placeholder=""
              />
            </template>
          </el-table-column>
          <el-table-column label="单位" align="left">
            <template #default="scope">
              <span v-show="editStatus[index] === 0">{{ scope.row.unit }}</span>
              <input class="table-input" v-show="editStatus[index] === 1" v-model="scope.row.unit" placeholder="" />
            </template>
          </el-table-column>
          <el-table-column label="配备数量" align="left">
            <el-table-column prop="num" label="Ⅰ类" align="left">
              <template #default="scope">
                <span v-show="editStatus[index] === 0">{{ scope.row.i_level }}</span>
                <input
                  class="table-input"
                  v-show="editStatus[index] === 1"
                  v-model.number="scope.row.i_level"
                  type="number"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column prop="num" label="Ⅱ类" align="left">
              <template #default="scope">
                <span v-show="editStatus[index] === 0">{{ scope.row.ii_level }}</span>
                <input
                  class="table-input"
                  v-show="editStatus[index] === 1"
                  v-model.number="scope.row.ii_level"
                  type="number"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column prop="num" label="Ⅲ类" align="left">
              <template #default="scope">
                <span v-show="editStatus[index] === 0">{{ scope.row.iii_level }}</span>
                <input
                  class="table-input"
                  v-show="editStatus[index] === 1"
                  v-model.number="scope.row.iii_level"
                  type="number"
                  placeholder=""
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180" align="center">
            <template #default="scope">
              <div v-show="editStatus[index] === 1" class="click-box">
                <span v-show="item.list.length > 1" class="click-text" @click="deleteItem(index, scope.$index)">
                  <img src="@assets/images/laboratory-standard/delete.png" alt="" />
                  删除
                </span>
                <span v-show="scope.$index === item.list.length - 1" class="click-text green" @click="addItem(index)">
                  <img src="@assets/images/laboratory-standard/add.png" alt="" />
                  新增
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content-r">
        <p>说明</p>
        <p v-show="editStatus[index] === 0">{{ item.desc }}</p>
        <el-input v-show="editStatus[index] === 1" type="textarea" v-model="item.desc"></el-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, defineProps, toRefs, withDefaults, computed, defineExpose } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import {
  getConfigSetList,
  saveConfiguration,
  delLaboratorySet,
  delConfiguration
} from '@service/laboratory-standard/config-standard/index'
import {
  requestItem,
  RequestData,
  requestListItem,
  RequestDataChildren
} from '@service/laboratory-standard/config-standard/types'

import { useStore } from '@store/index'

const store = useStore()

const props = withDefaults(
  defineProps<{
    selectForm: {
      subject_id: number
      type: number
    }
  }>(),
  {
    selectForm: () => {
      return { subject_id: 0, type: 0 }
    }
  }
)
const { selectForm } = toRefs(props)

const dataMap = reactive({
  subjectArr: [...store.state.common.subjectArr],
  requestData: [requestItem],
  showDetail: [true],
  editStatus: [0],
  deleteList: [Array<RequestDataChildren>()],
  editIndex: -1
})
let { subjectArr, requestData, showDetail, editStatus, deleteList, editIndex } = toRefs(dataMap)

let subjectName = computed(() => {
  return (id: number) => {
    let name = ''
    subjectArr.value.forEach((e) => {
      if (e.id === id) {
        name = e.name
      }
    })
    return name
  }
})
const PHASENAMEARR = ['初中', '高中']
let phase_study_Name = computed(() => {
  return (id: number) => {
    return PHASENAMEARR[id - 2]
  }
})

const limitLength = (item: any) => {
  // console.log('🚀 ~ file: config-require.vue:220 ~ limitLength ~ item:', item)
  let str = item.area.toString()
  console.log('🚀 ~ file: config-require.vue:222 ~ limitLength ~ str:', str)

  let index = str.indexOf('.')
  let isFloat = index !== -1

  if (isFloat && str.length > index + 2 + 1) {
    item.area = str.substring(0, index + 2 + 1)
  }
}

const changeShowDetail = (index: number, type: boolean) => {
  showDetail.value[index] = type
}

const getData = (item: any, type?: number) => {
  if (type === -1) {
    editIndex.value = -1
  }
  getConfigSetList(item).then((res) => {
    if (editIndex.value === -1) {
      showDetail.value = []
      editStatus.value = []
      deleteList.value = []
      requestData.value = []
      requestData.value = res.data
      for (let i = 0; i < res.data.length; i++) {
        showDetail.value.push(true)
        editStatus.value.push(0)
        deleteList.value.push([])
      }
    } else {
      requestData.value.splice(editIndex.value, 1, res.data[editIndex.value])
    }
  })
}
getData(selectForm.value)
defineExpose({ getData })

const saveItem = (item: RequestData, index: number) => {
  editIndex.value = index
  // let arr = Array<RequestDataChildren>()
  // item.list.forEach((e) => {
  //   const obj = {
  //     ...e,
  //     laboratory_template_id: requestData.value[index].id
  //   }
  //   arr.push(obj)
  // })
  deleteList.value[index].forEach((e) => {
    delConfiguration({ id: e.id }).then()
  })
  saveConfiguration({
    area: item.area,
    desc: item.desc,
    id: item.id,
    list: item.list
  }).then((res) => {
    if (res.code === 10) {
      editStatus.value[index] = 0
      deleteList.value[index] = []
      getData(selectForm.value)
    }
  })
}

const deleteConfig = (id: number, index: number) => {
  ElMessageBox.confirm('请问您是否需要删除实验室配置要求? 删除后无法恢复！', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // editIndex.value = -1
      delLaboratorySet({ id: id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: res.msg
          })
          requestData.value.splice(index, 1)
          showDetail.value.splice(index, 1)
          editStatus.value.splice(index, 1)
          deleteList.value.splice(index, 1)
          // getData(selectForm.value)
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

const changeEditStatus = (index: number, type: number) => {
  if (type === 1) {
    showDetail.value[index] = true
  } else if (type === 0) {
    deleteList.value[index] = []
  }
  editStatus.value[index] = type
  if (requestData.value[index].list.length === 0) {
    addItem(index)
  }
}
const cancelEdit = (index: number, type: number) => {
  editStatus.value[index] = type
  getData(selectForm.value, index)
}

const addItem = (index: number) => {
  const obj = {
    ...requestListItem,
    laboratory_template_id: requestData.value[index].id
  }
  requestData.value[index].list.push(obj)
}

const deleteItem = (baseIndex: number, index: number) => {
  if (requestData.value[baseIndex].list[index].id !== 0) {
    deleteList.value[baseIndex].push(requestData.value[baseIndex].list[index])
  }
  requestData.value[baseIndex].list.splice(index, 1)
}
</script>

<style scoped lang="scss">
.config-require {
  margin: 10px 0;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 60px;
  background: #dcece3;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.16);
  span {
    font-size: 20px;
    color: #05c65d;
  }
  div {
    display: flex;
    align-items: center;
    & > span {
      margin: 0 20px;
    }
    p {
      margin-right: 50px;
      span {
        margin: 0 10px;
      }
      :deep(.el-input) {
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 30px;
        .el-input__inner {
          width: 80px;
          text-align: center;
        }
      }
      .area-text {
        display: inline-block;
        min-width: 60px;
        text-align: right;
      }
    }
    img {
      margin-left: 30px;
    }
  }
}
.content {
  position: relative;
  min-height: 300px;
}
.content-l {
  width: 86%;
  .click-box {
    display: flex;
    justify-content: space-around;
    .click-text {
      width: 60px;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        margin-right: 10px;
      }
    }
  }
  span {
    width: 90%;
  }
  .table-input {
    width: 90%;
    height: 30px;
    line-height: 30px;
    border: 1px solid #c9c7c7;
    border-radius: 2px;
    text-align: center;
    option {
      text-align: left;
    }
  }
  .long-input {
    width: 120px;
  }
  :deep(.el-input) {
    width: 100%;
    height: 30px;
    line-height: 30px;
    .el-input__inner {
      width: 100%;
      text-align: center;
    }
  }
  :deep(.el-table) {
    min-height: 300px;
    // height: 30px;
    // padding: 0;
  }
}
.content-r {
  padding-left: 1%;
  width: 14%;
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  height: 100%;
  p:nth-of-type(1) {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    background: #efefef;
  }
  p:nth-of-type(2) {
    padding: 10px 10px;
    text-align: left;
    height: calc(100% - 60px);
    word-wrap: break-word;
    background: #ffffff;
    box-sizing: border-box;
    overflow: scroll;
  }

  :deep(.el-textarea) {
    height: calc(100% - 60px);
    .el-textarea__inner {
      height: 100%;
    }
  }
}
.btn {
  width: 210px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
}
.green {
  color: #05c65d !important;
}
.black {
  color: #333 !important;
}
</style>
