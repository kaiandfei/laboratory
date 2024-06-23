<template>
  <div>
    <PopCurrency :popShow="isShow" @close="close">
      <template v-slot:header>
        <p>采购明细</p>
      </template>
      <template v-slot:main>
        <div class="form-box">
          <p class="f_title">
            <span></span>
            采购信息
          </p>
          <div class="from_box">
            <p class="comm_p">
              <span class="tit">申请人:</span>
              <span>{{ itemData.applicant }}</span>
            </p>
            <p class="comm_p">
              <span class="tit">申请时间:</span>
              <span>{{ itemData.apply_time }}</span>
            </p>
            <p class="comm_p">
              <span class="tit">采购批次:</span>
              <span>{{ itemData.no }}</span>
            </p>
            <p class="comm_p">
              <span class="tit">申请明细:</span>
              <span class="point green-text" @click="tableShow = !tableShow">
                查看明细
                <el-icon v-show="!tableShow"><arrow-down-bold /></el-icon>
                <el-icon v-show="tableShow"><arrow-up-bold /></el-icon>
              </span>
              <span>
                {{ '本次采购危化品共' + itemData.item_count + '种,参考总价为' + itemData.total_price + '元' }}
              </span>
            </p>
            <table v-show="tableShow">
              <tr>
                <th>危化品名称</th>
                <th>规格属性</th>
                <th>存量</th>
                <th>单位</th>
                <th>品牌</th>
                <th>采购数量</th>
                <th>单价</th>
                <th>总价</th>
              </tr>

              <tr v-for="(item, index) in itemData.item_list" :key="index">
                <td :title="item.chemical_type_name">{{ item.chemical_type_name }}</td>
                <td :title="item.chemical_type_standards">{{ item.chemical_type_standards }}</td>
                <td>{{ item.amount }}</td>
                <td :title="item.chemical_type_unit">{{ item.chemical_type_unit }}</td>
                <td :title="item.manufacturer">{{ item.manufacturer }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.unit_price }}</td>
                <td>{{ item.unit_price * item.amount }}</td>
              </tr>
            </table>
          </div>
          <p class="f_title">
            <span></span>
            采购审核
          </p>
          <div class="from_box">
            <p class="comm_p">
              <span class="tit">审核时间:</span>
              <span>{{ itemData.apply_time }}</span>
            </p>
            <p class="comm_p">
              <span class="tit">申请结果:</span>
              <span>{{ itemData.review_status }}</span>
            </p>
            <p class="comm_p">
              <span class="tit">审核意见:</span>
              <span>{{ itemData.extra }}</span>
            </p>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <!-- <div class="fr btn green-btn ml-60" @click="save">保存</div> -->
          <div class="fr btn white-btn ml-60" @click="close">关闭</div>
        </div>
      </template>
    </PopCurrency>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineExpose } from 'vue'

import { getStoreNumDetail } from '@service/dataAnalysisApi'
import { PopCurrency } from '@components/pop-currency'
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons'

const isShow = ref(false)
const tableShow = ref(false)
const close = () => {
  isShow.value = false
  tableShow.value = false
}
// interface DataProps {
//   id: string | number
// }
// const props = withDefaults(defineProps<DataProps>(), {
//   id: ''
// })
// watch(
//   () => props.id,
//   (newValue) => {
//     console.log(newValue)
//     // getPurchasedetail({ id: newValue }).then((res) => {
//     //   console.log(res)
//     //   if (res.code === 10) {
//     //     isShow.value = true
//     //   }
//     // })
//     // isShow.value = true
//   }
// )
const itemData: any = ref({})
// 获取详情
const getDetail = (id: number | string) => {
  fromData.id = id
  fromData.review_status = 1
  fromData.extra = ''
  getStoreNumDetail({ school_laboratory_id: id }).then((res) => {
    console.log(res)
    if (res.code === 10) {
      itemData.value = res.data
      isShow.value = true
    }
  })
}
// 向外暴露方法
defineExpose({ getDetail })
const fromData: any = reactive({
  id: '',
  review_status: 1,
  extra: ''
})
// const emit = defineEmits(['saveSuccess'])
// const save = () => {
//   pullExamine(fromData).then((res) => {
//     console.log(res)
//     if (res.code === 10) {
//       emit('saveSuccess', '1')
//       close()
//     }
//   })
// }
</script>

<style scoped lang="scss">
.f_title {
  height: 38px;
  line-height: 38px;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  span {
    float: left;
    margin-right: 10px;
    width: 6px;
    height: 100%;
    background-color: #05c65d;
  }
}
.from_box {
  margin: 20px 0;
  padding: 28px;
  width: 9rem;
  box-sizing: border-box;
  background-color: rgba(220, 236, 227, 0.39);
  .comm_p {
    text-align: left;
    margin-bottom: 20px;
    height: 20px;
    line-height: 20px;

    .tit {
      float: left;
      width: 90px;
    }
    .el-radio {
      height: 20px;
      line-height: 20px;
    }
    .el-textarea {
      float: right;
      width: calc(100% - 90px);
    }
  }
}
table {
  width: 100%;
  tr {
    display: flex;
    background-color: #fff;
    th {
      flex: 1;
      height: 34px;
      line-height: 34px;
      border-bottom: 1px solid #05c65d;
      text-align: center;
    }
    td {
      flex: 1;
      height: 20px;
      line-height: 24px;
      overflow: hidden;
      /* 单行显示 */
      white-space: nowrap;
      /* 溢出显示省略号 */
      text-overflow: ellipsis;
    }
  }
}
</style>
