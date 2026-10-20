
"use client";

import { useEffect, useState } from "react";
import { apiFetch, getMediaUrl } from "@/lib/api";
import { toast } from "react-toastify";

import type {
  ClientLogoContent,
  ClientsMarqueeContent,
} from "@/types/cms";

interface Props {
  content?: ClientsMarqueeContent;
  onUpdated: (
    content: ClientsMarqueeContent
  ) => void;
}

export default function ClientsMarqueeEditor({
  content,
  onUpdated,
}: Props) {
  const [form, setForm] =
    useState<ClientsMarqueeContent>({
      title: "",
      clients: [],
    });

  const [saving, setSaving] =
    useState(false);

  const [uploadingIndex, setUploadingIndex] =
    useState<number | null>(null);

  
  // LOAD DATA FROM DB
  useEffect(() => {
    if (!content) {
      setForm({
        title: "",
        clients: [],
      });

      return;
    }

    setForm({
      title: content.title || "",
      clients: content.clients || [],
    });
  }, [content]);

  /*UPDATE TITLE*/
  const updateTitle = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
    }));
  };

  /*UPDATE CLIENT*/

  const updateClient = (
    index: number,
    field: keyof ClientLogoContent,
    value: string
  ) => {
    setForm((prev) => {
      const clients = [...prev.clients];

      if (!clients[index]) {
        return prev;
      }

      clients[index] = {
        ...clients[index],
        [field]: value,
      };

      return {
        ...prev,
        clients,
      };
    });
  };

  /* ADD CLIENT*/

  const addClient = () => {
    setForm((prev) => ({
      ...prev,
      clients: [
        ...prev.clients,
        {
          id: `client-${Date.now()}`,
          name: "",
          logo: "",
          alt: "",
          sortOrder: prev.clients.length,
        },
      ],
    }));
  };

  /*REMOVE CLIENT*/

  const removeClient = (
    index: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to remove this customer?"
      );

    if (!confirmDelete) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      clients: prev.clients.filter(
        (_, clientIndex) =>
          clientIndex !== index
      ),
    }));
  };

  /*UPLOAD LOGO*/

  const uploadLogo = async (
    file: File,
    index: number
  ) => {
    try {
      setUploadingIndex(index);

      const formData = new FormData();

      formData.append(
        "type",
        "client-logo"
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

      updateClient(
        index,
        "logo",
        response.file.path
      );

     toast.success("Updated successfully.");
    } catch (error) {
      console.error(
        "Customer logo upload error:",
        error
      );

    toast.error("Failed to update.");
    } finally {
      setUploadingIndex(null);
    }
  };

  /*DELETE LOGO FILE */
  const deleteLogo = async (
    index: number
  ) => {
    const logo =
      form.clients[index]?.logo;

    if (!logo) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this logo?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await apiFetch("/uploads", {
        method: "DELETE",
        body: JSON.stringify({
          filePath: logo,
        }),
      });

      updateClient(
        index,
        "logo",
        ""
      );

     toast.success("Deleted successfully.");
    } catch (error) {
      console.error(
        "Delete customer logo error:",
        error
      );

      toast.error("Failed to delete.");
    }
  };

  /*SAVE CHANGES TO DB */

  const saveChanges = async () => {
    try {
      setSaving(true);

      const normalizedClients =
        form.clients.map(
          (client, index) => ({
            ...client,
            sortOrder: index,
          })
        );

      const payload: ClientsMarqueeContent = {
        title: form.title,
        clients: normalizedClients,
      };

      const response =
        await apiFetch<{
          content: {
            clientsMarquee: ClientsMarqueeContent;
          };
        }>("/content/home", {
          method: "PUT",
          body: JSON.stringify({
            clientsMarquee: payload,
          }),
        });

      const updated =
        response.content.clientsMarquee;

      setForm({
        title: updated.title || "",
        clients: updated.clients || [],
      });

      onUpdated(updated);

     toast.success("Updated successfully.");
    } catch (error) {
      console.error(
        "Save Customers error:",
        error
      );

     toast.error("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            Customers Marquee
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer heading and logos.
          </p>
        </div>

        <button
          type="button"
          onClick={addClient}
          className="rounded-lg bg-[#2a5ab5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f4a99]"
        >
          + Add Customer
        </button>
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Section Title
        </label>

        <input
          value={form.title}
          onChange={(e) =>
            updateTitle(e.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2a5ab5]"
        />
      </div>

      <div className="space-y-5">
        {form.clients.map(
          (client, index) => (
            <div
              key={
                client.id ??
                `client-${index}`
              }
              className="rounded-xl border border-gray-200 bg-gray-50 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-[#0a1f4e]">
                  Customer #{index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    removeClient(index)
                  }
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Customer Name"
                  value={client.name}
                  onChange={(value) =>
                    updateClient(
                      index,
                      "name",
                      value
                    )
                  }
                />

                <Input
                  label="Alt Text"
                  value={client.alt}
                  onChange={(value) =>
                    updateClient(
                      index,
                      "alt",
                      value
                    )
                  }
                />

                <div className="md:col-span-2">
                  <ImageUpload
                    label="Customer Logo"
                    value={client.logo}
                    uploading={
                      uploadingIndex ===
                      index
                    }
                    onUpload={(file) =>
                      uploadLogo(
                        file,
                        index
                      )
                    }
                    onDelete={() =>
                      deleteLogo(index)
                    }
                  />
                </div>
              </div>
            </div>
          )
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
          : "Save Customers Changes"}
      </button>
    </section>
  );
}

/* IMAGE UPLOAD COMPONENT*/
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
          <div className="mb-3 flex h-40 items-center justify-center overflow-hidden rounded-lg border bg-gray-50 p-4">
            <img
              src={getMediaUrl(value)}
              alt={label}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="mb-3 flex h-40 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            No logo selected
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg bg-[#2a5ab5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4a99]">
            {uploading
              ? "Uploading..."
              : "Choose Logo"}

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

/* INPUT COMPONENT*/
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
