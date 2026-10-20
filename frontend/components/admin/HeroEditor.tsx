"use client";

import { useState } from "react";
import { apiFetch, getMediaUrl } from "@/lib/api";
import type { HeroSlide } from "@/types/cms";
import { toast } from "react-toastify";

interface Props {
  slides: HeroSlide[];
  onUpdated: (slides: HeroSlide[]) => void;
}

export default function HeroEditor({
  slides,
  onUpdated,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [localSlides, setLocalSlides] =
    useState<HeroSlide[]>(slides);

  const [uploadingVideo, setUploadingVideo] =
    useState<number | null>(null);

  const updateSlide = (
    index: number,
    field: keyof HeroSlide,
    value: string | boolean | string[]
  ) => {
    const updated = [...localSlides];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setLocalSlides(updated);
  };

  const updateDescription = (
    slideIndex: number,
    descriptionIndex: number,
    value: string
  ) => {
    const updated = [...localSlides];

    const descriptions = [
      ...updated[slideIndex].description,
    ];

    descriptions[descriptionIndex] = value;

    updated[slideIndex] = {
      ...updated[slideIndex],
      description: descriptions,
    };

    setLocalSlides(updated);
  };

  const addDescription = (slideIndex: number) => {
    const updated = [...localSlides];

    updated[slideIndex] = {
      ...updated[slideIndex],
      description: [
        ...updated[slideIndex].description,
        "",
      ],
    };

    setLocalSlides(updated);
  };

  const removeDescription = (
    slideIndex: number,
    descriptionIndex: number
  ) => {
    const updated = [...localSlides];

    updated[slideIndex] = {
      ...updated[slideIndex],
      description:
        updated[slideIndex].description.filter(
          (_, index) => index !== descriptionIndex
        ),
    };

    setLocalSlides(updated);
  };

  // =========================
  // Upload Hero Video
  // =========================
  const uploadVideo = async (
    slideIndex: number,
    file: File
  ) => {
    try {
      setUploadingVideo(slideIndex);

      const formData = new FormData();

      formData.append(
        "type",
        "hero-video"
      );

      formData.append(
        "file",
        file
      );

      const response = await apiFetch<{
        message: string;
        file: {
          path: string;
        };
      }>("/uploads", {
        method: "POST",
        body: formData,
      });

      updateSlide(
        slideIndex,
        "video",
        response.file.path
      );

      toast.success(
        "Hero video uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Video upload error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Video upload failed."
      );
    } finally {
      setUploadingVideo(null);
    }
  };

  // =========================
  // Delete Hero Video
  // =========================

  const deleteVideo = async (
    slideIndex: number
  ) => {
    const videoPath =
      localSlides[slideIndex].video;

    if (!videoPath) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await apiFetch("/uploads", {
        method: "DELETE",
        body: JSON.stringify({
          filePath: videoPath,
        }),
      });

      updateSlide(
        slideIndex,
        "video",
        ""
      );

      toast.success("Hero video deleted successfully.");
    } catch (error) {
      console.error("Delete video error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete video."
      );
    }
  };

  // =========================
  // Save Hero
  // =========================

  const saveChanges = async () => {
    try {
      setSaving(true);

      await apiFetch("/content/home", {
        method: "PUT",
        body: JSON.stringify({
          heroSlides: localSlides,
        }),
      });

      onUpdated(localSlides);

      toast.success("Hero section updated successfully.");
    } catch (error) {
      console.error(error);

     toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update hero section."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6 border-b pb-5">

        <h2 className="text-xl font-bold text-[#0a1f4e]">
          Hero Section
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage homepage hero slides.
        </p>

      </div>

      <div className="space-y-8">

        {localSlides.map((slide, slideIndex) => (

          <div
            key={slide.id}
            className="rounded-xl border border-gray-200 p-5"
          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="font-bold text-[#0a1f4e]">
                Slide {slideIndex + 1}
              </h3>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Video */}
              <VideoUpload
                value={slide.video}
                uploading={
                  uploadingVideo === slideIndex
                }
                onUpload={(file) =>
                  uploadVideo(
                    slideIndex,
                    file
                  )
                }
                onDelete={() =>
                  deleteVideo(slideIndex)
                }
              />

              {/* Title */}
              <Input
                label="Title"
                value={slide.title}
                onChange={(value) =>
                  updateSlide(
                    slideIndex,
                    "title",
                    value
                  )
                }
              />

              {/* Subtitle */}
              <Input
                label="Subtitle"
                value={slide.subtitle}
                onChange={(value) =>
                  updateSlide(
                    slideIndex,
                    "subtitle",
                    value
                  )
                }
              />

              {/* Button Text */}
              <Input
                label="Button Text"
                value={slide.buttonText}
                onChange={(value) =>
                  updateSlide(
                    slideIndex,
                    "buttonText",
                    value
                  )
                }
              />

              {/* Button Link */}
              <Input
                label="Button Link"
                value={slide.buttonLink}
                onChange={(value) =>
                  updateSlide(
                    slideIndex,
                    "buttonLink",
                    value
                  )
                }
              />

            </div>

            {/* Description */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>

              <div className="space-y-3">

                {slide.description.map(
                  (
                    description,
                    descriptionIndex
                  ) => (

                    <div
                      key={descriptionIndex}
                      className="flex gap-2"
                    >

                      <input
                        value={description}
                        onChange={(e) =>
                          updateDescription(
                            slideIndex,
                            descriptionIndex,
                            e.target.value
                          )
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeDescription(
                            slideIndex,
                            descriptionIndex
                          )
                        }
                        className="rounded-lg px-4 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>

                    </div>

                  )
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  addDescription(slideIndex)
                }
                className="mt-3 text-sm font-semibold text-[#2a5ab5]"
              >
                + Add Description
              </button>

            </div>

            {/* List checkbox */}

            <label className="mt-5 flex items-center gap-3 text-sm">

              <input
                type="checkbox"
                checked={slide.isList ?? false}
                onChange={(e) =>
                  updateSlide(
                    slideIndex,
                    "isList",
                    e.target.checked
                  )
                }
              />

              Show description as list

            </label>

          </div>

        ))}

      </div>

      {/* Save */}

      <button
        onClick={saveChanges}
        disabled={
          saving ||
          uploadingVideo !== null
        }
        className="mt-8 rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Hero Changes"}
      </button>

    </section>
  );
}

/* Video Upload*/
function VideoUpload({
  value,
  uploading,
  onUpload,
  onDelete,
}: {
  value: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}) {
  return (
    <div className="md:col-span-2">

      <label className="mb-2 block text-sm font-semibold text-gray-700">
        Hero Video
      </label>

      <div className="rounded-lg border border-gray-300 p-3">

        {/* Video Preview */}

        {value ? (
          <div className="mb-3 overflow-hidden rounded-lg border bg-black">

            <video
              key={value}
              src={getMediaUrl(value)}
              controls
              muted
              playsInline
              className="h-64 w-full object-cover"
            />

          </div>
        ) : (
          <div className="mb-3 flex h-64 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
            No video selected
          </div>
        )}

        {/* Buttons */}

        <div className="flex flex-wrap gap-2">

          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]">

            {uploading
              ? "Uploading..."
              : "Choose Video"}

            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
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

/*Normal Input */

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