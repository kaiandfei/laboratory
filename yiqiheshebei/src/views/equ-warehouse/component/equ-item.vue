<template>
  <div class="equ">
    <p>
      <span>{{ `${itemData.name}(${itemData.type === 1 ? itemData.number : itemData.asset_number})` }}</span>
      <span>存放{{ itemData.total + '' + itemData.unit }}</span>
    </p>
    <div class="details">
      <img v-show="itemData.picture" :src="itemData.picture" alt="" />
      <!-- <qrcode-vue :value="itemData.qr_code || ''" :size="50" level="H" /> -->
      <span @click="showDetail(itemData.insId, itemData.total, itemData.number_plies)">详情</span>
    </div>

    <el-dialog custom-class="detail-dialog" v-model="insDetailShow" title="查看详情" width="50%">
      <div class="top">
        <div class="nav">
          <span>分类编号：</span>
          <span>{{ insEquDetailData.number }}</span>
        </div>
        <div class="nav">
          <span>名称：</span>
          <span :title="insEquDetailData.name">{{ insEquDetailData.name }}</span>
        </div>
        <div class="nav">
          <span>规格型号：</span>
          <span :title="insEquDetailData.specification">{{ insEquDetailData.specification }}</span>
        </div>
        <div class="imgArea">
          <div class="title">仪器图片：</div>
          <el-image
            v-for="(item, index) in insEquDetailData.picture"
            :key="index"
            style="width: 100px; height: 100px; margin-right: 10px"
            :src="item.url_path"
            :preview-src-list="[item.url_path]"
            :initial-index="1"
          ></el-image>
        </div>
        <div class="nav">
          <span>学校编号：</span>
          <span>{{ insEquDetailData.asset_number }}</span>
        </div>
        <div class="nav">
          <span>类型：</span>
          <span>{{ insEquDetailData.cost_type === 1 ? '低值易耗' : '非低值易耗' }}</span>
        </div>
        <div class="nav">
          <span>实验类型：</span>
          <span>
            {{ insEquDetailData.is_group === 1 ? '分组' : insEquDetailData.is_group === 2 ? '演示' : '分组/演示' }}
          </span>
        </div>
        <div class="nav">
          <span>配备类型：</span>
          <span>{{ insEquDetailData.is_must === 1 ? '必配' : '选配' }}</span>
        </div>
        <div class="nav">
          <span>仪器描述：</span>
          <span :title="insEquDetailData.info">{{ insEquDetailData.info }}</span>
        </div>
        <div class="nav">
          <span>仪器标准：</span>
          <span :title="insEquDetailData.norm">{{ insEquDetailData.norm }}</span>
        </div>
        <div class="nav">
          <span>使用年限：</span>
          <span>{{ insEquDetailData.number_year }}</span>
        </div>
        <div class="nav">
          <span>此处存放：</span>
          <span>{{ insEquDetailData.total + ' ' + insEquDetailData.unit }}</span>
        </div>
      </div>
      <div class="bottom">
        <el-table
          :data="insEquDetailData.detail"
          style="width: 100%"
          max-height="460"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        >
          <el-table-column label="来源" prop="source" align="left">
            <template #default="scope">
              {{
                ['期初建账', '集采', '自制', '馈赠', '自购', '调拨', '盘点', '损耗报废', '损坏赔偿'][scope.row.source]
              }}
            </template>
          </el-table-column>
          <el-table-column label="凭证号" prop="voucher_number" align="left"></el-table-column>
          <el-table-column label="采购批次" prop="bacth" align="left"></el-table-column>
          <el-table-column label="产地(厂家)" prop="factory" align="left"></el-table-column>
          <el-table-column label="数量" prop="total" align="left"></el-table-column>
          <!-- <el-table-column label="二维码" prop="back_time" align="left">
            <template #default="scope">
              <qrcode-vue :value="scope.row.back_time" :size="80" level="H" />
              <span class="down-text">下载</span>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <template #footer>
        <div class="buttonArea">
          <el-button type="primary" @click="insDetailShow = false">返回</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog custom-class="ei-detail-dialog" v-model="equDetailShow" title="查看详情" width="45%">
      <div class="list fl">
        <p>
          <span>类别编号：</span>
          <span>{{ insEquDetailData.number }}</span>
        </p>
        <p>
          <span>资产编号：</span>
          <span>{{ insEquDetailData.asset_number }}</span>
        </p>
        <p>
          <span>名称：</span>
          <span :title="insEquDetailData.name">{{ insEquDetailData.name }}</span>
        </p>
        <p>
          <span>规格型号：</span>
          <span :title="insEquDetailData.specification">{{ insEquDetailData.specification }}</span>
        </p>
        <p>
          <span>库存位置：</span>
          <span>
            {{ `${insEquDetailData.laboratory_name}${insEquDetailData.store_name}${insEquDetailData.number_plies}` }}
          </span>
        </p>
        <!-- <p>
          <span>标准分类：</span>
          <span>{{ standardList[1].name }}</span>
        </p> -->
        <p>
          <span>来源：</span>

          <span>
            {{
              ['期初建账', '集采', '自制', '馈赠', '自购', '调拨', '盘点', '损耗报废', '损坏赔偿'][
                insEquDetailData.source
              ]
            }}
          </span>
        </p>
        <p>
          <span>批次：</span>
          <span>{{ insEquDetailData.bacth }}</span>
        </p>
        <p>
          <span>产地(厂家)：</span>
          <span>{{ insEquDetailData.factory }}</span>
        </p>
        <p>
          <span>单价：</span>
          <span>{{ insEquDetailData.unit_price }}</span>
        </p>
        <p>
          <span>到期时间：</span>
          <span>{{ computedEnd }}</span>
        </p>
        <p>
          <span>负责人：</span>
          <span v-for="(item, index) in insEquDetailData.user" :key="index">{{ item?.user_name }}&nbsp;</span>
        </p>
        <p class="have-width">
          <span>设备照片：</span>
          <el-image
            v-for="(item, index) in insEquDetailData.picture"
            :key="index"
            style="width: 100px; height: 100px; margin-right: 10px"
            :src="item.url_path"
            :preview-src-list="[item.url_path]"
            :initial-index="1"
          ></el-image>
        </p>
      </div>
      <div class="message fr">
        <p class="header">信息</p>
        <p>
          <span>设备状态：</span>
          <span>{{ ['正常', '出借', '维修保养', '报废', '损坏'][insEquDetailData.status - 1] }}</span>
        </p>
        <p>
          <span>实验室二维码：</span>
          <qrcode-vue class="qr-img" :value="insEquDetailData.qr_code || ''" :size="100" level="H" />
        </p>
        <div class="button">
          <img src="@assets/images/laboratory-manage/download.png" alt="" />
          下载
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="equDetailShow = false">返回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

