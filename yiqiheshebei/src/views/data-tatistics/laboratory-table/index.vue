<template>
  <header>
    <span>
      数据统计分析 > 实验室配置达标分析
      <!-- <span v-show="addShow">> 新增出借登记</span> -->
    </span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>实验室配置达标分析</span>
        <el-button
          v-if="[1, 2].includes(store.state.login.userInfo.role_id)"
          v-show="!pageShow"
          type="primary"
          class="buttonStyle"
          @click="exportExcel()"
        >
          导出
        </el-button>
        <img @click="pageShow = false" v-show="pageShow" src="@/assets/images/common/cancel.png" alt="" />
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item" v-show="pageShow && [1, 2, 3, 4].includes(dataAll.roleState)">
            <span>学校:</span>
            <div class="sel" v-show="pageShow">{{ dataAll.school_name }}</div>
          </div>
          <div class="sel-item">
            <span>学科:</span>
            <div class="sel" v-show="!pageShow">
              <el-select
                :disabled="roleId === 2"
                v-model="dataAll.formData.subject_id"
                class="m-2"
                placeholder="Select"
                @change="getStore"
              >
                <el-option label="全部" :value="0"></el-option>
                <el-option
                  v-for="item in dataAll.subjectArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="sel" v-show="pageShow">
              {{
                ['全部', '物理', '化学', '生物', '小学科学', '历史', '地理', '音乐', '体育', '美术'][
                  dataAll.formData.subject_id
                ]
              }}
            </div>
          </div>
          <!-- <div class="sel-item" v-show="!pageShow">
            <span>学科:</span>
            <div class="sel">
              <el-select
                :disabled="roleId === 2"
                v-model="dataAll.formData.subject_id"
                class="m-2"
                placeholder="Select"
                @change="getStore"
              >
                <el-option label="全部" :value="0"></el-option>
                <el-option
                  v-for="item in dataAll.subjectArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div> -->
          <div class="sel-item">
            <span>学段:</span>
            <div class="sel" v-show="!pageShow">
              <el-select
                v-model="dataAll.formData.phase_study_id"
                class="m-2"
                placeholder="Select"
                :disabled="![1, 2, 3, 4, 5, 6].includes(dataAll.roleState)"
                @change="getStore"
              >
                <el-option
                  v-for="item in phaseStudyIdList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="sel" v-show="pageShow">
              {{ ['全部', '小学', '初中', '高中'][dataAll.formData.phase_study_id] }}
            </div>
          </div>
          <div class="sel-item" v-show="!pageShow">
            <span>标准测算:</span>
            <div class="sel">
              <el-select
                v-model="dataAll.formData.stand_level"
                class="m-2"
                placeholder="请选择"
                :teleported="false"
                @change="getStore"
              >
                <el-option v-for="item in measurementList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
          <div class="sel-item" v-show="[1, 2, 3, 4].includes(dataAll.roleState) && !pageShow">
            <span>省:</span>
            <div class="sel">
              <el-select
                v-model="dataAll.formData.pro"
                class="m-2"
                placeholder="Select"
                :disabled="[2, 3, 4].includes(dataAll.roleState)"
              >
                <el-option label="全部" value="" @click="getAreaList(2, '')"></el-option>
                <el-option
                  v-for="(item, index) in dataAll.proList"
                  :key="index"
                  :label="item.name"
                  :value="item.pro"
                  @click="getAreaList(2, item.pro)"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div
            class="sel-item"
            v-show="[1, 2, 3, 4].includes(dataAll.roleState) && !pageShow && dataAll.formData.pro !== ''"
          >
            <span>市:</span>
            <div class="sel">
              <el-select
                v-model="dataAll.formData.city"
                class="m-2"
                placeholder="Select"
                :disabled="[3, 4].includes(dataAll.roleState)"
              >
                <el-option label="全部" value="" @click="getAreaList(3, '')"></el-option>
                <el-option
                  v-for="(item, index) in dataAll.cityList"
                  :key="index"
                  :label="item.name"
                  :value="item.city"
                  @click="getAreaList(3, item.city)"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div
            class="sel-item"
            v-show="[1, 2, 3, 4].includes(dataAll.roleState) && !pageShow && dataAll.formData.city !== ''"
          >
            <span>区:</span>
            <div class="sel">
              <el-select
                v-model="dataAll.formData.area"
                class="m-2"
                placeholder="Select"
                :disabled="[4].includes(dataAll.roleState)"
              >
                <el-option label="全部" value="" @click="getAreaList(4, '')"></el-option>
                <el-option
                  v-for="(item, index) in dataAll.areaList"
                  :key="index"
                  :label="item.name"
                  :value="item.area"
                  @click="getAreaList(4, item.area)"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div
            class="sel-item"
            v-show="[1, 2, 3, 4].includes(dataAll.roleState) && !pageShow && dataAll.formData.area !== ''"
          >
            <span>学校:</span>
            <div class="sel">
              <el-select v-model="dataAll.formData.school_id" class="m-2" placeholder="Select">
                <el-option label="全部" value="" @click="getAreaList(5, '')"></el-option>
                <el-option
                  v-for="(item, index) in dataAll.schoolList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                  @click="getAreaList(5, item.id)"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item" v-show="pageShow">
            <span>实验室:</span>
            <div class="sel" v-show="pageShow">{{ dataAll.labName }}</div>
          </div>
          <div class="sel-item" v-show="pageShow">
            <span>类型:</span>
            <div class="sel" v-show="pageShow">{{ dataAll.labType }}</div>
          </div>
          <!-- <div class="sel-item">
            <span>学段:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div> -->
        </div>

        <!-- <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="selMsg.keyword" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <div class="ser-icon">
                  <img src="@assets/images/account-school/search.png" @click="getEquLendList" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div> -->
      </div>
    </div>
    <!-- <div class="msg-box">
      <div class="all-lab">
        <p>功能室总数</p>
        <div>
          <div>
            <div>21</div>
          </div>
        </div>
      </div>
      <div class="pie-box" id="chart1" ref="chart"></div>
    </div> -->
    <div class="table-box" v-show="!pageShow">
      <el-table :data="dataAll.tableData" style="width: 100%">
        <el-table-column align="left" type="index" label="序号" min-width="18" />
        <el-table-column
          align="left"
          prop="name"
          label="学校"
          width="300"
          v-if="[1, 2, 3, 4].includes(dataAll.roleState)"
        />
        <el-table-column align="left" prop="phase_study_id" label="学段" min-width="18">
          <template #default="scope">
            {{ ['全部', '小学', '初中', '高中'][scope.row.phase_study_id] }}
          </template>
        </el-table-column>
        <el-table-column align="left" prop="sub_name" label="学科" min-width="18" />
        <el-table-column align="left" prop="labor_name" label="实验室名称" min-width="18" />
        <el-table-column align="left" prop="lab_type" label="实验室类型" min-width="18" />
        <el-table-column align="left" prop="instrument_type_count" label="设备种类" min-width="18" sortable />
        <el-table-column
          align="left"
          prop="instrument_total"
          label="设备数量"
          min-width="18"
          sortable
          :sort-method="
            (a, b) => {
              return a.instrument_total - b.instrument_total
            }
          "
        />
        <el-table-column align="left" prop="" label="达标情况" min-width="18">
          <template #default="scope">
            {{ scope.row.is_finish === '1' ? '达标' : '不达标' }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" min-width="18">
          <template #default="scope">
            <span
              @click="
                examineDetailClick(
                  scope.row.school_laboratory_id,
                  scope.row.labor_name,
                  scope.row.lab_type,
                  scope.row.name,
                  scope.row.labor_stand_id
                )
              "
              class="green-text point"
            >
              查看
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-box" v-show="pageShow">
      <el-table :data="dataAll.tableData1" style="width: 100%">
        <el-table-column align="left" prop="number" label="编号" min-width="18" />
        <el-table-column align="left" prop="name" label="名称" min-width="18" />
        <el-table-column align="left" prop="stand_value" label="标准数量" min-width="18" />
        <el-table-column align="left" prop="origin_amount" label="实际数量" min-width="18" />

        <!-- <el-table-column align="left" prop="I" label="1类数量" min-width="18" />
        <el-table-column align="left" prop="II" label="2类数量" min-width="18" />
        <el-table-column align="left" prop="III" label="3类数量" min-width="18" /> -->
        <el-table-column align="left" prop="" label="达标情况" min-width="18">
          <template #default="scope">
            {{ scope.row.is_finish === 1 ? '达标' : '不达标' }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <table style="width: 600px; border-collapse: collapse; border: 1px solid">
      <tr>
        <th style="border: 1px solid; text-align: center">组1</th>
        <th style="border: 1px solid; text-align: center">组2</th>
        <th style="border: 1px solid; text-align: center" colspan="2">组3</th>
      </tr>
      <tr>
        <th style="border: 1px solid; text-align: center">标题1</th>
        <th style="border: 1px solid; text-align: center">标题2</th>
        <th style="border: 1px solid; text-align: center">标题3</th>
        <th style="border: 1px solid; text-align: center">标题4</th>
      </tr>
      <tr>
        <td style="border: 1px solid; text-align: center">内容1</td>
        <td style="border: 1px solid; text-align: center">内容2</td>
        <td style="border: 1px solid; text-align: center">内容3</td>
        <td style="border: 1px solid; text-align: center">内容4</td>
      </tr>
    </table> -->
  </main>

  <ExamineDetail ref="ExamineDeta"></ExamineDetail>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, onMounted } from 'vue'
// import { ElMessageBox, ElMessage } from 'element-plus'
import { getStoreNumTable, getlabe, findArea, findSchool } from '@service/dataAnalysisApi'
import { useStore } from '@store/index'
import { ExamineDetail } from './component/index'
import localCache from '@/utils/localCache'
import axios from 'axios'
import { period } from '@/constants/common'
const pageShow = ref(false)
const store: any = useStore()
console.log(store.state.login.userInfo)
let userData = store.state.login.userInfo
let roleId = store.state.login.userInfo.role_id
let schoolType = parseInt(store.state.login.userInfo.phase_study_id)
const measurementList = ref([
  {
    label: '按照省级标准测算',
    value: 1
  },
  {
    label: '按照市级标准测算',
    value: 2
  },
  {
    label: '按照区级标准测算',
    value: 3
  }
])
const dataAll: any = reactive({
  roleState: '' as any,
  school_name: '',
  labName: '',
  labType: '',
  subjectArr: [...store.state.common.subjectArr],
  proList: [],
  areaList: [],
  cityList: [],
  schoolList: [],
  formData: {
    phase_study_id: 0,
    subject_id: store.state.login.userInfo.subject_id,
    school_id: '' as any,
    pro: '' as any,
    area: '' as any,
    city: '' as any,
    stand_level: store.state.common.currentStandLevelData.lab_standard
  },
  tableData: [],
  tableData1: [],
  total: 0
})
const phaseStudyIdList = ref<any>([
  {
    id: 0,
    name: '全部'
  }
])
period.forEach((item) => {
  store.state.login.userInfo.phase_study_id.split(',').forEach((ele) => {
    if (item.id == ele) {
      phaseStudyIdList.value.push({ ...item })
    }
  })
})
const getStore = () => {
  getStoreNumTable(dataAll.formData).then((res: any) => {
    console.log(res)
    dataAll.tableData = res.data.list
  })
}
getStore()
// 筛选框选择
const getAreaList1 = (area_level: any, p_id: any) => {
  if (area_level === 1) {
    findArea({ area_level: area_level, p_id: p_id }).then((res) => {
      console.log(res)
      dataAll.proList = res.data
    })
  } else if (area_level === 2) {
    findArea({ area_level: area_level, p_id: p_id }).then((res) => {
      console.log(res)
      dataAll.cityList = res.data
    })
  } else if (area_level === 3) {
    findArea({ area_level: area_level, p_id: p_id }).then((res) => {
      console.log(res)
      dataAll.areaList = res.data
    })
  } else if (area_level === 4) {
    findSchool({ area: dataAll.formData.area }).then((res) => {
      console.log(res)
      dataAll.schoolList = res.data
    })
  }
}
const getAreaList = (area_level: any, p_id: any) => {
  if (area_level === 1) {
    findArea({ area_level: area_level, p_id: p_id }).then((res) => {
      console.log(res)
      dataAll.proList = res.data
      dataAll.formData.area = ''
      dataAll.formData.city = ''
      dataAll.formData.school_id = ''
      getStore()
    })
  } else if (area_level === 2) {
    findArea({ area_level: area_level, p_id: p_id }).then((res) => {
      console.log(res)
      dataAll.cityList = res.data
      dataAll.formData.area = ''
      dataAll.formData.city = ''
      dataAll.formData.school_id = ''
      getStore()
    })
  } else if (area_level === 3) {
    findArea({ area_level: area_level, p_id: p_id }).then((res) => {
      console.log(res)
      dataAll.areaList = res.data
      dataAll.formData.area = ''
      dataAll.formData.school_id = ''
      getStore()
    })
  } else if (area_level === 4) {
    findSchool({ area: dataAll.formData.area }).then((res) => {
      console.log(res)

      dataAll.schoolList = res.data
      dataAll.formData.school_id = ''
      getStore()
    })
  } else if (area_level === 5) {
    console.log(11111)
    getStore()
  }
}
// 配置权限
const setFormData = async () => {
  console.log(11111)
  if (roleId === 102) {
    console.log('苏威尔后台管理员')
    dataAll.roleState = 1
  } else if (roleId === 100) {
    console.log('区域管理员')
    if (userData.area_level === 1) {
      console.log('省级区域管理员')
      dataAll.roleState = 2
      await getAreaList1(1, '')
      dataAll.formData.pro = userData.pro

      getAreaList(2, dataAll.formData.pro)
    } else if (userData.area_level === 2) {
      console.log('市级区域管理员')
      dataAll.roleState = 3
      await getAreaList1(1, '')
      dataAll.formData.pro = userData.pro
      dataAll.formData.city = userData.city
      getAreaList1(2, dataAll.formData.pro)

      getAreaList(3, dataAll.formData.city)
    } else if (userData.area_level === 3) {
      console.log('区级区域管理员')
      dataAll.roleState = 4

      await getAreaList1(1, '')
      dataAll.formData.pro = userData.pro
      dataAll.formData.city = userData.city
      dataAll.formData.area = userData.area
      // console.log(userData)
      // console.log(userData.pro)
      // console.log(userData.city)
      // console.log(userData.area)
      console.log(dataAll.formData)

      getAreaList1(2, dataAll.formData.pro)
      getAreaList1(3, dataAll.formData.city)
      getAreaList(4, dataAll.formData.area)
    }
  } else if (roleId === 1) {
    console.log('学校管理员')
    dataAll.formData.pro = userData.pro
    dataAll.formData.city = userData.city
    dataAll.formData.area = userData.area
    dataAll.formData.school_id = userData.school_id
    dataAll.roleState = 5
    if (userData.phase_study_id === '1') {
      dataAll.subjectArr = [{ id: 4, name: '小学科学' }]
    } else {
      dataAll.subjectArr = [
        { id: 1, name: '物理' },
        { id: 2, name: '化学' },
        { id: 3, name: '生物' }
      ]
    }
    getStore()
  } else if (roleId === 2) {
    console.log('实验室管理员')
    dataAll.formData.pro = userData.pro
    dataAll.formData.city = userData.city
    dataAll.formData.area = userData.area
    dataAll.formData.school_id = userData.school_id
    dataAll.roleState = 6
    getStore()
  } else if (roleId === 3) {
    console.log('备课组长')
    dataAll.roleState = 7
    dataAll.formData.pro = userData.pro
    dataAll.formData.city = userData.city
    dataAll.formData.area = userData.area
    dataAll.formData.school_id = userData.school_id
  } else if (roleId === 4) {
    console.log('教师')
    dataAll.roleState = 8
    dataAll.formData.pro = userData.pro
    dataAll.formData.city = userData.city
    dataAll.formData.area = userData.area
    dataAll.formData.school_id = userData.school_id
  } else if (roleId === 5) {
    console.log('实验室总管理员')
    dataAll.roleState = 9
    dataAll.formData.pro = userData.pro
    dataAll.formData.city = userData.city
    dataAll.formData.area = userData.area
    dataAll.formData.school_id = userData.school_id
    if (userData.phase_study_id === '1') {
      dataAll.subjectArr = [{ id: 4, name: '小学科学' }]
    } else {
      dataAll.subjectArr = [
        { id: 1, name: '物理' },
        { id: 2, name: '化学' },
        { id: 3, name: '生物' }
      ]
    }
    getStore()
  }
}
setFormData()

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/LaboratorySummary/equipmentSummaryList',
      { token, ...dataAll.formData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '实验室配置达标分析.xlsx'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}
const edit = (item: any) => {
  console.log(item)
}
const ExamineDeta = ref()
const examineDetailClick = (
  id: number | string,
  name: string,
  type: string,
  sch_name: string,
  labor_stand_id: number
) => {
  console.log(id)
  dataAll.school_name = sch_name
  dataAll.labName = name
  dataAll.labType = type
  getlabe({ id: id, type: 2, labor_stand_id }).then((res) => {
    console.log(res)
    dataAll.tableData1 = res.data
    pageShow.value = true
  })
  // ExamineDeta.value.getDetail(id)
}
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
    width: 100%;
    height: 120px;

    .operation {
      padding: 0 24px;
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      box-sizing: border-box;
      & > span {
        float: left;
        font-size: 20px;
        color: #05c65d;
        font-weight: bold;
      }

      & > img {
        margin-right: 40px;
        width: 20px;
        height: 20px;
        cursor: pointer;
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
        width: 100%;

        .sel-item {
          float: left;
          margin-top: 16px;
          width: 25%;
          display: flex;
          justify-content: space-between;

          & > span {
            float: left;
            width: 70px;
            height: 30px;
            line-height: 30px;
            text-align: right;
            color: #848484;
          }

          .sel {
            flex: 1;
            float: left;
            line-height: 30px;
            // margin-right: 10%;
            // width: 60%;
            text-align: left;
          }
        }
      }

      .sel-r {
        float: right;
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
  .msg-box {
    margin-top: 20px;
    height: 350px;
    width: 100%;
    .all-lab {
      float: left;
      width: 350px;
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      p {
        margin-top: 75px;
        height: 26px;
        line-height: 26px;
      }
      & > div {
        margin: 30px auto;
        padding: 10px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #05c65d;
        & > div {
          margin: auto;
          padding: 10px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #fff;
          & > div {
            margin: auto;
            padding: 10px;
            width: 80px;
            height: 80px;
            line-height: 80px;
            font-size: 40px;
            color: #fff;
            border-radius: 50%;
            background-color: #05c65d;
          }
        }
      }
    }
    .pie-box {
      float: right;
      width: calc(100% - 370px);
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
  .table-box {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
