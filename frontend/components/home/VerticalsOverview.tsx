"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "@/lib/icons";
import { apiFetch, getMediaUrl } from "@/lib/api";

import type {
  HomeContent,
  VerticalContent,
  VerticalsOverviewContent,
} from "@/types/cms";

export default function VerticalsOverview() {
  const [content, setContent] =
    useState<VerticalsOverviewContent | null>(null);
  const [activeId, setActiveId] =
    useState<string | undefined>(undefined);

  /*LOAD VERTICALS FROM DATABASE*/
  useEffect(() => {
    let isMounted = true;

    const loadVerticals = async () => {
      try {
        const data =
          await apiFetch<HomeContent>(
            "/content/home"
          );

        if (!isMounted) return;

        /* DATABASE CONTENT ONLY*/

        const verticalsOverview =
          data.verticalsOverview;
        if (verticalsOverview) {
          setContent(verticalsOverview);

          /* FIRST DATABASE VERTICAL ACTIVE*/
          const firstVertical =
            verticalsOverview.verticals?.[0];

          setActiveId(
            firstVertical?.id
          );
        } else {
          setContent(null);
          setActiveId(undefined);
        }
      } catch (error) {
        console.error(
          "Failed to load verticals overview content:",
          error
        );

        if (!isMounted) return;

        setContent(null);
        setActiveId(undefined);

      }
    };

    loadVerticals();

    return () => {
      isMounted = false;
    };
  }, []);

  /*DATABASE VERTICALS */
  const verticals =
    content?.verticals ?? [];

  /* EMPTY DATABASE STATE*/
  if (!content || verticals.length === 0) {
    return null;
  }

  return (
    <section className="2xxl:py-25 xl:py-17.5 md:py-12.5 sm:py-10 py-7.5 bg-light bg-cover">
      <div className="container mx-auto">

        {/* SECTION HEADING DATABASE ONLY*/}
        <div className="mb-7.5 text-center">

          <span className="text-primary font-semibold leading-5 uppercase text-lg inline-flex gap-1.25 items-center">
            {content.label}
          </span>

          <h2 className="2xxl:text-2xxl lg:text-[38px] sm:text-[32px] text-2xxl font-extrabold capitalize mb-0">
            {content.titleLine1}
            <br />
            {content.titleLine2}
          </h2>

        </div>

        {/* VERTICAL CARDS DATABASE ONLY */}

        <div
          className="
            grid
            grid-cols-1
            gap-[3px]
            sm:grid-cols-2
            xl:grid-cols-4
            items-start
            mx-auto
            max-w-[1320px]
          "
        >
          {verticals.map((vertical) => (
            <VerticalCard
              key={vertical.id}
              vertical={vertical}
              active={
                activeId === vertical.id
              }
              onActivate={() =>
                setActiveId(
                  vertical.id
                )
              }
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/*All card content comes from database:*/

function VerticalCard({
  vertical,
  active,
  onActivate,
}: {
  vertical: VerticalContent;
  active: boolean;
  onActivate: () => void;
}) {

  /*DATABASE IMAGE*/
  const imageUrl = vertical.image
    ? getMediaUrl(vertical.image)
    : "";

  /*DATABASE ROUTE*/
  const verticalHref =
    `/verticals/${vertical.slug}`;

  return (
    <div
      onClick={onActivate}
      className={`
        group
        relative
        flex
        h-[530px]
        xl:[&:nth-child(n+5)]:h-[430px]
        w-full
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        border-[#D9E4F2]
        shadow-[0_4px_16px_rgba(15,34,71,0.08)]
        transition-all
        duration-500
        cursor-pointer

        ${active
          ? "bg-[#1E4B9E]"
          : "bg-white"
        }
      `}
    >

      {/*DATABASE BACKGROUND IMAGE*/}
      {imageUrl && (
        <div
          className={`
            absolute
            inset-0
            z-0
            bg-cover
            bg-center
            bg-no-repeat
            transition-opacity
            duration-500

            ${active
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
            }
          `}
          style={{
            backgroundImage:
              `url(${imageUrl})`,
          }}
        />
      )}

      {/* BLUE OVERLAY DESIGN ONLY*/}
      <div
        className={`
          absolute
          inset-0
          z-0
          bg-[#1E4B9E]/85
          transition-opacity
          duration-500

          ${active
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
          }
        `}
      />

      {/*CARD CONTENT*/}
      <div className="relative z-10 flex h-full flex-col p-[30px]">

        {/*TITLE DATABASE ONLY*/}
        <Link
          href={verticalHref}
          onClick={(event) => {
            event.stopPropagation();
            onActivate();
          }}
          className={`
            block
            w-full
            text-[26px]
            font-extrabold
            leading-[1.3]
            transition-colors
            duration-300

            ${active
              ? "text-white"
              : "text-[#0F2247] group-hover:text-white"
            }
          `}
        >
          {vertical.title}
        </Link>

        {/*DESCRIPTION  DATABASE ONLY */}
        <p
          className={`
            mb-1
            mt-3
            line-clamp-2
            text-[16px]
            font-medium
            leading-[1.5]
            transition-colors
            duration-300

            ${active
              ? "text-white"
              : "text-[#5B7BAE] group-hover:text-white"
            }
          `}
        >
          {vertical.description}
        </p>

        {/* READ MORE UI LABEL*/}
        <Link
          href={verticalHref}
          onClick={(event) => {
            event.stopPropagation();
            onActivate();
          }}
          className={`
            mt-0
            w-fit
            text-[16px]
            font-extrabold
            transition-colors
            duration-300

            ${active
              ? "text-white"
              : "text-[#1E4B9E] group-hover:text-white"
            }
          `}
        >
          Read More
        </Link>

        {/* TAGS DATABASE ONLY*/}
        <ul className="mt-6 flex-1 space-y-3.5 overflow-hidden">

          {vertical.tags.map(
            (tag, index) => (
              <li
                key={`${vertical.id}-${tag}-${index}`}
                className={`
                  flex
                  items-start
                  gap-2.5
                  text-[16px]
                  leading-[1.4]
                  transition-colors
                  duration-300

                  ${active
                    ? "text-white"
                    : "text-[#5B6F92] group-hover:text-white"
                  }
                `}
              >

                {/* CHECK CIRCLE DESIGN ONLY */}
                <span
                  className={`
                    mt-[2px]
                    flex
                    h-[30px]
                    w-[30px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    duration-300

                    ${active
                      ? "bg-white"
                      : "bg-transparent group-hover:bg-white"
                    }
                  `}
                >
                  <Check
                    size={20}
                    strokeWidth={15}
                    className="text-[#1E4B9E]"
                  />
                </span>

                {/* TAG TEXT DATABASE ONLY*/}
                <span className="break-words">
                  {tag}
                </span>

              </li>
            )
          )}

        </ul>

      </div>
    </div>
  );
}