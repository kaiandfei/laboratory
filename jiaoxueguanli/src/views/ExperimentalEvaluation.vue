<template>
  <div class="evaluation-box">
    <div class="module">
      <p class="title">实验评价</p>
      <div class="top_tab">
        <span :class="{ active_span: isActive === 1 }" @click="changeTab(1)"
          >我的评价</span
        >
        <span :class="{ active_span: isActive === 2 }" @click="changeTab(2)"
          >收到的评价</span
        >
      </div>
      <div class="content">
        <div class="evaluate" v-if="isActive === 1 && notevaluationmeList.length === 0">
          <p class="value-none">暂未评价</p>
        </div>
        <div v-for="(item, index) in notevaluationmeList" :key="index">
          <div v-show="isActive === 1 && item.Evaluation.length === 0" class="evaluate">
            <div class="evaluate_top">
              <span>实验名称:</span
              ><img src="@images/experimentalRecord/orange.png" alt="" /><span
                >{{ item ? item.expname : '' }}<span>(待评价)</span></span
              >
            </div>
            <div class="evaluate_center">
              <span>班级:</span><span>{{ item.classname }}</span>
            </div>
          </div>
          <div
            v-show="isActive === 1"
            class="evaluate"
            v-for="(classItem, classIndex) in item.Evaluation"
            :key="classIndex"
          >
            <div class="evaluate_top">
              <span>实验名称:</span>
              <img src="@images/experimentalRecord/green.png" alt="" />
              <span>{{ item ? item.expname : '' }}</span>
              <span /><span />
              <span class="transform_span"
                >评价时间:&#160;&#160;&#160;{{ classItem.create_time }}</span
              >
            </div>
            <div class="evaluate_center">
              <span>班级:</span><span>{{ item.classname }}</span> <span>被评人:</span
              ><span>{{ classItem.appraiser.username }}</span>
              <span>评价:</span>
              <div class="evaluate_star">
                <el-rate
                  v-model="classItem.start"
                  disabled
                  :colors="['#05C65D', '#05C65D', '#05C65D']"
                />
              </div>
            </div>
            <div class="evaluate_bottom">
              <span>评语:</span>
              <p>{{ classItem.content }}</p>
            </div>
          </div>
        </div>
        <div v-show="isActive === 2">
          <div class="evaluate" v-if="evaluationmeList.length === 0">
            <p class="value-none">暂未收到他人的评价</p>
          </div>
          <div class="evaluate" v-for="(item, index) in evaluationmeList" :key="index">
            <div class="evaluate_top">
              <span>实验名称:</span>
              <img src="@images/experimentalRecord/green.png" alt="" />
              <span>{{ item.goclass ? item.goclass.expname : '' }}</span>
              <span /><span />
              <span class="transform_span"
                >评价时间:&#160;&#160;&#160;{{ item.create_time }}</span
              >
            </div>
            <div class="evaluate_center">
              <span>班级:</span
              ><span>{{ item.goclass ? item.goclass.className : '' }}</span>
              <span>评课人:</span><span>{{ item.username }}</span>
              <span>评价:</span>
              <div class="evaluate_star">
                <el-rate
                  v-model="item.start"
                  disabled
                  :colors="['#05C65D', '#05C65D', '#05C65D']"
                />
              </div>
            </div>
            <div class="evaluate_bottom">
              <span>评语:</span>
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findappendexp, notnotevaluationme } from '../network/experimentRecord'

export default {
  name: 'ExperimentalEvaluation',
  components: {},
  data() {
    return {
      isActive: 1,
      evaluationmeList: [],
      notevaluationmeList: [],
      notmyevaluationList: [],
    }
  },
  created() {
    // 我收到的评价
    const data = {
      appraise_id: this.$store.getters.getUserMsg.id,
    }
    findappendexp(data).then((res) => {
      if (res.code === 10) {
        const arr = res.data.filter((item) => {
          return item.user ? item.user.id !== this.$store.getters.getUserMsg.id : true
        })
        this.evaluationmeList = [...arr]
      }
    })
    // 我收到的评价
    const data3 = {
      userid: this.$store.getters.getUserMsg.id,
    }
    notnotevaluationme(data3).then((res) => {
      if (res.code === 10) {
        this.notevaluationmeList = res.data
      }
    })
  },
  methods: {
    changeTab(index) {
      this.isActive = index
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
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      padding: 20px 0;
    }
    .contentBox {
      padding: 10px 0;
      position: relative;
    }
    .evaluate {
      width: 96%;
      height: 158px;
      margin: 10px 2%;
      padding: 18px 0;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 5px;
      text-align: left;
      .evaluate_star {
        margin-left: -20px;
        display: inline-block;
        transform: translate(0, -3px);
        ::v-deep .el-rate {
          .el-rate__item {
            .el-rate__icon {
              font-size: 24px;
            }
          }
        }
      }
      .value-none {
        width: 100%;
        text-align: center;
        font-size: 18px;
      }
    }
    .evaluate_top,
    .evaluate_center,
    .evaluate_bottom {
      & > span:nth-of-type(2n-1) {
        margin: 12px 0 12px 24px;
        display: inline-block;
        width: 100px;
        height: 21px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: #848484;
        opacity: 1;
      }
      & > span:nth-of-type(2n) {
        display: inline-block;
        width: 30%;
      }
      p {
        display: inline;
      }
      .transform_span {
        display: inline-block;
        transform: translate(-30px, 0);
        width: 240px !important;
      }
    }
    .evaluate_top img {
      width: 24px;
      height: 24px;
      margin-right: 6px;
      transform: translate(0, 5px);
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
