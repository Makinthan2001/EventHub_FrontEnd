import api from '../../../services/api';
import { User, UserRole } from '../../../types';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        const response = await api.get('auth/users/');
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getUserById(id: number): Promise<User> {
        const response = await api.get(`auth/users/${id}/`);
        return response.data;
    },

    async toggleUserStatus(id: number, currentStatus: boolean): Promise<User> {
        const response = await api.patch(`auth/users/${id}/`, { is_active: !currentStatus });
        return response.data;
    },

    async updateUserRole(id: number, role: UserRole): Promise<User> {
        const response = await api.patch(`auth/users/${id}/`, { role });
        return response.data;
    },

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        const response = await api.patch(`auth/users/${id}/`, userData);
        return response.data;
    },

    async updateProfile(profileData: any): Promise<{ message: string; user: User }> {
        const response = await api.patch('auth/profile/update/', profileData);
        return response.data;
    }
};
