<template>
  <div class="main">
    <div class="title">
      <span>学生操作评价与记录</span>
      <div class="btn-box">
        <p class="btn" @click="back">上一步</p>
        <!-- <p class="btn">保存</p> -->
      </div>
    </div>
    <!-- <div class="step-box">
      <div class="name">课前数据</div>
      <div class="content">
        <p class="tip">
          请先备课，再将二维码分享给学生
        </p>
      </div>
    </div> -->
    <div class="step-box">
      <div class="name">课中步骤记录</div>
      <div v-for="(item, index) in studentevaluationData" :key="index">
        <StudentEvaluation
          :FormData="getFromData(item)"
          :expMessage="item"
          v-if="studentevaluationarrShow"
        />
      </div>
    </div>
    <div class="step-box" v-if="role_id === 4">
      <div class="name">评价</div>
      <div class="content">
        <div class="experiment">
          <div class="experiment-name">
            {{ this.courseMessage.name.join(',') }}
          </div>
          <div class="experiment-content">
            <div class="evaluate-myself">
              <ul>
                <li><span>教师自评：</span></li>
                <li>
                  <span>1.实验课资料填写情况：</span>
                  <el-rate
                    v-model="teachertSaveData.effect"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li>
                  <span>2.实验课学生反馈效果：</span>
                  <el-rate
                    v-model="teachertSaveData.feedback"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li>
                  <span>3.实验课实验创新效果：</span>
                  <el-rate
                    v-model="teachertSaveData.preparation"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li><span>总结：</span></li>
                <li><el-input type="textarea" v-model="teachertSaveData.content" /></li>
              </ul>
            </div>
            <!-- <div class="evaluate-admin" v-if="Number(courseMessage.laboratory_id) !== -1">
              <ul>
                <li><span>对实验员评价：</span></li>
                <li>
                  <span>1.实验室仪器准备情况：</span>
                  <el-rate
                    v-model="laboratoryUserSaveData.efficiency"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li>
                  <span>2.实验室审核效率：</span>
                  <el-rate
                    v-model="laboratoryUserSaveData.readycondition"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li><span>评语：</span></li>
                <li>
                  <el-input type="textarea" v-model="laboratoryUserSaveData.content" />
                </li>
              </ul>
            </div> -->
            <div class="btn" @click="saveevaluateObj()">保存评价</div>
          </div>
        </div>
      </div>
    </div>
    <div class="step-box" v-if="false">
      <div class="name">课中报告</div>
      <div
        class="content"
        v-for="(expItem, expIndex) in reportOneData.exp"
        :key="expIndex"
      >
        <div class="exp-name">
          {{ expItem.name }}
        </div>
        <div class="grade_box">
          <div
            class="grade-item"
            v-for="(item2, index2) in rankListReport[expIndex]"
            :key="index2"
          >
            <p>
              等级{{ item2.level }}
              <img
                @click="changeRankShow(item2)"
                v-show="item2.show"
                src="@images/taskFeedback/eyes-open.png"
                alt=""
              />
              <img
                @click="changeRankShow(item2)"
                v-show="!item2.show"
                src="@images/taskFeedback/eyes-close.png"
                alt=""
              />
            </p>
            <p>{{ item2.count }}个</p>
            <p @click="uploadImg(item2.level, 'report', expItem)">
              <img src="@images/taskFeedback/upload-icon.png" alt="" />上传图片
            </p>
          </div>
        </div>
        <div class="student_list">
          <div
            class="student_score"
            v-for="(item, index) in expItem.class_detail
              ? expItem.class_detail.detail
              : []"
            v-show="showDetail(rankListReport[expIndex], item)"
            :key="index"
          >
            <div class="l_img">
              <img :src="item.url[0] ? item.url[0].url : ''" alt="" />
              <img
                class="show_more"
                src="@images/taskFeedback/show-more.png"
                alt=""
                @click="showChildImg(item.url)"
              />
            </div>
            <div class="r_text">
              <img
                src="@images/common/del-green.png"
                alt=""
                @click="delStudentDetail(item.id, 'report')"
              />
              <p>
                <span>学生姓名</span><span>{{ item.name }}</span>
              </p>
              <!-- <p>
                <span>学号</span><span>202155152498</span>
              </p> -->
              <p>
                <span>年级</span><span>{{ item.class_name.slice(0, 2) }}</span>
              </p>
              <p>
                <span>班级</span><span>{{ item.class_name }}</span>
              </p>
              <p>
                <span>等级</span><span>{{ item.level }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="step-box" v-if="false">
      <div class="name">课后习题</div>
      <div
        class="content"
        v-for="(expItem, expIndex) in afterOneData.exp"
        :key="expIndex"
      >
        <div class="exp-name">
          {{ expItem.name }}
        </div>
        <div class="grade_box">
          <div
            class="grade-item"
            v-for="(item2, index2) in rankListAfter[expIndex]"
            :key="index2"
          >
            <p>
              等级{{ item2.level }}
              <img
                @click="changeRankShow(item2)"
                v-show="item2.show"
                src="@images/taskFeedback/eyes-open.png"
                alt=""
              />
              <img
                @click="changeRankShow(item2)"
                v-show="!item2.show"
                src="@images/taskFeedback/eyes-close.png"
                alt=""
              />
            </p>
            <p>{{ item2.count }}个</p>
            <p @click="uploadImg(item2.level, 'after', expItem)">
              <img src="@images/taskFeedback/upload-icon.png" alt="" />上传图片
            </p>
          </div>
        </div>
        <div class="student_list">
          <div
            class="student_score"
            v-for="(item, index) in expItem.class_detail
              ? expItem.class_detail.detail
              : []"
            v-show="showDetail(rankListAfter[expIndex], item)"
            :key="index"
          >
            <div class="l_img">
              <img :src="item.url[0] ? item.url[0].url : ''" alt="" />
              <img
                class="show_more"
                src="@images/taskFeedback/show-more.png"
                alt=""
                @click="showChildImg(item.url)"
              />
            </div>
            <div class="r_text">
              <img
                src="@images/common/del-green.png"
                alt=""
                @click="delStudentDetail(item.id, 'after')"
              />
              <p>
                <span>学生姓名</span><span>{{ item.name }}</span>
              </p>
              <!-- <p>
                <span>学号</span><span>202155152498</span>
              </p> -->
              <p>
                <span>年级</span><span>{{ item.class_name.slice(0, 2) }}</span>
              </p>
              <p>
                <span>班级</span><span>{{ item.class_name }}</span>
              </p>
              <p>
                <span>等级</span><span>{{ item.level }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="showChildFlag !== 0" class="child_img_list">
      <img
        class="close_icon"
        src="@images/taskFeedback/close-white.png"
        alt=""
        @click="showChildFlag = 0"
      />
      <el-carousel :interval="4000" type="card" height="740px">
        <el-carousel-item v-for="(item, index) in imgList" :key="index">
          <img :src="item.url" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div v-show="uploadFlag" class="inputName">
      <img @click="closeUpload()" src="@images/experimentalRecord/close.png" alt="" />
      <div class="student_name">
        姓名：
        <el-autocomplete
          v-model="messageData.student_name"
          value-key="name"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入姓名"
          @select="handleSelect"
        />
      </div>
      <div class="upload_box">
        <el-upload
          :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
          list-type="picture-card"
          :data="filedata"
          name="image"
          :multiple="true"
          :on-success="
            (response, file, fileList) => onsuccessRank(response, file, fileList)
          "
          :on-remove="(file, fileList) => handleRemoveRank(file, fileList)"
          :before-upload="(file) => beforeAvatarUploadRank(file, messageData.student_id)"
          :file-list="fileListRank"
        >
          <!-- :on-preview="handlePictureCardPreview" -->
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisibleRank">
          <img width="100%" :src="dialogImageRank" alt="" />
        </el-dialog>
      </div>
      <div class="commit_btn" @click="uploadStudentImg()">确认上传</div>
    </div>
  </div>
</template>

<script>
// import { getStudentsName } from '@network/taskFeedback'
import {
  uploadReport,
  uploadAfter,
  delStudentReport,
  delStudentAfter,
  getStudentsName,
} from '@network/taskFeedback'
import { getReportOne, getAfterOne } from '@network/experimentRecord'

import { deleteImage } from '@network/experimentPlan'
import { Message } from 'element-ui'
import {
  teachertSave,
  // laboratoryUserSave,
  teacherEvaluationfind,
  // laboratoryUserEvaluationfind,
  findStudentEvaluation,
} from '@network/evaluationStudent'
import StudentEvaluation from './studentevaluation.vue'
import { mapState } from 'vuex'

export default {
  components: { StudentEvaluation },
  name: '',
  props: {
    courseMessage: {
      type: Object,
      default: () => {
        return {
          id: 0,
          class_id: 0,
          exp_id: [],
          name: [],
        }
      },
    },
  },
  data() {
    return {
      group_id: 0,
      baseUrl: process.env.VUE_APP_APP_BASEURL,
      filedata: {
        token: this.$store.state.userMsg.token,
      },
      uploadType: '',
      classItem: {
        level: [],
      },
      dialogImageRank: '',
      dialogVisibleRank: false,
      imgList: [],
      showChildFlag: 0,
      fileListRank: [],
      restaurants: [],
      rankListReport: [],
      rankListAfter: [],
      reportOneData: {},
      afterOneData: {},
      uploadFlag: 0,
      clickItem: {},
      messageData: {
        student_id: 0,
        student_name: '',
        level: '',
        go_class_id: '',
        url: [],
      },
      teachertSaveData: {
        content: '',
        effect: 0,
        feedback: 0,
        go_classid: this.courseMessage.id,
        preparation: 0,
        user_id: this.$store.state.userMsg.id,
      },
      laboratoryUserSaveData: {
        content: '',
        efficiency: 0,
        readycondition: 0,
        go_classid: this.courseMessage.id,
        user_id: this.$store.state.userMsg.id,
      },
      studentevaluationData: [],
      studentevaluationarr: [],
      studentevaluationarrShow: false,
    }
  },
  created() {
    this.studentevaluationData = this.courseMessage.exp_id.map((e, i) => {
      return {
        id: this.courseMessage.id,
        class_id: this.courseMessage.class_id,
        exp_id: e,
        name: this.courseMessage.name[i],
      }
    })

    console.log(this.studentevaluationData)
    // this.studentevaluationData
    if (this.courseMessage.id !== 0) {
      // 11.27注释
      // this.getReport()
      // this.getAfter()
    }
    this.getEvaData()
  },
  mounted() {},
  computed: {
    showDetail() {
      return function (list, item) {
        let flag = false
        list.forEach((e) => {
          if (e.level === item.level && e.show === true) {
            flag = true
          }
        })
        return flag
      }
    },
    ...mapState({
      role_id: (state) => state.userMsg.role_id,
    }),
  },
  methods: {
    getEvaData() {
      teacherEvaluationfind({
        go_classid: this.courseMessage.id,
        user_id: this.$store.state.userMsg.id,
      }).then((res) => {
        if (res.code === 10) {
          if (res.data) {
            delete res.data.id
            this.teachertSaveData = res.data
          }
        }
      })
      // laboratoryUserEvaluationfind({
      //   go_classid: this.courseMessage.id,
      //   user_id: this.$store.state.userMsg.id,
      // }).then((res) => {
      //   if (res.code === 10) {
      //     if (res.data) {
      //       delete res.data.id
      //       this.laboratoryUserSaveData = res.data
      //     }
      //   }
      // })
      findStudentEvaluation({
        go_classid: this.courseMessage.id,
      }).then((res) => {
        if (res.code === 10) {
          if (res.data) {
            console.log(res.data)
            this.studentevaluationarr = res.data
            this.studentevaluationarrShow = true
          }
        }
      })
    },
    getReport() {
      this.rankListReport = []
      getReportOne({
        id: this.courseMessage.id,
      }).then((res) => {
        if (res.code === 10) {
          this.reportOneData = res.data
          this.reportOneData.exp.forEach((e) => {
            const arr = [
              {
                level: 'A',
                show: true,
                count: 0,
              },
              {
                level: 'B',
                show: true,
                count: 0,
              },
              {
                level: 'C',
                show: true,
                count: 0,
              },
              {
                level: 'D',
                show: true,
                count: 0,
              },
            ]
            if (e.class_detail) {
              e.class_detail.level.forEach((item) => {
                if (item.level === 'A') {
                  arr.splice(0, 1, {
                    level: 'A',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
                if (item.level === 'B') {
                  arr.splice(1, 1, {
                    level: 'B',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
                if (item.level === 'C') {
                  arr.splice(2, 1, {
                    level: 'C',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
                if (item.level === 'D') {
                  arr.splice(3, 1, {
                    level: 'D',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
              })
            }
            this.rankListReport.push(arr)
          })
        }
      })
    },
    getAfter() {
      getAfterOne({
        id: this.courseMessage.id,
      }).then((res) => {
        if (res.code === 10) {
          this.afterOneData = res.data
          this.afterOneData.exp.forEach((e) => {
            const arr = [
              {
                level: 'A',
                show: true,
                count: 0,
              },
              {
                level: 'B',
                show: true,
                count: 0,
              },
              {
                level: 'C',
                show: true,
                count: 0,
              },
              {
                level: 'D',
                show: true,
                count: 0,
              },
            ]
            if (e.class_detail) {
              e.class_detail.level.forEach((item) => {
                if (item.level === 'A') {
                  arr.splice(0, 1, {
                    level: 'A',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
                if (item.level === 'B') {
                  arr.splice(1, 1, {
                    level: 'B',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
                if (item.level === 'C') {
                  arr.splice(2, 1, {
                    level: 'C',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
                if (item.level === 'D') {
                  arr.splice(3, 1, {
                    level: 'D',
                    show: true,
                    count: item.Count ? item.Count : 0,
                  })
                }
              })
            }
            this.rankListAfter.push(arr)
          })
        }
      })
    },
    showChildImg(data) {
      this.imgList = data
      this.showChildFlag = 1
    },

    changeRankShow(item) {
      item.show = !item.show
      // this.rank[index].show = !this.rank[index].show
    },
    closeUpload() {
      this.uploadFlag = 0

      if (this.uploadType === 'report') {
        this.fileListRank = []
      } else {
        this.fileList3 = []
      }
    },
    querySearchAsync(queryString, cb) {
      const restaurants = this.restaurants
      const results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    createStateFilter(queryString) {
      return (e) => {
        return e.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect(item) {
      this.messageData.student_id = item.id
    },
    onsuccessRank(response, file, fileList) {
      if (response.code === 10) {
        file.url = response.data.file_url
        file.name = response.data.file_name
        // file.chapter_type = this.chapter_type
        // file.chapter = this.title
        // file.type = index
        this.fileListRank = fileList
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
      deleteImage({ url: file.url }).then((res) => {
        if (res.code === 10) {
          // this.$message.success('删除成功')
          this.fileListRank = fileList
        }
      })
    },
    uploadStudentImg() {
      let err = false
      this.messageData.url = this.fileListRank
      if (this.messageData.student_name === '') {
        this.$message.error('请输入学生姓名!')
        err = true
      } else if (this.messageData.url.length === 0) {
        this.$message.error('请上传图片!')
        err = true
      }
      if (!err) {
        if (this.uploadType === 'report') {
          uploadReport({
            ...this.messageData,
            exp_id: this.clickItem.id,
          }).then((res) => {
            if (res.code === 10) {
              Message({
                type: 'success',
                message: '上传成功',
              })
              this.uploadFlag = 0
              this.messageData.student_id = 0
              this.messageData.student_name = ''
              this.fileListRank = []
              this.getReport()
              // this.getData()
            }
          })
          //   if (this.reportData[this.clickItemIndex].class_detail[0].detail.some((item) => {
          //     return item.name === this.messageData.student_name
          //   })) {
          //     this.$confirm('当前姓名已经上传过, 是否继续?', '提示', {
          //       confirmButtonText: '确定',
          //       cancelButtonText: '取消',
          //       type: 'warning'
          //     }).then(() => {
          //       uploadReport(this.messageData).then((res) => {
          //         if (res.code === 10) {
          //           this.uploadFlagReport = 0
          //           this.messageData.student_id = 0
          //           this.messageData.student_name = ''
          //           this.fileListRank = []
          //           this.getData()
          //         }
          //       })
          //     }).catch(() => {
          //       this.$message({
          //         type: 'info',
          //         message: '已取消上传'
          //       })
          //     })
          //   } else {
          //     uploadReport(this.messageData).then((res) => {
          //       if (res.code === 10) {
          //         this.uploadFlagReport = 0
          //         this.messageData.student_id = 0
          //         this.messageData.student_name = ''
          //         this.fileListRank = []
          //         this.getData()
          //       }
          //     })
          //   }
        } else {
          uploadAfter({
            ...this.messageData,
            exp_id: this.clickItem.id,
          }).then((res) => {
            if (res.code === 10) {
              Message({
                type: 'success',
                message: '上传成功',
              })
              this.uploadFlag = 0
              this.messageData.student_id = 0
              this.messageData.student_name = ''
              this.fileListRank = []
              this.getAfter()
              // this.$refs.filterRef.changeValue()
            }
          })
          // if (this.afterData[this.clickItemIndex].class_detail[0].detail.some((item) => {
          //   return item.name === this.messageData.student_name
          // })) {
          //   this.$confirm('当前姓名已经上传过, 是否继续?', '提示', {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }).then(() => {
          //     uploadAfter(this.messageData).then((res) => {
          //       if (res.code === 10) {
          //         this.uploadFlag3 = 0
          //         this.messageData.student_name = ''
          //         this.fileList3 = []
          //         this.$refs.filterRef.changeValue()
          //       }
          //     })
          //   }).catch(() => {
          //     this.$message({
          //       type: 'info',
          //       message: '已取消上传'
          //     })
          //   })
          // } else {
          //   uploadAfter(this.messageData).then((res) => {
          //     if (res.code === 10) {
          //       this.uploadFlag3 = 0
          //       this.messageData.student_name = ''
          //       this.fileList3 = []
          //       this.$refs.filterRef.changeValue()
          //     }
          //   })
          // }
        }
      }
    },
    uploadImg(level, type, item) {
      this.messageData.student_id = 0
      this.messageData.level = level
      this.messageData.go_class_id = this.courseMessage.id
      this.messageData.class_id = this.courseMessage.class_id
      this.clickItem = item
      const data = {
        class_id: this.courseMessage.class_id,
      }
      getStudentsName(data).then((res) => {
        this.restaurants = res.data
      })
      this.uploadFlag = 1
      this.uploadType = type

      // 判断学生上限
    },
    delStudentDetail(id, type) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (type === 'report') {
            delStudentReport({
              id: id,
            }).then((res) => {
              if (res.code === 10) {
                this.$message({
                  type: 'success',
                  message: res.msg,
                })
                this.$refs.filterRef.changeValue()
              }
            })
          } else {
            delStudentAfter({
              id: id,
            }).then((res) => {
              if (res.code === 10) {
                this.$message({
                  type: 'success',
                  message: res.msg,
                })
                this.$refs.filterRef.changeValue()
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    back() {
      if (JSON.stringify(this.$route.params) !== '{}') {
        this.$router.go(-1)
      } else {
        this.$emit('back')
      }
    },

    saveevaluateObj() {
      teachertSave(this.teachertSaveData).then((res) => {
        // if (Number(this.courseMessage.laboratory_id) !== -1) {
        //   laboratoryUserSave(this.laboratoryUserSaveData).then((res) => {
        //     if (res.code === 10) {
        //       this.$message.success(res.msg)
        //     } else {
        //       this.$message.error(res.msg)
        //     }
        //   })
        // } else {
        this.$message.success(res.msg)
        // }
      })
    },
    getFromData(item) {
      const creteFromData = this.studentevaluationarr.find(
        (item1) => item1.exp_id === item.exp_id
      )
      if (creteFromData) {
        return this.studentevaluationarr.find((item1) => item1.exp_id === item.exp_id)
          .data
      } else {
        const stepList = []
        for (let i = 1; i < 7; i++) {
          stepList.push({
            go_classid: item.id,
            group_id: 0,
            exp_id: item.exp_id,
            star: 0,
            type_id: i,
          })
        }

        return [
          {
            group_id: 0,
            evaluatedata: {
              content: '',
              fileList: [],
              go_classid: item.id,
              exp_id: item.exp_id,
              stepList: stepList,
              user_id: this.$store.state.userMsg.id,
            },
          },
        ]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  position: relative;
  margin: 10px 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: rgba(220, 236, 227, 0.39);
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  & > span {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #05c65d;
  }
  .btn-box {
    position: absolute;
    right: 20px;
    top: 12px;
    // width: 180px;
    display: flex;
    // justify-content: space-between;
  }
}
.step-box {
  margin-bottom: 20px;
  .name {
    width: 240px;
    height: 40px;
    line-height: 40px;
    background: #ffffff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  }
  .content {
    width: 100%;
    min-height: 100px;
    background: #ffffff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    text-align: left;
    box-sizing: border-box;
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
    .tip {
      width: 100%;
      line-height: 100px;
      text-align: center;
    }
    .experiment {
      .experiment-name {
        padding-left: 20px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        border-left: 6px solid #05c65d;
        background: rgba(220, 236, 227, 0.39);
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        color: #05c65d;
        box-sizing: border-box;
      }
      .experiment-content {
        position: relative;
        display: flex;
        padding: 40px;
        width: 100%;
        box-sizing: border-box;
        .group-box {
          & > li {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            .tab-btn {
              margin-right: 20px;
              padding: 0 20px;
              height: 36px;
              line-height: 36px;
              color: #05c65d;
              box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
              border: 1px solid #05c65d;
              border-radius: 10px;
              cursor: pointer;
              user-select: none;
            }
            .green-bg {
              background: #05c65d;
              color: #fff;
            }
          }
        }
        .evaluate-admin {
          border-left: 1px dashed #05c65d;
          box-sizing: border-box;
        }
        .evaluate-myself,
        .evaluate-admin {
          padding-left: 40px;
          width: 50%;
          box-sizing: border-box;
          & > ul {
            li {
              display: flex;
              align-items: center;
              line-height: 40px;
              font-size: 16px;
              & > span {
                width: 200px;
              }
              & > ::v-deep .el-rate {
                .el-rate__icon {
                  font-size: 20px;
                }
              }
              ::v-deep .el-textarea {
                width: 80%;
              }
            }
            & > li:nth-of-type(1) {
              font-size: 20px;
            }
          }
        }
        .btn {
          position: absolute;
          right: 20px;
          bottom: 20px;
        }
      }
    }
    .grade_box {
      // float: left;
      position: relative;
      padding: 20px 0 20px 2.5%;
      width: 70%;
      height: 166px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      text-align: center;
      & .grade-item {
        width: 21%;
        height: 166px;
        & :nth-child(1) {
          height: 50px;
          line-height: 50px;
          width: 100%;
          background-color: #dcece3;
          font-size: 16px;
          color: #333;
          font-weight: bold;
          position: relative;
          img {
            position: absolute;
            right: 20px;
            top: 13px;
            width: 24px;
            height: 24px;
          }
        }
        & > :nth-child(2) {
          width: 100%;
          height: 70px;
          line-height: 70px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          color: #626572;
          font-size: 16px;
        }
        & :nth-child(3) {
          width: 100%;
          height: 50px;
          line-height: 50px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          background: #dcece3;
          font-size: 16px;
          color: #05c65d;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          img {
            // position: absolute;
            // left: 30%;
            // top: 50%;
            width: 20px;
            height: 20px;
            margin: 0 6px 0 0;
            // transform: translate(-50%, -50%);
          }
        }
      }
      & > .echartBox {
        position: absolute;
        top: 50%;
        right: -210px;
        width: 154px;
        height: 154px;
        transform: translate(0, -50%);
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
          position: relative;
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
          img {
            position: absolute;
            top: 0px;
            right: 0px;
            padding: 10px;
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.inputName {
  width: 500px;
  height: 600px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  background: #f3f3f3;
  & > img {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
  }
  .student_name {
    position: absolute;
    top: 50px;
    left: 10%;
  }
  .upload_box {
    position: absolute;
    top: 18%;
    left: 2%;
    width: 96%;
    height: 70%;
    border-radius: 10px;
    background: rgb(255, 255, 255);
    line-height: 30px;
    display: flex;
  }
  .commit_btn {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 80px;
    height: 30px;
    border-radius: 10px;
    background: rgb(46, 182, 46);
    color: white;
    line-height: 30px;
    cursor: pointer;
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
.btn {
  margin-left: 20px;
  // width: 78px;
  padding: 0 18px;
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
</style>
