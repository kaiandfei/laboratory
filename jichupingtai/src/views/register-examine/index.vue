<template>
  <div class="container">
    <header>账号审核 > 注册审核</header>
    <div class="search">
      <div class="title">注册审核</div>
      <div class="form">
        <el-form :model="form" :inline="true" label-width="60px">
          <el-form-item label="角色">
            <el-select v-model="form.role_id" placeholder="请选择角色" @change="getTableData" clearable>
              <el-option v-for="(item, index) in ROLENAMEOPTION" :key="index" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-select v-model="form.xu" placeholder="请选择年级" @change="getTableData" clearable>
              <el-option :value="null" label="全部"></el-option>
              <el-option v-for="(item, index) in gradeOption" :key="index" :label="item.name" :value="item.xu" />
            </el-select>
          </el-form-item>
          <el-form-item label="学科">
            <el-select v-model="form.subject_id" placeholder="请选择学科" @change="getTableData" clearable>
              <el-option :value="null" label="全部"></el-option>
              <el-option v-for="(item, index) in options_subject" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择当前状态" @change="getTableData">
              <el-option v-for="(item, index) in statusOption" :key="index" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="right mt-4">
          <el-input v-model="form.search" placeholder="请输入老师姓名、账号或手机号" clearable>
            <template #append>
              <div class="ser-icon" @click="search">
                <img src="@assets/images/account-school/search.png" alt="" />
              </div>
            </template>
          </el-input>
          <!-- <div class="btn green-btn" @click="search">查询</div> -->
        </div>
      </div>
    </div>
    <div class="center">
      <span>当前申请加入{{ total }}人</span>
      <div class="btns">
        <div class="btn green-btn" @click="handlePass('all')">一键通过</div>
        <div class="btn white-btn" @click="handleRefuse('all')">一键拒绝</div>
      </div>
    </div>
    <div class="table">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        stripe
        v-loading="loading"
        element-loading-text="加载中..."
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" :selectable="enableSelect" width="55" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :property="item.prop"
          :label="item.label"
          :sortable="item.sortable"
          align="left"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="当前状态">
          <template #default="scope">
            <span :style="{ color: scope.row.status === 1 ? '#05c65d' : scope.row.status === 2 ? '' : 'red' }">
              {{ scope.row.status === 1 ? '通过' : scope.row.status === 2 ? '待审核' : '审核不通过' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div v-if="scope.row.status === 2" class="btns">
              <span class="btn green-btn psss" @click="handlePass('one', scope.row)">通过</span>
              <span class="btn white-btn refuse" @click="handleRefuse('one', scope.row)">拒绝</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[100, 200, 300, 400]"
        :small="small"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogVisible" title="注册审核" :close-on-click-modal="false" width="40%">
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="审核结果" prop="examineResult">
          <el-radio-group v-model="dialogForm.examineResult" disabled>
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="3">拒绝</el-radio>
          </el-radio-group>
          <span style="color: red" v-if="dialogForm.examineResult !== 3">（可至教师管理中完善信息）</span>
        </el-form-item>
        <el-form-item label="审核意见" prop="examineTake">
          <el-input
            v-model="dialogForm.examineTake"
            type="textarea"
            placeholder="请输入审核意见"
            show-word-limit
            maxlength="20"
          />
        </el-form-item>
      </el-form>
      <div class="btns">
        <div class="btn green-btn" :class="submitLoading ? 'isDisabled' : ''" @click="submitDialogForm(dialogFormRef)">
          确认
        </div>
        <div class="btn white-btn" @click="cancel(dialogFormRef)">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { registerExamineList, updateUserStatus } from '@/service/register-examine/index'
import { ElTable } from 'element-plus'
import type { ElForm } from 'element-plus'
import { ref, reactive } from 'vue'
import { ROLENAMEOPTION } from '@/contants/index'
import { getGradeList } from '@service/grade/index'
import { getSubjectList } from '@service/subject/index'
import { useStore } from '@store/index'
import { ElMessage } from 'element-plus'
const store = useStore()
const loginMsg = JSON.parse(JSON.stringify(store.state.login.userInfo))
const form = reactive({
  role_id: '',
  xu: '',
  search: '',
  subject_id: '',
  status: '1,2'
})
const columns = ref([
  {
    label: '教师账号',
    prop: 'login_name',
    sortable: 'custom'
  },
  {
    label: '姓名',
    prop: 'username'
  },
  {
    label: '申请角色',
    prop: 'role_names'
  },
  {
    label: '手机号',
    prop: 'phone',
    sortable: 'custom'
  },
  {
    label: '学科',
    prop: 'subject_name'
  },
  {
    label: '执教年级',
    prop: 'gradename'
  },
  {
    label: '申请时间',
    prop: 'create_time',
    sortable: 'custom'
  }
])
const statusOption = ref([
  {
    label: '全部',
    id: '1,2'
  },
  {
    label: '审核通过',
    id: '1'
  },
  {
    label: '待审核',
    id: '2'
  }
  // {
  //   label: '审核不通过',
  //   id: 3
  // }
])
// const gradeOption = gradeArr
const gradeOption: any = ref([])
const getschoolgrade = () => {
  getGradeList({ school_id: loginMsg.school_id }).then((res) => {
    if (res.code === 10) {
      gradeOption.value = res.data
    }
  })
}
getschoolgrade()
const options_subject: any = ref()
const getSubjectoptions = () => {
  getSubjectList().then((res) => {
    console.log(12312)

    options_subject.value = res.data
  })
}
getSubjectoptions()

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])

