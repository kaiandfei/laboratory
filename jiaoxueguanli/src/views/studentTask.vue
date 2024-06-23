<template>
  <div :class="state === 2 ? 'student1' : 'student'">
    <div class="header">
      <i v-show="state !== 0" class="el-icon-arrow-left" @click="state = state - 1" />
      实验任务
    </div>
    <div v-show="state === 0" class="box">
      <div class="box_header">实验任务领取</div>
      <div class="box_body">
        <p><img src="@images/studentTask/write.png" alt="" /> 请填写你的名字</p>
        <input v-model="username" type="text" placeholder="请输入名字" />
        <div>
          <button @click="sure">确认</button>
        </div>
      </div>
    </div>
    <div v-show="state === 1" class="box box-exp">
      <div class="box_header">选择实验进行预习</div>
      <div class="exp-list">
        <div
          v-for="(item, index) in expList"
          class="exp-item"
          :key="index"
          @click="clickExp(item)"
        >
          <div class="title">实验{{ index + 1 }}</div>
          {{ item.exp_name }}
        </div>
      </div>
    </div>
    <div v-show="state === 2">
      <p class="title">实验名称</p>
      <div class="box1">
        <p class="box1_header">实验任务信息</p>
        <div class="base_box">
          <div>
            <p>学段：</p>
            <p>年级：</p>
            <p>学科：</p>
          </div>
          <div>
            <p>{{ h5pitem.time_ids }}</p>
            <p>{{ $store.state.gradeArr[h5pitem.grade] }}</p>
            <p>{{ h5pitem.subject_names }}</p>
          </div>
          <div>
            <!-- <p>章节：</p>
            <p>分类：</p> -->
            <p>专题：</p>
          </div>
          <div>
            <!-- <p>{{ h5pitem.description }}</p>
            <p>{{ h5pitem.description }}</p> -->
            <p>{{ h5pitem.name }}</p>
          </div>
        </div>
        <div class="base_footer">
          <span>简介：</span>
          <span>{{ h5pitem.tips }}</span>
        </div>
      </div>
      <div class="box2">
        <p class="box2_header">预习附件信息</p>
        <div v-for="(item, index) in fileList" :key="index" class="file_div">
          <img :src="fileIcon(item.name)" alt="" />
          <a
            :href="
              item
                ? item.name.slice(item.name.length - 4) === '.pdf'
                  ? item.url
                  : 'https://view.officeapps.live.com/op/view.aspx?src=' + item.url
                : ''
            "
            target="blank"
            >{{ item.name }}</a
          >
        </div>
        <div class="img_box">
          <el-image
            v-for="item in imgList"
            :key="item.id"
            style="width: 100px; height: 100px"
            :src="item.url"
            :preview-src-list="item.imgList"
          />
        </div>
        <div class="video_box">
          <video v-for="item1 in videoList" :key="item1.id" :src="item1.url" controls />
        </div>
      </div>
      <button @click="start">点击开始预习</button>
    </div>
  </div>
</template>

