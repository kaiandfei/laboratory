import { zsRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getHC = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/HazardousChemicalType/typeList',
    data
  })
}
export const updateHC = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/HazardousChemicalType/change',
    data
  })
}

export const delHC = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/HazardousChemicalType/delete',
    data
  })
}

export const importHC = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/HazardousChemicalType/import',
    data
  })
}

export const getHCW = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/ChemicalWaste/wasteList',
    data
  })
}

export const updateHCW = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/ChemicalWaste/change',
    data
  })
}

export const delHCW = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/ChemicalWaste/delete',
    data
  })
}

export const modelHCW = () => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/ChemicalWaste/downloadtpl'
  })
}

export const importHCW = (data: any) => {
  return zsRequest.post<IServerDataType>({
    url: 'chemical/ChemicalWaste/import',
    data
  })
}
