<template>
  <header>
    <span>操作日志 > 日志列表</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>日志列表</span>
        <div class="button-box">
          <!-- <div class="btn green-btn" @click="add">新增</div> -->
        </div>
      </div>
      <div class="search-box">
        <div class="item">
          <span>用户</span>
          <el-input v-model="searchForm.user_name" placeholder="请输入用户" @change="regetData" />
        </div>
        <div class="item">
          <span>ip</span>
          <el-input v-model="searchForm.ip" placeholder="请输入ip" @change="regetData" />
        </div>
        <div class="item">
          <span>操作内容</span>
          <el-input v-model="searchForm.msg" placeholder="请输入操作内容" @change="regetData" />
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        :header-cell-style="{ background: '#C2E3D1', padding: '12px 0' }"
      >
        <el-table-column type="index" label="序号" min-width="5" align="left"></el-table-column>
        <el-table-column property="" label="用户" align="left" width="160">
          <template #default="scope">
            <div>
              <span>{{ scope.row.user_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="ip" label="ip" align="left" width="160"></el-table-column>
        <el-table-column property="url" label="url" align="left"></el-table-column>

        <el-table-column property="msg" label="操作内容" align="left"></el-table-column>
        <el-table-column property="" label="操作时间" align="left">
          <template #default="scope">
            <div>
              <span>{{ scope.row.create_time || '' }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.qname" /> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-model:current-page="page"
      background
      layout="total, prev, pager, next, jumper"
      :default-page-size="limit"
      :total="total"
      @current-change="pageChange"
    />
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import { ElMessageBox, ElMessage } from 'element-plus'
import { getPageData } from '@service/user-log'

import type { ElTable } from 'element-plus'

let tableData = ref<Array<any>>([])
let page = ref(1)
let total = ref(0)
let limit = ref(10)
let searchForm = ref({
  user_name: '',
  ip: '',
  msg: ''
})

const getData = () => {
  getPageData({ page: page.value, limit: limit.value, ...searchForm.value }).then((res) => {
    console.log('🚀 ~ file: index.vue:64 ~ getPageData ~ res:', res)
    tableData.value = res.data.data
    total.value = res.data.total
  })
}

getData()

const regetData = () => {
  page.value = 1
  getData()
}

const pageChange = () => {
  getData()
}

// const clickItem = (id: number, index: number) => {
//   console.log('🚀 ~ file: index.vue:76 ~ clickItem ~ id:', id, index)
// }
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
  overflow: hidden;

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
  }
  .search-box {
    display: flex;
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    padding: 12px 0;
    .item {
      display: flex;
      align-items: center;
      span {
        margin-right: 4px;
        width: 100px;
        color: #848484;
        text-align: right;
      }
      span::after {
        content: '：';
      }
      :deep(.el-input) {
        width: 12vw;
      }
    }
  }

  .sel-r {
    .mt-4 {
      margin: 0 auto 15px;

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
  .click-text {
    cursor: pointer;
  }
  .click-text:hover {
    text-decoration: underline;
  }
}
.click-box {
  display: flex;
  justify-content: space-around;
  color: #05c65d;
  & > span {
    cursor: pointer;
  }
}

::v-deep .el-table .el-table__row .el-table__cell {
  padding: 12px 0;
}
.el-pagination {
  margin-top: 10px;
  text-align: right;
}

.btn-box {
  display: flex;
  justify-content: center;

  .btn {
    margin: 0 30px;
  }
}

.remove {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.isDisabled {
  pointer-events: none;
}
.detail-labor {
  ::v-deep .el-input__inner {
    border: none;
    box-shadow: none;
    color: #606266;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    padding-left: 0;
  }
  ::v-deep .el-input__suffix {
    display: none;
  }
}
</style>
<style>
.el-message-box__header {
  border-bottom: #05c65d 1px solid;
  text-align: center;
}
.no-data-box {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #909399;
}
</style>
