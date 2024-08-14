import { handleError } from '@/Helpers/ErrorHandler';
import { UserProfileToken } from '@/Model/User';
import axios from 'axios';

const api = "http://10.96.20.14:4000/";

export const loginAPI = async (email: string, senha: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "auth/login", {
            email: email,
            senha: senha,
        })
        return data;

    }catch (error) {
        handleError(error)
    }

}

export const registerAPI = async (nome: string, email: string, id_perfil: string, senha: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "auth/register", {
            nome: nome,
            id_perfil: id_perfil,
            email: email,
            senha: senha,
        })
        return data;

    }catch (error) {
        handleError(error)
    }

}