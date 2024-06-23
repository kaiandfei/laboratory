<template>
  <div class="content">
    <div class="experiment">
      <div class="experiment-name">
        {{ this.expMessage.name }}
      </div>
      <div class="experiment-content">
        <ul class="group-box">
          <li>
            <span>分组：</span>
            <el-select v-model="group_id" placeholder="请选择" @change="changeGroup">
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
              :class="{ 'green-bg': type_Id - 1 === index }"
              v-for="(item, index) in evaluationType"
              :key="index"
              @click="
                type_Id = index + 1
                changemyType(type_Id)
              "
            >
              {{ item }}
            </p>
          </li>
          <li>
            <span>评星：</span>
            <el-rate
              v-model="starvalue"
              @change="changestar"
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
        <div class="btn" @click="savegroup()">保存课中步骤</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ExpEvaluationStudentSave } from '@network/evaluationStudent'
export default {
  name: '',
  props: {
    expMessage: {
      type: Object,
      default: () => {
        return {
          id: 0,
          class_id: 0,
          exp_id: 0,
          name: '',
        }
      },
    },
    FormData: {
      type: Array,
      default: () => [
        {
          group_id: 0,
          evaluatedata: {
            content: '',
            fileList: [],
            go_classid: 0,
            exp_id: 0,
            stepList: [],
            user_id: 0,
          },
        },
      ],
    },
  },
  data() {
    return {
      group_id: 0,
      starvalue: 0,
      options: [
        {
          value: 0,
          label: '全部',
        },
      ],

      baseUrl: process.env.VUE_APP_APP_BASEURL,
      filedata: {
        token: this.$store.state.userMsg.token,
      },
      type_Id: 1,
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
      dialogVisibleRank: false,
      imgList: [],
      showChildFlag: 0,
      fileList: [],
    }
  },
  created() {
    for (let i = 1; i < 50; i++) {
      this.options.push({
        value: i,
        label: i + '组',
      })
    }
    this.getEvaData()
  },
  mounted() {},
  computed: {},
  methods: {
    getEvaData() {
      const evaluatedata = this.FormData.filter((item) => item.group_id === 0)[0]
      this.starvalue = evaluatedata.evaluatedata.stepList.filter(
        (item) => item.type_id === 1
      )[0].star
      if (evaluatedata.evaluatedata.fileList.length) {
        this.fileList = evaluatedata.evaluatedata.fileList.filter(
          (item) => item.type_id === 1
        )
      } else {
        this.fileList = []
      }
    },
    onsuccess(response, file, fileList) {
      if (response.code === 10) {
        file.url = response.data.file_url
        file.name = response.data.file_name
        file.type_id = this.type_Id
        file.chapter = this.title
        file.group_id = this.group_id
        file.go_classid = this.expMessage.id
        file.exp_id = this.expMessage.exp_id
        this.FormData.filter(
          (item) => item.group_id === this.group_id
        )[0].evaluatedata.fileList.push(file)

        this.fileList = fileList
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      // console.log('🚀 ~ file: h5p.vue ~ line 300 ~ beforeAvatarUpload ~ file', file)
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
        this.$message.error('上传图片只能是 .gif,jpeg,jpg,png 格式!')
        return false
      }
    },
    handleRemove(file) {
      if (file.url) {
        console.log('🚀 ~ file: next-step.vue ~ line 256 ~ handleRemove ~ file', file)
        const evaluatedata = this.FormData.filter(
          (item) => item.group_id === this.group_id
        )[0]
        if (evaluatedata.evaluatedata.fileList.length) {
          evaluatedata.evaluatedata.fileList = evaluatedata.evaluatedata.fileList.filter(
            (item) => item.url !== file.url
          )
        }
      }
    },
    changeGroup() {
      if (!this.FormData.filter((item) => item.group_id === this.group_id).length) {
        this.FormData.push({
          group_id: this.group_id,
          evaluatedata: {
            content: '',
            fileList: [],
            go_classid: this.expMessage.id,
            exp_id: this.expMessage.exp_id,
            stepList: [
              {
                go_classid: this.expMessage.id,
                group_id: this.group_id,
                exp_id: this.expMessage.exp_id,
                star: 0,
                type_id: 1,
              },
              {
                go_classid: this.expMessage.id,
                exp_id: this.expMessage.exp_id,

                group_id: this.group_id,
                star: 0,
                type_id: 2,
              },
              {
                go_classid: this.expMessage.id,
                exp_id: this.expMessage.exp_id,
                group_id: this.group_id,
                star: 0,
                type_id: 3,
              },
              {
                go_classid: this.expMessage.id,
                exp_id: this.expMessage.exp_id,
                group_id: this.group_id,
                star: 0,
                type_id: 4,
              },
              {
                go_classid: this.expMessage.id,
                exp_id: this.expMessage.exp_id,
                group_id: this.group_id,
                star: 0,
                type_id: 5,
              },
              {
                go_classid: this.expMessage.id,
                exp_id: this.expMessage.exp_id,
                group_id: this.group_id,
                star: 0,
                type_id: 6,
              },
            ],
            user_id: this.$store.state.userMsg.id,
          },
        })
        this.starvalue = 0
        this.fileList = []
      } else {
        const evaluatedata = this.FormData.filter(
          (item) => item.group_id === this.group_id
        )[0]
        this.starvalue = evaluatedata.evaluatedata.stepList.filter(
          (item) => item.type_id === this.type_Id
        )[0].star
        if (evaluatedata.evaluatedata.fileList.length) {
          this.fileList = evaluatedata.evaluatedata.fileList.filter(
            (item) => item.type_id === this.type_Id
          )
        } else {
          this.fileList = []
        }
      }
    },
    savegroup() {
      console.log(this.FormData)
      ExpEvaluationStudentSave(this.FormData).then((res) => {
        if (res.code === 10) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changemyType(type_Id) {
      this.type_Id = type_Id
      const evaluatedata = this.FormData.filter(
        (item) => item.group_id === this.group_id
      )[0]
      this.starvalue = evaluatedata.evaluatedata.stepList.filter(
        (item) => item.type_id === this.type_Id
      )[0].star
      if (evaluatedata.evaluatedata.fileList.length) {
        this.fileList = evaluatedata.evaluatedata.fileList.filter(
          (item) => item.type_id === this.type_Id
        )
      } else {
        this.fileList = []
      }
    },
    changestar() {
      const evaluatedata = this.FormData.filter(
        (item) => item.group_id === this.group_id
      )[0]
      evaluatedata.evaluatedata.stepList.filter(
        (item) => item.type_id === this.type_Id
      )[0].star = this.starvalue
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
