<template>
  <div>
    <el-dialog
      custom-class="detail-dialog"
      v-model="detailState"
      width="50%"
      title="变卖登记卡详情"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="topArea">
        <div class="base-box-detail">
          <div class="base-box">
            <div class="fl">
              <div class="line">
                <div class="name">变卖人：{{ props.itemData.realtor }}</div>
                <div></div>
              </div>
              <div class="line">
                <div class="name">变卖原因: {{ props.itemData.cause }}</div>
                <div></div>
              </div>
              <div class="line">
                <div class="name">*变卖金额：{{ props.itemData.price }}</div>
                <div></div>
              </div>
              <div class="line">
                <div class="name">登记人：{{ props.itemData.user_name }}</div>
                <div></div>
              </div>
              <div class="line">
                <div class="name">说明：{{ props.itemData.desc }}</div>
                <div></div>
              </div>
              <div class="line">
                <div class="name">图片：</div>
                <div v-for="item in props.itemData.picture" :key="item.id">
                  <img class="imgs" :src="item.url_path" />
                </div>
              </div>
              <div class="line list">
                <div class="name">变卖清单：</div>
                <div v-for="item in props.itemData.detail" :key="item.id">
                  <div>
                    {{ item.asset_number }} {{ item.name }} {{ item.laboratory_name }}
                    {{ item.store_id > 0 ? item.store_name : '' }}
                    {{ item.number_plies > 0 ? '第' + item.number_plies + '层' : '' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="fr">
              <div class="line">
                <div class="name">变卖单号:</div>
                <div>
                  <span>{{ itemData.record_number }}</span>
                </div>
              </div>

              <div class="line">
                <div class="name">变卖时间:</div>
                <div>
                  <span>{{ itemData.sale_time }}</span>
                </div>
              </div>

              <div class="line">
                <div class="name">登记时间:</div>
                <div>
                  <span>{{ itemData.create_time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonArea">
        <el-button type="primary" @click="back()">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs } from 'vue'
let props = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})
// let { itemData } = toRefs(props)
// console.log(55555)
// console.log(props.itemData.id)
let detailState = ref(true)
let emit = defineEmits(['back'])
const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
.imgs {
  width: 100px;
}
:deep(.detail-dialog) {
  margin-top: 50px;
  height: 850px;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    .title-box {
      display: flex;
      justify-content: space-evenly;
      height: 60px;
      .edit-title {
        width: 24%;
        height: 40px;
        line-height: 40px;
        color: #848484;
        border: #b5b5b5 1px solid;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        cursor: pointer;
      }
      .active-item {
        color: #05c65d;
      }
    }
    .titleArea {
      width: 20%;
      height: 5%;
      float: left;
      justify-content: left;
      display: flex;
    }
    .statusTitle {
      width: 160px;
      height: 5%;
      float: left;
      justify-content: left;
      display: flex;
      margin-left: 60px;
      font-weight: 600;
    }
    .detailArea,
    .middleArea {
      padding: 0 0 10px 0;
      width: 90%;
      float: left;
      margin-left: 5%;
      border: 1px solid #05c65d;
      .nav {
        width: 50%;
        min-height: 40px;
        float: left;
        align-items: center;
        // justify-content: left;
        display: flex;
        .name {
          float: left;
          width: 40%;
          height: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
          font-weight: 600;
        }
        .value {
          padding: 4px 0;
          display: flex;
          height: 30%;
          width: 100%;
          align-items: center;
          justify-content: left;
          text-align: left;
        }
        .valueArea {
          float: left;
          margin-left: 20px;
          width: 100%;
        }
      }
      .nav2 {
        width: 50%;
        padding-left: 20px;
        min-height: 40px;
        float: right;
        align-items: center;
        // justify-content: left;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        .name {
          width: 120px;
          height: 40%;
          display: flex;
          align-items: center;
          justify-items: flex-start;
          font-weight: 600;
        }
        .value {
          margin-left: 0 !important;
          padding: 4px 0;
          display: flex;
          min-height: 20px;
          text-align: left;
          justify-content: flex-start;
        }
      }
    }
    .middleArea {
      margin-top: 20px;
      .left {
        width: 40%;
        height: 100%;
        float: left;
        .nav {
          width: 100%;
          float: left;
          align-items: center;
          // justify-content: left;
          display: flex;
        }
      }
    }
    .titleArea {
      width: 50%;
      float: left;
      margin-left: 5%;
      margin-top: 20px;
      .title {
        margin-left: 10px;
        float: left;
        color: #05c65d;
        cursor: pointer;
      }
    }
    .listArea {
      width: 90%;
      float: left;
      margin-left: 5%;
      height: 100px;
      border: 1px solid #848484;
      .left {
        width: 40%;
        height: 100%;
        float: left;
        .nav {
          width: 100%;
          height: 40px;
          float: left;
          align-items: center;
          // justify-content: left;
          display: flex;
          .name {
            float: left;
            width: 40%;
            height: 40%;
            margin-left: 20px;
            align-items: center;
            display: flex;
            font-weight: 600;
          }
          .value {
            display: flex;
            height: 20%;
            width: 100%;
            align-items: left;
          }
          .valueArea {
            float: left;
            margin-left: 20px;
            height: 80%;
            width: 100%;
            .title {
              float: left;
              height: 50px;
            }
            .Area {
              width: 100%;
              height: 20px;
              float: left;
            }
          }
        }
      }
    }
    .buttonArea {
      height: 50px;
      margin: 20px 5% 10px 0;
      float: right;
    }
  }
}
</style>
