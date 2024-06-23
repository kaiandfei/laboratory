<template>
  <div>
    <header>
      <div class="fl">
        设备管理
        <el-icon><arrow-right /></el-icon>
        <span>新建设备入库</span>
      </div>
    </header>
    <div class="content" v-show="!detailShow">
      <div class="message-box">
        <p class="header">
          <span>1</span>
          基本信息
        </p>
        <el-form ref="ruleForm1" :model="ruleForm.base" :rules="rules" label-width="150px" class="rule-form">
          <el-form-item label="分类编号：" prop="number">
            <el-input v-model="ruleForm.base.number"></el-input>
          </el-form-item>
          <el-form-item label="资产编号：" prop="asset_number">
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
              :options="optionsType"
              :props="casProps"
              collapse-tags
              :show-all-levels="false"
              style="width: 100%"
            ></el-cascader>
            <!-- <el-select v-model="cate" multiple collapse-tags placeholder="" @change="cateChange">
              <el-option v-for="item in optionsType" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select> -->
          </el-form-item>
          <!-- <el-form-item label="价值分类：" prop="">
            <el-radio-group v-model="ruleForm.base.cost_type">
              <el-radio :label="1">低值易耗</el-radio>
              <el-radio :label="2">非低值易耗</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <!-- <el-form-item label="学科：" prop="">
            <el-checkbox-group v-model="subList">
              <el-checkbox
                v-for="(item, index) in optionSubject"
                :key="index"
                v-model="item.sel"
                :label="item.id"
                @change="checkClick"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <!-- <el-form-item label="配备类型">
            <el-radio-group v-model="ruleForm.base.is_must">
              <el-radio :label="1">必配</el-radio>
              <el-radio :label="2">选配</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="实验类型">
            <el-checkbox-group v-model="ruleForm.base.is_group">
              <el-checkbox v-for="(item, index) in optionExp_type" :key="index" :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <el-form-item label="单位：" prop="unit">
            <el-select v-model="ruleForm.base.unit" placeholder="">
              <el-option v-for="item in unitData" :key="item.id" :label="item.title" :value="item.title"></el-option>
            </el-select>
            <!-- <el-input v-model="ruleForm.base.unit" placeholder=""></el-input> -->
          </el-form-item>
          <el-form-item label="功能描述：" prop="">
            <el-input v-model="ruleForm.base.info"></el-input>
          </el-form-item>
          <el-form-item class="use-year" label="使用年限：" prop="number_year">
            <el-input v-model="ruleForm.base.number_year"><template #append>年</template></el-input>
            <!-- <el-input v-model="ruleForm.base.number_year"></el-input>
            <el-select v-model="ruleForm.base.number_year_unit" placeholder="">
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
              :data="fileData"
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
          <div v-for="item in ruleForm.put.location" :key="item.laboratory_id">
            <el-form-item class="is-required" label="存放位置：" prop="">
              <el-select v-model="item.laboratory_id">
                <el-option
                  v-for="(item1, index) in optionsLaboratory"
                  :key="index"
                  :label="item1.title"
                  :value="item1.id"
                  @click="getStoreData(item1.id, item1.title)"
                ></el-option>
              </el-select>
              <el-select v-model="item.store_id" placeholder="">
                <el-option
                  v-for="item1 in storeListBody"
                  :key="item1.id"
                  :label="item1.title"
                  :value="item1.id"
                  @click="storeIdChange(item, item1)"
                ></el-option>
              </el-select>
              <el-select v-model="item.number_plies" placeholder="">
                <el-option
                  v-for="n in optionPlies(number_plies)"
                  :key="n.value"
                  :label="n.name"
                  :value="n.value"
                ></el-option>
              </el-select>
              <!-- <el-input v-model="item.number" placeholder="输入入库数量"></el-input> -->
            </el-form-item>
          </div>
          <!-- <el-form-item class="is-required" label="标准分类：" prop="">
            <el-radio-group v-model="ruleForm.put.level">
              <el-radio v-for="(item, index) in optionCome1" :key="index" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item class="is-required" label="来源：" prop="">
            <el-radio-group v-model="ruleForm.put.source">
              <el-radio v-for="(item, index) in optionCome" :key="index" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="is-required" label="凭证号码：" prop="">
            <el-input v-model="ruleForm.put.voucher_number"></el-input>
          </el-form-item>
          <el-form-item class="is-required" label="采购批次：" prop="">
            <el-input v-model="ruleForm.put.bacth"></el-input>
          </el-form-item>
          <el-form-item class="is-required" label="产地（厂家）：" prop="">
            <el-input v-model="ruleForm.put.factory"></el-input>
          </el-form-item>
          <el-form-item class="is-required" label="单价：" prop="">
            <el-input v-model="ruleForm.put.unit_price"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="">
            <el-select v-model="ruleForm.put.user_id" filterable placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
                @change="selUser(item)"
              />
            </el-select>
            <!-- <el-input v-model="ruleForm.put.username"></el-input> -->
          </el-form-item>
          <el-form-item :style="{ padding: '30px 130px 0 0', 'text-align': 'right' }">
            <el-button type="info" @click="back" :style="{ 'margin-right': '30px' }">取消</el-button>
            <el-button type="primary" @click="submitForm(ruleForm1)">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content" v-show="detailShow">
      <div class="message-box">
        <p class="header">
          <span>1</span>
          基本信息
        </p>
        <el-form ref="ruleForm12" :model="dataMap.saveBack" :rules="rules" label-width="150px" class="rule-form">
          <el-form-item label="分类编号：" prop="number">
            {{ dataMap.saveBack.number }}
          </el-form-item>
          <el-form-item label="资产编号：" prop="asset_number">
            {{ dataMap.saveBack.asset_number }}
          </el-form-item>
          <el-form-item label="名称：" prop="name">
            {{ dataMap.saveBack.name }}
          </el-form-item>
          <el-form-item label="规格型号：" prop="">
            {{ dataMap.saveBack.specification }}
          </el-form-item>
          <el-form-item label="分类：" prop="category">
            {{ dataMap.saveBack.category1 }}
          </el-form-item>
          <!-- <el-form-item label="价值分类：" prop="">
            {{ ruleForm.base.cost_type }}
          </el-form-item> -->
          <!-- <el-form-item label="学科：" prop="">
            {{
              ['物理', '化学', '生物', '小学科学', '历史', '地理', '音乐', '体育', '美术'][dataMap.saveBack.subject - 1]
            }}
          </el-form-item> -->
          <!-- <el-form-item label="配备类型">
            {{ ruleForm.base.is_must }}
          </el-form-item>
          <el-form-item label="实验类型">
            {{ ruleForm.base.is_group }}
          </el-form-item> -->
          <el-form-item label="单位：" prop="">
            {{ dataMap.saveBack.unit }}
          </el-form-item>
          <el-form-item label="功能描述：" prop="">
            {{ dataMap.saveBack.info }}
          </el-form-item>
          <el-form-item class="use-year" label="使用年限：" prop="">
            {{ dataMap.saveBack.number_year + dataMap.saveBack.number_year_unit }}
          </el-form-item>
          <el-form-item label="标准：" prop="">
            {{ dataMap.saveBack.norm }}
          </el-form-item>
          <el-form-item label="上传照片：" prop="">
            <img class="c_img" v-for="(item, index) in dataMap.saveBack.url" :key="index" :src="item.url_path" alt="" />
            <!-- <el-upload
              ref="upload"
              :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
              :data="fileData"
              name="image"
              list-type="picture-card"
              :on-success="uploadSuccess"
              :on-remove="handleRemove"
              accept=".jpg,.png,.jpeg"
            >
              <span>+点击上传</span>
            </el-upload> -->
          </el-form-item>
        </el-form>
      </div>
      <div class="message-box">
        <p class="header">
          <span>2</span>
          入库信息
        </p>
        <el-form ref="ruleForm2" :model="dataMap.saveBack" label-width="150px" class="rule-form">
          <!-- <div v-for="item in ruleForm.put.location" :key="item.laboratory_id">
            <el-form-item label="存放位置：" prop="">
              {{ item.school_laboratory_name }}
              {{ item.store_name }}
              {{ item.number_plies }}
            </el-form-item>
            <el-form-item label="存放数量">
              {{ item.number }}
            </el-form-item>
          </div> -->
          <el-form-item label="存放位置：" prop="">
            {{ dataMap.saveBack.school_laboratory_name }}
            {{ dataMap.saveBack.store_name }}
            {{ '第' + dataMap.saveBack.number_plies + '层' }}
          </el-form-item>
          <!-- <el-form-item label="分类：" prop="">
            {{ ['Ⅰ类', 'Ⅱ类', 'Ⅲ类'][dataMap.saveBack.level - 1] }}
          </el-form-item> -->
          <el-form-item label="来源：" prop="">
            {{
              ['期初建账', '集采', '自制', '馈赠', '自购', '调拨', '盘点', '损耗报废', '损坏赔偿'][
                dataMap.saveBack.source
              ] || ''
            }}
          </el-form-item>
          <el-form-item label="凭证号码：" prop="">
            {{ dataMap.saveBack.voucher_number }}
          </el-form-item>
          <el-form-item label="采购批次：" prop="">
            {{ dataMap.saveBack.bacth }}
          </el-form-item>
          <el-form-item label="产地（厂家）：" prop="">
            {{ dataMap.saveBack.factory }}
          </el-form-item>
          <el-form-item label="单价：" prop="">
            {{ dataMap.saveBack.unit_price }}
          </el-form-item>
          <el-form-item label="负责人：" prop="">
            {{ dataMap.saveBack.username }}
          </el-form-item>
          <el-form-item :style="{ padding: '30px 130px 0 0', 'text-align': 'right' }">
            <el-button type="primary" @click="backHome" :style="{ 'margin-right': '30px' }">继续新建入库</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, defineProps, toRefs, computed } from 'vue'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { ArrowRight } from '@element-plus/icons-vue'
