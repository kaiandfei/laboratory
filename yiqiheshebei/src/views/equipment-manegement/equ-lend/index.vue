<template>
  <header>
    <span>
      设备管理 > 出借登记
      <span v-show="addShow">> 新增出借登记</span>
    </span>
  </header>
  <main v-show="!addShow">
    <div class="sel-box">
      <div class="operation">
        <span>设备出借登记情况</span>
        <div class="button-box">
          <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="btn_z green-btn" @click="exportExcel">
            导出
          </div>
          <div v-if="![1].includes(store.state.login.userInfo.role_id)" class="btn_z green-btn" @click="openAdd">
            新增出借登记
          </div>
        </div>
      </div>
      <div class="screen">
        <!-- <div class="sel-l">
          <div class="sel-item">
            <span>年纪:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="Select">
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
            <span>班级:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div> -->
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="selMsg.keyword" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon">
                  <img src="@assets/images/account-school/search.png" @click="getEquLendList" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div v-if="false" class="del-res">
      <!-- <span>当前共查询到</span>
      <span class="green-t">12000</span>
      <span>名教师</span> -->
      <!-- <div class="btn green-btn">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div> -->
      <!-- <div @click="delStu(delIds)" class="btn green-btn">
        <img src="@assets/images/account-school/w-del.png" alt="" />
        批量删除
      </div> -->
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      :cell-style="cellStyle"
      row-key="id"
      :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
      @sort-change="sortChange"
    >
      <el-table-column align="left" width="30" />
      <!-- <el-table-column align="left" type="index" label="序号" min-width="5" /> -->
      <el-table-column align="left" prop="record_number" label="借单号" width="150" show-overflow-tooltip />
      <el-table-column align="left" prop="lender" label="出借人" width="100" show-overflow-tooltip />
      <el-table-column align="left" label="出借设备信息" show-overflow-tooltip width="130">
        <template #default="scope">
          <span v-show="scope.row.record_number">
            {{ scope.row.species + '种、' + scope.row.total + '个' }}
          </span>
          <span>
            {{
              scope.row.name +
              '(资产编号：' +
              scope.row.asset_number +
              ')' +
              (scope.row.specification ? '(规格：' : '') +
              scope.row.specification +
              (scope.row.specification ? ')' : '') +
              '(数量：' +
              scope.row.total +
              '个）'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="lend_desc" label="出借备注" width="100" show-overflow-tooltip />
      <el-table-column
        align="left"
        prop="plan_end_time"
        label="预计归还时间"
        width="130"
        show-overflow-tooltip
        sortable="custom"
      >
        <template #default="scope">
          {{ scope.row.plan_end_time?.split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column align="left" prop="end_time" label="实际归还时间" width="160" show-overflow-tooltip />
      <el-table-column align="left" label="归还状态" prop="status" width="100" show-overflow-tooltip sortable="custom">
        <template #default="scope">
          <div v-show="!scope.row.list">
            <span v-show="scope.row.status === 1">{{ '未归还' }}</span>
            <span v-show="scope.row.status === 2">
              {{ '部分归还' }}
            </span>
            <span v-show="scope.row.status === 3">
              {{ '全部归还' }}
            </span>
          </div>
          <div v-show="scope.row.list">
            <div v-show="scope.row.status === 3">
              <span>{{ '已归还' }}</span>
            </div>
            <div v-show="scope.row.status === 2">
              <span>{{ '部分归还' }}</span>
            </div>
            <div v-show="scope.row.status === 1">
              <span>{{ '未归还' }}</span>
            </div>
            <!-- <div v-show="scope.row.list && scope.row.return_total === 0">
                <span v-show="scope.row.status === 0">{{ '未归还' }}</span>
                <span v-show="scope.row.status === 1">{{ '未归还(已转维修)' }}</span>
                <span v-show="scope.row.status === 2">{{ '未归还(已转保养)' }}</span>
                <span v-show="scope.row.status === 3">{{ '未归还(已转报废)' }}</span>
                <span v-show="scope.row.status === 4">{{ '未归还(已转损坏)' }}</span>
              </div> -->
          </div>
          <!-- <div v-show="!scope.row.record_number">
            <div v-show="(scope.row.status = scope.row.total)">
              <span>{{ '已归还' }}</span>
            </div>
            <div v-show="scope.row.return_total < scope.row.total">
              <span>{{ '部分归还' }}</span>
            </div>
            <div v-show="scope.row.return_total === 0">
              <span v-show="scope.row.status === 0">{{ '未归还' }}</span>
              <span v-show="scope.row.status === 1">{{ '未归还(已转维修)' }}</span>
              <span v-show="scope.row.status === 2">{{ '未归还(已转保养)' }}</span>
              <span v-show="scope.row.status === 3">{{ '未归还(已转报废)' }}</span>
              <span v-show="scope.row.status === 4">{{ '未归还(已转损坏)' }}</span>
            </div>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="登记时间"
        prop="create_time"
        width="160"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column align="left" label="登记人" prop="user_name" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="借单状态" prop="is_del" width="100" show-overflow-tooltip>
        <template #default="scope">
          <div v-show="scope.row.record_number">
            <span v-show="scope.row.status !== 3" style="color: #de4747">
              {{ '未结束' }}
            </span>
            <span v-show="scope.row.status === 3" style="color: #333333">{{ '已结束' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" props="address" label="操作" width="260">
        <template #default="scope">
          <div class="operation-box" v-show="scope.row.record_number">
            <div @click="operate(scope.row.id, 1)">
              <img src="@assets/images/common/search-green.png" alt="" />
              <span>查看详情</span>
            </div>
            <!-- <div @click="rePassword(props)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div> -->
            <div
              v-if="![1].includes(store.state.login.userInfo.role_id)"
              v-show="scope.row.status !== 3"
              style="color: #05c65d; float: right; cursor: pointer"
              @click="revertEqu(scope.row.id)"
            >
              归还
            </div>
            <!-- <div
              v-if="![1].includes(store.state.login.userInfo.role_id)"
              v-show="scope.row.status === 3"
              style="color: #626572; float: right"
            >
              归还
            </div> -->
            <div
              v-if="![1].includes(store.state.login.userInfo.role_id) && scope.row.status === 3"
              @click="operate(scope.row.id, 2)"
            >
              <img src="@assets/images/common/del-red.png" alt="" />
              <span>删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <el-pagination
        v-model:currentPage="selMsg.page"
        :page-size="15"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </footer>
  </main>
  <main v-show="addShow">
    <div class="sel-box">
      <div class="operation">
        <span>新增设备出借登记</span>
      </div>
      <div class="screen">
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="selFrom.keyword" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon">
                  <img src="@assets/images/account-school/search.png" @click="getEquAll" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="add_box">
      <div class="add_card">
        <p>出借登记卡</p>
        <el-form :model="addLend" label-width="150px" style="width: 70%">
          <el-form-item class="is-required" label="出借人:">
            <el-select v-model="addLend.lender_id" filterable placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
                @click="lenderSel(item)"
              />
            </el-select>
            <!-- <el-input v-model="ruleForm.put.username"></el-input> -->
          </el-form-item>
          <el-form-item class="is-required" label="出借时间:">
            <el-date-picker
              value-format="YYYY-MM-DD"
              v-model="addLend.start_time"
              type="date"
              placeholder="请选择时间"
            />
          </el-form-item>
          <el-form-item class="is-required" label="预计归还时间:">
            <el-date-picker
              value-format="YYYY-MM-DD"
              v-model="addLend.plan_end_time"
              type="date"
              placeholder="请选择时间"
            />
          </el-form-item>
          <el-form-item label="出借备注:">
            <el-input v-model="addLend.lend_desc"></el-input>
          </el-form-item>
          <el-form-item label="清单:">
            <div v-for="(item, index) in addLend.list" :key="index">
              <span class="ts_span" :title="item.asset_number + ' - ' + item.name + ' - ' + item.specification">
                {{ item.asset_number + ' - ' + item.name + ' - ' + item.specification }}
              </span>
              <span class="ts_span1" @click="addLend.list.splice(index, 1)" style="padding-left: 20px; cursor: pointer">
                移除
              </span>
            </div>
          </el-form-item>
        </el-form>
        <p>可在右侧点击添加设备</p>
        <div class="car_foot">
          <div class="btn_z green-btn" @click="addSave">保存</div>
          <div class="btn_z green-btn" @click="addShow = false">返回</div>
        </div>
      </div>
      <div class="equ_list">
        <el-table ref="multipleTableRef" :data="tableData1" style="width: 100%" @row-click="equClick">
          <el-table-column align="left" type="index" label="序号" min-width="5" />
          <el-table-column align="left" prop="number" label="分类编号" min-width="20" show-overflow-tooltip />
          <el-table-column align="left" prop="asset_number" label="资产编号" min-width="20" show-overflow-tooltip />
          <el-table-column align="left" prop="name" label="名称" min-width="30" show-overflow-tooltip></el-table-column>
          <el-table-column align="left" prop="specification" label="规格型号" min-width="15" show-overflow-tooltip />
          <el-table-column align="left" prop="laboratory_name" label="位置" min-width="25" show-overflow-tooltip />
          <el-table-column align="left" prop="unit_price" label="单价" min-width="25" show-overflow-tooltip />
          <el-table-column align="left" label="厂家" prop="factory" min-width="15" show-overflow-tooltip />
          <el-table-column align="left" label="到期时间" prop="end_time" min-width="25" show-overflow-tooltip />
        </el-table>
        <footer>
          <el-pagination
            v-model:currentPage="selFrom.page"
            :page-size="15"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="prev, pager, next, jumper"
            :total="total1"
            @current-change="handleCurrentChange1"
          ></el-pagination>
        </footer>
      </div>
    </div>
  </main>

  <registrationDetail
    v-if="operationStatus === 1"
    :detailShow="operationStatus === 1"
    :selectInstrumentId="selectInstrumentId"
    @back="back()"
  ></registrationDetail>
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>归还登记</p>
    </template>
    <template v-slot:main>
      <div class="re_msg">
        <div class="fl">
          <el-form :model="returnEqu.bill" label-width="100px" style="width: 100%">
            <el-form-item label="出借人:">
              <span>{{ returnEqu.bill.lender }}</span>
            </el-form-item>
            <el-form-item label="出借时间:">
              <span>{{ returnEqu.bill.start_time }}</span>
            </el-form-item>
            <el-form-item label="预计归还时间:">
              <span>{{ returnEqu.bill.plan_end_time }}</span>
            </el-form-item>
            <el-form-item label="出借备注:">
              <span>{{ returnEqu.bill.lend_desc }}</span>
            </el-form-item>
            <el-form-item label="清单:">
              <div v-for="(item, index) in returnEqu.bill.list" :key="index">
                <span>{{ item.asset_number + ' - ' }}</span>
                <span>{{ item.name + ' - ' }}</span>
                <span>{{ item.laboratory_name }}</span>
                <template v-if="item.store_name">
                  <span>{{ ' - ' + item.store_name + ' - ' }}</span>
                  <span>{{ '第' + item.number_plies + '层' }}</span>
                </template>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="fl">
          <el-form :model="returnEqu.bill" label-width="100px" style="width: 100%">
            <el-form-item label="实际归还时间:">
              <el-date-picker
                value-format="YYYY-MM-DD"
                v-model="returnEqu.updata.end_time"
                type="date"
                placeholder="请选择时间"
              />
            </el-form-item>
            <el-form-item label="归还备注:">
              <el-input v-model="returnEqu.updata.return_tips"></el-input>
            </el-form-item>
            <el-form-item label="未归还清单:">
              <div v-for="(item, index) in returnEqu.bill.nuReturn" :key="index">
                <span>{{ item.asset_number + ' - ' }}</span>
                <span>{{ item.name }}</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <p class="re_p">归还仪器位置及数量清单</p>
      <div style="width: 800px">
        <el-table :data="returnEqu.updata.list">
          <el-table-column align="left" prop="asset_number" label="资产编号" min-width="20" />
          <el-table-column align="left" prop="name" label="资产编号" min-width="20" />
          <el-table-column align="left" label="仪器库" min-width="20">
            <template #default="scope">
              <el-select v-model="scope.row.laboratory_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in optionsLaboratory"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                  @click="getStoreData(item.id, scope.$index)"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="left" label="仪器柜" min-width="20">
            <template #default="scope">
              <el-select v-model="scope.row.store_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in storeListReturn[scope.$index]"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <!-- <el-table-column align="left" label="仪器柜" min-width="20">
            <template #default="scope">
              <span>{{ scope.$index }}</span>
            </template>
          </el-table-column> -->
          <el-table-column align="left" prop="name" label="层数" min-width="20">
            <template #default="scope">
              <el-select v-model="scope.row.number_plies" filterable placeholder="请选择">
                <el-option
                  v-for="item in optionPlies(scope.$index, scope.row.store_id)"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="20">
            <template #default="scope">
              <span @click="removeUpEqu(scope.$index)">移除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fl btn_z green-btn" @click="reChange(2)">归还转维修保养</div>
        <div class="fl btn_z green-btn ml-60" @click="reChange(3)">归还转报废</div>
        <div class="fl btn_z green-btn ml-60" @click="reChange(4)">归还转损坏赔偿</div>
        <div class="fr btn_z green-btn ml-60" @click="returnSure">确认归还</div>
        <div class="fr btn_z white-btn ml-60" @click="popState1 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState2" @close="popState2 = $event">
    <template v-slot:header>
      <p>归还转维保登记</p>
    </template>
    <template v-slot:main>
      <div class="re_msg" style="max-width: 440px">
        <div class="fl">
          <el-form :model="returnEqu.bill" label-width="120px" style="width: 100%">
            <el-form-item class="is-required" label="类型:">
              <el-select v-model="repair.mode" filterable placeholder="请选择" style="width: 100%">
                <el-option label="维修" :value="1" />
                <el-option label="保养" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item class="is-required" label="负责企业:">
              <el-input v-model="repair.factory"></el-input>
            </el-form-item>
            <el-form-item class="is-required" label="开始时间:">
              <el-date-picker
                value-format="YYYY-MM-DD"
                v-model="repair.start_time"
                type="date"
                placeholder="请选择时间"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item class="is-required" label="预计完成时间:">
              <el-date-picker
                value-format="YYYY-MM-DD"
                v-model="repair.plan_end_time"
                type="date"
                placeholder="请选择时间"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="损坏情况:">
              <el-input v-model="repair.desc"></el-input>
            </el-form-item>
            <el-form-item label="关联借单号:">
              <span>{{ repair.source_record_number }}</span>
            </el-form-item>
            <el-form-item label="图片：">
              <el-upload
                class="uploadImg"
                ref="upload"
                :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
                :data="fileData"
                name="image"
                :limit="3"
                list-type="picture-card"
                :on-success="uploadSuccess"
                :on-remove="handleRemove"
                accept=".jpg,.png,.jpeg"
              >
                <span>+点击上传</span>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <p class="re_p">选择需要保养的设备</p>
      <div style="max-width: 440px">
        <el-table :data="returnEqu.updata.list" @selection-change="SelectEqu">
          <el-table-column type="selection" width="55" />
          <el-table-column align="left" prop="asset_number" label="资产编号" min-width="20" />
          <el-table-column align="left" prop="name" label="名称" min-width="20" />
        </el-table>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn_z green-btn ml-60" @click="repairSave">保存</div>
        <div class="fr btn_z white-btn ml-60" @click=";(popState1 = true), (popState2 = false)">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState3" @close="popState3 = $event">
    <template v-slot:header>
      <p>归还转报废登记</p>
    </template>
    <template v-slot:main>
      <div class="re_msg" style="max-width: 440px">
        <div class="fl">
          <el-form :model="returnEqu.bill" label-width="120px" style="width: 100%">
            <el-form-item class="is-required" label="类型:">
              <el-select v-model="scrap.mode" filterable placeholder="请选择" style="width: 100%">
                <el-option label="损耗" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item class="is-required" label="报废理由:">
              <el-select v-model="scrap.cause" filterable placeholder="请选择" style="width: 100%">
                <el-option label="仪器超过使用年限、性能已不能达到实验需要的最低要求，且无法修复" :value="1" />
                <el-option label="损坏严重，无法修复" :value="2" />
                <el-option label="主要部件无处配购，无法修复使用" :value="3" />
                <el-option label="修理费昂贵，无修理价值" :value="4" />
              </el-select>
            </el-form-item>
            <el-form-item class="is-required" label="处理方式:">
              <el-select v-model="scrap.process_mode" filterable placeholder="请选择" style="width: 100%">
                <el-option label="实验室留用" :value="1" />
                <el-option label="建立废旧设备实验室" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item class="is-required" label="报废金额:">
              <el-input type="number" v-model="scrap.price"></el-input>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="scrap.desc"></el-input>
            </el-form-item>
            <el-form-item label="关联借单号:">
              <span>{{ scrap.source_record_number }}</span>
            </el-form-item>
            <el-form-item label="图片：">
              <el-upload
                class="uploadImg"
                ref="upload"
                :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
                :data="fileData"
                name="image"
                :limit="3"
                list-type="picture-card"
                :on-success="scrapUploadSuccess"
                :on-remove="scrapHandleRemove"
                accept=".jpg,.png,.jpeg"
              >
                <span>+点击上传</span>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <p class="re_p">选择需要报废的设备</p>
      <div style="max-width: 440px">
        <el-table :data="returnEqu.updata.list" @selection-change="SelectEqu">
          <el-table-column type="selection" width="55" />
          <el-table-column align="left" prop="asset_number" label="资产编号" min-width="20" />
          <el-table-column align="left" prop="name" label="名称" min-width="20" />
        </el-table>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn_z green-btn ml-60" @click="scrapSave">保存</div>
        <div class="fr btn_z white-btn ml-60" @click=";(popState1 = true), (popState3 = false)">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState4" @close="popState4 = $event">
    <template v-slot:header>
      <p>归还转损坏赔偿登记</p>
    </template>
    <template v-slot:main>
      <div class="re_msg" style="max-width: 440px">
        <div class="fl">
          <el-form :model="returnEqu.bill" label-width="120px" style="width: 100%">
            <el-form-item class="is-required" label="损坏人:">
              <el-select v-model="damage.damage_id" style="width: 100%">
                <el-option
                  v-for="item in optionUser"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                  @click="damagerSel(item)"
                ></el-option>
              </el-select>
              <!-- <el-input v-model="damage.damage_man"></el-input> -->
            </el-form-item>
            <el-form-item label="损坏情况和原因:">
              <el-input v-model="damage.desc"></el-input>
            </el-form-item>
            <el-form-item label="赔偿人:">
              <el-select v-model="damage.repay_id" style="width: 100%">
                <el-option
                  v-for="item in optionUser"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                  @click="payerSel(item)"
                ></el-option>
              </el-select>
              <!-- <el-input v-model="damage.repay_man"></el-input> -->
            </el-form-item>
            <el-form-item label="赔偿金额:">
              <el-input v-model="damage.repay_price"></el-input>
            </el-form-item>
            <el-form-item label="赔偿时间:">
              <el-date-picker
                value-format="YYYY-MM-DD"
                v-model="damage.repay_time"
                type="date"
                placeholder="请选择时间"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="赔偿说明:">
              <el-input v-model="damage.repay_desc"></el-input>
            </el-form-item>
            <el-form-item label="关联借单号:">
              <span>{{ damage.source_record_number }}</span>
            </el-form-item>
            <el-form-item label="图片：">
              <el-upload
                class="uploadImg"
                ref="upload"
                :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
                :data="fileData"
                name="image"
                :limit="3"
                list-type="picture-card"
                :on-success="damageUploadSuccess"
                :on-remove="damageHandleRemove"
                accept=".jpg,.png,.jpeg"
              >
                <span>+点击上传</span>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <p class="re_p">选择需要赔偿的设备</p>
      <div style="max-width: 440px">
        <el-table :data="returnEqu.updata.list" @selection-change="SelectEqu">
          <el-table-column type="selection" width="55" />
          <el-table-column align="left" prop="asset_number" label="资产编号" min-width="20" />
          <el-table-column align="left" prop="name" label="名称" min-width="20" />
        </el-table>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn_z green-btn ml-60" @click="damageSave">保存</div>
        <div class="fr btn_z white-btn ml-60" @click=";(popState1 = true), (popState4 = false)">取消</div>
      </div>
    </template>
  </PopCurrency>
  <!-- <returnRegistration
    v-if="operationStatus === 3"
    :returnShow="operationStatus === 3"
    :selectInstrumentId="selectInstrumentId"
    @back="back()"
  ></returnRegistration> -->
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getTeacherList } from '@/service/instrument-manage/lendRegistration/index'
import {
  getLendList,
  delEquLend,
  addEquLend,
  getEquList1,
  returnEquList,
  returnEquApi,
  returnRepairApi,
  returnScrapApi,
  returnDamageApi
} from '@service/equ-manage/lendEqu'
import { findSchoolUser } from '@/service/equ-manage/add-equ-warehouse/index'
// import { getEquList } from '@/service/equ-manage/equ-manage/index'
import registrationDetail from './component/detail.vue'
import { PopCurrency } from '@components/pop-currency'
import { getLaboratoryList } from '@/service/instrument-manage/equ-manage/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'
import { useStore } from '@store/index'
import { BASE_URL } from '@service/request/config'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'

import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()
const fileData = reactive({
  token: store.state.login.userInfo.token
})
const total: any = ref(1)
const total1: any = ref(1)
let sortData: any = reactive({})
// 实验室列表
const optionsLaboratory: any = ref([])
// 仪器柜列表
// const storeListBody: any = ref([])
// 未归还设备仪器柜列表
const storeListReturn: any = ref([])
// 获取实验室列表
getLaboratoryList({ subject: store.state.login.userInfo.subject_id }).then((res) => {
  optionsLaboratory.value = res.data.data
})
// 修改仪器柜
const getStoreData = (id: number | string, index: number) => {
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    returnEqu.updata.list[index].store_id = ''
    returnEqu.updata.list[index].number_plies = ''
    storeListReturn.value[index] = res.data
    console.log(storeListReturn.value)
  })
}
// 初次获取
const getStoreData_n = (id: number | string, index: number) => {
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    storeListReturn.value[index] = res.data
    console.log(storeListReturn.value)
  })
}
// 计算层数
// const storeListChange = computed(() => {
//   return (id: any) => {
//     console.log(id)
//     storeByLaboratory({ id: id }).then((res) => {
//       console.log(res.data)
//       return res.data
//     })
//   }
// })
let optionPlies = computed(() => {
  return (index: any, store_id: any) => {
    if (storeListReturn.value[index] !== undefined) {
      let num = 1
      storeListReturn.value[index].forEach((e: any) => {
        if (e.id === store_id) {
          num = e.number_plies
        }
      })
      let arr = Array<{
        value: number
        name: string
      }>()
      for (let i = 0; i < num; i++) {
        const obj = {
          value: i + 1,
          name: `第${i + 1}层`
        }
        arr.push(obj)
      }
      console.log(arr)
      return arr
    }
  }
})

const cellStyle = (row: any) => {
  if (!row.row.list) {
    return {
      background: '#DCECE3'
    }
  }
}
let addShow = ref(false)
const openAdd = () => {
  getEquAll()
  addShow.value = true
}
let addLend: any = reactive({
  lender: '',
  lender_id: '',
  type: 2,
  lend_desc: '',
  start_time: '',
  plan_end_time: '',
  list: [],
  pic: []
})
//添加图片
const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  repair.pic = urlData
}

