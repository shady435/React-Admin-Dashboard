import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuickEditModal from "./QuickEditModal";
const API_BASE =
  import.meta.env?.VITE_API_BASE_URL || "https://e-commerce-api-3wara.vercel.app";
const api = axios.create({
  baseURL: API_BASE,
});
const DEV_FALLBACK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MzU2MTY5NCwiZXhwIjoxNzgzOTkzNjk0fQ.pbcJKo6R3cwfMp-H5wJ95SVDk8KJhR92vV2C2z8N8Og";
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || DEV_FALLBACK_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
function normalizeProduct(p) {
  const images = (p.images ?? []).map((img) =>
    typeof img === "string" ? img : img.url
  );
  const price = Number(p.price ?? 0);
  const discount = p.discountPrice ? Number(p.discountPrice) : null;
  const stock = Number(p.stock ?? 0);
  return {
    id: p._id ?? p.id ?? p.slug,
    title: p.name ?? p.title ?? "Untitled product",
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? p.shortDescription ?? "",
    images,
    category: p.category ?? "",
    subcategory: p.subcategory ?? "",
    brand: p.brand ?? "",
    sku: p.sku ?? "",
    price,
    discount,
    tags: p.tags ?? [],
    stock,
    featured: Boolean(p.featured),
    isActive: p.isActive ?? true,
    averageRating: p.averageRating ?? 0,
    numReviews: p.numReviews ?? 0,
    slug: p.slug ?? "",
  };
}
function currency(n) {
  return `$${Number(n).toLocaleString()}`;
}
const Icon = {
  Box: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M21 8.5 12 4 3 8.5m18 0-9 4.5m9-4.5v7L12 20m0-7.5L3 8.5m9 4.5V20m-9-11.5v7L12 20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Star: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trend: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Cube: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M21 16.5V7.5L12 3 3 7.5v9L12 21l9-4.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  ),
  Filter: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  ),
  Plus: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Eye: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Edit: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Bolt: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trash: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
function StatCard({ icon: IconCmp, value, label, accent }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <IconCmp className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</div>
        <div className="mt-1 text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}
function ProductCard({ product, onView, onEdit, onQuickEdit, onDelete, deleting }) {
  const breadcrumb = [product.category, product.subcategory, product.brand]
    .filter(Boolean)
    .map((s) => s.toUpperCase());
  const outOfStock = product.stock <= 0;
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="relative h-56 w-full bg-gray-100 dark:bg-slate-800">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-slate-600">
            <Icon.Box className="h-10 w-10" />
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-amber-400 px-2 py-1 text-[11px] font-semibold text-slate-900">
            <Icon.Star className="h-3 w-3" /> Featured
          </span>
        )}
        <span
          className={`absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            outOfStock
              ? "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          }`}
        >
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{product.title}</h3>
        {breadcrumb.length > 0 && (
          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-cyan-500 dark:text-cyan-400">
            {breadcrumb.join(" · ")}
          </p>
        )}
        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-slate-400">
            {product.shortDescription}
          </p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{currency(product.price)}</span>
          {product.discount ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              -{currency(product.discount)} off
            </span>
          ) : null}
        </div>
        {product.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-gray-600 dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 border-t border-gray-100 dark:border-slate-800 pt-3">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onView(product)}
              className="flex items-center justify-center gap-1 rounded-lg bg-gray-100 dark:bg-slate-800 px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <Icon.Eye className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">View</span>
            </button>
            <button
              onClick={() => onEdit(product)}
              className="flex items-center justify-center gap-1 rounded-lg bg-gray-100 dark:bg-slate-800 px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <Icon.Edit className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Edit</span>
            </button>
            <button
              onClick={() => onQuickEdit(product)}
              className="flex items-center justify-center gap-1 rounded-lg bg-gray-100 dark:bg-slate-800 px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <Icon.Bolt className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Quick</span>
            </button>
          </div>
          <button
            onClick={() => onDelete(product)}
            disabled={deleting}
            className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50"
          >
            <Icon.Trash className="h-3.5 w-3.5" /> {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [quickEditProductId, setQuickEditProductId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all"); 
  const handleAddProduct = useCallback(
  () => navigate("/addproducts"),
  [navigate]
  );
  const handleView = useCallback((p) => navigate(`/products/${p.id}`), [navigate]);
  const handleEdit = useCallback((p) => navigate(`/products/edit/${p.id}`), [navigate]);
  const handleQuickEdit = useCallback((p) => setQuickEditProductId(p.id), []);
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : data.products ?? data.data ?? [];
      setProducts(rawList.map(normalizeProduct));
    } catch (err) {
      setError(err.message || "Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const handleDelete = useCallback(async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.title}"? This can't be undone.`
    );
    if (!confirmed) return;
    setDeletingId(product.id);
    try {
      await api.delete(`/products/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
          "Failed to delete this product. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }, []);
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in" && p.stock > 0) ||
        (stockFilter === "out" && p.stock <= 0);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);
  const stats = useMemo(
    () => ({
      total: products.length,
      featured: products.filter((p) => p.featured).length,
      inStock: products.filter((p) => p.stock > 0).length,
      outOfStock: products.filter((p) => p.stock <= 0).length,
    }),
    [products]
  );
  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 p-6 md:p-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400">
            <Icon.Box className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-cyan-500 dark:text-cyan-400">
              PRODUCT DASHBOARD
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          </div>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-400"
        >
          <Icon.Plus className="h-4 w-4" /> Add Product
        </button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Icon.Box} value={stats.total} label="Total" accent="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400" />
        <StatCard icon={Icon.Star} value={stats.featured} label="Featured" accent="bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400" />
        <StatCard icon={Icon.Trend} value={stats.inStock} label="In Stock" accent="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400" />
        <StatCard icon={Icon.Cube} value={stats.outOfStock} label="Out of Stock" accent="bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400" />
      </div>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 dark:bg-slate-800 px-3 py-2.5">
          <Icon.Search className="h-4 w-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
        >
          <Icon.Filter className="h-4 w-4" /> Filters
        </button>
        <button
          onClick={() => setSearch(searchInput)}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-400"
        >
          <Icon.Search className="h-4 w-4" /> Search
        </button>
      </div>
      {showFilters && (
        <div className="mt-3 flex flex-wrap gap-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-white focus:outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-white focus:outline-none"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
      )}
      <div className="mt-6">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800"
              />
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center text-sm text-red-600 dark:text-red-400">
            Couldn't load products: {error}
            <button
              onClick={fetchProducts}
              className="mt-3 block w-full rounded-lg bg-red-100 dark:bg-red-950/50 py-2 font-medium hover:bg-red-200 dark:hover:bg-red-950/70"
            >
              Try again
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-10 text-center text-sm text-gray-400">
            No products match your search.
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={handleView}
                onEdit={handleEdit}
                onQuickEdit={handleQuickEdit}
                onDelete={handleDelete}
                deleting={deletingId === p.id}
              />
            ))}
          </div>
        )}
      </div>
      {quickEditProductId && (
        <QuickEditModal
          productId={quickEditProductId}
          onClose={() => setQuickEditProductId(null)}
          onSaved={() => fetchProducts()}
        />
      )}
    </div>
  );
}