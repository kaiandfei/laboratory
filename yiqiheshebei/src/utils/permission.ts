/*
    "component":当前页面路径（如果路径为：@/views/admin/orderList，填admin/orderList即可）
    meta:{
        title:侧边栏名字,
        icon:侧边栏图标,
    }
*/
const permissionList = [
  {
    // 实验室标准
    path: '/laboratoryStandard',
    name: 'LaboratoryStandard',
    component: '',
    meta: {
      title: '实验室标准',
      icon: 'laboratory-standard'
    },
    children: [
      {
        // 实验室配备标准
        path: '/laboratoryStandard/equippedStandard',
        name: 'LaboratoryEquippedStandard',
        component: 'laboratory-standard/equipped-standard',
        meta: {
          title: '实验室配备标准',
          name: '实验室',
          type: 1
        }
      },
      {
        // 实验室配置标准
        path: '/laboratoryStandard/configStandard',
        name: 'LaboratoryConfigStandard',
        component: 'laboratory-standard/config-standard',
        meta: {
          title: '实验室配置标准'
        }
      },
      {
        // 实验室类型管理
        path: '/laboratoryStandard/typeManage',
        name: 'LaboratoryTypeManage',
        component: 'laboratory-standard/type-manage',
        meta: {
          title: '实验室类型管理'
        }
      }
    ]
  },
  {
    // 实验室总览
    path: '/laboratoryManage',
    name: 'LaboratoryManage',
    component: '',
    meta: {
      title: '实验室管理',
      icon: 'laboratory-manage'
    },
    children: [
      {
        path: '/laboratoryManage/overview',
        name: 'LaboratoryOverview',
        component: 'laboratory-manage/overview',
        meta: {
          title: '实验室总览'
        }
      }
    ]
  },
  {
    // 仪器设备标准
    path: '/equimentStandard',
    name: 'EquimentStandard',
    component: '',
    meta: {
      title: '仪器设备标准',
      icon: 'equiment-standard'
    },
    children: [
      {
        // 仪器设备基础信息
        path: '/equimentStandard/baseMessage',
        name: 'EquimentStandardBaseMessage',
        component: 'equiment-standard/base-message',
        meta: {
          title: '仪器设备基础信息'
        }
      },
      {
        // 仪器配备标准
        path: '/equimentStandard/equippedStandard',
        name: 'EquimentStandardEquippedStandard',
        component: 'laboratory-standard/equipped-standard',
        meta: {
          title: '仪器设备配备标准',
          name: '仪器设备',
          type: 2
        }
      },
      {
        // 仪器设备类型管理
        path: '/equimentStandard/typeManage',
        name: 'EquimentStandardTypeManage',
        component: 'equiment-standard/type-manage',
        meta: {
          title: '仪器设备类型管理'
        }
      }
    ]
  },
  {
    // 仪器设备采购计划
    path: '/instrumentProcurementPlan',
    name: 'InstrumentProcurementPlan',
    component: '',
    meta: {
      title: '仪器设备采购计划',
      icon: 'instrument-procurement-plan'
    },
    children: [
      {
        // 推荐采购清单
        path: '/instrumentProcurementPlan/recommendedPurchase',
        name: 'InstrumentRecommendedPurchase',
        component: 'instrument-procurement-plan/recommended-purchase',
        meta: {
          title: '推荐采购清单'
        }
      },
      {
        // 推荐采购清单-计划列表
        path: '/instrumentProcurementPlan/planList',
        name: 'InstrumentPlanList',
        component: 'instrument-procurement-plan/plan-list',
        meta: {
          title: '计划列表'
        }
      },
      {
        // 采购计划管理
        path: '/instrumentProcurementPlan/programManage',
        name: 'InstrumentProgramManage',
        component: 'instrument-procurement-plan/program-manage',
        meta: {
          title: '采购计划管理'
        }
      },
      {
        // 采购计划发布管理
        path: '/instrumentProcurementPlan/reportManage',
        name: 'InstrumentReportManage',
        component: 'instrument-procurement-plan/report-manage',
        meta: {
          title: '采购计划发布管理'
        }
      }
    ]
  },
  {
    // 仪器管理
    path: '/instrumentManage',
    name: 'InstrumentManage',
    component: '',
    meta: {
      title: '仪器管理',
      icon: 'instrument-manage'
    },
    children: [
      {
        // 仪器管理总览
        path: '/instrumentManage/inventoryOverview',
        name: 'InstrumentInventoryOverview',
        component: 'instrument-manage/inventory-overview',
        meta: {
          title: '仪器库存总览'
        }
      },
      {
        // 新建仪器入库
        path: '/instrumentManage/addInstrument',
        name: 'InstrumentAddInstrument',
        component: 'instrument-manage/add-instrument-warehouse',
        meta: {
          title: '新建仪器入库'
        }
      },
      {
        // 批量仪器入库
        path: '/instrumentManage/batchInstrumentWarehouse',
        name: 'BatchInstrumentWarehouse',
        component: 'instrument-manage/batch-instrument-warehouse',
        meta: {
          title: '批量仪器入库'
        }
      },
      {
        // 仪器编号管理
        path: '/instrumentManage/instrument_number',
        name: 'InstrumentInstrument_number',
        component: 'instrument-manage/instrument_number',
        meta: {
          title: '仪器编号管理'
        }
      },
      {
        // 仪器出借登记
        path: '/instrumentManage/loanRegistration',
        name: 'InstrumentLoanRegistration',
        component: 'instrument-manage/loan-registration',
        meta: {
          title: '出借登记'
        }
      },
      {
        // 仪器维修保养登记
        path: '/instrumentManage/repairRegistration',
        name: 'InstrumentRepairRegistration',
        component: 'instrument-manage/repair-registration',
        meta: {
          title: '维修保养登记'
        }
      },
      {
        // 仪器损耗、报废登记
        path: '/instrumentManage/scrapRegistration',
        name: 'InstrumentScrapRegistration',
        component: 'instrument-manage/scrap-registration',
        meta: {
          title: '损耗、报废登记'
        }
      },
      {
        // 仪器损坏、赔偿登记
        path: '/instrumentManage/damageRegistration',
        name: 'InstrumentDamageRegistration',
        component: 'instrument-manage/damage-compensate-registration',
        meta: {
          title: '损坏、赔偿登记'
        }
      },
      {
        // 仪器登记总览
        path: '/instrumentManage/registrationOverview',
        name: 'InstrumentRegistrationOverview',
        component: 'instrument-manage/registration-overview',
        meta: {
          title: '仪器登记总览'
        }
      },
      {
        // 仪器损耗、报废审核
        path: '/instrumentManage/scrapExamine',
        name: 'InstrumentScrapExamine',
        component: 'instrument-manage/scrap-examine',
        meta: {
          title: '损耗、报废审核'
        }
      },
      {
        // 仪器教学仪器总账
        path: '/instrument-manage/instrumentLedger',
        name: 'InstrumentLedger',
        component: 'instrument-manage/instrument-ledger',
        meta: {
          title: '仪器教学总账',
          name: '仪器',
          type: 1
        }
      },
      {
        // 仪器教学分类账
        path: '/instrument-manage/typeLedger',
        name: 'InstrumentTypeLedger',
        component: 'instrument-manage/type-ledger',
        meta: {
          title: '教学分类账',
          name: '仪器',
          type: 1
        }
      },
      {
        // 仪器低值易耗平账
        path: '/consumablesLedger',
        name: 'ConsumablesLedger',
        component: 'instrument-manage/consumables-ledger',
        meta: {
          title: '低值易耗品账'
        }
      }
    ]
  },
  {
    // 设备管理
    path: '/equipmentManage',
    name: 'EquipmentManage',
    component: '',
    meta: {
      title: '设备管理',
      icon: 'equiment-manage'
    },
    children: [
      {
        // 设备库存总览
        path: '/equipmentManage/equipmentStore',
        name: 'EquipmentStore',
        component: 'equipment-manegement/equ-store',
        meta: {
          title: '设备库存总览'
        }
      },
      {
        // 新建设备
        path: '/equipmentManage/addEqu',
        name: 'EquipmentAddEqu',
        component: 'equipment-manegement/add-equ',
        meta: {
          title: '新建设备入库'
        }
      },
      {
        // 设备出借登记
        path: '/equipmentManage/equLend',
        name: 'EquipmentEquLend',
        component: 'equipment-manegement/equ-lend',
        meta: {
          title: '出借登记'
        }
      },
      {
        // 设备维修保养登记
        path: '/equimentManage/repairRegistration',
        name: 'EquimentRepairRegistration',
        component: 'equipment-manegement/repair-registration',
        meta: {
          title: '维修保养登记'
        }
      },
      {
        // 设备损坏、赔偿登记
        path: '/equipmentManage/equDamageRegistration',
        name: 'EquipmentEquDamageRegistration',
        component: 'equipment-manegement/equ-damage',
        meta: {
          title: '损耗、报废登记'
        }
      },
      {
        // 设备损耗、报废登记
        path: '/equipmentManage/equScrapRegistration',
        name: 'EquipmentEquScrapRegistration',
        component: 'equipment-manegement/equ-scrap',
        meta: {
          title: '损坏、赔偿登记'
        }
      },
      {
        // 设备登记总览
        path: '/equipmentManage/equRegistrationOverview',
        name: 'EquipmentEquRegistrationOverview',
        component: 'equipment-manegement/equ-registration-overView',
        meta: {
          title: '设备登记总览'
        }
      },
      {
        // 设备损耗、报废审核
        path: '/equipmentManage/equScrapExamine',
        name: 'EquipmentEquScrapExamine',
        component: 'equipment-manegement/equ-examine',
        meta: {
          title: '损耗、报废审核'
        }
      },
      {
        // 设备教学仪器总账
        path: '/equiment-manage/instrumentLedger',
        name: 'EquipmentInstrumentLedger',
        component: 'instrument-manage/instrument-ledger',
        meta: {
          title: '仪器教学总账',
          name: '设备',
          type: 2
        }
      },
      {
        // 设备教学分类账
        path: '/equiment-manage/typeLedger',
        name: 'EquipmentTypeLedger',
        component: 'instrument-manage/type-ledger',
        meta: {
          title: '教学分类账',
          name: '设备',
          type: 2
        }
      }
    ]
  },
  {
    // 仪器设备库
    path: '/equ-warehouse',
    name: 'EquWarehouse',
    component: 'equ-warehouse',
    meta: {
      title: '仪器设备库',
      icon: 'equ-warehouse'
    }
  }
]
export default permissionList
