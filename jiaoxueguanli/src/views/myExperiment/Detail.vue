<template>
  <div class="all">
    <div class="content">
      <h2 class="header">实验方案详情</h2>
      <div class="baseInfo">
        <ItemTitle :title-text="'基本信息'" />
        <div class="button">
          <el-button
            v-if="copydata.copy"
            class="btn-add"
            @click="copyExpPlan($route.params.item)"
            >加入到我的备课中</el-button
          >
          <el-button v-else class="btn-add" @click="editExp()">编辑</el-button>
          <el-button type="info" @click="back">返回</el-button>
        </div>
      </div>
      <div class="experiment">
        <div class="experiment_body">
          <ul class="experiment_content">
            <li>实验名称:</li>
            <li>{{ item.name }}</li>
          </ul>
          <ul class="experiment_content">
            <li>实验类型:</li>
            <li>
              {{ $store.state.groupTypeList[item.type - 1] || '' }}
            </li>
          </ul>
          <ul class="experiment_content">
            <li>学段:</li>
            <li>{{ item.time_ids }}</li>
          </ul>
          <ul class="experiment_content">
            <li>学科:</li>
            <li>
              {{ item.subject_names }}
            </li>
          </ul>
          <ul class="experiment_content">
            <li>年级:</li>
            <li>
              {{ $store.state.gradeArr[item.grade] }}
            </li>
          </ul>

          <ul class="experiment_content">
            <li>专题:</li>
            <li>
              {{ item.topic_true_id }}
            </li>
          </ul>
        </div>
        <div class="experiment_body_img">
          <img :src="item.cover_id ? item.cover_id.url : ''" alt="" />
        </div>
      </div>
      <ItemTitle :title-text="'实验简介'" />
      <div class="introduction-content" style="white-space: pre-line">
        {{ item.description }}
      </div>
      <div class="baseInfo" />
      <!-- <div class="split"/> -->
      <div class="difficulty">
        <div>
          <p>难度:</p>
          <el-rate
            :disabled="true"
            disabled-void-icon-class="el-icon-bachelor-cap"
            :icon-classes="[
              'el-icon-bachelor-cap',
              'el-icon-bachelor-cap',
              'el-icon-bachelor-cap',
            ]"
            :colors="['#05C65D', '#05C65D', '#05C65D']"
            v-model="item.difficult_level"
            show-text
            :texts="['简单', '普通', '中等', '较难', '困难']"
            text-color="#05C65D"
          />
        </div>
        <div>
          <p>准备时间:</p>
          <el-rate
            v-model="item.time_level"
            :disabled="true"
            disabled-void-icon-class="el-icon-time"
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
            :disabled="true"
            disabled-void-icon-class="el-icon-time"
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
            :disabled="true"
            disabled-void-icon-class="el-icon-s-custom"
            :icon-classes="['el-icon-s-custom', 'el-icon-s-custom', 'el-icon-s-custom']"
            :colors="['#05C65D', '#05C65D', '#05C65D']"
            :show-text="true"
            :texts="['1人', '2人', '3人', '4人', '5人']"
            text-color="#05C65D"
          />
        </div>
      </div>
      <ItemTitle :title-text="'仪器信息'" />
      <div style="width: 90%; margin: 10px 5%">
        <instrument :expNumber="item.number" :is_del="0" :is_detail="true" />
      </div>
      <p class="introduction-title">仪器信息备注</p>
      <div class="introduction-content">{{ item.tips ? item.tips : '暂无备注' }}</div>
      <el-dialog title="分享" :visible.sync="visible" width="50%" class="share_to">
        <ul>
          <li v-for="(item, index) in classList" :key="index">
            <VueQr :logoSrc="imageUrl" :text="item.text" :size="450" />
            <span @click="textCopy(item.text, $event)">复制链接</span>
            <p>{{ item.classTime + ' ' + $store.state.sectionArr[item.section] }}</p>
            <p>{{ item.name + '(' + item.type + ')' }}</p>
          </li>
        </ul>
      </el-dialog>
      <ItemTitle :title-text="'备课资料合集'" />
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
            <ul>
              <li v-for="(item, index) in fileList1" :key="index">
                <video :src="item ? item.url : ''" controls="controls" />
              </li>
            </ul>
          </div>
          <div v-show="activeIndex === 2">
            <el-image
              style="width: 160px; height: 130px"
              v-for="(e, i) in fileList2"
              :key="i"
              :src="e.url"
              :preview-src-list="fileList2.map((e) => e.url)"
            >
            </el-image>
          </div>

          <div class="up-item" v-show="activeIndex === 3">
            <ul>
              <li v-for="(item, index) in fileList3" :key="index">
                <img :src="fileIcon(item.name)" alt="" />
                {{ item.name }}
                <a
                  :href="
                    item
                      ? item.name.slice(item.name.length - 4) === '.pdf'
                        ? item.url
                        : 'https://view.officeapps.live.com/op/view.aspx?src=' + item.url
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
              <template-detail :props-data="file4"></template-detail>
            </div>

            <div v-else class="add-box">
              <el-empty>
                <template #description>
                  <div class="add">暂无数据</div>
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
              <ul>
                <li v-for="(item, index) in fileList1" :key="index">
                  <video :src="item ? item.url : ''" controls="controls" />
                </li>
              </ul>
              <div v-if="fileList1 && fileList1.length === 0" class="none-data">
                <img src="@/assets/images/common/kmg-1.png" alt="" />
                <span> 视频 </span>
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
              <el-image
                v-for="(e, i) in fileList2"
                :key="i"
                :src="e.url"
                :preview-src-list="fileList2.map((e) => e.url)"
              >
              </el-image>
              <div v-if="fileList2 && fileList2.length === 0" class="none-data">
                <img src="@/assets/images/common/kmg-2.png" alt="" />
                <span> 图片 </span>
                暂无数据呀~
              </div>
            </div>
          </div>
          <div class="row">
            <div class="icon">
              <img :src="require('@/assets/images/common/link-icon-white.png')" alt="" />
              <span>附件</span>
            </div>

            <div class="list-box list-box-nobg">
              <ul>
                <li v-for="(item, index) in fileList3" :key="index">
                  <img :src="fileIcon(item.name)" alt="" />
                  {{ item.name }}
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
              <div v-if="fileList3 && fileList3.length === 0" class="none-data">
                <img src="@/assets/images/common/kmg-3.png" alt="" />
                <span> 附件 </span>
                暂无数据呀~
              </div>
            </div>
          </div>
          <div class="row">
            <div class="icon">
              <img
                :src="require('@/assets/images/common/report-icon-white.png')"
                alt=""
              />
              <span>在线实验报告</span>
            </div>

            <div class="list-box list-box-nobg">
              <div class="box">
                <div
                  v-if="file4.reportTempletData && file4.reportTempletData.length !== 0"
                  class="detail-box"
                >
                  <template-detail :props-data="file4"></template-detail>
                </div>

                <div v-else class="add-box">
                  <el-empty :image-size="150">
                    <template #description>
                      <div class="add">暂无数据</div>
                    </template>
                  </el-empty>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="modules-bottom">
          <div class="modules-title">
            <img :src="require('@/assets/images/common/report-icon-white.png')" alt="" />
            实验报告
          </div>
          <div class="box">
            <div
              v-if="file4.reportTempletData && file4.reportTempletData.length !== 0"
              class="detail-box"
            >
              <template-detail :props-data="file4"></template-detail>
            </div>

            <div v-else class="add-box">
              <el-empty :image-size="150">
                <template #description>
                  <div class="add">暂无数据</div>
                </template>
              </el-empty>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import instrument from './components/instrument.vue'
