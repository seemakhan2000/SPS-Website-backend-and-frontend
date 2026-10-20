"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";

import type {
  ServicesOverviewContent,
  ServiceCategoryContent,
  ServiceCardContent,
} from "@/types/cms";

interface Props {
  content: ServicesOverviewContent | null;
  onUpdated: (
    content: ServicesOverviewContent
  ) => void;
}

export default function ServicesOverviewEditor({
  content,
  onUpdated,
}: Props) {
  const [form, setForm] =
    useState<ServicesOverviewContent | null>(
      content ?? null
    );

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    setForm(content ?? null);
  }, [content]);

  const updateCategory = (
    categoryIndex: number,
    field: keyof ServiceCategoryContent,
    value: string
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        categories:
          previous.categories.map(
            (category, index) =>
              index === categoryIndex
                ? {
                    ...category,
                    [field]: value,
                  }
                : category
          ),
      };
    });
  };

  const updateCard = (
    categoryIndex: number,
    cardIndex: number,
    field: keyof ServiceCardContent,
    value: string
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        categories:
          previous.categories.map(
            (category, categoryIdx) => {
              if (
                categoryIdx !==
                categoryIndex
              ) {
                return category;
              }

              return {
                ...category,

                cards:
                  category.cards.map(
                    (card, cardIdx) =>
                      cardIdx === cardIndex
                        ? {
                            ...card,
                            [field]: value,
                          }
                        : card
                  ),
              };
            }
          ),
      };
    });
  };

  const handleSave = async () => {
    if (!form) {
      toast.error(
        "No Services Overview data available."
      );

      return;
    }

    try {
      setSaving(true);

      const response =
        await apiFetch<{
          message: string;
          content: {
            servicesOverview: ServicesOverviewContent;
          };
        }>("/content/home", {
          method: "PUT",

          body: JSON.stringify({
            servicesOverview: form,
          }),
        });

      const updatedServices =
        response.content
          ?.servicesOverview;

      if (!updatedServices) {
        throw new Error(
          "Updated Services Overview content was not returned."
        );
      }

      setForm(updatedServices);

      onUpdated(updatedServices);

      toast.success(
        "Services Overview updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update Services Overview:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update Services Overview."
      );
    } finally {
      setSaving(false);
    }
  };

  if (
    !form ||
    !Array.isArray(form.categories) ||
    form.categories.length === 0
  ) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#0a1f4e]">
          Services Overview
        </h1>

        <p className="mt-2 text-gray-500">
          No service categories found in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0a1f4e]">
          Services Overview
        </h1>

        <p className="mt-2 text-gray-500">
          Manage service categories and service cards
          displayed on the homepage.
        </p>
      </div>

      {form.categories.map(
        (category, categoryIndex) => (
          <div
            key={
              category.id ??
              `${category.slug}-${categoryIndex}`
            }
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="mb-6 border-b pb-5">
              <h2 className="mb-5 text-xl font-bold text-[#0a1f4e]">
                Category {categoryIndex + 1}
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category Label
                  </label>

                  <input
                    type="text"
                    value={
                      category.label ?? ""
                    }
                    onChange={(event) =>
                      updateCategory(
                        categoryIndex,
                        "label",
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      py-3
                      outline-none
                      transition
                      focus:border-[#1E4B9E]
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category Slug
                  </label>

                  <input
                    type="text"
                    value={
                      category.slug ?? ""
                    }
                    onChange={(event) =>
                      updateCategory(
                        categoryIndex,
                        "slug",
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      py-3
                      outline-none
                      transition
                      focus:border-[#1E4B9E]
                    "
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category Description
                </label>

                <textarea
                  value={
                    category.description ?? ""
                  }
                  onChange={(event) =>
                    updateCategory(
                      categoryIndex,
                      "description",
                      event.target.value
                    )
                  }
                  rows={4}
                  className="
                    w-full
                    resize-y
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-[#1E4B9E]
                  "
                />
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-lg font-bold text-[#0a1f4e]">
                Service Cards
              </h3>

              {Array.isArray(
                category.cards
              ) &&
              category.cards.length > 0 ? (
                <div className="space-y-5">
                  {category.cards.map(
                    (card, cardIndex) => (
                      <div
                        key={
                          card.id ??
                          `${card.slug}-${cardIndex}`
                        }
                        className="
                          rounded-xl
                          border
                          border-gray-200
                          bg-[#f8fafc]
                          p-5
                        "
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="font-bold text-[#0a1f4e]">
                            Card {cardIndex + 1}
                          </h4>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Title
                            </label>

                            <input
                              type="text"
                              value={
                                card.title ?? ""
                              }
                              onChange={(event) =>
                                updateCard(
                                  categoryIndex,
                                  cardIndex,
                                  "title",
                                  event.target.value
                                )
                              }
                              className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-[#1E4B9E]
                              "
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Slug
                            </label>

                            <input
                              type="text"
                              value={
                                card.slug ?? ""
                              }
                              onChange={(event) =>
                                updateCard(
                                  categoryIndex,
                                  cardIndex,
                                  "slug",
                                  event.target.value
                                )
                              }
                              className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-[#1E4B9E]
                              "
                            />
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Description
                          </label>

                          <textarea
                            value={
                              card.description ?? ""
                            }
                            onChange={(event) =>
                              updateCard(
                                categoryIndex,
                                cardIndex,
                                "description",
                                event.target.value
                              )
                            }
                            rows={4}
                            className="
                              w-full
                              resize-y
                              rounded-lg
                              border
                              border-gray-300
                              bg-white
                              px-4
                              py-3
                              outline-none
                              transition
                              focus:border-[#1E4B9E]
                            "
                          />
                        </div>

                        <div className="mt-5">
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Link
                          </label>

                          <input
                            type="text"
                            value={
                              card.href ?? ""
                            }
                            onChange={(event) =>
                              updateCard(
                                categoryIndex,
                                cardIndex,
                                "href",
                                event.target.value
                              )
                            }
                            className="
                              w-full
                              rounded-lg
                              border
                              border-gray-300
                              bg-white
                              px-4
                              py-3
                              outline-none
                              transition
                              focus:border-[#1E4B9E]
                            "
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <p className="text-sm text-gray-500">
                    No service cards found for this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            rounded-xl
            bg-[#1E4B9E]
            px-7
            py-3
            font-semibold
            text-white
            transition
            hover:bg-[#16233F]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving
            ? "Saving..."
            : "Save Services Overview"}
        </button>
      </div>
    </div>
  );
}