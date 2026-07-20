import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, AlertTriangle, ShoppingBag, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FEATURES = ['Product Management', 'Order Tracking', 'Customer Insights']

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const response = await login(email, password)

    console.log('Login response:', response)
    console.log('Login data:', response?.data)

    navigate('/')
  } catch (err) {
    console.error('Login error:', err)
    console.error('Error response:', err.response)
    console.error('Error data:', err.response?.data)
    console.error('Status code:', err.response?.status)

    setError(
      err.response?.data?.message ||
      err.message ||
      'فشل تسجيل الدخول، حاول تاني'
    )
  } finally {
    setLoading(false)
  }

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'فشل تسجيل الدخول، حاول تاني')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-soft overflow-hidden grid md:grid-cols-2">
        <div className="relative hidden md:flex flex-col justify-center px-12 py-16 bg-gradient-to-br from-[#216EE8] to-[#1196DC] text-white overflow-hidden">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl border-2 border-white/70 flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold">Koda Commerce</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-5">
            Manage Your Store
            <br />
            Like a Pro
          </h1>

          <p className="text-white/80 text-sm leading-relaxed mb-10 max-w-xs">
            Control products, orders, users, carts and analytics from a modern dashboard experience.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2.5 bg-white/15 rounded-2xl px-4 py-3 text-sm font-medium backdrop-blur-sm"
              >
                <Check className="w-4 h-4" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 py-12 sm:px-14">
          <div className="text-center mb-8">
            <p className="text-[11px] tracking-[0.3em] font-bold text-[#06B6D4]">COMMERCE</p>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Welcome Back</h2>
            <p className="text-sm text-koda-muted mt-1">Sign in to your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-600 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-koda-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl shadow-soft bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-koda-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl shadow-soft bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#06B6D4] hover:bg-[#0891B2] text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}