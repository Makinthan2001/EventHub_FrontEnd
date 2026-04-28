import api from '../../../services/api';
import { Event } from '../../../types';

export const eventService = {
    async getAllEvents(): Promise<Event[]> {
        const response = await api.get('events/');
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async getEventById(id: number | string): Promise<Event> {
        const response = await api.get(`events/${id}/`);
        return response.data;
    },

    async createEvent(eventData: any): Promise<Event> {
        const response = await api.post('events/', eventData, {
            headers: {
                'Content-Type': eventData instanceof FormData ? 'multipart/form-data' : 'application/json',
            },
        });
        return response.data;
    },

    async updateEvent(id: number | string, eventData: any): Promise<Event> {
        const response = await api.patch(`events/${id}/`, eventData, {
            headers: {
                'Content-Type': eventData instanceof FormData ? 'multipart/form-data' : 'application/json',
            },
        });
        return response.data;
    },

    async deleteEvent(id: number | string): Promise<void> {
        await api.delete(`events/${id}/`);
    },

    async getOrganizerEvents(): Promise<Event[]> {
        const response = await api.get('events/my-events/');
        const data = response.data;
        return Array.isArray(data) ? data : data.results || [];
    },

    async softDeleteEvent(id: number | string): Promise<void> {
        await api.patch(`events/${id}/`, { is_deleted: true });
    },

    async approveEvent(id: number | string): Promise<void> {
        await api.post(`events/${id}/approve/`);
    },

    async rejectEvent(id: number | string): Promise<void> {
        await api.post(`events/${id}/reject/`);
    }
};
