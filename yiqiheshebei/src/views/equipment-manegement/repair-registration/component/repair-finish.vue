<template>
  <div>
    <el-dialog
      custom-class="repair-dialog"
      v-model="repairState"
      width="50%"
      :title="title"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div v-show="registrationStatus === 1">
        <div class="topArea">
          <div class="status-box">
            维修保养单状态:
            <span>{{ repairRegistrationList.status === 3 ? '已结束' : '未结束' }}</span>
          </div>
          <div class="base-box-detail">
            <div class="base-box">
              <div class="fl">
                <div class="line">
                  <div class="name">类型：</div>
                  <div>{{ repairRegistrationList.mode === 1 ? '维修' : '保养' }}</div>
                </div>
                <div class="line">
                  <div class="name">负责企业：</div>
                  <div>
                    {{ repairRegistrationList.factory }}
                  </div>
                </div>
                <div class="line">
                  <div class="name">开始时间：</div>
                  <div>{{ repairRegistrationList.create_time }}</div>
                </div>
                <div class="line">
                  <div class="name">预计完成时间：</div>
                  <div>{{ repairRegistrationList.plan_end_time }}</div>
                </div>
                <div class="line">
                  <div class="name">损坏情况：</div>
                  <div>{{ repairRegistrationList.desc }}</div>
                </div>
                <div class="line list">
                  <div class="name">照片说明：</div>
                  <img
                    v-for="(item, index) in repairRegistrationList.pic"
                    :key="index"
                    :src="item.url_path"
                    class="img-size"
                  />
                </div>
                <div class="line list">
                  <div class="name">维修保养仪器位置及数量清单：</div>
                  <div v-for="item in repairRegistrationList.list" :key="item.id">
                    {{ item.name }}
                    {{ item.bacth + ' ' }}
                    {{ '(' + item.asset_number + ')' }}
                    {{
                      item.store_name
                        ? item.laboratory_name + ' ' + item.store_name + '第' + item.number_plies + '层'
                        : item.laboratory_name
                    }}
                    {{ item.total + '个' }}
                  </div>
                </div>
              </div>
              <div class="fr">
                <div class="line">
                  <div class="name">维修保养单号：</div>
                  <div>{{ repairRegistrationList.record_number }}</div>
                </div>
                <div class="line">
                  <div class="name">维修保养状态：</div>
                  <span v-show="repairRegistrationList.mode === 1 && repairRegistrationList.status === 1">维修中</span>
                  <span v-show="repairRegistrationList.mode === 1 && repairRegistrationList.status === 2">
                    维修部分完成
                  </span>
                  <span v-show="repairRegistrationList.mode === 1 && repairRegistrationList.status === 3">
                    维修完成
                  </span>
                  <span v-show="repairRegistrationList.mode === 2 && repairRegistrationList.status === 1">保养中</span>
                  <span v-show="repairRegistrationList.mode === 2 && repairRegistrationList.status === 2">
                    保养部分完成
                  </span>
                  <span v-show="repairRegistrationList.mode === 2 && repairRegistrationList.status === 3">
                    保养完成
                  </span>
                </div>
                <div class="line list">
                  <div class="name">未维修保养完成仪器清单：</div>
                  <div v-for="item in repairRegistrationList.nuReturn.filter((e) => e.residue !== 0)" :key="item.id">
                    {{ item.asset_number }}
                    {{ item.name }}
                    {{ item.bacth + ' ' }}
                    {{ item.unReturnNum + '个' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="title1">维修保养未完成仪器位置及数量清单</div>
        <div class="tableArea">
          <el-table
            :data="repairRegistrationList.nuReturn.filter((e) => e.residue !== 0)"
            style="width: 100%"
            max-height="200px"
            :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          >
            <el-table-column label="分类编号" prop="hardware_number"></el-table-column>
            <el-table-column label="资产编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="仪器库" prop="laboratory_id">
              <template #default="scope">
                <div>
                  <select v-model="scope.row.laboratory_id" @change="handleLaboratoryIdChange(scope.row)">
                    <option
                      v-for="item in optionsLaboratory"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="仪器柜" prop="store_id">
              <template #default="scope">
                <div>
                  <select v-model="scope.row.store_id" @change="handleStoreIdChange(scope.row)">
                    <option
                      v-for="item in optionStore(storeListBox[scope.$index])"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="层数" prop="number_plies">
              <template #default="scope">
                <div>
                  <select v-model="scope.row.number_plies">
                    <option
                      v-for="item in optionPlies(storeListBox[scope.$index], scope.row.store_id || 1)"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <div style="color: green; cursor: pointer" @click="deleteList(scope.$index)">删除</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="title">如果有其它处理方式，请选择进行登记</div>
            <div class="selectArea">
              <div class="button" style="margin-left: 5%" @click="registrationChange(2)">转报废</div>
            </div>
          </div>
          <div class="right">
            <!-- <div class="warning">超过数量，无法保存</div> -->
            <div class="buttonArea">
              <el-button type="info" style="width: 30%" @click="cancel(1)">取消</el-button>
              <el-button type="primary" style="width: 30%" @click="commit(1)">保存</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="registrationStatus === 2">
        <div class="topArea">
          <div class="detailArea">
            <div class="nav2">
              <div class="name" style="width: 50%">类型:</div>
              <div style="width: 70%; float: right">
                <el-select v-model="scrapRegistrationList.mode">
                  <el-option
                    v-for="item in optionType2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="nav2" style="float: right; width: 50%; height: 80%; display: flex; align-items: flex-start">
              <div class="name" style="float: left; width: 60px; height: 10%">图片：</div>
              <div class="imgArea">
                <el-upload
                  class="uploadImg"
                  ref="upload"
                  :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
                  :data="fileData"
                  name="image"
                  :limit="3"
                  list-type="picture-card"
                  :on-success="uploadSuccess"
                  :on-remove="handleRemove"
                  accept=".jpg,.png,.jpeg"
                >
                  <span>+点击上传</span>
                </el-upload>
              </div>
            </div>
            <div class="nav2">
              <div class="name" style="width: 50%">报废理由</div>
              <div style="width: 70%; float: right">
                <el-select v-model="scrapRegistrationList.cause">
                  <el-option
                    v-for="item in optionScope"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="nav2">
              <div class="name" style="width: 50%">处理方式</div>
              <div style="width: 70%; float: right">
                <el-select v-model="scrapRegistrationList.process_mode">
                  <el-option
                    v-for="item in optionDisposal"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="nav2">
              <div class="name" style="width: 50%">报废金额</div>
              <div>
                <el-input
                  type="number"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  v-model="scrapRegistrationList.price"
                ></el-input>
              </div>
            </div>
            <div class="nav2" style="height: 35%; align-items: flex-start; display: flex">
              <div class="name">备注</div>
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  v-model="scrapRegistrationList.desc"
                ></el-input>
              </div>
            </div>
            <div class="nav2">
              <div class="name">关联借单号：</div>
              <div>{{ scrapRegistrationList?.source_record_number }}</div>
            </div>
          </div>
        </div>
        <div class="title2">选择损耗、报废仪器信息</div>
        <div></div>
        <div class="repairInfo">
          <el-checkbox-group v-model="scrapRegistrationList.list">
            <!-- {{ forList.list }} -->
            <el-checkbox v-for="(item, index) in forList" :key="index" :label="item">
              <!-- {{ item + '1' }} -->
              {{ `${item.asset_number},${item.name},${item.total}个` }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- <div class="addArea">
            <div style="float: left; margin-left: 20px">批次与数量：</div>
            <div class="inputArea">
              <div class="input">
                <el-input v-model="item.total">
                  <template #prepend>
                    <el-select style="width: 150px" v-model="item.bacth">
                      <el-option v-for="k in optionBatch" :key="k.id" :label="k.label" :value="k.value"></el-option>
                    </el-select>
                  </template>
                </el-input>
              </div>
            </div>
          </div> -->
        </div>
        <div class="bottom" style="margin-top: 20px">
          <div class="right">
            <!-- <div class="warning">超过数量，无法保存</div> -->
            <div class="buttonArea">
              <el-button type="primary" style="width: 30%" @click="cancel(2)">取消</el-button>
              <el-button type="primary" style="width: 30%" @click="commit(2)">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, computed } from 'vue'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'

import { getLaboratoryList } from '@/service/instrument-manage/equ-manage/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'
import {
  getRepairFinishData,
  postRepairFinishInfo,
  postScrapRegistrationList
} from '@/service/equ-manage/repairRegistration/index'
import {
  repairFinishData,
  postRepairRegistrationData,
  scrapRegistrationData
} from '@/service/equ-manage/repairRegistration/types'
import { ElMessage } from 'element-plus'

let props = defineProps({ repairShow: Boolean, selectID: { type: Number, required: true } })
let { repairShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let repairState = ref(false)
let registrationStatus = ref(1)
let title = ref('维修完成登记')
const store = useStore()

repairState.value = repairShow.value
const dataMap = reactive({
  repairRegistrationList: repairFinishData,
  repairInfo: postRepairRegistrationData,
  scrapRegistrationList: scrapRegistrationData,
  forList: Array<any>(),
  storeListBox: Array<
    {
      id: number
      title: string
      number_plies: number
    }[]
  >(),
  optionsLaboratory: [
    {
      value: 0,
      name: ''
    }
  ],
  optionType: [
    {
      value: 1,
      label: '维修'
    },
    {
      value: 2,
      label: '保养'
    }
  ],
  optionType2: [
    {
      label: '损耗',
      value: 1
    },
    {
      label: '报废',
      value: 2
    }
  ],
  optionScope: [
    {
      label: '仪器超过使用年限，性能已不能达到实验需要的最低要求，且无法修复',
      value: 1
    },
    {
      label: '损坏严重，无法修复',
      value: 2
    },
    {
      label: '主要部件无处购配，无法修复使用',
      value: 3
    },
    {
      label: '修理费昂贵，无修理价值',
      value: 4
    }
  ],
  optionDisposal: [
    {
      label: '实验室留用',
      value: 1
    },
    {
      label: '建立废旧仪器实验室',
      value: 2
    }
  ],
  optionUser: [
    {
      label: '张老师',
      value: '张老师'
    },
    {
      label: '李老师',
      value: '李老师'
    }
  ]
})

const fileData = reactive({
  token: store.state.login.userInfo.token
})

let {
  repairRegistrationList,
  storeListBox,
  optionsLaboratory,
  forList,
  scrapRegistrationList,
  repairInfo,
  optionType2,
  optionScope,
  optionDisposal
} = toRefs(dataMap)

const initData = () => {
  getRepairFinishData({ id: selectID.value }).then((res) => {
    scrapRegistrationList.value.list = []
    forList.value = []
    repairRegistrationList.value = res.data
    scrapRegistrationList.value.source_record_number = res.data.record_number

    res.data.nuReturn.forEach((item, index) => {
      storeByLaboratory({ id: item.laboratory_id }).then((res) => {
        storeListBox.value[index] = res.data
      })
      scrapRegistrationList.value.list.push({
        id: item.id,
        record_id: item.record_id,
        store_id: item.store_id,
        hardware_number: item.asset_number,
        asset_number: item.asset_number,
        name: item.name,
        specification: item.specification,
        bacth: item.bacth,
        total: item.total,
        laboratory_id: item.laboratory_id,
        instrument_id: item.instrument_id,
        school_instrument_id: item.instrument_id,
        number_plies: item.number_plies,
        scrap_total: item.scrap_total,
        type: 2
      })
      forList.value.push({
        id: item.id,
        record_id: item.record_id,
        store_id: item.store_id,
        hardware_number: item.asset_number,
        asset_number: item.asset_number,
        name: item.name,
        specification: item.specification,
        bacth: item.bacth,
        total: item.total,
        laboratory_id: item.laboratory_id,
        instrument_id: item.instrument_id,
        school_instrument_id: item.instrument_id,
        number_plies: item.number_plies,
        scrap_total: item.scrap_total,
        type: 2
      })
    })
    // repairRegistrationList.value.nuReturn.forEach((item) => {})
    // forList.value = JSON.parse(JSON.stringify(scrapRegistrationList.value.list))
    forList.value = forList.value.filter((e) => e.scrap_total !== 1)
  })
}

initData()

getLaboratoryList({ subject: store.state.login.userInfo.subject_id }).then((res) => {
  let arr = Array<{
    value: number
    name: string
  }>()

  res.data.data.forEach((e) => {
    const obj = {
      value: e.id,
      name: e.title
    }
    arr.push(obj)
  })
  optionsLaboratory.value = arr
})

// const getData = (ID: number, rowId: number, index: number) => {
//   storeByLaboratory({ id: ID }).then((res) => {
//     storeListBox.value[index] = res.data
//   })
// }

let optionStore = computed(() => {
  return (list: { id: number; title: string }[]) => {
    let arr = Array<{
      value: number
      name: string
    }>()
    list?.forEach((e) => {
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
    list?.forEach((e) => {
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

//删除维修完成清单数据
const deleteList = (index: number) => {
  repairRegistrationList.value.nuReturn.splice(index, 1)
}

const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
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
    urlData.push(str)
  })

  scrapRegistrationList.value.url = urlData
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
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
    urlData.push(str)
  })
  scrapRegistrationList.value.url = urlData
}

const registrationChange = (status: number) => {
  registrationStatus.value = status
  switch (status) {
    case 1:
      title.value = '维修完成登记'
      scrapRegistrationList.value.list = forList.value
      break
    case 2:
      scrapRegistrationList.value.list = []
      title.value = '维修转损耗、报废登记'
      break
  }
}

const commit = (status: number) => {
  // console.log(612, scrapRegistrationList.value.list)
  repairInfo.value.list = []
  if (status === 1) {
    repairRegistrationList.value.nuReturn.forEach((item) => {
      repairInfo.value.list.push({
        id: item.id,
        school_instrument_id: item.instrument_id,
        laboratory_id: item.laboratory_id,
        store_id: item.store_id,
        number_plies: item.number_plies,
        bacth: item.bacth,
        total: item.total,
        return_total: item.total
      })
    })

    repairInfo.value.id = repairRegistrationList.value.id

    postRepairFinishInfo(repairInfo.value).then((res) => {
      if (res.code === 10) {
        emit('back')
        registrationStatus.value = 1
      } else {
        return
      }
    })
    initData()
  } else {
    if (scrapRegistrationList.value.list.length === 0) {
      ElMessage({ type: 'warning', message: '请选择设备' })
      return
    }
    let status = 2
    if (scrapRegistrationList.value.list.length === forList.value.length) {
      status = 3
    }
    postScrapRegistrationList({ ...scrapRegistrationList.value, status: status }).then((res) => {
      if (res.code === 10) {
        emit('back')
        registrationStatus.value = 1
        ElMessage({ type: 'success', message: '保存成功' })
        scrapRegistrationList.value.price = ''
        scrapRegistrationList.value.desc = ''
      } else {
        scrapRegistrationList.value.list = []
        scrapRegistrationList.value.price = ''
        scrapRegistrationList.value.desc = ''
        return
      }
    })
  }
  // initData()
}

const cancel = (status: number) => {
  if (status === 1) {
    emit('back')
  } else {
    registrationStatus.value = 1
    title.value = '维修保养登记'
  }
  console.log('取消')
}
const handleLaboratoryIdChange = (row: any) => {
  row.store_id = ''
  row.number_plies = ''
}
const handleStoreIdChange = (row: any) => {
  row.number_plies = ''
}
</script>
<style lang="scss" scoped>
:deep(.repair-dialog) {
  margin-top: 50px;
  overflow: hidden;
  padding-bottom: 30px;

  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;

    .title-box {
      display: flex;
      justify-content: space-evenly;
      height: 60px;

      .edit-title {
        width: 24%;
        height: 40px;
        line-height: 40px;
        color: #848484;
        border: #b5b5b5 1px solid;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        cursor: pointer;
      }

      .active-item {
        color: #05c65d;
      }
    }

    .detailArea {
      width: 90%;
      height: 400px;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #848484;

      .nav {
        width: 35%;
        height: 30px;
        float: left;
        align-items: center;
        // justify-content: left;
        display: flex;

        .name {
          float: left;
          width: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
          font-weight: 600;
        }

        .imgArea {
          margin-top: 20px;
          // width: 80px;
          height: 80px;
          float: left;
        }

        .imgArea {
          .uploadImg {
            text-align: left;

            .el-upload--picture-card {
              width: 100px;
              height: 100px;
              line-height: 100px;
            }

            .el-upload-list__item {
              width: 100px;
              height: 100px;
            }
          }
        }

        .value {
          margin: 6px 0;
          display: flex;
          width: 100%;
          align-items: left;
        }

        .valueArea {
          float: left;
          margin-left: 20px;
          height: 80%;
          width: 80%;
        }

        .el-input {
          width: 200px;

          .el-input__inner {
            width: 200px;
          }
        }

        .el-textarea {
          width: 200px;
        }
      }

      .nav2 {
        width: 35%;
        height: 40px;
        float: left;
        align-items: center;
        // justify-content: left;
        display: flex;

        .name {
          float: left;
          width: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
        }

        .imgArea {
          margin-top: 20px;
          // width: 80px;
          // height: 80px;
          text-align: left;
          float: left;
        }

        .imgArea {
          .uploadImg {
            .el-upload--picture-card {
              width: 100px;
              height: 100px;
              line-height: 100px;
            }

            .el-upload-list__item {
              width: 100px;
              height: 100px;
            }
          }
        }

        .value {
          display: flex;
          height: 20%;
          width: 100%;
          align-items: left;
        }

        .valueArea {
          float: left;
          margin-left: 20px;
          width: 80%;
        }

        .el-input {
          width: 200px;

          .el-input__inner {
            width: 200px;
          }
        }

        .el-textarea {
          width: 200px;
        }
      }
    }

    .title1 {
      width: 30%;
      float: left;
      margin: 10px 0 10px 0;
      margin-left: 35%;
    }

    .title2 {
      float: left;
      font-size: 16px;
      margin: 10px 0 10px 0;
      margin-left: 5%;
    }

    .repairInfo {
      width: 90%;
      float: left;
      margin-left: 5%;
      margin-bottom: 10px;
      height: 100px;
      padding-left: 20px;
      text-align: left;
      border: 1px solid #848484;

      .title {
        float: left;
        margin-left: 20px;
        margin-top: 20px;
      }

      .addArea {
        width: 60%;
        height: 70%;
        margin-top: 20px;
        float: left;

        .inputArea {
          width: 60%;
          float: right;
          height: 45%;

          .el-input {
            width: 100%;

            .el-input__inner {
              width: 100%;
            }
          }

          .el-input-group__prepend {
            background-color: #fff;
          }

          .input {
            width: 100%;
            height: 100%;
            float: left;
          }
        }
      }
    }

    .tableArea {
      width: 90%;
      height: 250px;
      float: left;
      margin-left: 5%;
      border: 1px solid #848484;

      .el-table {
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
      }
    }

    .bottom {
      width: 90%;
      margin-left: 5%;
      height: 80px;
      float: left;

      .left {
        width: 50%;
        height: 100%;
        float: left;

        .title {
          width: 80%;
          height: 40%;
          display: flex;
          align-items: center;
        }

        .selectArea {
          width: 90%;
          height: 50%;
          display: flex;
          align-items: center;

          .button {
            height: 80%;
            float: left;
            display: flex;
            cursor: pointer;
            padding: 0 10px 0 10px;
            align-items: center;
            justify-content: center;
            background: rgb(239, 239, 239);
            border: 1px solid green;
            color: green;
          }

          .button:hover {
            height: 80%;
            float: left;
            display: flex;
            cursor: pointer;
            padding: 0 10px 0 10px;
            align-items: center;
            justify-content: center;
            background: rgb(239, 239, 239);
            border: 1px solid skyblue;
            color: skyblue;
          }
        }
      }

      .right {
        width: 40%;
        height: 100%;
        float: right;

        .warning {
          color: red;
          float: right;
        }

        .buttonArea {
          width: 100%;
          height: 60%;
          margin-top: 10%;
        }
      }
    }
  }
}
</style>
