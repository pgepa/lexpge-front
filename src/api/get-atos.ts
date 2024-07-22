import { api } from "@/lib/axios"

export interface GetAtosResponse {
  
atos: {
    
atoId: number;
    
Numero: string;
  
Titulo: string;

Ementa: string;
  
Tipo: string;
    
Situacao: string;
   
Data_do_Ato: string;
    
Data_de_Publicacao: string;
    
Observacao: string;

Descritores: string;
    
   
Quill: string;
  }[];
meta: {
pageIndex: number
      
perPage: number
    
totalCount: number;
  };
}

export async function getAtos() {
  
 
const response = await api.get<GetAtosResponse>("/api/atos/all", {
    
   
params: {
     

    },
  });
  
return response.data;
}