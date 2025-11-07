export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-jxwq.onrender.com/api'

/**
 * Helper fetch for client/server usage.
 * - endpoint: '/products' or '/categorias/1'
 * - opts: fetch options
 */
export async function apiFetch(endpoint: string, opts: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`
  const res = await fetch(url, { ...opts })
  
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }

  const json = await res.json()

  // 🔹 Si la respuesta tiene la forma { success, data }, devuelve data directamente
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data
  }

  return json
}

/* ──────────────── 🧩 CATEGORÍAS ──────────────── */
export async function getCategories() {
  return apiFetch('/categorias')  // ahora devuelve directamente el array
}

export async function getCategoryById(id: string) {
  return apiFetch(`/categorias/${id}`)
}

export async function createCategory(data: any) {
  return apiFetch('/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateCategory(id: string, data: any) {
  return apiFetch(`/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(id: string) {
  return apiFetch(`/categorias/${id}`, { method: 'DELETE' })
}

/* ──────────────── 🛍️ PRODUCTOS ──────────────── */
export async function getProducts(params?: { 
  page?: number; 
  limit?: number; 
  category_id?: number | null 
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.category_id) query.set('category_id', String(params.category_id));
  
  const queryString = query.toString();
  return apiFetch(`/products${queryString ? `?${queryString}` : ''}`)
}

export async function getProductById(id: string) {
  return apiFetch(`/products/${id}`)
}

export async function createProduct(data: any) {
  return apiFetch('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id: string, data: any) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: string) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' })
}