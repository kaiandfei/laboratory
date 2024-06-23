<template>
  <div class="container">
    <!-- <div class="title">用户管理</div> -->
    <ul class="tabs">
      <li
        class="tab_item"
        v-for="item in tablist"
        :key="item.id"
        :class="isActive === item.id ? 'acitive' : ''"
        @click="handleTab(item.id)"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="main">
      <div class="form-box" v-if="isActive === 1">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            账号:
          </span>
          <div class="w-300 fl mr-70">
            <el-input :disabled="true" v-model="detailFromData.login_name" placeholder="请输入教师账号"></el-input>
          </div>
          <span class="w-108 fl">性别:</span>
          <div class="w-300 fl">
            <el-select v-model="detailFromData.sex" class="m-2" placeholder="选择">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            姓名:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="detailFromData.username" placeholder="请输入教师姓名"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            手机号:
          </span>
          <div class="w-300 fl">
            <el-input v-model="detailFromData.phone" placeholder="请输入教师手机号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">学历:</span>
          <div class="w-300 fl mr-70">
            <el-select v-model="detailFromData.educational" class="m-2" placeholder="请选择学历" clearable>
              <el-option
                v-for="item in educationOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <span class="w-108 fl">职称:</span>
          <div class="w-300 fl">
            <el-select v-model="detailFromData.positional" class="m-2" placeholder="请选择职称" clearable>
              <el-option
                v-for="item in titleOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">类型:</span>
          <div class="w-300 fl">
            <el-select v-model="detailFromData.sole_duty" class="m-2" placeholder="请选择类型" clearable>
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校:
          </span>
          <div class="sch-box">
            {{ detailFromData.address }}
          </div>
        </div>

        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            教师角色:
          </span>
          <div @click="checkeditRoleId(4)" class="fl f-align-c mr-20">
            <img :src="detailFromData.role_ids.indexOf(4) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <span>教师</span>
          </div>
          <div @click="checkeditRoleId(3)" class="fl f-align-c mr-20">
            <img :src="detailFromData.role_ids.indexOf(3) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <span>备课组长</span>
          </div>
          <div @click="checkeditRoleId(2)" class="fl f-align-c mr-20">
            <img
              :src="
                detailFromData.role_ids.indexOf(2) !== -1 && detailFromData.role_ids.indexOf(5) === -1 ? selOn : selOff
              "
              alt=""
              class="mr-18"
            />
            <span>实验室管理员</span>
          </div>
          <div @click="checkeditRoleId(5)" class="fl f-align-c mr-20">
            <img
              :src="
                detailFromData.role_ids.indexOf(5) !== -1 && detailFromData.role_ids.indexOf(2) === -1 ? selOn : selOff
              "
              alt=""
              class="mr-18"
            />
            <span>实验室总管理员</span>
          </div>
          <div @click="checkeditRoleId(1)" class="fl f-align-c">
            <img :src="detailFromData.role_ids.indexOf(1) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <span>学校管理员</span>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">涉及学段:</span>
          <div
            v-if="
              detailFromData.school_type_id == 1 ||
              detailFromData.school_type_id == 6 ||
              detailFromData.school_type_id == 7
            "
            @click="checkeditPhaseStudyId('1')"
            class="fl f-align-c mr-20"
          >
            <img :src="detailFromData.phase_study_id.indexOf('1') !== -1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>小学</span>
          </div>
          <div
            v-if="
              detailFromData.school_type_id == 2 ||
              detailFromData.school_type_id == 4 ||
              detailFromData.school_type_id == 6 ||
              detailFromData.school_type_id == 7
            "
            @click="checkeditPhaseStudyId('2')"
            class="fl f-align-c mr-20"
          >
            <img :src="detailFromData.phase_study_id.indexOf('2') !== -1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>初中</span>
          </div>
          <div
            v-if="
              detailFromData.school_type_id == 3 ||
              detailFromData.school_type_id == 4 ||
              detailFromData.school_type_id == 5 ||
              detailFromData.school_type_id == 7
            "
            @click="checkeditPhaseStudyId('3')"
            class="fl f-align-c mr-20"
          >
            <img :src="detailFromData.phase_study_id.indexOf('3') !== -1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>高中</span>
          </div>
        </div>
        <div
          class="mb-20"
          v-if="
            detailFromData.role_ids.indexOf(4) !== -1 ||
            detailFromData.role_ids.indexOf(3) !== -1 ||
            detailFromData.role_ids.indexOf(2) !== -1
          "
        >
          <span class="w-108 fl">
            <!-- <span class="font-red">*</span> -->
            执教学科:
          </span>
          <div
            @click="subjectChange(1)"
            class="fl f-align-c mr-20"
            v-if="detailFromData.phase_study_id.includes('2') || detailFromData.phase_study_id.includes('3')"
          >
            <img :src="detailFromData.subject_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>物理</span>
          </div>
          <div
            @click="subjectChange(2)"
            class="fl f-align-c mr-20"
            v-if="detailFromData.phase_study_id.includes('2') || detailFromData.phase_study_id.includes('3')"
          >
            <img :src="detailFromData.subject_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>化学</span>
          </div>
          <div
            @click="subjectChange(3)"
            class="fl f-align-c mr-20"
            v-if="detailFromData.phase_study_id.includes('2') || detailFromData.phase_study_id.includes('3')"
          >
            <img :src="detailFromData.subject_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>生物</span>
          </div>
          <div @click="subjectChange(4)" class="fl f-align-c mr-20" v-if="detailFromData.phase_study_id.includes('1')">
            <img :src="detailFromData.subject_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>小学科学</span>
          </div>
        </div>
        <div class="mb-20" v-show="detailFromData.role_ids.indexOf(4) !== -1">
          <span class="w-108 fl">执教班级:</span>
          <div class="fr school-class" v-if="allClass.length !== 0">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in computedEditGrade" :key="index" :label="item.name">
                <el-check-tag
                  v-for="(item1, index1) in item.schoolClass"
                  :key="index1"
                  :checked="item1.is_true"
                  @change="item1.is_true = !item1.is_true"
                >
                  {{ item1.name }}
                </el-check-tag>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="mb-20" v-show="detailFromData.role_ids.indexOf(3) !== -1">
          <span class="w-108 fl">备课年级:</span>
          <div class="fr school-class">
            <el-check-tag
              v-for="(item, index) in detailFromData.schoolGrade"
              :key="index"
              :checked="item.is_true"
              @change="item.is_true = !item.is_true"
            >
              {{ item.name }}
            </el-check-tag>
          </div>
        </div>
        <div style="height: 40px">
          <div class="fr btn green-btn ml-60" @click="editSave">保存</div>
          <div class="fr btn white-btn ml-60" @click="back">取消</div>
        </div>
      </div>
      <div v-if="isActive === 2">
        <ElectronicInfo @back="back" :detailFrom="detailFrom" />
      </div>
      <div v-if="isActive === 3">
        <PasswordManage @back="back" :detailFrom="detailFrom" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { saveSchoolAccount } from '@service/account/index'
