export type UserRole = 'admin' | 'organizer';

export interface User {
    id: number;
    email: string;
    full_name: string;
    mobile_number?: string;
    profile_picture?: string;
    role: UserRole;
    is_active: boolean;
    is_staff: boolean;
    date_joined: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    tokens: {
        refresh: string;
        access: string;
    };
}

export interface Event {
    id: number;
    title: string;
    category: number;
    category_name?: string;
    image?: string;
    auth_id: number;
    organizer_name?: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    is_free: boolean;
    description?: string;
    mobile_number: string;
    email: string;
    agenda?: any;
    status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'deleted';
    created_at: string;
    updated_at: string;
    tickets?: Ticket[];
    total_seats?: number;
    booked_seats?: number;
}

export interface AgendaItem {
    id?: number;
    time: string;
    title: string;
}

export interface Ticket {
    id?: number;
    name: string;
    price: number | string;
    total_seats: number;
    booked_seats?: number;
}

export interface TicketBenefit {
    id?: number;
    benefit: string;
    order: number;
}
