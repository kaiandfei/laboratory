<template>
  <div class="curriculum">
    <div
      class="curriculum-title"
      :style="{ color: option.color, fontSize: option.fontSize + 'px' }"
    >
      {{ title }}
    </div>
    <div class="curriculum-mian" :style="{ backgroundColor: option.bgColor || '#fff' }">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="(item, index) in weekList" :key="index">{{ item }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(lineItem, lineIndex) in courseTable" :key="lineIndex">
            <td>{{ lineIndex + 1 }}</td>
            <td
              v-for="(item, index) in lineItem"
              :key="index"
              :class="[
                {
                  'groy-bg': isSubscribe
                    ? book_type === 3
                      ? !isPassAway(index + 1)
                      : isPassAway(index + 1)
                    : false,
                },
                {
                  'click-bg':
                    clickTimeObj.weekend === index + 1 &&
                    clickTimeObj.section === lineIndex + 1,
                },
              ]"
              :style="{
                background: computedColor(item),
              }"
            >
              <div class="class-box">
                <div v-for="(e, i) in item" :key="i" class="class-box-item">
                  <p>
                    {{ gradeList[e.grade - 1].slice(0, 2) + e.class_name }}
                  </p>
                  <p class="show-item">
                    {{ e.name[0] }}
                  </p>
                  <!-- <p>
                    {{ e.teacher_name }}
                  </p> -->
                </div>
              </div>

              <!-- <div v-if="item.length" class="icon">{{ item.length }}</div> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="curriculum-footer">
      <div class="primary-btn" @click="handleReservation">预约</div>
    </div>
    <face-recognition
      ref="faceRecognitionRef"
      :fromReservation="fromReservation"
      @goReservation="goReservation"
    />
  </div>
</template>

<script>
import { weekList, gradeList } from '@/contants/index.js'
import { getWeek } from '@/utils/week-date.js'
import { expBooklist } from '@/api/index'
import faceRecognition from '@/views/electronic-doorplate/electronic-doorplate-main/dialog/face-recognition.vue'
import LocalCache from '@/utils/localCache'
export default {
  name: 'Curriculum',
  components: {
    faceRecognition,
  },
  props: {
    book_type: {
      type: Number,
      default: 1,
    },
    isSubscribe: {
      type: Boolean,
      default: true,
    },
    curriculumData: {
      type: Object,
      default: () => ({}),
    },
    subject_id: {
      type: Number,
      default: 0,
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      week: '',
      weekList: [],
      courseTable: [
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
        [[], [], [], [], [], [], []],
      ],
      clickTimeObj: {
        week_time: 0,
        weekend: 0,
        section: 0,
      },
      weekNowObj: {
        week_time: 0,
        weekend: 0,
        datatimeArr: [{ time: '' }],
      },
      gradeList: [],
      fromReservation: false,
    }
  },
  inject: ['closeSetInterval'],
  computed: {
    title() {
      return LocalCache.getCookie('isSystem') === '1' || !LocalCache.getCookie('isSystem')
        ? '实验室周课表'
        : this.option.title
    },
    isPassAway() {
      return (weekend) => {
        const flag =
          this.clickTimeObj.week_time < this.weekNowObj.week_time ||
          (this.clickTimeObj.week_time === this.weekNowObj.week_time &&
            weekend < this.weekNowObj.weekend)
        return flag
      }
    },
    computedColor() {
      return (item) => {
        let arrId = []
        item.forEach((e) => {
          if (!arrId.includes(e.laboratory_id)) {
            arrId.push(e.laboratory_id)
          }
        })
        return arrId.length === 1
          ? item[0].laboratory_color || '#333'
          : arrId.length > 1
          ? '#797979'
          : '#fff'
      }
    },
  },
  created() {
    this.gradeList = gradeList
    // 获取当前第几周
    const date = new Date()
    this.week = getWeek(date)
    this.weekList = weekList
    this.getTableDateLab()
  },
  methods: {
    async getTableDateLab() {
      try {
        let params = {
          laboratory_id: parseInt(LocalCache.getCookie('labor_id')),
          week_time: this.curriculumData.week,
          school_year: this.curriculumData.school_year.slice(0, 4),
          semester: this.curriculumData.term_num,
          start_time:
            this.curriculumData.term_num === 1
              ? this.curriculumData.first_time
              : this.curriculumData.second_time,
          school_id: this.curriculumData.school_id,
          subject_id: this.subject_id,
        }
        const { data, code } = await expBooklist(params)
        if (code === 10) {
          console.log(144, data)
          this.requestData = data.list.filter((e) => {
            return e.is_del === 0 && e.status > 0
          })
          this.courseTable = [
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
            [[], [], [], [], [], [], []],
          ]
          this.requestData.forEach((e) => {
            this.courseTable[e.section - 1][e.weekend - 1].push(e)
          })
          console.log(
            '🚀 ~ file: time-table.vue ~ line 207 ~ this.requestData.forEach ~  this.requestData',
            this.requestData
          )
        }
      } catch (error) {
        console.log(error)
      }
    },
    goReservation() {
      this.$emit('update:isReservation', true)
    },
    handleReservation() {
      this.closeSetInterval()
      this.fromReservation = true
      this.$refs.faceRecognitionRef.dialogVisible = true
      this.$refs.faceRecognitionRef.initCom()
    },
  },
}
</script>

<style lang="scss" scoped>
.curriculum {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  background-color: #fff;
  .curriculum-title {
    height: 80px;
    line-height: 70px;
    font-size: 20px;
    color: #fff;
    background: #61cab5;
    border-radius: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .curriculum-mian {
    width: 100%;
    height: calc(100% - 140px);
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    margin-top: -20px;
    table {
      width: 100%;
      // overflow: auto;
      thead {
        tr {
          display: flex;
          th {
            width: 15%;
            height: 32px;
            // flex: 1;
            margin: 0 4px 4px 0;
            // padding: 22px 0;
            text-align: center;
            background: #ffffff;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
          }
          th:nth-of-type(1) {
            flex: none;
            padding: 0;
            width: 16px;
            height: 32px;
          }
          th:nth-last-of-type(1) {
            margin-right: 0;
          }
        }
      }
      tbody {
        tr {
          display: flex;
          td {
            width: 15%;
            height: 88px;
            position: relative;
            // flex: 1;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            margin: 0 4px 4px 0;
            // padding: 0 6px;
            font-size: 12px;
            text-align: center;
            background: #ffffff;
            color: #ffffff;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
            & > .class-box {
              // width: 100px;
              // max-height: 96px;
              height: 100%;
              overflow: hidden;
              .class-box-item {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                padding: 2px;
                box-sizing: border-box;
              }
              .show-item {
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                display: -webkit-box;
              }
            }
            & > .icon {
              position: absolute;
              left: 0;
              top: 0;
              width: 30px;
              height: 30px;
              line-height: 30px;
              background: rgba(255, 255, 255, 0.39);
            }
          }
          td:nth-of-type(1) {
            flex: none;
            padding: 0;
            width: 16px;
            color: #000;
          }
          td:nth-last-of-type(1) {
            margin-right: 0;
          }
          .groy-bg::after {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: rgb(199, 199, 199, 0.6);
          }
          .click-bg {
            background: #05c65d !important;
          }
        }
      }
    }
  }
  .curriculum-footer {
    height: 60px;
    .primary-btn {
      width: 40%;
      margin: 10px auto;
    }
  }
}
</style>
