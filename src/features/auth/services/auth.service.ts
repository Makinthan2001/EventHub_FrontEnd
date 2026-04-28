import api from '../../../services/api';
import { AuthResponse, User } from '../../../types';

export const authService = {
    async login(credentials: any): Promise<AuthResponse> {
        const response = await api.post('auth/login/', credentials);
        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async register(userData: any): Promise<AuthResponse> {
        const response = await api.post('auth/register/', userData);
        return response.data;
    },

    logout(): void {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        localStorage.clear();

        if (refreshToken) {
            // Pass authorization explicitly to avoid dependency on cleared localStorage
            // Pass _retry: true to prevent interceptor from attempting to refresh token on 401
            const config: any = {
                headers: {},
                _retry: true
            };

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            api.post('auth/logout/', { refresh: refreshToken }, config).catch(() => {
                // Ignore logout errors - token might be expired or invalid
            });
        }
    },

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
        const response = await api.post('auth/users/change_password/', {
            old_password: oldPassword,
            new_password: newPassword
        });
        return response.data;
    }
};
