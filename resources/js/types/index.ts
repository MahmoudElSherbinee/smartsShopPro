export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export interface User {
    id: number;
    name: string;
    email: string;
    type: 'admin' | 'vendor' | 'customer';
}

export interface Category {
    id: number;
    products_count?: number;
    name: string;
    slug: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    category_id: number;
    user_id: number;
    image?: string;
    image_url?: string;
    category?: Category;
    description?: string;
    created_at?: string;
    updated_at?: string;
}
