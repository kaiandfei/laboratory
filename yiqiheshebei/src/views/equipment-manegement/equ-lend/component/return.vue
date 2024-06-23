<template>
  <div>
    <el-dialog
      custom-class="return-dialog"
      v-model="returnState"
      width="50%"
      :title="title"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div v-show="registrationStatus === 1">
        <div class="topArea">
          <div class="titleArea">
            借单状态:
            <span style="margin-left: 30%; color: #ee9a59">
              {{ returnRegistrationList.is_del === 1 ? '已结束' : '未结束' }}
            </span>
          </div>
          <div class="detailArea">
            <div class="nav" style="width: 50%">
              <div class="name">*出借人：</div>
              <div>{{ returnRegistrationList.lender }}</div>
            </div>
            <div class="nav" style="float: right">
              <div class="name">实际归还时间：</div>
              <div style="width: 50%; float: left; justify-content: left; display: flex">
                <el-date-picker
                  v-model="returnRegistrationList.end_time"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY/MM/DD"
                  size="mini"
                ></el-date-picker>
              </div>
            </div>
            <div class="nav" style="width: 50%">
              <div class="name">*出借时间：</div>
              <div>{{ returnRegistrationList.start_time }}</div>
            </div>
            <div class="nav" style="float: right; height: 30%">
              <div class="name">归还备注：</div>
              <div style="width: 50%; float: right">
                <el-input v-model="returnRegistrationList.return_tips"></el-input>
              </div>
            </div>
            <div class="nav" style="width: 50%">
              <div class="name">预计归还时间：</div>
              <div>{{ returnRegistrationList.plan_end_time }}</div>
            </div>
            <div class="nav" style="width: 50%">
              <div class="name">出借备注：</div>
              <div>{{ returnRegistrationList.lend_desc }}</div>
            </div>
            <div class="nav" style="float: right">
              <div class="name">归还状态：</div>
              <div>
                <span v-show="returnRegistrationList.status === 1">{{ '未归还' }}</span>
                <span v-show="returnRegistrationList.status === 2">{{ '部分归还' }}</span>
                <span v-show="returnRegistrationList.status === 3">{{ '全部归还' }}</span>
              </div>
            </div>
            <div class="nav" style="width: 50%; height: 35%; display: block">
              <div class="name" style="width: 60%; height: 20%">出借仪器位置及数量清单：</div>
              <div class="valueArea">
                <div v-for="item in returnRegistrationList.list" :key="item.id" class="value">
                  {{ item.name }}
                  {{ '(' + item.asset_number + ')' }}
                  {{ item.laboratory_name }}
                  {{ item.store_name }}
                  {{ '第' + item.number_plies + '层' }}
                  {{ item.total + '个' }}
                </div>
              </div>
            </div>
            <div class="nav" style="float: right; height: 35%; display: block">
              <div class="name" style="width: 60%; height: 20%">未归还仪器清单：</div>
              <div
                v-for="item in returnRegistrationList.nuReturn"
                :key="item.id"
                class="value"
                style="margin-left: 20px"
              >
                {{ item.asset_number }}
                {{ item.name }}
                {{ item.unReturnNum + '个' }}
              </div>
            </div>
          </div>
        </div>
        <div class="title1">归还仪器位置及数量清单</div>
        <div class="tableArea">
          <el-table
            :data="returnRegistrationList.returnList"
            style="width: 100%"
            max-height="200px"
            :header-cell-style="{ background: '#DCECE3', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
            default-expand-all
            row-key="id"
            :tree-props="{ children: 'detail', hasChildren: 'hasChildren' }"
          >
            <el-table-column label="学校编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="批次" prop="bacth">
              <template #default="scope">
                <input v-if="!scope.row.detail" style="width: 100%" v-model="scope.row.bacth" />
                <span v-if="scope.row.detail">{{ scope.row.bacth }}</span>
              </template>
            </el-table-column>
            <el-table-column label="仪器库" prop="laboratory_id">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select
                    v-model="scope.row.laboratory_id"
                    @change="getData(scope.row.laboratory_id, scope.row.id, scope.$index)"
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
                  <select v-model="scope.row.store_id">
                    <option
                      v-for="item in optionStore(storeListBox[scope.$index])"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
                <div v-if="scope.row.detail">{{ scope.row.store_name }}</div>
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
                <div v-if="scope.row.detail">{{ '第' + scope.row.number_plies + '层' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="unReturnNum">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <input type="number" style="width: 100%" v-model="scope.row.total" />
                </div>
                <div v-if="scope.row.detail">{{ scope.row.unReturnNum }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <div v-if="scope.row.detail" style="color: green; cursor: pointer" @click="addreturnList(scope.row.id)">
                  新增归还
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
              <div class="button" @click="registrationChange(2)">归还转维修保养</div>
              <div class="button" style="margin-left: 5%" @click="registrationChange(3)">归还转报废</div>
              <div class="button" style="margin-left: 5%" @click="registrationChange(4)">归还转损坏赔偿</div>
            </div>
          </div>
          <div class="right">
            <div class="warning" v-show="commitStatus === false">超过数量，无法保存</div>
            <div class="buttonArea">
              <el-button type="info" style="width: 150px" @click="cancel(1)">取消</el-button>
              <el-button type="primary" style="width: 150px" @click="commit(1, returnRegistrationList)">保存</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="registrationStatus === 2">
        <div class="topArea">
          <div class="detailArea">
            <div class="nav">
              <div class="name" style="width: 50%">类型:</div>
              <div style="width: 70%; float: right">
                <el-select v-model="repairRegistrationList.type">
                  <el-option
                    v-for="item in optionType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="nav" style="float: right; width: 40%; height: 80%; display: flex; align-items: flex-start">
              <div class="name" style="float: left; height: 10%">图片：</div>
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
            <div class="nav">
              <div class="name" style="width: 50%">负责企业：</div>
              <div>
                <el-input v-model="repairRegistrationList.factory"></el-input>
              </div>
            </div>
            <div class="nav">
              <div class="name" style="width: 50%">开始时间：</div>
              <div>
                <el-date-picker
                  type="date"
                  v-model="repairRegistrationList.start_time"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
            <div class="nav">
              <div class="name" style="width: 50%">预计完成时间：</div>
              <div>
                <el-date-picker
                  type="date"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  v-model="repairRegistrationList.plan_end_time"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
            <div class="nav">
              <div class="name">损坏情况：</div>
              <div>
                <el-input v-model="repairRegistrationList.desc"></el-input>
              </div>
            </div>
            <div class="nav">
              <div class="name">关联借单号：</div>
              <div>{{ repairRegistrationList.source_record_number }}</div>
            </div>
          </div>
        </div>
        <div class="title2">维修保养仪器信息</div>
        <div class="repairInfo" v-for="item in repairRegistrationList.list" :key="item.id">
          <div class="title">
            <span>{{ item.asset_number }}</span>
            <span style="margin-left: 10px">{{ item.name }}</span>
            <span style="margin-left: 10px">{{ item.loanTotal + '个' }}</span>
          </div>
          <div class="addArea">
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
            <!-- <div style="cursor: pointer; color: skyBlue" @click="addRepairBatch(item.id, 1)">新增批次与数量</div> -->
          </div>
        </div>
        <div class="bottom" style="margin-top: 20px">
          <div class="right">
            <!-- <div class="warning">超过数量，无法保存</div> -->
            <div class="buttonArea">
              <el-button type="primary" style="width: 150px" @click="cancel(2)">取消</el-button>
              <el-button type="primary" style="width: 150px" @click="commit(2, repairRegistrationList)">保存</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="registrationStatus === 3">
        <div class="topArea">
          <div class="detailArea">
            <div class="nav">
              <div class="name" style="width: 50%">类型:</div>
              <div style="width: 70%; float: right">
                <el-select v-model="scrapRegistrationList.type">
                  <el-option
                    v-for="item in optionType2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="nav" style="float: right; width: 40%; height: 80%; display: flex; align-items: flex-start">
              <div class="name" style="float: left; height: 10%">图片：</div>
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
            <div class="nav">
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
            <div class="nav">
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
            <div class="nav" style="height: 35%; align-items: flex-start; display: flex">
              <div class="name">备注</div>
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  v-model="scrapRegistrationList.desc"
                ></el-input>
              </div>
            </div>
            <div class="nav">
              <div class="name">关联借单号：</div>
              <div>{{ scrapRegistrationList.source_record_number }}</div>
            </div>
          </div>
        </div>
        <div class="title2">损耗、报废仪器信息</div>
        <div class="repairInfo" v-for="item in scrapRegistrationList.list" :key="item.id">
          <div class="title">
            <span>{{ item.asset_number }}</span>
            <span style="margin-left: 10px">{{ item.name }}</span>
            <span style="margin-left: 10px">{{ item.loanTotal + '个' }}</span>
          </div>
          <div class="addArea">
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
          </div>
        </div>
        <div class="bottom" style="margin-top: 20px">
          <div class="right">
            <!-- <div class="warning">超过数量，无法保存</div> -->
            <div class="buttonArea">
              <el-button type="primary" style="width: 150px" @click="cancel(3)">取消</el-button>
              <el-button type="primary" style="width: 150px" @click="commit(3, scrapRegistrationList)">保存</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="registrationStatus === 4">
        <div class="topArea">
          <div class="detailArea" style="height: 350px">
            <div class="nav">
              <div class="name" style="width: 50%">*损坏人:</div>
              <div style="width: 70%; float: right">
                <el-select v-model="damageRegistrationList.damage_man">
                  <el-option
                    v-for="item in optionUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="nav" style="float: right; width: 40%; height: 80%; display: flex; align-items: flex-start">
              <div class="name" style="float: left; height: 10%">图片：</div>
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
            <div class="nav" style="height: 20%; align-items: flex-start; display: flex">
              <div class="name" style="width: 50%">*损坏情况与原因</div>
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                  v-model="damageRegistrationList.desc"
                ></el-input>
              </div>
            </div>
            <div class="nav">
              <div class="name" style="width: 50%">赔偿人</div>
              <div style="width: 70%; float: right">
                <el-select v-model="damageRegistrationList.repay_man">
                  <el-option
                    v-for="item in optionUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="nav">
              <div class="name">赔偿金额</div>
              <div>
                <el-input v-model="damageRegistrationList.repay_price"></el-input>
              </div>
            </div>
            <div class="nav">
              <div class="name">赔偿时间</div>
              <div>
                <el-date-picker
                  type="date"
                  v-model="damageRegistrationList.repay_time"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
            <div class="nav" style="height: 20%; align-items: flex-start; display: flex">
              <div class="name" style="width: 50%">赔偿说明</div>
              <div>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                  v-model="damageRegistrationList.repay_desc"
                ></el-input>
              </div>
            </div>
            <div class="nav" style="float: right; margin-right: 65%">
              <div class="name">关联借单号：</div>
              <div>{{ damageRegistrationList.source_record_number }}</div>
            </div>
          </div>
        </div>
        <div class="title2">损坏仪器信息</div>
        <div class="repairInfo" v-for="item in damageRegistrationList.list" :key="item.id">
          <div class="title">
            <span>{{ item.asset_number }}</span>
            <span style="margin-left: 10px">{{ item.name }}</span>
            <span style="margin-left: 10px">{{ item.loanTotal + '个' }}</span>
          </div>
          <div class="addArea">
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
          </div>
        </div>
        <div class="bottom" style="margin-top: 20px">
          <div class="right">
            <!-- <div class="warning">超过数量，无法保存</div> -->
            <div class="buttonArea">
              <el-button type="primary" style="width: 150px" @click="cancel(4)">取消</el-button>
              <el-button type="primary" style="width: 150px" @click="commit(4, damageRegistrationList)">保存</el-button>
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
  returnRegistrationData,
  returnInfoData,
  repairRegistrationData,
  scrapRegistrationData,
  damageRegistrationData
} from '@/service/instrument-manage/lendRegistration//types'
// import {
//   getReturnRegistrationList,
//   getLaboratoryList,
//   storeByLaboratory,
//   postReturnInfo,
//   postRepairRegistrationList,
//   postScrapRegistrationList,
//   postDamageRegistrationList
// } from '@/service/equ-manage/lendEqu/index'
import { ElMessage } from 'element-plus'

let props = defineProps({ returnShow: Boolean, selectInstrumentId: { type: Number, required: true } })
let { returnShow, selectInstrumentId } = toRefs(props)
let emit = defineEmits(['back'])
let returnState = ref(false)
let registrationStatus = ref(1)
let title = ref('归还登记')
let commitStatus = ref(true)
const store = useStore()

returnState.value = returnShow.value
const dataMap = reactive({
  returnRegistrationList: returnRegistrationData,
  // repairRegistrationList: {
  //   type: '维修',
  //   responsible_enterprise: '',
  //   startTime: '',
  //   endTime: '',
  //   damageDetail: '',
  //   debit_number: '20209303030',
  //   url: '',
  //   instrumentList: [
  //     {
  //       id: '1',
  //       school_number: '60001',
  //       instrument_name: '烧杯',
  //       number: 60,
  //       data: [
  //         {
  //           id: 1,
  //           batch: '',
  //           number: ''
  //         },
  //         {
  //           id: 2,
  //           batch: '',
  //           number: ''
  //         }
  //       ]
  //     },
  //     {
  //       id: '2',
  //       school_number: '60002',
  //       instrument_name: '烧杯',
  //       number: 30,
  //       data: [
  //         {
  //           id: 1,
  //           batch: '',
  //           number: ''
  //         },
  //         {
  //           id: 2,
  //           batch: '',
  //           number: ''
  //         }
  //       ]
  //     }
  //   ]
  // },
  repairRegistrationList: repairRegistrationData,
  // scrapRegistrationList: {
  //   type: '损耗',
  //   scapeDetail: '损耗严重，无法修复',
  //   disposal_method: '实验室留用',
  //   detail: '',
  //   debit_number: '20209303030',
  //   url: '',
  //   instrumentList: [
  //     {
  //       id: '1',
  //       school_number: '60001',
  //       instrument_name: '烧杯',
  //       number: 60,
  //       data: [
  //         {
  //           id: 1,
  //           batch: '',
  //           number: ''
  //         },
  //         {
  //           id: 2,
  //           batch: '',
  //           number: ''
  //         }
  //       ]
  //     },
  //     {
  //       id: '2',
  //       school_number: '60002',
  //       instrument_name: '烧杯',
  //       number: 30,
  //       data: [
  //         {
  //           id: 1,
  //           batch: '',
  //           number: ''
  //         },
  //         {
  //           id: 2,
  //           batch: '',
  //           number: ''
  //         }
  //       ]
  //     }
  //   ]
  // },
  scrapRegistrationList: scrapRegistrationData,
  // damageRegistrationList: {
  //   damageUser: '张老师',
  //   damageDetail: '',
  //   indemnitor: '张老师',
  //   indemnity: '',
  //   compensationTime: '',
  //   compensationDetail: '',
  //   debit_number: '2021.1212',
  //   instrumentList: [
  //     {
  //       id: '1',
  //       school_number: '60001',
  //       instrument_name: '烧杯',
  //       number: 60,
  //       data: [
  //         {
  //           id: 1,
  //           batch: '',
  //           number: ''
  //         },
  //         {
  //           id: 2,
  //           batch: '',
  //           number: ''
  //         }
  //       ]
  //     },
  //     {
  //       id: '2',
  //       school_number: '60002',
  //       instrument_name: '烧杯',
  //       number: 30,
  //       data: [
  //         {
  //           id: 1,
  //           batch: '',
  //           number: ''
  //         },
  //         {
  //           id: 2,
  //           batch: '',
  //           number: ''
  //         }
  //       ]
  //     }
  //   ]
  // },
  damageRegistrationList: damageRegistrationData,
  returnInfo: returnInfoData,
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
      value: '2021.02.21',
      label: '2021.03.21'
    },
    {
      id: 2,
      value: '2021.03.21',
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
      value: 1
    },
    {
      label: '李老师',
      value: 2
    }
  ],
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
  ]
})

