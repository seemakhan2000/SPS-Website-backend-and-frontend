
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Clock,
  ListChecks,
  HandHelping,
  HandCoins,
  Trash2,
  Plus,
} from "@/lib/icons";

import {
  apiFetch,
  getMediaUrl,
} from "@/lib/api";

import type {
  HowItWorksContent,
  HowItWorksStep,
} from "@/types/cms";

/* PROPs*/
interface Props {
  content?: HowItWorksContent | null;
  onUpdated: (content: HowItWorksContent) => void;
}

/*ICON OPTIONS*/
const iconOptions = [
  {
    value: "Clock",
    label: "Clock",
    Icon: Clock,
  },
  {
    value: "ListChecks",
    label: "List Checks",
    Icon: ListChecks,
  },
  {
    value: "HandHelping",
    label: "Hand Helping",
    Icon: HandHelping,
  },
  {
    value: "HandCoins",
    label: "Hand Coins",
    Icon: HandCoins,
  },
];

/* COMPONENT*/

export default function HowItWorksEditor({
  content,
  onUpdated,
}: Props) {

  const [form, setForm] =
    useState<HowItWorksContent | null>(
      content ?? null
    );

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  useEffect(() => {
    setForm(content ?? null);
  }, [content]);

  /*NO DB DATA*/

  if (!form) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6 border-b pb-5">

          <h2 className="text-xl font-bold text-[#0a1f4e]">
            How It Works
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage How It Works content,
            steps, image, button and
            statistics.
          </p>

        </div>

        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">

          <p className="text-sm text-gray-400">
            No How It Works data found in database.
          </p>

        </div>

      </section>
    );
  }

  /*UPDATE MAIN FIELD*/

  const updateField = (
    field: keyof HowItWorksContent,
    value: string
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  /*UPDATE STEP*/

  const updateStep = (
    index: number,
    field: keyof HowItWorksStep,
    value: string
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        steps: previous.steps.map(
          (step, stepIndex) => {
            if (stepIndex !== index) {
              return step;
            }

            return {
              ...step,
              [field]: value,
            };
          }
        ),
      };
    });
  };

  /*ADD STEP */

  const addStep = () => {
    const newStep: HowItWorksStep = {
      id: Date.now(),
      icon: "Clock",
      title: "New Step",
      sortOrder: form.steps.length,
    };

    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        steps: [
          ...previous.steps,
          newStep,
        ],
      };
    });
  };

  /*REMOVE STEP*/

  const removeStep = (
    index: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to remove this step?"
      );

    if (!confirmDelete) {
      return;
    }

    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        steps: previous.steps
          .filter(
            (_, stepIndex) =>
              stepIndex !== index
          )
          .map((step, newIndex) => ({
            ...step,
            sortOrder: newIndex,
          })),
      };
    });
  };

  /* UPLOAD IMAGE*/
