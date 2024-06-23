<template>
  <header>
    <span>教务管理 > 学生管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>学生管理</span>
        <div class="button-box">
          <div class="btn green-btn" @click="popState = true">+ 添加学生</div>
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出教师
          </div> -->
          <div class="btn white-btn" @click="exportdata()">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出账号
          </div>
          <div class="btn white-btn" @click="uploadExcel()">
            <img src="@assets/images/account-school/imp.png" alt="" />
            导入账号
          </div>
          <input type="file" name="file" id="uploadExcel" @change="changeExcel()" style="display: none" />

          <div class="btn white-btn" @click="downloadTemplate('/swrserveadmin/Student/downloadtplSchool')">
            <img src="@assets/images/account-school/imp.png" alt="" />
            下载模板
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>年级:</span>
            <div class="sel">
              <el-select v-model="pagedata.grade_id" class="m-2" placeholder="请选择" @change="grade_Change">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in optionGrade_page"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>班级:</span>
            <div class="sel">
              <el-select v-model="pagedata.class_id" class="m-2" placeholder="请选择" @change="class_Change">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in optionClass_page"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="pagedata.name" placeholder="输入关键字" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="getStudentList()">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="del-res">
      <span>当前共查询到</span>
      <span class="green-t">{{ total }}</span>
      <span>名学生</span>
      <div class="btn green-btn" @click="delStu(delIds)">
        <img src="@assets/images/account-school/w-del.png" alt="" />
        批量删除
      </div>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      stripe
      style="width: 100%"
      @select-all="selChange"
      @select="selChange"
      @sort-change="sortChange"
    >
      <el-table-column align="left" type="selection" width="30" />
      <el-table-column align="left" type="index" label="序号" min-width="5" />
      <el-table-column align="left" property="number" label="学号" min-width="15" sortable="custom" />
      <el-table-column align="left" property="name" label="姓名" min-width="15" />
      <el-table-column align="left" property="grade_name" label="年级" min-width="15" sortable="custom" />
      <el-table-column align="left" property="class_name" label="班级" min-width="15" sortable="custom" />
      <el-table-column align="center" property="address" label="操作" min-width="20">
        <template #default="props">
          <div class="operation-box">
            <div @click="edit(props.row.id)">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>编辑</span>
            </div>
            <!-- <div @click="rePassword(props)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div> -->
            <div @click="delAccountSingle(props.row)">
              <img src="@assets/images/common/del-red.png" alt="" />
              <span>删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <el-pagination
      v-model:currentPage="pagedata.page"
      v-model:page-size="pagedata.limit"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
  <el-dialog v-model="dialogVisible" title="删除学生" width="30%">
    <p class="dialog_P">
      <span>学号：</span>
      {{ singleData.data.number }}
    </p>
    <p class="dialog_P">
      <span>姓名：</span>
      {{ singleData.data.name }}
    </p>
    <p class="dialog_P">
      <span>年级：</span>
      {{ singleData.data.schoolGrade?.name }}
    </p>
    <p class="dialog_P">
      <span>班级：</span>
      {{ singleData.data.schoolClass?.name }}
    </p>
    <p class="err_tip">提示！请确认学生已不在学校中再进行操作，操作后数据不可恢复！</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="delsingleSure()">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>添加学生</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学号:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="fromData.number" placeholder="请输入学号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            姓名:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="fromData.name" placeholder="请输入姓名"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            年级:
          </span>
          <div class="w-300 fl mr-70">
            <el-select
              v-model="fromData.grade_id"
              class="m-2"
              placeholder="请选择"
              @change="Change1(fromData.grade_id)"
            >
              <el-option v-for="item in optionGrade" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            班级:
          </span>
          <div class="w-300 fl mr-70">
            <el-select v-model="fromData.class_id" class="m-2" placeholder="请选择">
              <el-option v-for="item in optionClass" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>编辑学生</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学号:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="editFrom.number" placeholder="请输入学号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            姓名:
          </span>
          <div class="w-300 fl">
            <el-input v-model="editFrom.name" placeholder="请输入学号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            年级:
          </span>
          <div class="w-300 fl mr-70">
            <el-select
              v-model="editFrom.grade_id"
              class="m-2"
              placeholder="请选择"
              @change="Change1(editFrom.grade_id)"
            >
              <el-option v-for="item in optionGrade" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            班级:
          </span>
          <div class="w-300 fl mr-70">
            <el-select v-model="editFrom.class_id" class="m-2" placeholder="请选择">
              <el-option v-for="item in optionClass" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="editsave">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState1 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getStudent, delStudent, saveStudent, editStudent, uplodeStudent } from '@service/student/index'
import { getGradeList } from '@service/grade/index'
import { getSchoolGradeClass } from '@service/school-class/index'

import { PopCurrency } from '@components/pop-currency'
import { useStore } from '@/store'
import { BASE_URL } from '@service/request/config'
import localCache from '@/utils/localCache'
import axios from 'axios'
const store = useStore()
const loginMsg = JSON.parse(JSON.stringify(store.state.login.userInfo))

