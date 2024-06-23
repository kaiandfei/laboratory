<template>
  <div class="lab-home">
    <p class="breadcrumb">
      课程管理<i class="el-icon-arrow-right" />{{ $route.meta.title }}
      <span v-if="nextShow"> <i class="el-icon-arrow-right" />下一步 </span>
    </p>
    <div v-show="!nextShow" class="content">
      <div class="message-box">
        <div class="title">
          <span>排课信息</span>
          <div class="btn-box">
            <p class="btn" @click="nextShow = true">下一步</p>
            <p class="btn" @click="submitForm('ruleForm')">保存</p>
            <p class="btn gray-btn" @click="resetForm('ruleForm')">取消</p>
          </div>
        </div>
        <div class="form-box">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="cs-ruleForm"
          >
            <el-form-item label="地点" prop="laboratory_id">
              <div class="lab-tab-box">
                <p
                  :class="{ 'active-tab': ruleForm.laboratory_id === item.laboratory_id }"
                  v-for="(item, index) in labList"
                  :key="index"
                  @click="ruleForm.laboratory_id = item.laboratory_id"
                >
                  {{ item.name }}
                </p>
              </div>
            </el-form-item>
            <el-form-item label="时间" prop="time">
              <span class="click-text" @click="checkTimeShow = true">选择</span>
            </el-form-item>
            <el-form-item label="实验名称" prop="name">
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
              <el-radio-group v-model="ruleForm.resource">
                <el-radio v-model="ruleForm.resource" :label="1"> 分组 </el-radio>
                <el-radio v-model="ruleForm.resource" :label="2"> 演示 </el-radio>
                <el-radio v-model="ruleForm.resource" :label="3"> 其他 </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="班级" prop="grade">
              <span v-for="(item, index) in checkGradeList" :key="index">{{ item }}</span>
              <span class="click-text" @click="checkGradeShow = true">选择</span>
            </el-form-item>
            <el-form-item label="开课教师" prop="resource" />
            <el-form-item label="分组人数" prop="desc">
              <el-input-number v-model="ruleForm.desc" :min="0" label="描述文字" /> 人/组
            </el-form-item>
            <el-form-item label="仪器套数" prop="desc">
              <el-input-number v-model="ruleForm.desc" :min="1" label="描述文字" /> 套
            </el-form-item>
            <el-table :data="tableData" style="width: 94%">
              <el-table-column prop="date" label="序号" />
              <el-table-column prop="name" label="分类编号" />
              <el-table-column prop="address" label="仪器名称" show-overflow-tooltip />
              <el-table-column prop="address" label="仪器规格" show-overflow-tooltip />
              <el-table-column prop="address" label="总数量" />
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <span class="click-text" v-show="scope.$index === tableData.length - 1"
                    >新增+</span
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-form-item label="备注" prop="desc">
              <el-input type="textarea" v-model="ruleForm.desc" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="plan-list">
        <div class="list-title">
          <i />
          <span>实验计划：</span>
          <el-select
            v-model="experimentPlan"
            placeholder="请选择"
            :clearable="true"
            @change="getPlan()"
          >
            <el-option
              v-for="item in planList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="list-box">
          <div class="header"><span>实验名称</span><span>周次</span></div>
          <div class="body">
            <ul>
              <li
                v-for="(item, index) in expList"
                :key="index"
                :class="{ 'gray-list': index % 2 === 0, green_bg: item.check }"
                @click="clickList(item)"
              >
                <span>{{ item.name }}</span>
                <span>{{ index + 1 }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <iframe :src="img" frameborder="0"/> -->
    <school-time
      :dialogVisible="checkTimeShow"
      @sureClick="getCheckTime"
      @back="checkTimeShow = false"
    />
    <grade-list
      :dialogVisible="checkGradeShow"
      @sureClick="getCheckGrade"
      @back="checkGradeShow = false"
    />
    <next-step v-if="nextShow" />
  </div>
</template>

<script>
import { getLaboratoryByUser } from '@network/subExamine'
import GradeList from '../course-scheduling/components/grade-list.vue'
import SchoolTime from '../course-scheduling/components/school-time.vue'
import NextStep from './components/next-step.vue'

export default {
  components: { GradeList, SchoolTime, NextStep },
  name: 'CourseRegister',
  data() {
    return {
      experimentPlan: '',
      planList: [],
      labList: [],
      expList: [
        { name: '热的', check: false },
        { name: '热22的', check: false },
        { name: '热3的', check: false },
      ],
      ruleForm: {
        laboratory_id: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        laboratory_id: [{ required: true, message: '', trigger: 'blur' }],
        time: [{ required: true, message: '', trigger: 'blur' }],
        name: [{ type: 'array', required: true, message: '', trigger: 'blur' }],
        type: [{ required: true, message: '', trigger: 'blur' }],
        grade: [{ type: 'array', required: true, message: '', trigger: 'blur' }],
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
      checkTimeShow: false,
      checkGradeShow: false,
      checkGradeList: [],
      nextShow: false,
    }
  },
  watch: {},
  created() {
    this.getLabList()
  },
  mounted() {},
  methods: {
    getLabList() {
      getLaboratoryByUser().then((res) => {
        this.labList = res.data
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
        if (res.data.length > 0) {
          obj = { ...res.data[0] }
        }
        this.labList.push({ ...obj, laboratory_id: -1, name: '教室' })
      })
    },
    getPlan(id) {
      console.log(id)
    },
    getCheckTime(date) {
      console.log(date)
    },
    getCheckGrade(list) {
      console.log(list)
    },
    clickList(item) {
      console.log('🚀 ~ file: index.vue ~ line 229 ~ clickList ~ item', item)
      item.check = !item.check
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
      min-height: 80vh;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      background: rgba(255, 255, 255, 0.39);
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
          width: 270px;
          display: flex;
          justify-content: space-between;
          .btn {
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
        padding: 10px;
        text-align: left;
        .cs-ruleForm {
          height: 100%;
          .el-form-item {
            margin-bottom: 0px;
            overflow: hidden;
            .lab-tab-box {
              display: flex;
              & > p {
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
              }
              .active-tab {
                background: #dcece3;
                color: #05c65d;
                border: 1px dotted #c9c7c7;
              }
            }
            .el-textarea {
              width: 94%;
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
          }
          ::v-deep .el-table {
            margin: 0 3% 10px;
            border: 1px solid #05c65d;
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
      background: rgba(255, 255, 255, 0.39);
      .list-title {
        padding-left: 50px;
        height: 60px;
        display: flex;
        align-items: center;
        & > i {
          display: inline-block;
          width: 11px;
          height: 18px;
          background: #05c65d;
        }
        & > span {
          margin: 0 50px 0 20px;
          font-size: 20px;
          color: #05c65d;
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
              span {
                display: inline-block;
                width: 60%;
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
            }
          }
        }
      }
    }
  }
}
</style>
