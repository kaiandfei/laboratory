<template>
  <div>
    <div class="top-select" :class="{ 'has-height': false }">
      <div v-if="options.includes('school_name')" class="select-box">
        <span>学校</span>
        <div>
          <el-input v-model="searchForm.school_name" placeholder="" />
        </div>
      </div>
      <div v-if="options.includes('time_ids')" class="select-box">
        <span>学段</span>
        <el-select v-model="searchForm.time_ids" clearable @change="changeTimeIds">
          <el-option v-for="(item, index) in stageList" :key="index" :value="item.id" :label="item.name" />
        </el-select>
      </div>

      <div v-if="options.includes('subject_id')" class="select-box">
        <span>学科</span>
        <el-select
          v-model="searchForm.subject_id"
          clearable
          :disabled="[2, 3, 4].includes(store.state.login.userInfo.role_id)"
        >
          <el-option v-for="(item, index) in subjectArr" :key="index" :value="item.id" :label="item.name" />
        </el-select>
      </div>
      <!-- <div
        v-if="
          options.includes('subject_id') &&
          [2, 3, 4].includes(store.state.login.userInfo.role_id)
        "
        class="select-box"
      >
        <span>学科</span>
        <span>{{ subjectName(searchForm.subject_id) }}</span>
      </div> -->
      <div v-if="options.includes('star')" class="select-box">
        <span>星级</span>
        <el-select v-model="searchForm.star" clearable>
          <el-option v-for="(m, n) in starList" :key="n" :label="m.label" :value="m.value" />
        </el-select>
      </div>
      <div v-if="options.includes('level')" class="select-box">
        <span>星级</span>
        <el-select v-model="searchForm.level" clearable>
          <el-option v-for="(m, n) in starList" :key="n" :label="m.label" :value="m.value" />
        </el-select>
      </div>
      <div v-if="options.includes('grade')" class="select-box">
        <span>年级</span>
        <el-select v-model="searchForm.grade" clearable placeholder="全部">
          <el-option v-for="(item, index) in gradeList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div v-if="options.includes('semester')" class="select-box">
        <span>学年学期</span>
        <el-select v-model="searchForm.semester" :disabled="readonly.includes('semester')">
          <el-option
            v-for="(item, index) in yearList"
            :key="index"
            :value="item.school_year + '-' + item.semester"
            :label="item.year + `第${item.semester === 1 ? '一' : '二'}学期`"
          />
        </el-select>
      </div>

      <div v-if="options.includes('type_ins')" class="select-box">
        <span>类型</span>
        <el-select v-model="searchForm.type" clearable>
          <el-option v-for="(m, n) in insList" :key="n" :label="m" :value="n + 1" />
        </el-select>
      </div>
      <div v-if="options.includes('labor_type')" class="select-box">
        <span>功能室类型</span>
        <el-select v-model="searchForm.labor_type" clearable>
          <el-option v-for="(m, n) in roomList" :key="n" :label="m.name" :value="m.id" />
        </el-select>
      </div>
      <div v-if="options.includes('type')" class="select-box">
        <span>实验类型</span>
        <el-select v-model="searchForm.type" clearable>
          <el-option v-for="(m, n) in groupTypeList" :key="n" :label="m" :value="n + 1" />
        </el-select>
      </div>
      <div v-if="options.includes('number')" class="select-box">
        <span>仪器编号</span>
        <div>
          <el-input v-model="searchForm.number" placeholder="" />
        </div>
      </div>
      <div v-if="options.includes('equipment_number')" class="select-box">
        <span>设备编号</span>
        <div>
          <el-input v-model="searchForm.number" placeholder="" />
        </div>
      </div>
      <div v-if="options.includes('instrument_name')" class="select-box">
        <span>仪器名称</span>
        <div>
          <el-input v-model="searchForm.instrument_name" placeholder="" />
        </div>
      </div>
      <div v-if="options.includes('equipment_name')" class="select-box">
        <span>设备名称</span>
        <div>
          <el-input v-model="searchForm.instrument_name" placeholder="" />
        </div>
      </div>
      <div class="button-box">
        <button class="btn" @click="changeValue()">
          <img src="@/assets/images/common/seach.png" alt="" />
          搜索
        </button>
        <button class="btn" @click="changeValue('generateStatisticalChart')">生成统计图</button>
        <button class="btn btn-white" @click="changeValue('exportExcel')">
          <img src="@/assets/images/common/export.png" alt="" />
          导出
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { findschoolyear, getSubjectTeach } from '@service/login/login'
import { Laboratorytype } from '@service/more-data'
import { useStore } from '@/store/index'

