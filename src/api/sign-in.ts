import { api } from '@/lib/axios';

export interface SignInBody {
    email: string;
    senha: string;
}

// Defina o tipo da resposta da API, se aplicável
export interface SignInResponse {
    // Supondo que a API retorne um token, user ou algo similar
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export async function signIn({ email, senha }: SignInBody): Promise<SignInResponse | null> {
    try {
        const response = await api.post<SignInResponse>('/auth/login', { email, senha });
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return null;
    }
}
