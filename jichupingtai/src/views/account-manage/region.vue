<template>
  <header>
    <span>账号管理 > 区域账号管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>区域账号管理</span>
        <div class="button-box">
          <div class="btn green-btn" @click="popState = true">+ 添加账号</div>
          <div class="btn white-btn" @click="exportdata()">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出账号
          </div>
          <div class="btn white-btn" @click="uploadExcel()">
            <img src="@assets/images/account-school/imp.png" alt="" />
            导入账号
          </div>
          <input type="file" name="file" id="uploadExcel" @change="changeExcel()" style="display: none" />

          <div class="btn white-btn" @click="downloadTemplate('/swrserveadmin/User/downloadareatpl')">
            <img src="@assets/images/account-school/imp.png" alt="" />
            下载模板
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>角色:</span>
            <div class="sel">
              <el-select v-model="pageData.role_id" class="m-2" placeholder="请选择" @change="roleChange1">
                <el-option label="全部" value=""></el-option>
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
            <span>省:</span>
            <div class="sel">
              <el-select v-model="area1" class="m-2" placeholder="请选择" @change="areaChange1">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options1" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>市:</span>
            <div class="sel">
              <el-select v-model="area2" class="m-2" placeholder="请选择" @change="areaChange2">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>区域:</span>
            <div class="sel">
              <el-select v-model="area3" class="m-2" placeholder="请选择" @change="areaChange3">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options3" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>学段:</span>
            <div class="sel">
              <el-select v-model="pageData.phase_study_id" class="m-2" placeholder="请选择" @change="getList()">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in [
                    { id: 1, title: '小学' },
                    { id: 2, title: '初中' },
                    { id: 3, title: '高中' }
                  ]"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>学科:</span>
            <div class="sel">
              <el-select v-model="pageData.subject_id" class="m-2" placeholder="请选择" @change="getList()">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in [
                    { id: 1, name: '物理' },
                    { id: 2, name: '化学' },
                    { id: 3, name: '生物' },
                    { id: 4, name: '小学科学' }
                  ]"
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
                <div class="ser-icon">
                  <img @click="getList()" src="@assets/images/account-school/search.png" alt="" />
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
      <div class="btn green-btn" @click="rePassword(delIds)">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div>
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
      @select-all="selChange"
      @select="selChange"
    >
      <el-table-column align="left" type="selection" width="30" />
      <el-table-column align="left" type="index" label="序号" min-width="5" />
      <el-table-column align="left" property="login_name" label="教师账号" min-width="15" />
      <el-table-column align="left" property="username" label="姓名" min-width="15" />
      <el-table-column align="left" property="role_names" label="角色" min-width="15" />
      <el-table-column align="left" property="phone" label="手机号" min-width="15" />
      <el-table-column align="left" label="所属区域" min-width="36">
        <template #default="props">
          <span>{{ props.row.proname }} {{ props.row.cityname }} {{ props.row.areaname }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="left" label="学段" min-width="15">
        <template #default="props">
          <span>{{ ['小学', '初中', '高中'][props.row.phase_study_id - 1] }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="left" property="subject_name" label="学科" min-width="15" />
      <el-table-column align="center" property="address" label="操作" min-width="36">
        <template #default="props">
          <div class="operation-box">
            <div @click="edit(props.row.id)">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>编辑</span>
            </div>
            <div @click="rePassword(props.row.id)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div>
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
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>添加区域账号</p>
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
          <span class="w-108 fl">
            <span class="font-red">*</span>
            区域级别:
          </span>
          <div @click="levelChange(1)" class="fl f-align-c mr-20">
            <img :src="fromData.area_level === 1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>省</span>
          </div>
          <div @click="levelChange(2)" class="fl f-align-c mr-20">
            <img :src="fromData.area_level === 2 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>市</span>
          </div>
          <div @click="levelChange(3)" class="fl f-align-c mr-20">
            <img :src="fromData.area_level === 3 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>区</span>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            区域:
          </span>
          <div class="sch-box">
            <div class="w-180" v-show="fromData.area_level !== ''">
              <el-select v-model="fromData.pro" class="m-2" placeholder="请选择" @change="areaChange5">
                <el-option v-for="item in options5" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180" v-show="fromData.area_level !== 1 && fromData.area_level !== ''">
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
            <div class="w-180" v-show="fromData.area_level === 3">
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
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            区域角色:
          </span>
          <div class="fl f-align-c mr-20" @click="checkRoleId(100)">
            <img :src="fromData.role_ids.indexOf(100) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>区域管理员</span>
          </div>
          <div class="fl f-align-c mr-20" @click="checkRoleId(101)">
            <img :src="fromData.role_ids.indexOf(101) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>区域学科管理员</span>
          </div>
        </div>
        <div class="mb-20" v-if="fromData.role_ids.indexOf(101) !== -1">
          <span class="w-108 fl">
            <!-- <span class="font-red">*</span> -->
            执教学科:
          </span>
          <div @click="fromData.subject_id = 1" class="fl f-align-c mr-20">
            <img :src="fromData.subject_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>物理</span>
          </div>
          <div @click="fromData.subject_id = 2" class="fl f-align-c mr-20">
            <img :src="fromData.subject_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>化学</span>
          </div>
          <div @click="fromData.subject_id = 3" class="fl f-align-c mr-20">
            <img :src="fromData.subject_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>生物</span>
          </div>
          <div @click="fromData.subject_id = 4" class="fl f-align-c">
            <img :src="fromData.subject_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>小学科学</span>
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
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>编辑区域账号</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            账号:
          </span>
          <div class="w-300 fl mr-70">
            <el-input :disabled="true" v-model="editFrom.login_name" placeholder="请输入教师账号"></el-input>
          </div>
          <span class="w-108 fl">性别:</span>
          <div class="w-300 fl">
            <el-select v-model="editFrom.sex" class="m-2" placeholder="选择">
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
            <el-input v-model="editFrom.username" placeholder="请输入教师姓名"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            手机号:
          </span>
          <div class="w-300 fl">
            <el-input v-model="editFrom.phone" placeholder="请输入教师手机号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            区域级别:
          </span>
          <div @click="levelChange1(1)" class="fl f-align-c mr-20">
            <img :src="editFrom.area_level === 1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>省</span>
          </div>
          <div @click="levelChange1(2)" class="fl f-align-c mr-20">
            <img :src="editFrom.area_level === 2 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>市</span>
          </div>
          <div @click="levelChange1(3)" class="fl f-align-c mr-20">
            <img :src="editFrom.area_level === 3 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>区</span>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            区域:
          </span>
          <div class="sch-box">
            <div class="w-180" v-show="editFrom.area_level !== ''">
              <el-select v-model="editFrom.pro" class="m-2" placeholder="请选择" @change="areaChange8">
                <el-option v-for="item in options8" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180" v-show="editFrom.area_level !== 1 && editFrom.area_level !== ''">
              <el-select
                v-model="editFrom.city"
                class="m-2"
                placeholder="请选择"
                @change="areaChange9"
                :disabled="editFrom.pro === ''"
              >
                <el-option v-for="item in options9" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180" v-show="editFrom.area_level === 3">
              <el-select
                v-model="editFrom.area"
                class="m-2"
                placeholder="请选择"
                @change="areaChange10"
                :disabled="editFrom.city === ''"
              >
                <el-option v-for="item in options10" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            区域角色:
          </span>
          <div class="fl f-align-c mr-20" @click="checkeditRoleId(100)">
            <img :src="editFrom.role_ids.indexOf(100) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>区域管理员</span>
          </div>
          <div class="fl f-align-c mr-20" @click="checkeditRoleId(101)">
            <img :src="editFrom.role_ids.indexOf(101) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>区域学科管理员</span>
          </div>
        </div>
        <div class="mb-20" v-if="editFrom.role_ids.indexOf(101) !== -1">
          <span class="w-108 fl">
            <!-- <span class="font-red">*</span> -->
            执教学科:
          </span>
          <div @click="editFrom.subject_id = 1" class="fl f-align-c mr-20">
            <img :src="editFrom.subject_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>物理</span>
          </div>
          <div @click="editFrom.subject_id = 2" class="fl f-align-c mr-20">
            <img :src="editFrom.subject_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>化学</span>
          </div>
          <div @click="editFrom.subject_id = 3" class="fl f-align-c mr-20">
            <img :src="editFrom.subject_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>生物</span>
          </div>
          <div @click="editFrom.subject_id = 4" class="fl f-align-c">
            <img :src="editFrom.subject_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>小学科学</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="editSave">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState1 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import axios from 'axios'
import { getaccount, saveSchoolAccount, editUser, delUser, rePsw, uploadfile } from '@service/account/index'
import localCache from '@/utils/localCache'
import { BASE_URL } from '@service/request/config'
import { PopCurrency } from '@components/pop-currency'

import { findArea } from '@service/area/index'

const levelChange = (val: number) => {
  fromData.area_level = val
  fromData.pro = ''
  areaChange5()
}
const levelChange1 = (val: number) => {
  editFrom.area_level = val
  editFrom.pro = ''
  areaChange8()
}
// 获取用户信息
/********** <--- 筛选框 ---> **********/
const area1 = ref('')
const area2 = ref('')
const area3 = ref('')
const options3 = ref([])
const options1 = ref([])
const options2 = ref([])
const options5: any = ref([])
const options6: any = ref([])
const options7: any = ref([])
const options8: any = ref([])
const options9: any = ref([])
const options10: any = ref([])
const options11: any = ref([])
const options12: any = ref([])
const options13: any = ref([])
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
  fromData.city = ''
  fromData.area = ''
  getFindArea(2, fromData.pro, 6)
}
const areaChange6 = () => {
  options7.value = []
  fromData.area = ''
  getFindArea(3, fromData.city, 7)
}
const areaChange7 = () => {
  console.log()
}
const areaChange8 = () => {
  options9.value = []
  options10.value = []
  editFrom.city = ''
  editFrom.area = ''
  getFindArea(2, editFrom.pro, 9)
}
const areaChange9 = () => {
  options10.value = []
  editFrom.area = ''
  getFindArea(3, editFrom.city, 10)
}
const areaChange10 = () => {
  console.log()
}
const getFindArea = (val: number, id: any, sel: any) => {
  findArea({ area_level: val, p_id: id }).then((res) => {
    console.log(res)
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

const pageData = reactive({
  page: 1,
  limit: 10,
  pro: '',
  city: '',
  area: '',
  role_id: '',
  school_id: -1
})

const roleChange1 = () => {
  pageData.pro = area1.value
  pageData.city = area2.value
  pageData.area = area3.value
  getList()
}
getFindArea(1, 0, 5)

/*  <--  弹窗相关事件  -->  */
const fromData: any = reactive({
  login_name: '',
  username: '',
  password: '',
  sex: null,
  phone: '',
  pro: '',
  city: '',
  area_code: '',
  school_code: 0,
  school_id: -1,
  area_level: '',
  subject_id: 0,
  phase_study_id: 0,
  school_type_id: null,
  role_id: null,
  role_ids: [],
  grades: [],
  subject_laborator: []
})
const checkRoleId = (id: number) => {
  fromData.role_ids = []

  if (fromData.role_ids.indexOf(id) === -1) {
    fromData.role_ids.push(id)
  } else {
    fromData.role_ids.splice(fromData.role_ids.indexOf(id), 1)
  }
  console.log(fromData)
}
const checkeditRoleId = (id: number) => {
  editFrom.role_ids = []
  if (editFrom.role_ids.indexOf(id) === -1) {
    editFrom.role_ids.push(id)
  } else {
    editFrom.role_ids.splice(editFrom.role_ids.indexOf(id), 1)
  }
  console.log(fromData)
}
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
  console.log('111')

  console.log(arr)
  allClass.value = JSON.parse(JSON.stringify(arr))
  allGrade.value = JSON.parse(JSON.stringify(arr1))
  console.log(allClass.value)
}
allClassScreen(0)
// 新建，编辑保存
const save = () => {
  saveSchoolAccount(fromData).then((res) => {
    if (res.code === 10) {
      popState.value = false
      console.log(res)
      fromData.login_name = ''
      fromData.username = ''
      fromData.password = ''
      fromData.sex = null
      fromData.phone = ''
      fromData.pro = ''
      fromData.city = ''
      fromData.area = ''
      fromData.school_code = ''
      fromData.school_id = -1
      fromData.area_level = ''
      fromData.subject_id = 0
      fromData.school_type_id = null
      fromData.role_id = null
      fromData.role_ids = []
      fromData.grades = []
      fromData.subject_laborator = []
      getList()
      ElMessage({
        type: 'success',
        message: '添加成功!'
      })
    }
  })
}
// 编辑
const popState1 = ref(false)
const editFrom: any = reactive({
  id: null,
  role_id: null,
  role_ids: [],
  login_name: '',
  sex: null,
  username: '',
  phone: '',
  address: '',
  subject_id: '',
  phase_study_id: '',
  area_level: '',
  school_id: null,
  school_code: null,
  school: [],
  schoolGrade: [],
  subject_laborator: []
})
const edit = (id: number) => {
  console.log(id)
  editUser({ id: id }).then((res) => {
    console.log(res)
    editFrom.id = res.data.id
    editFrom.role_id = res.data.role_id
    editFrom.role_ids = res.data.role_ids
    editFrom.login_name = res.data.login_name
    editFrom.sex = res.data.sex
    editFrom.username = res.data.username
    editFrom.phone = res.data.phone
    editFrom.area_level = res.data.area_level
    editFrom.area = res.data.area
    editFrom.school_id = -1
    editFrom.school_code = 0
    editFrom.subject_id = res.data.subject_id
    editFrom.schoolGrade = res.data.schoolGrade
    editFrom.subject_laborator = res.data.subject_laborator
    editFrom.area = res.data.area
    editFrom.phase_study_id = res.data.phase_study_id
    editFrom.pro = res.data.pro
    editFrom.city = res.data.city
    getFindArea(2, editFrom.pro, 9)
    getFindArea(3, editFrom.city, 10)
    let str = ''
    editFrom.address = str
    popState1.value = true
  })
}
const editSave = () => {
  console.log(editFrom)
  saveSchoolAccount(editFrom).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      console.log(res)
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

const options = [
  {
    value: '100',
    label: '管理员'
  },
  {
    value: '101',
    label: '学科教研员'
  }
]

const tableData = ref([])
const delIds = ref('')

const downloadTemplate = (url: string) => {
  window.location.href = BASE_URL + url
}
const exportdata = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(BASE_URL + '/swrserveadmin/User/exportUserqy', { ...pageData, token }, { responseType: 'blob' })
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
  formdata.append('role_id', '100')
  formdata.append('school_id', '-1')

  uploadfile(formdata).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      console.log(res)
      getList()
      ElMessage({
        type: 'success',
        message: '导入成功!'
      })
    }
  })
}
const selChangeAll = (selection: any) => {
  console.log(JSON.parse(JSON.stringify(selection)))
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
  console.log(`current page: ${val}`)
  pageData.page = val
  getList()
}
// 操作
const rePassword = (id: any) => {
  if (!id) {
    ElMessage({
      type: 'error',
      message: '请选择要重置的数据'
    })
  } else {
    console.log(id)
    ElMessageBox.confirm('确定重置选择账号的登录密码!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        rePsw({ id: id }).then((res) => {
          console.log(res)
          if (res.code === 10) {
            getList()
            ElMessage({
              type: 'success',
              message: '重置成功!'
            })
          } else {
            ElMessage({
              type: 'error',
              message: '重置失败!'
            })
          }
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}
// 删除
const delAccount = (id: any) => {
  if (!id) {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据'
    })
  } else {
    console.log(id)
    ElMessageBox.confirm('删除账号将清空账号的所有数据!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        delUser({ id: id }).then((res) => {
          console.log(res)
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
    console.log(res)
    console.log(tableData)
    tableData.value = res.data.data
    console.log(tableData.value)
    total.value = res.data.total
  })
}
// 初始获取列表
getList()
const selChange = (selection: any) => {
  selection = selection.map((item: any) => item.id)
  delIds.value = selection
  console.log(delIds.value)
}
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
    height: 180px;
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
      height: 120px;
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
  div {
    margin-right: 12px;
  }
  // justify-content: space-between;
}
</style>
