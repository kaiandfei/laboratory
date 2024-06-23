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
          <div class="status-box">
            借单状态:
            <span>
              {{ returnRegistrationList.is_finish === 1 ? '已结束' : '未结束' }}
            </span>
          </div>
          <div class="base-box-detail">
            <div class="base-box">
              <div class="fl">
                <div class="line">
                  <div class="name">*出借人：</div>
                  <div>{{ returnRegistrationList.lender }}</div>
                </div>

                <div class="line">
                  <div class="name">*出借时间：</div>
                  <div>{{ returnRegistrationList.start_time }}</div>
                </div>

                <div class="line">
                  <div class="name">预计归还时间：</div>
                  <div>{{ returnRegistrationList.plan_end_time }}</div>
                </div>
                <div class="line">
                  <div class="name">出借备注：</div>
                  <div>{{ returnRegistrationList.lend_desc }}</div>
                </div>

                <div class="line list">
                  <div class="name">出借仪器位置及数量清单：</div>
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
              </div>
              <div class="fr">
                <div class="line">
                  <div class="name">实际归还时间：</div>
                  <div>
                    <el-date-picker
                      v-model="returnRegistrationList.end_time"
                      type="date"
                      placeholder="选择日期"
                      value-format="YYYY-MM-DD"
                      size="mini"
                    ></el-date-picker>
                  </div>
                </div>
                <div class="line">
                  <div class="name">归还备注：</div>
                  <div>
                    <el-input v-model="returnRegistrationList.return_tips"></el-input>
                  </div>
                </div>
                <div class="line">
                  <div class="name">归还状态：</div>
                  <div>
                    <span v-show="returnRegistrationList.status === 1">{{ '未归还' }}</span>
                    <span v-show="returnRegistrationList.status === 2">{{ '部分归还' }}</span>
                    <span v-show="returnRegistrationList.status === 3">{{ '全部归还' }}</span>
                  </div>
                </div>
                <div class="line list">
                  <div class="name">未归还仪器清单：</div>
                  <div v-for="item in returnRegistrationList.nuReturn" :key="item.id" class="value">
                    {{ item.asset_number }}
                    {{ item.name }}
                    {{ item.unReturnNum + '个' }}
                  </div>
                </div>
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
            <!-- <el-table-column label="批次" prop="bacth">
              <template #default="scope">
                <input v-if="!scope.row.detail" style="width: 100%" v-model="scope.row.bacth" />
                <span v-if="scope.row.detail">{{ scope.row.bacth }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="仪器库" prop="laboratory_id">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select v-model="scope.row.laboratory_id" @change="getData(scope.row.laboratory_id, scope.$index)">
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
                <div v-if="scope.row.detail" style="color: green; cursor: pointer" @click="addreturnList(scope.row)">
                  新增归还
                </div>
                <div
                  v-if="!scope.row.detail"
                  style="color: green; cursor: pointer"
                  @click="deleteList(scope.row.id, scope.row.$index)"
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
          <div class="base-box-detail">
            <div class="base-box">
              <div class="fl">
                <div class="line">
                  <div class="name is-must-div">类型:</div>
                  <div>
                    <el-select v-model="repairRegistrationList.mode">
                      <el-option
                        v-for="item in optionType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>

                <div class="line">
                  <div class="name is-must-div">负责企业：</div>
                  <div>
                    <el-input v-model="repairRegistrationList.factory"></el-input>
                  </div>
                </div>
                <div class="line">
                  <div class="name is-must-div">开始时间：</div>
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
                <div class="line">
                  <div class="name is-must-div">预计完成时间：</div>
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
                <div class="line">
                  <div class="name">损坏情况：</div>
                  <div>
                    <el-input v-model="repairRegistrationList.desc"></el-input>
                  </div>
                </div>
                <div class="line">
                  <div class="name">关联借单号：</div>
                  <div>{{ repairRegistrationList.source_record_number }}</div>
                </div>
              </div>
              <div class="fr">
                <div class="line list">
                  <div class="name">图片：</div>
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
              </div>
            </div>
          </div>
        </div>
        <div class="title2">维修保养仪器信息</div>
        <div class="repairInfo" v-for="item in repairRegistrationList.list" :key="item.id">
          <div class="title">
            <span>{{ item.asset_number }}</span>
            <span style="margin-left: 10px">{{ item.name }}</span>
            <span style="margin-left: 10px">{{ item.loanTotal + '个' }}</span>
            <span style="margin-left: 10px">{{ item.laboratory_name }}</span>
            <span style="margin-left: 10px">{{ item.store_name }}</span>
            <span style="margin-left: 10px">{{ item.number_plies + '层' }}</span>
          </div>
          <div class="addArea">
            <div class="infoTitle">数量：</div>
            <div class="inputArea">
              <div class="input">
                <el-input v-model="item.realNum" type="number">
                  <!-- <template #prepend>
                    <el-select style="width: 150px" v-model="item.bacth">
                      <el-option v-for="k in optionBatch" :key="k.id" :label="k.label" :value="k.value"></el-option>
                    </el-select>
                  </template> -->
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
                  <div class="name is-must-div">报废金额</div>
                  <div>
                    <el-input
                      type="text"
                      @input="inputChange(scrapRegistrationList.price, 3)"
                      v-model="scrapRegistrationList.price"
                    ></el-input>
                  </div>
                </div>
                <div class="line">
                  <div class="name">备注</div>
                  <div>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 2 }"
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
              </div>
            </div>
          </div>
        </div>
        <div class="title2">损耗、报废仪器信息</div>
        <div class="repairInfo" v-for="item in scrapRegistrationList.list" :key="item.id">
          <div class="title">
            <span>{{ item.asset_number }}</span>
            <span style="margin-left: 10px">{{ item.name }}</span>
            <span style="margin-left: 10px">{{ item.loanTotal + '个' }}</span>
            <span style="margin-left: 10px">{{ item.laboratory_name }}</span>
            <span style="margin-left: 10px">{{ item.store_name }}</span>
            <span style="margin-left: 10px">{{ item.number_plies + '层' }}</span>
          </div>
          <div class="addArea">
            <div class="infoTitle">数量：</div>
            <div class="inputArea">
              <div class="input">
                <el-input v-model="item.realNum" type="number">
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
          <div class="base-box-detail">
            <div class="base-box">
              <div class="fl">
                <div class="line">
                  <div class="name is-must-div">损坏人:</div>
                  <div>
                    <el-select v-model="damageRegistrationList.damage_id">
                      <el-option
                        v-for="item in optionUser"
                        :key="item.id"
                        :label="item.username"
                        :value="item.id"
                        @click="damagerSel(item)"
                      ></el-option>
                    </el-select>
                  </div>
                </div>

                <div class="line">
                  <div class="name">损坏情况与原因</div>
                  <div>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 2 }"
                      v-model="damageRegistrationList.desc"
                    ></el-input>
                  </div>
                </div>
                <div class="line">
                  <div class="name">赔偿人</div>
                  <div>
                    <el-select v-model="damageRegistrationList.repay_id">
                      <el-option
                        v-for="item in optionUser"
                        :key="item.id"
                        :label="item.username"
                        :value="item.id"
                        @click="payerSel(item)"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="line">
                  <div class="name">赔偿金额</div>
                  <div>
                    <el-input
                      v-model="damageRegistrationList.repay_price"
                      @input="inputChange(damageRegistrationList.repay_price, 4)"
                    ></el-input>
                  </div>
                </div>
                <div class="line">
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
                <div class="line">
                  <div class="name">赔偿说明</div>
                  <div>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 2 }"
                      v-model="damageRegistrationList.repay_desc"
                    ></el-input>
                  </div>
                </div>
                <div class="line">
                  <div class="name">关联借单号：</div>
                  <div>{{ damageRegistrationList.source_record_number }}</div>
                </div>
              </div>
              <div class="fr">
                <div class="line list">
                  <div class="name">图片：</div>
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
              </div>
            </div>
          </div>
        </div>
        <div class="title2">损坏仪器信息</div>
        <div class="repairInfo" v-for="item in damageRegistrationList.list" :key="item.id">
          <div class="title">
            <span>{{ item.asset_number }}</span>
            <span style="margin-left: 10px">{{ item.name }}</span>
            <span style="margin-left: 10px">{{ item.loanTotal + '个' }}</span>
            <span style="margin-left: 10px">{{ item.laboratory_name }}</span>
            <span style="margin-left: 10px">{{ item.store_name }}</span>
            <span style="margin-left: 10px">{{ item.number_plies + '层' }}</span>
          </div>
          <div class="addArea">
            <div class="infoTitle">数量：</div>
            <div class="inputArea">
              <div class="input">
                <el-input v-model="item.realNum" type="number">
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
import {
  getReturnRegistrationList,
  getLaboratoryList,
  getTeacherList,
  storeByLaboratory,
  postReturnInfo,
  postRepairRegistrationList,
  postScrapRegistrationList,
  postDamageRegistrationList
} from '@/service/instrument-manage/lendRegistration/index'
import { ElMessage } from 'element-plus'

