"use client";

import { useEffect, useState } from "react";

import {
  ShieldCheck,
  Cloud,
  GitBranch,
  CloudUpload,
  Bot,
  Brain,
  Users,
  GraduationCap,
  CalendarDays,
  Server,
  Shield,
  UserCog,
  Bug,
} from "@/lib/icons";

import type { IconType } from "@/lib/icons";

import type {
  HomeContent,
  ServicesOverviewContent,
} from "@/types/cms";

import { apiFetch } from "@/lib/api";


/* SERVICES CARD TYPE                                                         */
type ServicesOverviewCard = {
  id?: number;
  slug: string;
  title: string;
  description: string;
  href: string;
  sortOrder?: number;
  icon?: IconType;
};

const categoryIcons = {
  cybersecurity: ShieldCheck,
  cloud: Cloud,
  "ai-automation": Bot,
  collaboration: Users,
};

const cardIcons = {
  smaas: Server,
  grc: Shield,
  "identity-access": UserCog,
  "threat-management": Bug,

  devops: GitBranch,
  "migration-services": CloudUpload,

  automation: Bot,
  "data-science": Brain,

  learning: GraduationCap,
  events: CalendarDays,
};


/* SERVICE CARD*/
function ServiceCard({
  card,
  isActive,
  onActivate,
}: {
  card: ServicesOverviewCard;
  isActive: boolean;
  onActivate: () => void;
}) {
  const Icon = card.icon;

  return (
    <div
      className={`
        group relative mx-auto flex
        min-h-[480px]
        w-full max-w-[400px]
        cursor-pointer
        flex-col justify-between
        rounded-[24px]
        p-[30px]
        shadow-none
        transition-all duration-300 ease-in-out
        ${isActive
          ? "bg-[#1E4B9E]"
          : "bg-[#EAF2FB] hover:bg-[#1E4B9E]"
        }
      `}
      onMouseEnter={onActivate}
    >

      {/* CARD CONTENT */}
      <div className="text-left">
        {/* STATIC CARD ICON */}
        {Icon && (
          <Icon
            className={`
              mb-7
              h-[48px]
              w-[48px]
              transition-colors
              duration-300
              ${isActive
                ? "text-white"
                : "text-[#1E4B9E] group-hover:text-white"
              }
            `}
            strokeWidth={3.8}
          />
        )}

        {/* DB CARD TITLE */}
        <h3
          className={`
            mb-3
            text-[30px]
            font-semibold
            leading-[1.35]
            transition-colors
            duration-300
            ${isActive
              ? "text-white"
              : "text-[#0F2247] group-hover:text-white"
            }
          `}
        >
          {card.title}
        </h3>

        {/* DB CARD DESCRIPTION */}
        <p
          className={`
            text-[20px]
            font-normal
            leading-[1.45]
            transition-colors
            duration-300
            ${isActive
              ? "text-white/85"
              : "text-[#5B7BAE] group-hover:text-white/85"
            }
          `}
        >
          {card.description}
        </p>
      </div>

      {/* CARD LINK*/}
      <div
        className={`
          mt-8
          border-t
          border-dashed
          pt-4
          text-center
          transition-colors
          duration-300
          ${isActive
            ? "border-white/30"
            : "border-[#1E4B9E]/20 group-hover:border-white/30"
          }
        `}
      >
        <a
          href={card.href}
          className={`
            flex
            items-center
            justify-start
            gap-2
            text-[20px]
            font-bold
            transition-colors
            duration-300
            ${isActive
              ? "text-white"
              : "text-[#0F2247] group-hover:text-white"
            }
          `}
        >
          <span
            className={`
              h-[7px]
              w-[7px]
              rounded-full
              transition-colors
              duration-300
              ${isActive
                ? "bg-white"
                : "bg-[#1E4B9E] group-hover:bg-white"
              }
            `}
          />

          Read More
        </a>
      </div>


      {/* ARROW BUTTON*/}
      <div
        className={`
          absolute
          bottom-0
          right-0
          flex
          h-[49px]
          w-[49px]
          items-center
          justify-center
          rounded-full
          ring-[12px]
          ring-white
          ${isActive
            ? "bg-[#0a2a5e]"
            : "bg-[#285db5] group-hover:bg-[#0a2a5e]"
          }
        `}
      >
        <span className="text-[25px] font-light leading-none text-white">
          ↗
        </span>
      </div>
    </div>
  );
}


