
"use client";

import { useEffect, useState } from "react";

import {
  Clock,
  ListChecks,
  HandHelping,
  HandCoins,
  ArrowRight,
} from "@/lib/icons";

import { apiFetch, getMediaUrl } from "@/lib/api";

import type {
  HomeContent,
  HowItWorksContent,
  HowItWorksStep,
} from "@/types/cms";

export default function HowItWorks() {
  const [content, setContent] =
    useState<HowItWorksContent | null>(null);


  // Fetch From Database
  useEffect(() => {
    const loadHowItWorks = async () => {
      try {
        const response =
          await apiFetch<HomeContent>(
            "/content/home"
          );

        console.log(
          "HOME CONTENT:",
          response
        );

        console.log(
          "HOW IT WORKS:",
          response.howItWorks
        );

        setContent(
          response.howItWorks ?? null
        );
      } catch (error) {
        console.error(
          "Failed to load How It Works:",
          error
        );

        setContent(null);
      }
    };

    loadHowItWorks();
  }, []);



  // No DB Data
  if (!content) {
    console.warn(
      "How It Works data does not exist in API response."
    );

    return null;
  }


  // Icon Mapping
  const iconMap = {
    Clock,
    ListChecks,
    HandHelping,
    HandCoins,
  };

  return (
    <section className="bg-white py-14 md:py-16">
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-8 px-[30px] md:grid-cols-[355px_940px] md:justify-between md:gap-6 md:px-[118px]">

        {/*  Left Column*/}
        <div className="flex flex-col justify-center">

          <h2 className="text-[44px] font-extrabold leading-[1.15] tracking-tight text-[#0B2A5B]">
            {content.heading}
          </h2>

          <p className="mt-4 max-w-[365px] text-[16px] leading-[1.7] text-slate-500">
            {content.description}
          </p>

          <ol className="mt-9 space-y-6">
            {content.steps?.map(
              (step: HowItWorksStep) => {

                const Icon =
                  iconMap[
                  step.icon as keyof typeof iconMap
                  ];

                return (
                  <li
                    key={
                      step.id ??
                      `${step.title}-${step.sortOrder}`
                    }
                    className="flex items-center gap-4"
                  >
                    <span className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-[#EAF1FB]">

                      {Icon && (
                        <Icon
                          className="h-[22px] w-[22px] text-[#0B2A5B]"
                          strokeWidth={1.75}
                        />
                      )}

                    </span>

                    <span className="text-[19px] font-semibold text-[#0B2A5B]">
                      {step.title}
                    </span>
                  </li>
                );
              }
            )}
          </ol>
        </div>

        {/*Right Column*/}

        <div className="relative w-full max-w-[920px] pb-16">

          {/* Image */}
          <div className="aspect-[740/430] overflow-hidden rounded-2xl">
            <img
              src={getMediaUrl(content.image)}
              alt={content.heading}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Book Appointment*/}
          <button
            type="button"
            className="absolute bottom-0 left-0 flex items-center gap-3 rounded-xl bg-[#0B2A5B] py-1.5 pl-6 pr-1.5 text-white shadow-xl transition-colors hover:bg-[#0d3372]"
            onClick={() => {
              if (content.buttonLink) {
                window.location.href =
                  content.buttonLink;
              }
            }}
          >
            <span className="whitespace-nowrap text-[15px] font-semibold tracking-wide">
              {content.buttonText}
            </span>

            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white">
              <ArrowRight
                className="h-4 w-4 text-[#0B2A5B]"
                strokeWidth={2.5}
              />
            </span>
          </button>

          {/* Stats Card*/}

          <div className="absolute bottom-[-25px] right-[30px] flex gap-14 rounded-2xl bg-[#1D4FA3] px-10 py-8 text-white shadow-lg">

            <div>
              <p className="text-[50px] font-extrabold leading-none">
                {content.specialistsNumber}
              </p>

              <p className="mt-3 text-[30px] text-white/85">
                {content.specialistsText}
              </p>
            </div>

            <div>
              <p className="text-[50px] font-extrabold leading-none">
                {content.clientsNumber}
              </p>

              <p className="mt-3 text-[30px] text-white/85">
                {content.clientsText}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

