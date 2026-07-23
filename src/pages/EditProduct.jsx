import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {ArrowLeft,ImagePlus,Package,X,Plus,Loader2,CheckCircle2,} from "lucide-react";
const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app",
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
export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesError, setImagesError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const {register,handleSubmit,watch,reset,formState: { errors },
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
  useEffect(() => {
    let active = true;
    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        setLoadError("");
        const { data } = await api.get(`/products/${id}`);
        const product = data.product || data.data || data;
        if (!product || typeof product !== "object") {
          throw new Error("Product was not found.");
        }
        if (!active) return;
        reset({
          name: product.name || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          stock: product.stock ?? "",
          sku: product.sku || "",
          category: product.category || "electronics",
          subcategory: product.subcategory || "",
          brand: product.brand || "",
          featured: Boolean(product.featured),
          isActive: product.isActive ?? true,
        });
        setTags(Array.isArray(product.tags) ? product.tags : []);
        setExistingImages(
          (product.images || [])
            .map((img) => (typeof img === "string" ? img : img?.url))
            .filter(Boolean)
        );
      } catch (err) {
        console.error("Load product failed:", err.response?.data || err);
        if (active) {
          setLoadError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load this product."
          );
        }
      } finally {
        if (active) {
          setLoadingProduct(false);
        }
      }
    }
    fetchProduct();
    return () => {
      active = false;
    };
  }, [id, reset]);
  useEffect(() => {
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [newImages]);
  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter((file) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)
    );
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((previous) => [...previous, ...mapped]);
    if (mapped.length > 0) {
      setImagesError("");
    }
  };
  const handleFileInput = (event) => {
    if (event.target.files?.length) {
      addFiles(event.target.files);
    }
    event.target.value = "";
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  };
  const removeExistingImage = (index) => {
    setExistingImages((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  };
  const removeNewImage = (index) => {
    setNewImages((previous) => {
      const imageToRemove = previous[index];
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return previous.filter((_, currentIndex) => currentIndex !== index);
    });
  };
  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((previous) => [...previous, value]);
    }
    setTagInput("");
  };
  const removeTag = (tag) => {
    setTags((previous) => previous.filter((item) => item !== tag));
  };
  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };
  const onSubmit = async (formData) => {
    setApiError("");
    setImagesError("");
    if (existingImages.length + newImages.length === 0) {
      setImagesError("Keep at least one image.");
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("shortDescription", formData.shortDescription.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("sku", formData.sku.trim());
      data.append("category", formData.category);
      data.append("brand", formData.brand.trim());
      data.append("featured", String(formData.featured));
      data.append("isActive", String(formData.isActive));
      if (formData.discountPrice) {
        data.append("discountPrice", formData.discountPrice);
      }
      if (formData.subcategory) {
        data.append("subcategory", formData.subcategory.trim());
      }
      data.append("tags", JSON.stringify(tags));
      newImages.forEach((image) => {
        data.append("images", image.file);
      });
      await api.patch(`/products/update/${id}`, data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      const responseData = err.response?.data;
      let message =
        responseData?.message ||
        "Failed to update product. Please try again.";
      const details = responseData?.errors || responseData?.details;
      if (details) {
        const detailText = Array.isArray(details)
          ? details
              .map((detail) => detail.message || detail.msg || JSON.stringify(detail))
              .join(" — ")
          : typeof details === "object"
            ? Object.entries(details)
                .map(([field, value]) => `${field}: ${value}`)
                .join(" — ")
            : String(details);

        message = `${message}: ${detailText}`;
      }
      setApiError(message);
      console.error("Product update failed:", responseData || err);
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
  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-transparent px-4 py-10">
        <div className="mx-auto flex min-h-[280px] max-w-xl flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-slate-500 dark:text-slate-400 shadow-sm">
          <Loader2 className="animate-spin text-cyan-500" size={32} />
          <p className="text-sm font-medium">Loading product...</p>
        </div>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-transparent px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">{loadError}</p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:hover:bg-slate-600"
          >
            <ArrowLeft size={16} />
            Back to products
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent px-4 py-6 text-slate-900 dark:text-white md:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 overflow-hidden rounded-3xl bg-slate-950 dark:bg-black p-6 text-white shadow-xl md:p-8 dark:ring-1 dark:ring-slate-800">
          <button
            type="button"
            onClick={() => navigate("/products")}
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
                  EDIT PRODUCT
                </p>
                <h1 className="text-2xl font-extrabold text-white md:text-3xl">
                  Update this product entry
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Change details, update images, and save your changes.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs font-bold tracking-[0.2em] text-slate-400">
                READY
              </p>
              <p className="mt-1 text-sm text-slate-200">
                Update and save with one click.
              </p>
            </div>
          </div>
        </section>
        {apiError && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="h-fit rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400">
                  <ImagePlus size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Gallery</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Existing images plus any new ones you add.
                  </p>
                </div>
              </div>
              {(existingImages.length > 0 || newImages.length > 0) && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {existingImages.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={url}
                        alt={`Current product ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                        aria-label="Remove current image"
                      >
                        <X size={14} />
                      </button>
                      <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-center text-[10px] font-semibold tracking-widest text-white">
                        CURRENT
                      </span>
                    </div>
                  ))}
                  {newImages.map((image, index) => (
                    <div
                      key={`${image.preview}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-cyan-200 dark:border-cyan-800"
                    >
                      <img
                        src={image.preview}
                        alt={`New product ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                        aria-label="Remove new image"
                      >
                        <X size={14} />
                      </button>
                      <span className="absolute inset-x-0 bottom-0 bg-cyan-600/90 py-1 text-center text-[10px] font-semibold tracking-widest text-white">
                        NEW
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <label
                onDragOver={(event) => {
                  event.preventDefault();
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
                <ImagePlus className="text-cyan-500 dark:text-cyan-400" size={24} />
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  Upload images
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG or WEBP multiple files supported
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
            </section>
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Product Name
                </label>
                <input
                  className={inputClass("name")}
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Short Description
                </label>
                <input
                  className={inputClass("shortDescription")}
                  {...register("shortDescription", {
                    required: "Short description is required",
                    minLength: {
                      value: 10,
                      message: "Minimum 10 characters",
                    },
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
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Minimum 20 characters",
                    },
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
                    {...register("price", {
                      required: "Enter a valid price",
                      min: {
                        value: 0.01,
                        message: "Enter a valid price",
                      },
                    })}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errors.price.message}
                    </p>
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
                    {...register("stock", {
                      required: "Enter valid stock quantity",
                      min: {
                        value: 0,
                        message: "Enter valid stock quantity",
                      },
                    })}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    SKU
                  </label>
                  <input
                    className={inputClass("sku")}
                    {...register("sku", {
                      required: "SKU is required",
                    })}
                  />
                  {errors.sku && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errors.sku.message}
                    </p>
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
                    {...register("category", {
                      required: "Category is required",
                    })}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                  {...register("brand", {
                    required: "Brand is required",
                  })}
                />
                {errors.brand && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.brand.message}
                  </p>
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
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 dark:bg-slate-700 text-white transition hover:bg-slate-950 dark:hover:bg-slate-600"
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
                        className="inline-flex items-center gap-2 rounded-full bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-700 dark:text-cyan-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
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
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-cyan-500"
                    {...register("featured")}
                  />
                  Featured
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-cyan-500"
                    {...register("isActive")}
                  />
                  Active
                </label>
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
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
                  {submitting
                    ? "Saving..."
                    : success
                      ? "Saved!"
                      : "Save Changes"}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}