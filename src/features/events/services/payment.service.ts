import api from "../../../services/api";

export interface Payment {
    id: number;
    full_name: string;
    mobile_number: string;
    email: string;
    ticket_count: number;
    amount: string;
    ticket: number;
    transaction_id: string;
    created_at: string;
    event_title?: string;
    event_date?: string;
    location?: string;
    ticket_name?: string;
}

export interface PaymentSummary {
    total_revenue: number;
    total_transactions: number;
}

export const paymentService = {
    getAllPayments: async (params?: any) => {
        const response = await api.get("/payments/", { params });
        return response.data.results || response.data;
    },

    getPaymentSummary: async (params?: any) => {
        const response = await api.get("/payments/summary/", { params });
        return response.data;
    },

    createPayment: async (data: any) => {
        const response = await api.post("/payments/", data);
        return response.data;
    },

    updatePayment: async (id: number, data: Partial<Payment>) => {
        const response = await api.patch(`/payments/${id}/`, data);
        return response.data;
    },

    deletePayment: async (id: number) => {
        await api.delete(`/payments/${id}/`);
    },
};