let props = defineProps({ returnShow: Boolean, selectInstrumentId: { type: Number, required: true } })
let { returnShow, selectInstrumentId } = toRefs(props)
let emit = defineEmits(['back'])
let returnState = ref(false)
let registrationStatus = ref(1)
let title = ref('归还登记')
let commitStatus = ref(true)
const store = useStore()
const optionUser: any = ref([])
const subjectID: any = ref(0)
const school_id: any = ref(0)

school_id.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.school_id
subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

returnState.value = returnShow.value
const dataMap = reactive({
  returnRegistrationList: returnRegistrationData,
  repairRegistrationList: repairRegistrationData,
  scrapRegistrationList: scrapRegistrationData,
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
const initRepairRegistrationList = ref<any>([])
const initScrapRegistrationList = ref<any>([])
const initDamageRegistrationList = ref<any>([])
const initData = () => {
  getReturnRegistrationList({ id: selectInstrumentId.value }).then((res) => {
    returnRegistrationList.value.returnList = []

    repairRegistrationList.value.list = []
    scrapRegistrationList.value.list = []
    damageRegistrationList.value.list = []
    returnRegistrationList.value = res.data

    repairRegistrationList.value.source_record_number = res.data.record_number
    scrapRegistrationList.value.source_record_number = res.data.record_number
    damageRegistrationList.value.source_record_number = res.data.record_number

    if (res.data.nuReturn) {
      let newRes = res.data.nuReturn.filter((item) => item.unReturnNum !== 0)
      newRes.forEach((item) => {
        repairRegistrationList.value.list.push(
          Object.assign(item, { loanTotal: item.unReturnNum, realNum: item.unReturnNum })
        )
        scrapRegistrationList.value.list.push(
          Object.assign(item, { loanTotal: item.unReturnNum, realNum: item.unReturnNum })
        )
        damageRegistrationList.value.list.push(
          Object.assign(item, { loanTotal: item.unReturnNum, realNum: item.unReturnNum })
        )
      })
      initRepairRegistrationList.value = JSON.parse(JSON.stringify(repairRegistrationList.value.list))
      initScrapRegistrationList.value = JSON.parse(JSON.stringify(scrapRegistrationList.value.list))
      initDamageRegistrationList.value = JSON.parse(JSON.stringify(damageRegistrationList.value.list))

      storeListBox.value.length = returnRegistrationList.value.returnList.length

      returnRegistrationList.value.nuReturn.forEach((item) => {
        returnRegistrationList.value.returnList.push(Object.assign(item, { detail: [] }))
      })
    }
  })

  getTeacherList({ id: school_id.value }).then((res) => {
    optionUser.value = res.data
  })
}

const fileData = reactive({
  token: store.state.login.userInfo.token
})

let {
  returnRegistrationList,
  repairRegistrationList,
  optionType,
  scrapRegistrationList,
  damageRegistrationList,
  returnInfo,
  optionType2,
  optionScope,
  optionDisposal,
  storeListBox,
  optionsLaboratory
} = toRefs(dataMap)

returnRegistrationList.value.returnList = []
initData()

getLaboratoryList({ subject: subjectID.value }).then((res) => {
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

const getData = (ID: number, index: number) => {
  storeByLaboratory({ id: ID }).then((res) => {
    storeListBox.value[index] = res.data
  })
}

getData(optionsLaboratory.value[0].value, 1)

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
        repairRegistrationList.value.pic = urlData
        break
      case 3:
        scrapRegistrationList.value.pic = urlData
        break
      case 4:
        damageRegistrationList.value.pic = urlData
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
        repairRegistrationList.value.pic = urlData
        break
      case 3:
        scrapRegistrationList.value.pic = urlData
        break
      case 4:
        damageRegistrationList.value.pic = urlData
        break
    }
  })
}

