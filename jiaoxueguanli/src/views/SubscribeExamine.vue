<template>
  <div class="lab-home">
    <p v-show="pageState === 0">
      <img src="@images/subscribe/title-icon.png" alt="" />
      实验预约审核课程表
      <el-select v-model="labNow" placeholder="请选择">
        <el-option label="全部实验室" :value="0" />
        <el-option :label="'教室'" :value="-1" />
        <el-option
          v-for="item in labList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span class="fr radio-box">
        <el-radio
          v-model="gradeNow"
          :label="item"
          v-for="(item, index) in gradeList"
          :key="index"
        >
          {{ item === 7 ? '七年级' : item === 8 ? '八年级' : '九年级' }}
        </el-radio>
      </span>
    </p>
    <div
      v-show="pageState === 0"
      class="lab-header"
      :style="{
        color:
          labNow === 0
            ? '#333'
            : labNow === 11
            ? '#A57CE3'
            : labNow === 12
            ? '#F17D59'
            : labNow === 15
            ? '#b1af3c'
            : labNow === 16
            ? '#327cad'
            : labNow === 17
            ? '#5FAFE4'
            : labNow === 18
            ? '#71d4c7'
            : '#4C854C',
      }"
    >
      {{ laboratoryShow(labNow) }}
    </div>
    <div v-show="pageState === 0" class="flex sub-body">
      <div class="surface">
        <div>
          <p>周次</p>
          <ul>
            <li
              :class="[
                weekNow === item.index ? 'week-on' : '',
                weekNowObj.week > index + 1 ? 'broy-bg' : '',
              ]"
              @click="selWeek(item.index)"
              v-for="(item, index) in weekList"
              :key="index"
            >
              {{ item.week }}<span v-show="'count' in item">{{ item.count }}</span>
            </li>
          </ul>
        </div>
        <div>
          <p><img src="@images/subscribe/time.png" alt="" />时段</p>
          <div>
            <div>
              <div><p>上午</p></div>
              <div><p>下午</p></div>
            </div>
            <div>
              <div>
                <div>第一节</div>
                <div>第二节</div>
                <div>第三节</div>
                <div>第四节</div>
              </div>
              <div>
                <div>第五节</div>
                <div>第六节</div>
                <div>第七节</div>
                <div>第八节</div>
                <div>第九节</div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(item, index) in expTable" :key="index">
          <div>
            <div
              class="bar"
              :style="{
                backgroundColor:
                  labNow === 0
                    ? '#333'
                    : labNow === 11
                    ? '#A57CE3'
                    : labNow === 12
                    ? '#F17D59'
                    : labNow === 15
                    ? '#b1af3c'
                    : labNow === 16
                    ? '#327cad'
                    : labNow === 17
                    ? '#5FAFE4'
                    : labNow === 18
                    ? '#71d4c7'
                    : '#4C854C',
              }"
            />
            <p class="week">{{ item.weekDate }}</p>
            <!-- <p class="date">{{item.date}}</p> -->
          </div>
          <div class="item" v-for="(item1, index1) in item.curriculum" :key="index1">
            <div v-show="'num' in item1" @click="clickItem(item1, index + 1, index1 + 1)">
              <div
                class="sub-msg-box"
                :style="{
                  backgroundColor:
                    item1.laboratoryArr && item1.laboratoryArr.length > 1
                      ? '#333'
                      : item1.status === 0 || item1.is_del === -1
                      ? '#848484'
                      : item1.laboratory_id === 11
                      ? '#A57CE3'
                      : item1.laboratory_id === 12
                      ? '#F17D59'
                      : item1.laboratory_id === 15
                      ? '#b1af3c'
                      : item1.laboratory_id === 16
                      ? '#327cad'
                      : item1.laboratory_id === 17
                      ? '#5FAFE4'
                      : item1.laboratory_id === 18
                      ? '#71d4c7'
                      : '#4C854C',
                }"
              >
                <p class="one" :title="item1.name">{{ item1.name }}</p>
                <p
                  v-if="item1.laboratory_id === -1"
                  class="one"
                  :title="item1.laboratory"
                >
                  教室（演示）
                </p>
                <p
                  v-if="item1.laboratory_id !== -1"
                  class="one"
                  :title="item1.laboratory"
                >
                  {{ item1.laboratory }}
                </p>
                <div>
                  <span>{{ item1.num }}</span>
                </div>
                <img
                  v-show="item1.status === 2"
                  src="@images/subscribe/pass.png"
                  alt=""
                />
                <img
                  v-show="item1.status === 1"
                  src="@images/subscribe/stay.png"
                  alt=""
                />
                <img
                  v-show="item1.status === -1"
                  src="@images/subscribe/error.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="detail-box" v-show="propState" @click="hideDetail">
          <div class="msg-box" id="msgBox">
            <div class="header">
              {{ '实验审核' }}
              <img
                src="@images/subscribe/close.png"
                alt=""
                @click=";(propState = false), (activeIndex = '0')"
              />
            </div>
            <div class="msg-body-sco">
              <el-tabs type="border-card" v-model="activeIndex">
                <el-tab-pane
                  v-for="(item, index) in newDataList"
                  :key="index"
                  :label="item.name !== null ? item.name : '未命名'"
                >
                  <div class="msg-body">
                    <p>
                      <span class="ms_span">实验名称</span>
                      {{ item.name !== null ? item.name : '未命名' }}
                    </p>
                    <p>
                      <span class="ms_span">预约教师</span>
                      {{ item.teacher_name }}
                    </p>
                    <p>
                      <span class="ms_span">实验类型</span>
                      <el-radio disabled v-model="item.type" :label="1"> 分组 </el-radio>
                      <el-radio disabled v-model="item.type" :label="2"> 演示 </el-radio>
                      <el-radio disabled v-model="item.type" :label="3"> 其他 </el-radio>
                    </p>
                    <p>
                      <span class="ms_span">年级</span>
                      <span v-for="(e, index) in item.grade" :key="index">
                        {{ $store.state.gradeArr[e] }}
                      </span>
                    </p>
                    <p>
                      <span class="ms_span">班级</span>
                      {{ item.class_id !== -1 ? item.class_name : '活动班' }}
                    </p>
                    <p>
                      <span class="ms_span">分组</span>
                      {{ item.number_groups }} 人/组
                    </p>
                    <p>
                      <span class="ms_span">实验仪器</span>
                      <el-popover
                        placement="right"
                        width="240"
                        @show="instrumentList(item)"
                        trigger="click"
                      >
                        <div class="instrument-list">
                          <p>仪器详情</p>
                          <ul>
                            <li v-for="(item1, index) in tableData1" :key="index">
                              <span :title="item1.name">{{ item1.name }}</span>
                              <span>{{ item1.true_num + ' 个' }}</span>
                            </li>
                            <li v-show="tableData1.length === 0">
                              <span>暂无</span>
                            </li>
                          </ul>
                          <p>仪器备注</p>
                          <ul>
                            <li>
                              <span :title="instrumentTip">{{
                                instrumentTip === '' ? '暂无' : instrumentTip
                              }}</span>
                            </li>
                          </ul>
                        </div>
                        <span slot="reference" class="havecolor"
                          >{{ item.number_instruments }} 套</span
                        >
                      </el-popover>
                    </p>
                    <p>
                      <span class="ms_span">实验室</span>
                      <!-- <el-select v-show="item.status !== 2" v-model="item.laboratory_id" placeholder="请选择">
                        <el-option
                          :label="'教室'"
                          :value="-1"/>
                        <el-option
                          v-for="(item1, index) in labList"
                          :key="index"
                          :label="item1.id"
                          :value="item1.id"/>
                      </el-select> -->
                      <span>{{ laboratoryShow(item.laboratory_id) }}</span>
                      <el-popover
                        placement="right"
                        width="240"
                        @show="showConflict(item)"
                        trigger="click"
                      >
                        <div class="conflict-box">
                          <p v-show="item.is_conflict === 1">
                            <img
                              src="@images/experimentalRecord/icon-red.png"
                              alt=""
                            /><span>预警提醒</span><span>实验室冲突!!!</span>
                          </p>
                          <p>调整建议如下</p>
                          <!-- <p v-for="(item, index) in conflictData" :key="index">
                            <span>{{ item.laboratory }}</span>
                            <span class="font-red">{{ item.status }}</span>
                            <span>{{ item.status2 }}</span>
                          </p> -->
                          <el-radio-group
                            v-model="item.laboratory_id"
                            :disabled="item.status === 2"
                          >
                            <el-radio :label="-1">教室</el-radio>
                            <el-radio
                              v-for="(item1, index) in conflictData"
                              :key="index"
                              :label="item1.id"
                            >
                              <span>{{ item1.laboratory }}</span>
                              <span
                                :class="[
                                  item1.status === '可用' ? 'font-green' : 'font-red',
                                ]"
                                >{{ item1.status }}</span
                              >
                              <span class="font-yellow">{{ item1.status2 }}</span>
                            </el-radio>
                          </el-radio-group>
                        </div>
                        <span
                          v-if="item.status !== 0"
                          slot="reference"
                          :class="[
                            item.is_conflict === 1 ? 'font-red' : 'font-green',
                            'need-change',
                          ]"
                        >
                          <img
                            v-show="item.is_conflict === 1"
                            src="@images/experimentalRecord/icon-red.png"
                            alt=""
                          />调整
                        </span>
                      </el-popover>
                    </p>
                    <p>
                      <span class="ms_span">提交说明</span>
                      {{
                        item.status2 === 0
                          ? '已提交'
                          : item.status2 === 1
                          ? '已取消'
                          : item.status2 === 2
                          ? '已取消'
                          : item.status2 === 3
                          ? '重新提交'
                          : item.status2 === 4
                          ? '重新提交'
                          : '未提交'
                      }}
                    </p>
                    <p><span class="ms_span">备注</span></p>
                    <el-input
                      disabled
                      type="textarea"
                      placeholder="请输入备注..."
                      v-model="item.tips"
                      maxlength="60"
                      resize="none"
                      :rows="4"
                      show-word-limit
                    />
                    <p>
                      <span class="ms_span">审核备注</span>
                      <span
                        class="mr_span"
                        @click="item.ex_admin_tips = item1.tips"
                        v-for="(item1, index) in $store.state.manage"
                        :key="index"
                        >{{ item1.tips }}</span
                      >
                    </p>
                    <el-input
                      :disabled="item.status === 2"
                      type="textarea"
                      placeholder="请输入备注..."
                      v-model="item.ex_admin_tips"
                      maxlength="60"
                      resize="none"
                      :rows="4"
                      show-word-limit
                    />
                    <div class="msg-date">
                      <p>预约时间</p>
                      <p>{{ $store.state.weekTimeArr[item.week_time] }}</p>
                      <p>{{ $store.state.weekArr[item.weekend] }}</p>
                      <p>{{ '第' + item.section + '节' }}</p>
                    </div>
                  </div>
                  <div
                    v-show="
                      isHaveEnd ? item.end === 0 && item.is_del === 0 : item.is_del === 0
                    "
                    class="footer2"
                  >
                    <p v-show="item.status === -1">已拒绝</p>
                    <p v-show="item.status === 0">已取消</p>
                    <button
                      v-show="item.status === 1 || item.status === 2"
                      class="graybtn my-button mr12"
                      @click=";(propState = false), (activeIndex = '0')"
                    >
                      取消
                    </button>
                    <button
                      v-show="item.status === 1"
                      class="redbtn my-button"
                      @click="sureClick(item, -1)"
                    >
                      拒绝
                    </button>
                    <button
                      v-show="item.status === 1"
                      class="commonbtn my-button ml12"
                      @click="sureClick(item, 2)"
                    >
                      确认
                    </button>
                    <button
                      v-show="item.status === 1 && newDataList.length > 1"
                      class="commonbtn my-button ml12"
                      @click="sureClick(item, 2, 'next')"
                    >
                      确认并继续
                    </button>
                    <button
                      v-show="item.status === 2"
                      class="commonbtn my-button"
                      :class="{ graybtn: item.unchange === 1 }"
                      @click="sureClick(item, 1)"
                    >
                      取消审核
                    </button>
                    <button
                      v-show="item.status === 2"
                      class="commonbtn my-button ml12"
                      @click="instrumentClick(item)"
                    >
                      准备仪器
                    </button>
                  </div>
                  <div v-show="isHaveEnd && item.end === 1" class="footer2">
                    <p>已结束</p>
                  </div>
                  <div
                    v-show="
                      isHaveEnd
                        ? item.end === 0 && item.is_del === -1
                        : item.is_del === -1
                    "
                    class="footer2"
                  >
                    <p>已撤销</p>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="pageState === 1">
      <div class="header1">
        仪器列表
        <button class="graybtn" @click="pageState = 0">返回审核列表</button>
      </div>
      <div class="base-msg-box">
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
            <span> 实验名称 </span>
            <span>
              {{ instrumentData.name }}
            </span>
          </p>
        </div>
        <div>
          <p>
            <span> 实验班级 </span>
            <span>
              {{ instrumentData.class_name }}
            </span>
          </p>
          <p>
            <span> 实验类型 </span>
            <span>
              {{
                instrumentData.type === 1
                  ? '分组'
                  : instrumentData.type === 2
                  ? '演示'
                  : '其他'
              }}
            </span>
          </p>
          <p>
            <span> 实验地点 </span>
            <span>
              {{ instrumentData.laboratory }}
            </span>
          </p>
        </div>
        <div>
          <p>预约备注</p>
          <p>{{ instrumentData.tips }}</p>
        </div>
      </div>
      <!-- <p>所需套数<el-input-number v-model="number_instruments" :min="1" :max="1000" label="描述文字"/></p> -->
      <div class="table-box1">
        <div class="table-title">
          <span>仪器备注：{{ tips }}</span>
          <span>套数：{{ multiple }}</span>
        </div>
        <div class="table-scoll">
          <el-table
            :data="tableData1"
            border
            stripe
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column type="index" label="序号" width="80px" sortable />
            <el-table-column prop="number" label="分类编号" sortable />
            <el-table-column prop="name" label="仪器名称" sortable />
            <el-table-column prop="info" label="规格" sortable />
            <el-table-column
              prop="num"
              label="每组数量"
              sortable
              :sort-method="
                (a, b) => {
                  return a.num - b.num
                }
              "
            >
              <!-- <template slot-scope="scope">
                <el-input-number v-model="scope.row.num" :min="0" :max="scope.row.inventory" label="描述文字"/>
              </template> -->
            </el-table-column>
            <el-table-column
              prop="true_num"
              :label="multiple + '组总数量'"
              sortable
              :sort-method="
                (a, b) => {
                  return a.true_num - b.true_num
                }
              "
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.true_num"
                  :min="0"
                  :max="scope.row.inventory"
                  label="描述文字"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="inventory"
              label="库存所有数量"
              sortable
              :sort-method="
                (a, b) => {
                  return a.inventory - b.inventory
                }
              "
            />
            <el-table-column prop="library" label="仪器库" sortable>
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.librarys" :key="index">
                  {{ item.name + '(' }}
                  <span class="font-green">{{ item.num + '个' }}</span>
                  )<br />
                </span>
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
            <el-table-column prop="tips" label="备注" sortable />
          </el-table>
        </div>
        <button class="commonbtn" @click="add">新增 +</button>
        <button class="commonbtn" @click="saveMaterial">保存</button>
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
              <el-table-column type="selection" width="55" />
              <el-table-column prop="number" label="分类编号" width="150" />
              <el-table-column prop="name" label="仪器名称" width="150" />
              <el-table-column prop="info" label="规格" show-overflow-tooltip />
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
    <div v-show="pageState === 2">
      <div class="header1">
        仪器列表
        <button class="graybtn" @click="pageState = 0">返回审核列表</button>
      </div>
      <div class="base-msg-box">
        <div>
          <p>
            <span> 实验时间 </span>
            <span> 第一周/星期三/第二节次 </span>
          </p>
          <p>
            <span> 实验名称 </span>
            <span> 氧气的制取 </span>
          </p>
        </div>
        <div>
          <p>
            <span> 实验班级 </span>
            <span> 七年级(1)班 </span>
          </p>
          <p>
            <span> 实验类型 </span>
            <span> 分组 </span>
          </p>
          <p>
            <span> 实验地点 </span>
            <span> 化学实验室1 </span>
          </p>
        </div>
        <div>
          <p>预约备注</p>
          <p>我预约了实验室</p>
        </div>
      </div>
      <div class="table-box1">
        <div style="text-align: left">
          <span>仪器备注：</span>
          {{ tips }}
        </div>
        <el-table
          :data="tableData1"
          border
          stripe
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column prop="index" label="序号">
            <template slot-scope="scope">
              <span>{{ scope.row.index }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="分类编号" />
          <el-table-column prop="name" label="仪器名称" />
          <el-table-column prop="info" label="规格" />
          <el-table-column prop="num" label="需要数量">
            <template slot-scope="scope">
              <el-input-number
                disabled
                v-model="scope.row.requirements"
                :min="1"
                :max="scope.row.store"
                label="描述文字"
              />
            </template>
          </el-table-column>
          <el-table-column prop="inventory" label="库存所有数量" />
          <el-table-column prop="library" label="仪器库" />
          <el-table-column prop="ambry" label="橱柜" />
          <el-table-column prop="layer_number" label="层数" />
          <el-table-column prop="tips" label="备注" />
        </el-table>
        <!-- <button class="commonbtn">新增 + </button>
        <button class="commonbtn">保存</button> -->
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
    <!-- <Footer/> -->
  </div>
</template>

<script>
import { labExpDate, getDatebyweek } from '../network/subscribe'
import { ExpMaterialFind } from '@/network/experimentPlan'
import {
  adjustLaboratory,
  getLaboratoryByUser,
  examInstrument,
  addBookMaterial,
  getConflict,
} from '../network/subExamine'
export default {
  name: 'Subscribe',
  data() {
    return {
      // 按钮状态
      bigState: 1,
      propState: false,
      isHaveEnd: false, // 是否具有结束状态
      activeIndex: '0',
      input: '',
      labNow: 0,
      tips: '',
      multiple: 0,
      labList: [],
      weekList: [
        {
          week: '第一周',
          index: 1,
        },
        {
          week: '第二周',
          index: 2,
        },
        {
          week: '第三周',
          index: 3,
        },
        {
          week: '第四周',
          index: 4,
        },
        {
          week: '第五周',
          index: 5,
        },
        {
          week: '第六周',
          index: 6,
        },
        {
          week: '第七周',
          index: 7,
        },
        {
          week: '第八周',
          index: 8,
        },
        {
          week: '第九周',
          index: 9,
        },
        {
          week: '第十周',
          index: 10,
        },
        {
          week: '十一周',
          index: 11,
        },
        {
          week: '十二周',
          index: 12,
        },
        {
          week: '十三周',
          index: 13,
        },
        {
          week: '十四周',
          index: 14,
        },
        {
          week: '十五周',
          index: 15,
        },
        {
          week: '十六周',
          index: 16,
        },
        {
          week: '十七周',
          index: 17,
        },
        {
          week: '十八周',
          index: 18,
        },
        {
          week: '十九周',
          index: 19,
        },
        {
          week: '二十周',
          index: 20,
        },
      ],
      newData: {
        name: '',
        exp_id: null,
        plan_detail_id: null,
        type: null,
        grade: null,
        class_id: null,
        number_groups: null,
        number_instruments: null,
        laboratory_id: null,
        tips: '',
        week_time: null,
        weekend: null,
        section: null,
      },
      newDataList: [],
      weekNow: 0,
      expTable: [
        {
          weekDate: '星期一',
          date: '4.2',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期二',
          date: '4.3',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期三',
          date: '4.4',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期四',
          date: '4.5',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期五',
          date: '4.6',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期六',
          date: '4.7',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期日',
          date: '4.8',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
      ],
      planList: [],
      planListMine: [],
      gradeList: this.$store.state.userMsg.grade,
      gradeNow: this.$store.state.userMsg.grade[0],
      value: '',
      dayList: [
        {
          value: 1,
          name: '周一',
          state: false,
        },
        {
          value: 2,
          name: '周二',
          state: false,
        },
        {
          value: 3,
          name: '周三',
          state: false,
        },
        {
          value: 4,
          name: '周四',
          state: false,
        },
        {
          value: 5,
          name: '周五',
          state: false,
        },
        {
          value: 6,
          name: '周六',
          state: false,
        },
        {
          value: 7,
          name: '周日',
          state: false,
        },
      ],
      tableData: [
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 1,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 2,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 3,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 4,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
      ],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      conflictData: [],
      currentPage3: 1,
      weekNowObj: {
        week: '',
        year: '',
        datatimeArr: [{ time: '' }],
        term_num: 1,
      },
      pageState: 0,
      instrumentTip: '',
      instrumentData: {},
      number_instruments: 0,
      dialogVisible: false,
    }
  },
  watch: {
    gradeNow(val) {
      console.log(val)
      this.getTableDateLab(this.labNow)
    },
    weekNow() {
      this.getTableDateLab(this.labNow)
    },
    labNow(val) {
      this.getTableDateLab(val)
    },
  },
  computed: {
    laboratoryShow() {
      return function (id) {
        let name = '教室'
        if (id === 0) {
          name = '全部实验室'
        }
        this.labList.forEach((e) => {
          if (e.id === id) {
            name = e.name
          }
        })
        return name
      }
    },
  },
  created() {
    this.getLabList()
    this.getYearTermData()
  },
  methods: {
    getLabList() {
      getLaboratoryByUser().then((res) => {
        this.labList = res.data
      })
    },
    getYearTermData() {
      getDatebyweek().then((res) => {
        this.weekNow = res.data.week <= 20 ? res.data.week : 20
        this.weekNowObj = res.data
        // this.getTableDateLab(this.labNow)
      })
    },
    hideDetail(event) {
      var msg = document.getElementById('msgBox')
      if (msg) {
        if (!msg.contains(event.target)) {
          this.propState = false
          this.activeIndex = '0'
        }
      }
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
    add() {
      this.dialogVisible = true
      const data = {
        subject_id: this.instrumentData.subject_id,
        name: this.input,
      }
      ExpMaterialFind(data).then((res) => {
        console.log(res)
        this.tableData3 = res.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
      this.tableData2 = val
    },
    determine() {
      this.dialogVisible = false
      this.tableData2.map((item, index) => {
        item.index = index + 1
        item.material_number = item.number
        item.materialname = item.name
        item.num = 1
        item.true_num = 1 * this.multiple
      })
      this.tableData2 = JSON.parse(JSON.stringify(this.tableData2))
      this.tableData1.push(...this.tableData2)
    },
    selExp(item) {
      console.log(item)
      this.newData.name = item.name
      if (item.is_group === 1) {
        this.newData.type = 1
      } else {
        this.newData.type = 2
      }
      this.newData.exp_id = item.exp_scheme_id
      this.newData.plan_detail_id = item.plan_id
    },
    saveMaterial() {
      const arr = []
      this.tableData1.map((e) => {
        arr.push({
          id: e.id,
          material_number: e.material_number,
          num: e.num,
          true_num: e.true_num,
          sequence: e.sequence,
          tip: e.tip,
        })
      })
      const data = {
        id: this.instrumentData.id,
        number: this.number_instruments,
        multiple: this.multiple,
        detail: arr,
      }
      this.$confirm('仪器是否准备完毕', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          addBookMaterial(data).then((res) => {
            console.log(res)
            this.instrumentClick(this.instrumentData)
            this.getTableDateLab(this.labNow)
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
    // 获取表格数据筛选实验室
    getTableDateLab(labId) {
      const data = {
        week_time: this.weekNow,
        grade: this.gradeNow,
      }
      labExpDate(data).then((res) => {
        console.log(res)
        this.weekList = [
          {
            week: '第一周',
            index: 1,
          },
          {
            week: '第二周',
            index: 2,
          },
          {
            week: '第三周',
            index: 3,
          },
          {
            week: '第四周',
            index: 4,
          },
          {
            week: '第五周',
            index: 5,
          },
          {
            week: '第六周',
            index: 6,
          },
          {
            week: '第七周',
            index: 7,
          },
          {
            week: '第八周',
            index: 8,
          },
          {
            week: '第九周',
            index: 9,
          },
          {
            week: '第十周',
            index: 10,
          },
          {
            week: '十一周',
            index: 11,
          },
          {
            week: '十二周',
            index: 12,
          },
          {
            week: '十三周',
            index: 13,
          },
          {
            week: '十四周',
            index: 14,
          },
          {
            week: '十五周',
            index: 15,
          },
          {
            week: '十六周',
            index: 16,
          },
          {
            week: '十七周',
            index: 17,
          },
          {
            week: '十八周',
            index: 18,
          },
          {
            week: '十九周',
            index: 19,
          },
          {
            week: '二十周',
            index: 20,
          },
        ]
        res.data.refused.forEach((e) => {
          this.weekList[e.week_time - 1].count = e.Count
        })
        this.weekList = JSON.parse(JSON.stringify(this.weekList))
        if (res.code === 10) {
          this.expTable = [
            {
              weekDate: '星期一',
              date: '4.2',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期二',
              date: '4.3',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期三',
              date: '4.4',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期四',
              date: '4.5',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期五',
              date: '4.6',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期六',
              date: '4.7',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期日',
              date: '4.8',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
          ]
          res.data.list.sort((a, b) => {
            return b.is_del - a.is_del
          })
          res.data.list.forEach((e) => {
            if (e.laboratory_id === labId || labId === 0) {
              if ('name' in this.expTable[e.weekend - 1].curriculum[e.section - 1]) {
                this.expTable[e.weekend - 1].curriculum[e.section - 1].num++
                if (
                  this.expTable[e.weekend - 1].curriculum[
                    e.section - 1
                  ].laboratoryArr.indexOf(e.laboratory) === -1
                ) {
                  this.expTable[e.weekend - 1].curriculum[
                    e.section - 1
                  ].laboratoryArr.push(e.laboratory)
                }
              } else {
                this.expTable[e.weekend - 1].curriculum[e.section - 1] = e
                this.expTable[e.weekend - 1].curriculum[e.section - 1].num = 1
                this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr = [
                  e.laboratory,
                ]
              }
            }
          })
          console.log(this.expTable)
        }
      })
    },
    // 获取表格数据
    getTableDate() {
      const data = {
        week_time: this.weekNow,
        grade: this.gradeNow,
      }
      labExpDate(data).then((res) => {
        console.log(res)
        res.data.refused.forEach((e) => {
          this.weekList[e.week_time - 1].count = e.Count
        })
        this.weekList = JSON.parse(JSON.stringify(this.weekList))
        console.log(this.weekList)
        if (res.code === 10) {
          this.expTable = [
            {
              weekDate: '星期一',
              date: '4.2',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期二',
              date: '4.3',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期三',
              date: '4.4',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期四',
              date: '4.5',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期五',
              date: '4.6',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期六',
              date: '4.7',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期日',
              date: '4.8',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}],
            },
          ]
          res.data.list.sort((a, b) => {
            return b.is_del - a.is_del
          })
          res.data.list.forEach((e) => {
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
    selWeek(index) {
      this.weekNow = index
    },
    showConflict(data) {
      getConflict({
        id: data.id,
      }).then((res) => {
        this.conflictData = res.data
      })
    },
    sureClick(item, index, is_next) {
      delete this.newData.name
      const data = {
        id: item.id,
        laboratory_id: item.laboratory_id,
        tips: item.ex_admin_tips,
        status: index,
      }
      if (index === 1) {
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
              adjustLaboratory(data).then((res) => {
                if (res.code === 10) {
                  this.getTableDateLab(this.labNow)
                  this.propState = false
                  this.activeIndex = '0'
                  // this.clickItem(item, item.weekend, item.section)
                  this.$message({
                    message: '已取消审核',
                    type: 'success',
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
      } else {
        adjustLaboratory(data).then((res) => {
          console.log(res)
          if (res.code === 10) {
            // this.propState = false
            if (index === 2) {
              this.getTableDateLab(this.labNow)
              if (is_next === 'next') {
                // this.propState = false
                this.activeIndex = '0'
                this.clickItem(item, item.weekend, item.section)
              } else {
                this.propState = false
                this.activeIndex = '0'
              }
              this.$message({
                message: '审核通过',
                type: 'success',
              })
            } else if (index === -1) {
              this.propState = false
              this.activeIndex = '0'
              this.getTableDateLab(this.labNow)
              this.$message({
                message: '实验室申请已拒绝',
                type: 'success',
              })
            }
          }
        })
      }
    },
    // 点击表格
    clickItem(item, weekend, section) {
      this.rBChange = true
      const data = {
        week_time: this.weekNow,
        grade: this.gradeNow,
      }
      labExpDate(data).then((res) => {
        this.propState = true
        res.data.list.sort((a, b) => {
          return b.is_del - a.is_del
        })
        const arr = res.data.list.filter(
          (e) =>
            e.week_time === this.weekNow && e.weekend === weekend && e.section === section
        )
        arr.forEach((e) => {
          e.yiqi = false
          if (!('ex_admin_tips' in e)) {
            e.ex_admin_tips = ''
          }
        })
        this.newDataList = arr
        console.log(arr)
      })
      // if ('name' in item) {
      console.log(1)
      this.newData = {
        name: item.name,
        exp_id: item.exp_id,
        plan_detail_id: item.plan_detail_id,
        type: item.type,
        grade: item.grade,
        class_id: item.class_id,
        number_groups: item.number_groups,
        number_instruments: item.number_instruments,
        laboratory_id: item.laboratory_id,
        tips: item.tips,
        week_time: item.week_time,
        weekend: item.weekend,
        section: item.section,
        id: item.id,
      }
      // } else {
      //   this.btnState = 1
      //   this.newData.grade = this.gradeNow
      //   this.newData.week_time = this.weekNow
      //   this.newData.weekend = weekend
      //   this.newData.section = section
      // }
    },
    // 仪器准备
    instrumentClick(item) {
      console.log(item)
      this.instrumentData = item
      this.pageState = 1
      const data = {
        id: item.id,
      }
      examInstrument(data).then((res) => {
        console.log(res)
        this.tips = res.data.tips
        this.multiple = res.data.multiple
        this.tableData1 = res.data.data.map((e) => {
          return e
        })
        this.number_instruments = res.data.number_instruments
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
  },
}
</script>

<style scoped lang="scss">
.lab-home {
  position: relative;
  box-sizing: border-box;
  padding: 8px 32px 0 32px;
  width: 100%;
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
        padding-top: 10px;
        height: 78px;
        margin-bottom: 4px;
        background-color: #fff;
        cursor: pointer;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
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
      & > :nth-child(5) {
        margin-bottom: 8px;
      }
    }
    & > :nth-child(1) {
      flex: none;
      width: 80px;
      background-color: #fff;
      p {
        font-size: 16px;
        color: #05c65d;
        margin-bottom: 8px;
        height: 50px;
        line-height: 50px;
        box-shadow: none;
        opacity: 1;
      }
      ul {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 827px;
      }
      ul li {
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        position: relative;
        span {
          position: absolute;
          top: -4px;
          right: -10px;
          width: 20px;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          background-color: #e66f6f;
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
        height: 736px;
        width: 100%;
        & > :nth-child(1) {
          float: left;
          width: 40px;
          & > :nth-child(1) {
            width: 40px;
            height: 364px;
            background-color: #fff;
            margin-bottom: 8px;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            p {
              padding: 134px 12px;
              width: 16px;
              height: 96px;
              line-height: 48px;
              font-size: 16px;
              color: #05c65d;
            }
          }
          & > :nth-child(2) {
            width: 40px;
            height: 455px;
            background-color: #fff;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            p {
              padding: 134px 12px;
              width: 16px;
              height: 96px;
              line-height: 48px;
              font-size: 16px;
              color: #05c65d;
            }
          }
        }
        & > :nth-child(2) {
          float: right;
          & > :nth-child(1) {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            width: 40px;
            height: 364px;
            margin-bottom: 8px;
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
.broy-bg {
  background: #fff;
  color: #000;
}
.week-on {
  background-color: #eea359;
  color: #fff;
}
.sel-bg {
  background-color: #eea359;
  color: #fff;
}
.radio-box {
  width: 100px;
  padding-right: 100px;
}
.sub-msg-box {
  position: relative;
  margin: auto;
  height: 68px;
  width: 89.7%;
  border-radius: 4px;
  background-color: #51a8ff;
  & > :nth-child(1) {
    padding-top: 16px;
    margin-left: 15%;
    width: 70%;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
  }
  & > :nth-child(2) {
    padding-top: 8px;
    margin-left: 15%;
    width: 70%;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
  }
  & > :nth-child(3) {
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
    top: -8px;
    right: -5px;
  }
}
.lab-header {
  margin: 0 auto 7px;
  width: 300px;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  color: #333333;
  background-color: #fff;
}
.bar-black {
  background-color: #333;
}
.bar-green {
  background-color: #4c854c;
}
.bar-purple {
  background-color: #a57ce3;
}
.bar-orange {
  background-color: #f17d59;
}
.bar-yellow {
  background-color: #b1af3c;
}
.font-black {
  color: #333;
}
.font-green {
  color: #4c854c;
}
.font-purple {
  color: #71d4c7;
}
.font-orange {
  color: #496e18;
}
.font-yellow {
  color: #b1af3c;
}
.one {
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space: nowrap;
}
.msg-body-sco {
  // height: 610px;
  // background-color: aqua;
  overflow-y: auto;
  .el-tabs__content {
    .el-textarea {
      height: 70px;
      ::v-deep .el-textarea__inner {
        height: 70px;
      }
    }
  }
}
.msg-body-sco::-webkit-scrollbar {
  width: 6px;
  // background-color: #94e7ba;
}
.msg-body-sco::-webkit-scrollbar-thumb {
  background-color: #c3ffde;
  border-radius: 10px;
}
.msg-body-sco::-webkit-scrollbar-track {
  border-radius: 10px;
  // background-color: white;
}
.lab-home {
  .sel-div1 {
    padding: 0 12px;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    width: 100%;
    color: #626572;
    text-align: left;
    background-color: #fff;
    & > :nth-child(1) {
      float: left;
      width: 7%;
      color: #05c65d;
    }
    & > :nth-child(2) {
      float: left;
      width: 93%;
      span {
        margin-right: 30px;
        cursor: pointer;
        &:hover {
          color: #05c65d;
        }
      }
    }
  }
  .sel-div2 {
    padding: 0 12px;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    width: 100%;
    color: #626572;
    background-color: #fff;
    text-align: left;
    & > :nth-child(1) {
      float: left;
      width: 7%;
      color: #05c65d;
    }
    & > :nth-child(2) {
      float: left;
      width: 93%;
      span {
        margin-right: 30px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          color: #05c65d;
        }
      }
    }
  }
  .sel-div3 {
    padding: 0 12px;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    width: 100%;
    color: #626572;
    background-color: #fff;
    text-align: left;
    & > :nth-child(1) {
      float: right;
      width: 93%;
      span {
        margin-right: 30px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          color: #05c65d;
        }
      }
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
  .base-msg-box {
    margin-top: 8px;
    width: 100%;
    height: 120px;
    background-color: #dcece3;
    & > :nth-child(1) {
      float: left;
      width: 30%;
      height: 100%;
    }
    & > :nth-child(2) {
      float: left;
      width: 30%;
      height: 100%;
    }
    & > div {
      & > p {
        text-align: left;
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        & > :nth-child(1) {
          padding-right: 12px;
          color: #05c65d;
        }
        & > :nth-child(2) {
          padding-right: 12px;
          color: rgb(150, 150, 150);
        }
      }
    }
    & > :nth-child(3) {
      float: left;
      width: 40%;
      height: 100%;
      p {
        height: 30px;
        color: #05c65d;
      }
      & > :nth-child(2) {
        color: rgb(150, 150, 150);
      }
    }
  }
}
.table-box {
  margin-top: 40px;
  width: 100%;
  height: 440px;
  background-color: #fff;
}
.table-box1 {
  padding: 12px 20px 20px;
  width: 100%;
  // height: 620px;
  background-color: #fff;
  box-sizing: border-box;
  .table-title {
    text-align: left;
    height: 30px;
    line-height: 30px;
    span:nth-of-type(2) {
      float: right;
    }
  }
  .table-scoll {
    height: 520px;
    overflow-y: auto;
  }
  button {
    margin-top: 10px;
  }
  & > :nth-child(3) {
    float: right;
    margin-right: 20px;
  }
}
.table-scoll::-webkit-scrollbar {
  width: 0;
}
// .footer3 {
//   text-align: right;
//   margin-top: 32px;
//   padding: 30px 0 90px 0;
//   height: 28px;
//   background-color: #fff;
// }
.footer1 {
  text-align: right;
  padding: 20px;
  height: 28px;
  background-color: #fff;
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
  color: rgb(250, 108, 108) !important;
}
.font-green {
  color: #05c65d !important;
}
.el-input-number ::v-deep .el-input {
  height: 20px !important;
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
.havecolor {
  cursor: pointer;
  color: #05c65d !important;
}
</style>
<style lang="scss">
.conflict-box {
  .el-radio-group {
    width: 230px;
    // height: 30px;
    .el-radio {
      display: block;
      .el-radio__label {
        line-height: 24px;
        span:nth-of-type(2) {
          margin: 0 6px;
        }
      }
    }
  }
  p:nth-of-type(1) {
    margin-bottom: 8px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    height: 30px;
    border-radius: 5px;
    background: #f3d6d6;
    img {
      margin-right: 6px;
    }
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
    height: 24px;
    color: #05c65d;
    border-bottom: #05c65d 1px solid;
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
.instrument-list {
  p {
    font-size: 16px;
    font-weight: 600;
    border-bottom: #05c65d solid 1px;
  }
  ul {
    margin-bottom: 6px;
    max-height: 200px;
    overflow-y: scroll;
    li {
      height: 30px;
      line-height: 30px;
      border-bottom: #333 1px dashed;
      span:nth-of-type(1) {
        display: inline-block;
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span:nth-of-type(2) {
        display: inline-block;
        width: 29%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}
</style>
