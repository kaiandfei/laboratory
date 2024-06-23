<template>
  <div class="content">
    <div class="top_menu">
      <span>批量准备实验仪器</span>
      <div class="btn-box">
        <p @click="edit('cancel')" v-show="editStatus === true" class="cancel">取消</p>
        <p @click="edit" v-if="false">{{ editStatus === false ? '编辑' : '保存' }}</p>
        <p><img src="@images/instrumentPre/export.png" alt="" />&nbsp;导出表格</p>
      </div>
    </div>
    <div class="left-box">
      <div class="screen-top">
        <div class="block">
          <span class="demonstration">开始时间：</span>
          <el-date-picker
            v-model="startTime"
            value-format="yyyy-M-d"
            @change="getExpLaboratory"
            placeholder="选择时间"
          />
        </div>
        <div class="block">
          <span class="demonstration">结束时间：</span>
          <el-date-picker
            v-model="endTime"
            value-format="yyyy-M-d"
            @change="getExpLaboratory"
            placeholder="选择时间"
          />
        </div>
      </div>
      <img src="@images/plan/top-img.png" alt="" />
      <div v-if="false" class="screen-bottom">
        <div class="screen-bl">
          <p>实验名称</p>
          <div class="check-box">
            <el-checkbox-group v-model="checkExpList">
              <el-checkbox
                v-for="(item, index) in ExpList"
                :key="index"
                :title="item.name"
                :label="item.exp_id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
        <div class="screen-br">
          <p>实验室</p>
          <div class="check-box">
            <el-checkbox-group v-model="checkLaboratoryList" @change="changeLaboratory">
              <el-checkbox
                v-for="(item, index) in labList"
                :key="index"
                :label="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-if="false" class="btn" @click="screen()">确认筛选</div>
    </div>
    <div class="right-box">
      <el-table
        :data="tableData.data"
        border
        stripe
        :header-cell-style="{}"
        :cell-style="{ height: '63px' }"
      >
        <el-table-column fixed align="left" type="index" label="序号" min-width="50" />
        <el-table-column
          align="left"
          prop="material_number"
          label="分类编号"
          min-width="80"
        />
        <el-table-column align="left" prop="name" label="仪器名称" min-width="120" />
        <el-table-column align="left" prop="info" label="规格" min-width="160" />
        <el-table-column align="left" label="需要数量" prop="total" min-width="80">
          <!-- <template slot-scope="scope">
            <el-input-number v-model="scope.row.total" @change="handleChange" :min="1" :max="scope.row.inventory" :disabled="!editStatus"/>
          </template> -->
        </el-table-column>
        <el-table-column align="left" prop="inventory" label="库存数量" min-width="80" />
        <el-table-column align="left" prop="library" label="仪器库" min-width="100" />
        <el-table-column align="left" prop="ambry" label="橱柜" min-width="50" />
        <el-table-column align="left" prop="plies" label="层数" min-width="50" />
        <!-- <el-table-column
          align="left"
          prop="num"
          label="数量"
          min-width="50"/> -->
        <el-table-column
          align="left"
          prop="tips"
          show-overflow-tooltip
          label="备注"
          min-width="160"
        />
      </el-table>
      <div class="page-tab">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="10"
          @current-change="changePage"
          :total="tableData.total"
        />
      </div>
    </div>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import { prepareMaterial, expLaboratory } from '../../network/instrument'
