"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  apiFetch,
  getMediaUrl,
} from "@/lib/api";

import type {
  CustomerAvatar,
  CustomersContent,
} from "@/types/cms";

interface Props {
  content?: CustomersContent;

  onUpdated: (
    content: CustomersContent
  ) => void;
}

const emptyCustomersContent: CustomersContent = {
  headingLine1: "",
  headingLine2: "",
  headingLine3: "",
  mainImage: "",

  testimonial: {
    name: "",
    rating: 0,
    message: "",
    image: "",
  },

  deployment: {
    number: "",
    text: "",
    avatars: [],
  },

  impact: {
    name: "",
    role: "",
    title: "",
    description: "",
    image: "",
  },
};

export default function CustomersEditor({
  content,
  onUpdated,
}: Props) {

  const [form, setForm] =
    useState<CustomersContent>(
      content ?? emptyCustomersContent
    );

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState<string | null>(null);
  useEffect(() => {
    setForm(
      content ?? emptyCustomersContent
    );
  }, [content]);

  const updateField = <
    K extends keyof CustomersContent
  >(
    field: K,
    value: CustomersContent[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };
/* UPLOAD CUSTOMER IMAGE */
const uploadImage = async (
  file: File,
  type: string,
  callback: (path: string) => void
) => {
  try {
    setUploading(type);

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

    // Update image in form
    callback(imageUrl);

    toast.success(
      "Image uploaded successfully."
    );

  } catch (error) {
    console.error(
      "Customer image upload error:",
      error
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );

  } finally {
    setUploading(null);
  }
};

  const deleteImage = async (
    imagePath: string,
    callback: () => void
  ) => {
    if (!imagePath) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmed) {
      return;
    }

    try {

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
              filePath: imagePath,
            }),
          }
        );
      }



      callback();

    toast.success(
        "Image removed successfully."
      );
    } catch (error) {
      console.error(
        "Customer image delete error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete image."
      );
    }
  };



  const updateTestimonial = <
    K extends keyof CustomersContent["testimonial"]
  >(
    field: K,
    value: CustomersContent["testimonial"][K]
  ) => {
    setForm((previous) => ({
      ...previous,

      testimonial: {
        ...previous.testimonial,
        [field]: value,
      },
    }));
  };


  const updateDeployment = <
    K extends keyof CustomersContent["deployment"]
  >(
    field: K,
    value: CustomersContent["deployment"][K]
  ) => {
    setForm((previous) => ({
      ...previous,

      deployment: {
        ...previous.deployment,
        [field]: value,
      },
    }));
  };



  const updateAvatar = (
    id: number,
    image: string
  ) => {
    setForm((previous) => ({
      ...previous,

      deployment: {
        ...previous.deployment,

        avatars:
          previous.deployment.avatars.map(
            (avatar) =>
              avatar.id === id
                ? {
                  ...avatar,
                  image,
                }
                : avatar
          ),
      },
    }));
  };



  const addAvatar = () => {
    const newAvatar: CustomerAvatar = {
      id: Date.now(),
      image: "",
    };

    setForm((previous) => ({
      ...previous,

      deployment: {
        ...previous.deployment,

        avatars: [
          ...previous.deployment.avatars,
          newAvatar,
        ],
      },
    }));
  };



  const removeAvatar = async (
    id: number
  ) => {
    const avatar =
      form.deployment.avatars.find(
        (item) => item.id === id
      );

    if (!avatar) {
      return;
    }



    if (
      avatar.image &&
      avatar.image.startsWith(
        "/uploads/"
      )
    ) {
      const confirmed =
        window.confirm(
          "Are you sure you want to remove this avatar?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await apiFetch(
          "/uploads",
          {
            method: "DELETE",

            body: JSON.stringify({
              filePath: avatar.image,
            }),
          }
        );
      } catch (error) {
        console.error(
          "Avatar delete error:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete avatar image."
        );

        return;
      }
    }



    setForm((previous) => ({
      ...previous,

      deployment: {
        ...previous.deployment,

        avatars:
          previous.deployment.avatars.filter(
            (item) => item.id !== id
          ),
      },
    }));
  };


  const updateImpact = <
    K extends keyof CustomersContent["impact"]
  >(
    field: K,
    value: CustomersContent["impact"][K]
  ) => {
    setForm((previous) => ({
      ...previous,

      impact: {
        ...previous.impact,
        [field]: value,
      },
    }));
  };



  const saveChanges = async () => {
    try {
      setSaving(true);

      const response =
        await apiFetch<{
          content?: {
            customers?: CustomersContent;
          };
        }>("/content/home", {
          method: "PUT",

          body: JSON.stringify({
            customers: form,
          }),
        });



      const savedCustomers =
        response.content?.customers ??
        form;

      setForm(savedCustomers);

      onUpdated(savedCustomers);

      toast.success(
        "Customers updated successfully."
      );
    } catch (error) {
      console.error(
        "Save Customers error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update Customers."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/*HEADER*/}

      <div className="mb-6 border-b pb-5">

        <h2 className="text-xl font-bold text-[#0a1f4e]">
          Customers
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage Customers section content,
          testimonial, deployment statistics
          and impact card.
        </p>

      </div>

      <div className="space-y-8">

        {/* MAIN HEADING*/}

        <EditorCard title="Main Heading">

          <div className="grid gap-5 md:grid-cols-3">

            <Input
              label="Heading Line 1"
              value={form.headingLine1}
              onChange={(value) =>
                updateField(
                  "headingLine1",
                  value
                )
              }
            />

            <Input
              label="Heading Line 2"
              value={form.headingLine2}
              onChange={(value) =>
                updateField(
                  "headingLine2",
                  value
                )
              }
            />

            <Input
              label="Heading Line 3"
              value={form.headingLine3}
              onChange={(value) =>
                updateField(
                  "headingLine3",
                  value
                )
              }
            />

          </div>

        </EditorCard>

        {/*MAIN IMAGE*/}

        <EditorCard title="Main AI Image">

          <ImageUpload
            label="AI Image"
            value={form.mainImage}
            uploading={
              uploading ===
              "customers-main-image"
            }
            onUpload={(file) =>
              uploadImage(
                file,
                "customers-main-image",
                (path) =>
                  updateField(
                    "mainImage",
                    path
                  )
              )
            }
            onDelete={() =>
              deleteImage(
                form.mainImage,
                () =>
                  updateField(
                    "mainImage",
                    ""
                  )
              )
            }
          />

        </EditorCard>

        {/*TESTIMONIAL*/}

        <EditorCard title="Testimonial">

          <div className="grid gap-5 md:grid-cols-2">

            <Input
              label="Customer Name"
              value={
                form.testimonial.name
              }
              onChange={(value) =>
                updateTestimonial(
                  "name",
                  value
                )
              }
            />

            <Input
              label="Rating"
              type="number"
              min={0}
              max={5}
              value={String(
                form.testimonial.rating
              )}
              onChange={(value) =>
                updateTestimonial(
                  "rating",
                  Math.max(
                    0,
                    Math.min(
                      5,
                      Number(value)
                    )
                  )
                )
              }
            />

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Testimonial Message
              </label>

              <textarea
                rows={4}
                value={
                  form.testimonial.message
                }
                onChange={(event) =>
                  updateTestimonial(
                    "message",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
              />

            </div>

            <ImageUpload
              label="Customer Avatar"
              value={
                form.testimonial.image
              }
              uploading={
                uploading ===
                "customers-testimonial-image"
              }
              onUpload={(file) =>
                uploadImage(
                  file,
                  "customers-testimonial-image",
                  (path) =>
                    updateTestimonial(
                      "image",
                      path
                    )
                )
              }
              onDelete={() =>
                deleteImage(
                  form.testimonial.image,
                  () =>
                    updateTestimonial(
                      "image",
                      ""
                    )
                )
              }
            />

          </div>

        </EditorCard>

        {/* DEPLOYMENT*/}

        <EditorCard title="Deployment Statistics">

          <div className="grid gap-5 md:grid-cols-2">

            <Input
              label="Number"
              value={
                form.deployment.number
              }
              onChange={(value) =>
                updateDeployment(
                  "number",
                  value
                )
              }
            />

            <Input
              label="Text"
              value={
                form.deployment.text
              }
              onChange={(value) =>
                updateDeployment(
                  "text",
                  value
                )
              }
            />

          </div>

          {/* AVATARS*/}

          <div className="mt-6">

            <div className="mb-4 flex items-center justify-between">

              <h3 className="font-semibold text-[#0a1f4e]">
                Deployment Avatars
              </h3>

              <button
                type="button"
                onClick={addAvatar}
                className="rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]"
              >
                + Add Avatar
              </button>

            </div>

            {form.deployment.avatars.length ===
              0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                No avatars found in database.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">

                {form.deployment.avatars.map(
                  (
                    avatar,
                    index
                  ) => (

                    <div
                      key={avatar.id}
                      className="rounded-xl border border-gray-200 p-4"
                    >

                      <div className="mb-3 flex items-center justify-between">

                        <span className="font-semibold text-gray-700">
                          Avatar {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeAvatar(
                              avatar.id
                            )
                          }
                          className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>

                      </div>

                      <ImageUpload
                        label="Avatar Image"
                        value={
                          avatar.image
                        }
                        uploading={
                          uploading ===
                          `customers-avatar-${avatar.id}`
                        }
                        onUpload={(file) =>
                          uploadImage(
                            file,
                            `customers-avatar-${avatar.id}`,
                            (path) =>
                              updateAvatar(
                                avatar.id,
                                path
                              )
                          )
                        }
                        onDelete={() =>
                          deleteImage(
                            avatar.image,
                            () =>
                              updateAvatar(
                                avatar.id,
                                ""
                              )
                          )
                        }
                      />

                    </div>

                  )
                )}

              </div>
            )}

          </div>

        </EditorCard>

        {/*IMPACT*/}

        <EditorCard title="Impact Card">

          <div className="grid gap-5 md:grid-cols-2">

            <Input
              label="Employee Name"
              value={
                form.impact.name
              }
              onChange={(value) =>
                updateImpact(
                  "name",
                  value
                )
              }
            />

            <Input
              label="Employee Role"
              value={
                form.impact.role
              }
              onChange={(value) =>
                updateImpact(
                  "role",
                  value
                )
              }
            />

            <div className="md:col-span-2">

              <Input
                label="Impact Title"
                value={
                  form.impact.title
                }
                onChange={(value) =>
                  updateImpact(
                    "title",
                    value
                  )
                }
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Impact Description
              </label>

              <textarea
                rows={5}
                value={
                  form.impact.description
                }
                onChange={(event) =>
                  updateImpact(
                    "description",
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
              />

            </div>

            <ImageUpload
              label="Employee Image"
              value={
                form.impact.image
              }
              uploading={
                uploading ===
                "customers-impact-image"
              }
              onUpload={(file) =>
                uploadImage(
                  file,
                  "customers-impact-image",
                  (path) =>
                    updateImpact(
                      "image",
                      path
                    )
                )
              }
              onDelete={() =>
                deleteImage(
                  form.impact.image,
                  () =>
                    updateImpact(
                      "image",
                      ""
                    )
                )
              }
            />

          </div>

        </EditorCard>

      </div>

      {/*SAVE*/}

      <button
        type="button"
        onClick={saveChanges}
        disabled={
          saving ||
          uploading !== null
        }
        className="mt-8 rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white transition hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Customer Changes"}
      </button>

    </section>
  );
}

/*EDITOR CARD*/

function EditorCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-5">

      <h3 className="mb-5 text-lg font-bold text-[#0a1f4e]">
        {title}
      </h3>

      {children}

    </div>
  );
}

/*IMAGE UPLOAD*/

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

        {/* IMAGE PREVIEW */}

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
            No image found in database.
          </div>

        )}

        <div className="flex flex-wrap gap-2">

          {/* UPLOAD*/}

          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]">

            {uploading
              ? "Uploading..."
              : "Choose Image"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {

                const file =
                  event.target.files?.[0];

                if (file) {
                  onUpload(file);
                }

                event.target.value = "";
              }}
            />

          </label>

          {/* DELETE */}

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

        {/* IMAGE PATH*/}

        {value && (

          <p className="mt-3 break-all text-xs text-gray-400">
            {value}
          </p>

        )}

      </div>

    </div>
  );
}

/*INPUT*/

function Input({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        min={min}
        max={max}
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