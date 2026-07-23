import { useEffect, useState } from 'react'
import { ChevronDown, X, Loader2 } from 'lucide-react'
import { StatusPill, PaymentPill } from './statusbadge'
import { STATUS_OPTIONS, formatDate, formatCurrency } from './utils'
export function OrderDetailsModal({ order, onClose, onUpdateStatus, updating }) {
  const [statusValue, setStatusValue] = useState(order.status)
  const [note, setNote] = useState('')
  const [visible, setVisible] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])
  const handleSave = () => {
    onUpdateStatus(order, statusValue)
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50" onClick={onClose}>
      <div
        className={`bg-white dark:bg-slate-900 w-full max-w-md h-full overflow-y-auto shadow-soft transform transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-5 shadow-sm dark:shadow-slate-800">
          <div>
            <p className="text-[11px] tracking-[0.2em] font-bold text-koda-muted">ORDER DETAIL</p>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{order.shortId}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusPill status={order.status} />
              <PaymentPill status={order.paymentStatus} />
            </div>
            <span className="text-koda-muted capitalize">{order.paymentMethod}</span>
          </div>

          <div>
            <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">Info</p>
            <div className="rounded-2xl shadow-soft divide-y divide-slate-100 dark:divide-slate-800 dark:bg-slate-800/50 overflow-hidden">
              <div className="px-4 py-3">
                <Row label="Placed" value={formatDate(order.date)} />
              </div>
              <div className="px-4 py-3">
                <Row label="Customer" value={order.customerName || '—'} />
              </div>
              <div className="px-4 py-3">
                <Row label="Email" value={order.customerEmail || '—'} />
              </div>
              <div className="px-4 py-3">
                <Row label="Ship to" value={order.shippingAddress || '—'} />
              </div>
            </div>
          </div>

          {order.items?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">
                Items ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl shadow-soft dark:bg-slate-800/50 px-3 py-2.5">
                    {item.image ? (
                      <img src={item.image} alt={item.name || 'product'} className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 dark:text-slate-200 font-medium truncate">
                        {item.name || `Product ${i + 1}`}
                      </p>
                      <p className="text-xs text-koda-muted">
                        × {item.quantity} · {formatCurrency(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl shadow-soft divide-y divide-slate-100 dark:divide-slate-800 dark:bg-slate-800/50 overflow-hidden">
            <div className="px-4 py-3">
              <Row label="Subtotal" value={formatCurrency(order.subtotal ?? order.total)} />
            </div>
            <div className="px-4 py-3">
              <Row label="Shipping" value={formatCurrency(order.shipping)} />
            </div>
            <div className="px-4 py-3">
              <Row label={`Tax (${order.taxRate}%)`} value={formatCurrency(order.tax ?? 0)} />
            </div>
            <div className="px-4 py-3">
              <Row
                label={<span className="font-bold text-slate-800 dark:text-white">Total</span>}
                value={<span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.total)}</span>}
              />
            </div>
          </div>

          {order.customerNote && (
            <div>
              <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">Customer note</p>
              <div className="rounded-2xl shadow-soft dark:bg-slate-800/50 px-4 py-3 text-slate-600 dark:text-slate-300 italic">
                "{order.customerNote}"
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold text-koda-muted uppercase tracking-wide mb-2">Update status</p>
            <div className="relative mb-3">
              <button
                type="button"
                onClick={() => !updating && setStatusOpen((o) => !o)}
                disabled={updating}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl shadow-soft bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-koda-teal/40 capitalize disabled:opacity-60 disabled:cursor-wait"
              >
                {statusValue}
                <ChevronDown className={`w-4 h-4 text-koda-muted transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
              </button>

              {statusOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                  <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-soft py-1 overflow-hidden">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStatusValue(opt)
                          setStatusOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                          opt === statusValue ? 'bg-slate-50 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-2xl shadow-soft bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-koda-teal/40 resize-none mb-3"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={updating}
              className="w-full py-2.5 rounded-2xl bg-slate-900 dark:bg-cyan-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {updating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Row({ label, value, className = '' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-koda-muted">{label}</span>
      <span className={`font-medium text-slate-800 dark:text-slate-200 ${className}`}>{value}</span>
    </div>
  )
}