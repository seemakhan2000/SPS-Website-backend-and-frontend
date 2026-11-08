
"use client";

import { useState } from "react";
import { apiFetch, getMediaUrl } from "@/lib/api";
import type { HighlightsContent } from "@/types/cms";
import { toast } from "react-toastify";

interface Props {
  content?: HighlightsContent;
  onUpdated: (content: HighlightsContent) => void;
}

export default function HighlightsEditor({
  content,
  onUpdated,
}: Props) {


  const [form, setForm] = useState<HighlightsContent>({
    image: content?.image || "",
    alt: content?.alt || "",
    title: content?.title || "",
    description: content?.description || "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateField = (
    field: keyof HighlightsContent,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

/* UPLOAD HIGHLIGHTS IMAGE */
const uploadImage = async (file: File) => {
  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("type", "highlights-image");
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

    // Get Cloudinary secure URL
    const imageUrl = response.file?.url;

    if (
      !imageUrl ||
      !imageUrl.startsWith("https://")
    ) {
      throw new Error(
        "Valid Cloudinary image URL not received."
      );
    }

    // Update image preview
    updateField("image", imageUrl);

    toast.success(
      "Highlights image uploaded successfully."
    );
  } catch (error) {
    console.error(
      "Highlights image upload error:",
      error
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );
  } finally {
    setUploading(false);
  }
};

  const deleteImage = async () => {
    if (!form.image) {
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
          filePath: form.image,
        }),
      });

      updateField("image", "");

      toast.success("Image deleted successfully.");
    } catch (error) {
      console.error(
        "Delete Highlights image error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete image."
      );
    }
  };


  const saveChanges = async () => {
    try {
      setSaving(true);

      const response = await apiFetch<{
        content: {
          highlights: HighlightsContent;
        };
      }>("/content/home", {
        method: "PUT",
        body: JSON.stringify({
          highlights: form,
        }),
      });

      const updated =
        response.content.highlights;

      setForm(updated);
      onUpdated(updated);

      toast.success("Highlights updated successfully.");
    } catch (error) {
      console.error(
        "Save Highlights error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update Highlights."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      {/*Header*/}

      <div className="mb-6 border-b pb-5">
        <h2 className="text-xl font-bold text-[#0a1f4e]">
          Highlights
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage Highlights section text and background image.
        </p>
      </div>

      {/*Form*/}

      <div className="space-y-5">
        {/* Title */}

        <Input
          label="Title"
          value={form.title}
          onChange={(value) =>
            updateField("title", value)
          }
        />

        {/* Description */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            rows={7}
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

        {/* Alt Text */}

        <Input
          label="Image Alt Text"
          value={form.alt}
          onChange={(value) =>
            updateField("alt", value)
          }
        />

        {/* Image */}

        <ImageUpload
          label="Background Image"
          value={form.image}
          uploading={uploading}
          onUpload={uploadImage}
          onDelete={deleteImage}
        />
      </div>

      {/*Save Button*/}

      <button
        type="button"
        onClick={saveChanges}
        disabled={saving || uploading}
        className="mt-8 rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Highlights Changes"}
      </button>
    </section>
  );
}


// Image Upload Component
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
        {value ? (
          <div className="mb-3 overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={getMediaUrl(value)}
              alt={label}
              className="h-56 w-full object-cover"
            />
          </div>
        ) : (
          <div className="mb-3 flex h-56 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            No image selected
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {/* Choose Image */}

          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4a99]">
            {uploading
              ? "Uploading..."
              : "Choose Image"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

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

        {/* Current DB Path */}

        {value && (
          <p className="mt-3 break-all text-xs text-gray-400">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}


// Input Component


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
