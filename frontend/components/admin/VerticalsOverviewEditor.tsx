"use client";

import {
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

import {
  apiFetch,
  getMediaUrl,
} from "@/lib/api";

import type {
  VerticalContent,
  VerticalsOverviewContent,
} from "@/types/cms";

interface Props {
  content?: VerticalsOverviewContent;
  onUpdated: (
    content: VerticalsOverviewContent
  ) => void;
}

export default function VerticalsOverviewEditor({
  content,
  onUpdated,
}: Props) {
  const [form, setForm] =
    useState<VerticalsOverviewContent | null>(
      content ?? null
    );

  const [saving, setSaving] =
    useState(false);

  const [uploadingIndex, setUploadingIndex] =
    useState<number | null>(null);

  useEffect(() => {
    setForm(content ?? null);
  }, [content]);

  const updateSectionField = (
    field:
      | "label"
      | "titleLine1"
      | "titleLine2",
    value: string
  ) => {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const updateVertical = (
    index: number,
    field: keyof VerticalContent,
    value: string
  ) => {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      const items = [
        ...prev.verticals,
      ];

      if (!items[index]) {
        return prev;
      }

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,
        verticals: items,
      };
    });
  };

  const updateTags = (
    index: number,
    value: string
  ) => {
    const tags = value
      .split("\n")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      const items = [
        ...prev.verticals,
      ];

      if (!items[index]) {
        return prev;
      }

      items[index] = {
        ...items[index],
        tags,
      };

      return {
        ...prev,
        verticals: items,
      };
    });
  };

  const addVertical = () => {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      const uniqueId =
        `vertical-${Date.now()}`;

      return {
        ...prev,
        verticals: [
          ...prev.verticals,
          {
            id: uniqueId,
            slug: "",
            title: "",
            image: "",
            description: "",
            tags: [],
            sortOrder:
              prev.verticals.length,
          },
        ],
      };
    });
  };

  const removeVertical = (
    index: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to remove this vertical?"
      );

    if (!confirmDelete) {
      return;
    }

    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        verticals:
          prev.verticals.filter(
            (_, verticalIndex) =>
              verticalIndex !== index
          ),
      };
    });
  };

  const uploadImage = async (
    file: File,
    index: number
  ) => {
    try {
      setUploadingIndex(index);

      const formData =
        new FormData();

      formData.append(
        "type",
        "vertical-image"
      );

      formData.append(
        "file",
        file
      );

      const response =
        await apiFetch<{
          message: string;
          file: {
            path: string;
          };
        }>("/uploads", {
          method: "POST",
          body: formData,
        });

      updateVertical(
        index,
        "image",
        response.file.path
      );

      toast.success(
        "Vertical image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Vertical image upload error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Vertical image upload failed."
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  const deleteImage = async (
    index: number
  ) => {
    if (!form) {
      return;
    }

    const image =
      form.verticals[index]?.image;

    if (!image) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await apiFetch(
        "/uploads",
        {
          method: "DELETE",
          body: JSON.stringify({
            filePath: image,
          }),
        }
      );

      updateVertical(
        index,
        "image",
        ""
      );

      toast.success(
        "Vertical image deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete vertical image error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete vertical image."
      );
    }
  };

  const saveChanges = async () => {
    if (!form) {
      return;
    }

    try {
      setSaving(true);

      const payload: VerticalsOverviewContent = {
        ...form,
        verticals:
          form.verticals.map(
            (
              vertical,
              index
            ) => ({
              ...vertical,
              sortOrder: index,
            })
          ),
      };

      const response =
        await apiFetch<{
          content: {
            verticalsOverview:
              VerticalsOverviewContent;
          };
        }>("/content/home", {
          method: "PUT",
          body: JSON.stringify({
            verticalsOverview:
              payload,
          }),
        });

      const updated =
        response.content
          .verticalsOverview;

      setForm(updated);

      onUpdated(updated);

      toast.success(
        "Verticals Overview updated successfully."
      );
    } catch (error) {
      console.error(
        "Save Verticals error:",
        error
      );

    toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update Verticals."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 border-b pb-5">
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            Verticals Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage industry verticals, descriptions, tags and images.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            No Verticals Overview data found in the database.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            No data is currently available.
          </p>
        </div>
      </section>
    );
  }

  const hasVerticals =
    form.verticals.length > 0;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            Verticals Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage industry verticals, descriptions, tags and images.
          </p>
        </div>

        <button
          type="button"
          onClick={addVertical}
          className="rounded-lg bg-[#2a5ab5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a99]"
        >
          + Add Vertical
        </button>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <Input
          label="Section Label"
          value={form.label}
          onChange={(value) =>
            updateSectionField(
              "label",
              value
            )
          }
        />

        <div />

        <Input
          label="Title Line 1"
          value={form.titleLine1}
          onChange={(value) =>
            updateSectionField(
              "titleLine1",
              value
            )
          }
        />

        <Input
          label="Title Line 2"
          value={form.titleLine2}
          onChange={(value) =>
            updateSectionField(
              "titleLine2",
              value
            )
          }
        />
      </div>

      {hasVerticals ? (
        <div className="space-y-5">
          {form.verticals.map(
            (
              vertical,
              index
            ) => (
              <div
                key={vertical.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-bold text-[#0a1f4e]">
                    Vertical #
                    {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeVertical(
                        index
                      )
                    }
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="ID"
                    value={
                      vertical.id
                    }
                    onChange={(
                      value
                    ) =>
                      updateVertical(
                        index,
                        "id",
                        value
                      )
                    }
                  />

                  <Input
                    label="Slug"
                    value={
                      vertical.slug
                    }
                    onChange={(
                      value
                    ) =>
                      updateVertical(
                        index,
                        "slug",
                        value
                      )
                    }
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Title"
                      value={
                        vertical.title
                      }
                      onChange={(
                        value
                      ) =>
                        updateVertical(
                          index,
                          "title",
                          value
                        )
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Description
                    </label>

                    <textarea
                      rows={7}
                      value={
                        vertical.description
                      }
                      onChange={(
                        e
                      ) =>
                        updateVertical(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#2a5ab5]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Tags
                    </label>

                    <textarea
                      rows={6}
                      value={vertical.tags.join(
                        "\n"
                      )}
                      onChange={(
                        e
                      ) =>
                        updateTags(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="One tag per line"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#2a5ab5]"
                    />

                    <p className="mt-1 text-xs text-gray-400">
                      Enter one tag per line.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Vertical Image"
                      value={
                        vertical.image
                      }
                      uploading={
                        uploadingIndex ===
                        index
                      }
                      onUpload={(
                        file
                      ) =>
                        uploadImage(
                          file,
                          index
                        )
                      }
                      onDelete={() =>
                        deleteImage(
                          index
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            No verticals found in the database.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Click &quot;+ Add Vertical&quot; to create a vertical.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={saveChanges}
        disabled={
          saving ||
          uploadingIndex !== null
        }
        className="mt-8 rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Verticals Changes"}
      </button>
    </section>
  );
}

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
  onUpload: (
    file: File
  ) => void;
  onDelete: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="rounded-lg border border-gray-300 bg-white p-3">
        {value ? (
          <div className="mb-3 overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={getMediaUrl(
                value
              )}
              alt={label}
              className="h-64 w-full object-cover"
            />
          </div>
        ) : (
          <div className="mb-3 flex h-64 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            No image selected
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4a99]">
            {uploading
              ? "Uploading..."
              : "Choose Image"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              disabled={
                uploading
              }
              onChange={(
                e
              ) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  onUpload(
                    file
                  );
                }

                e.target.value =
                  "";
              }}
            />
          </label>

          {value && (
            <button
              type="button"
              onClick={
                onDelete
              }
              disabled={
                uploading
              }
              className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>

        {value && (
          <p className="mt-3 break-all text-xs text-gray-400">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#2a5ab5]"
      />
    </div>
  );
}