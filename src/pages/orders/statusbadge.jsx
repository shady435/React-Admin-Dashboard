const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  processing: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  shipped: 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
  canceled: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
  returned: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  refunded: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  failed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
}
const DOT_STYLES = {
  pending: 'bg-amber-500',
  processing: 'bg-violet-500',
  shipped: 'bg-sky-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-rose-500',
  canceled: 'bg-rose-500',
  returned: 'bg-orange-500',
  refunded: 'bg-orange-500',
}
export function StatusPill({ status }) {
  const key = (status || 'pending').toLowerCase()
  const style = STATUS_STYLES[key] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  const dot = DOT_STYLES[key] || 'bg-slate-400'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-sm ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {key}
    </span>
  )
}
export function PaymentPill({ status }) {
  const key = (status || 'pending').toLowerCase()
  const style =
    key === 'paid'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
      : key === 'failed'
      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm ${style}`}>
      {key.toUpperCase()}
    </span>
  )
}