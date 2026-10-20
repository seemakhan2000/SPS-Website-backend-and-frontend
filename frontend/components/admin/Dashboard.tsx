
"use client";

import Link from "next/link";

interface DashboardProps {
  startupCount?: number;
  serviceCategoryCount?: number;
}

export default function Dashboard({
  startupCount,
  serviceCategoryCount,
}: DashboardProps) {
  return (
    <div>
      {/*DASHBOARD HEADING*/}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0a1f4e]">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your SPS Enterprise website content.
        </p>
      </div>

      {/*DASHBOARD CARDS*/}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* HERO SECTION*/}

        <Link
          href="/admin?section=hero"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Hero Section
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage homepage hero slides and content.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

        {/* ABOUT US*/}

        <Link
          href="/admin?section=about"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            About Us
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage About Us text and images.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

        {/*  SERVICES OVERVIEW*/}

        <Link
          href="/admin?section=services"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Services Overview
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage service categories and service cards.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

        {/*STARTUPS*/}

        <Link
          href="/admin?section=startups"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Startups
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage startup names, descriptions, logos and display order.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

        {/* PRODUCTS */}

        <Link
          href="/admin?section=products"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Products
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage products text and images.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

        {/* 
            CUSTOMERS
        = */}

        <Link
          href="/admin?section=customers"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Customers
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage customers text and images.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

        {/* HOW IT WORKS*/}

        <Link
          href="/admin?section=howitworks"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            How It Works
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage How It Works content, steps and images.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

        {/*TECHNOLOGY PARTNERS*/}

        <Link
          href="/admin?section=technologyPartners"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Technology Partners
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage technology partner names, logos, taglines and links.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>


        {/*HIGHLIGHT*/}

        <Link
          href="/admin?section=highlights"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Highlights
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage Highlights section text and background image.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>


        {/* CLIENTS MARQUEE*/}

        <Link
          href="/admin?section=clients"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Customers Marquee
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage customer names, logos and marquee display.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>


        {/* NEWS & INSIGHTS*/}

        <Link
          href="/admin?section=news"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            News & Insights
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage news titles, badges, images, links and card styles.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>


        {/* VERTICALS OVERVIEW*/}

        <Link
          href="/admin?section=verticals"
          className="
            group
            block
            cursor-pointer
            rounded-2xl
            border
            border-transparent
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-1.5
            hover:border-[#1E4B9E]/20
            hover:shadow-xl
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#0a1f4e]
              transition-colors
              duration-300
              group-hover:text-[#1E4B9E]
            "
          >
            Verticals Overview
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage industry verticals, descriptions, tags and images.
          </p>

          <div
            className="
              mt-5
              h-1
              w-0
              rounded-full
              bg-[#1E4B9E]
              transition-all
              duration-300
              group-hover:w-12
            "
          />
        </Link>

      </div>
    </div>
  );
}

