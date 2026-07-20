import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  X,
  ImagePlus,
  Package,
  Loader2,
  CheckCircle2,
  Plus,
} from "lucide-react";

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

/**
 * QuickEditModal
 * Props:
 *  - productId: string (the product's _id) — required, opens the modal when set
 *  - onClose: () => void — called when the modal should close
 *  - onSaved: (updatedProduct) => void — called after a successful save
 */
export default function QuickEditModal({ productId, onClose, onSaved }) {
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [productSlug, setProductSlug] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
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

  useEffect(() => {
    if (!productId) return;

    let active = true;

    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        setLoadError("");

        const { data } = await api.get(`/products/${productId}`);
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
        console.log("QuickEdit fetched product:", product);
        setProductSlug(product._id || productId);
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
        if (active) setLoadingProduct(false);
      }
    }

    fetchProduct();

    return () => {
      active = false;
    };
  }, [productId, reset]);

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
    if (mapped.length > 0) setImagesError("");
  };

  const handleFileInput = (event) => {
    if (event.target.files?.length) addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
  };

  const removeExistingImage = (index) => {
    setExistingImages((previous) => previous.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((previous) => {
      const imageToRemove = previous[index];
      if (imageToRemove?.preview) URL.revokeObjectURL(imageToRemove.preview);
      return previous.filter((_, i) => i !== index);
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

      tags.forEach((tag) => {
        data.append("tags", tag);
      });

      newImages.forEach((image) => {
        data.append("images", image.file);
      });

      const { data: response } = await api.patch(
        `/products/update/${productSlug}`,
        data
      );

      setSuccess(true);
      onSaved?.(response?.product || response?.data || response);

      setTimeout(() => {
        onClose?.();
      }, 900);
    } catch (err) {
      const responseData = err.response?.data;
      let message =
        responseData?.message || "Failed to update product. Please try again.";

      const details = responseData?.errors || responseData?.details;
      if (details) {
        const detailText = Array.isArray(details)
          ? details
              .map((d) => d.message || d.msg || JSON.stringify(d))
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

  if (!productId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(2, 6, 23, 0.6)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Product</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          {loadingProduct && (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="animate-spin text-cyan-500" size={32} />
              <p className="text-sm font-medium">Loading product...</p>
            </div>
          )}

          {!loadingProduct && loadError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-6 text-center text-sm font-medium text-red-700 dark:text-red-300">
              {loadError}
            </div>
          )}

          {!loadingProduct && !loadError && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {apiError && (
                <div className="mb-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400">
                      <ImagePlus size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Product Gallery
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Upload and manage images
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
                            alt={`Image ${index + 1}`}
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
                            Image {index + 1}
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
                            alt={`New image ${index + 1}`}
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
                      Click to upload images
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP
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
                <section>
                  <div className="mb-4">
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

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Short Description
                    </label>
                    <input
                      className={inputClass("shortDescription")}
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

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className={`${inputClass("description")} resize-y`}
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
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className={inputClass("price")}
                        {...register("price", {
                          required: "Enter a valid price",
                          min: { value: 0.01, message: "Enter a valid price" },
                        })}
                      />
                      {errors.price && (
                        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
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
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Stock
                      </label>
                      <input
                        type="number"
                        className={inputClass("stock")}
                        {...register("stock", {
                          required: "Enter valid stock quantity",
                          min: { value: 0, message: "Enter valid stock quantity" },
                        })}
                      />
                      {errors.stock && (
                        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        SKU
                      </label>
                      <input
                        className={inputClass("sku")}
                        {...register("sku", { required: "SKU is required" })}
                      />
                      {errors.sku && (
                        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                          {errors.sku.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="mb-4">
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

                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Subcategory
                      </label>
                      <input
                        className={inputClass("subcategory")}
                        {...register("subcategory")}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Brand
                    </label>
                    <input
                      className={inputClass("brand")}
                      {...register("brand", { required: "Brand is required" })}
                    />
                    {errors.brand && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
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

                    {tags.length > 0 && (
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
                    )}
                  </div>

                  <div className="mb-2 flex flex-wrap gap-5">
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
                </section>
              </div>
              <div className="mt-4 flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
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
                  {submitting ? "Saving..." : success ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}