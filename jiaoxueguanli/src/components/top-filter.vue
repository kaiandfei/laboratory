<template>
  <div>
    <div class="top-select" :class="{ 'has-height': false }">
      <div v-if="options.includes('time_ids')" class="select-box">
        <span>学段</span>
        <el-select v-model="searchForm.time_ids" @change="changeTimeIds">
          <el-option
            v-for="(item, index) in stageList"
            :key="index"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </div>
      <div v-if="options.includes('subject_id')" class="select-box">
        <span>学科</span>
        <el-select
          v-model="searchForm.subject_id"
          @change="changeSubject"
          clearable
          :disabled="[2, 3, 4].includes($store.state.userMsg.role_id)"
        >
          <el-option
            v-for="(item, index) in subjectArr"
            :key="index"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </div>
      <!-- <div
        v-if="
          options.includes('subject_id') &&
          [2, 3, 4].includes($store.state.userMsg.role_id)
        "
        class="select-box"
      >
        <span>学科</span>
        <span>{{ subjectName(searchForm.subject_id) }}</span>
      </div> -->
      <div v-if="options.includes('semester')" class="select-box">
        <span>学年学期</span>
        <el-select
          v-model="searchForm.semester"
          @change="changeYear"
          :disabled="readonly.includes('semester')"
        >
          <el-option
            v-for="(item, index) in yearList"
            :key="index"
            :value="item.school_year + '-' + item.semester"
            :label="item.year + `第${item.semester === 1 ? '一' : '二'}学期`"
          />
          <!-- <el-option :value="( parseInt(school_year) - 2 ) + '-' + 2" :label="( parseInt(school_year) - 2 ) + '第二学期'"/>
          <el-option :value="( parseInt(school_year) - 1 ) + '-' + 1" :label="( parseInt(school_year) - 1 ) + '第一学期'"/>
          <el-option :value="( parseInt(school_year) - 1 ) + '-' + 2" :label="( parseInt(school_year) - 1 ) + '第二学期'"/>
          <el-option :value="school_year + '-' + 1" :label="school_year + '第一学期'"/>
          <el-option :value="school_year + '-' + 2" :label="school_year + '第二学期'"/> -->
        </el-select>
      </div>
      <div v-if="options.includes('grade')" class="select-box">
        <span>年级</span>
        <el-select
          v-model="searchForm.grade"
          @change="changeGrade"
          clearable
          placeholder="全部"
        >
          <el-option
            v-for="(item, index) in gradeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="options.includes('plan_id')" class="select-box">
        <span>计划</span>
        <el-select v-model="searchForm.plan_id" @change="changePlan" placeholder="全部">
          <el-option
            v-for="(item, index) in planList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div v-if="options.includes('week')" class="select-box">
        <span>周次</span>
        <el-cascader
          v-model="searchForm.week"
          clearable
          :options="optionsWeek"
          :props="{ checkStrictly: true }"
          @change="changeValue"
        />
      </div>
      <div v-if="options.includes('week_time')" class="select-box">
        <span>周次</span>
        <el-select
          v-model="searchForm.week_time"
          @change="changeValue"
          placeholder="全部"
        >
          <el-option
            v-for="(item, index) in optionsWeek"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div
        v-if="options.includes('exp_id') && $store.state.userMsg.role_id === 4"
        class="select-box"
      >
        <span>实验</span>
        <el-select v-model="searchForm.exp_id" @change="changeValue" clearable>
          <el-option
            v-for="(item, index) in expList"
            :value="item.id"
            :label="item.name"
            :key="index"
          />
        </el-select>
      </div>
      <div v-if="options.includes('name')" class="select-box">
        <span>实验</span>
        <div>
          <el-input v-model="searchForm.name" @change="changeValue" placeholder="" />
        </div>
      </div>
      <div v-if="options.includes('type')" class="select-box">
        <span>实验类型</span>
        <el-select v-model="searchForm.type" @change="changeValue" clearable>
          <el-option :value="''" label="全部" />
          <el-option
            v-for="(m, n) in $store.state.groupTypeList"
            :key="n"
            :label="m"
            :value="n + 1"
          />
        </el-select>
      </div>
      <div v-if="options.includes('type-is-must')" class="select-box">
        <span>实验类型</span>
        <el-select v-model="searchForm.type" @change="changeValue" clearable>
          <el-option :value="''" label="全部" />
          <el-option :value="1" label="必做" />
          <el-option :value="2" label="选做" />
        </el-select>
      </div>
      <div v-if="options.includes('laboratory_id')" class="select-box">
        <span>地点</span>
        <el-select v-model="searchForm.laboratory_id" @change="changeValue" clearable>
          <el-option
            v-for="(item, index) in laboratoryList"
            :value="item.laboratory_id"
            :label="item.name"
            :key="index"
          />
        </el-select>
      </div>
      <div v-if="options.includes('time_order')" class="select-box">
        <span>时间排序</span>
        <el-select v-model="searchForm.time_order" @change="changeValue">
          <el-option :value="1" label="降序" />
          <el-option :value="2" label="升序" />
        </el-select>
      </div>
      <div v-if="options.includes('teacher_id')" class="select-box">
        <span>教师</span>
        <el-select
          v-model="searchForm.teacher_id"
          @change="changeValue"
          clearable
          placeholder="全部"
          :disabled="$store.state.userMsg.role_id === 4"
        >
          <el-option
            v-for="(item, index) in teacherArr"
            :key="index"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </div>
      <!-- <div
        v-if="options.includes('teacher_id') && $store.state.userMsg.role_id === 4"
        class="select-box"
      >
        <span>授课教师</span>
        {{ $store.getters.getUserMsg.username }}
      </div> -->
      <div v-if="options.includes('class_id')" class="select-box">
        <span>班级</span>
        <el-select
          v-model="searchForm.class_id"
          @change="changeValue"
          clearable
          placeholder="全部"
        >
          <el-option
            v-for="item in optionsClass"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div v-if="options.includes('book_type')" class="select-box">
        <span>方式</span>
        <el-select
          v-model="searchForm.book_type"
          @change="changeValue"
          clearable
          placeholder="全部"
        >
          <el-option
            v-for="item in optionsBookType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="options.includes('status')" class="select-box">
        <span>状态</span>
        <el-select
          v-model="searchForm.status"
          @change="changeValue"
          multiple
          collapse-tags
          clearable
          placeholder="全部"
        >
          <el-option
            v-for="item in optionsStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="options.includes('evaluate')" class="select-box">
        <span>评价状态</span>
        <el-select
          v-model="searchForm.evaluate"
          @change="changeValue"
          clearable
          placeholder="全部"
        >
          <el-option
            v-for="item in optionsEvaluate"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="options.includes('template_type')" class="select-box">
        <span>模版类型</span>
        <el-select
          v-model="searchForm.template_type"
          @change="changeValue"
          clearable
          placeholder="全部"
        >
          <el-option
            v-for="item in optionsTemplate"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="options.includes('create_user')" class="select-box">
        <span>创建人</span>
        <el-select
          v-model="searchForm.create_user"
          @change="changeValue"
          clearable
          placeholder="全部"
        >
          <el-option
            v-for="(item, index) in teacherArr"
            :key="index"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlan } from '@network/infomationStatistical'
