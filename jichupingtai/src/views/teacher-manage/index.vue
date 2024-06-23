<template>
  <header>
    <span>用户管理</span>
  </header>
  <div v-if="isShow">
    <main>
      <div class="sel-box">
        <div class="operation">
          <span>教师管理</span>
          <div class="button-box">
            <div class="btn green-btn" @click="addTeacher">+ 添加教师</div>
            <div class="btn white-btn" @click="exportdata()">
              <img src="@assets/images/account-school/exp.png" alt="" />
              导出账号
            </div>
            <div class="btn white-btn" @click="uploadExcel()">
              <img src="@assets/images/account-school/imp.png" alt="" />
              导入账号
            </div>
            <input type="file" name="file" id="uploadExcel" @change="changeExcel()" style="display: none" />

            <div class="btn white-btn" @click="downloadTemplate('/swrserveadmin/User/downloadtpl')">
              <img src="@assets/images/account-school/imp.png" alt="" />
              下载模板
            </div>
          </div>
        </div>
        <div class="screen" :style="{ height: loginMsg.role_id === 102 ? '120px' : '60px' }">
          <div class="sel-l">
            <div class="sel-item">
              <span>教师角色:</span>
              <div class="sel">
                <el-select v-model="pageData.role_id" class="m-2" placeholder="请选择" @change="roleChange1">
                  <el-option label="全部" :value="null"></el-option>
                  <el-option v-for="item in optionsrole" :key="item.id" :label="item.desc" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="sel-item" v-if="loginMsg.role_id === 102">
              <span>省:</span>
              <div class="sel">
                <el-select v-model="area1" class="m-2" placeholder="请选择" @change="areaChange1">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="item in options1"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="sel-item" v-if="loginMsg.role_id === 102">
              <span>市:</span>
              <div class="sel">
                <el-select v-model="area2" class="m-2" placeholder="请选择" @change="areaChange2">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="item in options2"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="sel-item" v-if="loginMsg.role_id === 102">
              <span>区域:</span>
              <div class="sel">
                <el-select v-model="area3" class="m-2" placeholder="请选择" @change="areaChange3">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="item in options3"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="sel-item">
              <span>年级:</span>
              <div class="sel">
                <el-select v-model="pageData.xu" class="m-2" placeholder="请选择" @change="changegrade">
                  <el-option label="全部" :value="null"></el-option>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="sel-item">
              <span>学科:</span>
              <div class="sel">
                <el-select v-model="pageData.subject_id" class="m-2" placeholder="请选择" @change="changesubject">
                  <el-option label="全部" :value="null"></el-option>
                  <el-option
                    v-for="item in options_subject"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="sel-item" v-if="loginMsg.role_id === 102">
              <span>学校:</span>
              <div class="sel">
                <el-select
                  filterable="true"
                  v-model="pageData.school_id"
                  class="m-2"
                  placeholder="请选择"
                  @change="changeschool"
                >
                  <el-option label="全部" :value="null"></el-option>
                  <el-option
                    v-for="item in computedSchool"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="sel-r">
            <div class="mt-4">
              <el-input v-model="pageData.username" placeholder="请选择" class="input-with-select">
                <template #append>
                  <!-- <el-button :icon="Search"></el-button> -->
                  <div class="ser-icon" @click="getList()">
                    <img src="@assets/images/account-school/search.png" alt="" />
                  </div>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="del-res">
        <span>当前共查询到</span>
        <span class="green-t">{{ total }}</span>
        <span>名教师</span>
        <!-- <div class="btn green-btn" @click="rePassword(delIds)">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div> -->
        <div class="btn green-btn" @click="delAccount(delIds)">
          <img src="@assets/images/account-school/w-del.png" alt="" />
          批量删除
        </div>
      </div>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        stripe
        style="width: 100%"
        @select-all="selChangeAll"
        @select="selChange"
      >
        <el-table-column align="left" type="selection" width="30" />
        <el-table-column align="left" type="index" label="序号" min-width="5" />
        <el-table-column align="left" property="login_name" label="教师账号" min-width="15">
          <template #default="props">
            <span>
              {{ props.row.login_name }}
              <span class="font_green" @click="copyAccount(props.row.login_name)" v-if="loginMsg.role_id !== 102">
                复制
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="username" label="姓名" min-width="15" show-overflow-tooltip />
        <el-table-column align="left" property="role_names" label="角色" min-width="15" show-overflow-tooltip />
        <el-table-column align="left" property="phone" label="手机号" min-width="15" />
        <el-table-column align="left" property="school.name" label="所属学校" min-width="25" show-overflow-tooltip>
          <template #default="props">
            {{ props.row.proname + '-' + props.row.cityname + '-' + props.row.areaname + '-' + props.row.school_name }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="执教班级" min-width="15" v-if="loginMsg.role_id !== 102">
          <template #default="props">
            <span @click="classWatch(props.row.class_count)" class="font_green">
              {{ props.row.class_count.length + '个 （查看）' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="gradename" label="执教年级" min-width="15" v-else />
        <el-table-column align="left" property="subject_name" label="学科" min-width="15" />
        <el-table-column align="center" property="address" label="操作" min-width="20">
          <template #default="props">
            <div class="operation-box">
              <div @click="detail(props.row.id)">
                <img src="@assets/images/common/search-green.png" alt="" />
                <span>详情</span>
              </div>
              <!-- <div @click="rePassword(props.row.id)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div> -->
              <div @click="delAccount(props.row.id)">
                <img src="@assets/images/common/del-red.png" alt="" />
                <span>删除</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <el-pagination
        v-model:currentPage="pageData.page"
        v-model:page-size="pageData.limit"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </footer>
  </div>
  <div v-else>
    <!-- <el-dialog v-model="isShow" title="详情" width="1000px" custom-class="tabsDialog"> -->
    <Tabs
      :detailFrom="editFrom"
      @checkeditRoleId="checkeditRoleId"
      @checkeditPhaseStudyId="checkeditPhaseStudyId"
      @subjectChange="subjectChange"
      @toggle="toggle"
      @getList="getList"
    />
    <!-- </el-dialog> -->
  </div>

  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>添加教师</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            账号:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="fromData.login_name" placeholder="请输入教师账号"></el-input>
          </div>
          <span class="w-108 fl">性别:</span>
          <div class="w-300 fl">
            <el-select v-model="fromData.sex" class="m-2" placeholder="选择">
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
            <el-input v-model="fromData.username" placeholder="请输入教师姓名"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            手机号:
          </span>
          <div class="w-300 fl">
            <el-input v-model="fromData.phone" placeholder="请输入教师手机号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">学历:</span>
          <div class="w-300 fl mr-70">
            <el-select v-model="fromData.educational" class="m-2" placeholder="请选择学历" clearable>
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
            <el-select v-model="fromData.positional" class="m-2" placeholder="请选择职称" clearable>
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
            <el-select v-model="fromData.sole_duty" class="m-2" placeholder="请选择类型" clearable>
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20" v-if="loginMsg.role_id === 102">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校:
          </span>
          <div class="sch-box">
            <div class="w-180">
              <el-select v-model="fromData.pro" class="m-2" placeholder="请选择" @change="areaChange5">
                <el-option v-for="item in options5" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180">
              <el-select
                v-model="fromData.city"
                class="m-2"
                placeholder="请选择"
                @change="areaChange6"
                :disabled="fromData.pro === ''"
              >
                <el-option v-for="item in options6" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180">
              <el-select
                v-model="fromData.area"
                class="m-2"
                placeholder="请选择"
                @change="areaChange7"
                :disabled="fromData.city === ''"
              >
                <el-option v-for="item in options7" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180">
              <el-select
                v-model="fromData.school_code"
                class="m-2"
                placeholder="请选择"
                :disabled="fromData.area === ''"
              >
                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click="sChange(item)"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            教师角色:
          </span>
          <div @click="checkRoleId(4)" class="fl f-align-c mr-20">
            <img :src="fromData.role_ids.indexOf(4) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <span>教师</span>
          </div>
          <div @click="checkRoleId(3)" class="fl f-align-c mr-20">
            <img :src="fromData.role_ids.indexOf(3) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <span>备课组长</span>
          </div>
          <div @click="checkRoleId(2)" class="fl f-align-c mr-20">
            <img
              :src="fromData.role_ids.indexOf(2) !== -1 && fromData.role_ids.indexOf(5) === -1 ? selOn : selOff"
              alt=""
              class="mr-18"
            />
            <span>实验室管理员</span>
          </div>
          <div @click="checkRoleId(5)" class="fl f-align-c mr-20">
            <img
              :src="fromData.role_ids.indexOf(5) !== -1 && fromData.role_ids.indexOf(2) === -1 ? selOn : selOff"
              alt=""
              class="mr-18"
            />
            <span>实验室总管理员</span>
          </div>
          <div @click="checkRoleId(1)" class="fl f-align-c">
            <img :src="fromData.role_ids.indexOf(1) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <span>学校管理员</span>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">涉及学段:</span>
          <div
            v-if="fromData.school_type_id == 1 || fromData.school_type_id == 6 || fromData.school_type_id == 7"
            @click="checkPhaseStudyId('1')"
            class="fl f-align-c mr-20"
          >
            <img :src="fromData.phase_study_id.indexOf('1') !== -1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>小学</span>
          </div>
          <div
            v-if="
              fromData.school_type_id == 2 ||
              fromData.school_type_id == 4 ||
              fromData.school_type_id == 6 ||
              fromData.school_type_id == 7
            "
            @click="checkPhaseStudyId('2')"
            class="fl f-align-c mr-20"
          >
            <img :src="fromData.phase_study_id.indexOf('2') !== -1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>初中</span>
          </div>
          <div
            v-if="
              fromData.school_type_id == 3 ||
              fromData.school_type_id == 4 ||
              fromData.school_type_id == 5 ||
              fromData.school_type_id == 7
            "
            @click="checkPhaseStudyId('3')"
            class="fl f-align-c mr-20"
          >
            <img :src="fromData.phase_study_id.indexOf('3') !== -1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>高中</span>
          </div>
        </div>
        <div
          v-if="
            fromData.role_ids.indexOf(4) !== -1 ||
            fromData.role_ids.indexOf(3) !== -1 ||
            fromData.role_ids.indexOf(2) !== -1
          "
          class="mb-20"
        >
          <span class="w-108 fl">执教学科:</span>
          <div
            @click="fromData.subject_id = 1"
            class="fl f-align-c mr-20"
            v-if="fromData.phase_study_id.includes('2') || fromData.phase_study_id.includes('3')"
          >
            <img :src="fromData.subject_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>物理</span>
          </div>
          <div
            @click="fromData.subject_id = 2"
            class="fl f-align-c mr-20"
            v-if="fromData.phase_study_id.includes('2') || fromData.phase_study_id.includes('3')"
          >
            <img :src="fromData.subject_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>化学</span>
          </div>
          <div
            @click="fromData.subject_id = 3"
            class="fl f-align-c mr-20"
            v-if="fromData.phase_study_id.includes('2') || fromData.phase_study_id.includes('3')"
          >
            <img :src="fromData.subject_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>生物</span>
          </div>
          <div @click="fromData.subject_id = 4" class="fl f-align-c" v-if="fromData.phase_study_id.includes('1')">
            <img :src="fromData.subject_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
            <span>小学科学</span>
          </div>
        </div>
        <div class="mb-20" v-show="fromData.role_ids.indexOf(4) !== -1">
          <span class="w-108 fl">执教班级:</span>
          <div class="fr school-class" v-if="allClass !== []">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in computedGrade" :key="index" :label="item.name">
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
        <div class="mb-20" v-show="fromData.role_ids.indexOf(3) !== -1">
          <span class="w-108 fl">备课年级:</span>
          <div class="fr school-class">
            <el-check-tag
              v-for="(item, index) in fromData.schoolGrade"
              :key="index"
              :checked="item.is_true"
              @change="item.is_true = !item.is_true"
            >
              {{ item.name }}
            </el-check-tag>
          </div>
        </div>
        <div class="mb-20" v-show="fromData.role_ids.indexOf(2) !== -1">
          <span class="w-108 fl">管理实验室:</span>
          <div class="fr school-class" v-if="fromData.subject_laborator !== []">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in fromData.subject_laborator" :key="index" :label="item.name">
                <el-check-tag
                  v-for="(item1, index1) in item.laboratory"
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
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState2" @close="popState2 = $event">
    <template v-slot:header>
      <p>查看执教班级</p>
    </template>
    <template v-slot:main>
      <div class="class_div_box">
        <div class="class_div" v-for="(item, index) in classData" :key="index">
          <div>
            <span>年级：</span>
            {{ item.GradeName }}
          </div>
          <div>
            <span>班级：</span>
            {{ item.ClassName }}
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="popState2 = false">确定</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, h } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getaccount,
  getSchoolClass,
  getSchoolList,
  saveSchoolAccount,
  editUser,
  delUser,
  rePsw,
  uploadfile
} from '@service/account/index'
import { PopCurrency } from '@components/pop-currency'
import { findArea } from '@service/area/index'
import { getSubjectList } from '@service/subject/index'
import { BASE_URL } from '@service/request/config'
import localCache from '@/utils/localCache'
import { useRoute } from 'vue-router'
import { useStore } from '@store/index'
import axios from 'axios'
import Tabs from './tabs/tabs.vue'
const store = useStore()
const loginMsg = JSON.parse(JSON.stringify(store.state.login.userInfo))
console.log(111, loginMsg)

const area1 = ref('')
const area2 = ref('')
const area3 = ref('')
const options1: any = ref([])
const options2: any = ref([])
const options3: any = ref([])
const options5: any = ref([])
const options6: any = ref([])
const options7: any = ref([])
const options8: any = ref([])
const options9: any = ref([])
const options10: any = ref([])
const options11: any = ref([])
const options12: any = ref([])
const options13: any = ref([])
const isShow = ref(true)
//返回首页
const toggle = (): void => {
  isShow.value = true
}
const computedSchool = computed(() => {
  return options_school.value.filter((e: any) => {
    if (pageData.area) {
      return e.area === pageData.area
    } else if (pageData.city) {
      return e.city === pageData.city
    } else if (pageData.pro) {
      return e.pro === pageData.pro
    } else {
      return true
    }
  })
})

const areaChange1 = () => {
  options2.value = []
  options3.value = []
  area2.value = ''
  area3.value = ''
  pageData.pro = area1.value
  pageData.city = ''
  pageData.area = ''
  getFindArea(2, area1.value, 2)
  getList()
}
const areaChange2 = () => {
  options3.value = []
  area3.value = ''
  pageData.city = area2.value
  pageData.area = ''
  getFindArea(3, area2.value, 3)
  getList()
}
const areaChange3 = () => {
  pageData.area = area3.value
  getList()
}
const areaChange5 = () => {
  options6.value = []
  options7.value = []
  options4.value = []
  fromData.city = ''
  fromData.area = ''
  fromData.school_code = ''
  fromData.school_id = ''
  getFindArea(2, fromData.pro, 6)
}
const areaChange6 = () => {
  options7.value = []
  fromData.area = ''
  fromData.school_code = ''
  fromData.school_id = ''
  options4.value = []
  getFindArea(3, fromData.city, 7)
}
const areaChange7 = () => {
  options4.value = []
  fromData.school_code = ''
  fromData.school_id = ''
  getSchoolList({ area: fromData.area }).then((res) => {
    options4.value = res.data
  })
}

const getFindArea = (val: number, id: any, sel: any) => {
  findArea({ area_level: val, p_id: id }).then((res) => {
    if (sel === 1) {
      options1.value = res.data
      options5.value = res.data
      options8.value = res.data
      options11.value = res.data
    } else if (sel === 2) {
      options2.value = res.data
    } else if (sel === 3) {
      options3.value = res.data
    } else if (sel === 5) {
      options5.value = res.data
    } else if (sel === 6) {
      options6.value = res.data
    } else if (sel === 7) {
      options7.value = res.data
    } else if (sel === 8) {
      options8.value = res.data
    } else if (sel === 9) {
      options9.value = res.data
    } else if (sel === 10) {
      options10.value = res.data
    } else if (sel === 11) {
      options11.value = res.data
    } else if (sel === 12) {
      options12.value = res.data
    } else if (sel === 13) {
      options13.value = res.data
    }
  })
}
getFindArea(1, 0, 1)
let route = useRoute()
const pageData: any = reactive({
  page: 1,
  limit: 10,
  pro: '',
  city: '',
  area: '',
  xu: '',
  username: '',
  status: '1',
  subject_id: null,
  role_id: null,
  grade: null,
  school_id: loginMsg.role_id === 102 ? null : loginMsg.school_id
})
if (route.params.school_id) {
  pageData.school_id = parseInt(route.params.school_id)
}
const optionsrole: any = ref([
  { id: '1', desc: '学校管理员' },
  { id: '2', desc: '实验室管理员' },
  { id: '3', desc: '备课组长' },
  { id: '4', desc: '教师' }
  // { id: '5', desc: '实验室总管理员' },
  // { id: '100', desc: '区域管理员' },
  // { id: '101', desc: '区域学科管理员' },
  //{ id: '102', desc: 'swr后台管理员' }
])
const changeschool = () => {
  // pageData.area_level = '2,3'
  pageData.pro = area1.value
  pageData.city = area2.value
  pageData.area = area3.value
  getList()
}

const checkRoleId = (id: number) => {
  if (id == 2 && fromData.role_ids.indexOf(5) !== -1) {
    fromData.role_ids.splice(fromData.role_ids.indexOf(5), 1)
  }
  if (id == 5 && fromData.role_ids.indexOf(2) !== -1) {
    fromData.role_ids.splice(fromData.role_ids.indexOf(2), 1)
  }
  if (fromData.role_ids.indexOf(id) === -1) {
    fromData.role_ids.push(id)
  } else {
    fromData.role_ids.splice(fromData.role_ids.indexOf(id), 1)
  }
}
const checkPhaseStudyId = (id: string) => {
  fromData.subject_id = ''
  if (fromData.phase_study_id.indexOf(id) === -1) {
    fromData.phase_study_id.push(id)
  } else {
    fromData.phase_study_id.splice(fromData.phase_study_id.indexOf(id), 1)
  }
}
const options_subject: any = ref()

const getSubjectoptions = () => {
  getSubjectList().then((res) => {
    options_subject.value = res.data
  })
}
getSubjectoptions()
const options_school: any = ref([])

const getSchooloptions = () => {
  getSchoolList({}).then((res) => {
    options_school.value = res.data
  })
}
getSchooloptions()
const roleChange1 = () => {
  area2.value = ''
  // pageData.area_level = '2,3'
  pageData.pro = area1.value
  pageData.city = area2.value
  pageData.area = area3.value
  getList()
}
const changesubject = () => {
  area2.value = ''
  // pageData.area_level = '2,3'
  pageData.pro = area1.value
  pageData.city = area2.value
  pageData.area = area3.value
  getList()
}
const changegrade = () => {
  pageData.pro = area1.value
  pageData.city = area2.value
  pageData.area = area3.value
  getList()
}

// getFindArea(1, 0, 5)
// getFindArea(2, 0, 6)
// getFindArea(3, 0, 7)
const options4: any = ref([])
const sChange = (item: any) => {
  fromData.phase_study_id = []
  getSchoolClass({ id: item.id }).then((res) => {
    fromData.schoolGrade = res.data.grades
    fromData.subject_laborator = res.data.subject_laborator
    fromData.school_type_id = item.school_type_id
    fromData.school_id = item.id
  })
}

/*  <--  弹窗相关事件  -->  */
const fromData: any = reactive({
  login_name: '',
  username: '',
  password: '',
  phase_study_id: [],
  sex: null,
  phone: '',
  pro: '',
  city: '',
  area_code: '',
  school_code: '',
  school_id: null,
  area_level: '1,2,3',
  subject_id: 0,
  school_type_id: null,
  role_id: null,
  grades: [],
  role_ids: [],
  schoolGrade: [],
  educational: '',
  positional: '',
  sole_duty: '',
  subject_laborator: []
})

const popState = ref(false)
const period = ref([false, false, false])
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
const allClass = ref([{ title: '暂无', list: [{ name: '1班', status: false }] }])
const allGrade = ref([{ title: '暂无', is_true: false }])
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
// 新建，编辑保存
const save = () => {
  saveSchoolAccount(fromData).then((res) => {
    if (res.code === 10) {
      popState.value = false
      getList()
      ElMessage({
        type: 'success',
        message: '添加成功!'
      })
      // fromData = reactive({
      fromData.login_name = ''
      fromData.username = ''
      fromData.password = ''
      fromData.sex = null
      fromData.phone = ''
      fromData.pro = ''
      fromData.city = ''
      fromData.area_code = ''
      fromData.school_code = ''
      fromData.school_id = null
      fromData.area_level = '1,2,3'
      fromData.subject_id = 0
      fromData.school_type_id = null
      fromData.role_id = null
      fromData.grades = []
      fromData.educational = ''
      fromData.positional = ''
      fromData.sole_duty = ''
      fromData.subject_laborator = []
      fromData.phase_study_id = []
      fromData.role_ids = []
      // })
    }
  })
}
// 编辑
const popState1 = ref(false)
const editFrom: any = reactive({
  id: null,
  role_id: null,
  login_name: '',
  sex: null,
  username: '',
  phone: '',
  address: '',
  subject_id: 1,
  school_id: null,
  school_code: null,
  school: [],
  schoolGrade: [],
  role_ids: [],
  phase_study_id: [],
  pro: '',
  city: '',
  area: '',
  subject_laborator: []
})
const detail = (id: number) => {
  editUser({ id: id }).then((res) => {
    editFrom.id = res.data.id
    editFrom.role_id = res.data.role_id
    editFrom.login_name = res.data.login_name
    editFrom.sex = res.data.sex
    editFrom.username = res.data.username
    editFrom.phase_study_id = res.data.phase_study_id ? (res.data.phase_study_id + '').split(',') : []
    editFrom.phone = res.data.phone
    editFrom.area_code = res.data.area
    editFrom.school_id = res.data.school.id
    editFrom.school_code = res.data.school.code
    editFrom.subject_id = res.data.subject_id
    editFrom.schoolGrade = res.data.schoolGrade
    editFrom.subject_laborator = res.data.subject_laborator
    editFrom.pro = res.data.pro
    editFrom.city = res.data.city
    editFrom.area = res.data.area
    editFrom.role_ids = res.data.role_ids
    editFrom.school_type_id = res.data.school.school_type_id
    editFrom.educational = res.data.educational
    editFrom.positional = res.data.positional
    editFrom.sole_duty = res.data.sole_duty
    let str =
      '' +
      res.data.school.proName.name +
      '/' +
      res.data.school.cityName.name +
      '/' +
      res.data.school.areaName.name +
      '/' +
      (res.data.school.address ? res.data.school.address : '') +
      (res.data.school.address ? '/' : '') +
      res.data.school.name
    editFrom.address = str
    localCache.setCache('isShow', false)
    isShow.value = false
  })
}
const editSave = () => {
  saveSchoolAccount(editFrom).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      getList()
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
    }
  })
}
const selOn = require('@images/common/sel-on.png')
const selOff = require('@images/common/sel-off.png')
const selOffG = require('@images/common/gray-ring.png')
const selOnG = require('@images/common/green-ring.png')

