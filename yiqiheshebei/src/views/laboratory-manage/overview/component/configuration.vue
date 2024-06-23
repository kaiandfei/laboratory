<template>
  <div class="title">
    <div class="select-box">
      <el-input type="text" placeholder="搜索" v-model="selectInput">
        <template #append>
          <el-button type="primary" @click="getEquList(1, selectInput)">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
    <p :class="{ 'active-tab': activeTab === 1 }" @click="changeTab(1)">批量配置</p>
    <p :class="{ 'active-tab': activeTab === 2 }" @click="changeTab(2)">新建配置</p>
  </div>
  <div class="content" v-show="activeTab === 1">
    <div class="top-list-box">
      <div
        class="top-item"
        v-for="(item, index) in listData.list"
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
        v-model:currentPage="currentPage"
        :page-size="14"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="listData.count"
      ></el-pagination>
    </div>
    <p class="laboratory-name">{{ props.item.title }}</p>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="*类型编号" prop="number" align="left"></el-table-column>
      <el-table-column label="*学校编号" prop="asset_number" width="120" align="left">
        <template #default="scope">
          <input v-model="scope.row.asset_number" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="规格" prop="specification" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" width="50" align="left"></el-table-column>
      <!-- <el-table-column label="*标准分类" width="120" align="left">
        <template #default="scope">
          <select v-model="scope.row.level" placeholder="Select">
            <option v-for="item in optionSource" :key="item.value" :label="item.name" :value="item.value"></option>
          </select>
        </template>
      </el-table-column> -->
      <el-table-column label="来源" align="left">
        <template #default="scope">
          <select v-model="scope.row.source" placeholder="Select">
            <option v-for="item in optionCome" :key="item.value" :label="item.name" :value="item.value"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="厂家" prop="factory" width="160" align="left">
        <template #default="scope">
          <input class="long-input" v-model="scope.row.factory" />
        </template>
      </el-table-column>
      <el-table-column label="采购批次" prop="bacth" width="120" align="left">
        <template #default="scope">
          <input v-model="scope.row.bacth" />
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="unit_price" width="120" align="left">
        <template #default="scope">
          <input v-model="scope.row.unit_price" />
        </template>
      </el-table-column>
      <el-table-column label="仪器柜" align="left">
        <template #default="scope">
          <select v-model="scope.row.store_id" @change="scope.row.number_plies = 1" placeholder="" clearable>
            <option
              v-for="item in optionStore(storeList)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="层数" align="left">
        <template #default="scope">
          <select v-model="scope.row.number_plies" placeholder="">
            <option
              v-for="item in optionPlies(storeList, scope.row.store_id || 1)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="user_name" align="left">
        <template #default="scope">
          <select v-model="scope.row.user_name" placeholder="">
            <option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id"></option>
          </select>
          <!-- <div class="teacher-cell">
            <span>{{ '张老师' }}</span>
            <img
              v-show="false"
              src="@assets/images/laboratory-standard/add-square.png"
              alt=""
              @click="addTeacher(scope.row.id)"
            />
          </div> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template #default="scope">
          <img
            src="@assets/images/laboratory-standard/delete.png"
            alt=""
            @click="deleteItem(scope.row.id, scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="content" v-show="activeTab === 2">
    <div class="message-box">
      <p class="header">
        <span>1</span>
        基本信息
      </p>
      <el-form ref="ruleForm1" :model="ruleForm.base" :rules="rules" label-width="150px" class="rule-form">
        <el-form-item label="分类编号：" prop="number">
          <el-input v-model="ruleForm.base.number"></el-input>
        </el-form-item>
        <el-form-item label="学校编号：" prop="asset_number">
          <el-input v-model="ruleForm.base.asset_number"></el-input>
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model="ruleForm.base.name"></el-input>
        </el-form-item>
        <el-form-item label="规格型号：" prop="">
          <el-input v-model="ruleForm.base.specification"></el-input>
        </el-form-item>
        <el-form-item label="分类：" prop="category">
          <el-cascader
            v-model="ruleForm.base.category"
            :options="allType"
            :props="casProps"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="学科：" prop="">
          <el-checkbox-group v-model="ruleForm.base.subject">
            <el-checkbox v-for="(item, index) in optionSubject" :key="index" :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="价值类型：" prop="">
          <el-radio-group v-model="ruleForm.base.cost_type">
            <el-radio :label="1">低值易耗</el-radio>
            <el-radio :label="2">非低值易耗</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="单位：" prop="">
          <el-input v-model="ruleForm.base.unit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="功能描述：" prop="">
          <el-input v-model="ruleForm.base.info"></el-input>
        </el-form-item>
        <el-form-item class="use-year" label="使用年限：" prop="">
          <el-input v-model="ruleForm.base.number_year"><template #append>年</template></el-input>
          <!-- <el-select v-model="ruleForm.base.number_year_unit" placeholder="">
            <el-option
              v-for="item in optionsYear"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="标准：" prop="">
          <el-input v-model="ruleForm.base.norm"></el-input>
        </el-form-item>
        <el-form-item label="上传照片：" prop="">
          <el-upload
            ref="upload"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="filedata"
            name="image"
            list-type="picture-card"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            accept=".jpg,.png,.jpeg"
          >
            <span>+点击上传</span>
            <!-- <el-icon><plus /></el-icon> -->
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div class="message-box">
      <p class="header">
        <span>2</span>
        入库信息
      </p>
      <el-form ref="ruleForm2" :model="ruleForm.put" label-width="150px" class="rule-form">
        <el-form-item label="存放位置：" prop="">
          <p>{{ ruleForm.put.school_laboratory_name }}</p>
          <el-select v-model="ruleForm.put.store_id" placeholder="">
            <el-option
              v-for="item in optionStore(storeList)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="ruleForm.put.number_plies" placeholder="">
            <el-option
              v-for="item in optionPlies(storeList, ruleForm.put.store_id || 1)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="标准分类：" prop="">
          <el-radio-group v-model="ruleForm.put.level">
            <el-radio v-for="(item, index) in optionSource" :key="index" :label="item.value">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="来源：" prop="">
          <el-radio-group v-model="ruleForm.put.source">
            <el-radio v-for="(item, index) in optionCome" :key="index" :label="item.value">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="凭证号码：" prop="">
          <el-input v-model="ruleForm.put.voucher_number"></el-input>
        </el-form-item>
        <el-form-item label="采购批次：" prop="">
          <el-input v-model="ruleForm.put.bacth"></el-input>
        </el-form-item>
        <el-form-item label="产地(厂家)：" prop="">
          <el-input v-model="ruleForm.put.factory"></el-input>
        </el-form-item>
        <el-form-item label="单价：" prop="">
          <el-input v-model="ruleForm.put.unit_price"></el-input>
        </el-form-item>
        <el-form-item label="负责人：" prop="">
          <el-input v-model="ruleForm.put.user_name"></el-input>
        </el-form-item>
        <el-form-item :style="{ padding: '30px 130px 0 0', 'text-align': 'right' }">
          <el-button type="info" @click="back" :style="{ 'margin-right': '30px' }">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleForm1)">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <footer v-show="activeTab === 1">
    <p class="btn btn-white" @click="back">返回</p>
    <p class="btn" @click="save()">保存</p>
  </footer>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits, toRefs, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'

