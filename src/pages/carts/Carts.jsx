import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Package, Tag } from "lucide-react";

const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || DEV_FALLBACK_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Carts() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/carts");
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load the cart from the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[#F1F5F9] dark:bg-slate-950">
      <div className="w-full rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        <span className="text-xs font-bold tracking-widest text-cyan-500 dark:text-cyan-400 uppercase">
          Cart
        </span>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Cart overview
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          Live snapshot of the current cart returned by the API, including
          items, pricing, and any applied coupon.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
          Loading cart...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-dashed border-red-200 dark:border-red-800 p-10 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && (!cart || !cart.items?.length) && (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
          The cart is currently empty.
        </div>
      )}

      {!loading && !error && cart?.items?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Items
              </h2>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <ShoppingCart size={14} />
                {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Package size={18} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {item.price * item.quantity} AED
                  </span>
                </div>
              ))}
            </div>
          </div>


          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6 h-fit space-y-3">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Summary
            </h2>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="text-gray-800 dark:text-gray-100">{cart.subtotal} AED</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Discount</span>
              <span className="text-gray-800 dark:text-gray-100">-{cart.discountAmount} AED</span>
            </div>

            {cart.coupon && (
              <div className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400">
                <Tag size={12} /> Coupon applied: {cart.coupon}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {cart.total} AED
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}