// import h5p from './components/h5p'
import ItemTitle from '../../components/ItemTitle.vue'
import {
  copyExp,
  findSections,
  findExpResourcesReportTempletbyteacher,
} from '@/network/experimentPlan'
import { getDatebyweek } from '../../network/subscribe'
import VueQr from 'vue-qr'
import copyText from '@/utils/clipboard'
import TemplateDetail from './components/template-detail.vue'

export default {
  name: 'Detail',
  props: {
    item: {
      type: Object,
    },
    copydata: {
      type: Object,
      default() {
        return {
          copy: false,
          copyId: -1,
        }
      },
    },
  },
  components: {
    instrument,
    ItemTitle,
    // h5p,
    TemplateDetail,

    VueQr,
  },
  data() {
    return {
      // item: this.$route.query.list
      visible: false,
      is_show: true,
      imageUrl: require('@images/menu/logo.png'),
      classList: [],
      h5pitem: {},
      activeIndex: 1,
      fileList1: [],
      fileList2: [],
      fileList3: [],
      file4: {},
    }
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
    // this.getH5p()
    console.log(this.item)
    console.log(this.classList)
    this.getDatebyweek()
    this.getDetail(this.item.id)
  },
  mounted() {},
  methods: {
    getDatebyweek() {
      getDatebyweek().then((res) => {
        this.weekNowObj = res.data
      })
    },
    getDetail(id) {
      findSections({
        exp_id: id,
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
        exp_id: id,
      }).then((res) => {
        this.file4 = res.data
      })
    },
    changeIndex(index) {
      this.activeIndex = index
    },
    cancel() {
      this.$router.push({ path: '/AddExperment', query: { list: this.list } })
      console.log(this.list)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    share(type) {
      if (type === 1) {
        if (this.classList.length === 0) {
          this.$message({
            message: '当前实验没有预约，请在预约成功后分享',
            type: 'warning',
          })
        } else {
          if (JSON.stringify(this.h5pitem) === '{}') {
            this.$message({
              message: '没有资料可供分享，可以尝试先补充资料',
              type: 'warning',
            })
          } else {
            this.visible = true
          }
        }
      } else {
        this.$message({
          message: '正在做这个分享',
          type: 'warning',
        })
      }
    },
    textCopy(text, event) {
      copyText(text, event)
    },
    back() {
      if (this.copydata.copy) {
        this.$router.go(-1)
      } else {
        this.$emit('back', 'cancel')
      }
    },
    editExp() {
      this.$emit('edit', this.item)
    },
    copyExpPlan(item) {
      copyExp({
        id: item.exp_scheme_id,
        is_pai: item.is_pai,
        exp_book_id: item.exp_book_id,
        name: this.item.name,
      }).then((res) => {
        if (res.code === 10) {
          this.$message.success('复制成功')
          this.$emit('copyEdit', parseInt(res.data))
        } else {
          const that = this
          const InputValue = this.item.name + '(新)'
          this.$prompt('实验名称已存在，请输入新的实验名称', '提示', {
            beforeClose: function (action, instance, done) {
              if (action === 'confirm') {
                copyExp({
                  id: item.exp_scheme_id,
                  is_pai: item.is_pai,
                  exp_book_id: item.exp_book_id,
                  name: instance.inputValue,
                }).then((res) => {
                  if (res.code === 10) {
                    done()
                    that.$message.success('复制成功')
                    that.$emit('copyEdit', parseInt(res.data))
                  }
                })
              } else {
                done()
              }
            },
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: InputValue,
          })
            .then(() => {})
            .catch(() => {})
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  background-color: #fff;
  padding-bottom: 20px;

  .h5p-box {
    position: relative;
    width: 100%;
    .share {
      position: absolute;
      top: 12px;
      left: 184px;
      line-height: 30px;
      // border-bottom: 4px solid #05C65D;
      padding: 0 20px 2px;
      cursor: pointer;
    }
  }

  .header {
    width: 100%;
    height: 60px;
    background-color: #dcece3;
    line-height: 60px;
    font-size: 20px;
  }
  h2 {
    text-align: center;
    font-size: 24px;
    font-weight: 800;
  }
  .baseInfo {
    display: flex;
    justify-content: space-between;
    p {
      width: 200px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      font-weight: 800;
    }
    .button {
      margin: 10px 40px 0 0;
      .btn-add {
        background: #05c65d;
        color: #fff;
      }
    }
  }

  .split {
    width: 200px;
    height: 4px;
    background: #05c65d;
  }
  // 实验名称
  .experiment {
    width: 90%;
    margin: 30px auto;
    display: flex;
    margin-bottom: 0px;
    .experiment_body {
      display: flex;
      flex-wrap: wrap;
      width: 75%;
      .experiment_content {
        display: flex;
        width: 40%;
        height: 40px;
        & > :nth-of-type(1) {
          width: 75px;
          text-align: left;
        }
        & > :nth-of-type(2) {
          padding-right: 10px;
          flex: 1;
          text-align: left;
        }
      }
    }
    .experiment_body_img {
      img {
        width: 227px;
        height: 180px;
      }
    }
  }
  .introduction-title {
    width: 90%;
    text-align: left;
    margin: 20px auto 0;
    line-height: 30px;
    font-size: 14px;
    color: #848484;
  }
  .introduction-content {
    width: 90%;
    text-align: left;
    min-height: 20px;
    margin: 10px auto 10px;
    //  border: 1px solid #EBEEF5;
  }
  // .modules-box {
  //   display: flex;
  //   margin: 10px auto 0;
  //   width: 90%;
  //   background: #f3f3f3;

  //   border: 1px solid #c9c7c7;
  //   .tabs {
  //     border-right: 1px solid #c9c7c7;

  //     background: #f3f3f3;
  //     .item {
  //       display: flex;
  //       align-items: center;
  //       padding-left: 17px;
  //       width: 127px;
  //       height: 50px;
  //       img {
  //         margin-right: 10px;
  //         width: 20px;
  //         height: 20px;
  //       }
  //     }
  //     .active {
  //       background: #dcece3;
  //       color: #05c65d;
  //     }
  //   }
  //   .details {
  //     padding: 8px;
  //     flex: 1;
  //     text-align: left;
  //     background: #fff;
  //     .iconv {
  //       margin: 0 10px 0 5px;
  //       max-width: 30px;
  //       max-height: 30px;
  //       vertical-align: text-bottom;
  //     }
  //     .upload {
  //       padding: 5px;
  //       text-align: left;
  //       ::v-deep .el-upload--text {
  //         padding-top: 10px;
  //       }
  //       ::v-deep .btn {
  //         padding: 0px;
  //         background: none;
  //         border: none;
  //         color: #78848f;
  //         font-size: 14px;
  //       }
  //       ::v-deep .is-success {
  //         margin-top: 10px;
  //       }
  //     }
  //     .detail-box {
  //       // padding: 12px 10px;
  //       .edit {
  //         margin-bottom: 10px;
  //         color: #05c65d;
  //         cursor: pointer;
  //       }
  //     }
  //     .add-box {
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       width: 100%;
  //       // text-align: center;
  //       .add {
  //         padding: 5px;
  //         color: #05c65d;
  //         // cursor: pointer;
  //       }
  //     }

  //     .up-item {
  //       text-align: left;
  //       ::v-deep .upload,
  //       .el-upload-list {
  //         display: inline-block;
  //       }
  //       & > ul {
  //         // margin-left: 20px;
  //         // width: 160px;
  //         display: inline-block;
  //         transform: translate(0, -9px);
  //         & > li {
  //           display: flex;
  //           align-items: center;
  //           margin-top: 10px;
  //           line-height: 26px;
  //           img {
  //             margin-right: 6px;
  //             width: 20px;
  //           }
  //           & > a {
  //             margin-left: 10px;
  //             color: black;
  //           }
  //         }
  //       }
  //     }
  //     .video-ui {
  //       // ::v-deep .upload,
  //       // .el-upload-list {
  //       //   display: block;
  //       // }
  //       & > ul {
  //         width: 100%;
  //         // margin-left: 20px;
  //         // margin-top: 10px;
  //         display: flex;
  //         & > li {
  //           margin-right: 10px;
  //           display: inline-block;
  //           margin-top: 10px;
  //           & > video {
  //             width: 220px;
  //             height: 130px;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  .modules-main {
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
          background: #dcece3;
          padding: 10px 10px 0 10px;

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
          .el-image {
            margin: 0 10px 10px 0;
            height: 130px;
            border: #05c65d 1px solid;
          }
          ul {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
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
                height: 130px;
                object-fit: cover;
                border: #05c65d 1px solid;
              }
            }
          }
        }
        .list-box-nobg {
          background: none;
          padding: 0;
          ul {
            li {
              margin-right: 0;
              padding: 10px;
              width: 100%;
              background: #dcece3;
            }
          }
        }
      }
      .row:nth-last-of-type(1) {
        margin-bottom: 20px;
        padding-bottom: 0;
        // border: none;
      }
      .box {
        padding: 14px 16px;
        border: #e3e3e3 1.6px solid;
        border-radius: 5px;
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
      }
      .box {
        padding: 10px 20px;
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
        }
      }
    }
  }

  .difficulty {
    width: 90%;
    display: flex;
    margin: 20px auto;
    justify-content: space-between;
    //float: 1;
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
  }

  // ::v-deep .add {
  //   display: none;
  // }
  ::v-deep .el-dialog__body ul {
    justify-content: flex-start !important;
    flex-wrap: wrap;
    li {
      img {
        width: 150px;
        height: 150px;
      }
      width: 150px !important;
      span {
        color: #05c65d;
        text-decoration: underline;
        cursor: pointer;
      }
      p {
        height: 30px;
        line-height: 30px;
        // color: rgb(245, 117, 117);
      }
    }
  }
}
</style>
