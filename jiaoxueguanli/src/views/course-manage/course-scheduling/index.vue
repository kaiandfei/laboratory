<template>
  <div class="lab-home">
    <p class="breadcrumb">
      课程管理<i class="el-icon-arrow-right" />{{ $route.meta.title }}
      <span v-if="nextShow"> <i class="el-icon-arrow-right" />下一步 </span>
    </p>
    <top-filter
      v-show="!nextShow"
      ref="filterRef"
      :options="['semester', 'subject_id', 'time_ids']"
      :readonly="['semester']"
      @change="changeFilter"
    />
    <div v-show="!nextShow" class="content" @click="pageClick">
      <div class="message-box">
        <div class="title">
          <span>课程信息</span>
          <div class="btn-box">
            <p
              v-if="$route.meta.type === 3 && !editStatus"
              class="btn"
              @click="nextShow = true"
            >
              下一步
            </p>
            <!-- <p v-if="$route.meta.type === 3" class="btn" @click="nextShow = true">下一步</p> -->
            <p v-if="!editStatus" class="btn" @click="goOn">
              继续{{ ['', '预约', '排课', '登记'][$route.meta.type] }}
            </p>
            <p v-if="editStatus" class="btn" @click="submitForm('ruleFormRef')">保存</p>
            <p v-if="editStatus" class="btn gray-btn" @click="resetForm('ruleFormRef')">
              重置
            </p>
          </div>
        </div>
        <div class="form-box" :class="{ 'read-only': !editStatus }">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            :show-message="false"
            label-width="110px"
            label-suffix=""
            class="cs-ruleForm"
          >
            <el-form-item label="地点" prop="laboratory_id">
              <div class="lab-tab-box">
                <p
                  :class="{ 'active-tab': ruleForm.laboratory_id === item.laboratory_id }"
                  v-for="(item, index) in labList"
                  :key="index"
                  @click="changeLab(item)"
                >
                  {{ item.name }}
                  <img
                    v-show="item.is_order === 1"
                    src="@images/subscribe/audit.png"
                    alt=""
                    title="需要审核"
                  />
                </p>
              </div>
            </el-form-item>
            <el-form-item label="时间" prop="week_time">
              <span v-show="ruleForm.week_time">
                {{
                  `第${ruleForm.week_time}周、星期${ruleForm.weekend}、第${ruleForm.section}节课`
                }}&nbsp;
              </span>
              <span class="click-text" @click="checkTimeShow = true">选择</span>
            </el-form-item>
            <el-form-item label="实验名称" prop="exp_id">
              <div v-if="role_id === 4" class="exp-name-box">
                <span
                  class="exp-name"
                  v-for="(item, index) in expList.filter((e) => e.check)"
                  :key="index"
                >
                  {{ item.name }}&nbsp;
                  <i class="el-icon-circle-close" @click="clickList(item)" />
                </span>
              </div>
              <div v-if="role_id === 2" class="exp-name-box">
                <span
                  class="exp-name"
                  v-for="(item, index) in planDetails.filter((e) => e.check)"
                  :key="index"
                >
                  {{ item.name }}&nbsp;
                  <i class="el-icon-circle-close" @click="clickList(item)" />
                </span>
              </div>
              <!-- <div v-if="$route.meta.type === 3 && role_id === 2" class="exp-name-box">
                <span class="exp-name" v-for="(item,index) in planDetails.filter((e) => e.check)" :key="index">
                  {{ item.name }}&nbsp;
                  <i class="el-icon-circle-close" @click="clickList(item)"/>
                </span>
              </div>
              <div v-if="$route.meta.type === 3 && role_id === 4" class="exp-name-box">
                <span class="exp-name" v-for="(item,index) in expList.filter((e) => e.check)" :key="index">
                  {{ item.name }}&nbsp;
                  <i class="el-icon-circle-close" @click="clickList(item)"/>
                </span>
              </div> -->
              <div>在<span class="click-text">右侧</span>选择</div>
            </el-form-item>
            <el-form-item label="实验类型" prop="type">
              <el-radio-group v-model="ruleForm.type" @change="changeType">
                <el-radio :label="1"> 分组 </el-radio>
                <el-radio :label="2"> 演示 </el-radio>
                <el-radio :label="3" v-if="$route.meta.type !== 2"> 其他 </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="班级" prop="class_id">
              <span v-show="ruleForm.class_id.length !== 0"
                >{{ ruleForm.class_name.join(',') }}&nbsp;</span
              >
              <span class="click-text" @click="checkGradeShow = true">选择</span>
            </el-form-item>
            <el-form-item
              v-if="
                ruleForm.book_type !== 2 &&
                ruleForm.type !== 3 &&
                ruleForm.class_name.length !== 0
              "
              label="关联计划"
              prop="plan_detail_id"
            >
              <el-select
                v-for="(e, i) in ruleForm.exp_id"
                :key="i"
                v-model="ruleForm.plan_detail_id[i]"
                placeholder="请选择"
                @change="checkPlan"
              >
                <el-option
                  v-for="item in planDetails"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="开课教师" prop="teacher_id">
              <!-- <el-select v-if="role_id === 2" v-model="ruleForm.teacher_id" placeholder="请选择" :clearable="true">
                <el-option
                  v-for="(item,index) in teacherArr"
                  :key="index"
                  :label="item.username"
                  :value="item.id"/>
              </el-select> -->
              <span v-show="ruleForm.teacher_id.length !== 0"
                >{{ ruleForm.teacher_name.join(',') }}&nbsp;</span
              >
              <span
                v-if="ruleForm.type === 3"
                class="click-text"
                @click="checkTeacherShow = true"
                >选择</span
              >
              <!-- <span>{{ ruleForm.teacher_name }}</span> -->
            </el-form-item>
            <el-form-item label="分组人数" prop="number_groups">
              <el-input-number
                v-model="ruleForm.number_groups"
                :min="1"
                :max="50"
                :step="1"
                step-strictly
                label="描述文字"
              />
              人/组
            </el-form-item>
            <el-form-item label="仪器套数" prop="number_instruments">
              <el-input-number
                v-model="ruleForm.number_instruments"
                :min="1"
                :max="50"
                :step="1"
                step-strictly
                label="描述文字"
              />
              套
            </el-form-item>
            <el-table :data="InstrumentListConcat">
              <el-table-column type="index" prop="" label="序号" align="left" />
              <el-table-column prop="number" label="分类编号" />
              <el-table-column prop="name" label="仪器名称" show-overflow-tooltip />
              <el-table-column
                prop="specification"
                label="仪器规格"
                show-overflow-tooltip
              />
              <el-table-column prop="num" label="每套数量" align="left">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.num"
                    :min="1"
                    :step="1"
                    :max="50"
                    step-strictly
                    label="描述文字"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="" label="操作" align="center">
                <template slot-scope="scope">
                  <span
                    class="click-text"
                    @click="InstrumentListConcat.splice(scope.$index, 1)"
                    >删除</span
                  >
                  <span
                    class="click-text"
                    v-show="scope.$index === InstrumentListConcat.length - 1"
                    @click="addInstrument"
                    >新增+</span
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-form-item label="其他实验材料" prop="material_tips">
              <el-input
                v-model="ruleForm.material_tips"
                placeholder="输入其他实验材料"
                maxlength="256"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="备注" prop="tips">
              <el-input
                type="textarea"
                v-model="ruleForm.tips"
                maxlength="256"
                show-word-limit
              />
            </el-form-item>
          </el-form>
          <el-dialog
            title="添加仪器"
            :visible.sync="dialogVisible"
            width="30%"
            custom-class="add-instrument"
          >
            <div class="input-box">
              <p>新增仪器</p>
              <el-input
                v-model="inputValue"
                placeholder="请输入内容"
                @change="addInstrument"
              />
            </div>
            <div class="table-box">
              <el-table
                ref="multipleTable"
                :data="InstrumentListBase"
                tooltip-effect="dark"
                style="width: 100%"
                height="300"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="number" label="分类编号" width="150" />
                <el-table-column prop="name" label="仪器名称" width="150" />
                <el-table-column
                  prop="specification"
                  label="规格"
                  show-overflow-tooltip
                />
              </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="determine">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
      <div class="plan-list" :class="{ 'read-only': !editStatus }">
        <div class="list-title">
          <i />
          <span>{{ role_id === 2 ? '实验计划' : '我的备课' }}：</span>
          <!-- <el-select v-if="$route.meta.type === 1" v-model="experimentPlan" placeholder="请选择" :clearable="true" @change="getPlanList">
            <el-option
              v-for="item in gradeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select> -->
          <!-- <el-select v-if="$route.meta.type === 2" v-model="planId" placeholder="请选择" :clearable="true" @change="getPlanDetailList">
            <el-option
              v-for="item in expPlanList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select> -->
          <el-select
            v-if="role_id === 2"
            v-model="ruleForm.plan_id"
            placeholder="请选择"
            :clearable="true"
            @change="getPlanDetailList"
          >
            <el-option
              v-for="item in expPlanList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <!-- <el-select v-if="$route.meta.type === 3 && role_id === 4" v-model="experimentPlan" placeholder="请选择" :clearable="true" @change="getPlanList">
            <el-option
              v-for="item in gradeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select> -->
        </div>
        <div class="list-box" v-if="role_id === 4">
          <div class="header"><span>实验名称</span><span>年级</span></div>
          <div class="body">
            <ul>
              <li
                v-for="(item, index) in expList"
                :key="index"
                :class="{ 'gray-list': index % 2 === 0, green_bg: item.check }"
                @click="clickList(item)"
              >
                <span :title="item.name">{{ item.name }}</span>
                <span>{{ gradeArr[item.grade] }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="list-box" v-if="role_id === 2">
          <div class="header"><span>实验名称</span><span>周次</span></div>
          <div class="body">
            <ul>
              <li
                v-for="(item, index) in planDetails"
                :key="index"
                :class="{ 'gray-list': index % 2 === 0, green_bg: item.check }"
                @click="clickList(item)"
              >
                <span :title="item.name">{{ item.name }}</span>
                <span>{{ item.week_time }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div class="list-box" v-if="$route.meta.type === 3 && role_id === 2">
          <div class="header">
            <span>实验名称</span><span>周次</span>
          </div>
          <div class="body">
            <ul>
              <li
                v-for="(item, index) in planDetails"
                :key="index"
                :class="{ 'gray-list': index % 2 === 0, 'green_bg': item.check }"
                @click="clickList(item)">
                <span>{{ item.name }}</span>
                <span>{{ item.week_time }}</span>
              </li>
            </ul>
          </div>
        </div> -->
        <!-- <div class="list-box" v-if="$route.meta.type === 3 && role_id === 4">
          <div class="header">
            <span>实验名称</span><span>年级</span>
          </div>
          <div class="body">
            <ul>
              <li
                v-for="(item, index) in expList"
                :key="index"
                :class="{ 'gray-list': index % 2 === 0, 'green_bg': item.check }"
                @click="clickList(item)">
                <span>{{ item.name }}</span>
                <span>{{ gradeArr[item.grade] }}</span>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
    </div>
    <!-- <iframe :src="img" frameborder="0"/> -->
    <school-time
      v-if="editStatus"
      :isShow="checkTimeShow"
      :activeLabId="ruleForm.laboratory_id"
      :isOrder="ruleForm.is_order"
      :filterData="filterForm"
      @sureClick="getCheckTime"
      @back="checkTimeShow = false"
    />
    <grade-list
      v-if="checkGradeShow"
      :filterData="filterForm"
      :weekend="ruleForm.weekend"
      :section="ruleForm.section"
      :checkList="ruleForm.class_id"
      :type="ruleForm.type"
      @sureClick="getCheckGrade"
      @back="checkGradeShow = false"
    />
    <teacher-list
      v-if="checkTeacherShow"
      :filterData="filterForm"
      :checkList="ruleForm.teacher_id"
      @sureClick="getCheckTeacher"
      @back="checkTeacherShow = false"
    />

    <next-step v-if="nextShow" :courseMessage="courseMessage" @back="nextShow = false" />
  </div>
</template>

<script>
import {
  getMyPlan,
  getMaterialBook,
  expBookNew,
  getTeacherByClass,
} from '@network/subscribe'
import { ExpMaterialFind } from '@/network/experimentPlan'

// import { planDetails } from '@network/experimentPlan'
import { getPlan, planDetailExp } from '@network/infomationStatistical'

import { getLaboratoryByUser } from '@network/subExamine'

import TopFilter from '@components/top-filter.vue'
import GradeList from './components/grade-list.vue'
import TeacherList from './components/teacher-list.vue'

import SchoolTime from './components/school-time.vue'
import NextStep from './components/next-step.vue'
import { Message } from 'element-ui'
import { mapState } from 'vuex'

export default {
  components: {
    TopFilter,
    GradeList,
    TeacherList,
    SchoolTime,
    NextStep,
  },
  name: 'CourseScheduling',
  data() {
    return {
      editStatus: true,
      nextShow: false,
      dialogVisible: false,
      inputValue: '',
      filterForm: {},
      InstrumentListFetch: [],
      InstrumentListCheck: [],
      InstrumentListAdd: [],
      InstrumentListConcat: [],
      InstrumentListBase: [],
      labList: [],
      expList: [],
      planId: '',
      expPlanList: [],
      planDetails: [],
      courseMessage: {
        id: 0,
        class_id: [],
        name: [],
      },
      ruleForm: {
        book_type: this.$route.meta.type,
        plan_detail_id: [],
        plan_id: '',
        laboratory_id: 0,
        exp_id: [],
        type: 1,
        week_time: '',
        weekend: '',
        section: '',
        class_id: [],
        class_name: [],
        teacher_id: [],
        teacher_name: [],
        number_groups: 2,
        number_instruments: 20,
        material_tips: '',
        tips: '',
        is_order: 1, // 1要 2不
      },
      rules: {
        laboratory_id: [{ required: true, message: '', trigger: 'blur' }],
        week_time: [{ required: true, message: '', trigger: 'blur' }],
        exp_id: [{ type: 'array', required: true, message: '', trigger: 'blur' }],
        type: [{ required: true, message: '', trigger: 'blur' }],
        class_id: [{ type: 'array', required: true, message: '', trigger: 'blur' }],
      },
      checkTimeShow: false,
      checkGradeShow: false,
      checkTeacherShow: false,
      teacherArr: [],
    }
  },
  computed: {
    // gradeList() {
    //   return this.$store.getters.getUserMsg.grade.map((item) => {
    //     return {
    //       value: item,
    //       name: this.$store.state.gradeArr[item]
    //     }
    //   })
    // },

    ...mapState({
      labListSubject: 'labList',
      gradeArr: 'gradeArr',
      role_id: (state) => state.userMsg.role_id,
      subject_id: (state) => state.userMsg.subject_id,
    }),
  },
  watch: {},
  created() {
    this.getLabList()
    // this.getPlanList()
    // this.getExpPlan()
    if (this.role_id === 4) {
      this.getPlanList()
      // this.getPlanDetailList()
      // this.rules.plan_detail_id = [
      //   { type: 'array', required: true, message: '', trigger: 'blur' },
      // ]
    } else {
      this.getExpPlan()
    }
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.courseMessage = this.$route.params
      this.nextShow = true
    }
  },
  mounted() {},
  methods: {
    getLabList() {
      if (this.role_id === 2) {
        getLaboratoryByUser().then((res) => {
          this.labList = res.data
          let obj = {
            id: 0,
            // is_order: 2,
            laboratory_id: 0,
            name: '',
            school_code: '',
            school_id: 0,
            subject_id: 0,
            user_id: 0,
            user_name: '',
          }
          if (res.data.length > 0) {
            obj = { ...res.data[0] }
          }
          this.labList.push({ ...obj, laboratory_id: -1, name: '教室', is_order: 2 })
          this.ruleForm.laboratory_id = this.labList[0].laboratory_id
          this.ruleForm.is_order = this.labList[0].is_order
        })
      } else {
        this.labList = this.labListSubject.map((e) => {
          return { ...e, laboratory_id: e.id }
        })
        let obj = {
          id: 0,
          // is_order: 2,
          laboratory_id: 0,
          name: '',
          school_code: '',
          school_id: 0,
          subject_id: 0,
          user_id: 0,
          user_name: '',
        }
        if (this.labList.length > 0) {
          obj = { ...this.labList[0] }
        }
        this.labList.push({ ...obj, laboratory_id: -1, name: '教室', is_order: 2 })
        console.log(
          '🚀 ~ file: index.vue:580 ~ getLabList ~ this.ruleForm.laboratory_id:',
          this.ruleForm.laboratory_id
        )
      }
    },
    changeFilter(data) {
      this.filterForm = data
      this.editStatus = false
      console.log('🚀 ~ file: index.vue:537 ~ changeFilter ~ data:', data)
      this.ruleForm = {
        book_type: this.$route.meta.type,
        plan_detail_id: [],
        plan_id: '',
        laboratory_id: this.labList[0] ? this.labList[0].laboratory_id : 0,
        exp_id: [],
        type: 1,
        week_time: '',
        weekend: '',
        section: '',
        class_id: [],
        class_name: [],
        teacher_id: [],
        teacher_name: [],
        number_groups: 2,
        number_instruments: 20,
        material_tips: '',

        tips: '',
        is_order: this.labList[0] ? this.labList[0].is_order : 1, // 1要 2不
      }
      this.$nextTick(() => {
        this.editStatus = true
      })

      if (this.role_id === 4) {
        this.getPlanList()
      } else {
        this.getExpPlan()
      }
    },
    changeType(e) {
      console.log('🚀 ~ file: index.vue:586 ~ changeType ~ e:', e)
      if (e === 1 || e === 2) {
        this.ruleForm = {
          ...this.ruleForm,
          class_id: [],
          class_name: [],
          teacher_id: [],
          teacher_name: [],
        }
      } else {
        this.ruleForm.plan_detail_id = []
      }
    },
    goOn() {
      this.editStatus = true
      this.ruleForm = {
        ...this.ruleForm,
        week_time: '',
        weekend: '',
        section: '',
        class_id: [],
        class_name: [],
        teacher_id: [],
        teacher_name: [],
        plan_detail_id: [],
      }
    },
    getPlanList(grade_id) {
      getMyPlan({
        ...this.filterForm,
        grade: grade_id,
      }).then((res) => {
        if (res.code === 10) {
          this.expList = res.data.map((e) => {
            return { ...e, check: false }
          })
        } else {
          this.$message({
            message: '本学期实验计划表获取失败',
            type: 'error',
          })
        }
      })
    },
    getExpPlan() {
      getPlan({ ...this.filterForm }).then((res) => {
        this.expPlanList = res.data
        this.ruleForm.plan_id = this.expPlanList[0] && this.expPlanList[0].id
        if (this.ruleForm.plan_id) {
          this.getPlanDetailList(this.ruleForm.plan_id)
        }
      })
    },
    getPlanDetailList(plan_id, class_id) {
      planDetailExp({ plan_id, class_id }).then((res) => {
        this.planDetails = res.data || []
      })
    },
    getCheckTime(date) {
      this.ruleForm.week_time = date.weekNow
      this.ruleForm.weekend = date.weekend
      this.ruleForm.section = date.section
      this.ruleForm.time = date.time
    },
    getCheckGrade(list) {
      // 变更为多选
      // this.ruleForm.grade = []
      this.ruleForm.class_id = []
      this.ruleForm.class_name = []
      if (this.ruleForm.book_type === 1) {
        this.ruleForm.plan_detail_id = new Array(this.ruleForm.exp_id.length).fill('')
      }
      list.forEach((e) => {
        // this.ruleForm.grade.push(e.grade)
        this.ruleForm.class_id.push({ grade: e.grade, id: e.class_id })
        this.ruleForm.class_name.push(e.grade_name + e.class_name)
      })
      if (this.role_id === 4) {
        if (this.ruleForm.teacher_id.length === 0) {
          this.ruleForm.teacher_id = [
            {
              teacher_id: this.$store.getters.getUserMsg.id,
              is_main: 1,
            },
          ]
          this.ruleForm.teacher_name = [this.$store.getters.getUserMsg.username]
        }
        if (this.ruleForm.type !== 3) {
          this.getPlanDetailList('', this.ruleForm.class_id[0].id)
        }
      } else {
        getTeacherByClass({
          class_id: this.ruleForm.class_id[0].id,
        }).then((res) => {
          if (res.data.length !== 0) {
            // if (this.ruleForm.teacher_id.length === 0) {
            this.ruleForm.teacher_id = [
              {
                teacher_id: res.data[0].teacher_id,
                is_main: 1,
              },
            ]
            this.ruleForm.teacher_name = [res.data[0].teacher_name]
            // }
          } else {
            this.$message({
              type: 'warning',
              message: '该班级无该学科教师，请选择其他班级',
            })
            this.ruleForm.class_id = []
            this.ruleForm.class_name = []
            this.ruleForm.teacher_id = []
            this.ruleForm.teacher_name = []
          }
        })
      }
      // if (this.role_id === 2) {
      //   getTeacherByClass({
      //     class_id: this.ruleForm.class_id,
      //   }).then((res) => {
      //     if (res.data.length !== 0) {
      //       this.ruleForm.teacher_id = res.data[0].teacher_id
      //       this.ruleForm.teacher_name = res.data[0].teacher_name
      //     } else {
      //       this.$message({
      //         type: 'warning',
      //         message: '该班级无该学科教师，请选择其他班级',
      //       })
      //       this.ruleForm.grade = ''
      //       this.ruleForm.class_id = ''
      //       this.ruleForm.class_name = ''
      //       this.ruleForm.teacher_id = ''
      //       this.ruleForm.teacher_name = ''
      //     }
      //   })
      // }
    },
    getCheckTeacher(list) {
      // 变更为多选
      // this.ruleForm.grade = []
      this.ruleForm.teacher_id = []
      this.ruleForm.teacher_name = []
      list.forEach((e) => {
        // this.ruleForm.grade.push(e.grade)
        this.ruleForm.teacher_id.push({ is_main: e.is_main, teacher_id: e.teacher_id })
        this.ruleForm.teacher_name.push(e.teacher_name)
      })
    },
    addInstrument() {
      this.dialogVisible = true
      const data = {
        subject_id: this.subject_id,
        name: this.inputValue,
      }
      ExpMaterialFind(data).then((res) => {
        this.InstrumentListBase = res.data
      })
    },
    handleSelectionChange(list) {
      this.InstrumentListCheck = list
    },
    determine() {
      this.InstrumentListAdd = this.InstrumentListCheck.map((e) => {
        return { ...e, num: 1 }
      })
      this.InstrumentListConcat = this.InstrumentListConcat.concat(this.InstrumentListAdd)

      this.dialogVisible = false
      // this.tableData2.map((item, index) => {
      //   item.index = index + 1
      //   item.material_number = item.number
      //   item.materialname = item.name
      //   item.num = 1
      // })
      // this.tableData2 = JSON.parse(JSON.stringify(this.tableData2))
      // this.tableData.push(...this.tableData2)
    },
    checkPlan(m) {
      this.ruleForm.plan_id = this.planDetails.find((e) => e.id === m).plan_id
    },
    changeLab(item) {
      this.ruleForm.laboratory_id = item.laboratory_id
      this.ruleForm.is_order = item.is_order
    },
    clickList(item) {
      if (!item.check) {
        let arrCheck = []
        if (this.role_id === 2) {
          arrCheck = this.planDetails.filter((e) => e.check)
        } else {
          arrCheck = this.expList.filter((e) => e.check)
        }
        if (arrCheck.length >= 2) {
          this.$message({
            type: 'warning',
            message: '最多选择两个实验',
          })
          return
        }
      }

      item.check = !item.check
      if (item.check && item.tips) {
        this.ruleForm.material_tips === ''
          ? (this.ruleForm.material_tips = item.tips)
          : (this.ruleForm.material_tips += `，${item.tips}`)
      }
      const arr = []
      const idList = []

      if (this.role_id === 2) {
        this.ruleForm.plan_detail_id = []
        this.planDetails.forEach((e) => {
          if (e.check) {
            arr.push(e.number)
            idList.push(e.exp_scheme_id)
            this.ruleForm.plan_detail_id.push(e.id)
          }
        })
      } else {
        this.expList.forEach((e) => {
          if (e.check) {
            arr.push(e.number)
            idList.push(e.id)
            this.ruleForm.plan_detail_id.push('')
          }
        })
      }
      this.ruleForm.exp_id = idList

      getMaterialBook({
        number: arr,
      }).then((res) => {
        // res.data.forEach(e => {
        //   if (this.InstrumentListFetch.some(m => {
        //     m.
        //   }))
        // })
        this.InstrumentListFetch = res.data
        this.InstrumentListConcat = this.InstrumentListFetch.concat(
          this.InstrumentListAdd
        )
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const arr = []
          this.InstrumentListConcat.forEach((e) => {
            const obj = {
              material_number: e.number,
              num: e.num * this.ruleForm.number_instruments,
            }
            arr.push(obj)
          })
          // this.ruleForm.exp_id =
          const data = JSON.parse(JSON.stringify(this.ruleForm))
          data.material = arr
          data.plan_detail_id = data.plan_detail_id.filter((e) => e).join(',')
          data.exp_id = data.exp_id.join(',')
          delete data.class_name
          delete data.teacher_name
          expBookNew(data).then((res) => {
            if (res.code === 10) {
              Message({
                type: 'success',
                message: ['', '预约成功', '排课成功', '登记成功'][data.book_type],
              })
              this.editStatus = false
              this.courseMessage = res.data
            }
          })
        } else {
          Message({ type: 'warning', message: '请检查必填项' })
          return false
        }
      })
    },
    resetForm(formName) {
      this.editStatus = false
      console.log('🚀 ~ file: index.vue:895 ~ resetForm ~ formName:', formName)
      // this.$refs[formName].resetFields()
      this.ruleForm = {
        book_type: this.$route.meta.type,
        plan_detail_id: [],
        plan_id: '',
        laboratory_id: this.labList[0] ? this.labList[0].laboratory_id : 0,
        exp_id: [],
        type: 1,
        week_time: '',
        weekend: '',
        section: '',
        class_id: [],
        class_name: [],
        teacher_id: [],
        teacher_name: [],
        number_groups: 2,
        number_instruments: 20,
        material_tips: '',

        tips: '',
        is_order: this.labList[0] ? this.labList[0].is_order : 1, // 1要 2不
      }
      this.expList.forEach((e) => {
        e.check = false
      })
      this.InstrumentListConcat = []
      this.$nextTick(() => {
        this.editStatus = true
      })
    },
    pageClick(event) {
      const divBtn = document.getElementsByClassName('btn-box')[0]
      if (divBtn) {
        if (!this.editStatus && !divBtn.contains(event.target)) {
          Message({
            type: 'warning',
            message: `点击${this.$route.meta.title}按钮${this.$route.meta.title}`,
          })
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.lab-home {
  padding: 20px 32px;
  width: 100%;
  box-sizing: border-box;
  .breadcrumb {
    width: 100%;
    color: #626572;
    font-size: 16px;
    text-align: left;
  }
  .content {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    // height: 80vh;
    .message-box {
      width: 61%;
      min-height: 70vh;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      background: #fff;
      .title {
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(220, 236, 227, 0.39);
        & > span {
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #05c65d;
        }
        .btn-box {
          // width: 270px;
          display: flex;
          // justify-content: space-between;
          .btn {
            margin: 0 10px;
            width: 78px;
            height: 36px;
            line-height: 36px;
            background: #05c65d;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            border-radius: 10px;
            color: #fff;
            cursor: pointer;
          }
          .gray-btn {
            background: #b5b5b5;
          }
        }
      }
      .form-box {
        padding: 20px 10px;
        text-align: left;
        .cs-ruleForm {
          height: 100%;
          .el-form-item {
            margin-bottom: 8px;
            // overflow: hidden;
            ::v-deep .el-form-item__label {
              text-align: left;
              padding: 0 0 0 20px;
            }
            .lab-tab-box {
              display: flex;
              & > p {
                position: relative;
                margin-right: 10px;
                width: 110px;
                height: 40px;
                line-height: 40px;
                background: rgba(255, 255, 255, 0.39);
                border: 1px solid #c9c7c7;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                text-align: center;
                color: #848484;
                cursor: pointer;
                & > img {
                  position: absolute;
                  left: 50%;
                  bottom: 100%;
                  transform: translate(-50%, 0);
                }
              }
              .active-tab {
                background: #dcece3;
                color: #05c65d;
                border: 1px dotted #c9c7c7;
              }
            }
            .el-input {
              width: calc(100% - 40px);
              ::v-deep .el-input__inner {
                width: 100% !important;
              }
            }
            .el-textarea {
              width: calc(100% - 40px);
            }

            .exp-name-box {
              display: flex;
              .exp-name {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-right: 10px;
                padding: 0 10px;
                height: 34px;
                line-height: 34px;
                background: #dcece3;
                & > i:hover {
                  cursor: pointer;
                  color: #05c65d;
                }
              }
            }
            ::v-deep .el-select {
              width: 360px;
              .el-input {
                line-height: 30px;
                .el-input__inner {
                  width: 360px !important;
                }
              }
            }
          }
          ::v-deep .el-table {
            width: calc(100% - 60px);
            margin: 0 0 10px 20px;
            border: 1px solid #05c65d;
            .click-text {
              margin: 0 10px;
            }
          }
        }
        .click-text {
          color: #05c65d;
          cursor: pointer;
        }
      }
    }
    .plan-list {
      width: 38%;
      height: 100%;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
      .list-title {
        padding: 0 50px;
        height: 60px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        & > i {
          display: inline-block;
          width: 11px;
          height: 18px;
          background: #05c65d;
        }
        & > span {
          display: inline-block;
          margin: 0 20px 0 10px;
          width: 120px;
          font-size: 20px;
          color: #05c65d;
        }
        ::v-deep .el-select {
          flex: 1;
          .el-input__inner {
            width: 100% !important;
          }
        }
      }
      .list-box {
        font-size: 16px;
        .header {
          height: 45px;
          line-height: 45px;
          background: #dcece3;
          span {
            display: inline-block;
            width: 60%;
          }
          span:nth-of-type(2) {
            width: 40%;
          }
        }
        .body {
          ul {
            li {
              height: 45px;
              line-height: 45px;
              cursor: pointer;
              span {
                display: inline-block;
                width: 60%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              & > span:nth-of-type(1) {
                padding-left: 40px;
                text-align: left;
                box-sizing: border-box;
              }
              span:nth-of-type(2) {
                width: 40%;
              }
            }
            .gray-list {
              background: #f6f6f6;
            }
            .green_bg {
              background: #05c65d;
              color: #fff;
              border-bottom: 1px solid #fff;
              box-sizing: border-box;
            }
          }
        }
      }
    }
    .read-only {
      pointer-events: none !important;
    }
  }
  .add-instrument {
    .input-box {
      display: flex;
      & > p {
        width: 100px;
        line-height: 30px;
      }
    }
    .table-box {
      margin-top: 10px;
    }
  }
}
</style>
