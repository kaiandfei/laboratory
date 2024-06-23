<template>
  <div class="main">
    <el-dialog title="时间选择" :visible.sync="dialogVisible" width="80%">
      <div class="grade-list-box">
        <div>
          <p>周次</p>
          <ul
            class="scroll"
            :style="{
              height:
                ((computedAmPm(1).length + computedAmPm(2).length) * 92 - 4) / 16 + 'rem',
            }"
          >
            <li
              v-for="(item, index) in weekList"
              :class="{
                'week-on': weekNow === index + 1,
                'groy-bg': weekNowObj.week > index + 1,
              }"
              @click="selWeek(index + 1)"
              :key="index"
            >
              {{ item.week }}
              <span v-show="'count' in item">{{ item.count }}</span>
            </li>
          </ul>
        </div>
        <div>
          <p><img src="@images/reservation/time.png" alt="" />时段</p>
          <div>
            <div>
              <div :style="{ height: (computedAmPm(1).length * 92 - 4) / 16 + 'rem' }">
                <p>上午</p>
              </div>
              <div :style="{ height: (computedAmPm(2).length * 92 - 4) / 16 + 'rem' }">
                <p>下午</p>
              </div>
            </div>
            <div>
              <div :style="{ height: (computedAmPm(1).length * 92 - 4) / 16 + 'rem' }">
                <div v-for="(m, n) in computedAmPm(1)" :key="n">{{ m.section_name }}</div>
              </div>
              <div :style="{ height: (computedAmPm(2).length * 92 - 4) / 16 + 'rem' }">
                <div v-for="(m, n) in computedAmPm(2)" :key="n">{{ m.section_name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(item, index) in expTable" :key="index">
          <div>
            <p class="week">{{ item.weekDate }}</p>
            <p class="date">
              {{
                weekNowObj.datatimeArr &&
                weekNowObj.datatimeArr[weekNow - 1] &&
                weekNowObj.datatimeArr[weekNow - 1][index]
              }}
            </p>
          </div>
          <div
            class="item"
            :class="{
              'groy-bg':
                1 !== 3
                  ? weekNow < weekNowObj.week ||
                    (weekNow === weekNowObj.week && index + 1 < weekNowObj.weekend)
                  : !(
                      weekNow < weekNowObj.week ||
                      (weekNow === weekNowObj.week && index + 1 < weekNowObj.weekend)
                    ),
              'active-bg':
                checkObj.weekNow === weekNow &&
                checkObj.weekend === index + 1 &&
                checkObj.section === index1 + 1,
            }"
            v-for="(item1, index1) in item.curriculum"
            @click="clickItem(item1, index + 1, index1 + 1)"
            :key="index1"
          >
            <div v-if="'num' in item1">
              <div
                class="sub-msg-box"
                :style="{
                  backgroundColor:
                    item1.laboratoryArr.length > 1 ? '#333' : item1.laboratory_color,
                }"
              >
                <p class="one">
                  {{ $store.state.gradeArr[item1.grade[0]] + '' + item1.class_name }}
                </p>
                <p class="one" :title="Array.isArray(item1.name) && item1.name.join(',')">
                  {{ item1.name && item1.name[0] }}
                </p>
                <p class="one">{{ item1.teacher_name }}</p>
                <div>
                  <span>{{ item1.num }}</span>
                </div>
                <img
                  v-show="item1.status === 2"
                  src="@images/reservation/pass.png"
                  alt=""
                />
                <img
                  v-show="item1.status === 1"
                  src="@images/reservation/stay.png"
                  alt=""
                />
                <img
                  v-show="item1.status === -1"
                  src="@images/reservation/error.png"
                  alt=""
                />
                <img
                  class="book-type"
                  :src="
                    item1.book_type &&
                    require('@images/reservation/icon-type' + item1.book_type + '.png')
                  "
                  alt=""
                />
                <p class="book-type-text book-type">
                  {{ ['', '预约', '排课', '登记'][item1.book_type] }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  // getDatebyweek,
  expBooklist,
  findschoolYearweek,
} from '@/api/index.js'
import { mapState } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'SchoolTime',
  props: {
    isShow: Boolean,
    activeLabId: {
      type: Number,
      default: 0,
    },
    isOrder: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dialogVisible: false,
      checkObj: {
        weekNow: 0,
        weekend: 0,
        section: 0,
      },
      expTable: [
        {
          weekDate: '星期一',
          date: '4.2',
          curriculum: [],
        },
        {
          weekDate: '星期二',
          date: '4.3',
          curriculum: [],
        },
        {
          weekDate: '星期三',
          date: '4.4',
          curriculum: [],
        },
        {
          weekDate: '星期四',
          date: '4.5',
          curriculum: [],
        },
        {
          weekDate: '星期五',
          date: '4.6',
          curriculum: [],
        },
        {
          weekDate: '星期六',
          date: '4.7',
          curriculum: [],
        },
        {
          weekDate: '星期日',
          date: '4.8',
          curriculum: [],
        },
      ],
      weekList: [],
      requestData: [],
      weekNow: 0,
      weekNowObj: {
        week: '',
        year: '',
        weekend: '',
        datatimeArr: [{ time: '' }],
        term_num: 1,
      },
    }
  },
  computed: {
    // classlist() {
    //   const arr = [...this.$store.state.classList]
    //     .sort((a, b) => {
    //       return a.name < b.name ? -1 : 1
    //     })
    //     .sort((a, b) => {
    //       return a.grade_id - b.grade_id
    //     })
    //   return arr
    // },
    ...mapState({
      weekTimeArr: 'weekTimeArr',
      gradeArr: 'gradeArr',
      schoolDate: 'schoolDate',
    }),
    computedAmPm() {
      return (type) => {
        let arr =
          this.weekNowObj && this.weekNowObj.sectionData
            ? this.weekNowObj.sectionData.filter((e) => e.am_pm === type)
            : []
        console.log('🚀 ~ file: index.vue:625 ~ return ~ arr:', arr)

        return arr
      }
    },
  },
  watch: {
    isShow(n) {
      this.dialogVisible = n
    },
    activeLabId() {
      this.getTableDateLab()
    },
    dialogVisible(n) {
      if (!n) {
        this.back()
      }
    },
  },
  created() {
    this.weekNow = this.$store.state.schoolDate.week
    this.getYearTermData()

    // this.weekNowObj = this.$store.state.schoolDate
    // let weekend = new Date().getDay()
    // if (weekend === 0) {
    //   weekend = 7
    // }
    // this.weekNowObj.weekend = weekend
    // this.getTableDateLab()
  },

  // mounted() { },

  methods: {
    getYearTermData() {
      let weekend = new Date().getDay()
      if (weekend === 0) {
        weekend = 7
      }
      findschoolYearweek({
        school_year: this.$store.state.schoolDate.school_year
          ? this.$store.state.schoolDate.school_year.split('-')[0]
          : '',
        semester: this.$store.state.schoolDate.term_num,
      }).then((res) => {
        // this.weekNow = res.data.week
        this.weekNowObj = res.data
        this.weekNowObj.weekend = weekend
        this.getTableDateLab()
      })
    },
    getTableDateLab() {
      const data = {
        school_year: this.$attrs.curriculumData.school_year.slice(0, 4),
        semester: this.$attrs.curriculumData.term_num,
        start_time:
          this.$attrs.curriculumData.term_num === 1
            ? this.$attrs.curriculumData.first_time
            : this.$attrs.curriculumData.second_time,
        school_id: this.$attrs.curriculumData.school_id,
        subject_id: this.$attrs.subject_id,
        laboratory_id: this.activeLabId,
        week_time: this.weekNow,
      }
      // console.log(268, data)
      expBooklist(data).then((res) => {
        this.requestData = res.data.list.filter((e) => {
          return e.is_del === 0 && e.status > 0
        })
        this.weekList = this.weekTimeArr
          .map((e) => {
            return {
              week: e,
            }
          })
          .splice(1, this.schoolDate.weeknum)
        res.data.pass.forEach((e) => {
          this.weekList[e.week_time - 1].count = e.Count
        })
        this.weekList = JSON.parse(JSON.stringify(this.weekList))
        console.log('272', this.weekList)
        if (res.code === 10) {
          this.expTable = [
            {
              weekDate: '星期一',
              date: '4.2',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期二',
              date: '4.3',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期三',
              date: '4.4',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期四',
              date: '4.5',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期五',
              date: '4.6',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期六',
              date: '4.7',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期日',
              date: '4.8',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
          ]
          // this.requestData.sort((a, b) => {
          //   return b.is_del - a.is_del
          // })
          this.requestData.forEach((e) => {
            if ('name' in this.expTable[e.weekend - 1].curriculum[e.section - 1]) {
              this.expTable[e.weekend - 1].curriculum[e.section - 1].num++
              if (
                this.expTable[e.weekend - 1].curriculum[
                  e.section - 1
                ].laboratoryArr.indexOf(e.laboratory) === -1
              ) {
                this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr.push(
                  e.laboratory
                )
              }
            } else {
              this.expTable[e.weekend - 1].curriculum[e.section - 1] = e
              this.expTable[e.weekend - 1].curriculum[e.section - 1].num = 1
              this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr = [
                e.laboratory,
              ]
            }
          })
        }
      })
    },
    clickItem(item, weekend, section) {
      // console.log('🚀 ~ file: school-time.vue ~ line 440 ~ clickItem ~ item', item)
      // console.log('🚀 ~ file: school-time.vue ~ line 401 ~ clickItem ~ item', item)
      if (1 !== 3 && JSON.stringify(item) !== '{}' && this.isOrder === 2) {
        Message({
          type: 'warning',
          message: '请选择需审核的实验室或者选择无预约的节次进行预约',
        })
        return
      }
      const flag =
        this.weekNow < this.weekNowObj.week ||
        (this.weekNow === this.weekNowObj.week && weekend < this.weekNowObj.weekend)

      if (!flag) {
        this.checkObj = {
          weekNow: this.weekNow,
          weekend,
          section,
          time: this.weekNowObj.datatimeArr
            ? this.weekNowObj.datatimeArr[this.weekNow - 1][weekend - 1].replace(
                /\./g,
                '-'
              )
            : '',
        }
        this.$emit('sureClick', this.checkObj)
        this.back()
      }
    },
    selWeek(index) {
      this.weekNow = index
      this.getTableDateLab()
    },
    // sureClick() {
    //   this.$emit('sureClick', this.checkObj)
    //   this.back()
    // },
    back() {
      this.$emit('back')
    },
  },
}
</script>

