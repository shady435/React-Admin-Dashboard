import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {ArrowLeft, BadgeCheck,Box,ChevronLeft,ChevronRight,Edit3,Eye,ImageOff,Loader2,Package,Star,Tag,} from "lucide-react";
const API_BASE =
  import.meta.env?.VITE_API_BASE_URL ||
  "https://e-commerce-api-3wara.vercel.app";
  
const api = axios.create({
  baseURL: API_BASE,
});

const DEV_FALLBACK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MzU2MTY5NCwiZXhwIjoxNzgzOTkzNjk0fQ.pbcJKo6R3cwfMp-H5wJ95SVDk8KJhR92vV2C2z8N8Og";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || DEV_FALLBACK_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function normalizeProduct(product) {
  const images = (product.images || [])
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean);

  return {
    id: product._id || product.id || "",
    name: product.name || product.title || "Untitled product",
    shortDescription: product.shortDescription || "",
    description:
      product.description ||
      product.shortDescription ||
      "No description available.",
    price: Number(product.price || 0),
    discountPrice:
      product.discountPrice !== undefined &&
      product.discountPrice !== null &&
      product.discountPrice !== ""
        ? Number(product.discountPrice)
        : null,
    stock: Number(product.stock || 0),
    sku: product.sku || "N/A",
    category: product.category || "Uncategorized",
    subcategory: product.subcategory || "",
    brand: product.brand || "N/A",
    featured: Boolean(product.featured),
    isActive: product.isActive ?? true,
    tags: Array.isArray(product.tags) ? product.tags : [],
    images,
    averageRating: Number(product.averageRating || 0),
    numReviews: Number(product.numReviews || 0),
    createdAt: product.createdAt || "",
    updatedAt: product.updatedAt || "",
  };
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 dark:bg-slate-800 p-3.5">
      <span className="block mb-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-extrabold tracking-wide uppercase">
        {label}
      </span>
      <span className="block break-words text-slate-800 dark:text-white text-[13px] font-bold">
        {value || "N/A"}
      </span>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/products/${id}`);
        const rawProduct = data.product || data.data || data;

        if (!rawProduct || typeof rawProduct !== "object") {
          throw new Error("Product data was not found.");
        }

        if (active) {
          setProduct(normalizeProduct(rawProduct));
          setSelectedImage(0);
        }
      } catch (err) {
        console.error("Failed to load product:", err.response?.data || err);

        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load this product."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const discountAmount = useMemo(() => {
    if (!product?.discountPrice || product.discountPrice >= product.price) {
      return 0;
    }

    return product.price - product.discountPrice;
  }, [product]);

  const displayedPrice =
    product?.discountPrice && product.discountPrice < product.price
      ? product.discountPrice
      : product?.price;

  const previousImage = () => {
    if (!product?.images.length) return;

    setSelectedImage((current) =>
      current === 0 ? product.images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    if (!product?.images.length) return;

    setSelectedImage((current) =>
      current === product.images.length - 1 ? 0 : current + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-white px-4 py-6">
        <div className="flex max-w-[560px] min-h-[280px] mx-auto my-[70px] flex-col items-center justify-center gap-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-7 text-center text-slate-500 dark:text-slate-400">
          <Loader2 className="text-cyan-600 dark:text-cyan-400 animate-spin" size={32} />
          <p className="m-0">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-white px-4 py-6">
        <div className="flex max-w-[560px] min-h-[280px] mx-auto my-[70px] flex-col items-center justify-center gap-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-7 text-center text-slate-500 dark:text-slate-400">
          <Package size={38} />
          <h2 className="m-0 text-slate-900 dark:text-white">Product could not be loaded</h2>
          <p className="m-0">
            {error || "The requested product was not found."}
          </p>

          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-[18px] py-[11px] text-cyan-950 text-sm font-extrabold cursor-pointer"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft size={17} />
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-white px-4 py-6">
      <div className="max-w-[1180px] mx-auto">
        {/* Hero */}
        <div className="overflow-hidden rounded-3xl bg-slate-950 dark:bg-black dark:ring-1 dark:ring-slate-800 p-[30px] text-white shadow-[0_18px_50px_rgba(15,23,42,0.15)]">
          <button
            type="button"
            className="inline-flex items-center gap-2 mb-6 rounded-full bg-white/10 hover:bg-white/[0.18] px-4 py-[9px] text-white text-sm font-semibold cursor-pointer"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft size={17} />
            Back to products
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex w-[58px] h-[58px] shrink-0 items-center justify-center rounded-2xl bg-cyan-400/[0.18] text-cyan-400">
                <Package size={28} />
              </div>

              <div>
                <p className="m-0 mb-[5px] text-cyan-400 text-[11px] font-extrabold tracking-[2px]">
                  PRODUCT DETAILS
                </p>
                <h1 className="m-0 text-white text-[clamp(25px,4vw,34px)] leading-[1.2]">
                  {product.name}
                </h1>
                <p className="mt-2 mb-0 text-slate-400 text-sm">
                  Review product information, inventory, pricing and gallery.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-[18px] py-[11px] text-cyan-950 text-sm font-extrabold cursor-pointer"
              onClick={() => navigate(`/products/edit/${product.id}`)}
            >
              <Edit3 size={17} />
              Edit Product
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 mt-6">
          {/* Gallery */}
          <section className="border border-slate-200 dark:border-slate-800 rounded-[20px] bg-white dark:bg-slate-900 shadow-[0_5px_22px_rgba(15,23,42,0.05)] p-[18px]">
            <div className="relative overflow-hidden min-h-[330px] sm:min-h-[480px] rounded-2xl bg-slate-100 dark:bg-slate-800">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="block w-full h-[330px] sm:h-[480px] object-cover"
                  />

                  {product.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="absolute top-1/2 left-3.5 flex w-[42px] h-[42px] items-center justify-center -translate-y-1/2 rounded-full bg-slate-950/[0.72] hover:bg-slate-950 text-white cursor-pointer"
                        onClick={previousImage}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        type="button"
                        className="absolute top-1/2 right-3.5 flex w-[42px] h-[42px] items-center justify-center -translate-y-1/2 rounded-full bg-slate-950/[0.72] hover:bg-slate-950 text-white cursor-pointer"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-[330px] sm:h-[480px] flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-600">
                  <ImageOff size={48} />
                  <span>No product image</span>
                </div>
              )}

              {product.featured && (
                <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-[11px] py-[7px] text-[11px] font-extrabold text-amber-950">
                  <Star size={14} />
                  Featured
                </span>
              )}

              <span
                className={`absolute right-3.5 bottom-3.5 inline-flex items-center gap-1.5 rounded-full px-[11px] py-[7px] text-[11px] font-extrabold ${
                  outOfStock
                    ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                }`}
              >
                {outOfStock ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mt-3.5">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden h-[76px] border-2 rounded-[11px] bg-slate-100 dark:bg-slate-800 p-0 cursor-pointer ${
                      selectedImage === index
                        ? "border-cyan-400"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="block w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Info */}
          <section className="border border-slate-200 dark:border-slate-800 rounded-[20px] bg-white dark:bg-slate-900 shadow-[0_5px_22px_rgba(15,23,42,0.05)] p-[18px] sm:p-[26px]">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-[18px]">
              <div>
                <p className="m-0 mb-[7px] text-cyan-600 dark:text-cyan-400 text-[11px] font-extrabold tracking-[1.2px] uppercase">
                  {[product.category, product.subcategory, product.brand]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                <h2 className="m-0 text-slate-900 dark:text-white text-[28px] leading-[1.25]">
                  {product.name}
                </h2>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-[5px] rounded-full px-[11px] py-[7px] text-[11px] font-extrabold ${
                  product.isActive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <BadgeCheck size={15} />
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {product.shortDescription && (
              <p className="mt-[15px] mb-0 text-slate-500 dark:text-slate-400 text-[15px] leading-[1.7]">
                {product.shortDescription}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-[22px] rounded-2xl bg-slate-50 dark:bg-slate-800 p-[17px]">
              <div>
                <span className="block mb-1 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase">
                  Current price
                </span>

                <div className="flex items-baseline gap-2.5">
                  <strong className="text-slate-900 dark:text-white text-[29px]">
                    {formatCurrency(displayedPrice)}
                  </strong>

                  {discountAmount > 0 && (
                    <span className="text-slate-400 dark:text-slate-500 text-sm line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
              </div>

              {discountAmount > 0 && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-[11px] py-[7px] text-emerald-700 dark:text-emerald-400 text-[11px] font-extrabold">
                  Save {formatCurrency(discountAmount)}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-[18px]">
              <div className="flex items-center gap-[7px] text-slate-500 dark:text-slate-400 text-[13px]">
                <Star size={17} fill="currentColor" className="text-amber-500" />
                <strong className="text-slate-900 dark:text-white">
                  {product.averageRating.toFixed(1)}
                </strong>
                <span>({product.numReviews} reviews)</span>
              </div>

              <div className="flex items-center gap-[7px] text-slate-500 dark:text-slate-400 text-[13px]">
                <Eye size={16} />
                Product preview
              </div>
            </div>

            <div className="h-px my-[22px] bg-slate-200 dark:bg-slate-800" />

            <h3 className="m-0 mb-[9px] text-slate-900 dark:text-white text-[15px]">
              Description
            </h3>
            <p className="m-0 text-slate-500 dark:text-slate-400 text-sm leading-[1.8] whitespace-pre-line">
              {product.description}
            </p>

            {product.tags.length > 0 && (
              <>
                <h3 className="flex items-center gap-[7px] mt-[22px] mb-[9px] text-slate-900 dark:text-white text-[15px]">
                  <Tag size={17} />
                  Tags
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-cyan-200 dark:border-cyan-800 rounded-full bg-cyan-50 dark:bg-cyan-950/40 px-[11px] py-[6px] text-cyan-700 dark:text-cyan-300 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Details */}
        <section className="mt-6 border border-slate-200 dark:border-slate-800 rounded-[20px] bg-white dark:bg-slate-900 shadow-[0_5px_22px_rgba(15,23,42,0.05)] p-[18px] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex w-[42px] h-[42px] items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
              <Box size={20} />
            </div>

            <div>
              <h2 className="m-0 text-lg text-slate-900 dark:text-white">Product information</h2>
              <p className="mt-[3px] mb-0 text-slate-500 dark:text-slate-400 text-xs">
                Complete product and inventory details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
            <DetailItem label="Product ID" value={product.id} />
            <DetailItem label="SKU" value={product.sku} />
            <DetailItem label="Category" value={product.category} />
            <DetailItem label="Subcategory" value={product.subcategory} />
            <DetailItem label="Brand" value={product.brand} />
            <DetailItem label="Stock quantity" value={String(product.stock)} />
            <DetailItem
              label="Original price"
              value={formatCurrency(product.price)}
            />
            <DetailItem
              label="Discount price"
              value={
                product.discountPrice
                  ? formatCurrency(product.discountPrice)
                  : "No discount"
              }
            />
            <DetailItem
              label="Created at"
              value={formatDate(product.createdAt)}
            />
            <DetailItem
              label="Last updated"
              value={formatDate(product.updatedAt)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}