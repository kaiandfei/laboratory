<template>
  <div class="lab-home">
    <p class="breadcrumb">
      课程管理<i class="el-icon-arrow-right" />{{ $route.meta.title }}
    </p>
    <div class="title">
      <!-- <el-select v-model="grade_xu" placeholder="请选择" @change="getData" clearable>
        <el-option
          v-for="(item, index) in gradeCheckList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <span>学科组课表</span>
    </div>
    <top-filter
      ref="filterRef"
      :options="['grade', 'subject_id', 'time_ids']"
      @change="getData"
    />

    <div class="flex sub-body">
      <div class="surface">
        <div>
          <p />
          <div>
            <div>
              <div>
                <div v-for="(m, n) in weekNowObj.sectionData" :key="n">
                  第{{ m.section_xu }}节
                </div>
              </div>
              <!-- <div>
                <div>第五节</div>
                <div>第六节</div>
                <div>第七节</div>
                <div>第八节</div>
                <div>第九节</div>
              </div> -->
            </div>
          </div>
        </div>
        <div v-for="(item, index) in expTable" :key="index">
          <div>
            <p class="week">{{ item.weekDate }}</p>
            <!-- <p class="date">{{item.date}}</p> -->
          </div>
          <div
            class="item"
            v-for="(item1, index1) in item.curriculum"
            :key="index1"
            @click="clickItem(index + 1, index1 + 1, item1)"
          >
            <div
              class="sub-msg-box"
              :class="{ 'has-bg': item1 && item1.length !== 0 }"
              :title="computedClassName(item1)"
            >
              {{ computedClassName(item1) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <grade-list
      :isShow="gradeShow"
      @sureClick="getCheckGrade"
      :grade_xu="grade_xu"
      :date="date"
      :clickList="clickList"
      @back="back"
    />
  </div>
</template>

<script>
import { findSection, saveSection } from '@network/subscribe'
import GradeList from './components/grade-list.vue'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import { findschoolYearweek } from '@network/log'
import TopFilter from '@components/top-filter.vue'

export default {
  components: { GradeList, TopFilter },
  name: 'ReferenceSchedule',
  data() {
    return {
      // 按钮状态
      bigState: 1,
      propState: false,
      input: '',
      date: '',
      labNow: 0,
      multiple: 0,
      weekNow: 0,
      expTable: [
        {
          weekDate: '星期一',
          date: '4.2',
          curriculum: [[], [], [], [], [], [], [], []],
        },
        {
          weekDate: '星期二',
          date: '4.3',
          curriculum: [[], [], [], [], [], [], [], []],
        },
        {
          weekDate: '星期三',
          date: '4.4',
          curriculum: [[], [], [], [], [], [], [], []],
        },
        {
          weekDate: '星期四',
          date: '4.5',
          curriculum: [[], [], [], [], [], [], [], []],
        },
        {
          weekDate: '星期五',
          date: '4.6',
          curriculum: [[], [], [], [], [], [], [], []],
        },
        {
          weekDate: '星期六',
          date: '4.7',
          curriculum: [[], [], [], [], [], [], [], []],
        },
        {
          weekDate: '星期日',
          date: '4.8',
          curriculum: [[], [], [], [], [], [], [], []],
        },
      ],
      clickList: [],
      clickSection: {},
      gradeShow: false,
      weekNowObj: {
        sectionData: [],
      },
      grade_xu: '', // this.$store.state.userMsg.grade[0]
    }
  },
  watch: {
    // grade_xu(val) {
    //   console.log(val)
    //   this.getTableDateLab(this.labNow)
    // }
  },
  computed: {
    ...mapState({
      userMsg: 'userMsg',
      gradeArr: 'gradeArr',
    }),
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
    computedClassName() {
      return (list) => {
        console.log('🚀 ~ file: index.vue:177 ~ return ~ list:', list)
        const arr = []
        if (list) {
          list.forEach((e) => {
            arr.push(e.grade_name + ' ' + e.class_name)
          })
        }
        return arr.join('&')
      }
    },
  },
  created() {
    // findschoolYearweek({
    //   school_year: this.$store.state.schoolDate.school_year
    //     ? this.$store.state.schoolDate.school_year.split('-')[0]
    //     : '',
    //   semester: this.$store.state.schoolDate.term_num,
    // }).then((res) => {
    //   // this.weekNow = res.data.week
    //   this.weekNowObj = res.data
    //   this.$refs.filterRef.changeValue()
    // })
  },
  methods: {
    async getData(obj) {
      const res = await findschoolYearweek({
        school_year: this.$store.state.schoolDate.school_year
          ? this.$store.state.schoolDate.school_year.split('-')[0]
          : '',
        semester: this.$store.state.schoolDate.term_num,
        time_ids: obj.time_ids,
      })
      this.weekNowObj = res.data
      findSection({
        grade_xu: obj.grade,
        time_ids: obj.time_ids,
        subject_id: obj.subject_id,
      }).then((res) => {
        if (res.code === 10) {
          this.expTable = [
            {
              weekDate: '星期一',
              date: '4.2',
              curriculum: new Array(this.weekNowObj.sectionData.length)
                .fill('')
                .map(() => []),
            },
            {
              weekDate: '星期二',
              date: '4.3',
              curriculum: new Array(this.weekNowObj.sectionData.length)
                .fill('')
                .map(() => []),
            },
            {
              weekDate: '星期三',
              date: '4.4',
              curriculum: new Array(this.weekNowObj.sectionData.length)
                .fill('')
                .map(() => []),
            },
            {
              weekDate: '星期四',
              date: '4.5',
              curriculum: new Array(this.weekNowObj.sectionData.length)
                .fill('')
                .map(() => []),
            },
            {
              weekDate: '星期五',
              date: '4.6',
              curriculum: new Array(this.weekNowObj.sectionData.length)
                .fill('')
                .map(() => []),
            },
            {
              weekDate: '星期六',
              date: '4.7',
              curriculum: new Array(this.weekNowObj.sectionData.length)
                .fill('')
                .map(() => []),
            },
            {
              weekDate: '星期日',
              date: '4.8',
              curriculum: new Array(this.weekNowObj.sectionData.length)
                .fill('')
                .map(() => []),
            },
          ]
          console.log(
            '🚀 ~ file: index.vue:204 ~ findSection ~ this.expTable :',
            this.expTable
          )

          res.data
            .filter((e) => {
              return this.userMsg.role_id === 4 ? e.user_id === this.userMsg.id : true
            })
            .forEach((e) => {
              if (this.expTable[e.week - 1].curriculum[e.section_xu - 1]) {
                this.expTable[e.week - 1].curriculum[e.section_xu - 1].push(e)
              }
            })
          console.log(this.expTable)
        }
      })
    },

    // 点击表格
    clickItem(week, section_xu, item) {
      this.clickList = item
      this.clickSection = {
        week,
        section_xu,
      }
      this.date =
        this.$store.state.weekArr[week] + '/' + this.$store.state.sectionArr[section_xu]
      this.gradeShow = true
    },
    getCheckGrade(list) {
      const classArr = []
      list.forEach((e) => {
        const obj = {
          id: e.class_id,
          // name: e.class_name,
          grade_id: e.grade,
          // grade_name: this.$store.state.gradeArr[e.grade],
          section_xu: this.clickSection.section_xu,
          section_name: this.$store.state.sectionArr[this.clickSection.section_xu],
          week: this.clickSection.week,
        }
        classArr.push(obj)
      })
      console.log('🚀 ~ file: index.vue ~ line 236 ~ getCheckGrade ~ classArr', classArr)

      saveSection({
        ...this.clickSection,
        classArr,
      }).then((res) => {
        if (res.code === 10) {
          Message({
            type: 'success',
            message: '保存成功',
          })
          this.$refs.filterRef.changeValue()
          // console.log(res.data)
        }
      })
    },
    back() {
      this.gradeShow = false
    },
  },
}
</script>

<style scoped lang="scss">
.lab-home {
  position: relative;
  box-sizing: border-box;
  padding: 20px 32px 0 32px;
  width: 100%;
  .breadcrumb {
    width: 100%;
    color: #626572;
    font-size: 16px;
    text-align: left;
  }
  .title {
    margin: 10px 0;
    text-align: right;
    & > span {
      display: inline-block;
      margin-right: calc(50% - 116px);
      width: 233px;
      height: 44px;
      line-height: 44px;
      background: #ffffff;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      text-align: center;
      color: #333333;
    }
    ::v-deep .el-select {
      margin-right: 20px;
      width: 200px;
      .el-input {
        width: 100%;
        .el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
  & > P {
    margin-bottom: 5px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #626572;
    text-align: left;
    img {
      float: left;
      margin-right: 20px;
      width: 30px;
      height: 30px;
    }
    span {
      padding-left: 28px;
      font-size: 14px;
      color: #8e8e8e;
    }
  }
}
.sub-body {
  width: 100%;
  // height: 824px;
  .surface {
    flex: 1;
    display: flex;
    height: 100%;
    position: relative;
    .detail-box {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      // background-color: rgba(255, 255, 255, 0.534);
      .msg-box {
        margin-top: 10px;
        margin-left: 30%;
        width: 640px;
        // height: 680px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        opacity: 1;
        .header {
          position: relative;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          color: #fff;
          background-color: #05c65d;
          img {
            padding: 12px;
            width: 24px;
            height: 24px;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0, -50%);
            cursor: pointer;
          }
        }
        .msg-body {
          position: relative;
          padding: 0 20px;
          .yiqi {
            position: absolute;
            top: 260px;
            left: 86px;
            padding: 16px;
            width: 300px;
            height: 250px;
            border-radius: 10px;
            border-top-left-radius: 0;
            background-color: #fff;
            border: 1px solid #dadada;
            p {
              height: 30px;
              line-height: 20px;
              text-align: center;
            }
            ul {
              width: 100%;
              height: 220px;
              overflow-y: auto;
              li {
                height: 30px;
                line-height: 30px;
                width: 100%;
                border-bottom: 1px solid #dadada;
                display: flex;
                span {
                  flex: 1;
                }
              }
            }
            ul::-webkit-scrollbar {
              width: 0;
            }
          }
          .msg-date {
            position: absolute;
            top: 0;
            right: 8px;
            width: 100px;
            height: 100px;
            background-color: #eea359;
            p {
              padding: 0;
              text-align: center;
              height: 25px !important;
              line-height: 25px !important;
              color: #fff;
            }
          }
          p {
            padding: 5px 0;
            height: 28px;
            line-height: 30px;
            text-align: left;
            color: #8e8e8e;
            .ms_span {
              text-align: left;
              float: left;
              width: 70px;
              font-size: 14px;
              color: #626572;
            }
            & .el-select ::v-deep .el-input__inner {
              width: 200px !important;
            }
          }
          .need-change {
            position: relative;
            left: 8px;
            margin-left: 10px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            img {
              position: absolute;
              top: 5px;
              left: -16px;
              width: 14px;
              height: 14px;
              margin-right: 2px;
            }
          }
        }
        .footer2 {
          margin: 10px 0;
          height: 32px;
          line-height: 32px;
          .my-button {
            min-width: 140px;
          }
          p {
            width: 140px;
            padding: 0 12px;
            margin-left: 50%;
            transform: translate(-50%, 0);
            height: 32px;
            font-size: 16px;
            background: #a1a1a1;
            color: #fff;
          }
        }
      }
    }
    & > div {
      flex: 1;
      margin-right: 4px;
      height: 100%;
      & > .item {
        height: 88px;
        margin-bottom: 4px;
        background-color: #fff;
        cursor: pointer;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        .sub-msg-box {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          color: #05c65d;
        }
        .has-bg {
          background: #dcece3;
        }
      }
      & > :nth-child(1) {
        position: relative;
        margin-bottom: 8px;
        height: 50px;
        background-color: #fff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        opacity: 0.8;
        .bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
        }
        .week {
          // padding-top: 10px;
          height: 50px;
          line-height: 50px;
        }
        .date {
          height: 30px;
          line-height: 30px;
        }
      }
      // & > :nth-child(5) {
      //   margin-bottom: 8px;
      // }
    }
    & > :nth-child(1) {
      flex: none;
      width: 40px;
      background-color: rgba(255, 255, 255, 0) !important;
      p {
        font-size: 16px;
        color: #05c65d;
        margin-bottom: 8px;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        text-align: left;
        img {
          float: left;
          margin: 14px 10px 0 11px;
          width: 22px;
          height: 22px;
        }
      }
      & > div {
        // height: 736px;
        width: 100%;
        & > :nth-child(1) {
          float: right;
          & > :nth-child(1) {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            width: 40px;
            // height: 364px;
            margin-bottom: 8px;
            div {
              margin-bottom: 4px;
              height: 66px;
              width: 16px;
              line-height: 22px;
              padding: 11px 12px;
              font-size: 16px;
              background-color: #fff;
              color: #05c65d;
              box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            }
          }
          & > :nth-child(2) {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            width: 40px;
            height: 455px;
            div {
              height: 66px;
              width: 16px;
              line-height: 22px;
              padding: 11px 12px;
              font-size: 16px;
              background-color: #fff;
              color: #05c65d;
              box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            }
          }
        }
      }
    }
  }
}
</style>
