<template>
  <header>
    <span>
      数据统计分析 > 教学仪器利用率
      <!-- <span v-show="addShow">> 新增出借登记</span> -->
    </span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>教学仪器利用率</span>
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
            <span>学年学期:</span>
            <div class="sel">
              <el-select v-model="schNow" class="m-2" placeholder="Select">
                <el-option label="全部" :value="null" @click="schChange(null, null)"></el-option>
                <el-option
                  v-for="(item, index) in schoolS"
                  :key="index"
                  :label="item.title"
                  :value="index"
                  @click="schChange(item, index)"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>分类:</span>
            <div class="sel">
              <el-select v-model="dataAll.formData.type_id" class="m-2" placeholder="Select" @change="getStore">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="(item, index) in dataAll.typeList"
                  :key="index"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>类型:</span>
            <div class="sel">
              仪器
              <!-- <el-select v-model="dataAll.formData.type" class="m-2" placeholder="Select" @change="getStore" disabled>
                <el-option label="仪器" :value="1"></el-option>
                <el-option label="设备" :value="2"></el-option>
              </el-select> -->
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
    <div class="msg-box">
      <div class="all-lab">
        <p>教学仪器利用率</p>
        <div>
          <div>
            <div>{{ (dataAll.rate * 100).toFixed(0) + '%' }}</div>
          </div>
        </div>
      </div>
      <div class="pie-box" id="chart1" ref="chart"></div>
    </div>
    <div class="table-box">
      <el-table :data="dataAll.tableData" style="width: 100%">
        <el-table-column align="left" type="index" label="序号" min-width="18" />
        <el-table-column
          align="left"
          prop="school_name"
          label="学校"
          min-width="18"
          v-if="[1, 2, 3, 4].includes(dataAll.roleState)"
        />
        <el-table-column align="left" prop="subject" label="学科" min-width="18" />
        <el-table-column align="left" prop="name" label="仪器名称" min-width="18" />
        <el-table-column align="left" prop="category" label="分类" min-width="18" />
        <el-table-column align="left" prop="number" label="编号" min-width="18" sortable />
        <!-- <template #default="scope">
            {{ scope.row.specification !== '' ? scope.row.specification : '/' }}
          </template>
        </el-table-column> -->
        <el-table-column
          align="left"
          prop="book_count"
          label="使用课时"
          min-width="18"
          sortable
          :sort-method="
            (a, b) => {
              return a.book_count - b.book_count
            }
          "
        >
          <template #default="scope">
            {{ scope.row.book_count !== ('' || null) ? scope.row.book_count : '0' }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="use_amount"
          label="使用件次"
          min-width="18"
          sortable
          :sort-method="
            (a, b) => {
              return a.use_amount - b.use_amount
            }
          "
        >
          <template #default="scope">
            {{ scope.row.use_amount !== ('' || null) ? scope.row.use_amount : '0' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getInsEquUseRate, findArea, findSchool, allType, findschoolyear } from '@service/dataAnalysisApi'
import { useStore } from '@store/index'
import localCache from '@/utils/localCache'
import axios from 'axios'
import { period } from '@/constants/common'
const value = ref()
const options = ref()
const store: any = useStore()
const schNow = ref(null)
const schChange = (value: any, index: any) => {
  console.log(value)
  if (index === null) {
    dataAll.formData.school_year = ''
    dataAll.formData.semester = ''
    getStore()
  } else {
    dataAll.formData.school_year = value.school_year
    dataAll.formData.semester = value.semester
    getStore()
  }
}
const schoolS = ref([])
const getFindschoolyear = async () => {
  schoolS.value = []
  try {
    const PARAMS = {
      phase_study_id: dataAll.formData.phase_study_id
    }
    const { data, code } = await findschoolyear(PARAMS)
    if (code === 10) {
      let obj = {
        school_year: '',
        semester: '',
        title: ''
      }
      data.forEach((item) => {
        obj = {
          school_year: item.year,
          semester: item.semester,
          title: item.semester === 1 ? `${item.year}学年第一学期` : `${item.year}学年第二学期`
        }
        schoolS.value.push(obj)
      })
    }
  } catch (error) {
    console.log(error)
    throw new Error('error')
  }
}
let userData = store.state.login.userInfo
let roleId = store.state.login.userInfo.role_id
const dataAll: any = reactive({
  typeList: [],
  roleState: '' as any,
  subjectArr: [...store.state.common.subjectArr],
  formData: {
    phase_study_id: 0 as any,
    type_id: '' as any,
    subject_id: store.state.login.userInfo.subject_id,
    type: 1,
    school_year: '',
    semester: '',
    school_id: '' as any,
    pro: '' as any,
    area: '' as any,
    city: '' as any
  },
  tableData: [],
  total: 0,
  rate: 0
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
// dataAll.formData.phase_study_id = parseInt(store.state.login.userInfo.phase_study_id)
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
allType({ type: 1 }).then((res) => {
  console.log(res)
  dataAll.typeList = res.data
})
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
const getStore = () => {
  getInsEquUseRate(dataAll.formData).then((res: any) => {
    console.log(res)
    dataAll.rate = res.data.avg_used
    dataAll.tableData = res.data.use_rate_list
    let list = res.data.group_cate
    let xList = []
    let yList = []
    console.log(list)
    for (let index in list) {
      xList.push(list[index].category)
      yList.push(list[index].rate * 100)
    }
    let chartDom = echart.init(chart.value)
    let option = {
      xAxis: {
        type: 'category',
        data: xList
      },
      yAxis: {
        type: 'value',
        // max: 100,
        min: 0,
        name: '教\n学\n分\n类\n利\n用\n率\n%',
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
          type: 'bar',
          barWidth: 20,
          color: '#05C65D',
          itemStyle: {
            borderRadius: 10,
            color: function (params: any) {
              if (params.data > 50) {
                return '#05C65D'
              } else {
                return '#EE9A59'
              }
            }
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
const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/LaboratorySummary/useRate',
      { token, ...dataAll.formData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '教学仪器利用率.xlsx'
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
  getFindschoolyear()
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
          margin-top: 16px;
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
            line-height: 30px;
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
            font-size: 32px;
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
