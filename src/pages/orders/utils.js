export function extractList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.orders)) return payload.orders
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders
  if (Array.isArray(payload?.results)) return payload.results
  return []
}
export function extractTotalCount(payload, fallbackLength) {
  return (
    payload?.total ??
    payload?.count ??
    payload?.totalOrders ??
    payload?.data?.total ??
    fallbackLength
  )
}
export function normalizeOrder(raw) {
  const id = raw._id || raw.id || raw.orderId || ''
  const user = raw.user || raw.customer || {}
  const customerName =
    (typeof user === 'string' ? user : null) ||
    user.username ||
    user.name ||
    raw.customerName ||
    raw.name ||
    null
  const customerEmail =
    (typeof user === 'object' ? user.email : null) ||
    raw.customerEmail ||
    raw.email ||
    null
  const status = raw.status || raw.orderStatus || 'pending'
  const paymentStatus =
    raw.paymentStatus ||
    raw.payment?.status ||
    (raw.isPaid ? 'paid' : null) ||
    'pending'
  const paymentMethod =
    raw.paymentMethod ||
    raw.payment?.method ||
    raw.method ||
    'cash'
  const total =
    raw.totalPrice ??
    raw.total ??
    raw.totalAmount ??
    raw.amount ??
    raw.grandTotal ??
    0
  const date = raw.createdAt || raw.date || raw.orderDate || null
  const subtotal = raw.itemsPrice ?? raw.subtotal ?? raw.subTotal ?? null
  const shipping = raw.shippingPrice ?? raw.shippingCost ?? raw.shipping ?? 0
  const tax = raw.taxPrice ?? raw.tax ?? null
  const taxRate = raw.taxRate ?? 14
  const customerNote = raw.customerNote ?? raw.note ?? raw.notes ?? ''
  const shippingAddress = formatShippingAddress(raw)
  return {
    raw,
    id, 
    shortId: shortenId(id),
    customerName,
    customerEmail,
    status: (status || 'pending').toLowerCase(),
    paymentStatus: (paymentStatus || 'pending').toLowerCase(),
    paymentMethod: (paymentMethod || 'cash').toLowerCase(),
    total: Number(total) || 0,
    subtotal: subtotal !== null ? Number(subtotal) || 0 : null,
    shipping: Number(shipping) || 0,
    tax: tax !== null ? Number(tax) || 0 : null,
    taxRate,
    customerNote,
    shippingAddress,
    date,
    items: (raw.items || raw.products || raw.cartItems || []).map(normalizeItem),
  }
}
export function normalizeItem(raw) {
  const name = raw.name || raw.title || raw.product?.name || null
  const quantity = raw.quantity || raw.qty || 1
  const price = raw.price ?? raw.unitPrice ?? raw.product?.price ?? 0
  const image = raw.image || raw.thumbnail || raw.product?.image || raw.images?.[0] || null
  return { raw, name, quantity, price: Number(price) || 0, image }
}
export function formatShippingAddress(raw) {
  const addr = raw.shippingAddress || raw.shipping?.address || raw.address || null
  if (typeof addr === 'string') return addr
  if (addr && typeof addr === 'object') {
    return [addr.city, addr.country].filter(Boolean).join(', ') || null
  }
  return raw.shipTo || null
}
export function shortenId(id) {
  if (!id) return '—'
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, '')
  return `#${clean.slice(-8).toUpperCase()}`
}
export function formatCurrency(amount, currency = 'EGP') {
  const num = Number(amount) || 0
  return `${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`
}
export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
export const STATUS_OPTIONS = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
]
export const PAYMENT_STATUS_OPTIONS = [
  'pending',
  'paid',
  'failed'
]
export const PAYMENT_METHOD_OPTIONS = [
  'cash',
  'card',
  'wallet'
]