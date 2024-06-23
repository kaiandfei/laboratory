<template>
  <div class="main">
    <div class="title">
      <span>新增登记</span>
      <div class="btn-box">
        <p class="btn">下一步</p>
        <p class="btn">保存</p>
      </div>
    </div>
    <div class="step-box">
      <div class="name">课前数据</div>
      <div class="content">
        <p class="tip">请先备课，再将二维码分享给学生</p>
      </div>
    </div>
    <div class="step-box">
      <div class="name">课中步骤记录</div>
      <div class="content">
        <div class="experiment">
          <div class="experiment-name">实验：物质性质的探究1</div>
          <div class="experiment-content">
            <ul class="group-box">
              <li>
                <span>分组：</span>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </li>
              <li>
                <span>步骤：</span>
                <p
                  class="tab-btn"
                  :class="{ 'green-bg': activeId === index + 1 }"
                  v-for="(item, index) in evaluationType"
                  :key="index"
                  @click="activeId = index + 1"
                >
                  {{ item }}
                </p>
              </li>
              <li>
                <span>评星：</span>
                <el-rate
                  v-model="evaluateObj.myself.information"
                  :colors="['#05C65D', '#05C65D', '#05C65D']"
                  :show-text="true"
                  :texts="['一星', '二星', '三星', '四星', '五星']"
                  text-color="#05C65D"
                />
              </li>
              <li>
                <span>图片：</span>
                <el-upload
                  class="uploadImg"
                  :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
                  list-type="picture-card"
                  :data="filedata"
                  name="image"
                  :on-preview="handlePictureCardPreview"
                  :on-success="
                    (response, file, fileList) => onsuccess(response, file, fileList, 3)
                  "
                  :on-remove="(file, fileList) => handleRemove(file, fileList, 3)"
                  :multiple="false"
                  :before-upload="(file) => beforeAvatarUpload(file, 3)"
                  :file-list="fileList"
                >
                  <i class="el-icon-plus" />
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="step-box">
      <div class="name">评价</div>
      <div class="content">
        <div class="experiment">
          <div class="experiment-name">实验：物质性质的探究1</div>
          <div class="experiment-content">
            <div class="evaluate-myself">
              <ul>
                <li><span>教师自评：</span></li>
                <li>
                  <span>1.实验课资料填写情况：</span>
                  <el-rate
                    v-model="evaluateObj.myself.information"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li>
                  <span>2.实验课学生反馈效果：</span>
                  <el-rate
                    v-model="evaluateObj.myself.request"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li>
                  <span>3.实验课实验创新效果：</span>
                  <el-rate
                    v-model="evaluateObj.myself.innovate"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li><span>总结：</span></li>
                <li><el-input type="textarea" v-model="evaluateObj.myself.remark" /></li>
              </ul>
            </div>
            <div class="evaluate-admin">
              <ul>
                <li><span>对实验员评价：</span></li>
                <li>
                  <span>1.实验室仪器准备情况：</span>
                  <el-rate
                    v-model="evaluateObj.admin.prepare"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li>
                  <span>2.实验室审核效率：</span>
                  <el-rate
                    v-model="evaluateObj.admin.audit"
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    :show-text="true"
                    :texts="['一星', '二星', '三星', '四星', '五星']"
                    text-color="#05C65D"
                  />
                </li>
                <li><span>评语：</span></li>
                <li><el-input type="textarea" v-model="evaluateObj.admin.remark" /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="step-box">
      <div class="name">课中报告</div>
      <div class="content">
        <div class="grade_box">
          <div class="grade-item" v-for="(item3, index2) in rankList" :key="index2">
            <p>
              等级{{ item3.name }}
              <img
                @click="changeRankShow2(index2)"
                v-show="rankList[index2].show"
                src="@images/taskFeedback/eyes-open.png"
                alt=""
              />
              <img
                @click="changeRankShow2(index2)"
                v-show="!rankList[index2].show"
                src="@images/taskFeedback/eyes-close.png"
                alt=""
              />
            </p>
            <p>{{ item3.value }}个</p>
            <p @click="uploadImg(index2, 2, classItem.class_id)">
              <img src="@images/taskFeedback/upload-icon.png" alt="" />上传图片
            </p>
          </div>
        </div>
        <div class="student_list">
          <div
            v-show="showDetail(rankList[index], item)"
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
                @click="showChildImg2(item.url)"
              />
            </div>
            <div class="r_text">
              <img
                src="@images/common/del-green.png"
                alt=""
                @click="delStudentDetail2(item.id)"
              />
              <p>
                <span>学生姓名</span><span>{{ item.name }}</span>
              </p>
              <!-- <p>
                <span>学号</span><span>202155152498</span>
              </p> -->
              <p v-show="classItem.grade">
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
      <div v-show="uploadFlag2" class="inputName">
        <img @click="closeUpload()" src="@images/experimentalRecord/close.png" alt="" />
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
            :multiple="true"
          >
            <!-- :on-preview="handlePictureCardPreview" -->
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="dialogImageUrl2" alt="" />
          </el-dialog>
        </div>
        <div class="commit_btn" @click="uploadStudentImg2">确认上传</div>
      </div>
    </div>
    <div class="step-box">
      <div class="name">课后习题</div>
      <div class="content">ss</div>
    </div>
  </div>