import {
  equipmentList,
  bacthLaboratoryConfig,
  bacthConfigurationDel,
  bacthConfigurationSave,
  storeByLaboratory,
  configurationAdd
} from '@service/laboratory-manage/overview/index'
import { equipmentListData, bacthLabConfig, ConfigType } from '@service/laboratory-manage/overview/types'
import { AllTypeChildren } from '@service/equiment-standard/type-manage/types'
import { getAll } from '@service/equiment-standard/type-manage/index'
import { getSchoolUser } from '@service/login/login'

import type { ElForm } from 'element-plus'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { ElMessage } from 'element-plus'

const props = defineProps({ item: { type: Object, required: true } })
const emit = defineEmits(['back'])

const store = useStore()
const filedata = reactive({
  token: store.state.login.userInfo.token
})

const dataMap = reactive({
  activeTab: 1,
  selectInput: '',
  deleteList: [0],
  listData: equipmentListData,
  tableData: [bacthLabConfig],
  storeList: [
    {
      id: 0,
      title: '',
      number_plies: 1
    }
  ],
  userList: Array<{
    id: number
    username: string
  }>(),
  currentPage: 1,
  ruleForm: {
    base: {
      number: '',
      asset_number: '',
      name: '',
      specification: '',
      cost_type: 1,
      info: '',
      category: [],
      norm: '',
      unit: '',
      number_year: '',
      number_year_unit: '',
      subject: [],
      url: '',
      type: 2
    },
    put: {
      store_id: 1,
      number_plies: 1,
      school_laboratory_id: props.item.id,
      school_laboratory_name: props.item.title,
      // level: 1,
      source: 1,
      voucher_number: '',
      bacth: '',
      factory: '',
      unit_price: '',
      user_name: '',
      asset_number: '',
      specification: ''
    }
  },
  allType: Array<AllTypeChildren>(),
  casProps: {
    value: 'id',
    label: 'title',
    emitPath: false,
    multiple: true,
    checkStrictly: true
  }
})

