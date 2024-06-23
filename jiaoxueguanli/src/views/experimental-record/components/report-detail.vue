<template>
  <div class="box">
    <div class="header">
      <div class="title">
        {{
          `分组${item.group_id}/${item.group_studentname}/${item.level || ' 暂未评定'}`
        }}
      </div>
      <div class="button-box">
        <button class="button" @click="back">返回</button>
        <el-popover placement="bottom" v-model="visible">
          <div class="level-box">
            <div
              v-for="(m, n) in levelList"
              class="level"
              :class="{ active: m === level }"
              :key="n"
              @click="changeLevel(m)"
            >
              {{ m }}
            </div>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="submit()">确定</el-button>
          </div>
          <button class="button" slot="reference">评定</button>
        </el-popover>
        <!-- <button v-show="copydata.copy === false&&item_id!==0&&!copydata.shareToStu" @click="save(true)">另存为</button> -->
      </div>
    </div>
    <template-detail
      v-if="detailItem.reportTempletData"
      class="template"
      :props-data="detailItem"
      :disabled="true"
    ></template-detail>
  </div>
</template>

<script>
import {
  findExpResourcesReportTempletbystudent,
  updatestudentgroup,
} from '@/network/experimentRecord'
import TemplateDetail from '@/views/myExperiment/components/template-detail.vue'
export default {
  name: '',
  props: {
    expbookid: Number,
    item: Object,
  },
  components: { TemplateDetail },
  data() {
    return {
      detailItem: {},
      visible: false,
      level: 'A',
      levelList: ['A', 'B', 'C', 'D'],
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      findExpResourcesReportTempletbystudent({
        exp_id: this.item.exp_id,
        group_id: this.item.group_id,
        expbookid: this.expbookid,
      }).then((result) => {
        this.detailItem = {
          ...result.data,
          reportTempletData: result.data.reportTempletData.map((e) => {
            let obj = JSON.parse(JSON.stringify(e))
            let teachercontent = obj.studentcontent
            delete obj.studentcontent
            return {
              ...obj,
              teachercontent,
            }
          }),
        }
      })
    },
    back() {
      this.$emit('back')
    },
    changeLevel(l) {
      this.level = l
    },
    submit() {
      console.log('xxx')
      updatestudentgroup({
        exp_id: this.item.exp_id,
        group_id: this.item.group_id,
        level: this.level,
      }).then((res) => {
        if (res.code === 10) {
          this.$message.success(res.msg)
          this.back()
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  margin-top: 10px;
  padding: 10px;
  background: #fff;
  text-align: left;
}
.header {
  display: flex;
  justify-content: space-between;
  .title {
    padding: 8px 20px;
    color: #05c65d;
    font-size: 16px;
    border-bottom: 4px solid #05c65d;
  }
}
.level-box {
  display: flex;
  .level {
    margin: 20px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background: rgb(164, 173, 179);
    border-radius: 4px;
    cursor: pointer;
  }
  .active {
    background: #05c65d;
  }
}
.button-box {
  // margin: 10px 40px 0 0;
  .button {
    margin-right: 20px;
    width: 100px;
    height: 36px;
    background-color: #05c65d;
    border: 1px solid #05c65d;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    color: #fff;
  }
  & > :nth-child(1) {
    margin-right: 20px;
    width: 100px;
    height: 36px;
    background-color: #fff;
    border: 1px solid #c9c7c7;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    font-size: 14px;
    color: #333;
  }
}
.template {
  padding: 10px;
}
</style>
