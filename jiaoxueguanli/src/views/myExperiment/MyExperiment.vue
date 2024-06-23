<template>
  <div class="myplan">
    <div class="plan_body" v-show="listshow">
      <top-filter
        ref="filterRef"
        :options="['time_ids', 'subject_id', 'grade', 'name', 'type', 'time_order']"
        @change="getData($event, 1)"
      />
      <div v-if="false" class="plan_head">
        <div class="input-box">
          <el-input
            placeholder="请输入实验名称"
            v-model="finddate.name"
            @change="findpage(finddate)"
          />
          <img
            src="@images/taskFeedback/select-icon.png"
            alt=""
            @click="findpage(finddate)"
          />
        </div>
      </div>
      <div class="list-top">
        <p>
          共筛选出<span style="color: #05c65d">{{ total }}</span
          >条
        </p>
        <el-button class="add" @click="add">新建课程</el-button>
      </div>
      <ul
        class="plan_name"
        v-for="(item, index) in list"
        :key="index"
        @mouseout="haveBg = -1"
      >
        <li
          class="experiment"
          :class="{ haveBg: haveBg === index }"
          @click="getDetail(item.id)"
          @mouseover="changeBg(index)"
        >
          <img :src="item.cover_id ? item.cover_id.url : ''" alt="" />
          <div class="plan_total">
            <div>
              <p>
                <span>实验名称:</span>
                <span :title="item.name">{{ item.name }}</span>
              </p>
              <p>
                <span>年级:</span>
                <span>{{ $store.state.gradeArr[item.grade] }}</span>
              </p>
              <p>
                <span>资料完整:</span>
                <span>
                  <el-rate
                    :colors="['#05C65D', '#05C65D', '#05C65D']"
                    void-color="#05C65D"
                    :allow-half="true"
                    :value="item.allfraction / 20"
                    :disabled="true"
                  />
                </span>
              </p>
            </div>
            <div>
              <p>
                <span>实验类型：</span>
                <span>{{ $store.state.groupTypeList[item.type - 1] || '' }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>浏览量：</span>
                <span>{{ item.click_count }}</span>
              </p>
              <p>
                <span>时间：</span>
                <span>{{ item.create_time ? item.create_time.split(' ')[0] : '' }}</span>
              </p>
            </div>
          </div>
          <div class="share">
            <div>
              <i
                class="el-icon-copy-document"
                title="复制"
                @click.stop="copyExpPlan(item)"
              />
              <i class="el-icon-view" title="查看" @click.stop="getDetail(item.id)" />
              <i
                class="el-icon-edit-outline"
                title="编辑"
                @click.stop="editExperment(item)"
              />
              <i class="el-icon-delete" title="删除" @click.stop="deleteExp(item)" />
            </div>
          </div>
        </li>
      </ul>
      <div class="pagination">
        <el-pagination
          :current-page="page"
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
    <Detail
      v-if="detailshow"
      :item="item"
      @back="back"
      @edit="editExperment"
      :copydata="copyData"
      @copyEdit="copyEdit"
    />
    <AddExperment
      v-if="addshow"
      :item_id="item.id"
      :copydata="copyData"
      @jumpTo="jumpTo"
      @back="back"
      ref="AddExperment"
    />
    <!-- <component :is="detailshow ? 'Detail' : addshow ? 'Edit' : ''" /> -->
    <el-dialog
      title="分享"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
      class="share_to"
    >
      <ul>
        <li>
          <img src="@/assets/images/plan/ewm.png" alt="" />
          <p>九年级一班</p>
        </li>
        <li>
          <img src="@/assets/images/plan/ewm.png" alt="" />
          <p>九年级二班</p>
        </li>
        <li>
          <img src="@/assets/images/plan/ewm.png" alt="" />
          <p>九年级三班</p>
        </li>
        <li>
          <img src="@/assets/images/plan/ewm.png" alt="" />
          <p>九年级四班</p>
        </li>
      </ul>
    </el-dialog>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import {
  Select,
  DeleteExperiment,
  findDetail,
  copyExp,
} from '../../network/experimentPlan'
import Detail from './Detail.vue'
import AddExperment from './AddExperment.vue'

import TopFilter from '@components/top-filter.vue'

export default {
  name: 'MyExperiment',
  components: {
    Detail,
    AddExperment,
    TopFilter,
  },
  data() {
    return {
      visible: false,
      input: '',
      seeCount: 3,
      list: [],
      haveBg: -1,
      value1: null,
      listshow: true,
      detailshow: false,
      addshow: false,
      item: {
        id: this.$route.params.item_id || 0,
      },
      copyData: {
        copy: this.$route.params.copy || false,
        copyId: this.$route.params.copyId || -1,
      },
      page: 1,
      total: 0,
      member_id: this.$store.getters.getUserMsg.id,
      searchObj: {},
      finddate: {
        list_rows: 5,
        page: 1,
        type: '',
        grade: '',
        member_id: this.$store.getters.getUserMsg.id,
      },
    }
  },
  created() {
    // this.findpage(this.finddate)
    if (this.$route.params.copyId === -1) {
      this.getDetail(this.$route.params.item_id)
    } else {
      this.addshow = this.$route.params.add
      this.listshow = !this.$route.params.add
    }
    // 列表调转发布
    if (this.$route.params.shareToStu) {
      this.jumpTo(this.$route.params.item_id)
    }
    document.addEventListener('click', this.backToHomepage)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.backToHomepage)
  },
  methods: {
    backToHomepage(event) {
      const msg = document.getElementsByClassName('el-menu-item')
      if (msg) {
        Array.from(msg).forEach((item) => {
          if (item.contains(event.target)) {
            this.listshow = true
            this.detailshow = false
            this.addshow = false
            this.copyData = {
              copy: false,
              copyId: -1,
            }
          }
        })
      }
    },
    getData(obj, page) {
      this.searchObj = obj
      this.page = page
      Select({ ...this.searchObj, member_id: this.member_id, page: this.page }).then(
        (res) => {
          this.list = res.data.list
          this.total = res.data.count
        }
      )
    },
    jumpTo(id) {
      this.getDetail(id)
    },
    changeBg(index) {
      this.haveBg = index
    },
    back(type) {
      // type: cancel 直接的返回；save: 保存的返回
      if (this.$route.params.shareToStu === true && type === 'cancel') {
        // 预约列表发布给学生
        this.$router.go(-1)
        return
      }
      this.item = {}
      this.detailshow = false
      this.addshow = false
      this.listshow = true
      this.copyData = {
        copy: false,
        copyId: -1,
      }
      const ele = document.getElementById('h_b')
      ele.scrollTop = 0

      this.$refs.filterRef.changeValue()
    },
    copyEdit(id) {
      this.copyData = {
        copy: false,
        copyId: -1,
      }
      this.item.id = id
      this.addshow = true
      this.listshow = false
      this.detailshow = false
    },
    handleCurrentChange(val) {
      this.getData(this.searchObj, val)
    },
    share() {
      // this.visible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    add() {
      this.listshow = false
      this.item = {
        id: 0,
        name: '',
        grade: '',
        xueduan: '',
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
        click_count: '1',
        materialList: [],
        member_id: this.$store.state.userMsg.id,
      }
      this.addshow = true
    },
    copyExpPlan(item) {
      const that = this
      const InputValue = item.name + '(新)'
      this.$prompt('请输入新的实验名称', '提示', {
        beforeClose: function (action, instance, done) {
          if (action === 'confirm') {
            copyExp({
              id: item.id,
              name: instance.inputValue,
            }).then((res) => {
              if (res.code === 10) {
                that.$message.success('已经复制')
                that.$refs.filterRef.changeValue()
                done()
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
        .then(({ value }) => {
          console.log('🚀 ~ file: MyExperiment.vue:332 ~ .then ~ value:', value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入',
          })
        })
    },
    getDetail(id) {
      // item.click_count++
      const data = {
        id: id,
      }
      findDetail(data).then((res) => {
        if (id !== 0) {
          this.item = res.data
        }
        if (res.data) {
          // this.item.click_count++
          this.listshow = false
          this.detailshow = true
        } else {
          this.$message.error('该方案已不存在')
          this.$router.go(-1)
        }
      })
    },
    editExperment(item) {
      this.detailshow = false
      this.listshow = false
      this.item = item
      this.addshow = true
    },
    all() {
      this.$refs.all.style.color = '#05C65D'
      this.$refs.choose.style.color = 'black'
      this.$refs.must.style.color = 'black'
      this.list = this.list1
    },
    chooseDo() {
      this.$refs.all.style.color = 'black'
      this.$refs.must.style.color = 'black'
      this.$refs.choose.style.color = '#05C65D'
      const data = {
        list_rows: 5,
        page: 1,
        type: 0,
      }
      Select(data).then((res) => {
        console.log(res)
        this.list = res.data.list
        this.list.forEach((item) => {
          console.log(item)
          switch (item.grade) {
            case 1:
              item.grade = '一年级'
              break
            case 2:
              item.grade = '二年级'
              break
            case 3:
              item.grade = '三年级'
              break
            case 4:
              item.grade = '四年级'
              break
            case 5:
              item.grade = '五年级'
              break
            case 6:
              item.grade = '六年级'
              break
            case 7:
              item.grade = '七年级'
              break
            case 8:
              item.grade = '八年级'
              break
            case 9:
              item.grade = '九年级'
              break
          }
        })
      })
    },
    deleteExp(item) {
      this.$confirm('此操作将永久删除该方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          DeleteExperiment({
            id: item.id,
          }).then((res) => {
            if (res.code === 10) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              this.$refs.filterRef.changeValue()
            }
            // this.findpage(this.finddate)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.myplan {
  width: 100%;
  margin: 0 auto;
  padding: 20px 28px;
  box-sizing: border-box;
  .labType,
  .gradeType {
    cursor: pointer;
  }
  .plan_body {
    width: 100%;
    .plan_head {
      padding: 20px 20px 0 20px;
      display: flex;
      flex-wrap: wrap;
      // height: 180px;
      background-color: #fff;
      text-align: left;
      box-sizing: border-box;
      .input-box {
        position: relative;
        height: 30px;
        img {
          position: absolute;
          top: 50%;
          right: 0;
          border-top: 5px solid #05c65d;
          border-bottom: 5px solid #05c65d;
          border-left: 10px solid #05c65d;
          border-right: 10px solid #05c65d;
          transform: translate(0, -50%);
          background: #05c65d;
          cursor: pointer;
          box-sizing: border-box;
        }
        // ::v-deep .el-input__inner{
        //   margin: 30px 0 30px 0;
        // }
      }
      // justify-content: space-between;
      // align-content: space-around;
      // .grade span{
      //   width: 60px;
      //   display: inline-block;
      //   text-align: center;
      //   margin: 30px 50px 0 30px;
      // }
      // .grade .activeSpan{
      //   color: #05C65D;
      // }
    }
  }
  .list-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    text-align: left;
    color: #626572;
    .add {
      width: 300px;
      height: 40px;
      background: #05c65d;
      border-radius: 10px;
      color: #fff;
    }
  }
  .plan_name {
    margin-top: 10px;
    .experiment {
      display: flex;
      height: 140px;
      border: 1px solid #f0f0f0;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      img {
        width: 120px;
        height: 120px;
        margin-left: 10px;
        margin-top: 10px;
        border: 1px solid #b5b5b5;
      }
      .plan_total {
        width: 60%;
        margin-left: 20px;
        display: flex;
        // background-color: rosybrown;
        & > div {
          flex: 1;
          height: 100%;
          padding-top: 18px;
          p {
            margin-bottom: 20px;
            height: 20px;
            line-height: 20px;
            text-align: left;
            & > :nth-child(1) {
              float: left;
              width: 120px;
              color: #848484;
            }
          }
        }
        & > div:nth-of-type(1) {
          flex: 1.8;
          p {
            & > :nth-child(2) {
              display: inline-block;
              width: 60%;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
        // .plan_total_right{
        //   width: 160px;
        //   margin-left: 10px;
        // }
      }
      // .plan_total_one{
      //   display: flex;
      //   justify-content: space-between;
      //   margin-top: 20px;
      //   .total_n{
      //     display: inline-block;
      //     width: 70px;
      //     text-align: left;
      //   }
      //   .total_t{
      //     display: inline-block;
      //     margin-left: 30px;
      //     text-align:left;
      //   }
      // }
      // .handle{
      //   display: flex;
      //   justify-content: space-between;
      //   .el-dialog__body{
      //     margin-right: 20px;
      //   }
      // }
      .share {
        width: 30%;
        text-align: center;
        div {
          margin-top: 100px;
          i {
            margin-right: 50px;
            font-size: 20px;
            color: #848484;
            cursor: pointer;
          }
          i:hover {
            color: #05c65d;
          }
        }
      }
    }
    .haveBg {
      background: #dcece3;
    }
  }

  .pagination {
    margin-top: 20px;
    //text-align: right;
    //.share_to li{
    //  margin-left: 10px;
    //  border-radius: 30px
    //}
  }
  ::v-deep .el-dialog__body ul {
    display: flex;
    justify-content: space-around;
    li {
      width: 100px;
      border-radius: 5%;
      text-align: center;
      line-height: 40px;
    }
  }
}
// 分页
.el-pagination ::v-deep .number:hover {
  color: #05c65d !important;
}
.el-pagination ::v-deep .active {
  color: black;
  background-color: #05c65d !important;
  &:hover {
    color: #fff !important;
  }
}
</style>
