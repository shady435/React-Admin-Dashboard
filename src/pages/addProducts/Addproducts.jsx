import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ArrowLeft, ImagePlus, Package, X, Plus, Loader2, CheckCircle2 } from "lucide-react";
const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app",
});
const DEV_FALLBACK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzY5NzY4NywiZXhwIjoxNzg0MTI5NjfQ.-QGbSF3VUf6y80VcN5w909MqauW90439-M42W0GqV7Y";
  api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default function AddProduct({ onBack, onCreated }) {
  const [images, setImages] = useState([]);
  const [imagesError, setImagesError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      sku: "",
      category: "electronics",
      subcategory: "",
      brand: "",
      featured: false,
      isActive: true,
    },
  });

  const priceValue = watch("price");

  const categories = [
    "electronics",
    "fashion",
    "home",
    "beauty",
    "sports",
    "toys",
    "books",
    "other",
  ];

  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)
    );
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...mapped]);
    if (mapped.length) setImagesError("");
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }, []);

  const removeImage = (index) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setTags([]);
    setImagesError("");
    reset();
  };

  const onSubmit = async (data) => {
    setApiError("");

    if (images.length === 0) {
      setImagesError("Upload at least one image");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", data.name.trim());
      fd.append("shortDescription", data.shortDescription.trim());
      fd.append("description", data.description.trim());
      fd.append("price", data.price);
      if (data.discountPrice) fd.append("discountPrice", data.discountPrice);
      fd.append("stock", data.stock);
      fd.append("sku", data.sku.trim());
      fd.append("category", data.category);
      if (data.subcategory) fd.append("subcategory", data.subcategory.trim());
      fd.append("brand", data.brand.trim());
      fd.append("featured", data.featured);
      fd.append("isActive", data.isActive);
      tags.forEach((tag, index) => {
         fd.append(`tags[${index}]`, tag);
      });
      images.forEach((img) => fd.append("images", img.file));

      const { data: res } = await api.post("/products", fd, {
        
      });

      setSuccess(true);
      onCreated?.(res.product);

      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 1800);
    } catch (err) {
      const resData = err.response?.data;
      let message = resData?.message || "Failed to create product. Please try again.";
      const details = resData?.errors || resData?.details;
      if (details) {
        const list = Array.isArray(details)
          ? details.map((d) => d.message || d.msg || JSON.stringify(d)).join(" — ")
          : typeof details === "object"
          ? Object.entries(details)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(" — ")
          : String(details);
        message = `${message}: ${list}`;
      }

      setApiError(message);
      console.error("Product create failed:", resData || err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition ${
      errors[fieldName]
        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:bg-red-950/40 dark:border-red-500/60"
        : "border-slate-200 bg-slate-50 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:focus:ring-cyan-900/40"
    }`;

  return (
    <div className="min-h-screen bg-[#F1F5F9] px-4 py-6 text-slate-900 md:px-6 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8 dark:bg-black dark:ring-1 dark:ring-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back to products
          </button>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-300">
                <Package size={26} />
              </div>

              <div>
                <p className="mb-1 text-xs font-bold tracking-[0.2em] text-cyan-300">
                  CREATE PRODUCT
                </p>

                <h1 className="text-2xl font-extrabold text-white md:text-3xl">
                  Launch a polished product entry
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Add products with validation, image previews, multi-upload support, and smooth UX.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs font-bold tracking-[0.2em] text-slate-400">
                READY
              </p>
              <p className="mt-1 text-sm text-slate-200">
                Create, validate, and save with one click.
              </p>
            </div>
          </div>
        </section>

        {apiError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-300">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-400">
                  <ImagePlus size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Gallery</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload multiple images and preview instantly.
                  </p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={img.preview}
                        alt={`Image ${i + 1}`}
                        className="h-32 w-full object-cover"
                      />

                      <button
                        onClick={() => removeImage(i)}
                        type="button"
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                        aria-label="Remove image"
                      >
                        <X size={13} />
                      </button>

                      <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-center text-[10px] font-semibold tracking-widest text-white">
                        IMAGE {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-950/30"
                    : "border-cyan-200 bg-cyan-50/50 hover:border-cyan-400 hover:bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/10 dark:hover:border-cyan-600 dark:hover:bg-cyan-950/20"
                }`}
              >
                <ImagePlus className="text-cyan-500 dark:text-cyan-400" size={22} />
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  Upload images
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG, WEBP • multiple files supported
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>

              {imagesError && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">{imagesError}</p>
              )}

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <span className="mt-0.5 text-emerald-500">✦</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    Senior UX
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-400/80">
                    Optimized product creation experience with responsive design and smooth interactions.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Product Name
                </label>
                <input
                  className={inputClass("name")}
                  placeholder="iPhone 16 Pro"
                  {...register("name", { required: "Product name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Short Description
                </label>
                <input
                  className={inputClass("shortDescription")}
                  placeholder="Minimum 10 characters"
                  {...register("shortDescription", {
                    required: "Short description is required",
                    minLength: { value: 10, message: "Minimum 10 characters" },
                  })}
                />
                {errors.shortDescription && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={4}
                  className={`${inputClass("description")} resize-y`}
                  placeholder="Minimum 20 characters"
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 20, message: "Minimum 20 characters" },
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClass("price")}
                    placeholder="0.00"
                    {...register("price", {
                      required: "Enter a valid price",
                      min: { value: 0.01, message: "Enter a valid price" },
                    })}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.price.message}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClass("discountPrice")}
                    placeholder="0.00"
                    {...register("discountPrice", {
                      validate: (value) =>
                        !value ||
                        Number(value) < Number(priceValue || 0) ||
                        "Must be less than price",
                    })}
                  />
                  {errors.discountPrice && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errors.discountPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Stock
                  </label>
                  <input
                    type="number"
                    className={inputClass("stock")}
                    placeholder="0"
                    {...register("stock", {
                      required: "Enter valid stock quantity",
                      min: { value: 0, message: "Enter valid stock quantity" },
                    })}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.stock.message}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    SKU
                  </label>
                  <input
                    className={inputClass("sku")}
                    placeholder="WH-001"
                    {...register("sku", { required: "SKU is required" })}
                  />
                  {errors.sku && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.sku.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    className={inputClass("category")}
                    {...register("category", { required: "Category is required" })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Subcategory
                  </label>
                  <input
                    className={inputClass("subcategory")}
                    placeholder="audio"
                    {...register("subcategory")}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Brand
                </label>
                <input
                  className={inputClass("brand")}
                  placeholder="Sony"
                  {...register("brand", { required: "Brand is required" })}
                />
                {errors.brand && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.brand.message}</p>
                )}
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    className={inputClass("tag")}
                    placeholder="Type a tag and press +"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button
                    onClick={addTag}
                    type="button"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white transition hover:bg-slate-950 dark:bg-slate-700 dark:hover:bg-slate-600"
                    aria-label="Add tag"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {tags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          type="button"
                          className="text-cyan-700 hover:text-cyan-950 dark:text-cyan-300 dark:hover:text-cyan-100"
                          aria-label={`Remove ${tag}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    Add one or more tags to organize the product.
                  </p>
                )}
              </div>

              <div className="mb-6 flex flex-wrap gap-5">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input type="checkbox" className="h-4 w-4 accent-cyan-500" {...register("featured")} />
                  Featured
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input type="checkbox" className="h-4 w-4 accent-cyan-500" {...register("isActive")} />
                  Active
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onBack?.();
                  }}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {success && <CheckCircle2 size={16} />}
                  {submitting ? "Creating..." : success ? "Created!" : "Create Product"}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}