import { Loader2, AlertTriangle } from 'lucide-react';
import { StatusDropdown } from './filterselectstatusdropdown';
import { PaymentPill } from './statusbadge';
import { formatDate, formatCurrency } from './utils';
function OrdersTable({ orders, loading, error, updatingId, onRowClick, onUpdateStatus }) {
  return (
<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
        
      <thead>
        <tr className="text-left text-[11px] tracking-wider text-slate-400 dark:text-slate-500 font-bold uppercase">
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

            {!loading && !error && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-koda-muted">
               No requests match your search.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 cursor-pointer"
                  onClick={() => onRowClick(order)}
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
                      onChange={(status) => onUpdateStatus(order, status)}
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
  );
}

export default OrdersTable;