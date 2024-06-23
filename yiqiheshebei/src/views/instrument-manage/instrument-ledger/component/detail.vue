<template>
  <div>
    <div class="topArea">
      <div class="message">
        <p>
          <span>编号：</span>
          <span class="green">{{ baseMessage.number }}</span>
        </p>
      </div>
      <div class="message">
        <p>
          <span>名称：</span>
          {{ baseMessage.name }}
        </p>
        <p>
          <span>规格：</span>
          {{ baseMessage.specification }}
        </p>
        <p>
          <span>单位：</span>
          {{ baseMessage.unit }}
        </p>
        <p>
          <span>配备标准：</span>
          {{ baseMessage.is_must === 1 ? '必配' : '选配' }}
        </p>
        <p>
          <span>类别：</span>
          {{ getClassify(baseMessage.classify) }}
        </p>
        <!-- <p>
          <span>学科：</span>
          {{ getSubJectName(baseMessage.subject) }}
        </p> -->
      </div>
    </div>
    <div class="tableArea">
      <el-table
        :data="detailList"
        style="width: 100%"
        :header-cell-style="{
          padding: 0,
          borderLeft: '1px solid #05c65d',
          borderBottom: '1px solid #05c65d',
          background: '#EFEFEF',
          color: '#000'
        }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        default-expand-all
      >
        <el-table-column label="时间" prop="create_time" width="160"></el-table-column>
        <el-table-column label="凭证号" prop="voucher_number"></el-table-column>
        <el-table-column label="摘要" prop="">
          <template #default="scope">
            <div>
              <span>
                {{
                  ['期初建账', '集采', '自制', '馈赠', '自购', '调拨', '盘点', '损耗报废', '损坏赔偿'][
                    scope.row.source
                  ] || ''
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产地" prop="factory"></el-table-column>
        <el-table-column label="增加">
          <el-table-column label="单价" prop="">
            <template #default="scope">
              <div>
                {{ scope.row.total >= 0 ? scope.row.unit_price : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="total">
            <template #default="scope">
              <div>
                {{ scope.row.total >= 0 ? scope.row.total : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="">
            <template #default="scope">
              <div>
                {{ scope.row.total >= 0 ? (scope.row.unit_price * scope.row.total).toFixed(2) : '/' }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="减少">
          <el-table-column label="单价" prop="">
            <template #default="scope">
              <div>
                {{ !(scope.row.total >= 0) ? scope.row.unit_price : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="">
            <template #default="scope">
              <div>
                {{ !(scope.row.total >= 0) ? Math.abs(scope.row.total) : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="">
            <template #default="scope">
              <div>
                {{ !(scope.row.total >= 0) ? Math.abs(scope.row.unit_price * scope.row.total).toFixed(2) : '/' }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="结余">
          <!-- <el-table-column label="单价" prop="">
            <template #default="scope">
              <div>
                {{ scope.row.unit_price }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="数量" prop="">
            <template #default="scope">
              <div>
                {{ scope.row.total_now }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="">
            <template #default="scope">
              <div>
                {{ scope.row.unit_price * scope.row.total_now }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作人" prop="user_name"></el-table-column>
      </el-table>
    </div>
    <!-- <div class="pageValue">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        v-model:currentPage="currentPage"
        @current-change="handleCurrentChange"
        :page-size="15"
        :total="50"
      ></el-pagination>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { toRefs, reactive, computed } from 'vue'
import { getDetails } from '@service/instrument-manage/ledger'
import { ListItem, DataList } from '@service/instrument-manage/ledger/types'
// import { useStore } from '@/store'

const props = defineProps({ itemData: { type: Object as () => DataList, required: true } })
let { itemData } = toRefs(props)

// let store = useStore()

// let subjectArr = [...store.state.common.subjectArr]

const dataMap = reactive({
  currentPage: 1,
  baseMessage: {
    classify: [{ title: '' }],
    id: 0,
    is_must: 0,
    name: '',
    number: '',
    specification: '',
    unit: '',
    subject: [{ subject_id: 0 }]
  },
  detailList: Array<ListItem>()
})
let { currentPage, baseMessage, detailList } = toRefs(dataMap)

const getData = (data: { page: number; id: number; subject_id: string | number }) => {
  getDetails(data).then((res) => {
    let arr = Array<ListItem>()
    res.data.list2.forEach((e) => {
      e.source = 0
      arr.push(e)
    })
    detailList.value = res.data.list
      .map((e) => {
        return { ...e, source: e.source === 0 ? -1 : e.source }
      })
      .concat(arr)
    baseMessage.value = res.data.base
  })
}

getData({ page: currentPage.value, id: itemData.value.id, subject_id: itemData.value.subject_id || '' })

// const handleCurrentChange = () => {
//   getData({ page: currentPage.value, id: itemData.value.id })
// }

const getClassify = computed(() => {
  return (arr: any[]) => {
    let returnArr = Array<string>()
    arr.forEach((e) => {
      returnArr.push(e.title)
    })
    return returnArr.join(',')
  }
})

const getSubJectName = computed(() => {
  return (arr: any[]) => {
    let returnArr = Array<string>()
    arr.forEach((e) => {
      returnArr.push(e.subject_name)
    })
    return returnArr.join(',')
  }
})
</script>

<style lang="scss" scoped>
.topArea {
  margin: 10px 0 20px;
  width: 100%;
  // height: 140px;
  line-height: 50px;
  font-size: 16px;
  background: #fff;
  opacity: 1;
  padding: 20px 30px;
  text-align: left;
  box-sizing: border-box;
  .message {
    display: flex;
    flex-wrap: wrap;
    p {
      min-width: 16%;
      span {
        color: #848484;
      }
    }
  }
}
.pageValue {
  float: right;
  text-align: right;
  margin: 20px 0;
}
.green {
  color: #05c65d !important;
}
</style>
