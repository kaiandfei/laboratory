<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>新建仪器入库</span>
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
              collapse-tags
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="价值分类：" prop="cost_type">
            <el-radio-group v-model="ruleForm.base.cost_type">
              <el-radio :label="1">低值易耗</el-radio>
              <el-radio :label="2">非低值易耗</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="学科：" prop="">
            <el-checkbox-group v-model="ruleForm.base.subject">
              <el-checkbox v-for="(item, index) in optionSubject" :key="index" :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <!-- <el-form-item label="配备类型：">
            <el-radio-group v-model="ruleForm.base.is_must">
              <el-radio :label="1">必配</el-radio>
              <el-radio :label="2">选配</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="实验类型：">
            <el-radio-group v-model="ruleForm.base.is_group">
              <el-radio :label="1">分组</el-radio>
              <el-radio :label="2">演示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="单位：" prop="unit">
            <el-select v-model="ruleForm.base.unit" placeholder="">
              <el-option v-for="item in unitData" :key="item.id" :label="item.title" :value="item.title"></el-option>
            </el-select>
            <!-- <el-input v-model="ruleForm.base.unit" placeholder=""></el-input> -->
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
          <div v-for="(item, index) in ruleForm.put.location" :key="index">
            <el-form-item class="is-required" label="存放位置：" prop="">
              <el-select
                class="el-select-30"
                v-model="item.school_laboratory_id"
                @change="getData(item.school_laboratory_id, index, item)"
              >
                <el-option
                  v-for="(e, index) in optionsLaboratory"
                  :key="index"
                  :label="e.title"
                  :value="e.id"
                ></el-option>
              </el-select>
              <el-select class="el-select-30" v-model="item.store_id" @change="setPlies(index, item)">
                <el-option v-for="(e, i) in storeListBody[index]" :key="i" :label="e.title" :value="e.id"></el-option>
              </el-select>
              <el-select class="el-select-30" v-model="item.number_plies">
                <el-option
                  v-for="(e, i) in optionPliesBody[index]"
                  :key="i"
                  :label="e.name"
                  :value="e.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="存放数量：" prop="">
              <el-input v-model="item.total" placeholder=""></el-input>
            </el-form-item>
          </div>
          <el-form-item label="" prop="">
            <span class="green" @click="addPlace">增加一条存放入库的位置</span>
          </el-form-item>
          <el-form-item class="is-required" label="来源：" prop="">
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
          <el-form-item label="产地（厂家）：" prop="">
            <el-input v-model="ruleForm.put.factory"></el-input>
          </el-form-item>
          <el-form-item class="is-required" label="单价：" prop="unit_price">
            <el-input v-model="ruleForm.put.unit_price"></el-input>
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
        <el-form ref="detailData1" :model="detailData.base" :rules="rules" label-width="150px" class="rule-form">
          <el-form-item label="分类编号：" prop="number">
            {{ detailData.base.number }}
          </el-form-item>
          <el-form-item label="学校编号：" prop="asset_number">
            {{ detailData.base.asset_number }}
          </el-form-item>
          <el-form-item label="名称：" prop="name">
            {{ detailData.base.name }}
          </el-form-item>
          <el-form-item label="规格型号：" prop="">
            {{ detailData.base.specification }}
          </el-form-item>
          <el-form-item label="分类：" prop="category">
            {{ optionCategoryName }}
          </el-form-item>
          <el-form-item label="价值分类：" prop="">
            {{ detailData.base.cost_type }}
          </el-form-item>
          <!-- <el-form-item label="学科：" prop="">
            {{ optionSubjectName }}
          </el-form-item> -->
          <!-- <el-form-item label="配备类型：">
            {{ detailData.base.is_must }}
          </el-form-item> -->
          <el-form-item label="实验类型：">
            {{ detailData.base.is_group }}
          </el-form-item>
          <el-form-item label="单位：" prop="">
            {{ detailData.base.unit }}
          </el-form-item>
          <el-form-item label="功能描述：" prop="">
            {{ detailData.base.info }}
          </el-form-item>
          <el-form-item class="use-year" label="使用年限：" prop="">
            {{ detailData.base.number_year + detailData.base.number_year_unit }}
          </el-form-item>
          <el-form-item label="标准：" prop="">
            {{ detailData.base.norm }}
          </el-form-item>
          <el-form-item label="照片：" prop="">
            <el-image
              style="width: 100px; height: 100px; margin-right: 20px"
              v-for="(item, index) in detailData.base.url?.split(',')"
              :key="index"
              :src="item"
              :preview-src-list="detailData.base.url?.split(',')"
              :initial-index="index"
              fit="cover"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="message-box">
        <p class="header">
          <span>2</span>
          入库信息
        </p>
        <el-form ref="detailData2" :model="detailData.put" label-width="150px" class="rule-form">
          <div v-for="(item, index) in detailData.put.location" :key="index">
            <el-form-item label="存放位置：" prop="">
              {{ `${item.school_laboratory_name},${item.store_name},第${item.number_plies}层` }}
            </el-form-item>
            <el-form-item label="存放数量：">
              {{ item.total }}
            </el-form-item>
          </div>
          <el-form-item label="来源：" prop="">
            {{ optionCome[detailData.put.source - 1].name }}
          </el-form-item>
          <el-form-item label="凭证号码：" prop="">
            {{ detailData.put.voucher_number }}
          </el-form-item>
          <el-form-item label="采购批次：" prop="">
            {{ detailData.put.bacth }}
          </el-form-item>
          <el-form-item label="产地（厂家）：" prop="">
            {{ detailData.put.factory }}
          </el-form-item>
          <el-form-item label="单价：" prop="">
            {{ detailData.put.unit_price }}
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
import { reactive, ref, toRefs, computed } from 'vue'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { ArrowRight } from '@element-plus/icons-vue'
import { postAddInstrument } from '@/service/instrument-manage/add-instrument-warehouse/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'