export default {
  name: 'InstrumentPre',
  props: {
    materialList: String,
  },
  data() {
    return {
      startTime: '',
      endTime: '',
      checked: true,
      editStatus: false,
      labList: [],
      ExpList: [],
      checkExpList: [],
      checkLaboratoryList: [],
      tableData: {
        data: [],
        total: 0,
      },
      selectData: {
        exp_id: '',
        star_time: '',
        end_time: '',
      },
    }
  },
  created() {
    const date = new Date()
    this.startTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    this.endTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    this.labList = [...this.$store.state.labList]
    this.labList.push({
      id: -1,
      name: '教室',
    })
    this.labList.forEach((e) => {
      this.checkLaboratoryList.push(e.id)
    })
    // 保存筛选信息，翻页时请求数据，翻页的数据不会被影响
    this.selectData = {
      exp_id: this.checkExpList.join(','),
      star_time: this.startTime,
      end_time: this.endTime,
    }
    this.getExpLaboratory()
  },
  methods: {
    handleChange(row) {
      console.log(row)
    },
    getData(obj) {
      prepareMaterial(obj).then((res) => {
        if (res.code === 10) {
          this.tableData = res.data
        }
      })
    },
    changePage(page) {
      this.getData({
        page: page,
        exp_id: this.selectData.exp_id,
        star_time: this.selectData.star_time,
        end_time: this.selectData.end_time,
      })
    },
    getExpLaboratory() {
      expLaboratory({
        // laboratory_id: this.checkLaboratoryList.join(',')
      }).then((res) => {
        if (res.code === 10) {
          this.ExpList = res.data
          this.ExpList.forEach((e) => {
            this.checkExpList.push(e.exp_id)
          })
          this.changeLaboratory()
          this.getData({
            page: 1,
            star_time: this.startTime,
            end_time: this.endTime,
            exp_id: this.checkExpList.join(','),
          })
        }
      })
    },
    changeLaboratory() {
      const arr = this.ExpList.filter((item) => {
        return this.checkLaboratoryList.indexOf(item.laboratory_id) !== -1
      })
      this.checkExpList = []
      arr.forEach((e) => {
        this.checkExpList.push(e.exp_id)
      })
    },
    screen() {
      this.getData({
        page: 1,
        exp_id: this.checkExpList.join(','),
        star_time: this.startTime,
        end_time: this.endTime,
      })
      this.selectData = {
        exp_id: this.checkExpList.join(','),
        star_time: this.startTime,
        end_time: this.endTime,
      }
    },
    edit(type) {
      if (type === 'cancel') {
        this.editStatus = false
      } else {
        this.editStatus = !this.editStatus
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 28px 0 28px;
  overflow: hidden;
  .top_menu {
    margin-bottom: 20px;
    text-align: left;
    .btn-box {
      display: flex;
      transform: translate(0, -8px);
      float: right;
      user-select: none;
      p {
        width: 80px;
        height: 36px;
        line-height: 36px;
        margin-right: 20px;
        border-radius: 10px;
        text-align: center;
        color: #fff;
        background: #05c65d;
        cursor: pointer;
      }
      p:last-of-type {
        width: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cancel {
        background: #848484;
      }
    }
  }
  .left-box {
    width: 20%;
    float: left;
    background: #fff;
    ::v-deep .el-input {
      width: 200px !important;
    }
    ::v-deep .el-input__inner {
      width: 200px !important;
    }
    ::v-deep .el-input__icon {
      line-height: 30px;
    }
    img {
      margin: 200px 0;
      width: 100%;
      // height: 500px;
      box-sizing: border-box;
    }
  }
  .right-box {
    margin-left: 20px;
    width: 76%;
    float: left;
    ::v-deep .el-table__header {
      border-collapse: collapse;
    }
    ::v-deep .el-table__body {
      border-collapse: collapse;
    }
    .page-tab {
      margin-top: 10px;
      text-align: right;
    }
  }
  .screen-top {
    padding-top: 10px;
    width: 100%;
    height: 130px;
    background: #fff;
    .block {
      margin-top: 20px;
      .demonstration {
        color: #848484;
      }
    }
  }
  .screen-bottom {
    margin-top: 10px;
    width: 100%;
    height: 550px;
    .screen-bl {
      margin-right: 3%;
      width: 55%;
      float: left;
      background: #fff;
      & > p {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #05c65d;
        background: #dcece3;
      }
    }
    .screen-br {
      width: 42%;
      float: left;
      background: #fff;
      & > p {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #05c65d;
        background: #dcece3;
      }
    }
    .check-box {
      height: 500px;
      .el-checkbox-group {
        overflow: hidden;
        text-align: left;
        .el-checkbox {
          margin: 10px 10px;
          display: block;
        }
      }
    }
  }
  .btn {
    margin-top: 20px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    border-radius: 10px;
    color: #fff;
    background: #05c65d;
    cursor: pointer;
  }
}
</style>
