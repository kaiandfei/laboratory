<template>
  <div>
    <div class="box-detail">
      <div class="fr cancel-btn" @click="back()">
        <img src="@assets/images/common/cancel.png" alt="" />
        <span class="cancel">返回</span>
      </div>
      <div class="detail">
        <header>
          <span class="header_title">{{ isDetail ? '评价详情' : '填写评价' }} </span>
          <!-- <span class="share">分享</span> -->
        </header>
        <div class="module">
          <p class="title">基础信息</p>
          <div class="message-box">
            <div class="row">
              <div class="item">
                <span>实验名称:</span><span>{{ courseMessage.expname }}</span>
              </div>
            </div>
            <div class="row">
              <div class="item">
                <span>学科:</span><span>{{ subjectName(courseMessage.subject_id) }}</span>
              </div>
              <div class="item">
                <span>学段:</span
                ><span>{{
                  ['小学', '初中', '高中'][courseMessage.time_ids - 1] || ''
                }}</span>
              </div>
              <div class="item">
                <span>年级:</span><span>{{ computedGrade }}</span>
              </div>
              <div class="item">
                <span>班级:</span
                ><span>{{
                  courseMessage.className ||
                  courseMessage.classname ||
                  computedClassName(courseMessage)
                }}</span>
              </div>
              <div class="item">
                <span>授课教师:</span
                ><span>{{ courseMessage.teacher_name || '无' }}</span>
              </div>
              <div class="item">
                <span>实验员:</span><span>{{ courseMessage.experimenter || '无' }}</span>
              </div>
            </div>
            <div class="row">
              <div class="item">
                <span>实验类型：</span
                ><span>{{
                  $store.state.groupTypeList[courseMessage.type - 1] || ''
                }}</span>
              </div>
              <div class="item">
                <span>分组数：</span><span>{{ courseMessage.number_instruments }}</span>
              </div>
              <div class="item">
                <span>上课地点：</span
                ><span>{{ courseMessage.laboratory_name || '教室' }}</span>
              </div>
              <div class="item">
                <span>实验时间:</span>
                <span>
                  第{{ courseMessage.week_time }}周/{{ courseMessage.weekend }}/第{{
                    courseMessage.section
                  }}节课{{ courseMessage.start ? '(' + courseMessage.start + ')' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === 1" class="evaluate-myself">
      <ul>
        <li>
          <span>1.实验课资料填写情况：</span>
          <el-rate
            v-model="teachertSaveData.effect"
            :colors="['#05C65D', '#05C65D', '#05C65D']"
            :show-text="true"
            :texts="['一星', '二星', '三星', '四星', '五星']"
            text-color="#05C65D"
            :disabled="isDetail"
          />
        </li>
        <li>
          <span>2.实验课学生反馈效果：</span>
          <el-rate
            v-model="teachertSaveData.feedback"
            :colors="['#05C65D', '#05C65D', '#05C65D']"
            :show-text="true"
            :texts="['一星', '二星', '三星', '四星', '五星']"
            text-color="#05C65D"
            :disabled="isDetail"
          />
        </li>
        <li>
          <span>3.实验课实验创新效果：</span>
          <el-rate
            v-model="teachertSaveData.preparation"
            :colors="['#05C65D', '#05C65D', '#05C65D']"
            :show-text="true"
            :texts="['一星', '二星', '三星', '四星', '五星']"
            text-color="#05C65D"
            :disabled="isDetail"
          />
        </li>
        <li class="bottom">
          <div class="title">
            <span>总结：</span>
          </div>
          <el-input v-if="!isDetail" type="textarea" v-model="teachertSaveData.content" />
          <div v-else>{{ teachertSaveData.content }}</div>
        </li>
      </ul>
      <div v-if="!isDetail" class="btn" @click="saveevaluateObj()">保存评价</div>
    </div>
    <div v-else class="evaluate-admin">
      <ul>
        <li v-for="(item, index) in openClassData.data" :key="index">
          <span>{{ `${index + 1}.${item.project}` }}</span>
          <div class="score">{{ item.defaultscore }}</div>
        </li>

        <li class="bottom">
          <div class="title">
            <span>总结：</span>
          </div>
          <div>{{ openClassData.content }}</div>
        </li>
        <li class="bottom">
          <div class="title">
            <span>评课人：{{ openClassData.username }}</span>
          </div>
          <!-- <div>{{ openClassData.username }}</div> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  teachertSave,
  // laboratoryUserSave,
  teacherEvaluationfind,
  findproject, // findStudentEvaluation,
} from '@network/evaluationStudent'
import { mapState } from 'vuex'
import mixinsFormatter from '@/mixins/formatter'

export default {
  mixins: [mixinsFormatter],
  name: '',
  props: {
    type: {
      type: Number,
      default: 1, // 我的评价
    },
    isDetail: {
      type: Boolean,
      default: true,
    },
    courseMessage: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      teachertSaveData: {
        content: '',
        effect: 0,
        feedback: 0,
        go_classid: this.courseMessage.id,
        preparation: 0,
        user_id: this.$store.state.userMsg.id,
      },
      openClassData: {
        data: [],
      },
    }
  },
  computed: {
    computedGrade() {
      let str = ''
      let arr = this.courseMessage.grade.split(',')
      arr.forEach((element) => {
        str += this.$store.state.gradeArr[element] || ''
      })
      return str
    },
    ...mapState({
      subjectArr: 'subjectArr',
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
  },
  created() {
    this.getEvaData()
  },

  mounted() {},
  methods: {
    getEvaData() {
      if (this.type === 1) {
        teacherEvaluationfind({
          go_classid: this.courseMessage.id,
          user_id: this.$store.state.userMsg.id,
        }).then((res) => {
          if (res.code === 10) {
            if (res.data) {
              delete res.data.id
              this.teachertSaveData = res.data
            }
          }
        })
      } else {
        // 需要公开课接口
        findproject({
          pid: '0',
          evaluation_id: this.courseMessage.evaluation_id,
        }).then((res) => {
          this.openClassData = res.data
        })
      }
    },
    saveevaluateObj() {
      teachertSave(this.teachertSaveData).then((res) => {
        this.$message.success(res.msg)
        this.isDetail = true
        // this.back()
      })
      // .then((res) => {
      //   // if (Number(this.courseMessage.laboratory_id) !== -1) {
      //   //   laboratoryUserSave(this.laboratoryUserSaveData).then((res) => {
      //   //     if (res.code === 10) {
      //   //       this.$message.success(res.msg)
      //   //     } else {
      //   //       this.$message.error(res.msg)
      //   //     }
      //   //   })
      //   // } else {

      //   // }
      // })
    },
    back() {
      this.$emit('back')
    },
  },
}
</script>

<style lang="scss" scoped>
.box-detail {
  position: relative;
  .cancel-btn {
    position: absolute;
    top: -30px;
    right: 0;
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
      margin-right: 6px;
    }
  }
  // .tip-line {
  //   // display: none;
  // }

  // height: 3000px;
  header {
    width: 100%;
    height: 60px;
    background: #dcece3;
    opacity: 1;
    margin: 10px auto;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    .header_title {
      height: 60px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 60px;
      color: #05c65d;
      opacity: 1;
    }
    .share {
      float: right;
      width: 48px;
      height: 60px;
      opacity: 1;
      line-height: 60px;
    }
  }
  .module {
    width: 100%;
    margin: 10px auto 20px;
    position: relative;
    .title {
      width: 240px;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
    }
    .refresh_button {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 36px;
      line-height: 36px;
      background: #05c65d;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      font-size: 14px;
      color: #ffffff;
      border-radius: 10px;
      visibility: hidden;
    }
    .message-box {
      padding: 24px 60px;
      background: #fff;
      .row {
        display: flex;
        flex-wrap: wrap;
        .item {
          margin-bottom: 24px;
          padding-right: 16px;
          min-width: 16%;
          font-weight: 16px;
          box-sizing: border-box;
          span:nth-of-type(1) {
            display: inline-block;
            width: 70px;
            color: #848484;
          }
        }
      }
      .others {
        padding: 15px 24px;
        width: 100%;
        min-height: 50px;
        background: #ffffff;
        text-align: left;
        border: 1px solid #c9c7c7;
        box-sizing: border-box;
        color: #626572;
      }
    }
    .tab {
      display: flex;
      // width: 100%;
      height: 80px;
      color: #626572;
      background: #f3f3f3;

      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 180px;
        box-sizing: border-box;
        img {
          margin-right: 18px;
          width: 20px;
          height: 20px;
        }
      }
      .active {
        border-bottom: 8px solid #05c65d;
        color: #05c65d;
        img {
          padding: 8px;
          background: #05c65d;
          border-radius: 50%;
        }
      }
    }
    .details {
      padding: 8px 24px;
      background: #fff;
    }
    .content {
      padding-bottom: 20px;
      width: 100%;
      background: #ffffff;
      .exp-name {
        padding-left: 20px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #05c65d;
        border-left: 4px solid #05c65d;
        box-sizing: border-box;
        font-size: 16px;
        background: #dcece3;
        text-align: left;
      }

      .medias-title {
        padding: 0 0 10px 10px;
        font-size: 16px;
        font-weight: bold;
        color: #201e1e;
        text-align: left;
      }
      .medias {
        padding: 2px 6px;
        background: #e8e8e9;
      }
      .media-box {
        margin-top: 10px;
        padding: 0 15px;
        // min-height: 40px;
        text-align: left;
        .video-box {
          display: inline-block;
          margin: 13px 15px;
          width: 230px;
          height: 128px;
          ::v-deep video {
            width: 100%;
            height: 100%;
          }
        }
        ::v-deep .el-image {
          display: inline-block;
          margin: 13px 12px;
          width: 230px;
          height: 128px;
        }
      }
      .shows {
        display: inline-block;
        width: 50%;
        padding: 6px 10px;
        box-sizing: border-box;
        vertical-align: top;
        .media-box {
          margin: 10px 0;
          height: 400px;
          video {
            width: 100%;
            height: 100%;
          }
          ::v-deep .el-image {
            display: inline-block;
            margin: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
      .report-list {
        text-align: left;
        .item {
          display: flex;
          margin: 20px 0;
          div {
            flex: 1;
          }
          div:nth-of-type(2) {
            flex: 3;
          }
          div:nth-of-type(3) {
            text-align: center;
          }
          div:nth-of-type(4) {
            color: #05c65d;
            text-align: center;
            cursor: pointer;
          }
        }
      }
      .img-box {
        position: relative;
        display: inline-block;
        margin: 13px 15px;
        // text-align: left;
        ::v-deep .el-image {
          width: 260px;
          height: 150px;
        }
        .group {
          position: absolute;
          right: 8px;
          bottom: 10px;
          padding: 2px 8px;
          background: #05c65d;
          border-radius: 12px;
          color: #fff;
        }
      }
      .up-item {
        text-align: left;
        & > ul {
          // margin-left: 20px;
          // width: 160px;
          display: inline-block;
          & > li {
            display: flex;
            align-items: center;
            margin-top: 10px;
            line-height: 26px;
            img {
              margin-right: 6px;
              width: 20px;
            }
            & > a {
              margin-left: 10px;
              color: black;
            }
          }
        }
      }
    }
    .tl {
      text-align: left;
    }
    // .experiment-procedure {
    //   // max-height: 600px;
    //   // overflow-y: scroll;
    // }
    .contentBox {
      padding: 10px 0;
      position: relative;
      .echartBox {
        position: absolute;
        top: -20px;
        left: 84%;
        width: 154px;
        height: 154px;
        .echartDiv {
          width: 154px;
          height: 154px;
        }
        .centerText {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 52px;
          height: 52px;
          background: #efefef;
          color: #05c65d;
          border-radius: 50%;
          text-align: center;
          line-height: 52px;
          transform: translate(-50%, -50%);
        }
      }
      .progressBox {
        width: 94%;
        margin: 10px 3%;
        display: flex;
        flex-direction: row;
        ::v-deep .el-progress {
          width: 74%;
          margin: 0 18px;
        }
      }
    }
    .grouping {
      margin: 10px 0;
      padding: 10px 0;
      width: 100%;
      // height: 182px;
      // background: #ffffff;
      // border-top: 1px solid #c9c7c7;
      // border-bottom: 1px solid #c9c7c7;
      text-align: left;
      opacity: 1;
      // overflow: hidden;
      p:nth-of-type(1) {
        width: 200px;
        font-size: 18px;
        font-weight: 400;
        margin-left: 30px;
      }
      .grouping-item {
        min-height: 60px;
        display: flex;
        align-items: center;
        margin: 6px 0;
        .grouping_left {
          width: 30%;
          float: left;
          display: flex;
          align-items: center;
          span:nth-of-type(1) {
            display: inline-block;
            width: 80px;
            font-size: 16px;
            text-align: left;
            margin: 5px 0 0 64px;
          }
          .star {
            display: inline;
            ::v-deep .el-rate {
              display: inline;
              margin: 30px 0 0 64px;
              .el-rate__icon {
                font-size: 28px;
              }
            }
          }
        }
        .grouping_right {
          width: 70%;
          display: flex;
          flex-wrap: wrap;
          align-content: center;
          .el-image,
          video {
            margin: 0 60px 6px 0;
            width: 200px;
            height: 128px;
            background: rgba(0, 0, 0, 0);
            border: 1px solid #05c65d;
            opacity: 1;
          }
        }
      }
    }
    .none-data {
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      text-align: left;
      color: #ababab;
    }
    .evaLute-box {
      // max-height: 640px;
      overflow-y: scroll;
    }
    .evaluate {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 96%;
      height: 158px;
      margin: 10px 2%;
      padding: 18px 0;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 5px;
      text-align: left;
      .value-none {
        width: 100%;
        text-align: center;
        font-size: 18px;
      }
      .tip {
        position: absolute;
        top: 0;
        right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 2px;
        width: 20px;
        height: 194px;
        color: #ffffff;
        background: #05c65d;
        box-sizing: border-box;
      }
    }
    .evaluate_line {
      padding: 0 80px 0 60px;
      display: flex;
      justify-content: space-between;
      & > p {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        & > span:nth-of-type(1) {
          margin-right: 20px;
          display: inline-block;
          width: 80px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #848484;
        }
        & > span:nth-of-type(2) {
          flex: 1;
        }
        img {
          width: 24px;
          height: 24px;
          margin-right: 6px;
        }
        ::v-deep .el-rate {
          width: 180px;
          .el-rate__item {
            .el-rate__icon {
              font-size: 24px;
            }
          }
        }
        .has-width {
          width: 180px;
        }
      }
      // .transform_span {
      //   display: inline-block;
      //   transform: translate(-30px,0);
      //   width: 240px !important;
      // }
    }
    .haveBgColor {
      background: #dcece3;
    }
    .row {
      text-align: left;
    }
    .f_left {
      display: flex;
      align-items: center;
      margin-top: 30px;
    }
    .exper_time {
      margin: 0 10px 0 80px;
      width: 50px;
      height: 140px;
      background: #dcece3;
      opacity: 1;
      color: #05c65d;
      border-radius: 10px;
      writing-mode: vertical-lr;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .class_message {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
      width: 300px;
      height: 140px;
      background: #ffffff;
      border: 1px solid #05c65d;
      opacity: 1;
      p {
        line-height: 24px;
      }
    }
    .refresh {
      margin-right: 180px;
      width: 80px;
      height: 80px;
      line-height: 80px;
      background: #ffffff;
      border: 1px solid #05c65d;
      box-shadow: 0px 2px 4px rgba(51, 51, 51, 0.2);
      color: #05c65d;
      opacity: 1;
      border-radius: 50px;
      text-align: center;
      visibility: hidden;
    }
  }
}
.evaluate-myself,
.evaluate-admin {
  padding: 10px 40px;
  box-sizing: border-box;
  background: #fff;
  & > ul {
    li {
      display: flex;
      align-items: center;
      padding: 10px 4px;
      font-size: 16px;
      border-bottom: 1px solid #efefef;
      & > span {
        margin-right: 30%;
        text-align: left;
      }
      & > ::v-deep .el-rate {
        .el-rate__icon {
          font-size: 20px;
        }
      }
    }
    li:nth-of-type(3) {
      border: none;
    }
    .bottom {
      flex-direction: column;
      align-items: flex-start;
      border: none;
      text-align: left;
      .title {
        margin-bottom: 14px;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
.evaluate-admin {
  ul {
    li {
      span {
        margin-right: 0;
        flex: 1;
      }
      .score {
        margin-left: auto;
        width: 120px;
      }
    }
  }
}

.btn {
  // margin-left: 20px;
  // width: 78px;
  display: inline-block;
  padding: 0 18px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}
</style>