/*---  <------------>  ---*/

const options = ref([
  {
    value: 1,
    label: '一年级'
  },
  {
    value: 2,
    label: '二年级'
  },
  {
    value: 3,
    label: '三年级'
  },
  {
    value: 4,
    label: '四年级'
  },
  {
    value: 5,
    label: '五年级'
  },
  {
    value: 6,
    label: '六年级'
  },
  {
    value: 7,
    label: '七年级'
  },
  {
    value: 8,
    label: '八年级'
  },
  {
    value: 9,
    label: '九年级'
  },
  {
    value: 10,
    label: '高一'
  },
  {
    value: 11,
    label: '高二'
  },
  {
    value: 12,
    label: '高三'
  }
])
// const getschoolgrade = () => {
//   getGradeList({'school_id':loginMsg.school_id}).then((res) => {
//     if (res.code === 10) {
//       options.value=res.data;
//     }
//   })
// }
// getschoolgrade()

const tableData: any = ref([])
const delIds = ref('')
const selChange = (selection: any) => {
  selection = selection.map((item: any) => item.id)
  delIds.value = selection
}
const selChangeAll = (selection: any) => {
  let ids = ''
  JSON.parse(JSON.stringify(selection)).forEach((e: { id: any }) => {
    ids = ids + JSON.stringify(e.id) + ','
  })
  delIds.value = ids
}
// 分页
const total = ref(1)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const handleCurrentChange = (val: number) => {
  pageData.page = val
  getList()
}
// 操作
// const rePassword = (id: any) => {
//   if (!id) {
//     ElMessage({
//       type: 'error',
//       message: '请选择要重置的数据！'
//     })
//   } else {
//     ElMessageBox.confirm('确定重置选择账号的登录密码!', '警告', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'error'
//     })
//       .then(() => {
//         rePsw({ id: id }).then((res) => {
//           console.log(res)
//           if (res.code === 10) {
//             getList()
//             ElMessage({
//               type: 'success',
//               message: '重置成功!'
//             })
//           } else {
//             ElMessage({
//               type: 'error',
//               message: '重置失败!'
//             })
//           }
//         })
//       })
//       .catch(() => {
//         console.log('取消操作')
//       })
//   }
// }
// 删除
const delAccount = (id: any) => {
  if (!id) {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据'
    })
  } else {
    ElMessageBox({
      type: 'warning',
      title: '提示',
      message: h('p', null, [
        h('span', null, '删除账号会删除该账号相关信息，以后再无法查询，确认删除？'),
        h('br', null, '')
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        delUser({ id: id }).then((res) => {
          if (res.code === 10) {
            getList()
            ElMessage({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}
// 获取账号列表
const getList = () => {
  getaccount(pageData).then((res) => {
    tableData.value = res.data.data
    total.value = res.data.total
  })
}
// 初始获取列表
getList()

const downloadTemplate = (url: any) => {
  window.location.href = BASE_URL + url
}
const exportdata = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(BASE_URL + '/swrserveadmin/User/exportUser', { ...pageData, token }, { responseType: 'blob' })
    .then((res) => {
      const blob = new Blob([res.data]) //处理文档流
      const fileName = '导出账号.xlsx'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}
const uploadExcel = () => {
  let filedom: any = document.getElementById('uploadExcel')
  filedom.value = ''
  filedom.click()
}
const changeExcel = () => {
  let fileObj: any = (document.getElementById('uploadExcel') as any).files[0]
  let formdata = new FormData()
  formdata.append('file', fileObj)
  formdata.append('role_id', '4')
  uploadfile(formdata).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      getList()
      ElMessage({
        type: 'success',
        message: '导入成功!'
      })
    }
  })
}

const computedGrade = computed(() => {
  let arr = []
  if (fromData.phase_study_id.indexOf('1') !== -1) {
    arr.push(...fromData.schoolGrade.filter((item: any) => item.xu < 7))
  }
  if (fromData.phase_study_id.indexOf('2') !== -1) {
    arr.push(...fromData.schoolGrade.filter((item: any) => item.xu < 10 && item.xu > 6))
  }
  if (fromData.phase_study_id.indexOf('3') !== -1) {
    arr.push(...fromData.schoolGrade.filter((item: any) => item.xu < 13 && item.xu > 9))
  }
  return arr
})
const checkeditPhaseStudyId = (id: string) => {
  if (editFrom.phase_study_id.indexOf(id) === -1) {
    editFrom.phase_study_id.push(id)
  } else {
    editFrom.phase_study_id.splice(editFrom.phase_study_id.indexOf(id), 1)
  }
}
const checkeditRoleId = (id: number) => {
  if (id == 2 && editFrom.role_ids.indexOf(5) !== -1) {
    editFrom.role_ids.splice(editFrom.role_ids.indexOf(5), 1)
  }
  if (id == 5 && editFrom.role_ids.indexOf(2) !== -1) {
    editFrom.role_ids.splice(editFrom.role_ids.indexOf(2), 1)
  }
  if (editFrom.role_ids.indexOf(id) === -1) {
    editFrom.role_ids.push(id)
  } else {
    editFrom.role_ids.splice(editFrom.role_ids.indexOf(id), 1)
  }
}
const subjectChange = (_val: number) => {
  editFrom.subject_id = _val
}
const copyAccount = (str: string) => {
  console.log(str)
  let save = function (e: any) {
    e.clipboardData.setData('text/plain', str)
    e.preventDefault() //阻止默认行为
  }
  document.addEventListener('copy', save) //添加一个copy事件
  document.execCommand('copy') //执行copy方法
  ElMessage({
    type: 'success',
    message: '复制成功!'
  })
}
const popState2 = ref(false)
const classData: any = ref([])
const classWatch = (item: any) => {
  if (item.length !== 0) {
    console.log(item)
    classData.value = item
    popState2.value = true
  } else {
    ElMessage({
      type: 'error',
      message: '当前教师无执教班级!'
    })
  }
}
const addTeacher = () => {
  popState.value = true
  if (loginMsg.role_id !== 102) {
    fromData.pro = loginMsg.pro
    fromData.city = loginMsg.city
    fromData.area = loginMsg.area
    fromData.school_code = loginMsg.school_code
    fromData.school_id = loginMsg.school_id
    fromData.school_type_id = loginMsg.school.school_type_id
    getSchoolClass({ id: loginMsg.school_id }).then((res) => {
      fromData.schoolGrade = res.data.grades
      fromData.subject_laborator = res.data.subject_laborator
    })
  }
}
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
    // height: 120px;

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
      // height: 120px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;

      .sel-l {
        float: left;
        width: 80%;
        line-height: 60px;
        padding-left: 20px;
        box-sizing: border-box;

        .sel-item {
          float: left;
          // margin-top: 16px;
          align-items: center;
          width: 25%;
          display: flex;
          justify-content: space-between;

          & > span {
            float: left;
            width: 25%;
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

  .del-res {
    margin-top: 10px;
    height: 56px;

    span {
      float: left;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      color: #404040;
    }

    .green-t {
      padding: 0 8px;
      color: #05c65d;
    }

    & > div {
      float: right;
      margin: 10px 20px 0 0;
      display: flex;
      align-items: center;

      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
}

footer {
  margin: 28px 0 16px;
  text-align: right;
}

.operation-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;

  div {
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
      margin-right: 12px;
      width: 20px;
      height: 20px;
    }
  }
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
  justify-content: space-between;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.font_green {
  color: #05c65d;
  cursor: pointer;
}

.class_div_box {
  width: 360px;

  & > :nth-last-child(1) {
    border: none;
  }
}

.class_div {
  width: 360px;
  height: 30px;
  line-height: 30px;
  color: #05c65d;
  border-bottom: 1px dashed #05c65d;

  div {
    float: left;
    width: 180px;
  }

  span {
    padding: 0 40rpx;
    color: #333;
  }
}
</style>
<style>
.el-message-box__header {
  border-bottom: #05c65d 1px solid;
}

.tabsDialog .el-dialog__header {
  border-bottom: #05c65d 1px solid;
}
</style>