const initData = () => {
  // getReturnRegistrationList({ id: selectInstrumentId.value }).then((res) => {
  //   returnRegistrationList.value.returnList = []
  //   repairRegistrationList.value.list = []
  //   scrapRegistrationList.value.list = []
  //   damageRegistrationList.value.list = []
  //   returnRegistrationList.value = res.data
  //   repairRegistrationList.value.source_record_number = res.data.record_number
  //   scrapRegistrationList.value.source_record_number = res.data.record_number
  //   damageRegistrationList.value.source_record_number = res.data.record_number
  //   res.data.nuReturn.forEach((item) => {
  //     repairRegistrationList.value.list.push(Object.assign(item, { loanTotal: item.total }))
  //     scrapRegistrationList.value.list.push(Object.assign(item, { loanTotal: item.total }))
  //     damageRegistrationList.value.list.push(Object.assign(item, { loanTotal: item.total }))
  //   })
  //   storeListBox.value.length = returnRegistrationList.value.returnList.length
  //   returnRegistrationList.value.nuReturn.forEach((item) => {
  //     returnRegistrationList.value.returnList.push(Object.assign(item, { detail: [] }))
  //   })
  // })
}

const fileData = reactive({
  token: store.state.login.userInfo.token
})

let {
  returnRegistrationList,
  repairRegistrationList,
  optionType,
  optionBatch,
  scrapRegistrationList,
  damageRegistrationList,
  returnInfo,
  optionType2,
  optionScope,
  optionUser,
  optionDisposal,
  storeListBox,
  optionsLaboratory
} = toRefs(dataMap)

