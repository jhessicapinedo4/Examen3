// lib/types.ts
export interface Category {
  id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id?: number; // linked category id
  category?: Category | null; // populated if backend returns relation
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}