import { getInsEquDetail } from '@service/equ-warehouse/index'
// import { InsEquDetailType } from '@service/equ-warehouse/types'

const props = defineProps({ itemData: { type: Object, required: true }, baseMessage: { type: Object } })

const { itemData, baseMessage } = toRefs(props)

const dataMap = reactive({
  equDetailShow: false,
  insDetailShow: false,

  insEquDetailData: Object(),
  tableData: [
    {
      status: '',
      user: '',
      class: '',
      back_time: ''
    }
  ],
  optionsResponse: [
    {
      label: '张老师',
      value: '张老师'
    },
    {
      label: '李老师',
      value: '李老师'
    },
    {
      label: '王老师',
      value: '王老师'
    }
  ]
})
let { equDetailShow, insDetailShow, insEquDetailData, tableData } = toRefs(dataMap)

const showDetail = (id: number, total: number, number_plies: number) => {
  if (itemData.value.type === 1) {
    insDetailShow.value = true
    getInsEquDetail({
      id,
      type: 1,
      total,
      laboratory_id: baseMessage?.value?.school_laboratory_id,
      store_id: baseMessage?.value?.id,
      number_plies
    }).then((res) => {
      insEquDetailData.value = res.data
      tableData.value = res.data.detail
    })
  } else {
    equDetailShow.value = true
    getInsEquDetail({
      id,
      type: 2,
      total,
      laboratory_id: baseMessage?.value?.school_laboratory_id,
      store_id: baseMessage?.value?.id,
      number_plies
    }).then((res) => {
      insEquDetailData.value = res.data
    })
  }
}

