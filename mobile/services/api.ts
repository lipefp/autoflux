import API_URL from '../constants/api'
import { Part, mockParts } from '../data/mockParts'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type { Part } from '../data/mockParts'

// ─── helpers ──────────────────────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('@autoflux:token')
  } catch {
    return null
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Token ${token}`
  return headers
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── PARTS ────────────────────────────────────────────────────────────────────

export async function getParts(brand?: string, search?: string, storeId?: string): Promise<Part[]> {
  try {
    const params = new URLSearchParams()
    if (brand && brand !== 'Todas') params.set('brand', brand)
    if (search) params.set('search', search)
    if (storeId) params.set('store_id', storeId)
    const query = params.toString() ? `?${params}` : ''
    return await fetchJSON<Part[]>(`${API_URL}/parts${query}`)
  } catch {
    let result = [...mockParts]
    if (brand && brand !== 'Todas') result = result.filter(p => p.brand === brand)
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    return result
  }
}

export async function getPartById(id: string): Promise<Part | undefined> {
  try {
    return await fetchJSON<Part>(`${API_URL}/parts/${id}`)
  } catch {
    return mockParts.find(p => p.id === id)
  }
}

export async function createPart(data: Partial<Part> & { store_id?: number }): Promise<Part> {
  const headers = await authHeaders()
  return fetchJSON<Part>(`${API_URL}/parts`, { method: 'POST', headers, body: JSON.stringify(data) })
}

export async function updatePart(id: string, data: Partial<Part>): Promise<Part> {
  const headers = await authHeaders()
  return fetchJSON<Part>(`${API_URL}/parts/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
}

export async function deletePart(id: string): Promise<void> {
  const headers = await authHeaders()
  await fetch(`${API_URL}/parts/${id}`, { method: 'DELETE', headers })
}

// ─── STORES ───────────────────────────────────────────────────────────────────

export interface Store {
  id: string
  name: string
  cnpj?: string
  address?: string
  district?: string
  city?: string
  hours?: string
  distance?: string
  rating?: number
  total_reviews?: number
  active?: boolean
  delivery_radius_km?: number
}

export async function getStores(): Promise<Store[]> {
  try {
    return await fetchJSON<Store[]>(`${API_URL}/stores`)
  } catch {
    return []
  }
}

export async function getStoreById(id: string): Promise<Store | undefined> {
  try {
    return await fetchJSON<Store>(`${API_URL}/stores/${id}`)
  } catch {
    return undefined
  }
}

export async function updateStore(id: string, data: Partial<Store>): Promise<Store> {
  const headers = await authHeaders()
  return fetchJSON<Store>(`${API_URL}/stores/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
}

export async function getStoreMetrics(id: string): Promise<Record<string, number>> {
  try {
    const headers = await authHeaders()
    return await fetchJSON(`${API_URL}/stores/${id}/metrics`, { headers })
  } catch {
    return { orders_today: 0, revenue_today: 0, pending_orders: 0, parts_count: 0, rating: 5 }
  }
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  partId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  delivery: boolean
  address: string
  status: string
  created_at: string
  store?: string | null
  store_name?: string
}

export interface OrderPayload {
  items: OrderItem[]
  subtotal: number
  delivery_fee?: number
  total?: number
  delivery: boolean
  address?: string
  store_id?: number | null
}

export async function getOrders(params?: { store_id?: string; client_id?: string; status?: string }): Promise<Order[]> {
  try {
    const headers = await authHeaders()
    const q = new URLSearchParams()
    if (params?.store_id) q.set('store_id', params.store_id)
    if (params?.client_id) q.set('client_id', params.client_id)
    if (params?.status) q.set('status', params.status)
    const query = q.toString() ? `?${q}` : ''
    return await fetchJSON<Order[]>(`${API_URL}/orders${query}`, { headers })
  } catch {
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const headers = await authHeaders()
    return await fetchJSON<Order>(`${API_URL}/orders/${id}`, { headers })
  } catch {
    return null
  }
}

export async function createOrder(payload: OrderPayload): Promise<Order | null> {
  try {
    const headers = await authHeaders()
    const subtotal = payload.subtotal
    const delivery_fee = payload.delivery ? 8 : 0
    return await fetchJSON<Order>(`${API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...payload, subtotal, delivery_fee, total: subtotal + delivery_fee }),
    })
  } catch {
    return null
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  try {
    const headers = await authHeaders()
    return await fetchJSON<Order>(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    })
  } catch {
    return null
  }
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export interface Review {
  id: number
  order: number
  store: number
  rating: number
  comment: string
  created_at: string
}

export async function getReviews(storeId: string): Promise<Review[]> {
  try {
    return await fetchJSON<Review[]>(`${API_URL}/reviews?store_id=${storeId}`)
  } catch {
    return []
  }
}

export async function createReview(data: { order: number; store: number; rating: number; comment: string }): Promise<Review | null> {
  try {
    const headers = await authHeaders()
    return await fetchJSON<Review>(`${API_URL}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
  } catch {
    return null
  }
}
