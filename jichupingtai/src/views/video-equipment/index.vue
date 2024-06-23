<template>
  <header>
    <span>智能设备管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>智能设备管理</span>
        <div class="button-box">
          <div class="btn white-btn" @click="downloadExcel">
            <img src="@assets/images/account-school/imp.png" alt="" />
            下载模版
          </div>

          <div class="btn green-btn" @click="importExcel">
            <img src="@assets/images/common/imp.png" alt="" />
            导入所有设备
          </div>
          <input type="file" name="file" id="uploadExcel" @change="changeExcel()" style="display: none" />
        </div>
      </div>
    </div>
    <div class="left-box">
      <div class="sel-r">
        <div class="mt-4">
          <el-input placeholder="请输入信息完成搜索" v-model="areaInput" @keyup.enter="getArea">
            <template #append>
              <!-- <el-button :icon="Search"></el-button> -->
              <div class="ser-icon" @click="getArea">
                <img src="@assets/images/account-school/search.png" alt="" />
              </div>
            </template>
          </el-input>
        </div>
      </div>
      <el-tree
        v-if="isLazy"
        :data="dataSource"
        node-key="group_no"
        lazy
        :load="loadNode"
        highlight-current
        @node-click="clickNode"
        default-expand-all
        :default-expanded-keys="defaultExpandedNodes"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ data.group_name }}</span>
            <span>
              <img style="margin-left: 12px" src="@/assets/images/common/jia.png" @click="append(node, data)" />
              <img style="margin-left: 12px" src="@/assets/images/common/edit.png" @click="edit(node, data)" />
              <img style="margin-left: 12px" src="@/assets/images/common/del-red.png" @click="remove(node, data)" />
            </span>
          </span>
        </template>
      </el-tree>
      <el-tree
        v-else
        :data="dataSource"
        node-key="group_no"
        highlight-current
        @node-click="clickNode"
        default-expand-all
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ data.group_name }}</span>
            <span>
              <img style="margin-left: 12px" src="@/assets/images/common/jia.png" @click="append(node, data)" />
              <img style="margin-left: 12px" src="@/assets/images/common/edit.png" @click="edit(node, data)" />
              <img style="margin-left: 12px" src="@/assets/images/common/del-red.png" @click="remove(node, data)" />
            </span>
          </span>
        </template>
      </el-tree>
    </div>
    <div class="right-box">
      <div class="top-box">
        <div class="data-container">
          <!-- <div class="data-container"> -->
          <div class="terminalSel">
            <div class="intelligentEq" :class="isActive ? 'acitive' : ''" @click="handleIntelligent">智能化设备</div>
            <div class="stuTerminal" :class="!isActive ? 'acitive' : ''" @click="handleStuTerminal">学生终端</div>
          </div>
          <div class="data-box" v-if="isActive">
            <template v-if="onlineList.length > 0">
              <div class="camera-box" v-for="(item, index) in onlineList" :key="index">
                <div class="text-col">{{ item.title }}</div>
                <div class="r-box">
                  <div class="border-box">
                    {{
                      !isNaN((item.online_total / item.total) * 100)
                        ? ((item.online_total / item.total) * 100).toFixed(0)
                        : '0'
                    }}%
                  </div>
                  <div class="text">在线{{ item.online_total || 0 }}/{{ item.total || 0 }}</div>
                </div>
              </div>
            </template>
            <div v-else class="no-data-box">暂无数据</div>
          </div>
          <div class="data-box" v-else>
            <div class="text-col">在 线 率</div>
            <div class="r-box">
              <div class="border-box">
                {{
                  !isNaN((stuData.online_total / stuData.total) * 100)
                    ? ((stuData.online_total / stuData.total) * 100).toFixed(0)
                    : '0'
                }}%
              </div>
              <div class="text">在线{{ stuData.online_total || 0 }}/{{ stuData.total || 0 }}</div>
            </div>
          </div>
        </div>
        <!-- <div class="select-box">
          <div class="box">
            <div class="btn green-btn" @click="addShow = true">添加设备</div>
            <el-select v-model="status" class="mr" placeholder="请选择" @change="getDeviceData">
              <el-option v-for="item in optionStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="sel-r">
            <div class="mt-4">
              <el-input placeholder="请输入设备信息完成搜索" v-model="listInput">
                <template #append>
                  <div class="ser-icon" @click="getDeviceData">
                    <img src="@assets/images/account-school/search.png" alt="" />
                  </div>
                </template>
              </el-input>
            </div>
          </div>
        </div> -->
      </div>
      <div class="operate-box">
        <div class="btn green-btn" style="margin-right: 30px" @click="add" v-show="treeType === 4">+ 添加</div>
        <!-- <div class="btn green-btn" @click="handleBatchAdd" v-if="!isActive">+ 批量添加</div> -->
      </div>
      <div class="table-box">
        <el-table
          ref="multipleTableRef"
          :data="deviceData"
          stripe
          style="width: 100%"
          max-height="500"
          v-loading="loading"
          element-loading-text="加载中..."
        >
          <el-table-column align="left" type="index" label="序号" width="80" />
          <!-- 智能化设备 -->
          <el-table-column align="left" property="device_no" label="设备序列号" v-if="isActive"></el-table-column>
          <el-table-column align="left" property="deviceType" label="设备类型" v-if="isActive"></el-table-column>
          <el-table-column align="left" property="device_type" label="设备型号" v-if="isActive"></el-table-column>
          <!-- 学生终端 -->
          <el-table-column align="left" property="device_no" label="学生终端序号" v-if="!isActive"></el-table-column>
          <el-table-column align="left" label="终端类型" v-if="!isActive">
            <template #default="scope">
              {{ scope.row.terminal_type === 1 ? 'pc' : scope.row.terminal_type === 2 ? 'pad' : '智慧笔记本' }}
            </template>
          </el-table-column>
          <el-table-column align="left" property="labor_name" label="实验室"></el-table-column>
          <el-table-column align="left" label="分组" v-if="!isActive">
            <template #default="scope">
              {{ '分组' + scope.row.group_n }}
            </template>
          </el-table-column>
          <el-table-column align="left" property="create_time" label="添加时间" show-overflow-tooltip></el-table-column>

          <el-table-column align="left" property="" label="设备状态">
            <template #default="scope">
              <span :style="{ color: scope.row.status === 1 ? '#05c65d' : '#e9bc8d' }">
                {{ scope.row.status === 1 ? '在线' : '离线' }}
              </span>
            </template>
          </el-table-column>

          <el-table-column align="center" property="date" label="操作" :width="isActive ? '220' : '150'">
            <template #default="scope">
              <div class="operation-box">
                <div @click="detail(scope.row)" v-if="isActive">
                  <img src="@assets/images/common/search-green.png" alt="" />
                  <span>详情</span>
                </div>
                <div @click="setting(scope.row, isActive)">
                  <img src="@assets/images/common/setting.png" alt="" />
                  <span>设置</span>
                </div>
                <div @click="del(scope.row, isActive)">
                  <img src="@assets/images/common/del-red.png" alt="" />
                  <span>删除</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog custom-class="edit-dialog" v-model="addGroupShow" title="新增组织" width="30%">
      <div class="title">上级组织：{{ editGroupItem.group_name }}</div>
      <div class="input-box">
        <el-input v-model="addGroupItem.group_name" placeholder="组织名称（必填）" />
        <el-input v-model="addGroupItem.group_no" placeholder="组织编号（必填）" />
      </div>
      <template #footer>
        <div class="btn-box">
          <div class="btn white-btn" @click="back">取消</div>
          <div class="btn green-btn" @click="saveAddGroup">确认</div>
        </div>
      </template>
    </el-dialog>
    <el-dialog custom-class="edit-dialog" v-model="editGroupShow" title="编辑组织" width="30%">
      <div class="input-box">
        <el-input v-model="editGroupItem.group_name" placeholder="" />
        <el-input v-model="editGroupItem.group_no" disabled placeholder="" />
      </div>
      <template #footer>
        <div class="btn-box">
          <div class="btn white-btn" @click="back">取消</div>
          <div class="btn green-btn" @click="saveGroup">确认</div>
        </div>
      </template>
    </el-dialog>
    <el-dialog custom-class="edit-dialog" v-model="addShow" title="添加设备" width="30%">
      <el-form ref="deviceFormRef" :model="deviceForm" :rules="rules" class="demo-ruleForm" status-icon>
        <el-form-item prop="type">
          <el-select v-model="deviceForm.type" placeholder="请选择设备" style="width: 100%" clearable>
            <el-option v-for="item in deviceTypeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="deviceSerial">
          <el-input
            v-model="deviceForm.deviceSerial"
            placeholder="请输入设备号"
            clearable
            :disabled="isDeviceSetting"
          />
        </el-form-item>
        <el-form-item prop="lab_id">
          <el-select v-model="deviceForm.lab_id" placeholder="请选择实验室" style="width: 100%" clearable>
            <el-option v-for="item in optionLaboratory" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <div class="btn-box">
          <div class="btn white-btn" @click="resetForm(deviceFormRef)">取消</div>
          <div class="btn green-btn" @click="saveAddDvc" :class="saveAddDvcLoading ? 'isDisabled' : ''">确认</div>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog custom-class="edit-dialog" v-model="detailShow" title="详情" width="40%">
      <div class="detail-box">
        <div v-if="detailItem.type === 1">
          <div class="title">网络配置</div>
          <div class="details details-password">
            验证码/加密密钥：
            <div class="password">
              {{ isShowPassword ? detailItem?.validateCode : detailItem?.validateCode?.replace(/\w/g, '*') }}
              <img
                :src="require('@/assets/images/common/' + (isShowPassword ? 'eye-green.png' : 'eye-gray.png'))"
                alt=""
                @click="changePassword"
              />
            </div>
          </div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">设备类型</div>
          <div class="details">{{ detailItem.deviceType }}</div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">序列号</div>
          <div class="details">{{ detailItem.device_no }}</div>
        </div>
        <div v-if="detailItem.type === 1">
          <div class="title">视频</div>
          <div class="details">视频编码: {{ detailItem.videoEncoding === 1 ? 'H.264' : 'H.265' }}</div>
        </div>
        <div>
          <div class="title">所属组织</div>
          <div class="details">组织名称：{{ detailItem.group_name }}</div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">实验室信息</div>
          <div class="details detail-labor">
            <el-select v-model="detailItem.labor_id" class="mr" placeholder="请选择" disabled>
              <el-option
                v-for="item in optionLaboratory"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">设备状态</div>
          <div class="details">{{ detailItem.status === 1 ? '在线' : '离线' }}</div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">添加时间</div>
          <div class="details">{{ detailItem.create_time }}</div>
        </div>
        <div v-if="detailItem.type === 9">
          <div class="title">设备属性</div>
          <div class="details">
            <div class="details-key">
              <div class="key-item" v-for="(item, index) in DEVICEATTRS" :key="index">{{ item.key }}</div>
            </div>
            <div class="details-value">
              <div class="value-item" v-for="(item, index) in deviceAttrsData" :key="index">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div v-if="detailItem.type === 1">
          <div class="title">通道号信息及绑定</div>
          <div class="details">
            <el-table
              ref="multipleTableRef1"
              :data="channelListData?.list"
              :header-cell-style="{
                background: '#DCECE3'
              }"
              stripe
              style="width: 100%"
            >
              <el-table-column
                align="left"
                property="channelName"
                label="通道名称"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column align="left" property="createTime" label="添加时间"></el-table-column>

              <el-table-column align="left" property="" label="通道状态">
                <template #default="scope">
                  {{ scope.row.channelStatus === 1 ? '在线' : scope.row.channelStatus === 0 ? '离线' : '设备未上报' }}
                </template>
              </el-table-column>
              <el-table-column align="left" property="labName" label="绑定实验室"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="btn-box">
          <!-- <div class="btn white-btn" @click="detailShow = false">返回</div> -->
          <div class="btn green-btn" @click="detailShow = false">返回</div>
        </div>
      </template>
    </el-dialog>
    <el-dialog custom-class="edit-dialog" v-model="settingShow" title="设备信息设置" width="50%">
      <div class="detail-box" v-loading="settingLoading">
        <div v-if="detailItem.type === 1">
          <div class="title">网络配置</div>
          <div class="details">
            <div class="name">验证码/加密密钥：</div>
            <el-input
              v-model="detailItem.validateCode"
              placeholder=""
              type="password"
              auto-complete="new-password"
              show-password
            />
          </div>
        </div>
        <div v-if="detailItem.type === 1">
          <div class="title">视频</div>
          <div class="details">
            <div class="name">视频编码：</div>
            <el-select v-model="detailItem.videoEncoding" class="mr" placeholder="请选择">
              <el-option v-for="item in optionEncode" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">设备类型</div>
          <div class="details">{{ detailItem.deviceType }}</div>
        </div>
        <div v-if="detailItem.type === 9">
          <div class="title">产品编码</div>
          <div class="details">{{ detailItem.device_no }}</div>
        </div>
        <div v-if="detailItem.type !== 1 && detailItem.type !== 9">
          <div class="title">序列号</div>
          <div class="details">{{ detailItem.device_no }}</div>
        </div>
        <div>
          <div class="title">所属组织</div>
          <div class="details">组织名称：{{ detailItem?.group_name }}</div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">实验室信息</div>
          <div class="details">
            <el-select v-model="detailItem.labor_id" class="mr" placeholder="请选择" clearable>
              <el-option
                v-for="item in optionLaboratory"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">设备状态</div>
          <div class="details">{{ detailItem.status === 1 ? '在线' : '离线' }}</div>
        </div>
        <div v-if="detailItem.type !== 1">
          <div class="title">添加时间</div>
          <div class="details">{{ detailItem.create_time }}</div>
        </div>
        <div v-if="detailItem.type === 9">
          <div class="title">设备属性</div>
          <div class="details">
            <div class="details-key">
              <div class="key-item" v-for="(item, index) in DEVICEATTRS" :key="index">{{ item.key }}</div>
            </div>
            <div class="details-value">
              <div class="value-item" v-for="(item, index) in deviceAttrsData" :key="index">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div v-if="detailItem.type === 1">
          <div class="title">通道号信息及绑定</div>
          <div class="details">
            <el-table
              ref="multipleTableRef1"
              :data="channelListData?.list"
              :header-cell-style="{
                background: '#DCECE3'
              }"
              stripe
              style="width: 100%"
            >
              <el-table-column
                align="left"
                property="channelName"
                label="通道名称"
                show-overflow-tooltip
              ></el-table-column>

              <el-table-column align="left" property="createTime" label="添加时间" width="100"></el-table-column>

              <el-table-column align="left" property="" label="通道状态">
                <template #default="scope">
                  {{ scope.row.channelStatus === 1 ? '在线' : scope.row.channelStatus === 0 ? '离线' : '设备未上报' }}
                </template>
              </el-table-column>
              <el-table-column align="left" property="" label="绑定实验室">
                <template #default="scope">
                  <el-select
                    v-model="scope.row.labId"
                    class="mr"
                    placeholder="请选择"
                    clearable
                    @change="changeLab($event, scope.row)"
                  >
                    <el-option
                      v-for="item in optionLaboratory"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" property="" label="操作" width="100">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.isEncrypt"
                    :active-value="0"
                    :inactive-value="1"
                    style="--el-switch-on-color: #05c65d"
                    @change="changeOpen($event, scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="detailItem.type === 3">
          <div class="title">ic/id卡</div>
          <div class="details">
            <div class="icid">
              <div v-for="(item, index) in icIdList" :key="index">
                <span style="padding-right: 40px">{{ ['ic卡', 'id卡'][item.type - 1] }}</span>
                <span style="padding-right: 20px">{{ item.code }}</span>
                <img class="img" src="@assets/images/common/del.png" @click="delIssetIcId(item, index)" />
              </div>
              <div class="icid">
                <div v-for="(item, index) in addIcIdList" :key="index">
                  <el-select class="mr" v-model="item.type">
                    <el-option label="ic卡" value="1"></el-option>
                    <el-option label="id卡" value="2"></el-option>
                  </el-select>
                  <el-input v-model="item.code" placeholder="请输入ic/id" :disabled="isSetting" />
                  <span style="margin-left: 20px; font-size: 20px; cursor: pointer">
                    <img class="img" src="@assets/images/common/del.png" @click="delIcId(index)" />
                  </span>
                  <span
                    v-show="item.addP"
                    style="margin-left: 20px; font-size: 20px; cursor: pointer"
                    @click="addIcId()"
                  >
                    +
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="btn-box" v-loading="settingLoading">
          <div class="btn white-btn" @click="back">取消</div>
          <div class="btn green-btn" @click="saveChange">确认</div>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      custom-class="edit-dialog"
      v-model="addStuTerminal"
      :title="isSetting ? '设置' : '添加学生终端'"
      width="30%"
    >
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon>
        <el-form-item prop="device_no">
          <el-input v-model="ruleForm.device_no" placeholder="请输入设备序列号" clearable :disabled="isSetting" />
        </el-form-item>
        <el-form-item prop="group_n">
          <el-select v-model="ruleForm.group_n" placeholder="请选择分组" style="width: 100%" clearable>
            <el-option v-for="item in GROUPLIST" :key="item.label" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="terminal_type">
          <el-select
            v-model="ruleForm.terminal_type"
            placeholder="请选择设备类型"
            style="width: 100%"
            clearable
            disabled
          >
            <el-option v-for="item in terminalTypeList" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="labor_id">
          <el-select v-model="ruleForm.labor_id" placeholder="请选择实验室" style="width: 100%" clearable>
            <el-option v-for="item in optionLaboratory" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <div class="btn-box">
          <div class="btn white-btn" @click="resetForm(ruleFormRef)">取消</div>
          <div class="btn green-btn" @click="submitForm(ruleFormRef)" :class="submitLoading ? 'isDisabled' : ''">
            确认
          </div>
        </div>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts" setup>
