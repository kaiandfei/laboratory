<template>
  <header>
    <div class="fl">
      设备管理
      <el-icon><arrow-right /></el-icon>
      <span>设备批量入库</span>
    </div>
  </header>
  <div class="content">
    <div class="recommend">
      <div class="filter-box">
        <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
      </div>
      <div class="select-box">
        <el-input type="text" placeholder="搜索" v-model="selectObj.keyword">
          <template #append>
            <el-button type="primary" @click="getData">
              <el-icon>
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="top-list-box">
      <div
        class="top-item"
        v-for="(item, index) in requestData.data"
        :key="index"
        :title="'点击新增'"
        @click="addTable(item)"
      >
        <p class="item-name">{{ item.name }}</p>
        <p class="item-introduction">
          <span>规格：</span>
          <span>{{ item.specification }}</span>
        </p>
        <p class="item-introduction">
          <span>编号：</span>
          <span>{{ item.number }}</span>
        </p>
      </div>
    </div>
    <div class="pagination-block">
      <el-pagination
        v-model:currentPage="selectObj.page"
        :page-size="7"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="requestData.total"
      ></el-pagination>
    </div>
    <div class="room_sel">
      <span class="is-must-div">实验室：</span>
      <el-select
        :disabled="!editStatus"
        v-model="batchAll.laboratory_id"
        @change="getStoreData(batchAll.laboratory_id)"
      >
        <el-option v-for="(e, index) in optionsLaboratory" :key="index" :label="e.title" :value="e.id"></el-option>
      </el-select>
      <span v-show="batchAll.laboratory_id !== ''">仪器柜：</span>
      <el-select
        :disabled="!editStatus"
        v-show="batchAll.laboratory_id !== ''"
        v-model="batchAll.store_id"
        @change="setPlies"
        clearable
      >
        <el-option v-for="(e, i) in storeListBody" :key="i" :label="e.title" :value="e.id"></el-option>
      </el-select>
      <span v-show="batchAll.store_id !== ''">层数：</span>
      <el-select :disabled="!editStatus" v-show="batchAll.store_id !== ''" v-model="batchAll.number_plies" clearable>
        <el-option v-for="(e, i) in optionPliesBody" :key="i" :label="e.name" :value="e.value"></el-option>
      </el-select>
      <vue3-json-excel
        :json-data="[{}]"
        :fields="fields"
        :name="store.state.login.userInfo.school.name + '_批量设备入库导入表'"
        header="请如实填写相关信息"
      >
        <div class="btn">下载导入模版</div>
      </vue3-json-excel>
      <el-upload :show-file-list="false" class="upload-demo" action="" :auto-upload="false" :on-change="uploadChange">
        <div class="btn">导入数据</div>
      </el-upload>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="分类编号" prop="number" align="left" width="90"></el-table-column>
      <el-table-column label-class-name="is-must" width="200" label="资产编号" align="left">
        <template #default="scope">
          <el-input v-show="editStatus" class="short-input1" maxlength="25" v-model="scope.row.asset_number" />
          <!-- <input v-show="editStatus" v-model="scope.row.asset_number" /> -->
          <span v-show="!editStatus">{{ scope.row.asset_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="规格型号"
        prop="specification"
        align="left"
        show-overflow-tooltip
        width="180"
      ></el-table-column>
      <el-table-column label="单位" prop="unit" width="50" align="left"></el-table-column>
      <!-- <el-table-column label-class-name="is-must" label="标准分类" align="left">
        <template #default="scope">
          <select v-model="scope.row.level" :disabled="!editStatus">
            <option v-for="item in optionCome1" :key="item.value" :label="item.name" :value="item.value"></option>
          </select>
        </template>
      </el-table-column> -->
      <el-table-column label-class-name="is-must" label="来源" width="90" align="left">
        <template #default="scope">
          <select v-model="scope.row.source" :disabled="!editStatus">
            <option v-for="item in optionCome" :key="item.value" :label="item.name" :value="item.value"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label-class-name="is-must" label="凭证号" prop="" width="120" align="left">
        <template #default="scope">
          <input v-show="editStatus" v-model="scope.row.voucher_number" />
          <span v-show="!editStatus">{{ scope.row.voucher_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label-class-name="is-must" label="采购批次" prop="" width="120" align="left">
        <template #default="scope">
          <input v-show="editStatus" v-model="scope.row.bacth" />
          <span v-show="!editStatus">{{ scope.row.bacth }}</span>
        </template>
      </el-table-column>
      <el-table-column label-class-name="is-must" label="厂家" prop="" width="120" align="left">
        <template #default="scope">
          <input v-show="editStatus" v-model="scope.row.factory" />
          <span v-show="!editStatus">{{ scope.row.factory }}</span>
        </template>
      </el-table-column>
      <el-table-column label-class-name="is-must" label="单价" prop="" width="200" align="left">
        <template #default="scope">
          <input v-show="editStatus" class="short-input" v-model="scope.row.unit_price" />
          <span v-show="!editStatus">{{ scope.row.unit_price }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="实验室" align="left" width="120">
        <template #default="scope">
          <select
            v-model="scope.row.school_laboratory_id"
            @change="getStoreData(scope.row.school_laboratory_id, scope.$index)"
            :disabled="!editStatus"
          >
            <option v-for="(e, index) in optionsLaboratory" :key="index" :label="e.title" :value="e.id"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="仪器柜" align="left" width="120">
        <template #default="scope">
          <select v-model="scope.row.store_id" @change="setPlies(scope.$index)" :disabled="!editStatus">
            <option v-for="(e, i) in storeListBody[scope.$index]" :key="i" :label="e.title" :value="e.id"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="层数" align="left">
        <template #default="scope">
          <select v-model="scope.row.number_plies" :disabled="!editStatus">
            <option v-for="(e, i) in optionPliesBody[scope.$index]" :key="i" :label="e.name" :value="e.value"></option>
          </select>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="数量" align="left">
        <template #default="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="负责人" align="left" width="120">
        <template #default="scope">
          <span v-show="!editStatus">{{ scope.row.user[0].name }}</span>
          <el-select v-show="editStatus" v-model="scope.row.user[0].id" filterable placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
              @click="usercheck(item, scope.row.user[0])"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <img
            src="@assets/images/laboratory-standard/delete.png"
            alt=""
            @click="deleteItem(scope.row.id, scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <div v-if="tableData.length !== 0" class="btn" @click="save">{{ editStatus ? '确认入库' : '继续入库' }}</div>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, computed } from 'vue'
import { ArrowRight, Search } from '@element-plus/icons-vue'

import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'

import { useStore } from '@store/index'
import { inputAdjust } from '@/utils/common'
import { exportTableAsXLSX, uploadFile } from '@/utils/excel'

import { getLaboratoryList } from '@/service/laboratory-manage/overview'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'

import { getInstrumentOfType, postBatchEqu } from '@service/instrument-manage/batch-instrument-warehouse'
import { BatchWarehousingList } from '@service/instrument-manage/batch-instrument-warehouse/types'
import { accountStatus } from '@/service/login/login'
import { ElMessage, ElMessageBox } from 'element-plus'
import { findSchoolUser } from '@/service/equ-manage/add-equ-warehouse/index'
const userList: any = ref([])
findSchoolUser().then((res) => {
  console.log('111')
  console.log(res)
  userList.value = res.data
})
const store = useStore()
console.log('🚀 ~ file: index.vue ~ line 151 ~ store', store.state)

const dataMap = reactive({
  selectObj: { page: 1, type: 2, base: 1, keyword: '', limit: 7, is_school: 1 },
  tableData: Array<BatchWarehousingList>(),
  requestData: {
    data: Array<BatchWarehousingList>(),
    total: 0
  },
  requestDataAll: Array<BatchWarehousingList>(),
  fields: {
    分类编号: 'number',
    资产编号: 'asset_number',
    // 器材名称: 'name',
    // '规格 品名 教学性能要求': 'specification',
    // 单位: 'unit',
    // '*标准分类': 'is-must',
    // '*入库来源': 'source',
    凭证号: 'voucher_number',
    '*采购批次': 'bacth',
    '*厂家': 'factory',
    '*单价': 'unit_price'
    // 数量: 'total',
    // 负责人: 'user'
  },
  editStatus: true,
  optionsLaboratory: Array<{ id: number; title: string }>(),
  storeListBody: [] as any,
  optionPliesBody: [] as any,
  filterData: Array<ConfigDataType>(),
  loading: false
})

let {
  selectObj,
  tableData,
  requestData,
  requestDataAll,
  fields,
  editStatus,
  optionsLaboratory,
  storeListBody,
  optionPliesBody,
  filterData,
  loading
} = toRefs(dataMap)

getLaboratoryList({ subject: store.state.login.userInfo.subject_id }).then((res) => {
  optionsLaboratory.value = res.data.data
})

const getStoreData = (id: number | string) => {
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    storeListBody.value = res.data
    console.log(res.data)
    batchAll.store_id = ''
    batchAll.number_plies = ''
  })
}

filterData.value = [
  {
    name: '筛选',
    list: [
      { id: 1, name: '学校设备' },
      { id: 2, name: '设备配备标准' }
    ],
    keyName: 'base'
  }
]

const getData = () => {
  getInstrumentOfType(selectObj.value).then((res) => {
    requestData.value = res.data
  })
}
getData()

const changeFilter = (form: { base: number }) => {
  selectObj.value.base = form.base
  if (selectObj.value.base === 1) {
    selectObj.value.is_school = 1
  }
  if (selectObj.value.base === 2) {
    selectObj.value.is_school = 0
  }
  getData()
}

const setPlies = () => {
  optionPliesBody.value = optionPlies.value(storeListBody.value, batchAll.store_id)
  batchAll.number_plies = ''
}

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: any) => {
    let num = 1
    list.forEach((e) => {
      if (e.id === storeId) {
        num = e.number_plies
      }
    })
    let arr = Array<{
      value: number
      name: string
    }>()
    for (let i = 0; i < num; i++) {
      const obj = {
        value: i + 1,
        name: `第${i + 1}层`
      }
      arr.push(obj)
    }
    return arr
  }
})

