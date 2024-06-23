<template>
  <header>
    <div class="fl">
      仪器管理
      <el-icon><arrow-right /></el-icon>
      <span>入库记录</span>
      <el-icon><arrow-right /></el-icon>
      <span>详情</span>
    </div>
  </header>
  <div class="sel-box">
    <div class="operation">
      <span>入库详情</span>
      <div class="button-box">
        <!-- <div class="btn green-btn" @click="popState = true">+ 新增区域</div> -->
        <div class="btn white-btn" @click="pageRetuen">
          <img src="@assets/images/laboratory-standard/cancel.png" alt="" />
          返回
        </div>
      </div>
    </div>
    <div class="screen1">
      <div class="sel-l">
        <div class="sel-item">
          <span>来源:</span>
          <div class="sel">
            {{ ['未知', '集采', '自制', '馈赠', '自购', '调拨'][props.source] }}
          </div>
        </div>
        <div class="sel-item">
          <span>凭证号:</span>
          <div class="sel">
            {{ props.voucher_number }}
          </div>
        </div>
        <div class="sel-item">
          <span>采购批次:</span>
          <div class="sel">
            {{ props.bacth }}
          </div>
        </div>
        <div class="sel-item">
          <span>入库批次:</span>
          <div class="sel">
            {{ props.wholesale_purchase }}
          </div>
        </div>
      </div>
    </div>
    <div class="screen">
      <div class="sel-l">
        <div class="sel-item">
          <span>厂家:</span>
          <div class="sel">
            {{ props.factory }}
          </div>
        </div>
        <div class="sel-item">
          <span>联系方式:</span>
          <div class="sel">
            {{ props.factory_mobile }}
          </div>
        </div>
        <div class="sel-item">
          <span>入库时间:</span>
          <div class="sel">
            {{ props.create_time.slice(0, 10) }}
          </div>
        </div>
        <div class="sel-item">
          <span>学科:</span>
          <div class="sel">
            {{ ['全部', '物理', '化学', '生物'][subject_id] }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="content">
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="60" align="left" min-width="5"></el-table-column>
      <el-table-column label="分类编号" prop="number" align="left" min-width="20"></el-table-column>
      <el-table-column label="学校编号" prop="asset_number" width="120" align="left"></el-table-column>
      <el-table-column label="名称" prop="name" align="left" min-width="20" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="规格型号"
        prop="specification"
        align="left"
        min-width="20"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="单位" prop="unit" align="left" min-width="20" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="保质期/年"
        prop="number_year"
        align="left"
        min-width="20"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="单价/元" prop="unit_price" align="left" min-width="20"></el-table-column>
      <el-table-column label="位置" prop="school_laboratory_name" align="left" show-overflow-tooltip min-width="20">
        <template #default="scope">
          <span>
            {{
              scope.row.school_laboratory_name +
              (scope.row.store_name !== '' ? '/' + scope.row.store_name : '') +
              (scope.row.number_plies !== 0 ? '/第' + scope.row.number_plies + '层' : '')
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" prop="total" align="left" min-width="20"></el-table-column>
    </el-table>
  </div>
  <!-- <footer>
    <el-pagination
      v-model:currentPage="baseObj.page"
      :page-size="10"
      @current-change="handleCurrentChange"
      background
      layout="total, prev, pager, next, jumper"
      :total="requestData.total"
    ></el-pagination>
  </footer> -->
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

// import { BaseFilter } from '@/components/base-filter'
// import { ConfigDataType } from '@/components/base-filter/src/types'

import { useStore } from '@store/index'

import { equipmentRecordDetail } from '@service/instrument-manage/batch-instrument-warehouse'
// import { BatchWarehousingList } from '@service/instrument-manage/batch-instrument-warehouse/types'
// import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
let props = defineProps({
  bacth: { type: String, required: true },
  source: { type: String, required: true },
  voucher_number: { type: String, required: true },
  wholesale_purchase: { type: String, required: true },
  factory: { type: String, required: true },
  factory_mobile: { type: String, required: true },
  create_time: { type: String, required: true }
})
const baseObj: any = ref({})
const tableData: any = ref([])
let route = useRoute()
let router = useRouter()

let emit = defineEmits(['back'])
const pageRetuen = () => {
  emit('back')
}
console.log(route.params)
// baseObj.value = route.params
// if (!route.params.bacth) {
//   pageRetuen()
// }

const store = useStore()

const subject_id = ref(0)
subject_id.value = store.state.login.userInfo.subject_id
const numData = ref({
  type: 0,
  num: 0
})
const getTableData = () => {
  equipmentRecordDetail({ wholesale_purchase: props.wholesale_purchase }).then((res: any) => {
    console.log('入库记录详情', res)
    tableData.value = res.data.data
    numData.value.type = res.data.category
    numData.value.num = res.data.total
  })
}
getTableData()
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  & > div {
    display: flex;
    align-items: center;
  }
}
.content {
  width: 100%;
  .recommend {
    margin: 10px 0;
    padding: 0 30px;
    width: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .filter-box {
      padding: 15px 0;
      width: 90%;
    }
    .select-box {
      margin-right: 30px;
      width: 300px;
      :deep(.el-input) {
        line-height: normal;
        .el-input-group__append {
          padding: 0 8px;
          background: #05c65d;
          color: #ffffff;
        }
      }
      img {
        padding: 6px;
        position: absolute;
        top: 1px;
        right: 0;
        width: 28px;
        height: 28px;
        background: #05c65d;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
  .top-list-box {
    display: flex;
    flex-wrap: wrap;
    .top-item {
      margin: 0 2% 10px 0;
      padding: 16px 24px;
      width: 12%;
      height: 140px;
      text-align: left;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 0px 10px 10px 10px;
      box-sizing: border-box;
      p {
        height: 40px;
      }
      .item-name {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #05c65d;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .item-introduction {
        display: flex;
        align-items: center;
        span:nth-of-type(1) {
          display: inline-block;
          width: 50px;
          color: #848484;
        }
        span:nth-of-type(2) {
          display: inline-block;
          width: 80px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .top-item:hover {
      background: #d9d9d9;
    }
  }
  .detail_body {
    margin-bottom: 20px;
  }
  .pagination-block {
    margin: 20px 0;
    height: 40px;
    text-align: right;
  }
  .details_footer {
    div {
      margin-top: 20px;
    }
  }
  .laboratory-name {
    padding-left: 30px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 20px;
    color: #05c65d;
    background: #dcece3;
    box-sizing: border-box;
  }
  :deep(.el-table) {
    select {
      width: 100%;
      height: 30px;
      line-height: 30px;
      border: 1px solid #c9c7c7;
      border-radius: 2px;
      text-align: center;
      color: #05c65d;
      option {
        text-align: left;
        color: #333333;
      }
    }
    input {
      width: 90px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #c9c7c7;
      border-radius: 2px;
      text-align: center;
      color: #05c65d;
    }
    .long-input {
      width: 130px;
      text-align: left;
    }
    .short-input {
      width: 60px;
    }
    .teacher-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        margin-left: 6px;
        cursor: pointer;
      }
    }
  }
  .message-box {
    position: relative;
    width: 49%;
    background: #ffffff;
    border-radius: 0px 10px 10px 10px;
    float: left;
    .header {
      margin: 30px 0;
      span {
        display: inline-block;
        margin-right: 8px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        color: #ffffff;
        background: #05c65d;
        border-radius: 50%;
      }
    }
    .header::before {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      width: 0;
      height: 0;
      border-top: 100px #05c65d solid;
      border-right: 100px transparent solid;
    }
    .rule-form {
      text-align: left;
      :deep(.el-input) {
        width: 80%;
        .el-input__inner {
          width: 100%;
        }
      }
      :deep(.el-select) {
        width: 80%;
        .el-input {
          width: 100%;
          .el-input__inner {
            width: 100%;
            height: 30px !important;
          }
        }
      }

      .use-year {
        :deep(.el-input) {
          width: 60%;
          .el-input__inner {
            width: 100%;
          }
        }
        :deep(.el-select) {
          margin-left: 2%;
          width: 18%;
          .el-input {
            width: 100%;
            .el-input__inner {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .message-box:nth-of-type(1) {
    margin-right: 2%;
  }
}
footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  p {
    margin-left: 40px;
  }
}
// .btn {
//   width: 100px;
//   height: 36px;
//   line-height: 36px;
//   background: #05c65d;
//   color: #ffffff;
//   box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
//   opacity: 1;
//   border-radius: 10px;
//   text-align: center;
//   cursor: pointer;
// }
.white-btn {
  color: #05c65d;
  border: 0px;
  background-color: #dcece3;
}
.green {
  color: #05c65d !important;
  cursor: pointer;
}
.red {
  color: #de4747 !important;
}
.detail_title {
  height: 40px;
  line-height: 40px;
  span {
    margin: 20px;
  }
}
.sel-box {
  margin-bottom: 12px;
  width: 100%;
  min-height: 120px;

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

  .screen1 {
    display: flex;
    min-height: 60px;
    width: 100%;
    background-color: #fff;
    clear: both;

    .sel-l {
      flex: 4;
      display: flex;

      .sel-item {
        flex: 1;
        margin-top: 16px;
        display: flex;
        justify-content: space-between;

        & > span {
          width: 20%;
          height: 30px;
          line-height: 30px;
          text-align: right;
          color: #848484;
        }

        .sel {
          margin-right: 10%;
          width: 60%;
          min-height: 30px;
          line-height: 30px;
          text-align: left;
          word-break: break-all;
        }
      }
    }

    .sel-r {
      flex: 1;

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
      .button-box {
        div {
          margin-right: 30px;
          float: right;
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
  .screen {
    display: flex;
    min-height: 60px;
    width: 100%;
    background-color: #fff;
    clear: both;

    .sel-l {
      flex: 4;
      display: flex;

      .sel-item {
        flex: 1;
        margin-top: 16px;
        display: flex;
        justify-content: space-between;

        & > span {
          width: 20%;
          height: 30px;
          line-height: 30px;
          text-align: right;
          color: #848484;
        }

        .sel {
          margin-right: 10%;
          width: 60%;
          min-height: 30px;
          line-height: 30px;
          text-align: left;
          word-break: break-all;
        }
      }
    }

    .sel-r {
      flex: 1;

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
      .button-box {
        div {
          margin-right: 30px;
          float: right;
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
}
.el-input {
  line-height: 30px;
}
.el-cascader {
  width: 100%;
}
.type-div {
  margin-bottom: 10px;
  height: 36px;
  line-height: 36px;
  text-align: left;
  span {
    color: #05c65d;
  }
}
</style>
