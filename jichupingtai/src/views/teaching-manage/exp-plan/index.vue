<template>
  <header>
    <span>教学管理 > 系统计划模版</span>
  </header>
  <main>
    <div class="sel-box" v-if="listShow">
      <div class="operation">
        <span>系统计划模版</span>
        <div class="button-box">
          <!-- <div class="sel-item">
            <span>范围筛选：</span>
            <el-date-picker
              type="daterange"
              size="small"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
            />
          </div> -->
          <div class="btn green-btn" @click="downloadExcel()">下载模版</div>

          <el-upload
            :show-file-list="false"
            class="upload-demo"
            action=""
            :auto-upload="false"
            :multiple="false"
            :on-change="uploadChange"
            accept=".xls,.xlsx"
          >
            <div class="btn green-btn">导入</div>
          </el-upload>
          <div class="btn green-btn" @click="addPlan()">+ 新建系统计划模版</div>
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出账号
          </div> -->
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>学科:</span>
            <div class="sel">
              <el-select v-model="searchFrom.subject_id" class="m-2" placeholder="全部" @change="getData" clearable>
                <el-option
                  v-for="item in optionsSubject"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>年级:</span>
            <div class="sel">
              <el-select v-model="searchFrom.grade" class="m-2" placeholder="全部" @change="getData" clearable>
                <el-option
                  v-for="item in optionsGrade"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>状态:</span>
            <div class="sel">
              <el-select v-model="searchFrom.is_show" class="m-2" placeholder="全部" @change="getData" clearable>
                <el-option
                  v-for="item in optionsStatus"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>学期:</span>
            <div class="sel">
              <el-select v-model="searchFrom.semester" class="m-2" placeholder="全部" @change="getData" clearable>
                <el-option
                  v-for="item in optionsSemester"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>版本:</span>
            <div class="sel">
              <el-select v-model="searchFrom.versions" class="m-2" placeholder="全部" @change="getData" clearable>
                <el-option
                  v-for="item in optionsVersions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>编辑人:</span>
            <div class="sel">
              <el-select v-model="searchFrom.user_id" class="m-2" placeholder="全部" @change="getData" clearable>
                <el-option
                  v-for="item in optionsPeople"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input placeholder="搜索计划" v-model="searchFrom.name" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="getData">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#C2E3D1', padding: '12px 0' }"
          :cell-style="{ padding: '12px 0' }"
        >
          <el-table-column type="index" label="序号" min-width="30"></el-table-column>
          <el-table-column prop="name" label="实验计划名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="grade" label="年级" show-overflow-tooltip align="left">
            <template #default="scope">
              {{ store.state.common.gradeArr[scope.row.grade] }}
            </template>
          </el-table-column>
          <el-table-column prop="subject" label="学科" show-overflow-tooltip></el-table-column>
          <el-table-column prop="semester" label="学期" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.semester === 1 ? '第一学期' : '第二学期' }}
            </template>
          </el-table-column>
          <el-table-column prop="version_id" label="版本" show-overflow-tooltip>
            <template #default="scope">
              {{ eduList.find((e) => e.id - scope.row.version_id === 0)?.name }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="status" label="状态" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="username" label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="is_show" label="展示" show-overflow-tooltip align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.is_show"
                :active-value="1"
                :inactive-value="2"
                @change="changeShow(scope.row.id, scope.row.is_show)"
              />
            </template>
          </el-table-column>
          <el-table-column property="" label="操作" width="120" align="center">
            <template #default="scope">
              <div class="click-box">
                <span @click="getDetail(scope.row.id)">详情</span>
                <span class="font-red" @click="delItem(scope.row.id)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <ExperimentPlan v-if="!listShow" :propItem="propItem" :type="status" @back="back" />
  </main>
  <footer></footer>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { expPlanList, delExpPlan, updatePlanIsshow, importPlan } from '@service/teaching/base'
import { getSchoolUser } from '@service/login/login'

import ExperimentPlan from './ExperimentPlan.vue'

import { useStore } from '@store/index'

const store = useStore()

let subjectList = store.state.common.subjectList
console.log('🚀 ~ file: index.vue ~ line 192 ~ subjectList', subjectList)
const eduList = [
  {
    id: 1,
    name: '苏教版',
    status: 0
  },
  {
    id: 2,
    name: '人教版',
    status: 0
  },
  {
    id: 3,
    name: '沪教版',
    status: 0
  }
]
const dataMap = reactive({
  searchFrom: {
    subject_id: '',
    grade: '',
    is_show: '',
    semester: '',
    versions: '',
    user_id: '',
    name: '',
    is_recommend: 1
  },
  tableData: Array<any>(),
  propItem: { id: 0 },
  status: '',
  listShow: true,
  optionsSubject: Array<{ name: string; id: number }>(),
  optionsGrade: Array<{ name: string; value: number }>(),
  optionsPeople: Array<{ username: string; id: number }>()
})
const { searchFrom, tableData, propItem, status, listShow, optionsSubject, optionsGrade, optionsPeople } =
  toRefs(dataMap)

optionsSubject.value = store.state.common.subjectList
optionsGrade.value = store.state.common.gradeArr.map((e, i) => {
  return {
    name: e,
    value: i
  }
})
optionsGrade.value.splice(0, 1)
getSchoolUser({ role_id: '102,103' }).then((res) => {
  optionsPeople.value = res.data
  console.log(res.data)
})

const getData = () => {
  expPlanList({ ...searchFrom.value }).then((res) => {
    if (res.code === 10) {
      tableData.value = res.data
      console.log('🚀 ~ file: index.vue ~ line 222 ~ expPlanList ~ tableData.value', tableData.value)
    }
  })
}
getData()

const changeShow = (id: number, type: any) => {
  updatePlanIsshow({ id, is_show: type }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '更改成功'
      })
      getData()
    }
  })
  console.log('🚀 ~ file: index.vue ~ line 167 ~ changeShow ~ id', id, type)
}

