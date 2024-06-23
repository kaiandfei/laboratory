<template>
  <div>
    <div v-show="pageState === 1">
      <div class="header">
        仪器列表
        <button class="graybtn" @click="changePageState">返回审核列表</button>
      </div>
      <div class="base-msg-box">
        <div>
          <p>
            <span> 实验时间 </span>
            <span>
              {{
                '第' +
                instrumentData.week_time +
                '周/星期' +
                instrumentData.weekend +
                '/第' +
                instrumentData.section +
                '节次'
              }}
            </span>
          </p>
          <p>
            <span> 实验名称 </span>
            <span>
              {{ instrumentData.name }}
            </span>
          </p>
        </div>
        <div>
          <p>
            <span> 实验班级 </span>
            <span>
              {{
                instrumentData.grade === 7
                  ? '七年级 ( ' + instrumentData.class_id + ' ) 班'
                  : instrumentData.grade === 8
                  ? '八年级 ( ' + instrumentData.class_id + ' ) 班'
                  : instrumentData.grade === 9
                  ? '九年级 ( ' + instrumentData.class_id + ' ) 班'
                  : ''
              }}
            </span>
          </p>
          <p>
            <span> 实验类型 </span>
            <span>
              {{ $store.state.groupTypeList[instrumentData.type - 1] || '' }}
            </span>
          </p>
          <p>
            <span> 实验地点 </span>
            <span>
              {{ instrumentData.laboratory }}
            </span>
          </p>
        </div>
        <div>
          <p>预约备注</p>
          <p>{{ instrumentData.tips }}</p>
        </div>
      </div>
      <!-- <p>所需套数<el-input-number v-model="number_instruments" :min="1" :max="1000" label="描述文字"/></p> -->
      <div class="table-box">
        <div style="text-align: left">
          <span>仪器备注：</span>
          {{ tips }}
        </div>
        <div class="table-scoll">
          <el-table
            :data="tableData1"
            border
            stripe
            style="width: 100%"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column type="index" label="序号" width="80px" sortable />
            <el-table-column prop="number" label="分类编号" sortable />
            <el-table-column prop="name" label="仪器名称" sortable />
            <el-table-column prop="info" label="规格" sortable />
            <el-table-column
              prop="num"
              label="需要数量"
              sortable
              :sort-method="
                (a, b) => {
                  return a.num - b.num
                }
              "
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  :min="0"
                  :max="scope.row.inventory"
                  label="描述文字"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="inventory"
              label="库存所有数量"
              sortable
              :sort-method="
                (a, b) => {
                  return a.inventory - b.inventory
                }
              "
            />
            <el-table-column prop="library" label="仪器库" sortable>
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.librarys" :key="index">
                  {{ item.name + '(' }}
                  <span class="font-green">{{ item.num + '个' }}</span>
                  )<br />
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="ambry"
              label="橱柜"
              sortable/>
            <el-table-column
              prop="layer_number"
              label="层数"
              sortable/> -->
            <el-table-column prop="tips" label="备注" sortable />
          </el-table>
        </div>
        <button class="commonbtn" @click="add">新增 +</button>
        <button class="commonbtn" @click="saveMaterial">保存</button>
        <el-dialog title="添加仪器" :visible.sync="dialogVisible" width="30%">
          <div style="display: flex">
            <p style="width: 100px; line-height: 30px">新增仪器</p>
            <el-input v-model="input" placeholder="请输入内容" />
          </div>
          <div class="tab-box">
            <el-table
              ref="multipleTable"
              :data="tableData3"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="number" label="分类编号" width="150" />
              <el-table-column prop="name" label="姓名" width="150" />
              <el-table-column prop="info" label="规格" show-overflow-tooltip />
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- <div class="footer1">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="100"
          background
          layout="prev, pager, next, jumper"
          :total="1000"/>
      </div> -->
    </div>
  </div>
</template>

<script>
import { ExpMaterialFind } from '@/network/experimentPlan'
import { addBookMaterial, examInstrument } from '@/network/subExamine'

