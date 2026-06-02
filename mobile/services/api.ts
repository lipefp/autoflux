import API_URL from '../constants/api'
import { Part } from '../data/mockParts'
import { mockParts } from '../data/mockParts'

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function getParts(brand?: string, search?: string): Promise<Part[]> {
  try {
    const params = new URLSearchParams()
    if (brand && brand !== 'Todas') params.set('brand', brand)
    if (search) params.set('search', search)
    const query = params.toString() ? `?${params}` : ''
    return await fetchJSON<Part[]>(`${API_URL}/parts${query}`)
  } catch {
    // fallback local se API estiver offline
    return mockParts
  }
}

export async function getPartById(id: string): Promise<Part | undefined> {
  try {
    return await fetchJSON<Part>(`${API_URL}/parts/${id}`)
  } catch {
    return mockParts.find(p => p.id === id)
  }
}

export interface OrderPayload {
  items: { partId: string; quantity: number }[]
  total: number
  delivery: boolean
}

export async function createOrder(payload: OrderPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}
