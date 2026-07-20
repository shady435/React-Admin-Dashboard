import { useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { StatusPill } from './statusbadge'
import { STATUS_OPTIONS } from './utils'
export function FilterSelect({ value, onChange, label, options }) {
  const [open, setOpen] = useState(false)
  const display = value === 'all' ? label : value
  const handleSelect = (opt) => {
    setOpen(false)
    onChange(opt)
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-2xl shadow-soft bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-koda-teal/40 capitalize"
      >
        {display}
        <ChevronDown className={`w-4 h-4 text-koda-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-soft py-1 overflow-hidden">
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                value === 'all' ? 'bg-slate-50 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {label}
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  opt === value ? 'bg-slate-50 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
export function StatusDropdown({ order, onChange, disabled }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (opt) => {
    setOpen(false)
    if (opt !== order.status) onChange(opt)
  }
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="flex items-center gap-1.5 focus:outline-none disabled:cursor-wait"
      >
        <StatusPill status={order.status} />
        {disabled ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-koda-muted" />
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 text-koda-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-soft py-1 overflow-hidden">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3.5 py-2 text-sm capitalize transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  opt === order.status ? 'bg-slate-50 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}