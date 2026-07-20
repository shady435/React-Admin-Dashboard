import { useEffect, useMemo, useState, useCallback } from 'react'
import { Search, ChevronDown, X, Loader2, RefreshCw, AlertTriangle } from 'lucide-react'
import api from '../../api/axiosInstance'
export default function Orders() {
  const [orders, setOrders] = useState([]) 
  const [totalCount, setTotalCount] = useState(0) 
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState('') 
  const [search, setSearch] = useState('') 
  const [statusFilter, setStatusFilter] = useState('all') 
  const [paymentFilter, setPaymentFilter] = useState('all') 
  const [methodFilter, setMethodFilter] = useState('all') 
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null) 
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/orders/admin')
      const list = extractList(data).map(normalizeOrder)
      setOrders(list)
      setTotalCount(extractTotalCount(data, list.length))
    } catch (err) {

      setError(
        err.response?.data?.message || err.message || 'Unable to load orders. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesSearch =
        !term ||
        o.shortId.toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term) ||
        o.customerEmail?.toLowerCase().includes(term)

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter
      const matchesMethod = methodFilter === 'all' || o.paymentMethod === methodFilter
      return matchesSearch && matchesStatus && matchesPayment && matchesMethod
    })
  }, [orders, search, statusFilter, paymentFilter, methodFilter])

  const updateStatus = async (order, newStatus) => {
 

    if (newStatus === order.status) return

  const confirmed = window.confirm(`Confirm changing order ${order.shortId} status to "${newStatus}"?`)
    if (!confirmed) return

    setUpdatingId(order.id)
    try {
      await api.patch(`/orders/admin/${order.id}/status`, { status: newStatus })
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)))
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Unable to update the order status ')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-koda-bg">
      <main className="max-w-7xl mx-auto p-6">

        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-[11px] tracking-[0.2em] font-bold text-koda-muted">
              ADMIN · MANAGEMENT
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Orders</h1>
          </div>
          <div className="flex items-center gap-3">



            <button
              type="button"
              onClick={fetchOrders}
              className="w-10 h-10 rounded-lg border border-koda-border/50 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700"
              title="Update"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
            </button>

       
            <div className="bg-white dark:bg-slate-800 border border-koda-border/50 dark:border-slate-700 rounded-xl2 shadow-soft px-5 py-3 text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalCount}</span>{' '}
              <span className="text-sm text-koda-muted">total orders</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-koda-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, customer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-koda-border/50 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-white dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-koda-teal/40 focus:border-koda-teal"
            />
          </div>

          <FilterSelect value={statusFilter} onChange={setStatusFilter} label="All statuses" options={STATUS_OPTIONS} />
          <FilterSelect value={paymentFilter} onChange={setPaymentFilter} label="All payments" options={PAYMENT_STATUS_OPTIONS} />
          <FilterSelect value={methodFilter} onChange={setMethodFilter} label="All methods" options={PAYMENT_METHOD_OPTIONS} />
        </div>

        <div className="bg-koda-card dark:bg-slate-900 border border-koda-border/50 dark:border-slate-800 rounded-xl2 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] tracking-wider text-koda-muted font-bold uppercase border-b border-koda-border/50 dark:border-slate-800">
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Total</th>
                </tr>
              </thead>
              <tbody>

                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-koda-muted">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading orders...
                    </td>
                  </tr>
                )}

    
                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-5 h-5 mx-auto mb-2" />
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-koda-muted">
                    No requests match your search.
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-koda-border/50 dark:border-slate-800 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">{order.shortId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                       
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                            {(order.customerName || 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-slate-500 dark:text-slate-300">{order.customerName || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{formatDate(order.date)}</td>
                      
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          order={order}
                          disabled={updatingId === order.id}
                          onChange={(status) => updateStatus(order, status)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <PaymentPill status={order.paymentStatus} />
                          <p className="text-xs text-koda-muted capitalize">{order.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
          updating={updatingId === selectedOrder.id}
        />
      )}
    </div>
  )
}