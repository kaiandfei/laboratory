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
                  <div class="name">负责企业</div>
                  <div>
                    {{ repairRegistrationList.factory }}
                  </div>
                </div>
                <div class="line">
                  <div class="name">开始时间</div>
                  <div>{{ repairRegistrationList.create_time }}</div>
                </div>

                <div class="line">
                  <div class="name">预计完成时间：</div>
                  <div>{{ repairRegistrationList.plan_end_time }}</div>
                </div>

                <div class="line">
                  <div class="name">损坏情况</div>
                  <div>{{ repairRegistrationList.desc }}</div>
                </div>
                <div class="line">
                  <div class="name">照片说明</div>
                  <div v-for="(item, index) in repairRegistrationList.pic" :key="index">
                    <img :src="item.url_path" class="img-size" />
                  </div>
                </div>
                <div class="line list">
                  <div class="name">维修保养仪器位置及数量清单：</div>
                  <div v-for="item in repairRegistrationList.list" :key="item.id" class="value">
                    {{ item.name }}
                    {{ '(' + item.asset_number + ')' }}
                    {{ item.laboratory_name }}
                    {{ item.store_name ? item.store_name + '第' + item.number_plies + '层' : '' }}
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
                  <div class="name">维修保养状态</div>
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
                  <div class="name">未维修保养完成仪器清单</div>
                  <div v-for="item in repairRegistrationList.nuReturn" :key="item.id" class="value">
                    {{ item.asset_number }}
                    {{ item.name }}
                    {{ item.unReturnNum + '个' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="title1">维修保养完成仪器位置及数量清单</div>
        <div class="tableArea">
          <el-table
            :data="repairRegistrationList.returnList"
            style="width: 100%"
            :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
            default-expand-all
            row-key="id"
            :tree-props="{ children: 'detail', hasChildren: 'hasChildren' }"
          >
            <el-table-column label="学校编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <!-- <el-table-column label="批次" prop="bacth">
              <template #default="scope">
                <input v-if="!scope.row.detail" style="width: 100%" v-model="scope.row.bacth" />
                <span v-if="scope.row.detail">{{ scope.row.bacth }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="仪器库" prop="laboratory_id">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select
                    v-model="scope.row.laboratory_id"
                    @change="getData(scope.row.laboratory_id, scope.$index, scope.row)"
                  >
                    <option
                      v-for="item in optionsLaboratory"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
                <div v-if="scope.row.detail">{{ scope.row.laboratory_name }}</div>
              </template>
            </el-table-column>
            <el-table-column label="仪器柜" prop="store_id">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select v-model="scope.row.store_id" @change="handleStoreIdChange(scope.row)">
                    <option
                      v-for="item in optionStore(storeListBox[scope.$index])"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
                <div v-if="scope.row.detail">{{ scope.row.store_name || '/' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="层数" prop="number_plies">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select v-model="scope.row.number_plies">
                    <option
                      v-for="item in optionPlies(storeListBox[scope.$index], scope.row.store_id || 1)"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
                <div v-if="scope.row.detail">
                  {{ scope.row.number_plies ? '第' + scope.row.number_plies + '层' : '/' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="unReturnNum">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <input type="number" style="width: 100%" v-model="scope.row.total" @input="showWarning1 = false" />
                </div>
                <div v-if="scope.row.detail">{{ scope.row.unReturnNum }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <div v-if="scope.row.detail" style="color: green; cursor: pointer" @click="addRepairList(scope.row.id)">
                  新增维修
                </div>
                <div
                  v-if="!scope.row.detail"
                  style="color: green; cursor: pointer"
                  @click="deleteList(scope.row.id, scope.row.Pid)"
                >
                  删除
                </div>
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
            <div v-show="showWarning1" class="warning">超过数量，无法保存</div>
            <div class="buttonArea">
              <el-button type="info" style="width: 150px" @click="cancel(1)">取消</el-button>
              <el-button type="primary" style="width: 150px" @click="commit(1)">保存</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="registrationStatus === 2">
        <div class="topArea">
          <div class="base-box-detail">
            <div class="base-box">
              <div class="fl">
                <div class="line">
                  <div class="name is-must-div">类型:</div>
                  <div>
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

                <div class="line">
                  <div class="name is-must-div">报废理由</div>
                  <div>
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
                <div class="line">
                  <div class="name is-must-div">处理方式</div>
                  <div>
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
                <div class="line">
                  <div class="name">备注</div>
                  <div>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 3 }"
                      v-model="scrapRegistrationList.desc"
                    ></el-input>
                  </div>
                </div>
                <div class="line">
                  <div class="name">关联借单号：</div>
                  <div>{{ scrapRegistrationList.source_record_number }}</div>
                </div>
              </div>
              <div class="fr">
                <div class="line list">
                  <div class="name">图片：</div>
                  <div>
                    <el-upload
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
              </div>
            </div>
          </div>
        </div>
        <div class="title2">损耗、报废仪器信息</div>
        <div class="repairInfo" v-for="(item, index) in scrapRegistrationList.list" :key="index">
          <div class="title">
            <span>{{ item.asset_number }}</span>
            <span style="margin-left: 10px">{{ item.name }}</span>
            <span style="margin-left: 10px">
              {{
                item.store_name
                  ? item.laboratory_name + ' ' + item.store_name + ' ' + '第' + item.number_plies + '层'
                  : item.laboratory_name
              }}
            </span>
            <span style="margin-left: 10px">{{ item.num + '个' }}</span>
          </div>
          <div class="addArea">
            <div class="infoTitle">数量：</div>
            <div class="inputArea">
              <div class="input">
                <el-input v-model.number="item.total" @focus="showWarning2 = false">
                  <!-- <template #prepend>
                    <el-select style="width: 150px" v-model="item.bacth">
                      <el-option v-for="k in optionBatch" :key="k.id" :label="k.label" :value="k.value"></el-option>
                    </el-select>
                  </template> -->
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="right">
            <div v-show="showWarning2" class="warning">超过数量，无法保存</div>
            <div class="buttonArea">
              <el-button type="primary" style="width: 150px" @click="cancel(2)">取消</el-button>
              <el-button type="primary" style="width: 150px" @click="commit(2)">保存</el-button>
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
import {
  getRepairFinishData,
  getLaboratoryList,
  storeByLaboratory,
  postRepairFinishInfo,
  postScrapRegistrationList
} from '@/service/instrument-manage/repairRegistration/index'
import {
  repairFinishData,
  postRepairRegistrationData,
  scrapRegistrationData
} from '@/service/instrument-manage/repairRegistration/types'
import { ElMessage } from 'element-plus'

let props = defineProps({ repairShow: Boolean, selectID: { type: Number, required: true } })
let { repairShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let repairState = ref(false)
let registrationStatus = ref(1)
let title = ref('维修完成登记')
const showWarning1: any = ref(false)
const showWarning2: any = ref(false)
const store = useStore()

repairState.value = repairShow.value
const dataMap = reactive({
  repairRegistrationList: repairFinishData,
  repairInfo: postRepairRegistrationData,
  scrapRegistrationList: scrapRegistrationData,
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
  optionBatch: [
    {
      id: 1,
      value: 1,
      label: '2021.03.21'
    },
    {
      id: 2,
      value: 2,
      label: '2021.04.21'
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
  optionBatch,
  storeListBox,
  optionsLaboratory,
  scrapRegistrationList,
  repairInfo,
  optionType2,
  optionScope,
  optionDisposal
} = toRefs(dataMap)

const initData = () => {
  getRepairFinishData({ id: selectID.value }).then((res) => {
    scrapRegistrationList.value.list = []
    repairRegistrationList.value = res.data
    repairRegistrationList.value.returnList = []
    scrapRegistrationList.value.source_record_number = res.data.record_number

    if (res.data.nuReturn) {
      res.data.nuReturn.forEach((item) => {
        scrapRegistrationList.value.list.push({
          id: item.id,
          record_id: item.record_id,
          store_id: item.store_id,
          hardware_number: item.asset_number,
          asset_number: item.asset_number,
          name: item.name,
          specification: item.specification,
          bacth: item.bacth,
          total: item.unReturnNum,
          laboratory_id: item.laboratory_id,
          instrument_id: item.instrument_id,
          number_plies: item.number_plies,
          laboratory_name: item.laboratory_name,
          store_name: item.store_name,
          type: 1,
          num: item.unReturnNum
        })
      })

      repairRegistrationList.value.nuReturn.forEach((item) => {
        repairRegistrationList.value.returnList.push(Object.assign(item, { detail: [] }))
      })
    }
    console.log(repairRegistrationList.value.returnList)
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

const getData = (ID: number, index: number, row: any) => {
  row.store_id = ''
  row.number_plies = ''
  storeByLaboratory({ id: ID }).then((res) => {
    storeListBox.value[index] = res.data
  })
}
const handleStoreIdChange = (row: any) => {
  row.number_plies = ''
}

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

//新增维修完成
const addRepairList = (id: number) => {
  let index = 0
  repairRegistrationList.value.returnList.forEach((item, pot) => {
    if (id === item.id) {
      index = pot
    }
  })

  let count = 0
  repairRegistrationList.value.returnList[index].detail.forEach((item) => {
    count = count + Number(item.total)
  })
  if (count > repairRegistrationList.value.returnList[index].total) {
    ElMessage('数量超出')
    return
  }

  if (count === 0) {
    repairRegistrationList.value.returnList[index].repairStatus = 1
  } else {
    if (count === repairRegistrationList.value.returnList[index].total) {
      repairRegistrationList.value.returnList[index].repairStatus = 3
    } else {
      repairRegistrationList.value.returnList[index].repairStatus = 2
    }
  }

  repairRegistrationList.value.returnList[index].detail.push({
    id: repairRegistrationList.value.returnList[index].id,
    Pid: repairRegistrationList.value.returnList[index].detail.length,
    laboratory_name: repairRegistrationList.value.returnList[index].laboratory_name,
    store_name: repairRegistrationList.value.returnList[index].store_name,
    bacth: '',
    laboratory_id: repairRegistrationList.value.returnList[index].laboratory_id,
    store_id: repairRegistrationList.value.returnList[index].store_id,
    number_plies: repairRegistrationList.value.returnList[index].number_plies,
    total: 0
  })

  let pot = 0
  for (var i = 0; i <= index; i++) {
    pot = pot + repairRegistrationList.value.returnList[i].detail.length + 1
  }

  getData(
    repairRegistrationList.value.returnList[index].laboratory_id,
    pot - 1,
    repairRegistrationList.value.returnList[index]
  )
}

//删除维修完成清单数据
const deleteList = (id: number, pot: number) => {
  let index = 0
  repairRegistrationList.value.returnList.forEach((item, position) => {
    if (id === item.id) {
      index = position
    }
  })

  repairRegistrationList.value.returnList[index].detail.splice(pot - 1, 1)
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
      break
    case 2:
      title.value = '维修转损耗、报废登记'
      break
  }
}

const commit = (status: number) => {
  repairInfo.value.list = []
  let count1 = 0,
    count2 = 0
  if (status === 1) {
    for (const key in repairRegistrationList.value.returnList) {
      repairRegistrationList.value.returnList[key].detail.forEach((item) => {
        repairInfo.value.list.push({
          id: repairRegistrationList.value.returnList[key].id,
          school_instrument_id: repairRegistrationList.value.returnList[key].instrument_id,
          laboratory_id: item.laboratory_id,
          store_id: item.store_id,
          number_plies: item.number_plies,
          bacth: item.bacth,
          total: repairRegistrationList.value.nuReturn[key].total,
          return_total: item.total
        })
      })

      if (repairRegistrationList.value.returnList[key].repairStatus === 1) {
        count1++
      } else {
        if (repairRegistrationList.value.returnList[key].repairStatus === 3) {
          count2++
        }
      }

      if (count1 === repairRegistrationList.value.list[key].total) {
        repairRegistrationList.value.status = 1
      } else {
        if (count2 === repairRegistrationList.value.list[key].total) {
          repairRegistrationList.value.status = 3
        } else {
          repairRegistrationList.value.status = 2
        }
      }
    }

    repairInfo.value.id = repairRegistrationList.value.id

    postRepairFinishInfo(repairInfo.value).then((res: any) => {
      if (res.code === 10) {
        showWarning1.value = false
        emit('back')
        registrationStatus.value = 1
      } else {
        showWarning1.value = true
        return
      }
    })
  } else {
    let flag = scrapRegistrationList.value.list.some((item) => item.total > 0)
    if (!flag) {
      ElMessage({
        type: 'warning',
        message: '损耗、报废数量不能为零或小于零'
      })
      return
    }
    console.log(scrapRegistrationList.value)
    let count = 0
    scrapRegistrationList.value.list.forEach((item) => {
      if (item.total > item.num) {
        count++
      }
    })

    if (count > 0) {
      showWarning2.value = true
    } else {
      showWarning2.value = false
      postScrapRegistrationList(scrapRegistrationList.value).then((res) => {
        if (res.code === 10) {
          emit('back')
          registrationStatus.value = 1
        } else {
          return
        }
      })
    }
  }
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
</script>
<style lang="scss" scoped>
:deep(.repair-dialog) {
  margin-top: 50px;
  padding: 0 0 20px 0;
  overflow: hidden;

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

    .titleArea {
      width: 20%;
      height: 5%;
      float: left;
      margin-left: 8%;
      justify-content: left;
      display: flex;
      font-weight: 600;
    }

    .detailArea {
      width: 90%;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #05c65d;

      .nav {
        width: 50%;
        min-height: 30px;
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
          height: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
        }

        .imgArea {
          margin-top: 20px;
          // width: 80px;
          // height: 80px;
          float: left;
        }

        .imgArea {
          .uploadImg {
            .el-upload--picture-card {
              width: 100px;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
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
      padding: 20px 0;
      width: 90%;
      display: flex;
      align-items: center;
      float: left;
      margin-left: 5%;
      margin-bottom: 10px;
      border: 1px solid #05c65d;

      .title {
        float: left;
        margin-left: 20px;
      }

      .addArea {
        height: 70%;
        float: left;

        .infoTitle {
          height: 40px;
          float: left;
          display: flex;
          align-items: center;
          margin-left: 20px;
        }

        .inputArea {
          width: 30%;
          float: left;
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
      border: 1px solid #05c65d;
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
            border: 1px solid #05c65d;
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
