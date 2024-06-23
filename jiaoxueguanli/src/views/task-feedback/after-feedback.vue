<template>
  <div class="content">
    <p class="title">学生任务反馈<i class="el-icon-arrow-right" />学生课后</p>
    <top-filter
      ref="filterRef"
      :options="[
        'semester',
        'subject_id',
        'grade',
        'week',
        'exp_id',
        'type',
        'time_order',
        'teacher_id',
        'class_id',
      ]"
      @change="getData($event, 1)"
    />
    <div class="body_item">
      <div v-show="uploadFlag3" class="inputName">
        <img @click="closeUpload(3)" src="@images/experimentalRecord/close.png" alt="" />
        <div class="student_name">
          姓名：
          <el-autocomplete
            v-model="state"
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
            :on-success="
              (response, file, fileList) => onsuccess(response, file, fileList, 3)
            "
            :on-remove="(file, fileList) => handleRemove(file, fileList, 3)"
            :multiple="true"
            :before-upload="(file) => beforeAvatarUpload(file, messageData.student_id)"
            :file-list="fileList3"
          >
            <!-- :on-preview="handlePictureCardPreview" -->
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
        <div class="commit_btn" @click="uploadStudentImg3">确认上传</div>
      </div>
      <div class="item-box" v-for="(item, index) in afterData" :key="index">
        <div class="base_msg">
          <p><span>学科：</span>{{ subjectName(item.subject_id) }}</p>
          <p>
            <span>实验：</span
            ><span v-for="(m, n) in item.exp" :key="n">{{ m.name }}</span>
          </p>
          <p>
            <span>年级：</span>
            <span v-for="(it, index) in item.grade" :key="index">{{
              $store.state.gradeArr[it]
            }}</span>
          </p>
          <p>
            <span class="fl">班级：</span>
            <span>{{ item.class_name }}</span>
            <span>{{ $store.state.groupTypeList[item.type - 1] || '' }}</span>
            <span>{{
              `第${item.week_time}周, ${$store.state.weekArr[item.weekend]}, ${
                $store.state.sectionArr[item.section]
              }(${item.classTime})`
            }}</span>
          </p>
        </div>
        <div v-for="(expItem, expIndex) in item.exp" :key="expIndex">
          <div
            v-show="
              !expItem.class_detail ||
              (Array.isArray(expItem.class_detail) && expItem.class_detail.length === 0)
            "
            class="value_none"
          >
            暂无班级数据
          </div>
          <div
            class="body_msg"
            v-for="(classItem, classIndex) in expItem.class_detail"
            :key="classIndex"
          >
            <div class="exp-name">
              {{ expItem.name }}
            </div>
            <div class="grade_box">
              <div
                class="grade-item"
                v-for="(item3, index3) in rankListAfter[index][expIndex]"
                :key="index3"
              >
                <p>
                  等级{{ item3.level }}
                  <img
                    @click="changeRankShow3(item3)"
                    v-show="item3.show"
                    src="@images/taskFeedback/eyes-open.png"
                    alt=""
                  />
                  <img
                    @click="changeRankShow3(item3)"
                    v-show="!item3.show"
                    src="@images/taskFeedback/eyes-close.png"
                    alt=""
                  />
                </p>
                <p>{{ item3.count }}个</p>
                <p
                  @click="
                    uploadImg3(index3, item.go_class_id, classItem.class_id, expItem)
                  "
                >
                  <img src="@images/taskFeedback/upload-icon.png" alt="" />上传图片
                </p>
              </div>
              <div class="echartBox">
                <div class="echartDiv">
                  <chart-bar
                    v-if="seriesData3[index]"
                    :seriesData="seriesData3[index][expIndex]"
                    :xAxisData="seriesData3[index][expIndex]"
                    :type="5"
                    :width="154"
                    :height="154"
                  />
                </div>
                <div class="centerText">{{ scoreStage(classItem.percent * 100) }}</div>
              </div>
            </div>
            <div class="student_list">
              <div
                v-show="showDetail(rankListAfter[index][expIndex], item)"
                class="student_score"
                v-for="(item, indexd) in classItem.detail"
                :key="indexd"
              >
                <div class="l_img" v-if="item.url">
                  <img :src="item.url[0] ? item.url[0].url : ''" alt="" />
                  <img
                    class="show_more"
                    src="@images/taskFeedback/show-more.png"
                    alt=""
                    @click="showChildImg3(item.url)"
                  />
                </div>
                <div class="r_text">
                  <img
                    src="@images/common/del-green.png"
                    alt=""
                    @click="delStudentDetail3(item.id)"
                  />
                  <p>
                    <span>学生姓名</span><span>{{ item.name }}</span>
                  </p>
                  <!-- <p>
                    <span>学号</span><span>202155152498</span>
                  </p> -->
                  <p>
                    <span>年级</span><span>{{ classItem.grade }}</span>
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
      </div>
      <div v-show="showChildFlag3 !== -1" class="child_img_list">
        <img
          class="close_icon"
          src="@images/taskFeedback/close-white.png"
          alt=""
          @click="showChildFlag3 = -1"
        />
        <el-carousel :interval="4000" type="card" height="100vh">
          <el-carousel-item v-for="(item, index) in imgList" :key="index">
            <img :src="item.url" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <footer>
      <el-button v-show="getMore" type="primary" :loading="loading" @click="getMoreData"
        >加载更多</el-button
      >
      <p v-show="!getMore">没有更多了~</p>
    </footer>
  </div>