//移除图片
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  repair.pic = urlData
}
//添加图片
const scrapUploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  scrap.pic = urlData
}

//移除图片
const scrapHandleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  scrap.pic = urlData
}
//添加图片
const damageUploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  damage.pic = urlData
}

//移除图片
const damageHandleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  damage.pic = urlData
}
const lenderSel = (item: any) => {
  console.log(item)
  addLend.lender = item.username
}
const addSave = () => {
  if (!addLend.lender_id) {
    ElMessage({
      type: 'warning',
      message: '请选择出借人'
    })
    return
  }
  if (!addLend.start_time) {
    ElMessage({
      type: 'warning',
      message: '请选择出借时间'
    })
    return
  }
  if (!addLend.plan_end_time) {
    ElMessage({
      type: 'warning',
      message: '请选择预计归还时间'
    })
    return
  }
  if (addLend.list.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择设备'
    })
    return
  }
  addEquLend(addLend).then((res) => {
    if (res.code === 10) {
      addShow.value = false
      getEquLendList()
      addLend.lender_id = ''
      addLend.lend_desc = ''
      addLend.start_time = ''
      addLend.plan_end_time = ''
      addLend.list = []
    }
  })
}
const userList: any = ref([])
findSchoolUser().then((res) => {
  console.log('111')
  console.log(res)
  userList.value = res.data
})
// 选择设备
const equClick = (e: any) => {
  console.log(JSON.stringify(addLend.list).indexOf(JSON.stringify(e)))
  if (JSON.stringify(addLend.list).indexOf(JSON.stringify(e)) !== -1) {
    ElMessageBox.alert('当前设备已在领用清单中!', '提示', {
      confirmButtonText: '确认'
    })
  } else {
    e.instrument_id = e.id
    e.hardware_number = e.number
    addLend.list.push(JSON.parse(JSON.stringify(e)))
  }
}
// let loanValue = ref('')
let operationStatus = ref(0)
let selectInstrumentId = ref(0)
// const input1 = ref('')
const tableData: any = ref([])
const tableData1: any = ref([])
const selFrom = reactive({
  page: 1,
  keyword: '',
  category_id: ''
})
let selMsg = reactive({
  page: 1,
  keyword: ''
})