const handleCurrentChange = () => {
  getData()
}

// const selUser = (item: any) => {
//   ruleForm.value.put.username = item.username
//   ruleForm.value.put.user_id = item.id
// }
const usercheck = (user: any, item: any) => {
  console.log(user)
  item.name = user.username
  item.id = user.id
}
const addTable = (item: any) => {
  console.log(item)
  if (editStatus.value) {
    let obj: any = {
      name: item.name,
      number: item.number,
      asset_number: '',
      // asset_number: store.state.login.userInfo.school_code || item.number,
      category: item.category,
      specification: item.specification,
      school_instrument_id: selectObj.value.base === 1 ? item.id || 0 : 0,
      instrument_id: selectObj.value.base === 2 ? item.id || 0 : 0,
      cost_type: typeof item.cost_type === 'object' ? item.cost_type.value : item.cost_type,
      unit: item.unit,
      info: item.info,
      number_year: item.number_year,
      norm: item.norm,
      school_laboratory_id: item.laboratory_id || tableData.value[tableData.value.length - 1]?.school_laboratory_id, //实验室id
      store_id: item.store_id || tableData.value[tableData.value.length - 1]?.store_id, //仪器柜id
      number_plies: item.number_plies || tableData.value[tableData.value.length - 1]?.number_plies, //层数
      total: 1, //入库数量
      source: item.source || 1,
      bacth: item.bacth || tableData.value[tableData.value.length - 1]?.bacth,
      voucher_number: item.voucher_number || tableData.value[tableData.value.length - 1]?.voucher_number,
      factory: item.factory || tableData.value[tableData.value.length - 1]?.factory,
      unit_price: item.unit_price,
      user: [{ name: '', id: '' }],
      type: 2
    }
    // 默认值
    tableData.value.push(obj)
    // storeByLaboratory({ id: Number(obj.school_laboratory_id) || 0 }).then((res) => {
    //   storeListBody.value[tableData.value.length - 1] = res.data
    //   // setPlies(tableData.value.length - 1)
    // })
  } else {
    ElMessage({
      type: 'info',
      message: '请点击继续入库按钮'
    })
  }
}

