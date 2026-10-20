"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, } from "@/lib/icons";
import {
  apiFetch,
  getMediaUrl,
} from "@/lib/api";

import type {
  CustomersContent,
  HomeContent,
} from "@/types/cms";

export default function Customers() {
  const [content, setContent] =
    useState<CustomersContent | null>(null);

  /*LOAD CUSTOMER DATA FROM DATABASE*/
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data =
          await apiFetch<HomeContent>(
            "/content/home"
          );

        /* DATABASE DATA ONLY*/
        if (
          data?.customers &&
          typeof data.customers === "object"
        ) {
          setContent(data.customers);
        } else {
          setContent(null);
        }
      } catch (error) {
        console.error(
          "Failed to load Customers content:",
          error
        );

        setContent(null);
      }
    };

    loadCustomers();
  }, []);



  /*NO DATABASE DATA*/
  if (!content) {
    return (
      <section className="relative -mt-[260px] w-full min-h-[900px] overflow-hidden bg-[#08245c] text-white">
        <div className="flex min-h-[900px] items-center justify-center">
          <p className="text-white/60">
            Customers content is not available.
          </p>
        </div>
      </section>
    );
  }

  /*DATABASE CONTENT*/

  const testimonial =
    content.testimonial;

  const deployment =
    content.deployment;

  const impact =
    content.impact;

  /*SAFETY*/
  if (
    !testimonial ||
    !deployment ||
    !impact
  ) {
    return (
      <section className="relative -mt-[260px] w-full min-h-[900px] overflow-hidden bg-[#08245c] text-white">
        <div className="flex min-h-[900px] items-center justify-center">
          <p className="text-white/60">
            Customers content is incomplete in database.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative -mt-[260px] w-full min-h-[900px] overflow-hidden bg-[#08245c] text-white">

      {/*MAIN CONTAINER*/}

      <div
        className="
          relative mx-auto grid min-h-[700px] w-full max-w-[1400px]
          grid-cols-1
          lg:grid-cols-2
        "
      >

        {/*LEFT SIDE*/}
        <div
          className="
            relative min-h-[500px]
            overflow-visible
            lg:min-h-[700px]
          "
        >

          {/*AI IMAGE AREA*/}

          <div
            className="
              absolute left-1/2 top-[60px]
              h-[500px] w-[610px]
              -translate-x-1/2
              overflow-hidden

              sm:h-[550px]

              lg:left-[2%]
              lg:h-[700px]
              lg:w-[610px]
              lg:translate-x-0
            "
          >

            {/* Blue Glow */}

            <div
              className="
                absolute left-[45px] top-[45px]
                z-[1]
                h-[480px] w-[480px]
                rounded-full
                bg-[radial-gradient(circle,rgba(0,148,255,0.42)_0%,rgba(0,91,220,0.18)_42%,transparent_72%)]
                blur-[35px]
              "
            />

            {/* AI Image - DATABASE */}

            <Image
              src={getMediaUrl(
                content.mainImage
              )}
              alt="AI technology"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className="
                relative z-[2]
                object-cover
                object-center
                saturate-[1.15]
                contrast-[1.05]
              "
            />

            {/* Orbit One */}

            <div
              className="
                absolute left-[-25px] top-[45px]
                z-[3]
                h-[510px] w-[510px]
                rounded-full
                border border-[rgba(90,158,255,0.27)]
              "
            />

            {/* Orbit Two */}

            <div
              className="
                absolute left-[40px] top-[105px]
                z-[3]
                h-[390px] w-[390px]
                rotate-[-25deg]
                rounded-full
                border border-[rgba(90,158,255,0.27)]
              "
            />

            {/* Orbit dots */}

            <span
              className="
                absolute left-[120px] top-[358px]
                z-[5]
                h-[10px] w-[10px]
                rounded-full
                bg-[#2168ce]
                shadow-[0_0_14px_rgba(33,104,206,0.8)]
              "
            />

            <span
              className="
                absolute left-[555px] top-[108px]
                z-[5]
                h-[10px] w-[10px]
                rounded-full
                bg-[#2168ce]
                shadow-[0_0_14px_rgba(33,104,206,0.8)]
              "
            />

            <span
              className="
                absolute left-[54px] top-[398px]
                z-[5]
                h-[10px] w-[10px]
                rounded-full
                bg-[#2168ce]
                shadow-[0_0_14px_rgba(33,104,255,0.8)]
              "
            />

          </div>

          {/*TESTIMONIAL CARD*/}

          <div
            className="
              absolute
              right-[12px]
              top-[120px]
              z-20
              w-[275px]
              min-h-[153px]
              rounded-[24px]
              bg-white
              p-[17px] px-[19px]
              text-[#102d67]
              shadow-[0_18px_40px_rgba(0,0,0,0.15)]
              animate-float-soft

              sm:right-[20px]

              lg:right-[-4px]
              lg:top-[320px]
            "
          >

            {/* User */}

            <div className="flex items-center gap-[11px]">

              {/* Avatar */}

              <div className="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full">

                {testimonial.image ? (
                  <Image
                    src={getMediaUrl(
                      testimonial.image
                    )}
                    alt={testimonial.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#e5e7eb]" />
                )}

              </div>

              {/* User Info */}

              <div className="min-w-0">

                <h4 className="mb-[3px] font-sans text-[15px] font-bold text-[#102d67]">
                  {testimonial.name}
                </h4>

                {/* Stars */}

                <div
                  className="
                    flex
                    gap-[2px]
                    text-[17px]
                    leading-none
                    text-[#ff8a00]
                  "
                  aria-label={`${testimonial.rating} stars`}
                >

                  {Array.from({
                    length: Math.max(
                      0,
                      Math.min(
                        5,
                        testimonial.rating
                      )
                    ),
                  }).map(
                    (_, index) => (
                      <span key={index}>
                        ★
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* Testimonial */}

            <p className="mt-[13px] font-sans text-[12.5px] leading-[1.42] text-[#64769c]">
              {testimonial.message}
            </p>

          </div>

          {/*  DEPLOYMENT CARD*/}

          <div
            className="
              absolute
              bottom-[20px]
              left-[12px]
              z-20
              flex
              h-[70px]
              w-[calc(100%-24px)]
              min-w-0
              items-center
              rounded-[38px]
              bg-white
              px-[13px]
              py-[7px]
              shadow-[0_16px_35px_rgba(0,0,0,0.13)]
              animate-float-soft-delay

              sm:left-[20px]
              sm:w-auto
              sm:min-w-[300px]

              lg:bottom-[35px]
              lg:left-[82px]
              lg:min-w-[333px]
              lg:px-[18px]
              lg:py-[8px]
            "
          >

            {/* Avatars */}

            <div className="mr-3 flex items-center">

              {deployment.avatars.map(
                (avatar, index) => (

                  <div
                    key={avatar.id}
                    className="
                      relative
                      ml-[-7px]
                      h-[33px] w-[33px]
                      overflow-hidden
                      rounded-full
                      border-2 border-white
                      bg-[#ddd]

                      sm:h-[38px]
                      sm:w-[38px]
                    "
                    style={{
                      zIndex:
                        deployment.avatars.length -
                        index,
                    }}
                  >

                    {avatar.image ? (
                      <Image
                        src={getMediaUrl(
                          avatar.image
                        )}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#ddd]" />
                    )}

                  </div>

                )
              )}

            </div>

            {/* Deployment Text */}

            <div className="flex flex-col">

              <strong
                className="
                  font-sans
                  text-[16px]
                  font-extrabold
                  leading-[1.05]
                  text-[#2457a9]

                  sm:text-[18px]
                "
              >
                {deployment.number}
              </strong>

              <span
                className="
                  mt-[3px]
                  whitespace-nowrap
                  font-sans
                  text-[11px]
                  leading-none
                  text-[#7184a9]

                  sm:text-[13px]
                "
              >
                {deployment.text}
              </span>

            </div>

          </div>

        </div>

        {/*RIGHT SIDE*/}

        <div
          className="
            relative
            min-h-[700px]
            px-[15px]
            pb-[45px]
            pt-[38px]

            lg:px-[25px]
            lg:pb-[40px]
            lg:pl-0
            lg:pt-[30px]
          "
        >

          {/* HEADING */}

          <div className="relative z-10 ml-0 pt-[80px] lg:ml-[8px] lg:pt-[70px]">

            <h2
              className="
                m-0
                font-sans
                text-[34px]
                font-extrabold
                leading-[1.16]
                tracking-[-1px]
                text-white

                sm:text-[39px]

                lg:text-[clamp(40px,4vw,47px)]
                lg:leading-[1.24]
                lg:tracking-[-1.4px]
              "
            >

              {content.headingLine1}

              <br />

              {content.headingLine2}

              <br />

              {content.headingLine3}

            </h2>

          </div>

          {/* FEATURE CARD */}

          <div
            className="
              relative
              mt-[35px]
              flex
              w-full
              flex-col
              overflow-hidden
              rounded-[25px]
              bg-white
              text-[#09275f]
              shadow-[0_18px_45px_rgba(0,0,0,0.08)]

              lg:absolute
              lg:top-[320px]
              lg:left-[8px]
              lg:right-[118px]
              lg:mt-0
              lg:grid
              lg:h-[390px]
              lg:grid-cols-[240px_1fr]
              lg:rounded-[30px]
            "
          >

            {/* EMPLOYEE PROFILE */}

            <div
              className="
                flex
                h-[130px]
                flex-row
                bg-white

                lg:h-full
                lg:flex-col
              "
            >

              {/* Employee Image */}

              <div
                className="
                  relative
                  h-[130px]
                  w-[130px]
                  shrink-0
                  overflow-hidden

                  lg:h-[310px]
                  lg:w-full
                "
              >

                {impact.image ? (
                  <Image
                    src={getMediaUrl(
                      impact.image
                    )}
                    alt={impact.name}
                    fill
                    sizes="280px"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full bg-[#e5e7eb]" />
                )}

              </div>

              {/* Employee Info */}

              <div
                className="
                  flex
                  flex-1
                  flex-col
                  justify-center
                  bg-[#e9f4fc]
                  px-[15px]

                  lg:h-[80px]
                  lg:flex-none
                  lg:px-[14px]
                "
              >

                <h3
                  className="
                    m-0
                    font-sans
                    text-[16px]
                    font-extrabold
                    leading-[1.1]
                    text-[#08265d]

                    lg:text-[17px]
                  "
                >
                  {impact.name}
                </h3>

                <p
                  className="
                    mt-[6px]
                    m-0
                    font-sans
                    text-[13px]
                    leading-none
                    text-[#2861ba]
                  "
                >
                  {impact.role}
                </p>

              </div>

            </div>

            {/* IMPACT TEXT */}

            <div
              className="
                relative
                min-h-[270px]
                overflow-hidden
                px-[22px]
                py-[28px]

                lg:min-h-0
                lg:px-[30px]
                lg:pb-[35px]
                lg:pt-[50px]
              "
            >

              {/* Heading */}

              <h3
                className="
                  relative
                  z-10
                  m-0
                  mb-[12px]
                  whitespace-pre-line
                  font-sans
                  text-[19px]
                  font-bold
                  leading-[1.35]
                  text-[#00255d]

                  lg:text-[21px]
                "
              >
                {impact.title}
              </h3>

              {/* Description */}

              <p
                className="
                  relative
                  z-10
                  m-0
                  max-w-full
                  font-sans
                  text-[14px]
                  leading-[1.65]
                  text-[#0a316d]

                  lg:max-w-[270px]
                  lg:text-[16px]
                  lg:leading-[1.7]
                "
              >
                {impact.description}
              </p>

              {/* Decorative Circles */}

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[-43px]
                  right-[-15px]
                  h-[155px]
                  w-[155px]
                  opacity-55
                "
              >

                <div
                  className="
                    absolute
                    left-[30px]
                    top-[15px]
                    h-[92px]
                    w-[92px]
                    rounded-full
                    border-[4px]
                    border-[#dfe8f0]
                  "
                />

                <div
                  className="
                    absolute
                    left-[58px]
                    top-[52px]
                    h-[78px]
                    w-[78px]
                    rounded-full
                    border-[4px]
                    border-[#dfe8f0]
                  "
                />

                <div
                  className="
                    absolute
                    left-0
                    top-[58px]
                    h-[48px]
                    w-[48px]
                    rounded-full
                    border-[4px]
                    border-[#dfe8f0]
                  "
                />

              </div>

            </div>

          </div>

          {/* ARROW */}

          <button
            type="button"
            aria-label="Next impact"
            className="
              absolute
              hidden
              items-center
              justify-center
              border-0
              bg-transparent
              p-0
              text-white/30
              transition-all
              duration-300
              hover:translate-x-[5px]
              hover:text-white/75

              lg:right-[24px]
              lg:bottom-[164px]
              lg:flex
              lg:h-[54px]
              lg:w-[54px]
            "
          >

            <ArrowRight
              size={38}
              strokeWidth={1.5}
            />

          </button>

        </div>

      </div>

{/* Orbit */}
      <div className="absolute left-[300px] top-0 h-full w-full">

        {/* Orbit One */}
        <div
          className="
      animate-orbit-spin-one
      absolute left-[-25px] top-[45px]
      z-[3]
      h-[510px] w-[510px]
      rounded-full
      border border-[rgba(90,158,255,0.27)]
    "
        >
          <span
            className="
        absolute
        z-[5]
        h-[10px] w-[10px]
        -translate-x-1/2 -translate-y-1/2
        rounded-full
        bg-[#2168ce]
        shadow-[0_0_14px_rgba(33,104,206,0.8)]
      "
            style={{ top: "18%", left: "96%" }}
          />
        </div>

        {/* Orbit Two */}
        <div
          className="
      animate-orbit-spin-two
      absolute left-[40px] top-[105px]
      z-[3]
      h-[390px] w-[390px]
      rotate-[-25deg]
      rounded-full
      border border-[rgba(90,158,255,0.27)]
    "
        >
          <span
            className="
        absolute
        z-[5]
        h-[10px] w-[10px]
        -translate-x-1/2 -translate-y-1/2
        rounded-full
        bg-[#2168ce]
        shadow-[0_0_14px_rgba(33,104,206,0.8)]
      "
            style={{ top: "72%", left: "6%" }}
          />
          <span
            className="
        absolute
        z-[5]
        h-[10px] w-[10px]
        -translate-x-1/2 -translate-y-1/2
        rounded-full
        bg-[#2168ce]
        shadow-[0_0_14px_rgba(33,104,255,0.8)]
      "
            style={{ top: "90%", left: "14%" }}
          />
        </div>

      </div>
    </section>
  );
}