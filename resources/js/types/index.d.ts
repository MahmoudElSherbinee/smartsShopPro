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
    category?: Category;
    description?: string;
    created_at?: string;
    updated_at?: string;
}
