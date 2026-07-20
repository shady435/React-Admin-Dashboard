import { Search } from 'lucide-react';
import { FilterSelect } from './filterselectstatusdropdown';
import { STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from './utils';
function OrdersFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  methodFilter,
  onMethodChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-koda-muted" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search ID, customer..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl shadow-soft bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-white dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-koda-teal/40"
        />
      </div>
      <FilterSelect value={statusFilter} onChange={onStatusChange} label="All statuses" options={STATUS_OPTIONS} />
      <FilterSelect value={paymentFilter} onChange={onPaymentChange} label="All payments" options={PAYMENT_STATUS_OPTIONS} />
      <FilterSelect value={methodFilter} onChange={onMethodChange} label="All methods" options={PAYMENT_METHOD_OPTIONS} />
    </div>
  );
}
export default OrdersFilters;