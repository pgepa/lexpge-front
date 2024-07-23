import { api } from "@/lib/axios"

export interface GetAtosResponse {
  atos: {
    id: number
    titulo: string
    ementa: string
    situacao: string
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}


export async function getAtos() {
const response = await api.get<GetAtosResponse>('/atos', {
  params: {
    pageIndex: 0,

  }
})
return response.data
}