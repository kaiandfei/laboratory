<template>
  <div>
    <header>
      <div class="fl">
        <span>智能设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>智慧班牌</span>
      </div>
      <div class="button-box" style="float: right">
        <div class="btn" @click="pageRetuen">
          <img style="vertical-align: middle" src="@assets/images/laboratory-standard/cancel.png" alt="" />
          返回
        </div>
      </div>
    </header>
    <div class="disFlex">
      <div class="main-one">
        <div class="main-one-title">
          <div class="yuan"></div>
          <div class="font">基本信息</div>
        </div>
        <div class="main-one-title2"></div>
        <div class="main-one-title">
          <div class="yuan"></div>
          <div class="font">展示页面</div>
        </div>
        <div class="main-one-title2" style="height: 490px"></div>
        <div class="main-one-title">
          <div class="yuan"></div>
          <div class="font">ic/id卡</div>
        </div>
      </div>
      <div style="flex: 5">
        <div class="sel-box">
          <div class="operation" style="height: 200px">
            <div>类型：{{ props.detail.type_name }}</div>
            <div>绑定位置：{{ props.detail.labName }}</div>
            <div>添加时间：{{ props.detail.create_time }}</div>
            <div>状态：{{ ['离线', '在线'][props.detail.status] }}</div>
          </div>
        </div>
        <div class="sel-box">
          <div class="operation" style="height: 520px">
            <!--            <img src="@/assets/images/laboratory-manage/cam.png">-->
            <div style="height: 100%">
              <img
                  v-if="props.detail.class_card_img_url === ''"
                  src="@/assets/images/intelligent-device/template.jpg"
                  style="height: 94%"
              />
              <img
                  v-else
                  :src="props.detail.class_card_img_url"
                  style="height: 94%"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="content">
            <el-table
              :data="props.detail.ic_id_list"
              style="width: 100%"
              :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
              :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
              @sort-change="sortChange"
            >
              <el-table-column type="index" prop="" label="序号" width="60" align="left"></el-table-column>
              <el-table-column prop="code" label="卡号" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column prop="type" label="类型" align="left" show-overflow-tooltip>
                <template #default="scope">
                  <span>
                    {{ ['ic', 'id'][scope.row.type - 1] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" align="left" show-overflow-tooltip>
                <template #default="scope">
                  <span>
                    {{ ['启用', '禁用'][scope.row.status - 1] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="负责人" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column prop="create_time" label="添加时间" align="left" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
          <div class="pagination-block">
            <!--        <el-pagination-->
            <!--            v-model:currentPage="currentPage"-->
            <!--            :page-size="10"-->
            <!--            @current-change="handleCurrentChange"-->
            <!--            background-->
            <!--            layout="total, prev, pager, next, jumper"-->
            <!--            :total="total"-->
            <!--        ></el-pagination>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useStore } from '@/store'
import { ArrowRight } from '@element-plus/icons-vue'

let emit = defineEmits(['back'])
const pageRetuen = () => {
  console.log(512132321)
  emit('back')
}
let props = defineProps({
  detail: {
    type: Array,
    required: true
  }
})
const store = useStore()
const subject = store.state.common.subjectArr
const data = ref([
  {
    school_name: '测试学校',
    type: '灯光',
    number: '879879879',
    laboratory_name: '测试实验室',
    subject: '物理',
    status: 1,
    create_time: '2023-05-06'
  },
  {
    school_name: '测试学校',
    type: '灯光',
    number: '879879879',
    laboratory_name: '测试实验室',
    subject: '物理',
    status: 1,
    create_time: '2023-05-06'
  }
])
let setData = reactive({
  temperature: 20,
  carbonDioxide: 20,
  type: 1,
  humidness: 20,
  PM10: 20,
  PM25: 20,
  voc: 20
})
</script>
<style scoped lang="scss">
header {
  height: 30px;
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}
.disFlex {
  display: flex;
  .main-one {
    flex: 1;
    padding-left: 50px;
    min-width: 150px;
    .main-one-title {
      margin-top: 20px;
      display: flex;
      .yuan {
        width: 30px;
        height: 30px;
        background: #1991ff;
        border-radius: 15px;
      }
      .font {
        line-height: 30px;
        padding-left: 20px;
      }
    }
    .main-one-title2 {
      width: 50px;
      height: 170px;
      border-left: 2px solid #1991ff;
      margin: 10px 0px 0 15px;
    }
  }
}
main {
  width: 100%;

  .sel-box {
    width: 100%;
    margin-top: 20px;
    .operation {
      //float: left;
      //display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: #dbdbdb;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      padding-bottom: 10px;
      div {
        padding: 20px 0 10px 20px;
        text-align: left;
        font-weight: bold;
      }
    }

    .screen {
      height: 60px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;

      .sel-l {
        float: left;
        width: 80%;

        .sel-item {
          float: left;
          margin-top: 16px;
          width: 25%;
          display: flex;
          justify-content: space-between;

          & > span {
            float: left;
            width: 20%;
            height: 30px;
            line-height: 30px;
            text-align: right;
            color: #848484;
          }

          .sel {
            float: left;
            margin-right: 10%;
            width: 60%;
          }
        }
      }

      .sel-r {
        float: right;
        width: 20%;

        .mt-4 {
          margin: 16px auto;
          width: calc(100% - 40px);

          .ser-icon {
            padding: 0 10px;
            cursor: pointer;

            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }

    .set {
      height: 30px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;
      .sel-l {
        float: left;
        width: 80%;
      }
      span {
        float: left;
        margin-left: 30px;
        line-height: 30px;
      }
    }
  }
  .msg-box {
    margin-top: 20px;
    height: 350px;
    width: 100%;
    .all-lab {
      float: left;
      width: 350px;
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      p {
        margin-top: 75px;
        height: 26px;
        line-height: 26px;
      }
      & > div {
        margin: 30px auto;
        padding: 10px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #05c65d;
        & > div {
          margin: auto;
          padding: 10px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #fff;
          & > div {
            margin: auto;
            padding: 10px;
            width: 80px;
            height: 80px;
            line-height: 80px;
            font-size: 40px;
            color: #fff;
            border-radius: 50%;
            background-color: #05c65d;
          }
        }
      }
    }
    .pie-box {
      float: right;
      width: calc(100% - 370px);
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
  .table-box {
    margin-top: 20px;
    width: 100%;
  }
  .card_box {
    margin: 20px 0;
    height: 60px;
    line-height: 60px;
    width: 100%;
    display: flex;
    background-color: #fff;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #626572;
    div {
      flex: 1;
      cursor: pointer;
      border-radius: 10px;
    }
    .card-active {
      color: #05c65d;
      background-color: #bef1d5;
    }
  }
}
.btn {
  margin-right: 20px;
  padding: 8px 21px;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.el-input {
  float: left;
  width: auto;
}
.fl {
  padding-left: 5px;
}
.content {
  margin-top: 20px;
  .click-box {
    display: flex;
    justify-content: space-evenly;
    .click-text {
      display: flex;
      align-items: center;
      margin: 0 10px;
      cursor: pointer;
      img {
        margin-right: 6px;
      }
    }
  }
}
.green {
  color: #05c65d;
}
.white-btn {
  color: #05c65d;
  border: 0px solid #f3f3f3;
  //background: #f3f3f3;
}
:deep(.el-form-item__label) {
  text-align: left;
}
:deep(.el-form-item__content) {
  display: flex;
}
</style>