import { addWarehousingData } from '@/service/equ-manage/add-equ-warehouse/types'
import { postAddEquList, findSchoolUser, units } from '@/service/equ-manage/add-equ-warehouse/index'
import { getInstrumentCategory } from '@service/equiment-standard/type-manage/index'
import { getLaboratoryList } from '@/service/instrument-manage/equ-manage/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'
import { accountStatus } from '@/service/login/login'
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'

let unitData = ref<any>([])
const getUnits = async () => {
  try {
    const { data, code } = await units()
    if (code === 10) {
      unitData.value = data
    }
  } catch (error) {
    console.log('error', error)
  }
}
getUnits()
const store = useStore()
console.log('登陆人学科', store.state.login.userInfo.subject_id)
// 登陆人学科id
let userSubject = store.state.login.userInfo.subject_id
// 实验室列表
const optionsLaboratory: any = ref([])
// 仪器库列表
const storeListBody: any = ref([])
// 仪器库列表
const number_plies = ref()
// 获取实验室列表
getLaboratoryList({ subject: userSubject }).then((res) => {
  optionsLaboratory.value = res.data.data
  console.log(optionsLaboratory.value)
})
// 获取仪器柜
const getStoreData = (id: number | string, name: string) => {
  console.log(name)
  // ruleForm.value.put.location[0].school_laboratory_name = name
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    ruleForm.value.put.location[0].store_id = ''
    ruleForm.value.put.location[0].number_plies = ''
    console.log(res)
    storeListBody.value = res.data
  })
}
const storeIdChange = (item: any, item1: any) => {
  number_plies.value = item1.number_plies
  item.number_plies = ''
}
// 计算层数
let optionPlies = computed(() => {
  return (id: any) => {
    let num = id
    // list.forEach((e) => {
    //   if (e.id === storeId) {
    //     num = e.number_plies
    //   }
    // })
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
const props = defineProps({ item: { type: Object, required: true } })
let detailShow = ref(false)
const userList: any = ref([])
findSchoolUser().then((res) => {
  console.log('111')
  console.log(res)
  userList.value = res.data
})

console.log(props)
const dataMap: any = reactive({
  ruleForm: addWarehousingData,
  saveBack: {},
  cate: [],
  storeList: [
    {
      id: 0,
      title: '',
      number_plies: 1
    }
  ]

  // optionSubject: JSON.parse(JSON.stringify(store.state.common.subjectArr))
})
const optionsType: any = ref([])
const casProps = ref({
  value: 'id',
  label: 'title',
  emitPath: false,
  multiple: true,
  checkStrictly: true
})
getInstrumentCategory({
  type: 2
}).then((res) => {
  optionsType.value = res.data
})
const subList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9])

const optionSubject = ref([
  {
    id: 1,
    name: '物理',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 2,
    name: '化学',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 3,
    name: '生物',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 4,
    name: '小学科学',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 5,
    name: '历史',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 6,
    name: '地理',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 7,
    name: '音乐',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 8,
    name: '体育',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  },
  {
    id: 9,
    name: '美术',
    status: 1,
    create_time: '2021-08-09 14:23:02',
    sel: true
  }
])
// console.log(arrSub)
// optionSubject.value = arrSub
console.log(optionSubject.value)
let { ruleForm, cate } = toRefs(dataMap)
const selUser = (item: any) => {
  ruleForm.value.put.username = item.username
  ruleForm.value.put.user_id = item.id
}
// ruleForm.value.base.subject = subList.value.toString()
// ruleForm.value.base.subject = userSubject.toString()

// const optionSubject = store.state.common.subjectArr
// const optionExp_type = [
//   {
//     id: 1,
//     name: '分组'
//   },
//   {
//     id: 2,
//     name: '演示'
//   }
// ]
// let optionLaboratory = computed(() => {
//   return (list: { id: number; title: string }[]) => {
//     let arr = Array<{
//       value: number
//       name: string
//     }>()
//     list.forEach((e) => {
//       const obj = {
//         value: e.id,
//         name: e.title
//       }
//       arr.push(obj)
//     })
//     return arr
//   }
// })
// let optionStore = computed(() => {
//   return (list: { id: number; title: string }[]) => {
//     let arr = Array<{
//       value: number
//       name: string
//     }>()
//     list.forEach((e) => {
//       const obj = {
//         value: e.id,
//         name: e.title
//       }
//       arr.push(obj)
//     })
//     return arr
//   }
// })

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
const fileData = reactive({
  token: store.state.login.userInfo.token
})

const optionsYear = reactive([
  {
    value: '年',
    label: '年'
  },
  {
    value: '月',
    label: '月'
  },
  {
    value: '日',
    label: '日'
  }
])

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
      message: '请输入资产编号',
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
      // type: 'array',
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ],
  unit: [
    {
      required: true,
      message: '请输入单位',
      trigger: 'blur'
    }
  ],
  number_year: [
    {
      required: true,
      message: '请输入使用年限',
      trigger: 'blur'
    }
  ]
})

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
  ruleForm.value.base.url.push({ url_path: string })
  console.log(ruleForm.value.base.url)
}