returnRegistrationList.value.returnList = []
initData()
console.log(returnRegistrationList.value.returnList)

// getLaboratoryList().then((res) => {
//   let arr = Array<{
//     value: number
//     name: string
//   }>()

//   res.data.data.forEach((e) => {
//     const obj = {
//       value: e.id,
//       name: e.title
//     }
//     arr.push(obj)
//   })
//   optionsLaboratory.value = arr
// })

const getData = (ID: number, rowId: number, index: number) => {
  // storeByLaboratory({ id: ID }).then((res) => {
  //   storeListBox.value[index] = res.data
  // })
}

getData(optionsLaboratory.value[0].value, 1, 1)

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

const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  const list = [...fileList]
  const urlData: string[] = []
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

    switch (registrationStatus.value) {
      case 2:
        repairRegistrationList.value.url = urlData
        break
      case 3:
        scrapRegistrationList.value.url = urlData
        break
      case 4:
        damageRegistrationList.value.url = urlData
        break
    }
  })
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const list = [...fileList]
  const urlData: string[] = []
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
    switch (registrationStatus.value) {
      case 2:
        repairRegistrationList.value.url = urlData
        break
      case 3:
        scrapRegistrationList.value.url = urlData
        break
      case 4:
        damageRegistrationList.value.url = urlData
        break
    }
  })
}

