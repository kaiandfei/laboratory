<template>
  <div class="exp-plan">
    <!-- <div class="plan" v-show="winState === 0">
      <div class="header">
        <p>实验教学计划表</p>
        <button class="commonbtn no-print" v-show="roleId === 3" @click="addNewPlan">新建教学实验计划</button>
      </div>
    </div> -->
    <div v-show="winState === 1">
      <!-- <div class="header">
        <p>
          <span @click="cancel">实验教学计划</span>
          <i class="el-icon-arrow-right" />
          编辑
        </p>
      </div> -->
      <div class="add-box">
        <div class="add-left">
          <div class="base-div">
            <p class="base-p">
              <span>基础信息</span>
              <!-- <el-checkbox v-model="planBaseData.type" :true-label="1" :false-label="0">启用计划</el-checkbox> -->
              <button class="commonbtn" @click="savePlan">保存</button>
              <button class="graybtn" @click="cancel">取消</button>
            </p>
            <div class="base-div-body">
              <div>
                <p>计划名称：</p>
                <p>学科：</p>
                <p>学段：</p>
                <p>年级：</p>
              </div>
              <div>
                <div>
                  <el-input v-model="planBaseData.name" maxlength="25" show-word-limit placeholder="请输入内容" />
                </div>

                <div>
                  <el-select v-model="planBaseData.subject_id" placeholder="请选择">
                    <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </div>
                <div>
                  <el-select v-model="planBaseData.time_ids" placeholder="请选择" @change="planBaseData.grade = ''">
                    <el-option v-for="item in stageList" :key="item.id" :label="item.name" :value="item.value" />
                  </el-select>
                  <!-- {{
                    ['', '小学', '初中', '高中', '完全中学', '职业高中', '九年一贯制', '十二年一贯制'][
                      this.store.state.login.userInfo.school.school_type_id
                    ] || ''
                  }} -->
                </div>
                <div class="f_between">
                  <el-select v-model="planBaseData.grade" placeholder="请选择">
                    <el-option
                      v-for="(item2, index) in gradeList.filter((e, i) => {
                        if (planBaseData.time_ids === 1) {
                          return i < 6
                        } else if (planBaseData.time_ids === 2) {
                          return i >= 6 && i < 9
                        } else if (planBaseData.time_ids === 3) {
                          return i >= 9
                        } else {
                          return true
                        }
                      })"
                      :key="index"
                      :label="item2.name"
                      :value="item2.value"
                    />
                  </el-select>
                </div>
              </div>

              <div>
                <p />
                <p>学期：</p>
                <p>版本：</p>
              </div>
              <div>
                <div />
                <div>
                  <el-radio
                    v-model="planBaseData.semester"
                    v-for="item in semesterList"
                    :key="item.value"
                    :label="item.value"
                  >
                    {{ item.name }}
                  </el-radio>
                </div>
                <div>
                  <el-select v-model="planBaseData.version_id" placeholder="请选择">
                    <el-option v-for="item in eduList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </div>
              </div>
              <img v-show="!rightShow" class="top_img" src="@images/common/top-img.png" alt="" />
            </div>
            <!-- <div class="class-box">
              <span>班级：</span>
              <div>
                <el-checkbox v-for="(item, index) in computedClassList" :key="index" v-model="item.state">
                  {{ item.name }}
                </el-checkbox>
              </div>
            </div> -->
          </div>
          <div class="plan-box">
            <p class="base-p">实验教学计划表</p>
            <div class="plan-b-body">
              <div class="flex">
                <div>周次</div>
                <div>实验名称</div>
                <div>分组</div>
                <div>演示</div>
                <div>操作</div>
              </div>
              <div class="scoll_box">
                <div
                  :class="index % 2 === 0 ? '' : 'gray_bg'"
                  class="flex"
                  v-for="(item, index) in selExpList"
                  :key="index"
                >
                  <div>
                    <el-input-number v-model="item.week_time" :min="1" :max="18" label="描述文字" />
                  </div>
                  <div>
                    <span class="experiment_name" :title="item.name">{{ item.name }}</span>
                  </div>
                  <div @click="item.type = 1">
                    <i style="color: #409eff; cursor: pointer" class="el-icon-check" v-show="item.type === 1" />
                    <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="!item.state"/> -->
                  </div>
                  <div @click="item.type = 2">
                    <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="item.state"/> -->
                    <i style="color: #409eff; cursor: pointer" class="el-icon-check" v-show="item.type !== 1" />
                  </div>
                  <div @click="delselexp(index, item.id)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="rightShow" class="add-right">
          <div class="header-box">
            <div class="title">系统课程列表</div>
            <div class="select-box">
              <div class="item">
                <div class="name">学科</div>
                <el-select v-model="searchForm.subject_id" placeholder="全部" @change="getExpPlanWeb" clearable>
                  <el-option label="全部" :value="''" />
                  <el-option v-for="item in optionsSubject" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div class="item">
                <div class="name">学段</div>
                <el-select v-model="searchForm.time_ids" placeholder="全部" @change="changeTimeIds" clearable>
                  <el-option label="全部" :value="''" />
                  <el-option v-for="item in time_idsList" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
              </div>
              <div class="item">
                <div class="name">实验</div>
                <el-input v-model="searchForm.name" @change="getExpPlanWeb" placeholder=""></el-input>
              </div>
              <div class="item">
                <div class="name">年级</div>
                <el-select v-model="searchForm.grade" placeholder="全部" @change="getExpPlanWeb" clearable>
                  <el-option label="全部" :value="''" />
                  <el-option
                    v-for="item in gradeList.filter((e, i) => {
                      if (searchForm.time_ids === 1) {
                        return i < 6
                      } else if (searchForm.time_ids === 2) {
                        return i >= 6 && i < 9
                      } else if (searchForm.time_ids === 3) {
                        return i >= 9
                      } else {
                        return true
                      }
                    })"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="item">
                <div class="name">专题</div>
                <!-- <el-input v-model="searchForm.topic_true_id" @change="getExpPlanWeb" placeholder=""></el-input> -->
                <el-select v-model="searchForm.topic_true_id" placeholder="全部" @change="getExpPlanWeb" clearable>
                  <el-option label="全部" :value="''" />
                  <el-option v-for="(item, index) in topicArr" :key="index" :value="item" />
                </el-select>
              </div>
            </div>
          </div>
          <div class="table-header">
            <p>实验名称</p>
            <p>年级</p>
          </div>
          <div class="flex">
            <div class="r-b-one">
              <!-- <p>实验名称</p> -->
              <ul>
                <li v-for="(item, index) in sysList1Filter" :key="index">
                  <el-checkbox v-model="item.state">
                    <span class="text" :title="item.name">{{ item.name }}</span>
                  </el-checkbox>
                </li>
              </ul>
            </div>
            <div class="r-b-two">
              <!-- <p>年级</p> -->
              <ul>
                <li v-for="(item, index) in sysList1Filter" :key="index">
                  {{ store.state.common.gradeArr[item.grade] }}
                </li>
              </ul>
            </div>
          </div>
          <!-- <div class="green-box" @click="addexp">新增实验 +</div> -->
        </div>
      </div>
    </div>
    <div v-show="winState === 2">
      <!-- <div class="header">
        <span @click="cancel">实验教学计划</span>
        <i class="el-icon-arrow-right" />
        <span>实验教学计划详情</span>
        <button v-if="roleId === 3" class="commonbtn edit-button" @click="editPlan">编辑</button>
        <button class="graybtn" @click="cancel">返回</button>
      </div> -->
      <div class="base_msg_box">
        <p class="base_msg_box_header">推荐计划</p>
        <div class="fr">
          <button class="commonbtn edit-button" @click="editPlan">编辑</button>
          <button class="graybtn" @click="$emit('back')">返回</button>
        </div>
        <div class="base_msg_box_body">
          <div class="l_box">
            <p>
              <span>计划名称：</span>
              {{ planItem.name }}
            </p>
            <p>
              <span>学科：</span>
              {{ planItem.subject }}
            </p>
            <p>
              <span>学段：</span>
              {{ stageList[planItem.time_ids - 1] && stageList[planItem.time_ids - 1].name }}
            </p>
            <p>
              <span>年级：</span>
              {{ store.state.common.gradeArr[planItem.grade] }}
            </p>
            <!-- <p class="class-box">
              <span>班级：</span>
              <span class="class-name">
                <span v-for="(item, index) in planItem.classs" :key="index">{{ item.name }}</span>
              </span>
            </p> -->
          </div>
          <!-- <div class="c_box">
            <p><span /></p>
            <p>
              <span>学年：</span>
              {{ planItem.school_year }}学年
            </p>
            <p>
              <span>年级：</span>
              {{ store.state.common.gradeArr[planItem.grade] }}
            </p>
          </div> -->
          <div class="r_box">
            <p><span /></p>
            <p>
              <span>学期：</span>
              第{{ planItem.semester }}学期
            </p>
            <p>
              <span>版本：</span>
              {{ eduList.find((e) => planItem.version_id - e.id === 0)?.name }}
            </p>
          </div>
          <img src="@images/common/top-img.png" alt="" />
        </div>
      </div>
      <div class="single-body">
        <div class="single-body_header flex">
          <div>周次</div>
          <div>实验名称</div>
          <div>分组</div>
          <div>演示</div>
        </div>
        <div class="scoll_box">
          <div
            class="flex"
            :class="index % 2 === 0 ? '' : 'gray_bg'"
            v-for="(item, index) in planItem.detail"
            :key="index"
          >
            <div>
              {{ item.week_time }}
            </div>
            <div>
              <span class="experiment_name" :title="item.name">{{ item.name }}</span>
            </div>
            <!-- <div v-if="roleId !== 3">
              <i @click="item.subscribeState = false" style="color: #409EFF; cursor: pointer;" class="el-icon-check" v-show="item.subscribeState && roleId === 2"/>
              <i @click="setLab(index)" style="color: red;cursor: pointer;" class="el-icon-close" v-show="!item.subscribeState && roleId === 2"/>
              <span v-show="roleId === 4" style="color: #05c65d; cursor: pointer" @click="showDetail(item, -1)">
                查看
              </span>
              <img
                @click="closeLabClick(item)"
                v-show="roleId === 2 && item.is_choose === 1"
                src="@images/common/open-around.png"
                alt=""
              />
              <img
                @click="openLabClick(item)"
                v-show="roleId === 2 && item.is_choose === 0"
                src="@images/common/open-none.png"
                alt=""
              />
            </div> -->
            <div>
              <i style="color: #05c65d; cursor: pointer" class="el-icon-check" v-show="item.type === 1" />
              <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="!item.state"/> -->
            </div>
            <div>
              <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="item.state"/> -->
              <i style="color: #05c65d; cursor: pointer" class="el-icon-check" v-show="item.type !== 1" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import { getDatebyweek } from '@service/teaching/subscribe'