export default {
  name: '',
  props: {
    pageState: {
      type: Number,
      default: 0,
    },
    instrumentData: {
      type: Object,
      default: function () {
        return {
          id: 105,
          plan_detail_id: 43,
          school_id: 2,
          grade: 9,
          class_id: 19,
          subject_id: 1,
          laboratory_id: 5,
          change_laboratory_id: null,
          school_year: 2021,
          semester: 1,
          week_time: 1,
          weekend: 3,
          section: 8,
          exp_id: 197,
          teacher_id: 15,
          type: 1,
          number_groups: 1,
          number_instruments: 1,
          create_time: '2021-09-22 17:00:47',
          start_time: null,
          end_time: null,
          status: 2,
          tips: '请提前审核',
          ex_admin_tips: null,
          is_del: 0,
          teacher_name: '方老师',
          name: '用电压表测量电压',
          laboratory: '物理实验室1',
          material: [
            {
              id: 20,
              num: null,
              name: '小灯泡1.5 V',
              logo: 1,
              info: '1.5 V ， 0.15 A，E10',
              number: '06150-03',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 2,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 23,
              num: null,
              name: '红色导线',
              logo: 1,
              info: 'L=500mm，32A',
              number: '07361-01',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 2,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 34,
              num: null,
              name: '小灯泡6 V',
              logo: 1,
              info: '6 V ， 0.5 A，E10',
              number: '35673-03',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 2,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 39,
              num: null,
              name: '指针式电压表',
              logo: 1,
              info: '量程：3V/15V',
              number: 'c1008-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 2,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 64,
              num: null,
              name: '1号电池',
              logo: 1,
              info: null,
              number: 'c1042-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 3,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 65,
              num: null,
              name: '黑色导线',
              logo: 1,
              info: 'L=500mm，32A',
              number: 'c1043-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 3,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 81,
              num: null,
              name: '单刀单掷开关',
              logo: 1,
              info: null,
              number: 'c7001-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 3,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 83,
              num: null,
              name: '小灯泡底座',
              logo: 1,
              info: 'E10，螺口',
              number: 'c7003-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 1,
              ambry_id: 3,
              tips: null,
              inventory: 30,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 106,
              num: null,
              name: '小灯泡1.5 V',
              logo: 1,
              info: '1.5 V ， 0.15 A，E10',
              number: '06150-03',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 5,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 109,
              num: null,
              name: '红色导线',
              logo: 1,
              info: 'L=500mm，32A',
              number: '07361-01',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 5,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 120,
              num: null,
              name: '小灯泡6 V',
              logo: 1,
              info: '6 V ， 0.5 A，E10',
              number: '35673-03',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 5,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 125,
              num: null,
              name: '指针式电压表',
              logo: 1,
              info: '量程：3V/15V',
              number: 'c1008-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 5,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 150,
              num: null,
              name: '1号电池',
              logo: 1,
              info: null,
              number: 'c1042-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 6,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 151,
              num: null,
              name: '黑色导线',
              logo: 1,
              info: 'L=500mm，32A',
              number: 'c1043-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 6,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 167,
              num: null,
              name: '单刀单掷开关',
              logo: 1,
              info: null,
              number: 'c7001-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 6,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
            {
              id: 169,
              num: null,
              name: '小灯泡底座',
              logo: 1,
              info: 'E10，螺口',
              number: 'c7003-00',
              category_name: null,
              price: '0.00',
              unit: null,
              cover_id: '',
              status: 1,
              update_time: 0,
              create_time: 0,
              delete_time: 0,
              trait: null,
              start_grade: null,
              end_grade: null,
              cover_ids: '',
              description: null,
              type: 1,
              db_type: 1,
              view_num: 0,
              like_num: 0,
              library_id: 2,
              ambry_id: 6,
              tips: null,
              inventory: 20,
              school_id: 2,
              member_id: null,
              is_del: 0,
            },
          ],
        }
      },
    },
    itemId: {
      type: Number,
      default: 62,
    },
    tips: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tableData1: [],
      tableData2: [],
      tableData3: [],
      input: '',
      dialogVisible: false,
    }
  },
  created() {},
  mounted() {},
  methods: {
    changePageState() {
      this.$emit('changePageState', 0)
    },
    instrumentClick() {
      this.pageState = 1
      const data = {
        id: this.itemId,
      }
      examInstrument(data).then((res) => {
        console.log(res)
        this.tips = res.data.tips
        this.tableData1 = res.data.data.map((e) => {
          return e
        })
        this.number_instruments = res.data.number_instruments
      })
    },
    add() {
      this.dialogVisible = true
      const data = {}
      ExpMaterialFind(data).then((res) => {
        console.log(res)
        this.tableData3 = res.data
      })
    },
    saveMaterial() {
      const arr = []
      this.tableData1.map((e) => {
        arr.push({
          id: e.id,
          material_number: e.material_number,
          num: e.num,
          sequence: e.sequence,
          tip: e.tip,
        })
      })
      const data = {
        id: this.instrumentData.id,
        number: this.number_instruments,
        detail: arr,
      }
      this.$confirm('仪器是否准备完毕', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        addBookMaterial(data).then((res) => {
          console.log(res)
          this.instrumentClick(this.instrumentData)
          this.getTableDate()
          this.pageState = 0
          this.propState = false
          if (res.code === 10) {
            this.$message({
              message: '保存成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: '保存失败',
              type: 'error',
            })
          }
        })
      })
    },
    handleSelectionChange(val) {
      this.tableData2 = val
    },
    determine() {
      this.dialogVisible = false
      this.tableData2.map((item, index) => {
        item.index = index + 1
        item.material_number = item.number
        item.materialname = item.name
        item.num = 0
      })
      this.tableData2 = JSON.parse(JSON.stringify(this.tableData2))
      this.tableData1.push(...this.tableData2)
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: 40px;
  line-height: 40px;
  background-color: #fff;
  font-weight: 400;
  font-size: 18px;
  color: #626572;
  & > button {
    float: right;
    margin: 4px 20px;
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
.table-box {
  padding: 16px 20px 20px;
  width: 100%;
  // height: 620px;
  background-color: #fff;
  box-sizing: border-box;
  .table-scoll {
    height: 550px;
    overflow-y: auto;
  }
  button {
    margin-top: 10px;
  }
  & > :nth-child(3) {
    float: right;
    margin-right: 20px;
  }
}
</style>
