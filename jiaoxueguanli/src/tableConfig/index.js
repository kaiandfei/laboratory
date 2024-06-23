export const noticeTableConfig = [
  {
    prop: 'title',
    label: '通知标题',
  },
  {
    prop: 'create_user',
    label: '作者',
  },
  {
    prop: 'create_time',
    label: '发布时间',
    sort: 'custom',
  },
  {
    prop: 'status',
    label: '发布状态',
    type: 'switch',
  },
  {
    label: '操作',
    type: 'slot',
    prop: 'option',
    slotName: 'option',
  },
]
