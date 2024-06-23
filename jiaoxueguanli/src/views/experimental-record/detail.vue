<template>
  <div class="box-detail">
    <div class="detail" v-show="!reportShow && !evaluationShow">
      <header>
        <span class="header_title">{{ '' }}开课全过程记录详情</span>
        <!-- <span class="share">分享</span> -->
      </header>
      <div class="module">
        <p class="title">基础信息</p>
        <div class="message-box">
          <div class="row">
            <div class="item">
              <span>实验名称:</span><span>{{ clickItem.exp_name.join(',') }}</span>
            </div>
            <div class="img-box">
              <img src="@images/experimentalRecord/book-type.png" alt="" />
              {{ ['', '预约', '排课', '登记'][clickItem.book_type] }}
            </div>
          </div>
          <div class="row">
            <div class="item">
              <span>学科:</span><span>{{ clickItem.subject }}</span>
            </div>
            <div class="item">
              <span>学段:</span
              ><span>{{ requestOneData.exp && requestOneData.exp[0].time_ids }}</span>
            </div>
            <div class="item">
              <span>年级:</span
              ><span>{{ $store.state.gradeArr[clickItem.grade[0]] || '' }}</span>
            </div>
            <div class="item">
              <span>班级:</span><span>{{ computedClassName(clickItem) }}</span>
            </div>
            <div class="item">
              <span>授课教师:</span><span>{{ computedTeacherName(clickItem) }}</span>
            </div>
            <div class="item">
              <span>实验员:</span><span>{{ clickItem.experimenter || '无' }}</span>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <span>实验类型：</span
              ><span>{{ $store.state.groupTypeList[clickItem.type - 1] || '' }}</span>
            </div>
            <div class="item">
              <span>分组数：</span><span>{{ clickItem.number_instruments }}</span>
            </div>
            <div class="item">
              <span>上课地点：</span
              ><span>{{ clickItem.laboratory_name || '教室' }}</span>
            </div>
            <div class="item">
              <span>实验时间:</span>
              <span>
                第{{ clickItem.week_time }}周/{{ clickItem.weekend }}/第{{
                  clickItem.section
                }}节课{{
                  clickItem.start ? '(' + clickItem.start.split(' ')[0] + ')' : ''
                }}
              </span>
            </div>
          </div>

          <div class="table-box">
            <el-table :data="insDetail.list" style="width: 100%" max-height="540">
              <el-table-column type="index" label="序号" align="left" width="60" />
              <el-table-column prop="material_number" label="仪器编号" width="200" />
              <el-table-column prop="name" label="仪器名称" width="240" />
              <el-table-column prop="specification" label="仪器规格" min-width="280" />
              <el-table-column prop="num" label="仪器数量" width="140" />
            </el-table>
            <div class="others">
              {{ clickItem.tips || '无' }}
            </div>
          </div>
        </div>
      </div>

      <div class="module">
        <div class="tab">
          <div
            class="item"
            v-for="(item, index) in tabList"
            :class="{ active: index === activeIndex }"
            :key="index"
            @click="changeIndex(index)"
          >
            <img :src="index === activeIndex ? item.iconActive : item.icon" alt="" />
            {{ item.title }}
          </div>
        </div>
        <div v-if="activeIndex === 0" class="details">
          <div class="content experiment-procedure">
            <!-- <ItemTitle title-text="自动采集画面" /> -->
            <div class="medias-title">自动采集画面</div>
            <div class="medias">
              <div class="none-data" v-if="JSON.stringify(mediaObj) === '{}'">
                该实验室没有绑定摄像头
              </div>
              <template v-else>
                <div
                  class="none-data"
                  v-if="
                    mediaObj.picture &&
                    mediaObj.video &&
                    mediaObj.picture.length === 0 &&
                    mediaObj.video.length === 0
                  "
                >
                  暂无采集画面
                </div>
                <div class="media-box">
                  <el-image
                    v-for="(p, pi) in mediaObj.picture"
                    :src="p"
                    :preview-src-list="mediaObj.picture"
                    :initial-index="pi"
                    :key="pi"
                  />
                  <!-- <img v-for="(p,pi) in mediaObj.pic" :key="pi" :src="p.media_url" alt=""> -->
                </div>
                <div class="media-box">
                  <video-flv
                    class="video-box"
                    v-for="(v, vi) in mediaObj.video"
                    :key="vi"
                    :msg="v.media_url"
                  />
                </div>
              </template>
            </div>
          </div>
          <div class="content experiment-procedure">
            <div class="medias-title">教师拍摄画面</div>
            <div class="medias">
              <!-- <ItemTitle title-text="教师拍摄画面" /> -->
              <div v-for="(item1, index1) in evaluationStudentList" :key="index1">
                <!-- <div class="exp-name">
                  {{ item1.exp_name }}
                </div> -->
                <div class="title-box">
                  <ItemTitle :title-text="item1.exp_name" />
                  <el-select
                    v-model="filterExp[index1].group_id"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in optionsGroup"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="filterExp[index1].type_id"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in optionsType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div
                  v-for="(item, index) in item1.data.filter(
                    (e) =>
                      filterExp[index1].group_id === '' ||
                      e.group_id === filterExp[index1].group_id
                  )"
                  :key="index"
                >
                  <div class="grouping">
                    <div
                      class="grouping-item"
                      v-for="(item1, index1) in item.children.filter(
                        (e) =>
                          filterExp[index1].type_id === '' ||
                          e.type_id === filterExp[index1].type_id
                      )"
                      :key="index1"
                    >
                      <div class="row">
                        <div class="min-w">
                          {{ item.group_id ? '分组' + item.group_id : '全部' }}
                        </div>
                        <div class="min-w">{{ evaluationType[item1.type_id] }}</div>
                        <div class="min-w">
                          <el-rate
                            v-model="item1.star"
                            disabled
                            :colors="['#05C65D', '#05C65D', '#05C65D']"
                          />
                        </div>
                      </div>
                      <div class="row">
                        <!-- <img v-show="item2" :src="item2" alt="" v-for="(item2, index2) in item1.url" :key="index2"> -->
                        <el-image
                          v-for="(item2, index2) in item1.url"
                          :key="index2"
                          :src="item2"
                          :preview-src-list="item1.url"
                        />
                        <video
                          v-for="(item2, index2) in item1.urlVideo"
                          :key="index2"
                          :src="item2"
                          controls="controls"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="item1.data.length === 0" class="none-data">暂无过程记录</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeIndex === 1" class="details">
          <div class="content">
            <div>
              <ItemTitle title-text="收到的评价" />
              <div class="evaLute-box">
                <div
                  class="evaluate"
                  v-for="(item, index) in evaluationmeList.filter((e) => e.type !== 3)"
                  :key="index"
                  @click="clickEva(item, 2)"
                >
                  <div class="evaluate_line">
                    <p>
                      <span>实验名称:</span>
                      <img src="@images/experimentalRecord/green.png" alt="" />
                      <span>{{ item.goclass ? item.goclass.expname : '' }}</span>
                    </p>
                    <p>
                      <span>评价时间:</span>
                      <span class="has-width">{{ item.create_time }}</span>
                    </p>
                  </div>
                  <div class="evaluate_line">
                    <p>
                      <span>班级:</span>
                      <span>{{ item.goclass ? item.goclass.className : '' }}</span>
                      <span>
                        {{
                          `( 第${item.goclass.week_time}周,
                        ${$store.state.weekArr[item.goclass.weekend]},
                        ${$store.state.sectionArr[item.goclass.section]}
                        ${
                          item.goclass.start_time
                            ? item.goclass.start_time.split(' ')[0]
                            : ''
                        } )`
                        }}
                      </span>
                    </p>
                    <p>
                      <span>评课人:</span>
                      <span>{{ item.username }}</span>
                    </p>
                    <p>
                      <span>评价:</span>
                      <el-rate
                        v-model="item.start"
                        disabled
                        :colors="['#05C65D', '#05C65D', '#05C65D']"
                      />
                    </p>
                  </div>
                  <div class="evaluate_line">
                    <p>
                      <span>评语:</span><span>{{ item.content }}</span>
                    </p>
                  </div>
                  <div class="tip">
                    {{
                      ['', '实验课自评', '教研组长评价', '教师评价实验员', '教师互评'][
                        item.type
                      ] || ''
                    }}
                  </div>
                </div>
                <!-- <p v-if="evaluationmeList.length === 0" style="margin: 16px 0 16px 40px;text-align:left">暂无评价</p>
              <div class="evaluate" :class="{haveBgColor: index < 0}" v-for="(item, index) in evaluationmeList" :key="index">
                <div class="evaluate_top">
                  <span>实验名称:</span><img v-show="false" src="@images/experimentalRecord/orange.png" alt="">
                  <img v-show="true" src="@images/experimentalRecord/green.png" alt="">
                  <span>{{ item.goclass.expname }}</span>
                  <span/><span/>
                  <span class="transform_span">评价时间:&#160;&#160;&#160;{{item.create_time}}</span>
                </div>
                <div class="evaluate_center">
                  <span>班级:</span><span>{{ item.goclass.className }}</span>
                  <span>评课人:</span><span>{{ item.username }}</span>
                  <span>评价:</span>
                  <div class="evaluate_star">
                    <el-rate
                      v-model="item.start"
                      disabled
                      :colors="['#05C65D','#05C65D','#05C65D']"/>
                  </div>
                </div>
                <div class="evaluate_bottom">
                  <span>评语:</span><p>{{ item.content }}</p>
                </div>
              </div> -->
              </div>
              <div class="none-data" v-if="evaluationmeList.length === 0">
                暂未收到他人的评价
              </div>
            </div>
            <ItemTitle title-text="我的评价" />
            <div class="evaLute-box">
              <!-- <div class="evaluate" v-if="myevaluationList.length===0">
              <p class="value-none">暂未评价</p>
            </div> -->
              <div class="none-data" v-if="myevaluationList.length === 0">暂未评价</div>
              <div
                v-for="(item, index) in myevaluationList"
                class="evaluate"
                :key="index"
                @click="clickEva(item, 1)"
              >
                <!-- <div v-show="item.Evaluation.length === 0" class="evaluate">
                <div class="evaluate_line">
                  <p>
                    <span>实验名称:</span>
                    <img src="@images/experimentalRecord/orange.png" alt="">
                    <span>
                      {{ item?item.expname:'' }}
                      (待评价)
                    </span>
                  </p>
                </div>
                <div class="evaluate_line">
                  <p>
                    <span>班级:</span>
                    <span>{{ item.classname }}</span>&nbsp;
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
              </div> -->
                <div class="evaluate_line">
                  <p>
                    <span>实验名称:</span>
                    <img src="@images/experimentalRecord/green.png" alt="" />
                    <span>{{ item.goclass.expname }}</span>
                  </p>
                  <p>
                    <span>评价时间:</span>
                    <span class="has-width">{{ item.create_time }}</span>
                  </p>
                </div>
                <div class="evaluate_line">
                  <p>
                    <span>班级:</span>
                    <span>{{ item.goclass.className }}</span>
                  </p>
                  <p>
                    <span>被评人:</span>
                    <span>{{ item.appraiser.username }}</span>
                  </p>
                  <p>
                    <span>评价:</span>
                    <el-rate
                      v-model="item.start"
                      disabled
                      :colors="['#05C65D', '#05C65D', '#05C65D']"
                    />
                  </p>
                </div>
                <div class="evaluate_line">
                  <p>
                    <span>评语:</span>
                    <span>{{ item.content }}</span>
                  </p>
                </div>
                <div class="tip">
                  {{
                    ['', '实验课自评', '教研组长评价', '教师评价实验员', '教师互评'][
                      item.type
                    ] || ''
                  }}
                </div>
              </div>
              <!-- <div class="evaluate" :class="{haveBgColor: index < 0}" v-for="(item, index) in myevaluationList" :key="(index+1)*2"  >
              <div class="evaluate_top">
                <span>实验名称:</span><img v-show="false" src="@images/experimentalRecord/orange.png" alt="">
                <img v-show="true" src="@images/experimentalRecord/green.png" alt="">
                <span>{{ item.goclass.expname }}</span>
                <span/><span/>
                <span class="transform_span">评价时间:&#160;&#160;&#160;{{item.create_time}}</span>
              </div>
              <div class="evaluate_center">
                <span>班级:</span><span>{{ item.goclass.className }}</span>
                <span>被评人:</span><span>{{ item.appraiser.username }}</span>
                <span>评价:</span>
                <div class="evaluate_star">
                  <el-rate
                    v-model="item.start"
                    disabled
                    :colors="['#05C65D','#05C65D','#05C65D']"/>
                </div>
              </div>
              <div class="evaluate_bottom">
                <span>评语:</span><p>{{ item.content }}</p>
              </div>
            </div> -->
            </div>
          </div>
        </div>
        <div v-if="activeIndex === 2" class="details">
          <div class="content tl">
            <div v-for="(m, n) in v12List" :key="n">
              <ItemTitle :title-text="m.v12_exp_name" />
              <div class="img-box" v-for="(mm, nn) in m.picture_urls" :key="nn">
                <el-image
                  :src="mm.picture_url"
                  :preview-src-list="m.picture_urls.map((e) => e.picture_url)"
                  :initial-index="nn"
                />
                <div class="group">{{ mm.group_n ? '分组' + mm.group_n : '' }}</div>
              </div>
            </div>
            <!-- <ItemTitle title-text="1111" /> -->
            <div class="none-data" v-if="v12List.length === 0">暂无数据</div>
          </div>
        </div>
        <div v-if="activeIndex === 3" class="details">
          <div class="content">
            <div v-for="(item, index) in reportList" :key="index">
              <ItemTitle :title-text="item.expName" />
              <div class="report-list">
                <div class="item" v-for="(m, n) in item.data" :key="n">
                  <div>分组{{ m.group_id }}</div>
                  <div>{{ m.group_studentname || '无' }}</div>
                  <div>{{ m.level || ' 暂未评定' }}</div>
                  <div @click="gotoReport(item, m)">详情</div>
                </div>
                <div class="none-data" v-if="item.data.length === 0">暂无数据</div>
              </div>
            </div>
            <div class="none-data" v-if="reportList.length === 0">暂无数据</div>
          </div>
        </div>
        <div v-if="activeIndex === 4" class="details">
          <div class="content">
            <div class="shows">
              <div class="medias-title">演示实验数据</div>
              <div class="medias">
                <div v-for="(m, n) in teacherMedias.exp_res" :key="n" class="media-box">
                  <el-image
                    :src="m.picture_url"
                    :preview-src-list="teacherMedias.exp_res.map((e) => e.picture_url)"
                    :initial-index="n"
                  />
                  <!-- <img v-for="(p,pi) in mediaObj.pic" :key="pi" :src="p.media_url" alt=""> -->
                </div>
                <div
                  class="none-data"
                  v-if="!teacherMedias.exp_res || teacherMedias.exp_res.length === 0"
                >
                  无数据，可能是实验时未提交数字化实验数据
                </div>
              </div>
            </div>
            <div class="shows">
              <div class="medias-title">演示画面视频</div>
              <div class="medias">
                <div v-for="(m, n) in teacherMedias.video_res" :key="n" class="media-box">
                  <video
                    :src="m.video_url"
                    controls
                    :poster="m.video_url + '?x-oss-process=video/snapshot,t_50,f_jpg'"
                  ></video>
                </div>
                <div
                  class="none-data"
                  v-if="!teacherMedias.video_res || teacherMedias.video_res.length === 0"
                >
                  无数据，可能是实验时未保存视频相关画面～
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeIndex === 5" class="details">
          <div class="content">
            <div class="up-item">
              <ul>
                <li v-for="(item, index) in files" :key="index">
                  <img :src="fileIcon(item.name)" alt="" />
                  {{ item.name }}
                  <a
                    :href="
                      item
                        ? item.name.slice(item.name.length - 4) === '.pdf'
                          ? item.url
                          : 'https://view.officeapps.live.com/op/view.aspx?src=' +
                            item.url
                        : ''
                    "
                    target="blank"
                    >在线预览</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <report-detail
      v-if="reportShow"
      :item="reportItem"
      :expbookid="clickItem.id"
      @back="reportBack"
    ></report-detail>
    <evaluation-vue
      v-if="evaluationShow"
      :type="evaluationTypeProps"
      :courseMessage="evaluationItem"
      :isDetail="true"
      @back="evaluationBack"
    >
    </evaluation-vue>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import {
  findappendexp,
  ExpEvaluationStudent,
  getOne,
  // getReportOne,
  // getAfterOne,
  getInsDetail,
  getVideo,
  getstudentgroup,
  selectTeachV12Exp,
  selectTeachExpBookVideos,
} from '@/network/experimentRecord'

