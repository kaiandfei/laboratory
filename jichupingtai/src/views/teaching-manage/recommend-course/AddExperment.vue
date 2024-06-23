<template>
  <div>
    <div class="all" v-show="!showSortTable">
      <div class="content">
        <p class="header">实验方案编辑</p>
        <div class="baseInfo">
          <!-- <p>基本信息</p> -->
          <ItemTitle :title-text="'基本信息'" />
          <div class="button-box">
            <button @click="cancel">取消</button>
            <button @click="submitForm('ruleForm')">保存</button>
            <!-- <button v-show="copydata.copy === false&&item_id!==0&&!copydata.shareToStu" @click="save(true)">另存为</button> -->
          </div>
        </div>
        <!-- <div class="split"/> -->
        <div class="experiment">
          <el-form :model="item" :rules="rules" ref="ruleForm" class="ruleForm">
            <div class="experiment_body">
              <div>
                <ul class="experiment_content">
                  <li class="experiment_title">实验名称</li>
                  <li class="experiment_input">
                    <el-form-item label="" prop="name">
                      <el-input v-model="item.name" placeholder="请输入实验名称" maxlength="50" show-word-limit />
                    </el-form-item>
                  </li>
                </ul>
                <ul class="experiment_content">
                  <li class="experiment_title" :class="{ notRequired: stageList.length === 1 }">学&emsp;&emsp;段</li>
                  <li class="experiment_input">
                    <el-form-item label="" prop="stage">
                      <el-radio-group v-if="stageList.length > 1" v-model="item.stage" @change="item.grade = ''">
                        <el-radio v-for="(item, index) in stageList" :key="index" :label="item.value">
                          {{ item.name }}
                        </el-radio>
                      </el-radio-group>
                      <span v-else>{{ stageList[0].name }}</span>
                    </el-form-item>
                  </li>
                </ul>
                <ul class="experiment_content">
                  <li class="experiment_title">年&emsp;&emsp;级</li>
                  <li class="experiment_input">
                    <el-form-item label="" prop="grade">
                      <el-select v-model="item.grade" placeholder="请选择">
                        <el-option
                          v-for="(item2, index) in gradeList.filter((e, i) => {
                            if (item.stage === 1) {
                              return i < 6
                            } else if (item.stage === 2) {
                              return i >= 6 && i < 9
                            } else if (item.stage === 3) {
                              return i >= 9
                            } else {
                              return true
                            }
                          })"
                          :key="index"
                          :label="item2.name"
                          :value="item2.value"
                        />
                      </el-select>
                    </el-form-item>
                  </li>
                </ul>
                <ul class="experiment_content">
                  <li class="experiment_title">实验类型</li>
                  <li class="experiment_input">
                    <el-form-item label="" prop="type">
                      <el-select v-model="item.type" placeholder="请选择">
                        <el-option
                          v-for="(m, n) in store.state.common.groupTypeList"
                          :key="n"
                          :label="m"
                          :value="n + 1"
                        />
                      </el-select>
                      <!-- <el-radio-group v-model="item.type">
                        <el-radio :label="1">必做实验</el-radio>
                        <el-radio :label="2">选做实验</el-radio>
                      </el-radio-group> -->
                    </el-form-item>
                  </li>
                </ul>
                <ul class="experiment_content">
                  <li class="experiment_title">学&emsp;&emsp;科</li>
                  <li class="experiment_input">
                    <el-form-item label="" prop="c_subject_id">
                      <el-select v-model="item.c_subject_id" placeholder="请选择">
                        <el-option
                          v-for="(item, index) in store.state.common.subjectList"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </li>
                </ul>
                <ul class="experiment_content">
                  <li class="experiment_title notRequired">专&emsp;&emsp;题</li>
                  <li class="experiment_input">
                    <el-form-item label="" prop="number">
                      <el-select v-model="item.topic_true_id" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in topicArr" :key="index" :value="item" />
                      </el-select>
                      <!-- <el-input v-model="item.topic_true_id" placeholder="请输入内容" /> -->
                    </el-form-item>
                  </li>
                </ul>
              </div>
              <div class="up_img">
                <span>封面图</span>
                <el-upload
                  class="avatar-uploader"
                  :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                  :data="filedata"
                  name="image"
                  :file-list="fileList"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="fileList.length !== 0" :src="fileList[0].url" class="avatar" />
                  <i v-show="fileList.length === 0" class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </div>
            </div>
          </el-form>
          <div class="introduction">
            <ItemTitle :title-text="'实验简介'" />
            <!-- <p>实验简介</p>
            <div class="split"/> -->
            <el-input
              class="introduction_input"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="请输入内容"
              v-model="item.description"
            />
          </div>
        </div>

        <div class="difficulty">
          <div>
            <p>难度:</p>
            <el-rate
              v-model="item.difficult_level"
              void-icon-class="el-icon-bachelor-cap"
              :icon-classes="['el-icon-bachelor-cap', 'el-icon-bachelor-cap', 'el-icon-bachelor-cap']"
              :colors="['#05C65D', '#05C65D', '#05C65D']"
              :show-text="true"
              :texts="['简单', '普通', '中等', '较难', '困难']"
              text-color="#05C65D"
            />
          </div>
          <div>
            <p>准备时间:</p>
            <el-rate
              v-model="item.time_level"
              void-icon-class="el-icon-time"
              :icon-classes="['el-icon-time', 'el-icon-time', 'el-icon-time']"
              :colors="['#05C65D', '#05C65D', '#05C65D']"
              :show-text="true"
              :texts="['10分钟', '20分钟', '30分钟', '40分钟', '50分钟']"
              text-color="#05C65D"
            />
          </div>
          <div>
            <p>实验时间:</p>
            <el-rate
              v-model="item.exp_time"
              void-icon-class="el-icon-time"
              :icon-classes="['el-icon-time', 'el-icon-time', 'el-icon-time']"
              :colors="['#05C65D', '#05C65D', '#05C65D']"
              :show-text="true"
              :texts="['10分钟', '20分钟', '30分钟', '40分钟', '50分钟']"
              text-color="#05C65D"
            />
          </div>
          <div>
            <p>分组建议:</p>
            <el-rate
              v-model="item.person_group"
              void-icon-class="el-icon-s-custom"
              :icon-classes="['el-icon-s-custom', 'el-icon-s-custom', 'el-icon-s-custom']"
              :colors="['#05C65D', '#05C65D', '#05C65D']"
              :show-text="true"
              :texts="['1人', '2人', '3人', '4人', '5人']"
              text-color="#05C65D"
            />
          </div>
        </div>
        <ItemTitle :title-text="'仪器信息'" />
        <div class="message">
          <instrument
            v-if="item.number"
            :expNumber="item.number"
            :is_del="1"
            ref="avatar"
            :subject_id="item.c_subject_id"
          />
        </div>
        <div class="introduction">
          <p>仪器信息备注</p>
          <el-input class="introduction_input" type="textarea" :rows="4" placeholder="请输入内容" v-model="item.tips" />
        </div>
        <div class="list-title">
          <div class="item">备课资料合集</div>
          <el-upload
            class="upload"
            ref="uploadAll"
            :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
            accept="video/*,image/*,.doc,.docx,.ppt,.pptx,.pdf,.xls,.xlsx"
            :data="filedata"
            name="image"
            :on-success="(response, file, fileList) => onsuccessAll(response, file, fileList, 1)"
            :multiple="false"
            :before-upload="(file) => beforeAvatarUploadAll(file, 1)"
            :on-progress="handleUploadProgress"
            :show-file-list="false"
            :disabled="percentageValue !== 0"
          >
            <div class="btn-upload">
              <!-- <img
                v-show="percentageValue === 0"
                class="iconv"
                src="@images/common/jia.png"
                alt=""
              /> -->
              <i v-show="percentageValue === 0" class="el-icon-circle-plus-outline iconv"></i>
              <div class="text">
                <span>上传</span>
                <span v-show="percentageValue !== 0">中</span>
              </div>
              <el-progress v-show="percentageValue !== 0" :percentage="percentageValue" color="#2d9ff6"></el-progress>
              <i
                v-show="percentageValue !== 0"
                @click.stop="abortRes('uploadAll')"
                class="el-icon-close iconv icon-del"
              ></i>
            </div>
          </el-upload>
        </div>
        <!-- <div class="modules-box">
          <div class="tabs">
            <div
              class="item"
              :class="{ active: activeIndex === 1 }"
              @click="changeIndex(1)"
            >
              <img
                :src="
                  activeIndex === 1
                    ? require('@/assets/images/common/video-icon.png')
                    : require('@/assets/images/common/video-icon-gray.png')
                "
                alt=""
              />
              视频
            </div>
            <div
              class="item"
              :class="{ active: activeIndex === 2 }"
              @click="changeIndex(2)"
            >
              <img
                :src="
                  activeIndex === 2
                    ? require('@/assets/images/common/img-icon.png')
                    : require('@/assets/images/common/img-icon-gray.png')
                "
                alt=""
              />
              图片
            </div>
            <div
              class="item"
              :class="{ active: activeIndex === 3 }"
              @click="changeIndex(3)"
            >
              <img
                :src="
                  activeIndex === 3
                    ? require('@/assets/images/common/link-active.png')
                    : require('@/assets/images/common/link.png')
                "
                alt=""
              />
              附件
            </div>
            <div
              class="item"
              :class="{ active: activeIndex === 4 }"
              @click="changeIndex(4)"
            >
              <img
                :src="
                  activeIndex === 4
                    ? require('@/assets/images/menu/experimental-record-active.png')
                    : require('@/assets/images/menu/experimental-record.png')
                "
                alt=""
              />
              实验报告
            </div>
          </div>
          <div class="details">
            <div class="video-ui" v-show="activeIndex === 1">
              <el-upload
                class="upload"
                :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                :on-preview="onpreview"
                accept="video/*"
                :data="filedata"
                name="image"
                :on-success="
                  (response, file, fileList) => onsuccessAll(response, file, fileList, 1)
                "
                :on-remove="(file, fileList) => handleRemoveAll(file, fileList, 1)"
                :multiple="false"
                :before-upload="(file) => beforeAvatarUploadAll(file, 1)"
                :file-list="fileList1"
              >
                <img class="iconv" src="@images/common/video-icon.png" alt="" />
                <el-button class="btn" size="small" type="primary">新增视频</el-button>
              </el-upload>
              <ul>
                <li v-for="(item, index) in fileList1" :key="index">
                  <video :src="item ? item.url : ''" controls="controls" />
                </li>
              </ul>
            </div>
            <div v-show="activeIndex === 2">
              <el-upload
                class="uploadImg"
                :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                list-type="picture-card"
                accept="image/*"
                :on-preview="handlePictureCardPreview"
                :data="filedata"
                name="image"
                :on-success="
                  (response, file, fileList) => onsuccessAll(response, file, fileList, 2)
                "
                :on-remove="(file, fileList) => handleRemoveAll(file, fileList, 2)"
                :multiple="false"
                :before-upload="(file) => beforeAvatarUploadAll(file, 2)"
                :file-list="fileList2"
              >
                <img class="iconv" src="@images/common/jia.png" alt="" />
                <el-button class="btn img_btn" size="small" type="primary"
                  >上传</el-button
                >
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </div>

            <div class="up-item" v-show="activeIndex === 3">
              <el-upload
                class="upload"
                :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                :on-preview="onpreview"
                :data="filedata"
                name="image"
                :on-success="
                  (response, file, fileList) => onsuccessAll(response, file, fileList, 3)
                "
                :on-remove="(file, fileList) => handleRemoveAll(file, fileList, 3)"
                :multiple="false"
                :before-upload="(file) => beforeAvatarUploadAll(file, 3)"
                :file-list="fileList3"
              >
                <img class="iconv" src="@images/common/huixingzhen.png" alt="" />
                <el-button class="btn" size="small" type="primary">新增附件</el-button>
              </el-upload>
              <ul>
                <li v-for="(item, index) in fileList3" :key="index">
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
            <div v-show="activeIndex === 4">
              <div
                v-if="file4.reportTempletData && file4.reportTempletData.length !== 0"
                class="detail-box"
              >
                <div class="edit" @click="gotoSortTable">编辑</div>
                <template-detail :props-data="file4"></template-detail>
              </div>

              <div v-else class="add-box">
                <el-empty>
                  <template #description>
                    <div class="add" @click="gotoSortTable">暂无数据，点击新建</div>
                  </template>
                </el-empty>
              </div>
            </div>
          </div>
        </div> -->
        <div class="modules-main">
          <div class="modules-top">
            <div class="row">
              <div class="icon">
                <img :src="require('@/assets/images/common/video-icon-white.png')" alt="" />
                <span>视频</span>
              </div>

              <div class="list-box">
                <el-upload
                  class="upload"
                  :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                  accept="video/*"
                  :data="filedata"
                  name="image"
                  :on-remove="(file, fileList) => handleRemoveAll(file, fileList, 1)"
                  :file-list="fileList1"
                  :show-file-list="true"
                >
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
                <ul>
                  <li v-for="(item, index) in fileList1" :key="index">
                    <video :src="item ? item.url : ''" controls="controls" />
                  </li>
                </ul>
                <div v-if="fileList1 && fileList1.length === 0" class="none-data">
                  <img src="@/assets/images/common/kmg-1.png" alt="" />
                  <span>视频</span>
                  暂无数据呀~
                </div>
              </div>
            </div>
            <div class="row">
              <div class="icon">
                <img :src="require('@/assets/images/common/img-icon-white.png')" alt="" />
                <span>图片</span>
              </div>

              <div class="list-box">
                <el-upload
                  class="uploadImg"
                  :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                  list-type="picture-card"
                  accept="image/*"
                  :on-preview="handlePictureCardPreview"
                  :data="filedata"
                  name="image"
                  :on-remove="(file, fileList) => handleRemoveAll(file, fileList, 2)"
                  :multiple="false"
                  :file-list="fileList2"
                ></el-upload>
                <el-dialog v-model="dialogVisible">
                  <img style="width: 100%" width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
                <div v-if="fileList2 && fileList2.length === 0" class="none-data">
                  <img src="@/assets/images/common/kmg-2.png" alt="" />
                  <span>图片</span>
                  暂无数据呀~
                </div>
              </div>
            </div>
            <div class="row">
              <div class="icon">
                <img :src="require('@/assets/images/common/link-icon-white.png')" alt="" />
                <span>附件</span>
              </div>

              <div class="list-box">
                <div class="up-item">
                  <el-upload
                    class="upload"
                    :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                    :on-preview="onpreview"
                    :data="filedata"
                    name="image"
                    :on-remove="(file, fileList) => handleRemoveAll(file, fileList, 3)"
                    :multiple="false"
                    :file-list="fileList3"
                  >
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  </el-upload>
                  <ul>
                    <li v-for="(item, index) in fileList3" :key="index">
                      <a
                        :href="
                          item
                            ? item.name.slice(item.name.length - 4) === '.pdf'
                              ? item.url
                              : 'https://view.officeapps.live.com/op/view.aspx?src=' + item.url
                            : ''
                        "
                        target="blank"
                      >
                        在线预览
                      </a>
                    </li>
                  </ul>
                </div>
                <div v-if="fileList3 && fileList3.length === 0" class="none-data">
                  <img src="@/assets/images/common/kmg-3.png" alt="" />
                  <span>附件</span>
                  暂无数据呀~
                </div>
              </div>
            </div>
            <div class="row">
              <div class="icon">
                <img :src="require('@/assets/images/common/report-icon-white.png')" alt="" />
                <span>在线实验报告</span>
              </div>

              <div class="list-box list-box-nobg">
                <div class="box">
                  <div v-if="file4.reportTempletData && file4.reportTempletData.length !== 0" class="detail-box">
                    <div class="edit" @click="gotoSortTable">编辑</div>

                    <template-detail :props-data="file4"></template-detail>
                  </div>

                  <div v-else class="add-box">
                    <el-empty>
                      <template #description>
                        <div class="add" @click="gotoSortTable">暂无数据，点击新建</div>
                      </template>
                    </el-empty>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="modules-bottom">
            <div class="modules-title">
              <img
                :src="require('@/assets/images/common/report-icon-white.png')"
                alt=""
              />
              实验报告
              <div class="edit" @click="gotoSortTable">编辑</div>
            </div>
            <div class="box">
              <div
                v-if="file4.reportTempletData && file4.reportTempletData.length !== 0"
                class="detail-box"
              >
                <template-detail :props-data="file4"></template-detail>
              </div>

              <div v-else class="add-box">
                <el-empty>
                  <template #description>
                    <div class="add" @click="gotoSortTable">暂无数据，点击新建</div>
                  </template>
                </el-empty>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <editTable v-if="showSortTable" :props-data="file4" @back="back" @changeData="changeFile4" />
  </div>
