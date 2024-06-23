<template>
  <div class="school-container">
    <div class="col col-first">
      <div
        class="course-opening-rate course-border"
        v-loading="openCourseLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          开课率
          <el-tooltip effect="light" content="计算说明" placement="top">
            <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
          </el-tooltip>
        </div>
        <bar-chart v-if="openCourseData.length !== 0" :customOption="openCourseOption" />
      </div>
      <div
        class="course-opening-num course-border"
        v-loading="subjectLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          学科开课数
          <el-tooltip effect="light" content="计算说明" placement="top">
            <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
          </el-tooltip>
        </div>
        <bar-chart v-if="subjectData.length !== 0" :customOption="subjectOption" />
      </div>
    </div>
    <div
      class="col col-second course-list-border"
      v-loading="experimentLoading"
      element-loading-text="加载中..."
      element-loading-background="#010527"
    >
      <div class="title1">
        <img src="../../../../assets/images/bigData/icon1.png" alt="" />
        实验开课数据
      </div>
      <ul class="open-course-list" v-if="experimentList.length !== 0">
        <li v-for="(item, index) in experimentList" :key="index">
          {{
            `${item.school_name}/${item.laboratory_name}/${[...item.exp_name]}/${GRADEARR[item.grade]}/${
              item.teacher_name
            }/${item.start}`
          }}
        </li>
      </ul>
    </div>
    <div class="col col-third">
      <div
        class="frequency course-border"
        v-loading="frequencyLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          开课频次
          <el-tooltip effect="light" content="计算说明" placement="top">
            <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
          </el-tooltip>
        </div>
        <line-chart v-if="demonstrationData.length !== 0 || groupData.length !== 0" :customOption="frequencyOption" />
      </div>
      <div
        class="class-course-opening-num course-border"
        v-loading="classLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          年级开课数
          <el-tooltip effect="light" content="计算说明" placement="top">
            <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
          </el-tooltip>
        </div>
        <bar-chart v-if="classData.length !== 0" :customOption="classOption" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GRADEARR } from '@/constents/common'
import {
  expBookRate,
  expBookNumBySubject,
  expBookDate,
  expFrequency,
  expBookNumByGrade
} from '@/service/dataPage/index'
import { openCourse, subject, frequency, classOpenCourse } from '../chart-options/index'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
//路由
const router = useRouter()
const props = defineProps(['city', 'area', 'school', 'schoolyear'])
const EXPBOOKRATETYPE = ['总开课', '分组实验', '演示实验']
let school_year = ref<number | string>('')
let semester = ref<number | string>('')
//开课率图表数据
let openCourseOption: any = ref({})
let openCourseData = ref<any>([])
let openCourseLoading = ref(false)
const getExpBookRate = async () => {
  openCourseLoading.value = true
  openCourseOption.value = JSON.parse(JSON.stringify(openCourse))
  openCourseData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year.value,
      semester: semester.value
    }
    const { data, code } = await expBookRate(params)
    if (code === 10) {
      openCourseData.value = data
      openCourseData.value.forEach((item: any) => {
        openCourseOption.value.yAxis.data.unshift(EXPBOOKRATETYPE[item.type])
        openCourseOption.value.series[0].data.unshift((item.rate * 100).toFixed(0))
      })
    }
    openCourseLoading.value = false
  } catch (error) {
    openCourseLoading.value = false
    console.log(error)
  }
}
//学科开课数图表数据
let subjectOption: any = ref({})
let subjectData = ref<any>([])
let subjectLoading = ref(false)
const getExpBookNumBySubject = async () => {
  subjectLoading.value = true
  subjectOption.value = JSON.parse(JSON.stringify(subject))
  subjectData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year.value,
      semester: semester.value
    }
    const { data, code } = await expBookNumBySubject(params)
    if (code === 10) {
      data.forEach((item: any) => {
        let keys: any = []
        let values: any = []
        keys.push(item.name)
        values.push(item.num)
        subjectData.value.push([...keys, ...values])
      })
      subjectOption.value.series[0].data = subjectData.value
    }
    subjectLoading.value = false
  } catch (error) {
    subjectLoading.value = false
    console.log(error)
  }
}
//开课频次图表数据
let frequencyOption: any = ref({})
let demonstrationData = ref<any>([])
let groupData = ref<any>([])
let frequencyLoading = ref(false)
const getExpFrequency = async () => {
  frequencyLoading.value = true
  frequencyOption.value = JSON.parse(JSON.stringify(frequency))
  demonstrationData.value = []
  groupData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year.value,
      semester: semester.value
    }
    const { data, code } = await expFrequency(params)
    if (code === 10) {
      demonstrationData.value = data.demonstration || []
      groupData.value = data.group || []
      groupData.value?.forEach((item: any) => {
        frequencyOption.value.xAxis.data.push(item.name)
        frequencyOption.value.series[0].data.push(item.num)
      })
      demonstrationData.value.forEach((item: any) => {
        frequencyOption.value.series[1].data.push(item.num)
      })
    }
    frequencyLoading.value = false
  } catch (error) {
    frequencyLoading.value = false
    console.log(error)
  }
}

