import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
    async login(credentials: any): Promise<AuthResponse> {
        const response = await api.post('/auth/login/', credentials);
        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async register(userData: any): Promise<AuthResponse> {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    logout(): void {
        const refreshToken = localStorage.getItem('refresh_token');
        api.post('/auth/logout/', { refresh_token: refreshToken }).catch(console.error);
        localStorage.clear();
    },

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