// 导入使用全部数据

const getDataAll = () => {
  getInstrumentOfType({ ...selectObj.value, is_school: 1, limit: 9999 }).then((res) => {
    requestDataAll.value.push(...res.data.data)
  })
  getInstrumentOfType({ ...selectObj.value, is_school: 0, limit: 9999 }).then((res) => {
    requestDataAll.value.push(...res.data.data)
  })
}
getDataAll()

const uploadChange = (file) => {
  loading.value = true
  //  const res = uploadFile()
  uploadFile(file).then((res) => {
    console.log('🚀 ~ file: index.vue:424 ~ uploadFile ~ res:', res)
    let resData = res.filter((e) => e.some((m) => m !== ''))
    let errorArr = Array<any>()
    for (let i = 2; i < resData.length; i++) {
      let arr = resData[i]
      let item = requestDataAll.value.find((e) => e.number === arr[0].toString())
      if (item) {
        let obj: any = {
          name: item.name,
          number: item.number,
          asset_number: arr[1],
          // asset_number: store.state.login.userInfo.school_code || item.number,
          category: item.category,
          specification: item.specification,
          school_instrument_id: selectObj.value.base === 1 ? item.id || 0 : 0,
          instrument_id: selectObj.value.base === 2 ? item.id || 0 : 0,
          cost_type: typeof item.cost_type === 'object' ? item.cost_type.value : item.cost_type,
          unit: item.unit,
          info: item.info,
          number_year: item.number_year,
          norm: item.norm,
          school_laboratory_id: item.laboratory_id || tableData.value[tableData.value.length - 1]?.school_laboratory_id, //实验室id
          store_id: item.store_id || tableData.value[tableData.value.length - 1]?.store_id, //仪器柜id
          number_plies: item.number_plies || tableData.value[tableData.value.length - 1]?.number_plies, //层数
          total: 1, //入库数量
          source: item.source || 1,
          voucher_number: arr[2],
          bacth: arr[3],
          factory: arr[4],
          unit_price: arr[5],
          user: [{ name: '', id: '' }],
          type: 2
        }
        // 默认值
        tableData.value.push(obj)
      } else {
        errorArr.push(resData[i][0])
      }
    }
    if (errorArr.length !== 0) {
      let arrNull = errorArr.filter((e) => !e)
      console.log('🚀 ~ file: add-plan.vue:214 ~ uploadFile ~ arrNull:', arrNull)
      let arrErr = errorArr.filter((e) => e)
      console.log('🚀 ~ file: add-plan.vue:216 ~ uploadFile ~ arrErr:', arrErr)

      ElMessageBox.alert(
        (arrNull.length !== 0 ? '导入的数据分类编号不能为空！' : '') +
          (arrErr.length !== 0 ? '以下编号导入错误，请检查编号是否正确：' + arrErr.join(',') : ''),
        '提示',
        {
          confirmButtonText: '确定',
          callback: (action) => {
            console.log('🚀 ~ file: index.vue:476 ~ uploadFile ~ action:', action)
            // ElMessage({
            //   type: 'info',
            //   message: `action: ${action}`
            // })
          }
        }
      )
    }

    loading.value = false
    console.log('🚀 ~ file: add-plan.vue:192 ~ uploadFile ~ errorArr:', errorArr)
  })
}
const deleteItem = (id: number, index: number) => {
  if (!editStatus.value) {
    return false
  }
  tableData.value.splice(index, 1)
}