<style scoped lang="scss">
.main {
  ::v-deep .el-dialog {
    text-align: center;
    margin-top: 5vh !important;
    background: #e8e8e9;
    border-radius: 20px;
    overflow: hidden;
    .el-dialog__header {
      background-color: #61cab5;
      .el-dialog__title {
        color: #fff;
      }
    }
    .el-dialog__body {
      .grade-list-box {
        display: flex;
        min-height: 20vh;
        overflow-y: scroll;
        & > div {
          flex: 1;
          flex-direction: column;
          margin-right: 4px;
          & > .item {
            width: 100%;
            padding-top: 10px;
            height: 78px;
            margin-bottom: 4px;
            background-color: #fff;
            cursor: pointer;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            .sub-msg-box {
              position: relative;
              margin: auto;
              height: 68px;
              width: 92%;
              border-radius: 4px;
              background-color: #51a8ff;
              & > :nth-child(1) {
                padding-top: 6px;
                margin-left: 15%;
                width: 70%;
                height: 16px;
                line-height: 16px;
                font-size: 12px;
                color: #fff;
              }
              & > :nth-child(2) {
                padding-top: 4px;
                margin-left: 15%;
                width: 70%;
                height: 16px;
                line-height: 16px;
                font-size: 12px;
                color: #fff;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              & > :nth-child(3) {
                padding-top: 4px;
                margin-left: 15%;
                width: 70%;
                height: 16px;
                line-height: 16px;
                font-size: 12px;
                color: #fff;
              }
              & > :nth-child(4) {
                position: absolute;
                top: -2px;
                left: -2px;
                width: 20px;
                height: 20px;
                border-radius: 2px;
                background-color: #fff;
                span {
                  float: left;
                  margin-top: 1px;
                  margin-left: 1px;
                  width: 18px;
                  height: 18px;
                  line-height: 18px;
                  font-size: 12px;
                  border-radius: 2px;
                  color: #fff;
                  background-color: #eb983b;
                }
              }
              img {
                position: absolute;
                top: 0;
                right: 0;
                transform: translate(50%, -30%);
              }
              .book-type {
                position: absolute;
                top: 100%;
                right: 0;
                transform: translate(50%, -80%);
              }
              .book-type-text {
                width: 16px;
                font-size: 12px;
                color: #fff;
              }
            }
          }
          & > :nth-child(1) {
            margin-bottom: 8px;
            height: 60px;
            background-color: #fff;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            opacity: 0.8;
            .week {
              padding-top: 10px;
            }
            .date {
              margin-top: 6px;
            }
          }
          // & > :nth-child(5) {
          //   margin-bottom: 8px;
          // }
        }
        & > :nth-child(1) {
          flex: none;
          width: 100px;
          p {
            font-size: 16px;
            color: #329581;
            margin-bottom: 8px;
            height: 60px;
            line-height: 60px;
            box-shadow: none;
            opacity: 1;
          }
          ul {
            display: flex;
            flex-direction: column;
            // justify-content: space-between;
            width: 100%;
            height: 100%;
            background-color: #fff;
          }
          ul li {
            cursor: pointer;
            height: 32px;
            line-height: 32px;
            position: relative;
            span {
              position: absolute;
              top: -4px;
              right: 0;
              width: 20px;
              height: 16px;
              line-height: 16px;
              font-size: 12px;
              background-color: #329581;
              color: #fff;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }
          }
        }
        & > :nth-child(2) {
          flex: none;
          width: 86px;
          height: 100%;
          background-color: rgba(255, 255, 255, 0) !important;
          p {
            font-size: 16px;
            color: #329581;
            margin-bottom: 8px;
            height: 60px;
            line-height: 60px;
            background-color: #fff;
            text-align: left;
            img {
              float: left;
              margin: 19px 10px 19px 11px;
              width: 22px;
              height: 22px;
            }
          }
          & > div {
            // height: 736px;
            width: 100%;
            & > :nth-child(1) {
              float: left;
              width: 40px;
              & > :nth-child(1),
              & > :nth-child(2) {
                width: 40px;
                // height: 364px;
                background-color: #fff;
                margin-bottom: 8px;
                box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
                writing-mode: vertical-lr;
                text-align: center;
                p {
                  width: 40px;
                  height: 100%;
                  line-height: 40px;
                  text-align: center;
                  letter-spacing: 2em;
                  font-size: 16px;
                  color: #05c65d;
                }
              }
              // & > :nth-child(2) {
              //   width: 40px;
              //   // height: 455px;
              //   background-color: #fff;
              //   box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
              //   p {
              //     padding: 134px 12px;
              //     width: 16px;
              //     height: 96px;
              //     line-height: 48px;
              //     font-size: 16px;
              //     color: #05c65d;
              //   }
              // }
            }
            & > :nth-child(2) {
              float: right;
              & > :nth-child(1) {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                width: 40px;
                // height: 364px;
                margin-bottom: 4px;
                div {
                  height: 66px;
                  width: 16px;
                  line-height: 22px;
                  padding: 11px 12px;
                  font-size: 16px;
                  background-color: #fff;
                  color: #329581;
                  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
                }
              }
              & > :nth-child(2) {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                width: 40px;
                // height: 455px;
                div {
                  height: 66px;
                  width: 16px;
                  line-height: 22px;
                  padding: 11px 12px;
                  font-size: 16px;
                  background-color: #fff;
                  color: #329581;
                  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
                }
              }
            }
          }
        }
        .check-list {
          background: #dcece3;
        }
        .scroll {
          padding-top: 4px;
          overflow-y: scroll;
          overflow-x: auto;
          box-sizing: border-box;
        }
        .scroll::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
  .groy-bg {
    background: #e8e8e9 !important;
    color: rgb(0, 0, 0) !important;
  }
  .week-on {
    background-color: #eea359 !important;
    color: #fff !important;
  }
  .active-bg {
    background: #329581 !important;
  }
}
</style>
