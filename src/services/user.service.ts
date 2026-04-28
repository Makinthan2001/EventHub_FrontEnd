import api from './api';
import { User, UserRole } from '../types';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get('/auth/users/');
            const data = response.data;
            if (data && typeof data === 'object') {
                if (data.results && Array.isArray(data.results)) return data.results;
                if (Array.isArray(data)) return data;
            }
            return [];
        } catch (error) {
            console.error("API Error in getAllUsers:", error);
            return [];
        }
    },

    async toggleUserStatus(id: number): Promise<{ message: string; is_active: boolean }> {
        const response = await api.patch(`/auth/users/${id}/toggle/`);
        return response.data;
    },

    async updateUserRole(id: number, role: UserRole): Promise<{ message: string; role: UserRole }> {
        const response = await api.patch(`/auth/users/${id}/role/`, { role });
        return response.data;
    },

    async updateProfile(profileData: any): Promise<{ message: string; user: User }> {
        const response = await api.patch('/auth/profile/update/', profileData);
        return response.data;
    }
};