import { deviceFormat, onlineListFormat } from '@/utils/format'
import { GROUPLIST, DEVICEATTRS } from '@/contants/index'
import { nextTick, ref, reactive, h } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import {
  addOneGroup,
  searchGroup,
  getGroupFirstList,
  getGroupsChildrenList,
  editGroup,
  groupDelete,
  deleteDevice,
  getAllDeviceList,
  addDevice,
  getStuTerminalList,
  getStuTerminalDetail,
  getOnlineRateSummary,
  singleDevice,
  channelList,
  editDevice,
  editDeviceCommon,
  getDeviceUseData,
  editChannel,
  openChannel,
  deviceAdd,
  deviceDelete,
  deviceEdit,
  schoolLaborByCode,
  getDeviceType,
  findPeripheralIcIdCard,
  saveAllIcIdCard,
  deletePeripheralIcIdCard
} from '@/service/video-equipment/index'

import type { ElTable, FormInstance, FormRules } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'

let isActive = ref(true)
let addStuTerminal = ref(false)
let isSetting = ref(false)
let isDeviceSetting = ref(false)
let loading = ref(false)
let submitLoading = ref(false)
let saveAddDvcLoading = ref(false)
let deviceTypeList = ref([])
let deviceAttrsData = ref([])
let terminalTypeList = reactive([
  {
    label: 'pc',
    id: 1
  },
  {
    label: 'pad',
    id: 2
  },
  {
    label: '智慧笔记本',
    id: 3
  }
])
interface RuleForm {
  device_no: string
  terminal_type: string
  group_n: string
  labor_id: string
}
interface DeviceForm {
  deviceSerial: string
  type: string
  lab_id: string
}
const ruleFormRef = ref<FormInstance>()
const deviceFormRef = ref<FormInstance>()
let ruleForm = reactive<RuleForm>({
  device_no: '',
  terminal_type: 2,
  group_n: '',
  labor_id: ''
})
const deviceForm = reactive<DeviceForm>({
  deviceSerial: '',
  type: '',
  lab_id: ''
})