</template>

<script>
// import { getStudentsName } from '@network/taskFeedback'

export default {
  name: '',
  data() {
    return {
      evaluateObj: {
        myself: {
          information: 1,
          request: 1,
          innovate: 1,
          remark: '',
        },
        admin: {
          prepare: 1,
          audit: 1,
          remark: '',
        },
      },
      baseUrl: process.env.VUE_APP_APP_BASEURL,
      filedata: {
        token: this.$store.state.userMsg.token,
      },
      state: '',
      classItem: {
        level: [],
      },
      options: [
        {
          value: '0',
          label: '全部',
        },
        {
          value: '1',
          label: '1组',
        },
        {
          value: '2',
          label: '2组',
        },
        {
          value: '3',
          label: '3组',
        },
        {
          value: '4',
          label: '4组',
        },
      ],
      value: '',
      activeId: 1,
      evaluationType: [
        '仪器准备',
        '仪器搭建',
        '数据测量',
        '数据处理',
        '仪器整理',
        '其他',
      ],
      dialogImageUrl: '',
      dialogVisible: false,
      dialogImageUrl2: '',
      dialogVisible2: false,
      fileList: [],
      rankList: [
        {
          level: 'A',
          show: true,
        },
        {
          level: 'B',
          show: true,
        },
        {
          level: 'C',
          show: true,
        },
        {
          level: 'D',
          show: true,
        },
      ],
      uploadFlag2: 0,
      messageData: {
        student_id: 0,
        student_name: '',
        level: '',
        go_class_id: '',
        url: [],
      },
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    beforeAvatarUpload(file) {
      // console.log('🚀 ~ file: h5p.vue ~ line 300 ~ beforeAvatarUpload ~ file', file)
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
        this.$message.error('上传图片只能是 .gif,jpeg,jpg,png 格式!')
        return false
      }
    },
    onsuccess(response, file, fileList) {
      console.log('🚀 ~ file: h5p.vue ~ line 299 ~ onsuccess ~ fileList', fileList)
      if (response.code === 10) {
        file.url = response.data.file_url
        file.name = response.data.file_name
        file.chapter_type = this.chapter_type
        file.chapter = this.title

        this.fileList = fileList
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      if (file.url) {
        console.log('🚀 ~ file: next-step.vue ~ line 256 ~ handleRemove ~ file', file)
        // deleteImage({ 'url': file.url }).then(res => {
        //   if (res.code === 10) {
        //     this.$message.success('删除成功')
        //     if (index === 1) {
        //       this.fileList1 = fileList
        //     }
        //     if (index === 2) {
        //       this.fileList2 = fileList
        //     }
        //     if (index === 3) {
        //       this.fileList3 = fileList
        //     }
        //     if (index === 4) {
        //       this.fileList4 = fileList
        //     }
        //   }
        // })
      }
    },
    changeRankShow2(index) {
      this.rankList[index].show = !this.rankList[index].show
      // this.rank[index].show = !this.rank[index].show
    },
    closeUpload() {
      this.uploadFlag2 = 0
      this.fileList2 = []
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
    uploadStudentImg2() {
      // let err = false
      if (this.state === '') {
        this.$message.error('请输入学生姓名!')
        // err = true
      } else if (this.messageData.url.length === 0) {
        this.$message.error('请上传图片!')
        // err = true
      }
      // this.messageData.student_name = this.state
      // if (!err) {
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
      //           this.uploadFlag2 = 0
      //           this.messageData.student_id = 0
      //           this.state = ''
      //           this.fileList2 = []
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
      //         this.uploadFlag2 = 0
      //         this.messageData.student_id = 0
      //         this.state = ''
      //         this.fileList2 = []
      //         this.getData()
      //       }
      //     })
      //   }
      // }
    },
    uploadImg(index, goClassId, classId) {
      this.messageData.student_id = 0
      this.messageData.level = this.rankList[index].level
      this.messageData.go_class_id = goClassId
      this.messageData.class_id = classId
      this.uploadFlag2 = 1
      // 判断学生上限
      // const data = {
      //   class_id: classId
      // }
      // getStudentsName(data).then((res) => {
      //   this.restaurants = res.data

      // })
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
    width: 180px;
    display: flex;
    justify-content: space-between;
    .btn {
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
    min-height: 200px;
    background: #ffffff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    text-align: left;
    box-sizing: border-box;
    .tip {
      width: 100%;
      line-height: 200px;
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
        .evaluate-myself {
          border-right: 1px dashed #05c65d;
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
}
</style>
