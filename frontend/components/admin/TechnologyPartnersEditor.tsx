"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  apiFetch,
  getMediaUrl,
} from "@/lib/api";

import type {
  TechnologyPartner,
  TechnologyPartnersContent,
} from "@/types/cms";

interface Props {
  content?: TechnologyPartnersContent;

  onUpdated: (
    content: TechnologyPartnersContent
  ) => void;
}


export default function TechnologyPartnersEditor({
  content,
  onUpdated,
}: Props) {



  const [form, setForm] =
    useState<TechnologyPartnersContent | null>(
      content ?? null
    );



  const [saving, setSaving] =
    useState(false);



  const [uploadingIndex, setUploadingIndex] =
    useState<number | null>(null);


  useEffect(() => {
    setForm(
      content ?? null
    );
  }, [content]);



  const updateField = (
    field:
      | "title"
      | "description",
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



  const updatePartner = (
    index: number,
    field: keyof TechnologyPartner,
    value: string | number
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        partners:
          previous.partners.map(
            (
              partner,
              partnerIndex
            ) =>
              partnerIndex === index
                ? {
                  ...partner,

                  [field]: value,
                }
                : partner
          ),
      };
    });
  };


  const addPartner = () => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        partners: [
          ...previous.partners,

          {
            name: "",
            tagline: "",
            image: "",
            href: "",
            sortOrder:
              previous.partners.length,
          },
        ],
      };
    });
  };



  const removePartner = (
    index: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to remove this technology partner?"
      );

    if (!confirmed) {
      return;
    }

    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,

        partners:
          previous.partners
            .filter(
              (_, partnerIndex) =>
                partnerIndex !== index
            )
            .map(
              (
                partner,
                partnerIndex
              ) => ({
                ...partner,

                sortOrder:
                  partnerIndex,
              })
            ),
      };
    });
  };
