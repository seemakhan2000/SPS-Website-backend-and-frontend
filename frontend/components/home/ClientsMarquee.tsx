
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import { apiFetch, getMediaUrl } from "@/lib/api";

import type {
  ClientLogoContent,
  ClientsMarqueeContent,
  HomeContent,
} from "@/types/cms";

import "swiper/css";
import "swiper/css/free-mode";

export default function ClientsMarquee() {
  const [content, setContent] =
    useState<ClientsMarqueeContent | null>(null);

  useEffect(() => {
    const loadClientsMarquee = async () => {
      try {
        const data = await apiFetch<HomeContent>(
          "/content/home"
        );

        console.log(
          "CLIENTS MARQUEE DB DATA:",
          data.clientsMarquee
        );

        if (
          data.clientsMarquee &&
          Array.isArray(data.clientsMarquee.clients)
        ) {
          setContent({
            title: data.clientsMarquee.title || "",
            clients: data.clientsMarquee.clients,
          });
        } else {
          console.log(
            "CLIENTS MARQUEE: No DB data found."
          );

          setContent(null);
        }
      } catch (error) {
        console.error(
          "CLIENTS MARQUEE LOAD ERROR:",
          error
        );

        setContent(null);
      }
    };

    loadClientsMarquee();
  }, []);

  if (
    !content ||
    !Array.isArray(content.clients) ||
    content.clients.length === 0
  ) {
    return null;
  }

  return (
    <section className="bg-[#eaf3fc] py-10 sm:py-16 2xl:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row xl:items-center gap-8 xl:gap-6">

          {/* LEFT TITLE */}
          <div className="xl:w-1/3 shrink-0">
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold capitalize leading-tight text-[#0a1e46]">
              {content.title}
            </h2>
          </div>

          {/* RIGHT MARQUEE */}
          <div className="xl:w-2/3 w-full relative">

            {/* LEFT GRADIENT */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-[#eaf3fc] to-transparent" />

            {/* RIGHT GRADIENT */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-[#eaf3fc] to-transparent" />

            <Swiper
              modules={[
                Autoplay,
                FreeMode,
              ]}
              slidesPerView="auto"
              spaceBetween={30}
              loop
              freeMode
              speed={4000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              allowTouchMove
              className="!py-2"
            >
              {content.clients.map(
                (
                  client: ClientLogoContent,
                  index
                ) => {
                  const imageUrl =
                    getMediaUrl(
                      client.logo
                    );

                  console.log(
                    `CLIENT ${index + 1}:`,
                    {
                      name: client.name,
                      logo: client.logo,
                      imageUrl,
                    }
                  );

                  return (
                    <SwiperSlide
                      key={
                        client.id ??
                        `${client.name}-${index}`
                      }
                      style={{
                        width: "120px",
                      }}
                      className="!flex items-center justify-center"
                    >
                      <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center shrink-0 p-3 transition-transform duration-300 hover:scale-105 hover:shadow-lg">

                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={
                              client.alt ||
                              client.name ||
                              "Customer logo"
                            }
                            width={96}
                            height={96}
                            className="max-w-full max-h-full object-contain"
                            unoptimized={
                              imageUrl.startsWith(
                                "http://"
                              ) ||
                              imageUrl.startsWith(
                                "https://"
                              )
                            }
                          />
                        ) : (
                          <span className="text-xs text-gray-400 text-center">
                            No Logo
                          </span>
                        )}

                      </div>
                    </SwiperSlide>
                  );
                }
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