</template>

<script>
// import ItemTitle from '@components/ItemTitle'
import ChartBar from '@components/echarts/chartBar'
import TopFilter from '@components/top-filter.vue'

// import * as echarts from 'echarts'

import {
  getAfterData,
  getStudentsName,
  uploadAfter,
  delStudentAfter,
} from '@network/taskFeedback'
import { deleteImage } from '@network/experimentPlan'

export default {
  name: 'AfterFeedback',
  components: {
    ChartBar,
    TopFilter,
  },
  data() {
    return {
      searchObj: {},
      inputValue: '',
      showFlagScore: '',
      restaurants: [],
      state: '',
      getMore: true,
      pageCount: 1,
      loading: false,
      timeout: null,
      pageNumList: [],
      maxPageNum: [],
      filedata: {
        token: this.$store.state.userMsg.token,
      },
      fileList3: [],
      seriesData3: [],

      messageData: {
        student_id: 0,
        student_name: '',
        level: '',
        go_class_id: '',
        url: [],
      },
      rank: [
        {
          name: 'A',
          show: true,
          value: 0,
        },
        {
          name: 'B',
          show: true,
          value: 0,
        },
        {
          name: 'C',
          show: true,
          value: 0,
        },
        {
          name: 'D',
          show: false,
          value: 0,
        },
      ],
      rankListAfter: [],

      showChildFlag3: -1,
      uploadFlag3: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      afterData: [],
      afterDataCopy: [],

      baseUrl: process.env.VUE_APP_APP_BASEURL,
      clickItem: {},
      imgList: [
        {
          image: [require('@images/taskFeedback/img-test.png')],
        },
        {
          image: [require('@images/taskFeedback/img-test.png')],
        },
        {
          image: [require('@images/taskFeedback/img-test.png')],
        },
      ],
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
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
    studentList() {
      return function (item, pageNum) {
        let arr = []
        arr = JSON.parse(JSON.stringify(item.student_detail))
        const pages = Math.ceil(arr.length / 5)
        if (this.maxPageNum.length < this.requestData.length) {
          this.maxPageNum.push(pages)
        }
        const res = arr
        return res.slice(pageNum * 5, (pageNum + 1) * 5)
      }
    },
    scoreStage() {
      return function (val) {
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
    userMsg() {
      return this.$store.getters.getUserMsg
    },
    classDetail() {
      return function (className, item, value) {
        const res =
          !item.class_detail ||
          (Array.isArray(item.class_detail) && item.class_detail.length === 0)
        if (res) {
          return 0
        } else {
          let resData = 0
          const data = item.class_detail
          data.map((item) => {
            if (item['class_name'] === className) {
              resData = item ? item[value] : 0
            }
          })
          return resData
        }
      }
    },
    showClass() {
      return function (className, item) {
        let flag = false
        const data = item.class_detail
        if (data) {
          data.map((it) => {
            if (it.class_name === className) {
              flag = true
            }
          })
        }
        return flag
      }
    },
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
  },
  methods: {
    changeRankShow3(item) {
      item.show = !item.show
      // this.rank[index].show = !this.rank[index].show
    },

    getData(obj, page) {
      this.searchObj = obj
      this.pageCount = page
      const message = {
        name: this.inputValue,
        page: this.pageCount,
        ...this.searchObj,
      }
      getAfterData(message)
        .then((res) => {
          this.afterData = res.data
          this.getMore = true
          if (res.data.length < this.pageCount * 5) {
            this.getMore = false
          }
          this.rankListAfter = []
          this.afterData.forEach((course) => {
            const expArr = []
            course.exp.forEach((e) => {
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
              if (e.class_detail.length !== 0) {
                e.class_detail[0].level.forEach((item) => {
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
              expArr.push(arr)
            })
            this.rankListAfter.push(expArr)
          })
        })
        .then(() => {
          this.drawPie(3)
        })
    },
    getMoreData() {
      this.getData(this.searchObj, this.pageCount + 1)
    },
    uploadImg3(index, goClassId, classId, item) {
      this.messageData.student_id = 0
      this.clickItem = item

      // 判断学生上限
      if (
        this.clickItem.class_detail &&
        this.clickItem.class_detail[0].class_student_num >
          this.clickItem.class_detail[0].detail.length
      ) {
        const data = {
          class_id: classId,
        }
        getStudentsName(data).then((res) => {
          this.restaurants = res.data
          this.messageData.level = this.rank[index].name
          this.messageData.go_class_id = goClassId
          this.messageData.class_id = classId
          this.uploadFlag3 = 1
        })
      } else {
        this.$message.error('当前上传学生数已达本班最大人数')
      }
    },

    delStudentDetail3(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
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
      return (state) => {
        return state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect(item) {
      this.messageData.student_id = item.id
    },
    onsuccess(response, file, fileList, index) {
      if (response.code === 10) {
        file.url = response.data.file_url
        file.name = response.data.file_name
        file.chapter_type = this.chapter_type
        file.chapter = this.title
        file.type = index
        this.fileList3 = fileList
        this.messageData.url = this.fileList3
      }
    },
    closeUpload() {
      this.uploadFlag3 = 0
      this.state = ''
      this.fileList3 = []
    },
    beforeAvatarUpload(file, id) {
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
      if (!id) {
        console.log(
          '🚀 ~ file: TaskFeedback.vue ~ line 950 ~ beforeAvatarUpload ~ id',
          id
        )
        this.$message.error('请选择学生!')
        return false
      }
    },
    uploadStudentImg3() {
      let err = false
      if (this.state === '') {
        this.$message.error('请输入学生姓名!')
        err = true
      } else if (this.messageData.url.length === 0) {
        this.$message.error('请上传图片!')
        err = true
      }
      this.messageData.student_name = this.state
      if (!err) {
        if (
          this.clickItem.class_detail[0].detail.some((item) => {
            return item.name === this.messageData.student_name
          })
        ) {
          this.$confirm('当前姓名已经上传过, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              uploadAfter({
                ...this.messageData,
                exp_id: this.clickItem.id,
              }).then((res) => {
                if (res.code === 10) {
                  this.uploadFlag3 = 0
                  this.state = ''
                  this.fileList3 = []
                  this.$refs.filterRef.changeValue()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消上传',
              })
            })
        } else {
          uploadAfter({
            ...this.messageData,
            exp_id: this.clickItem.id,
          }).then((res) => {
            if (res.code === 10) {
              this.uploadFlag3 = 0
              this.state = ''
              this.fileList3 = []
              this.$refs.filterRef.changeValue()
            }
          })
        }
      }
    },

    showChildImg3(data) {
      this.imgList = data
      this.showChildFlag3 = 1
    },
    handleRemove(file, fileList, index) {
      if (file) {
        const isIMG =
          file.type === 'image/jpg' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 4
        if (isIMG && isLt2M) {
          deleteImage({ url: file.url }).then((res) => {
            if (res.code === 10) {
              this.$message.success('删除成功')
              if (index === 2) {
                this.fileList2 = fileList
                this.messageData.url = this.fileList2
              }
              if (index === 3) {
                this.fileList3 = fileList
                this.messageData.url = this.fileList3
              }
            }
          })
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    drawPie() {
      this.seriesData3 = []
      if (this.afterData) {
        this.afterData.forEach((item) => {
          if (item.exp) {
            const arr = []
            item.exp.forEach((e) => {
              if (e.class_detail) {
                e.class_detail.forEach((classItem) => {
                  arr.push([
                    { value: (100 - classItem.percent * 100).toFixed(1), name: '' },
                    { value: 0.1, name: '空' },
                    {
                      value: (classItem.percent * 100).toFixed(1),
                      name: this.scoreStage(classItem.percent * 100),
                    },
                    { value: 0.1, name: '空' },
                  ])
                })
              } else {
                arr.push([
                  { value: 0, name: '' },
                  { value: 0.1, name: '空' },
                  { value: 100, name: '' },
                  { value: 0.1, name: '空' },
                ])
              }
            })
            this.seriesData3.push(arr)
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 32px;
  width: 100%;
  box-sizing: border-box;
  .title {
    text-align: left;
  }
}
.top-select {
  margin: 10px 0;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  text-align: left;
  box-sizing: border-box;
  .select-box {
    width: 25%;
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
    span {
      display: inline-block;
      width: 70px;
    }
    & > :nth-child(2) {
      width: calc(80% - 70px);
      box-sizing: border-box;
      ::v-deep .el-input {
        width: 100%;
        .el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
}
.has-height {
  height: 70px;
  overflow: hidden;
}
.selectInput {
  width: 276px;
  height: 30px;
  float: right;
  margin-right: 28px;
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

.body_item {
  width: 100%;
  // height: 980px;
  // background-color: #fff;
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
  .item-box {
    padding-bottom: 4px;
    border-bottom: #e8e8e9 10px solid;
    background: #fff;
    .value_none {
      margin: 6px 2%;
      width: 96%;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    }
  }
}
.base_msg {
  box-sizing: border-box;
  padding: 24px 42px;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
}
.base_msg p {
  font-size: 16px;
  text-align: left;
  color: #626572;
}
.base_msg p span {
  padding-right: 32px;
}

.body_msg {
  width: 100%;
  background-color: #fff;
  min-height: 300px;
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
  .grade_box {
    // float: left;
    position: relative;
    padding: 20px 0 20px 2.5%;
    width: 70%;
    height: 166px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
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
    padding: 10px 32px;
    box-sizing: border-box;
    // max-height: 600px;
    overflow-y: scroll;
    // display: flex;
    // justify-content: space-evenly;
    .student_score {
      margin: 10px 3% 10px 10px;
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
    padding-top: 4vh;
    box-sizing: border-box;
    background: rgba(132, 132, 132, 0);
    ::v-deep .el-carousel__mask {
      height: 0;
      background: rgba(0, 0, 0, 0);
    }
  }
  .el-carousel__item > img {
    // width: 586px;
    height: 92vh;
    // background-size: contain;
  }
}

.footer_msg {
  height: 100px;
  line-height: 100px;
  background-color: #fff;
  user-select: none;
  span {
    cursor: pointer;
    margin: 0 30px;
    color: #848484;
  }
}
footer {
  margin-bottom: 6px;
  .el-button {
    width: 200px;
  }
}
</style>