import ItemTitle from '@components/ItemTitle'
import ReportDetail from './components/report-detail.vue'
import VideoFlv from '@/components/video-flv.vue'
import EvaluationVue from '../experiment-evaluation/evaluation.vue'
import mixinsFormatter from '@/mixins/formatter'

export default {
  mixins: [mixinsFormatter],
  name: '',
  components: {
    ItemTitle,
    ReportDetail,
    VideoFlv,
    EvaluationVue,
  },
  props: {
    clickItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentPage: 1,
      evaluationType: [
        '',
        '仪器准备',
        '仪器搭建',
        '数据测量',
        '数据处理',
        '仪器整理',
        '其他',
      ],
      evaluationShow: false,
      evaluationItem: {},
      evaluationTypeProps: 1,

      showFlagScore: '',
      showFlagRequest: '',
      detailShow: -1,
      seriesData1: [],
      seriesData2: [],
      seriesData3: [],
      pageNumList: [],
      maxPageNum: [],
      pageLength: 0,
      showTipValue: -1,
      optionsGrade: [
        {
          value: 7,
          label: '七年级',
        },
        {
          value: 8,
          label: '八年级',
        },
        {
          value: 9,
          label: '九年级',
        },
      ],
      valueGrade: null,
      optionsClass: this.$store.state.classList,
      valueClass: '',
      optionsTeacher: [
        {
          value: '8',
          label: '黄老师',
        },
        {
          value: '1',
          label: '李老师',
        },
      ],
      trtdList: [],
      valueTeacher: '',
      valueWeek: [],
      optionsWeek: [],
      optionsSubject: [
        {
          value: '7',
          label: '化学',
        },
        {
          value: '8',
          label: '物理',
        },
        {
          value: '9',
          label: '生物',
        },
      ],
      valueSubject: '',
      valueGradeShare: '',
      students: [
        {
          name: '小红',
          grade: 7,
          class: 1,
          lev: 'A',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [
            require('@images/experimentalRecord/test.png'),
            require('@images/experimentalRecord/test.png'),
          ],
        },
      ],
      feedback: [
        {
          name: '小红',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
      ],
      questionList: [
        {
          question: '原线圈接入恒定电压，副线圈会有电压输出1。',
          number: 10,
        },
        {
          question: '原线圈接入恒定电1。',
          number: 100,
        },
        {
          question:
            '原线圈接入恒定电压，副线圈会有电压输出1原线圈接入恒定电压，副线圈会有电压输出1原线圈接入恒定电压，副线圈会有电压输出1。',
          number: 10,
        },
      ],
      gradeNow: 7,
      requestData: [],
      gradeList: [
        {
          grade: 7,
          name: '七年级',
        },
        {
          grade: 8,
          name: '八年级',
        },
        {
          grade: 9,
          name: '九年级',
        },
      ],
      classList: [
        {
          name: '1班',
          check: true,
        },
        {
          name: '2班',
          check: true,
        },
        {
          name: '3班',
          check: true,
        },
        {
          name: '4班',
          check: false,
        },
        {
          name: '5班',
          check: true,
        },
        {
          name: '6班',
          check: false,
        },
      ],
      evaluationStudentList: [],
      mediaObj: {},
      insDetail: {},
      myevaluationList: [],
      evaluationmeList: [],
      mouseFlag: [],
      disableFlag: false,
      shareStatus: '',
      seachShow: false,
      showChildFlag2: -1,
      imgList: [],
      requestOneData: {},
      reportOneData: {},
      afterOneData: {},
      shareShow: -1,
      activeIndex: 0,
      tabList: [
        {
          title: '实验过程记录',
          icon: require('@/assets/images/menu/experimental-record.png'),
          iconActive: require('@/assets/images/menu/experimental-record-white.png'),
        },
        {
          title: '实验评价',
          icon: require('@/assets/images/menu/experimental-evaluation.png'),
          iconActive: require('@/assets/images/menu/experimental-evaluation-white.png'),
        },
        {
          title: '学生数字化实验',
          icon: require('@/assets/images/menu/v12.png'),
          iconActive: require('@/assets/images/menu/v12-white.png'),
        },
        {
          title: '学生线上报告',
          icon: require('@/assets/images/menu/experiment-plan.png'),
          iconActive: require('@/assets/images/menu/experiment-plan-white.png'),
        },
        {
          title: '教师操作演示',
          icon: require('@/assets/images/menu/instrument.png'),
          iconActive: require('@/assets/images/menu/instrument-white.png'),
        },
        // {
        //   title: '文件收集',
        //   icon: require('@/assets/images/menu/files.png'),
        //   iconActive: require('@/assets/images/menu/files-white.png'),
        // },
      ],
      reportList: [],
      v12List: [],
      teacherMedias: {},
      files: [],
      reportShow: false,
      reportItem: {},
      filterExp: [],
      optionsGroup: [],
      optionsType: [],
    }
  },
  created() {
    this.mouseFlag.length = this.classList.length
    // this.getRecordStatistical(1)
    this.optionsWeek = require('@/utils/optionsWeek.json')
    this.$store.state.classList.forEach((item) => {
      const obj = {
        value: item.grade_id,
        label: this.$store.state.gradeArr[item.grade_id],
      }
      let flag = false
      this.optionsGrade.forEach((i) => {
        if (i.value === item.grade_id) {
          flag = true
        }
      })
      if (!flag) {
        this.optionsGrade.push(obj)
      }
    })
    this.getData()
  },
  mounted() {},
  beforeDestroy() {},
  computed: {
    computedName() {
      const arr = []
      if (this.requestOneData.exp) {
        this.requestOneData.exp.forEach((e) => {
          arr.push(e.name)
        })
      }
      return arr.join(',')
    },
    fileIcon() {
      return function (name) {
        if (/\.(doc|docx)$/.test(name)) {
          return require('@images/common/word.png')
        }
        if (/\.(ppt|pptx)$/.test(name)) {
          return require('@images/common/ppt.png')
        }
        if (/\.(pdf)$/.test(name)) {
          return require('@images/common/pdf.png')
        }
        if (/\.(xls|xlsx)$/.test(name)) {
          return require('@images/common/excel.png')
        }
      }
    },
    scoreStage() {
      return function (val) {
        if (val === 0) {
          return '暂无'
        }
        if (val < 60) {
          return '一般'
        }
        if (val >= 60 && val <= 85) {
          return '良好'
        }
        if (val > 85) {
          return '优秀'
        }
      }
    },
    studentList() {
      return function (item, pageNum) {
        let arr = []
        arr = JSON.parse(JSON.stringify(item))
        const pages = Math.ceil(arr.length / 5)
        if (this.maxPageNum.length < this.requestData.length) {
          this.maxPageNum.push(pages)
        }
        const res = arr
        return res.slice(pageNum * 5, (pageNum + 1) * 5)
      }
    },
    isCheckAll() {
      let res = 0
      this.classList.map((item) => {
        if (!item.check) {
          res = 0
        } else {
          res = 1
        }
      })
      return res
    },
    rankList() {
      return function (item) {
        const ranfg = [
          {
            name: 'A',
            value: 0,
          },
          {
            name: 'B',
            value: 0,
          },
          {
            name: 'C',
            value: 0,
          },
          {
            name: 'D',
            value: 0,
          },
        ]
        if (item.length !== 0) {
          item.map((item) => {
            if (item.level === 'A') {
              ranfg.splice(0, 1, {
                name: 'A',
                value: item.Count ? item.Count : 0,
              })
            }
            if (item.level === 'B') {
              ranfg.splice(1, 1, {
                name: 'B',
                value: item.Count ? item.Count : 0,
              })
            }
            if (item.level === 'C') {
              ranfg.splice(2, 1, {
                name: 'C',
                value: item.Count ? item.Count : 0,
              })
            }
            if (item.level === 'D') {
              ranfg.splice(3, 1, {
                name: 'D',
                value: item.Count ? item.Count : 0,
              })
            }
          })
        }
        return ranfg
      }
    },
  },
  watch: {
    valueGrade(newVal) {
      this.valueClass = null
      this.optionsClass = this.$store.state.classList.filter((item) => {
        if (newVal !== '') {
          return item.grade_id === newVal
        } else {
          return true
        }
      })
    },
  },
  methods: {
    getData() {
      this.changeIndex(0)
      const data4 = {
        id: this.clickItem.id,
      }

      getInsDetail(data4).then((res) => {
        this.insDetail = res.data
      })
      getOne(data4).then((res) => {
        if (res.code === 10) {
          this.requestOneData = res.data
          this.drawPie1()
        }
      })
      // getReportOne(data4).then((res) => {
      //   if (res.code === 10) {
      //     this.reportOneData = res.data
      //     this.drawPie2()
      //   }
      // })
      // getAfterOne(data4).then((res) => {
      //   if (res.code === 10) {
      //     this.afterOneData = res.data
      //     this.drawPie3()
      //   }
      // })
    },

    changeIndex(index) {
      this.activeIndex = index
      let dom = document.getElementsByClassName('h_b')[0]

      if (dom) {
        dom.scrollTop = dom.scrollTop - 1
      }
      const data1 = {
        go_classid: this.clickItem.id,
        userid: this.clickItem.teacher_id,
      }
      if (this.activeIndex === 0) {
        // 学生实验过程
        const data3 = {
          go_classid: this.clickItem.id,
        }
        ExpEvaluationStudent(data3).then((res) => {
          this.evaluationStudentList = []
          this.optionsGroup = []
          this.optionsType = []
          this.filterExp = []
          if (res.code === 10) {
            res.data.forEach((expItem) => {
              this.filterExp.push({
                group_id: '',
                type_id: '',
              })
              const arr = []
              let index = 0
              expItem.data.forEach((item) => {
                index = arr.findIndex((arrItem) => {
                  return arrItem.group_id === item.group_id
                })
                // 分离图片视频
                const url = item.url ? item.url.split(',') : []
                console.log(
                  '🚀 ~ file: ExperimentalRecord.vue:1151 ~ expItem.data.forEach ~ url',
                  url
                )
                const fileList = []
                const fileListVideo = []
                url.forEach((e) => {
                  if (/\.(mp4|avi)$/.test(e)) {
                    fileListVideo.push(e)
                  } else if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(e)) {
                    fileList.push(e)
                  }
                })

                if (index === -1) {
                  const obj = {
                    evaluation_id: item.evaluation_id,
                    group_id: item.group_id,
                    id: item.id,
                    children: [
                      {
                        star: item.star,
                        type_id: item.type_id,
                        url: fileList,
                        urlVideo: fileListVideo,
                      },
                    ],
                  }
                  arr.push(obj)
                } else {
                  const clildrenObj = {
                    star: item.star,
                    type_id: item.type_id,
                    url: fileList,
                    urlVideo: fileListVideo,
                  }
                  arr[index].children.push(clildrenObj)
                }
                if (!this.optionsGroup.some((e) => e.value === item.group_id)) {
                  this.optionsGroup.push({
                    label: item.group_id ? '分组' + item.group_id : '全部',
                    value: item.group_id,
                  })
                }
                if (!this.optionsType.some((e) => e.value === item.type_id)) {
                  this.optionsType.push({
                    label: this.evaluationType[item.type_id],
                    value: item.type_id,
                  })
                }
              })

              this.evaluationStudentList.push({
                exp_id: expItem.exp_id,
                exp_name: expItem.exp_name,
                data: arr,
              })
            })
          }
        })
        const data4 = {
          id: this.clickItem.id,
        }
        getVideo(data4).then((res) => {
          if (res.code === 10) {
            if (res.data['video']) {
              this.mediaObj = {
                ...res.data,
                picture: res.data.pic
                  ? res.data.pic.map((e) => {
                      return e.media_url
                    })
                  : [],
              }
            } else {
              this.mediaObj = {}
            }
          }
        })
      } else if (this.activeIndex === 1) {
        // 我评价的
        findappendexp(data1).then((res) => {
          if (res.code === 10) {
            this.myevaluationList = res.data.filter((item) => {
              return item.type === 1
            })
          }
        })
        // 我收到的评价
        const data = {
          go_classid: this.clickItem.id,
          appraise_id: this.clickItem.teacher_id,
        }
        findappendexp(data).then((res) => {
          if (res.code === 10) {
            this.evaluationmeList = res.data.filter((item) => {
              return item.type === 4
            })
          }
        })
      } else if (this.activeIndex === 2) {
        selectTeachV12Exp({
          id: this.clickItem.id,
        }).then((res) => {
          this.v12List = res.data
        })
        console.log('v121')
      } else if (this.activeIndex === 3) {
        getstudentgroup({
          expbookid: this.clickItem.id,
        }).then((res) => {
          console.log('🚀 ~ file: detail.vue:962 ~ changeIndex ~ res:', res)
          this.reportList = res.data
        })
      } else if (this.activeIndex === 4) {
        selectTeachExpBookVideos({
          id: this.clickItem.id,
        }).then((res) => {
          console.log('🚀 ~ file: detail.vue:962 ~ changeIndex ~ res:', res)
          this.teacherMedias = res.data
        })
      } else if (this.activeIndex === 5) {
        console.log('文件收集')
      }
    },
    gotoReport(item, m) {
      this.reportItem = { exp_id: item.exp_id, ...m }
      this.reportShow = true
      this.$emit('changeBack', this.reportShow)
      console.log('🚀 ~ file: detail.vue:976 ~ gotoReport ~ item:', item)
    },
    reportBack() {
      this.reportShow = false
      this.$emit('changeBack', this.reportShow)
      this.changeIndex(3)
    },
    // handleSizeChange(val) {
    //   const data = {
    //     page: val,
    //     grade: this.valueGrade,
    //     class_id: this.valueClass,
    //     teacher_id: this.valueTeacher
    //     // teacher_id: this.$store.getters.getUserMsg.id
    //   }
    //   recordStatistical(data).then((res) => {
    //     this.trtdList = res.data.list
    //   })
    // },
    clickEva(item, type) {
      console.log('🚀 ~ file: detail.vue:1129 ~ clickEva ~ item:', item, type)
      // this.evaluationTypeProps = type
      // this.evaluationItem = {
      //   ...item,
      //   ...this.clickItem,
      //   // start: this.clickItem.start,
      //   expname: this.clickItem.exp_name.join(','),
      //   grade: this.clickItem.grade.join(','),
      //   id: item.go_classid,
      // }
      // this.evaluationShow = true
      // this.$emit('changeBack', this.evaluationShow)
    },
    evaluationBack() {
      this.evaluationShow = false
      this.$emit('changeBack', this.evaluationShow)
      this.changeIndex(1)
    },
    selectClick() {
      console.log('点击')
    },
    showTip(index) {
      if (index === this.showTipValue) {
        this.showTipValue = -1
      } else {
        this.showTipValue = index
      }
    },
    checkAll() {
      if (!this.disableFlag) {
        if (!this.isCheckAll) {
          this.classList.map((item) => {
            item.check = true
          })
        } else {
          this.classList.map((item) => {
            item.check = false
          })
        }
      }
      console.log('点击', this.isCheckAll)
    },
    imgSeach() {
      this.seachShow = true
      console.log('imgSeach')
    },
    refreshList(index) {
      console.log(`刷新${index}`, index)
    },
    changeMouseFlag() {
      // this.mouseFlag.splice(index, 1, data)
    },
    itemCheck(index) {
      if (!this.disableFlag) {
        this.classList[index].check = !this.classList[index].check
      }
    },
    changeDisabeFlag() {
      this.disableFlag = !this.disableFlag
    },
    imgShare(data) {
      this.shareStatus = ''
      this.shareShow = data
    },

    showChildImg2(data) {
      this.imgList = data
      this.showChildFlag2 = 1
    },
    changeShow(index) {
      if (index === '反馈详情') {
        if (index === this.showFlagRequest) {
          this.showFlagRequest = ''
        } else {
          this.showFlagRequest = index
        }
      }
      if (index === '得分情况') {
        if (index === this.showFlagScore) {
          this.showFlagScore = ''
        } else {
          this.showFlagScore = index
        }
      }
    },
    clickStatus(index) {
      // this.shareShow = 3
      if (index === '教师') {
        this.shareStatus = '教师'
        console.log('教师')
      } else if (index === '教研组长') {
        this.shareStatus = '教研组长'
        console.log('教研组长')
      } else {
        this.shareStatus = ''
      }
    },
    drawPie1() {
      this.seriesData1 = []
      this.requestOneData.exp.forEach((expItem) => {
        if (expItem.class_detail.length !== 0) {
          // 目前 item.class_detail是一个长度为1的数组，是否加forEach无影响
          expItem.class_detail.forEach((classItem) => {
            this.seriesData1.push([
              { value: (100 - classItem.people * 100).toFixed(1), name: '' },
              { value: 0.1, name: '空' },
              {
                value: (classItem.people * 100).toFixed(1),
                name: this.scoreStage(classItem.people * 100),
              },
              { value: 0.1, name: '空' },
            ])
          })
        } else {
          this.seriesData1.push([
            { value: 0, name: '' },
            { value: 0.1, name: '空' },
            { value: 100, name: '' },
            { value: 0.1, name: '空' },
          ])
        }
      })
    },
    drawPie2() {
      this.seriesData2 = []
      this.reportOneData.exp.forEach((expItem) => {
        // 目前 item.class_detail是一个长度为1的数组，是否加forEach无影响
        this.seriesData2.push([
          { value: (100 - expItem.class_detail.percent * 100).toFixed(1), name: '' },
          { value: 0.1, name: '空' },
          {
            value: (expItem.class_detail.percent * 100).toFixed(1),
            name: this.scoreStage(expItem.class_detail.percent * 100),
          },
          { value: 0.1, name: '空' },
        ])
      })
    },
    drawPie3() {
      this.seriesData3 = []
      this.afterOneData.exp.forEach((expItem) => {
        this.seriesData3.push([
          { value: (100 - expItem.class_detail.percent * 100).toFixed(1), name: '' },
          { value: 0.1, name: '空' },
          {
            value: (expItem.class_detail.percent * 100).toFixed(1),
            name: this.scoreStage(expItem.class_detail.percent * 100),
          },
          { value: 0.1, name: '空' },
        ])
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.box-detail {
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
    .header_title {
      width: 340px;
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
        position: relative;
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
        .img-box {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
          color: #1296db;
          img {
            width: 20px;
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
        .title-box {
          display: flex;
          align-items: center;
          ::v-deep .el-select {
            margin-left: 16px;
            width: 180px;
            // border-color: #dcdfe6 !important;

            .el-input__inner {
              border-color: #dcdfe6 !important;
              color: #606266 !important;
            }

            .el-input {
              width: 100% !important;

              .el-input__inner {
                width: 100% !important;
              }
            }
          }
        }
      }
      .media-box {
        margin-top: 10px;
        padding: 0 15px;
        // min-height: 40px;
        text-align: left;
        .video-box {
          display: inline-block;
          margin: 13px 12px;
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
        padding: 6px 10px;
        box-sizing: border-box;
        vertical-align: top;
        text-align: left;
        .media-box {
          display: inline-block;
          margin: 10px 0;
          width: calc(33.3% - 30px);
          height: 320px;
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
      margin: 16px 0;
      width: 100%;

      text-align: left;

      .grouping-item {
        .row {
          display: flex;
          align-content: center;
          flex-wrap: wrap;
          margin: 10px 0;
          font-size: 16px;
          .min-w {
            min-width: 100px;
          }
          ::v-deep .el-rate {
            height: auto;
            .el-rate__icon {
              font-size: 24px;
            }
          }
          .el-image,
          video {
            margin: 0 20px 6px 0;
            width: 200px;
            height: 128px;
            background: rgba(0, 0, 0, 0);
            border: 1px solid #05c65d;
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
  .body_msg {
    width: 100%;
    background-color: #fff;
    .grade_box {
      // float: left;
      position: relative;
      padding: 20px 0 0 2.5%;
      width: 70%;
      height: 136px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      & .grade-item {
        width: 21%;
        height: 120px;
        & :nth-child(1) {
          height: 50px;
          line-height: 50px;
          width: 100%;
          background-color: #dcece3;
          font-size: 16px;
          color: #333;
          font-weight: bold;
        }
        & :nth-child(2) {
          width: 100%;
          height: 70px;
          line-height: 70px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          color: #626572;
          font-size: 16px;
        }
      }
      & > .echartBox {
        position: absolute;
        top: 0;
        right: -210px;
        width: 154px;
        height: 154px;
        & > .echartDiv {
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
    }
  }
  .student_list {
    width: 100%;
    overflow: hidden;
    padding: 0 32px;
    box-sizing: border-box;
    // max-height: 600px;
    overflow-y: scroll;
    // display: flex;
    // justify-content: space-evenly;
    .student_score {
      margin: 20px 3% 10px 10px;
      float: left;
      width: 29%;
      background: #ffffff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.26);
      opacity: 1;
      .l_img {
        width: 36%;
        height: 220px;
        padding: 3% 2%;
        float: left;
        background: #dcece3;
        box-sizing: border-box;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .show_more {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
      }
      .r_text {
        width: 64%;
        height: 220px;
        padding: 0 8%;
        float: left;
        box-sizing: border-box;
        p {
          text-align: left;
          color: #626572;
          height: 20%;
          display: flex;
          align-items: center;
          span:nth-of-type(1) {
            margin: 0 20px;
            display: inline-block;
            width: 64px;
            height: 21px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 21px;
            color: #333333;
            opacity: 1;
          }
        }
      }
    }
  }
  .child_img_list {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(132, 132, 132, 0.51);
    z-index: 10;
    .close_icon {
      width: 60px;
      height: 60px;
      position: absolute;
      right: 7px;
      top: 25px;
      z-index: 30;
      cursor: pointer;
    }
    .el-carousel__item {
      background: rgba(132, 132, 132, 0);
      ::v-deep .el-carousel__mask {
        height: 0;
        background: rgba(0, 0, 0, 0);
      }
    }
    .el-carousel__item img {
      margin-top: 50px;
      // width: 586px;
      height: 100%;
    }
  }
  .table_box {
    margin-top: 30px;
    width: 100%;
    // max-height: 618px;
    overflow-y: scroll;
    padding: 0 64px 0 42px;
    box-sizing: border-box;
    table {
      width: 100%;
      .thead {
        width: 100%;
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        background-color: #dcece3;
        & td {
          color: #333;
          flex: 1;
          text-align: center;
        }
        & > :nth-last-child(1) {
          flex: 2;
        }
      }
      .tr {
        width: 100%;
        height: 80px;
        line-height: 80px;
        font-size: 16px;
        display: flex;
        color: #626572;
        background-color: #f3f3f3;
        & td {
          flex: 1;
          img {
            width: 100px;
            height: 70px;
            margin: 5px 10px 0 10px;
          }
        }
        & > :nth-last-child(1) {
          flex: 2;
        }
      }
      .table_bg {
        background-color: #ececec;
      }
    }
  }
  .left_span {
    margin: 20px 0 10px 50px;
    padding-left: 2%;
    display: inline-block;
    width: 40%;
    height: 21px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: #848484;
    opacity: 1;
    text-align: left;
    span:nth-of-type(1) {
      display: inline-block;
      width: 100px;
    }
    span:nth-of-type(2) {
      color: #333333;
    }
  }
  .right_span {
    margin: 10px 0 10px 30px;
    padding-left: 2%;
    display: inline-block;
    width: 40%;
    height: 21px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: #848484;
    opacity: 1;
    text-align: left;
    span:nth-of-type(1) {
      display: inline-block;
      width: 100px;
    }
    span:nth-of-type(2) {
      color: #333333;
    }
  }
  .footer_msg {
    height: 100px;
    line-height: 100px;
    background-color: #fff;
    user-select: none;
    border-bottom: #e8e8e9 5px solid;
    span {
      cursor: pointer;
      margin: 0 30px;
      color: #848484;
    }
  }
  .shareBoxStatus {
    color: #333333;
    background: #ffffff;
    width: 300px;
    height: 360px;
    margin: 180px auto;
    position: relative;
    // position: fixed;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%,-50%);
    & > p:nth-of-type(1) {
      position: absolute;
      top: 0;
      left: 0;
      width: 300px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      border-bottom: 1px solid #05c65d;
      box-sizing: border-box;
      img {
        position: absolute;
        top: 15px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }
    div {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 300px;
      height: 300px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;
      p {
        width: 184px;
        height: 78px;
        background: #f3f3f3;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        line-height: 78px;
        cursor: pointer;
      }
    }
  }
  .shareTable {
    color: #333333;
    background: #ffffff;
    width: 700px;
    height: 703px;
    margin: 10px auto;
    position: relative;
    & > p:nth-of-type(1) {
      position: absolute;
      top: 0;
      left: 0;
      width: 700px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      border-bottom: 1px solid #05c65d;
      box-sizing: border-box;
      img {
        position: absolute;
        top: 15px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }
    .share_content {
      position: absolute;
      top: 60px;
      left: 0;
      width: 700px;
      height: 643px;
      background: #ffffff;
      opacity: 1;
    }
    .el-select-box {
      position: absolute;
      top: 25px;
      left: 35px;
      width: 630px;
      height: 30px;
      display: flex;
      justify-content: space-between;
    }
    .selectInput {
      position: absolute;
      top: 75px;
      left: 35px;
      width: 300px;
      height: 30px;
      & input {
        padding: 0 12px 0 12px;
        width: 260px;
        height: 30px;
        box-sizing: border-box;
        transform: translate(0, -10px);
        border: 1px solid #c9c7c7;
        font-size: 14px;
      }
      div {
        display: inline-block;
        cursor: pointer;
        height: 30px;
        background-color: #05c65d;
        img {
          margin: 5px 10px;
          width: 20px;
          height: 20px;
          background: #05c65d;
          opacity: 1;
        }
      }
    }
    .change_disable {
      display: flex;
      align-items: center;
      position: absolute;
      left: 35px;
      bottom: 77px;
      cursor: pointer;
      user-select: none;
      img {
        margin-right: 20px;
      }
    }
    .btn_no {
      position: absolute;
      left: 220px;
      bottom: 16px;
      width: 100px;
      height: 36px;
      line-height: 36px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 10px;
      cursor: pointer;
    }
    .btn_yes {
      position: absolute;
      right: 220px;
      bottom: 16px;
      width: 100px;
      height: 36px;
      line-height: 36px;
      background: #05c65d;
      color: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 10px;
      cursor: pointer;
    }
    .table_box_share {
      position: absolute;
      left: 0;
      top: 125px;
      width: 700px;
      padding: 0 35px 0 34px;
      background-color: #ffffff;
      box-sizing: border-box;
      table {
        width: 100%;
        text-align: center;
        background: #f3f3f3;
        thead {
          width: 100%;
          height: 53px;
          line-height: 53px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          border-bottom: 1px solid #c9c7c7;
          & td {
            color: #333;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          td:nth-of-type(1) {
            flex: 0.3;
          }
        }
        tr {
          width: 100%;
          height: 50px;
          // line-height: 126px;
          font-size: 14px;
          display: flex;
          color: #333333;
          & td {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          td:nth-of-type(1) {
            flex: 0.3;
          }
          .isGreen {
            color: #05c65d !important;
          }
          .flex_direction {
            flex-direction: column;
          }
          .footer_msg_share {
            margin: 16px 0 0 150px;
            user-select: none;
            span {
              cursor: pointer;
              margin: 0 30px;
              color: #848484;
            }
          }
        }
        .isGreen {
          color: #05c65d !important;
        }
        .table_bg_share {
          background-color: #ececec;
        }
      }
    }
  }
}
</style>
