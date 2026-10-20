
"use client";

import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { apiFetch, getMediaUrl } from "@/lib/api";

import type {
  HomeContent,
  TechnologyPartnersContent,
} from "@/types/cms";

export default function TechnologyPartners() {
  const [content, setContent] =
    useState<TechnologyPartnersContent | null>(null);

  // LOAD DATA FROM DATABASE
  useEffect(() => {
    const loadTechnologyPartners = async () => {
      try {
        const data =
          await apiFetch<HomeContent>(
            "/content/home"
          );

        setContent(
          data.technologyPartners
        );
      } catch (error) {
        console.error(
          "Failed to load Technology Partners content:",
          error
        );

        setContent(null);
      }
    };

    loadTechnologyPartners();
  }, []);




  // NO DATABASE DATA
  if (
    !content ||
    !content.partners ||
    content.partners.length === 0
  ) {
    return null;
  }


  // DB DATA
  const title = content.title || "";

  const description =
    content.description || "";

  const partners = content.partners;

  return (
    <section className="2xxl:py-25 xl:py-25 sm:py-10 py-7.5 bg-[#EAF2FC] overflow-hidden">
      <div className="container">

        <div className="row g-0 flex flex-col xl:flex-row items-center xl:items-center gap-10 xl:gap-10">

          {/* LEFT CONTENT*/}
          <div className="xl:w-1/4 2lg:w-1/4 shrink-0 text-left">

            <div className="sm:mb-7.5">

              <h2 className="xl:text-[55px] text-[32px] font-extrabold capitalize text-left text-[#0A1F44] leading-[1.1] ml-5">
                {title}
              </h2>

              <p className="sm:text-lg ml-5 text-base leading-[1.6] mb-0 text-left text-[#5B6B8C] mt-4">
                {description}
              </p>

            </div>

          </div>

          {/* RIGHT SWIPER*/}

          <div className="lg:w-3/4 2xl:w-3/4 w-full flex-1 min-w-0">

            <Swiper
              modules={[Autoplay]}
              loop
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={4500}
              slidesPerView="auto"
              spaceBetween={20}
              allowTouchMove
              className="awards-swiper xl:!ml-12.5 xl:!-mr-87.5 -mr-30 max-xl:mt-7.5"
            >

              {partners.map((partner) => (
                <SwiperSlide
                  key={partner.id}
                  style={{
                    width: "233.33px",
                  }}
                >

                  {/* FIXED HEIGHT WRAPPER*/}

                  <div className="partner-card-wrapper">

                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="partner-card flex flex-col justify-center bg-white sm:rounded-xxl rounded-lg md:py-11.25 md:px-8.75 py-8.75 px-6.25 gap-3 items-center text-center dz-img-box shadow-[0_10px_30px_rgba(15,40,90,0.08)]"
                    >

                      {/*PARTNER IMAGE*/}
                      <div className="flex justify-center sm:w-37.5 w-30 relative overflow-hidden">
                        <img
                          loading="lazy"
                          src={getMediaUrl(
                            partner.image
                          )}
                          alt={`${partner.name} Partner`}
                          className="w-full h-full"
                        />

                      </div>

                      {/* PARTNER CONTENT*/}

                      <div className="dz-content">

                        <h3 className="md:text-2xl text-xl mb-1.25 font-bold text-[#0A1F44]">
                          {partner.name}
                        </h3>

                        <p className="md:text-base text-sm mb-2 font-medium text-[#5B6B8C]">
                          {partner.tagline}
                        </p>

                        <span className="md:text-sm text-2xs text-[#2F6FED] font-medium">
                          Learn More
                        </span>

                      </div>

                    </a>

                  </div>

                </SwiperSlide>
              ))}

            </Swiper>

          </div>

        </div>

      </div>
      <style jsx global>{`
        /* Space reserved for the bigger card */
        .awards-swiper .partner-card-wrapper {
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Normal cards */
        .awards-swiper .partner-card {
          width: 233.33px;
          height: 280px;
          transition:
            width 0.5s ease,
            height 0.5s ease,
            box-shadow 0.5s ease;
        }

        /* Active card becomes bigger */
        .awards-swiper .swiper-slide-active .partner-card {
          width: 400px;
          height: 500px;
          box-shadow: 0 18px 40px rgba(15, 40, 90, 0.16);
        }
      `}</style>

    </section>
  );
}

