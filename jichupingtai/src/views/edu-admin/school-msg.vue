<template>
  <header>
    <span>教务管理 > 学校基本信息</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>学校基本信息</span>
        <div class="button-box">
          <div v-show="!editShow" class="btn white-btn" @click="rePassword">
            <img src="@assets/images/laboratory/laboratory-standard/edit.png" alt="" />
            编辑
          </div>
          <div v-show="editShow" class="btn white-btn" @click="saveData">
            <img src="@assets/images/laboratory/laboratory-standard/save.png" alt="" />
            保存
          </div>
        </div>
      </div>
    </div>
    <div class="msg_box">
      <div>
        <div class="item">
          <span>学校名称：</span>
          <span v-show="!editShow">{{ schoolData?.name }}</span>
          <div class="w-180" v-show="editShow">
            <el-input v-model="schoolData.name"></el-input>
          </div>
        </div>
        <div class="item">
          <span>学校代码：</span>
          <span>{{ schoolData?.code }}</span>
          <!-- <div class="w-180" v-show="editShow">
            <el-input v-model="schoolData.code"></el-input>
          </div> -->
        </div>
        <div class="item">
          <span>学校地址：</span>
          <span v-show="!editShow">{{ schoolData?.address }}</span>
          <div class="w-180" v-show="editShow">
            <el-input v-model="schoolData.address"></el-input>
          </div>
        </div>
        <div class="item">
          <span>使用期限：</span>
          <span>
            {{
              (schoolData?.use_start_time ? schoolData?.use_start_time : '-') +
              '-' +
              (schoolData?.use_end_time ? schoolData?.use_end_time : '-')
            }}
          </span>
        </div>
        <div class="item">
          <span>学校星级：</span>
          <span>
            {{ ['5星级', '4星级', '3星级'][schoolData.level - 1] }}
          </span>
        </div>
      </div>
      <div>
        <div class="item">
          <span>学校类别：</span>
          <span>
            {{
              ['小学', '初中', '高中', '完全中学', '职业高中', '九年一贯制学校', '十二年一贯制学校', '暂无'][
                schoolData.school_type_id - 1
              ]
            }}
          </span>
        </div>
        <div class="item height-flex">
          <span class="fl">学校学制：</span>
          <div class="item-c">
            <div v-for="(item, index) in schoolData.schoolPhase" :key="index">
              <span class="fl">
                {{
                  ['小学', '初中', '高中', '完全中学', '职业高中', '九年一贯制学校', '十二年一贯制学校', '暂无'][
                    item.phase_study_id - 1
                  ] + '阶段 '
                }}
              </span>
              <span class="fl mra" v-show="!editShow">{{ item.len + ' ' }}</span>
              <div class="w-108 fl mra" v-show="editShow">
                <el-input v-show="editShow" v-model="item.len"></el-input>
              </div>
              <span class="fl mr-20">年</span>
            </div>
          </div>
        </div>
        <div class="item height-flex">
          <span class="fl">学校轨数：</span>
          <div class="item-c">
            <div v-for="(item, index) in schoolData.schoolPhase" :key="index">
              <span class="fl">
                {{
                  ['小学', '初中', '高中', '完全中学', '职业高中', '九年一贯制学校', '十二年一贯制学校', '暂无'][
                    item.phase_study_id - 1
                  ] + '阶段 '
                }}
              </span>
              <span class="fl mra" v-show="!editShow">{{ item.gui + ' ' }}</span>
              <div class="w-108 fl mra" v-show="editShow">
                <el-input v-show="editShow" v-model="item.gui"></el-input>
              </div>
              <span class="fl mr-20">轨</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="item">
          <span class="logo">学校logo：</span>
          <!-- <el-upload
            v-show="editShow"
            class="avatar-uploader"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="fileData"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept=".jpg,.png,.jpeg"
          >
            <img v-if="schoolData.logo" :src="schoolData.logo" class="avatar" />
          </el-upload> -->
          <img v-show="schoolData.logo !== ''" :src="schoolData.logo" alt="" />
          <span v-show="schoolData.logo === ''">暂无</span>
        </div>
      </div>
    </div>
  </main>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>编辑学校</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校名称:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="schoolFrom.name" placeholder="请输入学校名称"></el-input>
          </div>
          <span class="w-108 fl">学校代码:</span>
          <div class="w-300 fl">
            <span>{{ schoolFrom.code }}</span>
            <!-- <el-input v-model="schoolFrom.code" placeholder="请输入学校账号"></el-input> -->
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">学校类别:</span>
          <div class="sel-school">
            <span>
              {{
                ['普通小学', '普通初中', '普通高中', '完全中学', '职业高中', '九年一贯制学校', '十二年一贯制学校'][
                  schoolFrom.school_type_id - 1
                ]
              }}
            </span>
            <!-- <div @click="chanege_school(1)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>普通小学</span>
            </div>
            <div @click="chanege_school(2)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>普通初中</span>
            </div>
            <div @click="chanege_school(3)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>普通高中</span>
            </div>
            <div @click="chanege_school(4)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>完全中学</span>
            </div>
            <div @click="chanege_school(5)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 5 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>职业高中</span>
            </div>
            <div @click="chanege_school(6)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 6 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>九年一贯制学校</span>
            </div>
            <div @click="chanege_school(7)" class="fl f-align-c">
              <img :src="schoolFrom.school_type_id === 7 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>十二年一贯制学校</span>
            </div> -->
          </div>
        </div>
        <!-- <div
          class="mb-20"
          v-show="schoolFrom.school_type_id == 4 || schoolFrom.school_type_id == 6 || schoolFrom.school_type_id == 7"
        >
          <span class="w-108 fl">
            <span class="font-red">*</span>
            统一管理:
          </span>
          <div class="sch-box">
            <div class="w-180">
              <el-select v-model="schoolFrom.is_management" class="m-2" placeholder="选择学校所在省份">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
              </el-select>
            </div>
          </div>
        </div> -->
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学制管理:
          </span>
          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom.phase_studyArr" :key="index1">
              <span>{{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:</span>
              <div class="w-180">
                <el-select v-model="item1.len" class="m-2" placeholder="请输入学制">
                  <el-option
                    v-for="item in optionsx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校轨数:
          </span>
          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom.phase_studyArr" :key="index1">
              <span>{{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:</span>
              <div class="w-180">
                <el-input v-model="item1.gui" placeholder="请输入具体轨数"></el-input>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校logo:
          </span>
          <el-upload
            class="avatar-uploader"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="fileData"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept=".jpg,.png,.jpeg"
          >
            <img v-if="schoolFrom.logo" :src="schoolFrom.logo" class="avatar" />
            <el-icon v-if="!schoolFrom.logo" class="avatar-uploader-icon"><Plus /></el-icon>
            <span v-if="schoolFrom.logo">点击切换</span>
          </el-upload>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校地址:
          </span>
          <div class="sch-box">
            <span>省:</span>
            <div class="w-180">
              <el-select v-model="schoolFrom.pro" class="m-2" placeholder="选择学校所在省份" @change="areaChange5">
                <el-option v-for="item in options5" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>市:</span>
            <div class="w-180">
              <el-select
                v-model="schoolFrom.city"
                class="m-2"
                placeholder="选择学校所在城市"
                @change="areaChange6"
                :disabled="schoolFrom.pro === null"
              >
                <el-option v-for="item in options6" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>区:</span>
            <div class="w-180">
              <el-select
                v-model="schoolFrom.area"
                class="m-2"
                @change="areaChange7"
                placeholder="选择学校所在区域"
                :disabled="schoolFrom.city === null"
              >
                <el-option v-for="item in options7" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl"></span>
          <div class="sel-school">
            <el-input v-model="schoolFrom.address" placeholder="请输入具体地址"></el-input>
          </div>
        </div>
        <div class="mb-20 star-flex">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校星级:
          </span>
          <div class="w-300">
            <el-select v-model="schoolFrom.level" class="m-2" placeholder="请选择学校星级">
              <el-option v-for="item in starOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save(schoolFrom)">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { BASE_URL } from '@service/request/config'
import { findArea } from '@service/area/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useStore } from '@store/index'
import { getSchoolPageData, delSchool, saveSchool, updataStatus } from '@service/school-manage/index'
import { getSchoolM, editSchoolM, upFile } from '@/service/term'
import localCache from '@/utils/localCache'
import { Plus } from '@element-plus/icons-vue'
import { PopCurrency } from '@components/pop-currency'
const selOffG = require('@images/common/gray-ring.png')
const selOnG = require('@images/common/green-ring.png')
const popState = ref(false)
const optionsx = [
  {
    value: 1,
    label: '一年'
  },
  {
    value: 2,
    label: '二年'
  },
  {
    value: 3,
    label: '三年'
  },
  {
    value: 4,
    label: '四年'
  },
  {
    value: 5,
    label: '五年'
  },
  {
    value: 6,
    label: '六年'
  },
  {
    value: 7,
    label: '七年'
  }
]

let schoolFrom: any = reactive({
  id: null, // 学校id
  name: null, // 学校名称
  code: null, // 学校code
  phase_study_id: null, // 学段id
  hase_study: null,
  school_type_id: 1, // 学校类别
  phase_studyArr: [{ phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 }],
  school_teacher_seniority: [],
  leng: 3,
  logo: '',
  address: null, // 详细地址
  use_start_time: null, // 开始时间
  use_end_time: null, // 结束时间
  pro: null, // 省编号
  city: null, // 市
  area: null, // 区
  is_del: 0,
  is_city: null,
  is_management: 1,
  level: ''
})
const options5: any = ref([])
const options6: any = ref([])
const options7: any = ref([])
const areaChange5 = () => {
  options6.value = []
  options7.value = []
  schoolFrom.city = ''
  schoolFrom.area = ''
  getFindArea(2, schoolFrom.pro, 6)
}
const areaChange6 = () => {
  options7.value = []
  schoolFrom.area = ''
  getFindArea(3, schoolFrom.city, 7)
}
const areaChange7 = () => {
  console.log('')
}
const getFindArea = (val: number, id: any, sel: any) => {
  findArea({ area_level: val, p_id: id }).then((res: any) => {
    console.log(res)
    if (sel === 1) {
      options5.value = res.data
    } else if (sel === 5) {
      options5.value = res.data
    } else if (sel === 6) {
      options6.value = res.data
    } else if (sel === 7) {
      options7.value = res.data
    }
  })
}
getFindArea(1, 0, 1)
const chanege_school = (val: any) => {
  schoolFrom.school_type_id = val
  schoolFrom.phase_studyArr = []
  if (val == 1) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 2) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 3) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 4) {
    schoolFrom.phase_studyArr = [
      { phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }
    ]
  }
  if (val == 5) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 6) {
    schoolFrom.phase_studyArr = [
      { phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 }
    ]
  }
  if (val == 7) {
    schoolFrom.phase_studyArr = [
      { phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }
    ]
  }
}
const save = (data: any) => {
  saveSchool(data).then((res) => {
    if (res.code === 10) {
      getdata()
      popState.value = false
      ElMessage({
        type: 'success',
        message: '保存成功!'
      })
    } else {
      ElMessage({
        message: '添加失败!请检查输入内容!',
        type: 'error'
      })
    }
  })
}
const rePassword = () => {
  let nodeData = JSON.parse(JSON.stringify(schoolData.value))
  schoolFrom.address = nodeData.address
  schoolFrom.area = nodeData.area
  schoolFrom.code = nodeData.code
  schoolFrom.city = nodeData.city
  schoolFrom.create_time = nodeData.create_time
  schoolFrom.id = nodeData.id
  schoolFrom.phase_studyArr = nodeData.schoolPhase
  schoolFrom.is_management = 1
  schoolFrom.is_city = nodeData.is_city
  schoolFrom.is_del = nodeData.is_del
  schoolFrom.is_open = nodeData.is_open
  schoolFrom.len = nodeData.len
  schoolFrom.logo = nodeData.logo
  schoolFrom.name = nodeData.name
  schoolFrom.phase_study_id = nodeData.phase_study_id
  schoolFrom.pro = nodeData.pro
  schoolFrom.school_type_id = nodeData.school_type_id
  schoolFrom.use_end_time = nodeData.use_end_time
  schoolFrom.use_start_time = nodeData.use_start_time
  schoolFrom.userCount = nodeData.userCount
  schoolFrom.school_teacher_seniority = []
  schoolFrom.level = nodeData.level
  getFindArea(1, 0, 5)
  getFindArea(2, schoolFrom.pro, 6)
  getFindArea(3, schoolFrom.city, 7)
  popState.value = true
}
const store: any = useStore()
// 文件上传
// const store = useStore()
const fileData = reactive({
  token: localCache.getCookie('swr_token')
})
const editShow = ref(false)
let schoolId = store.state.login.userInfo.school_id
const schoolData: any = ref({
  name: '',
  code: '',
  address: '',
  use_start_time: '',
  use_end_time: '',
  school_type_id: 8,
  logo: ''
})
const getdata = () => {
  getSchoolM({ id: schoolId }).then((res) => {
    schoolData.value = res.data[0]
    console.log(schoolData.value)
  })
}
getdata()
const saveData = () => {
  let item: any = {}
  item.id = schoolData.value.id
  item.name = schoolData.value.name
  item.code = schoolData.value.code
  item.logo = schoolData.value.logo
  item.address = schoolData.value.address
  // item.phase_studyArr = schoolData.value.schoolPhase
  editSchoolM(item).then((res) => {
    if (res.code === 10) {
      editShow.value = false
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
      getdata()
    }
  })
}
const handleAvatarSuccess: any = (response: any, uploadFile: { raw: Blob | MediaSource }) => {
  console.log(response)
  schoolData.value.logo = response.data.file_url
  schoolFrom.logo = response.data.file_url
  // schoolData.value.logo = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: any = (rawFile: any) => {
  console.log(rawFile)
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const starOptions = ref([
  {
    label: '5星级',
    id: 1
  },
  {
    label: '4星级',
    id: 2
  },
  {
    label: '3星级',
    id: 3
  }
])
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
main {
  width: 100%;
  .sel-box {
    width: 100%;
    height: 60px;
    .operation {
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      & > span {
        float: left;
        margin-left: 1.8%;
        font-size: 20px;
        color: #05c65d;
        font-weight: bold;
      }
      .button-box {
        display: flex;
        justify-content: space-between;
        div {
          margin-right: 20px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          img {
            margin-right: 4px;
            width: 20px;
            height: 20px;
          }
        }
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
        float: left;
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
  }
  .msg_box {
    display: flex;
    width: 100%;
    padding: 40px 80px;
    background-color: #fff;
    box-sizing: border-box;
    .item-c {
      height: 100%;
    }
    & > div {
      flex: 1;
    }
    .item {
      text-align: left;
      line-height: 40px;
      & > :nth-child(1) {
        color: #848484;
      }
      & :nth-child(2) {
        display: inline-block;
        // width: 70%;
        color: #333;
      }
      & > div {
        display: inline-block;
      }
      .logo {
        float: left;
      }
      img {
        display: inline-block;
        width: 120px;
        height: 120px;
      }
    }
  }
}
.avatar-uploader {
  width: 180px;
  height: 180px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader ::v-deep .el-upload__input {
  width: 0;
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.mra {
  margin: 0 8px;
}
.form-box {
  width: 886px;

  & > div {
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

.sch-box {
  display: flex;
  flex-direction: row;

  & > span {
    margin: 0 18px;
  }
}
.avatar-uploader {
  float: left;
  width: 64px;
  height: 64px;
}
.avatar-uploader .avatar {
  width: 64px;
  height: 64px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #8c939d;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  // transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: #05c65d;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 64px;
  height: 64px;
  line-height: 72px;
  text-align: center;
  border: 1px dashed #8c939d;
  border-radius: 6px;
}
.sel-school {
  float: right;
  width: 778px;
}
.star-flex {
  display: flex;
}
</style>