let {
  activeTab,
  selectInput,
  deleteList,
  listData,
  tableData,
  storeList,
  userList,
  currentPage,
  ruleForm,
  allType,
  casProps
} = toRefs(dataMap)

const getEquList = (page: number, keyword: string) => {
  equipmentList({ page, keyword, type: 2 }).then((res) => {
    listData.value = res.data
  })
}
getEquList(1, '')

const getAllType = () => {
  getAll({ type: 2 }).then((res) => {
    allType.value = res.data
    // allType.value = getTreeData(res.data)
  })
}

getAllType()

getSchoolUser().then((res) => {
  if (res.code === 10) {
    userList.value = res.data
  }
})

const getTreeData = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].children = undefined
    } else {
      // children若不为空数组，则继续 递归调用 本方法
      getTreeData(data[i].children)
    }
  }
  return data
}

const getData = () => {
  bacthLaboratoryConfig({ id: props.item.id }).then((res) => {
    tableData.value = res.data
  })
  console.log(props.item.id, '传递的实验室id')
  storeByLaboratory({ id: props.item.id }).then((res) => {
    storeList.value = res.data
    ruleForm.value.put.store_id = optionStore.value(storeList.value)[0].value
  })
}
getData()

let optionStore = computed(() => {
  return (list: { id: number; title: string }[]) => {
    let arr = Array<{
      value: number
      name: string
    }>()
    list.forEach((e) => {
      const obj = {
        value: e.id,
        name: e.title
      }
      arr.push(obj)
    })
    return arr
  }
})

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: number) => {
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

const changeTab = (type: number) => {
  activeTab.value = type
}

const handleCurrentChange = () => {
  getEquList(currentPage.value, selectInput.value)
}

const addTable = (item: ConfigType) => {
  let obj = {
    ...bacthLabConfig,
    name: item.name,
    number: item.number,
    asset_number: item.asset_number || item.number,
    specification: item.specification,
    unit: item.unit,
    store_id: optionStore.value(storeList.value)[0]?.value,
    school_instrument_id: item.id,
    school_laboratory_id: props.item.id,
    school_laboratory_name: props.item.title,
    total: 1,
    qr_code: item.qr_code,
    type: 2
  }
  tableData.value.push(obj)
}
deleteList.value.shift()
const deleteItem = (id: number, index: number) => {
  tableData.value.splice(index, 1)
  if (id !== 0) {
    deleteList.value.push(id)
  }
}

const save = () => {
  if (tableData.value.some((e) => e.asset_number === '')) {
    ElMessage({
      type: 'warning',
      message: '学校编号不可为空'
    })
    return
  }
  if (deleteList.value.length !== 0) {
    deleteList.value.forEach((e) => {
      bacthConfigurationDel({ id: e }).then()
    })
  }
  // const arr = tableData.value.forEach(e => {
  //   return delete e.list
  // })
  bacthConfigurationSave(tableData.value).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      getData()
      deleteList.value = []
    }
  })
}

