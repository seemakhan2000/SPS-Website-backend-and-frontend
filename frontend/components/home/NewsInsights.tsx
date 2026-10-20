
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
} from "@/lib/icons";

import {
  apiFetch,
  getMediaUrl,
} from "@/lib/api";

import type {
  HomeContent,
  NewsInsightsContent,
  NewsItemContent,
} from "@/types/cms";



//ANIMATION
const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: "easeOut" as const,
    },
  }),
};



//SHARED CARD BACKGROUND
function CardBg({
  item,
  className = "",
  withGradient = false,
  children,
}: {
  item: NewsItemContent;
  className?: string;
  withGradient?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-[#0a1e46] ${className}`}
    >
      {/* NEWS IMAGE FROM DATABASE*/}

      {item.image && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{
            backgroundImage: `url('${getMediaUrl(
              item.image
            )}')`,
          }}
        />
      )}

      {/*GRADIENT*/}
      {withGradient && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
      )}

      {!withGradient && item.image && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      )}

      {/*CONTENT */}
      <div className="relative z-10 flex h-full flex-col p-5 xl:p-7">
        {children}
      </div>
    </div>
  );
}

/*BADGE*/
function Badge({
  text,
}: {
  text?: string;
}) {
  if (!text) {
    return null;
  }

  return (
    <span className="absolute left-5 top-5 xl:left-7 xl:top-7 z-10 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0a1e46]">
      {text}
    </span>
  );
}

/*ARROW BUTTON*/
function ArrowIconBtn() {
  return (
    <span className="inline-flex size-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0a1e46] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
      <ArrowUpRight className="h-5 w-5" />
    </span>
  );
}
export default function NewsInsights() {

  /*STATE*/
  const [content, setContent] =
    useState<NewsInsightsContent | null>(
      null
    );


  /*LOAD NEWS & INSIGHTS FROM API*/
  useEffect(() => {
    const loadNewsInsights = async () => {
      try {
        console.log(
          "[NEWS FRONTEND] Loading News & Insights..."
        );

        const data =
          await apiFetch<HomeContent>(
            "/content/home"
          );

        console.log(
          "[NEWS FRONTEND] Home content:",
          data
        );

        console.log(
          "[NEWS FRONTEND] News Insights:",
          data.newsInsights
        );

        setContent(
          data.newsInsights ?? null
        );
      } catch (error) {
        console.error(
          "[NEWS FRONTEND] Failed to load News & Insights:",
          error
        );

        setContent(null);
      }
    };

    loadNewsInsights();
  }, []);




  //NO DATABASE DATA
  if (!content) {
    return (
      <section className="py-10 md:py-14 xl:py-20 2xl:py-24">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[#5a75a3]">
              News & Insights content not available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*DATABASE ITEMS*/
  const items = Array.isArray(
    content.items
  )
    ? content.items
    : [];

  //SAME DESIGN ORDER
  const main = items[0];
  const medium = items[1];
  const small = items[2];
  const comingSoon = items[3];

  /*NO NEWS ITEMS*/
  if (items.length === 0) {
    return (
      <section className="py-10 md:py-14 xl:py-20 2xl:py-24">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[#5a75a3]">
              No News & Insights items available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* UI */
  return (
    <section className="py-10 md:py-14 xl:py-20 2xl:py-24">
      <div className="container mx-auto px-4">

        {/* HEADING ROW*/}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">

          <div className="lg:w-7/12 md:w-2/3 w-full">
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold capitalize text-[#0a1e46]">
              {content.title}
            </h2>
          </div>

          <div className="hidden md:block">
            <Link
              href={content.viewAllLink}
              className="group inline-flex items-center rounded-2xl bg-blue-900 py-3 pl-6 pr-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
            >
              {content.viewAllText}

              <span className="ml-3 inline-flex size-11 min-w-11 items-center justify-center rounded-2xl bg-white text-[#0a1e46] transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>

        </div>

        {/*CARDS ROW */}
        <div className="flex flex-wrap gap-5 items-stretch">

          {/* MAIN BIG LEFT CARD*/}
          {main && (
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: true,
                amount: 0.3,
              }}
              className="w-full lg:w-[calc(33.333%-14px)]"
            >
              <CardBg
                item={main}
                className="h-[420px] xl:h-[650px]"
              >
                <Badge
                  text={main.badge}
                />

                <h3 className="mt-16 max-w-[85%] text-xl xl:text-2xl font-bold leading-snug text-white">
                  <Link href={main.href}>
                    {main.title}
                  </Link>
                </h3>

                <div className="mt-auto flex items-end justify-start">

                  {main.cta === "readMore" && (
                    <Link
                      href={main.href}
                      className="group/btn inline-flex items-center rounded-2xl bg-blue-600 py-3 pl-6 pr-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
                    >
                      Read More

                      <span className="ml-3 inline-flex size-9 items-center justify-center rounded-xl bg-white text-[#0a1e46] transition-transform duration-300 group-hover/btn:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  )}

                </div>
              </CardBg>
            </motion.div>
          )}

          {/*CENTER LARGE CARD*/}

          {medium && (
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: true,
                amount: 0.3,
              }}
              className="w-full lg:w-[calc(66.666%-42px)] xl:w-[calc(41.666%-16px)]"
            >
              <Link
                href={medium.href}
                className="block h-full"
              >
                <CardBg
                  item={medium}
                  withGradient
                  className="h-[420px] xl:h-[650px]"
                >
                  <Badge
                    text={medium.badge}
                  />

                  <div className="mt-auto flex items-end justify-between gap-5">

                    <h3 className="max-w-[80%] text-xl xl:text-2xl font-bold leading-snug text-white">
                      {medium.title}
                    </h3>

                    <ArrowIconBtn />

                  </div>
                </CardBg>
              </Link>
            </motion.div>
          )}

          {/* RIGHT COLUMN */}

          <div className="w-full xl:w-[calc(25%-20px)] flex flex-col gap-5">

            {/*SMALL CARD*/}

            {small && (
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                className="flex-1"
              >
                <Link
                  href={small.href}
                  className="block h-full"
                >
                  <CardBg
                    item={small}
                    withGradient
                    className="h-[260px]"
                  >
                    <Badge
                      text={small.badge}
                    />

                    <div className="mt-auto flex items-end justify-between gap-4">

                      <h3 className="max-w-[75%] text-lg xl:text-xl font-bold leading-snug text-white">
                        {small.title}
                      </h3>

                      <ArrowIconBtn />

                    </div>
                  </CardBg>
                </Link>
              </motion.div>
            )}

            {/*FOURTH CARD */}

            {comingSoon && (
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                className="flex-1"
              >
                <Link
                  href={comingSoon.href}
                  className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-3xl bg-[#0a1e46] p-5 xl:p-7"
                >
                  <Badge
                    text={comingSoon.badge}
                  />

                  <h3 className="text-lg xl:text-xl font-bold leading-snug text-white">
                    {comingSoon.title}
                  </h3>

                  <div className="mt-auto flex justify-end">
                    <ArrowIconBtn />
                  </div>
                </Link>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