const computedEnd = computed(() => {
  let arr = insEquDetailData.value.create_time?.split('-')
  if (arr) {
    arr[0] = Number(arr[0]) + insEquDetailData.value.number_year
    return arr.join('-')
  }
  return ''
})

const standardList = reactive([
  {
    id: 0,
    name: '全部'
  },
  {
    id: 1,
    name: 'Ⅰ类'
  },
  {
    id: 2,
    name: 'Ⅱ类'
  },
  {
    id: 3,
    name: 'Ⅲ类'
  }
])

const optionCome = reactive([
  {
    value: 1,
    name: '集采'
  },
  {
    value: 2,
    name: '自制'
  },
  {
    value: 3,
    name: '馈赠'
  },
  {
    value: 4,
    name: '自购'
  },
  {
    value: 5,
    name: '调拨'
  }
])
</script>

<style scoped lang="scss">
.equ {
  float: left;
  width: 32%;
  height: 130px;
  border: 1px dotted #b5b5b5;
  & > p {
    margin: 14px 18px;
    display: flex;
    justify-content: space-between;
    height: 26px;
    line-height: 26px;
    font-size: 20px;
    font-weight: bold;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .details {
    margin-top: 30px;
    width: 100%;
    height: 50px;
    img {
      margin: 0 20px;
      float: left;
      width: 50px;
      height: 50px;
    }
    span {
      float: right;
      margin-top: 30px;
      width: 50px;
      height: 20px;
      line-height: 20px;
      color: #05c65d;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }
  }
  :deep(.ei-detail-dialog) {
    margin-top: 60px;
    .el-dialog__body {
      border-top: #05c65d 1px solid;
      box-sizing: border-box;
      overflow: hidden;
      .list {
        width: 60%;
        & > p {
          display: flex;
          // align-items: center;
          width: 100%;
          min-height: 40px;
          text-align: left;
          color: #333;
          & > span:nth-of-type(1) {
            display: inline-block;
            padding-left: 40px;
            width: 120px;
            color: #848484;
            box-sizing: border-box;
          }
          & > span:nth-of-type(2) {
            width: calc(100% - 120px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          // img {
          //   width: 200px;
          //   height: 114px;
          // }
          .icon-square {
            margin-top: -2px;
          }
        }
        & > .have-width {
          line-height: normal;
          overflow: hidden;
          & > span:nth-of-type(1) {
            float: left;
          }
          & > span:nth-of-type(2) {
            display: inline-block;
            line-height: 20px;
            width: 60%;
            min-height: 20px;
          }
        }
      }
      .message {
        margin-right: 6%;
        padding: 20px;
        width: 30%;
        height: 300px;
        background: #f3f3f3;
        box-sizing: border-box;
        .header {
          height: 31px;
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 31px;
          text-align: center;
          color: #05c65d;
        }
        & > p {
          text-align: left;
          color: #333;
          & > span {
            height: 24px;
            line-height: 24px;
          }
          & > span:nth-of-type(1) {
            display: inline-block;
            padding-left: 10px;
            // min-width: 48%;
            color: #848484;
            box-sizing: border-box;
          }
          .qr-img {
            display: block;
            margin: 20px auto;
            background: rgba(0, 0, 0, 0.64);
            opacity: 1;
          }
        }
        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 100px;
          height: 36px;
          background: #05c65d;
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border-radius: 10px;
          img {
            margin: 6px;
          }
        }
      }
    }
  }
  :deep(.detail-dialog) {
    // margin-top: 30px;
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
      .top {
        width: 90%;
        margin-left: 5%;
        height: 200px;
        background-color: rgb(242, 242, 242);
        .nav {
          width: 25%;
          height: 50px;
          line-height: 50px;
          float: left;
          display: flex;
          align-items: center;
          text-align: left;
          & > span:nth-of-type(1) {
            margin-left: 40px;
            width: 80px;
          }
          & > span:nth-of-type(2) {
            width: calc(100% - 120px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .imgArea {
          width: 24%;
          float: right;
          height: 100%;
          .title {
            float: left;
            width: 60%;
            height: 25%;
            display: flex;
            align-items: center;
          }
          img {
            width: 60%;
            float: left;
          }
        }
      }
      .bottom {
        width: 90%;
        margin: 20px 5%;
        .down-text {
          margin-left: 6px;
          color: #05c65d;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