const batchAll = reactive({
  laboratory_id: '',
  store_id: '',
  number_plies: '',
  data: [] as any
})
const state = ref(false)
const save = async () => {
  let status = await accountStatus({ type: 2 })
  if (status.data !== 3) {
    ElMessage({
      type: 'warning',
      message: '期初建帐结束后可用，请检查设备期初建帐信息'
    })
    return
  }
  if (batchAll.laboratory_id === '') {
    ElMessage({
      type: 'error',
      message: '请选择入库位置！'
    })
  } else {
    if (editStatus.value) {
      let errorCount = 0
      tableData.value.forEach((e) => {
        if (!e.asset_number) {
          errorCount = 1
          return
        }
        // if (!e.level) {
        //   errorCount = 2
        //   return
        // }
        if (!e.source) {
          errorCount = 3
          return
        }
        if (!e.voucher_number) {
          errorCount = 4
          return
        }
        if (!e.bacth) {
          errorCount = 5
          return
        }
        if (!e.factory) {
          errorCount = 6
          return
        }
        if (!e.unit_price) {
          errorCount = 7
          return
        }
      })
      if (errorCount !== 0) {
        ElMessage({
          type: 'warning',
          message:
            errorCount === 1
              ? '编号不可为空'
              : errorCount === 2
              ? '请选择标准分类'
              : errorCount === 3
              ? '请选择入库来源'
              : errorCount === 4
              ? '请输入凭证号'
              : errorCount === 5
              ? '请输入采购批次'
              : errorCount === 6
              ? '请输入厂家'
              : errorCount === 7
              ? '请输入单价'
              : '请检查必填项'
        })
        return
      }
      if (!state.value) {
        state.value = true
        batchAll.data = tableData.value
        postBatchEqu(batchAll).then((res) => {
          if (res.code === 10) {
            ElMessage({
              type: 'success',
              message: res.msg
            })
            editStatus.value = false
            setTimeout(() => {
              state.value = false
            }, 2000)
          } else {
            setTimeout(() => {
              state.value = false
            }, 2000)
          }
        })
      }
    } else {
      tableData.value = Array<BatchWarehousingList>()
      editStatus.value = true
    }
  }
}

const optionCome = reactive([
  {
    value: 1,
    name: '集采'
  },
  {
    value: 2,
    name: '自制'
  },
  {
    value: 3,
    name: '馈赠'
  },
  {
    value: 4,
    name: '自购'
  },
  {
    value: 5,
    name: '调拨'
  }
])
const optionCome1 = reactive([
  {
    value: 1,
    name: 'Ⅰ类'
  },
  {
    value: 2,
    name: 'Ⅱ类'
  },
  {
    value: 3,
    name: 'Ⅲ类'
  }
])
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

  .pagination-block {
    text-align: right;
    margin-bottom: 10px;
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
      width: 120px;
    }
    .short-input1 {
      width: 200px;
      input {
        width: 180px;
      }
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

    .el-select {
      input {
        width: 100%;
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

.btn {
  width: 100px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}

.btn-white {
  color: #333333;
  background: #f3f3f3;
}

.green {
  color: #05c65d !important;
}

.red {
  color: #de4747 !important;
}

.room_sel {
  height: 50px;
  line-height: 50px;
  text-align: left;

  span {
    display: inline-block;
    margin-left: 12px;
  }
  .upload-demo {
    display: inline-block;
  }
  .btn {
    display: inline-block;
    margin: 0 6px;
  }
}
</style>
