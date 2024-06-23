<template>
  <div class="exp-plan">
    <div v-show="pageState === 0">
      <!-- <SelBox @selChange="selChange"/> -->
      <top-filter
        ref="filterRef"
        :options="[
          'time_ids',
          'semester',
          'subject_id',
          'grade',
          'week',
          'name',
          'type',
          'laboratory_id',
          'teacher_id',
          'book_type',
          'status',
        ]"
        @change="getTableData($event)"
      />
      <button
        v-if="[2, 4].includes($store.getters.getUserMsg.role_id)"
        class="my-btn"
        @click="exportExcelBase"
      >
        导出
      </button>
      <div class="table-box">
        <div class="table-flow">
          <el-table
            :data="tableList"
            stripe
            style="width: 100%"
            :header-cell-style="{}"
            :default-sort="{ prop: 'index', order: 'descending' }"
            @sort-change="changeSort"
          >
            <el-table-column type="index" label="序号" width="60px" align="left" />
            <el-table-column
              prop="laboratory_id"
              label="实验地点"
              sortable="custom"
              width="150px"
              align="left"
            >
              <template slot-scope="scope">
                <p class="laboratory-box">
                  {{
                    scope.row.laboratory_id === -1 ? '教室' : scope.row.laboratory_name
                  }}
                  <span
                    v-if="
                      roleId === 2 &&
                      scope.row.book_type === 1 &&
                      scope.row.unchange !== 1 &&
                      scope.row.status !== 0 &&
                      scope.row.is_conflict === 1
                    "
                  >
                    <el-popover
                      placement="right"
                      width="240"
                      @show="showConflict(scope.row)"
                      trigger="click"
                    >
                      <div class="conflict-box">
                        <p>
                          <img
                            src="@images/experimentalRecord/icon-red.png"
                            alt=""
                          /><span>预警提醒</span><span>实验室冲突!!!</span>
                        </p>
                        <p>调整建议如下</p>
                        <p
                          class="detail-span"
                          v-for="(item, index) in conflictData"
                          :key="index"
                        >
                          <span>{{ item.laboratory }}</span>
                          <span
                            :class="[item.status === '可用' ? 'font-green' : 'font-red']"
                            >{{ item.status }}</span
                          >
                          <span>{{ item.status2 }}</span>
                        </p>
                      </div>
                      <span slot="reference" class="need-change">
                        <img src="@images/experimentalRecord/icon-red.png" alt="" />
                      </span>
                    </el-popover>
                  </span>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="week_time"
              label="开课时间"
              sortable="custom"
              :sort-by="['week_time', 'weekend', 'section']"
              width="180px"
              align="left"
            >
              <template slot-scope="scope">
                <span>{{
                  `${$store.state.weekTimeArr[scope.row.week_time]}/${
                    $store.state.weekArr[scope.row.weekend]
                  }/第${scope.row.section}节`
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="teacher_id"
              label="开课教师"
              sortable="custom"
              align="left"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ computedTeacherName(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="exp_name"
              label="实验名称"
              sortable="custom"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span>{{ scope.row.name.join(',') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="class_name"
              label="班级"
              sortable="custom"
              align="left"
            >
              <template slot-scope="scope">
                <span>{{ computedClassName(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="实验类型"
              sortable="custom"
              align="left"
              width="120px"
            >
              <template slot-scope="scope">
                <span>{{ $store.state.groupTypeList[scope.row.type - 1] || '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="book_type"
              label="方式"
              sortable="custom"
              align="left"
              width="80px"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.book_type === 1
                    ? '预约'
                    : scope.row.book_type === 2
                    ? '排课'
                    : '登记'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status2"
              label="提交说明"
              sortable="custom"
              align="left"
              width="120px"
            >
              <template slot-scope="scope">
                <span>
                  {{
                    scope.row.status2 === 0
                      ? '已提交'
                      : scope.row.status2 === 1
                      ? '已取消'
                      : scope.row.status2 === 2
                      ? '已取消'
                      : scope.row.status2 === 3
                      ? '重新提交'
                      : scope.row.status2 === 4
                      ? '重新提交'
                      : '未提交'
                  }}
                </span>
                <!-- <span>{{ scope.row.status2 === 0 ? '无修改' :
                  scope.row.status2 === 1 ? '已通过，取消' :
                  scope.row.status2 === 2 ? '未审核，取消' :
                  scope.row.status2 === 3 ? '已通过，修改' : '未审核，修改' }}
                </span> -->
              </template>
            </el-table-column>
            <!-- <el-table-column
              v-if="roleId === 2"
              prop="book_name"
              label="预约人"
              sortable="custom"
              align="left"/> -->
            <el-table-column prop="status" label="状态" sortable="custom" align="left">
              <template slot-scope="scope">
                <p v-show="scope.row.status === 1" class="sel-p">
                  <img src="@/assets/images/examineList/warning.png" alt="" />
                  <span class="font-simple-disable font-yellow">待审核</span>
                </p>
                <p v-show="scope.row.status >= 2" class="sel-p">
                  <img src="@/assets/images/examineList/pass.png" alt="" />
                  <span class="font-simple-disable font-green">已通过</span>
                </p>
                <p v-show="scope.row.status === -1" class="sel-p">
                  <img src="@/assets/images/examineList/refuse.png" alt="" />
                  <span class="font-simple-disable font-red">已拒绝</span>
                </p>
                <p v-show="scope.row.status === 0" class="sel-p">
                  <img src="@/assets/images/examineList/cancel.png" alt="" />
                  <span class="font-simple-disable">已取消</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <div class="font-simple-disable font-green-bg" @click="revise(scope.row)">
                  详情
                </div>
                <!-- <div v-if="isHaveEnd ? roleId === 2 && scope.row.end === 0 && scope.row.is_del === 0 : roleId === 2 && scope.row.is_del === 0" class="flex operation">
                  <div v-show="scope.row.status === 1" class="font-simple-disable font-green-bg" @click="agree(scope.row)">同意</div>
                  <div v-show="scope.row.status === 1" class="font-simple-disable font-yellow-bg" @click="instrumentClick(scope.row)">调整</div>
                  <div v-show="scope.row.status === 1" class="font-simple-disable font-red-bg" @click="audit(scope.row, -1)">拒绝</div>
                  <div v-show="scope.row.status === 2" @click="instrumentClick(scope.row)">
                    <img src="@/assets/images/examineList/instrument.png" alt="">
                    <p>仪器准备</p>
                  </div>
                  <div v-show="scope.row.status === 2">
                    <a :href="`${baseUrl}/school/Excel/instrumentExport?token=${$store.state.userMsg.token}&id=${scope.row.id}`"><img src="@/assets/images/examineList/out-table.png" alt="">
                    <p>导出仪器表</p></a>
                  </div>
                  <div v-show="scope.row.status === 2" @click="audit(scope.row, 1)">
                    <img src="@/assets/images/examineList/notpass.png" alt="">
                    <p :class="{'gray': scope.row.unchange === 1}">取消审核</p>
                  </div>
                  <div class="delete-text" v-show="false" @click="deleteItem(scope.row.id)">
                    <img src="@/assets/images/examineList/del.png" alt="">
                    <p class="font-red">删除</p>
                  </div>
                </div>
                <div v-if="isHaveEnd && (roleId === 2 && scope.row.end === 1)" class="flex operation">
                  <div class="font-simple-disable font-end-bg">已结束</div>
                </div>
                <div v-if="isHaveEnd ? roleId === 2 && scope.row.is_del === -1 && scope.row.end === 0 : roleId === 2 && scope.row.is_del === -1" class="flex operation">
                  <div class="font-simple-disable font-end-bg">已撤销</div>
                </div>
                <div v-if="isHaveEnd ? roleId === 4 && scope.row.end === 0 && scope.row.is_del === 0 : roleId === 4 && scope.row.is_del === 0" class="flex operation">
                  <div class="font-simple-disable font-none-bg" v-show="scope.row.unchange"/>
                  <div v-show="scope.row.unchange" class="font-simple-disable font-yellow-bg" @click="delExpBook(scope.row)">撤销课程</div>
                  <div v-show="!scope.row.unchange" class="font-simple-disable font-green-bg" @click="revise(scope.row)">修改</div>
                  <div v-show="(scope.row.status === 2 || scope.row.status === 1) && !scope.row.unchange" class="font-simple-disable font-red-bg" @click="revoke(scope.row)">
                    取消预约
                  </div>
                  <div v-show="scope.row.status === 2" class="font-simple-disable font-yellow-bg share-to" @click="shareToStudent(scope.row)">
                    {{ scope.row.unchange === 0 ? '发布给学生' : '发布' }}
                  </div>
                  <div class="font-simple-disable font-none-bg share-to" v-show="scope.row.status === 1"/>
                </div>
                <div v-if="isHaveEnd && (roleId === 4 && scope.row.end === 1)" class="flex operation">
                  <div class="font-simple-disable font-end-bg">已结束</div>
                </div>
                <div v-if="isHaveEnd ? roleId === 4 && scope.row.is_del === -1 && scope.row.end === 0 : roleId === 4 && scope.row.is_del === -1" class="flex operation">
                  <div class="font-simple-disable font-end-bg">已撤销</div>
                </div> -->
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="审核信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="实验室：" :label-width="'120px'">
                <el-select v-model="form.laboratory_id" placeholder="请选择实验室">
                  <el-option :label="'教室'" :value="-1" />
                  <el-option
                    v-for="(item, index) in labList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="审核备注：" :label-width="'120px'">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="form.tips"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="audit(form, form.status)"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </div>
      </div>
      <course-window
        v-if="propState"
        :dataProp="newDataList"
        :labList="labList"
        @back="back"
        @getInstrument="instrumentClick"
      />

      <div class="footer2">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="10"
          background
          layout="prev, pager, next, jumper"
          :total="pageTotal"
        />
      </div>
    </div>
    <div v-if="pageState === 1">
      <div class="header1">
        {{ instrumentData.is_confirm === 0 ? '待确认仪器清单' : '已确认仪器清单' }}
        <button class="graybtn" @click="pageState = 0">返回审核列表</button>
      </div>
      <div class="base-msg-box">
        <div>
          <p>
            <span> 实验名称 </span>
            <span>
              {{ instrumentData.name.join(',') }}
            </span>
          </p>
          <p>
            <span> 分组数 </span>
            <span>
              {{ instrumentData.number_instruments }}
            </span>
          </p>
        </div>
        <!-- <div>
          <p>
            <span>
              实验班级
            </span>
            <span>
              {{ instrumentData.class_name }}
            </span>
          </p>
          <p>
            <span>
              实验类型
            </span>
            <span>
              {{instrumentData.type === 1 ? '分组' : instrumentData.type === 2 ? '演示' : '其他'}}
            </span>
          </p>
          <p>
            <span>
              实验地点
            </span>
            <span>
              {{instrumentData.laboratory}}
            </span>
          </p>
        </div> -->
        <div>
          <p>
            <span> 实验时间 </span>
            <span>
              {{
                '第' +
                instrumentData.week_time +
                '周/星期' +
                instrumentData.weekend +
                '/第' +
                instrumentData.section +
                '节次'
              }}
            </span>
          </p>
          <p>
            <span> 预约备注 </span>
            <span>
              {{ instrumentData.tips }}
            </span>
          </p>
        </div>
        <div>
          <p>
            <span> 其他实验材料 </span>
            <span>
              {{ instrumentData.material_tips || '无' }}
            </span>
          </p>
        </div>
      </div>
      <!-- <p>所需套数<el-input-number v-model="number_instruments" :min="1" :max="1000" label="描述文字"/></p> -->
      <div class="table-box1">
        <!-- <div class="table-title">
          <span>仪器备注：{{ tips.join(',') }}</span>
          <span>套数：{{ multiple }}</span>
        </div> -->
        <el-table
          :data="tableData1"
          border
          stripe
          style="width: 100%"
          max-height="500px"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column type="index" label="序号" width="80px" sortable />
          <el-table-column prop="material_number" label="分类编号" sortable />
          <el-table-column prop="name" label="仪器名称" sortable />
          <el-table-column
            prop="specification"
            label="规格"
            sortable
            show-overflow-tooltip
          />
          <el-table-column prop="" label="每组数量" sortable>
            <template slot-scope="scope">
              {{
                scope.row.num
                  ? parseInt(scope.row.num) / parseInt(number_instruments)
                  : '/'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="num" :label="'所需总数量'" sortable>
            <template slot-scope="scope">
              <div>
                {{ scope.row.num || '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="instrumentData.is_confirm === 0"
            prop="usable"
            label="可用库存"
            sortable
          />
          <el-table-column prop="library" label="仪器使用位置及数量" width="240" sortable>
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.position"
                :key="index"
                v-show="item.num !== 0"
              >
                {{
                  item.store_name
                    ? item.school_laboratory_name +
                      '/' +
                      item.store_name +
                      '/' +
                      '第' +
                      item.number_plies +
                      '层'
                    : item.school_laboratory_name
                }}
                <span class="font-green">{{ item.num + '个' }}</span>
              </p>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="ambry"
            label="橱柜"
            sortable/>
          <el-table-column
            prop="layer_number"
            label="层数"
            sortable/> -->
          <el-table-column
            v-if="instrumentData.is_confirm === 0"
            prop="tips"
            label="提示"
            sortable
          >
            <template #default="scope">
              <!-- total 和 > num -->
              <div v-if="scope.row.num > scope.row.usable" class="font-red">
                数量不足 {{ scope.row.occupy > 0 ? `(已占用${scope.row.occupy})` : '' }}
              </div>
              <div v-else>可用</div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="true_num" label="确认数量" sortable />
          <el-table-column
            v-if="instrumentData.is_confirm === 0"
            prop=""
            label=""
            width="200"
            sortable
          >
            <template #default="scope">
              <div class="button-box">
                <button class="commonbtn" @click="adjustmentRow(scope.row, scope.$index)">
                  调整
                </button>
                <button class="commonbtn" @click="deleteRow(scope.$index)">删除</button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-box">
          <button class="commonbtn" v-if="instrumentData.is_confirm === 0" @click="add">
            新增 +
          </button>
          <button
            class="commonbtn"
            v-if="instrumentData.is_confirm === 0"
            @click="saveMaterial"
          >
            确认清单
          </button>
          <button
            class="commonbtn"
            v-if="instrumentData.is_confirm === 1"
            @click="exportExcel"
          >
            导出
          </button>
        </div>
        <el-drawer title="仪器调整" :visible.sync="drawer" direction="rtl">
          <div class="drawer-box">
            <div class="message">
              <div class="row">
                <div>
                  <div class="title">分类编号</div>
                  <div class="value">
                    {{ adjustmentObj.material_number }}
                  </div>
                </div>
                <div>
                  <div class="title">库存数</div>
                  <div class="value">
                    {{
                      adjustmentObj.usable +
                      adjustmentObj.occupy +
                      ' ' +
                      adjustmentObj.unit
                    }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div>
                  <div class="title">学校编号</div>
                  <div class="value">
                    {{ adjustmentObj.asset_number }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div>
                  <div class="title">名称</div>
                  <div class="value">
                    {{ adjustmentObj.name }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div>
                  <div class="title">规格型号</div>
                  <div class="value">
                    {{ adjustmentObj.specification }}
                  </div>
                </div>
              </div>
              <el-table
                :data="adjustmentObj.position"
                style="width: 100%"
                max-height="540"
              >
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="" label="存放位置" width="240">
                  <template #default="scope">
                    {{
                      scope.row.store_name
                        ? scope.row.school_laboratory_name +
                          '/' +
                          scope.row.store_name +
                          '/' +
                          '第' +
                          scope.row.number_plies +
                          '层'
                        : scope.row.school_laboratory_name
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="现有库存">
                  <template #default="scope">
                    {{ scope.row.usable
                    }}{{
                      scope.row.total - scope.row.usable > 0
                        ? `(已占用${scope.row.total - scope.row.usable})`
                        : ''
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="实验数量">
                  <template #default="scope">
                    <el-input-number
                      v-model="scope.row.num"
                      :min="0"
                      :max="scope.row.total"
                      label=""
                      :step="1"
                      step-strictly
                    />
                  </template>
                </el-table-column>
              </el-table>
              <div class="btn-box">
                <!-- <p v-if="$route.meta.type === 3" class="btn" @click="nextShow = true">下一步</p> -->
                <p class="btn gray-btn" @click="drawer = false">取消</p>
                <p class="btn" @click="sureAdjustment()">确认</p>
              </div>
            </div>
          </div>
        </el-drawer>
        <el-dialog title="添加仪器" :visible.sync="dialogVisible" width="30%">
          <div style="display: flex">
            <p style="width: 100px; line-height: 30px">新增仪器</p>
            <el-input v-model="input" placeholder="请输入内容" @change="add" />
          </div>
          <div class="tab-box">
            <el-table
              ref="multipleTable"
              :data="tableData3"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" :selectable="canBeChecked" />
              <el-table-column prop="number" label="分类编号" width="150" />
              <el-table-column prop="name" label="仪器名称" width="150" />
              <el-table-column prop="specification" label="规格" show-overflow-tooltip />
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- <div class="footer1">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="100"
          background
          layout="prev, pager, next, jumper"
          :total="1000"/>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  expBookEditNew,
  allLabExpDate,
  cancelExpBook,
  pushSub,
  delExpBook,
} from '@network/subscribe'
// import { ExpMaterialFind } from '@/network/experimentPlan'
import TopFilter from '@components/top-filter.vue'
import CourseWindow from '@views/course-manage/laboratory-course/components/course-window.vue'
import axios from 'axios'
import localCache from '@/utils/localCache'

import {
  adjustLaboratory,
  expBookDel,
  getConflict,
  examInstrument,
  insList,
  insDetailList,
  findSchoolIns,
  insAdjustment,
  insConfirm,
  instrumentExport,
  getLaboratoryByUser,
} from '../../network/subExamine'

import { mapState } from 'vuex'
import mixinsFormatter from '@/mixins/formatter'

// import SelBox from './components/SelBox.vue'

export default {
  mixins: [mixinsFormatter],
  components: {
    TopFilter,
    CourseWindow,
  },
  data() {
    return {
      seldata: {
        // status: '',
        // week_time: '',
        // weekend: '',
        // type: ''
      },
      page: 1,
      value: '',
      editStatus: false,
      isHaveEnd: false, // 是否具有结束状态
      newDataList: [],
      roleId: this.$store.state.userMsg.role_id,
      propState: false,
      pageTotal: 10,
      tableList: [],
      tips: '',
      multiple: 0,
      gradeList: this.$store.state.userMsg.grade,
      gradeCheckList: [this.$store.state.userMsg.grade[0]],
      tableData: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      conflictData: [],
      gradeNow: this.$store.state.userMsg.grade[0],
      instrumentData: {},
      message: {},
      instrumentTip: '',
      currentPage3: 1,
      pageState: 0,
      input: '',
      baseUrl: process.env.VUE_APP_APP_BASEURL,
      form: {
        id: '',
        status: 2,
        tips: '',
        laboratory_id: '',
      },
      labList: [],
      classList: [],
      allGradeList: [],
      dialogFormVisible: false,
      dialogVisible: false,

      searchObj: {},
      drawer: false,

      adjustmentObj: {},
      adjustmentIndex: 0,
    }
  },
  created() {
    this.allGradeList =
      this.$store.state.userMsg.time_ids === 1
        ? [1, 2, 3, 4, 5, 6]
        : this.$store.state.userMsg.time_ids === 2
        ? [7, 8, 9]
        : [10, 11, 12]

    this.classList = this.$store.state.userMsg.class
    this.getLabList()
    // if (this.roleId === 2) {

    // } else {
    //   this.labList = this.$store.state.labList
    // }
    // this.changeSort({
    //   order: null
    // })
  },
  computed: {
    ...mapState({
      userMsg: 'userMsg',
      labListSubject: 'labList',
      teacherArr: 'teacherArr',
      gradeArr: 'gradeArr',
      role_id: (state) => state.userMsg.role_id,
    }),
    laboratoryShow() {
      return function (id) {
        let name = '教室'
        if (id === 0) {
          name = '全部实验室'
        }
        this.labList.forEach((e) => {
          if (e.laboratory_id === id) {
            name = e.name
          }
        })
        return name
      }
    },
    conmputedLab() {
      // let arr = this.labList.splice()
      const arr = JSON.parse(JSON.stringify(this.labList))
      // arr.shift()
      return arr
    },
  },
  watch: {
    gradeNow() {
      const arr = this.$store.state.userMsg.class.filter(
        (e) => e.grade_id === this.gradeNow
      )
      this.classList = [...arr]
      this.message.class_id = this.classList[0].class_id
    },
  },
  methods: {
    getLabList() {
      getLaboratoryByUser().then(() => {
        if (this.role_id === 2) {
          getLaboratoryByUser().then((res) => {
            this.labList = res.data
            let obj = {
              id: 0,
              // is_order: 2,
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
            this.labList.push({
              ...obj,
              color: '#333',
              laboratory_id: -1,
              name: '教室',
              is_order: 2,
            })
            this.labList.unshift({
              ...obj,
              color: '#333',
              laboratory_id: 0,
              name: '全部实验室',
              is_order: 2,
            })
          })
        } else {
          this.labList = this.labListSubject.map((e) => {
            return { ...e, laboratory_id: e.id }
          })
          let obj = {
            id: 0,
            // is_order: 2,
            laboratory_id: 0,
            name: '',
            school_code: '',
            school_id: 0,
            subject_id: 0,
            user_id: 0,
            user_name: '',
          }
          if (this.labList.length > 0) {
            obj = { ...this.labList[0] }
          }
          this.labList.push({
            ...obj,
            color: '#333',
            laboratory_id: -1,
            name: '教室',
            is_order: 2,
          })
          this.labList.unshift({
            ...obj,
            color: '#333',
            laboratory_id: 0,
            name: '全部实验室',
            is_order: 2,
          })
        }
      })
    },
    changePageState(val) {
      this.pageState = val
    },
    // selChange(data) {
    //   data = JSON.parse(JSON.stringify(data))
    //   if (data.status === 4) {
    //     delete data.status
    //     data.end = 1
    //   }
    //   this.seldata = data
    //   this.page = 1
    //   this.$refs.filterRef.changeValue()
    // },
    handleSelectionChange(val) {
      this.tableData2 = val
    },
    // laboratoryTypeChange(val) {
    //   if (val === 1) {
    //     this.message.class_id = this.classList[0].class_id
    //     this.message.number_groups = 4
    //     this.message.number_instruments = 12
    //     this.message.laboratory_id = this.labList[0].id
    //   }
    //   if (val === 2) {
    //     this.message.class_id = this.classList[0].class_id
    //     this.message.number_groups = 0
    //     this.message.number_instruments = 1
    //     this.message.laboratory_id = -1
    //   }
    // },
    changeSort(prop) {
      const order = prop.order === 'ascending' ? 'asc' : 'desc'
      let name =
        prop.prop === 'week_time'
          ? `week_time ${order},weekend ${order},section`
          : prop.prop === 'exp_name'
          ? 'exp_id'
          : prop.prop === 'class_name'
          ? 'class_id'
          : prop.prop === 'book_name'
          ? 'teacher_id'
          : prop.prop
      if (prop.order === null) {
        name = `week_time ${order},weekend ${order},section`
      }
      this.seldata.order = name + ' ' + order
      this.$refs.filterRef.changeValue()
    },
    getTableData(obj) {
      this.searchObj = obj
      // this.page = page
      allLabExpDate({ page: this.page, ...this.searchObj, ...this.seldata }).then(
        (res) => {
          this.pageTotal = res.data.count
          this.tableList = res.data.list
          if (res.data.list.length === 0 && this.page > 1) {
            // this.page -= 1
            this.$refs.filterRef.changeValue()
          }
        }
      )
    },
    exportExcelBase() {
      const token = localCache.getCookie('swr_token')

      axios
        .post(
          process.env.VUE_APP_APP_BASEURL + '/teach/expBook/allExpBook',
          { ...this.searchObj, token, is_explode: 1, ...this.seldata },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.$store.getters.getUserMsg.school.name + '-' + '实验课列表.xlsx'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        })
    },
    back() {
      this.propState = false
      this.$refs.filterRef.changeValue()
    },
    instrumentList(item) {
      const data = {
        id: item.id,
      }
      examInstrument(data).then((res) => {
        this.tableData1 = res.data.data
        this.instrumentTip = res.data.tips
      })
    },
    resubmit(item) {
      const arr = item.material.map((e) => {
        return {
          material_number: e.number,
          num: e.num,
        }
      })
      delete item.teacher_name
      delete item.name
      delete item.laboratory
      expBookEditNew({ ...item, material: arr }).then((res) => {
        if (res.code === 10) {
          this.propState = false
          this.$refs.filterRef.changeValue()
        }
      })
    },
    changeStatus(item) {
      console.log('🚀 ~ file: index.vue ~ line 1259 ~ changeStatus ~ item', item)
      this.editStatus = true
      // getMaterialBook({
      //   number: ['P-swr1652336364234']
      // }).then((res) => {
      //   // res.data.forEach(e => {
      //   //   if (this.instrumentList.some(m => {
      //   //     m.
      //   //   }))
      //   // })
      //   this.materialTable = res.data
      // })
    },
    revise(data) {
      this.newDataList = [JSON.parse(JSON.stringify(data))]
      // this.newDataList.splice(0, 1, data)
      // this.message = { ...data }
      // this.gradeCheckList = this.message.grade
      // this.classList = this.classList.filter((res) => res.grade_id === this.message.grade)
      this.propState = true
    },
    delExpBook(data) {
      this.$confirm('此操作将永久删除该课程信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delExpBook({
            id: data.id,
          }).then((res) => {
            if (res.code === 10) {
              this.$message.success(res.msg)
              this.propState = false
              this.$refs.filterRef.changeValue()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    hideDetail(event) {
      var msg = document.getElementById('msgBox')
      if (msg) {
        if (!msg.contains(event.target)) {
          this.propState = false
        }
      }
    },
    close() {
      this.propState = false
      this.editStatus = false
    },
    sureClick() {
      if (this.gradeCheckList.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个年级',
        })
        return
      }
      if (this.message.type === 3) {
        this.message.class_id = -1
        this.gradeNow = this.gradeCheckList.join(',')
      }
      pushSub({
        // ...this.message,
        is_order: this.labList.find((e) => e.laboratory_id === this.message.laboratory_id)
          .is_order,
        class_id: this.message.class_id,
        exp_id: this.message.exp_id,
        grade: this.gradeNow,
        id: this.message.id,
        laboratory_id: this.message.laboratory_id,
        number_groups: this.message.number_groups,
        number_instruments: this.message.number_instruments,
        plan_detail_id: this.message.plan_detail_id,
        section: this.message.section,
        status: 1,
        tips: this.message.tips,
        type: this.message.type,
        week_time: this.message.week_time,
        weekend: this.message.weekend,
      })
        .then(() => {
          this.propState = false
          this.gradeCheckList = [this.$store.state.userMsg.grade[0]]
          this.$refs.filterRef.changeValue()
        })
        .catch(() => {
          console.log('出错了')
        })
    },
    shareToStudent(data) {
      if (data.status === 2) {
        // 跳转详情
        this.$router.push({
          name: 'MyExperiment',
          params: { item_id: data.exp_id, shareToStu: true },
        })
        // 跳转编辑
        // this.$router.push({ name: 'MyExperiment', params: { item_id: data.exp_id, add: true, shareToStu: true }})
      } else {
        this.$message({
          type: 'warning',
          message: '请在审核通过后发布给学生',
        })
      }
    },
    revoke(data) {
      this.$confirm('是否取消预约?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          cancelExpBook({
            id: data.id,
          }).then((res) => {
            if (res.code === 10) {
              this.$refs.filterRef.changeValue()
              this.$message({
                message: '已取消预约',
                type: 'success',
              })
              this.propState = false
            } else {
              this.$message({
                message: '取消预约失败',
                type: 'warning',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            message: '取消操作',
            type: 'warning',
          })
        })
    },
    audit(item, status) {
      if (status === 1) {
        if (item.unchange) {
          this.$alert('教师已开始进行课程，无法直接取消审核，请联系该教师撤销', '提示', {
            confirmButtonText: '确定',
          })
        } else {
          this.$confirm('是否取消审核?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              adjustLaboratory({
                id: item.id,
                status: status,
              }).then((res) => {
                if (res.code === 10) {
                  this.$message({
                    message: '实验室审核已取消',
                    type: 'success',
                  })
                  this.propState = false
                  this.$refs.filterRef.changeValue()
                } else {
                  this.$message({
                    message: '审核失败',
                    type: 'error',
                  })
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作',
              })
            })
        }
      } else if (status === 2) {
        adjustLaboratory(this.form).then((res) => {
          if (res.code === 10) {
            this.$message({
              message: '审核通过',
              type: 'success',
            })
            this.propState = false
            this.dialogFormVisible = false
            this.$refs.filterRef.changeValue()
          } else {
            this.$message({
              message: '审核失败',
              type: 'error',
            })
          }
        })
      } else {
        adjustLaboratory({
          id: item.id,
          status: status,
        }).then((res) => {
          if (res.code === 10) {
            this.$message({
              message: '实验室申请已拒绝',
              type: 'success',
            })
            this.propState = false
            this.$refs.filterRef.changeValue()
          } else {
            this.$message({
              message: '审核失败',
              type: 'error',
            })
          }
        })
      }
    },
    agree(item) {
      this.form.id = item.id
      this.form.laboratory_id = item.laboratory_id
      this.dialogFormVisible = true
    },
    // 仪器准备
    instrumentClick(item) {
      this.instrumentData = item
      const data = {
        id: item.id,
      }
      if (this.instrumentData.is_confirm === 0) {
        insList(data).then((res) => {
          this.tips = res.data.tips
          this.multiple = res.data.multiple
          this.tableData1 = res.data.list.map((e) => {
            let sum = e.num

            return {
              ...e,
              position: e.position.map((m) => {
                let num = 0
                if (sum > 0) {
                  if (sum > m.total) {
                    num = m.total
                    sum -= m.total
                  } else {
                    num = sum
                    sum = 0
                  }
                }

                return {
                  ...m,
                  num,
                }
              }),
            }
          })
          this.number_instruments = res.data.number_instruments
          this.pageState = 1
        })
      } else {
        insDetailList(data).then((res) => {
          this.tips = res.data.tips
          this.multiple = res.data.multiple
          this.tableData1 = res.data.list
          // this.tableData1 = res.data.list.map(e => {
          //   let sum = e.num

          //   return {
          //     ...e,
          //     position: e.position.map(m => {
          //       let num = 0
          //       if (sum > 0) {
          //         if (sum > m.total) {
          //           num = m.total
          //           sum -= m.total
          //         } else {
          //           sum = 0
          //           num = sum
          //         }
          //       }

          //       return {
          //         ...m,
          //         num
          //       }
          //     })
          //   }
          // })
          this.number_instruments = res.data.number_instruments
          this.pageState = 1
        })
      }
    },
    add() {
      this.dialogVisible = true
      const data = {
        subject_id: this.instrumentData.subject_id,
        name: this.input,
      }
      findSchoolIns(data).then((res) => {
        console.log(res)
        this.tableData3 = res.data
      })
    },
    adjustmentRow(item, index) {
      console.log('🚀 ~ file: index.vue:541 ~ adjustmentRow ~ item:', item)
      this.adjustmentObj = JSON.parse(JSON.stringify(item))
      this.adjustmentIndex = index
      // insAdjustment({
      //   id: this.instrumentData.id,
      //   number: item.material_number
      // }).then((res) => {
      //   this.adjustmentObj = {
      //     ...res.data,
      //     position: res.data.position.map((e) => {
      //       return {
      //         ...e,
      //         num: 0
      //       }
      //     })
      //   }
      //   console.log('🚀 ~ file: index.vue:556 ~ insAdjustment ~ res:', res)
      // })
      this.drawer = true
    },
    deleteRow(index) {
      this.tableData1.splice(index, 1)
      console.log('🚀 ~ file: index.vue:544 ~ deleteRow ~ item:', index)
    },
    sureAdjustment() {
      this.tableData1.splice(this.adjustmentIndex, 1, this.adjustmentObj)
      console.log(this.adjustmentObj)
      this.drawer = false
    },
    saveMaterial() {
      console.log(this.tableData1)
      this.$confirm('仪器是否调整完毕', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          insConfirm({
            exp_book_id: this.instrumentData.id,
            list: this.tableData1.map((e) => {
              let true_num = 0
              e.position.forEach((m) => {
                true_num += m.num
              })
              return {
                ...e,
                true_num,
                detail: e.position,
              }
            }),
          }).then((res) => {
            console.log(res)
            // this.instrumentClick(this.instrumentData)
            this.$refs.filterRef.changeValue()
            this.pageState = 0
            this.propState = false
            this.activeIndex = '0'
            if (res.code === 10) {
              this.$message({
                message: '保存成功',
                type: 'success',
              })
            } else {
              this.$message({
                message: '保存失败',
                type: 'error',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消',
          })
        })
    },
    exportExcel() {
      console.log('导出')
      const token = localCache.getCookie('swr_token')

      axios
        .post(
          process.env.VUE_APP_APP_BASEURL + '/school/ExpBookMaterial/Materialexport',
          { id: this.instrumentData.id, token },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName = '仪器确认信息导出表.xlsx'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        })
    },
    determine() {
      this.dialogVisible = false
      this.tableData2.forEach((item) => {
        delete item.id
        insAdjustment({
          id: this.instrumentData.id,
          number: item.number,
        }).then((res) => {
          this.tableData1.push({
            ...item,
            ...res.data,
            // num: 10,
            week_time: this.instrumentData.week_time,
            weekend: this.instrumentData.weekend,
            section: this.instrumentData.section,
            material_number: item.number,
            exp_book_id: this.instrumentData.id,
            position: res.data.position.map((e) => {
              delete e.id

              return {
                ...e,
                num: e.total,
              }
            }),
          })
          console.log('🚀 ~ file: index.vue:556 ~ insAdjustment ~ res:', res)
        })
      })
    },
    develop(item) {
      instrumentExport({
        id: item.id,
      }).then((res) => {
        console.log('🚀 ~ file: ExamineList.vue ~ line 840 ~ develop ~ res', res)
      })
    },
    deleteItem(id) {
      this.$confirm('此操作将永久删除该预约, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          expBookDel({
            id: id,
          }).then((res) => {
            if (res.code === 10) {
              this.$message({
                type: 'success',
                message: '已删除该预约',
              })
              this.propState = false
              this.$refs.filterRef.changeValue()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    showConflict(data) {
      getConflict({
        id: data.id,
      }).then((res) => {
        this.conflictData = res.data
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log('🚀 ~ file: ExamineList.vue:1477 ~ handleCurrentChange ~ val:', val)
      this.getTableData(this.searchObj)
    },
  },
}
</script>

<style scoped lang="scss">
.exp-plan {
  box-sizing: border-box;
  padding: 28px 28px 0 28px;
  min-height: 800px;
  width: 100%;
  .my-btn {
    // margin: -108px 20px 0 0;
    margin: -57px 20px 0 0;

    float: right;
  }
  .header {
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    font-weight: 400;
    font-size: 18px;
    color: #626572;
    & > button {
      float: right;
      margin: 4px 12px;
    }
  }
  .base-msg-box {
    margin-top: 8px;
    padding: 12px 0;
    width: 100%;
    min-height: 60px;
    background-color: #dcece3;
    overflow: hidden;

    & > div {
      display: flex;

      & > p {
        flex: 1;
        text-align: left;
        padding: 0 20px;
        min-height: 40px;
        line-height: 40px;
        & > :nth-child(1) {
          padding-right: 12px;
          display: inline-block;
          min-width: 60px;
          color: #05c65d;
        }
        & > :nth-child(2) {
          color: rgb(150, 150, 150);
        }
      }
    }
  }
  .drawer-box {
    padding: 0 30px;
    .message {
      text-align: left;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin: 6px 0;
        & > div {
          display: flex;
        }
        .title {
          min-width: 80px;
          color: #333;
        }
        .value {
          color: #05c65d;
        }
      }
    }
  }
  .btn-box {
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    .btn {
      margin: 0 10px;
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
  .header1 {
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    font-weight: 400;
    font-size: 18px;
    color: #626572;
    & > button {
      float: right;
      margin: 4px 20px;
    }
  }
}
.table-box {
  margin-bottom: 20px;
  padding: 20px 20px;
  width: 100%;
  // height: 500px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  .table-flow {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    ::v-deep .el-dialog {
      width: 500px;
      .el-form-item__label {
        line-height: 30px;
      }
      .el-form-item__content {
        line-height: 30px;
      }
      .el-textarea {
        width: 300px !important;
      }
    }
    .need-change {
      display: inline-flex;
      align-items: center;
      height: 23px;
    }
    /*包含以下四种的链接*/
    a {
      color: #05c65d;
      text-decoration: none;
    }
    /*正常的未被访问过的链接*/
    a:link {
      color: #05c65d;
      text-decoration: none;
    }
    /*已经访问过的链接*/
    a:visited {
      color: #05c65d;
      text-decoration: none;
    }
    /*鼠标划过(停留)的链接*/
    a:hover {
      color: #05c65d;
      text-decoration: none;
    }
    /* 正在点击的链接*/
    a:active {
      color: #05c65d;
      text-decoration: none;
    }
  }
  .table-flow::-webkit-scrollbar {
    width: 0;
  }
  .laboratory-box {
    position: relative;
    & > span {
      position: absolute;
      top: 0;
      right: -6px;
      color: red;
    }
  }
}
.detail-box {
  position: fixed;
  top: 6vh;
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
      height: 60vh;
      overflow-y: scroll;
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
        padding: 12px 0;
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
      .click-text {
        margin: 0 10px;
        color: #05c65d;
        cursor: pointer;
      }
      .click-text-0 {
        // margin: 0 10px;
        color: #05c65d;
        cursor: pointer;
      }
      .lab-item {
        display: inline-block;
        position: relative;
        margin-right: 10px;
        width: 110px;
        height: 30px;
        line-height: 30px;
        background: rgba(255, 255, 255, 0.39);
        border: 1px solid #c9c7c7;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        text-align: center;
        color: #848484;
        cursor: pointer;
        & > img {
          position: absolute;
          left: 50%;
          bottom: 100%;
          transform: translate(-50%, 0);
        }
      }
      .active-lab {
        background: #dcece3;
        color: #05c65d;
        border: 1px dotted #c9c7c7;
      }
    }
    .footer2 {
      margin: 10px 0;
      height: 32px;
      line-height: 32px;
      padding: 20px 20px;
      background-color: #fff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
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
.table-box1 {
  ::v-deep .el-table {
    margin-top: 20px;
    .font-red {
      color: red;
    }
  }
  .button-box {
    display: flex;
    .commonbtn {
      margin: 0 5px;
      min-width: 80px;
    }
  }
  // padding: 12px 20px 20px;
  // width: 100%;
  // height: 620px;
  // background-color: #fff;
  // box-sizing: border-box;
  // .table-title {
  //   text-align: left;
  //   height: 30px;
  //   line-height: 30px;
  //   span:nth-of-type(2) {
  //     float: right;
  //   }
  // }
  // .table-scoll {
  //   height: 520px;
  //   overflow-y: auto;
  // }
  button {
    margin-top: 10px;
  }
  // & > :nth-child(3) {
  //   float: right;
  //   margin-right: 20px;
  // }
}

// 分页
.el-pagination ::v-deep .number:hover {
  color: #05c65d !important;
}
.el-pagination ::v-deep .active {
  background-color: #05c65d !important;
  &:hover {
    color: #fff !important;
  }
}
.font-simple {
  cursor: pointer;
  margin: 0 4px;
  &:hover {
    color: #05c65d;
  }
}
.font-simple-disable {
  margin: 0 4px;
}
.font-red {
  color: #de4747 !important;
}
.delete-text {
  width: 100%;
}
.font-green {
  color: #05c65d !important;
}
.font-yellow {
  color: #eea359;
}
.font-green-bg {
  padding: 0 8px;
  display: inline-block;
  // min-width: 30px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background-color: #05c65d;
  border-radius: 10px;
  cursor: pointer;
}
.font-yellow-bg {
  padding: 0 8px;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background-color: #eea359;
  border-radius: 10px;
  cursor: pointer;
}
.font-none-bg {
  padding: 0 8px;
  display: inline-block;
  width: 44px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  border-radius: 10px;
  cursor: default !important;
}
.share-to {
  width: 86px;
}
.font-end-bg {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  color: red;
  cursor: default !important;
}
.font-red-bg {
  padding: 0 8px;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background-color: #de4747;
  border-radius: 10px;
  cursor: pointer;
}
.el-input-number ::v-deep .el-input {
  height: 20px !important;
}
.sel-p {
  // width: 80px;
  height: 30px;
  line-height: 30px;
  img {
    float: left;
    margin-left: 26%;
    margin-top: 5px;
    width: 20px;
    height: 20px;
  }
  span {
    float: left;
  }
}
.operation {
  justify-content: space-between;
  div {
    // width: 90px;
    height: 30px;
    cursor: pointer;
    img {
      width: 16px;
      height: 16px;
    }
    p {
      height: 2px;
      line-height: 2px;
      font-size: 12px;
      color: #05c65d;
    }
  }
  .gray {
    color: #8e8e8e;
  }
}
.mr_span {
  padding: 0 8px;
  background-color: #05c65d;
  margin-right: 20px;
  cursor: pointer;
  color: #fff !important;
}
.mr_span:hover {
  color: #c1ffd0 !important;
}
.tab-box {
  margin-top: 10px;
  width: 100%;
  height: 300px;
}
.tab-box ::v-deep .el-table__body-wrapper {
  height: 300px;
  overflow-y: auto;
}
.tab-box ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
}
</style>
<style lang="scss">
.conflict-box {
  p {
    display: flex;
    align-items: center;
    width: 230px;
    height: 30px;
  }
  p:nth-of-type(1) {
    padding: 0 6px;
    display: flex;
    align-items: center;
    height: 30px;
    border-radius: 5px;
    background: #f3d6d6;
    span {
      color: #de4747;
    }
    span:nth-of-type(2) {
      font-weight: bold;
      margin-left: 50px;
    }
  }
  p:nth-of-type(2) {
    width: 160px;
    height: 30px;
    line-height: 30px;
    color: #05c65d;
    border-bottom: #05c65d 1px solid;
  }
  .detail-span {
    span {
      margin: 0 4px;
    }
  }
  // .font-green {
  //   color: #05c65d;
  // }
  // .font-yellow {
  //   color: #05c65d;
  // }
  // .font-red {
  //   color: #05c65d;
  // }
}
.table-box1 {
  ::v-deep .el-table {
    margin-top: 20px;
    .font-red {
      color: red;
    }
  }
  .button-box {
    display: flex;
    .commonbtn {
      margin: 0 5px;
      min-width: 80px;
    }
  }
  // padding: 12px 20px 20px;
  // width: 100%;
  // height: 620px;
  // background-color: #fff;
  // box-sizing: border-box;
  // .table-title {
  //   text-align: left;
  //   height: 30px;
  //   line-height: 30px;
  //   span:nth-of-type(2) {
  //     float: right;
  //   }
  // }
  // .table-scoll {
  //   height: 520px;
  //   overflow-y: auto;
  // }
  button {
    margin-top: 10px;
  }
  // & > :nth-child(3) {
  //   float: right;
  //   margin-right: 20px;
  // }
}
</style>
