
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

import { apiFetch, getMediaUrl } from "@/lib/api";
import type { ProductsContent } from "@/types/cms";

interface Props {
  content?: ProductsContent;
  onUpdated: (content: ProductsContent) => void;
}

interface UploadResponse {
  message: string;
  fileUrl: string;
  publicId: string;
  resourceType: string;
  file: {
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    publicId: string;
  };
}

export default function ProductsEditor({
  content,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<ProductsContent>(
    content ?? {
      title: "",
      yearsNumber: "",
      yearsText: "",
      yearsDescription: "",
      backgroundImage: "",
      products: [],
    }
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setForm(content);
    }
  }, [content]);

  // UPDATE SECTION FIELD
  const updateField = (
    field: keyof ProductsContent,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // UPDATE PRODUCT FIELD
  const updateProduct = (
    index: number,
    field: "name" | "description" | "image" | "sortOrder",
    value: string | number
  ) => {
    setForm((previous) => ({
      ...previous,
      products: previous.products.map((product, productIndex) =>
        productIndex === index
          ? {
              ...product,
              [field]: value,
            }
          : product
      ),
    }));
  };

  // ADD PRODUCT
  const addProduct = () => {
    setForm((previous) => ({
      ...previous,
      products: [
        ...previous.products,
        {
          name: "",
          image: "",
          description: "",
          sortOrder: previous.products.length,
        },
      ],
    }));
  };

  // REMOVE PRODUCT
  const removeProduct = (index: number) => {
    setForm((previous) => ({
      ...previous,
      products: previous.products
        .filter((_, productIndex) => productIndex !== index)
        .map((product, productIndex) => ({
          ...product,
          sortOrder: productIndex,
        })),
    }));
  };

  // WEBP VALIDATION
  const isWebPImage = (file: File) => {
    const fileName = file.name.toLowerCase();

    return (
      fileName.endsWith(".webp") &&
      file.type === "image/webp"
    );
  };

  // UPLOAD IMAGE TO CLOUDINARY
  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    productIndex?: number
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!isWebPImage(file)) {
      toast.error(
        "Only WebP images are allowed. Please select a .webp image."
      );

      event.target.value = "";
      return;
    }

    const uploadKey =
      productIndex !== undefined
        ? `product-${productIndex}`
        : "background";

    try {
      setUploading(uploadKey);

      const formData = new FormData();

      formData.append("type", "hero-image");
      formData.append("file", file);

      const response = await apiFetch<UploadResponse>(
        "/uploads",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadedUrl = response.file?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Cloudinary image URL was not received."
        );
      }

      if (!uploadedUrl.startsWith("https://")) {
        throw new Error(
          "Invalid Cloudinary image URL received."
        );
      }

      // UPDATE PRODUCT IMAGE
      if (productIndex !== undefined) {
        updateProduct(
          productIndex,
          "image",
          uploadedUrl
        );
      } else {
        // UPDATE BACKGROUND IMAGE
        updateField(
          "backgroundImage",
          uploadedUrl
        );
      }

      toast.success("WebP image uploaded successfully.");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  };

  // REMOVE IMAGE FROM FORM
  // Actual Cloudinary deletion requires publicId-based backend support.
  const removeImage = (
    filePath: string,
    productIndex?: number
  ) => {
    if (!filePath) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this image?"
    );

    if (!confirmDelete) return;

    if (productIndex !== undefined) {
      updateProduct(productIndex, "image", "");
    } else {
      updateField("backgroundImage", "");
    }

    toast.success(
      "Image removed. Save Changes to update the database."
    );
  };

  // SAVE PRODUCTS CONTENT
  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await apiFetch<{
        content?: {
          products?: ProductsContent;
        };
      }>("/content/home", {
        method: "PUT",
        body: JSON.stringify({
          products: form,
        }),
      });

      const updatedProducts =
        response.content?.products ?? form;

      setForm(updatedProducts);
      onUpdated(updatedProducts);

      toast.success("Products updated successfully.");
    } catch (error) {
      console.error("Failed to save products:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save products."
      );
    } finally {
      setSaving(false);
    }
  };

  // SAFE MEDIA URL
  const getImageSrc = (image: string) => {
    return getMediaUrl(image);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1c184e]">
            Products Section
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage SPS products, section content and images.
          </p>
        </div>
      </div>

      {/* SECTION CONTENT */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Section Content
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage the main Products section content.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* SECTION TITLE */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Section Title
            </label>

            <textarea
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              rows={3}
              placeholder="Organization Trusted SPS Products"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#2860bd] focus:ring-2 focus:ring-[#2860bd]/10"
            />

            <p className="mt-1 text-xs text-gray-400">
              Use a new line to control the heading line break.
            </p>
          </div>

          {/* YEARS NUMBER */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Years Number
            </label>

            <input
              type="text"
              value={form.yearsNumber}
              onChange={(event) =>
                updateField("yearsNumber", event.target.value)
              }
              placeholder="20+"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#2860bd] focus:ring-2 focus:ring-[#2860bd]/10"
            />
          </div>

          {/* YEARS TEXT */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Years Text
            </label>

            <input
              type="text"
              value={form.yearsText}
              onChange={(event) =>
                updateField("yearsText", event.target.value)
              }
              placeholder="Years"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#2860bd] focus:ring-2 focus:ring-[#2860bd]/10"
            />
          </div>

          {/* YEARS DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Years Description
            </label>

            <textarea
              value={form.yearsDescription}
              onChange={(event) =>
                updateField(
                  "yearsDescription",
                  event.target.value
                )
              }
              rows={4}
              placeholder={`Driving
Innovation`}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#2860bd] focus:ring-2 focus:ring-[#2860bd]/10"
            />

            <p className="mt-1 text-xs text-gray-400">
              Use a new line for separate lines.
            </p>
          </div>

          {/* BACKGROUND IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Background Image
            </label>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              {form.backgroundImage ? (
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={getImageSrc(form.backgroundImage)}
                    alt="Products background"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                  No background image
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {/* UPLOAD BACKGROUND */}
                <label className="cursor-pointer rounded-lg bg-[#1c184e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2860bd]">
                  {uploading === "background"
                    ? "Uploading..."
                    : "Upload image"}

                  <input
                    type="file"
                    accept="image/webp,.webp"
                    className="hidden"
                    disabled={uploading === "background"}
                    onChange={(event) => handleUpload(event)}
                  />
                </label>

                {/* REMOVE BACKGROUND */}
                {form.backgroundImage && (
                  <button
                    type="button"
                    onClick={() =>
                      removeImage(form.backgroundImage)
                    }
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Only WebP (.webp) images are allowed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Products
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage product name, image, description and display order.
            </p>
          </div>

          <button
            type="button"
            onClick={addProduct}
            className="rounded-lg bg-[#2860bd] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c184e]"
          >
            + Add Product
          </button>
        </div>

        <div className="space-y-6">
          {form.products.map((product, index) => (
            <div
              key={`${product.name}-${index}`}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5"
            >
              {/* PRODUCT HEADER */}
              <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h4 className="text-base font-semibold text-[#1c184e]">
                    Product {index + 1}
                  </h4>

                  <p className="mt-1 text-xs text-gray-500">
                    {product.name || "New Product"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* PRODUCT NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={product.name}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Product name"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2860bd] focus:ring-2 focus:ring-[#2860bd]/10"
                  />
                </div>

                {/* SORT ORDER */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    value={product.sortOrder ?? index}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "sortOrder",
                        Number(event.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2860bd] focus:ring-2 focus:ring-[#2860bd]/10"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    value={product.description}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    rows={5}
                    placeholder="Product description"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2860bd] focus:ring-2 focus:ring-[#2860bd]/10"
                  />
                </div>

                {/* PRODUCT IMAGE */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Product Image
                  </label>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    {product.image ? (
                      <div className="relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                        <Image
                          src={getImageSrc(product.image)}
                          alt={product.name || "Product image"}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized
                          className="object-contain p-6"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
                        No product image
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {/* UPLOAD PRODUCT IMAGE */}
                      <label className="cursor-pointer rounded-lg bg-[#1c184e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2860bd]">
                        {uploading === `product-${index}`
                          ? "Uploading..."
                          : "Upload image"}

                        <input
                          type="file"
                          accept="image/webp,.webp"
                          className="hidden"
                          disabled={
                            uploading === `product-${index}`
                          }
                          onChange={(event) =>
                            handleUpload(event, index)
                          }
                        />
                      </label>

                      {/* REMOVE PRODUCT IMAGE */}
                      {product.image && (
                        <button
                          type="button"
                          onClick={() =>
                            removeImage(product.image, index)
                          }
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-gray-400">
                      Only WebP (.webp) images are allowed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* EMPTY DATABASE */}
          {form.products.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
              <p className="text-sm text-gray-500">
                No products found in database.
              </p>

              <button
                type="button"
                onClick={addProduct}
                className="mt-4 rounded-lg bg-[#2860bd] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c184e]"
              >
                Add First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SAVE */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading !== null}
          className="rounded-lg bg-[#1c184e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2860bd] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
