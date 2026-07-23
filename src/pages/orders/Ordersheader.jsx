import { RefreshCw } from 'lucide-react';
function OrdersHeader({ totalCount, loading, onRefresh }) {
  return (
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
          onClick={onRefresh}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-0 outline-none shadow-soft flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Update"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft px-5 py-3 text-center">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalCount}</span>{' '}
          <span className="text-sm text-koda-muted">total orders</span>
        </div>
      </div>
    </div>
  );
}
export default OrdersHeader