const registrationChange = (status: number) => {
  registrationStatus.value = status
  initData()
  switch (status) {
    case 1:
      title.value = '归还登记'
      break
    case 2:
      title.value = '归还转维修保养登记'
      break
    case 3:
      title.value = '归还转损耗、报废登记'
      break
    case 4:
      title.value = '归还转损坏赔偿登记'
      break
  }
}

//新增归还清单
const addreturnList = (id: number) => {
  let count = 0
  let index = 0
  returnRegistrationList.value.returnList.forEach((item, pot) => {
    if (id === item.id) {
      index = pot
    }
  })
  returnRegistrationList.value.returnList[index].detail.forEach((item) => {
    count = count + Number(item.total)
  })
  if (count > returnRegistrationList.value.returnList[index].total) {
    ElMessage('数量超出')
    return
  }

  if (count === 0) {
    returnRegistrationList.value.returnList[index].returnStatus = 1
  } else {
    if (count === returnRegistrationList.value.returnList[index].total) {
      returnRegistrationList.value.returnList[index].returnStatus = 3
    } else {
      returnRegistrationList.value.returnList[index].returnStatus = 2
    }
  }

  returnRegistrationList.value.returnList[index].detail.push({
    id: returnRegistrationList.value.returnList[index].id,
    Pid: returnRegistrationList.value.returnList[index].detail.length,
    laboratory_name: '',
    store_name: '',
    bacth: '',
    laboratory_id: 1,
    store_id: 1,
    number_plies: 1,
    total: 0
  })
}