import { accountStatus } from '@/service/login/login'

import { getAll } from '@service/equiment-standard/type-manage/index'
import { AllTypeChildren } from '@service/equiment-standard/type-manage/types'

import { getLaboratoryList } from '@/service/instrument-manage/equ-manage/index'

import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { units } from '@/service/equ-manage/add-equ-warehouse/index'

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

const dataMap = reactive({
  detailShow: false,
  ruleForm: {
    base: {
      number: '',
      asset_number: '',
      name: '',
      specification: '',
      cost_type: 1,
      is_group: 1,
      info: '',
      category: [],
      norm: '',
      unit: '',
      number_year: 1,
      number_year_unit: '',
      subject: [],
      url: '',
      is_must: 1,
      type: 1,
      unit_price: 0,
      total: 0
    },
    put: {
      location: [{ store_id: '', number_plies: '', school_laboratory_id: '', total: 0 }],
      level: 1,
      source: 1,
      voucher_number: '',
      bacth: '',
      factory: '',
      unit_price: 0,
      user_name: '',
      asset_number: '',
      number: '',
      specification: ''
    }
  },
  detailData: {
    base: {
      number: '',
      asset_number: '',
      name: '',
      specification: '',
      cost_type: 1,
      is_group: 1,
      info: '',
      category: '',
      norm: '',
      unit: '',
      number_year: 0,
      number_year_unit: '',
      subject: '2,9',
      url: '',
      is_must: 0,
      type: 1
    },
    put: {
      location: [
        {
          number_plies: 0,
          total: 0,
          school_laboratory_name: '',
          store_name: ''
        }
      ],
      source: 1,
      voucher_number: '',
      bacth: '',
      factory: '',
      unit_price: 0,
      asset_number: '',
      number: ''
    }
  },
  allType: Array<AllTypeChildren>(),
  casProps: {
    value: 'id',
    label: 'title',
    emitPath: false,
    multiple: true,
    checkStrictly: true
  },
  optionsLaboratory: Array<{ id: number; title: string }>(),
  storeListBody: [Array<{ id: number; title: string; number_plies: number }>()],
  optionPliesBody: [Array<{ value: number; name: string }>()]
})

let { detailShow, ruleForm, detailData, allType, casProps, optionsLaboratory, storeListBody, optionPliesBody } =
  toRefs(dataMap)

getLaboratoryList({ subject: store.state.login.userInfo.subject_id || '' }).then((res) => {
  optionsLaboratory.value = res.data.data
})

// const optionSubject = [...store.state.common.subjectArr]

const getData = (id: number | string, index: number, item: any) => {
  ;(item.store_id = ''), (item.number_plies = ''), (optionPliesBody.value[index] = [])
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    storeListBody.value[index] = res.data
  })
}

const getAllType = () => {
  getAll({ type: 1 }).then((res) => {
    allType.value = res.data
    // allType.value = getTreeData(res.data)
  })
}

getAllType()

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