import { getLaboratoryByUser } from '@network/subExamine'
import { getMyPlan } from '@network/subscribe'
import { findschoolyear, selectUser } from '@network/log'

import { mapState } from 'vuex'

export default {
  name: 'TopFilter',
  props: {
    options: {
      type: Array, //   学期，        学科，       年级，    计划       周，     周次       实验，    实验名    类型，      必做         地点（实验室）     时间排序，       教师，        班级
      default: () => [
        'time_ids',
        'semester',
        'subject_id',
        'grade',
        'plan_id',
        'week',
        'week_time',
        'exp_id',
        'name',
        'type',
        'type-is-must',
        'laboratory_id',
        'time_order',
        'teacher_id',
        'class_id',
        'book_type',
        'status',
        'evaluate',
        'template_type',
        'create_user',
      ],
      validator: (value) => {
        let flag = true
        value.forEach((e) => {
          if (
            ![
              'time_ids',
              'semester',
              'subject_id',
              'grade',
              'plan_id',
              'week',
              'week_time',
              'exp_id',
              'name',
              'type',
              'type-is-must',
              'laboratory_id',
              'time_order',
              'teacher_id',
              'class_id',
              'book_type',
              'status',
              'evaluate',
              'template_type',
              'create_user',
              '',
            ].includes(e)
          ) {
            flag = false
          }
        })
        return flag
      },
    },
    readonly: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchForm: {
        // school_year: this.$store.getters.getSchoolDate.year,
        time_ids: this.$store.state.userMsg.phase_study_id
          ? Number(this.$store.state.userMsg.phase_study_id.split(',')[0])
          : '',
        semester:
          this.$store.getters.getSchoolDate.year +
          '-' +
          this.$store.getters.getUserMsg.semester,
        subject_id: this.$store.getters.getUserMsg.subject_id || '',
        grade: '',
        plan_id: '',
        week: [],
        week_time: '',
        exp_id: '',
        name: '',
        type: '', // 实验类型
        laboratory_id: '',
        time_order: 1,
        teacher_id:
          this.$store.state.userMsg.role_id === 4 ? this.$store.state.userMsg.id : '',
        class_id: '',
        book_type: '',
        status: '',
        evaluate: '',
        template_type: '',
        create_user: '',
      },
      stageList: [
        {
          name: '小学',
          id: 1,
        },
        {
          name: '初中',
          id: 2,
        },
        {
          name: '高中',
          id: 3,
        },
      ],
      yearList: [],
      laboratoryList: [],
      planList: [],
      unLoad: false,
      expList: [],
      optionsWeek: [],
      optionsClass: this.$store.state.classList,
      optionsBookType: [
        {
          value: 1,
          label: '预约',
        },
        {
          value: 2,
          label: '排课',
        },
        {
          value: 3,
          label: '登记',
        },
      ],
      optionsStatus: [
        {
          value: 0,
          label: '已取消',
        },
        {
          value: -1,
          label: '审核未通过',
        },
        {
          value: 1,
          label: '待审核',
        },
        {
          value: 2,
          label: '审核通过',
        },
      ],
      optionsEvaluate: [
        {
          value: 1,
          label: '已完成',
        },
        {
          value: 2,
          label: '未完成',
        },
      ],
      optionsTemplate: [
        {
          value: 1,
          label: '系统模版',
        },
        {
          value: 2,
          label: '自定义模版',
        },
      ],
      gradeListBase: [],
      gradeList: [],
      teacherArr: [],
    }
  },
  computed: {
    ...mapState({
      userMsg: 'userMsg',
      gradeArr: 'gradeArr',
      subjectArr: 'subjectArr',
      labList: 'labList',
    }),
    subjectName() {
      return (val) => {
        let name = ''
        this.subjectArr.forEach((e) => {
          if (val === e.id) {
            name = e.name
          }
        })
        return name
      }
    },
    // school_year() {
    //   return this.$store.getters.getSchoolDate.year
    // },
    // semester() {
    //   return this.school_year + '-' + this.userMsg.semester
    // },
    gradeCheckList() {
      const arr = [...this.gradeArr]
      arr.shift()
      const gradeList = arr
        .map((e, i) => {
          return {
            value: i + 1,
            label: e,
          }
        })
        .filter((e) => {
          if (this.userMsg.school.school_type_id === 1) {
            return e.value <= 6
          } else if (this.userMsg.school.school_type_id === 2) {
            return e.value > 6 && e.value <= 9
          } else if (this.userMsg.school.school_type_id === 3) {
            return e.value > 9 && e.value <= 12
          } else if (this.userMsg.school.school_type_id === 4) {
            return e.value > 6 && e.value <= 12
          } else if (this.userMsg.school.school_type_id === 5) {
            return e.value > 9 && e.value <= 12
          } else if (this.userMsg.school.school_type_id === 6) {
            return e.value <= 9
          } else {
            return true
          }
        })
      return gradeList
    },
  },
  watch: {
    'searchForm.grade'(n) {
      console.log('🚀 ~ file: top-filter.vue ~ line 265 ~ n', n)
      this.searchForm.class_id = ''
      this.optionsClass = this.$store.state.classList.filter((e) => e.grade_id === n)
      // console.log('🚀 ~ file: top-filter.vue ~ line 268 ~ this.optionsClass', this.optionsClass)
    },
  },
  created() {
    this.optionsWeek = require('../utils/optionsWeek.json')
    this.getYear()
    this.getLabList()
    this.getPlanList()
    if (this.options.includes('teacher_id')) {
      this.getUser({
        school_id: this.$store.state.userMsg.school_id,
        subject_id: this.searchForm.subject_id,
        role_id: 4,
      })
    }
    if (this.options.includes('create_user')) {
      this.getUser({
        school_id: this.$store.state.userMsg.school_id,
        subject_id: '',
        role_id: 1,
      })
    }
    this.stageList = this.stageList.filter((e) =>
      this.$store.state.userMsg.phase_study_id.includes(e.id)
    )
    const arr = [...this.gradeArr]
    arr.shift()
    this.gradeListBase = arr
      .map((e, i) => {
        return {
          value: i + 1,
          label: e,
        }
      })
      .filter((e) => {
        if (this.userMsg.school.school_type_id === 1) {
          return e.value <= 6
        } else if (this.userMsg.school.school_type_id === 2) {
          return e.value > 6 && e.value <= 9
        } else if (this.userMsg.school.school_type_id === 3) {
          return e.value > 9 && e.value <= 12
        } else if (this.userMsg.school.school_type_id === 4) {
          return e.value > 6 && e.value <= 12
        } else if (this.userMsg.school.school_type_id === 5) {
          return e.value > 9 && e.value <= 12
        } else if (this.userMsg.school.school_type_id === 6) {
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
    }) // this.searchForm.semester = this.school_year + '-' + this.$store.getters.getUserMsg.semester
  },
  mounted() {
    this.changeGrade()
  },
  methods: {
    async changeValue() {
      const obj = {}
      this.options.forEach((e) => {
        if (e === 'semester') {
          obj.school_year = this.searchForm.semester.split('-')[0]
          obj.semester = this.searchForm.semester.split('-')[1]
        } else if (e === 'week') {
          obj.week_time = this.searchForm.week[0] || ''
          obj.weekend = this.searchForm.week[1] || ''
          obj.section = this.searchForm.week[2] || ''
        } else if (e === 'status') {
          obj.status = this.searchForm.status.join(',')
        } else if (e === 'type-is-must') {
          obj.type = this.searchForm.type
        } else {
          obj[e] = this.searchForm[e]
        }
      })
      if (this.options.includes('plan_id') && !this.unLoad) {
        const result = await getPlan(obj)
        this.planList = result.data
        if (!this.planList.find((e) => e.id === this.searchForm.plan_id)) {
          this.searchForm.plan_id = result.data[0] ? result.data[0].id : ''
        }
        obj.plan_id = this.searchForm.plan_id
        // this.searchForm.grade = result.data[0].grade
      }
      this.$emit('change', obj)
      this.unLoad = false
      console.log('🚀 ~ file: top-filter.vue ~ line 163 ~ changeValue ~ obj', obj)
    },
    getUser(obj) {
      return selectUser(obj).then((res) => {
        this.teacherArr = res.data
      })
    },
    getYear() {
      findschoolyear().then((res) => {
        this.yearList = res.data
        const year = this.searchForm.semester.split('-')[0]
        const semester = this.searchForm.semester.split('-')[1]
        let length = 25
        this.yearList.forEach((e) => {
          if (e.school_year - year === 0 && e.semester - semester === 0) {
            length = e.weeknum
          }
        })
        this.optionsWeek = require('../utils/optionsWeek.json').slice(0, length)
      })
    },
    getLabList() {
      let obj = {
        id: 0,
        is_order: 0,
        laboratory_id: 0,
        name: '',
        school_code: '',
        school_id: 0,
        subject_id: 0,
        user_id: 0,
        user_name: '',
      }
      if (this.userMsg.role_id === 2) {
        getLaboratoryByUser().then((res) => {
          this.laboratoryList = res.data
          if (this.laboratoryList.length > 0) {
            obj = { ...this.laboratoryList[0] }
          }
          this.laboratoryList.unshift({ ...obj, laboratory_id: -1, name: '教室' })
          // this.laboratoryList.unshift({ ...obj, laboratory_id: 0, name: '全部实验室' })
        })
      } else {
        // 教师
        this.laboratoryList = this.labList.map((e) => {
          return {
            ...e,
            laboratory_id: e.id,
          }
        })
        if (this.laboratoryList.length > 0) {
          obj = { ...this.laboratoryList[0] }
        }
        this.laboratoryList.unshift({ ...obj, laboratory_id: -1, name: '教室' })
      }
    },
    changeYear() {
      const year = this.searchForm.semester.split('-')[0]
      const semester = this.searchForm.semester.split('-')[1]
      let length = 25
      this.yearList.forEach((e) => {
        if (e.school_year - year === 0 && e.semester - semester === 0) {
          length = e.weeknum
        }
      })
      this.optionsWeek = require('../utils/optionsWeek.json').slice(0, length)
      this.searchForm.week = []
      this.searchForm.week_time = ''
      this.changeValue()
    },
    changeGrade() {
      this.changeValue()
    },
    changePlan(id) {
      let grade_id
      this.planList.forEach((e) => {
        if (e.id === id) {
          grade_id = e.grade
        }
      })
      this.searchForm.grade = grade_id
      this.unLoad = true
      this.changeValue()
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
      this.changeValue()
    },
    changeSubject(id) {
      if (this.options.includes('teacher_id')) {
        this.getUser({
          school_id: this.$store.state.userMsg.school_id,
          subject_id: id,
          role_id: 4,
        }).then(() => {
          if (!this.teacherArr.find((e) => e.id === this.searchForm.teacher_id)) {
            this.searchForm.teacher_id = ''
          }
          this.changeValue()
        })
      } else {
        this.changeValue()
      }
    },
    getPlanList() {
      getMyPlan().then((res) => {
        if (res.code === 10) {
          this.expList = res.data
        }
      })
    },
  },
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
      margin-right: 12px;
      // width: 70px; // 12.01注释
      // text-align: right;
      box-sizing: border-box;
    }
    span:nth-of-type(1)::after {
      display: inline-block;
      content: '：';
    }
    & > :nth-child(2) {
      display: inline-block;
      width: calc(85% - 88px);
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
}
.has-height {
  height: 70px;
  overflow: hidden;
}
</style>