const registrationChange = (status: number) => {
  registrationStatus.value = status
  // initData()
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
const addreturnList = (data: any) => {
  let count = 0
  let index = 0
  returnRegistrationList.value.returnList.forEach((item, pot) => {
    if (data.id === item.id) {
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
    laboratory_name: data.laboratory_name,
    store_name: data.store_name,
    bacth: data.bacth,
    laboratory_id: data.laboratory_id,
    store_id: data.store_id,
    number_plies: data.number_plies,
    total: 0
  })

  let pot = 0
  for (var i = 0; i <= index; i++) {
    pot = pot + returnRegistrationList.value.returnList[i].detail.length + 1
  }

  getData(data.laboratory_id, pot - 1)
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

// 归还转损耗、报废登记报废金额输入限制
const inputChange = (row: any, type: number) => {
  // eslint-disable-next-line no-useless-escape
  row = row.replace(/[^\d^\.]+/g, '')

  let a = row.length
  let str1
  var str = row
  var len1 = str.substr(0, 1)
  var len2 = str.substr(1, 1)
  // 如果第一位是0，第二位不是点，就用数字把点替换掉
  if (str.length > 1 && len1 == 0 && len2 != '.') {
    str = str.substr(1, 1)
  }
  // 第一位不能是.
  if (len1 == '.') {
    str = ''
  }
  // 限制只能输入一个小数点
  if (str.indexOf('.') != -1) {
    var str_ = str.substr(str.indexOf('.') + 1)
    if (str_.indexOf('.') != -1) {
      str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1)
    }
  }
  var index = str.indexOf('.')
  if (str.slice(index, a).length > 2) {
    str = str.slice(0, index + 3)
  }
  row = str
  if (a > 1) {
    str1 = row.slice(a - 1, a)
  } else {
    str1 = row
  }
  // eslint-disable-next-line no-useless-escape
  str1 = str1.replace(/[^\d^\.]+/g, '')
  if (a > 1) {
    row = row.replace(row.slice(a - 1, a), str1)
  } else {
    row = str1
  }
  if (row.length > 12) {
    row = row.slice(0, 12)
  }
  if (type === 3) {
    scrapRegistrationList.value.price = row
  }

  if (type === 4) {
    damageRegistrationList.value.repay_price = row
  }
}

// 获取损坏用户id对应的用户名
const damagerSel = (data: any) => {
  damageRegistrationList.value.damage_man = data.username
}

// 获取赔偿人用户id对应的用户名
const payerSel = (data: any) => {
  damageRegistrationList.value.repay_man = data.username
}

const commit = (status: number, list: any) => {
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
          school_laboratory_id: item.laboratory_id,
          store_id: item.store_id,
          number_plies: item.number_plies,
          bacth: item.bacth,
          total: returnRegistrationList.value.nuReturn[key].unReturnNum,
          return_total: item.total
        })
      })
      if (returnInfo.value.list.length === 0) {
        ElMessage({
          type: 'warning',
          message: '请新增归还后保存'
        })
        return
      }

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
    returnInfo.value.end_time = returnRegistrationList.value.end_time

    postReturnInfo(returnInfo.value).then((res) => {
      if (res.code === 10) {
        emit('back')
        registrationStatus.value = 1
      } else {
        return
      }
    })
  } else {
    if (status === 2) {
      if (
        !repairRegistrationList.value ||
        !repairRegistrationList.value.factory ||
        !repairRegistrationList.value.start_time ||
        !repairRegistrationList.value.plan_end_time
      ) {
        ElMessage({
          type: 'warning',
          message: '请检查必填项'
        })
        return
      }
      let flag = repairRegistrationList.value.list.some((item) => item.realNum > 0)
      if (!flag) {
        ElMessage({
          type: 'warning',
          message: '归还数量不能为零或小于零'
        })
        return
      }
      for (let i = 0; i < initRepairRegistrationList.value.length; i++) {
        if (initRepairRegistrationList.value[i].unReturnNum < Number(repairRegistrationList.value.list[i].realNum)) {
          ElMessage({
            type: 'warning',
            message: '归还数量不能大于实际数量'
          })
          return
        }
        if (Number(repairRegistrationList.value.list[i].realNum) < 0) {
          ElMessage({
            type: 'warning',
            message: '归还数量不能小于零'
          })
          return
        }
      }
      let every = repairRegistrationList.value.list.every((item) => Number(item.realNum) === item.unReturnNum)
      repairRegistrationList.value.list.forEach((item) => {
        delete item.damage_total
        delete item.return_total
        delete item.scrap_total
        if (Number(item.realNum) < item.unReturnNum) {
          repairRegistrationList.value.status = 2
        } else if (every) {
          repairRegistrationList.value.status = 3
        }
      })
      // repairRegistrationList.value.status = calculateReturn(repairRegistrationList.value.list)
      repairRegistrationList.value.list.forEach((e, i) => {
        e.total = Number(e.realNum)
      })
      console.log(1145, repairRegistrationList.value)

      postRepairRegistrationList(repairRegistrationList.value).then((res) => {
        if (res.code === 10) {
          emit('back')
          registrationStatus.value = 1
          initData()
        } else {
          return
        }
      })
    }

    if (status === 3) {
      if (
        !scrapRegistrationList.value ||
        !scrapRegistrationList.value.cause ||
        !scrapRegistrationList.value.process_mode ||
        scrapRegistrationList.value.price === ''
      ) {
        ElMessage({
          type: 'warning',
          message: '请检查必填项'
        })
        return
      }
      let flag = scrapRegistrationList.value.list.some((item) => item.realNum > 0)
      if (!flag) {
        ElMessage({
          type: 'warning',
          message: '归还数量不能为零或小于零'
        })
        return
      }
      for (let i = 0; i < initScrapRegistrationList.value.length; i++) {
        if (initScrapRegistrationList.value[i].unReturnNum < scrapRegistrationList.value.list[i].realNum) {
          ElMessage({
            type: 'warning',
            message: '归还数量不能大于实际数量'
          })
          return
        }
        if (Number(scrapRegistrationList.value.list[i].realNum) < 0) {
          ElMessage({
            type: 'warning',
            message: '归还数量不能小于零'
          })
          return
        }
      }
      let every = scrapRegistrationList.value.list.every((item) => Number(item.realNum) === item.unReturnNum)
      scrapRegistrationList.value.list.forEach((item) => {
        delete item.damage_total
        delete item.return_total
        delete item.scrap_total
        if (Number(item.realNum) < item.unReturnNum) {
          scrapRegistrationList.value.status = 2
        } else if (every) {
          scrapRegistrationList.value.status = 3
        }
      })
      // scrapRegistrationList.value.status = calculateReturn(scrapRegistrationList.value.list)
      scrapRegistrationList.value.price = Number(scrapRegistrationList.value.price)
      scrapRegistrationList.value.list.forEach((e, i) => {
        scrapRegistrationList.value.list[i].total = Number(scrapRegistrationList.value.list[i].realNum)
      })
      console.log(1235, scrapRegistrationList.value)
      postScrapRegistrationList(scrapRegistrationList.value).then((res) => {
        if (res.code === 10) {
          emit('back')
          registrationStatus.value = 1
          initData()
        } else {
          return
        }
      })
    }

    if (status === 4) {
      if (!damageRegistrationList.value.damage_id) {
        ElMessage({
          type: 'warning',
          message: '请检查必填项'
        })
        return
      }
      let flag = damageRegistrationList.value.list.some((item) => item.realNum > 0)
      if (!flag) {
        ElMessage({
          type: 'warning',
          message: '归还数量不能为零或小于零'
        })
        return
      }
      for (let i = 0; i < initDamageRegistrationList.value.length; i++) {
        if (initDamageRegistrationList.value[i].unReturnNum < damageRegistrationList.value.list[i].realNum) {
          ElMessage({
            type: 'warning',
            message: '归还数量不能大于实际数量'
          })
          return
        }
        if (Number(damageRegistrationList.value.list[i].realNum) < 0) {
          ElMessage({
            type: 'warning',
            message: '归还数量不能小于零'
          })
          return
        }
      }
      let every = damageRegistrationList.value.list.every((item) => Number(item.realNum) === item.unReturnNum)
      damageRegistrationList.value.list.forEach((item) => {
        delete item.damage_total
        delete item.return_total
        delete item.scrap_total
        if (Number(item.realNum) < item.unReturnNum) {
          damageRegistrationList.value.status = 2
        } else if (every) {
          damageRegistrationList.value.status = 3
        }
      })
      // damageRegistrationList.value.status = calculateReturn(damageRegistrationList.value.list)
      damageRegistrationList.value.repay_price = Number(damageRegistrationList.value.repay_price)
      damageRegistrationList.value.list.forEach((e, i) => {
        damageRegistrationList.value.list[i].total = Number(damageRegistrationList.value.list[i].realNum)
      })
      console.log(1284, damageRegistrationList.value)

      postDamageRegistrationList(damageRegistrationList.value).then((res) => {
        if (res.code === 10) {
          emit('back')
          registrationStatus.value = 1
          initData()
        } else {
          return
        }
      })
    }
  }
  // setTimeout(() => {
  //   initData()
  // }, 500)
}

