<template>
  <header>
    <span>参考标准 > 仪器设备参考标准</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>仪器设备参考标准</span>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>省:</span>
            <div class="sel">
              <el-select v-model="area1" class="m-2" placeholder="请选择" @change="areaChange1">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options1" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>市:</span>
            <div class="sel">
              <el-select v-model="area2" class="m-2" placeholder="请选择" @change="areaChange2">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>区域:</span>
            <div class="sel">
              <el-select v-model="area3" class="m-2" placeholder="请选择" @change="areaChange3">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options3" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      stripe
      style="width: 100%"
      @current-change="handleSelectionChange"
      @select-all="selChangeAll"
    >
      <!-- <el-table-column align="left" type="selection" width="30" /> -->
      <el-table-column align="left" type="index" label="序号" width="100" />
      <el-table-column align="left" property="date" label="区域" min-width="20">
        <template #default="props">
          <span>{{ props.row.pname ? props.row.pname + '-' : '' }}{{ props.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="仪器设备参考标准">
        <el-table-column align="left" property="address" label="省级标准" min-width="20">
          <template #default="props">
            <div class="point" style="height: 20px; width: 100%" @click="change(props.row.id, 1)">
              <img v-show="props.row.instrument_standard === 1" src="@assets/images/common/right-green.png" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="市级标准" min-width="20">
          <template #default="props">
            <div class="point" style="height: 20px; width: 100%" @click="change(props.row.id, 2)">
              <img v-show="props.row.instrument_standard === 2" src="@assets/images/common/right-green.png" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="区县级标准" min-width="20">
          <template #default="props">
            <div class="point" style="height: 20px; width: 100%" @click="change(props.row.id, 3)">
              <img v-show="props.row.instrument_standard === 3" src="@assets/images/common/right-green.png" alt="" />
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <el-pagination
      v-model:currentPage="currentPage3"
      v-model:page-size="pageSize3"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="fromData.dataTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import type { ElTable } from 'element-plus'
import { getAreaPage, changeStandard, findArea } from '@service/area/index'
const getFindArea = (val: number, id: any, sel: any) => {
  findArea({ area_level: val, p_id: id }).then((res) => {
    console.log(res)
    if (sel === 1) {
      options1.value = res.data
    } else if (sel === 2) {
      options2.value = res.data
    } else if (sel === 3) {
      options3.value = res.data
    }
  })
}
getFindArea(1, 0, 1)

const area1 = ref('')
const options1: any = ref([])
const areaChange1 = () => {
  area2.value = ''
  area3.value = ''
  fromData.pageData.city = ''
  fromData.pageData.area = ''
  fromData.pageData.pro = area1.value
  if (area1.value === '') {
    fromData.pageData.area_level = 1
    options2.value = []
    options3.value = []
  } else {
    fromData.pageData.area_level = 2
    getFindArea(2, area1.value, 2)
    options3.value = []
  }

  getArea()
}
const areaChange2 = () => {
  console.log(area1.value)
  area3.value = ''
  fromData.pageData.city = area2.value
  fromData.pageData.area = ''

  if (area2.value === '') {
    options3.value = []
    fromData.pageData.area_level = 2
  } else {
    fromData.pageData.area_level = 3
    getFindArea(3, area2.value, 3)
  }
  getArea()
}
const areaChange3 = () => {
  fromData.pageData.area = area3.value
  getArea()
}
const area2 = ref('')
const options2: any = ref([])
const area3 = ref('')
const options3: any = ref([])
const value = ref('')
// const input1 = ref('')

const fromData: any = reactive({
  dataTotal: 0,
  pageData: {
    limit: 10,
    page: 1,
    area_level: '1',
    pro: '',
    city: '',
    area: ''
  }
})
const tableData: any = ref([])
const getArea = () => {
  getAreaPage(fromData.pageData).then((res) => {
    tableData.value = res.data.data
    fromData.dataTotal = res.data.total
  })
}
getArea()
const change = (id: any, instrument_standard: any) => {
  changeStandard({ id, instrument_standard }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
      getArea()
    }
  })
}
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  }
]

// 表格相关
interface User {
  date: string
  name: string
  address: string
}
// const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// const multipleSelection = ref<User[]>([])
// const tableData: User[] = [
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-02',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-02',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   }
// ]
const handleSelectionChange = (val: any) => {
  console.log(val)
  // multipleSelection.value = val
}
const selChange = (selection: any, row: any) => {
  console.log(selection)
  console.log(row)
}
const selChangeAll = (selection: any) => {
  console.log(JSON.parse(JSON.stringify(selection)))
}
// 分页
const currentPage3 = ref(1)
const pageSize3 = ref(10)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  fromData.pageData.page = val
  getArea()
}
// 操作
// const rePassword = (val: any) => {
//   console.log(val)
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
  .sel-box {
    margin-bottom: 20px;
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
::v-deep .el-table .el-table__row .el-table__cell {
  padding: 12px 0;
}
</style>
