
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiFetch, getMediaUrl } from "@/lib/api";

import type {
  NewsItemContent,
  NewsInsightsContent,
} from "@/types/cms";

interface Props {
  content?: NewsInsightsContent;
  onUpdated: (
    content: NewsInsightsContent
  ) => void;
}

export default function NewsInsightsEditor({
  content,
  onUpdated,
}: Props) {

  const [form, setForm] =
    useState<NewsInsightsContent>({
      title: content?.title || "",
      viewAllText: content?.viewAllText || "",
      viewAllLink: content?.viewAllLink || "",
      items: content?.items || [],
    });

  const [saving, setSaving] =
    useState(false);

  const [uploadingIndex, setUploadingIndex] =
    useState<number | null>(null);

  /*LOAD DB/API CONTENT*/

  useEffect(() => {
    if (!content) {
      return;
    }

    console.log(
      "[NEWS EDITOR] DB content received:",
      content
    );

    setForm({
      title: content.title || "",
      viewAllText: content.viewAllText || "",
      viewAllLink: content.viewAllLink || "",
      items: Array.isArray(content.items)
        ? content.items
        : [],
    });
  }, [content]);

  /*UPDATE SECTION FIELD*/

  const updateField = (
    field: keyof NewsInsightsContent,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*UPDATE NEWS ITEM*/

  const updateItem = (
    index: number,
    field: keyof NewsItemContent,
    value: string
  ) => {
    setForm((prev) => {
      const items = [...prev.items];

      if (!items[index]) {
        return prev;
      }

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,
        items,
      };
    });
  };

  /* UPDATE SELECT FIELD*/

  const updateItemSelect = (
    index: number,
    field: "cta" | "variant",
    value: string
  ) => {
    setForm((prev) => {
      const items = [...prev.items];

      if (!items[index]) {
        return prev;
      }

      items[index] = {
        ...items[index],
        [field]: value as NewsItemContent["cta"] &
          NewsItemContent["variant"],
      };

      return {
        ...prev,
        items,
      };
    });
  };
  const addNewsItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `news-${Date.now()}`,
          badge: "",
          title: "",
          image: "",
          href: "/about-us",
          cta: "arrow",
          variant: "gradient-image",
          sortOrder: prev.items.length,
        },
      ],
    }));
  };

  /*REMOVE NEWS ITEM*/

  const removeNewsItem = (
    index: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to remove this news item?"
      );

    if (!confirmDelete) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      items: prev.items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  /*UPLOAD IMAGE*/

  const uploadImage = async (
    file: File,
    index: number
  ) => {
    try {
      setUploadingIndex(index);

      const formData = new FormData();

      formData.append(
        "type",
        "news-image"
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

      updateItem(
        index,
        "image",
        response.file.path
      );

      toast.success(
        "News image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "News image upload error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "News image upload failed."
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  /*DELETE IMAGE*/

  const deleteImage = async (
    index: number
  ) => {
    const image =
      form.items[index]?.image;

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
      await apiFetch("/uploads", {
        method: "DELETE",
        body: JSON.stringify({
          filePath: image,
        }),
      });

      updateItem(
        index,
        "image",
        ""
      );

      toast.success(
        "News image deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete news image error:",

        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete news image."
      );
    }
  };


  const saveChanges = async () => {
    try {
      setSaving(true);

      const payload: NewsInsightsContent = {
        ...form,
        items: form.items.map(
          (item, index) => ({
            ...item,
            sortOrder: index,
          })
        ),
      };

      console.log(
        "[NEWS EDITOR] Saving DB data:",
        payload
      );

      const response =
        await apiFetch<{
          content: {
            newsInsights: NewsInsightsContent;
          };
        }>("/content/home", {
          method: "PUT",
          body: JSON.stringify({
            newsInsights: payload,
          }),
        });

      const updated =
        response.content.newsInsights;

      console.log(
        "[NEWS EDITOR] Updated DB content:",
        updated
      );

      setForm(updated);

      onUpdated(updated);

      toast.success(
        "News & Insights updated successfully."
      );
    } catch (error) {
      console.error(
        "Save News Insights error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update News & Insights."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="py-10 text-center">
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            News & Insights
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Loading News & Insights from database...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            News & Insights
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage news cards, images, links and display styles.
          </p>
        </div>

        <button
          type="button"
          onClick={addNewsItem}
          className="rounded-lg bg-[#2a5ab5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a99]"
        >
          + Add News
        </button>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            label="Section Title"
            value={form.title}
            onChange={(value) =>
              updateField(
                "title",
                value
              )
            }
          />
        </div>

        <Input
          label="View All Text"
          value={form.viewAllText}
          onChange={(value) =>
            updateField(
              "viewAllText",
              value
            )
          }
        />

        <Input
          label="View All Link"
          value={form.viewAllLink}
          onChange={(value) =>
            updateField(
              "viewAllLink",
              value
            )
          }
        />
      </div>

      <div className="space-y-5">
        {form.items.map(
          (item, index) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-bold text-[#0a1f4e]">
                  News Item #{index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    removeNewsItem(index)
                  }
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="ID"
                  value={item.id}
                  onChange={(value) =>
                    updateItem(
                      index,
                      "id",
                      value
                    )
                  }
                />

                <Input
                  label="Badge"
                  value={item.badge ?? ""}
                  onChange={(value) =>
                    updateItem(
                      index,
                      "badge",
                      value
                    )
                  }
                />

                <div className="md:col-span-2">
                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(value) =>
                      updateItem(
                        index,
                        "title",
                        value
                      )
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Link"
                    value={item.href}
                    onChange={(value) =>
                      updateItem(
                        index,
                        "href",
                        value
                      )
                    }
                  />
                </div>

                <Select
                  label="CTA Type"
                  value={item.cta}
                  options={[
                    {
                      value: "readMore",
                      label: "Read More",
                    },
                    {
                      value: "arrow",
                      label: "Arrow",
                    },
                  ]}
                  onChange={(value) =>
                    updateItemSelect(
                      index,
                      "cta",
                      value
                    )
                  }
                />

                <Select
                  label="Card Variant"
                  value={item.variant}
                  options={[
                    {
                      value:
                        "plain-image",
                      label:
                        "Plain Image",
                    },
                    {
                      value:
                        "gradient-image",
                      label:
                        "Gradient Image",
                    },
                    {
                      value: "solid",
                      label: "Solid",
                    },
                  ]}
                  onChange={(value) =>
                    updateItemSelect(
                      index,
                      "variant",
                      value
                    )
                  }
                />

                <div className="md:col-span-2">
                  <ImageUpload
                    label="News Image"
                    value={
                      item.image ?? ""
                    }
                    uploading={
                      uploadingIndex ===
                      index
                    }
                    onUpload={(file) =>
                      uploadImage(
                        file,
                        index
                      )
                    }
                    onDelete={() =>
                      deleteImage(index)
                    }
                  />
                </div>
              </div>
            </div>
          )
        )}

        {form.items.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
            <p className="text-sm text-gray-500">
              No News & Insights items found in database.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Add a news item manually or check the database seed.
            </p>
          </div>
        )}
      </div>

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
          : "Save News & Insights Changes"}
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
  onUpload: (file: File) => void;
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
              src={getMediaUrl(value)}
              alt={label}
              className="h-52 w-full object-cover"
            />
          </div>
        ) : (
          <div className="mb-3 flex h-52 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
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

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#2a5ab5]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