/* SERVICES OVERVIEW*/
export default function ServicesOverview() {

  /* DATABASE CONTENT*/
  const [content, setContent] =
    useState<ServicesOverviewContent | null>(null);

  const [activeSlug, setActiveSlug] =
    useState<string>("");

  const [activeCardId, setActiveCardId] =
    useState<string | null>(null);


  /* LOAD SERVICES FROM DATABASE*/
  useEffect(() => {
    let isMounted = true;

    const loadServicesOverview = async () => {
      try {
        const data =
          await apiFetch<HomeContent>(
            "/content/home"
          );

        if (!isMounted) return;

        const servicesOverview =
          data.servicesOverview;


        /* DATABASE CONTENT ONLY*/
        if (
          servicesOverview &&
          Array.isArray(
            servicesOverview.categories
          ) &&
          servicesOverview.categories.length > 0
        ) {
          setContent(
            servicesOverview
          );

          /* FIRST CATEGORY FROM DATABASE */
          setActiveSlug(
            servicesOverview.categories[0].slug
          );

          /* RESET ACTIVE CARD */
          setActiveCardId(null);
        } else {
          /* NO DATABASE DATA */
          setContent(null);
          setActiveSlug("");
          setActiveCardId(null);
        }
      } catch (error) {
        console.error(
          "Failed to load Services Overview:",
          error
        );

        if (!isMounted) return;

        setContent(null);
        setActiveSlug("");
        setActiveCardId(null);
      }
    };

    loadServicesOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories =
    content?.categories &&
      Array.isArray(content.categories)
      ? content.categories.map(
        (dbCategory) => {
          const categoryIcon =
            categoryIcons[
            dbCategory.slug as keyof typeof categoryIcons
            ];

          return {
            /* ALL CATEGORY DATA FROM DATABASE */
            ...dbCategory,

            /* STATIC ICON ONLY */
            icon: categoryIcon,

            /* ALL CARDS FROM DATABASE */
            cards:
              Array.isArray(
                dbCategory.cards
              )
                ? dbCategory.cards.map(
                  (dbCard) => {
                    const cardIcon =
                      cardIcons[
                      dbCard.slug as keyof typeof cardIcons
                      ];

                    return {
                      /* ALL CARD DATA FROM DATABASE */
                      ...dbCard,

                      /* STATIC ICON ONLY */
                      icon: cardIcon,
                    };
                  }
                )
                : [],
          };
        }
      )
      : [];


  /* ACTIVE CATEGORY */
  const activeCategory =
    categories.find(
      (category) =>
        category.slug ===
        activeSlug
    ) ?? null;


  /* CARD HOVER */
  const handleCardActivate = (
    cardId: string
  ) => {
    setActiveCardId(cardId);
  };


  /* NO DATABASE DATA*/
  if (
    !content ||
    categories.length === 0 ||
    !activeCategory
  ) {
    return null;
  }

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-[1420px]">


        {/* CATEGORY BUTTONS*/}
        <div
          className="
            mb-5
            flex
            flex-wrap
            items-center
            justify-center
            gap-1.5
          "
        >
          {categories.map(
            (category) => {
              /* STATIC CATEGORY ICON */
              const Icon =
                category.icon;

              const isActive =
                category.slug ===
                activeSlug;

              return (
                <button
                  key={
                    category.slug
                  }
                  type="button"
                  onClick={() => {
                    setActiveSlug(
                      category.slug
                    );

                    /* RESET CARD WHEN CATEGORY CHANGES */
                    setActiveCardId(null);
                  }}
                  className={`
                    flex
                    h-[46px]
                    items-center
                    gap-2
                    rounded-[12px]
                    border
                    px-5
                    text-[16px]
                    font-bold
                    transition-all
                    duration-300
                    ${isActive
                      ? "border-[#1E4B9E] bg-[#1E4B9E] text-white"
                      : "border-[#1E4B9E] bg-white text-[#0F2247] hover:bg-[#EAF2FB]"
                    }
                  `}
                >
                  {/* STATIC CATEGORY ICON */}
                  {Icon && (
                    <Icon
                      className="
                        h-[19px]
                        w-[19px]
                      "
                      strokeWidth={2}
                    />
                  )}

                  {/* DB CATEGORY LABEL */}
                  {category.label}
                </button>
              );
            }
          )}
        </div>


        {/* DB CATEGORY DESCRIPTION*/}
        <p
          className="
            mx-auto
            mb-8
            max-w-[1050px]
            text-center
            text-[18px]
            font-normal
            leading-[1.45]
            text-[#45679E]
          "
        >
          {activeCategory.description}
        </p>


        {/* DB SERVICE CARDS*/}
        <div
          className="
            grid
            grid-cols-1
            justify-items-center
            gap-x-8
            gap-y-8
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {Array.isArray(
            activeCategory.cards
          ) &&
            activeCategory.cards.map(
              (card) => (
                <ServiceCard
                  key={card.slug}
                  card={{
                    id: card.id,
                    slug: card.slug,
                    title: card.title,
                    description:
                      card.description,
                    href: card.href,
                    sortOrder:
                      card.sortOrder,
                    icon: card.icon,
                  }}
                  isActive={
                    activeCardId ===
                    card.slug
                  }
                  onActivate={() =>
                    handleCardActivate(
                      card.slug
                    )
                  }
                />
              )
            )}
        </div>
      </div>
    </section>
  );
}