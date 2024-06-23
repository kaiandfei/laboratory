<template>
  <header>
    <span>教学管理 > 系统推荐课程</span>
  </header>
  <main>
    <div class="sel-box" v-show="!detailShow && !addshow">
      <div class="operation">
        <span>系统推荐课程</span>
        <div class="button-box1">
          <div class="btn green-btn" @click="downloadExp()">下载模版</div>

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
          <div class="btn green-btn" @click="addExp()">+ 新建系统推荐课程</div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>学科:</span>
            <div class="sel">
              <el-select v-model="searchFrom.c_subject_id" class="m-2" placeholder="全部" @change="getData" clearable>
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
            <span>专题:</span>
            <div class="sel">
              <el-input
                placeholder="请输入专题"
                v-model="searchFrom.topic_true_id"
                @change="getData"
                class="m-2"
              ></el-input>
            </div>
          </div>

          <div class="sel-item">
            <span>编辑人:</span>
            <div class="sel">
              <el-select v-model="searchFrom.member_id" class="m-2" placeholder="全部" @change="getData" clearable>
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
            <el-input
              placeholder="输入实验名搜索"
              v-model="searchFrom.name"
              @keydown.enter="getData"
              class="input-with-select"
            >
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
          <el-table-column type="index" label="序号" min-width="30" align="left"></el-table-column>
          <el-table-column prop="name" label="实验名称" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column prop="grade" label="年级" show-overflow-tooltip align="left">
            <template #default="scope">
              {{ store.state.common.gradeArr[scope.row.grade] }}
            </template>
          </el-table-column>
          <el-table-column prop="subject_names" label="学科" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column prop="topic_true_id" label="专题" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column prop="" label="类别" show-overflow-tooltip align="left">
            <template #default="scope">
              {{ store.state.common.groupTypeList[scope.row.type - 1] }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="is_show" label="状态" show-overflow-tooltip align="left">
            <template #default="scope">
              {{ scope.row.is_show === 1 ? '已展示' : '未展示' }}
            </template>
          </el-table-column> -->

          <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip align="left">
            <template #default="scope">
              {{ scope.row.create_time ? scope.row.create_time.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="更新人" show-overflow-tooltip align="left">
            <template #default="scope">
              {{ scope.row.update_name || '/' }}
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="修改时间" show-overflow-tooltip align="left"></el-table-column>

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
          <el-table-column property="" align="center" label="操作" width="120">
            <template #default="scope">
              <div class="click-box">
                <span @click="getDetail(scope.row)">详情</span>
                <span class="font-red" @click="delItem(scope.row.id)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="pageCount"
          @current-change="handleCurrentChange"
          :page-size="10"
          background
          layout="total, prev, pager, next"
          :total="total"
        />
      </div>
    </div>
    <AddExperment v-if="addshow" :item_id="detailItem.id" @jumpTo="jumpTo" @back="addshow = false" />
    <Detail v-if="detailShow" :item="detailItem" @back="back" />
  </main>
  <footer></footer>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { getExpList, updateIsshow, deleteExperiment, importExp } from '@service/teaching/base'
import { getSchoolUser } from '@service/login/login'

import { ElMessage, ElMessageBox } from 'element-plus'
import Detail from './Detail.vue'
// import { useRoute } from 'vue-router'
import AddExperment from './AddExperment.vue'
import axios from 'axios'
import localCache from '@/utils/localCache'
import { useStore } from '@store/index'
// const route = useRoute()
const store = useStore()

const dataMap = reactive({
  searchFrom: {
    c_subject_id: '',
    grade: '',
    is_show: '',
    topic_true_id: '',
    member_id: '',
    name: '',
    is_recommend: 1
  },
  tableData: Array<any>(),
  pageCount: 1,
  total: 0,
  addshow: false,
  detailShow: false,
  detailItem: { id: 0 },
  optionsSubject: Array<{ name: string; id: number }>(),
  optionsGrade: Array<{ name: string; value: number }>(),
  optionsPeople: Array<{ username: string; id: number }>()
})
const {
  searchFrom,
  tableData,
  pageCount,
  total,
  addshow,
  detailShow,
  detailItem,
  optionsSubject,
  optionsGrade,
  optionsPeople
} = toRefs(dataMap)
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
})

const getData = () => {
  getExpList({ ...searchFrom.value, page: pageCount.value }).then((res: any) => {
    tableData.value = res.data.list
    total.value = res.data.count
  })
}
getData()

const uploadChange = (file: any) => {
  let formData = new FormData()
  formData.append('file', file.raw)
  importExp(formData).then((res) => {
    if (res.code === 10) {
      getData()
    }
  })
}

const downloadExp = () => {
  const token = localCache.getCookie('swr_token')

  axios.post(process.env.VUE_APP_BASE_URL + '/teach/Exp/exportTpl', { token }, { responseType: 'blob' }).then((res) => {
    const blob = new Blob([res.data]) // 处理文档流
    const fileName = '系统推荐课程模版.xlsx'
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

const addExp = (id?: number) => {
  if (id) {
    detailItem.value.id = id
  } else {
    detailItem.value.id = 0
  }
  addshow.value = true
}

// if (route.params.add) {
//   addExp(route.params.item_id as any)
// }

const changeShow = (id: number, type: any) => {
  updateIsshow({ id, is_show: type }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '更改成功'
      })
      getData()
    }
  })
}
const getDetail = (item: any) => {
  detailItem.value = item
  detailShow.value = true
}
const back = (id?: any) => {
  detailShow.value = false
  if (id) {
    addExp(id)
  } else {
    getData()
  }
}
const jumpTo = (id: any) => {
  addshow.value = false
  detailItem.value.id = id
  detailShow.value = true

  console.log('🚀 ~ file: index.vue ~ line 227 ~ jumpTo ~ id', id)
  // detailShow.value = true
}
const delItem = (id: number) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteExperiment({ id }).then((res) => {
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

const handleCurrentChange = (val: number) => {
  console.log('🚀 ~ file: index.vue ~ line 274 ~ handleCurrentChange ~ val', val)
  getData()
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
const optionsSpecial = [
  {
    name: '必修一',
    value: '1'
  },
  {
    name: '七年级',
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
      .button-box1 {
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
            ::v-deep .el-input {
              line-height: 30px;
            }
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
      .el-pagination {
        margin-top: 10px;
        text-align: right;
      }
    }
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
</style>
