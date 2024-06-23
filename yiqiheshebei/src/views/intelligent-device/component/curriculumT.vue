<template>
  <div class="curriculum">
    <div class="curriculum-title">
      实验室周课表
    </div>
    <div class="curriculum-mian">
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
          >
            <div class="class-box">
              <div v-for="(e, i) in item" :key="i" class="class-box-item">
                <p>
                  一年级一班
                </p>
                <p class="show-item">
                  实验
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
      <div class="primary-btn">预约</div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const weekList = ['周一','周二','周三','周四','周五','周六','周日']

const courseTable = [
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