const rules = reactive<FormRules<RuleForm>>({
  deviceSerial: [{ required: true, message: '请输入设备序列号', trigger: 'blur' }]
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      submitLoading.value = true
      try {
        let params = {
          labor_id: ruleForm.labor_id,
          group_n: ruleForm.group_n,
          terminal_type: ruleForm.terminal_type
        }
        if (isSetting.value) {
          params['device_id'] = stuItemId.value
          const { code } = await deviceEdit(params)
          if (code === 200) {
            ElMessage({
              message: '编辑成功',
              type: 'success'
            })
            getStuTerminalListData()
            addStuTerminal.value = false
            setTimeout(() => {
              submitLoading.value = false
            }, 1000)
          } else {
            setTimeout(() => {
              submitLoading.value = false
            }, 1000)
          }
        } else {
          params['group_no'] = activeObj.value.group_no
          params['device_no'] = ruleForm.device_no
          const { code, msg } = await deviceAdd(params)
          if (code === 200) {
            ElMessage({
              message: '新增成功',
              type: 'success'
            })
            getStuTerminalListData()
            addStuTerminal.value = false
            setTimeout(() => {
              submitLoading.value = false
            }, 1000)
          } else {
            ElMessage({
              message: msg,
              type: 'warning'
            })
            setTimeout(() => {
              submitLoading.value = false
            }, 1000)
          }
        }
      } catch (error) {
        submitLoading.value = false
        throw new Error('error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  back()
}

//获取学生终端列表
const getStuTerminalListData = async () => {
  deviceData.value = []
  loading.value = true
  let params = {
    group_no: activeObj.value.group_no
  }
  try {
    const { data, code } = await getStuTerminalList(params)
    if (code === 10) {
      deviceData.value = data
      loading.value = false
    } else {
      loading.value = false
    }
  } catch (error) {
    loading.value = false
    throw new Error('error')
  }
}
let onlineList: any = ref([])
//学生终端
let stuData: any = reactive({})
const getOnlineRateSum = async () => {
  onlineList.value = []
  let params = {
    // group_no: ''
    group_no: activeObj.value.group_no
  }
  try {
    const { data, code } = await getOnlineRateSummary(params)
    if (code === 10) {
      data.forEach((item) => {
        if (item.type === 4) {
          stuData['total'] = item.total
          stuData['rate'] = item.rate
          stuData['online_total'] = parseInt(item.online_total)
        } else {
          onlineList.value.push(onlineListFormat(item))
        }
      })
    }
  } catch (error) {
    throw new Error('error')
  }
}
//未选择地区学校提示
const noSleTip = () => {
  if (!activeObj.value.group_no) {
    ElMessage({
      message: '请先选择地区学校',
      type: 'warning'
    })
    return true
  }
}
//点击智能化终端
const handleIntelligent = (): void => {
  if (noSleTip()) return
  isActive.value = true
  getDeviceData()
  getOnlineRateSum()
}
//点击学生终端
const handleStuTerminal = (): void => {
  if (noSleTip()) return
  isActive.value = false
  getStuTerminalListData()
  getOnlineRateSum()
}
//获取学生终端详情
const getStuTerminalDetailData = async (_val: number) => {
  let params = {
    device_id: _val
  }
  try {
    const { data, code }: { data: any; code: number } = await getStuTerminalDetail(params)
    if (code === 200) {
      ruleForm.device_no = data.device_no
      ruleForm.terminal_type = data.terminal_type
      ruleForm.group_n = data.group_n
      ruleForm.labor_id = data.labor_id
    }
  } catch (error) {
    throw new Error('error')
  }
}

const downloadExcel = () => {
  console.log(1111)
}
const importExcel = () => {
  let filedom: any = document.getElementById('uploadExcel')
  filedom.value = ''
  filedom.click()
}
const changeExcel = () => {
  let fileObj: any = (document.getElementById('uploadExcel') as any).files[0]
  let formdata = new FormData()
  formdata.append('file', fileObj)
  formdata.append('role_id', '4')

  // uploadfile(formdata).then((res) => {
  //   if (res.code === 10) {
  //     popState1.value = false
  //     console.log(res)
  //     getDeviceData()
  //     ElMessage({
  //       type: 'success',
  //       message: '导入成功!'
  //     })
  //   }
  // })
}
//获取实验室列表
// let LaboratoryListData = ref([])
const getLaboratoryList = async () => {
  let params = {
    school_code: activeObj.value.type_id
  }
  try {
    const { data, code } = await schoolLaborByCode(params)
    if (code === 10) {
      optionLaboratory.value = data
    }
  } catch (error) {
    throw new Error('error')
  }
}

const add = () => {
  if (noSleTip()) return
  if (isActive.value) {
    addShow.value = true
  } else {
    addStuTerminal.value = true
    isSetting.value = false
    // getLaboratoryList()
  }
}
// const handleRemoveItem = (_row: any) => {
//   gridData.forEach((item) => {
//     if (item.date === _row.date) {
//       gridData.splice(0, 1)
//     }
//   })

//   // gridData.splice()
// }

let areaInput = ref<string>('')
let isLazy = ref(true)

let getArea = async () => {
  isLazy.value = false

  // 全部
  if (areaInput.value === '') {
    getGroupData()
    return
  }

  // input搜索
  searchGroup({
    groupName: areaInput.value
  }).then(async (res) => {
    let obj = res.data
    await nextTick()

    if (Array.isArray(obj)) {
      dataSource.value = []
    } else {
      dataSource.value = [obj]
    }
  })
}

interface Tree {
  group_name: string
  group_no: string
  id: any
  is_del: number
  parent_no: any
  type: number
  children?: Tree[]
}
const dataSource = ref<Tree[]>([])

const getGroupData = () => {
  // 设置加载和输入框置空
  isLazy.value = true
  areaInput.value = ''

  getGroupFirstList().then(async (res) => {
    dataSource.value = res.data
  })
}

getGroupData()
let defaultExpandedNodes = ref([])
const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    return resolve([])
  }
  getGroupsChildrenList(node.data.group_no).then((res) => {
    // getGroupsChildrenList({ parent_no: node.data.group_no }).then((res) => {
    resolve(res.data)
  })
}
let addGroupShow = ref<boolean>(false)
let addGroupItem = ref<any>({})

const append = (node: Node, data: Tree) => {
  addGroupShow.value = true
  editGroupItem.value = JSON.parse(JSON.stringify(data))
  addGroupItem.value = {}
  editGroupNode.value = node

  // const newChild = { id: 1000000, label: 'testtest', children: [] }
  // if (!data.children) {
  //   data.children = []
  // }
  // data.children.push(newChild)
  // dataSource.value = [...dataSource.value]
}

let editGroupShow = ref<boolean>(false)
let editGroupItem = ref<any>({})
let editGroupNode = ref<any>()

const edit = (node: Node, data: Tree) => {
  editGroupShow.value = true
  editGroupItem.value = JSON.parse(JSON.stringify(data))
  editGroupNode.value = node
}

const back = () => {
  addGroupShow.value = false
  editGroupShow.value = false
  addShow.value = false
  settingShow.value = false
  addStuTerminal.value = false
  editGroupItem.value = {}
}

const saveAddGroup = () => {
  if (!addGroupItem.value.group_name && addGroupItem.value.group_name === undefined) {
    ElMessage({
      type: 'warning',
      message: '组织名称不可为空'
    })
    return
  }
  if (!addGroupItem.value.group_no && addGroupItem.value.group_no === undefined) {
    ElMessage({
      type: 'warning',
      message: '组织编号不可为空'
    })
    return
  }
  addOneGroup({
    groupName: addGroupItem.value.group_name,
    groupNo: addGroupItem.value.group_no,
    level: editGroupNode.value.level ? editGroupNode.value.level + 1 : 1,
    parentNo: editGroupItem.value.group_no
  }).then((res) => {
    // const parent = editGroupNode.value.parent
    // const children: Tree[] = parent.parent ? parent.parent.childNodes : parent.data
    // const index = children.findIndex((d: any) => {
    //   if (d.data) {
    //     return d.data.group_no === editGroupItem.value.group_no
    //   } else {
    //     return d.group_no === editGroupItem.value.group_no
    //   }
    // })
    // children.splice(index, 1, editGroupItem.value)
    // dataSource.value = [...dataSource.value]
    if (res.code - 200 === 0) {
      addGroupShow.value = false
      getGroupData()
      ElMessage({
        message: '新增组织成功',
        type: 'success'
      })
    } else {
      ElMessage({
        type: 'warning',
        message: res.message
      })
    }
  })
}

const saveGroup = () => {
  editGroup({
    groupName: editGroupItem.value.group_name,
    groupNo: editGroupItem.value.group_no
  }).then((res) => {
    // const parent = editGroupNode.value.parent
    // const children: Tree[] = parent.parent ? parent.parent.childNodes : parent.data
    // const index = children.findIndex((d: any) => {
    //   if (d.data) {
    //     return d.data.group_no === editGroupItem.value.group_no
    //   } else {
    //     return d.group_no === editGroupItem.value.group_no
    //   }
    // })
    // children.splice(index, 1, editGroupItem.value)
    // dataSource.value = [...dataSource.value]
    if (res.code - 200 === 0) {
      editGroupShow.value = false
      getGroupData()
      ElMessage({
        message: '编辑组织成功',
        type: 'success'
      })
    } else {
      ElMessage({
        type: 'warning',
        message: res.message
      })
    }
  })
}

const remove = (node: Node, data: Tree) => {
  // const parent = node.parent

  // const children = parent.parent ? parent.parent.childNodes : parent.data

  ElMessageBox.confirm('*删除组织会删除该组织下的所有设备，仍要删除？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      groupDelete({
        groupNo: data.group_no
      }).then((res) => {
        if (res.code - 200 === 0) {
          getGroupData()
          ElMessage({
            message: '删除组织成功',
            type: 'success'
          })
        } else {
          ElMessage({
            type: 'warning',
            message: res.message
          })
        }

        // const index = children.findIndex((d: any) => {
        //   if (d.data) {
        //     return d.data.group_no === editGroupItem.value.group_no
        //   } else {
        //     return d.group_no === editGroupItem.value.group_no
        //   }
        // })
        // children.splice(index, 1)
        // dataSource.value = [...dataSource.value]
      })
    })
    .catch(() => {
      console.log('111')
    })
}
// const status = ref<string>('')
// const optionStatus = ref<any[]>([
//   {
//     id: '',
//     name: '全部状态'
//   },
//   {
//     id: 1,
//     name: '在线状态'
//   },
//   {
//     id: 0,
//     name: '离线状态'
//   }
// ])