const getEquAll = () => {
  getEquList1(selFrom).then((res) => {
    console.log(res.data)
    tableData1.value = res.data.data
    total1.value = res.data.total
    console.log(tableData1.value)
  })
}
getEquAll()

const getEquLendList = () => {
  tableData.value = []
  let params = { ...selMsg, ...sortData }
  getLendList(params).then((res: any) => {
    console.log('数据', res)

    tableData.value = res.data.data
    console.log('数据胡', tableData.value)

    total.value = parseInt(res.data.total)
  })
}
getEquLendList()

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolEquipmentLend/equipmentLendList',
      { token, ...selMsg, ...sortData, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '设备出借登记.xlsx'
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

// const delIds = ref('')
// const selChange = (selection: any, row: any) => {
//   console.log(JSON.parse(JSON.stringify(selection)))
//   console.log(row)
//   let ids = ''
//   JSON.parse(JSON.stringify(selection)).forEach((e: { id: any }) => {
//     ids = ids + JSON.stringify(e.id) + ','
//   })
//   delIds.value = ids
// }
// const selChangeAll = (selection: any) => {
//   console.log(JSON.parse(JSON.stringify(selection)))
//   let ids = ''
//   JSON.parse(JSON.stringify(selection)).forEach((e: { id: any }) => {
//     ids = ids + JSON.stringify(e.id) + ','
//   })
//   delIds.value = ids
// }
// const delStu = (id: any) => {
//   ElMessageBox.confirm('缺人删除当前学生!', '警告', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'error'
//   })
//     .then(() => {
//       // delStudent({ id: id }).then((res) => {
//       //   console.log(res)
//       //   getStudentList()
//       //   if (res.code === 10) {
//       //     ElMessage({
//       //       type: 'success',
//       //       message: '删除成功!'
//       //     })
//       //   } else {
//       //     ElMessage({
//       //       type: 'error',
//       //       message: '删除失败!'
//       //     })
//       //   }
//       // })
//     })
//     .catch(() => {
//       console.log('取消操作')
//     })
// }

const operate = (id: number, status: number) => {
  operationStatus.value = status
  selectInstrumentId.value = id
  if (status === 2) {
    ElMessageBox.confirm('确定删除此记录，删除后无法撤销', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        delEquLend({ id: id }).then((res) => {
          if (res.code === 10) {
            ElMessage({
              type: 'success',
              message: '删除成功!'
            })
            getEquLendList()
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
      .catch(() => {
        console.log('')
      })
  }
}
// 归还相关
const popState1 = ref(false)
const popState2 = ref(false)
const repair = reactive({
  status: 1,
  type: 2,
  mode: 1,
  factory: '',
  start_time: '',
  plan_end_time: '',
  desc: '',
  source_record_number: '',
  pic: [],
  list: []
})
const popState3 = ref(false)
const scrap = reactive({
  status: 1,
  price: 0,
  type: 2,
  mode: 1,
  cause: 1,
  process_mode: 1,
  desc: '',
  source_type: 2,
  source_record_number: '',
  pic: [],
  list: []
})
const popState4 = ref(false)
const damage = reactive({
  status: 1,
  type: 2,
  repay_man: '',
  repay_id: '',
  repay_time: '',
  repay_desc: '',
  damage_man: '',
  damage_id: '',
  repay_price: '',
  desc: '',
  source_type: 2,
  source_record_number: '',
  pic: [],
  list: []
})
const SelectEqu = (val: any) => {
  console.log(JSON.parse(JSON.stringify(val)))
  if (popState2.value) {
    repair.list = JSON.parse(JSON.stringify(val))
  }
  if (popState3.value) {
    scrap.list = JSON.parse(JSON.stringify(val))
  }
  if (popState4.value) {
    damage.list = JSON.parse(JSON.stringify(val))
  }
}
const reChange = (value: number) => {
  popState1.value = false
  if (value === 2) {
    popState2.value = true
    repair.source_record_number = returnEqu.bill.record_number
  } else if (value === 3) {
    popState3.value = true
    scrap.source_record_number = returnEqu.bill.record_number
  } else if (value === 4) {
    popState4.value = true
    damage.source_record_number = returnEqu.bill.record_number
  }
}
const returnEqu: any = reactive({
  bill: {},
  updata: {
    end_time: '',
    id: '',
    status: 1,
    return_tips: '',
    list: []
  }
})
// 确认归还
const returnSure = () => {
  if (returnEqu.updata.list.length < returnEqu.bill.nuReturn.length) {
    returnEqu.updata.status = 2
  } else {
    returnEqu.updata.status = 3
  }
  returnEquApi(returnEqu.updata).then((res: any) => {
    console.log(res)
    if (res.code === 10) {
      popState1.value = false
      getEquLendList()
    }
  })
}
// 维修保存
const repairSave = () => {
  if (!repair.mode) {
    ElMessage({
      type: 'warning',
      message: '请选择类型'
    })
    return
  }
  if (!repair.factory) {
    ElMessage({
      type: 'warning',
      message: '请输入负责企业'
    })
    return
  }
  if (!repair.start_time) {
    ElMessage({
      type: 'warning',
      message: '请选择开始时间'
    })
    return
  }
  if (!repair.plan_end_time) {
    ElMessage({
      type: 'warning',
      message: '请选择预计完成时间'
    })
    return
  }
  if (repair.list.length < returnEqu.bill.nuReturn.length) {
    repair.status = 2
  } else {
    repair.status = 3
  }
  returnRepairApi(repair).then((res: any) => {
    console.log(res)
    if (res.code === 10) {
      popState2.value = false
      popState1.value = true
      revertEqu(returnEqu.updata.id)
    }
  })
}
// 报废保存
const scrapSave = () => {
  if (!scrap.mode) {
    ElMessage({
      type: 'warning',
      message: '请选择类型'
    })
    return
  }
  if (!scrap.cause) {
    ElMessage({
      type: 'warning',
      message: '请选择报废理由'
    })
    return
  }
  if (!scrap.process_mode) {
    ElMessage({
      type: 'warning',
      message: '请选择处理方式'
    })
    return
  }
  if (scrap.list.length < returnEqu.bill.nuReturn.length) {
    scrap.status = 2
  } else {
    scrap.status = 3
  }
  returnScrapApi(scrap).then((res: any) => {
    console.log(res)
    if (res.code === 10) {
      popState3.value = false
      popState1.value = true
      revertEqu(returnEqu.updata.id)
    }
  })
}
// 损坏赔偿保存
const damageSave = () => {
  if (!damage.damage_man) {
    ElMessage({
      type: 'warning',
      message: '请输入损坏人'
    })
    return
  }
  if (damage.list.length < returnEqu.bill.nuReturn.length) {
    damage.status = 2
  } else {
    damage.status = 3
  }
  returnDamageApi(damage).then((res: any) => {
    console.log(res)
    if (res.code === 10) {
      popState4.value = false
      popState1.value = true
      revertEqu(returnEqu.updata.id)
    }
  })
}

const removeUpEqu = (index: any) => {
  storeListReturn.value.splice(index, 1)
  returnEqu.updata.list.splice(index, 1)
}
// 归还单据详情获取
const revertEqu = (id: any) => {
  if (popState1.value) {
    console.log(1)
    getEquLendList()
  }
  returnEquList({ id: id }).then((res) => {
    console.log(res.data)
    returnEqu.bill = res.data
    returnEqu.updata.list = JSON.parse(JSON.stringify(returnEqu.bill.nuReturn))
    returnEqu.updata.id = returnEqu.bill.id
    console.log(returnEqu)
    returnEqu.updata.list.forEach((e: any, index: number) => {
      getStoreData_n(e.laboratory_id, index)
    })
  })
  popState1.value = true
}
// 分页
// const currentPage3 = ref(1)
// const pageSize3 = ref(100)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
// const handleSizeChange = (val: number) => {
//   console.log(`${val} items per page`)
// }
const handleCurrentChange = (val: number) => {
  selMsg.page = val
  getEquLendList()
}
const handleCurrentChange1 = (val: number) => {
  selFrom.page = val
  getEquAll()
}
// 操作
// const rePassword = (val: any) => {
//   console.log(val)
// }
const back = () => {
  operationStatus.value = 0
  getEquLendList()
}
const optionUser: any = ref([])
const school_id: any = ref(0)

school_id.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.school_id
const getOptionUser = () => {
  getTeacherList({ id: school_id.value }).then((res) => {
    optionUser.value = res.data
  })
}
getOptionUser()
// 获取损坏用户id对应的用户名
const damagerSel = (data: any) => {
  damage.damage_man = data.username
}

// 获取赔偿人用户id对应的用户名
const payerSel = (data: any) => {
  damage.repay_man = data.username
}
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    getEquLendList()
    console.log(column, prop, order)
  }
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-weight: 400;
  line-height: 30px;

  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}

main {
  width: 100%;

  & ::v-deep .el-table .el-table__header .el-table__cell {
    padding: 12px 0;
  }

  & ::v-deep .el-table .el-table__row .el-table__cell {
    padding: 12px 0;
  }

  .sel-box {
    margin: 10px 0;
    width: 100%;

    .operation {
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.16);

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

.add_box {
  margin-top: 60px;
}

.add_card {
  float: left;
  width: 30%;
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

  & > p {
    height: 40px;
    line-height: 40px;
    color: #848484;
  }

  .car_foot {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-around;

    & > div {
      width: 30%;
    }
  }

  :deep(.el-input) {
    width: 240px;
  }
}

.equ_list {
  float: right;
  width: 68%;
  height: 200px;
}

.re_msg:after {
  content: '';
  clear: left;
  display: block;
}

.re_p {
  font-size: 16px;
  color: #848484;
}

.ts_span {
  float: left;
  white-space: nowrap; //使文本单行显示
  text-overflow: ellipsis; //多余的部分用省略号来代替
  overflow: hidden; // 隐藏多余的部分
  width: 60%;
  height: 40px;
}

.ts_span1 {
  float: right;
  height: 40px;
}
.uploadImg {
  text-align: left;
}
</style>