//年级开课数
let classOption: any = ref({})
let classData = ref<any>([])
let classLoading = ref(false)
const getExpBookNumByGrade = async () => {
  classLoading.value = true
  classOption.value = JSON.parse(JSON.stringify(classOpenCourse))
  classData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year.value,
      semester: semester.value
    }
    const { data, code } = await expBookNumByGrade(params)
    if (code === 10) {
      classData.value = data
      classData.value.forEach((item: any) => {
        classOption.value.yAxis.data.push(item.grade_name)
        classOption.value.series[0].data.push(item.num)
      })
    }
    classLoading.value = false
  } catch (error) {
    classLoading.value = false
    console.log(error)
  }
}
//实验开课数据
const experimentList = ref<any>([])
let experimentLoading = ref(false)
const getUseList = async () => {
  experimentLoading.value = true
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year.value,
      semester: semester.value
    }
    const { data, code } = await expBookDate(params)
    if (code === 10) {
      experimentList.value = data.slice(0, 20)
    }
    experimentLoading.value = false
  } catch (error) {
    experimentLoading.value = false
    console.log(error)
  }
}

//去计算说明
const jumpComputeIntro = () => {
  console.log('123')
  router.push('/computeIntro')
}

watch(
  () => props.schoolyear,
  (newValue, oldValue) => {
    school_year.value = Number(newValue.split(',')[0])
    semester.value = Number(newValue.split(',')[1])
  },
  { immediate: true }
)
watch([() => props.city, () => props.area, () => props.school, () => props.schoolyear], (newValue, oldValue) => {
  getExpBookRate()
  getExpBookNumBySubject()
  getUseList()
  getExpFrequency()
  getExpBookNumByGrade()
})
onMounted(() => {
  getExpBookRate()
  getExpBookNumBySubject()
  getUseList()
  getExpFrequency()
  getExpBookNumByGrade()
})
</script>

<style lang="scss" scoped>
// @mixin insetShadow {
//   font-size: 16px;
//   font-weight: bold;
//   font-style: italic;
//   text-align: center;
//   box-shadow: inset 0 0 20px #09daff;
//   // border-radius: 10px;
//   padding: 20px;
//   box-sizing: border-box;
// }
// @mixin borderLinearGradient {
//   border-style: solid;
//   border-width: 2px;
//   border-image: linear-gradient(to bottom, #008aff, #09daff) 1;
// }
.school-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  box-sizing: border-box;
  .col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .col:not(:last-child) {
    margin-right: 20px;
  }
}
.title {
  width: 100%;
  position: absolute;
  top: 10px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-style: italic;
  img {
    margin-right: 10px;
  }
  .el-tooltip__trigger {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    cursor: pointer;
    z-index: 1;
  }
}
.col-first {
  width: 30%;
  > div {
    height: 50%;
    // @include insetShadow();
    // @include borderLinearGradient();
  }
  .course-opening-num {
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
  .course-opening-rate {
    margin-bottom: 20px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
}
.col-second {
  width: 36%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  // @include borderLinearGradient();

  .title1 {
    position: relative;
    top: 10px;
    font-size: 20px;
    font-weight: bold;
    font-style: italic;
    line-height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin-right: 10px;
    }
  }
  .open-course-list {
    flex: 1;
    text-align: left;
    background: #003455;
    border-radius: 16px;
    // border: 1px solid #6e6e6e;
    margin: 20px;
    overflow: auto;
    li {
      line-height: 35px;
      // color: #12cbf1;
      border-bottom: 1px solid #317cab;
      padding: 5px 20px;
      box-sizing: border-box;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
.col-third {
  width: 30%;
  > div {
    height: 50%;
    // @include insetShadow();
    // @include borderLinearGradient();
  }
  .frequency {
    margin-bottom: 20px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
  .class-course-opening-num {
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
}
.course-border {
  background: url('../../../../assets/images/bigData/com-border.png') no-repeat;
  background-size: 100% 100%;
}
.course-list-border {
  background: url('../../../../assets/images/bigData/list-border.png') no-repeat;
  background-size: 100% 100%;
}
</style>
