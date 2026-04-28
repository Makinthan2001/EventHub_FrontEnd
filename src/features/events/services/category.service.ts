import api from '../../../services/api';

export interface Category {
    id: number;
    category_name: string;
    image?: string;
}

export const categoryService = {
    async getAllCategories(): Promise<Category[]> {
        const response = await api.get('/categories/');
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getCategoryById(id: number): Promise<Category> {
        const response = await api.get(`/categories/${id}/`);
        return response.data;
    },

    async createCategory(formData: FormData): Promise<Category> {
        const response = await api.post('/categories/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async updateCategory(id: number, formData: FormData): Promise<Category> {
        const response = await api.patch(`/categories/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deleteCategory(id: number): Promise<void> {
        await api.delete(`/categories/${id}/`);
    }
};