const uploadChange = (file: any) => {
  let formData = new FormData()
  formData.append('file', file.raw)
  importPlan(formData).then((res) => {
    // if (res.code === 10) {
    getData()
    // }
  })
}

const downloadExcel = () => {
  window.open(process.env.VUE_APP_BASE_URL + '/template/实验计划列表导入模版.xlsx')
}

const addPlan = (id?: number) => {
  listShow.value = false
  status.value = 'add'
  console.log('🚀 ~ file: index.vue ~ line 224 ~ addPlan ~ id', id)
}
const getDetail = (id: number) => {
  propItem.value.id = id
  status.value = 'detail'
  listShow.value = false
}
const back = () => {
  listShow.value = true
  propItem.value.id = 0
  getData()
}
const delItem = (id: number) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delExpPlan({ id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getData()
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

const optionsStatus = [
  {
    name: '已展示',
    value: '1'
  },
  {
    name: '未展示',
    value: '2'
  }
]
const optionsSemester = [
  {
    name: '第一学期',
    value: '1'
  },
  {
    name: '第二学期',
    value: '2'
  }
]
const optionsVersions = [
  {
    name: '人教版',
    value: '1'
  },
  {
    name: '苏教版',
    value: '2'
  }
]
</script>

<style scoped lang="scss">
header {
  height: 30px;
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}
.form-box {
  & > div {
    min-height: 30px;
    line-height: 30px;
    text-align: left;
    overflow: hidden;
    & > span {
      height: 100%;
    }
  }
}
main {
  width: 100%;
  .sel-box {
    margin-bottom: 20px;
    width: 100%;
    .operation {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 1px 3px 6px rgba(0, 0, 0, 0.16);
      & > span {
        float: left;
        margin-left: 1.8%;
        font-size: 20px;
        color: #05c65d;
        font-weight: bold;
      }
      .button-box {
        display: flex;
        justify-content: space-between;
        & > div {
          margin-left: 20px;
          margin-right: 20px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          img {
            margin-right: 4px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .screen {
      padding: 6px 0;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.16);
      box-sizing: border-box;
      overflow: hidden;
      .sel-l {
        float: left;
        width: 80%;
        .sel-item {
          float: left;
          margin: 8px 0;
          width: 25%;
          display: flex;
          justify-content: space-between;
          & > span {
            float: left;
            width: 30%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #848484;
          }
          .sel {
            float: left;
            margin-right: 10%;
            width: 60%;
          }
        }
      }
      .sel-r {
        float: left;
        width: 20%;
        .mt-4 {
          margin: 8px auto;
          width: calc(100% - 40px);
          .ser-icon {
            padding: 0 10px;
            cursor: pointer;
            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
    .table-box {
      margin-top: 20px;
      input {
        width: 90%;
        height: 30px;
        line-height: 30px;
        border: 1px solid #c9c7c7;
        border-radius: 2px;
        text-align: center;
        color: #05c65d;
      }
      .click-box {
        display: flex;
        justify-content: space-between;
        color: #05c65d;
        & > span {
          cursor: pointer;
        }
      }
    }
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
</style>