</template>

<script>
// import headerview from '@/components/HeaderView.vue'
import instrument from './components/instrument.vue'
// import h5p from './components/h5p.vue'
import ItemTitle from '@/components/ItemTitle.vue'
import editTable from './components/edit.vue'
import { useStore } from '@store/index'
import { TEACH_URL } from '@service/request/config'

import {
  Experiment,
  deleteImage,
  findDetail,
  findSections,
  findExpResourcesReportTempletbyteacher
} from '@service/teaching/experimentPlan'
import TemplateDetail from './components/template-detail.vue'

export default {
  name: 'AdddExperment',
  components: {
    ItemTitle,
    instrument,
    // h5p,
    editTable,
    TemplateDetail
  },
  props: {
    item_id: {
      type: Number,
      default: 0
    },
    copydata: {
      type: Object
    }
  },
  data() {
    return {
      imageUrl: '',
      filedata: {
        token: ''
      },
      rules: {
        name: [{ required: true, message: '请输入实验名称', trigger: 'blur' }],
        stage: [{ required: true, message: '请选择学段', trigger: 'change' }],
        grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
        type: [{ required: true, message: '请选择实验类型', trigger: 'change' }],
        c_subject_id: [{ required: true, message: '请选择学科', trigger: 'change' }]
      },
      baseUrl: TEACH_URL,
      activeIndex: 1,
      item: {
        name: '',
        grade: '',
        stage: '',
        type: '',
        subject: '',
        topic_true_id: '',
        description: '',
        time_level: 0,
        exp_time: 0,
        person_group: 0,
        cover_url: '',
        difficult_level: 0,
        share_status: '1',
        is_group: '1', // 非必做实验1分组2演示
        is_use: 0,
        click_count: '1',
        materialList: [],
        imgUrl: '',
        tips: '',
        member_id: useStore().state.login.userInfo.id
      },
      clickItem: {},
      display: false,
      radio: 1,
      grade1: 1,
      type: 1,
      subject: '',
      gradeList: [],
      stageList: [],
      options: [
        {
          value: 1,
          label: '化学'
        },
        {
          value: 2,
          label: '物理'
        },
        {
          value: 3,
          label: '生物'
        }
      ],
      value: '',
      isShowH5p: true,
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
        '选择性必修5'
      ],
      fileList: [
        {
          name: '默认图片',
          url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220707/102957039.jpg'
        }
      ],
      file: {},
      store: {},
      dialogImageUrl: '',
      dialogVisible: false,
      fileList1: [],
      fileList2: [],
      fileList3: [],
      file4: {},
      showSortTable: false,
      loading: null,
      percentageValue: 0,
      percentageValueMax: 91
      // fujianlist: [
      //   { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
      //   { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      // ]
    }
  },
  created() {
    this.store = useStore()
    this.filedata.token = this.store.state.login.userInfo.token
    this.gradeList = this.store.state.common.gradeArr.map((e, i) => {
      return {
        name: e,
        value: i
      }
    })
    this.gradeList.splice(0, 1)
    // this.getPlan()
    this.setStageList()
    // 新增还是修改
    if (this.item_id) {
      this.getDetail(this.item_id)
    } else {
      this.item.number = 'P-swr' + new Date().getTime()
    }
  },
  mounted() {
    // 主页列表跳转修改时重置页面上面距离
    document.getElementsByClassName('el-main')[0].scrollTop = 0
    this.listenerFunction()
  },
  unmounted() {
    document.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 事件监听 监听页面的 scroll 事件，回调方法为 handleScroll
    listenerFunction() {
      document.addEventListener('scroll', this.handleScroll, true)
    },
    // 编写滚动条事件
    handleScroll() {
      // 获取滚动条元素对象
      const ele = document.getElementsByClassName('el-main')[0]
      // 获取需要固定的元素对象
      const editorNav = document.getElementsByClassName('button-box')[0]
      if (ele && editorNav) {
        if (ele.scrollTop > 80) {
          editorNav.classList.add('button-box-scoll')
        } else {
          editorNav.classList.remove('button-box-scoll')
        }
      }
    },
    gotoSortTable() {
      this.showSortTable = true
      if (!this.file4.reportTempletName) {
        this.file4.reportTempletName = this.item.name
      }
    },
    changeFile4(data) {
      this.back()
      this.file4 = data
    },

    back() {
      this.showSortTable = false
    },
    setStageList() {
      this.stageList = [
        {
          name: '小学',
          value: 1
        },
        {
          name: '初中',
          value: 2
        },
        {
          name: '高中',
          value: 3
        }
      ]

      this.item.stage = this.stageList[0] ? this.stageList[0].value : ''
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    getDetail(id) {
      const data = {
        id: id
      }
      findDetail(data).then((res) => {
        this.fileList = []
        if (id !== 0) {
          this.item = res.data
          console.log('🚀 ~ file: AddExperment.vue ~ line 300 ~ findDetail ~ res.data', res.data)
        }
        if ('cover_id' in this.item) {
          this.file = this.item.cover_id
        }
        if (!this.item.number) {
          this.item.number = 'P-swr' + new Date().getTime()
        } else {
          if (this.item.cover_id) this.fileList.push(this.item.cover_id)
        }

        const grade = this.item.grade
        if (grade) {
          if (grade <= 6) {
            this.item.stage = 1
          } else if (grade > 6 && grade <= 9) {
            this.item.stage = 2
          } else {
            this.item.stage = 3
          }
        }
      })
      findSections({
        exp_id: id
      }).then((res) => {
        let fileList = res.data
        console.log('🚀 ~ file:.vue ~ line  fileList', fileList)
        fileList.map((item) => {
          if (item.type === 1) {
            this.fileList1.push(item)
          }
          if (item.type === 2) {
            this.fileList2.push(item)
          }
          if (item.type === 3) {
            this.fileList3.push(item)
          }
        })
      })
      findExpResourcesReportTempletbyteacher({
        exp_id: id
      }).then((res) => {
        this.file4 = res.data
      })
    },
    handleAvatarSuccess(response, file) {
      // console.log(res + '1' + file)
      // this.imageUrl = URL.createObjectURL(file.raw)
      if (response.code === 10) {
        this.fileList = []
        file.url = response.data.file_url
        file.name = response.data.file_name
        console.log(file)
        this.file = file
        console.log(this.file)
        this.item.cover_id = ''
        this.fileList.push(file)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = /\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg,jpg,png 格式!')
      } else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    cancel() {
      this.$emit('back')
    },
    handleRemove(file) {
      deleteImage({ url: file.url }).then((res) => {
        if (res.code === 10) {
          this.$message.success('删除成功')
        }
      })
    },
    onsuccess(response, file) {
      if (response.code === 10) {
        this.fileList = []
        file.url = response.data.file_url
        file.name = response.data.file_name
        this.item.cover_id = ''
        this.fileList.push(file)
      }
    },
    changeIndex(index) {
      this.activeIndex = index
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onsuccessAll(response, file, fileList, index) {
      this.percentageValue = 100

      console.log('🚀 ~ file: h5p.vue ~ line 299 ~ onsuccess ~ fileList', fileList, index)

      if (response.code === 10) {
        let index = 1
        if (/\.(mp4|avi)$/i.test(file.name)) {
          index = 1
        } else if (/\.(gif|jpg|jpeg|png)$/i.test(file.name)) {
          index = 2
        } else if (/\.(doc|docx|ppt|pptx|pdf|xls|xlsx)$/i.test(file.name)) {
          index = 3
        }
        file.url = response.data.file_url
        file.name = response.data.file_name
        file.chapter_type = this.chapter_type
        file.chapter = ''
        file.type = index
        if (index === 1) {
          this.fileList1.push(file)
        } else if (index === 2) {
          this.fileList2.push(file)
        } else if (index === 3) {
          this.fileList3.push(file)
        } else if (index === 4) {
          this.fileList4.push(file)
        }
        this.percentageValue = 0

        // this.loading.close()
      }
    },
    abortRes(ref) {
      this.$refs[ref].abort()
      this.percentageValue = 0
    },
    beforeAvatarUploadAll(file, index) {
      this.percentageValue = 0
      this.percentageValueMax = Math.floor(Math.random() * 10) + 90
      console.log('🚀 ~ file: AddExperment.vue:1070 ~ beforeAvatarUploadAll ~ index:', index)
      // console.log('🚀 ~ file: h5p.vue ~ line 300 ~ beforeAvatarUpload ~ file', file)
      if (!/\.(mp4|avi|gif|jpg|jpeg|png|doc|docx|ppt|pptx|pdf|xls|xlsx)$/i.test(file.name)) {
        this.$message.error(
          '上传视频只能是：mp4,avi 格式!、上传图片只能是：gif,jpeg,jpg,png 格式!、上传文件只能是：doc,docx,ppt,pptx,pdf,xls,xlsx 格式!'
        )
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 200

      if (!isLt2M) {
        this.$message.error('文件不能超过200M，请压缩后上传')
      }
      return isLt2M
      // this.loading = this.$loading({
      //   lock: true,
      //   text: '上传中',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      // if (index === 1) {
      //   if (!/\.(mp4|avi)$/.test(file.name)) {
      //     this.$message.error('上传视频只能是 mp4,avi 格式!')
      //     return false
      //   }
      // }
      // if (index === 2) {
      //   if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
      //     this.$message.error('上传图片只能是 .gif,jpeg,jpg,png 格式!')
      //     return false
      //   }
      // }
      // if (index === 3) {
      //   if (!/\.(doc|docx|ppt|pptx|pdf)$/.test(file.name)) {
      //     this.$message.error('上传文件只能是 doc,docx,ppt,pptx,pdf 格式!')
      //     return false
      //   }
      // }
      // if (index === 4) {
      //   this.$message.error('暂未开放上传虚拟实验')
      //   return false
      // }
    },
    handleUploadProgress(event) {
      // console.log('🚀 ~ file: AddExperment.vue:1134 ~ handleUploadProgress ~ event:', event)
      // 计算上传进度
      const progress = Math.ceil((event.loaded / event.total) * 100)
      // 将进度赋给进度条的 percentage 属性
      this.percentageValue = progress > this.percentageValueMax ? this.percentageValueMax : progress
      // 如果不使用 file.percentage 属性，而是使用 fileList 的方式更新进度条，请参考下面的代码
      // const index = fileList.findIndex(item => item.uid === file.uid);
      // fileList[index].percentage = progress;
    },
    handleRemoveAll(file, fileList, index) {
      if (index === 1) {
        this.fileList1 = fileList
      }
      if (index === 2) {
        this.fileList2 = fileList
      }
      if (index === 3) {
        this.fileList3 = fileList
      }
      if (index === 4) {
        this.fileList4 = fileList
      }
    },
    onpreview(file) {
      window.open(file.url, '_blank')
    },
    save() {
      this.item.is_recommend = 1

      this.item.file = this.fileList[0]
      this.item.materialList = this.$refs.avatar.tableData
      this.item.materialList.map((item) => {
        item.pid = 0
        item.tips = 1
        item.sequence = 1
      })

      this.item.sections = [].concat(this.fileList1).concat(this.fileList2).concat(this.fileList3)
      // .push(this.file4)
      this.item.expResourcesReportTemplet = this.file4

      Experiment(this.item)
        .then((res) => {
          if (res.code === 10) {
            this.$emit('back')
            this.$emit('jumpTo', res.data.id)
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('请查看是未填字段')
        })
    },
    change() {
      const list = this.store.state.common.gradeArr
      if (this.item.stage === 1) {
        this.gradeList = list.filter((e) => {
          return e <= 6
        })
      }
      if (this.item.stage === 2) {
        this.gradeList = list.filter((e) => {
          return e > 6 && e <= 9
        })
      }
      if (this.item.stage === 3) {
        this.gradeList = list.filter((e) => {
          return e > 9
        })
      }
    },
    changeGrade(e) {
      console.log(e)
    },
    // select(e) {
    //   this.item.subject_names = this.store.state.common.phaseArr[e]
    // },
    instrument(data) {
      this.data.materialList = data
    },
    beforeRemove2(file, fileList) {
      console.log(fileList)
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  display: flex;
  justify-content: space-around;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

.split {
  width: 200px;
  height: 4px;
  background: #05c65d;
}

.recommend {
  margin-left: 10px;
  width: 410px;
  & > div {
    position: fixed;
    top: 80px;
    height: 84vh;
    overflow-y: scroll;
    & > div {
      padding: 10px 25px;
      margin-bottom: 10px;
      width: 410px;
      // height: 280px;
      box-sizing: border-box;
      background-color: #fff;
      .header {
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        color: #05c65d;
        border-bottom: 1px solid #05c65d;
        text-align: left;
      }
      p {
        width: 100%;
        margin-top: 14px;
        height: 20px;
        line-height: 20px;
        text-align: left;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p:hover {
        color: #05c65d;
      }
    }
  }
}
.content {
  padding-bottom: 18px;
  flex: 1;
  background-color: #fff;
  .header {
    width: 100%;
    height: 60px;
    background-color: #dcece3;
    color: #05c65d;
    line-height: 60px;
    font-size: 20px;
  }
  .baseInfo {
    display: flex;
    justify-content: space-between;
    p {
      width: 200px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      color: #05c65d;
    }
    .button-box {
      position: fixed;
      top: 120px;
      right: 40px;
      z-index: 100;
      // margin: 10px 40px 0 0;
      & > button {
        margin-right: 20px;
        width: 100px;
        height: 36px;
        background-color: #05c65d;
        border: 1px solid #05c65d;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 10px;
        color: #fff;
      }
      & > :nth-child(1) {
        margin-right: 20px;
        width: 100px;
        height: 36px;
        background-color: #fff;
        border: 1px solid #c9c7c7;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 10px;
        font-size: 14px;
        color: #333;
      }
    }
    .button-box-scoll {
      position: fixed;
      top: 80px;
      right: 40px;
    }
  }

  // 实验名称
  .experiment {
    margin-top: 20px;
    .ruleForm {
      ::v-deep .el-form-item {
        margin-bottom: 0;
        height: 30px;
        line-height: 30px;
        .el-input {
          height: 30px;
        }
      }
    }
    .name {
      display: flex;
      p {
        display: inline-block;
        width: 80px;
        font-size: 18px;
        line-height: 40px;
        text-align-last: justify;
        margin-right: 20px;
      }
    }
    .experiment_body {
      display: flex;
      justify-content: space-between;
      & > div {
        float: left;
        margin-left: 5%;
      }
      .up_img {
        float: right;
        margin-top: 30px;
        margin-right: 8%;
        & > span::before {
          content: '*';
          color: red;
        }
      }
      .upload-demo {
        margin-top: 20px;
        span {
          margin-right: 20px;
        }
      }
    }
    .experiment_content {
      margin-top: 20px;
      display: flex;
      // line-height: 32px;
      li {
        padding-top: 0 !important;
        ::v-deep input[type='number'] {
          -moz-appearance: textfield;
        }
        ::v-deep input[type='number']::-webkit-inner-spin-button,
        ::v-deep input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
      .experiment_title {
        position: relative;
        width: 72px;
        font-size: 14px;
        line-height: 40px;
        color: #848484;
        font-family: 宋体;
      }
      .experiment_title::before {
        content: '*';
        position: absolute;
        left: -2px;
        color: red;
      }
      .notRequired::before {
        visibility: hidden;
      }
      .experiment_input {
        margin-left: 30px;
        display: flex;
        align-items: center;
        :deep(.el-form-item__content) {
          line-height: 30px;
          .el-radio {
            height: 30px;
          }
        }
        .el-input {
          :deep(.el-input__inner) {
            padding-right: 50px;
          }
        }
      }
    }
    .introduction {
      margin-top: 10px;
      p {
        width: 200px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        color: #05c65d;
      }
      .introduction_input {
        margin: 20px auto;
        width: 90%;
      }
    }
  }
  .list-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 230px;
    height: 40px;
    color: #05c65d;
    font-size: 16px;
    border-bottom: #05c65d 4px solid;
    .item {
      position: relative;
      display: flex;
    }
    .btn-upload {
      position: absolute;
      left: 100%;
      top: 50%;
      height: 100%;
      display: inline-flex;
      align-items: center;
      transform: translate(10px, -50%);
      color: #2d9ff6;

      .iconv {
        // width: 20px;
        font-size: 22px;
      }
      .icon-del {
        margin-left: 20px;
        color: #848484;
      }
      .text {
        white-space: nowrap;
        cursor: pointer;
        line-height: 1;
      }
      .el-progress {
        position: absolute;
        left: 0;
        top: 100%;
        width: 32vw;
        transform: translate(0, calc(-50% + 1.6px));
      }
    }
  }
  .modules-main {
    position: relative;
    margin: 30px auto 0;
    width: 90%;
    text-align: left;

    .modules-top {
      .row {
        position: relative;
        padding: 30px 0 30px 30px;
        border-left: 2px dotted #05c65d;
        .icon {
          position: absolute;
          left: -1px;
          top: 0;
          padding: 4px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #05c65d;
          box-sizing: border-box;
          transform: translate(-50%, -50%);
          img {
            width: 100%;
          }
          span {
            position: absolute;
            left: 100%;
            top: 50%;
            color: #05c65d;
            transform: translate(6px, -50%);
            font-weight: 500;
            white-space: nowrap;
          }
        }
        .list-box {
          position: relative;
          background: #dcece3;
          padding: 2px 10px 0 10px;

          .none-data {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 148px;
            background: #dcece3;

            img {
              margin-right: 10px;
              width: 120px;
            }
            span {
              margin-right: 8px;
              color: #05c65d;
            }
          }
          ::v-deep .el-upload {
            display: block;
          }
          .el-image {
            margin: 0 10px 10px 0;
            width: 220px;
            height: 130px;
            border: #05c65d 1px solid;
          }
          & > ul {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 4px;
            & > li {
              display: flex;
              align-items: center;
              margin: 0 10px 10px 0;

              & > a {
                margin-left: 10px;
                margin-right: auto;
                color: black;
              }
              img {
                margin-right: 6px;
                width: 20px;
              }

              & > video {
                width: 220px;
                height: 130px;
                object-fit: cover;
                border: #05c65d 1px solid;
              }
            }
          }
          .up-item {
            display: flex;
            text-align: left;
            padding-bottom: 10px;
            ::v-deep .upload,
            .el-upload-list {
              display: inline-block;
            }
            & > ul {
              margin: 0 0 0 20px;
              width: 160px;
              display: inline-block;
              // transform: translate(0, -9px);
              & > li {
                margin-top: 5px;
                line-height: 1.8;
                & > a {
                  color: black;
                }
              }
              & > li:nth-of-type(1) {
                margin-top: 10px;
              }
            }
          }
        }
        .list-box-nobg {
          background: none;
          padding: 0;
          // ul {
          //   li {
          //     margin-right: 0;
          //     padding: 10px;
          //     width: 100%;
          //     background: #dcece3;
          //   }
          // }
        }
      }
      .row:nth-last-of-type(1) {
        margin-bottom: 20px;
        padding-bottom: 0;
        // border: none;
      }
      .row:nth-of-type(2) {
        .list-box {
          padding-top: 10px;
        }
      }
      .box {
        position: relative;

        padding: 14px 16px;
        border: #e3e3e3 1.6px solid;
        border-radius: 5px;
        .edit {
          position: absolute;
          right: 14px;
          top: 10px;
          display: flex;
          // margin: 0 18px 0 auto;
          padding: 6px;
          font-size: 16px;
          cursor: pointer;
          color: #05c65d;
        }
      }
      .add-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        text-align: center;
        .add {
          padding: 5px;
          color: #05c65d;
          cursor: pointer;
        }
      }
    }
    .modules-bottom {
      border: #05c65d 1px solid;
      border-radius: 12px;
      min-height: 100px;
      .modules-title {
        display: flex;
        align-items: center;
        padding: 8px 10px;
        background: #05c65d;
        border-radius: 10px;
        color: #ffffff;
        img {
          margin-right: 10px;
          width: 20px;
        }
        .edit {
          display: flex;
          margin: 0 18px 0 auto;
          font-size: 16px;
          cursor: pointer;
        }
      }
      .box {
        padding: 10px 20px;
      }
      .add-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        // text-align: center;
        .add {
          padding: 5px;
          color: #05c65d;
          cursor: pointer;
        }
      }
    }
  }
  .message {
    width: 90%;
    margin: 20px auto;
  }
  .difficulty {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 20px auto;
    & > div {
      text-align: left;
      width: 180px;
      & > p {
        margin-bottom: 4px;
        color: #848484;
      }
      & > ::v-deep .el-rate {
        position: relative;
        height: 40px;
        .el-rate__text {
          position: absolute;
          left: 1px;
          bottom: 0;
        }
        .el-rate__icon {
          font-size: 20px;
        }
      }
    }
    //float: 1;
  }

  ::v-deep .el-upload--picture-card {
    width: 250px;
    height: 250px;
    margin-top: 20px;
    .el-icon-plus {
      line-height: 250px;
    }
  }
  :deep(.el-input) {
    line-height: 30px;
    & > .el-input__inner {
      width: 400px;
      height: 30px;
      line-height: 30px;
    }
  }
  // ::v-deep .is-success{
  //   margin-top: 20px;
  //     width: 250px;
  //     height: 250px;
  //   .el-upload-list__item-thumbnail{
  //     width: 250px;
  //     height: 250px;
  //   }
  // }
  ::v-deep .noneImg .el-upload--picture-card {
    display: none;
  }

  .introduction {
    margin-top: 10px;
    p {
      margin: 0 auto;
      width: 90%;
      text-align: left;
      line-height: 40px;
      font-size: 14px;
      color: #848484;
    }
    .introduction_input {
      margin: 6px auto 10px;
      width: 90%;
    }
  }

  .bd {
    margin-bottom: 20px;
  }
  .zaixian {
    margin: 0px 60px;
    border: 1px solid #dcdfe6;
    .title {
      padding: 7px;
      background: #dcece3;
      span {
        display: block;
        width: 50px;
        color: #05c65d;
        border-left: 3px solid #05c65d;
      }
    }
    .h5p {
      position: relative;
      padding: 5px;
      .op_h5p {
        text-align: left;
        height: 40px;
      }
      iframe {
        width: 90%;
        height: 567px;
      }
      .cha {
        position: absolute;
        right: 10px;
        bottom: 50px;
        width: 8%;
        height: 40px;
      }
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader {
  border: 1px solid #848484;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .el-upload-list__item {
  .el-icon-close-tip {
    display: none !important;
    opacity: 0;
  }
}
.uploadImg {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  padding: 5px;
  // min-height: 40px;
  ::v-deep .el-upload--text {
    padding-top: 10px;
    text-align: left;
  }
  ::v-deep .is-success {
    margin-top: 0;
    // height: 100% !important;
  }

  ::v-deep .btn {
    padding: 0px;
    background: none;
    border: none;
    color: #333333;
    font-size: 14px;
  }
  .btn:hover {
    color: #05c65d;
  }
  ::v-deep .img_btn {
    display: inline-block;
  }
  ::v-deep .el-upload-list {
    // margin-top: 40px;
    display: inline-block;
    // max-height: 150px !important;
    // line-height: 150px;
  }
  ::v-deep .is-success {
    width: 150px;
    height: 150px;
    img {
      width: 150px;
      height: 150px;
    }
  }
  ::v-deep .el-upload--picture-card {
    position: absolute;
    top: 0;
    left: 6px;
    margin: 0;
    width: 86px;
    height: 50px;
    line-height: 50px;
    border: none;
    background: none;
  }
}
</style>
<style lang="scss">
.el-message-box__wrapper {
  .el-message-box__title {
    text-align: center;
  }
}
</style>