const popState = ref(false)
const popState1 = ref(false)
const optionGrade: any = ref([])
const optionGrade_page: any = ref([])
const getschoolgrade = () => {
  getGradeList({ school_id: loginMsg.school_id }).then((res) => {
    if (res.code === 10) {
      optionGrade.value = res.data
      optionGrade_page.value = res.data
    }
  })
}
getschoolgrade()
const tableData: any = ref([])
let pagedata = reactive({
  page: 1,
  limit: 10,
  class_id: null,
  name: '',
  grade_id: null
})
const total = ref(1)
let sortData: any = reactive({})
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    getStudentList()
    console.log(column, prop, order)
  }
}
const getStudentList = () => {
  let params = { ...pagedata, ...sortData }
  getStudent(params).then((res) => {
    console.log(res)
    tableData.value = res.data.data
    total.value = res.data.total
  })
}
getStudentList()
const optionClass_page: any = ref([])
const grade_Change = () => {
  pagedata.class_id = null
  getStudentList()
  getSchoolGradeClass({ grade_id: pagedata.grade_id }).then((res) => {
    if (res.code === 10) {
      optionClass_page.value = res.data
    }
  })
}
const class_Change = () => {
  getStudentList()
}
const dialogVisible = ref(false)
const singleData = reactive({ data: {} as any })
// 删除单个
const delAccountSingle = (row: any) => {
  dialogVisible.value = true
  singleData.data = row
  console.log(singleData.data)
}
const delsingleSure = () => {
  delStudent({ id: singleData.data.id }).then((res) => {
    console.log(res)
    if (res.code === 10) {
      dialogVisible.value = false
      getStudentList()
      ElMessage({
        type: 'success',
        message: '删除成功!'
      })
    } else {
      ElMessage({
        type: 'error',
        message: '删除失败!'
      })
    }
  })
}
// 删除批量
const delStu = (id: any) => {
  if (Array.isArray(id) && !id.length) {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据'
    })
  } else {
    ElMessageBox.confirm('确认删除当前学生!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        delStudent({ id: id }).then((res) => {
          console.log(res)
          getStudentList()
          if (res.code === 10) {
            ElMessage({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}
const optionClass: any = ref([])
const Change1 = (grade_id: any) => {
  fromData.class_id = ''
  editFrom.value.class_id = ''
  getSchoolGradeClass({ grade_id: grade_id }).then((res) => {
    if (res.code === 10) {
      optionClass.value = res.data
    }
  })
}

const fromData: any = reactive({
  number: '',
  name: '',
  class_id: '',
  grade_id: null,
  school_code: loginMsg.school_code,
  school_id: loginMsg.school_id
})
const editFrom: any = ref({
  number: '',
  name: '',
  class_id: '',
  grade_id: null,
  school_code: loginMsg.school_code,
  school_id: loginMsg.school_id
})
// 初始化
const newForm = () => {
  fromData.number = ''
  fromData.name = ''
  fromData.class_id = ''
  fromData.grade_id = null
  fromData.school_code = loginMsg.school_code
  fromData.school_id = loginMsg.school_id
}
const newEdit = () => {
  editFrom.value.number = ''
  editFrom.value.name = ''
  editFrom.value.class_id = ''
  editFrom.value.grade_id = null
  editFrom.value.school_code = loginMsg.school_code
  editFrom.value.school_id = loginMsg.school_id
}
const save = () => {
  saveStudent(fromData).then((res) => {
    if (res.code === 10) {
      popState.value = false
      getStudentList()
      ElMessage({
        type: 'success',
        message: '添加成功!'
      })
      newForm()
    }
  })
}
const editsave = () => {
  popState1.value = false
  saveStudent(editFrom.value).then((res) => {
    if (res.code === 10) {
      getStudentList()
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
      newEdit()
    }
  })
}

const edit = (id: number) => {
  popState1.value = true

  editStudent({ id: id })
    .then((res) => {
      editFrom.value = res.data[0]
    })
    .then(() => {
      getSchoolGradeClass({ grade_id: editFrom.value.grade_id }).then((res1) => {
        if (res1.code === 10) {
          optionClass.value = res1.data
        }
      })
    })
}
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  pagedata.page = val
  getStudentList()
}

const downloadTemplate = (url: any) => {
  window.location.href = BASE_URL + url
}
const uploadExcel = () => {
  let filedom: any = document.getElementById('uploadExcel')
  filedom.value = ''
  filedom.click()
}
const exportdata = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(BASE_URL + '/swrserveadmin/Student/exportStudent', { ...pagedata, token }, { responseType: 'blob' })
    .then((res) => {
      const blob = new Blob([res.data]) //处理文档流
      const fileName = '导出账号.xlsx'
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
const changeExcel = () => {
  let fileObj: any = (document.getElementById('uploadExcel') as any).files[0]
  let formdata = new FormData()
  formdata.append('file', fileObj)
  formdata.append('school_id', loginMsg.school_id)
  uplodeStudent(formdata).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      getStudentList()
      ElMessage({
        type: 'success',
        message: '导入成功!'
      })
    }
  })
}
const delIds: any = ref([])
const selChange = (selection: any) => {
  selection = selection.map((item: any) => item.id)
  delIds.value = selection
  console.log(selection)
}
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
main {
  width: 100%;
  .sel-box {
    width: 100%;
    height: 120px;
    .operation {
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
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
        div {
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
      height: 60px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;
      .sel-l {
        float: left;
        width: 80%;
        .sel-item {
          float: left;
          margin-top: 16px;
          width: 25%;
          display: flex;
          justify-content: space-between;
          & > span {
            float: left;
            width: 20%;
            height: 30px;
            line-height: 30px;
            text-align: right;
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
          margin: 16px auto;
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
  }
  .del-res {
    margin-top: 10px;
    height: 56px;
    span {
      float: left;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      color: #404040;
    }
    .green-t {
      padding: 0 8px;
      color: #05c65d;
    }
    & > div {
      float: right;
      margin: 10px 20px 0 0;
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
.operation-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      margin-right: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
.form-box {
  & > div {
    height: 32px;
    line-height: 32px;
  }
}
.dialog_P {
  margin: 0 auto;
  width: 60%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  span {
    display: inline-block;
    width: 120px;
    text-align: left;
  }
}
.err_tip {
  margin: 20px 10% 0;
  width: 80%;
  text-align: left;
  color: rgb(189, 0, 0);
}
</style>
