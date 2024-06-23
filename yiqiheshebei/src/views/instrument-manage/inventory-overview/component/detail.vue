<template>
  <div>
    <el-dialog custom-class="detail-dialog" v-model="detailState" :show-close="false" title="查看详情" width="50%">
      <div class="top">
        <div class="nav">
          分类编号：
          <span>{{ detailList.number }}</span>
        </div>
        <div class="nav">
          名称：
          <span>{{ detailList.name }}</span>
        </div>
        <div class="nav">
          规格型号：
          <span>{{ detailList.specification }}</span>
        </div>
        <div class="imgArea">
          <div class="title">仪器图片：</div>
          <div v-for="(item, index) in detailList.picture" :key="index">
            <img :src="item.url_path" />
          </div>
        </div>
        <div class="nav">
          学校编号：
          <span>{{ detailList.asset_number }}</span>
        </div>
        <div class="nav">
          类型：
          <span>{{ detailList.cost_type === 1 ? '低值易耗' : '非低值易耗' }}</span>
        </div>
        <div class="nav">
          实验类型：
          <span>{{ detailList.is_group === 1 ? '分组' : detailList.is_group === 2 ? '演示' : '分组/演示' }}</span>
        </div>
        <div class="nav">
          配备类型：
          <span>{{ detailList.is_must === 1 ? '必配' : '选配' }}</span>
        </div>
        <div class="nav">
          仪器描述：
          <span :title="detailList.info">{{ detailList.info }}</span>
        </div>
        <div class="nav">
          仪器标准：
          <span>{{ detailList.norm }}</span>
        </div>
        <div class="nav">
          使用年限：
          <span>{{ detailList.number_year + '年' }}</span>
        </div>
        <div class="nav">
          总库存：
          <span>{{ Number(detailList.total) + Number(detailList.lend_num) + Number(detailList.maintenance_num) }}</span>
        </div>
      </div>
      <div class="middle">
        <el-table
          :data="detailList.sourceList"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        >
          <el-table-column label="来源" prop="source">
            <template #default="scope">
              <div>
                {{
                  ['期初建账', '集采', '自制', '馈赠', '自购', '调拨', '盘点', '损耗报废', '损坏赔偿'][
                    scope.row.source
                  ] || ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="凭证号" prop="voucher_number"></el-table-column>
          <el-table-column label="入库批次" prop="wholesale_purchase"></el-table-column>
          <el-table-column label="产地(厂家)" prop="factory"></el-table-column>
          <el-table-column label="数量" prop="total"></el-table-column>
          <!-- <el-table-column label="二维码" prop="qr_code">
            <template #default="scope">
              <div :id="'qrCode' + scope.$index" style="float: left">
                <qrcode-vue class="qr-img" :value="scope.row.qr_code ? 'scope.row.qr_code' : ''" :size="50" level="H" />
              </div>
              <div style="color: green; float: right; cursor: pointer" @click="downLoad(scope.$index)">
                <a href="" :id="'qrCode' + scope.$index + 'downLoad'"></a>
                下载
              </div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="bottom">
        <el-table
          :data="detailList.locationList"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        >
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="仪器库" prop="school_laboratory_name">
            <template #default="scope">
              <span v-show="scope.row.school_laboratory_name">{{ scope.row.school_laboratory_name }}</span>
              <span v-show="!scope.row.school_laboratory_name">{{ '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="仪器柜" prop="store_name">
            <template #default="scope">
              <span v-show="scope.row.store_name">{{ scope.row.store_name }}</span>
              <span v-show="!scope.row.store_name">{{ '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="层数" prop="number_plies">
            <template #default="scope">
              <span v-show="scope.row.number_plies">{{ '第' + scope.row.number_plies + '层' }}</span>
              <span v-show="!scope.row.number_plies">{{ '/' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="total"></el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="buttonArea">
          <el-button @click="back" type="primary">{{ '返回' }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, watch } from 'vue'
// import QrcodeVue from 'qrcode.vue'
import { getDetailList } from '@/service/instrument-manage/equ-manage/index'
import { detailData } from '@/service/instrument-manage/equ-manage/types'

let props = defineProps({ detailShow: Boolean, detailListId: { type: Number, required: true } })
let { detailShow, detailListId } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)

detailState.value = detailShow.value
watch(detailState, (val) => {
  if (val === false) {
    emit('back')
  }
})
const dataMap = reactive({
  detailList: detailData
})

let { detailList } = toRefs(dataMap)

console.log(detailListId.value, '详情ID')

getDetailList({ id: detailListId.value }).then((res: any) => {
  detailList.value = res.data
})

// const downLoad = (index: number) => {
//   let canvas = document.getElementById('qrCode' + index)?.getElementsByTagName('canvas')[0]
//   let url = canvas?.toDataURL('image/png')
//   let downloadLink = document.getElementById('qrCode' + index + 'downLoad')
//   downloadLink?.setAttribute('href', url || '')
//   downloadLink?.setAttribute('download', '二维码.png')
//   downloadLink?.click()
// }
const back = () => {
  detailState.value = false
}
</script>
<style lang="scss" scoped>
:deep(.detail-dialog) {
  margin-top: 50px;
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
      padding: 0 10px;
      height: 200px;
      float: left;
      background-color: rgb(242, 242, 242);
      margin-bottom: 20px;
      box-sizing: border-box;
      .nav {
        display: flex;
        // justify-content: center;
        align-items: center;
        width: 25%;
        height: 25%;
        float: left;
        font-weight: 600;
        & > span {
          max-width: 120px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-weight: 400;
        }
      }
      .imgArea {
        width: 24%;
        float: right;
        height: 100%;
        // border: 1px solid red;
        .title {
          float: left;
          width: 60%;
          height: 25%;
          display: flex;
          align-items: center;
        }
        img {
          width: 80px;
          height: 80px;
          float: left;
          margin-left: 10px;
        }
      }
    }
    .middle {
      width: 90%;
      margin-left: 5%;
      margin-bottom: 20px;
    }
    .bottom {
      width: 90%;
      margin-left: 5%;
      margin-bottom: 20px;
    }
    .buttonArea {
      width: 10%;
      float: right;
      border: 1px solid green;
    }
  }
}
</style>