const addTeacher = (id: number) => {
  console.log('🚀 ~ file: addTeacher', id)
}

const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  console.log('🚀 ~ file: index.vue ~ line 444 ~ uploadSuccess ~ fileList', fileList)
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
  })
  ruleForm.value.base.url = string
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList)
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
  })
  ruleForm.value.base.url = string
}

const back = () => {
  emit('back')
  deleteList.value = []
}

const ruleForm1 = ref<InstanceType<typeof ElForm>>()

const rules = reactive({
  number: [
    {
      required: true,
      message: '请输入分类编号',
      trigger: 'blur'
    }
  ],
  asset_number: [
    {
      required: true,
      message: '请输入学校编号',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入实验室名称',
      trigger: 'blur'
    }
  ],
  category: [
    {
      type: 'array',
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ]
})

const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(ruleForm.value)
      configurationAdd({
        base: {
          ...ruleForm.value.base,
          category: ruleForm.value.base.category.join(','),
          subject: ruleForm.value.base.subject.join(',')
        },
        put: {
          ...ruleForm.value.put,
          asset_number: ruleForm.value.base.asset_number,
          specification: ruleForm.value.base.specification
        }
      }).then((res) => {
        if (res.code === 10) {
          ElMessage({ type: 'success', message: res.msg })
          ruleForm.value = {
            base: {
              number: '',
              asset_number: '',
              name: '',
              specification: '',
              cost_type: 1,
              info: '',
              category: [],
              norm: '',
              unit: '',
              number_year: '',
              number_year_unit: '',
              subject: [],
              url: '',
              type: 2
            },
            put: {
              store_id: 1,
              number_plies: 1,
              school_laboratory_id: props.item.id,
              school_laboratory_name: props.item.title,
              // level: 1,
              source: 1,
              voucher_number: '',
              bacth: '',
              factory: '',
              unit_price: '',
              user_name: '',
              asset_number: '',
              specification: ''
            }
          }
          activeTab.value = 1
          getData()
          getEquList(1, '')
        } else {
          ElMessage({ message: res.msg })
        }
      })
    } else {
      ElMessage({
        type: 'warning',
        message: '请填写必填项'
      })
      return false
    }
  })
}
const optionSource = reactive([
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

const optionSubject = [...store.state.common.subjectArr]

// const optionsYear = reactive([
//   {
//     value: '年',
//     label: '年'
//   },
//   {
//     value: '月',
//     label: '月'
//   },
//   {
//     value: '日',
//     label: '日'
//   }
// ])
</script>

<style scoped lang="scss">
.title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
  width: 100%;
  height: 40px;
  background: #ffffff;
  box-sizing: border-box;
  p {
    width: 50%;
    height: 100%;
    line-height: 40px;
    font-size: 18px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    background: #d9d9d9;
    cursor: pointer;
  }
  .active-tab {
    background: #ffffff;
  }
  .select-box {
    position: absolute;
    right: 30px;
    top: -40px;
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
.content {
  width: 100%;
  margin-top: 20px;
  .top-list-box {
    display: flex;
    flex-wrap: wrap;
    .top-item {
      margin: 0 1% 10px;
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
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #05c65d;
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
      width: 90%;
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
      :deep(.el-cascader) {
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
          width: 80%;
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
</style>
