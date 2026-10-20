"use client";

import { useEffect, useState } from "react";
import { apiFetch, getMediaUrl } from "@/lib/api";
import type {
  ContactCTAContent,
  ContactCTAService,
} from "@/types/cms";
import { toast } from "react-toastify";

interface Props {
  content?: ContactCTAContent;
  onUpdated: (content: ContactCTAContent) => void;
}

export default function ContactCTAEditor({
  content,
  onUpdated,
}: Props) {

  const [form, setForm] = useState<ContactCTAContent | null>(
    content ?? null
  );

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  /*UPDATE FORM WHEN DB CONTENT CHANGES*/

  useEffect(() => {
    setForm(content ?? null);
  }, [content]);

  /*UPDATE NORMAL FIELD*/
  const updateField = (
    field: keyof ContactCTAContent,
    value: string
  ) => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  /*UPDATE SERVICE*/
  const updateService = (
    index: number,
    field: keyof ContactCTAService,
    value: string
  ) => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        services: prev.services.map(
          (service, serviceIndex) =>
            serviceIndex === index
              ? {
                ...service,
                [field]: value,
              }
              : service
        ),
      };
    });
  };

  /*ADD SERVICE*/
  const addService = () => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        services: [
          ...prev.services,
          {
            name: "New Service",
            sortOrder: prev.services.length + 1,
          },
        ],
      };
    });
  };

  /*REMOVE SERVICE*/
  const removeService = (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this service?"
    );

    if (!confirmDelete) {
      return;
    }

    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        services: prev.services
          .filter(
            (_, serviceIndex) =>
              serviceIndex !== index
          )
          .map((service, serviceIndex) => ({
            ...service,
            sortOrder: serviceIndex + 1,
          })),
      };
    });
  };

  /*UPLOAD CTA IMAGE*/
  const uploadImage = async (file: File) => {
    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("type", "about-big-image");
      formData.append("file", file);

      const response = await apiFetch<{
        message: string;
        file: {
          path: string;
        };
      }>("/uploads", {
        method: "POST",
        body: formData,
      });

      updateField("image", response.file.path);

     toast.success("Updated successfully.");
    } catch (error) {
      console.error(
        "Contact CTA image upload error:",
        error
      );

    toast.error("Failed to update.");
    } finally {
      setUploadingImage(false);
    }
  };
  /*DELETE CTA IMAGE*/
  const deleteImage = async () => {
    if (!form?.image) {
      return;
    }

    const imagePath = form.image;

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
      updateField("image", "");

      toast.success("Deleted successfully.");
    } catch (error) {
      console.error(
        "Delete CTA image error:",
        error
      );

      toast.error("Failed to delete.");
    }
  };

  /*SAVE CONTACT CTA */

  const saveChanges = async () => {
    if (!form) {
      toast.error(
        "Contact CTA data is not available."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await apiFetch<{
        content: {
          contactCTA: ContactCTAContent;
        };
      }>("/content/home", {
        method: "PUT",
        body: JSON.stringify({
          contactCTA: {
            ...form,
            image: form.image || null,
          },
        }),
      });

      onUpdated(
        response.content.contactCTA
      );

      toast.success("Updated successfully.");
    } catch (error) {
      console.error(
        "Contact CTA save error:",
        error
      );

     toast.error("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  /*LOADING / NO DB DATA*/

  if (!form) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 border-b pb-5">
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            Contact CTA
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            No Contact CTA data found in database.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
          Contact CTA content is not available.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="mb-6 border-b pb-5">

        <h2 className="text-xl font-bold text-[#0a1f4e]">
          Contact CTA
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage Contact CTA heading, form labels,
          services, button and image.
        </p>

      </div>

      {/* HEADING CONTENT*/}

      <div className="mb-8">

        <h3 className="mb-4 text-base font-bold text-[#0a1f4e]">
          CTA Heading
        </h3>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="First Line"
            value={form.titleLine1}
            onChange={(value) =>
              updateField(
                "titleLine1",
                value
              )
            }
          />

          <Input
            label="Highlighted Text"
            value={form.highlightedTitle}
            onChange={(value) =>
              updateField(
                "highlightedTitle",
                value
              )
            }
          />

          <Input
            label="Second Line"
            value={form.titleLine2}
            onChange={(value) =>
              updateField(
                "titleLine2",
                value
              )
            }
          />

          <Input
            label="Third Line"
            value={form.titleLine3}
            onChange={(value) =>
              updateField(
                "titleLine3",
                value
              )
            }
          />

        </div>

      </div>

      {/*SIDE LABEL*/}

      <div className="mb-8">

        <h3 className="mb-4 text-base font-bold text-[#0a1f4e]">
          Side Label
        </h3>

        <Input
          label="Side Label"
          value={form.sideLabel}
          onChange={(value) =>
            updateField(
              "sideLabel",
              value
            )
          }
        />

      </div>

      {/* FORM LABELS */}

      <div className="mb-8">

        <h3 className="mb-4 text-base font-bold text-[#0a1f4e]">
          Form Labels
        </h3>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Name Label"
            value={form.nameLabel}
            onChange={(value) =>
              updateField(
                "nameLabel",
                value
              )
            }
          />

          <Input
            label="Email Label"
            value={form.emailLabel}
            onChange={(value) =>
              updateField(
                "emailLabel",
                value
              )
            }
          />

          <Input
            label="Phone Label"
            value={form.phoneLabel}
            onChange={(value) =>
              updateField(
                "phoneLabel",
                value
              )
            }
          />

          <Input
            label="Message Label"
            value={form.messageLabel}
            onChange={(value) =>
              updateField(
                "messageLabel",
                value
              )
            }
          />

          <Input
            label="Service Label"
            value={form.serviceLabel}
            onChange={(value) =>
              updateField(
                "serviceLabel",
                value
              )
            }
          />

          <Input
            label="Button Text"
            value={form.buttonText}
            onChange={(value) =>
              updateField(
                "buttonText",
                value
              )
            }
          />

        </div>

      </div>

      {/*SERVICES */}

      <div className="mb-8">

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h3 className="text-base font-bold text-[#0a1f4e]">
              Services
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add, edit or remove services
              from the CTA form.
            </p>

          </div>

          <button
            type="button"
            onClick={addService}
            className="rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f4a99]"
          >
            + Add Service
          </button>

        </div>

        <div className="space-y-3">

          {form.services.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
              No services added.
            </div>
          ) : (
            form.services.map(
              (service, index) => (
                <div
                  key={
                    service.id ??
                    `service-${index}`
                  }
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-end"
                >

                  <div className="flex-1">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Service {index + 1}
                    </label>

                    <input
                      value={service.name}
                      onChange={(e) =>
                        updateService(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#2a5ab5]"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeService(index)
                    }
                    className="rounded-lg px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>

                </div>
              )
            )
          )}

        </div>

      </div>

      {/* IMAGE */}

      <div className="mb-8">

        <h3 className="mb-4 text-base font-bold text-[#0a1f4e]">
          CTA Image
        </h3>

        <ImageUpload
          label="Contact CTA Image"
          value={form.image}
          uploading={uploadingImage}
          onUpload={uploadImage}
          onDelete={deleteImage}
        />

      </div>

      {/* SAVE*/}

      <button
        type="button"
        onClick={saveChanges}
        disabled={
          saving ||
          uploadingImage
        }
        className="rounded-lg bg-[#2a5ab5] px-6 py-3 font-semibold text-white transition hover:bg-[#1f4a99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : "Save Contact CTA Changes"}
      </button>

    </section>
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
              className="h-64 w-full object-cover"
            />

          </div>
        ) : (
          <div className="mb-3 flex h-64 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            No image selected
          </div>
        )}

        {/* Buttons */}

        <div className="flex flex-wrap gap-2">

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
              className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
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

/* NORMAL INPUT*/
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
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2a5ab5]"
      />

    </div>
  );
}