import { myRequest } from '../token/index'
import { RootObject } from '../rootObject'
//获取模板列表
export const noteList = (data: any) => {
  return myRequest.get<RootObject<any>>({
    url: `/schooldvc/SchoolNotes/noteList?note_template_type=${data.note_template_type}`,
  })
}
//保存模板
export const saveNote = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolNotes/saveNote',
    data
  })
}
//选择模板
export const selectNote = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolNotes/selectNote',
    data
  })
}
