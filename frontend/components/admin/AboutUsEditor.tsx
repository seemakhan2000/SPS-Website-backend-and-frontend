"use client";

import { useState } from "react";
import { apiFetch, getMediaUrl } from "@/lib/api";
import type { AboutUsContent } from "@/types/cms";
import { toast } from "react-toastify";

interface Props {
  content: AboutUsContent;
  onUpdated: (content: AboutUsContent) => void;
}

export default function AboutUsEditor({
  content,
  onUpdated,
}: Props) {
  const [form, setForm] =
    useState<AboutUsContent>(content);

  const [saving, setSaving] = useState(false);

  const [uploadingBigImage, setUploadingBigImage] =
    useState(false);

  const [uploadingSmallImage, setUploadingSmallImage] =
    useState(false);

  const updateField = (
    field: keyof AboutUsContent,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  
// Upload About Image
const uploadAboutImage = async (
  file: File,
  type: "about-big-image" | "about-small-image"
) => {
  try {
    if (type === "about-big-image") {
      setUploadingBigImage(true);
    } else {
      setUploadingSmallImage(true);
    }

    const formData = new FormData();

    formData.append("type", type);
    formData.append("file", file);

    const response = await apiFetch<{
      message: string;
      fileUrl: string;
      publicId: string;
      resourceType: string;
      file: {
        url: string;
        publicId: string;
        originalName: string;
        mimeType: string;
        size: number;
      };
    }>("/uploads", {
      method: "POST",
      body: formData,
    });

    // Get Cloudinary image URL
    const imageUrl = response.file?.url;

    if (!imageUrl) {
      throw new Error("Image URL not received from server.");
    }

    // Update image preview immediately
    if (type === "about-big-image") {
      updateField("bigImage", imageUrl);
    } else {
      updateField("smallImage", imageUrl);
    }

    toast.success("Image uploaded successfully.");
  } catch (error) {
    console.error("Image upload error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );
  } finally {
    if (type === "about-big-image") {
      setUploadingBigImage(false);
    } else {
      setUploadingSmallImage(false);
    }
  }
};

  // Delete Image
  const deleteImage = async (
    field: "bigImage" | "smallImage"
  ) => {
    const imagePath = form[field];

    if (!imagePath) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await apiFetch("/uploads", {
        method: "DELETE",
        body: JSON.stringify({
          filePath: imagePath,
        }),
      });

      updateField(field, "");

     toast.success("image deleted successfully.");
    } catch (error) {
      console.error("Delete image error:", error);

     toast.error(
    error instanceof Error
      ? error.message
      : "Failed to delete image."
  );
    }
  };


  // Save About Us
  const saveChanges = async () => {
    try {
      setSaving(true);

      const response = await apiFetch<{
        content: {
          aboutUs: AboutUsContent;
        };
      }>("/content/home", {
        method: "PUT",
        body: JSON.stringify({
          aboutUs: form,
        }),
      });

      onUpdated(response.content.aboutUs);

      toast.success("Updated successfully.");
    } catch (error) {
      console.error(error);

     toast.error("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6 border-b pb-5">

        <h2 className="text-xl font-bold text-[#0a1f4e]">
          About Us
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage About Us text and images.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Label */}
        <Input
          label="Label"
          value={form.label}
          onChange={(value) =>
            updateField("label", value)
          }
        />

        {/* Button Text */}
        <Input
          label="Button Text"
          value={form.buttonText}
          onChange={(value) =>
            updateField("buttonText", value)
          }
        />

        {/* Title */}
        <div className="md:col-span-2">
          <Input
            label="Title"
            value={form.title}
            onChange={(value) =>
              updateField("title", value)
            }
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-semibold">
            Description
          </label>

          <textarea
            rows={5}
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
          />

        </div>

        {/* Big Image */}
        <ImageUpload
          label="Big Image"
          value={form.bigImage}
          uploading={uploadingBigImage}
          onUpload={(file) =>
            uploadAboutImage(
              file,
              "about-big-image"
            )
          }
          onDelete={() =>
            deleteImage("bigImage")
          }
        />

        {/* Small Image */}
        <ImageUpload
          label="Small Image"
          value={form.smallImage}
          uploading={uploadingSmallImage}
          onUpload={(file) =>
            uploadAboutImage(
              file,
              "about-small-image"
            )
          }
          onDelete={() =>
            deleteImage("smallImage")
          }
        />

        {/* Button Link */}
        <Input
          label="Button Link"
          value={form.buttonLink}
          onChange={(value) =>
            updateField("buttonLink", value)
          }
        />

      </div>

      {/* Save */}
      <button
        onClick={saveChanges}
        disabled={
          saving ||
          uploadingBigImage ||
          uploadingSmallImage
        }
        className="mt-8 rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save About Us Changes"}
      </button>

    </section>
  );
}

/* Image Upload Component*/
function ImageUpload({
  label,
  value,
  uploading,
  onUpload,
  onDelete,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="rounded-lg border border-gray-300 p-3">

        {/* Preview */}
        {value ? (
          <div className="mb-3 overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={getMediaUrl(value)}
              alt={label}
              className="h-48 w-full object-cover"
            />
          </div>
        ) : (
          <div className="mb-3 flex h-48 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            No image selected
          </div>
        )}

        <div className="flex flex-wrap gap-2">

          {/* Upload */}
          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]">
            {uploading
              ? "Uploading..."
              : "Choose Image"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  onUpload(file);
                }

                e.target.value = "";
              }}
            />
          </label>

          {/* Delete */}
          {value && (
            <button
              type="button"
              onClick={onDelete}
              disabled={uploading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          )}

        </div>

        {/* Current path */}
        {value && (
          <p className="mt-3 break-all text-xs text-gray-400">
            {value}
          </p>
        )}

      </div>
    </div>
  );
}

/* Normal Input*/
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
      />
    </div>
  );
}