<template>
  <header>
    <span>
      数据统计分析 > 教学仪器设备总量分析
      <!-- <span v-show="addShow">> 新增出借登记</span> -->
    </span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>教学仪器设备总量分析</span>
        <el-button
          v-if="[1, 2].includes(store.state.login.userInfo.role_id)"
          type="primary"
          class="buttonStyle"
          @click="exportExcel()"
        >
          导出
        </el-button>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
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
          </div>
          <div class="sel-item">
            <span>学段:</span>
            <div class="sel">
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
          </div>
          <div class="sel-item">
            <span>时间:</span>
            <div class="sel">
              <el-select v-model="dataAll.formData.year" class="m-2" placeholder="Select" @change="getStore">
                <el-option v-for="item in optionsYear" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>类型:</span>
            <div class="sel">
              <el-select v-model="dataAll.formData.type" class="m-2" placeholder="Select" @change="getStore">
                <el-option label="全部" value=""></el-option>
                <el-option label="设备" value="2"></el-option>
                <el-option label="仪器" value="1"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-l" v-show="[1, 2, 3, 4].includes(dataAll.roleState)">
          <div class="sel-item">
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
          <div class="sel-item" v-show="[1, 2, 3, 4].includes(dataAll.roleState) && dataAll.formData.pro !== ''">
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
          <div class="sel-item" v-show="[1, 2, 3, 4].includes(dataAll.roleState) && dataAll.formData.city !== ''">
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
          <div class="sel-item" v-show="[1, 2, 3, 4].includes(dataAll.roleState) && dataAll.formData.area !== ''">
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
        </div>
        <!-- <div class="sel-l">
          <div class="sel-item">
            <span>区域:</span>
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
          </div>
          <div class="sel-item1">
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
          </div>
          <div class="sel-item1">
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
          </div>
          <div class="sel-item1">
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
          </div>
        </div> -->
      </div>
    </div>
    <div class="msg-box1">
      <div class="all-lab">
        <p>报废总量总价值</p>
        <div>
          <div class="bg-red">
            <div>
              <p>{{ dataAll.scrap_count }}</p>
              <!-- <p>RMB</p> -->
            </div>
          </div>
          <div class="bg-black">
            <div>
              <p>{{ dataAll.scrap_asset_count }}</p>
              <p>RMB</p>
            </div>
          </div>
        </div>
      </div>
      <div class="all-lab">
        <p>维修总量/总价值</p>
        <div>
          <div class="bg-origin">
            <div>
              <p>{{ dataAll.maintain_count }}</p>
              <!-- <p>RMB</p> -->
            </div>
          </div>
          <div class="bg-black">
            <div>
              <p>{{ dataAll.maintain_asset_count }}</p>
              <p>RMB</p>
            </div>
          </div>
        </div>
      </div>
      <div class="all-lab1">
        <div class="green">
          <p>借出量</p>
          <div>
            <div>
              <div>{{ dataAll.lend_count }}</div>
            </div>
          </div>
        </div>
        <div class="origin">
          <p>损坏量</p>
          <div>
            <div>
              <div>{{ dataAll.damage_count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="msg-box">
      <div class="pie-box" id="chart1" ref="chart"></div>
    </div>

    <div class="table-box">
      <el-table :data="dataAll.tableData" style="width: 100%">
        <el-table-column align="left" type="index" label="序号" min-width="18" />
        <el-table-column
          align="left"
          prop="name"
          label="学校"
          min-width="18"
          v-if="[1, 2, 3, 4].includes(dataAll.roleState)"
        >
          <template #default="scope">
            {{ scope.row.school ? scope.row.school : '/' }}
          </template>
        </el-table-column>
        <el-table-column align="left" prop="name" label="学科" min-width="18">
          <template #default="scope">
            {{ scope.row.subject ? scope.row.subject : '全部' }}
          </template>
        </el-table-column>
        <el-table-column align="left" prop="month" label="月份" min-width="18" sortable />
        <el-table-column
          align="left"
          prop="scrap_asset_total"
          label="报废总量/价值"
          min-width="18"
          sortable
          :sort-method="
            (a, b) => {
              return a.scrap_asset_total - b.scrap_asset_total
            }
          "
        >
          <template #default="scope">
            {{ scope.row.scrap_total + '/' + scope.row.scrap_asset_total }}
          </template>
        </el-table-column>
        <el-table-column align="left" prop="name" label="维修总量/价值" min-width="18" sortable>
          <template #default="scope">
            {{ scope.row.maintain_total + '/' + scope.row.maintain_asset_total }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="lend_total"
          label="借出量"
          min-width="18"
          sortable
          :sort-method="
            (a, b) => {
              return a.lend_total - b.lend_total
            }
          "
        />
        <el-table-column
          align="left"
          prop="damage_total"
          label="损坏量"
          min-width="18"
          sortable
          :sort-method="
            (a, b) => {
              return a.damage_total - b.damage_total
            }
          "
        />
        <el-table-column
          align="left"
          prop="total"
          label="剩余"
          min-width="18"
          sortable
          :sort-method="
            (a, b) => {
              return a.total - b.total
            }
          "
        />
      </el-table>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getAssetSummary, findArea, findSchool } from '@service/dataAnalysisApi'
import { useStore } from '@store/index'
import localCache from '@/utils/localCache'
import axios from 'axios'
import { period } from '@/constants/common'
const value = ref('')
const options = ref()
const optionsYear = ref([2020, 2021, 2022, 2023, 2024])
const store = useStore()
let userData: any = store.state.login.userInfo
let roleId = store.state.login.userInfo.role_id
const dataAll: any = reactive({
  roleState: '' as any,
  subjectArr: [...store.state.common.subjectArr],
  proList: [],
  areaList: [],
  cityList: [],
  schoolList: [],
  formData: {
    subject_id: store.state.login.userInfo.subject_id,
    year: new Date().getFullYear(),
    type: '',
    phase_study_id: 0 as any,
    school_id: '' as any,
    pro: '' as any,
    area: '' as any,
    city: '' as any
  },
  tableData: [],
  damage_count: 0,
  lend_count: 0,
  maintain_asset_count: 0,
  maintain_count: 0,
  scrap_asset_count: 0,
  scrap_count: 0
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
// dataAll.formData.phase_study_id = parseInt(userData.phase_study_id)
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
    if (userData.phase_study_id === '1') {
      dataAll.subjectArr = [{ id: 4, name: '小学科学' }]
    } else {
      dataAll.subjectArr = [
        { id: 1, name: '物理' },
        { id: 2, name: '化学' },
        { id: 3, name: '生物' }
      ]
    }
    dataAll.roleState = 5
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
const getStore = () => {
  getAssetSummary(dataAll.formData).then((res: any) => {
    console.log(res)
    dataAll.tableData = res.data.list
    dataAll.damage_count = res.data.damage_count
    dataAll.lend_count = res.data.lend_count
    dataAll.maintain_asset_count = res.data.maintain_asset_count
    dataAll.maintain_count = res.data.maintain_count
    dataAll.scrap_asset_count = res.data.scrap_asset_count
    dataAll.scrap_count = res.data.scrap_count
    console.log('数据', dataAll)
    let xList = []
    let yList = []
    console.log(dataAll.tableData)
    for (let index in dataAll.tableData) {
      xList.push(dataAll.tableData[index].month)
      yList.push(dataAll.tableData[index].total)
    }
    let chartDom = echart.init(chart.value)
    let option = {
      xAxis: {
        type: 'category',
        data: xList,
        name: '月份'
      },
      yAxis: {
        type: 'value',
        name: '教\n学\n仪\n器\n总\n量',
        nameTextStyle: {
          fontSize: 16
        },
        position: 'left',
        nameLocation: 'middle',
        nameGap: 50,
        nameRotate: 0
      },
      series: [
        {
          data: yList,
          type: 'line',
          smooth: true,
          barWidth: 20,
          color: '#05C65D',
          itemStyle: {
            borderRadius: 10
            // color: function (params: any) {
            //   if (params.data > 6) {
            //     return '#05C65D'
            //   } else {
            //     return '#EE9A59'
            //   }
            // }
          }
        }
      ]
    }
    chartDom.setOption(option)
    window.onresize = function () {
      chartDom.resize
    }
  })
}
getStore()
const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/LaboratorySummary/assetSummary',
      { token, ...dataAll.formData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '教学仪器设备总量分析.xlsx'
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
let echart: any = inject('echart')
/**
 * params: chart,绘图dom
 */
const chart = ref(null)
onMounted(() => {
  setFormData()
  getStore()
  // let chartDom = echart.init(chart.value)

  // let option = {
  //   xAxis: {
  //     type: 'category',
  //     data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       data: [10, 2, 3, 4, 1, 6, 8, 4, 8, 11, 12, 2],
  //       type: 'line',
  //       smooth: true,
  //       barWidth: 20,
  //       color: '#05C65D',
  //       itemStyle: {
  //         borderRadius: 10
  //         // color: function (params: any) {
  //         //   if (params.data > 6) {
  //         //     return '#05C65D'
  //         //   } else {
  //         //     return '#EE9A59'
  //         //   }
  //         // }
  //       }
  //     }
  //   ]
  // }
  // chartDom.setOption(option)
  // window.onresize = function () {
  //   chartDom.resize
  // }
})
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
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
    min-height: 120px;

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
      min-height: 60px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;

      .sel-l {
        // float: left;
        width: 100%;
        height: 60px;
        .sel-item {
          float: left;
          margin-top: 20px;
          width: 18%;
          display: flex;
          justify-content: space-between;

          & > span {
            float: left;
            width: 20%;
            height: 30px;
            line-height: 30px;
            text-align: right;
            color: #848484;
          }

          .sel {
            float: left;
            margin-right: 10%;
            width: 60%;
          }
        }
        .sel-item1 {
          float: left;
          margin-top: 20px;
          width: 19%;
          display: flex;
          justify-content: space-between;
          .sel {
            float: left;
            margin-right: 4%;
            width: 96%;
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
      width: 100%;
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
  .msg-box1 {
    margin-top: 20px;
    height: 350px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .all-lab {
      float: left;
      width: 33%;
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      p {
        margin-top: 75px;
        height: 26px;
        line-height: 26px;
      }
      & > div {
        position: relative;
        margin-left: 25%;
        width: 50%;
        height: 180px;
        & > :nth-child(1) {
          position: absolute;
          top: 30px;
          right: 170px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          z-index: 2;
          display: flex;
          align-items: center;
          div {
            text-align: center;
            width: 100%;
            p {
              margin: 0;
              color: #fff;
            }
            & > :nth-child(1) {
              margin-top: 10%;
              font-size: 40px;
            }
          }
        }
        & > :nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 180px;
          height: 180px;
          background-color: #69b38a;
          border-radius: 50%;
          z-index: 1;
          display: flex;
          align-items: center;
          div {
            text-align: center;
            width: 100%;
            p {
              margin: 0;
              color: #fff;
            }
            & > :nth-child(1) {
              margin-top: 10%;
              font-size: 40px;
            }
          }
        }
        & .bg-red {
          background-color: #eb7e75;
        }
        & .bg-black {
          background-color: #707070;
        }
        & .bg-origin {
          background-color: #ee9a59;
        }
      }
    }
    .all-lab1 {
      float: left;
      width: 33%;
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      & > .green {
        float: left;
        margin-left: 15%;
        width: 30%;
        p {
          margin-top: 75px;
          height: 26px;
          line-height: 26px;
          text-align: center;
        }
        & > div {
          margin: 30px auto;
          padding: 1px;
          width: 148px;
          height: 148px;
          border-radius: 50%;
          background-color: #05c65d;
          & > div {
            margin: auto;
            padding: 10px;
            width: 128px;
            height: 128px;
            border-radius: 50%;
            background-color: #fff;
            & > div {
              margin: auto;
              padding: 10px;
              width: 108px;
              height: 108px;
              line-height: 108px;
              font-size: 40px;
              color: #fff;
              border-radius: 50%;
              background-color: #05c65d;
            }
          }
        }
      }
      & > .origin {
        float: left;
        margin-left: 10%;
        width: 30%;
        p {
          margin-top: 75px;
          height: 26px;
          line-height: 26px;
          text-align: center;
        }
        & > div {
          margin: 30px auto;
          padding: 1px;
          width: 148px;
          height: 148px;
          border-radius: 50%;
          background-color: #eea359;
          & > div {
            margin: auto;
            padding: 10px;
            width: 128px;
            height: 128px;
            border-radius: 50%;
            background-color: #fff;
            & > div {
              margin: auto;
              padding: 10px;
              width: 108px;
              height: 108px;
              line-height: 108px;
              font-size: 40px;
              color: #fff;
              border-radius: 50%;
              background-color: #eea359;
            }
          }
        }
      }
    }
  }
  .table-box {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
