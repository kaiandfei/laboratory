<template>
  <div class="container">
    <div class="notic-header">
      <div class="left" v-if="isCheckNotice">通知公告 > 查看通知</div>
      <div class="left" v-else>
        通知管理 > 通知列表 {{ isAddOrEdit ? '>创建通知' : '' }}
      </div>
      <div class="form" v-if="!isAddOrEdit && !isCheckNotice">
        <el-input v-model.trim="queryInp" placeholder="请搜索通知标题" />
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
          <div class="btn green-btn btn-edit" @click="createOrEditNotice('add')">
            +新建通知
          </div>
          <div class="btn white-btn btn-edit" @click="search">刷新</div>
        </div>
      </div>
      <div class="table">
        <com-table
          ref="table"
          :column="noticeConfigData"
          stripe
          index
          isLoading
          isPage
          :maxHeight="'550px'"
          :params.sync="params"
          :total.sync="total"
          :getTableList="getNoticeList"
          :format="format"
          @sortChange="sortChange"
        >
          <template v-slot:option="slot">
            <div class="table-btns">
              <div class="check" @click="checkNoticeinfo(slot.data)">
                <img src="@/assets/images/notice/check.png" alt="" />
                <span>查看</span>
              </div>
              <div class="edit" @click="createOrEditNotice('edit', slot.data)">
                <img src="@/assets/images/notice/edit.png" alt="" />
                <span>编辑</span>
              </div>
            </div>
          </template>
        </com-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
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

<script>
import { debounce } from '@/utils/debounce'
import { noticeList, noticeDetail, updateSeeCount } from '@/network/notice'
import AddOrEdit from './components/addOrEdit.vue'
import checkNotice from './components/check-notice.vue'
import { noticeTableConfig } from '@/tableConfig/index'
export default {
  components: {
    AddOrEdit,
    checkNotice,
  },
  computed: {
    noticeConfigData() {
      return noticeTableConfig
    },
    getNoticeList() {
      return noticeList
    },
    params() {
      return {
        page: this.currentPage,
        limit: this.pageSize,
        title: this.queryInp,
        ...this.sortData,
      }
    },
  },
  data() {
    return {
      queryInp: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isCheckNotice: false,
      detailNotice: {},
      isAddOrEdit: false,
      isEdit: false,
      editId: '',
      sortData: {},
    }
  },
  methods: {
    format(data) {
      let resData = data.map((item) => {
        item.status = item.status === 1 ? true : false
        return item
      })
      return resData
    },
    getTableData() {
      this.$nextTick(() => {
        this.$refs.table.getTableData()
      })
    },
    sortChange({ prop, order }) {
      if (prop !== null) {
        this.sortData = {}
        if (order === 'descending') {
          this.sortData[`order_${prop}`] = 2
        } else {
          this.sortData[`order_${prop}`] = 1
        }
        this.getTableData()
      }
    },
    //当前页展示数据条数
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableData()
    },
    //当前页数据
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
    },
    search() {
      this.currentPage = 1
      this.getTableData()
    },
    async getDetail(id) {
      this.detailNotice = {}
      try {
        let params = {
          id,
        }
        const { data, code } = await noticeDetail(params)
        if (code === 10) {
          this.detailNotice = data
          console.log('noticeDetail', data)
        }
      } catch (error) {
        console.log(error)
        throw new Error('error')
      }
    },
    async updateSeeCount(id) {
      try {
        let params = {
          id,
        }
        await updateSeeCount(params)
      } catch (error) {
        console.log(error)
        throw new Error('error')
      }
    },
    //去新建或去编辑
    async createOrEditNotice(value, row = {}) {
      if (value === 'add') {
        this.isEdit = false
        this.detailNotice = {
          title: '',
          create_user: '',
          content: '',
        }
        console.log('去新建')
      } else {
        await this.getDetail(row.id)
        this.isEdit = true
        this.editId = row.id
        console.log('去编辑')
      }
      this.isAddOrEdit = !this.isAddOrEdit
    },
    checkNoticeinfo: debounce(async function (row) {
      await this.getDetail(row.id)
      await this.updateSeeCount(row.id)
      setTimeout(() => {
        console.log('1231')
        this.isCheckNotice = true
      }, 100)
    }, 500),
    back() {
      this.isAddOrEdit = false
      this.isCheckNotice = false
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .notic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .form {
      position: relative;
      left: 10px;
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
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);

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
  position: relative;
  left: -10px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
}

.table-btns {
  display: flex;
  align-items: center;
  justify-content: left;

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
  .check {
    margin: 0 10px 0 0;
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
::v-deep .el-table th {
  background-color: #fff !important;
  color: black;
}
::v-deep .el-table td {
  border-bottom: 1px solid #ebeef5 !important;
}
::v-deep .el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5 !important;
}
::v-deep .el-input .el-input__inner {
  width: 100% !important;
}
</style>
