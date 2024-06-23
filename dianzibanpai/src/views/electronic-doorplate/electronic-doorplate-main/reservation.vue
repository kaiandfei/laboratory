<template>
  <div class="reservation">
    <div class="message-box">
      <div class="header">
        <div class="tltle">预约页面</div>
        <el-tooltip class="item" effect="dark" content="返回" placement="top">
          <img
            class="back"
            src="@/assets/images/laboratory/back.png"
            alt=""
            @click="back"
          />
        </el-tooltip>
      </div>
      <div class="form-box">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          :show-message="false"
          label-width="120px"
          class="cs-ruleForm"
          :class="{ 'read-only': !editStatus }"
        >
          <el-form-item label="时间" prop="week_time">
            <span v-show="ruleForm.week_time">
              {{
                `第${ruleForm.week_time}周、星期${ruleForm.weekend}、第${ruleForm.section}节课`
              }}&nbsp;
            </span>
            <span class="click-text" @click="timeSelect">选择</span>
          </el-form-item>
          <el-form-item label="实验名称" prop="exp_id">
            <div class="exp-name-box">
              <span
                class="exp-name"
                v-for="(item, index) in expList.filter((e) => e.check)"
                :key="index"
              >
                {{ item.name }}&nbsp;
                <i class="el-icon-circle-close" @click="clickList(item)" />
              </span>
            </div>
            <span class="click-text">在右侧选择</span>
          </el-form-item>
          <el-form-item label="实验类型" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio v-model="ruleForm.type" :label="1"> 分组 </el-radio>
              <el-radio v-model="ruleForm.type" :label="2"> 演示 </el-radio>
              <!-- <el-radio v-model="ruleForm.type" :label="3"> 其他 </el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="班级" prop="class_id">
            <span v-show="ruleForm.class_id">{{ ruleForm.class_name }}</span>
            <span class="click-text" @click="checkGradeShow = true">选择</span>
          </el-form-item>
          <el-form-item v-if="ruleForm.class_name" label="关联计划" prop="plan_detail_id">
            <el-select
              v-for="(e, i) in ruleForm.exp_id"
              :key="i"
              v-model="ruleForm.plan_detail_id[i]"
              placeholder="请选择"
              @change="checkPlan"
              :clearable="true"
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
            <span>{{ ruleForm.teacher_name }}</span>
          </el-form-item>
          <el-form-item label="分组人数" prop="number_groups">
            <el-input-number v-model="ruleForm.number_groups" :min="1" label="描述文字" />
            人/组
          </el-form-item>
          <el-form-item label="仪器套数" prop="number_instruments">
            <el-input-number
              v-model="ruleForm.number_instruments"
              :min="1"
              label="描述文字"
            />
            套
          </el-form-item>
          <el-table :data="InstrumentListConcat">
            <el-table-column type="index" prop="" label="序号" align="center" />
            <el-table-column prop="number" label="仪器编号" />
            <el-table-column prop="name" label="仪器名称" show-overflow-tooltip />
            <el-table-column
              prop="specification"
              label="仪器规格"
              show-overflow-tooltip
            />
            <el-table-column prop="num" label="数量" align="center">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.num"
                  :min="1"
                  :step="1"
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
          <el-form-item prop="material_tips" label="其他实验材料">
            <el-input
              type="textarea"
              placeholder="其他实验材料"
              v-model="ruleForm.material_tips"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="tips">
            <el-input type="textarea" v-model="ruleForm.tips" />
          </el-form-item>
        </el-form>
        <el-dialog
          title="添加仪器"
          :visible.sync="dialogVisible"
          width="40%"
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
              <el-table-column prop="number" label="仪器编号" width="150" />
              <el-table-column prop="name" label="仪器名称" width="150" />
              <el-table-column prop="info" label="规格" show-overflow-tooltip />
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
          </span>
        </el-dialog>
        <div class="btn">
          <div v-if="!editStatus" class="primary-btn" @click="goOn">继续预约</div>
          <div v-if="editStatus" class="primary-btn" @click="submit('ruleFormRef')">
            确认
          </div>
        </div>
      </div>
    </div>
    <div class="plan-list" :class="{ 'read-only': !editStatus }">
      <div class="list-title">
        <i />
        <span>我的备课：</span>
      </div>
      <div class="list-box">
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
    </div>
    <school-time
      ref="schoolTime"
      :isShow="checkTimeShow"
      :activeLabId="ruleForm.laboratory_id"
      :isOrder="ruleForm.is_order"
      v-bind="$attrs"
      @sureClick="getCheckTime"
      @back="checkTimeShow = false"
    />
    <grade-list
      :isShow="checkGradeShow"
      :weekend="ruleForm.weekend"
      :section="ruleForm.section"
      @sureClick="getCheckGrade"
      @back="checkGradeShow = false"
    />
  </div>
