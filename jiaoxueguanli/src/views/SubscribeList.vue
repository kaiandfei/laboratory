<template>
  <div class="exp-plan">
    <div v-show="pageState === 0">
      <div class="sel-div1">
        <div>审核情况</div>
        <div>
          <span>全部</span>
          <span>未审核</span>
          <span>已审核</span>
          <span>已结束</span>
        </div>
      </div>
      <div class="sel-div2">
        <div>实验时间</div>
        <div>
          <span>全部</span>
          <span
            v-for="(item, index) in weekList"
            :key="index"
            @click="item.state = !item.state"
            :class="item.state ? 'sel' : ''"
            >{{ item.name }}</span
          >
        </div>
      </div>
      <div class="sel-div3">
        <div>
          <span>全部</span>
          <span
            v-for="(item, index) in dayList"
            :key="index"
            @click="item.state = !item.state"
            :class="item.state ? 'sel' : ''"
            >{{ item.name }}</span
          >
        </div>
      </div>
      <div class="sel-div1">
        <div>实验类型</div>
        <div>
          <span>全部</span>
          <span>分组</span>
          <span>演示</span>
        </div>
      </div>
      <div class="table-box">
        <el-table
          :data="tableList"
          border
          stripe
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column prop="laboratory_name" label="实验名称" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.laboratory_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="week" label="周次" sortable />
          <el-table-column prop="time" label="预约时间" sortable />
          <el-table-column prop="expName" label="实验名称" sortable />
          <el-table-column prop="class" label="班级" sortable />
          <el-table-column prop="instrument" label="仪器" sortable />
          <el-table-column prop="type" label="类型" sortable />
          <el-table-column prop="subscribePeople" label="预约人" sortable />
          <el-table-column prop="time" label="审核" sortable>
            <template slot-scope="scope">
              <p v-show="scope.row.state === 0">
                <span class="font-simple">同意</span>
                <span class="font-simple">调整</span>
                <span class="font-simple font-red">拒绝</span>
              </p>
              <p v-show="scope.row.state === 1">
                <span class="font-simple-disable font-green">已通过</span>
              </p>
              <p v-show="scope.row.state === 2">
                <span class="font-simple-disable font-red">已拒绝</span>
              </p>
              <p v-show="scope.row.state === 3">
                <span class="font-simple-disable">已通过 (取消预约)</span>
              </p>
              <p v-show="scope.row.state === 4">
                <span class="font-simple-disable">已结束</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="操作" sortable>
            <template slot-scope="scope">
              <p v-show="scope.row.state === 1">
                <span @click="pageState = 1" class="font-simple">
                  仪器准备/导出仪器表
                </span>
                <span class="font-simple font-red"> 取消审核 </span>
              </p>
              <p v-show="scope.row.state === 2 || scope.row.state === 3">
                <span class="font-simple font-red">删除</span>
              </p>
              <p v-show="scope.row.state === 4">
                <span @click="pageState = 2" class="font-simple"> 查看仪器表 </span>
                <span class="font-simple font-red">删除</span>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer2">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="100"
          background
          layout="prev, pager, next, jumper"
          :total="1000"
        />
      </div>
    </div>
    <!-- <div v-show="pageState === 1">
      <div class="header">
        仪器列表
        <button class="graybtn" @click="pageState = 0">返回审核列表</button>
      </div>
      <div class="base-msg-box">
        <div>
          <p>
            <span>
              实验时间
            </span>
            <span>
              第一周/星期三/第二节次
            </span>
          </p>
          <p>
            <span>
              实验名称
            </span>
            <span>
              氧气的制取
            </span>
          </p>
        </div>
        <div>
          <p>
            <span>
              实验班级
            </span>
            <span>
              七年级(1)班
            </span>
          </p>
          <p>
            <span>
              实验类型
            </span>
            <span>
              分组
            </span>
          </p>
          <p>
            <span>
              实验地点
            </span>
            <span>
              化学实验室1
            </span>
          </p>
        </div>
        <div>
          <p>预约备注</p>
          <p>我预约了实验室</p>
        </div>
      </div>
      <div class="table-box1">
        <el-table
          :data="tableData1"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="index"
            label="序号">
            <template slot-scope="scope">
              <span>{{ scope.row.index }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="分类编号"/>
          <el-table-column
            prop="instrumentName"
            label="仪器名称"/>
          <el-table-column
            prop="specifications"
            label="规格"/>
          <el-table-column
            prop="requirements"
            label="需要数量">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.requirements" :min="1" :max="scope.row.store" label="描述文字"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="store"
            label="库存所有数量"/>
          <el-table-column
            prop="instrumentStore"
            label="仪器库"/>
          <el-table-column
            prop="cabinet"
            label="橱柜"/>
          <el-table-column
            prop="floor"
            label="层数"/>
          <el-table-column
            prop="quantity"
            label="数量"/>
          <el-table-column
            prop="remark"
            label="备注"/>
        </el-table>
        <button class="commonbtn">新增 + </button>
        <button class="commonbtn">保存</button>
      </div>
      <div class="footer1">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="100"
          background
          layout="prev, pager, next, jumper"
          :total="1000"/>
      </div>
    </div>
    <div v-show="pageState === 2">
      <div class="header">
        仪器列表
        <button class="graybtn" @click="pageState = 0">返回审核列表</button>
      </div>
      <div class="base-msg-box">
        <div>
          <p>
            <span>
              实验时间
            </span>
            <span>
              第一周/星期三/第二节次
            </span>
          </p>
          <p>
            <span>
              实验名称
            </span>
            <span>
              氧气的制取
            </span>
          </p>
        </div>
        <div>
          <p>
            <span>
              实验班级
            </span>
            <span>
              七年级(1)班
            </span>
          </p>
          <p>
            <span>
              实验类型
            </span>
            <span>
              分组
            </span>
          </p>
          <p>
            <span>
              实验地点
            </span>
            <span>
              化学实验室1
            </span>
          </p>
        </div>
        <div>
          <p>预约备注</p>
          <p>我预约了实验室</p>
        </div>
      </div>
      <div class="table-box1">
        <el-table
          :data="tableData1"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="index"
            label="序号">
            <template slot-scope="scope">
              <span>{{ scope.row.index }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="分类编号"/>
          <el-table-column
            prop="instrumentName"
            label="仪器名称"/>
          <el-table-column
            prop="specifications"
            label="规格"/>
          <el-table-column
            prop="requirements"
            label="需要数量">
            <template slot-scope="scope">
              <el-input-number disabled v-model="scope.row.requirements" :min="1" :max="scope.row.store" label="描述文字"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="store"
            label="库存所有数量"/>
          <el-table-column
            prop="instrumentStore"
            label="仪器库"/>
          <el-table-column
            prop="cabinet"
            label="橱柜"/>
          <el-table-column
            prop="floor"
            label="层数"/>
          <el-table-column
            prop="quantity"
            label="数量"/>
          <el-table-column
            prop="remark"
            label="备注"/>
        </el-table>
      </div>
      <div class="footer1">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="100"
          background
          layout="prev, pager, next, jumper"
          :total="1000"/>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mySubList } from '../network/subscribe'
export default {
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      value: '',
      weekList: [
        {
          value: 1,
          name: '第一周',
          state: false,
        },
        {
          value: 2,
          name: '第二周',
          state: false,
        },
        {
          value: 3,
          name: '第三周',
          state: false,
        },
        {
          value: 4,
          name: '第四周',
          state: false,
        },
        {
          value: 5,
          name: '第五周',
          state: false,
        },
        {
          value: 6,
          name: '第六周',
          state: false,
        },
        {
          value: 7,
          name: '第七周',
          state: false,
        },
        {
          value: 8,
          name: '第八周',
          state: false,
        },
        {
          value: 9,
          name: '第九周',
          state: false,
        },
        {
          value: 10,
          name: '第十周',
          state: false,
        },
        {
          value: 11,
          name: '十一周',
          state: false,
        },
        {
          value: 12,
          name: '十二周',
          state: false,
        },
        {
          value: 13,
          name: '十三周',
          state: false,
        },
        {
          value: 14,
          name: '十四周',
          state: false,
        },
        {
          value: 15,
          name: '十五周',
          state: false,
        },
        {
          value: 16,
          name: '十六周',
          state: false,
        },
        {
          value: 17,
          name: '十七周',
          state: false,
        },
        {
          value: 18,
          name: '十八周',
          state: false,
        },
      ],
      dayList: [
        {
          value: 1,
          name: '周一',
          state: false,
        },
        {
          value: 2,
          name: '周二',
          state: false,
        },
        {
          value: 3,
          name: '周三',
          state: false,
        },
        {
          value: 4,
          name: '周四',
          state: false,
        },
        {
          value: 5,
          name: '周五',
          state: false,
        },
        {
          value: 6,
          name: '周六',
          state: false,
        },
        {
          value: 7,
          name: '周日',
          state: false,
        },
      ],
      tableData: [
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 1,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 2,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 3,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 4,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
        {
          lab: '实验室1',
          week: '第一周',
          time: '2016-05-02',
          expName: '地震监测实验',
          type: false,
          instrument: '地动仪',
          subscribePeople: '李老师',
          class: '初一二班',
          state: 0,
        },
      ],
      tableData1: [
        {
          index: 1,
          num: '0021001',
          instrumentName: '超级数据采集器',
          specifications: '高采集',
          requirements: 10,
          store: 20,
          instrumentStore: '化学仪器库1',
          cabinet: '橱柜3',
          floor: '三层',
          quantity: 20,
          remark: '',
        },
        {
          index: 2,
          num: '0021032',
          instrumentName: '烧杯',
          specifications: '500ml',
          requirements: 10,
          store: 10,
          instrumentStore: '化学仪器库1',
          cabinet: '橱柜3',
          floor: '二层',
          quantity: 10,
          remark: '',
        },
        {
          index: 1,
          num: '0021021',
          instrumentName: '烧杯',
          specifications: '1000ml',
          requirements: 5,
          store: 10,
          instrumentStore: '化学仪器库1',
          cabinet: '橱柜3',
          floor: '四层',
          quantity: 10,
          remark: '',
        },
      ],
      tableList: [],
      currentPage3: 1,
      pageState: 0,
    }
  },
  created() {
    this.getMySubList()
  },
  methods: {
    getMySubList() {
      mySubList().then((res) => {
        console.log(res)
        this.tableList = res.data
        console.log(this.tableList)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
  },
}
</script>

<style scoped lang="scss">
.exp-plan {
  box-sizing: border-box;
  padding: 28px 28px 0 28px;
  min-height: 800px;
  width: 100%;
  .sel-div1 {
    padding: 0 20px;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    width: 100%;
    color: #626572;
    text-align: left;
    background-color: #fff;
    & > :nth-child(1) {
      float: left;
      width: 7%;
      color: #05c65d;
    }
    & > :nth-child(2) {
      float: left;
      width: 93%;
      span {
        margin-right: 30px;
        cursor: pointer;
        &:hover {
          color: #05c65d;
        }
      }
    }
  }
  .sel-div2 {
    padding: 0 20px;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    width: 100%;
    color: #626572;
    background-color: #fff;
    text-align: left;
    & > :nth-child(1) {
      float: left;
      width: 7%;
      color: #05c65d;
    }
    & > :nth-child(2) {
      float: left;
      width: 93%;
      span {
        margin-right: 30px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          color: #05c65d;
        }
      }
    }
  }
  .sel-div3 {
    padding: 0 20px;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    width: 100%;
    color: #626572;
    background-color: #fff;
    text-align: left;
    & > :nth-child(1) {
      float: right;
      width: 93%;
      span {
        margin-right: 30px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          color: #05c65d;
        }
      }
    }
  }
  .header {
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    font-weight: 400;
    font-size: 18px;
    color: #626572;
    & > button {
      float: right;
      margin: 4px 12px;
    }
  }
  .base-msg-box {
    margin-top: 8px;
    width: 100%;
    height: 150px;
    background-color: #dcece3;
    & > :nth-child(1) {
      float: left;
      width: 30%;
      height: 100%;
    }
    & > :nth-child(2) {
      float: left;
      width: 30%;
      height: 100%;
    }
    & > div {
      & > p {
        text-align: left;
        padding-left: 12px;
        height: 50px;
        line-height: 50px;
        & > :nth-child(1) {
          padding-right: 12px;
          color: #05c65d;
        }
        & > :nth-child(2) {
          padding-right: 12px;
          color: rgb(150, 150, 150);
        }
      }
    }
    & > :nth-child(3) {
      float: left;
      width: 40%;
      height: 100%;
      p {
        height: 30px;
        color: #05c65d;
      }
      & > :nth-child(2) {
        color: rgb(150, 150, 150);
      }
    }
  }
}
.table-box {
  padding: 0 20px;
  width: 100%;
  min-height: 440px;
  box-sizing: border-box;
  background-color: #fff;
}
.table-box1 {
  padding-top: 16px;
  width: 100%;
  background-color: #fff;
  button {
    margin-top: 10px;
  }
  & > :nth-child(3) {
    float: right;
    margin-right: 20px;
  }
}
.footer2 {
  text-align: right;
  padding: 46px 20px 40px 0;
  height: 28px;
  background-color: #fff;
}
.footer1 {
  text-align: right;
  padding: 20px 20px 60px 20px;
  height: 28px;
  background-color: #fff;
}
// 分页
.el-pagination ::v-deep .number:hover {
  color: #05c65d !important;
}
.el-pagination ::v-deep .active {
  background-color: #05c65d !important;
  &:hover {
    color: #fff !important;
  }
}
.font-simple {
  cursor: pointer;
  margin: 0 4px;
  &:hover {
    color: #05c65d;
  }
}
.font-simple-disable {
  margin: 0 4px;
}
.font-red {
  color: rgb(250, 108, 108) !important;
}
.font-green {
  color: #05c65d !important;
}
.el-input-number ::v-deep .el-input {
  height: 20px !important;
}
</style>