import {
  planDetails,
  addPlan,
  expPlanList,
  delExpPlan,
  delOnePlan,
  laboratoryByUser
} from '@service/teaching/experimentPlan'
import { useStore } from '@store/index'

export default {
  name: 'ExperimentPlan',
  components: {},
  props: {
    propItem: {
      type: Object,
      default: () => {
        return { id: 0 }
      }
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      store: useStore(),
      roleId: useStore().state.login.userInfo.role_id,
      // 计划详情
      planItem: {},
      searchForm: {
        subject_id: '',
        time_ids: '',
        grade: '',
        topic_true_id: '',
        name: ''
      },
      // 实验iD
      expId: null,
      weekNowObj: {
        week: '',
        year: '',
        weekend: '',
        datatimeArr: [{ time: '' }],
        term_num: 1
      },
      rightShow: false,
      valueGrade: '',
      dialogVisible: false,
      dialogVisible1: false,
      labList: {
        lab1: true,
        lab2: true
      },
      labIndex: null,
      termOne: [],
      termTwo: [],
      gradeList: [],

      winState: 2,
      subjectList: [
        {
          id: 1,
          name: '物理'
        },
        {
          id: 2,
          name: '化学'
        },
        {
          id: 3,
          name: '生物'
        },
        {
          id: 4,
          name: '小学科学'
        }
      ],

      semesterList: [
        {
          name: '第一学期',
          value: 1
        },
        {
          name: '第二学期',
          value: 2
        }
      ],
      eduList: [
        {
          id: 1,
          name: '苏教版',
          status: 0
        },
        {
          id: 2,
          name: '人教版',
          status: 0
        },
        {
          id: 3,
          name: '沪教版',
          status: 0
        }
      ],
      // 选中的实验列表
      selExpList: [],
      // 系统推荐实验列表
      sysList1: [],
      sysList1Filter: [],

      stageList: [
        {
          name: '小学',
          value: 1
        },
        {
          name: '初中',
          value: 2
        },
        {
          name: '高中',
          value: 3
        }
      ],
      singleData: {
        base: {
          create_time: '2021-08-19 17:17:31',
          grade: 7,
          id: 5,
          name: '2021-2022第一学年物理计划',
          school_year: '2021',
          semester: 1,
          subject: '物理',
          type: 1,
          username: '李老师'
        },
        selExpList: [
          {
            week: 1,
            name: '实验1',
            subscribeState: false,
            type: true,
            state: true,
            grade: '七年级'
          },
          {
            week: 3,
            name: '实验2',
            subscribeState: true,
            type: true,
            state: false,
            grade: '七年级'
          }
        ]
      },
      modelPlan: {
        base: {
          grade: '',
          id: null,
          name: '1111',
          school_year: '',
          semester: 1,
          subject_id: 1,
          time_ids: 1,
          type: 1,
          version_id: 2
        },
        selExpList: [
          {
            exp_scheme_id: 3,
            grade: 7,
            id: 3,
            is_group: 1,
            name: '练习使用电流表',
            state: true,
            type: 0,
            week_time: 1
          }
        ]
      },
      planBaseData: {
        id: null,
        name: '',
        time_ids: 1,
        grade: '',
        school_year: '',
        semester: 1,
        subject_id: null,
        type: 0,
        version_id: 2,
        detail: [
          {
            name: '第一周实验',
            week_time: 1,
            exp_scheme_id: 1
          },
          {
            name: '第2周实验',
            week_time: 2,
            exp_scheme_id: 2
          }
        ]
      },
      clickNowId: 0,
      planBaseDataType: 0,
      itemDetailId: 0,
      clickWeekTime: 1,
      optionsSubject: this.$store.state.common.subjectList,
      time_idsList: [
        {
          name: '小学',
          value: 1
        },
        {
          name: '初中',
          value: 2
        },
        {
          name: '高中',
          value: 3
        }
      ],
      topicArr: [
        '一年级上',
        '一年级下',
        '二年级上',
        '二年级下',
        '三年级上',
        '三年级下',
        '四年级上',
        '四年级下',
        '五年级上',
        '五年级下',
        '六年级上',
        '六年级下',
        '七年级上',
        '七年级下',
        '八年级上',
        '八年级下',
        '九年级上',
        '九年级下',
        '必修1',
        '必修2',
        '必修3',
        '选择性必修1',
        '选择性必修2',
        '选择性必修3',
        '选择性必修4',
        '选择性必修5'
      ],
      deleteList: []
    }
  },
  watch: {
    sysList1: {
      handler: function (newval) {
        console.log('🚀 ~ file: ExperimentPlan.vue ~ line 665 ~ newval', newval)
        this.selExpList = []
        newval.map((e) => {
          // 选项改变时判断是否删除以及取消删除
          if (e.state) {
            this.selExpList.push(e)
            const index = this.deleteList.findIndex((val) => {
              return val === e.id
            })
            if (index !== -1) {
              this.deleteList.splice(index, 1)
            }
          } else {
            if (
              this.planItem.detail &&
              this.planItem.detail.some((val) => {
                return val.id === e.id
              }) &&
              !this.deleteList.includes(e.id)
            ) {
              this.deleteList.push(e.id)
            }
          }
        })
      },
      deep: true
    }
  },
  computed: {
    computedStage() {
      return this.planItem.grade < 7 ? '小学' : this.planItem.grade >= 7 && this.planItem.grade < 10 ? '初中' : '高中'
    }
  },
  created() {
    this.gradeList = this.store.state.common.gradeArr.map((e, i) => {
      return {
        name: e,
        value: i
      }
    })
    this.gradeList.splice(0, 1)
    // this.getPlan()
    this.getExpPlan()
    this.getLabList()
    if (this.type === 'detail') {
      // this.winState = 2
      this.clickSinglePlan(this.propItem)
    } else {
      this.addNewPlan()
    }
  },
  activated() {
    this.getYearTermData()
    // if (this.$route.params.id && this.itemDetailId !== 0) {
    //   const data = {
    //     id: this.itemDetailId
    //   }
    //   planDetails(data).then((res) => {
    //     if (res.code === 10) {
    //       this.planItem = res.data
    //       this.planBaseData = JSON.parse(JSON.stringify(this.planItem))
    //       this.selExpList = this.planBaseData.detail
    //       this.sysList1.map((e) => {
    //         if (e.state) {
    //           this.selExpList.push(e)
    //         }
    //       })
    //       this.sysList2.map((e) => {
    //         if (e.state) {
    //           this.selExpList.push(e)
    //         }
    //       })
    //     }
    //   })
    // }
    this.regetExpPlan()
  },
  methods: {
    getYearTermData() {
      getDatebyweek().then((res) => {
        this.weekNowObj = res.data
        // if (this.weekNowObj.term_num === 2) {
        //   // const Div1 = document.getElementById('yearOne')
        //   // const Div2 = document.getElementById('yearTwo')
        //   // Div2.parentElement.appendChild(Div1)
        // }
      })
    },
    editCourse(item) {
      console.log('🚀 ~ file: ExperimentPlan.vue ~ line 782 ~ editCourse ~ item', item)
    },
    cancel() {
      if (this.propItem.id === 0) {
        this.$emit('back')
      } else {
        this.clickSinglePlan(this.propItem)
        this.winState = 2
      }
      this.planBaseDataType = 0
      this.deleteList = []
      // this.planItem = {}
      this.rightShow = false
      this.itemDetailId = 0
      this.clickNowId = 0
    },
    showDetail(item, copyId) {
      this.clickNowId = item.exp_scheme_id
      this.clickWeekTime = item.week_time
      // add: 修改，item: 当前方案（exp_scheme_id）, copy: 是否复制，copyId: 被复制的id，isUse: 是否启用
      // this.$router.push({
      //   name: 'TeachingManageRecommendCourse',
      //   params: {
      //     add: true,
      //     item: item,
      //     item_id: item.exp_scheme_id,
      //     copy: item.copy !== undefined ? item.copy : true,
      //     copyId: copyId
      //   }
      // })
    },
    addexp() {
      this.$router.push({ name: 'TeachingManageRecommendCourse', params: { add: true, copy: true } })
    },
    addNewPlan() {
      this.getExpPlan()
      this.winState = 1
      this.rightShow = true
      this.selExpList = []
      this.planBaseData = {
        id: null,
        name: '',
        time_ids: 1,
        grade: '',
        school_year: '',
        semester: 1,
        subject_id: null,
        type: 0,
        version_id: 2,
        detail: []
      }
      this.planBaseData.subject_id = this.store.state.login.userInfo.subject_id
    },
    getLabList() {
      laboratoryByUser().then((res) => {
        const arr = res.data
        arr.forEach((e) => {
          e.state = true
        })
        this.labList = JSON.parse(JSON.stringify(arr))
        if (res.code !== 10) {
          this.$message({
            message: '获取实验室列表失败!',
            type: 'error'
          })
        }
      })
    },
    // 设置实验室
    // setLab(index) {
    //   this.labIndex = index
    //   this.dialogVisible1 = true
    // },
    openLabClick(item) {
      this.expId = item.id
      this.dialogVisible1 = true
    },
    // 关闭实验室
    closeLabClick(item) {
      console.log(item)
      this.expId = item.id
      this.labList.forEach((e) => {
        if (item.choose.indexOf(e.id) === -1) {
          e.state = false
        }
      })
      this.labList = JSON.parse(JSON.stringify(this.labList))
      this.dialogVisible1 = true
    },

    // 查看计划详情
    clickSinglePlan(item) {
      this.itemDetailId = item.id
      const data = {
        id: item.id
      }
      // this.roleId === 3
      planDetails(data).then((res) => {
        if (res.code === 10) {
          this.planItem = res.data
          this.planBaseDataType = res.data.type
          this.winState = 2
        } else {
          this.$message({
            message: '获取计划详情失败,请稍后再试!',
            type: 'error'
          })
        }
      })
      // this.winState = 2
    },
    // 编辑计划
    editPlan() {
      this.winState = 1
      this.rightShow = true
      // this.planItem.school_year = parseInt(this.planItem.school_year || 2023)
      this.planBaseData = JSON.parse(JSON.stringify(this.planItem))
      this.planBaseData.grade = this.planBaseData.grade || ''
      // this.planBaseData.stage =
      //   this.planItem.grade < 7 ? 1 : this.planItem.grade >= 7 && this.planItem.grade < 10 ? 2 : 3
      this.selExpList = this.planBaseData.detail
      this.regetExpPlan()
    },
    // 获取计划表
    // getPlan(form) {
    //   this.selectObj = form
    //   this.gradeList = []
    //   this.$store.getters.getUserMsg.grade.map((item) => {
    //     const obj = {
    //       name: this.$store.state.gradeArr[item],
    //       value: item
    //     }
    //     this.gradeList.push(obj)
    //   })
    //   console.log('获取学年计划')
    //   // const data = {
    //   //   grade: this.valueGrade
    //   // }
    //   getCompany({ ...form }).then((res) => {
    //     if (res.code === 10) {
    //       this.termOne = []
    //       this.termTwo = []
    //       res.data.map((item) => {
    //         if (item.semester === 1) {
    //           this.termOne.push(item)
    //         } else if (item.semester === 2) {
    //           this.termTwo.push(item)
    //         }
    //       })
    //     } else {
    //       this.$message({
    //         message: '计划表获取失败,请稍后再试!',
    //         type: 'error'
    //       })
    //     }
    //   })
    // },
    // 修改实验方案
    regetExpPlan() {
      const data1 = {
        type: 1,
        subject_id: ''
      }

      const clickArr = JSON.parse(JSON.stringify(this.selExpList))
      // 保留编辑的周次以及分组
      if (this.$route.params.id && this.clickNowId !== 0) {
        const Index = clickArr.findIndex((item) => {
          return item.exp_scheme_id === this.clickNowId
        })
        // 先别删除这个console
        console.log('🚀 ~ file: ExperimentPlan.vue ~ line 966 ~ regetExpPlan ~ Type', clickArr, this.clickNowId, Index)
        const Id =
          clickArr[Index].id !== clickArr[Index].exp_scheme_id ? clickArr[Index].id : parseInt(this.$route.params.id)
        const Type = clickArr[Index].type
        clickArr.splice(Index, 1)
        clickArr.push({
          id: Id,
          exp_scheme_id: parseInt(this.$route.params.id),
          week_time: this.clickWeekTime,
          type: Type
        })
      }

      expPlanList(data1).then((res) => {
        const arr = []
        res.data.map((e) => {
          e.exp_scheme_id = e.id
          e.id = clickArr.find((value) => {
            return value.exp_scheme_id === e.id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.id
              }).id
            : e.id
          e.state = clickArr.some((value) => value.exp_scheme_id === e.exp_scheme_id)
          e.week_time = clickArr.find((value) => {
            return value.exp_scheme_id === e.exp_scheme_id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.exp_scheme_id
              }).week_time
            : 1
          e.type = clickArr.find((value) => {
            return value.exp_scheme_id === e.exp_scheme_id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.exp_scheme_id
              }).type
            : e.is_group
          e.copy = true
          arr.push(e)
        })
        this.sysList1 = [...arr]
        this.getExpPlanWeb()
        // this.sysList1Filter = this.sysList1.filter((e) => e.name.includes(this.searchForm.name))
      })
    },
    // 获取实验计划表
    getExpPlan() {
      const data1 = {
        type: 1,
        ...this.searchForm
      }

      console.log(
        '🚀 ~ file: ExperimentPlan.vue ~ line 1076 ~ e.id=this.selExpList.find ~  this.selExpList',
        this.selExpList
      )

      expPlanList(data1).then((res) => {
        const arr = []
        res.data.map((e) => {
          e.state = false
          e.exp_scheme_id = e.id
          e.id = this.selExpList.find((value) => {
            return value.exp_scheme_id === e.id
          })
            ? this.selExpList.find((value) => {
                return value.exp_scheme_id === e.id
              }).id
            : e.id
          e.week_time = 1
          e.type = e.is_group
          e.copy = true
          arr.push(e)
        })
        this.sysList1 = arr
        this.getExpPlanWeb()
        // this.sysList1Filter = this.sysList1.filter((e) => e.name.includes(this.searchForm.name))
      })
    },
    getExpPlanWeb() {
      this.sysList1Filter = this.sysList1.filter((e) => {
        return (
          e.name.includes(this.searchForm.name) &&
          (this.searchForm.grade
            ? e.grade === this.searchForm.grade
            : this.searchForm.time_ids
            ? this.searchForm.time_ids === 1
              ? e.grade < 6
              : this.searchForm.time_ids === 2
              ? e.grade < 9 && e.grade >= 6
              : this.searchForm.time_ids === 3
              ? e.grade >= 9
              : true
            : true) &&
          (this.searchForm.topic_true_id ? e.topic_true_id === this.searchForm.topic_true_id : true) &&
          (this.searchForm.subject_id ? e.subject_id === this.searchForm.subject_id : true)
        )
      })
    },
    changeTimeIds() {
      this.searchForm.grade = ''
      this.getExpPlanWeb()
    },
    // 点击取消/设为启用计划

    delOnePlanList() {
      this.deleteList.map((item) => {
        const data = {
          id: item
        }
        delOnePlan(data).then()
      })
    },
    delselexp(index, id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(index, id)
          this.sysList1.forEach((item) => {
            if (item.id === id) {
              item.state = false
            }
          })

          // if (this.planItem.detail && this.planItem.detail.some((val) => {
          //   return val.id === id
          // })) {
          //   this.deleteList.push(id)
          // }
          this.selExpList.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 保存计划
    savePlan() {
      if (this.planBaseData.name.replace(/[, ]/g, '') === '') {
        this.$message.error('计划名称不能为空')
        return
      }
      this.$confirm('确认保存计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // this.delOnePlanList()
        this.selExpList.map((val, inx) => {
          if (val.id === val.exp_scheme_id) {
            this.selExpList[inx].id = 0
          }
        })
        this.planBaseData.detail = this.selExpList
        let classString = ''

        classString = classString.substr(0, classString.length - 1)
        this.planBaseData.class_ids = classString
        this.planBaseData.is_recommend = 1
        addPlan(this.planBaseData).then((res) => {
          if (res.code === 10) {
            this.cancel()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
        })
      })
    },
    delPlan(id, index) {
      if (index === 0) {
        const data = {
          id: id
        }
        this.$confirm('是否删除该计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            delExpPlan(data).then((res) => {
              console.log(res)
              if (res.code === 10) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.$refs.filterRef.changeValue()
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          message: '启用计划不可删除',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.exp-plan {
  box-sizing: border-box;
  width: 100%;
  .header {
    height: 44px;
    line-height: 44px;
    width: 100%;
    font-size: 16px;
    // box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    // background-color: #fff;
    text-align: left;
    span:nth-of-type(1) {
      margin-left: 10px;
      cursor: pointer;
    }
    span:nth-of-type(1):hover {
      color: #05c65d;
    }
    p {
      float: left;
      // padding-left: 16px;
      font-size: 16px;
      color: #626572;
    }
    button {
      float: left;
      margin: 6px 12px;
    }
    .edit-button {
      float: right;
    }
    .selectInput {
      width: 276px;
      height: 30px;
      float: right;
      margin: 8px 0px 0 0;
      & input {
        padding: 0 12px 0 12px;
        width: 236px;
        height: 30px;
        box-sizing: border-box;
        transform: translate(0, -10px);
        border: 1px solid #c9c7c7;
        font-size: 14px;
      }
      div {
        display: inline-block;
        cursor: pointer;
        height: 30px;
        background-color: #05c65d;
        img {
          margin: 5px 10px;
          width: 20px;
          height: 20px;
          background: #05c65d;
          opacity: 1;
        }
      }
    }
  }
  .top-filter {
    // margin: 8px 1% 0 1%;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    & > div {
      ::v-deep .el-input {
        width: 200px;
        .el-input__inner {
          width: 200px !important;
        }
      }
    }
  }
  .term-plan {
    margin: 8px 0 0;
    position: relative;
    p {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      color: #333;
      background-color: #fff;
    }
    ul {
      padding-top: 32px;
      width: 100%;
      .common_li {
        display: flex;
        width: 100%;
        padding: 32px;
        height: 102px;
        line-height: 38px;
        background-color: #fff;
        box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.16);
        border-bottom: 1px solid #c9c7c7;
        box-sizing: border-box;
        &:hover {
          background-color: #bef3d6;
        }
        & > :nth-child(1) {
          flex: 1;
          text-align: left;
          font-size: 20px;
          color: #05c65d;
          border-right: 1px solid #c9c7c7;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        & > :nth-child(2) {
          flex: 4;
          display: flex;
          & > span {
            flex: 1;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            & > :nth-child(1) {
              padding-right: 40px;
              color: #848484;
            }
            .blue_bg {
              display: inline-block;
              margin-right: 10px;
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background-color: #5fafe4;
            }
            .oringe_bg {
              display: inline-block;
              margin-right: 10px;
              padding-right: 0;
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background-color: #ee9a59;
            }
            .green_bg {
              display: inline-block;
              margin-right: 10px;
              padding-right: 0;
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background-color: #30b930;
            }
          }
        }
        & > :nth-child(3) {
          flex: 1;
          justify-content: right;
          display: flex;
          align-items: center;
          img {
            margin: 0 12px 0;
            cursor: pointer;
            width: 24px;
            height: 24px;
          }
          span {
            margin-right: 30px;
            font-size: 16px;
            color: #05c65d;
            cursor: pointer;
          }
          span:hover {
            color: #05c65d;
          }
        }
        // .li-header {
        //   padding-top: 32px;
        //   height: 26px;
        //   line-height: 26px;
        //   text-align: right;
        //   span {
        //     margin-right: 30px;
        //     font-size: 16px;
        //     color: #05c65d;
        //     cursor: pointer;
        //   }
        //   span:hover {
        //     color: #05c65d;
        //   }
        // }
        // .li-name {
        //   float: left;
        //   padding: 0 30px;
        //   text-align: left;
        //   font-size: 20px;
        //   color: #05c65d;
        // }
        // .li-footer {
        //   margin: 0px auto 0;
        //   padding: 16px 0px 21px;
        //   width: 92%;
        //   box-sizing: border-box;
        //   height: 122px;
        //   line-height: 20px;
        //   text-align: left;
        //   color: #333;
        //   border-bottom: 1px solid #C9C7C7;
        //   display: flex;
        //   justify-content: space-around;
        //   flex-direction: column;
        //   box-sizing: border-box;
        //   // padding-bottom: 10px;
        //   & > div {
        //     width: 100%;
        //     display: flex;
        //     & > span {
        //       float: left;
        //       width: 50%;
        //       span {
        //         width: 100px;
        //         // padding-right: 90px;
        //         color: #848484;
        //       }
        //       .blue_bg {
        //         float: left;
        //         margin-right: 10px;
        //         padding-right: 0;
        //         width: 20px;
        //         height: 20px;
        //         border-radius: 2px;
        //         background-color: #5FAFE4;
        //         margin-left: -30px;
        //       }
        //       .oringe_bg {
        //         float: left;
        //         margin-right: 10px;
        //         padding-right: 0;
        //         width: 20px;
        //         height: 20px;
        //         border-radius: 2px;
        //         background-color: #EE9A59;
        //         margin-left: -30px;
        //       }
        //       .green_bg {
        //         float: left;
        //         margin-right: 10px;
        //         padding-right: 0;
        //         width: 20px;
        //         height: 20px;
        //         border-radius: 2px;
        //         background-color: #30B930;
        //         transform: translate(-30px, 0);
        //         margin-left: -30px;
        //       }
        //     }
        //   }
        //   & :nth-child(1) span {
        //     float: left;
        //   }
        //   & :nth-child(2) span {
        //     float: left;
        //   }
        // }
        // .li-footer > :nth-last-child(1) {
        //   text-align: right;
        //   span span {
        //     text-align: right;
        //   }
        // }
      }
      .light_green_bg {
        background-color: #dcece3;
      }
      & > .none_li {
        text-align: center;
      }
    }
  }
  .base-div {
    margin-top: 8px;
    width: 100%;
    .class-box {
      padding: 20px 0;
      background-color: #fff;
      display: flex;
      & > :nth-child(1) {
        flex: 2;
        margin-left: 8px;
        height: 100%;
        width: 114px;
        text-align: center;
      }
      & > :nth-child(2) {
        flex: 17;
        text-align: left;
      }
    }
    .base-p {
      margin-bottom: 8px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: left;
      & > :nth-child(1) {
        width: 240px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        color: #333;
        background-color: #fff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        position: relative;
        z-index: 50;
      }

      & > :nth-child(2) {
        float: right;
        margin-left: 12px;
      }
      & > :nth-child(3) {
        float: right;
      }
    }
    .base-div-body {
      display: flex;
      width: 100%;
      padding: 0 8px;
      box-sizing: border-box;
      // margin-top: 9px;
      background-color: #fff;
      position: relative;
      z-index: 2;
      .el-select ::v-deep .el-input__inner {
        width: 200px !important;
      }

      :deep(.el-radio) {
        height: 30px;
      }
      .top_img {
        position: absolute;
        bottom: 9px;
        right: 30px;
        width: 241.25px;
        height: 108.32px;
        z-index: -1;
      }
      & > :nth-child(1) {
        flex: 1.8;
        p {
          margin-left: 40px;
          height: 60px;
          line-height: 60px;
          text-align: left;
        }
      }
      & > :nth-child(2) {
        position: relative;

        flex: 4;
        :deep(.el-input) {
          line-height: 30px;
        }
        .el-input {
          position: absolute;
          left: 0;
          width: 360px !important;

          :deep(.el-input__inner) {
            width: 100% !important;
            box-sizing: border-box;
          }
        }
        & > div {
          padding: 15px 0;
          height: 30px;
          line-height: 30px;
          text-align: left;
          .el-checkbox {
            margin-right: 10px;
          }
        }
      }
      & > :nth-child(3) {
        flex: 2;
        p {
          height: 60px;
          line-height: 60px;
        }
      }
      & > :nth-child(4) {
        flex: 4;
        & > div {
          padding: 15px 0;
          height: 30px;
          line-height: 30px;
          text-align: left;
          .el-checkbox {
            margin-right: 10px;
          }
        }
      }
      & > :nth-child(5) {
        flex: 2;
        p {
          height: 60px;
          line-height: 60px;
        }
      }
      & > :nth-child(6) {
        flex: 5;
        & > div {
          padding: 15px 0;
          height: 30px;
          line-height: 30px;
          text-align: left;
          .el-checkbox {
            margin-right: 10px;
          }
        }
      }
      .f_between {
        display: flex;
        align-items: center;
        .el-radio {
          margin-right: 10px;
        }
      }
    }
  }

  .plan-box {
    margin-top: 18px;
    width: 100%;
    // height: 560px;
    text-align: left;
    .base-p {
      // padding-left: 16px;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      width: 240px;
      background-color: #fff;
      font-size: 16px;
      text-align: center;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    }
    .plan-b-body {
      padding: 8px 30px;
      box-sizing: border-box;
      width: 100%;
      min-height: 380px;
      background-color: #fff;
      text-align: center;
      & > :nth-child(1) {
        width: 100%;
        height: 50px;
        line-height: 50px;
        & > :nth-child(1) {
          flex: 1;
        }
        & > :nth-child(2) {
          flex: 3;
        }
        & > :nth-child(3) {
          flex: 1;
        }
        & > :nth-child(4) {
          flex: 1;
        }
        & > :nth-child(5) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(5):hover {
          color: #05c65d;
        }
      }
      & > div {
        width: 100%;
        // height: 50px;
        line-height: 50px;
        & > :nth-child(1) {
          flex: 1;
        }
        & > :nth-child(2) {
          flex: 3;
        }
        & > :nth-child(3) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(4) {
          flex: 1;
          cursor: pointer;
        }
      }
      & > div > div {
        width: 100%;
        height: 50px;
        line-height: 50px;
        & > :nth-child(1) {
          flex: 1;
          :deep(.el-input-number) {
            width: 100px;
            line-height: 20px;
            .el-input-number__decrease,
            .el-input-number__increase {
              top: 1px;
            }

            .el-input {
              width: 100%;
              line-height: 20px;
              & > .el-input__inner {
                width: 100%;
                height: 20px;
                line-height: 20px;
              }
            }
          }
        }
        & > :nth-child(2) {
          flex: 3;
        }
        & > :nth-child(3) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(4) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(5) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(5):hover {
          color: #05c65d;
        }
        .experiment_name {
          display: inline-block;
          width: 100%;
          padding-left: 25%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          box-sizing: border-box;
        }
        .hover-name:hover {
          color: #05c65d;
          cursor: pointer;
        }
      }
      & > :nth-child(1) {
        height: 44px;
        line-height: 44px;
        border-bottom: 1px solid #c9c7c7;
      }
    }
  }
}
.add-box {
  display: flex;
  width: 100%;
  .add-left {
    flex: 6;
  }
  .add-right {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 20px;
    margin-top: 8px;
    margin-left: 20px;
    height: 76vh;
    // flex: 3;
    background: #fff;
    .green-box {
      margin-top: 6px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-radius: 10px;
      background-color: #05c65d;
      color: #fff;
      cursor: pointer;
    }
    .header-box {
      text-align: left;
      .title {
        padding: 10px 20px;
        font-size: 16px;
        border-bottom: 1px solid #c9c7c7;
      }
      .select-box {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        width: 520px;
        .item {
          display: flex;
          align-items: center;
          padding: 6px 20px;
          width: 50%;
          box-sizing: border-box;
          .name {
            margin-right: 10px;
            width: 50px;
          }
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .table-header {
      display: flex;
      margin: 0 24px 0 20px;
      box-sizing: border-box;
      p {
        padding-left: 50px;
        height: 40px;
        line-height: 40px;
        background: #e8e8e9;
        border-top: 1px solid #c9c7c7;
        border-bottom: 1px solid #c9c7c7;
        text-align: left;
        box-sizing: border-box;
      }
      p:nth-of-type(1) {
        width: 330px;
      }
      p:nth-of-type(2) {
        padding: 0;
        width: 160px;
        text-align: center;
      }
    }
    .flex {
      flex: 1;
      overflow-y: scroll;
    }
    .r-b-one {
      width: 330px;
      padding-left: 20px;
      text-align: left;

      p {
        padding-left: 50px;
        height: 40px;
        line-height: 40px;
        background: #e8e8e9;
        border-top: 1px solid #c9c7c7;

        border-bottom: 1px solid #c9c7c7;
      }
      li {
        padding-left: 12px;
        height: 50px;
        line-height: 50px;
        .text {
          display: inline-block;
          width: 300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .r-b-two {
      padding-right: 20px;
      width: 160px;

      p {
        height: 40px;
        line-height: 40px;
        background: #e8e8e9;
        border-top: 1px solid #c9c7c7;

        border-bottom: 1px solid #c9c7c7;
      }
      li {
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
.commonbtn {
  min-width: 160px;
  height: 32px;
  padding: 0 12px;
  background-color: #05c65d;
  color: #fff;
  font-size: 14px;
  border: 0;
  cursor: pointer;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
}
.commonbtn:hover {
  background-color: #4acf86;
}
.graybtn {
  min-width: 160px;
  height: 32px;
  padding: 0 12px;
  background-color: #a1a1a1;
  color: #fff;
  font-size: 14px;
  border: 0;
  cursor: pointer;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
}
.graybtn:hover {
  background-color: #777777;
}
.single-body {
  margin-top: 8px;
  box-sizing: border-box;
  padding: 0px 30px 8px;
  width: 100%;
  // height: 512px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  & > :nth-child(1) {
    border-bottom: 1px solid #c9c7c7;
  }
  & .single-body_header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    & > :nth-child(1) {
      flex: 1;
    }
    & > :nth-child(2) {
      flex: 4;
    }
    & > :nth-child(3) {
      flex: 2;
    }
    & > :nth-child(4) {
      flex: 2;
    }
    & > :nth-child(5) {
      flex: 2;
    }
  }
  & .scoll_box {
    width: 100%;
    // height: 460px;
    // overflow-y: auto;
    div {
      width: 100%;
      height: 40px;
      line-height: 40px;
      & > :nth-child(1) {
        flex: 1;
      }
      & > :nth-child(2) {
        flex: 4;
      }
      & > :nth-child(3) {
        flex: 2;
      }
      & > :nth-child(4) {
        flex: 2;
      }
      & > :nth-child(5) {
        flex: 2;
      }
      .experiment_name {
        display: inline-block;
        margin-left: 36%;
        width: 64%;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  & .scoll_box::-webkit-scrollbar {
    width: 0;
  }
}
.none_li {
  width: 100%;
  height: 102px;
  line-height: 102px;
  text-align: center;
  color: #848484;
  background-color: #fff;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.16);
}
.base_msg_box {
  margin-top: 8px;
  width: 100%;
  position: relative;
  overflow: hidden;
  .base_msg_box_header {
    width: 240px;
    height: 40px;
    line-height: 40px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    background-color: #fff;
    z-index: 2;
    float: left;
  }
  & > .fr {
    & > button {
      margin-left: 10px;
    }
  }
  .base_msg_box_body {
    display: flex;
    box-sizing: border-box;
    padding: 2px 30px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    z-index: 1;
    .l_box {
      flex: 1;
      .class-box {
        position: relative;
        .class-name {
          position: absolute;
          width: 71.6vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            margin-right: 30px;
          }
        }
      }
    }
    .c_box {
      flex: 1;
    }
    .r_box {
      flex: 1;
    }
    img {
      position: absolute;
      bottom: 9px;
      right: 30px;
      width: 241.25px;
      height: 108.32px;
    }
    div {
      p {
        text-align: left;
        height: 60px;
        line-height: 60px;
        & > span:nth-of-type(1) {
          float: left;
          width: 130px;
          color: #848484;
        }
      }
    }
  }
}

.gray_bg {
  background-color: #f6f6f6;
}
::v-deep .el-tabs__content {
  height: 92%;
  overflow-y: auto;
}
::v-deep .el-tabs__content::-webkit-scrollbar {
  width: 6px;
}
::v-deep .el-tabs__content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 6px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #05c65d;
}
::v-deep .el-tabs__content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 6px;
  background: #ededed00;
}
.gray_bg {
  background-color: #f6f6f6;
}
.plan {
  min-height: 800px;
}
.scoll_box::-webkit-scrollbar {
  width: 0;
}
</style>