const setPlies = (index: number, item: any) => {
  item.number_plies = ''
  optionPliesBody.value[index] = optionPlies.value(
    storeListBody.value[index],
    ruleForm.value.put.location[index].store_id
  )
}

const addPlace = () => {
  const obj = { ...ruleForm.value.put.location[ruleForm.value.put.location.length - 1] }
  obj.school_laboratory_id = ''
  obj.store_id = ''
  obj.number_plies = ''
  ruleForm.value.put.location.push(obj)
}

// let optionSubjectName = computed(() => {
//   let arr: string[] = detailData.value.base.subject.split(',')
//   let returnArr = Array<string>()
//   arr.forEach((e) => {
//     optionSubject.forEach((i) => {
//       if (Number(e) === i.id) {
//         returnArr.push(i.name)
//       }
//     })
//   })
//   return returnArr.join(',')
// })

let optionCategoryName = computed(() => {
  let arr: string[] = detailData.value.base.category?.split(',')
  let returnArr = Array<string>()
  const getTreeString = (data: any[]) => {
    for (let i = 0; i < data.length; i++) {
      if (arr.includes(data[i].id.toString())) {
        returnArr.push(data[i].title)
      }
      if (data[i].children) {
        getTreeString(data[i].children)
      }
    }
  }
  getTreeString(allType.value)
  return returnArr.join(',')
})

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: number | string) => {
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

const fileData = reactive({
  token: store.state.login.userInfo.token
})

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
  ],
  unit: [
    {
      required: true,
      message: '请输入单位',
      trigger: 'blur'
    }
  ],
  cost_type: [
    {
      required: true,
      message: '请选择价值分类',
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
      accountStatus({ type: 1 }).then((res) => {
        if (res.data !== 3) {
          ElMessage({
            type: 'warning',
            message: '期初建帐结束后可用，请检查仪器期初建帐信息'
          })
          return
        }
        let errorCount = 0
        ruleForm.value.put.location.forEach((e) => {
          if (e.school_laboratory_id === '' || !e.total) {
            errorCount = 1
          }
        })
        if (errorCount === 1) {
          ElMessage({
            type: 'warning',
            message: '请检查并填写入库位置以及数量'
          })
          return
        }
        if (!ruleForm.value.put.unit_price) {
          ElMessage({
            type: 'warning',
            message: '请检查并填写单价'
          })
          return
        }
        let total = 0
        ruleForm.value.put.location.forEach((e, i) => {
          total += parseInt(e.total as any)
        })
        postAddInstrument({
          base: {
            ...ruleForm.value.base,
            category: ruleForm.value.base.category.join(','),
            subject: ruleForm.value.base.subject.join(','),
            unit_price: ruleForm.value.put.unit_price,
            total: total
          },
          put: {
            ...ruleForm.value.put,
            number: ruleForm.value.base.number,
            asset_number: ruleForm.value.base.asset_number
          }
        }).then((res) => {
          if (res.code === 10) {
            detailShow.value = true
            ruleForm.value = {
              base: {
                number: '',
                asset_number: '',
                name: '',
                specification: '',
                cost_type: 1,
                is_group: 1,
                info: '',
                category: [],
                norm: '',
                unit: '',
                number_year: 1,
                number_year_unit: '',
                subject: [],
                url: '',
                is_must: 1,
                type: 1,
                unit_price: 0,
                total: 0
              },
              put: {
                location: [{ store_id: '', number_plies: '', school_laboratory_id: '', total: 0 }],
                level: 1,
                source: 1,
                voucher_number: '',
                bacth: '',
                factory: '',
                unit_price: 0,
                user_name: '',
                asset_number: '',
                number: '',
                specification: ''
              }
            }
            detailData.value = res.data
          }
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
  margin-top: 10px;
  display: flex;

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
        width: 90%;

        .el-input__inner {
          width: 100%;
        }
      }

      :deep(.el-select) {
        width: 90%;

        .el-input {
          width: 100%;

          .el-input__inner {
            width: 100%;
            height: 30px !important;
          }
        }
      }

      :deep(.el-cascader) {
        width: 90%;

        .el-input {
          width: 100%;

          .el-input__inner {
            width: 100%;
            height: 30px !important;
          }
        }
      }

      .el-select-30 {
        width: 30%;

        .el-input {
          width: 100%;

          .el-input__inner {
            width: 100%;
            height: 30px !important;
          }
        }
      }

      .green {
        cursor: pointer;
      }

      .use-year {
        :deep(.el-input) {
          width: 90%;

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