const uploadImage = async (file: File) => {
  try {
    setUploadingImage(true);

    const formData = new FormData();

    formData.append("type", "howitworks-image");
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

    toast.success("Image uploaded successfully.");
  } catch (error) {
    console.error(
      "How It Works image upload error:",
      error
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );
  } finally {
    setUploadingImage(false);
  }
};
  /*DELETE IMAGE*/

  const deleteImage = async () => {
    const imagePath =
      form.image;

    if (!imagePath) {
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
      /* Delete only backend uploaded images */

      if (
        imagePath.startsWith(
          "/uploads/"
        )
      ) {
        await apiFetch(
          "/uploads",
          {
            method: "DELETE",

            body: JSON.stringify({
              filePath:
                imagePath,
            }),
          }
        );
      }

      updateField(
        "image",
        ""
      );

      toast.success(
        "Image deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete image error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete image."
      );
    }
  };

  /*SAVE CHANGES */

  const saveChanges = async () => {
    try {
      setSaving(true);



      const dataToSave: HowItWorksContent =
      {
        ...form,

        steps: form.steps.map(
          (step, index) => ({
            ...step,
            sortOrder: index,
          })
        ),
      };

      /*SAVE TO DATABASE*/

      const response =
        await apiFetch<{
          content: {
            howItWorks: HowItWorksContent;
          };
        }>("/content/home", {
          method: "PUT",

          body: JSON.stringify({
            howItWorks:
              dataToSave,
          }),
        });

      /*GET SAVED DB DATA*/

      const savedContent =
        response.content?.howItWorks;

      if (!savedContent) {
        throw new Error(
          "How It Works data was not returned from database."
        );
      }

      /* UPDATE LOCAL FORM WITH DB DATA*/

      setForm(
        savedContent
      );

      /*UPDATE PARENT*/

      onUpdated(
        savedContent
      );

      toast.success(
        "How It Works updated successfully."
      );
    } catch (error) {
      console.error(
        "How It Works save error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update How It Works."
      );
    } finally {
      setSaving(false);
    }
  };

  /*GET ICON*/

  const getIcon = (
    iconName: string
  ) => {
    const found =
      iconOptions.find(
        (item) =>
          item.value === iconName
      );

    return found?.Icon ?? Clock;
  };


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 border-b pb-5">

        <h2 className="text-xl font-bold text-[#0a1f4e]">
          How It Works
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage How It Works content,
          steps, image, button and
          statistics.
        </p>

      </div>

      {/* MAIN CONTENT*/}

      <div className="grid gap-5 md:grid-cols-2">

        {/* HEADING*/}

        <div className="md:col-span-2">

          <Input
            label="Heading"
            value={
              form.heading
            }
            onChange={(value) =>
              updateField(
                "heading",
                value
              )
            }
          />

        </div>

        {/* DESCRIPTION*/}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            rows={5}
            value={
              form.description
            }
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
          />

        </div>

        {/*  BUTTON TEXT*/}

        <Input
          label="Button Text"
          value={
            form.buttonText
          }
          onChange={(value) =>
            updateField(
              "buttonText",
              value
            )
          }
        />

        {/* BUTTON LINK */}

        <Input
          label="Button Link"
          value={
            form.buttonLink
          }
          onChange={(value) =>
            updateField(
              "buttonLink",
              value
            )
          }
        />

        {/* IMAGE*/}

        <div className="md:col-span-2">

          <ImageUpload
            label="How It Works Image"
            value={
              form.image
            }
            uploading={
              uploadingImage
            }
            onUpload={
              uploadImage
            }
            onDelete={
              deleteImage
            }
          />

        </div>

      </div>

      {/*  STEPS */}

      <div className="mt-8 border-t pt-6">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h3 className="text-lg font-bold text-[#0a1f4e]">
              Steps
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add, edit or remove How
              It Works steps.
            </p>

          </div>

          {/* ADD STEP */}

          <button
            type="button"
            onClick={
              addStep
            }
            className="flex items-center gap-2 rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]"
          >
            <Plus className="h-4 w-4" />

            Add Step
          </button>

        </div>

        {/* STEP LIST */}

        <div className="space-y-4">

          {form.steps.length ===
            0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
              No steps added.
            </div>
          ) : (
            form.steps.map(
              (
                step,
                index
              ) => {
                const Icon =
                  getIcon(
                    step.icon
                  );

                return (
                  <div
                    key={
                      step.id ??
                      index
                    }
                    className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                  >

                    {/* STEP HEADER */}

                    <div className="mb-4 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1FB]">

                          <Icon
                            className="h-5 w-5 text-[#0B2A5B]"
                            strokeWidth={
                              1.75
                            }
                          />

                        </div>

                        <div>

                          <p className="text-sm font-bold text-[#0a1f4e]">
                            Step{" "}
                            {index +
                              1}
                          </p>

                          <p className="text-xs text-gray-400">
                            {step.title ||
                              "Untitled Step"}
                          </p>

                        </div>

                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeStep(
                            index
                          )
                        }
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />

                        Remove
                      </button>

                    </div>

                    {/* STEP FIELDS */}

                    <div className="grid gap-4 md:grid-cols-2">

                      {/* ICON */}

                      <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Icon
                        </label>

                        <select
                          value={
                            step.icon
                          }
                          onChange={(
                            event
                          ) =>
                            updateStep(
                              index,
                              "icon",
                              event.target
                                .value
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#2a5ab5]"
                        >

                          {iconOptions.map(
                            (
                              option
                            ) => (
                              <option
                                key={
                                  option.value
                                }
                                value={
                                  option.value
                                }
                              >
                                {
                                  option.label
                                }
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      {/* TITLE */}

                      <Input
                        label="Step Title"
                        value={
                          step.title
                        }
                        onChange={(
                          value
                        ) =>
                          updateStep(
                            index,
                            "title",
                            value
                          )
                        }
                      />

                    </div>

                  </div>
                );
              }
            )
          )}

        </div>

      </div>

      {/* STATISTICS*/}

      <div className="mt-8 border-t pt-6">

        <h3 className="mb-1 text-lg font-bold text-[#0a1f4e]">
          Statistics
        </h3>

        <p className="mb-5 text-sm text-gray-500">
          Manage the two statistics
          shown on the right side.
        </p>

        <div className="grid gap-5 md:grid-cols-2">

          {/*SPECIALISTS*/}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

            <h4 className="mb-4 font-bold text-[#0a1f4e]">
              Expert Specialists
            </h4>

            <div className="space-y-4">

              <Input
                label="Number"
                value={
                  form.specialistsNumber
                }
                onChange={(value) =>
                  updateField(
                    "specialistsNumber",
                    value
                  )
                }
              />

              <Input
                label="Text"
                value={
                  form.specialistsText
                }
                onChange={(value) =>
                  updateField(
                    "specialistsText",
                    value
                  )
                }
              />

            </div>

          </div>

          {/* CLIENTS */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

            <h4 className="mb-4 font-bold text-[#0a1f4e]">
              Happy Clients
            </h4>

            <div className="space-y-4">

              <Input
                label="Number"
                value={
                  form.clientsNumber
                }
                onChange={(value) =>
                  updateField(
                    "clientsNumber",
                    value
                  )
                }
              />

              <Input
                label="Text"
                value={
                  form.clientsText
                }
                onChange={(value) =>
                  updateField(
                    "clientsText",
                    value
                  )
                }
              />

            </div>

          </div>

        </div>

      </div>

      {/*SAVE*/}

      <button
        type="button"
        onClick={
          saveChanges
        }
        disabled={
          saving ||
          uploadingImage
        }
        className="mt-8 rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white transition hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save How It Works Changes"}
      </button>

    </section>
  );
}

/*IMAGE UPLOAD COMPONENT*/

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

      <div className="rounded-lg border border-gray-300 p-3">

        {/*  PREVIEW */}

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

        {/* BUTTONS*/}

        <div className="flex flex-wrap gap-2">

          {/* CHOOSE IMAGE */}

          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]">

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
                event
              ) => {
                const file =
                  event.target
                    .files?.[0];

                if (file) {
                  onUpload(
                    file
                  );
                }

                event.target.value =
                  "";
              }}
            />

          </label>

          {/* DELETE */}

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

        {/* 
            CURRENT IMAGE PATH
         */}

        {value && (
          <p className="mt-3 break-all text-xs text-gray-400">
            {value}
          </p>
        )}

      </div>

    </div>
  );
}

/*NORMAL INPUT*/

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
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
      />

    </div>
  );
}