const handleSelectionChange = (val: any) => {
  console.log('153', val)
  multipleSelection.value = val
}
const enableSelect = (row: any) => {
  if (row.status === 1) {
    return false
  } else {
    return true
  }
}
const currentPage = ref(1)
const pageSize = ref(100)
const total = ref(0)
const small = ref(true)
const loading = ref(false)
const tableData = ref([])
let sortData: any = reactive({})
const sortChange = ({ column, prop, order }: obj) => {
  sortData = {}
  if (prop !== null) {
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    getTableData()
    // console.log(column, prop, order)
  }
}
//获取列表
const getTableData = async () => {
  loading.value = true
  try {
    let params = {
      limit: pageSize.value,
      page: currentPage.value,
      role_id: form.role_id,
      xu: form.xu,
      subject_id: form.subject_id,
      username: form.search,
      status: form.status,
      school_id: loginMsg.role_id === 102 ? null : loginMsg.school_id
    }
    params = { ...params, ...sortData }
    const { data, code } = await registerExamineList(params)
    if (code === 10) {
      tableData.value = data.data
      total.value = data.total
      console.log('registerExamineList', data)
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
    throw new Error('error')
  }
}
getTableData()
//搜索
const search = () => {
  currentPage.value = 1
  getTableData()
}
//当前页展示数据条数
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getTableData()
  console.log(`${val} items per page`)
}
//当前页数据
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getTableData()
  console.log(`current page: ${val}`)
}

type obj = {
  column: any
  prop: number
  order: string
}

interface RuleForm {
  examineResult: number
  examineTake: string
}
const dialogFormRef = ref<InstanceType<typeof ElForm>>()
const dialogVisible = ref(false)
const rules = reactive({
  examineResult: [{ required: true, message: '请选择审核结果', trigger: 'blur' }]
})
const dialogForm = reactive<RuleForm>({
  examineResult: 1,
  examineTake: ''
})
const rowItem: any = ref({})
//通过
const handlePass = async (val: string, row: any = {}) => {
  if (val === 'all') {
    if (multipleSelection.value.length === 0) {
      ElMessage({
        type: 'warning',
        message: '审核不能为空'
      })
      return
    }
  } else {
    multipleSelection.value = []
    rowItem.value = row
  }
  dialogVisible.value = true
  dialogForm.examineResult = 1
}
//拒绝
const handleRefuse = async (val: string, row: any = {}) => {
  if (val === 'all') {
    if (multipleSelection.value.length === 0) {
      ElMessage({
        type: 'warning',
        message: '审核不能为空'
      })
      return
    }
  } else {
    multipleSelection.value = []
    rowItem.value = row
  }
  dialogVisible.value = true
  dialogForm.examineResult = 3
}
let submitLoading = ref(false)
const submitDialogForm = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      submitLoading.value = true
      try {
        let params: any = {
          id: [],
          status: dialogForm.examineResult,
          msg: dialogForm.examineTake
        }
        if (multipleSelection.value.length !== 0) {
          multipleSelection.value.forEach((item: any) => {
            params.id.push(item.id)
          })
        } else {
          params.id.push(rowItem.value.id)
        }
        console.log(1212, params)
        const { code } = await updateUserStatus(params)
        if (code === 10) {
          // console.log('updateUserStatus', data)
          dialogVisible.value = false
          getTableData()
          setTimeout(() => {
            submitLoading.value = false
          }, 1000)
        } else {
          setTimeout(() => {
            submitLoading.value = false
          }, 1000)
        }
      } catch (error) {
        setTimeout(() => {
          submitLoading.value = false
        }, 1000)
        dialogVisible.value = false
        console.log(230, error)
        throw new Error('error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const cancel = (formEl: InstanceType<typeof ElForm> | undefined) => {
  dialogVisible.value = false
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.isDisabled {
  pointer-events: none;
}

.container {
  text-align: left;

  header {
    height: 30px;
  }

  .search {
    .title {
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #dcece3;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      padding-left: 1.8%;
      font-size: 20px;
      color: #05c65d;
      font-weight: bold;
    }

    .form {
      height: 60px;
      line-height: 60px;
      // width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .el-form {
        display: flex;

        .el-form-item {
          margin-bottom: 0;
        }
      }

      .right {
        width: 300px;
        display: flex;
        margin-right: 20px;

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

  .center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    margin-top: 10px;

    span {
      font-size: 20px;
    }
  }

  .table {
    .el-pagination {
      text-align: right;
      margin-top: 20px;
    }

    .psss,
    .refuse {
      display: inline-block;
      width: 60px;
    }
  }
}

.btns {
  display: flex;
  justify-content: center;
}

.btn {
  width: 80px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  padding: 0;
  margin-left: 10px;
}

::v-deep .el-form-item__content {
  text-align: left;
}

::v-deep .el-dialog__header {
  text-align: left;
  border-bottom: 1px solid #05c65d;

  .el-dialog__title {
    color: #05c65d;
  }
}
::v-deep .el-pagination .btn-prev {
  padding-right: 0;
  margin: 0 3px;
}
::v-deep .el-pagination .btn-next {
  padding-left: 0;
  margin: 0 3px;
}
::v-deep .el-pager {
  position: relative;
  bottom: 1px;
}
</style>