/* UPLOAD TECHNOLOGY PARTNER IMAGE */
const uploadPartnerImage = async (
  index: number,
  file: File
) => {
  try {
    setUploadingIndex(index);

    const formData = new FormData();

    formData.append("type", "technology-partner-image");
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

    // Get Cloudinary URL
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
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      const partners = [...previous.partners];

      if (!partners[index]) {
        return previous;
      }

      partners[index] = {
        ...partners[index],
        image: imageUrl,
      };

      return {
        ...previous,
        partners,
      };
    });

    toast.success("Partner image uploaded successfully.");
  } catch (error) {
    console.error(
      "Partner image upload error:",
      error
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to upload partner image."
    );
  } finally {
    setUploadingIndex(null);
  }
};



  const deletePartnerImage =
    async (
      index: number
    ) => {

      if (!form) {
        return;
      }

      const imagePath =
        form.partners[index]
          ?.image;

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
                filePath:
                  imagePath,
              }),
            }
          );
        }
        updatePartner(
          index,
          "image",
          ""
        );

        toast.success(
          "Partner image deleted successfully."
        );

      } catch (error) {

        console.error(
          "Delete partner image error:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete image."
        );
      }
    };

  const saveChanges =
    async () => {
      if (!form) {
        toast.success(
          "No Technology Partners data found in database."
        );

        return;
      }

      try {

        setSaving(true);

        const dataToSave:
          TechnologyPartnersContent =
        {
          title:
            form.title,

          description:
            form.description,

          partners:
            form.partners.map(
              (
                partner,
                index
              ) => ({
                ...partner,

                sortOrder:
                  index,
              })
            ),
        };

        const response =
          await apiFetch<{
            message: string;

            content: {
              technologyPartners:
              TechnologyPartnersContent;
            };
          }>(
            "/content/home",
            {
              method: "PUT",

              body: JSON.stringify({
                technologyPartners:
                  dataToSave,
              }),
            }
          );

        const savedContent =
          response.content
            ?.technologyPartners;

        if (!savedContent) {
          throw new Error(
            "Technology Partners data was not returned from database."
          );
        }


        setForm(
          savedContent
        );

        onUpdated(
          savedContent
        );

        toast.success(
          "Technology Partners updated successfully."
        );

      } catch (error) {

        console.error(
          "Technology Partners save error:",
          error
        );

        toast.success(
          error instanceof Error
            ? error.message
            : "Failed to save Technology Partners."
        );

      } finally {

        setSaving(false);
      }
    };

  if (!form) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">

        {/* HEADER */}

        <div className="mb-6 border-b pb-5">

          <h2 className="text-xl font-bold text-[#0a1f4e]">
            Technology Partners
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage Technology Partners
            heading, description, images,
            names, taglines and links.
          </p>

        </div>

        {/* EMPTY DATABASE */}

        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">

          <p className="text-sm text-gray-400">
            No Technology Partners data
            found in database.
          </p>

        </div>

      </section>
    );
  }



  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="mb-6 border-b pb-5">

        <h2 className="text-xl font-bold text-[#0a1f4e]">
          Technology Partners
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage Technology Partners
          heading, description, images,
          names, taglines and links.
        </p>

      </div>

      {/* SECTION CONTENT */}

      <div className="grid gap-5">

        {/* TITLE */}

        <Input
          label="Section Title"
          value={
            form.title
          }
          onChange={(value) =>
            updateField(
              "title",
              value
            )
          }
        />

        {/* DESCRIPTION */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Section Description
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

      </div>

      {/* PARTNERS */}

      <div className="mt-8 border-t pt-6">

        {/* HEADER */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <div>

            <h3 className="text-lg font-bold text-[#0a1f4e]">
              Technology Partner Cards
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage partner image,
              name, tagline and
              Learn More link.
            </p>

          </div>

          <button
            type="button"
            onClick={
              addPartner
            }
            className="rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]"
          >
            + Add Partner
          </button>

        </div>

        {/* PARTNER LIST */}

        <div className="space-y-6">

          {form.partners.length ===
            0 ? (

            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">

              No technology partners
              found in database.

            </div>

          ) : (

            form.partners.map(
              (
                partner,
                index
              ) => (

                <div
                  key={
                    partner.id ??
                    `technology-partner-${index}`
                  }
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >

                  {/* PARTNER HEADER */}

                  <div className="mb-5 flex items-center justify-between">

                    <div>

                      <h4 className="font-bold text-[#0a1f4e]">
                        Partner{" "}
                        {index + 1}
                      </h4>

                      <p className="text-xs text-gray-400">
                        Technology Partner
                        Card
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removePartner(
                          index
                        )
                      }
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete Partner
                    </button>

                  </div>

                  {/* CARD PREVIEW */}

                  <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-6">

                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Frontend Card Preview
                    </p>

                    <div className="flex min-h-[320px] items-center justify-center">

                      <div className="flex min-h-[280px] w-[233.33px] flex-col items-center justify-center gap-3 rounded-xl bg-white px-6 py-8 text-center shadow-[0_10px_30px_rgba(15,40,90,0.08)]">

                        {/* IMAGE */}

                        <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden">

                          {partner.image ? (

                            <img
                              src={getMediaUrl(
                                partner.image
                              )}
                              alt={
                                partner.name ||
                                "Technology Partner"
                              }
                              className="h-full w-full object-contain"
                            />

                          ) : (

                            <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                              No Image
                            </div>

                          )}

                        </div>

                        {/* CONTENT */}

                        <div>

                          <h3 className="mb-1 text-xl font-bold text-[#0A1F44]">
                            {partner.name ||
                              "Partner Name"}
                          </h3>

                          <p className="mb-2 text-sm font-medium text-[#5B6B8C]">
                            {partner.tagline ||
                              "Partner Tagline"}
                          </p>

                          <span className="text-sm font-medium text-[#2F6FED]">
                            Learn More
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* EDITABLE FIELDS */}

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* NAME */}

                    <Input
                      label="Partner Name"
                      value={
                        partner.name
                      }
                      onChange={(value) =>
                        updatePartner(
                          index,
                          "name",
                          value
                        )
                      }
                    />

                    {/* TAGLINE */}

                    <Input
                      label="Partner Tagline"
                      value={
                        partner.tagline
                      }
                      onChange={(value) =>
                        updatePartner(
                          index,
                          "tagline",
                          value
                        )
                      }
                    />

                    {/* HREF */}

                    <div className="md:col-span-2">

                      <Input
                        label="Learn More Link"
                        value={
                          partner.href
                        }
                        onChange={(value) =>
                          updatePartner(
                            index,
                            "href",
                            value
                          )
                        }
                      />

                    </div>

                    {/* IMAGE */}

                    <PartnerImageUpload
                      label="Partner Image"
                      value={
                        partner.image
                      }
                      uploading={
                        uploadingIndex ===
                        index
                      }
                      onUpload={(
                        file
                      ) =>
                        uploadPartnerImage(
                          index,
                          file
                        )
                      }
                      onDelete={() =>
                        deletePartnerImage(
                          index
                        )
                      }
                    />

                  </div>

                </div>
              )
            )
          )}

        </div>

      </div>

      {/* SAVE */}

      <button
        type="button"
        onClick={
          saveChanges
        }
        disabled={
          saving ||
          uploadingIndex !== null
        }
        className="mt-8 rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white transition hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Technology Partners Changes"}
      </button>

    </section>
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
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2a5ab5]"
      />

    </div>
  );
}


function PartnerImageUpload({
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
    <div className="md:col-span-2">

      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="rounded-lg border border-gray-300 bg-white p-3">

        {/* IMAGE */}

        {value ? (

          <div className="mb-3 flex h-48 items-center justify-center overflow-hidden rounded-lg border bg-white">

            <img
              src={getMediaUrl(
                value
              )}
              alt={label}
              className="max-h-full max-w-full object-contain"
            />

          </div>

        ) : (

          <div className="mb-3 flex h-48 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
            No image selected
          </div>

        )}

        {/* BUTTONS */}

        <div className="flex flex-wrap gap-2">

          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]">

            {uploading
              ? "Uploading..."
              : "Choose Image"}

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
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

          {value && (

            <button
              type="button"
              onClick={
                onDelete
              }
              disabled={
                uploading
              }
              className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>

          )}

        </div>

        {/* IMAGE PATH */}

        {value && (

          <p className="mt-3 break-all text-xs text-gray-400">
            {value}
          </p>

        )}

      </div>

    </div>
  );
}