const cateChange = () => {
  // let str = ''
  // JSON.parse(JSON.stringify(cate.value)).forEach((e: any) => {
  //   console.log(e)
  //   str = e + ','
  // })
  let str = JSON.parse(JSON.stringify(cate.value)).toString()
  ruleForm.value.base.category = str
}

const checkClick = () => {
  ruleForm.value.base.subject = subList.value.toString()
  // optionSubject.value.map((e: any) => {
  //   console.log(e)
  // })
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
  ruleForm.value.base.url.push({ url_path: string })
}

const back = () => {
  console.log()
}

const backHome = () => {
  detailShow.value = false
}
const ruleForm1 = ref<InstanceType<typeof ElForm>>()
const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      accountStatus({ type: 2 }).then((res) => {
        if (res.data !== 3) {
          ElMessage({
            type: 'warning',
            message: '期初建帐结束后可用，请检查仪器期初建帐信息'
          })
          return
        }
        let errorCount = 0
        ruleForm.value.put.location.forEach((e: { laboratory_id: string }) => {
          if (e.laboratory_id === '') {
            errorCount = 1
          }
        })
        if (errorCount === 1) {
          ElMessage({
            type: 'warning',
            message: '请检查并选择入库位置'
          })
          return
        }
        if (!ruleForm.value.put.voucher_number) {
          ElMessage({
            type: 'warning',
            message: '请填写凭证号'
          })
          return
        }
        if (!ruleForm.value.put.bacth) {
          ElMessage({
            type: 'warning',
            message: '请填写采购批次'
          })
          return
        }
        if (!ruleForm.value.put.factory) {
          ElMessage({
            type: 'warning',
            message: '请填写产地'
          })
          return
        }
        if (!ruleForm.value.put.unit_price) {
          ElMessage({
            type: 'warning',
            message: '请填写单价'
          })
          return
        }
        const pullData: any = {
          ...ruleForm.value.base,
          ...ruleForm.value.put,
          ...ruleForm.value.put.location[0],
          type: 2
        }
        pullData.category = ruleForm.value.base.category.join(',')
        postAddEquList(pullData)
          .then((res: any) => {
            dataMap.saveBack = res.data
            let arrId = res.data.category.split(',')
            dataMap.saveBack.category1 = []
            arrId.map((e: any) => {
              optionsType.value.forEach((item: any) => {
                if (item.id === parseInt(e)) {
                  dataMap.saveBack.category1.push(item.title)
                }
              })
            })
            dataMap.saveBack.category1 = dataMap.saveBack.category1.toString()
            console.log(dataMap.saveBack.category1.toString())
          })
          .then(() => {
            detailShow.value = true
          })
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
</script>
<style lang="scss" scoped>
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
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #05c65d;
      }
      .item-introduction {
        span:nth-of-type(1) {
          display: inline-block;
          width: 50px;
          color: #848484;
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
.c_img {
  width: 100px;
  height: 100px;
  margin-right: 12px;
}
</style>
