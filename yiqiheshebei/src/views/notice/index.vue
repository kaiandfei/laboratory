<template>
  <div class="container">
    <div class="notic-header">
      <div class="left" v-if="isCheckNotice">通知公告 > 查看通知</div>
      <div class="left" v-else>通知管理 > 通知列表 {{ isAddOrEdit ? '>创建通知' : '' }}</div>
      <div class="form" v-if="!isAddOrEdit && !isCheckNotice">
        <el-input v-model.trim="queryInp" placeholder="请搜索通知标题" clearable />
        <div class="btn green-btn search" @click="search">
          <img src="@/assets/images/notice/search.png" alt="" />
        </div>
      </div>
      <div class="back" @click="back" v-else>
        <img src="@/assets/images/notice/back.png" alt="" />
        返回
      </div>
    </div>
    <div class="notic-main" v-if="!isAddOrEdit && !isCheckNotice">
      <div class="add">
        <span>通知列表</span>
        <div class="btns">
          <div class="btn green-btn btn-edit" @click="createOrEditNotice('add')">新建通知</div>
          <div class="btn white-btn btn-edit" @click="search">刷新</div>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="650px"
          stripe
          v-loading="loading"
          element-loading-text="加载中..."
        >
          <el-table-column type="index" label="序号" align="left" width="50" />
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            width="180"
            align="left"
            :sortable="item.sort"
          />
          <el-table-column label="发布状态" width="180" align="left">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ccc"
                @click="statusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <div class="table-btns">
                <div class="check" @click="checkNoticeinfo(scope.row)">
                  <img src="@/assets/images/notice/check.png" alt="" />
                  <span>查看</span>
                </div>
                <div class="edit" @click="createOrEditNotice('edit', scope.row)">
                  <img src="@/assets/images/notice/edit.png" alt="" />
                  <span>编辑</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" /> -->
    </div>
    <add-or-edit
      v-if="isAddOrEdit"
      @back="back"
      :detailNotice="detailNotice"
      :isEdit="isEdit"
      :editId="editId"
    ></add-or-edit>
    <checkNotice v-if="isCheckNotice" :detailNotice="detailNotice" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { noticeList, noticeDetail, releaseStatus } from '@/service/noticeApi'
import AddOrEdit from './components/addOrEdit.vue'
import checkNotice from './components/check-notice.vue'
import { ElMessage } from 'element-plus'
const queryInp = ref('')
const columns = [
  {
    prop: 'title',
    label: '通知标题'
  },
  {
    prop: 'create_user',
    label: '作者'
  },
  {
    prop: 'create_time',
    label: '发布时间',
    sort: true
  }
]
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(400)
const loading = ref(false)
const isCheckNotice = ref(false)
//获取列表
const getTableData = async () => {
  loading.value = true
  try {
    let params = {
      limit: 20,
      // status: 2,
      title: queryInp.value
    }
    const { data, code } = await noticeList(params)
    if (code === 10) {
      loading.value = false
      data.data.forEach((item: any) => {
        item.status = item.status === 1 ? true : false
      })
      tableData.value = data.data
      // console.log('noticeList', data)
    } else {
      loading.value = false
    }
  } catch (error) {
    loading.value = false
    console.log(error)
    throw new Error('error')
  }
}
getTableData()
//搜索
const search = () => {
  // currentPage.value = 1
  getTableData()
}
//修改状态
const statusChange = async (val: any) => {
  console.log('129', val)
  try {
    let params = {
      id: val.id,
      status: val.status ? 1 : 2
    }
    const { code } = await releaseStatus(params)
    if (code === 10) {
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      getTableData()
    }
  } catch (error) {
    console.log(error)
    throw new Error('error')
  }
}
// //当前页展示数据条数
// const handleSizeChange = (val: number) => {
//   pageSize.value = val
//   getTableData()
//   console.log(`${val} items per page`)
// }
// //当前页数据
// const handleCurrentChange = (val: number) => {
//   currentPage.value = val
//   getTableData()
//   console.log(`current page: ${val}`)
// }
//获取详情数据
const detailNotice = ref({})
const getDetail = async (id: number) => {
  detailNotice.value = {}
  try {
    let params = {
      id
    }
    const { data, code } = await noticeDetail(params)
    if (code === 10) {
      detailNotice.value = data
      console.log('noticeDetail', data)
    }
  } catch (error) {
    console.log(error)
    throw new Error('error')
  }
}
const isAddOrEdit = ref(false)
const isEdit = ref(false)
const editId = ref('')
//展示列表页还是编辑或新增
// const toggleMain = () => {
//   isAddOrEdit.value = !isAddOrEdit.value
// }
//去新建或去编辑
const createOrEditNotice = async (value: string, row: any = {}) => {
  isAddOrEdit.value = !isAddOrEdit.value
  if (value === 'add') {
    isEdit.value = false
    detailNotice.value = {
      title: '',
      create_user: '',
      content: ''
    }
    console.log('去新建')
  } else {
    isEdit.value = true
    editId.value = row.id
    // detailNotice.value = row
    await getDetail(row.id)
    console.log('去编辑')
  }
}
const checkNoticeinfo = async (row: any) => {
  isCheckNotice.value = true
  await getDetail(row.id)
}
const back = () => {
  isAddOrEdit.value = false
  isCheckNotice.value = false
  search()
}
</script>

<style lang="scss" scoped>
.container {
  .notic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .form {
      display: flex;
      align-items: center;
    }
  }

  .notic-main {
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    background-color: #fff;
  }

  .add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #dcece3;

    span {
      font-size: 20px;
      font-weight: bold;
      color: #05c65d;
      margin-left: 20px;
    }

    .btns {
      display: flex;
    }

    .btn-edit {
      width: 80px;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 20px;
    }
  }

  .el-pagination {
    text-align: right;
    padding: 20px;
    box-sizing: border-box;
  }
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
}

.table-btns {
  display: flex;
  align-items: center;
  justify-content: center;

  .check,
  .edit {
    display: flex;
    align-items: center;
    margin: 0 10px;
    cursor: pointer;

    img {
      width: 20px;
      height: 20px;
    }
  }
}

.back {
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
</style>
