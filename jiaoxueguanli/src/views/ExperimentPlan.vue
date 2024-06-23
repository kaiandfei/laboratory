<template>
  <div class="exp-plan">
    <div class="plan" v-show="winState === 0">
      <div class="header">
        <p>实验教学计划表</p>
        <div class="fr">
          <button class="commonbtn no-print" v-show="roleId === 3" @click="addNewPlan">
            新建教学实验计划
          </button>
          <button
            class="commonbtn no-print"
            v-if="[1, 2, 3, 4].includes(roleId)"
            @click="courseOutline(roleId)"
          >
            课程大纲
          </button>
        </div>
      </div>
      <top-filter
        ref="filterRef"
        :options="['time_ids', 'subject_id', 'semester', 'grade']"
        @change="getPlan"
      />
      <!-- <div class="top-filter">
        <div>
          <span>年级：</span>
          <el-select v-model="valueGrade" placeholder="请选择" :clearable="true" @change="getPlan()">
            <el-option
              v-for="item in gradeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </div>
        <div>
          <span>年级：</span>
          <el-select v-model="valueGrade" placeholder="请选择" :clearable="true" @change="getPlan()">
            <el-option
              v-for="item in gradeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </div>
        <div>
          <span>年级：</span>
          <el-select v-model="valueGrade" placeholder="请选择" :clearable="true" @change="getPlan()">
            <el-option
              v-for="item in gradeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </div>
      </div> -->
      <div>
        <div v-if="parseInt(selectObj.semester) === 1" class="term-plan" id="yearOne">
          <p>{{ selectObj.school_year }}学年第一学期</p>
          <ul>
            <li
              class="common_li"
              :class="[item.type === 1 ? 'light_green_bg' : '']"
              v-for="(item, index) in termOne"
              :key="index"
              @click.stop="clickSinglePlan(item)"
            >
              <div :title="item.name">{{ item.name }}</div>
              <div>
                <span><span>年级：</span>{{ $store.state.gradeArr[item.grade] }}</span>
                <span
                  ><span>创建人：</span
                  >{{
                    item.username === $store.getters.getUserMsg.username
                      ? '我'
                      : item.username
                  }}</span
                >
                <span
                  ><span>学科：</span
                  ><span
                    :class="[
                      item.subject === '物理'
                        ? 'blue_bg'
                        : item.subject === '化学'
                        ? 'oringe_bg'
                        : 'green_bg',
                    ]"
                  />{{ item.subject }}</span
                >
                <span><span>创建时间：</span>{{ item.create_time }}</span>
              </div>
              <div>
                <img
                  v-show="item.type === 1 && roleId !== 3"
                  src="@images/common/round-right.png"
                  alt=""
                />
                <img
                  v-show="item.type === 1 && roleId === 3"
                  title="停止使用该计划"
                  @click.stop="clickCancelPlan(item.id, item.type)"
                  src="@images/experimentalRecord/green.png"
                  alt=""
                />
                <img
                  v-show="item.type === 0 && roleId === 3"
                  title="开始启用计划"
                  @click.stop="clickCancelPlan(item.id, item.type)"
                  src="@images/common/round-none.png"
                  alt=""
                />
                <img
                  title="已启用计划不可删除"
                  v-show="item.type === 1 && roleId === 3"
                  @click.stop="showError()"
                  src="@images/common/del-un.png"
                  alt=""
                />
                <img
                  title="删除计划"
                  v-show="item.type === 0 && roleId === 3"
                  @click.stop="delPlan(item.id, item.type)"
                  src="@images/common/del-green.png"
                  alt=""
                />
                <!-- <span v-show=" roleId === 3" @click.stop="delPlan(item.id, item.type)">删除</span> -->
              </div>
            </li>
            <li class="none_li" v-if="termOne.length === 0">
              <div>暂无计划</div>
            </li>
          </ul>
        </div>
        <!-- 注意上面 -->
        <div v-if="parseInt(selectObj.semester) === 2" class="term-plan" id="yearTwo">
          <p>{{ selectObj.school_year }}学年第二学期</p>
          <ul>
            <li
              class="common_li"
              :class="[item.type === 1 ? 'light_green_bg' : '']"
              v-for="(item, index) in termTwo"
              :key="index"
              @click.stop="clickSinglePlan(item)"
            >
              <div :title="item.name">{{ item.name }}</div>
              <div>
                <span><span>年级：</span>{{ $store.state.gradeArr[item.grade] }}</span>
                <span :title="item.username"
                  ><span>创建人：</span
                  >{{
                    item.username === $store.getters.getUserMsg.username
                      ? '我'
                      : item.username
                  }}</span
                >
                <span :title="item.subject"
                  ><span>学科：</span
                  ><span
                    :class="[
                      item.subject === '物理'
                        ? 'blue_bg'
                        : item.subject === '化学'
                        ? 'oringe_bg'
                        : 'green_bg',
                    ]"
                  />{{ item.subject }}</span
                >
                <span :title="item.create_time"
                  ><span>创建时间：</span>{{ item.create_time }}</span
                >
              </div>
              <div>
                <img
                  v-show="item.type === 1 && roleId !== 3"
                  src="@images/common/round-right.png"
                  alt=""
                />
                <img
                  v-show="item.type === 1 && roleId === 3"
                  title="停止使用该计划"
                  @click.stop="clickCancelPlan(item.id, item.type)"
                  src="@images/experimentalRecord/green.png"
                  alt=""
                />
                <img
                  v-show="item.type === 0 && roleId === 3"
                  title="开始启用计划"
                  @click.stop="clickCancelPlan(item.id, item.type)"
                  src="@images/common/round-none.png"
                  alt=""
                />
                <img
                  title="已启用计划不可删除"
                  v-show="item.type === 1 && roleId === 3"
                  @click.stop="showError()"
                  src="@images/common/del-un.png"
                  alt=""
                />
                <img
                  title="删除计划"
                  v-show="item.type === 0 && roleId === 3"
                  @click.stop="delPlan(item.id, item.type)"
                  src="@images/common/del-green.png"
                  alt=""
                />
              </div>
            </li>
            <li class="none_li" v-if="termTwo.length === 0">
              <div>暂无计划</div>
            </li>
          </ul>
        </div>
      </div>
      <el-dialog
        title="上传实验室课程大纲"
        :visible.sync="outlineUploadShow"
        width="55%"
        top="6vh"
      >
        <div class="outline-box">
          <ItemTitle title-text="上传实验室课程大纲" />
          <el-upload
            v-loading="loading"
            class="upload-drag"
            drag
            name="file"
            :data="filedata"
            :action="baseUrl + 'common/upload/putFile'"
            :on-success="fileUploadSuccess"
            :before-upload="fileBeforeUpload"
            :show-file-list="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
            <div class="el-upload__tip">
              支持扩展名：.doc .docx .pdf .jpg .png .xlsx .xls
            </div>
          </el-upload>
          <ItemTitle title-text="上传记录" />
          <el-table :data="filesData" style="width: 100%" max-height="300">
            <el-table-column prop="file_name" label="文件名"> </el-table-column>
            <el-table-column prop="create_time" label="上传时间" width="240">
              <template #default="scope">
                {{ scope.row.create_time && scope.row.create_time.split(' ')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="create_user" label="上传人" width="180">
            </el-table-column>

            <el-table-column prop="" label="操作" width="100" align="center">
              <template #default="scope">
                <div class="click-text" @click="downloadFile(scope.row)">
                  <i class="el-icon-download"></i> 下载
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            style="margin-top: 10px; text-align: right"
            :current-page.sync="currentPage"
            background
            layout="prev, pager, next"
            @current-change="currentChange"
            :total="outlineTotal"
          >
          </el-pagination> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="outlineUploadShow = false">确认</el-button>
          <!-- <el-button type="primary" @click="outlineUploadSave">确认</el-button> -->
        </span>
      </el-dialog>
      <el-dialog
        title="下载实验室课程大纲"
        :visible.sync="outlineDownloadShow"
        width="55%"
        top="6vh"
      >
        <div class="outline-box">
          <!-- <ItemTitle title-text="上传记录" /> -->
          <el-table :data="filesData" style="width: 100%">
            <el-table-column prop="file_name" label="文件名"> </el-table-column>
            <el-table-column prop="create_time" label="上传时间" width="240">
            </el-table-column>
            <el-table-column
              prop="create_user"
              label="上传人"
              width="180"
            ></el-table-column>

            <el-table-column prop="" label="操作" width="100" align="center">
              <template #default="scope">
                <div class="click-text" @click="downloadFile(scope.row)">
                  <i class="el-icon-download"></i> 下载
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            style="margin-top: 10px; text-align: right"
            :current-page.sync="currentPage"
            background
            layout="prev, pager, next"
            @current-change="currentChange"
            :total="outlineTotal"
          >
          </el-pagination> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="outlineDownloadShow = false">确认</el-button>
          <!-- <el-button @click="outlineDownloadShow = false">取消</el-button> -->
        </span>
      </el-dialog>
    </div>
    <div v-show="winState === 1">
      <div class="header">
        <p>
          <span @click="cancel">实验教学计划</span> <i class="el-icon-arrow-right" /> 编辑
        </p>
      </div>
      <div class="add-box">
        <div class="add-left">
          <div class="base-div">
            <p class="base-p">
              <span>基础信息</span>
              <el-checkbox v-model="planBaseData.type" :true-label="1" :false-label="0"
                >启用计划</el-checkbox
              >
              <button class="commonbtn" @click="savePlan">保存</button>
              <button class="graybtn" @click="cancel">取消</button>
            </p>
            <div class="base-div-body">
              <div>
                <p>计划名称：</p>
                <p>学科：</p>
                <p>学段：</p>
              </div>
              <div>
                <div>
                  <el-input
                    v-model="planBaseData.name"
                    maxlength="25"
                    show-word-limit
                    placeholder="请输入内容"
                  />
                </div>
                <div>
                  {{ subjectName(planBaseData.subject_id) }}
                  <!-- <el-select v-model="planBaseData.subject_id" placeholder="请选择">
                    <el-option
                      v-for="item in subjectList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select> -->
                </div>
                <div>
                  {{
                    [
                      '',
                      '小学',
                      '初中',
                      '高中',
                      '完全中学',
                      '职业高中',
                      '九年一贯制',
                      '十二年一贯制',
                    ][$store.state.userMsg.school.school_type_id] || ''
                  }}
                </div>
              </div>
              <div>
                <p />
                <p>学年：</p>
                <p>年级：</p>
              </div>
              <div>
                <div />
                <div>
                  <el-select v-model="planBaseData.school_year" placeholder="请选择">
                    <el-option
                      v-for="item in schYearList"
                      :key="item.value"
                      :label="item.value + '-' + (item.value + 1)"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="f_between">
                  <el-radio
                    v-for="item in gradeList"
                    :key="item.value"
                    :disabled="is_recommend"
                    v-model="planBaseData.grade"
                    @change="changeGrade"
                    :label="item.value"
                    >{{ item.name }}</el-radio
                  >
                </div>
                <!-- <div>
                  <el-select @change="gradeChange" v-model="planBaseData.grade" placeholder="请选择">
                    <el-option
                      v-for="item in gradeList"
                      :key="item.xu"
                      :label="item.name"
                      :value="item.xu"/>
                  </el-select>
                </div> -->
              </div>
              <div>
                <p />
                <p>学期：</p>
                <p>版本：</p>
              </div>
              <div>
                <div />
                <div>
                  <el-radio
                    v-model="planBaseData.semester"
                    v-for="item in semesterList"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.name }}</el-radio
                  >
                </div>
                <div>
                  <el-select v-model="planBaseData.version_id" placeholder="请选择">
                    <el-option
                      v-for="item in eduList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </div>
              </div>
              <img
                v-show="!rightShow"
                class="top_img"
                src="@images/plan/top-img.png"
                alt=""
              />
            </div>
            <div class="class-box">
              <span>班级：</span>
              <div>
                <el-checkbox
                  v-for="(item, index) in classList"
                  :key="index"
                  v-model="item.state"
                >
                  {{ item.name }}
                </el-checkbox>
              </div>
            </div>
          </div>
          <div class="plan-box">
            <p class="base-p">实验教学计划表</p>
            <div class="plan-b-body">
              <div class="flex">
                <div>周次</div>
                <div>实验名称</div>
                <div>分组</div>
                <div>演示</div>
                <div>操作</div>
              </div>
              <div class="scoll_box">
                <div
                  :class="index % 2 === 0 ? '' : 'gray_bg'"
                  class="flex"
                  v-for="(item, index) in selExpList"
                  :key="index"
                >
                  <div>
                    <el-input-number
                      v-model="item.week_time"
                      :min="1"
                      :max="18"
                      label="描述文字"
                    />
                  </div>
                  <div @click="showDetail(item, item.id)">
                    <span class="experiment_name hover-name" :title="item.name">{{
                      item.name
                    }}</span>
                  </div>
                  <div @click="item.type = 1">
                    <i
                      style="color: #409eff; cursor: pointer"
                      class="el-icon-check"
                      v-show="item.type === 1"
                    />
                    <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="!item.state"/> -->
                  </div>
                  <div @click="item.type = 2">
                    <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="item.state"/> -->
                    <i
                      style="color: #409eff; cursor: pointer"
                      class="el-icon-check"
                      v-show="item.type !== 1"
                    />
                  </div>
                  <div @click="delselexp(index, item.id)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="rightShow" class="add-right">
          <el-tabs type="border-card">
            <el-tab-pane label="系统推荐实验列表">
              <div class="select-box">
                <!-- <div class="item">
                  <div class="name">学科</div>
                  <el-select
                    v-model="searchForm.subject_id"
                    placeholder="全部"
                    @change="getExpPlanWeb"
                    clearable
                  >
                    <el-option label="全部" :value="''" />
                    <el-option
                      v-for="item in subjectList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </div> -->
                <div class="item">
                  <div class="name">学段</div>
                  <el-select
                    v-model="searchForm.time_ids"
                    placeholder="全部"
                    @change="changeTimeIds"
                    clearable
                  >
                    <el-option label="全部" :value="''" />
                    <el-option
                      v-for="item in time_idsList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="item">
                  <div class="name">实验</div>
                  <el-input
                    v-model="searchForm.name"
                    @change="getExpPlanWeb"
                    placeholder=""
                  ></el-input>
                </div>
                <div class="item">
                  <div class="name">年级</div>
                  <el-select
                    v-model="searchForm.grade"
                    placeholder="全部"
                    @change="getExpPlanWeb"
                    clearable
                  >
                    <el-option label="全部" :value="''" />
                    <el-option
                      v-for="item in gradeArr.filter((e, i) => {
                        if (searchForm.time_ids === 1) {
                          return e.value <= 6
                        } else if (searchForm.time_ids === 2) {
                          return e.value > 6 && e.value <= 9
                        } else if (searchForm.time_ids === 3) {
                          return e.value > 9
                        } else {
                          return true
                        }
                      })"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="item">
                  <div class="name">专题</div>
                  <!-- <el-input
                    v-model="searchForm.topic_true_id"
                    @change="getExpPlanWeb"
                    placeholder=""
                  ></el-input> -->
                  <el-select
                    v-model="searchForm.topic_true_id"
                    placeholder="全部"
                    @change="getExpPlanWeb"
                    clearable
                  >
                    <el-option label="全部" :value="''" />
                    <el-option
                      v-for="(item, index) in topicArr"
                      :key="index"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
              <div class="flex">
                <div class="r-b-one">
                  <p>实验名称</p>
                  <ul>
                    <li v-for="(item, index) in sysList1Filter" :key="index">
                      <el-checkbox v-model="item.state">
                        <span class="text" :title="item.name">{{ item.name }}</span>
                      </el-checkbox>
                    </li>
                  </ul>
                </div>
                <div class="r-b-two">
                  <p>年级</p>
                  <ul>
                    <li v-for="(item, index) in sysList1Filter" :key="index">
                      {{ $store.state.gradeArr[item.grade] }}
                    </li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="我的实验列表">
              <div class="flex">
                <div class="r-b-one">
                  <p>实验名称</p>
                  <ul>
                    <li v-for="(item, index) in sysList2" :key="index">
                      <el-checkbox v-model="item.state">
                        <span class="text" :title="item.name">{{ item.name }}</span>
                      </el-checkbox>
                    </li>
                  </ul>
                </div>
                <div class="r-b-two">
                  <p>年级</p>
                  <ul>
                    <li v-for="(item, index) in sysList2" :key="index">
                      {{ $store.state.gradeArr[item.grade] }}
                    </li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="green-box" @click="addexp">新增实验 +</div>
        </div>
      </div>
      <div class="masterplate-box" v-if="!planBaseData.id">
        <div class="switch-box">
          <img
            @click="isShow = !isShow"
            :src="
              isShow
                ? require('@/assets/images/taskFeedback/retract-child.png')
                : require('@/assets/images/taskFeedback/show-child.png')
            "
            alt=""
          />
          {{ isShow ? '收起' : '展开' }}所有模版
        </div>
        <div class="box" v-show="isShow">
          <div
            class="masterplate"
            v-for="(item, index) in masterplateList"
            :key="index"
            @click="getDetail(item.id)"
          >
            <div class="name">
              {{ item.name }}
            </div>
            <div class="main">
              <div class="l-box">
                <ul>
                  <li>{{ $store.state.gradeArr[item.grade] }}</li>
                  <li>{{ item.subject }}</li>
                  <li>
                    {{
                      eduList.find((e) => item.version_id - e.id === 0) &&
                      eduList.find((e) => item.version_id - e.id === 0).name
                    }}
                  </li>
                  <li>参考模版</li>
                </ul>
              </div>
              <div class="semester">
                {{ item.semester === 1 ? '第一学期' : '第二学期' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="系统推荐模板" :visible.sync="dialogVisible" width="50%">
        <div class="add-left">
          <div class="base-div">
            <!-- <p class="base-p">
              <span>
                基础信息
              </span>
            </p> -->
            <div class="base-div-body base-div-body-gray">
              <div>
                <p>计划名称：</p>
                <p>学科：</p>
                <p>学段：</p>
                <p>年级：</p>
              </div>
              <div>
                <div>
                  {{ modelPlan.name }}
                </div>
                <div>
                  {{ modelPlan.subject }}
                </div>
                <div>
                  {{
                    stageList[modelPlan.time_ids - 1] &&
                    stageList[modelPlan.time_ids - 1].name
                  }}
                </div>
                <div class="f_between">
                  {{ $store.state.gradeArr[modelPlan.grade] }}
                </div>
              </div>

              <div>
                <p />
                <p>学期：</p>
                <p>版本：</p>
              </div>
              <div>
                <div />
                <div>
                  {{
                    semesterList[modelPlan.semester - 1] &&
                    semesterList[modelPlan.semester - 1].name
                  }}
                </div>
                <div>
                  {{
                    eduList[modelPlan.version_id - 1] &&
                    eduList[modelPlan.version_id - 1].name
                  }}
                </div>
              </div>
            </div>
          </div>

          <div class="plan-box">
            <!-- <p class="base-p">实验教学计划表</p> -->
            <div class="plan-b-body plan-b-body-gray" style="min-height: 100px">
              <div class="flex">
                <div>周次</div>
                <div>实验名称</div>
                <div>分组</div>
                <div>演示</div>
              </div>
              <div class="flex" v-for="(item, index) in modelPlan.detail" :key="index">
                <div>
                  {{ item.week_time }}
                </div>
                <div>{{ item.name }}</div>
                <div>
                  <i
                    style="color: #409eff; cursor: pointer"
                    class="el-icon-check"
                    v-show="item.type === 1"
                  />
                  <!-- @click="item.type = 1" <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="!item.state"/> -->
                </div>
                <div>
                  <!-- @click="item.type = 2" <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="item.state"/> -->
                  <i
                    style="color: #409eff; cursor: pointer"
                    class="el-icon-check"
                    v-show="item.type !== 1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="userOldModel">使 用</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-show="winState === 2">
      <div class="header">
        <span @click="cancel">实验教学计划 </span><i class="el-icon-arrow-right" /><span>
          实验教学计划详情</span
        >
        <!-- <p>实验教学计划详情</p> -->
        <button v-if="roleId === 3" class="commonbtn edit-button" @click="editPlan">
          编辑
        </button>
        <button class="commonbtn graybtn" @click="cancel">返回</button>
        <!-- <div class="selectInput">
          <input type="text" placeholder="搜索">
          <div>
            <img src="@images/taskFeedback/select-icon.png" alt="">
          </div>
        </div> -->
      </div>
      <div class="base_msg_box">
        <p class="base_msg_box_header">启用计划</p>
        <div class="base_msg_box_body">
          <div class="l_box">
            <p><span>计划名称：</span>{{ planItem.name }}</p>
            <p><span>学科：</span>{{ planItem.subject }}</p>
            <p>
              <span>学段：</span>
              {{
                [
                  '',
                  '小学',
                  '初中',
                  '高中',
                  '完全中学',
                  '职业高中',
                  '九年一贯制',
                  '十二年一贯制',
                ][$store.state.userMsg.school.school_type_id] || ''
              }}
            </p>
            <p class="class-box">
              <span>班级：</span>
              <span class="class-name">
                <span v-for="(item, index) in planItem.classs" :key="index">{{
                  item.name
                }}</span>
              </span>
            </p>
          </div>
          <div class="c_box">
            <p><span /></p>
            <p><span>学年：</span>{{ planItem.school_year }}学年</p>
            <p><span>年级：</span>{{ $store.state.gradeArr[planItem.grade] }}</p>
          </div>
          <div class="r_box">
            <p><span /></p>
            <p><span>学期：</span>第{{ planItem.semester }}学期</p>
            <p>
              <span>版本：</span
              >{{
                eduList.find((e) => planItem.version_id - e.id === 0) &&
                eduList.find((e) => planItem.version_id - e.id === 0).name
              }}
            </p>
          </div>
          <img src="@images/plan/top-img.png" alt="" />
        </div>
      </div>
      <div class="single-body">
        <div class="single-body_header flex">
          <div>周次</div>
          <div>实验名称</div>
          <div v-if="roleId !== 3">{{ roleId !== 4 ? '预约开放' : '备课' }}</div>
          <div>分组</div>
          <div>演示</div>
        </div>
        <div class="scoll_box">
          <div
            class="flex"
            :class="index % 2 === 0 ? '' : 'gray_bg'"
            v-for="(item, index) in planItem.detail"
            :key="index"
          >
            <div>
              {{ item.week_time }}
            </div>
            <div>
              <span class="experiment_name" :title="item.name">{{ item.name }}</span>
            </div>
            <div v-if="roleId !== 3">
              <!-- <i @click="item.subscribeState = false" style="color: #409EFF; cursor: pointer;" class="el-icon-check" v-show="item.subscribeState && roleId === 2"/> -->
              <!-- <i @click="setLab(index)" style="color: red;cursor: pointer;" class="el-icon-close" v-show="!item.subscribeState && roleId === 2"/> -->
              <span
                v-show="roleId === 4"
                style="color: #05c65d; cursor: pointer"
                @click="showDetail(item, -1)"
                >查看</span
              >
              <img
                @click="openLabClick(item)"
                v-show="roleId === 2 && item.is_choose === 1"
                src="@images/plan/open-around.png"
                alt=""
              />
              <img
                @click="openLabClick(item)"
                v-show="roleId === 2 && item.is_choose === 0"
                src="@images/plan/open-none.png"
                alt=""
              />
            </div>
            <div>
              <i
                style="color: #05c65d; cursor: pointer"
                class="el-icon-check"
                v-show="item.type === 1"
              />
              <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="!item.state"/> -->
            </div>
            <div>
              <!-- <i style="color: red;cursor: pointer;" class="el-icon-close" v-show="item.state"/> -->
              <i
                style="color: #05c65d; cursor: pointer"
                class="el-icon-check"
                v-show="item.type !== 1"
              />
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        title="选择要开放的实验室"
        :visible.sync="dialogVisible1"
        width="30%"
        :before-close="handleClose"
      >
        <el-checkbox v-for="(item, index) in labList" :key="index" v-model="item.state">{{
          item.name
        }}</el-checkbox>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="changeSingle">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import TopFilter from '@components/top-filter.vue'
import ItemTitle from '@/components/ItemTitle.vue'

import { getDatebyweek } from '../network/subscribe'
import { findschoolyear } from '@network/log'

import {
  getCompany,
  planCancel,
  planDetails,
  addPlan,
  expPlanList,
  delExpPlan,
  delOnePlan,
  // laboratoryByUser,
  openLab,
  getPageData,
  outlineSave,
} from '../network/experimentPlan'

export default {
  name: 'ExperimentPlan',
  components: {
    TopFilter,
    ItemTitle,
  },
  data() {
    return {
      roleId: this.$store.state.userMsg.role_id,
      classList: [],
      outlineUploadShow: false,
      outlineDownloadShow: false,
      baseUrl: process.env.VUE_APP_APP_BASEURL,
      filedata: {
        token: this.$store.state.userMsg.token,
        size: 1024 * 1024 * 50,
        type: 'any',
        field: 'file',
        is_oss: 1,
      },
      loading: false,
      filesData: [],
      currentPage: 1,
      outlineTotal: 0,
      // 计划详情
      planItem: {},
      selectObj: {},
      // 实验iD
      expId: null,
      weekNowObj: {
        week: '',
        year: '',
        weekend: '',
        datatimeArr: [{ time: '' }],
        term_num: 1,
      },
      rightShow: false,
      valueGrade: '',
      dialogVisible: false,
      dialogVisible1: false,
      labList: {
        lab1: true,
        lab2: true,
      },
      labIndex: null,
      termOne: [],
      termTwo: [],
      winState: 0,
      searchForm: {
        subject_id: '',
        time_ids: '',
        grade: '',
        topic_true_id: '',
        name: '',
      },
      sysList1Filter: [],

      subjectList: [
        {
          id: 1,
          name: '物理',
        },
        {
          id: 2,
          name: '化学',
        },
        {
          id: 3,
          name: '生物',
        },
        {
          id: 4,
          name: '小学科学',
        },
      ],
      gradeList: [],
      gradeArr: [],
      stageList: [
        {
          name: '小学',
          value: 1,
        },
        {
          name: '初中',
          value: 2,
        },
        {
          name: '高中',
          value: 3,
        },
      ],
      schYearList: [
        {
          value: 2020,
        },
        {
          value: 2021,
        },
        {
          value: 2022,
        },
      ],
      semesterList: [
        {
          name: '第一学期',
          value: 1,
        },
        {
          name: '第二学期',
          value: 2,
        },
      ],
      eduList: [
        {
          id: 1,
          name: '苏教版',
          status: 0,
        },
        {
          id: 2,
          name: '人教版',
          status: 0,
        },
        {
          id: 3,
          name: '沪教版',
          status: 0,
        },
      ],
      time_idsList: [
        {
          name: '小学',
          value: 1,
        },
        {
          name: '初中',
          value: 2,
        },
        {
          name: '高中',
          value: 3,
        },
      ],
      topicArr: [
        '一年级上',
        '一年级下',
        '二年级上',
        '二年级下',
        '三年级上',
        '三年级下',
        '四年级上',
        '四年级下',
        '五年级上',
        '五年级下',
        '六年级上',
        '六年级下',
        '七年级上',
        '七年级下',
        '八年级上',
        '八年级下',
        '九年级上',
        '九年级下',
        '必修1',
        '必修2',
        '必修3',
        '选择性必修1',
        '选择性必修2',
        '选择性必修3',
        '选择性必修4',
        '选择性必修5',
      ],
      // 选中的实验列表
      selExpList: [],
      // 系统推荐实验列表
      sysList1: [
        {
          week: 1,
          name: '实验1',
          type: false,
          state: false,
          grade: '七年级',
        },
        {
          week: 1,
          name: '实验2',
          type: false,
          state: false,
          grade: '七年级',
        },
        {
          week: 1,
          name: '实验2',
          type: false,
          state: false,
          grade: '七年级',
        },
      ],
      sysList2: [
        {
          week: 1,
          name: '实验1',
          type: false,
          state: false,
          grade: '七年级',
        },
        {
          week: 1,
          name: '实验2',
          type: false,
          state: false,
          grade: '七年级',
        },
        {
          week: 1,
          name: '实验2',
          type: false,
          state: false,
          grade: '七年级',
        },
      ],
      singleData: {
        base: {
          create_time: '2021-08-19 17:17:31',
          grade: 7,
          id: 5,
          name: '2021-2022第一学年物理计划',
          school_year: '2021',
          semester: 1,
          subject: '物理',
          type: 1,
          username: '李老师',
        },
        selExpList: [
          {
            week: 1,
            name: '实验1',
            subscribeState: false,
            type: true,
            state: true,
            grade: '七年级',
          },
          {
            week: 3,
            name: '实验2',
            subscribeState: true,
            type: true,
            state: false,
            grade: '七年级',
          },
        ],
      },
      modelPlan: {
        detail: [],
      },
      planBaseData: {
        id: null,
        name: '',
        time_ids: this.$store.state.userMsg.phase_study_id
          ? Number(this.$store.state.userMsg.phase_study_id.split(',')[0])
          : '',
        grade: 7,
        school_year: 2021,
        semester: 1,
        subject_id: null,
        type: 1,
        version_id: 2,
        detail: [
          {
            name: '第一周实验',
            week_time: 1,
            exp_scheme_id: 1,
          },
          {
            name: '第2周实验',
            week_time: 2,
            exp_scheme_id: 2,
          },
        ],
      },
      clickNowId: 0,
      planBaseDataType: 0,
      masterplateList: [],
      is_recommend: false,
      isShow: true,
      itemDetailId: 0,
      clickWeekTime: 1,
      deleteList: [],
    }
  },
  watch: {
    sysList1: {
      handler: function (newval) {
        console.log('🚀 ~ file: ExperimentPlan.vue ~ line 665 ~ newval', newval)
        this.selExpList = []
        newval.map((e) => {
          // 选项改变时判断是否删除以及取消删除
          if (e.state) {
            this.selExpList.push(e)
            const index = this.deleteList.findIndex((val) => {
              return val === e.id
            })
            if (index !== -1) {
              this.deleteList.splice(index, 1)
            }
          } else {
            if (
              this.planItem.detail &&
              this.planItem.detail.some((val) => {
                return val.id === e.id
              }) &&
              !this.deleteList.includes(e.id)
            ) {
              this.deleteList.push(e.id)
            }
          }
        })
        this.sysList2.map((e) => {
          if (e.state) {
            this.selExpList.push(e)
            const index = this.deleteList.findIndex((val) => {
              return val === e.id
            })
            if (index !== -1) {
              this.deleteList.splice(index, 1)
            }
          } else {
            if (
              this.planItem.detail &&
              this.planItem.detail.some((val) => {
                return val.id === e.id
              }) &&
              !this.deleteList.includes(e.id)
            ) {
              this.deleteList.push(e.id)
            }
          }
        })
      },
      deep: true,
    },
    sysList2: {
      handler: function (newval) {
        console.log('🚀 ~ file: ExperimentPlan.vue ~ line 681 ~ newval', newval)
        this.selExpList = []
        this.sysList1.map((e) => {
          if (e.state) {
            this.selExpList.push(e)
            const index = this.deleteList.findIndex((val) => {
              return val === e.id
            })
            if (index !== -1) {
              this.deleteList.splice(index, 1)
            }
          } else {
            if (
              this.planItem.detail &&
              this.planItem.detail.some((val) => {
                return val.id === e.id
              }) &&
              !this.deleteList.includes(e.id)
            ) {
              this.deleteList.push(e.id)
            }
          }
        })
        newval.map((e) => {
          if (e.state) {
            this.selExpList.push(e)
            const index = this.deleteList.findIndex((val) => {
              return val === e.id
            })
            if (index !== -1) {
              this.deleteList.splice(index, 1)
            }
          } else {
            if (
              this.planItem.detail &&
              this.planItem.detail.some((val) => {
                return val.id === e.id
              }) &&
              !this.deleteList.includes(e.id)
            ) {
              this.deleteList.push(e.id)
            }
          }
        })
      },
      deep: true,
    },
  },
  computed: {
    // computedClassList() {
    //   return this.classList.filter((e) => e.grade_id === this.planBaseData.grade)
    // },
    subjectName() {
      return (val) => {
        let name = ''
        this.$store.state.subjectArr.forEach((e) => {
          if (val === e.id) {
            name = e.name
          }
        })
        return name
      }
    },
  },

  created() {
    this.classList = this.$store.state.classList.map((e) => {
      // this.$set(e, 'state', false)
      // e.state = false
      return {
        ...e,
        state: true,
      }
    })
    this.time_idsList = this.time_idsList.filter((e) =>
      this.$store.state.userMsg.phase_study_id.split(',').includes(e.value.toString())
    )
    this.getYear()
    // this.getPlan()
    this.getExpPlan()
    this.getLabList()

    this.$store.state.gradeArr.forEach((e, i) => {
      let flag = false
      if (this.time_idsList.find((m) => m.value === 1) && i > 0 && i <= 6) {
        flag = true
      }
      if (this.time_idsList.find((m) => m.value === 2) && i > 6 && i <= 9) {
        flag = true
      }
      if (this.time_idsList.find((m) => m.value === 3) && i > 9) {
        flag = true
      }
      if (flag) {
        this.gradeArr.push({
          name: e,
          value: i,
        })
      }
    })
    // this.gradeArr.shift()

    // const year = this.$store.state.schoolDate.year
    // this.schYearList = [
    //   {
    //     value: year - 1
    //   },
    //   {
    //     value: year
    //   },
    //   {
    //     value: Number(year) + 1
    //   }
    // ]
  },
  mounted() {},
  activated() {
    this.getYearTermData()
    document.addEventListener('click', this.backToHomepage)
    if (this.$route.params.id && this.itemDetailId !== 0) {
      const data = {
        id: this.itemDetailId,
      }
      planDetails(data).then((res) => {
        if (res.code === 10) {
          this.planItem = res.data
          this.planBaseData = JSON.parse(JSON.stringify(this.planItem))
          this.selExpList = this.planBaseData.detail
          this.sysList1.map((e) => {
            if (e.state) {
              this.selExpList.push(e)
            }
          })
          this.sysList2.map((e) => {
            if (e.state) {
              this.selExpList.push(e)
            }
          })
          // if (this.roleId === 2 || this.roleId === 4) {
          //   this.winState = 2
          // } else {
          //   this.winState = 1
          //   this.planBaseData = JSON.parse(JSON.stringify(this.planItem))
          //   this.selExpList = this.planBaseData.detail
          // const Index = this.selExpList.findIndex((value) => {
          //   return value.exp_scheme_id === this.clickNowId
          // })
          // console.log('🚀 ~ file: ExperimentPlan.vue ~ line 732 ~ Index ~ Index', this.selExpList, this.clickNowId, Index)
          // this.selExpList[Index].week_time = this.clickWeekTime
          // this.regetExpPlan()
          // }
        }
      })
    }
    this.regetExpPlan()
  },
  deactivated() {
    document.removeEventListener('click', this.backToHomepage)
  },
  methods: {
    backToHomepage(event) {
      const msg = document.getElementsByClassName('el-menu-item')
      if (msg) {
        Array.from(msg).forEach((item) => {
          if (item.contains(event.target)) {
            this.cancel()
          }
        })
      }
    },
    // 课程大纲
    courseOutline(role) {
      this.getCourseList()
      if ([1, 3].includes(role)) {
        this.outlineUploadShow = true
      } else {
        this.outlineDownloadShow = true
      }
    },
    getCourseList() {
      getPageData({ page: this.currentPage }).then((res) => {
        if (res.code === 10) {
          this.filesData = res.data
          // this.outlineTotal = res.data.total
        }
      })
    },
    currentChange(page) {
      console.log('🚀 ~ file: ExperimentPlan.vue:1260 ~ currentChange ~ page:', page)
      this.getCourseList()
    },
    fileBeforeUpload(file) {
      if (!/\.(doc|docx|pdf|jpg|png|xlsx|xls)$/i.test(file.name)) {
        this.$message.error(
          '上传图片只能是 .doc、.docx、.pdf、.jpg、.png、.xlsx、.xls 格式!'
        )
        return false
      }
      console.log('🚀 ~ file: ExperimentPlan.vue:1308 ~ fileBeforeUpload ~ file:', file)
      this.loading = true
    },
    fileUploadSuccess(response) {
      this.loading = false
      outlineSave({
        url: response.data[0].file_url,
        file_name: response.data[0].file_name,
      }).then((res) => {
        this.filesData.unshift(res.data)
      })
    },
    downloadFile(item) {
      console.log('🚀 ~ file: ExperimentPlan.vue:1240 ~ downloadFile ~ item:', item)

      const elink = document.createElement('a')
      elink.download = item.file_name
      elink.style.display = 'none'
      elink.href = item.url
      elink.target = '_blank'
      document.body.appendChild(elink)
      elink.click()
      // URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    },

    getYear() {
      findschoolyear().then((res) => {
        this.schYearList = []
        res.data.forEach((e) => {
          if (!this.schYearList.find((m) => m.value === e.school_year)) {
            this.schYearList.push({ value: e.school_year })
          }
        })
      })
    },
    getYearTermData() {
      getDatebyweek().then((res) => {
        this.weekNowObj = res.data
        // if (this.weekNowObj.term_num === 2) {
        //   // const Div1 = document.getElementById('yearOne')
        //   // const Div2 = document.getElementById('yearTwo')
        //   // Div2.parentElement.appendChild(Div1)
        // }
      })
    },
    editCourse(item) {
      console.log('🚀 ~ file: ExperimentPlan.vue ~ line 782 ~ editCourse ~ item', item)
    },
    changeGrade(grade) {
      console.log('🚀 ~ file: ExperimentPlan.vue:1382 ~ changeGrade ~ grade:', grade)
      this.classList = this.$store.state.classList
        .filter((e) => e.grade_id === grade)
        .map((e) => {
          // e.state = false
          return {
            ...e,
            state: this.planBaseData.id
              ? this.planBaseData.classs.some((m) => m.id === e.id)
              : true,
          }
        })
      // this.getMasterplate(grade)
    },
    cancel() {
      this.winState = 0
      this.planBaseDataType = 0
      this.deleteList = []
      this.planItem = {}
      this.rightShow = false
      this.itemDetailId = 0
      this.clickNowId = 0
    },
    showDetail(item, copyId) {
      this.clickNowId = item.exp_scheme_id
      this.clickWeekTime = item.week_time
      // add: 修改，item: 当前方案（exp_scheme_id）, copy: 是否复制，copyId: 被复制的id，isUse: 是否启用
      this.$router.push({
        name: 'MyExperiment',
        params: {
          add: true,
          item: item,
          item_id: item.exp_scheme_id,
          copy: item.copy !== undefined ? item.copy : true,
          copyId: copyId,
        },
      })
    },
    addexp() {
      this.$router.push({ name: 'MyExperiment', params: { add: true, copy: true } })
    },
    handleClose(done) {
      done()
    },
    addNewPlan() {
      this.getExpPlan()
      this.winState = 1
      this.rightShow = true
      this.selExpList = []
      this.planBaseData = {
        id: null,
        name:
          this.$store.state.schoolDate.school_year +
          (this.$store.state.schoolDate.term_num === 1 ? '第一学期' : '第二学期') +
          this.subjectName(this.$store.state.userMsg.subject_id) +
          '计划模版',
        time_ids: this.$store.state.userMsg.phase_study_id
          ? Number(this.$store.state.userMsg.phase_study_id.split(',')[0])
          : '',
        grade: this.$store.state.userMsg.grade[0] || 7,
        school_year: this.$store.state.schoolDate.year,
        semester: this.$store.state.schoolDate.term_num,
        subject_id: null,
        type: 1,
        version_id: 2,
        detail: [],
      }
      this.planBaseData.subject_id = this.$store.state.userMsg.subject_id
      this.classList = this.$store.state.classList
        .filter((e) => e.grade_id === this.planBaseData.grade)
        .map((e) => {
          return {
            ...e,
            state: true,
          }
        })
      this.getMasterplate()
    },
    // 获取模版
    getMasterplate(grade) {
      getCompany({
        is_recommend: 1,
        is_show: 1,
        grade:
          grade ||
          (Array.isArray(this.$store.state.userMsg.grade)
            ? this.$store.state.userMsg.grade.join(',')
            : ''),
      }).then((res) => {
        this.masterplateList = res.data
      })
    },
    getDetail(id) {
      planDetails({ id }).then((res) => {
        this.modelPlan = res.data
        // this.modelPlan.stage =
        //   this.modelPlan.grade < 7
        //     ? 1
        //     : this.modelPlan.grade >= 7 && this.modelPlan.grade < 10
        //     ? 2
        //     : 3
        this.dialogVisible = true
        console.log('🚀 ~ file: ExperimentPlan.vue:954 ~ planDetails ~ res:', res)
      })
    },
    getLabList() {
      // laboratoryBySubject().then((res) => {

      this.labList = this.$store.state.labList.map((e) => {
        return {
          ...e,
          laboratory_id: e.id,
          state: true,
        }
      })

      // })
    },
    // 设置实验室
    // setLab(index) {
    //   this.labIndex = index
    //   this.dialogVisible1 = true
    // },
    openLabClick(item) {
      console.log(item)
      this.expId = item.id
      // this.getLabList(this.expId)
      this.labList.forEach((e) => {
        if (item.choose.indexOf(e.laboratory_id) === -1) {
          e.state = false
        } else {
          e.state = true
        }
      })
      console.log(
        '🚀 ~ file: ExperimentPlan.vue:957 ~ openLabClick ~ this.labList:',
        this.labList
      )
      this.labList = JSON.parse(JSON.stringify(this.labList))
      this.dialogVisible1 = true
    },
    // 关闭实验室
    closeLabClick(item) {
      console.log(item)
      this.expId = item.id
      this.labList.forEach((e) => {
        if (item.choose.indexOf(e.laboratory_id) === -1) {
          e.state = false
        } else {
          e.state = true
        }
      })
      this.labList = JSON.parse(JSON.stringify(this.labList))
      this.dialogVisible1 = true
    },
    changeSingle() {
      const arr = []
      this.labList.map((e) => {
        if (e.state) {
          arr.push(e.laboratory_id)
        }
      })
      const data = {
        id: this.expId,
        laboratory_id: arr.toString(),
      }
      openLab(data).then((res) => {
        console.log(res)
        if (res.code === 10) {
          this.clickSinglePlan(this.planItem)
          this.dialogVisible1 = false
          this.$message({
            message: '设置成功',
            type: 'success',
          })
        } else {
          this.$message({
            message: '设置失败,请稍后再试!',
            type: 'error',
          })
        }
      })
    },
    // 查看计划详情
    clickSinglePlan(item) {
      this.itemDetailId = item.id
      const data = {
        id: item.id,
        // token: this.$store.state.userMsg.token
      }
      // this.roleId === 3
      this.rightShow = this.roleId === 3
      this.classList = this.$store.state.classList.map((e) => {
        return {
          ...e,
          state: true,
        }
      })

      planDetails(data).then((res) => {
        if (res.code === 10) {
          this.planItem = res.data
          if (res.data.classs) {
            res.data.classs.forEach((e) => {
              this.classList.forEach((n) => {
                if (e.id === n.id) {
                  this.$set(n, 'state', true)
                }
              })
            })
          }
          this.planBaseDataType = res.data.type
          this.winState = 2
        } else {
          this.$message({
            message: '获取计划详情失败,请稍后再试!',
            type: 'error',
          })
        }
      })
      // this.classList = JSON.parse(JSON.stringify(this.classList))
      // this.classList = JSON.parse(JSON.stringify(this.$store.state.classList))
      // this.winState = 2
    },
    // 编辑计划
    editPlan() {
      this.winState = 1
      this.planItem.school_year = parseInt(this.planItem.school_year)
      this.planBaseData = JSON.parse(JSON.stringify(this.planItem))
      this.selExpList = this.planBaseData.detail
      this.classList = this.$store.state.classList
        .filter((e) => e.grade_id === this.planBaseData.grade)
        .map((e) => {
          // e.state = false
          return {
            ...e,
            state: this.planBaseData.classs.some((m) => m.id === e.id),
          }
        })
      this.regetExpPlan()
    },
    // 获取计划表
    getPlan(form) {
      this.selectObj = form
      this.gradeList = []
      this.$store.getters.getUserMsg.grade.map((item) => {
        const obj = {
          name: this.$store.state.gradeArr[item],
          value: item,
        }
        this.gradeList.push(obj)
      })
      console.log(
        '🚀 ~ file: ExperimentPlan.vue:1131 ~ this.$store.getters.getUserMsg.grade.map ~ this.$store.getters.getUserMsg.grade:',
        this.$store.getters.getUserMsg.grade
      )
      console.log('获取学年计划')
      // const data = {
      //   grade: this.valueGrade
      // }
      getCompany({ ...form }).then((res) => {
        if (res.code === 10) {
          this.termOne = []
          this.termTwo = []
          res.data.map((item) => {
            if (item.semester === 1) {
              this.termOne.push(item)
            } else if (item.semester === 2) {
              this.termTwo.push(item)
            }
          })
        } else {
          this.$message({
            message: '计划表获取失败,请稍后再试!',
            type: 'error',
          })
        }
      })
    },
    // 修改实验方案
    regetExpPlan() {
      const data1 = {
        type: 1,
        subject_id: this.$store.state.userMsg.subject_id,
      }
      const data2 = {
        type: 2,
        subject_id: this.$store.state.userMsg.subject_id,
      }
      const clickArr = JSON.parse(JSON.stringify(this.selExpList))
      // 保留编辑的周次以及分组
      if (this.$route.params.id && this.clickNowId !== 0) {
        const Index = clickArr.findIndex((item) => {
          return item.exp_scheme_id === this.clickNowId
        })
        // 先别删除这个console
        console.log(
          '🚀 ~ file: ExperimentPlan.vue ~ line 966 ~ regetExpPlan ~ Type',
          clickArr,
          this.clickNowId,
          Index
        )
        const Id =
          clickArr[Index].id !== clickArr[Index].exp_scheme_id
            ? clickArr[Index].id
            : parseInt(this.$route.params.id)
        const Type = clickArr[Index].type
        clickArr.splice(Index, 1)
        clickArr.push({
          id: Id,
          exp_scheme_id: parseInt(this.$route.params.id),
          week_time: this.clickWeekTime,
          type: Type,
        })
      }
      // expPlanTemp(data1).then(res => {
      //   this.masterplateList = res.data
      // })
      expPlanList(data1).then((res) => {
        const arr = []
        res.data.map((e) => {
          e.exp_scheme_id = e.id
          e.id = clickArr.find((value) => {
            return value.exp_scheme_id === e.id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.id
              }).id
            : e.id
          e.state = clickArr.some((value) => value.exp_scheme_id === e.exp_scheme_id)
          e.week_time = clickArr.find((value) => {
            return value.exp_scheme_id === e.exp_scheme_id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.exp_scheme_id
              }).week_time
            : 1
          e.type = clickArr.find((value) => {
            return value.exp_scheme_id === e.exp_scheme_id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.exp_scheme_id
              }).type
            : e.is_group
          e.copy = true
          arr.push(e)
        })
        this.sysList1 = [...arr]
        this.getExpPlanWeb()
      })
      expPlanList(data2).then((res) => {
        const arr = []
        res.data.map((e) => {
          e.exp_scheme_id = e.id
          e.id = clickArr.find((value) => {
            return value.exp_scheme_id === e.id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.id
              }).id
            : e.id
          e.state = clickArr.some((value) => value.exp_scheme_id === e.exp_scheme_id)
          e.week_time = clickArr.find((value) => {
            return value.exp_scheme_id === e.exp_scheme_id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.exp_scheme_id
              }).week_time
            : 1
          e.type = clickArr.find((value) => {
            return value.exp_scheme_id === e.exp_scheme_id
          })
            ? clickArr.find((value) => {
                return value.exp_scheme_id === e.exp_scheme_id
              }).type
            : e.is_group
          e.copy = false
          arr.push(e)
        })
        this.sysList2 = [...arr]
      })
    },

    getExpPlanWeb() {
      this.sysList1Filter = this.sysList1.filter((e) => {
        return (
          e.name.includes(this.searchForm.name) &&
          (this.searchForm.grade
            ? e.grade === this.searchForm.grade
            : this.searchForm.time_ids
            ? this.searchForm.time_ids === 1
              ? e.grade < 6
              : this.searchForm.time_ids === 2
              ? e.grade < 9 && e.grade >= 6
              : this.searchForm.time_ids === 3
              ? e.grade >= 9
              : true
            : true) &&
          (this.searchForm.topic_true_id
            ? e.topic_true_id === this.searchForm.topic_true_id
            : true) &&
          (this.searchForm.subject_id
            ? e.subject_id === this.searchForm.subject_id
            : true)
        )
      })
    },
    changeTimeIds() {
      this.searchForm.grade = ''
      this.getExpPlanWeb()
    },
    // 获取实验计划表
    getExpPlan() {
      const data1 = {
        type: 1,
        // grade: this.planBaseData.grade,
        subject_id: this.$store.state.userMsg.subject_id,
      }
      const data2 = {
        type: 2,
        // grade: this.planBaseData.grade,
        subject_id: this.$store.state.userMsg.subject_id,
      }

      console.log(
        '🚀 ~ file: ExperimentPlan.vue ~ line 1076 ~ e.id=this.selExpList.find ~  this.selExpList',
        this.selExpList
      )

      expPlanList(data1).then((res) => {
        const arr = []
        res.data.map((e) => {
          e.state = false
          e.exp_scheme_id = e.id
          e.id = this.selExpList.find((value) => {
            return value.exp_scheme_id === e.id
          })
            ? this.selExpList.find((value) => {
                return value.exp_scheme_id === e.id
              }).id
            : e.id
          e.week_time = 1
          e.type = e.is_group
          e.copy = true
          arr.push(e)
        })
        this.sysList1 = arr
      })
      expPlanList(data2).then((res) => {
        const arr = []
        res.data.map((e) => {
          e.state = false
          e.exp_scheme_id = e.id
          e.id = this.selExpList.find((value) => {
            return value.exp_scheme_id === e.id
          })
            ? this.selExpList.find((value) => {
                return value.exp_scheme_id === e.id
              }).id
            : e.id
          e.week_time = 1
          e.type = e.is_group
          e.copy = false
          arr.push(e)
        })
        this.sysList2 = arr
      })
    },
    // 点击取消/设为启用计划
    clickCancelPlan(index, type) {
      const data = {
        id: index,
        type: type === 1 ? 0 : 1,
        // token: this.$store.state.userMsg.token
      }
      const msg = type === 0 ? '设为' : '取消'
      this.$confirm('确定' + msg + '启用计划', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        planCancel(data).then((res) => {
          console.log(res)
          if (res.code === 10) {
            this.$refs.filterRef.changeValue()
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: '操作失败!',
              type: 'error',
            })
          }
        })
      })
    },
    // 使用旧模板
    userOldModel() {
      this.$confirm('使用模板将覆盖原有内容,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.sysList1.forEach((e) => {
          e.state = false
        })
        this.sysList2.forEach((e) => {
          e.state = false
        })
        this.selExpList = []
        this.$nextTick(() => {
          const arr = []
          this.modelPlan.detail.forEach((e) => {
            const obj1 = this.sysList1.find((m) => m.exp_scheme_id === e.exp_scheme_id)
            const obj2 = this.sysList2.find((m) => m.exp_scheme_id === e.exp_scheme_id)

            if (obj1) {
              obj1.state = true
              obj1.type = e.type
              obj1.week_time = e.week_time
            } else if (obj2) {
              obj2.state = true
              obj2.type = e.type
              obj2.week_time = e.week_time
            } else {
              arr.push(e)
            }
          })

          this.selExpList.push(...arr)
          // this.is_recommend = true

          this.planBaseData = {
            ...this.planBaseData,
            name: this.modelPlan.name,
            subject_id: this.modelPlan.subject_id,
            grade: this.modelPlan.grade,
            semester: this.modelPlan.semester,
            version_id: this.modelPlan.version_id,
          }
          this.classList = this.$store.state.classList
            .filter((e) => e.grade_id === this.planBaseData.grade)
            .map((e) => {
              // e.state = false
              return {
                ...e,
                state: this.planBaseData.id
                  ? this.planBaseData.classs.some((m) => m.id === e.id)
                  : true,
              }
            })
          this.dialogVisible = false
        })
      })
    },
    delOnePlanList() {
      this.deleteList.map((item) => {
        const data = {
          id: item,
        }
        delOnePlan(data).then(() => {})
      })
    },
    delselexp(index, id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          console.log(index, id)
          this.sysList1.forEach((item) => {
            if (item.id === id) {
              item.state = false
            }
          })
          this.sysList2.forEach((item) => {
            if (item.id === id) {
              item.state = false
            }
          })
          // if (this.planItem.detail && this.planItem.detail.some((val) => {
          //   return val.id === id
          // })) {
          //   this.deleteList.push(id)
          // }
          this.selExpList.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 保存计划
    savePlan() {
      if (this.planBaseData.name.replace(/[, ]/g, '') === '') {
        this.$message.error('计划名称不能为空')
        return
      }
      if (this.planBaseDataType === 1) {
        this.$confirm(
          '计划已经启用，直接编辑保存会影响教师备课！请与教师提前沟通，是否继续',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            // this.delOnePlanList()
            this.selExpList.map((val, inx) => {
              if (val.id === val.exp_scheme_id) {
                this.selExpList[inx].id = 0
              }
            })
            this.planBaseData.detail = this.selExpList
            let classString = ''
            this.classList
              .filter((e) => e.state === true)
              .forEach((e) => {
                classString = classString + e.id + ','
              })
            classString = classString.substr(0, classString.length - 1)
            this.planBaseData.class_ids = classString
            addPlan(this.planBaseData).then((res) => {
              if (res.code === 10) {
                this.cancel()
                this.$refs.filterRef.changeValue()
                this.classList.forEach((e) => {
                  this.$set(e, 'state', true)
                })
                this.$message({
                  message: '保存成功',
                  type: 'success',
                })
              }
            })
          })
          .catch(() => {})
      } else {
        this.$confirm('确认保存计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          // this.delOnePlanList()
          this.selExpList.map((val, inx) => {
            if (val.id === val.exp_scheme_id) {
              this.selExpList[inx].id = 0
            }
          })
          this.planBaseData.detail = this.selExpList
          let classString = ''
          this.classList
            .filter((e) => e.state === true)
            .forEach((e) => {
              classString = classString + e.id + ','
            })
          classString = classString.substr(0, classString.length - 1)
          this.planBaseData.class_ids = classString
          addPlan(this.planBaseData).then((res) => {
            if (res.code === 10) {
              this.cancel()
              this.$refs.filterRef.changeValue()
              this.classList.forEach((e) => {
                this.$set(e, 'state', true)
              })
              this.$message({
                message: '保存成功',
                type: 'success',
              })
            }
          })
        })
      }
    },
    delPlan(id, index) {
      if (index === 0) {
        const data = {
          id: id,
          // token: this.$store.state.userMsg.token
        }
        this.$confirm('是否删除该计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            delExpPlan(data).then((res) => {
              console.log(res)
              if (res.code === 10) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
                this.$refs.filterRef.changeValue()
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error',
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      } else {
        this.$message({
          message: '启用计划不可删除',
          type: 'error',
        })
      }
    },
    showError() {
      console.log(
        '🚀 ~ file: ExperimentPlan.vue:1488 ~ showError ~ 已启用计划不可删除:',
        '已启用计划不可删除'
      )

      this.$message({
        message: '已启用计划不可删除',
        type: 'warning',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.exp-plan {
  box-sizing: border-box;
  padding: 8px 28px 10px 28px;
  width: 100%;
  .header {
    height: 44px;
    line-height: 44px;
    width: 100%;
    font-size: 16px;
    // box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    // background-color: #fff;
    text-align: left;
    span:nth-of-type(1) {
      margin-left: 10px;
      cursor: pointer;
    }
    span:nth-of-type(1):hover {
      color: #05c65d;
    }
    .commonbtn {
      margin: 6px 0 6px 20px;
      padding: 4px 18px;
      min-width: 0px;
      box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
    }

    p {
      float: left;
      // padding-left: 16px;
      font-size: 16px;
      color: #626572;
    }
    button {
      float: left;
      margin: 6px 12px;
    }
    .graybtn {
      float: right;
    }
    .edit-button {
      float: right;
    }
    .selectInput {
      width: 276px;
      height: 30px;
      float: right;
      margin: 8px 0px 0 0;
      & input {
        padding: 0 12px 0 12px;
        width: 236px;
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
  }
  .top-filter {
    // margin: 8px 1% 0 1%;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    & > div {
      ::v-deep .el-input {
        width: 200px;
        .el-input__inner {
          width: 200px !important;
        }
      }
    }
  }
  ::v-deep .outline-box {
    max-height: 66vh;
    overflow-y: scroll;
    .el-table {
      border: #05c65d 1px dotted;
      .click-text {
        color: #05c65d;
        cursor: pointer;
      }
    }
    .el-upload__tip {
      color: #ee9a59;
    }
  }
  .term-plan {
    margin: 8px 0 0;
    position: relative;
    p {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      color: #333;
      background-color: #fff;
    }
    ul {
      padding-top: 32px;
      width: 100%;
      .common_li {
        display: flex;
        width: 100%;
        padding: 32px;
        height: 102px;
        line-height: 38px;
        background-color: #fff;
        box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.16);
        border-bottom: 1px solid #c9c7c7;
        box-sizing: border-box;
        &:hover {
          background-color: #bef3d6;
        }
        & > :nth-child(1) {
          flex: 1;
          text-align: left;
          font-size: 20px;
          color: #05c65d;
          border-right: 1px solid #c9c7c7;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        & > :nth-child(2) {
          flex: 4;
          display: flex;
          & > span {
            flex: 1;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            & > :nth-child(1) {
              padding-right: 32px;
              color: #848484;
            }
            .blue_bg {
              display: inline-block;
              margin-right: 10px;
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background-color: #5fafe4;
            }
            .oringe_bg {
              display: inline-block;
              margin-right: 10px;
              padding-right: 0;
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background-color: #ee9a59;
            }
            .green_bg {
              display: inline-block;
              margin-right: 10px;
              padding-right: 0;
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background-color: #30b930;
            }
          }
          & > span:nth-of-type(1) {
            & > :nth-child(1) {
              padding-left: 40px;
              color: #848484;
            }
          }
        }
        & > :nth-child(3) {
          flex: 0.6;
          justify-content: right;
          display: flex;
          align-items: center;
          img {
            margin: 0 12px 0;
            cursor: pointer;
            width: 24px;
            height: 24px;
          }
          span {
            margin-right: 30px;
            font-size: 16px;
            color: #05c65d;
            cursor: pointer;
          }
          span:hover {
            color: #05c65d;
          }
        }
        // .li-header {
        //   padding-top: 32px;
        //   height: 26px;
        //   line-height: 26px;
        //   text-align: right;
        //   span {
        //     margin-right: 30px;
        //     font-size: 16px;
        //     color: #05c65d;
        //     cursor: pointer;
        //   }
        //   span:hover {
        //     color: #05c65d;
        //   }
        // }
        // .li-name {
        //   float: left;
        //   padding: 0 30px;
        //   text-align: left;
        //   font-size: 20px;
        //   color: #05c65d;
        // }
        // .li-footer {
        //   margin: 0px auto 0;
        //   padding: 16px 0px 21px;
        //   width: 92%;
        //   box-sizing: border-box;
        //   height: 122px;
        //   line-height: 20px;
        //   text-align: left;
        //   color: #333;
        //   border-bottom: 1px solid #C9C7C7;
        //   display: flex;
        //   justify-content: space-around;
        //   flex-direction: column;
        //   box-sizing: border-box;
        //   // padding-bottom: 10px;
        //   & > div {
        //     width: 100%;
        //     display: flex;
        //     & > span {
        //       float: left;
        //       width: 50%;
        //       span {
        //         width: 100px;
        //         // padding-right: 90px;
        //         color: #848484;
        //       }
        //       .blue_bg {
        //         float: left;
        //         margin-right: 10px;
        //         padding-right: 0;
        //         width: 20px;
        //         height: 20px;
        //         border-radius: 2px;
        //         background-color: #5FAFE4;
        //         margin-left: -30px;
        //       }
        //       .oringe_bg {
        //         float: left;
        //         margin-right: 10px;
        //         padding-right: 0;
        //         width: 20px;
        //         height: 20px;
        //         border-radius: 2px;
        //         background-color: #EE9A59;
        //         margin-left: -30px;
        //       }
        //       .green_bg {
        //         float: left;
        //         margin-right: 10px;
        //         padding-right: 0;
        //         width: 20px;
        //         height: 20px;
        //         border-radius: 2px;
        //         background-color: #30B930;
        //         transform: translate(-30px, 0);
        //         margin-left: -30px;
        //       }
        //     }
        //   }
        //   & :nth-child(1) span {
        //     float: left;
        //   }
        //   & :nth-child(2) span {
        //     float: left;
        //   }
        // }
        // .li-footer > :nth-last-child(1) {
        //   text-align: right;
        //   span span {
        //     text-align: right;
        //   }
        // }
      }
      .light_green_bg {
        background-color: #dcece3;
      }
      & > .none_li {
        text-align: center;
      }
    }
  }
  .base-div {
    margin-top: 8px;
    width: 100%;
    .class-box {
      padding: 20px 0;
      background-color: #fff;
      display: flex;
      & > :nth-child(1) {
        flex: 2;
        margin-left: 8px;
        height: 100%;
        width: 114px;
        text-align: center;
      }
      & > :nth-child(2) {
        flex: 17;
        text-align: left;
      }
    }
    .base-p {
      margin-bottom: 8px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: left;
      & > :nth-child(1) {
        width: 240px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        color: #333;
        background-color: #fff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        position: relative;
        z-index: 50;
      }
      & > :nth-child(2) {
        margin-left: 100px;
      }
      & > :nth-child(4) {
        float: right;
      }
      & > :nth-child(3) {
        float: right;
        margin-left: 12px;
      }
    }
    .base-div-body {
      display: flex;
      width: 100%;
      padding: 0 8px;
      box-sizing: border-box;
      // margin-top: 9px;
      background-color: #fff;
      position: relative;
      z-index: 2;
      .el-select ::v-deep .el-input__inner {
        width: 200px !important;
      }

      .top_img {
        position: absolute;
        bottom: 9px;
        right: 30px;
        width: 241.25px;
        height: 108.32px;
        z-index: -1;
      }
      & > :nth-child(1) {
        flex: 2;
        p {
          height: 60px;
          line-height: 60px;
        }
      }
      & > :nth-child(2) {
        position: relative;
        flex: 4;
        .el-input {
          position: absolute;
          left: 0;
          width: 360px !important;

          ::v-deep .el-input__inner {
            width: 100% !important;
            box-sizing: border-box;
          }
        }
        & > div {
          padding: 15px 0;
          height: 30px;
          line-height: 30px;
          text-align: left;
          .el-checkbox {
            margin-right: 10px;
          }
        }
      }
      & > :nth-child(3) {
        flex: 2;
        p {
          height: 60px;
          line-height: 60px;
        }
      }
      & > :nth-child(4) {
        flex: 4;
        & > div {
          padding: 15px 0;
          height: 30px;
          line-height: 30px;
          text-align: left;
          .el-checkbox {
            margin-right: 10px;
          }
        }
      }
      & > :nth-child(5) {
        flex: 2;
        p {
          height: 60px;
          line-height: 60px;
        }
      }
      & > :nth-child(6) {
        flex: 5;
        & > div {
          padding: 15px 0;
          height: 30px;
          line-height: 30px;
          text-align: left;
          .el-checkbox {
            margin-right: 10px;
          }
        }
      }
      .f_between {
        display: flex;
        align-items: center;
        .el-radio {
          margin-right: 10px;
        }
      }
    }
    .base-div-body-gray {
      background: #f3f3f3;
    }
  }

  .plan-box {
    margin-top: 18px;
    width: 100%;
    // height: 560px;
    text-align: left;
    .base-p {
      // padding-left: 16px;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      width: 240px;
      background-color: #fff;
      font-size: 16px;
      text-align: center;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    }
    .plan-b-body {
      padding: 8px 30px;
      box-sizing: border-box;
      width: 100%;
      // height: 512px;
      background-color: #fff;
      text-align: center;
      min-height: 440px;
      & > :nth-child(1) {
        width: 100%;
        height: 50px;
        line-height: 50px;
        & > :nth-child(1) {
          flex: 1;
        }
        & > :nth-child(2) {
          flex: 3;
        }
        & > :nth-child(3) {
          flex: 1;
        }
        & > :nth-child(4) {
          flex: 1;
        }
        & > :nth-child(5) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(5):hover {
          color: #05c65d;
        }
      }
      & > div {
        width: 100%;
        // height: 50px;
        line-height: 50px;
        & > :nth-child(1) {
          flex: 1;
        }
        & > :nth-child(2) {
          flex: 3;
        }
        & > :nth-child(3) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(4) {
          flex: 1;
          cursor: pointer;
        }
      }
      & > div > div {
        width: 100%;
        height: 50px;
        line-height: 50px;
        & > :nth-child(1) {
          flex: 1;
        }
        & > :nth-child(2) {
          flex: 3;
        }
        & > :nth-child(3) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(4) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(5) {
          flex: 1;
          cursor: pointer;
        }
        & > :nth-child(5):hover {
          color: #05c65d;
        }
        .experiment_name {
          display: inline-block;
          width: 100%;
          padding-left: 25%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          box-sizing: border-box;
        }
        .hover-name:hover {
          color: #05c65d;
          cursor: pointer;
        }
      }
      & > :nth-child(1) {
        height: 44px;
        line-height: 44px;
        border-bottom: 1px solid #c9c7c7;
      }
    }
    .plan-b-body-gray {
      background: #f3f3f3;
    }
  }
}
::v-deep .el-dialog {
  .el-dialog__header {
    border-bottom: #05c65d 1px solid;
  }
  .el-dialog__footer {
    text-align: center;
    .el-button {
      padding: 12px 30px;
      border-radius: 10px;
    }
  }
}
.add-box {
  display: flex;
  width: 100%;
  .add-left {
    flex: 6;
  }
  .add-right {
    // display: flex;
    // flex-direction: column;
    position: sticky;
    top: 20px;
    margin-top: 8px;
    margin-left: 20px;
    height: 80vh;
    // flex: 3;
    .green-box {
      margin-top: 6px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-radius: 10px;
      background-color: #05c65d;
      color: #fff;
      cursor: pointer;
    }
    .el-tabs {
      height: calc(100% - 60px);
      .el-tab-pane {
        height: 100%;
        // overflow-y: scroll;
      }
    }
    .select-box {
      display: flex;
      flex-wrap: wrap;
      // padding: 10px 0;
      width: 450px;
      .item {
        display: flex;
        align-items: center;
        padding: 6px 0;
        width: 50%;
        box-sizing: border-box;
        .name {
          margin-right: 4px;
          width: 50px;
        }
        ::v-deep .el-input {
          flex: 1;
          .el-input__inner {
            width: 100% !important;
          }
        }
        ::v-deep .el-select {
          flex: 1;
          .el-input .el-input__inner {
            width: 100% !important;
          }
        }
      }
    }
    .r-b-one {
      width: 330px;
      padding-left: 20px;
      text-align: left;
      p {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #c9c7c7;
      }

      li {
        padding-left: 12px;
        height: 50px;
        line-height: 50px;
        .el-checkbox {
          display: inline-flex;
          align-items: center;
          height: 50px;
        }
        .text {
          display: inline-block;
          width: 300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .r-b-two {
      width: 100px;
      p {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #c9c7c7;
      }
      li {
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
.masterplate-box {
  text-align: left;
  .switch-box {
    font-size: 18px;
    img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }
  }
  .box {
    display: flex;
    flex-wrap: wrap;
    .masterplate {
      margin: 0 10px 10px 0;
      .name {
        position: relative;
        padding: 0 10px;
        width: 240px;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        font-size: 16px;
        text-align: center;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        z-index: 1;
      }
      .main {
        display: flex;
        justify-content: space-between;
        width: 400px;
        height: 280px;
        border: 10px solid #fff;
        background-image: url('../assets/images/common/exp_bg1.png');
        box-sizing: border-box;
        .l-box {
          padding: 10px;
          width: 120px;
          height: 100%;
          background: rgba(238, 154, 89, 0.59);
          border-radius: 10px;
          box-sizing: border-box;
          color: #fff;
          ul {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            border-radius: 10px;
            border: 1px dotted #fff;
            li {
              position: relative;
              margin: 16px 10px 16px 14px;
              font-size: 14px;
            }
            li::after {
              position: absolute;
              left: -9px;
              top: 50%;
              content: '';
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: #fff;
              transform: translate(0, -50%);
            }
          }
        }
        .semester {
          width: 30px;
          height: 120px;
          background: rgba(5, 198, 93, 0.9);
          line-height: 30px;
          font-size: 16px;
          color: #ffffff;
          writing-mode: vertical-lr;
          text-align: center;
        }
      }
    }
  }
}
.old-plan {
  display: inline-block;
  margin-right: 16px;
  margin-top: 8px;
  width: 400px;
  height: 320px;
  text-align: left;
  position: relative;
  & > p {
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
    background-color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    z-index: 2;
  }
  & > div {
    padding: 10px;
    height: 280px;
    background-color: #fff;
    box-sizing: border-box;
    cursor: pointer;
    position: absolute;
    top: 40px;
    position: relative;
    & > img {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 380px;
      height: 270px;
      z-index: 1;
    }
    & .left {
      position: absolute;
      width: 120px;
      height: 260px;
      background-color: #ee9a59;
      border-radius: 10px;
      z-index: 2;
      opacity: 0.9;
      .l_in {
        margin: 10px;
        width: 100px;
        height: 240px;
        border: 1px dashed #fff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: center;
        color: #fff;
      }
    }
    & .right {
      position: absolute;
      padding: 16px 0;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 88px;
      background-color: #05c65d;
      z-index: 2;
      font-size: 16px;
      line-height: 22px;
      color: #fff;
      text-align: center;
    }
    // div {
    //   padding-top: 20px;
    //   width: 40%;
    //   height: 90%;
    //   background-color: #05c65d;
    //   color: #fff;
    //   p {
    //     height: 24px;
    //     line-height: 24px;
    //   }
    // }
  }
}
.single-body {
  margin-top: 8px;
  box-sizing: border-box;
  padding: 0px 30px 8px;
  width: 100%;
  // height: 512px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  & > :nth-child(1) {
    border-bottom: 1px solid #c9c7c7;
  }
  & .single-body_header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    & > :nth-child(1) {
      flex: 1;
    }
    & > :nth-child(2) {
      flex: 4;
    }
    & > :nth-child(3) {
      flex: 2;
    }
    & > :nth-child(4) {
      flex: 2;
    }
    & > :nth-child(5) {
      flex: 2;
    }
  }
  & .scoll_box {
    width: 100%;
    // height: 460px;
    // overflow-y: auto;
    div {
      width: 100%;
      height: 40px;
      line-height: 40px;
      & > :nth-child(1) {
        flex: 1;
      }
      & > :nth-child(2) {
        flex: 4;
      }
      & > :nth-child(3) {
        flex: 2;
      }
      & > :nth-child(4) {
        flex: 2;
      }
      & > :nth-child(5) {
        flex: 2;
      }
      .experiment_name {
        display: inline-block;
        margin-left: 36%;
        width: 64%;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  & .scoll_box::-webkit-scrollbar {
    width: 0;
  }
}
.none_li {
  width: 100%;
  height: 102px;
  line-height: 102px;
  text-align: center;
  color: #848484;
  background-color: #fff;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.16);
}
.base_msg_box {
  margin-top: 8px;
  width: 100%;
  height: 320px;
  position: relative;
  .base_msg_box_header {
    position: absolute;
    width: 240px;
    height: 40px;
    line-height: 40px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    background-color: #fff;
    z-index: 2;
  }
  .base_msg_box_body {
    position: absolute;
    display: flex;
    box-sizing: border-box;
    padding: 2px 30px;
    top: 40px;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    z-index: 1;
    .l_box {
      flex: 1;
      .class-box {
        position: relative;
        .class-name {
          position: absolute;
          width: 71.6vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            margin-right: 30px;
          }
        }
      }
    }
    .c_box {
      flex: 1;
    }
    .r_box {
      flex: 1;
    }
    img {
      position: absolute;
      bottom: 9px;
      right: 30px;
      width: 241.25px;
      height: 108.32px;
    }
    div {
      p {
        text-align: left;
        height: 60px;
        line-height: 60px;
        & > span:nth-of-type(1) {
          float: left;
          width: 130px;
          color: #848484;
        }
      }
    }
  }
}
.gray_bg {
  background-color: #f6f6f6;
}
::v-deep .el-tabs__content {
  height: calc(100% - 50px);
  overflow-y: auto;
  box-sizing: border-box;
}
::v-deep .el-tabs__content::-webkit-scrollbar {
  width: 6px;
}
::v-deep .el-tabs__content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 6px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #05c65d;
}
::v-deep .el-tabs__content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 6px;
  background: #ededed00;
}
.gray_bg {
  background-color: #f6f6f6;
}
.plan {
  min-height: 800px;
}
.scoll_box::-webkit-scrollbar {
  width: 0;
}
</style>