//删除归还清单数据
const deleteList = (id: number, pot: number) => {
  let index = 0
  returnRegistrationList.value.returnList.forEach((item, position) => {
    if (id === item.id) {
      index = position
    }
  })
  returnRegistrationList.value.returnList[index].detail.splice(pot - 1, 1)
}

// const addRepairBatch = (id: number, type: number) => {
//   console.log(id, type)
//   console.log(returnRegistrationList.value.returnList)
//   console.log(repairRegistrationList.value)
// }

const commit = (status: number, list: any) => {
  console.log(list)
  commitStatus.value = true
  let returnState = 1
  returnInfo.value.list = []
  let count1 = 0,
    count2 = 0
  if (status === 1) {
    for (const key in returnRegistrationList.value.returnList) {
      returnRegistrationList.value.returnList[key].detail.forEach((item) => {
        returnInfo.value.list.push({
          id: returnRegistrationList.value.returnList[key].id,
          school_instrument_id: returnRegistrationList.value.returnList[key].school_instrument_id,
          laboratory_id: item.laboratory_id,
          store_id: item.store_id,
          number_plies: item.number_plies,
          bacth: item.bacth,
          total: returnRegistrationList.value.nuReturn[key].unReturnNum,
          return_total: item.total
        })
      })

      if (returnRegistrationList.value.returnList[key].returnStatus === 1) {
        count1++
      } else {
        if (returnRegistrationList.value.returnList[key].returnStatus === 3) {
          count2++
        }
      }

      if (count1 === returnRegistrationList.value.list[key].total) {
        returnState = 1
      } else {
        if (count2 === returnRegistrationList.value.list[key].total) {
          returnState = 3
        } else {
          returnState = 2
        }
      }
    }

    returnInfo.value.id = returnRegistrationList.value.id
    returnInfo.value.status = returnState
    returnInfo.value.return_tips = returnRegistrationList.value.return_tips

    // postReturnInfo(returnInfo.value).then((res) => {
    //   if (res.code === 10) {
    //     emit('back')
    //     registrationStatus.value = 1
    //   } else {
    //     return
    //   }
    // })
  } else {
    if (status === 2) {
      console.log(repairRegistrationList.value)
      // postRepairRegistrationList(repairRegistrationList.value).then((res) => {
      //   if (res.code === 10) {
      //     emit('back')
      //     registrationStatus.value = 1
      //   } else {
      //     return
      //   }
      // })
    }

    if (status === 3) {
      // postScrapRegistrationList(scrapRegistrationList.value).then((res) => {
      //   if (res.code === 10) {
      //     emit('back')
      //     registrationStatus.value = 1
      //   } else {
      //     return
      //   }
      // })
    }

    if (status === 4) {
      // postDamageRegistrationList(damageRegistrationList.value).then((res) => {
      //   if (res.code === 10) {
      //     emit('back')
      //     registrationStatus.value = 1
      //   } else {
      //     return
      //   }
      // })
    }
  }
  initData()
}

