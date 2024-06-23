<template>
  <div>
    <header>
      <div class="fl">
        <span>设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>设备库存总览</span>
      </div>
    </header>
    <div class="sel-box">
      <div class="operation">
        <span>设备库存总览</span>
        <div class="button-box">
          <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="btn green-btn" @click="exportExcel">
            导出
          </div>

          <!-- <div class="btn green-btn" @click="popState = true">+ 新增区域</div> -->
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出教师
          </div> -->
          <!-- <div class="btn green-btn" @click="addPurchase">新建危化品采购</div> -->
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>类型:</span>
            <div class="sel">
              <el-cascader
                v-model="selFrom.category_id"
                :options="optionsType"
                :props="casProps"
                :show-all-levels="false"
              ></el-cascader>
              <!-- <el-select v-model="selFrom.category_id" placeholder="" @change="cateChange">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in optionsType" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select> -->
            </div>
          </div>
          <div class="sel-item">
            <span>当前状态:</span>
            <div class="sel">
              <el-select v-model="selFrom.status" placeholder="" @change="cateChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="正常" value="1"></el-option>
                <el-option label="出借" value="2"></el-option>
                <el-option label="维修保养" value="3"></el-option>
                <el-option label="报废" value="4"></el-option>
                <el-option label="损坏" value="5"></el-option>
                <el-option label="闲置" value="6"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <!-- <el-input v-model="selFrom.keyword"></el-input>
          <span @click="getEquAll">搜索</span> -->
          <div class="mt-4">
            <el-input v-model="selFrom.keyword" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="getEquAll">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- <div class="recommend">
        <div class="filter-box">
          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
        </div>
      </div> -->
      <div class="statistics">
        <div class="item">
          <div class="l-item">
            <div ref="echarts1"></div>
          </div>
          <div class="r-item">
            <p>总库存</p>
            <p>{{ Number(List.inventory) }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item">
            <div ref="echarts2"></div>
          </div>
          <div class="r-item">
            <p>出借</p>
            <p>{{ List.lend }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item">
            <div ref="echarts3"></div>
          </div>
          <div class="r-item">
            <p>维修保养</p>
            <p>{{ List.maintenance }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item">
            <div ref="echarts4"></div>
          </div>
          <div class="r-item">
            <p>报废</p>
            <p>{{ List.scrap }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item">
            <div ref="echarts5"></div>
          </div>
          <div class="r-item">
            <p>闲置</p>
            <p>{{ List.inIdle }}</p>
          </div>
        </div>
      </div>
      <!-- <div class="statistics">
        <div class="item">
          <div class="l-item"></div>
          <div class="r-item">
            <p>总库存</p>
            <p>{{ List.inventory }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item"></div>
          <div class="r-item">
            <p>出借</p>
            <p>{{ List.lend }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item"></div>
          <div class="r-item">
            <p>维修保养</p>
            <p>{{ List.maintenance }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item"></div>
          <div class="r-item">
            <p>报废</p>
            <p>{{ List.scrap }}</p>
          </div>
        </div>
      </div> -->
      <div class="content">
        <el-table
          :data="List.data"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          @sort-change="sortChange"
        >
          <el-table-column type="index" prop="" label="序号" width="60" align="left"></el-table-column>
          <el-table-column
            prop="number"
            label="分类编号"
            align="left"
            show-overflow-tooltip
            sortable="custom"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="asset_number"
            label="资产编号"
            align="left"
            show-overflow-tooltip
            sortable="custom"
            width="100"
          ></el-table-column>
          <el-table-column prop="name" label="名称" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specification" label="规格型号" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unit" label="单位" align="left" show-overflow-tooltip width="80"></el-table-column>
          <el-table-column prop="user_num" label="状态" align="left" show-overflow-tooltip width="80">
            <template #default="scope">
              <span>
                {{ ['正常', '出借', '维修保养', '报废', '损坏', '闲置'][scope.row.status - 1] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="laboratory_name" label="位置" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="laboratory_name" label="责任人" align="left" show-overflow-tooltip>
            <template #default="scope">
              <span v-for="item in scope.row.user" :key="item.user_id">
                {{ item.user_name + ' ' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" align="left" show-overflow-tooltip>
            <template #default="scope">
              <span v-for="item in scope.row.category" :key="item.title">
                {{ item.title + ' ' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unit_price"
            label="单价"
            align="left"
            show-overflow-tooltip
            sortable="custom"
            width="80"
          ></el-table-column>
          <el-table-column prop="factory" label="产地" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="bacth"
            label="采购批次"
            align="left"
            show-overflow-tooltip
            sortable="custom"
            width="100"
          ></el-table-column>
          <el-table-column prop="end" label="到期时间" align="left" show-overflow-tooltip sortable="custom" width="100">
            <template #default="scope">
              <span :style="{ color: endColor(scope.row.end) }">{{ scope.row.end }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <div class="click-box">
                <span
                  v-if="
                    ![1].includes(store.state.login.userInfo.role_id) &&
                    scope.row.status !== 6 &&
                    scope.row.status !== 1
                  "
                  class=""
                ></span>
                <span
                  v-if="![1].includes(store.state.login.userInfo.role_id) && scope.row.status === 1"
                  class="click-text green"
                  @click="operate(scope.row, 4)"
                >
                  闲置
                </span>
                <span
                  v-if="![1].includes(store.state.login.userInfo.role_id) && scope.row.status === 6"
                  class="click-text green"
                  @click="operate(scope.row, 5)"
                >
                  启用
                </span>
                <span
                  v-if="![1].includes(store.state.login.userInfo.role_id)"
                  class="click-text green"
                  @click="operate(scope.row, 1)"
                >
                  <!-- <img src="@assets/images/laboratory-standard/edit.png" alt="" /> -->
                  调拨
                </span>
                <span
                  v-if="![1].includes(store.state.login.userInfo.role_id)"
                  class="click-text green"
                  @click="operate(scope.row, 2)"
                >
                  编辑
                </span>
                <span class="click-text green" @click="operate(scope.row, 3)">详情</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-block">
        <el-pagination
          v-model:currentPage="currentPage"
          :page-size="10"
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <PopCurrency :popShow="popState1" @close="popState1 = $event">
        <template v-slot:header>
          <p>调拨</p>
        </template>
        <template v-slot:main>
          <div class="re_msg">
            <div class="fl">
              <el-form :model="selEqudata.data" label-width="150px" style="width: 100%">
                <el-form-item label="分类编号:">
                  <span class="fl">{{ selEqudata.data.number }}</span>
                  <!-- <el-input v-model="selEqudata.data.number"></el-input> -->
                </el-form-item>
                <el-form-item label="资产编号:">
                  <span class="fl">{{ selEqudata.data.asset_number }}</span>
                  <!-- <el-input v-model="selEqudata.data.asset_number"></el-input> -->
                </el-form-item>
                <el-form-item label="名称:">
                  <span class="fl">{{ selEqudata.data.name }}</span>
                  <!-- <el-input v-model="selEqudata.data.name"></el-input> -->
                </el-form-item>
                <el-form-item label="规格型号:">
                  <span class="fl">{{ selEqudata.data.specification }}</span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <el-form-item class="is-required" label="调拨方式:">
                  <el-select class="fl" v-model="selEqudata.allocation.mode" filterable placeholder="请选择">
                    <el-option label="移库" :value="1" />
                    <!-- <el-option label="跨学科调拨" :value="2" />
                    <el-option label="跨学校调拨" :value="3" /> -->
                  </el-select>
                </el-form-item>
                <el-form-item label="调出位置:">
                  <span class="fl">
                    {{ selEqudata.data.location }}
                    <!-- +
                      '-' +
                      selEqudata.data.store_name +
                      '-第' +
                      selEqudata.data.number_plies +
                      '层' -->
                  </span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <el-form-item label="调拨凭证号:">
                  <!-- <span>{{selEqudata.data.specification}}</span> -->
                  <el-input v-model="selEqudata.allocation.record_number"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="存放位置：" prop="">
                  <el-select v-model="selEqudata.allocation.list[1].school_laboratory_id">
                    <el-option
                      v-for="(item1, index) in optionsLaboratory"
                      :key="index"
                      :label="item1.title"
                      :value="item1.id"
                      @click="getStoreData(item1.id, item1.title)"
                    ></el-option>
                  </el-select>
                  <el-select v-model="selEqudata.allocation.list[1].store_id" placeholder="">
                    <el-option
                      v-for="item1 in storeListBody"
                      :key="item1.id"
                      :label="item1.title"
                      :value="item1.id"
                      @click="number_plies = item1.number_plies"
                    ></el-option>
                  </el-select>
                  <el-select v-model="selEqudata.allocation.list[1].number_plies" placeholder="">
                    <el-option
                      v-for="n in optionPlies(number_plies)"
                      :key="n.value"
                      :label="n.name"
                      :value="n.value"
                    ></el-option>
                  </el-select>
                  <!-- <el-input v-model="item.number" placeholder="输入入库数量"></el-input> -->
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z green-btn ml-60" @click="allocationSave">保存</div>
            <div class="fr btn_z white-btn ml-60" @click="popState1 = false">取消</div>
          </div>
        </template>
      </PopCurrency>
      <PopCurrency :popShow="popState2" @close="popState2 = $event">
        <template v-slot:header>
          <p>编辑</p>
        </template>
        <template v-slot:main>
          <div class="re_msg">
            <div class="fl">
              <el-form
                :model="selEqudata.data"
                ref="editRef"
                label-width="150px"
                style="width: 400px; float: left"
                :rules="rules"
              >
                <el-form-item label="设备状态:">
                  <span class="fl">
                    {{ ['正常', '出借', '维修保养', '报废', '损坏', '闲置'][selEqudata.data.status - 1] }}
                  </span>
                </el-form-item>
                <el-form-item label="分类编号:">
                  <span class="fl">{{ selEqudata.data.number }}</span>
                  <!-- <el-input v-model="selEqudata.data.number"></el-input> -->
                </el-form-item>
                <el-form-item label="资产编号:" prop="asset_number">
                  <el-input v-model="selEqudata.data.asset_number" maxlength="25"></el-input>
                </el-form-item>
                <el-form-item label="名称:">
                  <span class="fl">{{ selEqudata.data.name }}</span>
                  <!-- <el-input v-model="selEqudata.data.name"></el-input> -->
                </el-form-item>
                <el-form-item label="规格型号:">
                  <span class="fl">{{ selEqudata.data.specification }}</span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <el-form-item label="库存位置:">
                  <span class="fl">{{ selEqudata.data.location }}</span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <el-form-item label="来源:">
                  <span class="fl">{{ ['采集', '自制', '馈赠', '自购', '调拨'][selEqudata.data.source - 1] }}</span>
                  <!-- <el-select class="fl" v-model="selEqudata.data.source" filterable placeholder="请选择">
                    <el-option label="采集" :value="1" />
                    <el-option label="自制" :value="2" />
                    <el-option label="馈赠" :value="3" />
                    <el-option label="自购" :value="3" />
                    <el-option label="调拨" :value="3" />
                  </el-select> -->
                </el-form-item>
                <el-form-item label="批次:">
                  <span class="fl">{{ selEqudata.data.bacth }}</span>
                  <!-- <el-input v-model="selEqudata.data.bacth"></el-input> -->
                </el-form-item>
                <el-form-item label="厂家:">
                  <span class="fl">{{ selEqudata.data.factory }}</span>
                  <!-- <el-input v-model="selEqudata.data.factory"></el-input> -->
                </el-form-item>
                <el-form-item label="单价:">
                  <span class="fl">{{ selEqudata.data.unit_price }}</span>
                  <!-- <el-input v-model="selEqudata.data.unit_price"></el-input> -->
                </el-form-item>
              </el-form>
              <el-form :model="selEqudata.data" label-width="150px" style="width: 400px; float: left">
                <el-form-item label="到期时间:">
                  <span class="fl">{{ selEqudata.data.end_time }}</span>
                  <!-- <el-date-picker
                    v-model="selEqudata.data.end_time"
                    type="date"
                    placeholder="Pick a day"
                    value-format="YYYY-MM-DD"
                  /> -->
                </el-form-item>
                <el-form-item label="负责人" prop="">
                  <el-select
                    v-model="selEqudata.data.user[0].id"
                    filterable
                    placeholder="请选择负责人"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.username"
                      :value="item.id"
                      @click="selUser(item)"
                    />
                  </el-select>
                  <!-- <el-input v-model="ruleForm.put.username"></el-input> -->
                </el-form-item>
                <el-form-item label="设备照片" prop="">
                  <el-upload
                    class="uploadImg"
                    ref="upload"
                    :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
                    :data="fileData"
                    name="image"
                    :limit="3"
                    :file-list="fileList1"
                    list-type="picture-card"
                    :on-success="uploadSuccess"
                    :on-remove="handleRemove"
                    :before-upload="beforeAvatarUpload"
                    accept=".jpg,.png,.jpeg"
                  >
                    <span>+点击上传</span>
                  </el-upload>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z green-btn ml-60" @click="editSave(editRef)">保存</div>
            <div class="fr btn_z white-btn ml-60" @click="popState2 = false">取消</div>
          </div>
        </template>
      </PopCurrency>
      <PopCurrency :popShow="popState3" @close="popState3 = $event">
        <template v-slot:header>
          <p>查看详情</p>
        </template>
        <template v-slot:main>
          <div class="re_msg1">
            <div class="fl">
              <el-form label-width="150px" style="width: 400px; float: left">
                <el-form-item label="分类编号:">
                  <span class="fl">{{ selEqudata.data.number }}</span>
                  <!-- <el-input v-model="selEqudata.data.number"></el-input> -->
                </el-form-item>
                <el-form-item label="资产编号:">
                  <span class="fl">{{ selEqudata.data.asset_number }}</span>
                  <!-- <el-input v-model="selEqudata.data.asset_number"></el-input> -->
                </el-form-item>
                <el-form-item label="名称:">
                  <span class="fl">{{ selEqudata.data.name }}</span>
                  <!-- <el-input v-model="selEqudata.data.name"></el-input> -->
                </el-form-item>
                <el-form-item label="规格型号:">
                  <span class="fl">{{ selEqudata.data.specification }}</span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <el-form-item label="库存位置:">
                  <span class="fl">
                    {{ selEqudata.data.location ? selEqudata.data.location : '/' }}
                    {{ selEqudata.data.store_name ? '-' + selEqudata.data.store_name : '' }}
                    {{ selEqudata.data.number_plies ? '-第' + selEqudata.data.number_plies + '层' : '' }}
                  </span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <!-- <el-form-item label="标准分类:">
                  <span class="fl">{{ ['Ⅰ类', 'Ⅱ类', 'Ⅲ类'][selEqudata.data.level - 1] }}</span>
                </el-form-item> -->
                <el-form-item label="来源:">
                  <span class="fl">
                    {{
                      ['期初建账', '集采', '自制', '馈赠', '自购', '调拨', '盘点', '损耗报废', '损坏赔偿'][
                        selEqudata.data.source
                      ]
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="批次:">
                  <span class="fl">{{ selEqudata.data.bacth }}</span>
                </el-form-item>
                <el-form-item label="产地（厂家）:">
                  <span class="fl">{{ selEqudata.data.factory }}</span>
                </el-form-item>
                <el-form-item label="单价:">
                  <span class="fl">{{ selEqudata.data.unit_price }}</span>
                </el-form-item>
                <el-form-item label="到期时间:">
                  <span class="fl">{{ selEqudata.data.end_time }}</span>
                </el-form-item>
                <el-form-item label="负责人:">
                  <span class="fl">{{ selEqudata.data.user[0].name }}</span>
                </el-form-item>
                <el-form-item label="设备照片:">
                  <img
                    class="pictureCss"
                    v-for="(item, index) in selEqudata.data.picture"
                    :key="index"
                    :src="item.url"
                    alt=""
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" style="width: 400px; float: left">
                <el-form-item label="设备状态:">
                  <span class="fl">
                    {{ ['正常', '出借', '维修保养', '报废', '损坏'][selEqudata.data.status - 1] }}
                  </span>
                </el-form-item>
                <el-form-item label="资产二维码:">
                  <img class="img_cc" :src="selEqudata.data.qr_code" alt="" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z white-btn ml-60" @click="popState3 = false">取消</div>
          </div>
        </template>
      </PopCurrency>
      <PopCurrency :popShow="popState4" @close="popState4 = $event">
        <template v-slot:header>
          <p>闲置</p>
        </template>
        <template v-slot:main>
          <div class="re_msg1">
            <div class="fl">
              <el-form label-width="150px" style="width: 400px; float: left">
                <el-form-item label="分类编号:">
                  <span class="fl">{{ selEqudata.data.number }}</span>
                  <!-- <el-input v-model="selEqudata.data.number"></el-input> -->
                </el-form-item>
                <el-form-item label="资产编号:">
                  <span class="fl">{{ selEqudata.data.asset_number }}</span>
                  <!-- <el-input v-model="selEqudata.data.asset_number"></el-input> -->
                </el-form-item>
                <el-form-item label="名称:">
                  <span class="fl">{{ selEqudata.data.name }}</span>
                  <!-- <el-input v-model="selEqudata.data.name"></el-input> -->
                </el-form-item>
                <el-form-item label="规格型号:">
                  <span class="fl">{{ selEqudata.data.specification }}</span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <el-form-item label="库存位置:">
                  <span class="fl">
                    {{ selEqudata.data.location ? selEqudata.data.location : '/' }}
                    {{ selEqudata.data.store_name ? '-' + selEqudata.data.store_name : '' }}
                    {{ selEqudata.data.number_plies ? '-第' + selEqudata.data.number_plies + '层' : '' }}
                  </span>
                  <!-- <el-input v-model="selEqudata.data.specification"></el-input> -->
                </el-form-item>
                <el-form-item label="产地（厂家）:">
                  <span class="fl">{{ selEqudata.data.factory }}</span>
                </el-form-item>
                <el-form-item label="单价:">
                  <span class="fl">{{ selEqudata.data.unit_price }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z green-btn ml-60" @click="inIdleSave(6)">闲置</div>
            <div class="fr btn_z white-btn ml-60" @click="popState4 = false">取消</div>
          </div>
        </template>
      </PopCurrency>
      <PopCurrency :popShow="popState5" @close="popState5 = $event">
        <template v-slot:header>
          <p>启用</p>
        </template>
        <template v-slot:main>
          <div class="re_msg1">
            <div class="fl">
              <el-form label-width="150px" style="width: 400px; float: left">
                您正在启用此设备，请确认是否启用？
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z green-btn ml-60" @click="inIdleSave(1)">启用</div>
            <div class="fr btn_z white-btn ml-60" @click="popState5 = false">取消</div>
          </div>
        </template>
      </PopCurrency>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, inject, computed, onMounted } from 'vue'

// import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'

import { equData, allotData, warehousingData, checkData } from '@/service/equ-manage/equ-manage/types'
import { getInstrumentCategory } from '@service/equiment-standard/type-manage/index'
import { getEquList, getDetail, equTransfer, equEdit, inIdle } from '@/service/equ-manage/equ-manage/index'
import { PopCurrency } from '@components/pop-currency'
import { ArrowRight } from '@element-plus/icons-vue'
import { useStore } from '@store/index'
import { getLaboratoryList } from '@/service/instrument-manage/equ-manage/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'
import { findSchoolUser } from '@/service/equ-manage/add-equ-warehouse/index'
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { BASE_URL } from '@service/request/config'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import localCache from '@/utils/localCache'
import axios from 'axios'
const store = useStore()
const fileData = reactive({
  token: store.state.login.userInfo.token
})
const fileList1 = ref<any>([])
//添加图片
const uploadSuccess = (response: any, file: UploadFile, fileList: UploadFile[]) => {
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
  let obj = {
    name: response.data.file_name,
    url: response.data.file_url
  }

  fileList1.value.push(obj)
  selEqudata.data.url = urlData
}
//移除图片
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log('1111', file)
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
  fileList1.value = []
  selEqudata.data.url = urlData
}
//文件上传之前
const beforeAvatarUpload: any = (rawFile: any) => {
  const isLt5M = rawFile.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过5M')
    return false
  }
  return true
}
let echart: any = inject('echart')

const echarts1 = ref()
const echarts2 = ref()
const echarts3 = ref()
const echarts4 = ref()
const echarts5 = ref()
const setEcharts = () => {
  let chartDom1 = echart.init(echarts1.value)
  let option1 = {
    color: ['#05C65D'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['20%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: Number(List.value.inventory),
            name: '总库存'
          }
        ]
      }
    ]
  }
  chartDom1.setOption(option1)
  let chartDom2 = echart.init(echarts2.value)
  let option2 = {
    color: ['#5FAFE4', '#DCE8EC', '#ffffff'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['0%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data:
          parseInt(List.value.inventory) === 0
            ? [
                {
                  value: Number(List.value.inventory),
                  name: ''
                }
              ]
            : [
                {
                  value: parseInt(List.value.lend),
                  name: '出借'
                },
                {
                  value: Number(List.value.inventory) - parseInt(List.value.lend),
                  name: ''
                }
              ]
      }
    ]
  }
  chartDom2.setOption(option2)
  let chartDom3 = echart.init(echarts3.value)
  let option3 = {
    color: ['#EFA965', '#DCE8EC', '#ffffff'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['0%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data:
          parseInt(List.value.inventory) === 0
            ? [
                {
                  value: Number(List.value.inventory),
                  name: ''
                }
              ]
            : [
                // { value: 0, name: '' },
                {
                  value: parseInt(List.value.maintenance),
                  name: '维修保养'
                },
                {
                  value: Number(List.value.inventory) - parseInt(List.value.maintenance),
                  name: ''
                }
                // { value: 0, name: '' }
              ]
      }
    ]
  }
  chartDom3.setOption(option3)
  let chartDom4 = echart.init(echarts4.value)
  let option4 = {
    color: ['#EE5959', '#DCE8EC', '#ffffff'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['0%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data:
          parseInt(List.value.inventory) === 0
            ? [
                {
                  value: Number(List.value.inventory) + parseInt(List.value.scrap),
                  name: ''
                }
              ]
            : [
                // { value: 0, name: '' },
                {
                  value: parseInt(List.value.scrap),
                  name: '报废'
                },
                {
                  value: Number(List.value.inventory),
                  name: ''
                }
                // { value: 0, name: '' }
              ]
      }
    ]
  }
  chartDom4.setOption(option4)
  let chartDom5 = echart.init(echarts5.value)
  let option5 = {
    color: ['#5FAFE4', 'rgb(104,187,196)', 'rgb(104,187,196)'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['0%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data:
          parseInt(List.value.inventory) === 0
            ? [
                {
                  value: Number(List.value.inventory),
                  name: ''
                }
              ]
            : [
                // { value: 0, name: '' },
                {
                  value: Number(List.value.inventory) - Number(List.value.inIdle),
                  name: '启用'
                },
                {
                  value: parseInt(List.value.inIdle),
                  name: '闲置'
                }
                // { value: 0, name: '' }
              ]
      }
    ]
  }
  chartDom5.setOption(option5)
  window.onresize = function () {
    chartDom1.resize
    chartDom2.resize
    chartDom3.resize
    chartDom4.resize
    chartDom5.resize
  }
}
let sortData: any = reactive({})
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    getEquAll()
    console.log(column, prop, order)
  }
}
const endColor = (_val: any) => {
  const currentTime = new Date()
  const apiDate = new Date(_val)
  if (apiDate <= currentTime) {
    return 'red'
  }
}
onMounted(() => {
  getEquList({ ...selFrom, ...sortData }).then((res) => {
    // console.log(res.data)
    List.value = res.data
    total.value = res.data.total
    console.log(List.value)
    setEcharts()
  })
  // getInventoryList({ subject_id: subjectID.value, keyword: '', page: currentPage.value }).then((res) => {
  //   List.value = res.data
  //   total.value = res.data.total

  // })
})
const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolEquipment/equipmentList',
      { token, ...selFrom, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '设备库存总览.xlsx'
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

const userList: any = ref([])
findSchoolUser().then((res) => {
  console.log(res)
  userList.value = res.data
})
// 实验室列表
const optionsLaboratory: any = ref([])
// 仪器库列表
const storeListBody: any = ref([])
// 仪器库列表
const number_plies = ref()

// 获取实验室列表
console.log('xinxi', store.state.login.userInfo.subject_id)
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id
getLaboratoryList({ subject: subjectID.value }).then((res) => {
  let user_sub = store.state.login.userInfo.subject_id
  // let arr: any = []
  // res.data.data.forEach((e: any) => {
  //   if (user_sub === e.subject_type) {
  //     arr.push(e)
  //   }
  // })
  optionsLaboratory.value = res.data.data
  console.log(optionsLaboratory.value)
})
// 获取仪器柜
const getStoreData = (id: number | string, name: string) => {
  console.log(name)
  // ruleForm.value.put.location[0].school_laboratory_name = name
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    selEqudata.allocation.list[1].store_id = ''
    selEqudata.allocation.list[1].number_plies = ''
    console.log(res)
    storeListBody.value = res.data
  })
}
// 计算层数
let optionPlies = computed(() => {
  return (id: any) => {
    let num = id
    // list.forEach((e) => {
    //   if (e.id === storeId) {
    //     num = e.number_plies
    //   }
    // })
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
    return arr
  }
})

const popState1 = ref(false)
const popState2 = ref(false)
const popState3 = ref(false)
const popState4 = ref(false)
const popState5 = ref(false)

const optionsType: any = ref([])
const casProps = ref({
  value: 'id',
  label: 'title',
  emitPath: false,
  multiple: false,
  checkStrictly: true
})
getInstrumentCategory({
  type: 2
}).then((res) => {
  console.log(res.data)
  optionsType.value = res.data
})
const cateChange = () => {
  console.log(selFrom)
  getEquAll()
  // let str = ''
  // JSON.parse(JSON.stringify(cate.value)).forEach((e: any) => {
  //   console.log(e)
  //   str = e + ','
  // })
}
const dataMap = reactive({
  filterData: Array<ConfigDataType>(),
  selectForm: { category_id: 0 },
  List: equData,
  currentPage: 1,
  total: 1,
  operateStatus: 0, //1 调拨 2 入库 3 盘点 4 详情
  allotFormData: allotData,
  checkFormData: checkData,
  warehousingForm: warehousingData,
  detailListId: 0
})
let { filterData, currentPage, total, List } = toRefs(dataMap)

let selFrom = reactive({
  category_id: '',
  keyword: '',
  page: 1,
  status: ''
})
const getEquAll = () => {
  let selFrom1 = { ...selFrom, ...sortData }
  getEquList(selFrom1).then((res) => {
    // console.log(res.data)
    List.value = res.data
    total.value = res.data.total
    console.log(List.value)
    setEcharts()
  })
}
getEquAll()
console.log(List.value)

let subject = [...store.state.common.subjectArr]
subject.unshift({
  id: 0,
  name: '全部'
})
filterData.value = [
  {
    name: '学科',
    list: subject,
    keyName: 'subject_id'
  }
]

// const changeFilter = (form: { category_id: number }) => {
//   selectForm.value = form

//   getEquList({ ...selectForm.value, keyword: '', page: currentPage.value }).then((res) => {
//     // console.log(res.data)
//     List.value = res.data
//     total.value = res.data.total
//     console.log(List.value)
//   })
// }
const rules = {
  asset_number: [{ required: true, message: '请输入资产编号', trigger: 'blur' }]
}
const selEqudata: any = reactive({
  data: {
    user: [{ name: '', id: 0 }],
    user_name: []
  },
  allocation: {
    record_number: '',
    school_instrument_id: '',
    hardware_number: '',
    asset_number: '',
    name: '',
    bacth: '',
    numbers: '',
    mode: 1,
    type: 2,
    list: [
      {
        type: 1,
        school_laboratory_id: '',
        store_id: '',
        number_plies: '',
        total: 1
      },
      {
        type: 2,
        school_laboratory_id: '',
        store_id: '',
        number_plies: '',
        total: 1
      }
    ]
  }
})
const selUser = (item: any) => {
  selEqudata.data.user_name = []
  console.log(item)
  selEqudata.data.user[0].id = item.id
  selEqudata.data.user[0].name = item.username
  selEqudata.data.user_name.push({
    id: item.id,
    name: item.username
  })
}
const operate = (data: any, status: number) => {
  if (status === 1) {
    console.log(data)
    popState1.value = true
    getDetail({ id: data.id }).then((res: any) => {
      Object.assign(selEqudata.data, res.data)
      selEqudata.allocation.school_instrument_id = res.data.id
      selEqudata.allocation.hardware_number = res.data.number
      selEqudata.allocation.asset_number = res.data.asset_number
      selEqudata.allocation.name = res.data.name
      selEqudata.allocation.bacth = res.data.bacth
      selEqudata.allocation.numbers = res.data.voucher_number
      selEqudata.allocation.list[0].school_laboratory_id = res.data.laboratory_id
      selEqudata.allocation.list[0].store_id = res.data.store_id
      selEqudata.allocation.list[0].number_plies = res.data.number_plies
    })
  } else if (status === 2) {
    fileList1.value = []
    // console.log(111111, fileList1.value)
    getDetail({ id: data.id }).then((res: any) => {
      console.log(res)
      Object.assign(selEqudata.data, res.data)
      selEqudata.data.url = []
      res.data.picture.forEach((item: any) => {
        selEqudata.data['url'].push(item.url_path)
        fileList1.value.push({
          url: item.url_path
        })
      })
      selEqudata.data.user = [{ name: res.data.user_name[0]?.user_name, id: res.data.user_name[0]?.user_id }]
      popState2.value = true
    })
  } else if (status === 3) {
    fileList1.value = []
    getDetail({ id: data.id }).then((res: any) => {
      console.log(res)
      Object.assign(selEqudata.data, res.data)
      selEqudata.data.url = []
      selEqudata.data.picture = []
      // selEqudata.data.url = res.data.picture[0].url_path
      res.data.picture.forEach((item: any) => {
        selEqudata.data['url'].push(item.url_path)
        selEqudata.data.picture.push({
          url: item.url_path
        })
        fileList1.value.push({
          url: item.url_path
        })
      })
      selEqudata.data.user = [{ name: res.data.user_name[0]?.user_name, id: res.data.user_name[0]?.user_id }]
      console.log(selEqudata.data)
      popState3.value = true
    })
  } else if (status === 4) {
    getDetail({ id: data.id }).then((res: any) => {
      console.log(res)
      selEqudata.data = res.data
      selEqudata.data.url = []
      selEqudata.data.user = [{ name: res.data.user_name[0]?.user_name, id: res.data.user_name[0]?.user_id }]
      console.log(selEqudata.data)
      popState4.value = true
    })
  } else if (status === 5) {
    selEqudata.data.id = data.id
    popState5.value = true
  }
}

// const back = () => {
//   operateStatus.value = 0
//   // detailShow.value = true
// }
// 调拨
const allocationSave = () => {
  if (!selEqudata.allocation.mode) {
    ElMessage({
      type: 'warning',
      message: '请选择调拨方式'
    })
    return
  }
  if (!selEqudata.allocation.list[1].school_laboratory_id) {
    ElMessage({
      type: 'warning',
      message: '请选择存放实验室'
    })
    return
  }
  equTransfer(selEqudata.allocation).then((res: any) => {
    console.log(res)
    if (res.code === 10) {
      popState1.value = false
      getEquAll()
    }
  })
}
// 编辑
const editRef = ref<InstanceType<typeof ElForm>>()
const editSave = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(selEqudata.data))
      params.user = params.user_name.length === 0 ? [] : params.user
      equEdit(params).then((res: any) => {
        // console.log(res)
        if (res.code === 10) {
          popState2.value = false
          getEquAll()
        }
      })
    } else {
      ElMessage({
        type: 'warning',
        message: '请填写必填项'
      })
      return false
    }
  })
}
// 编辑
// const editSave = () => {
//   equEdit(selEqudata.data).then((res: any) => {
//     console.log(res)
//     if (res.code === 10) {
//       popState2.value = false
//       getEquAll()
//     }
//   })
// }
//闲置启用
const inIdleSave = (status: number) => {
  inIdle({ id: selEqudata.data.id, status: status }).then((res: any) => {
    console.log(res)
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
      popState4.value = false
      popState5.value = false
      getEquAll()
    }
  })
}
const handleCurrentChange = (e: any) => {
  console.log(e)
  selFrom.page = e
  getEquAll()
  // getEquList({ ...selectForm.value, keyword: '', page: currentPage.value }).then((res) => {
  //   // console.log(res.data)
  //   List.value = res.data
  //   total.value = res.data.total
  //   console.log(List.value)
  // })
  // console.log('🚀 ~ file: index.vue ~ line 114 ~ handleCurrentChange ~ currentPage.value', currentPage.value)
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  & > div {
    display: flex;
    align-items: center;
    .title-cancel {
      cursor: pointer;
    }
    .cancel {
      margin-left: 10px;
    }
  }
  .fr {
    cursor: pointer;
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
.sel-box {
  margin: 10px 0;
  width: 100%;
  height: 120px;
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
        margin-left: 1.8%;
        float: left;
        margin-top: 16px;
        width: 23.2%;
        display: flex;
        justify-content: space-between;
        & > span {
          float: left;
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: left;
          color: #848484;
        }
        .sel {
          float: left;
          margin-right: 10%;
          width: 60%;
          & ::v-deep .el-date-editor .el-range-separator {
            line-height: 22px !important;
          }
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
.recommend {
  padding: 0 30px;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .filter-box {
    padding: 15px 0;
    width: 90%;
  }
}
.statistics {
  text-align: left;
  display: flex;
  justify-content: space-between;
  .item {
    display: flex;
    align-items: center;
    margin: 10px 0;
    width: 18%;
    height: 100px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    .l-item {
      margin-left: 10px;
      width: 50%;
      height: 80px;
      & > div {
        margin: auto;
        width: 80px;
        height: 80px;
      }
    }
    .r-item {
      margin-left: 10px;
      p:nth-of-type(1) {
        color: #848484;
      }
      p:nth-of-type(2) {
        color: #555;
        font-size: 22px;
      }
    }
  }
}
.content {
  margin-top: 20px;
  height: 530px;

  & ::v-deep .el-table .el-table__header .el-table__cell {
    padding: 12px 0;
  }
  & ::v-deep .el-table .el-table__row .el-table__cell {
    padding: 0 !important;
    height: 47px !important;
  }
  .click-box {
    display: flex;
    justify-content: space-evenly;
    .click-text {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        margin-right: 6px;
      }
    }
  }
  span {
    display: inline-block;
    min-width: 40px;
    height: 30px;
    line-height: 30px;
  }
  .table-input {
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #c9c7c7;
    border-radius: 2px;
    text-align: center;
    option {
      text-align: left;
    }
  }
}
.pagination-block {
  margin-top: 20px;
  text-align: right;
}
.btn {
  height: 36px;
  padding: 0 20px;
  line-height: 36px;
  background: #05c65d;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.btn-white {
  color: #05c65d;
  border: 1px solid #05c65d;
  background: #f3f3f3;
}
.btn-gray {
  color: #fff;
  border: 1px solid #b5b5b5;
  background: #b5b5b5;
}
.green {
  color: #05c65d;
}
.yellow {
  color: #ec8c42;
}
.re_msg1 ::v-deep .el-form-item {
  margin: 0;
}
.img_cc {
  width: 150px;
  height: 150px;
}
.pictureCss {
  width: 150px;
}
</style>