</template>
<script>
import schoolTime from './dialog/school-time'
import gradeList from './dialog/grade-list'
import {
  expBookNew,
  getMyPlan,
  planDetailExp,
  getMaterialBook,
  ExpMaterialFind,
} from '@/api/index.js'
import LocalCache from '@/utils/localCache'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
export default {
  components: {
    schoolTime,
    gradeList,
  },
  data() {
    return {
      editStatus: true,
      nextShow: false,
      dialogVisible: false,
      inputValue: '',
      InstrumentListFetch: [],
      InstrumentListCheck: [],
      InstrumentListAdd: [],
      InstrumentListConcat: [],
      InstrumentListBase: [],
      // labList: [],
      expList: [],
      planId: '',
      // expPlanList: [],
      planDetails: [],
      courseMessage: {
        id: 0,
        class_id: 0,
        name: [],
      },
      ruleForm: {
        book_type: 1,
        plan_detail_id: [],
        laboratory_id: parseInt(LocalCache.getCookie('labor_id')),
        exp_id: '',
        type: 1,
        week_time: '',
        weekend: '',
        section: '',
        // grade: '',
        class_id: [],
        class_name: '',
        teacher_id: [{ teacher_id: this.$store.getters.getUserMsg.id, is_main: 1 }],
        teacher_name: this.$store.getters.getUserMsg.username,
        number_groups: 1,
        number_instruments: 1,
        material_tips: '',
        tips: '',
        is_order: parseInt(LocalCache.getCookie('is_order')), // 1要 2不
      },
      rules: {
        week_time: [{ required: true, message: '', trigger: 'blur' }],
        exp_id: [{ type: 'array', required: true, message: '', trigger: 'blur' }],
        type: [{ required: true, message: '', trigger: 'blur' }],
        class_id: [{ required: true, message: '', trigger: 'blur' }],
      },
      checkTimeShow: false,
      checkGradeShow: false,
    }
  },
  computed: {
    ...mapState({
      teacherArr: 'teacherArr',
      gradeArr: 'gradeArr',
      subject_id: (state) => state.userMsg.subject_id,
    }),
  },
  watch: {
    'ruleForm.class_id': {
      handler() {
        this.ruleForm.plan_detail_id = []
      },
    },
  },
  created() {
    console.log('358', this.$store.getters.getUserMsg)
    this.getPlanList()
    // this.rules.plan_detail_id = [
    //   { type: 'array', required: true, message: '', trigger: 'blur' },
    // ]
  },
  mounted() {},
  methods: {
    timeSelect() {
      this.checkTimeShow = true
      this.$refs.schoolTime.getTableDateLab()
    },
    goOn() {
      this.editStatus = true
      this.ruleForm = {
        ...this.ruleForm,
        week_time: '',
        weekend: '',
        section: '',
        class_id: [],
        class_name: '',
        // teacher_id: [],
        // teacher_name: '',
        plan_detail_id: [],
        material_tips: '',
        tips: '',
      }
    },
    getPlanList(grade_id) {
      getMyPlan({
        grade: grade_id,
      }).then((res) => {
        if (res.code === 10) {
          this.expList = res.data.map((e) => {
            return { ...e, check: false }
          })
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
    getCheckGrade(obj) {
      // this.ruleForm.grade = obj.grade
      this.ruleForm.class_id = [{ grade: obj.grade, id: obj.class_id }]
      this.ruleForm.class_name = obj.class_name
      this.getPlanDetailList('', this.ruleForm.class_id[0].id)
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
    },
    checkPlan(m) {
      this.ruleForm.plan_id = this.planDetails.find((e) => e.id === m).plan_id
    },
    clickList(item) {
      if (!item.check) {
        let arrCheck = []
        // if (this.role_id === 2) {
        //   arrCheck = this.planDetails.filter((e) => e.check)
        // } else {
        arrCheck = this.expList.filter((e) => e.check)
        // }
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
      this.expList.forEach((e) => {
        if (e.check) {
          arr.push(e.number)
          idList.push(e.id)
        }
      })
      this.ruleForm.exp_id = idList
      getMaterialBook({
        number: arr,
      }).then((res) => {
        this.InstrumentListFetch = res.data
        this.InstrumentListConcat = this.InstrumentListFetch.concat(
          this.InstrumentListAdd
        )
      })
    },
    submit(formName) {
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
          const data = JSON.parse(JSON.stringify(this.ruleForm))
          data.material = arr
          data.plan_detail_id = data.plan_detail_id.flat(Infinity).join(',')
          data.exp_id = data.exp_id.join(',')
          delete data.class_name
          delete data.teacher_name
          data.book_type = 1
          expBookNew(data).then((res) => {
            if (res.code === 10) {
              Message({
                type: 'success',
                message: '预约成功',
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
    back() {
      this.$emit('openSetInterval')
      this.$emit('update:isReservation', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.reservation {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.message-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  padding-bottom: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    background-color: #61cab5;
    padding: 20px;
    box-sizing: border-box;
    .tltle {
      font-size: 16px;
      color: #fff;
    }
    .back {
      width: 44px;
      height: 44px;
      cursor: pointer;
    }
  }

  .form-box {
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding: 20px 10px;
    text-align: left;
    border-radius: 10px;
    box-sizing: border-box;
    margin-top: -15px;
    background-color: #fff;
    overflow: auto;
    .btn {
      width: 130px;
    }
    .cs-ruleForm {
      flex: 1;
      height: 100%;
      .el-form-item {
        margin-bottom: 15px;
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
            color: #61cab5;
            border: 1px dotted #c9c7c7;
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
              color: #61cab5;
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
        border: 1px solid #61cab5;
        .click-text {
          margin: 0 10px;
        }
      }
    }
    .click-text {
      color: #61cab5;
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
    padding-left: 50px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: left;
    & > i {
      display: inline-block;
      width: 11px;
      height: 18px;
      background: #61cab5;
    }
    & > span {
      margin: 0 50px 0 20px;
      font-size: 20px;
      color: #61cab5;
    }
    .el-select {
      flex: 1;
      margin-right: 20px;
    }
  }
  .list-box {
    font-size: 16px;
    .header {
      text-align: center;
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
            text-align: center;
            display: inline-block;
            width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          & > span:nth-of-type(1) {
            padding-left: 40px;
            // text-align: left;
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
          background: #61cab5;
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
.add-instrument {
  .input-box {
    display: flex;
    align-items: center;
    & > p {
      width: 100px;
      line-height: 30px;
    }
  }
  .table-box {
    margin-top: 10px;
  }
}
::v-deep .el-dialog {
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  .el-dialog__header {
    background-color: #61cab5;
    .el-dialog__title {
      color: #fff;
    }
  }
}
</style>