export default {
  name: 'TopFilter',
  emits: ['changes'],
  props: {
    options: {
      type: Array,
      default: () => ['time_ids', 'semester', 'subject_id', 'grade', 'exp_name', 'type']
    },
    readonly: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      store: useStore(),
      searchForm: {
        // school_year: useStore().getters.getSchoolDate.year,
        time_ids: useStore().state.login.userInfo.phase_study_id
          ? Number(useStore().state.login.userInfo.phase_study_id.split(',')[0])
          : '',
        semester:
          new Date().getMonth() + 1 <= 8 && new Date().getMonth() + 1 > 2
            ? new Date().getFullYear() - 1 + '-' + 2
            : new Date().getFullYear() + '-' + 1,
        subject_id: useStore().state.login.userInfo.subject_id || '',
        grade: '',
        school_name: '',
        start: '',
        level: '',
        number: '',
        instrument_name: '',
        exp_name: '',
        labor_type: '',
        type: '' // 实验类型
      },
      stageList: [
        {
          name: '小学',
          id: 1
        },
        {
          name: '初中',
          id: 2
        },
        {
          name: '高中',
          id: 3
        }
      ],
      yearList: [],

      gradeListBase: [],
      gradeList: [],
      starList: [
        {
          label: '五星',
          value: 1
        },
        {
          label: '四星',
          value: 2
        },
        {
          label: '三星',
          value: 3
        }
      ],
      subjectArr: [],
      groupTypeList: ['分组', '演示', '其他'],
      insList: ['仪器', '设备'],
      roomList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getYear()
    this.getSub()
    this.getLabType()
    let gradeArr = [
      '',
      '一年级',
      '二年级',
      '三年级',
      '四年级',
      '五年级',
      '六年级',
      '七年级',
      '八年级',
      '九年级',
      '高一',
      '高二',
      '高三'
    ]
    this.stageList = this.stageList.filter(
      (e) =>
        !this.store.state.login.userInfo.phase_study_id || this.store.state.login.userInfo.phase_study_id.includes(e.id)
    )
    console.log('🚀 ~ created ~ stageList:', this.stageList, this.store.state.login.userInfo)
    const arr = [...gradeArr]
    arr.shift()
    this.gradeListBase = arr
      .map((e, i) => {
        return {
          value: i + 1,
          label: e
        }
      })
      .filter((e) => {
        if (this.store.state.login.userInfo.school.school_type_id === 1) {
          return e.value <= 6
        } else if (this.store.state.login.userInfo.school.school_type_id === 2) {
          return e.value > 6 && e.value <= 9
        } else if (this.store.state.login.userInfo.school.school_type_id === 3) {
          return e.value > 9 && e.value <= 12
        } else if (this.store.state.login.userInfo.school.school_type_id === 4) {
          return e.value > 6 && e.value <= 12
        } else if (this.store.state.login.userInfo.school.school_type_id === 5) {
          return e.value > 9 && e.value <= 12
        } else if (this.store.state.login.userInfo.school.school_type_id === 6) {
          return e.value <= 9
        } else {
          return true
        }
      })
    let id = this.searchForm.time_ids
    this.gradeList = this.gradeListBase.filter((e) => {
      if (id - 1 === 0) {
        return e.value <= 6
      } else if (id - 2 === 0) {
        return e.value > 6 && e.value <= 9
      } else if (id - 3 === 0) {
        return e.value > 9
      } else {
        return true
      }
    }) // this.searchForm.semester = this.school_year + '-' + this.store.state.login.userInfo.semester

    this.changeValue()
  },
  methods: {
    async changeValue(type) {
      const obj = {}
      this.options.forEach((e) => {
        if (e === 'semester') {
          obj.school_year = this.searchForm.semester.split('-')[0]
          obj.semester = this.searchForm.semester.split('-')[1]
        } else if (e === 'type_ins') {
          obj.type = this.searchForm.type
        } else if (e === 'equipment_number') {
          obj.number = this.searchForm.number
        } else if (e === 'equipment_name') {
          obj.instrument_name = this.searchForm.instrument_name
        } else {
          obj[e] = this.searchForm[e]
        }
      })
      console.log('🚀 ~ file: top-filter.vue ~ line 163 ~ changeValue ~ obj', obj)
      this.$emit('changes', obj, type)
    },

    getYear() {
      let date = new Date()
      let year = date.getFullYear()
      console.log('🚀 ~ file: top-filter.vue:296 ~ findschoolyear ~ year:', year)
      this.yearList = [
        {
          school_year: year - 2,
          year: `${year - 2}-${year - 1}`,
          semester: 1
        },
        {
          school_year: year - 2,
          year: `${year - 2}-${year - 1}`,
          semester: 2
        },
        {
          school_year: year - 1,
          year: `${year - 1}-${year}`,
          semester: 1
        },
        {
          school_year: year - 1,
          year: `${year - 1}-${year}`,
          semester: 2
        },
        {
          school_year: year,
          year: `${year}-${year + 1}`,
          semester: 1
        },
        {
          school_year: year,
          year: `${year}-${year + 1}`,
          semester: 2
        }
      ]
      // findschoolyear().then((res) => {
      //   this.yearList = res.data
      //   if (this.yearList && this.yearList.length === 0) {
      //     let date = new Date()
      //     let year = date.getFullYear()
      //     console.log('🚀 ~ file: top-filter.vue:296 ~ findschoolyear ~ year:', year)
      //     this.yearList = [
      //       {
      //         school_year: year - 2,
      //         year: `${year - 2}-${year - 1}`,
      //         semester: 1
      //       },
      //       {
      //         school_year: year - 2,
      //         year: `${year - 2}-${year - 1}`,
      //         semester: 2
      //       },
      //       {
      //         school_year: year - 1,
      //         year: `${year - 1}-${year}`,
      //         semester: 1
      //       },
      //       {
      //         school_year: year - 1,
      //         year: `${year - 1}-${year}`,
      //         semester: 2
      //       },
      //       {
      //         school_year: year,
      //         year: `${year}-${year + 1}`,
      //         semester: 1
      //       },
      //       {
      //         school_year: year,
      //         year: `${year}-${year + 1}`,
      //         semester: 2
      //       }
      //     ]
      //   }
      // })
    },

    getLabType() {
      Laboratorytype().then((res) => {
        this.roomList = res.data
      })
    },

    getSub() {
      getSubjectTeach().then((res) => {
        this.subjectArr = res.data
      })
    },

    changeTimeIds(id) {
      this.gradeList = this.gradeListBase.filter((e) => {
        if (id - 1 === 0) {
          return e.value <= 6
        } else if (id - 2 === 0) {
          return e.value > 6 && e.value <= 9
        } else if (id - 3 === 0) {
          return e.value > 9
        } else {
          return true
        }
      })
      if (!this.gradeList.find((e) => e.value === this.searchForm.grade)) {
        this.searchForm.grade = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top-select {
  margin: 6px 0;
  padding: 20px 60px 0 20px;
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  text-align: left;
  box-sizing: border-box;
  box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);

  .select-box {
    width: 20%;
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
    span {
      display: inline-block;
      margin-right: 6px;
      width: 84px; // 12.01注释
      text-align: right;
      box-sizing: border-box;
    }

    span:nth-of-type(1)::after {
      display: inline-block;
      content: '：';
    }
    & > :nth-child(2) {
      display: inline-block;
      width: calc(98% - 96px);
      line-height: 30px;
      box-sizing: border-box;
      // text-align: left;
      ::v-deep .el-input {
        width: 100%;
        .el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
  .button-box {
    margin-left: auto;
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 8px 18px;
      min-height: 36px;
      background: #05c65d;
      color: #fff;
      border-radius: 10px;
      border: none;
      box-sizing: border-box;
      vertical-align: middle;
      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
    .btn + .btn {
      margin-left: 10px;
    }
    .btn-white {
      color: #05c65d;
      background: #ffffff;
      border: 1px solid #05c65d;
    }
  }
}
.has-height {
  height: 70px;
  overflow: hidden;
}
</style>