let deviceData = ref<any>([])
// let listInput = ref<string>()

let activeObj = ref<any>({})
let treeType = ref<number>(0)
const clickNode = (data: Tree) => {
  treeType.value = data.type
  activeObj.value = data
  getLaboratoryList()
  if (isActive.value) {
    getDeviceData()
  } else {
    getStuTerminalListData()
  }
  getOnlineRateSum()
}

const getDeviceData = async () => {
  deviceData.value = []
  loading.value = true
  let params = {
    // group_no: ''
    group_no: activeObj.value.group_no
  }
  try {
    const { data, code } = await getAllDeviceList(params)
    if (code === 10) {
      deviceData.value = deviceFormat(data)
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    throw new Error('error')
  }
}
let addShow = ref(false)

const saveAddDvc = async () => {
  saveAddDvcLoading.value = true
  let params = {
    device_no: deviceForm.deviceSerial,
    type: deviceForm.type,
    group_no: activeObj.value.group_no,
    lab_id: deviceForm.lab_id
  }
  if (deviceForm.type === 1) {
    params['validateCode'] = 'SWR123'
  }
  try {
    const { data, code, msg, message } = await addDevice(params)
    if (code - 200 === 0) {
      ElMessage({
        type: 'success',
        message: msg
      })
      getDeviceData()
      getOnlineRateSum()
      resetForm(deviceFormRef.value)
      addShow.value = false
    } else if (code === 1010437) {
      ElMessage({
        type: 'warning',
        message: message
      })
    } else if (code === 500) {
      ElMessage({
        type: 'warning',
        message: msg
      })
    }
    saveAddDvcLoading.value = false
  } catch (error) {
    console.log(error)
  }
}

let detailShow = ref(false)
let isShowPassword = ref(false)
const changePassword = () => {
  isShowPassword.value = !isShowPassword.value
}

let detailItem = ref<any>({})
let channelListData = ref<any>({})
const format = (data) => {
  deviceAttrsData.value = []
  deviceAttrsData.value.push(
    {
      value: data.payload.Temp + '℃'
    },
    {
      value: data.payload.CO2 + 'ppm'
    },
    {
      value: data.payload.Humidity + '%rh'
    },
    {
      value: data.payload.PM10 + 'μg/m³'
    },
    {
      value: data.payload.PM25 + 'μg/m³'
    },
    {
      value: data.payload.TVOC + 'mg/m³'
    }
  )
}
const icIdList = ref<any>([])
//获取设备使用数据
const getDeviceUseDataList = async (value) => {
  let params = {
    deviceId: value
  }
  try {
    const { code, data } = await getDeviceUseData(params)
    if (code === 10) {
      format(data)
    }
  } catch (error) {
    console.log(error)
    // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
  }
}
const detail = (e: any) => {
  singleDevice({
    device_no: e.device_no
  }).then((res) => {
    detailItem.value = deviceFormat([res.data])[0]
    detailItem.value.group_name = activeObj.value.group_name
    detailShow.value = true
    if (e.type === 1) {
      channelList({
        deviceSerial: e.device_no,
        pageNo: 1,
        pageSize: 150
      }).then((res) => {
        channelListData.value = res.data
      })
    }
    if (e.type === 9) {
      format(res.data.extra_info.use_data)
      // getDeviceUseDataList(res.data.extra_info.user_data)
    }
    if (e.type === 3) {
      findPeripheralIcIdCard({
        peripheral_id: e.id
      }).then((res) => {
        console.log(res)
        icIdList.value = res.data
        console.log(icIdList.value)
      })
    }
  })
}

let settingShow = ref(false)
let settingLoading = ref(false)
let stuItemId = ref('')
let selectSchoolId = ref(0)
const setting = (e: any, _val: boolean) => {
  if (_val) {
    settingShow.value = true
    settingLoading.value = true
    singleDevice({
      device_no: e.device_no
    }).then((res) => {
      detailItem.value = deviceFormat([res.data], 'set')[0]
      detailItem.value.group_name = activeObj.value.group_name
      // getLaboratoryList()
      if (e.type === 1) {
        channelList({
          deviceSerial: e.device_no,
          pageNo: 1,
          pageSize: 150
        }).then((res) => {
          channelListData.value = {
            ...res.data,
            list: res.data?.list.map((e: any) => {
              return {
                ...e,
                labId: e.labId === 0 ? '' : e.labId
              }
            })
          }
        })
      }
      if (e.type === 9) {
        format(res.data.extra_info.use_data)
        // getDeviceUseDataList(res.data.extra_info.user_data)
      }
      settingLoading.value = false
      if (e.type === 3) {
        selectSchoolId.value = e.school_id
        findPeripheralIcIdCard({
          peripheral_id: e.id
        }).then((res) => {
          console.log(res)
          icIdList.value = res.data
          console.log(icIdList.value)
        })
      }
    })
  } else {
    addStuTerminal.value = true
    isSetting.value = true
    stuItemId.value = e.id
    // getLaboratoryList()
    getStuTerminalDetailData(e.id)
  }
}

const addIcIdList = ref<any>([
  {
    code: '',
    type: '1',
    addP: true
  }
])
const delIssetIcId = (item: any, index: number) => {
  deletePeripheralIcIdCard({ id: item.id }).then((res) => {
    if (res.code === 10) {
      icIdList.value.splice(index, 1)
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
    } else {
      ElMessage({
        message: '删除失败',
        type: 'error'
      })
    }
  })
}
const addIcId = () => {
  console.log(5465465465)
  addIcIdList.value.forEach((item) => {
    item.addP = false
  })
  addIcIdList.value.push({
    code: '',
    type: '1',
    addP: true
  })
}
const delIcId = (index: any) => {
  if (addIcIdList.value.length === 1) {
    addIcIdList.value[0].code = ''
    return
  }
  addIcIdList.value.splice(index, 1)
  let length = addIcIdList.value.length
  addIcIdList.value[length - 1].addP = true
}
const optionEncode = ref<any[]>([
  {
    id: 1,
    name: 'H.264'
  },
  {
    id: 2,
    name: 'H.265'
  }
])

// const optionGroup = ref<any[]>([
//   {
//     id: '',
//     name: '未分组'
//   },
//   {
//     id: 1,
//     name: '学校1'
//   },
//   {
//     id: 2,
//     name: '学校2'
//   }
// ])

const optionLaboratory = ref<any[]>([])

const saveChange = () => {
  // Promise.all([
  //   editDevice({
  //     deviceSerial: detailItem.value.deviceSerial,
  //     validateCode: detailItem.value.validateCode,
  //     videoEncoding: detailItem.value.videoEncoding
  //   })
  // ]).then((res) => {
  //   if (res.every((e: any) => e.code - 200 === 0)) {
  //     settingShow.value = false
  //   }
  // })
  if (detailItem.value.type === 1) {
    editDevice({
      deviceSerial: detailItem.value.device_no,
      validateCode: detailItem.value.validateCode,
      videoEncoding: detailItem.value.videoEncoding,
      group_no: activeObj.value.group_no
    }).then((res) => {
      if (res.code - 200 === 0) {
        settingShow.value = false
        ElMessage({
          type: 'success',
          message: res.message
        })
        getDeviceData()
      } else {
        ElMessage({
          type: 'warning',
          message: res.message
        })
      }
    })
  } else if (detailItem.value.type === 3) {
    let dataList = ref<any>([])
    addIcIdList.value.forEach((item) => {
      if (item.code !== '') {
        item.school_id = 1
        item.ic_id_card_peripheral = detailItem.value.id
        item.school_id = selectSchoolId.value
        dataList.value.push(item)
      }
    })
    console.log(dataList)
    if (dataList.value.length < 1) {
      ElMessage({
        type: 'error',
        message: '请添加ic/id卡'
      })
      return
    }
    let params = {
      device_no: detailItem.value.device_no,
      labor_id: detailItem.value.labor_id
    }
    editDeviceCommon(params).then((res) => {
      if (res.code === 200) {
        settingShow.value = false
        ElMessage({
          type: 'success',
          message: res.msg
        })
        saveAllIcIdCard({ ic_id_card_list: dataList.value }).then((res2) => {
          if (res2.code === 10) {
            addIcIdList.value = [
              {
                code: '',
                type: '1',
                addP: true
              }
            ]
            console.log(res2)
          } else {
            ElMessage({
              type: 'error',
              message: 'ic/id卡保存失败'
            })
          }
        })
        getDeviceData()
      } else {
        ElMessage({
          type: 'warning',
          message: res.msg
        })
      }
    })
  } else {
    let params = {
      device_no: detailItem.value.device_no,
      labor_id: detailItem.value.labor_id
    }
    editDeviceCommon(params).then((res) => {
      if (res.code === 200) {
        settingShow.value = false
        ElMessage({
          type: 'success',
          message: res.msg
        })
        getDeviceData()
      } else {
        ElMessage({
          type: 'warning',
          message: res.msg
        })
      }
    })
  }
}

const changeLab = (e: any, item: any) => {
  const obj = {
    labId: e || 0,
    labName: optionLaboratory.value.find((m) => m.id === e) ? optionLaboratory.value.find((m) => m.id === e).title : '',
    deviceSerial: item.deviceSerial,
    channelId: item.channelId,
    channelName: item.channelName,
    channelNo: item.channelNo,
    channelStatus: item.channelStatus,
    channelType: item.channelType,
    isUse: item.isUse,
    ipcSerial: item.ipcSerial || '',
    isEncrypt: item.isEncrypt
  }
  editChannel(obj).then((res) => {
    if (res.code - 200 === 0) {
      console.log('修改成功')
    } else {
      ElMessage({
        type: 'warning',
        message: res.message
      })
    }
  })
}
const changeOpen = (e: any, item: any) => {
  const obj = {
    labId: item.labId,
    labName: item.labName,
    deviceSerial: item.deviceSerial,
    channelId: item.channelId,
    channelName: item.channelName,
    channelNo: item.channelNo,
    channelStatus: item.channelStatus,
    channelType: item.channelType,
    isUse: item.isUse,
    ipcSerial: item.ipcSerial || '',
    isEncrypt: e
  }
  openChannel(obj).then((res) => {
    if (res.code - 200 === 0) {
      console.log('修改成功')
    } else {
      ElMessage({
        type: 'warning',
        message: res.message
      })
    }
  })
}

const del = (e: any, _val: boolean) => {
  if (_val) {
    ElMessageBox.confirm('*删除设备，会删除该设备下所绑定的实验室信息，仍要删除？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteDevice({
          // deviceSerial: e.deviceSerial
          device_no: e.device_no
        }).then((res) => {
          if (res.code - 200 === 0) {
            getDeviceData()
            getOnlineRateSum()
          } else {
            ElMessage({
              type: 'warning',
              message: res.message
            })
          }

          // const index = children.findIndex((d: any) => {
          //   if (d.data) {
          //     return d.data.group_no === editGroupItem.value.group_no
          //   } else {
          //     return d.group_no === editGroupItem.value.group_no
          //   }
          // })
          // children.splice(index, 1)
          // dataSource.value = [...dataSource.value]
        })
      })
      .catch(() => {
        console.log()
      })
  } else {
    ElMessageBox({
      title: '提示',
      message: h('p', null, [
        h('span', null, '请问您是否需要删除该设备？'),
        h('br', null, ''),
        h('br', null, ''),
        h(
          'div',
          { style: 'color: #ff9534' },
          '*提示：删除设备会删除该设备所绑定的实验室信息，后续将不再进行该设备的控制与分发等功能，仍要删除'
        )
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          let params = {
            device_id: e.id
          }
          try {
            const { code, msg } = await deviceDelete(params)
            if (code === 200) {
              ElMessage({
                message: '删除成功',
                type: 'success'
              })
              getStuTerminalListData()
              getOnlineRateSum()
            } else {
              ElMessage({
                message: msg,
                type: 'warning'
              })
            }
            done()
            instance.confirmButtonLoading = false
          } catch (error) {
            instance.confirmButtonLoading = false
            throw new Error('error')
          }
        } else {
          done()
        }
      }
    }).then((action) => {
      console.log(action)
    })
  }
}
const getDeviceTypeData = async () => {
  try {
    const { data, code } = await getDeviceType()
    if (code === 10) {
      deviceTypeList.value = data.filter((item) => item.id !== 4)
    }
  } catch (error) {
    console.log(error)
  }
}
getDeviceTypeData()
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
  overflow: hidden;

  .sel-box {
    margin-bottom: 20px;
    width: 100%;

    .operation {
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
          margin-left: 20px;
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
  }

  .sel-r {
    .mt-4 {
      margin: 0 auto 15px;

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

  .left-box {
    width: 24%;
    float: left;
  }

  .right-box {
    margin-left: 1%;
    width: 75%;
    float: right;

    .top-box {
      // display: flex;
      // justify-content: space-between;
      align-items: flex-end;

      .data-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0 0;
        box-sizing: border-box;
        // width: 650px;
        height: 280px;
        background: #fff;
        border-radius: 10px;
        font-size: 14px;

        .terminalSel {
          display: flex;
          // justify-content: center;
          padding: 0 10px;

          .intelligentEq,
          .stuTerminal {
            &:not(:last-child) {
              margin-right: 20px;
            }

            width: 110px;
            font-size: 18px;
            cursor: pointer;

            &.acitive {
              color: #05c65d;
              position: relative;

              &::after {
                content: '';
                display: block;
                position: absolute;
                width: 110px;
                height: 3px;
                border-radius: 5px;
                margin-top: 2px;
                background-color: #05c65d;
              }
            }
          }
        }
        .data-box {
          flex: 1;
          overflow-x: auto;
          display: flex;
        }
        .camera-box {
          width: 300px;
          display: flex;
        }
        .camera-box:not(:last-child) {
          border-right: 1px dashed #05c65d;
        }

        .text-col {
          // margin-right: 16px;
          width: 90px;
          line-height: 90px;
          word-wrap: break-word;
          writing-mode: vertical-lr;
        }

        .r-box {
          width: 210px;
          text-align: center;
          .text {
            transform: translateX(-40px);
          }

          .border-box {
            position: relative;
            margin: 30px 0 20px 0;
            width: 120px;
            height: 120px;
            line-height: 120px;
            border: #05c65d 1px solid;
            border-radius: 50%;
            background: #05c65d;
            font-size: 40px;
            font-weight: bold;
            color: #fff;
            box-sizing: border-box;
          }

          .border-box::after {
            position: absolute;
            left: -15px;
            top: -15px;
            content: '';
            width: 150px;
            height: 150px;
            border: #05c65d solid 1px;
            border-radius: 50%;
            box-sizing: border-box;
          }
        }
      }

      .select-box {
        display: flex;
        // justify-content: flex-end;
        align-items: center;
        flex: 1;

        .box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 20px;
          flex: 1;
        }

        .sel-r {
          width: 300px;

          .mt-4 {
            margin: 0;
          }
        }
      }
    }

    .operate-box {
      display: flex;
      margin: 20px 0 0;
    }

    .table-box {
      margin-top: 10px;

      .operation-box {
        display: flex;
        justify-content: space-between;

        & > div {
          display: flex;
          align-items: center;

          img {
            margin-right: 6px;
          }
        }
      }
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

::v-deep .el-table .el-table__row .el-table__cell {
  padding: 12px 0;
}

::v-deep .edit-dialog {
  max-height: 700px;
  overflow: auto;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;

    .input-box {
      .el-input {
        margin: 6px 0;
      }
    }

    .title {
      margin: 22px 0;
      color: #05c65d;
      padding: 3px 0;
      border-bottom: #05c65d 1px solid;
      text-align: left;
      font-size: 16px;
    }

    .detail-box {
      padding: 0 40px;
      text-align: left;
      font-size: 16px;

      .details {
        display: flex;
        align-items: center;
        font-size: 16px;
        .details-key {
          border: 1px solid #05c65d;
          .key-item {
            height: 32px;
            line-height: 32px;
            padding: 5px;
          }
          .key-item:not(:last-child) {
            border-bottom: 1px solid #05c65d;
          }
        }
        .details-value {
          flex: 1;
          border: 1px solid #05c65d;
          border-left: none;
          .value-item {
            height: 32px;
            line-height: 32px;
            padding: 5px;
          }
          .value-item:not(:last-child) {
            border-bottom: 1px solid #05c65d;
          }
        }

        .name {
          width: 140px;
        }

        .el-input {
          width: 300px;
        }

        .el-table {
          .el-input {
            width: 100%;
          }
        }
      }

      .details-password {
        .password {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 10px;
          min-width: 200px;

          border: 1px solid #c9c7c7;

          img {
            margin-left: 30px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }

  .btn-box {
    display: flex;
    justify-content: center;

    .btn {
      margin: 0 30px;
    }
  }
}

.btn-box {
  display: flex;
  justify-content: center;

  .btn {
    margin: 0 30px;
  }
}

.remove {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.isDisabled {
  pointer-events: none;
}
.detail-labor {
  ::v-deep .el-input__inner {
    border: none;
    box-shadow: none;
    color: #606266;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    padding-left: 0;
  }
  ::v-deep .el-input__suffix {
    display: none;
  }
}
.icid {
  line-height: 40px;
  .img {
    display: inline-block;
    vertical-align: middle;
  }
  ::v-deep .el-input:first-child {
    width: 80px !important;
  }
}
</style>
<style>
.el-message-box__header {
  border-bottom: #05c65d 1px solid;
}
.no-data-box {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #909399;
}
</style>