<script>
import { findDetailSingle, findMobile } from '@network/experimentPlan'
import { shareGoClass } from '@network/studentTask'
export default {
  data() {
    return {
      username: '',
      state: 0, // 1选择实验 2实验详情
      src_h5p: '',
      h5pitem: {},
      expList: [],
      imgList: [],
      videoList: [],
      fileList: [],
    }
  },
  props: {
    stuData: {
      type: Object,
      default: function () {
        return
      },
    },
  },
  computed: {
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
  },
  created() {
    console.log(this.$route.query)
    shareGoClass({
      go_class_id: this.$route.query.go_class_id,
    }).then((res) => {
      this.expList = res.data
    })
  },
  methods: {
    start() {
      window.open(this.src_h5p)
    },
    sure() {
      if (this.username !== '') {
        this.state = 1
      } else {
        alert('名字不能为空！')
      }
    },
    clickExp(item) {
      this.src_h5p =
        process.env.VUE_APP_APP_H5PURL +
        'wp-admin/admin.php?page=h5p&task=show&id=' +
        item.h5p_id +
        '&user=stu&pwd=swr123321&student=' +
        this.username +
        '&grade_id=' +
        item.grade_id +
        '&class_id=' +
        item.class_id +
        '&teacher_id=' +
        item.teacher_id +
        '&exp_id=' +
        item.exp_id +
        '&go_class_id=' +
        item.go_class_id +
        '&school_year=' +
        item.school_year +
        '&semester=' +
        item.semester +
        '&week_time=' +
        item.week_time +
        '&school_id=' +
        item.school_id
      Promise.all([
        findDetailSingle({
          id: item.exp_id,
        }).then((res) => {
          this.h5pitem = res.data
        }),
        findMobile({
          exp_id: item.exp_id,
          chapter_type: 1,
        }).then((res) => {
          if (res.code === 10) {
            this.imgList = []
            this.videoList = []
            this.fileList = []
            res.data.map((e) => {
              if (e.type === 1) {
                this.fileList.push(e)
              } else if (e.type === 2) {
                this.videoList.push(e)
              } else if (e.type === 3) {
                e.imgList = []
                e.imgList.push(e.url)
                this.imgList.push(e)
              }
            })
          }
        }),
      ]).then(() => {
        this.state = 2
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.student {
  width: 100%;
  height: 100vh;
  background: url('../assets/images/studentTask/bg.png');
  background-size: 100% 100%;
  position: relative;
}
.student1 {
  width: 100%;
  height: 100vh;
  background-color: #e8e8e9;
  & .title {
    width: 100%;
    height: 34px;
    line-height: 34px;
    background-color: #fff;
    font-size: 12px;
    color: #333;
  }
  .header {
    height: 44px;
    line-height: 44px;
    background-color: #05c65d;
    color: #fff;
    font-size: 18px;
  }
  .box1 {
    margin: 10px auto;
    width: 95%;
    height: 160px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    .box1_header {
      width: 112px;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      border-bottom: 2px solid #05c65d;
      color: #05c65d;
      background-color: #ffffff00;
    }
  }
  .box2 {
    margin: 10px auto;
    padding-bottom: 20px;
    width: 95%;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    .box2_header {
      width: 112px;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      border-bottom: 2px solid #05c65d;
      color: #05c65d;
      background-color: #ffffff00;
    }
  }
}
.header {
  position: relative;
  height: 44px;
  line-height: 44px;
  background-color: #05c65d;
  color: #fff;
  font-size: 18px;
  & > i {
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translate(0, -50%);
  }
}
.box {
  position: absolute;
  top: 30%;
  left: 10%;
  width: 80%;
}
.box-exp {
  top: 10%;
  .exp-list {
    margin-top: 30px;
    font-size: 14px;
    .exp-item {
      position: relative;
      margin: 0 auto 20px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      width: 60%;
      height: 88px;
      text-align: left;
      background: rgba(255, 255, 255, 0.39);
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 5px;
      box-sizing: border-box;
      & > .title {
        position: absolute;
        top: -15px;
        left: -30px;
        width: 60px;
        height: 30px;
        line-height: 30px;
        color: #ffffff;
        background: #67c290;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        text-align: center;
      }
    }
  }
}
.box_header {
  margin: auto;
  width: 220px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #05c65d;
  background-color: #dcece3;
  border-radius: 5px;
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.16);
}
.box_body {
  width: 100%;
  height: 170px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
}
.box_body p {
  padding: 30px 25px 20px;
  height: 20px;
  line-height: 20px;
  text-align: left;
}
.box_body p img {
  float: left;
  margin-right: 10px;
  width: 20px;
  height: 20px;
}
.box_body input {
  padding: 0 15px;
  box-sizing: border-box;
  width: 84%;
  height: 30px;
  border: 1px solid #c9c7c7;
  border-radius: 0;
}
button {
  margin-top: 16px;
  width: 40%;
  height: 32px;
  line-height: 32px;
  border: 0;
  background-color: #05c65d;
  color: #fff;
}
.base_footer {
  padding: 0 28px;
  display: flex;
  & > :nth-child(1) {
    font-size: 12px;
    color: #848484;
    flex: 1;
  }
  & > :nth-child(2) {
    text-align: left;
    font-size: 12px;
    flex: 5;
  }
}
.base_box {
  padding: 20px 28px 0;
  display: flex;
  & > div {
    p {
      margin-bottom: 8px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
    }
  }
  & > :nth-child(1) {
    flex: 1;
    p {
      color: #848484;
      font-size: 12px;
    }
  }
  & > :nth-child(2) {
    flex: 2;
    text-align: left;
    font-size: 12px;
  }
  & > :nth-child(3) {
    flex: 1;
    p {
      color: #848484;
      font-size: 12px;
    }
  }
  & > :nth-child(4) {
    flex: 2;
    text-align: left;
  }
}
.file_div {
  padding: 12px 32px;
  height: 32px;
  line-height: 32px;
  text-align: left;
  img {
    float: left;
    padding: 3px 12px;
    width: 24px;
    height: 24px;
  }
}
.video_box {
  display: flex;
  padding: 12px 32px;
  align-items: center;
}
video {
  width: 280px;
  height: 170px;
  margin-right: 10px;
}
.img_box {
  display: flex;
  padding: 12px 32px;
  align-items: center;
}
</style>
