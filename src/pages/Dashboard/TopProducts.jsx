import { useEffect, useState } from "react";
const API_BASE = "https://e-commerce-api-3wara.vercel.app";
export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl p-6 shadow-md">
        Loading...
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <h2 className="text-cyan-400 dark:text-cyan-300 text-sm tracking-[5px] uppercase">
        Top Products
      </h2>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mt-2 mb-6">
        Best Sellers
      </h1>
      <div className="space-y-4">
        {products.slice(0, 5).map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  ${product.price}
                </p>
              </div>
            </div>
            <span className="text-cyan-500 dark:text-cyan-400 font-semibold">
              Stock: {product.stock}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}