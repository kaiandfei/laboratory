<template>
  <div class="base-box">
    <div class="msg-box" id="msgBox">
      <div class="header">
        {{ !editStatus ? '实验通知单' : '修改' }}
        <div class="button-box">
          <div class="button" @click="back"><i class="el-icon-close" /></div>

          <!-- <div class="button" @click="back"><i class="el-icon-back" />退出</div>
          <div class="button" @click="download"><i class="el-icon-download" />下载</div> -->
        </div>
        <!-- <img src="@images/subscribe/close.png" alt="" > -->
      </div>
      <div class="msg-body-sco">
        <el-tabs
          type="border-card"
          v-model="activeIndex"
          :tab-position="'top'"
          :class="{ 'only-one': dataProp.length === 1 }"
        >
          <el-tab-pane
            v-for="(item, index) in dataProp"
            :key="index"
            :label="Array.isArray(item.name) ? item.name.join(',') : '未命名'"
          >
            <div class="msg-body" v-if="editStatus">
              <div class="base-row">
                <span class="ms_span">地点</span>
                <div class="right-box">
                  <span
                    class="lab-item"
                    :class="{
                      'active-lab': clickItemData.laboratory_id === e.laboratory_id,
                    }"
                    v-for="(e, i) in conmputedLab"
                    :key="i"
                    @click="clickItemData.laboratory_id = e.laboratory_id"
                  >
                    {{ e.name }}
                    <img
                      v-show="e.is_order === 1"
                      src="@images/subscribe/audit.png"
                      alt=""
                      title="需要审核"
                    />
                  </span>
                </div>
              </div>
              <div class="base-row">
                <span class="ms_span">
                  {{ item.book_type !== 3 ? '预约时间' : '开课时间' }}
                </span>
                {{ $store.state.weekTimeArr[item.week_time] }}
                {{ $store.state.weekArr[item.weekend] }}
                {{ '第' + item.section + '节' }}
              </div>
              <div class="base-row">
                <span class="ms_span">实验名称</span>
                {{ Array.isArray(item.name) ? item.name.join(',') : '未命名' }}
              </div>
              <div class="base-row">
                <span class="ms_span">实验类型</span>
                <div>
                  <el-radio-group v-model="clickItemData.type" @change="changeType">
                    <el-radio :label="1"> 分组 </el-radio>
                    <el-radio :label="2"> 演示 </el-radio>
                    <el-radio :label="3" v-if="clickItemData.book_type !== 2">
                      其他
                    </el-radio>
                  </el-radio-group>
                  <!-- <el-radio :disabled="!editStatus" v-model="item.type" :label="1">
                    分组
                  </el-radio>
                  <el-radio :disabled="!editStatus" v-model="item.type" :label="2">
                    演示
                  </el-radio>
                  <el-radio :disabled="!editStatus" v-model="item.type" :label="3">
                    其他
                  </el-radio> -->
                </div>
              </div>

              <div class="base-row">
                <span class="ms_span">班级</span>
                <span v-show="clickItemData.class_name.length !== 0" class=" ">
                  {{ clickItemData.class_name.join(',') }}&nbsp;
                </span>
                <span class="click-text-0" @click="editItem"> 选择 </span>
              </div>
              <div class="base-row">
                <span class="ms_span">
                  {{ item.book_type !== 3 ? '预约教师' : '开课教师' }}
                </span>
                {{ computedTeacherName(item) }}
              </div>

              <template>
                <div class="base-row">
                  <span class="ms_span">分组人数</span>
                  <div>
                    <el-input-number
                      v-model="clickItemData.number_groups"
                      :min="1"
                      label="描述文字"
                    />
                    人/组
                  </div>
                </div>
                <div class="base-row">
                  <span class="ms_span">仪器套数</span>
                  <div>
                    <el-input-number
                      v-model="clickItemData.number_instruments"
                      :min="1"
                      label="描述文字"
                    />
                    套
                  </div>
                </div>
                <div
                  class="base-row"
                  v-if="clickItemData.class_name.length !== 0 && clickItemData.type !== 3"
                >
                  <div class="ms_span">关联计划</div>
                  <div class="click-text-0">
                    <!-- {{ clickItemData.plan_detail_name.join(',') }} -->
                    <el-select
                      v-for="(e, i) in clickItemData.exp_id"
                      :key="i"
                      v-model="clickItemData.plan_detail_id[i]"
                      placeholder="请选择"
                      @change="checkPlan"
                    >
                      <el-option
                        v-for="item in planDetails"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </div>
                </div>
                <div class="base-row">
                  <span class="ms_span">实验器材</span>
                  <span class="click-text" @click="addInstrument">新增+</span>
                </div>
                <el-table
                  :data="clickItemData.material"
                  max-height="300"
                  style="width: 100%"
                >
                  <el-table-column type="index" prop="" label="序号" align="left" />
                  <el-table-column prop="number" label="分类编号" show-overflow-tooltip />
                  <el-table-column prop="name" label="仪器名称" show-overflow-tooltip />
                  <el-table-column
                    prop="specification"
                    label="仪器规格"
                    show-overflow-tooltip
                  />
                  <el-table-column prop="num" label="数量" width="100" align="left">
                    <template #default="scope">
                      <el-input-number
                        v-model="scope.row.num"
                        :min="1"
                        :step="1"
                        step-strictly
                        label="数量"
                      />
                      <!-- {{ scope.row.num }} -->
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    v-else
                    prop="num"
                    label="总数量"
                    align="left">
                    <template #default="scope">
                      {{ scope.row.num * item.number_instruments }}
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="" width="160" align="center" label="操作">
                    <template slot-scope="scope">
                      <span
                        class="click-text"
                        @click="clickItemData.material.splice(scope.$index, 1)"
                        >删除</span
                      >
                    </template>
                  </el-table-column>
                </el-table>

                <div class="base-row">
                  <span class="ms_span">其他实验材料</span>
                  <div class="right-box">
                    <el-input
                      v-model="clickItemData.material_tips"
                      placeholder="请输入其他实验材料"
                    />
                  </div>
                </div>
                <div class="base-row">
                  <span class="ms_span">
                    {{ item.book_type !== 3 ? '预约备注' : '备注' }}
                  </span>
                </div>
                <el-input
                  :disabled="role_id === 2"
                  type="textarea"
                  placeholder="请输入备注..."
                  v-model="clickItemData.tips"
                  maxlength="60"
                  resize="none"
                  :rows="4"
                  show-word-limit
                />
              </template>
            </div>
            <div class="excel-box" v-else>
              <div class="message-box">
                <div class="row">
                  <div class="name">实验名称</div>
                  <div class="details">
                    {{ Array.isArray(item.name) ? item.name.join(',') : '未命名' }}
                  </div>
                </div>
                <div class="row">
                  <div class="name">实验类型</div>
                  <div class="details">
                    {{ $store.state.groupTypeList[item.type - 1] }}
                  </div>
                </div>
                <div class="row">
                  <div class="name">
                    {{ item.book_type !== 3 ? '预约时间' : '开课时间' }}
                  </div>
                  <div class="details">
                    {{ $store.state.weekTimeArr[item.week_time] }}
                    {{ $store.state.weekArr[item.weekend] }}
                    {{ '第' + item.section + '节' }}
                  </div>
                </div>
                <div class="row">
                  <div class="name">地点</div>
                  <div class="details">
                    <span>{{ item.laboratory || item.laboratory_name || '教室' }}</span>
                    <el-popover
                      v-if="
                        role_id === 2 &&
                        item.status !== 0 &&
                        item.book_type === 1 &&
                        item.unchange === 0
                      "
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
                        <el-radio-group v-model="item.laboratory_id">
                          <el-radio :label="-1">教室</el-radio>
                          <el-radio
                            v-for="(item1, index) in conflictData"
                            :key="index"
                            :label="item1.laboratory_id"
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
                        slot="reference"
                        v-show="item.status === 1"
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
                  </div>
                </div>
                <div class="row">
                  <div class="name">班级</div>
                  <div class="details">
                    {{ computedClassName(item) }}
                  </div>
                </div>
                <div class="row">
                  <div class="name">
                    {{ item.book_type !== 3 ? '预约教师' : '开课教师' }}
                  </div>
                  <div class="details">
                    {{ computedTeacherName(item) }}
                  </div>
                </div>
                <div class="row">
                  <div class="name">分组人数</div>
                  <div class="details">{{ item.number_groups }} 人/组</div>
                </div>
                <div class="row">
                  <div class="name">仪器套数</div>
                  <div class="details">{{ item.number_instruments }} 套</div>
                </div>
                <div class="row row-100">
                  <div class="name">关联计划</div>
                  <div class="details">
                    {{ item.plan_detail_name.filter((e) => e).join(',') || '/' }}
                  </div>
                </div>
              </div>
              <div class="instrument-list">
                <div class="title">实验器材</div>
                <el-table
                  :data="item.material"
                  max-height="300"
                  :cell-style="{
                    borderBottom: '1px dotted #05C65D !important',
                  }"
                  style="width: 100%"
                >
                  <el-table-column prop="number" label="分类编号" show-overflow-tooltip />
                  <el-table-column prop="name" label="仪器名称" show-overflow-tooltip />
                  <el-table-column
                    prop="specification"
                    label="仪器规格"
                    show-overflow-tooltip
                  />
                  <el-table-column prop="num" label="总数量" align="left">
                    <template #default="scope">
                      {{ scope.row.num }}
                    </template>
                  </el-table-column>
                </el-table>
                <div class="ins-tips">
                  <span>其他实验材料：</span>
                  {{ item.material_tips || '无' }}
                </div>
              </div>
              <div class="message-box">
                <template v-if="item.book_type === 1">
                  <div class="row">
                    <div class="name">提交情况</div>
                    <div class="details">
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
                    </div>
                  </div>
                  <div class="row">
                    <div class="name">审核情况</div>
                    <div class="details">
                      {{
                        item.status === 0
                          ? ''
                          : item.status === 1
                          ? '未审核'
                          : item.status >= 2
                          ? '已通过'
                          : item.status === -1
                          ? '未通过'
                          : ''
                      }}
                    </div>
                  </div>
                  <div class="row row-100">
                    <div class="name">预约备注</div>
                    <div class="details" v-html="item.tips || '无'" />
                  </div>
                  <!-- <div class="row row-100" v-if="role_id === 4">
                    <div class="name">审核备注</div>
                    <div class="details">
                      {{ item.ex_admin_tips }}
                    </div>
                  </div> -->
                  <div
                    class="row row-100"
                    v-if="[1, 2].includes(item.status) && role_id === 2"
                  >
                    <div class="name">审核备注</div>
                    <div class="details">
                      <el-input
                        type="textarea"
                        placeholder="请输入备注..."
                        v-model="item.ex_admin_tips"
                        maxlength="60"
                        resize="none"
                        show-word-limit
                      />
                    </div>
                  </div>
                  <div class="row row-100" v-else>
                    <div class="name">审核备注</div>
                    <div class="details">
                      {{ item.ex_admin_tips || '无' }}
                    </div>
                  </div>
                </template>
                <template v-if="item.book_type === 2">
                  <div class="row">
                    <div class="name">排课情况</div>
                    <div class="details">
                      {{ item.status !== 0 ? '排课完成' : '排课已取消' }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="name">排课人</div>
                    <div class="details">
                      {{ item.operator_name }}
                    </div>
                  </div>
                  <div class="row" :class="{ 'row-100': item.status === 0 }">
                    <div class="name">排课时间</div>
                    <div class="details">
                      {{ item.create_time }}
                    </div>
                  </div>
                  <div class="row row-100" v-if="item.status === 0">
                    <div class="name">取消原因</div>
                    <div class="details">
                      {{ item.ex_admin_tips }}
                    </div>
                  </div>
                </template>
                <template v-if="item.book_type === 3">
                  <div class="row">
                    <div class="name">登记情况</div>
                    <div class="details">
                      {{ item.status !== 0 ? '已登记' : '登记已取消' }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="name">登记人</div>
                    <div class="details">
                      {{ item.operator_name }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="name">登记时间</div>
                    <div class="details">
                      {{ item.create_time }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="name">登记说明</div>
                    <div class="details" v-html="item.tips || '无'" />
                  </div>
                </template>
              </div>
            </div>
            <div
              v-if="
                role_id === 4 &&
                item.teacher.find(
                  (e) => e.is_main === 1 && e.id === $store.state.userMsg.id
                )
              "
            >
              <div class="footer2">
                <button v-if="!editStatus" class="commonbtn my-button" @click="download">
                  <i class="el-icon-download" /> 下载
                </button>
                <template v-if="!editStatus">
                  <button
                    v-if="item.unchange === 0 && item.status > 0 && item.book_type !== 2"
                    class="my-button my-button-white"
                    @click="cancelBook(item)"
                  >
                    {{
                      item.book_type === 1
                        ? '取消预约'
                        : item.book_type === 2
                        ? '取消排课'
                        : '取消登记'
                    }}
                  </button>
                  <button
                    v-if="item.unchange === 0 && item.status > 0 && item.book_type !== 2"
                    class="my-button"
                    @click="changeStatus(item)"
                  >
                    变更
                  </button>
                  <button
                    v-if="item.unchange === 1 || item.status < 1"
                    class="my-button my-button-white"
                    @click="delExpBooks(item)"
                  >
                    删除
                  </button>
                  <button
                    v-if="item.status >= 2 && item.book_type === 3"
                    class="my-button"
                    @click="dataSupplement(item)"
                  >
                    登记数据
                  </button>
                  <el-popover
                    v-if="false"
                    placement="top-start"
                    width="200"
                    trigger="click"
                  >
                    <div class="share-my-exp-box">
                      <VueQr
                        :logoSrc="require('@images/menu/logo.png')"
                        :text="computedUrl(item)"
                        :size="200"
                      />
                      <span @click="textCopy(computedUrl(item), $event)">复制链接</span>
                      <!-- <div class="btn-pop-box">
                        <button
                          class="my-button-pop my-button-pop-white"
                          @click="popFlag = false">
                          取消
                        </button>
                      </div> -->
                    </div>
                    <span slot="reference">
                      <button
                        v-if="
                          item.status === 2 &&
                          item.book_type !== 3 &&
                          (!item.pai || item.pai.every((e) => e.need_pai === 0))
                        "
                        class="my-button"
                        @click="shareToStudent(item)"
                      >
                        发布给学生
                      </button>
                    </span>
                  </el-popover>
                  <button
                    v-if="
                      item.status === 2 &&
                      item.book_type === 2 &&
                      item.pai.some((e) => e.need_pai === 1)
                    "
                    class="my-button"
                    @click="prepare(item)"
                  >
                    备课
                  </button>
                </template>
                <template v-if="editStatus">
                  <button class="my-button my-button-white" @click="back">取消</button>
                  <button class="my-button" @click="resubmit(clickItemData)">确认</button>
                </template>
              </div>
              <div
                class="footer3"
                v-if="
                  role_id === 4 &&
                  item.status === 2 &&
                  item.book_type === 2 &&
                  item.pai.some((e) => e.need_pai === 1)
                "
              >
                <p>
                  *若有备课，请
                  <el-popover
                    placement="top"
                    v-model="popFlag"
                    width="400"
                    trigger="click"
                  >
                    <div class="check-my-exp-box">
                      <div class="check-my-exp">
                        <div
                          v-for="(item, index) in myExpList"
                          :key="index"
                          class="exp-item"
                          :class="{ 'exp-item-active': item.check }"
                          @click="item.check = !item.check"
                        >
                          {{ item.name }}
                        </div>
                      </div>
                      <div class="btn-pop-box">
                        <button
                          class="my-button-pop my-button-pop-white"
                          @click="popFlag = false"
                        >
                          取消
                        </button>
                        <button class="my-button-pop" @click="sureCheckExp(item)">
                          确定
                        </button>
                      </div>
                    </div>
                    <span slot="reference"> 点击此处 </span>
                  </el-popover>
                  选择
                </p>
              </div>
            </div>
            <div v-if="role_id === 2">
              <div class="footer2">
                <!-- <p v-show="item.status === -1" >已拒绝</p>
                <p v-show="item.status === 0" >已取消</p> -->
                <!-- <button v-show="item.status === 1 || item.status === 2" class="graybtn my-button mr12" @click="back">取消</button> -->
                <button v-if="!editStatus" class="commonbtn my-button" @click="download">
                  <i class="el-icon-download" /> 下载
                </button>
                <template v-if="item.book_type === 1">
                  <button
                    v-show="item.status === 1"
                    class="my-button my-button-white"
                    @click="sureClick(item, -1)"
                  >
                    拒绝
                  </button>
                  <!-- <button
                    v-show="item.status === 1 && dataProp.length > 1"
                    class="my-button"
                    @click="sureClick(item, 2, 'next')">
                    通过并继续
                  </button> -->
                  <button
                    v-show="item.status === 2"
                    class="my-button my-button-white"
                    :class="{ graybtn: item.unchange === 1 }"
                    @click="sureClick(item, 1)"
                  >
                    取消审核
                  </button>
                </template>
                <template v-if="item.book_type === 2 && item.status === 2">
                  <button class="my-button my-button-white" @click="cancelBook(item)">
                    取消排课
                  </button>
                </template>
                <template v-if="item.book_type === 3 && item.status >= 2">
                  <button class="my-button my-button-white" @click="cancelBook(item)">
                    取消登记
                  </button>
                </template>
                <button
                  v-if="item.book_type !== 3 && item.status > 0 && item.is_confirm === 0"
                  class="my-button"
                  @click="getInstrument(item)"
                >
                  仪器确认
                </button>
                <button
                  v-if="item.book_type !== 3 && item.status > 0 && item.is_confirm === 1"
                  class="my-button"
                  @click="getInstrument(item)"
                >
                  仪器确认详情
                </button>
                <template v-if="item.book_type === 1 && item.status === 1">
                  <button v-if="item.is_confirm === 0" class="my-button my-button-gray">
                    通过
                    <div class="tips">*仪器确认后可用</div>
                  </button>
                  <button
                    v-if="item.is_confirm === 1"
                    class="my-button"
                    @click="sureClick(item, 2)"
                  >
                    通过
                  </button>
                </template>
                <template v-if="item.book_type !== 3 && item.status === 2">
                  <button
                    v-if="item.is_confirm === 1 && item.is_prepare === 0"
                    class="my-button"
                    @click="isReady(item)"
                  >
                    仪器准备好了
                  </button>
                  <button v-if="item.is_confirm === 0" class="my-button my-button-gray">
                    仪器准备好了
                  </button>

                  <button
                    class="my-button"
                    v-if="item.is_prepare === 1"
                    @click="isReady(item)"
                  >
                    更新上传图片
                  </button>
                  <!-- <button v-else class="my-button my-button-gray">仪器准备好了</button> -->
                </template>
                <button
                  v-if="item.status >= 2 && item.book_type === 3"
                  class="my-button"
                  @click="dataSupplement(item)"
                >
                  登记数据
                </button>
                <button
                  v-if="item.book_type !== 1 && item.status < 1"
                  class="my-button my-button-white"
                  @click="delExpBooks(item)"
                >
                  删除
                </button>
              </div>
            </div>

            <!-- <div v-show="isHaveEnd && item.end === 1" class="footer2">
              <p>已结束</p>
            </div> -->
            <!-- <div v-show="isHaveEnd ? item.end === 0 && item.is_del === -1 : item.is_del === -1" class="footer2">
              <p>已撤销</p>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <grade-list
      v-if="checkGradeShow"
      :filterData="{
        time_ids: this.$store.state.userMsg.phase_study_id
          ? Number(this.$store.state.userMsg.phase_study_id.split(',')[0])
          : '',
      }"
      :weekend="clickItemData.weekend"
      :section="clickItemData.section"
      :checkList="clickItemData.class_id"
      :type="clickItemData.type"
      @sureClick="getCheckGrade"
      @back="checkGradeShow = false"
    />
    <el-dialog
      title="选择一个实验"
      top="20vh"
      :modal="false"
      :visible.sync="checkShow"
      width="40%"
    >
      <div class="exp-list">
        <el-radio-group v-model="checkExpId">
          <el-radio
            v-for="(item, index) in checkList"
            :label="item.value"
            border
            :key="index"
          >
            {{ item.label }}
            <span v-if="item.need_pai === 0" style="text-align: right; color: #05c65d"
              >(已备课)</span
            >
          </el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkShow = false">取 消</el-button>
        <el-button type="primary" @click="sureClickExp">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加仪器"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      custom-class="add-instrument"
    >
      <div class="input-box">
        <p>新增仪器</p>
        <el-input v-model="inputValue" placeholder="请输入内容" @change="addInstrument" />
      </div>
      <div class="table-box">
        <el-table
          ref="multipleTable"
          :data="InstrumentListBase"
          tooltip-effect="dark"
          style="width: 100%"
          height="300"
          v-loading="loading"
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
    <el-dialog
      title="确认仪器准备完成"
      :visible.sync="readyShow"
      width="50%"
      top="10vh"
      append-to-body
      custom-class="sure-ready"
    >
      <div class="table-box">
        <el-table
          :data="materialList"
          border
          stripe
          style="width: 100%"
          max-height="400px"
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

          <el-table-column prop="num" :label="'所需总数量'" sortable>
            <template slot-scope="scope">
              <div>
                {{ scope.row.num || '/' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="library" label="仪器使用位置及数量" width="240">
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

          <el-table-column prop="true_num" label="确认数量" sortable />
        </el-table>
      </div>
      <div class="form-box">
        <div class="upload_box">
          <el-upload
            :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
            list-type="picture-card"
            :data="filedata"
            name="image"
            :multiple="true"
            :limit="3"
            :on-success="
              (response, file, fileList) => onsuccessRank(response, file, fileList)
            "
            :on-remove="(file, fileList) => handleRemoveRank(file, fileList)"
            :before-upload="(file) => beforeAvatarUploadRank(file)"
            :on-exceed="(file) => $message('最多限制3个图片')"
            :file-list="fileList"
          >
            <!-- :on-preview="handlePictureCardPreview" -->
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleImg">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
        <div class="checkbox-box">
          <el-checkbox v-model="isPost" :true-label="1" :false-label="0"
            >消息通知到教师</el-checkbox
          >
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="readyShow = false">取 消</el-button>
        <el-button type="primary" @click="sureReady">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="取消排课"
      top="20vh"
      append-to-body
      custom-class="cancel-dialog"
      :visible.sync="cancelShow"
      width="25%"
    >
      <div class="cancel-box">
        <p>确认取消排课？</p>
        <p>理由：</p>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入取消理由"
          v-model="clickItemData.tipsInput"
          maxlength="60"
          show-word-limit
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelShow = false">取 消</el-button>
        <el-button type="primary" @click="sureCancel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMyPlan,
  expBookEditNew,
  cancelExpBook,
  delExpBook,
  expBookLesson,
} from '@network/subscribe'

import {
  adjustLaboratory,
  examInstrument,
  insDetailList,
  readyMaterial,
  getConflict,
} from '@network/subExamine'
import { ExpMaterialFind } from '@/network/experimentPlan'
import { planDetailExp } from '@network/infomationStatistical'

import GradeList from '../../course-scheduling/components/grade-list.vue'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import VueQr from 'vue-qr'
import copyText from '@/utils/clipboard'
import axios from 'axios'
import localCache from '@/utils/localCache'

import mixinsFormatter from '@/mixins/formatter'

export default {
  mixins: [mixinsFormatter],
  name: '',
  props: {
    dataProp: Array,
    labList: Array,
  },
  components: {
    GradeList,
    VueQr,
  },
  data() {
    return {
      isHaveEnd: false, // 是否具有结束状态
      activeIndex: '0',
      editStatus: false,
      checkGradeShow: false,
      clickItemData: {},
      instrumentTip: '',
      tableData: [],
      popFlag: false,
      myExpList: [],
      checkList: [],
      checkShow: false,
      checkType: 0, //  1登记数据 2 备课 3 发布
      checkExpId: '',
      conflictData: [],
      materialList: [],

      dialogVisible: false,
      inputValue: '',
      InstrumentListCheck: [],
      InstrumentListAdd: [],
      InstrumentListBase: [],
      loading: false,
      readyShow: false,
      fileList: [],
      isPost: 1,
      dialogImageUrl: [],
      dialogVisibleImg: false,
      filedata: {
        token: this.$store.state.userMsg.token,
      },
      planDetails: [],
      baseUrl: process.env.VUE_APP_APP_BASEURL,
      cancelShow: false,
    }
  },
  computed: {
    ...mapState({
      role_id: (state) => state.userMsg.role_id,
      subject_id: (state) => state.userMsg.subject_id,
      gradeArr: 'gradeArr',
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
      arr.shift()
      return arr
    },
    computedUrl() {
      return function (item) {
        return (
          process.env.VUE_APP_APP_ShareURL + 'studentTask' + '?go_class_id=' + item.id
        )
        // '&class_id=' + item.class_id +
        // '&teacher_id=' + this.$store.state.userMsg.id +
        // '&exp_id=' + item.exp_id.join(',') +
        // '&exp_name=' + item.name.join(',') +
        // '&grade_id=' + item.grade +
        // '&school_year=' + item.school_year +
        // '&semester=' + item.semester +
        // '&week_time=' + item.week_time +
        // '&school_id=' + this.$store.state.userMsg.school_id
      }
    },
  },
  watch: {
    activeIndex: {
      handler(n, o) {
        console.log('🚀 ~ file: course-window.vue:966 ~ handler ~ n:', n, o)
        // this.instrumentList(this.dataProp[n])
      },
      immediate: true,
    },
  },
  created() {
    this.getPlan()
  },
  mounted() {},
  methods: {
    getPlan() {
      getMyPlan().then((res) => {
        this.myExpList = res.data.map((e) => {
          return {
            ...e,
            check: false,
          }
        })
      })
    },
    changeType(e) {
      console.log('🚀 ~ file: index.vue:586 ~ changeType ~ e:', e)
      if (e === 1 || e === 2) {
        this.clickItemData = {
          ...this.clickItemData,
          class_id: [],
          class_name: [],
          teacher_id: [],
          teacher_name: [],
        }
      } else {
        this.clickItemData.plan_detail_id = []
      }
    },
    textCopy(text, event) {
      copyText(text, event)
    },
    getPlanDetailList(plan_id, class_id) {
      planDetailExp({ plan_id, class_id }).then((res) => {
        this.planDetails = res.data || []
      })
    },
    sureCheckExp(item) {
      expBookLesson({
        id: item.id,
        exp_id: this.myExpList
          .filter((e) => e.check)
          .map((e) => {
            if (e.check) {
              return e.id
            }
          }),
      }).then((res) => {
        if (res.code === 10) {
          this.popFlag = false
          this.$message({
            type: 'success',
            message: res.msg,
          })
          this.back()
        }
      })
    },
    hideDetail() {
      // const msg = document.getElementById('msgBox')
      // // console.log('🚀 ~ file: index.vue ~ line 830 ~ hideDetail ~ dialog', dialog)
      // if (msg) {
      //   if (!this.checkGradeShow && !msg.contains(event.target)) {
      //     this.$emit('back')
      //     this.activeIndex = '0'
      //   }
      // }
    },
    editItem() {
      this.checkGradeShow = true
    },
    // getCheckGrade(obj) {
    //   this.clickItemData.grade = [obj.grade]
    //   this.clickItemData.class_id = obj.class_id
    //   this.clickItemData.class_name = obj.class_name
    // },
    getCheckGrade(list) {
      // 变更为多选
      // this.clickItemData.grade = []
      this.clickItemData.class_id = []
      this.clickItemData.class_name = []
      this.clickItemData.plan_detail_id = new Array(
        this.clickItemData.exp_id.length
      ).fill('')

      list.forEach((e) => {
        // this.clickItemData.grade.push(e.grade)
        this.clickItemData.class_id.push({ grade: e.grade, id: e.class_id })
        this.clickItemData.class_name.push(e.grade_name + e.class_name)
      })
      this.clickItemData.teacher_id = [
        {
          teacher_id: this.$store.getters.getUserMsg.id,
          is_main: 1,
        },
      ]
      this.clickItemData.teacher_name = [this.$store.getters.getUserMsg.username]
      if (this.clickItemData.type !== 3) {
        this.getPlanDetailList('', this.clickItemData.class_id[0].id)
      }
      // if (this.role_id === 2) {
      //   getTeacherByClass({
      //     class_id: this.clickItemData.class_id,
      //   }).then((res) => {
      //     if (res.data.length !== 0) {
      //       this.clickItemData.teacher_id = res.data[0].teacher_id
      //       this.clickItemData.teacher_name = res.data[0].teacher_name
      //     } else {
      //       this.$message({
      //         type: 'warning',
      //         message: '该班级无该学科教师，请选择其他班级',
      //       })
      //       this.clickItemData.grade = ''
      //       this.clickItemData.class_id = ''
      //       this.clickItemData.class_name = ''
      //       this.clickItemData.teacher_id = ''
      //       this.clickItemData.teacher_name = ''
      //     }
      //   })
      // }
    },
    instrumentList(item) {
      console.log('🚀 ~ file: course-window.vue:1077 ~ instrumentList ~ item:', item)
      const data = {
        id: item.id,
      }
      examInstrument(data).then((res) => {
        this.tableData = res.data.data
        this.instrumentTip = res.data.tips
      })
    },
    showConflict(data) {
      getConflict({
        id: data.id,
      }).then((res) => {
        this.conflictData = res.data
      })
    },
    sureClick(item, index, is_next) {
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
                  this.$emit('back')
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
            // this.$emit('back')
            if (index === 2) {
              if (is_next === 'next') {
                // this.$emit('back')
                this.activeIndex = '0'
                // this.clickItem(item, item.weekend, item.section)
              } else {
                this.$emit('back')
                this.activeIndex = '0'
              }
              this.$message({
                message: '审核通过',
                type: 'success',
              })
            } else if (index === -1) {
              this.$emit('back')
              this.activeIndex = '0'

              this.$message({
                message: '实验室申请已拒绝',
                type: 'success',
              })
            }
          }
        })
      }
    },
    checkPlan(m) {
      this.clickItemData.plan_id = this.planDetails.find((e) => e.id === m).plan_id
    },
    addInstrument() {
      this.dialogVisible = true
      // this.InstrumentListBase = []
      const data = {
        subject_id: this.subject_id,
        name: this.inputValue,
      }
      this.loading = true
      ExpMaterialFind(data).then((res) => {
        this.InstrumentListBase = res.data
        this.loading = false
      })
    },
    handleSelectionChange(list) {
      this.InstrumentListCheck = list
    },
    determine() {
      this.InstrumentListAdd = this.InstrumentListCheck.map((e) => {
        return { ...e, num: 1 }
      })
      this.clickItemData.material = this.clickItemData.material.concat(
        this.InstrumentListAdd
      )

      this.dialogVisible = false
      // this.tableData2.map((item, index) => {
      //   item.index = index + 1
      //   item.material_number = item.number
      //   item.materialname = item.name
      //   item.num = 1
      // })
      // this.tableData2 = JSON.parse(JSON.stringify(this.tableData2))
      // this.tableData.push(...this.tableData2)
    },
    changeStatus(item) {
      console.log('🚀 ~ file: course-window.vue:1026 ~ changeStatus ~ item:', item)
      this.clickItemData = {
        ...item,
        plan_detail_id: item.plan_detail_id.split(',').map((e) => (e ? Number(e) : '')),
        class_id: item.class.map((e) => {
          return { grade: e.grade, id: e.id }
        }),
        class_name: item.class.map((e) => {
          return this.gradeArr[e.grade] + e.name
        }),
        teacher_id: item.teacher.map((e) => {
          return { teacher_id: e.id, is_main: e.is_main }
        }),
        teacher_name: item.teacher.map((e) => {
          return e.username
        }),
      }
      if (this.clickItemData.type !== 3) {
        this.getPlanDetailList(
          '',
          this.clickItemData.class_id[0] ? this.clickItemData.class_id[0].id : ''
        )
      }
      this.clickItemData.material = this.clickItemData.material.map((e) => {
        return {
          ...e,
          num: e.num / this.clickItemData.number_instruments,
        }
      })
      console.log(
        '🚀 ~ file: course-window.vue:856 ~ this.clickItemData.material=this.clickItemData.material.map ~ this.clickItemData:',
        this.clickItemData.number_instruments
      )
      this.editStatus = true
    },
    resubmit() {
      if (this.clickItemData.class_id.length === 0) {
        Message({
          type: 'error',
          message: '请选择班级',
        })
        return
      }
      let obj = JSON.parse(JSON.stringify(this.clickItemData))

      const arr = obj.material.map((e) => {
        return {
          material_number: e.number,
          num: e.num * obj.number_instruments,
        }
      })
      let findObj = this.conmputedLab.find((e) => e.laboratory_id === obj.laboratory_id)
      obj.is_order = findObj.is_order

      delete obj.teacher_name
      delete obj.name
      delete obj.laboratory

      expBookEditNew({
        ...obj,
        plan_detail_id: obj.plan_detail_id.join(','),
        material: arr,
      }).then((res) => {
        if (res.code === 10) {
          this.$emit('back')
          Message({
            type: 'success',
            message: res.msg,
          })
        }
      })
    },
    cancelBook(item) {
      if (item.book_type === 2) {
        this.clickItemData = { ...item, tipsInput: '' }
        this.cancelShow = true
      } else {
        this.$confirm('是否确认取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            cancelExpBook({
              id: item.id,
              ex_admin_tips: item.ex_admin_tips,
            })
              .then((res) => {
                if (res.code === 10) {
                  this.$emit('back')

                  this.$message({
                    message: '已取消',
                    type: 'success',
                  })
                } else {
                  this.$message({
                    message: '取消失败',
                    type: 'warning',
                  })
                }
              })
              .catch(() => {
                this.$message({
                  message: '取消失败',
                  type: 'error',
                })
              })
          })
          .catch(() => {
            console.log()
          })
      }
    },
    sureCancel() {
      cancelExpBook({
        id: this.clickItemData.id,
        ex_admin_tips: this.clickItemData.tipsInput,
      })
        .then((res) => {
          if (res.code === 10) {
            this.cancelShow = false
            this.$emit('back')

            this.$message({
              message: '已取消',
              type: 'success',
            })
          } else {
            this.$message({
              message: '取消失败',
              type: 'warning',
            })
          }
        })
        .catch(() => {
          this.$message({
            message: '取消失败',
            type: 'error',
          })
        })
    },
    delExpBooks(data) {
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
              this.$emit('back')
              this.$message.success(res.msg)
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

    isReady(item) {
      console.log('🚀 ~ file: course-window.vue:818 ~ isReady ~ item:', item)
      this.clickItemData = item
      this.isPost === 1
      this.fileList = []
      insDetailList({ id: this.clickItemData.id }).then((res) => {
        if (this.clickItemData.is_prepare === 1) {
          this.fileList = res.data?.pic.map((e) => {
            return {
              url: e.url_path,
            }
          })
        }
        this.materialList = res.data.list
        this.readyShow = true
      })
    },
    onsuccessRank(response, file, fileList) {
      if (response.code === 10) {
        file.url = response.data.file_url
        file.name = response.data.file_name
        // file.chapter_type = this.chapter_type
        // file.chapter = this.title
        // file.type = index
        this.fileList = fileList
      }
    },
    beforeAvatarUploadRank(file) {
      if (file) {
        const isIMG =
          file.type === 'image/jpg' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 4
        if (!isIMG) {
          this.$message.error('上传图片只能是 JPG,PNG,JPEG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 4MB!')
        }
        return isIMG && isLt2M
      }
      // if (!id) {
      //   this.$message.error('请选择学生!')
      //   return false
      // }
    },
    handleRemoveRank(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    sureReady() {
      readyMaterial({
        id: this.clickItemData.id,
        url: this.fileList.map((e) => e.url),
        is_post: this.isPost,
      }).then((res) => {
        if (res.code === 10) {
          this.readyShow = false

          this.$emit('back')
          this.$message.success(res.msg)
        }
      })
    },
    dataSupplement({ id, class_id, name, exp_id }) {
      this.checkType = 1
      this.$router.push({
        name: 'CourseRegister',
        params: { id, class_id, name, exp_id },
      })
    },
    // 教师
    shareToStudent() {
      // this.checkType = 3
      // if (data.exp_id.length > 1) {
      //   this.checkList = data.exp_id.map((e, i) => {
      //     return {
      //       value: e,
      //       label: data.name[i]
      //     }
      //   })
      //   this.checkShow = true
      // } else {
      //   this.$router.push({ name: 'MyExperiment', params: { item_id: data.exp_id[0], shareToStu: true }})
      // }
    },
    checkMyExp(item) {
      console.log('🚀 ~ file: course-window.vue ~ line 686 ~ checkMyExp ~ item', item)
    },
    sureClickExp() {
      if (this.checkType === 1) {
        this.$router.push({
          name: 'MyExperiment',
          params: { item_id: this.checkExpId, shareToStu: true },
        })
      }
      if (this.checkType === 2) {
        this.$router.push({
          name: 'MyExperiment',
          params: {
            add: true,
            item: {
              ...this.clickItemData,
              exp_scheme_id: this.checkExpId,
              is_pai: 1,
              exp_book_id: this.clickItemData.id,
            },
            item_id: this.checkExpId,
            copy: this.clickItemData.copy !== undefined ? this.clickItemData.copy : true,
            copyId: -1,
          },
        })
      }
      if (this.checkType === 3) {
        this.$router.push({
          name: 'MyExperiment',
          params: { item_id: this.checkExpId, shareToStu: true },
        })
      }
      this.checkShow = false
    },
    // 备课
    prepare(item) {
      this.checkType = 2
      this.clickItemData = item
      if (item.exp_id.length > 1) {
        this.checkList = item.exp_id.map((e, i) => {
          return {
            value: e,
            label: item.name[i],
            need_pai: item.pai[i].need_pai,
          }
        })
        this.checkShow = true
      } else {
        this.$router.push({
          name: 'MyExperiment',
          params: {
            add: true,
            item: {
              ...item,
              exp_scheme_id: item.exp_id[0],
              is_pai: 1,
              exp_book_id: item.id,
            },
            item_id: item.exp_id[0],
            copy: item.copy !== undefined ? item.copy : true,
            copyId: -1,
          },
        })
      }
    },
    back() {
      this.activeIndex = '0'
      this.$emit('back')
    },
    download() {
      console.log(this.dataProp[this.activeIndex])
      const token = localCache.getCookie('swr_token')

      axios
        .post(
          process.env.VUE_APP_APP_BASEURL + '/teach/expBook/expBookMaterialExport',
          { token, id: this.dataProp[this.activeIndex].id },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.dataProp[this.activeIndex].name.join(',') + '-' + '实验通知单.docx'
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

    getInstrument(item) {
      this.$emit('getInstrument', item)
      this.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.base-box {
  position: fixed;
  top: 6vh;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
  // background-color: rgba(255, 255, 255, 0.534);
  .msg-box {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 40vw;

    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    transform: translate(-50%, -50%);
    .header {
      position: relative;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #333;
      background-color: #fff;
      border-bottom: 1px solid #05c65d;
      .button-box {
        position: absolute;
        top: 50%;
        right: 0;
        display: flex;
        align-items: center;
        transform: translate(0, -50%);
        .button {
          display: flex;
          align-items: center;
          margin: 0 12px;
          cursor: pointer;
        }
        .button:hover {
          color: #05c65d;
        }
      }
      i {
        // width: 24px;
        // height: 24px;
        margin-right: 2px;
        font-size: 20px;
      }
    }
    ::v-deep .need-change {
      position: relative;
      margin-left: 10px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      img {
        // position: absolute;
        // top: 5px;
        // left: -16px;
        width: 14px;
        height: 14px;
        margin-right: 2px;
      }
    }
    .msg-body {
      position: relative;
      padding: 0 20px 10px;
      max-height: 70vh;
      overflow-y: scroll;
      .base-row {
        display: flex;
        padding: 12px 0;
        min-height: 28px;
        line-height: 30px;
        text-align: left;
        color: #8e8e8e;
        .ms_span {
          text-align: left;
          width: 90px;
          font-size: 14px;
          color: #626572;
        }
        .right-box {
          width: calc(100% - 90px);
        }
        .el-input {
          width: 100%;
          ::v-deep .el-input__inner {
            width: 100% !important;
          }
        }
        & .el-select ::v-deep .el-input__inner {
          width: 200px !important;
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
        margin: 0 10px 10px 0;
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
          z-index: 10;
        }
      }
      .active-lab {
        background: #dcece3;
        color: #05c65d;
        border: 1px dotted #c9c7c7;
      }
    }
    .excel-box {
      padding: 0 20px 10px;
      max-height: 70vh;
      overflow-y: scroll;
      text-align: left;
      .message-box {
        display: flex;
        flex-wrap: wrap;
        .row {
          display: flex;
          width: 50%;
          border-bottom: 1px solid #c9c7c7;
          border-right: 1px solid #c9c7c7;

          box-sizing: border-box;
          .name {
            padding-left: 1.2vw;
            width: 120px;
            height: 60px;
            line-height: 60px;
            background: #dcece3;
            color: #626572;
            box-sizing: border-box;
          }
          .details {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0 14px;
            height: 100%;
          }
        }
        .row:nth-of-type(2n + 1) {
          border-left: 1px solid #c9c7c7;
        }
        .row:nth-of-type(-n + 2) {
          border-top: 1px solid #c9c7c7;
        }
        .row-100 {
          width: 100%;
          border-left: 1px solid #c9c7c7;
        }
      }
      .instrument-list {
        .title {
          margin: 4px 0;
          color: #05c65d;
          font-weight: bold;
          font-size: 20px;
        }
        .ins-tips {
          margin: 4px 0;
          span {
            color: #848484;
          }
        }
        .el-table {
          border: #05c65d 1px dotted;
        }
      }
    }
    .footer2 {
      margin: 10px 0;
      height: 32px;
      line-height: 32px;

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
    .footer3 {
      width: 100%;
      text-align: right;
      & > p {
        margin-right: 150px;
        & > span {
          cursor: pointer;
          color: #05c65d;
        }
      }
    }
    .my-button {
      position: relative;
      margin: 0 10px;
      padding: 0 20px;
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      background: #05c65d;
      color: white;
      border: 1px solid #d9d9d9;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      text-align: center;
      cursor: pointer;
      .tips {
        position: absolute;
        left: 0;
        top: 38px;
        line-height: normal;
        white-space: nowrap;
        color: #333;
      }
    }
    .my-button-white {
      background: #fff;
      color: #333333;
    }
    .my-button-gray {
      background: #bcbcbc;
      // color: #333333;
    }
  }
  .msg-body-sco {
    // height: 610px;
    // background-color: aqua;
    overflow-y: auto;
    ::v-deep .only-one {
      .el-tabs__header {
        display: none;
      }
    }
    .el-tabs__content {
      // .el-textarea {
      //   height: 70px;
      //   ::v-deep .el-textarea__inner {
      //     height: 70px;
      //   }
      // }
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
  .havecolor {
    cursor: pointer;
    color: #05c65d !important;
  }
  ::v-deep .el-dialog {
    // margin-top: 5vh !important;
    background-color: #e8e8e9;
    .el-dialog__body {
      border-top: 1px solid #05c65d;
      .exp-list {
        width: 100%;
        text-align: left;
        .el-radio-group {
          // display: flex;
          // flex-direction: column;
          // justify-content: center;
          // align-items: center;
          width: 100%;
        }
        .el-radio {
          margin-left: 0;
          width: 100%;
          margin-bottom: 10px;
          background: #fff;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.check-my-exp-box {
  .check-my-exp {
    margin: 10px 0;
    max-height: 50vh;
    overflow-y: scroll;
    .exp-item {
      margin: 6px 0;
      padding: 0 10px;
      height: 24px;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: #e8e8e9;
      cursor: pointer;
    }
    .exp-item-active {
      background: #05c65d;
      color: #fff;
    }
  }
  .btn-pop-box {
    text-align: right;
  }
  .my-button-pop {
    margin: 0 10px;
    padding: 0 20px;
    min-width: 100px;
    height: 36px;
    line-height: 36px;
    background: #05c65d;
    color: white;
    border: 1px solid #d9d9d9;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
  }
  .my-button-pop-white {
    background: #fff;
    color: #333333;
  }
}

.share-my-exp-box {
  text-align: center;
  span {
    color: #05c65d;
    text-decoration: underline;
    cursor: pointer;
  }
}
.add-instrument {
  background-color: #fff;
  .input-box {
    display: flex;
    & > p {
      width: 100px;
      line-height: 30px;
    }
  }
  .table-box {
    margin-top: 10px;
  }
}
.cancel-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .cancel-box {
    p {
      margin-bottom: 10px;
    }
  }
}
.sure-ready {
  .table-box {
    margin-bottom: 10px;
  }
  .checkbox-box {
    margin: 10px 0;
  }
}
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
.ins-popover {
  padding: 0;
  .instrument-list {
    border: #05c65d 1px solid;
    .ins-tips {
      min-height: 40px;
      border-top: #05c65d 1px solid;
    }
  }
  .popper__arrow {
    display: none;
  }
}
</style>