import { ref, reactive, computed, defineProps, defineEmits } from 'vue'
import ElectronicInfo from './electronic-info/index.vue'
import PasswordManage from './password-manage/index.vue'
import { ElMessage } from 'element-plus'
const props = defineProps({
  detailFrom: {
    type: Object,
    default: () => ({})
  }
})
const detailFromData = reactive(props.detailFrom)
if (detailFromData.educational === 0) {
  detailFromData.educational = ''
}
if (detailFromData.positional === 0) {
  detailFromData.positional = ''
}
if (detailFromData.sole_duty === 0) {
  detailFromData.sole_duty = ''
}

const $emit = defineEmits(['checkeditRoleId', 'checkeditPhaseStudyId', 'subjectChange', 'toggle', 'getList'])

const selOn = require('@images/common/sel-on.png')
const selOff = require('@images/common/sel-off.png')
const selOffG = require('@images/common/gray-ring.png')
const selOnG = require('@images/common/green-ring.png')
const isActive = ref(1)
const tablist = reactive([
  {
    label: '基本信息',
    id: 1
  },
  {
    label: '电子信息',
    id: 2
  },
  {
    label: '密码管理',
    id: 3
  }
])
const handleTab = (_val: number) => {
  isActive.value = _val
}
const allClass = ref([{ title: '暂无', list: [{ name: '1班', status: false }] }])
const period = ref([false, false, false])
const allGrade = ref([{ title: '暂无', is_true: false }])
const educationOption = ref([
  {
    label: '中专',
    value: 1
  },
  {
    label: '大专',
    value: 2
  },
  {
    label: '本科',
    value: 3
  },
  {
    label: '研究生',
    value: 4
  },
  {
    label: '其他',
    value: 5
  }
])
const titleOption = ref([
  {
    label: '初级',
    value: 1
  },
  {
    label: '中级',
    value: 2
  },
  {
    label: '高级',
    value: 3
  }
])
const typeOption = ref([
  {
    label: '专职',
    value: 1
  },
  {
    label: '兼职',
    value: 2
  }
])
const schoolClass1 = [
  {
    title: '一年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '二年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '三年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '四年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '五年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '六年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  }
]
const schoolClass2 = [
  {
    title: '七年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '八年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '九年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  }
]
const schoolClass3 = [
  {
    title: '高一',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '高二',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '高三',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  }
]
const schoolGrade1 = [
  {
    title: '一年级',
    status: false
  },
  {
    title: '二年级',
    status: false
  },
  {
    title: '三年级',
    status: false
  },
  {
    title: '四年级',
    status: false
  },
  {
    title: '五年级',
    status: false
  },
  {
    title: '六年级',
    status: false
  }
]
const schoolGrade2 = [
  {
    title: '七年级',
    status: false
  },
  {
    title: '八年级',
    status: false
  },
  {
    title: '九年级',
    status: false
  }
]
const schoolGrade3 = [
  {
    title: '高一',
    status: false
  },
  {
    title: '高二',
    status: false
  },
  {
    title: '高三',
    status: false
  }
]
const allClassScreen = (value: number) => {
  period.value[value] = !period.value[value]
  let arr: any
  let arr1: any
  arr = []
  arr1 = []
  if (period.value[0]) {
    arr = [...arr, ...schoolClass1]
    arr1 = [...arr1, ...schoolGrade1]
  }
  if (period.value[1]) {
    arr = [...arr, ...schoolClass2]
    arr1 = [...arr1, ...schoolGrade2]
  }
  if (period.value[2]) {
    arr = [...arr, ...schoolClass3]
    arr1 = [...arr1, ...schoolGrade3]
  }

  allClass.value = JSON.parse(JSON.stringify(arr))
  allGrade.value = JSON.parse(JSON.stringify(arr1))
}
allClassScreen(0)
//教师角色点击事件
const checkeditRoleId = (id: number) => {
  $emit('checkeditRoleId', id)
}
const computedEditGrade = computed(() => {
  let arr = []

  if (detailFromData.phase_study_id.indexOf('1') !== -1) {
    arr.push(...detailFromData.schoolGrade.filter((item: any) => item.xu < 7))
  }
  if (detailFromData.phase_study_id.indexOf('2') !== -1) {
    arr.push(...detailFromData.schoolGrade.filter((item: any) => item.xu < 10 && item.xu > 6))
  }
  if (detailFromData.phase_study_id.indexOf('3') !== -1) {
    arr.push(...detailFromData.schoolGrade.filter((item: any) => item.xu < 13 && item.xu > 9))
  }

  return arr
  // return []
})
//涉及学段点击事件
const checkeditPhaseStudyId = (id: string) => {
  $emit('checkeditPhaseStudyId', id)
  $emit('subjectChange', '')
}
const subjectChange = (_val: number) => {
  $emit('subjectChange', _val)
}
const back = (): void => {
  $emit('toggle')
  $emit('getList')
}
const editSave = () => {
  saveSchoolAccount(detailFromData).then((res) => {
    if (res.code === 10) {
      $emit('toggle')
      $emit('getList')
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    text-align: left;
    margin-bottom: 20px;
  }

  .tabs {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    height: 50px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

    .tab_item {
      width: 34%;
      height: 100%;
      line-height: 50px;
      cursor: pointer;

      &.acitive {
        color: #05c65d;
        background-color: #dcece3;
      }
    }

    .tab_item:not(:last-child) {
      border-right: 2px solid rgba(0, 0, 0, 0.16);
    }
  }

  .main {
    background-color: #fff;
    padding: 20px;

    .form-box {
      width: 886px;

      & > div:not(:last-child) {
        min-height: 30px;
        line-height: 30px;
        text-align: left;
        overflow: hidden;

        & > span {
          height: 100%;
        }
      }

      .school-class {
        width: 778px;
      }
    }
  }
}
</style>
