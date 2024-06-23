<template>
  <div class="evaluation-box">
    <div class="module">
      <p class="title">
        实验评价<i class="el-icon-arrow-right" />{{ $route.meta.title }}
      </p>
      <top-filter
        v-if="status === 0"
        ref="filterRef"
        :options="[
          'time_ids',
          'semester',
          'subject_id',
          'grade',
          'week',
          'exp_id',
          'type',
          'time_order',
          'teacher_id',
          'class_id',
          'evaluate',
        ]"
        @change="getData"
      />
      <div class="content" v-if="status === 0">
        <div class="evaluate" v-if="notevaluationmeList.length === 0">
          <p class="value-none">暂未评价</p>
        </div>
        <div v-for="(item, index) in notevaluationmeList" :key="index">
          <div
            v-show="item.Evaluation.length === 0"
            class="evaluate"
            @click="checkItem(item, '')"
          >
            <div class="evaluate_line">
              <p>
                <span>实验名称:</span>
                <img src="@images/experimentalRecord/orange.png" alt="" />
                <span>
                  {{ item ? item.expname : '' }}
                  (待评价)
                </span>
              </p>
            </div>
            <div class="evaluate_line">
              <p>
                <span>班级:</span>
                <span>{{ item.classname }}</span
                >&nbsp;
                <span>
                  {{
                    `( 第${item.week_time}周,
                    ${$store.state.weekArr[item.weekend]},
                    ${$store.state.sectionArr[item.section]}
                    ${item.start_time ? item.start_time.split(' ')[0] : ''} )`
                  }}
                </span>
              </p>
            </div>
          </div>
          <div
            class="evaluate"
            v-for="(classItem, classIndex) in item.Evaluation.filter((e) => e.type !== 3)"
            :key="classIndex"
            @click="checkItem(item, classItem)"
          >
            <div class="evaluate_line">
              <p>
                <span>实验名称:</span>
                <img src="@images/experimentalRecord/green.png" alt="" />
                <span>{{ item ? item.expname : '' }}</span>
              </p>
              <p>
                <span>评价时间:</span>
                <span class="has-width">{{ classItem.create_time }}</span>
              </p>
            </div>
            <div class="evaluate_line">
              <p>
                <span>班级:</span>
                <span>{{ item.classname }}</span>
              </p>
              <p>
                <span>被评人:</span>
                <span>{{ classItem.appraiser.username }}</span>
              </p>
              <p>
                <span>评价:</span>
                <el-rate
                  v-model="classItem.start"
                  disabled
                  :colors="['#05C65D', '#05C65D', '#05C65D']"
                />
              </p>
            </div>
            <div class="evaluate_line">
              <p>
                <span>评语:</span>
                <span>{{ classItem.content }}</span>
              </p>
            </div>
            <div class="tip">
              {{
                ['', '实验课自评', '教研组长评价', '教师评价实验员', '教师互评'][
                  classItem.type
                ] || ''
              }}
            </div>
          </div>
        </div>
      </div>
      <evaluation-vue
        v-else
        :type="1"
        :courseMessage="courseMessage"
        :isDetail="isDetail"
        @back="back"
      ></evaluation-vue>
    </div>
  </div>
</template>

<script>
import TopFilter from '@components/top-filter.vue'
import EvaluationVue from './evaluation.vue'

import { notnotevaluationme } from '@network/experimentRecord'

export default {
  name: 'ExperimentalEvaluation',
  components: {
    TopFilter,
    EvaluationVue,
  },
  data() {
    return {
      searchForm: {
        grade: '',
      },
      // evaluationmeList: [],
      notevaluationmeList: [],
      courseMessage: {},
      // notmyevaluationList: []
      status: 0,
      isDetail: true,
    }
  },
  created() {
    // this.getData()
  },
  methods: {
    getData(obj) {
      // console.log('🚀 ~ file: teacher-progress.vue ~ line 87 ~ getData ~ obj', obj)
      // // 我收到的评价
      // const data = {
      //   appraise_id: this.$store.getters.getUserMsg.id
      // }
      // findappendexp(data).then((res) => {
      //   if (res.code === 10) {
      //     const arr = res.data.filter((item, index) => {
      //       return item.user ? item.user.id !== this.$store.getters.getUserMsg.id : true
      //     })
      //     this.evaluationmeList = [...arr]
      //   }
      // })
      // 我的评价
      const data3 = {
        ...obj,
        userid: this.$store.getters.getUserMsg.id,
      }
      notnotevaluationme(data3).then((res) => {
        if (res.code === 10) {
          this.notevaluationmeList = res.data
        }
      })
    },
    checkItem(item, evaItem) {
      console.log('🚀 ~ file: my-evaluation.vue:178 ~ checkItem ~ item:', item, evaItem)
      if (evaItem) {
        this.isDetail = true
      } else {
        this.isDetail = false
      }
      this.courseMessage = item
      this.status = 1
    },
    back() {
      this.status = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.evaluation-box {
  padding: 20px 32px 0 32px;
  .module {
    width: 100%;
    margin: 0px auto 20px;
    position: relative;
    .title {
      text-align: left;
    }
    .top-select {
      margin: 10px 0;
      padding: 20px 20px 0 20px;
      display: flex;
      flex-wrap: wrap;
      background: #ffffff;
      text-align: left;
      box-sizing: border-box;
      .select-box {
        width: 25%;
        height: 30px;
        line-height: 30px;
        margin-bottom: 20px;
        span {
          display: inline-block;
          width: 70px;
        }
        & > :nth-child(2) {
          width: calc(80% - 70px);
          box-sizing: border-box;
          ::v-deep .el-input {
            width: 100%;
            .el-input__inner {
              width: 100% !important;
            }
          }
        }
      }
      .has-height {
        height: 70px;
        overflow: hidden;
      }
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
    }
    .top_tab {
      width: 100%;
      font-size: 16px;
      margin: 10px 0;
      span {
        display: inline-block;
        width: 50%;
        background: #d9d9d9;
        height: 40px;
        line-height: 40px;
        border-radius: 6px;
      }
      .active_span {
        background: #ffffff;
      }
    }
    .content {
      margin: 10px 0;
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      padding: 20px 0;
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
    // .evaluate_top img {
    //   width: 24px;
    //   height: 24px;
    //   margin-right: 6px;
    //   transform: translate(0, 5px);
    // }
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
    }
  }
}
</style>
