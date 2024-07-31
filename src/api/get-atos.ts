import { api } from "@/lib/axios"

export interface GetAtosQuery {
    pageIndex?: number | null
    
}

export interface GetAtosResponse {
  atos: {
    id: number;
    titulo: string;
    situacao: string;
    ementa: string;
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