export interface ConfigListItem {
  id: number | string
  name: string
}

export interface ConfigDataType {
  name: string
  list: ConfigListItem[]
  keyName: string
}
