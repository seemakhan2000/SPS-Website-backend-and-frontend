"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

import {
  apiFetch,
  getMediaUrl,
} from "@/lib/api";

import type {
  HomeContent,
  StartupContent,
  StartupsSectionContent,
} from "@/types/cms";

interface Props {
  content: StartupContent[];
  startupsSection?: StartupsSectionContent;
  onUpdated: (
    content: StartupContent[]
  ) => void;
  onSectionUpdated?: (
    content: StartupsSectionContent
  ) => void;
}

export default function StartupsEditor({
  content,
  startupsSection,
  onUpdated,
  onSectionUpdated,
}: Props) {
  const [form, setForm] =
    useState<StartupContent[] | null>(
      Array.isArray(content)
        ? content
        : null
    );

  const [sectionForm, setSectionForm] =
    useState<StartupsSectionContent | null>(
      startupsSection ?? null
    );

  const [saving, setSaving] =
    useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState<number | null>(null);

  useEffect(() => {
    setForm(
      Array.isArray(content)
        ? content
        : null
    );
  }, [content]);

  useEffect(() => {
    setSectionForm(
      startupsSection ?? null
    );
  }, [startupsSection]);

  const updateSection = (
    field: keyof StartupsSectionContent,
    value: string
  ) => {
    setSectionForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  const updateStartup = (
    index: number,
    field: keyof StartupContent,
    value: string
  ) => {
    setForm((previous) => {
      if (!previous) {
        return previous;
      }

      return previous.map(
        (startup, startupIndex) =>
          startupIndex === index
            ? {
                ...startup,
                [field]:
                  field === "sortOrder"
                    ? Number(value)
                    : value,
              }
            : startup
      );
    });
  };
const uploadStartupLogo = async (
  file: File,
  index: number
) => {
  try {
    setUploadingLogo(index);

    const formData = new FormData();

    formData.append("type", "startup-logo");
    formData.append("file", file);

    const response = await apiFetch<{
      message: string;
      fileUrl: string;
      publicId: string;
      resourceType: string;
      file: {
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        publicId: string;
      };
    }>("/uploads", {
      method: "POST",
      body: formData,
    });

    const uploadedUrl = response.file?.url;

    if (!uploadedUrl) {
      throw new Error("Cloudinary image URL not received.");
    }

    updateStartup(index, "logo", uploadedUrl);

    toast.success("Logo uploaded successfully.");
  } catch (error) {
    console.error("Startup logo upload error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Logo upload failed."
    );
  } finally {
    setUploadingLogo(null);
  }
};

  const deleteStartupLogo = async (
    index: number
  ) => {
    if (!form) {
      return;
    }

    const imagePath =
      form[index]?.logo;

    if (!imagePath) {
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
      setUploadingLogo(index);

      if (
        imagePath.startsWith(
          "/uploads/"
        )
      ) {
        await apiFetch("/uploads", {
          method: "DELETE",
          body: JSON.stringify({
            filePath: imagePath,
          }),
        });
      }

      updateStartup(
        index,
        "logo",
        ""
      );

      toast.success(
        "Logo deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete startup logo error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete logo."
      );
    } finally {
      setUploadingLogo(null);
    }
  };

  const handleSave = async () => {
    if (!form || !sectionForm) {
      toast.error(
        "No Startups data found in database."
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await apiFetch<{
          message: string;
          content: HomeContent;
        }>("/content/home", {
          method: "PUT",
          body: JSON.stringify({
            startups: form,
            startupsSection:
              sectionForm,
          }),
        });

      const updatedStartups =
        response.content.startups;

      setForm(updatedStartups);

      onUpdated(updatedStartups);

      const updatedSection =
        response.content.startupsSection;

      if (updatedSection) {
        setSectionForm(
          updatedSection
        );

        onSectionUpdated?.(
          updatedSection
        );
      }

      toast.success(
        "Startups content updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update Startups:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update Startups."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(
      Array.isArray(content)
        ? content
        : null
    );

    setSectionForm(
      startupsSection ?? null
    );
  };

  if (!form || !sectionForm) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            Startups
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage startup banner content,
            startup names, descriptions, logos
            and display order.
          </p>
        </div>

        <div className="p-10 text-center">
          <p className="text-sm text-gray-500">
            No Startups data found in database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#0a1f4e]">
            Startups
          </h2>

          <p className="text-sm text-gray-500">
            Manage startup banner content,
            startup names, descriptions, logos
            and display order.
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200 p-6">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-[#0a1f4e]">
            Banner Content
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage the content displayed above
            the startup cards.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0a1f4e]">
              Title
            </label>

            <input
              type="text"
              value={
                sectionForm.title
              }
              onChange={(event) =>
                updateSection(
                  "title",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                text-sm
                text-gray-800
                outline-none
                transition
                focus:border-[#1E4B9E]
                focus:ring-2
                focus:ring-[#1E4B9E]/10
              "
              placeholder="Title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0a1f4e]">
              Subtitle
            </label>

            <input
              type="text"
              value={
                sectionForm.subtitle
              }
              onChange={(event) =>
                updateSection(
                  "subtitle",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                text-sm
                text-gray-800
                outline-none
                transition
                focus:border-[#1E4B9E]
                focus:ring-2
                focus:ring-[#1E4B9E]/10
              "
              placeholder="Subtitle"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0a1f4e]">
              Description
            </label>

            <textarea
              value={
                sectionForm.description
              }
              onChange={(event) =>
                updateSection(
                  "description",
                  event.target.value
                )
              }
              rows={6}
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                text-sm
                leading-6
                text-gray-800
                outline-none
                transition
                focus:border-[#1E4B9E]
                focus:ring-2
                focus:ring-[#1E4B9E]/10
              "
              placeholder="Enter startups banner description"
            />

            <p className="mt-2 text-xs text-gray-400">
              You can press Enter to create
              line breaks in the banner description.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {form.map(
          (startup, index) => (
            <div
              key={
                startup.id ??
                `${startup.name}-${index}`
              }
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                transition-all
                duration-200
                hover:border-[#1E4B9E]/30
                hover:shadow-md
              "
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#EAF2FB]
                      text-sm
                      font-bold
                      text-[#1E4B9E]
                    "
                  >
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#0a1f4e]">
                      Startup #{index + 1}
                    </h3>

                    <p className="text-xs text-gray-400">
                      ID: {startup.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0a1f4e]">
                    Startup Logo
                  </label>

                  <div className="rounded-xl border border-gray-300 p-3">
                    <div
                      className="
                        relative
                        mb-3
                        h-[150px]
                        w-full
                        overflow-hidden
                        rounded-lg
                        border
                        border-dashed
                        border-gray-300
                        bg-[#f7fbff]
                      "
                    >
                      {startup.logo ? (
                        <Image
                          src={getMediaUrl(
                            startup.logo
                          )}
                          alt={
                            startup.name ||
                            "Startup logo"
                          }
                          fill
                          sizes="180px"
                          className="object-contain p-5"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No logo selected
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label
                        className={`
                          cursor-pointer
                          rounded-lg
                          bg-[#2a5ab5]
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-[#1f4a99]
                          ${
                            uploadingLogo === index
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }
                        `}
                      >
                        {uploadingLogo === index
                          ? "Uploading..."
                          : "Choose Image"}

                        <input
                          type="file"
                          accept="
                            image/jpeg,
                            image/png,
                            image/webp,
                            image/svg+xml
                          "
                          className="hidden"
                          disabled={
                            uploadingLogo === index
                          }
                          onChange={(event) => {
                            const file =
                              event.target.files?.[0];

                            if (file) {
                              uploadStartupLogo(
                                file,
                                index
                              );
                            }

                            event.target.value =
                              "";
                          }}
                        />
                      </label>

                      {startup.logo && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteStartupLogo(
                              index
                            )
                          }
                          disabled={
                            uploadingLogo === index
                          }
                          className="
                            rounded-lg
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-red-600
                            transition
                            hover:bg-red-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {startup.logo && (
                      <p className="mt-3 break-all text-xs text-gray-400">
                        {startup.logo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#0a1f4e]">
                      Startup Name
                    </label>

                    <input
                      type="text"
                      value={
                        startup.name
                      }
                      onChange={(event) =>
                        updateStartup(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        text-sm
                        text-gray-800
                        outline-none
                        transition
                        focus:border-[#1E4B9E]
                        focus:ring-2
                        focus:ring-[#1E4B9E]/10
                      "
                      placeholder="Startup name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#0a1f4e]">
                      Description
                    </label>

                    <textarea
                      value={
                        startup.description
                      }
                      onChange={(event) =>
                        updateStartup(
                          index,
                          "description",
                          event.target.value
                        )
                      }
                      rows={5}
                      className="
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        text-sm
                        leading-6
                        text-gray-800
                        outline-none
                        transition
                        focus:border-[#1E4B9E]
                        focus:ring-2
                        focus:ring-[#1E4B9E]/10
                      "
                      placeholder="Startup description"
                    />
                  </div>

                  <div className="max-w-[180px]">
                    <label className="mb-2 block text-sm font-semibold text-[#0a1f4e]">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        startup.sortOrder ?? index
                      }
                      onChange={(event) =>
                        updateStartup(
                          index,
                          "sortOrder",
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        text-sm
                        text-gray-800
                        outline-none
                        transition
                        focus:border-[#1E4B9E]
                        focus:ring-2
                        focus:ring-[#1E4B9E]/10
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {form.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-gray-300
              bg-gray-50
              py-12
              text-center
            "
          >
            <p className="text-sm text-gray-500">
              No startups found in database.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-6 py-5">
        <div className="flex w-full items-center justify-start gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="
              rounded-xl
              border
              border-gray-300
              px-5
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              rounded-xl
              bg-[#1E4B9E]
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#163d82]
              hover:shadow-md
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}