const calculateReturn = (data: any) => {
  let returnNum = 0
  let unReturnNum = 0
  let status = 2
  data.forEach((e: any) => {
    if (Number(e.loanTotal) === Number(e.unReturnNum)) {
      returnNum++
      console.log('添加数据')
    } else {
      if (e.total === 0) {
        unReturnNum++
      }
    }
  })
  if (returnNum === data.length) {
    status = 3
  }
  if (unReturnNum === data.length) {
    status = 1
  }
  return status
}

const cancel = (status: number) => {
  if (status === 1) {
    emit('back')
  } else {
    registrationStatus.value = 1
    title.value = '归还登记'
  }
  // initData()
}
</script>
<style lang="scss" scoped>
:deep(.return-dialog) {
  margin-top: 50px;
  padding: 0 0 10px 0;
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
      width: 40%;
      height: 5%;
      float: left;
      margin-left: 8%;
      justify-content: left;
      display: flex;
      font-weight: 600;
    }

    .base-box-detail {
      .base-box {
        .el-input {
          width: 200px;

          .el-input__inner {
            width: 100%;
          }
        }

        .el-textarea {
          width: 200px;

          .el-textarea__inner {
            width: 100%;
          }
        }

        .el-select {
          width: 200px;

          .el-input {
            width: 100%;

            .el-input__inner {
              width: 100%;
            }
          }
        }
      }
    }

    .detailArea {
      width: 90%;
      float: left;
      margin-left: 5%;
      padding: 10px 0;
      border: 1px solid #05c65d;
      box-sizing: border-box;

      .nav {
        width: 50%;
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
          font-weight: 600;
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
          width: 100%;
          align-items: center;
          justify-content: left;
        }

        .valueArea {
          float: left;
          margin-left: 20px;
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
      height: 80px;
      border: 1px solid #05c65d;

      .title {
        float: left;
        margin-left: 20px;
        margin-top: 30px;
      }

      .addArea {
        width: 40%;
        height: 70%;
        margin-top: 20px;
        margin-left: 5%;
        float: left;

        .infoTitle {
          height: 40px;
          float: left;
          display: flex;
          align-items: center;
        }

        .inputArea {
          width: 60%;
          float: left;
          height: 45%;

          .el-input {
            width: 200px;

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
        height: 100%;
        float: right;

        .warning {
          color: red;
          float: right;
        }

        .buttonArea {
          height: 60%;
          margin-top: 10%;
        }
      }
    }
  }
}
</style>
