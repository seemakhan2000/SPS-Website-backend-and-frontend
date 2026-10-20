"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { apiFetch, getMediaUrl } from "@/lib/api";

import type {
  ContactCTAContent,
  HomeContent,
} from "@/types/cms";

export default function ContactCTA() {
  const [content, setContent] =
    useState<ContactCTAContent | null>(null);
  /*LOAD CONTACT CTA FROM DATABASE*/
  useEffect(() => {
    const loadContactCTA = async () => {
      try {
        const data =
          await apiFetch<HomeContent>("/content/home");

        setContent(data.contactCTA);
      } catch (error) {
        console.error(
          "Failed to load Contact CTA content:",
          error
        );
      }
    };

    loadContactCTA();
  }, []);


  /*FORM STATE*/
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /*FORM SUBMIT*/

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
  };
  if (!content) {
    return (
      <section className="relative w-full overflow-hidden bg-white py-16 md:py-20">
        <div className="flex min-h-[650px] items-center justify-center">
          <p className="text-gray-500">
            Contact information is currently unavailable.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 md:py-20">
      {/* MAIN CONTAINER */}
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-stretch justify-center gap-8 lg:flex-row lg:gap-[120px]">

          {/*  LEFT SIDE - IMAGE*/}
          <div className="flex w-full items-stretch lg:w-[40%]">
            <div className="relative mt-[60px] w-full min-h-[550px] sm:min-h-[750px] lg:mt-[90px] lg:min-h-[750px]">
              <Image
                src={getMediaUrl(content.image)}
                alt={content.sideLabel}
                width={1200}
                height={1000}
                priority
                className="
                  h-[450px]
                  sm:h-[500px]
                  md:h-[550px]
                  lg:h-[600px]
                  mt-[-30px]
                  text-transparent
                  w-full
                  object-cover
                  object-center
                "
              />
            </div>
          </div>

          {/* RIGHT SIDE - CTA / FORM*/}
          <div className="flex w-full items-stretch lg:w-[35%]">
            <div className="relative w-full">

              {/*SIDE LABEL - DESKTOP*/}
              <div
                className="
                  absolute
                  -left-11
                  top-[30px]
                  z-20
                  hidden
                  h-auto
                  items-center
                  justify-center
                  rounded-bl-lg
                  rounded-tl-lg
                  bg-[#0a1628]
                  px-5
                  py-3
                  text-center
                  text-sm
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  lg:flex
                  [writing-mode:vertical-rl]
                "
              >
                {content.sideLabel}
              </div>

              {/* BLUE CTA CARD*/}
              <div
                className="
                  flex
                  min-h-[650px]
                  w-full
                  flex-col
                  rounded-2xl
                  bg-[#2860bd]
                  p-7
                  sm:p-8
                  md:p-10
                  lg:min-h-[720px]
                "
              >

                {/* HEADING*/}
                <div className="mb-8">
                  <h2
                    className="
                      text-3xl
                      font-bold
                      leading-[1.15]
                      text-white
                      md:text-4xl
                      lg:text-[42px]
                    "
                  >
                    {content.titleLine1}{" "}
                    <span className="text-[#0a1628]">
                      {content.highlightedTitle}
                    </span>
                    <br />
                    {content.titleLine2}
                    <br />
                    {content.titleLine3}
                  </h2>
                </div>

                {/* FORM*/}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-1 flex-col"
                >

                  {/* TOP INPUTS*/}
                  <div
                    className="
                      mx-auto
                      grid
                      w-full
                      max-w-[650px]
                      grid-cols-1
                      gap-x-8
                      gap-y-6
                      sm:grid-cols-2
                    "
                  >

                    {/* NAME */}
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={content.nameLabel}
                        required
                        className="
                          peer
                          w-full
                          border-0
                          border-b-2
                          border-white/40
                          bg-transparent
                          py-3
                          text-left
                          font-semibold
                          text-white
                          outline-none
                          placeholder-transparent
                          transition-colors
                          focus:border-[#f4b840]
                        "
                      />

                      <label
                        className="
                          pointer-events-none
                          absolute
                          left-0
                          top-0
                          text-sm
                          font-semibold
                          text-white/75
                          transition-all
                          duration-300
                          peer-placeholder-shown:top-3
                          peer-placeholder-shown:text-sm
                          peer-focus:-top-5
                          peer-focus:text-xs
                        "
                      >
                        {content.nameLabel}
                      </label>
                    </div>

                    {/* EMAIL */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={content.emailLabel}
                        required
                        className="
                          peer
                          w-full
                          border-0
                          border-b-2
                          border-white/40
                          bg-transparent
                          py-3
                          text-left
                          font-semibold
                          text-white
                          outline-none
                          placeholder-transparent
                          transition-colors
                          focus:border-[#f4b840]
                        "
                      />

                      <label
                        className="
                          pointer-events-none
                          absolute
                          left-0
                          top-0
                          text-sm
                          font-semibold
                          text-white/75
                          transition-all
                          duration-300
                          peer-placeholder-shown:top-3
                          peer-placeholder-shown:text-sm
                          peer-focus:-top-5
                          peer-focus:text-xs
                        "
                      >
                        {content.emailLabel}
                      </label>
                    </div>

                    {/* PHONE */}
                    <div className="relative">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={content.phoneLabel}
                        className="
                          peer
                          w-full
                          border-0
                          border-b-2
                          border-white/40
                          bg-transparent
                          py-3
                          text-left
                          font-semibold
                          text-white
                          outline-none
                          placeholder-transparent
                          transition-colors
                          focus:border-[#f4b840]
                        "
                      />

                      <label
                        className="
                          pointer-events-none
                          absolute
                          left-0
                          top-0
                          text-sm
                          font-semibold
                          text-white/75
                          transition-all
                          duration-300
                          peer-placeholder-shown:top-3
                          peer-placeholder-shown:text-sm
                          peer-focus:-top-5
                          peer-focus:text-xs
                        "
                      >
                        {content.phoneLabel}
                      </label>
                    </div>

                    {/* SERVICES */}
                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="
                          w-full
                          cursor-pointer
                          appearance-none
                          border-0
                          border-b-2
                          border-white/40
                          bg-transparent
                          py-3
                          pr-8
                          font-semibold
                          text-white/90
                          outline-none
                          transition-colors
                          focus:border-[#f4b840]
                        "
                      >
                        {content.services.map((service) => (
                          <option
                            key={
                              service.id ??
                              service.sortOrder ??
                              service.name
                            }
                            value={service.name}
                            className="bg-white font-semibold text-gray-900"
                          >
                            {service.name}
                          </option>
                        ))}
                      </select>

                      <span
                        className="
                          pointer-events-none
                          absolute
                          right-1
                          top-3
                          text-xs
                          text-white/70
                        "
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* MESSAGE*/}
                  <div className="relative mx-auto mt-8 w-full max-w-[650px]">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder={content.messageLabel}
                      className="
                        peer
                        w-full
                        resize-none
                        border-0
                        border-b-2
                        border-white/40
                        bg-transparent
                        py-3
                        font-semibold
                        text-white
                        outline-none
                        placeholder-transparent
                        transition-colors
                        focus:border-[#f4b840]
                      "
                    />

                    <label
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        top-0
                        text-sm
                        font-semibold
                        text-white/75
                        transition-all
                        duration-300
                        peer-placeholder-shown:top-3
                        peer-placeholder-shown:text-sm
                        peer-focus:-top-5
                        peer-focus:text-xs
                      "
                    >
                      {content.messageLabel}
                    </label>
                  </div>

                  {/*APPOINTMENT BUTTON*/}
                  <div className="mt-auto flex justify-center pt-8">
                    <button
                      type="submit"
                      className="
                        group
                        inline-flex
                        items-center
                        rounded-xl
                        bg-white
                        px-7
                        py-3
                        font-bold
                        text-[#0a1628]
                        shadow-md
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-[#8b95a6]
                        hover:text-white
                        hover:shadow-xl
                      "
                    >
                      <span>
                        {content.buttonText}
                      </span>

                      <span
                        className="
                          ml-4
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#c4cad3]
                          text-[#4a5568]
                          shadow-sm
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                          group-hover:bg-white
                          group-hover:text-[#0a1628]
                        "
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 12h14M13 6l6 6-6 6"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}