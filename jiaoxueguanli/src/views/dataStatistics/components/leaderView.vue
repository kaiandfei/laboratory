<template>
  <div>
    <div class="content-box">
      <div class="content">
        <div class="title-box">
          <img src="@images/dataStatistics/today-need.png" alt="" />
          <div>
            <p>今日需开课</p>
            <p>{{ needClass }}</p>
          </div>
        </div>
        <div class="chart-box">
          <p>今日需开课详情</p>
          <chart-bar :seriesData="seriesData11" :xAxisData="xAxisData11" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <img src="@images/dataStatistics/today.png" alt="" />
          <div>
            <p>今日已开课</p>
            <p>{{ haveClass }}</p>
          </div>
        </div>
        <div class="chart-box">
          <p>今日已开课详情</p>
          <chart-bar :seriesData="seriesData12" :xAxisData="xAxisData12" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>教师列表</p>
            <ul>
              <li>教师</li>
              <li>学科</li>
              <li>年级</li>
              <li>班级</li>
            </ul>
          </div>
        </div>
        <div class="text-box">
          <ul v-for="(item, index) in teacherlists" :key="index">
            <li>{{ item.username }}</li>
            <li>{{ item.subject }}</li>
            <li :title="item.grade">{{ item.grade }}</li>
            <li :title="item.class">{{ item.class }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content class-num">
        <div class="title-box">
          <div>
            <p>
              实验开课率<span>{{ classRate }}%</span>
            </p>
          </div>
        </div>
        <div class="text-box">
          <p>实验开课数量</p>
          <p>第二周累计/本学期累计/本学期应开课</p>
          <p>{{ goClassData1 }} / {{ goClassData2 }} / {{ goClassData3 }}</p>
        </div>
      </div>
      <div class="content class-num">
        <div class="chart-box">
          <chart-bar
            :seriesData="seriesData21"
            :xAxisData="xAxisData21"
            :height="240"
            :xName="'周次'"
            :yName="'实验频次'"
          />
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content">
        <div class="chart-box">
          <chart-bar
            :seriesData="seriesData31"
            :xAxisData="xAxisData31"
            :type="2"
            :height="200 * 2"
          />
        </div>
      </div>
      <div class="content" style="width: calc(60% + 30px)">
        <div class="chart-box">
          <p>实验类型分布情况</p>
          <chart-bar
            :seriesData="seriesData32"
            :xAxisData="xAxisData32"
            :type="2"
            :height="200 * 2"
          />
        </div>
      </div>
      <div v-if="false" class="content">
        <div class="chart-box">
          <p class="left">年级实验资源</p>
          <div class="data-box">
            <div>
              <p>资源累计总</p>
              <p>1632</p>
              <p>收获点赞量累计：15776</p>
            </div>
            <div>
              <p>本学期新增累计</p>
              <p>102</p>
              <p><span class="increment" /><span class="green">20%</span> 环比上学期</p>
            </div>
            <div>
              <p>第二周新增</p>
              <p>22</p>
              <p><span class="decrement" /><span class="red">20%</span> 环比上周</p>
            </div>
          </div>
          <div class="pie-box">
            <chart-bar
              :seriesData="seriesData331"
              :xAxisData="seriesData331"
              :type="4"
              :height="150 * 2"
            />
          </div>
          <div class="pie-box">
            <chart-bar
              :seriesData="seriesData332"
              :xAxisData="seriesData332"
              :type="4"
              :height="150 * 2"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课前预习次数</p>
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <span>{{ thisSemesterBeforClass }}</span>
            </div>
            <div>
              <p>第二周累计</p>
              <span>{{ thisWeekBeforClass }}</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData41" :xAxisData="xAxisData41" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课前预习次数完成率</p>
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计（实际/理论&nbsp;）</p>
              <span>{{ practical }}/{{ expect }}≈{{ semesterlv2 }}%</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计（实际/理论&nbsp;）</p>
              <span>{{ weekpractical }}/{{ weekexpect }}≈{{ weeklv2 }}%</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData42" :xAxisData="xAxisData42" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课前预习反馈</p>
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <p class="black">等级A/{{ beforsemesterA }} 等级B/{{ beforsemesterB }}</p>
              <p class="black">等级C/{{ beforsemesterC }} 等级D/{{ beforsemesterD }}</p>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <p class="black">等级A/{{ beforWeekA }} 等级B/{{ beforWeekB }}</p>
              <p class="black">等级C/{{ beforWeekC }} 等级D/{{ beforWeekD }}</p>
            </div>
          </div>
          <chart-bar :seriesData="seriesData43" :xAxisData="xAxisData43" />
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课中实验操作步骤图</p>
            <!--            <p>1200</p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计/开课数</p>
              <span>{{ thisSemesterReportClassPic }}</span>
            </div>
            <div>
              <p>第二周累计/开课数</p>
              <span>{{ thisWeekReportClassPic }}</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData51" :xAxisData="xAxisData51" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课中实验操作步骤图平均值</p>
            <!--            <p>实际/开课数&nbsp;量<span class="margin-l">1200 / 130 ≈ 7（平均每节课步骤图数量）</span></p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计/开课数</p>
              <span>{{ totalSemester }}/{{ classSemester }}≈{{ semesterlv }}</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计/开课数</p>
              <span>{{ totalWeek }}/{{ classWeek }}≈{{ weeklv }}</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData52" :xAxisData="xAxisData52" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课中实验操作步骤图评价情况</p>
            <p>
              <span>五星/800</span><span>四星/200</span><span>三星/100</span
              ><span>二星/100</span><span>一星/100</span>
            </p>
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <p class="black">
                五星/{{ semesterFive }} 四星/{{ semesterFour }} 三星/{{ semesterThree }}
              </p>
              <p class="black">二星/{{ semesterTwo }} 一星/{{ semesterOne }}</p>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <p class="black">
                五星/{{ weekFive }} 四星/{{ weekFour }} 三星/{{ weekThree }}
              </p>
              <p class="black">二星/{{ weekTwo }} 一星/{{ weekOne }}</p>
            </div>
          </div>
          <chart-bar :seriesData="seriesData53" :xAxisData="xAxisData53" />
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课中实验报告</p>
            <!--            <p>1200</p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <span>{{ thisSemesterReportClass }}</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <span>{{ thisWeekReportClass }}</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData41_2" :xAxisData="xAxisData41_2" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课中实验报告完成率</p>
            <!--            <p>实际/理论&nbsp;<span class="margin-l">1200 / 1500 ≈ 80%（完成率）</span></p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计（实际/理论&nbsp;）</p>
              <span>{{ practical2 }}/{{ expect2 }}≈{{ semesterlv3 }}%</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计（实际/理论&nbsp;）</p>
              <span>{{ weekpractical2 }}/{{ weekexpect2 }}≈{{ weeklv3 }}%</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData42_2" :xAxisData="xAxisData42_2" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课中报告反馈</p>
            <!--            <p><span>等级A/800</span><span>等级B/200</span><span>等级C/100</span><span>等级D/100</span></p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <p class="black">等级A/{{ reportsemesterA }} 等级B/{{ reportsemesterB }}</p>
              <p class="black">等级C/{{ reportsemesterC }} 等级D/{{ reportsemesterD }}</p>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <p class="black">等级A/{{ reportWeekA }} 等级B/{{ reportWeekB }}</p>
              <p class="black">等级C/{{ reportWeekC }} 等级D/{{ reportWeekD }}</p>
            </div>
          </div>
          <chart-bar :seriesData="seriesData43_2" :xAxisData="xAxisData43_2" />
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课后习题报告</p>
            <!--            <p>1200</p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <span>{{ thisSemesterAfterClass }}</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <span>{{ thisWeekAfterClass }}</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData41_3" :xAxisData="xAxisData41_3" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课后习题报告完成率</p>
            <!--            <p>实际/理论&nbsp;<span class="margin-l">1200 / 1500 ≈ 80%（完成率）</span></p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计（实际/理论&nbsp;）</p>
              <span>{{ practical3 }}/{{ expect3 }}≈{{ semesterlv4 }}%</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计（实际/理论&nbsp;）</p>
              <span>{{ weekpractical3 }}/{{ weekexpect3 }}≈{{ weeklv4 }}%</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData42_3" :xAxisData="xAxisData42_3" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>学生课后习题报告反馈</p>
            <!--            <p><span>等级A/800</span><span>等级B/200</span><span>等级C/100</span><span>等级D/100</span></p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <p class="black">等级A/{{ aftersemesterA }} 等级B/{{ aftersemesterB }}</p>
              <p class="black">等级C/{{ aftersemesterC }} 等级D/{{ aftersemesterD }}</p>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <p class="black">等级A/{{ afterWeekA }} 等级B/{{ afterWeekB }}</p>
              <p class="black">等级C/{{ afterWeekC }} 等级D/{{ afterWeekD }}</p>
            </div>
          </div>
          <chart-bar :seriesData="seriesData43_3" :xAxisData="xAxisData43_3" />
        </div>
      </div>
    </div>
    <div v-if="false" class="content-box">
      <div class="content">
        <div class="title-box">
          <div>
            <p>我收到的评价</p>
            <!--            <p>1200</p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <span>{{ SemesterComments }}</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <span>{{ WeekComments }}</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData41_4" :xAxisData="xAxisData41_4" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>我收到的评价平均情况</p>
            <!--            <p>实际/开课数&nbsp;<span class="margin-l">1200 / 130 ≈ 8（平均每节课评价数）</span></p>-->
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计/开课数</p>
              <span>{{ totalSemester2 }}/{{ semesterclass }}≈{{ semesterRate }}</span>
            </div>
            <div>
              <p>第{{ weeknow }}周累计/开课数</p>
              <span>{{ totalWeek2 }}/{{ weekclass }}≈{{ weekRate }}</span>
            </div>
          </div>
          <chart-bar :seriesData="seriesData42_4" :xAxisData="xAxisData42_4" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <div>
            <p>我收到的评价累计</p>
            <p>
              <span>等级A/800</span><span>等级B/200</span><span>等级C/100</span
              ><span>等级D/100</span>
            </p>
          </div>
        </div>
        <div class="chart-box">
          <div class="top-text">
            <div>
              <p>本学期累计</p>
              <p class="black">
                五星/{{ semesterFive2 }} 四星/{{ semesterFour2 }} 三星/{{
                  semesterThree2
                }}
              </p>
              <p class="black">二星/{{ semesterTwo2 }} 一星/{{ semesterOne2 }}</p>
            </div>
            <div>
              <p>第{{ weeknow }}周累计</p>
              <p class="black">
                五星/{{ weekFive2 }} 四星/{{ weekFour2 }} 三星/{{ weekThree2 }}
              </p>
              <p class="black">二星/{{ weekTwo2 }} 一星/{{ weekOne2 }}</p>
            </div>
          </div>
          <chart-bar :seriesData="seriesData83" :xAxisData="xAxisData83" />
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content content-l">
        <p>教师整体情况</p>
        <table>
          <thead>
            <tr>
              <td>序号</td>
              <td>教师</td>
              <td>涉及年级</td>
              <td>学期开课率</td>
              <td>课前资料完成</td>
              <td>课中资料完成</td>
              <td>课中步骤图</td>
              <td>课后资料完成</td>
              <td>评价情况</td>
              <td>总体完成度</td>
              <td>总体排名</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in teacherStatusList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td :title="item.grade">{{ item.grade }}</td>
              <td>{{ item.go_class_lv * 100 }}%</td>
              <td>{{ item.befor_lv * 100 }}%</td>
              <td>{{ item.report_lv * 100 }}%</td>
              <td>{{ item.report_pic }}</td>
              <td>{{ item.after_lv * 100 }}%</td>
              <td>60%</td>
              <td>80%</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="false" class="content content-r">
        <div class="line-box">
          <chart-bar
            :seriesData="seriesData91"
            :xAxisData="xAxisData91"
            :height="200 * 2"
          />
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content content-l-b">
        <p>整体开课列表</p>
        <table>
          <thead>
            <tr>
              <td>序号</td>
              <td>周次</td>
              <td>实验名称</td>
              <td>涉及班级数量</td>
              <td>是否开全</td>
              <td>课前资料完成</td>
              <td>课中资料完成</td>
              <td>课中步骤图</td>
              <td>课后资料完成</td>
              <td>评价情况</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in teacherClassList" :key="index">
              <td>{{ index + 1 }}</td>
              <td :title="item.week">{{ item.week }}</td>
              <td :title="item.name">{{ item.name }}</td>
              <td>{{ item.count }}个班</td>
              <td>{{ item.is_complete == 1 ? '是' : '否' }}</td>
              <td>{{ (item.beforlv * 100).toFixed(2) }}%</td>
              <td>{{ (item.reportlv * 100).toFixed(2) }}%</td>
              <td>{{ item.pic_num }}</td>
              <td>{{ (item.afterlv * 100).toFixed(2) }}%</td>
              <td>80%</td>
            </tr>
            <!--            <tr>-->
            <!--              <td>2</td>-->
            <!--              <td>第二周</td>-->
            <!--              <td>探究电流与电压（必做)</td>-->
            <!--              <td>2个班</td>-->
            <!--              <td>是</td>-->
            <!--              <td>70%</td>-->
            <!--              <td>50%</td>-->
            <!--              <td>200</td>-->
            <!--              <td>60%</td>-->
            <!--              <td>80%</td>-->
            <!--            </tr>-->
          </tbody>
        </table>
      </div>
      <div v-if="false" class="content content-r">
        <div class="box">
          <div>
            <p><img src="@images/dataStatistics/plan.png" alt="" />我的实验计划</p>
            <p>6</p>
          </div>
          <div>
            <p>本学期实验计划</p>
            <p class="red">2</p>
            <p><span class="decrement" /><span class="red">10%</span> 比上学期</p>
          </div>
          <div />
        </div>
        <div class="box">
          <div>
            <p><img src="@images/dataStatistics/resources.png" alt="" />累计优质资源</p>
            <p>6</p>
          </div>
          <div>
            <p>本学期优质资源</p>
            <p class="red">10</p>
            <p><span class="decrement" /><span class="red">10%</span> 比上学期</p>
          </div>
          <div>
            <p>第二周优质资源</p>
            <p class="red">3</p>
            <p><span class="decrement" /><span class="red">10%</span> 比上周</p>
          </div>
        </div>
        <div class="box">
          <div>
            <p><img src="@images/dataStatistics/activity.png" alt="" />累计参与活动</p>
            <p>6</p>
          </div>
          <div>
            <p>本学期参与活动</p>
            <p class="red">10</p>
            <p><span class="decrement" /><span class="red">10%</span> 比上学期</p>
          </div>
          <div>
            <p>第二周参与活动</p>
            <p class="red">3</p>
            <p><span class="decrement" /><span class="red">10%</span> 比上周</p>
          </div>
        </div>
        <div class="box">
          <div>
            <p><img src="@images/dataStatistics/trophy.png" alt="" />累计获奖数</p>
            <p>6</p>
          </div>
          <div>
            <p>本学期获奖数</p>
            <p class="green">10</p>
            <p><span class="increment" /><span class="green">10%</span> 比上学期</p>
          </div>
          <div>
            <p>第二周获奖数</p>
            <p class="red">3</p>
            <p><span class="decrement" /><span class="red">10%</span> 比上周</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  todayClass,
  teacherList,
  goClass,
  expFrequency,
  beforeClass,
  beforeClassCompletion,
  beforeClassback,
  reportClass,
  reportClassCompletion,
  reportClassback,
  afterClass,
  afterClassCompletion,
  afterClassback,
  reportClassPic,
  reportClassCompletionPic,
  reportClassBackPic,
  commentsReceived,
  commentsReceivedAvg,
  commentsReceivedAll,
  teacherStatus,
  teacherClassList,
} from '@network/statisticalGroup'
import { getDatebyweek } from '@network/subscribe'
import ChartBar from '../../../components/echarts/chartBar.vue'
export default {
  components: {
    ChartBar,
  },
  name: '',
  props: {
    screenMessage: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      weeknow: 0,
      seriesData11: [],
      xAxisData11: [],
      needClass: 0,
      haveClass: 0,
      teacherlists: [],
      seriesData12: [],
      xAxisData12: [],
      classRate: 0,
      goClassData1: 0,
      goClassData2: 0,
      goClassData3: 0,
      seriesData21: [
        {
          name: '总数据',
          type: 'line',
          color: '#49A9EE',
          data: [7, 8, 13, 8, 6, 7, 15, 16, 8, 5, 5, 7, 5, 6, 7, 5, 5, 13, 15, 6],
        },
        {
          name: '张老师',
          type: 'line',
          data: [5, 6, 3, 5, 2, 3, 5, 6, 3, 2, 3, 1, 5, 6, 3, 5, 2, 3, 5, 6],
        },
        {
          name: '王老师',
          type: 'line',
          data: [4, 2, 2, 2, 2, 1, 3, 4, 6, 3, 2, 3, 5, 6, 3, 5, 2, 1, 2, 3],
        },
      ],
      xAxisData21: [
        '一',
        '二',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十',
        '十一',
        '十二',
        '十三',
        '十四',
        '十五',
        '十六',
        '十七',
      ],
      seriesData31: [
        {
          name: '本学期应开课',
          type: 'bar',
          data: [3, 6, 3],
          barWidth: 20,
        },
        {
          name: '本学期累计',
          type: 'bar',
          data: [5, 2, 3],
          barWidth: 20,
        },
        {
          name: '第二周累计',
          type: 'bar',
          data: [5, 6, 4],
          barWidth: 20,
        },
      ],
      xAxisData31: ['张老师', '王老师', '李老师'],
      seriesData32: [
        {
          name: '本学期分组',
          type: 'bar',
          data: [5, 6, 4, 6],
          barWidth: 20,
        },
        {
          name: '本学期演示',
          type: 'bar',
          data: [5, 1, 3, 6],
          barWidth: 20,
        },
        {
          name: '本周分组',
          type: 'bar',
          data: [5, 5, 3, 6],
          barWidth: 20,
        },
        {
          name: '本周演示',
          type: 'bar',
          data: [5, 6, 3, 4],
          barWidth: 20,
        },
      ],
      xAxisData32: ['张老师', '王老师', '李老师'],
      seriesData331: [
        {
          name: '本学期资源新增详情',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 28, name: '张老师' },
            { value: 73, name: '王老师' },
            { value: 50, name: '李老师' },
            { value: 44, name: '黄老师' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      xAxisData331: [],
      seriesData332: [
        {
          name: '第二周新增资源详情',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 28, name: '张老师' },
            { value: 73, name: '王老师' },
            { value: 50, name: '李老师' },
            { value: 44, name: '黄老师' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      xAxisData332: [],
      seriesData41: [],
      xAxisData41: [],
      seriesData41_2: [],
      xAxisData41_2: [],
      thisWeekReportClass: 0,
      thisSemesterReportClass: 0,
      thisWeekBeforClass: 0,
      thisSemesterBeforClass: 0,
      seriesData41_4: [],
      xAxisData41_4: [],
      WeekComments: 0,
      SemesterComments: 0,
      seriesData41_3: [],
      xAxisData41_3: [],
      thisWeekAfterClass: 0,
      thisSemesterAfterClass: 0,
      seriesData42: [],
      xAxisData42: [],
      expect: 0,
      practical: 0,
      weekexpect: 0,
      weekpractical: 0,
      weeklv2: 0,
      semesterlv2: 0,
      seriesData42_2: [],
      xAxisData42_2: [],
      expect2: 0,
      practical2: 0,
      weekexpect2: 0,
      weekpractical2: 0,
      weeklv3: 0,
      semesterlv3: 0,
      seriesData42_3: [],
      xAxisData42_3: [],
      expect3: 0,
      practical3: 0,
      weekexpect3: 0,
      weekpractical3: 0,
      weeklv4: 0,
      semesterlv4: 0,
      seriesData42_4: [],
      xAxisData42_4: [],
      totalWeek: 0,
      totalSemester: 0,
      weekclass: 0,
      semesterclass: 0,
      weekRate: 0,
      semesterRate: 0,
      seriesData43: [],
      xAxisData43: [],
      beforsemesterA: 0,
      beforsemesterB: 0,
      beforsemesterC: 0,
      beforsemesterD: 0,
      beforWeekA: 0,
      beforWeekB: 0,
      beforWeekC: 0,
      beforWeekD: 0,
      reportsemesterA: 0,
      reportsemesterB: 0,
      reportsemesterC: 0,
      reportsemesterD: 0,
      reportWeekA: 0,
      reportWeekB: 0,
      reportWeekC: 0,
      reportWeekD: 0,
      seriesData43_2: [],
      xAxisData43_2: [],
      aftersemesterA: 0,
      aftersemesterB: 0,
      aftersemesterC: 0,
      aftersemesterD: 0,
      afterWeekA: 0,
      afterWeekB: 0,
      afterWeekC: 0,
      afterWeekD: 0,
      seriesData43_3: [],
      xAxisData43_3: [],
      seriesData51: [],
      xAxisData51: [],
      thisWeekReportClassPic: 0,
      thisSemesterReportClassPic: 0,
      seriesData52: [],
      xAxisData52: [],
      totalSemester2: 0,
      classSemester: 0,
      semesterlv: 0,
      totalWeek2: 0,
      classWeek: 0,
      weeklv: 0,
      seriesData53: [],
      xAxisData53: [],
      semesterOne: 2,
      semesterTwo: 3,
      semesterThree: 5,
      semesterFour: 7,
      semesterFive: 7,
      weekOne: 2,
      weekTwo: 3,
      weekThree: 5,
      weekFour: 7,
      weekFive: 7,
      seriesData83: [],
      xAxisData83: [],
      semesterOne2: 2,
      semesterTwo2: 3,
      semesterThree2: 5,
      semesterFour2: 7,
      semesterFive2: 7,
      weekOne2: 2,
      weekTwo2: 3,
      weekThree2: 5,
      weekFour2: 7,
      weekFive2: 7,
      seriesData91: [
        {
          name: '实验资源审核情况',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: [4, 3, 7, 3, 5],
          barWidth: 20,
        },
        {
          name: '我的评价',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: [3, 2, 5, 2, 1],
          barWidth: 20,
        },
      ],
      xAxisData91: ['1月', '2月', '3月', '4月', '5月'],
      teacherStatusList: [],
      teacherClassList: [],
    }
  },
  watch: {
    screenMessage: {
      handler() {
        this.classToday()
      },
      deep: true,
    },
  },
  created() {
    this.getDatebyweek()
  },
  mounted() {
    this.classToday()
  },
  methods: {
    getDatebyweek() {
      getDatebyweek().then((res) => {
        this.weeknow = res.data.week
      })
    },
    classToday() {
      todayClass({ type: 1, ...this.screenMessage }).then((res) => {
        this.xAxisData11 = res.data.teacher
        this.seriesData11 = [
          {
            name: '本学年',
            type: 'bar',
            data: res.data.sum,
            barWidth: 20,
          },
        ]
        this.needClass = res.data.all
      })
      todayClass({ type: 2, ...this.screenMessage }).then((res) => {
        this.xAxisData12 = res.data.teacher
        this.seriesData12 = [
          {
            name: '本学年',
            type: 'bar',
            data: res.data.sum,
            barWidth: 20,
          },
        ]
        this.haveClass = res.data.all
      })
      teacherList().then((res) => {
        this.teacherlists = res.data
      })
      goClass(this.screenMessage).then((res) => {
        this.classRate = res.data.lv
        this.goClassData1 = res.data.weekend
        this.goClassData2 = res.data.hasClass
        this.goClassData3 = res.data.planClass
        this.seriesData31 = [
          {
            name: '老师',
            type: 'bar',
            data: [res.data.planClass, res.data.hasClass, res.data.weekend],
            barWidth: 20,
          },
        ]
      })
      expFrequency(this.screenMessage).then((res) => {
        this.seriesData21 = []
        for (var i = 0; i < res.data.list.length; i++) {
          const obj = {
            name: res.data.list[i].name,
            type: 'line',
            color: res.data.list[i].color ? res.data.list[i].color : '',
            data: res.data.list[i].data,
          }
          this.seriesData21.push(obj)
        }
        this.xAxisData21 = res.data.week_list
      })
      beforeClass(this.screenMessage).then((res) => {
        this.xAxisData41 = res.data.list
        this.seriesData41 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.data1,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.data2,
            barWidth: 10,
          },
        ]
        this.thisSemesterBeforClass = res.data.total1
        this.thisWeekBeforClass = res.data.total2
      })
      beforeClassCompletion(this.screenMessage).then((res) => {
        this.xAxisData42 = res.data.listClass
        this.seriesData42 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.list1,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.list2,
            barWidth: 10,
          },
        ]
        this.expect = res.data.expect
        this.practical = res.data.practical
        this.weekexpect = res.data.weekexpect
        this.weekpractical = res.data.weekpractical
        this.weeklv2 = res.data.weeklv
        this.semesterlv2 = res.data.semesterlv
      })
      beforeClassback(this.screenMessage).then((res) => {
        this.beforsemesterA = res.data.semesterA
        this.beforsemesterB = res.data.semesterB
        this.beforsemesterC = res.data.semesterC
        this.beforsemesterD = res.data.semesterD
        this.beforWeekA = res.data.weekA
        this.beforWeekB = res.data.weekB
        this.beforWeekC = res.data.weekC
        this.beforWeekD = res.data.weekD
        this.xAxisData43 = res.data.classList
        this.seriesData43 = [
          {
            name: '等级A',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['A'],
            barWidth: 20,
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['B'],
            barWidth: 20,
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['C'],
            barWidth: 20,
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['D'],
            barWidth: 20,
          },
          {
            name: '等级A',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['A'],
            barWidth: 20,
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['B'],
            barWidth: 20,
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['C'],
            barWidth: 20,
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['D'],
            barWidth: 20,
          },
        ]
      })
      reportClass(this.screenMessage).then((res) => {
        this.xAxisData41_2 = res.data.list
        this.seriesData41_2 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.data1,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.data2,
            barWidth: 10,
          },
        ]
        this.thisWeekReportClass = res.data.total2
        this.thisSemesterReportClass = res.data.total1
      })
      reportClassCompletion(this.screenMessage).then((res) => {
        this.xAxisData42_2 = res.data.listClass
        this.seriesData42_2 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.list1,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.list2,
            barWidth: 10,
          },
        ]
        this.expect2 = res.data.expect
        this.practical2 = res.data.practical
        this.weekexpect2 = res.data.weekexpect
        this.weekpractical2 = res.data.weekpractical
        this.weeklv3 = res.data.weeklv
        this.semesterlv3 = res.data.semesterlv
      })
      reportClassback(this.screenMessage).then((res) => {
        this.reportsemesterA = res.data.semesterA
        this.reportsemesterB = res.data.semesterB
        this.reportsemesterC = res.data.semesterC
        this.reportsemesterD = res.data.semesterD
        this.reportWeekA = res.data.weekA
        this.reportWeekB = res.data.weekB
        this.reportWeekC = res.data.weekC
        this.reportWeekD = res.data.weekD
        this.xAxisData43_2 = res.data.classList
        this.seriesData43_2 = [
          {
            name: '等级A',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['A'],
            barWidth: 20,
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['B'],
            barWidth: 20,
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['C'],
            barWidth: 20,
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['D'],
            barWidth: 20,
          },
          {
            name: '等级A',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['A'],
            barWidth: 20,
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['B'],
            barWidth: 20,
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['C'],
            barWidth: 20,
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['D'],
            barWidth: 20,
          },
        ]
      })
      afterClass(this.screenMessage).then((res) => {
        this.xAxisData41_3 = res.data.list
        this.seriesData41_3 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.data1,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.data2,
            barWidth: 10,
          },
        ]
        this.thisWeekAfterClass = res.data.total2
        this.thisSemesterAfterClass = res.data.total1
      })
      afterClassCompletion(this.screenMessage).then((res) => {
        this.xAxisData42_3 = res.data.listClass
        this.seriesData42_3 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.list1,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.list2,
            barWidth: 10,
          },
        ]
        this.expect3 = res.data.expect
        this.practical3 = res.data.practical
        this.weekexpect3 = res.data.weekexpect
        this.weekpractical3 = res.data.weekpractical
        this.weeklv4 = res.data.weeklv
        this.semesterlv4 = res.data.semesterlv
      })
      afterClassback(this.screenMessage).then((res) => {
        this.aftersemesterA = res.data.semesterA
        this.aftersemesterB = res.data.semesterB
        this.aftersemesterC = res.data.semesterC
        this.aftersemesterD = res.data.semesterD
        this.afterWeekA = res.data.weekA
        this.afterWeekB = res.data.weekB
        this.afterWeekC = res.data.weekC
        this.afterWeekD = res.data.weekD
        this.xAxisData43_3 = res.data.classList
        this.seriesData43_3 = [
          {
            name: '等级A',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['A'],
            barWidth: 20,
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['B'],
            barWidth: 20,
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['C'],
            barWidth: 20,
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester['D'],
            barWidth: 20,
          },
          {
            name: '等级A',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['A'],
            barWidth: 20,
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['B'],
            barWidth: 20,
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['C'],
            barWidth: 20,
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week['D'],
            barWidth: 20,
          },
        ]
      })
      reportClassPic(this.screenMessage).then((res) => {
        this.xAxisData51 = res.data.list
        this.seriesData51 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.data1,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.data2,
            barWidth: 10,
          },
        ]
        this.thisWeekReportClassPic = res.data.total2
        this.thisSemesterReportClassPic = res.data.total1
      })
      reportClassCompletionPic(this.screenMessage).then((res) => {
        this.xAxisData52 = res.data.list
        this.seriesData52 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.list2,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.list1,
            barWidth: 10,
          },
        ]
        this.totalSemester = res.data.totalSemester
        this.classSemester = res.data.classSemester
        this.semesterlv = res.data.semesterlv
        this.totalWeek = res.data.totalWeek
        this.classWeek = res.data.classWeek
        this.weeklv = res.data.weeklv
      })
      reportClassBackPic(this.screenMessage).then((res) => {
        this.xAxisData53 = res.data.classList
        this.seriesData53 = [
          {
            name: '五星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.five,
            barWidth: 20,
          },
          {
            name: '四星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.four,
            barWidth: 20,
          },
          {
            name: '三星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.three,
            barWidth: 20,
          },
          {
            name: '二星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.two,
            barWidth: 20,
          },
          {
            name: '一星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.one,
            barWidth: 20,
          },
          {
            name: '五星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.five,
            barWidth: 20,
          },
          {
            name: '四星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.four,
            barWidth: 20,
          },
          {
            name: '三星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.three,
            barWidth: 20,
          },
          {
            name: '二星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.two,
            barWidth: 20,
          },
          {
            name: '一星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.one,
            barWidth: 20,
          },
        ]
        this.semesterOne = res.data.semesterOne
        this.semesterTwo = res.data.semesterTwo
        this.semesterThree = res.data.semesterThree
        this.semesterFour = res.data.semesterFour
        this.semesterFive = res.data.semesterFive
        this.weekOne = res.data.weekOne
        this.weekTwo = res.data.weekTwo
        this.weekThree = res.data.weekThree
        this.weekFour = res.data.weekFour
        this.weekFive = res.data.weekFive
      })
      commentsReceived(this.screenMessage).then((res) => {
        this.seriesData41_4 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.semester,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.week,
            barWidth: 10,
          },
        ]
        this.xAxisData41_4 = res.data.classList
        this.WeekComments = res.data.totalweek
        this.SemesterComments = res.data.totalsemester
      })
      commentsReceivedAvg(this.screenMessage).then((res) => {
        this.xAxisData42_4 = res.data.classList
        this.seriesData42_4 = [
          {
            name: '本学期',
            type: 'bar',
            data: res.data.semester,
            barWidth: 10,
          },
          {
            name: '第' + this.weeknow + '周',
            type: 'bar',
            data: res.data.week,
            barWidth: 10,
          },
        ]
        this.totalWeek2 = res.data.totalweek
        this.totalSemester2 = res.data.totalsemester
        this.weekclass = res.data.weekclass
        this.semesterclass = res.data.semesterclass
        this.weekRate = res.data.weekRate
        this.semesterRate = res.data.semesterRate
      })
      commentsReceivedAll(this.screenMessage).then((res) => {
        this.xAxisData83 = res.data.classList
        this.seriesData83 = [
          {
            name: '五星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.five,
            barWidth: 20,
          },
          {
            name: '四星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.four,
            barWidth: 20,
          },
          {
            name: '三星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.three,
            barWidth: 20,
          },
          {
            name: '二星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.two,
            barWidth: 20,
          },
          {
            name: '一星',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.semester.one,
            barWidth: 20,
          },
          {
            name: '五星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.five,
            barWidth: 20,
          },
          {
            name: '四星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.four,
            barWidth: 20,
          },
          {
            name: '三星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.three,
            barWidth: 20,
          },
          {
            name: '二星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.two,
            barWidth: 20,
          },
          {
            name: '一星',
            type: 'bar',
            stack: 'Select',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: res.data.week.one,
            barWidth: 20,
          },
        ]
        this.semesterOne2 = res.data.semesterOne
        this.semesterTwo2 = res.data.semesterTwo
        this.semesterThree2 = res.data.semesterThree
        this.semesterFour2 = res.data.semesterFour
        this.semesterFive2 = res.data.semesterFive
        this.weekOne2 = res.data.semesterOne
        this.weekTwo2 = res.data.weekTwo
        this.weekThree2 = res.data.weekThree
        this.weekFour2 = res.data.weekFour
        this.weekFive2 = res.data.weekFive
      })
      teacherStatus(this.screenMessage).then((res) => {
        this.teacherStatusList = res.data
      })
      teacherClassList(this.screenMessage).then((res) => {
        this.teacherClassList = res.data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.content-box {
  display: flex;
  margin-bottom: 20px;
  .content {
    border: 1px solid #c9c7c7;
    width: 30%;
    margin: 0 30px 0 0;
    .title-box {
      width: 100%;
      display: flex;
      align-items: center;
      background: #e6f6fe;
      height: 80px;
      img {
        width: 60px;
        height: 60px;
        margin: 0 10px;
      }
      & > div {
        width: 100%;
        margin-left: 10px;
        line-height: 30px;
        text-align: left;
        font-size: 18px;
        & > p:nth-of-type(1) {
          color: #848484;
          span {
            margin-left: 10px;
            color: #000;
          }
        }
        & > p:nth-of-type(2) {
          .margin-l {
            margin-left: 20px;
          }
          span {
            margin-right: 20px;
          }
        }
        & > ul {
          width: 98%;
          margin: 0 1%;
          display: flex;
          li {
            min-width: 20%;
          }
        }
      }
    }
    .chart-box {
      width: 100%;
      p {
        color: #848484;
      }
      .top-text {
        display: flex;
        & > div {
          flex: 1;
          margin: 10px;
          .black {
            font-size: 14px;
            color: #000;
          }
        }
      }
      .left {
        margin: 10px 0 0 8px;
      }
      .data-box {
        text-align: left;
        & > div {
          display: inline-block;
          margin: 6px 20px 10px 12px;
          & > p:nth-of-type(2) {
            line-height: 40px;
            font-size: 18px;
            color: #000;
          }
        }
      }
      .pie-box {
        display: inline-block;
        width: 50%;
      }
    }
    .text-box {
      padding: 0 0 0 10px;
      text-align: left;
      font-size: 18px;
      line-height: 50px;
      max-height: 240px;
      overflow-y: scroll;
      & > p:nth-of-type(1) {
        color: #848484;
        font-size: 24px;
      }
      & > p:nth-of-type(2) {
        color: #848484;
      }
      & > ul {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        width: 98%;
        margin: 0 1%;
        display: flex;
        border-bottom: 1px solid #c9c7c7;
        li {
          min-width: 20%;
        }
        li:nth-of-type(3) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        li:nth-of-type(4) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .content-l {
    // width: 63%;
    width: 94%;
    p {
      padding: 6px;
      text-align: left;
      font-size: 18px;
      font-weight: 700;
      width: 99%;
      border-bottom: 1px solid #c9c7c7;
    }
    table {
      width: 98%;
      margin: 0 1% 10px;
      line-height: 40px;
      thead {
        tr {
          margin-right: 10px; // 10为内容滚动条的宽度
          display: flex;
          color: #848484;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(1) {
            flex: 0.4;
          }
          td:nth-of-type(5) {
            flex: 1.2;
          }
          td:nth-of-type(6) {
            flex: 1.2;
          }
          td:nth-of-type(8) {
            flex: 1.2;
          }
        }
      }
      tbody {
        display: block;
        height: 400px;
        overflow-y: scroll;
        tr {
          display: flex;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(1) {
            flex: 0.4;
          }
          td:nth-of-type(3) {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          td:nth-of-type(5) {
            flex: 1.2;
          }
          td:nth-of-type(6) {
            flex: 1.2;
          }
          td:nth-of-type(8) {
            flex: 1.2;
          }
        }
      }
    }
  }
  .content-l-b {
    // width: 63%;
    width: 94%;
    & > p {
      padding: 6px;
      text-align: left;
      font-size: 18px;
      font-weight: 700;
      width: 99%;
      border-bottom: 1px solid #c9c7c7;
    }
    table {
      width: 98%;
      margin: 0 1% 10px;
      thead {
        tr {
          margin-right: 10px; // 10为内容滚动条的宽度
          height: 40px;
          line-height: 40px;
          display: flex;
          color: #848484;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(1) {
            flex: 0.6;
          }
          td:nth-of-type(2) {
            flex: 1.2;
          }
          td:nth-of-type(3) {
            flex: 1.8;
          }
          td:nth-of-type(4) {
            flex: 1.5;
          }
          td:nth-of-type(6) {
            flex: 1.5;
          }
          td:nth-of-type(7) {
            flex: 1.5;
          }
          td:nth-of-type(9) {
            flex: 1.5;
          }
        }
      }
      tbody {
        display: block;
        height: 350px;
        overflow-y: scroll;
        tr {
          height: 40px;
          line-height: 40px;
          display: flex;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(1) {
            flex: 0.6;
          }
          td:nth-of-type(2) {
            flex: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          td:nth-of-type(3) {
            flex: 1.8;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          td:nth-of-type(4) {
            flex: 1.5;
          }
          td:nth-of-type(6) {
            flex: 1.5;
          }
          td:nth-of-type(7) {
            flex: 1.5;
          }
          td:nth-of-type(9) {
            flex: 1.5;
          }
        }
      }
    }
  }
  .content-r {
    display: flex;
    flex-direction: column;
    border: none;
    .box {
      border: 1px solid #c9c7c7;
      display: flex;
      width: 100%;
      height: 100px;
      margin-top: 10px;
      & > div {
        flex: 1;
        margin-top: 10px;
        p {
          color: #848484;
          line-height: 24px;
          & > img {
            margin: 0 4px -5px 0;
          }
        }
        p:nth-of-type(1) {
          margin-left: 30px;
          text-align: left;
        }
        p:nth-of-type(2) {
          font-size: 18px;
          line-height: 40px;
          color: #000;
        }
      }
    }
    .box:nth-of-type(1) {
      margin-top: 0;
    }
  }
  .class-num {
    height: 240px;
    .chart-box {
      width: 100%;
      p {
        color: #848484;
      }
    }
  }
  .class-num:nth-of-type(2) {
    width: 61.8%;
  }

  .left {
    text-align: left;
  }
  .red {
    color: red !important;
  }
  .green {
    color: green !important;
  }
  .increment {
    margin: 0 6px;
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid green;
  }
  .decrement {
    margin: 0 6px;
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid red;
    border-bottom: 0;
  }
}
</style>