const cancel = (status: number) => {
  if (status === 1) {
    emit('back')
  } else {
    registrationStatus.value = 1
    title.value = '归还登记'
  }
  initData()
}
</script>
<style lang="scss" scoped>
:deep(.return-dialog) {
  margin-top: 50px;
  height: 800px;

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
      width: 40%;
      height: 5%;
      float: left;
      margin-left: 8%;
      justify-content: left;
      display: flex;
    }

    .detailArea {
      width: 90%;
      height: 300px;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #05c65d;

      .nav {
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
          height: 40%;
          width: 100%;
          align-items: center;
          justify-content: left;
        }

        .valueArea {
          float: left;
          margin-left: 20px;
          height: 80%;
          width: 80%;
        }

        .el-input {
          width: 100%;

          .el-input__inner {
            width: 100%;
          }
        }
      }
    }

    .title1 {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #05c65d;
      font-size: 20px;
      float: left;
      margin: 10px 0 10px 0;
    }

    .title2 {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #05c65d;
      font-size: 20px;
      float: left;
      margin: 10px 0 10px 0;
    }

    .repairInfo {
      width: 90%;
      float: left;
      margin-left: 5%;
      margin-bottom: 10px;
      height: 100px;
      border: 1px solid #05c65d;

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
            border-radius: 10px;
            border: 1px solid #05c65d;
            color: #05c65d;
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
